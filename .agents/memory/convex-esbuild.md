---
name: Convex esbuild externals
description: Why convex must be externalized in the api-server esbuild config
---

## Rule
`"convex"` and `"convex/*"` must appear in the `external` array in `artifacts/api-server/build.mjs`.

**Why:** The convex generated files (`convex/_generated/api.js`) import from `convex/server`, which is a complex package that esbuild cannot bundle. Without this external, the build fails with "Could not resolve convex/server".

**How to apply:** Any time convex is used in the api-server, keep these two entries in build.mjs externals:
```js
"convex",
"convex/*",
```
