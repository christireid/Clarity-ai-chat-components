/**
 * Prompt Template Engine
 *
 * Simple, flexible templating system for AI prompts.
 * No dependencies, fully customizable.
 */

import type {
  PromptTemplate,
  PromptVariable,
  RenderPromptOptions,
  PromptRenderResult,
} from './types'

export class PromptTemplateEngine {
  private delimiter = {
    start: '{{',
    end: '}}',
  }

  constructor(delimiter?: { start: string; end: string }) {
    if (delimiter) {
      this.delimiter = delimiter
    }
  }

  /**
   * Render a prompt template with variables
   */
  render(
    template: string | PromptTemplate,
    options: RenderPromptOptions
  ): PromptRenderResult {
    const templateStr =
      typeof template === 'string' ? template : template.template
    const templateObj = typeof template === 'object' ? template : undefined
    const delimiter = options.delimiter || this.delimiter

    const result: PromptRenderResult = {
      prompt: templateStr,
      usedVariables: [],
      success: true,
    }

    // Extract all variables from template
    const variablePattern = new RegExp(
      `${this.escapeRegExp(delimiter.start)}\\s*([\\w.]+)\\s*${this.escapeRegExp(delimiter.end)}`,
      'g'
    )

    const foundVariablesSet = new Set<string>()
    let match: RegExpExecArray | null

    while ((match = variablePattern.exec(templateStr)) !== null) {
      const varName = match[1]
      if (varName) foundVariablesSet.add(varName)
    }

    const foundVariables = Array.from(foundVariablesSet)

    // Validate required variables if template object provided
    if (options.validate && templateObj?.variables) {
      const errors: string[] = []
      const missing: string[] = []

      for (const variable of templateObj.variables) {
        if (variable.required && !(variable.name in options.variables)) {
          missing.push(variable.name)
          errors.push(`Missing required variable: ${variable.name}`)
        }

        if (variable.name in options.variables && variable.validate) {
          const validationResult = variable.validate(
            options.variables[variable.name]
          )
          if (validationResult !== true) {
            errors.push(
              typeof validationResult === 'string'
                ? validationResult
                : `Invalid value for variable: ${variable.name}`
            )
          }
        }
      }

      if (errors.length > 0) {
        result.errors = errors
        result.missingVariables = missing
        result.success = false
        return result
      }
    }

    // Replace variables
    let rendered = templateStr

    for (const varName of foundVariables) {
      const value = this.resolveVariable(varName, options.variables)

      if (value !== undefined) {
        result.usedVariables.push(varName)

        const varPattern = new RegExp(
          `${this.escapeRegExp(delimiter.start)}\\s*${this.escapeRegExp(varName)}\\s*${this.escapeRegExp(delimiter.end)}`,
          'g'
        )

        const stringValue = this.valueToString(value, options.escape)
        rendered = rendered.replace(varPattern, stringValue)
      }
    }

    // Post-processing
    if (options.trim) {
      rendered = rendered.trim()
    }

    result.prompt = rendered
    return result
  }

  /**
   * Extract variables from a template
   */
  extractVariables(template: string): string[] {
    const pattern = new RegExp(
      `${this.escapeRegExp(this.delimiter.start)}\\s*([\\w.]+)\\s*${this.escapeRegExp(this.delimiter.end)}`,
      'g'
    )

    const variablesSet = new Set<string>()
    let match: RegExpExecArray | null

    while ((match = pattern.exec(template)) !== null) {
      const varName = match[1]
      if (varName) variablesSet.add(varName)
    }

    return Array.from(variablesSet)
  }

  /**
   * Check if template is valid
   */
  validate(template: string | PromptTemplate): {
    valid: boolean
    errors?: string[]
  } {
    const templateStr =
      typeof template === 'string' ? template : template.template
    const errors: string[] = []

    // Check for unclosed variables
    const openCount = (
      templateStr.match(
        new RegExp(this.escapeRegExp(this.delimiter.start), 'g')
      ) || []
    ).length
    const closeCount = (
      templateStr.match(
        new RegExp(this.escapeRegExp(this.delimiter.end), 'g')
      ) || []
    ).length

    if (openCount !== closeCount) {
      errors.push('Mismatched variable delimiters')
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  private resolveVariable(
    path: string,
    variables: Record<string, unknown>
  ): unknown {
    // Support nested paths like "user.name"
    const parts = path.split('.')
    let value: unknown = variables

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }

    return value
  }

  private valueToString(value: unknown, escape?: boolean): string {
    let str: string

    if (typeof value === 'string') {
      str = value
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      str = String(value)
    } else if (Array.isArray(value)) {
      str = value.join(', ')
    } else if (typeof value === 'object' && value !== null) {
      str = JSON.stringify(value)
    } else {
      str = ''
    }

    if (escape) {
      str = this.escapeHtml(str)
    }

    return str
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}

/**
 * Quick render helper
 */
export function renderPrompt(
  template: string | PromptTemplate,
  variables: Record<string, unknown>,
  options?: Partial<RenderPromptOptions>
): string {
  const engine = new PromptTemplateEngine()
  const result = engine.render(template, {
    variables,
    trim: true,
    ...options,
  })

  if (!result.success) {
    throw new Error(`Prompt render failed: ${result.errors?.join(', ')}`)
  }

  return result.prompt
}
