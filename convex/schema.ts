import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("basic"), v.literal("pro")),
    thumbnailsThisMonth: v.number(),
    lastUsageReset: v.number(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]).index("by_email", ["email"]).index("by_stripe_customer_id", ["stripeCustomerId"]),

  thumbnailProjects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    channelName: v.optional(v.string()),
    keywords: v.array(v.string()),
    style: v.optional(v.string()),
    trendPrompt: v.optional(v.string()),
    status: v.union(v.literal("queued"), v.literal("generating"), v.literal("ready"), v.literal("failed")),
    variations: v.array(v.object({
      id: v.string(),
      imageUrl: v.string(),
      prompt: v.string(),
      score: v.number(),
      watermarked: v.boolean(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_user_status", ["userId", "status"]),

  generationJobs: defineTable({
    userId: v.id("users"),
    projectId: v.optional(v.id("thumbnailProjects")),
    provider: v.union(v.literal("openai"), v.literal("replicate"), v.literal("flux"), v.literal("mock")),
    prompt: v.string(),
    status: v.union(v.literal("queued"), v.literal("running"), v.literal("completed"), v.literal("failed")),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),
});
