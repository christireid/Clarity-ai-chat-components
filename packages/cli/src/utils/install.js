/**
 * Package installation utilities
 */

import { execa } from 'execa'
import { detectPackageManager } from './detect.js'
import logger from './logger.js'

export async function installPackages(packages, options = {}) {
  const packageManager = options.packageManager || detectPackageManager()
  const isDev = options.dev || false
  const isExact = options.exact || false
  
  let command = packageManager
  let args = []
  
  switch (packageManager) {
    case 'yarn':
      args.push('add')
      if (isDev) args.push('-D')
      if (isExact) args.push('-E')
      break
    
    case 'pnpm':
      args.push('add')
      if (isDev) args.push('-D')
      if (isExact) args.push('-E')
      break
    
    case 'bun':
      args.push('add')
      if (isDev) args.push('-d')
      if (isExact) args.push('--exact')
      break
    
    default: // npm
      args.push('install')
      if (isDev) args.push('-D')
      if (isExact) args.push('-E')
      break
  }
  
  args.push(...packages)
  
  logger.info(`Installing packages with ${packageManager}...`)
  logger.debug(`Running: ${command} ${args.join(' ')}`)
  
  try {
    const { stdout } = await execa(command, args, {
      cwd: options.cwd || process.cwd(),
      stdio: options.silent ? 'pipe' : 'inherit'
    })
    
    logger.success(`Packages installed successfully`)
    return stdout
  } catch (error) {
    logger.error(`Failed to install packages: ${error.message}`)
    throw error
  }
}

export default {
  installPackages
}