import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      name: args.name,
      createdAt: Date.now(),
    });

    return userId;
  },
});
