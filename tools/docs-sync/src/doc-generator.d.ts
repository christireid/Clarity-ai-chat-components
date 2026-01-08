/**
 * Documentation Generator
 *
 * Generates MDX documentation from extracted API information
 */
import type { DocGenerationResult, DocGeneratorConfig, ExtractedAPI } from './types/index.js';
/** Generate documentation for a set of APIs */
export declare function generateDocs(apis: ExtractedAPI[], config: DocGeneratorConfig): Promise<DocGenerationResult>;
/** Write generated docs to disk */
export declare function writeDocs(result: DocGenerationResult, config: DocGeneratorConfig): Promise<{
    written: string[];
    failed: string[];
}>;
/** Get default generator config */
export declare function getDefaultGeneratorConfig(rootDir: string): DocGeneratorConfig;
/** Format generation result as text */
export declare function formatGenerationResult(result: DocGenerationResult): string;
//# sourceMappingURL=doc-generator.d.ts.map