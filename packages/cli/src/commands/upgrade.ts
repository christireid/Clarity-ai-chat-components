/**
 * Upgrade command - Check for and install updates
 * Enhanced with beautiful UI components
 */

import { execSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, TableColumn } from '../ui/table.js'
import { createSpinner } from '../ui/progress.js'
import { successBox, warningBox, infoBox } from '../ui/box.js'

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
  const spinner = createSpinner('Checking for updates...')
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
 * Display update information with beautiful formatting
 */
function displayUpdates(updates: PackageUpdate[]) {
  console.log()
  console.log(sectionHeader('📦 Available Updates'))
  console.log()

  // Group updates by type
  const majorUpdates = updates.filter(u => u.type === 'major')
  const minorUpdates = updates.filter(u => u.type === 'minor')
  const patchUpdates = updates.filter(u => u.type === 'patch')

  // Create table columns
  const columns: TableColumn[] = [
    { header: 'Package', width: 35, color: chalk.yellow },
    { header: 'Current', width: 12, align: 'center', color: chalk.gray },
    { header: '→', width: 4, align: 'center', color: chalk.gray },
    { header: 'Latest', width: 12, align: 'center', color: chalk.green },
    { header: 'Type', width: 10, align: 'center' },
  ]

  // Display major updates
  if (majorUpdates.length > 0) {
    const majorData = majorUpdates.map(update => [
      update.name,
      update.current,
      '→',
      update.latest,
      chalk.red.bold('MAJOR'),
    ])

    console.log(chalk.red.bold('🔴 Major Updates (Breaking Changes)'))
    console.log(table(majorData, columns))
    console.log()
  }

  // Display minor updates
  if (minorUpdates.length > 0) {
    const minorData = minorUpdates.map(update => [
      update.name,
      update.current,
      '→',
      update.latest,
      chalk.yellow.bold('MINOR'),
    ])

    console.log(chalk.yellow.bold('🟡 Minor Updates (New Features)'))
    console.log(table(minorData, columns))
    console.log()
  }

  // Display patch updates
  if (patchUpdates.length > 0) {
    const patchData = patchUpdates.map(update => [
      update.name,
      update.current,
      '→',
      update.latest,
      chalk.green.bold('PATCH'),
    ])

    console.log(chalk.green.bold('🟢 Patch Updates (Bug Fixes)'))
    console.log(table(patchData, columns))
    console.log()
  }

  // Summary
  const summary = {
    'Major Updates': chalk.red(majorUpdates.length.toString()),
    'Minor Updates': chalk.yellow(minorUpdates.length.toString()),
    'Patch Updates': chalk.green(patchUpdates.length.toString()),
    'Total': chalk.cyan(updates.length.toString()),
  }

  console.log(infoBox(
    Object.entries(summary)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
    'Summary'
  ))
  console.log()
}

/**
 * Install updates
 */
async function installUpdates(updates: PackageUpdate[]) {
  const spinner = createSpinner('Installing updates...')
  spinner.start()

  try {
    const packageNames = updates.map(u => `${u.name}@${u.latest}`).join(' ')
    execSync(`npm install ${packageNames}`, {
      stdio: 'inherit',
    })

    spinner.succeed('Updates installed successfully!')
  } catch (error) {
    spinner.fail('Failed to install updates')
    throw error
  }
}

/**
 * Show changelog for a package
 */
async function showChangelog(packageName: string, version: string) {
  console.log()
  console.log(sectionHeader(`📋 Changelog for ${packageName}@${version}`))
  console.log()

  try {
    // Try to fetch changelog from GitHub
    const result = execSync(
      `npm view ${packageName} homepage`,
      { encoding: 'utf8', stdio: 'pipe' }
    )

    const homepage = result.trim()
    const changelogUrl = `${homepage}/blob/main/CHANGELOG.md`

    console.log(chalk.gray(`View full changelog: ${chalk.cyan(changelogUrl)}`))
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
  console.log()
  console.log(sectionHeader('🚀 Clarity Chat Upgrade Tool'))
  console.log()

  try {
    // Check for updates
    const updates = await checkForUpdates()

    if (updates.length === 0) {
      console.log(successBox('All packages are up to date!', '✓ Up to Date'))
      console.log()
      return
    }

    // Filter by type if specified
    let filteredUpdates = updates
    if (options.major) filteredUpdates = updates.filter(u => u.type === 'major')
    if (options.minor) filteredUpdates = updates.filter(u => u.type === 'minor')
    if (options.patch) filteredUpdates = updates.filter(u => u.type === 'patch')

    if (filteredUpdates.length === 0) {
      console.log(warningBox('No updates found for the specified type', '⚠ No Updates'))
      console.log()
      return
    }

    // Display updates
    displayUpdates(filteredUpdates)

    // Interactive mode
    if (options.interactive && !options.yes) {
      const { selectedUpdates } = await prompts({
        type: 'multiselect',
        name: 'selectedUpdates',
        message: 'Select packages to update:',
        choices: filteredUpdates.map(update => ({
          title: `${update.name} (${update.current} → ${update.latest})`,
          description: `${update.type} update`,
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
      console.log()
      console.log(warningBox(
        'Major updates installed! Please review breaking changes.',
        '⚠ Breaking Changes'
      ))
      console.log()

      for (const update of majorUpdates) {
        await showChangelog(update.name, update.latest)
      }
    }

    console.log()
    console.log(successBox('Upgrade complete!', '✓ Success'))
    console.log()
  } catch (error) {
    logger.error(error as Error)
    process.exit(1)
  }
}
