/**
 * @clarity-chat/utils
 *
 * Shared utility functions for Clarity Chat packages.
 * This package provides common utilities used across the codebase
 * to avoid duplication and ensure consistency.
 *
 * @packageDocumentation
 */

// Format utilities
export {
  formatBytes,
  formatDelta,
  formatDuration,
  formatNumber,
  formatPercent,
} from './format'

// File system utilities
export { pathExists, directoryExists, fileExists } from './fs'
