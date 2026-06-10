/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeBillingIdentity } from "../src/lib/billing";
import { resolveGenerationQuota, resolveUsageAfterRefund } from "../src/lib/usage";

async function getIdentity(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
}

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await getIdentity(ctx);
    const now = Date.now();
    const clerkUserId = identity.subject;
    const email = (identity.email ?? `${clerkUserId}@clerk.local`).toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    const existingByEmail = existing
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_email", (q: any) => q.eq("email", email))
          .unique();

    const existingUser = existing ?? existingByEmail;
    if (existingUser) {
      const user = existingUser;
      await ctx.db.patch(user._id, { clerkUserId, email, name: identity.name as string | undefined, updatedAt: now });
      return user._id;
    }

    return await ctx.db.insert("users", {
      clerkUserId,
      email,
      name: identity.name as string | undefined,
      plan: "free",
      thumbnailsThisMonth: 0,
      lastUsageReset: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
      .unique();
  },
});

export const updateBilling = mutation({
  args: {
    email: v.optional(v.string()),
    clerkUserId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("basic"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const identity = normalizeBillingIdentity(args);
    if (!identity.email) return null;
    const userByClerk = identity.clerkUserId
      ? await ctx.db.query("users").withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.clerkUserId)).unique()
      : null;
    const userByStripe =
      !userByClerk && identity.stripeCustomerId
        ? await ctx.db.query("users").withIndex("by_stripe_customer_id", (q: any) => q.eq("stripeCustomerId", identity.stripeCustomerId)).unique()
        : null;
    const userByEmail =
      !userByClerk && !userByStripe
        ? await ctx.db.query("users").withIndex("by_email", (q: any) => q.eq("email", identity.email)).unique()
        : null;
    const user = userByClerk ?? userByStripe ?? userByEmail;
    const now = Date.now();
    if (!user) {
      return await ctx.db.insert("users", {
        clerkUserId: identity.clerkUserId ?? (identity.stripeCustomerId ? `stripe:${identity.stripeCustomerId}` : `email:${identity.email}`),
        email: identity.email,
        plan: args.plan,
        thumbnailsThisMonth: 0,
        lastUsageReset: now,
        stripeCustomerId: identity.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripeSubscriptionStatus: args.stripeSubscriptionStatus,
        stripePriceId: args.stripePriceId,
        createdAt: now,
        updatedAt: now,
      });
    }
    await ctx.db.patch(user._id, {
      email: identity.email,
      clerkUserId: identity.clerkUserId ?? user.clerkUserId,
      stripeCustomerId: identity.stripeCustomerId ?? user.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeSubscriptionStatus: args.stripeSubscriptionStatus,
      stripePriceId: args.stripePriceId,
      plan: args.plan,
      updatedAt: now,
    });
    return user._id;
  },
});

export const hasProcessedStripeEvent = query({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .withIndex("by_event_id", (q: any) => q.eq("eventId", args.eventId))
      .unique();
    return Boolean(existing);
  },
});

export const recordProcessedStripeEvent = mutation({
  args: {
    eventId: v.string(),
    type: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .withIndex("by_event_id", (q: any) => q.eq("eventId", args.eventId))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("stripeEvents", {
      eventId: args.eventId,
      type: args.type,
      createdAt: args.createdAt,
      processedAt: Date.now(),
    });
  },
});

export const reserveGenerationQuota = mutation({
  args: {
    requestedVariations: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    const now = Date.now();
    const clerkUserId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();
    const email = (identity.email ?? `${clerkUserId}@clerk.local`).toLowerCase();
    const existingByEmail = existing
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_email", (q: any) => q.eq("email", email))
          .unique();
    const user =
      existing ??
      existingByEmail ??
      (await ctx.db.get(
        await ctx.db.insert("users", {
          clerkUserId,
          email,
          name: identity.name as string | undefined,
          plan: "free",
          thumbnailsThisMonth: 0,
          lastUsageReset: now,
          createdAt: now,
          updatedAt: now,
        }),
      ));
    if (!user) throw new Error("Unable to reserve generation quota");

    const quota = resolveGenerationQuota({
      plan: user.plan,
      requestedVariations: args.requestedVariations,
      thumbnailsThisMonth: user.thumbnailsThisMonth,
      lastUsageReset: user.lastUsageReset,
      now,
    });

    if (quota.quotaExceeded) {
      return {
        ok: false,
        error: "quota_exceeded",
        plan: user.plan,
        allowedVariations: 0,
        remaining: quota.remainingBeforeReservation ?? 0,
        resetAt: quota.resetAt,
      };
    }

    await ctx.db.patch(user._id, {
      clerkUserId,
      email,
      name: identity.name as string | undefined,
      thumbnailsThisMonth: quota.nextUsageCount,
      lastUsageReset: quota.resetUsage ? quota.resetAt : user.lastUsageReset,
      updatedAt: now,
    });

    return {
      ok: true,
      plan: user.plan,
      allowedVariations: quota.allowedVariations,
      remaining: quota.remainingAfterReservation,
      resetAt: quota.resetAt,
    };
  },
});

export const refundGenerationQuota = mutation({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) return { ok: false, error: "user_not_found" };

    const thumbnailsThisMonth = resolveUsageAfterRefund({
      thumbnailsThisMonth: user.thumbnailsThisMonth,
      refundAmount: args.amount,
    });
    await ctx.db.patch(user._id, { thumbnailsThisMonth, updatedAt: Date.now() });
    return { ok: true, thumbnailsThisMonth };
  },
});
