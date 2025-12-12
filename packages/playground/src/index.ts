/**
 * Clarity Chat Playground
 *
 * A commercial-grade interactive playground for testing and demonstrating
 * Clarity Chat components. Features include:
 *
 * - Live code preview with hot reloading
 * - Console output interception
 * - URL sharing with lz-string compression
 * - Export to CodeSandbox and StackBlitz
 * - Keyboard shortcuts
 * - Auto-save to localStorage
 * - Error boundaries with recovery
 * - 10+ production-ready templates
 *
 * @packageDocumentation
 */

// Main App component
export { default as App } from './App'

// Context and hooks
export {
  PlaygroundProvider,
  usePlayground,
  usePlaygroundState,
  usePlaygroundActions,
  usePlaygroundCode,
  usePlaygroundTheme,
  usePlaygroundSettings,
  usePlaygroundConsole,
} from './contexts/PlaygroundContext'

// Hooks
export {
  useKeyboardShortcuts,
  KEYBOARD_SHORTCUTS,
  getShortcutLabel,
} from './hooks/useKeyboardShortcuts'

// Components
export { LivePreview } from './components/LivePreview'
export { ConsolePanel } from './components/ConsolePanel'
export { ComponentLibrary } from './components/ComponentLibrary'
export { ErrorBoundary, PreviewErrorBoundary } from './components/ErrorBoundary'

// Templates
export {
  templates,
  getTemplateById,
  getTemplatesByCategory,
  searchTemplates,
  templateCategories,
  legacyTemplates,
} from './templates/index'

// Re-export legacy templates for backwards compatibility
export { legacyTemplates as templates_legacy } from './templates/index'

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
