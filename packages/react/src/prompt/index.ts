/**
 * Prompt & Token Optimization Layer
 * 
 * Optional addon layer for advanced prompt composition and token optimization
 */

// Core utilities (framework-agnostic)
export * from './core'

// React hooks
export * from './hooks'

// Re-export existing prompt template system for convenience
// (These are also available via '../prompts' export from main index)
export type {
  PromptVariable,
  SavedPrompt,
  PromptTemplate,
} from '../prompts'
export { PromptTemplateEngine, renderPrompt } from '../prompts'
