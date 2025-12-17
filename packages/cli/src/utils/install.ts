/**
 * Package installation utilities
 */

import { execa } from 'execa'
import { getLogger } from './logger.js'

const logger = getLogger('install')

export async function installDependencies(
  cwd: string,
  packageManager: string,
  packages: string[]
): Promise<void> {
  logger.info(`Installing ${packages.length} packages with ${packageManager}`)

  const commands: Record<string, { cmd: string; args: string[] }> = {
    npm: { cmd: 'npm', args: ['install', ...packages] },
    yarn: { cmd: 'yarn', args: ['add', ...packages] },
    pnpm: { cmd: 'pnpm', args: ['add', ...packages] },
    bun: { cmd: 'bun', args: ['add', ...packages] },
  }

  const { cmd, args } = commands[packageManager] || commands.npm

  try {
    await execa(cmd, args, { cwd })
    logger.info('Installation complete')
  } catch (error) {
    logger.error('Installation failed', error)
    throw error
  }
}

export async function installDevDependencies(
  cwd: string,
  packageManager: string,
  packages: string[]
): Promise<void> {
  logger.info(`Installing ${packages.length} dev packages with ${packageManager}`)

  const commands: Record<string, { cmd: string; args: string[] }> = {
    npm: { cmd: 'npm', args: ['install', '--save-dev', ...packages] },
    yarn: { cmd: 'yarn', args: ['add', '--dev', ...packages] },
    pnpm: { cmd: 'pnpm', args: ['add', '-D', ...packages] },
    bun: { cmd: 'bun', args: ['add', '-d', ...packages] },
  }

  const { cmd, args } = commands[packageManager] || commands.npm

  try {
    await execa(cmd, args, { cwd })
    logger.info('Dev dependencies installed')
  } catch (error) {
    logger.error('Dev dependencies installation failed', error)
    throw error
  }
}
