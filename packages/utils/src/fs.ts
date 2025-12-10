/**
 * File system utilities for Clarity Chat
 *
 * @module @clarity-chat/utils/fs
 */

import { access } from 'fs/promises'

/**
 * Check if a path exists (file or directory)
 *
 * @param path - Path to check
 * @returns Promise<boolean> - true if path exists
 *
 * @example
 * ```ts
 * if (await pathExists('/path/to/file')) {
 *   // file exists
 * }
 * ```
 */
export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Alias for pathExists - check if a directory exists
 *
 * @param path - Path to check
 * @returns Promise<boolean>
 */
export const directoryExists = pathExists

/**
 * Alias for pathExists - check if a file exists
 *
 * @param path - Path to check
 * @returns Promise<boolean>
 */
export const fileExists = pathExists
