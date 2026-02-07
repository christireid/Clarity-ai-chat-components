/**
 * Enterprise Utilities
 * Common utilities for enterprise features
 * Extends the primitives library with enterprise-specific functionality
 */

import { existsSync, mkdirSync } from 'fs'
import {
  formatBytes,
  formatTimestamp,
  calculatePercentage,
  clamp,
  debounce,
  generateUniqueFilename,
  parseFileSize,
  validateConfig,
} from './utils.js'

export {
  formatBytes,
  formatTimestamp,
  calculatePercentage,
  clamp,
  debounce,
  generateUniqueFilename,
  parseFileSize,
  validateConfig,
}

/**
 * Ensure directories exist
 */
export function ensureDirectories(directories: string[]): void {
  directories.forEach((dir) => {
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    } catch (error) {
      throw new Error(`Failed to create directory ${dir}: ${error}`)
    }
  })
}
