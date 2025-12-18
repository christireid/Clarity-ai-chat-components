/**
 * Update checking utilities
 * Check for CLI updates and notify users
 */

import { execa } from 'execa'
import { getLogger } from './logger.js'
import { info, warn } from './output.js'

const logger = getLogger('update')

const CURRENT_VERSION = '0.1.0'
const NPM_REGISTRY = 'https://registry.npmjs.org'
const PACKAGE_NAME = '@clarity-chat/cli'

export interface UpdateInfo {
  current: string
  latest: string
  updateAvailable: boolean
  isMajor: boolean
  isMinor: boolean
  isPatch: boolean
}

/**
 * Check for updates
 */
export async function checkForUpdates(): Promise<UpdateInfo | null> {
  try {
    // Check npm registry for latest version
    const { stdout } = await execa(
      'npm',
      ['view', PACKAGE_NAME, 'version', '--registry', NPM_REGISTRY],
      {
        timeout: 5000,
      }
    )

    const latestVersion = stdout.trim()
    const updateAvailable = compareVersions(CURRENT_VERSION, latestVersion) < 0

    if (!updateAvailable) {
      return null
    }

    const versionDiff = getVersionDiff(CURRENT_VERSION, latestVersion)

    return {
      current: CURRENT_VERSION,
      latest: latestVersion,
      updateAvailable: true,
      isMajor: versionDiff === 'major',
      isMinor: versionDiff === 'minor',
      isPatch: versionDiff === 'patch',
    }
  } catch (error) {
    logger.debug('Failed to check for updates', error)
    return null
  }
}

/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0
    const part2 = parts2[i] || 0

    if (part1 < part2) return -1
    if (part1 > part2) return 1
  }

  return 0
}

/**
 * Get version difference type
 */
function getVersionDiff(
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
 * Notify user about available update
 */
export async function notifyUpdate(updateInfo: UpdateInfo): Promise<void> {
  const updateType = updateInfo.isMajor
    ? 'major'
    : updateInfo.isMinor
      ? 'minor'
      : 'patch'
  const updateEmoji = updateInfo.isMajor
    ? '🚀'
    : updateInfo.isMinor
      ? '✨'
      : '🔧'

  warn(
    `${updateEmoji} Update available: ${updateInfo.current} → ${updateInfo.latest} (${updateType})`
  )
  info(`Run: npm install -g ${PACKAGE_NAME}@latest`)
}

/**
 * Check and notify if update is available (non-blocking)
 */
export async function checkAndNotifyUpdate(): Promise<void> {
  try {
    const updateInfo = await checkForUpdates()
    if (updateInfo) {
      await notifyUpdate(updateInfo)
    }
  } catch (error) {
    // Silently fail - update checking should not block CLI usage
    logger.debug('Update check failed', error)
  }
}
