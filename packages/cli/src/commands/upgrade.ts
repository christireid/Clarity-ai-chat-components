/**
 * Upgrade command - Check for and install updates
 */

import { execSync } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import fs from 'fs-extra'
import path from 'path'
import { getLogger } from '../utils/logger.js'
import { ValidationError, handleError } from '../utils/errors.js'
import { detectPackageManager } from '../utils/detect.js'
import { success, info, warn, error, outputJson } from '../utils/output.js'
import { execa } from 'execa'
import { createBanner, createDivider } from '../ui/banner.js'
import { successMessage, infoMessage, warningMessage } from '../ui/messages.js'
import { createTable } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'

const logger = getLogger('upgrade')

interface PackageUpdate {
  name: string
  current: string
  latest: string
  type: 'major' | 'minor' | 'patch'
}

/**
 * Check for available updates
 */
async function checkForUpdates(): Promise<PackageUpdate[]> {
  const spinner = createSpinner('Checking for updates...', { color: 'cyan' })
  spinner.start()
  
  try {
    // Read package.json
    const packagePath = path.join(process.cwd(), 'package.json')
    if (!fs.existsSync(packagePath)) {
      spinner.fail('No package.json found')
      return []
    }

    const packageJson = await fs.readJSON(packagePath)
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    // Filter Clarity Chat packages
    const clarityPackages = Object.keys(dependencies).filter(name =>
      name.startsWith('@clarity-chat/')
    )

    if (clarityPackages.length === 0) {
      spinner.info('No Clarity Chat packages found')
      return []
    }

    const updates: PackageUpdate[] = []

    // Check each package
    for (const packageName of clarityPackages) {
      try {
        const result = execSync(`npm view ${packageName} version`, {
          encoding: 'utf8',
          stdio: 'pipe',
        })

        const latest = result.trim()
        const current = dependencies[packageName].replace(/^[\^~]/, '')

        if (latest !== current) {
          const type = determineUpdateType(current, latest)
          updates.push({
            name: packageName,
            current,
            latest,
            type,
          })
        }
      } catch (error) {
        // Package might not exist in registry yet
        continue
      }
    }

    spinner.succeed(`Found ${updates.length} update(s)`)
    return updates
  } catch (error) {
    spinner.fail('Failed to check for updates')
    throw error
  }
}

/**
 * Determine update type (major, minor, patch)
 */
function determineUpdateType(
  current: string,
  latest: string
): 'major' | 'minor' | 'patch' {
  const currentParts = current.split('.').map(Number)
  const latestParts = latest.split('.').map(Number)

  if (latestParts[0] > currentParts[0]) return 'major'
  if (latestParts[1] > currentParts[1]) return 'minor'
  return 'patch'
}

/**
 * Display update information
 */
async function displayUpdates(updates: PackageUpdate[]) {
  if (process.argv.includes('--json') || process.argv.includes('--quiet')) {
    // Simple output for JSON/quiet mode
    console.log(chalk.blue.bold('\n📦 Available Updates\n'))
    updates.forEach(update => {
      console.log(`${update.name}: ${update.current} → ${update.latest} (${update.type})`)
    })
    return
  }

  console.log()
  console.log(createBanner('Available Updates', { gradient: 'rainbow', border: true, borderColor: 'cyan' }))
  console.log()

  const majorUpdates = updates.filter(u => u.type === 'major')
  const minorUpdates = updates.filter(u => u.type === 'minor')
  const patchUpdates = updates.filter(u => u.type === 'patch')

  if (majorUpdates.length > 0) {
    console.log(chalk.bold.red('  🔴 Major Updates (Breaking Changes)'))
    console.log(createDivider(50, '─', 'red'))
    const majorRows = majorUpdates.map(update => [
      update.name,
      `${update.current} → ${update.latest}`,
    ])
    const majorTable = await createTable(['Package', 'Version'], majorRows, {
      headerColor: 'red',
      align: 'left',
    })
    console.log(majorTable)
    console.log()
  }

  if (minorUpdates.length > 0) {
    console.log(chalk.bold.yellow('  🟡 Minor Updates (New Features)'))
    console.log(createDivider(50, '─', 'yellow'))
    const minorRows = minorUpdates.map(update => [
      update.name,
      `${update.current} → ${update.latest}`,
    ])
    const minorTable = await createTable(['Package', 'Version'], minorRows, {
      headerColor: 'yellow',
      align: 'left',
    })
    console.log(minorTable)
    console.log()
  }

  if (patchUpdates.length > 0) {
    console.log(chalk.bold.green('  🟢 Patch Updates (Bug Fixes)'))
    console.log(createDivider(50, '─', 'green'))
    const patchRows = patchUpdates.map(update => [
      update.name,
      `${update.current} → ${update.latest}`,
    ])
    const patchTable = await createTable(['Package', 'Version'], patchRows, {
      headerColor: 'green',
      align: 'left',
    })
    console.log(patchTable)
    console.log()
  }
}

/**
 * Install updates
 */
async function installUpdates(updates: PackageUpdate[]) {
  const spinner = createSpinner('Installing updates...', { color: 'cyan' })
  spinner.start()

  try {
    const cwd = process.cwd()
    const packageManager = await detectPackageManager(cwd)
    const packageNames = updates.map(u => `${u.name}@${u.latest}`)
    
    const commands: Record<string, string[]> = {
      npm: ['install', ...packageNames],
      yarn: ['add', ...packageNames],
      pnpm: ['add', ...packageNames],
      bun: ['add', ...packageNames],
    }

    const cmd = commands[packageManager] || commands.npm
    
    await execa(packageManager === 'npm' ? 'npm' : packageManager, cmd, {
      cwd,
      stdio: 'inherit',
    })

    spinner.succeed('Updates installed successfully!')
    success('Updates installed successfully!')
  } catch (err) {
    spinner.fail('Failed to install updates')
    logger.error(err)
    throw new ValidationError(
      'Failed to install updates',
      [
        'Check your internet connection',
        'Verify package manager is installed',
        'Check package.json for conflicts',
      ]
    )
  }
}

/**
 * Show changelog for a package
 */
async function showChangelog(packageName: string, version: string) {
  console.log(chalk.blue.bold(`\n📋 Changelog for ${packageName}@${version}\n`))

  try {
    // Try to fetch changelog from GitHub
    const result = execSync(
      `npm view ${packageName} homepage`,
      { encoding: 'utf8', stdio: 'pipe' }
    )

    const homepage = result.trim()
    const changelogUrl = `${homepage}/blob/main/CHANGELOG.md`

    console.log(chalk.gray(`View full changelog: ${changelogUrl}`))
  } catch (error) {
    console.log(chalk.gray('Changelog not available'))
  }
}

/**
 * Main upgrade command
 */
export async function upgradeCommand(options: {
  interactive?: boolean
  yes?: boolean
  major?: boolean
  minor?: boolean
  patch?: boolean
}) {
  try {
    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log(chalk.blue.bold('\n🚀 Clarity Chat Upgrade Tool\n'))
    }
    // Check for updates
    const updates = await checkForUpdates()

    if (updates.length === 0) {
      success('All packages are up to date!')
      if (process.argv.includes('--json')) {
        outputJson({ updates: [], upToDate: true })
      }
      return
    }

    // Filter by type if specified
    let filteredUpdates = updates
    if (options.major) filteredUpdates = updates.filter(u => u.type === 'major')
    if (options.minor) filteredUpdates = updates.filter(u => u.type === 'minor')
    if (options.patch) filteredUpdates = updates.filter(u => u.type === 'patch')

    // Display updates
    await displayUpdates(filteredUpdates)

    // Interactive mode
    if (options.interactive && !options.yes) {
      const { selectedUpdates } = await prompts({
        type: 'multiselect',
        name: 'selectedUpdates',
        message: 'Select packages to update:',
        choices: filteredUpdates.map(update => ({
          title: `${update.name} (${update.current} → ${update.latest})`,
          value: update,
          selected: update.type === 'patch', // Auto-select patches
        })),
      })

      if (!selectedUpdates || selectedUpdates.length === 0) {
        console.log(chalk.gray('\nNo packages selected'))
        return
      }

      filteredUpdates = selectedUpdates
    } else if (!options.yes) {
      // Confirm before installing
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Install ${filteredUpdates.length} update(s)?`,
        initial: true,
      })

      if (!confirm) {
        console.log(chalk.gray('\nUpgrade cancelled'))
        return
      }
    }

    // Install updates
    await installUpdates(filteredUpdates)

    // Show changelogs for major updates
    const majorUpdates = filteredUpdates.filter(u => u.type === 'major')
    if (majorUpdates.length > 0) {
      console.log(chalk.yellow.bold('\n⚠️  Major updates installed!'))
      console.log(chalk.gray('Please review breaking changes:\n'))

      for (const update of majorUpdates) {
        await showChangelog(update.name, update.latest)
      }
    }

    if (!process.argv.includes('--json') && !process.argv.includes('--quiet')) {
      console.log()
      console.log(successMessage('Upgrade complete!', {
        title: '✨ Complete',
        borderColor: 'green',
      }))
    } else {
      success('Upgrade complete!')
    }
  } catch (error) {
    handleError(error)
  }
}

