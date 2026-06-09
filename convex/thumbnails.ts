/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function getAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (!user) throw new Error("User not found. Call users.ensureCurrentUser first.");
  return user;
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
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
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    const now = Date.now();
    return await ctx.db.insert("thumbnailProjects", {
      userId: user._id,
      title: args.title,
      description: args.description,
      channelName: args.channelName,
      keywords: args.keywords,
      style: args.style,
      trendPrompt: args.trendPrompt,
      status: "queued",
      variations: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});
