/**
 * Configuration types for docs-sync
 */

/** Package configuration for docs-sync */
export interface PackageConfig {
  /** Package name (e.g., '@clarity-chat/react') */
  name: string
  /** Path to package root (relative to repo root) */
  path: string
  /** Entry points for API extraction */
  entryPoints: string[]
  /** Output path for generated docs */
  docsPath: string
  /** Whether to generate component docs */
  generateComponentDocs: boolean
  /** Whether to generate hook docs */
  generateHookDocs: boolean
  /** Whether to generate type docs */
  generateTypeDocs: boolean
  /** Custom patterns to include */
  includePatterns?: string[]
  /** Custom patterns to exclude */
  excludePatterns?: string[]
}

/** Main configuration for docs-sync */
export interface DocsSyncConfig {
  /** Version of config format */
  version: number
  /** Repository root path */
  rootDir: string
  /** Path to documentation site */
  docsDir: string
  /** Path to generated API data */
  apiDataDir: string
  /** Path to cache directory */
  cacheDir: string
  /** Packages to process */
  packages: PackageConfig[]
  /** Patterns for docs-relevant files */
  docsRelevantPatterns: string[]
  /** Patterns to exclude from processing */
  excludePatterns: string[]
  /** Template directory */
  templatesDir: string
  /** GitHub repository (owner/repo) */
  repository?: string
  /** Base URL for documentation */
  baseUrl: string
  /** Changelog configuration */
  changelog: {
    /** Output path for changelog */
    outputPath: string
    /** Types to include in changelog */
    types: string[]
    /** Whether to include breaking changes section */
    includeBreaking: boolean
  }
  /** CI configuration */
  ci: {
    /** GitHub Actions bot name */
    botName: string
    /** Bot email */
    botEmail: string
    /** Commit message prefix */
    commitPrefix: string
    /** Whether to create PRs instead of direct commits */
    createPR: boolean
  }
}

/** Runtime options for CLI commands */
export interface CLIOptions {
  /** Base commit for comparison */
  base?: string
  /** Head commit for comparison */
  head?: string
  /** Specific packages to process (comma-separated string) */
  packages?: string
  /** Force full rebuild */
  full?: boolean
  /** Dry run mode */
  dryRun?: boolean
  /** Output format (json, github, text) */
  output?: 'json' | 'github' | 'text'
  /** Verbose logging */
  verbose?: boolean
  /** Silent mode (no output) */
  silent?: boolean
  /** Config file path */
  config?: string
  /** Version for changelog */
  version?: string
  /** Since commit/tag for changelog */
  since?: string
}

/** Default configuration values */
export const DEFAULT_CONFIG: Partial<DocsSyncConfig> = {
  version: 1,
  docsDir: 'apps/docs/content',
  apiDataDir: '.docs-sync/api-data',
  cacheDir: '.docs-sync/cache',
  templatesDir: 'tools/docs-sync/templates',
  baseUrl: '/docs',
  docsRelevantPatterns: [
    'packages/*/src/**/*.ts',
    'packages/*/src/**/*.tsx',
    '!packages/*/src/**/*.test.*',
    '!packages/*/src/**/*.spec.*',
    '!**/internal/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
  ],
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
  ],
  changelog: {
    outputPath: 'apps/docs/content/changelog',
    types: ['feat', 'fix', 'breaking', 'perf', 'refactor'],
    includeBreaking: true,
  },
  ci: {
    botName: 'github-actions[bot]',
    botEmail: 'github-actions[bot]@users.noreply.github.com',
    commitPrefix: 'docs: auto-update documentation',
    createPR: false,
  },
}

/** Result of sync operation */
export interface SyncResult {
  /** Whether sync was successful */
  success: boolean
  /** Changes detected */
  changesDetected: number
  /** Documentation updates made */
  docsUpdated: number
  /** Changelog entries created */
  changelogEntriesCreated: number
  /** Files created */
  filesCreated: string[]
  /** Files updated */
  filesUpdated: string[]
  /** Files deleted */
  filesDeleted: string[]
  /** Errors encountered */
  errors: string[]
  /** Duration in milliseconds */
  duration: number
  /** Commit SHA if changes were committed */
  commitSha?: string
}
