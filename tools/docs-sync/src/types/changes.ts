/**
 * Types for change detection from git diffs
 */

/** Status of a changed file */
export type FileStatus = 'added' | 'modified' | 'deleted' | 'renamed' | 'copied'

/** A file that changed in a commit */
export interface ChangedFile {
  /** File path (relative to repo root) */
  path: string
  /** Status of the change */
  status: FileStatus
  /** Package this file belongs to (null if not in a package) */
  package: string | null
  /** Previous path (for renames) */
  oldPath?: string
  /** Number of lines added */
  additions?: number
  /** Number of lines deleted */
  deletions?: number
}

/** Type of change for documentation purposes */
export type ChangeType =
  | 'breaking'
  | 'feature'
  | 'fix'
  | 'docs'
  | 'internal'
  | 'refactor'

/** Priority level for documentation updates */
export type ChangePriority = 'high' | 'medium' | 'low'

/** Classification of a change's documentation impact */
export interface ChangeClassification {
  /** Whether this change affects documentation */
  isDocsRelevant: boolean
  /** List of affected API names */
  affectedAPIs: string[]
  /** List of affected documentation pages */
  affectedDocs: string[]
  /** Type of change */
  changeType: ChangeType
  /** Priority for documentation update */
  priority: ChangePriority
  /** Reason for classification */
  reason: string
}

/** Summary of detected changes */
export interface ChangeSummary {
  /** Total number of changed files */
  totalFiles: number
  /** Number of docs-relevant files */
  docsRelevantFiles: number
  /** List of affected packages */
  packagesAffected: string[]
  /** Estimated number of doc updates needed */
  estimatedDocUpdates: number
  /** Has any breaking changes */
  hasBreakingChanges: boolean
  /** Has any new features */
  hasNewFeatures: boolean
}

/** Result of change detection */
export interface ChangeDetectionResult {
  /** All changed files */
  changedFiles: ChangedFile[]
  /** Classifications by file path */
  classifications: Map<string, ChangeClassification>
  /** Overall summary */
  summary: ChangeSummary
  /** Base commit SHA */
  baseCommit: string
  /** Head commit SHA */
  headCommit: string
  /** Detection timestamp */
  detectedAt: string
}

/** Options for change detection */
export interface ChangeDetectionOptions {
  /** Base commit to compare from */
  base: string
  /** Head commit to compare to */
  head: string
  /** Patterns of files to include */
  includePatterns?: string[]
  /** Patterns of files to exclude */
  excludePatterns?: string[]
  /** Whether to skip test files */
  skipTests?: boolean
  /** Whether to skip internal files */
  skipInternal?: boolean
}

/** Commit information for changelog */
export interface CommitInfo {
  /** Commit SHA */
  hash: string
  /** Short hash (7 chars) */
  shortHash: string
  /** Commit message (first line) */
  subject: string
  /** Full commit body */
  body: string
  /** Author name */
  author: string
  /** Author email */
  authorEmail: string
  /** Commit date */
  date: string
  /** Files changed in this commit */
  files: ChangedFile[]
}

/** Parsed conventional commit */
export interface ParsedCommit {
  /** Commit type (feat, fix, etc.) */
  type: string
  /** Scope (optional) */
  scope?: string
  /** Commit message */
  message: string
  /** Whether this is a breaking change */
  breaking: boolean
  /** Original commit info */
  commit: CommitInfo
  /** PR number if available */
  prNumber?: number
}
