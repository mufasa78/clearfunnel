/**
 * Vercel Serverless Function Handler
 * This file exports the Express app for Vercel's serverless architecture.
 * Vercel compiles the TypeScript import chain at deploy time.
 */
export { default } from '../artifacts/api-server/src/app.js';
