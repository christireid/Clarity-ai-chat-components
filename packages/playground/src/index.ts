/**
 * Clarity Chat Playground
 *
 * Interactive component playground and REPL for Clarity Chat.
 *
 * @packageDocumentation
 */

// Types
export type {
  PlaygroundTemplate,
  PlaygroundTemplateCategory,
  PlaygroundState,
  PlaygroundSettings,
  PlaygroundError,
  ConsoleLogEntry,
  PlaygroundExportConfig,
  ClarityPlaygroundProps,
} from './types'

// Components
export { LivePreview } from './components/LivePreview'
export { ComponentLibrary } from './components/ComponentLibrary'
export { ConsolePanel } from './components/ConsolePanel'

// Templates
export {
  templates,
  templateCategories,
  getTemplateById,
  getTemplatesByCategory,
  searchTemplates,
  legacyTemplates,
} from './templates/index'

// Utilities
export {
  // URL State
  compress,
  decompress,
  encodePlaygroundState,
  decodePlaygroundState,
  createShareableUrl,
  parseUrlState,
  updateUrlState,
  clearUrlState,
  copyShareableUrl,
  estimateCompressionRatio,
  isShareable,
  // Export
  generateCodeSandboxUrl,
  generateStackBlitzUrl,
  openInCodeSandbox,
  openInStackBlitz,
  downloadAsZip,
  copyCode,
} from './utils'

// Re-export legacy templates for backwards compatibility
export { legacyTemplates as templates_legacy } from './templates/index'
