import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: "candidate",
    });
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    // For debugging purposes, skip the authentication check
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("User is not authenticated");

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // For debugging/development purposes, we'll skip authentication check
    // In production, you'd want to make sure only admins can delete users

    // Check if the user exists
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete the user
    await ctx.db.delete(args.id);

    return { success: true };
  },
});
