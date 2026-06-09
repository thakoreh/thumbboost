/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function findAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
}

async function getOrCreateAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (existing) return existing;
  const now = Date.now();
  const id = await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email: (identity.email ?? `${identity.subject}@clerk.local`).toLowerCase(),
    name: identity.name as string | undefined,
    plan: "free",
    thumbnailsThisMonth: 0,
    lastUsageReset: now,
    createdAt: now,
    updatedAt: now,
  });
  return await ctx.db.get(id);
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await findAuthedUser(ctx);
    if (!user) return [];
    return await ctx.db.query("thumbnailProjects").withIndex("by_user", (q: any) => q.eq("userId", user._id)).order("desc").take(50);
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    channelName: v.optional(v.string()),
    keywords: v.array(v.string()),
    style: v.optional(v.string()),
    trendPrompt: v.optional(v.string()),
    variations: v.optional(v.array(v.object({
      id: v.string(),
      imageUrl: v.optional(v.string()),
      title: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      palette: v.array(v.string()),
      score: v.number(),
      style: v.string(),
      accent: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const user = await getOrCreateAuthedUser(ctx);
    if (!user) throw new Error("Unable to create user");
    const now = Date.now();
    const watermarked = user.plan === "free";
    const variationPayload = (args.variations ?? []).slice(0, 6).map((variation: any) => ({
      id: variation.id,
      imageUrl: variation.imageUrl ?? "",
      prompt: `${variation.title ?? args.title} — ${variation.subtitle ?? args.channelName ?? "creator packaging"}`,
      score: variation.score,
      watermarked,
    }));
    await ctx.db.patch(user._id, { thumbnailsThisMonth: user.thumbnailsThisMonth + variationPayload.length, updatedAt: now });
    return await ctx.db.insert("thumbnailProjects", {
      userId: user._id,
      title: args.title,
      description: args.description,
      channelName: args.channelName,
      keywords: args.keywords,
      style: args.style,
      trendPrompt: args.trendPrompt,
      status: "ready",
      variations: variationPayload,
      createdAt: now,
      updatedAt: now,
    });
  },
});
