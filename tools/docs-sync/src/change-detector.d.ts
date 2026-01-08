/**
 * Change Detection Engine
 *
 * Analyzes git diffs to identify documentation-relevant changes
 */
import type { ChangeDetectionOptions, ChangeDetectionResult, ChangedFile } from './types/index.js';
/** Detect documentation-relevant changes between commits */
export declare function detectChanges(options: ChangeDetectionOptions): Promise<ChangeDetectionResult>;
/** Filter change detection result to only docs-relevant files */
export declare function filterDocsRelevant(result: ChangeDetectionResult): ChangeDetectionResult;
/** Get packages affected by changes */
export declare function getAffectedPackages(result: ChangeDetectionResult): string[];
/** Check if any breaking changes were detected */
export declare function hasBreakingChanges(result: ChangeDetectionResult): boolean;
/** Get files grouped by package */
export declare function groupByPackage(result: ChangeDetectionResult): Map<string, ChangedFile[]>;
/** Format detection result as GitHub Actions output */
export declare function formatAsGitHubOutput(result: ChangeDetectionResult): string;
/** Format detection result as JSON */
export declare function formatAsJSON(result: ChangeDetectionResult): string;
/** Format detection result as human-readable text */
export declare function formatAsText(result: ChangeDetectionResult): string;
//# sourceMappingURL=change-detector.d.ts.map