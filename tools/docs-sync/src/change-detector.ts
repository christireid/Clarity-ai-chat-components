/**
 * Change Detection Engine
 *
 * Analyzes git diffs to identify documentation-relevant changes
 */

import { minimatch } from 'minimatch'
import type {
  ChangeClassification,
  ChangeDetectionOptions,
  ChangeDetectionResult,
  ChangedFile,
  ChangePriority,
  ChangeSummary,
  ChangeType,
} from './types/index.js'
import { getChangedFiles, getCurrentCommit, getMergeBase } from './utils/git.js'

/** Patterns for docs-relevant source files */
const DOCS_RELEVANT_PATTERNS = [
  'packages/*/src/**/*.ts',
  'packages/*/src/**/*.tsx',
]

/** Patterns to exclude from documentation */
const EXCLUDE_PATTERNS = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/__tests__/**',
  '**/__mocks__/**',
  '**/internal/**',
  '**/test-utils/**',
  '**/testing/**',
]

/** Patterns that indicate export changes */
const EXPORT_PATTERNS = ['**/index.ts', '**/index.tsx']

/** Patterns for hook files */
const HOOK_PATTERNS = ['**/hooks/use*.ts', '**/hooks/use*.tsx', '**/use*.ts']

/** Patterns for component files */
const COMPONENT_PATTERNS = ['**/components/**/*.tsx', '**/ui/**/*.tsx']

/** Check if a path matches any of the given patterns */
function matchesAny(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => minimatch(path, pattern))
}

/** Determine the package from a file path */
function getPackageFromPath(path: string): string | null {
  const match = path.match(/^packages\/([^/]+)\//)
  return match ? `@clarity-chat/${match[1]}` : null
}

/** Determine change type from commit message and file content */
function inferChangeType(file: ChangedFile): ChangeType {
  const { path, status } = file

  // New files are features
  if (status === 'added') {
    return 'feature'
  }

  // Deleted files might be breaking
  if (status === 'deleted') {
    return 'breaking'
  }

  // Check path patterns
  if (path.includes('/internal/')) {
    return 'internal'
  }

  if (
    path.includes('.test.') ||
    path.includes('.spec.') ||
    path.includes('__tests__')
  ) {
    return 'internal'
  }

  if (path.endsWith('.md') || path.endsWith('.mdx')) {
    return 'docs'
  }

  // Default to feature for source changes
  return 'feature'
}

/** Determine priority based on file characteristics */
function inferPriority(
  file: ChangedFile,
  changeType: ChangeType
): ChangePriority {
  const { path, status } = file

  // Breaking changes are always high priority
  if (changeType === 'breaking') {
    return 'high'
  }

  // Index files affect exports, high priority
  if (matchesAny(path, EXPORT_PATTERNS)) {
    return 'high'
  }

  // Deleted public API files are high priority
  if (status === 'deleted' && matchesAny(path, DOCS_RELEVANT_PATTERNS)) {
    return 'high'
  }

  // Hooks and components are medium priority
  if (matchesAny(path, [...HOOK_PATTERNS, ...COMPONENT_PATTERNS])) {
    return 'medium'
  }

  // Internal changes are low priority
  if (changeType === 'internal') {
    return 'low'
  }

  return 'medium'
}

/** Get affected documentation pages for a file */
function getAffectedDocs(file: ChangedFile): string[] {
  const docs: string[] = []
  const { path } = file

  // Hook files
  const hookMatch = path.match(/use([A-Z][a-zA-Z]+)\.tsx?$/)
  if (hookMatch) {
    docs.push(`hooks/use-${hookMatch[1]?.toLowerCase()}.mdx`)
  }

  // Component files
  const componentMatch = path.match(/components\/([A-Za-z]+)\//)
  if (componentMatch) {
    docs.push(`components/${componentMatch[1]?.toLowerCase()}.mdx`)
  }

  // Index files affect API reference
  if (matchesAny(path, EXPORT_PATTERNS)) {
    const pkg = getPackageFromPath(path)
    if (pkg) {
      const pkgName = pkg.replace('@clarity-chat/', '')
      docs.push(`api/${pkgName}/index.mdx`)
    }
  }

  return docs
}

/** Get affected API names from a file path */
function getAffectedAPIs(file: ChangedFile): string[] {
  const apis: string[] = []
  const { path } = file

  // Extract hook name
  const hookMatch = path.match(/use([A-Z][a-zA-Z]+)\.tsx?$/)
  if (hookMatch) {
    apis.push(`use${hookMatch[1]}`)
  }

  // Extract component name
  const componentMatch = path.match(
    /components\/([A-Za-z]+)\/([A-Za-z]+)\.tsx$/
  )
  if (componentMatch) {
    apis.push(componentMatch[2] ?? '')
  }

  // Extract from filename
  const filenameMatch = path.match(/\/([A-Z][a-zA-Z]+)\.tsx?$/)
  if (filenameMatch && !hookMatch) {
    apis.push(filenameMatch[1] ?? '')
  }

  return apis.filter(Boolean)
}

/** Classify a single file change */
function classifyChange(file: ChangedFile): ChangeClassification {
  const { path } = file

  // Check if docs-relevant
  const isDocsRelevant =
    matchesAny(path, DOCS_RELEVANT_PATTERNS) &&
    !matchesAny(path, EXCLUDE_PATTERNS)

  const changeType = inferChangeType(file)
  const priority = inferPriority(file, changeType)

  return {
    isDocsRelevant,
    affectedAPIs: isDocsRelevant ? getAffectedAPIs(file) : [],
    affectedDocs: isDocsRelevant ? getAffectedDocs(file) : [],
    changeType,
    priority,
    reason: isDocsRelevant
      ? `File matches docs-relevant pattern`
      : `File excluded from docs (${matchesAny(path, EXCLUDE_PATTERNS) ? 'excluded pattern' : 'not in source'})`,
  }
}

/** Create summary from classifications */
function createSummary(
  files: ChangedFile[],
  classifications: Map<string, ChangeClassification>
): ChangeSummary {
  const packagesAffected = new Set<string>()
  let docsRelevantFiles = 0
  let estimatedDocUpdates = 0
  let hasBreakingChanges = false
  let hasNewFeatures = false

  for (const file of files) {
    const classification = classifications.get(file.path)
    if (!classification) continue

    if (classification.isDocsRelevant) {
      docsRelevantFiles++
      estimatedDocUpdates += classification.affectedDocs.length

      if (file.package) {
        packagesAffected.add(file.package)
      }
    }

    if (classification.changeType === 'breaking') {
      hasBreakingChanges = true
    }

    if (classification.changeType === 'feature') {
      hasNewFeatures = true
    }
  }

  return {
    totalFiles: files.length,
    docsRelevantFiles,
    packagesAffected: Array.from(packagesAffected),
    estimatedDocUpdates,
    hasBreakingChanges,
    hasNewFeatures,
  }
}

/** Detect documentation-relevant changes between commits */
export async function detectChanges(
  options: ChangeDetectionOptions
): Promise<ChangeDetectionResult> {
  const { base, head } = options
  const cwd = process.cwd()

  // Get actual commit SHAs
  const baseCommit =
    base === 'HEAD~1' ? getMergeBase(head, 'HEAD~1', cwd) : base
  const headCommit = head === 'HEAD' ? getCurrentCommit(cwd) : head

  // Get changed files
  let changedFiles = getChangedFiles(baseCommit, headCommit, cwd)

  // Apply include patterns
  if (options.includePatterns?.length) {
    changedFiles = changedFiles.filter((file) =>
      matchesAny(file.path, options.includePatterns ?? [])
    )
  }

  // Apply exclude patterns
  if (options.excludePatterns?.length) {
    changedFiles = changedFiles.filter(
      (file) => !matchesAny(file.path, options.excludePatterns ?? [])
    )
  }

  // Skip test files if requested
  if (options.skipTests) {
    changedFiles = changedFiles.filter(
      (file) =>
        !file.path.includes('.test.') &&
        !file.path.includes('.spec.') &&
        !file.path.includes('__tests__')
    )
  }

  // Skip internal files if requested
  if (options.skipInternal) {
    changedFiles = changedFiles.filter(
      (file) => !file.path.includes('/internal/')
    )
  }

  // Classify each file
  const classifications = new Map<string, ChangeClassification>()
  for (const file of changedFiles) {
    classifications.set(file.path, classifyChange(file))
  }

  // Create summary
  const summary = createSummary(changedFiles, classifications)

  return {
    changedFiles,
    classifications,
    summary,
    baseCommit,
    headCommit,
    detectedAt: new Date().toISOString(),
  }
}

/** Filter change detection result to only docs-relevant files */
export function filterDocsRelevant(
  result: ChangeDetectionResult
): ChangeDetectionResult {
  const docsRelevantFiles = result.changedFiles.filter((file) => {
    const classification = result.classifications.get(file.path)
    return classification?.isDocsRelevant
  })

  const docsRelevantClassifications = new Map<string, ChangeClassification>()
  for (const file of docsRelevantFiles) {
    const classification = result.classifications.get(file.path)
    if (classification) {
      docsRelevantClassifications.set(file.path, classification)
    }
  }

  return {
    ...result,
    changedFiles: docsRelevantFiles,
    classifications: docsRelevantClassifications,
    summary: createSummary(docsRelevantFiles, docsRelevantClassifications),
  }
}

/** Get packages affected by changes */
export function getAffectedPackages(result: ChangeDetectionResult): string[] {
  return result.summary.packagesAffected
}

/** Check if any breaking changes were detected */
export function hasBreakingChanges(result: ChangeDetectionResult): boolean {
  return result.summary.hasBreakingChanges
}

/** Get files grouped by package */
export function groupByPackage(
  result: ChangeDetectionResult
): Map<string, ChangedFile[]> {
  const groups = new Map<string, ChangedFile[]>()

  for (const file of result.changedFiles) {
    const pkg = file.package ?? 'other'
    const existing = groups.get(pkg) ?? []
    existing.push(file)
    groups.set(pkg, existing)
  }

  return groups
}

/** Format detection result as GitHub Actions output */
export function formatAsGitHubOutput(result: ChangeDetectionResult): string {
  const lines: string[] = []

  lines.push(`docs_relevant=${result.summary.docsRelevantFiles > 0}`)
  lines.push(`affected_packages=${result.summary.packagesAffected.join(',')}`)
  lines.push(`has_breaking_changes=${result.summary.hasBreakingChanges}`)
  lines.push(`estimated_updates=${result.summary.estimatedDocUpdates}`)

  const changeSummary = [
    `${result.summary.totalFiles} files changed`,
    `${result.summary.docsRelevantFiles} docs-relevant`,
    result.summary.hasBreakingChanges ? 'BREAKING' : '',
    result.summary.hasNewFeatures ? 'features' : '',
  ]
    .filter(Boolean)
    .join(', ')

  lines.push(`change_summary=${changeSummary}`)

  return lines.join('\n')
}

/** Format detection result as JSON */
export function formatAsJSON(result: ChangeDetectionResult): string {
  // Convert Map to object for JSON serialization
  const classifications: Record<string, ChangeClassification> = {}
  for (const [key, value] of result.classifications) {
    classifications[key] = value
  }

  return JSON.stringify(
    {
      ...result,
      classifications,
    },
    null,
    2
  )
}

/** Format detection result as human-readable text */
export function formatAsText(result: ChangeDetectionResult): string {
  const lines: string[] = []

  lines.push('📊 Change Detection Results')
  lines.push('═'.repeat(50))
  lines.push('')
  lines.push(`Base commit: ${result.baseCommit.slice(0, 7)}`)
  lines.push(`Head commit: ${result.headCommit.slice(0, 7)}`)
  lines.push(`Total files: ${result.summary.totalFiles}`)
  lines.push(`Docs-relevant: ${result.summary.docsRelevantFiles}`)
  lines.push('')

  if (result.summary.hasBreakingChanges) {
    lines.push('⚠️  Breaking changes detected!')
  }

  if (result.summary.packagesAffected.length > 0) {
    lines.push('📦 Affected packages:')
    for (const pkg of result.summary.packagesAffected) {
      lines.push(`   • ${pkg}`)
    }
    lines.push('')
  }

  if (result.summary.docsRelevantFiles > 0) {
    lines.push('📄 Docs-relevant files:')
    for (const file of result.changedFiles) {
      const classification = result.classifications.get(file.path)
      if (classification?.isDocsRelevant) {
        const priority = classification.priority.toUpperCase()
        lines.push(`   [${priority}] ${file.status}: ${file.path}`)
      }
    }
  }

  return lines.join('\n')
}
