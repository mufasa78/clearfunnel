import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(), // Hashed password, not plain text
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
