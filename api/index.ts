/**
 * Vercel Serverless Function entry point.
 *
 * All /api/* requests are routed here by vercel.json.
 * The Express app handles routing internally.
 */
import app from '../artifacts/api-server/src/app';

export default app;
