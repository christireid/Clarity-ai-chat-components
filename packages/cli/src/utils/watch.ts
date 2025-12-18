/**
 * Watch mode utilities for CLI
 * Enables auto-execution of commands on file changes
 */

import { watch } from 'fs'
import path from 'path'
import { getLogger } from './logger.js'

const logger = getLogger('watch')

export interface WatchOptions {
  cwd?: string
  patterns?: string[]
  ignore?: string[]
  debounce?: number
  onChange: (file: string) => Promise<void> | void
}

/**
 * Watch files and execute callback on changes
 */
export function watchFiles(options: WatchOptions): () => void {
  const {
    cwd = process.cwd(),
    patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignore = ['node_modules/**', 'dist/**', '.git/**'],
    debounce = 300,
    onChange,
  } = options

  let timeout: NodeJS.Timeout | null = null
  const watchedFiles = new Set<string>()

  const debouncedOnChange = (file: string) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(async () => {
      try {
        logger.debug(`File changed: ${file}`)
        await onChange(file)
      } catch (error) {
        logger.error('Error in watch callback', error)
      }
    }, debounce)
  }

  // Simple file watcher (can be enhanced with chokidar for better performance)
  const watchers: Array<{ close: () => void }> = []

  // Watch common directories
  const watchDirs = ['src', 'components', 'lib', 'app']
  
  watchDirs.forEach(dir => {
    const dirPath = path.join(cwd, dir)
    try {
      const watcher = watch(dirPath, { recursive: true }, (eventType, filename) => {
        if (filename && !ignore.some(pattern => filename.includes(pattern))) {
          const filePath = path.join(dirPath, filename)
          if (!watchedFiles.has(filePath)) {
            watchedFiles.add(filePath)
            debouncedOnChange(filePath)
          }
        }
      })
      watchers.push(watcher)
      logger.info(`Watching: ${dirPath}`)
    } catch (error) {
      // Directory might not exist, skip
      logger.debug(`Skipping watch for ${dirPath}: ${error}`)
    }
  })

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    watchers.forEach(watcher => watcher.close())
    logger.info('Stopped watching files')
  }
}

/**
 * Watch and rebuild on file changes
 */
export function watchAndRebuild(
  buildFn: () => Promise<void>,
  options: Omit<WatchOptions, 'onChange'> = {}
): () => void {
  return watchFiles({
    ...options,
    onChange: async () => {
      logger.info('Files changed, rebuilding...')
      await buildFn()
      logger.success('Rebuild complete')
    },
  })
}
