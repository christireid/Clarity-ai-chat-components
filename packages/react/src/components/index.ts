/**
 * Components Index
 *
 * This module provides organized access to all UI components.
 * Components are grouped by domain for better discoverability:
 *
 * - chat/         Core chat experience components
 * - message/      Message display and rendering
 * - input/        User input components
 * - search/       Search functionality
 * - dashboards/   Analytics and monitoring
 * - token/        Token management
 * - theme-components/  Theme UI components
 * - navigation/   Keyboard nav and command palette
 * - conversation/ Conversation management
 * - feedback/     Error handling and status
 * - media/        Documents and file handling
 * - ui/           Generic UI primitives
 * - ai/           AI-specific features
 * - prompt/       Prompt suggestions
 * - prompt-composer/ Progressive prompt system with token optimization
 * - context/      Context and memory management
 * - code/         Code display components
 * - enterprise/   Enterprise features
 * - ai-ops/       AI operations components
 */

// Message Components
export * from './message'

// Input Components
export * from './input'

// Search Components
export * from './search'

// Dashboard Components
export * from './dashboards'

// Token Management Components
export * from './token'

// Theme UI Components
export * from './theme-components'

// Navigation Components
export * from './navigation'

// Conversation Components
export * from './conversation'

// Feedback Components
export * from './feedback'

// Media Components
export * from './media'

// UI Primitives
export * from './ui'

// AI Components
export * from './ai'

// PromptComposer Components
export * from './prompt-composer'

// Context Components
export * from './context'

// Code Components
export * from './code'

// AI-Ops Components
export * from './ai-ops'

// Pro Components
export * from './pro'

// Comparison Components
export { BeforeAfterComparison, type BeforeAfterComparisonProps, type BeforeMetrics, type AfterMetrics, type StrategyContribution, type ComparisonType } from './BeforeAfterComparison'
