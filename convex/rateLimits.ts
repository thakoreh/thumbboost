/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { resolveRateLimit } from "../src/lib/rate-limit";

export const check = mutation({
  args: {
    key: v.string(),
    max: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("rateLimitBuckets")
      .withIndex("by_key", (q: any) => q.eq("key", args.key))
      .unique();
    const decision = resolveRateLimit({
      bucket: existing ? { count: existing.count, resetAt: existing.resetAt } : null,
      max: args.max,
      windowMs: args.windowMs,
      now,
    });

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: decision.count,
        resetAt: decision.resetAt,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("rateLimitBuckets", {
        key: args.key,
        count: decision.count,
        resetAt: decision.resetAt,
        updatedAt: now,
      });
    }

    return {
      ok: decision.ok,
      remaining: decision.remaining,
      resetAt: decision.resetAt,
    };
  },
});
