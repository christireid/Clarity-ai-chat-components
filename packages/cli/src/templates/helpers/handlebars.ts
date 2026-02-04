/**
 * Handlebars Configuration and Helpers
 *
 * Centralized Handlebars setup with registered helpers for template rendering.
 */

import Handlebars from 'handlebars'
import { toPascalCase, toCamelCase, toKebabCase } from '../../utils/case.js'


// ============================================================================
// Helper Registration
// ============================================================================

/**
 * Register all Handlebars helpers
 * All helpers include null-safety to prevent crashes from missing variables
 */
export function registerHelpers(): void {
  // Case transformation helpers
  Handlebars.registerHelper('pascalCase', (str: string) =>
    toPascalCase(str || '')
  )
  Handlebars.registerHelper('camelCase', (str: string) => toCamelCase(str || ''))
  Handlebars.registerHelper('kebabCase', (str: string) => toKebabCase(str || ''))
  Handlebars.registerHelper('uppercase', (str: string) =>
    (str || '').toUpperCase()
  )
  Handlebars.registerHelper('lowercase', (str: string) =>
    (str || '').toLowerCase()
  )

  // Conditional helpers
  Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)
  Handlebars.registerHelper('or', (...args: unknown[]) => {
    // Remove the Handlebars options object (last argument)
    const values = args.slice(0, -1)
    return values.some(Boolean)
  })
}

// Auto-register helpers on module load
registerHelpers()

export { Handlebars }
