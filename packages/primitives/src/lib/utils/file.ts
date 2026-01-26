/**
 * File Utilities
 * File manipulation and validation functions
 */

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(
  prefix: string,
  extension: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${timestamp}.${extension}`
}

/**
 * Parse file size string (e.g., "1.5 MB") to bytes
 */
export function parseFileSize(sizeStr: string): number {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  }

  const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i)
  if (!match) throw new Error(`Invalid file size format: ${sizeStr}`)

  const size = match[1]
  const unit = match[2]
  if (!size || !unit) throw new Error(`Invalid file size format: ${sizeStr}`)
  return parseFloat(size) * units[unit.toUpperCase() as keyof typeof units]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}
