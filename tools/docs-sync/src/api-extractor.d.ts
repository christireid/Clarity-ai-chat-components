/**
 * API Extraction Engine
 *
 * Extracts API information from TypeScript source files using the TypeScript Compiler API
 */
import type { APICache, APIKind, ExtractionConfig, ExtractionResult, ExtractedAPI } from './types/index.js';
/** Extract APIs from a package */
export declare function extractAPIs(config: ExtractionConfig, cache?: APICache): Promise<ExtractionResult>;
/** Extract APIs from multiple packages */
export declare function extractMultiplePackages(packages: ExtractionConfig[], cache?: APICache): Promise<Map<string, ExtractionResult>>;
/** Find all TypeScript source files in a package */
export declare function findSourceFiles(packagePath: string): Promise<string[]>;
/** Get default extraction config for a package */
export declare function getDefaultConfig(packagePath: string, packageName: string): ExtractionConfig;
/** Filter APIs by kind */
export declare function filterByKind(apis: ExtractedAPI[], kind: APIKind): ExtractedAPI[];
/** Group APIs by kind */
export declare function groupByKind(apis: ExtractedAPI[]): Map<APIKind, ExtractedAPI[]>;
/** Sort APIs alphabetically by name */
export declare function sortAPIs(apis: ExtractedAPI[]): ExtractedAPI[];
/** Format extraction result as JSON */
export declare function formatExtractionAsJSON(result: ExtractionResult): string;
//# sourceMappingURL=api-extractor.d.ts.map