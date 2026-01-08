/**
 * API Diff Detection
 *
 * Compares extracted APIs between versions to detect changes
 */
import type { ExtractedAPI } from './types/index.js';
/** Types of API changes */
export type ChangeType = 'added' | 'removed' | 'modified' | 'breaking';
/** A detected API change */
export interface APIChange {
    /** Type of change */
    type: ChangeType;
    /** API name */
    name: string;
    /** API kind (component, hook, type, etc.) */
    kind: string;
    /** Package the API belongs to */
    packageName: string;
    /** Description of the change */
    description: string;
    /** Previous value (for modifications) */
    before?: string;
    /** New value (for modifications) */
    after?: string;
    /** Whether this is a breaking change */
    isBreaking: boolean;
}
/** Result of API diff analysis */
export interface APIDiffResult {
    /** Added APIs */
    added: APIChange[];
    /** Removed APIs */
    removed: APIChange[];
    /** Modified APIs */
    modified: APIChange[];
    /** Breaking changes */
    breaking: APIChange[];
    /** Summary statistics */
    summary: {
        totalAdded: number;
        totalRemoved: number;
        totalModified: number;
        totalBreaking: number;
        hasBreakingChanges: boolean;
    };
}
/** Options for diffing APIs */
export interface DiffOptions {
    /** Consider signature changes as breaking */
    signatureChangesAreBreaking?: boolean;
    /** Consider prop type changes as breaking */
    propTypeChangesAreBreaking?: boolean;
    /** Consider removed optional props as breaking */
    removedOptionalPropsAreBreaking?: boolean;
    /** Ignore internal/private APIs */
    ignoreInternal?: boolean;
}
/** Compare two sets of APIs and generate a diff */
export declare function diffAPIs(oldAPIs: ExtractedAPI[], newAPIs: ExtractedAPI[], options?: DiffOptions): APIDiffResult;
/** Format diff result as text */
export declare function formatDiffAsText(result: APIDiffResult): string;
/** Format diff result as JSON */
export declare function formatDiffAsJSON(result: APIDiffResult): string;
/** Format diff for changelog */
export declare function formatDiffForChangelog(result: APIDiffResult): string;
//# sourceMappingURL=api-differ.d.ts.map