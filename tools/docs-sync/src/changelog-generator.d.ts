/**
 * Changelog Generator
 *
 * Generates changelog entries from conventional commits
 */
import type { CommitInfo, ParsedCommit } from './types/index.js';
/** Parse a conventional commit message */
export declare function parseConventionalCommit(commit: CommitInfo): ParsedCommit | null;
/** Changelog entry structure */
export interface ChangelogEntry {
    version: string;
    date: string;
    sections: Record<string, ChangelogItem[]>;
}
/** Single changelog item */
export interface ChangelogItem {
    message: string;
    scope?: string;
    hash: string;
    shortHash: string;
    author: string;
    prNumber?: number;
}
/** Generate changelog entries from commits */
export declare function generateChangelogEntries(commits: CommitInfo[], version: string): ChangelogEntry;
/** Generate markdown for a changelog entry */
export declare function formatChangelogMarkdown(entry: ChangelogEntry, repoUrl?: string): string;
/** Changelog configuration */
export interface ChangelogConfig {
    outputPath: string;
    repoUrl?: string;
    types: string[];
    includeBreaking: boolean;
}
/** Generate changelog from commits between two refs */
export declare function generateChangelog(sinceRef: string, version: string, config: ChangelogConfig): Promise<{
    entry: ChangelogEntry;
    markdown: string;
    hasBreakingChanges: boolean;
}>;
/** Update the main CHANGELOG.md file */
export declare function updateChangelogFile(filePath: string, newEntry: string): void;
/** Generate release notes from changelog entry */
export declare function generateReleaseNotes(entry: ChangelogEntry, repoUrl?: string): string;
/** Get the latest tag or a default ref */
export declare function getChangelogSinceRef(cwd?: string): string;
/** Determine next version based on changes */
export declare function suggestNextVersion(currentVersion: string, hasBreakingChanges: boolean, hasFeatures: boolean): string;
/** Format changelog result for output */
export declare function formatChangelogResult(entry: ChangelogEntry, hasBreakingChanges: boolean): string;
//# sourceMappingURL=changelog-generator.d.ts.map