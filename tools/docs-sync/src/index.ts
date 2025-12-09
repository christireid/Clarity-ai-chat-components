/**
 * Docs-Sync CLI
 *
 * Automated documentation synchronization for Clarity Chat
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { program } from 'commander'
import type {
  CLIOptions,
  DocsSyncConfig,
  ExtractedAPI,
  PackageConfig,
} from './types/index.js'
import {
  detectChanges,
  filterDocsRelevant,
  formatAsGitHubOutput,
  formatAsJSON,
  formatAsText,
} from './change-detector.js'
import { extractAPIs, getDefaultConfig } from './api-extractor.js'
import {
  generateDocs,
  writeDocs,
  getDefaultGeneratorConfig,
  formatGenerationResult,
} from './doc-generator.js'
import {
  generateChangelog,
  updateChangelogFile,
  getChangelogSinceRef,
  formatChangelogResult,
} from './changelog-generator.js'
import {
  diffAPIs,
  formatDiffAsText,
  formatDiffAsJSON,
  formatDiffForChangelog,
} from './api-differ.js'
import { loadCache, saveCache, createEmptyCache } from './utils/cache.js'
import {
  configureGitUser,
  createCommit,
  stageFiles,
  isWorkingDirClean,
} from './utils/git.js'
import {
  configureLogger,
  info,
  success,
  warn,
  error,
  debug,
  startSpinner,
  succeedSpinner,
  failSpinner,
  ProgressTracker,
  printSummary,
  formatDuration,
} from './utils/logger.js'
import {
  validateConfigFull,
  formatValidationErrors,
} from './utils/validator.js'

/** Default package configurations */
const DEFAULT_PACKAGES: PackageConfig[] = [
  {
    name: '@clarity-chat/react',
    path: 'packages/react',
    entryPoints: ['src/index.ts'],
    docsPath: 'components',
    generateComponentDocs: true,
    generateHookDocs: true,
    generateTypeDocs: true,
  },
  {
    name: '@clarity-chat/types',
    path: 'packages/types',
    entryPoints: ['src/index.ts'],
    docsPath: 'types',
    generateComponentDocs: false,
    generateHookDocs: false,
    generateTypeDocs: true,
  },
  {
    name: '@clarity-chat/memory',
    path: 'packages/memory',
    entryPoints: ['src/index.ts'],
    docsPath: 'memory',
    generateComponentDocs: false,
    generateHookDocs: true,
    generateTypeDocs: true,
  },
]

/** Retry a function with exponential backoff */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    description?: string
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    description = 'operation',
  } = options
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err as Error
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        warn(
          `${description} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/** Find the monorepo root by looking for pnpm-workspace.yaml or package.json with workspaces */
function findMonorepoRoot(startDir: string): string {
  let dir = startDir
  while (dir !== join(dir, '..')) {
    // Check for pnpm-workspace.yaml
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    // Check for package.json with workspaces
    const pkgPath = join(dir, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
        if (pkg.workspaces) {
          return dir
        }
      } catch {
        // Continue searching
      }
    }
    dir = join(dir, '..')
  }
  return startDir
}

/** Load configuration from file or use defaults */
function loadConfig(
  configPath?: string,
  skipValidation = false
): DocsSyncConfig {
  const rootDir = findMonorepoRoot(process.cwd())
  let config: DocsSyncConfig

  // Try to load config file
  if (configPath && existsSync(configPath)) {
    debug(`Loading config from ${configPath}`)
    const content = readFileSync(configPath, 'utf-8')
    try {
      config = JSON.parse(content) as DocsSyncConfig
    } catch (err) {
      throw new Error(`Invalid JSON in config file: ${(err as Error).message}`)
    }
  } else {
    // Look for default config locations
    const defaultPaths = [
      join(rootDir, '.docs-sync.json'),
      join(rootDir, 'docs-sync.config.json'),
    ]

    let foundPath: string | null = null
    for (const path of defaultPaths) {
      if (existsSync(path)) {
        foundPath = path
        break
      }
    }

    if (foundPath) {
      debug(`Loading config from ${foundPath}`)
      const content = readFileSync(foundPath, 'utf-8')
      try {
        config = JSON.parse(content) as DocsSyncConfig
      } catch (err) {
        throw new Error(
          `Invalid JSON in config file: ${(err as Error).message}`
        )
      }
    } else {
      // Return default config
      debug('Using default configuration')
      config = {
        version: 1,
        rootDir,
        docsDir: join(rootDir, 'apps/docs/content'),
        apiDataDir: join(rootDir, '.docs-sync/api-data'),
        cacheDir: join(rootDir, '.docs-sync/cache'),
        packages: DEFAULT_PACKAGES,
        docsRelevantPatterns: [
          'packages/*/src/**/*.ts',
          'packages/*/src/**/*.tsx',
        ],
        excludePatterns: [
          '**/node_modules/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/__tests__/**',
          '**/__mocks__/**',
        ],
        templatesDir: join(rootDir, 'tools/docs-sync/templates'),
        baseUrl: '/docs',
        changelog: {
          outputPath: join(rootDir, 'CHANGELOG.md'),
          types: ['feat', 'fix', 'perf', 'refactor', 'docs'],
          includeBreaking: true,
        },
        ci: {
          botName: 'github-actions[bot]',
          botEmail: 'github-actions[bot]@users.noreply.github.com',
          commitPrefix: 'docs: auto-update documentation',
          createPR: false,
        },
      }
    }
  }

  // Validate configuration
  if (!skipValidation) {
    const validationResult = validateConfigFull(config)
    if (!validationResult.valid) {
      const errorMessage = formatValidationErrors(validationResult.errors)
      throw new Error(errorMessage)
    }
    debug('Configuration validated successfully')
  }

  return config
}

/** Ensure required directories exist */
function ensureDirectories(config: DocsSyncConfig): void {
  const dirs = [config.apiDataDir, config.cacheDir, config.docsDir]

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  }
}

// CLI setup
program
  .name('docs-sync')
  .description('Automated documentation synchronization for Clarity Chat')
  .version('1.0.0')

// Detect changes command
program
  .command('detect-changes')
  .description('Detect documentation-relevant changes between commits')
  .requiredOption('--base <commit>', 'Base commit SHA or ref')
  .requiredOption('--head <commit>', 'Head commit SHA or ref', 'HEAD')
  .option('--output <format>', 'Output format (json, github, text)', 'text')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)

      startSpinner('Detecting changes...')

      const result = await withRetry(
        () =>
          detectChanges({
            base: options.base!,
            head: options.head ?? 'HEAD',
            includePatterns: config.docsRelevantPatterns,
            excludePatterns: config.excludePatterns,
            skipTests: true,
            skipInternal: true,
          }),
        { description: 'change detection', maxRetries: 2 }
      )

      const filtered = filterDocsRelevant(result)
      succeedSpinner(
        `Detected ${filtered.summary.docsRelevantFiles} docs-relevant changes`
      )

      // Output based on format
      switch (options.output) {
        case 'json':
          console.log(formatAsJSON(filtered))
          break
        case 'github': {
          console.log(formatAsGitHubOutput(filtered))
          // Write to file for GitHub Actions
          const outputPath = join(config.cacheDir, 'change-analysis.json')
          ensureDirectories(config)
          writeFileSync(outputPath, formatAsJSON(filtered))
          break
        }
        default:
          console.log(formatAsText(filtered))
      }

      // Exit with appropriate code
      process.exit(filtered.summary.docsRelevantFiles > 0 ? 0 : 0)
    } catch (err) {
      failSpinner('Change detection failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Extract APIs command
program
  .command('extract-apis')
  .description('Extract API information from TypeScript source files')
  .option(
    '--packages <names>',
    'Comma-separated list of package names to process'
  )
  .option('--full', 'Force full extraction (ignore cache)')
  .option('--parallel', 'Extract packages in parallel')
  .option(
    '--concurrency <number>',
    'Max parallel extractions (default: 3)',
    '3'
  )
  .option('--output <format>', 'Output format (json, text)', 'text')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    const startTime = Date.now()
    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)
      ensureDirectories(config)

      info('Starting API extraction...')

      // Load cache unless full extraction requested
      const cachePath = join(config.cacheDir, 'api-cache.json')
      const cache = options.full ? createEmptyCache() : loadCache(cachePath)

      // Determine which packages to process
      let packages = config.packages
      if (options.packages) {
        const requestedPkgs = options.packages.split(',')
        packages = packages.filter((p) =>
          requestedPkgs.some((rp: string) => p.name.includes(rp))
        )
      }

      const results: Record<string, unknown> = {}
      const progress = new ProgressTracker(packages.length, 'Extracting APIs')
      progress.start()

      const extractPackage = async (pkg: PackageConfig) => {
        const extractionConfig = getDefaultConfig(
          join(config.rootDir, pkg.path),
          pkg.name
        )
        extractionConfig.entryPoints = pkg.entryPoints

        const result = await withRetry(
          () => extractAPIs(extractionConfig, cache),
          { description: `extract ${pkg.name}`, maxRetries: 2 }
        )

        results[pkg.name] = result
        progress.increment(pkg.name)

        debug(`  ${pkg.name}: ${result.apis.length} APIs`)
        if (result.errors.length > 0) {
          warn(`  ${pkg.name}: ${result.errors.length} extraction errors`)
        }

        return result
      }

      if (options.parallel) {
        const concurrency = parseInt(options.concurrency ?? '3', 10)
        info(`Running parallel extraction with concurrency ${concurrency}...`)
        await Promise.all(
          packages.map(async (pkg, i) => {
            // Stagger starts to avoid TypeScript race conditions
            await new Promise((resolve) => setTimeout(resolve, i * 100))
            return extractPackage(pkg)
          })
        )
      } else {
        for (const pkg of packages) {
          await extractPackage(pkg)
        }
      }

      progress.complete()

      // Save cache
      saveCache(cache, cachePath)

      // Save API data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      writeFileSync(apiDataPath, JSON.stringify(results, null, 2))

      const totalAPIs = Object.values(results).reduce<number>(
        (sum, r) => sum + ((r as { apis: unknown[] }).apis?.length ?? 0),
        0
      )
      const totalErrors = Object.values(results).reduce<number>(
        (sum, r) => sum + ((r as { errors: unknown[] }).errors?.length ?? 0),
        0
      )

      // Output
      if (options.output === 'json') {
        console.log(JSON.stringify(results, null, 2))
      } else {
        printSummary('API Extraction Results', [
          { label: 'Duration', value: formatDuration(Date.now() - startTime) },
          { label: 'Packages processed', value: packages.length },
          { label: 'Total APIs extracted', value: totalAPIs, color: 'green' },
          {
            label: 'Extraction errors',
            value: totalErrors,
            color: totalErrors > 0 ? 'yellow' : 'green',
          },
        ])
      }
    } catch (err) {
      failSpinner('API extraction failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Generate docs command
program
  .command('generate-docs')
  .description('Generate documentation from extracted APIs')
  .option(
    '--packages <names>',
    'Comma-separated list of package names to process'
  )
  .option('--full', 'Force full regeneration')
  .option('--dry-run', 'Show what would change without writing files')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    const startTime = Date.now()
    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)
      ensureDirectories(config)

      startSpinner('Loading API data...')

      // Load extracted API data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      if (!existsSync(apiDataPath)) {
        failSpinner('No extracted API data found')
        error('Run extract-apis first.')
        process.exit(1)
      }

      const apiData = JSON.parse(readFileSync(apiDataPath, 'utf-8')) as Record<
        string,
        { apis: unknown[] }
      >

      succeedSpinner('API data loaded')

      // Collect all APIs
      let allAPIs: unknown[] = []
      if (options.packages) {
        const requestedPkgs = options.packages.split(',')
        for (const [pkgName, data] of Object.entries(apiData)) {
          if (requestedPkgs.some((rp: string) => pkgName.includes(rp))) {
            allAPIs = allAPIs.concat(data.apis)
          }
        }
      } else {
        for (const data of Object.values(apiData)) {
          allAPIs = allAPIs.concat(data.apis)
        }
      }

      info(`Processing ${allAPIs.length} APIs...`)

      // Generate documentation
      const generatorConfig = getDefaultGeneratorConfig(config.rootDir)
      generatorConfig.dryRun = options.dryRun ?? false

      const result = await withRetry(
        () =>
          generateDocs(
            allAPIs as Parameters<typeof generateDocs>[0],
            generatorConfig
          ),
        { description: 'documentation generation', maxRetries: 2 }
      )

      console.log(formatGenerationResult(result))

      // Write files
      if (!options.dryRun) {
        const { written, failed } = await writeDocs(result, generatorConfig)

        printSummary('Documentation Generation Results', [
          { label: 'Duration', value: formatDuration(Date.now() - startTime) },
          { label: 'APIs processed', value: allAPIs.length },
          { label: 'Files written', value: written.length, color: 'green' },
          {
            label: 'Files failed',
            value: failed.length,
            color: failed.length > 0 ? 'red' : 'green',
          },
          { label: 'Created', value: result.stats.created, color: 'green' },
          { label: 'Updated', value: result.stats.updated, color: 'blue' },
          { label: 'Skipped', value: result.stats.skipped },
        ])
      } else {
        info('Dry run - no files written')
      }
    } catch (err) {
      failSpinner('Documentation generation failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Generate changelog command
program
  .command('generate-changelog')
  .description('Generate changelog from conventional commits')
  .option('--since <ref>', 'Git ref to generate changelog from')
  .option('--version <version>', 'Version for the changelog entry')
  .option('--dry-run', 'Show changelog without updating file')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)

      startSpinner('Generating changelog...')

      const sinceRef = options.since ?? getChangelogSinceRef()
      const version = options.version ?? 'Unreleased'

      const { entry, markdown, hasBreakingChanges } = await withRetry(
        () =>
          generateChangelog(sinceRef, version, {
            outputPath: config.changelog.outputPath,
            repoUrl:
              'https://github.com/christireid/Clarity-ai-chat-components',
            types: config.changelog.types,
            includeBreaking: config.changelog.includeBreaking,
          }),
        { description: 'changelog generation', maxRetries: 2 }
      )

      succeedSpinner('Changelog generated')

      console.log(formatChangelogResult(entry, hasBreakingChanges))
      console.log('')
      console.log('--- Generated Changelog ---')
      console.log(markdown)

      if (!options.dryRun) {
        updateChangelogFile(config.changelog.outputPath, markdown)
        success(`Updated ${config.changelog.outputPath}`)
      } else {
        info('Dry run - changelog not updated')
      }

      if (hasBreakingChanges) {
        warn('Breaking changes detected in this release!')
      }
    } catch (err) {
      failSpinner('Changelog generation failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Full sync command
program
  .command('sync')
  .description('Run full documentation sync (detect, extract, generate)')
  .requiredOption('--base <commit>', 'Base commit SHA or ref')
  .option('--head <commit>', 'Head commit SHA or ref', 'HEAD')
  .option('--full', 'Force full rebuild')
  .option('--dry-run', 'Show what would change without committing')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    const startTime = Date.now()

    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)
      ensureDirectories(config)

      info('Starting documentation sync...')
      debug(`Base: ${options.base}, Head: ${options.head ?? 'HEAD'}`)

      // Step 1: Detect changes
      startSpinner('Step 1/4: Detecting changes...')
      const changeResult = await withRetry(
        () =>
          detectChanges({
            base: options.base!,
            head: options.head ?? 'HEAD',
            includePatterns: config.docsRelevantPatterns,
            excludePatterns: config.excludePatterns,
            skipTests: true,
            skipInternal: true,
          }),
        { description: 'change detection', maxRetries: 2 }
      )

      const filtered = filterDocsRelevant(changeResult)

      if (!options.full && filtered.summary.docsRelevantFiles === 0) {
        succeedSpinner('No documentation-relevant changes detected. Skipping.')
        return
      }

      succeedSpinner(
        `Found ${filtered.summary.docsRelevantFiles} docs-relevant files`
      )

      // Step 2: Extract APIs
      startSpinner('Step 2/4: Extracting APIs...')
      const cachePath = join(config.cacheDir, 'api-cache.json')
      const cache = options.full ? createEmptyCache() : loadCache(cachePath)

      const extractedData: Record<string, unknown> = {}

      // Only process affected packages
      const affectedPackages = options.full
        ? config.packages
        : config.packages.filter((p) =>
            filtered.summary.packagesAffected.includes(p.name)
          )

      const pkgProgress = new ProgressTracker(
        affectedPackages.length,
        'Processing packages'
      )
      pkgProgress.start()

      for (const pkg of affectedPackages) {
        pkgProgress.increment(pkg.name)
        const extractionConfig = getDefaultConfig(
          join(config.rootDir, pkg.path),
          pkg.name
        )
        extractionConfig.entryPoints = pkg.entryPoints

        const result = await withRetry(
          () => extractAPIs(extractionConfig, cache),
          { description: `extract ${pkg.name}`, maxRetries: 2 }
        )
        extractedData[pkg.name] = result
        debug(`  ${pkg.name}: ${result.apis.length} APIs`)
      }

      pkgProgress.complete()
      saveCache(cache, cachePath)

      // Save extracted data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      writeFileSync(apiDataPath, JSON.stringify(extractedData, null, 2))

      // Step 3: Generate documentation
      startSpinner('Step 3/4: Generating documentation...')
      let allAPIs: unknown[] = []
      for (const data of Object.values(extractedData)) {
        allAPIs = allAPIs.concat((data as { apis: unknown[] }).apis)
      }

      const generatorConfig = getDefaultGeneratorConfig(config.rootDir)
      generatorConfig.dryRun = options.dryRun ?? false

      const docResult = await withRetry(
        () =>
          generateDocs(
            allAPIs as Parameters<typeof generateDocs>[0],
            generatorConfig
          ),
        { description: 'documentation generation', maxRetries: 2 }
      )

      if (!options.dryRun) {
        const { written } = await writeDocs(docResult, generatorConfig)
        succeedSpinner(`Generated ${written.length} documentation files`)
      } else {
        succeedSpinner('Documentation generated (dry run)')
      }

      // Step 4: Commit changes (if not dry run and there are changes)
      if (
        !options.dryRun &&
        docResult.stats.created + docResult.stats.updated > 0
      ) {
        startSpinner('Step 4/4: Committing changes...')

        if (!isWorkingDirClean()) {
          configureGitUser(config.ci.botName, config.ci.botEmail)

          const filesToStage = [config.docsDir, config.apiDataDir]
          stageFiles(filesToStage)

          const commitMessage = `${config.ci.commitPrefix} [skip ci]\n\nAffected packages: ${filtered.summary.packagesAffected.join(', ')}`
          const sha = createCommit(commitMessage)
          succeedSpinner(`Created commit: ${sha.slice(0, 7)}`)
        } else {
          succeedSpinner('No changes to commit')
        }
      }

      // Output summary
      printSummary('📊 Sync Summary', [
        { label: 'Duration', value: formatDuration(Date.now() - startTime) },
        { label: 'Files analyzed', value: filtered.summary.totalFiles },
        {
          label: 'Docs-relevant',
          value: filtered.summary.docsRelevantFiles,
          color: 'blue',
        },
        { label: 'APIs extracted', value: allAPIs.length, color: 'green' },
        {
          label: 'Docs created',
          value: docResult.stats.created,
          color: 'green',
        },
        {
          label: 'Docs updated',
          value: docResult.stats.updated,
          color: 'blue',
        },
        { label: 'Docs skipped', value: docResult.stats.skipped },
      ])

      if (filtered.summary.hasBreakingChanges) {
        warn('Breaking changes detected!')
      }

      success(`Sync completed in ${formatDuration(Date.now() - startTime)}`)
    } catch (err) {
      failSpinner('Sync failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Verify command
program
  .command('verify')
  .description('Verify documentation is up to date and check for broken links')
  .option('--config <path>', 'Path to config file')
  .option('--check-links', 'Check for broken internal links')
  .option('--check-coverage', 'Check API documentation coverage')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions) => {
    const startTime = Date.now()
    const issues: Array<{ type: 'error' | 'warning'; message: string }> = []

    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)

      info('Verifying documentation...')

      // Check if API data exists
      startSpinner('Checking API data...')
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      if (!existsSync(apiDataPath)) {
        issues.push({
          type: 'warning',
          message: 'No extracted API data found. Run sync first.',
        })
      } else {
        succeedSpinner('API data exists')
      }

      // Check if docs directory exists
      startSpinner('Checking documentation directory...')
      if (!existsSync(config.docsDir)) {
        failSpinner('Documentation directory not found')
        issues.push({
          type: 'error',
          message: `Documentation directory not found: ${config.docsDir}`,
        })
      } else {
        succeedSpinner('Documentation directory exists')
      }

      // Check API coverage if requested and API data exists
      if (options.checkCoverage && existsSync(apiDataPath)) {
        startSpinner('Checking API documentation coverage...')
        try {
          const apiData = JSON.parse(
            readFileSync(apiDataPath, 'utf-8')
          ) as Record<string, { apis: Array<{ name: string; kind: string }> }>

          let totalAPIs = 0
          let documentedAPIs = 0
          const undocumented: string[] = []

          for (const [pkgName, data] of Object.entries(apiData)) {
            for (const api of data.apis) {
              totalAPIs++
              // Check if a doc file exists for this API
              const docPath = join(
                config.docsDir,
                `${api.name.toLowerCase()}.mdx`
              )
              if (existsSync(docPath)) {
                documentedAPIs++
              } else {
                undocumented.push(`${pkgName}:${api.name}`)
              }
            }
          }

          const coverage =
            totalAPIs > 0 ? Math.round((documentedAPIs / totalAPIs) * 100) : 0

          if (coverage < 80) {
            issues.push({
              type: 'warning',
              message: `API documentation coverage is ${coverage}% (${documentedAPIs}/${totalAPIs})`,
            })
          }

          if (undocumented.length > 0 && undocumented.length <= 10) {
            for (const api of undocumented) {
              issues.push({
                type: 'warning',
                message: `Missing documentation: ${api}`,
              })
            }
          } else if (undocumented.length > 10) {
            issues.push({
              type: 'warning',
              message: `${undocumented.length} APIs missing documentation`,
            })
          }

          succeedSpinner(
            `API coverage: ${coverage}% (${documentedAPIs}/${totalAPIs})`
          )
        } catch (err) {
          failSpinner('Failed to check coverage')
          issues.push({
            type: 'error',
            message: `Coverage check failed: ${(err as Error).message}`,
          })
        }
      }

      // Check internal links if requested
      if (options.checkLinks && existsSync(config.docsDir)) {
        startSpinner('Checking internal links...')
        try {
          const { globSync } = await import('glob')
          const mdxFiles = globSync('**/*.mdx', { cwd: config.docsDir })

          let brokenLinks = 0
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

          for (const file of mdxFiles) {
            const content = readFileSync(join(config.docsDir, file), 'utf-8')
            let match

            while ((match = linkRegex.exec(content)) !== null) {
              const linkTarget = match[2]

              // Skip external links and anchors
              if (
                linkTarget?.startsWith('http') ||
                linkTarget?.startsWith('#')
              ) {
                continue
              }

              // Check if the link target exists
              if (linkTarget) {
                const targetPath = join(
                  config.docsDir,
                  linkTarget.replace(/^\//, '')
                )
                const targetWithExt = targetPath.endsWith('.mdx')
                  ? targetPath
                  : `${targetPath}.mdx`

                if (!existsSync(targetPath) && !existsSync(targetWithExt)) {
                  brokenLinks++
                  issues.push({
                    type: 'warning',
                    message: `Broken link in ${file}: ${linkTarget}`,
                  })
                }
              }
            }
          }

          if (brokenLinks === 0) {
            succeedSpinner('All internal links valid')
          } else {
            failSpinner(`Found ${brokenLinks} broken links`)
          }
        } catch (err) {
          failSpinner('Link check failed')
          issues.push({
            type: 'error',
            message: `Link check failed: ${(err as Error).message}`,
          })
        }
      }

      // Print results
      const errors = issues.filter((i) => i.type === 'error')
      const warnings = issues.filter((i) => i.type === 'warning')

      printSummary('📋 Verification Results', [
        { label: 'Duration', value: formatDuration(Date.now() - startTime) },
        {
          label: 'Errors',
          value: errors.length,
          color: errors.length > 0 ? 'red' : 'green',
        },
        {
          label: 'Warnings',
          value: warnings.length,
          color: warnings.length > 0 ? 'yellow' : 'green',
        },
      ])

      if (issues.length > 0) {
        console.log('')
        for (const issue of issues) {
          if (issue.type === 'error') {
            error(issue.message)
          } else {
            warn(issue.message)
          }
        }
      }

      if (errors.length > 0) {
        process.exit(1)
      } else if (warnings.length === 0) {
        success('Documentation verification passed!')
      } else {
        info('Documentation verification completed with warnings')
      }
    } catch (err) {
      failSpinner('Verification failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Diff APIs command
program
  .command('diff')
  .description('Compare current APIs with a baseline to detect changes')
  .option('--baseline <path>', 'Path to baseline API data JSON file')
  .option('--output <format>', 'Output format (text, json, changelog)', 'text')
  .option('--config <path>', 'Path to config file')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: CLIOptions & { baseline?: string }) => {
    try {
      if (options.verbose) {
        configureLogger({ verbose: true })
      }

      const config = loadConfig(options.config)
      ensureDirectories(config)

      // Load current API data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      if (!existsSync(apiDataPath)) {
        error('No extracted API data found. Run extract-apis first.')
        process.exit(1)
      }

      startSpinner('Loading API data...')
      const currentData = JSON.parse(
        readFileSync(apiDataPath, 'utf-8')
      ) as Record<string, { apis: ExtractedAPI[] }>

      // Collect all current APIs
      const currentAPIs: ExtractedAPI[] = []
      for (const data of Object.values(currentData)) {
        currentAPIs.push(...data.apis)
      }

      // Load baseline data
      let baselineAPIs: ExtractedAPI[] = []
      const baselinePath =
        options.baseline ?? join(config.cacheDir, 'api-baseline.json')

      if (existsSync(baselinePath)) {
        const baselineData = JSON.parse(
          readFileSync(baselinePath, 'utf-8')
        ) as Record<string, { apis: ExtractedAPI[] }>
        for (const data of Object.values(baselineData)) {
          baselineAPIs.push(...data.apis)
        }
        succeedSpinner(
          `Loaded ${currentAPIs.length} current and ${baselineAPIs.length} baseline APIs`
        )
      } else {
        succeedSpinner('No baseline found - treating all APIs as new')
      }

      // Perform diff
      startSpinner('Analyzing changes...')
      const diffResult = diffAPIs(baselineAPIs, currentAPIs)
      succeedSpinner('Analysis complete')

      // Output based on format
      switch (options.output) {
        case 'json':
          console.log(formatDiffAsJSON(diffResult))
          break
        case 'changelog':
          console.log(formatDiffForChangelog(diffResult))
          break
        default:
          console.log(formatDiffAsText(diffResult))
      }

      // Save current as new baseline if no baseline existed
      if (!existsSync(baselinePath)) {
        writeFileSync(baselinePath, JSON.stringify(currentData, null, 2))
        info(`Saved current API data as baseline: ${baselinePath}`)
      }

      if (diffResult.summary.hasBreakingChanges) {
        warn('Breaking changes detected!')
        process.exit(1)
      }
    } catch (err) {
      failSpinner('Diff failed')
      error((err as Error).message)
      process.exit(1)
    }
  })

// Init config command
program
  .command('init')
  .description('Initialize docs-sync configuration file')
  .option('--force', 'Overwrite existing config file')
  .action(async (options: { force?: boolean }) => {
    const configPath = join(process.cwd(), '.docs-sync.json')

    if (existsSync(configPath) && !options.force) {
      error('Configuration file already exists. Use --force to overwrite.')
      process.exit(1)
    }

    const defaultConfig = {
      version: 1,
      rootDir: '.',
      docsDir: 'apps/docs/content',
      apiDataDir: '.docs-sync/api-data',
      cacheDir: '.docs-sync/cache',
      packages: [
        {
          name: '@clarity-chat/react',
          path: 'packages/react',
          entryPoints: ['src/index.ts'],
          docsPath: 'components',
          generateComponentDocs: true,
          generateHookDocs: true,
          generateTypeDocs: true,
        },
      ],
      docsRelevantPatterns: [
        'packages/*/src/**/*.ts',
        'packages/*/src/**/*.tsx',
      ],
      excludePatterns: [
        '**/node_modules/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
      templatesDir: 'tools/docs-sync/templates',
      baseUrl: '/docs',
      changelog: {
        outputPath: 'CHANGELOG.md',
        types: ['feat', 'fix', 'perf', 'refactor', 'docs'],
        includeBreaking: true,
      },
      ci: {
        botName: 'github-actions[bot]',
        botEmail: 'github-actions[bot]@users.noreply.github.com',
        commitPrefix: 'docs: auto-update documentation',
        createPR: false,
      },
    }

    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    success(`Created configuration file: ${configPath}`)
    info('Edit this file to customize your documentation sync settings.')
  })

// Parse and run
program.parse()
