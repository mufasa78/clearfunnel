import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

// Ensure env variables are loaded (for standalone script usage)
dotenv.config({ path: "../../.env.local" });

const convexUrl = process.env.CONVEX_CLOUD_URL;

if (!convexUrl) {
  throw new Error("CONVEX_CLOUD_URL is not set in environment variables");
}

export const convex = new ConvexHttpClient(convexUrl);
