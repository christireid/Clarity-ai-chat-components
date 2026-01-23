#!/usr/bin/env tsx
/**
 * Generate AI-optimized documentation files
 *
 * This script generates:
 * - llms.txt: Concise navigation file with site structure
 * - llms-full.txt: Complete documentation in a single file
 *
 * Usage:
 *   pnpm run generate:llms
 *   tsx scripts/generate-llms.ts
 */
import type { GenerationResult } from './types';
/**
 * Main generation function
 */
declare function generateLlmsDocs(): Promise<GenerationResult>;
export { generateLlmsDocs };
//# sourceMappingURL=generate-llms.d.ts.map