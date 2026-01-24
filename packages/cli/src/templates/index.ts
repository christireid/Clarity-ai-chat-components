/**
 * Template System
 *
 * Centralized template definitions for all generators.
 * Templates use Handlebars syntax for variable interpolation.
 *
 * Template Context Variables:
 * - {{name}} - Original input name
 * - {{pascalName}} - PascalCase (ChatMessage)
 * - {{camelName}} - camelCase (chatMessage)
 * - {{kebabName}} - kebab-case (chat-message)
 * - {{description}} - Component description
 * - {{year}} - Current year
 * - {{author}} - Git author name
 * - {{provider}} - AI provider (openai, anthropic, google)
 * - {{withStreaming}} - Include streaming support
 * - {{withMemory}} - Include memory support
 */

// Re-export Handlebars with registered helpers
export { Handlebars, registerHelpers } from './helpers/handlebars.js'

// Component templates
import * as basicComponents from './components/basic.js'
import * as chatComponents from './components/chat.js'

// Hook templates
import * as hookTemplates from './hooks/index.js'

// Adapter templates
import * as adapterTemplates from './adapters/index.js'

// API templates
import * as apiTemplates from './api/routes.js'
import * as testTemplates from './api/test.js'

// ============================================================================
// Template Registry
// ============================================================================

/**
 * Consolidated template registry
 * All templates are organized by type for better maintainability
 */
export const TEMPLATES = {
  // Basic component templates
  component: basicComponents.component,
  componentIndex: basicComponents.componentIndex,
  componentTest: basicComponents.componentTest,
  componentStory: basicComponents.componentStory,

  // Chat-specific component templates
  chatComponent: chatComponents.chatComponent,
  chatComponentIndex: chatComponents.chatComponentIndex,
  chatComponentTest: chatComponents.chatComponentTest,
  chatComponentStory: chatComponents.chatComponentStory,

  // Hook templates
  hook: hookTemplates.hook,
  hookTest: hookTemplates.hookTest,

  // Context templates
  context: hookTemplates.context,
  contextTest: hookTemplates.contextTest,

  // Adapter templates
  adapter: adapterTemplates.adapter,
  adapterTest: adapterTemplates.adapterTest,

  // API route templates
  apiRoute: apiTemplates.apiRoute,

  // Test templates
  test: testTemplates.test,
} as const

// ============================================================================
// Template Compiler
// ============================================================================

import { Handlebars } from './helpers/handlebars.js'

/**
 * Compile a template with the given context
 */
export function compileTemplate(
  templateKey: keyof typeof TEMPLATES,
  context: Record<string, unknown>
): string {
  const template = TEMPLATES[templateKey]
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`)
  }

  const compiled = Handlebars.compile(template)
  return compiled(context)
}

/**
 * Get a raw template string
 */
export function getTemplate(templateKey: keyof typeof TEMPLATES): string {
  const template = TEMPLATES[templateKey]
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`)
  }
  return template
}

/**
 * List all available template keys
 */
export function getTemplateKeys(): string[] {
  return Object.keys(TEMPLATES)
}
