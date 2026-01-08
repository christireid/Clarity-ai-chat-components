/**
 * Git operations utilities
 */
import type { ChangedFile, CommitInfo } from '../types/index.js';
/** Execute a git command and return stdout */
export declare function execGit(args: string[], cwd?: string): string;
/** Get the current branch name */
export declare function getCurrentBranch(cwd?: string): string;
/** Get the current commit SHA */
export declare function getCurrentCommit(cwd?: string): string;
/** Get the short commit SHA */
export declare function getShortCommit(sha: string, cwd?: string): string;
/** Check if a commit exists */
export declare function commitExists(sha: string, cwd?: string): boolean;
/** Get the merge base between two commits */
export declare function getMergeBase(commit1: string, commit2: string, cwd?: string): string;
/** Get files changed between two commits */
export declare function getChangedFiles(base: string, head: string, cwd?: string): ChangedFile[];
/** Get file content at a specific commit */
export declare function getFileAtCommit(filePath: string, commit: string, cwd?: string): string | null;
/** Get commits between two refs */
export declare function getCommitsBetween(base: string, head: string, cwd?: string): CommitInfo[];
/** Get the default branch name */
export declare function getDefaultBranch(cwd?: string): string;
/** Get tags between two commits */
export declare function getTagsBetween(base: string, head: string, cwd?: string): string[];
/** Get the latest tag */
export declare function getLatestTag(cwd?: string): string | null;
/** Check if working directory is clean */
export declare function isWorkingDirClean(cwd?: string): boolean;
/** Stage files for commit */
export declare function stageFiles(files: string[], cwd?: string): void;
/** Create a commit */
export declare function createCommit(message: string, cwd?: string): string;
/** Configure git user for CI */
export declare function configureGitUser(name: string, email: string, cwd?: string): void;
//# sourceMappingURL=git.d.ts.map