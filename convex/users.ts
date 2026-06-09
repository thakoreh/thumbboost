/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";

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
    const email = identity.email ?? `${clerkUserId}@clerk.local`;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { email, name: identity.name as string | undefined, updatedAt: now });
      return existing._id;
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
