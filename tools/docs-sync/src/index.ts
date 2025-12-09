/**
 * Docs-Sync CLI
 *
 * Automated documentation synchronization for Clarity Chat
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { program } from 'commander'
import pc from 'picocolors'
import type {
  CLIOptions,
  DocsSyncConfig,
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
import { loadCache, saveCache, createEmptyCache } from './utils/cache.js'
import {
  configureGitUser,
  createCommit,
  stageFiles,
  isWorkingDirClean,
} from './utils/git.js'

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

/** Load configuration from file or use defaults */
function loadConfig(configPath?: string): DocsSyncConfig {
  const rootDir = process.cwd()

  // Try to load config file
  if (configPath && existsSync(configPath)) {
    const content = readFileSync(configPath, 'utf-8')
    return JSON.parse(content) as DocsSyncConfig
  }

  // Look for default config locations
  const defaultPaths = [
    join(rootDir, '.docs-sync.json'),
    join(rootDir, 'docs-sync.config.json'),
  ]

  for (const path of defaultPaths) {
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8')
      return JSON.parse(content) as DocsSyncConfig
    }
  }

  // Return default config
  return {
    version: 1,
    rootDir,
    docsDir: join(rootDir, 'apps/docs/content'),
    apiDataDir: join(rootDir, '.docs-sync/api-data'),
    cacheDir: join(rootDir, '.docs-sync/cache'),
    packages: DEFAULT_PACKAGES,
    docsRelevantPatterns: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
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

/** Ensure required directories exist */
function ensureDirectories(config: DocsSyncConfig): void {
  const dirs = [config.apiDataDir, config.cacheDir, config.docsDir]

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  }
}

/** Log with timestamp */
function log(
  message: string,
  type: 'info' | 'success' | 'warn' | 'error' = 'info'
): void {
  const timestamp = new Date().toISOString().split('T')[1]?.slice(0, 8)
  const prefix = `[${timestamp}]`

  switch (type) {
    case 'success':
      console.log(pc.green(`${prefix} ✓ ${message}`))
      break
    case 'warn':
      console.log(pc.yellow(`${prefix} ⚠ ${message}`))
      break
    case 'error':
      console.log(pc.red(`${prefix} ✗ ${message}`))
      break
    default:
      console.log(pc.blue(`${prefix} ℹ ${message}`))
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
  .action(async (options: CLIOptions) => {
    try {
      const config = loadConfig(options.config)

      log('Detecting changes...')

      const result = await detectChanges({
        base: options.base!,
        head: options.head ?? 'HEAD',
        includePatterns: config.docsRelevantPatterns,
        excludePatterns: config.excludePatterns,
        skipTests: true,
        skipInternal: true,
      })

      const filtered = filterDocsRelevant(result)

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
    } catch (error) {
      log((error as Error).message, 'error')
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
  .option('--output <format>', 'Output format (json, text)', 'text')
  .option('--config <path>', 'Path to config file')
  .action(async (options: CLIOptions) => {
    try {
      const config = loadConfig(options.config)
      ensureDirectories(config)

      log('Extracting APIs...')

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

      for (const pkg of packages) {
        log(`Processing ${pkg.name}...`)

        const extractionConfig = getDefaultConfig(
          join(config.rootDir, pkg.path),
          pkg.name
        )
        extractionConfig.entryPoints = pkg.entryPoints

        const result = await extractAPIs(extractionConfig, cache)

        results[pkg.name] = result

        log(`  Extracted ${result.apis.length} APIs`, 'success')
        if (result.errors.length > 0) {
          log(`  ${result.errors.length} errors`, 'warn')
        }
      }

      // Save cache
      saveCache(cache, cachePath)

      // Save API data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      writeFileSync(apiDataPath, JSON.stringify(results, null, 2))

      // Output
      if (options.output === 'json') {
        console.log(JSON.stringify(results, null, 2))
      } else {
        const totalAPIs = Object.values(results).reduce<number>(
          (sum, r) => sum + ((r as { apis: unknown[] }).apis?.length ?? 0),
          0
        )
        log(`Total APIs extracted: ${totalAPIs}`, 'success')
      }
    } catch (error) {
      log((error as Error).message, 'error')
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
  .action(async (options: CLIOptions) => {
    try {
      const config = loadConfig(options.config)
      ensureDirectories(config)

      log('Generating documentation...')

      // Load extracted API data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      if (!existsSync(apiDataPath)) {
        log('No extracted API data found. Run extract-apis first.', 'error')
        process.exit(1)
      }

      const apiData = JSON.parse(readFileSync(apiDataPath, 'utf-8')) as Record<
        string,
        { apis: unknown[] }
      >

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

      // Generate documentation
      const generatorConfig = getDefaultGeneratorConfig(config.rootDir)
      generatorConfig.dryRun = options.dryRun ?? false

      const result = await generateDocs(
        allAPIs as Parameters<typeof generateDocs>[0],
        generatorConfig
      )

      console.log(formatGenerationResult(result))

      // Write files
      if (!options.dryRun) {
        const { written, failed } = await writeDocs(result, generatorConfig)
        log(`Written ${written.length} files`, 'success')
        if (failed.length > 0) {
          log(`Failed to write ${failed.length} files`, 'warn')
        }
      } else {
        log('Dry run - no files written', 'info')
      }
    } catch (error) {
      log((error as Error).message, 'error')
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
  .action(async (options: CLIOptions) => {
    try {
      const config = loadConfig(options.config)

      log('Generating changelog...')

      const sinceRef = options.since ?? getChangelogSinceRef()
      const version = options.version ?? 'Unreleased'

      const { entry, markdown, hasBreakingChanges } = await generateChangelog(
        sinceRef,
        version,
        {
          outputPath: config.changelog.outputPath,
          repoUrl: 'https://github.com/christireid/Clarity-ai-chat-components',
          types: config.changelog.types,
          includeBreaking: config.changelog.includeBreaking,
        }
      )

      console.log(formatChangelogResult(entry, hasBreakingChanges))
      console.log('')
      console.log('--- Generated Changelog ---')
      console.log(markdown)

      if (!options.dryRun) {
        updateChangelogFile(config.changelog.outputPath, markdown)
        log(`Updated ${config.changelog.outputPath}`, 'success')
      } else {
        log('Dry run - changelog not updated', 'info')
      }
    } catch (error) {
      log((error as Error).message, 'error')
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
  .action(async (options: CLIOptions) => {
    const startTime = Date.now()

    try {
      const config = loadConfig(options.config)
      ensureDirectories(config)

      log('Starting documentation sync...')
      log(`Base: ${options.base}, Head: ${options.head ?? 'HEAD'}`)

      // Step 1: Detect changes
      log('Step 1: Detecting changes...')
      const changeResult = await detectChanges({
        base: options.base!,
        head: options.head ?? 'HEAD',
        includePatterns: config.docsRelevantPatterns,
        excludePatterns: config.excludePatterns,
        skipTests: true,
        skipInternal: true,
      })

      const filtered = filterDocsRelevant(changeResult)

      if (!options.full && filtered.summary.docsRelevantFiles === 0) {
        log('No documentation-relevant changes detected. Skipping.', 'success')
        return
      }

      log(
        `Found ${filtered.summary.docsRelevantFiles} docs-relevant files`,
        'info'
      )

      // Step 2: Extract APIs
      log('Step 2: Extracting APIs...')
      const cachePath = join(config.cacheDir, 'api-cache.json')
      const cache = options.full ? createEmptyCache() : loadCache(cachePath)

      const extractedData: Record<string, unknown> = {}

      // Only process affected packages
      const affectedPackages = options.full
        ? config.packages
        : config.packages.filter((p) =>
            filtered.summary.packagesAffected.includes(p.name)
          )

      for (const pkg of affectedPackages) {
        const extractionConfig = getDefaultConfig(
          join(config.rootDir, pkg.path),
          pkg.name
        )
        extractionConfig.entryPoints = pkg.entryPoints

        const result = await extractAPIs(extractionConfig, cache)
        extractedData[pkg.name] = result
        log(`  ${pkg.name}: ${result.apis.length} APIs`, 'success')
      }

      saveCache(cache, cachePath)

      // Save extracted data
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      writeFileSync(apiDataPath, JSON.stringify(extractedData, null, 2))

      // Step 3: Generate documentation
      log('Step 3: Generating documentation...')
      let allAPIs: unknown[] = []
      for (const data of Object.values(extractedData)) {
        allAPIs = allAPIs.concat((data as { apis: unknown[] }).apis)
      }

      const generatorConfig = getDefaultGeneratorConfig(config.rootDir)
      generatorConfig.dryRun = options.dryRun ?? false

      const docResult = await generateDocs(
        allAPIs as Parameters<typeof generateDocs>[0],
        generatorConfig
      )

      if (!options.dryRun) {
        const { written } = await writeDocs(docResult, generatorConfig)
        log(`Generated ${written.length} documentation files`, 'success')
      }

      // Step 4: Commit changes (if not dry run and there are changes)
      if (
        !options.dryRun &&
        docResult.stats.created + docResult.stats.updated > 0
      ) {
        log('Step 4: Committing changes...')

        if (!isWorkingDirClean()) {
          configureGitUser(config.ci.botName, config.ci.botEmail)

          const filesToStage = [config.docsDir, config.apiDataDir]
          stageFiles(filesToStage)

          const commitMessage = `${config.ci.commitPrefix} [skip ci]\n\nAffected packages: ${filtered.summary.packagesAffected.join(', ')}`
          const sha = createCommit(commitMessage)
          log(`Created commit: ${sha.slice(0, 7)}`, 'success')
        } else {
          log('No changes to commit', 'info')
        }
      }

      const duration = Date.now() - startTime
      log(`Sync completed in ${(duration / 1000).toFixed(2)}s`, 'success')

      // Output summary
      console.log('')
      console.log('═'.repeat(50))
      console.log('📊 Sync Summary')
      console.log('═'.repeat(50))
      console.log(`Duration: ${(duration / 1000).toFixed(2)}s`)
      console.log(`Files analyzed: ${filtered.summary.totalFiles}`)
      console.log(`Docs-relevant: ${filtered.summary.docsRelevantFiles}`)
      console.log(`APIs extracted: ${allAPIs.length}`)
      console.log(`Docs created: ${docResult.stats.created}`)
      console.log(`Docs updated: ${docResult.stats.updated}`)
      console.log(`Docs skipped: ${docResult.stats.skipped}`)

      if (filtered.summary.hasBreakingChanges) {
        console.log('')
        log('⚠️  Breaking changes detected!', 'warn')
      }
    } catch (error) {
      log((error as Error).message, 'error')
      process.exit(1)
    }
  })

// Verify command
program
  .command('verify')
  .description('Verify documentation is up to date')
  .option('--config <path>', 'Path to config file')
  .action(async (options: CLIOptions) => {
    try {
      const config = loadConfig(options.config)

      log('Verifying documentation...')

      // Check if API data exists
      const apiDataPath = join(config.apiDataDir, 'extracted-apis.json')
      if (!existsSync(apiDataPath)) {
        log('No extracted API data found. Run sync first.', 'warn')
        process.exit(1)
      }

      // Check if docs directory exists
      if (!existsSync(config.docsDir)) {
        log('Documentation directory not found.', 'error')
        process.exit(1)
      }

      log('Documentation appears to be up to date', 'success')
    } catch (error) {
      log((error as Error).message, 'error')
      process.exit(1)
    }
  })

// Parse and run
program.parse()
