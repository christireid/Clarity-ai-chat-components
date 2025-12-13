/**
 * Type definitions for Clarity Chat Playground
 */

// Re-export iframe protocol types
export {
  type LogLevel,
  type IframeError,
  type IframeMessage,
  isIframeMessage,
  type MessagePayload,
} from './types/iframe-protocol'

export interface PlaygroundTemplate {
  /** Unique identifier for the template */
  id: string
  /** Display name for the template */
  name: string
  /** Short description of what the template demonstrates */
  description: string
  /** Category for grouping templates */
  category: PlaygroundTemplateCategory
  /** The source code for this template */
  code: string
  /** Optional dependencies required by this template */
  dependencies?: Record<string, string>
  /** Optional main file name (defaults to 'App.tsx') */
  mainFile?: string
  /** Tags for filtering and searching */
  tags?: string[]
}

export type PlaygroundTemplateCategory =
  | 'getting-started'
  | 'chat-components'
  | 'streaming'
  | 'memory'
  | 'advanced'
  | 'patterns'
  | 'controls'

export interface PlaygroundState {
  /** Current code in the editor */
  code: string
  /** Selected template ID */
  templateId?: string
  /** Current theme */
  theme: 'light' | 'dark'
  /** Editor settings */
  settings: PlaygroundSettings
}

export interface PlaygroundSettings {
  /** Auto-run code on change */
  autoRun: boolean
  /** Show line numbers */
  lineNumbers: boolean
  /** Editor font size */
  fontSize: number
  /** Tab size */
  tabSize: number
  /** Word wrap */
  wordWrap: boolean
  /** Minimap visibility */
  minimap: boolean
}

export interface PlaygroundError {
  /** Error message */
  message: string
  /** Line number where error occurred */
  line?: number
  /** Column number where error occurred */
  column?: number
  /** Full stack trace */
  stack?: string
}

export interface ConsoleLogEntry {
  /** Unique ID for the entry */
  id: string
  /** Log level */
  level: 'log' | 'info' | 'warn' | 'error'
  /** Log message */
  message: string
  /** Timestamp */
  timestamp: Date
  /** Additional arguments */
  args?: unknown[]
}

export interface PlaygroundExportConfig {
  /** Code to export */
  code: string
  /** Title for the exported project */
  title?: string
  /** Description */
  description?: string
  /** Additional npm dependencies */
  dependencies?: Record<string, string>
  /** Dev dependencies */
  devDependencies?: Record<string, string>
}

export interface ClarityPlaygroundProps {
  /** Initial code to display */
  initialCode?: string
  /** Template to start with */
  template?: string
  /** Theme preference */
  theme?: 'light' | 'dark' | 'system'
  /** Show editor */
  showEditor?: boolean
  /** Show preview */
  showPreview?: boolean
  /** Show console */
  showConsole?: boolean
  /** Show file explorer */
  showFileExplorer?: boolean
  /** Enable sharing */
  enableSharing?: boolean
  /** Enable export */
  enableExport?: boolean
  /** Height of the playground */
  height?: string | number
  /** Additional class names */
  className?: string
  /** Callback when code changes */
  onCodeChange?: (code: string) => void
  /** Callback when an error occurs */
  onError?: (error: PlaygroundError) => void
}
