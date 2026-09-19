/**
 * env.js — loaded as the very first import in index.js
 *
 * In Node ESM, all `import` statements are hoisted and resolved before
 * any top-level code runs. This means dotenv.config() inside index.js
 * fires AFTER all other modules have already evaluated — so env vars
 * are missing when those modules initialize.
 *
 * By isolating dotenv into its own module and importing it first,
 * we guarantee the env is populated before anything else loads.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env'), override: true });
