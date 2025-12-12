/**
 * Prompt-related type definitions
 *
 * This module contains types for prompt templates, variables,
 * saved prompts, and prompt suggestions.
 *
 * @packageDocumentation
 */

/**
 * A variable that can be substituted in a prompt template.
 *
 * @example
 * ```typescript
 * const variable: PromptVariable = {
 *   name: 'language',
 *   description: 'Programming language to use',
 *   defaultValue: 'TypeScript',
 *   required: false,
 * }
 * ```
 */
export interface PromptVariable {
  /** Variable name (used in template as {{name}}) */
  name: string
  /** Description of what the variable is for */
  description?: string
  /** Default value if not provided */
  defaultValue?: string
  /** Whether this variable must be provided */
  required: boolean
}

/**
 * A user's saved prompt with usage tracking.
 *
 * @remarks
 * Saved prompts allow users to store and reuse frequently used
 * prompts with optional variable substitution.
 *
 * @example
 * ```typescript
 * const prompt: SavedPrompt = {
 *   id: 'prompt-1',
 *   userId: 'user-1',
 *   name: 'Code Review',
 *   content: 'Please review this {{language}} code:\n\n{{code}}',
 *   description: 'Get a detailed code review',
 *   category: 'Development',
 *   tags: ['code', 'review'],
 *   variables: [
 *     { name: 'language', required: true },
 *     { name: 'code', required: true },
 *   ],
 *   usageCount: 15,
 *   lastUsed: new Date(),
 *   isFavorite: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface SavedPrompt {
  /** Unique prompt identifier */
  id: string
  /** ID of the user who owns this prompt */
  userId: string
  /** Display name for the prompt */
  name: string
  /** Prompt content (may include {{variables}}) */
  content: string
  /** Description of the prompt's purpose */
  description?: string
  /** Category for organization */
  category?: string
  /** Tags for searching */
  tags: string[]
  /** Variables used in the prompt */
  variables: PromptVariable[]
  /** Number of times this prompt has been used */
  usageCount: number
  /** When the prompt was last used */
  lastUsed?: Date
  /** Whether this prompt is marked as favorite */
  isFavorite: boolean
  /** When the prompt was created */
  createdAt: Date
  /** When the prompt was last updated */
  updatedAt: Date
}

/**
 * Category for organizing prompts.
 *
 * @example
 * ```typescript
 * const category: PromptCategory = {
 *   id: 'cat-1',
 *   name: 'Development',
 *   description: 'Prompts for software development tasks',
 *   icon: 'code',
 *   promptCount: 12,
 * }
 * ```
 */
export interface PromptCategory {
  /** Unique category identifier */
  id: string
  /** Category name */
  name: string
  /** Category description */
  description?: string
  /** Icon identifier */
  icon?: string
  /** Number of prompts in this category */
  promptCount: number
}

/**
 * A reusable prompt template.
 *
 * @remarks
 * Templates are pre-defined prompts that can be shared publicly
 * or used as starting points for custom prompts.
 *
 * @example
 * ```typescript
 * const template: PromptTemplate = {
 *   id: 'template-1',
 *   name: 'Bug Report Analysis',
 *   content: 'Analyze this bug report and suggest solutions:\n\n{{bug_report}}',
 *   variables: [{ name: 'bug_report', required: true }],
 *   isPublic: true,
 * }
 * ```
 */
export interface PromptTemplate {
  /** Unique template identifier */
  id: string
  /** Template name */
  name: string
  /** Template content with variable placeholders */
  content: string
  /** Variables used in the template */
  variables: PromptVariable[]
  /** Whether this template is publicly available */
  isPublic: boolean
}

/**
 * A suggested prompt based on context.
 *
 * @remarks
 * Suggestions are generated based on conversation context
 * or user preferences to help with common tasks.
 *
 * @example
 * ```typescript
 * const suggestion: PromptSuggestion = {
 *   id: 'sug-1',
 *   text: 'Explain this code in detail',
 *   category: 'Explanation',
 *   relevance: 0.95,
 * }
 * ```
 */
export interface PromptSuggestion {
  /** Unique suggestion identifier */
  id: string
  /** Suggested prompt text */
  text: string
  /** Category of the suggestion */
  category?: string
  /** Relevance score (0-1) based on context */
  relevance: number
}
