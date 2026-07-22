import { ConvexHttpClient } from "convex/browser";

// Lazy initialization — only fail when actually used, not at module load.
let _convex: ConvexHttpClient | null = null;

export const convex = new Proxy({} as ConvexHttpClient, {
  get(_target, prop) {
    if (!_convex) {
      const url = process.env.CONVEX_CLOUD_URL;
      if (!url) {
        throw new Error(
          "CONVEX_CLOUD_URL is not set. Authentication features are unavailable.",
        );
      }
      _convex = new ConvexHttpClient(url);
    }
    return (_convex as any)[prop];
  },
});
