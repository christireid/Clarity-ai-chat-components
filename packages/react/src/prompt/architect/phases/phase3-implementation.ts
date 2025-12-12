/**
 * Phase 3: Implementation
 *
 * Utilities for the "Crafter" phase - style guide adherence, documentation
 * requirements, and legacy modernization (Boy Scout Rule).
 *
 * @packageDocumentation
 */

import type {
  StyleGuideRules,
  DocumentationRequirements,
  ImplementationOutput,
  ProgrammingLanguage,
  StyleGuide,
} from '../types'

// ============================================================================
// Style Guide Presets
// ============================================================================

/**
 * Pre-configured style guide presets
 */
export const STYLE_GUIDE_PRESETS: Record<
  string,
  StyleGuideRules
> = {
  'typescript-airbnb': {
    language: 'typescript',
    styleGuide: 'airbnb',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'kebab-case',
    },
    preferImmutability: true,
    strictTyping: true,
    maxLineLength: 100,
    indentation: 'spaces',
    indentSize: 2,
  },
  'typescript-google': {
    language: 'typescript',
    styleGuide: 'google',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'kebab-case',
    },
    preferImmutability: true,
    strictTyping: true,
    maxLineLength: 80,
    indentation: 'spaces',
    indentSize: 2,
  },
  'javascript-airbnb': {
    language: 'javascript',
    styleGuide: 'airbnb',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'kebab-case',
    },
    preferImmutability: true,
    strictTyping: false,
    maxLineLength: 100,
    indentation: 'spaces',
    indentSize: 2,
  },
  'javascript-standard': {
    language: 'javascript',
    styleGuide: 'standard',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'kebab-case',
    },
    preferImmutability: true,
    strictTyping: false,
    maxLineLength: 80,
    indentation: 'spaces',
    indentSize: 2,
  },
  'python-google': {
    language: 'python',
    styleGuide: 'google',
    naming: {
      variables: 'snake_case',
      functions: 'snake_case',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'snake_case',
    },
    preferImmutability: false,
    strictTyping: true,
    maxLineLength: 80,
    indentation: 'spaces',
    indentSize: 4,
  },
  'python-pep8': {
    language: 'python',
    styleGuide: 'custom',
    naming: {
      variables: 'snake_case',
      functions: 'snake_case',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'snake_case',
    },
    preferImmutability: false,
    strictTyping: true,
    maxLineLength: 79,
    indentation: 'spaces',
    indentSize: 4,
  },
  'go-standard': {
    language: 'go',
    styleGuide: 'custom',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'camelCase',
      files: 'snake_case',
    },
    preferImmutability: false,
    strictTyping: true,
    maxLineLength: 120,
    indentation: 'tabs',
    indentSize: 1,
  },
  'rust-standard': {
    language: 'rust',
    styleGuide: 'custom',
    naming: {
      variables: 'snake_case',
      functions: 'snake_case',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'snake_case',
    },
    preferImmutability: true,
    strictTyping: true,
    maxLineLength: 100,
    indentation: 'spaces',
    indentSize: 4,
  },
  'java-google': {
    language: 'java',
    styleGuide: 'google',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'PascalCase',
    },
    preferImmutability: true,
    strictTyping: true,
    maxLineLength: 100,
    indentation: 'spaces',
    indentSize: 2,
  },
  'csharp-microsoft': {
    language: 'csharp',
    styleGuide: 'custom',
    naming: {
      variables: 'camelCase',
      functions: 'PascalCase',
      classes: 'PascalCase',
      constants: 'PascalCase',
      files: 'PascalCase',
    },
    preferImmutability: false,
    strictTyping: true,
    maxLineLength: 120,
    indentation: 'spaces',
    indentSize: 4,
  },
}

/**
 * Get a style guide preset
 */
export function getStyleGuidePreset(
  language: ProgrammingLanguage,
  styleGuide: StyleGuide = 'airbnb'
): StyleGuideRules {
  const key = `${language}-${styleGuide}`
  if (STYLE_GUIDE_PRESETS[key]) {
    return STYLE_GUIDE_PRESETS[key]
  }

  // Fallback to language default
  const languageDefaults = Object.keys(STYLE_GUIDE_PRESETS).find((k) =>
    k.startsWith(`${language}-`)
  )
  if (languageDefaults) {
    return STYLE_GUIDE_PRESETS[languageDefaults]
  }

  // Ultimate fallback
  return STYLE_GUIDE_PRESETS['typescript-airbnb']
}

// ============================================================================
// Documentation Templates
// ============================================================================

/**
 * Documentation template generators
 */
export const DOCUMENTATION_TEMPLATES = {
  /**
   * Generate JSDoc template
   */
  jsdoc: (params: {
    description: string
    params?: Array<{ name: string; type: string; description: string }>
    returns?: { type: string; description: string }
    throws?: Array<{ type: string; description: string }>
    example?: string
  }): string => {
    const lines: string[] = ['/**']
    lines.push(` * ${params.description}`)

    if (params.params && params.params.length > 0) {
      lines.push(' *')
      for (const param of params.params) {
        lines.push(` * @param {${param.type}} ${param.name} - ${param.description}`)
      }
    }

    if (params.returns) {
      lines.push(' *')
      lines.push(` * @returns {${params.returns.type}} ${params.returns.description}`)
    }

    if (params.throws && params.throws.length > 0) {
      lines.push(' *')
      for (const t of params.throws) {
        lines.push(` * @throws {${t.type}} ${t.description}`)
      }
    }

    if (params.example) {
      lines.push(' *')
      lines.push(' * @example')
      for (const line of params.example.split('\n')) {
        lines.push(` * ${line}`)
      }
    }

    lines.push(' */')
    return lines.join('\n')
  },

  /**
   * Generate TypeScript doc comment
   */
  tsdoc: (params: {
    description: string
    params?: Array<{ name: string; description: string }>
    returns?: string
    throws?: string
    example?: string
    remarks?: string
  }): string => {
    const lines: string[] = ['/**']
    lines.push(` * ${params.description}`)

    if (params.remarks) {
      lines.push(' *')
      lines.push(' * @remarks')
      lines.push(` * ${params.remarks}`)
    }

    if (params.params && params.params.length > 0) {
      lines.push(' *')
      for (const param of params.params) {
        lines.push(` * @param ${param.name} - ${param.description}`)
      }
    }

    if (params.returns) {
      lines.push(' *')
      lines.push(` * @returns ${params.returns}`)
    }

    if (params.throws) {
      lines.push(' *')
      lines.push(` * @throws ${params.throws}`)
    }

    if (params.example) {
      lines.push(' *')
      lines.push(' * @example')
      lines.push(' * ```typescript')
      for (const line of params.example.split('\n')) {
        lines.push(` * ${line}`)
      }
      lines.push(' * ```')
    }

    lines.push(' */')
    return lines.join('\n')
  },

  /**
   * Generate Python docstring (Google style)
   */
  pythonDocstring: (params: {
    description: string
    args?: Array<{ name: string; type: string; description: string }>
    returns?: { type: string; description: string }
    raises?: Array<{ type: string; description: string }>
    example?: string
  }): string => {
    const lines: string[] = ['"""']
    lines.push(params.description)

    if (params.args && params.args.length > 0) {
      lines.push('')
      lines.push('Args:')
      for (const arg of params.args) {
        lines.push(`    ${arg.name} (${arg.type}): ${arg.description}`)
      }
    }

    if (params.returns) {
      lines.push('')
      lines.push('Returns:')
      lines.push(`    ${params.returns.type}: ${params.returns.description}`)
    }

    if (params.raises && params.raises.length > 0) {
      lines.push('')
      lines.push('Raises:')
      for (const r of params.raises) {
        lines.push(`    ${r.type}: ${r.description}`)
      }
    }

    if (params.example) {
      lines.push('')
      lines.push('Example:')
      lines.push('    >>>' + params.example.replace(/\n/g, '\n    >>> '))
    }

    lines.push('"""')
    return lines.join('\n')
  },
}

// ============================================================================
// Boy Scout Rule Utilities
// ============================================================================

/**
 * Legacy improvement types
 */
export type LegacyImprovementType =
  | 'ADD_TYPES'
  | 'EXTRACT_CONSTANTS'
  | 'ADD_ERROR_HANDLING'
  | 'IMPROVE_NAMING'
  | 'REMOVE_DEAD_CODE'
  | 'ADD_DOCUMENTATION'
  | 'SIMPLIFY_LOGIC'
  | 'FIX_FORMATTING'

/**
 * Legacy improvement suggestion
 */
export interface LegacyImprovement {
  type: LegacyImprovementType
  description: string
  before?: string
  after?: string
  priority: 'high' | 'medium' | 'low'
}

/**
 * Legacy improvement patterns and suggestions
 */
export const LEGACY_IMPROVEMENT_PATTERNS: Record<
  LegacyImprovementType,
  {
    name: string
    description: string
    indicators: string[]
    suggestion: string
  }
> = {
  ADD_TYPES: {
    name: 'Add Types',
    description: 'Add TypeScript types to untyped code',
    indicators: [
      'any type usage',
      'Implicit any parameters',
      'Missing return types',
      'Untyped object literals',
    ],
    suggestion: 'Add explicit types to improve type safety and documentation',
  },
  EXTRACT_CONSTANTS: {
    name: 'Extract Constants',
    description: 'Replace magic numbers/strings with named constants',
    indicators: [
      'Numbers like 86400, 3600, 1000',
      'Repeated strings',
      'Configuration values in code',
      'Array indices like [0], [1]',
    ],
    suggestion: 'Create named constants at module level with descriptive names',
  },
  ADD_ERROR_HANDLING: {
    name: 'Add Error Handling',
    description: 'Add proper error handling to unsafe operations',
    indicators: [
      'Uncaught promise rejections',
      'Missing try-catch blocks',
      'Silent error swallowing',
      'Generic catch handlers',
    ],
    suggestion: 'Add specific error handling with meaningful error messages',
  },
  IMPROVE_NAMING: {
    name: 'Improve Naming',
    description: 'Rename variables/functions for clarity',
    indicators: [
      'Single letter variables (except loops)',
      'Abbreviations (usr, msg, btn)',
      'Generic names (data, info, handler)',
      'Misleading names',
    ],
    suggestion: 'Use descriptive names that reveal intent',
  },
  REMOVE_DEAD_CODE: {
    name: 'Remove Dead Code',
    description: 'Remove unused or unreachable code',
    indicators: [
      'Commented-out code',
      'Unreachable statements',
      'Unused imports',
      'Unused variables',
    ],
    suggestion: 'Delete dead code - version control preserves history',
  },
  ADD_DOCUMENTATION: {
    name: 'Add Documentation',
    description: 'Add missing documentation to public interfaces',
    indicators: [
      'Exported functions without JSDoc',
      'Complex logic without comments',
      'Non-obvious parameter purposes',
      'Missing module documentation',
    ],
    suggestion: 'Add JSDoc/TSDoc comments to exported members',
  },
  SIMPLIFY_LOGIC: {
    name: 'Simplify Logic',
    description: 'Simplify overly complex logic',
    indicators: [
      'Deep nesting (>3 levels)',
      'Complex boolean expressions',
      'Long conditional chains',
      'Duplicated conditions',
    ],
    suggestion: 'Use guard clauses, extract methods, or simplify conditions',
  },
  FIX_FORMATTING: {
    name: 'Fix Formatting',
    description: 'Fix inconsistent formatting',
    indicators: [
      'Mixed indentation',
      'Inconsistent spacing',
      'Long lines',
      'Missing semicolons (if required)',
    ],
    suggestion: 'Apply consistent formatting according to style guide',
  },
}

/**
 * Create a legacy improvement suggestion
 */
export function createLegacyImprovement(
  type: LegacyImprovementType,
  description: string,
  options?: {
    before?: string
    after?: string
    priority?: 'high' | 'medium' | 'low'
  }
): LegacyImprovement {
  return {
    type,
    description,
    before: options?.before,
    after: options?.after,
    priority: options?.priority ?? 'medium',
  }
}

// ============================================================================
// Implementation Output Utilities
// ============================================================================

/**
 * Create an implementation output
 */
export function createImplementationOutput(params: {
  code: string
  language: ProgrammingLanguage
  suggestedFilePath?: string
  boyScoutRuleApplied?: boolean
  legacyImprovements?: string[]
  dependenciesAdded?: string[]
}): ImplementationOutput {
  return {
    code: params.code,
    language: params.language,
    suggestedFilePath: params.suggestedFilePath,
    boyScoutRuleApplied: params.boyScoutRuleApplied ?? false,
    legacyImprovements: params.legacyImprovements,
    dependenciesAdded: params.dependenciesAdded,
  }
}

/**
 * Format implementation output as markdown
 */
export function formatImplementationAsMarkdown(
  output: ImplementationOutput
): string {
  const lines: string[] = []

  lines.push('# Implementation Output')
  lines.push('')

  if (output.suggestedFilePath) {
    lines.push(`**Suggested File Path:** \`${output.suggestedFilePath}\``)
    lines.push('')
  }

  if (output.boyScoutRuleApplied && output.legacyImprovements) {
    lines.push('## Boy Scout Rule Improvements')
    lines.push('')
    lines.push('The following improvements were made to existing code:')
    lines.push('')
    for (const improvement of output.legacyImprovements) {
      lines.push(`- ${improvement}`)
    }
    lines.push('')
  }

  if (output.dependenciesAdded && output.dependenciesAdded.length > 0) {
    lines.push('## Dependencies Added')
    lines.push('')
    for (const dep of output.dependenciesAdded) {
      lines.push(`- ${dep}`)
    }
    lines.push('')
  }

  lines.push('## Code')
  lines.push('')
  lines.push('```' + output.language)
  lines.push(output.code)
  lines.push('```')

  return lines.join('\n')
}

/**
 * Generate a CODE block template
 */
export function generateCodeBlockTemplate(language: ProgrammingLanguage): string {
  return `<CODE language="${language}">
// Your implementation here
</CODE>`
}

/**
 * Validate code against style guide rules
 */
export function validateAgainstStyleGuide(
  code: string,
  rules: StyleGuideRules
): Array<{ line: number; issue: string; suggestion: string }> {
  const issues: Array<{ line: number; issue: string; suggestion: string }> = []
  const lines = code.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1

    // Check line length
    if (rules.maxLineLength && line.length > rules.maxLineLength) {
      issues.push({
        line: lineNumber,
        issue: `Line exceeds ${rules.maxLineLength} characters (${line.length})`,
        suggestion: 'Break into multiple lines or extract variables',
      })
    }

    // Check indentation
    const leadingWhitespace = line.match(/^(\s*)/)?.[1] ?? ''
    if (rules.indentation === 'spaces' && leadingWhitespace.includes('\t')) {
      issues.push({
        line: lineNumber,
        issue: 'Tab character found (spaces required)',
        suggestion: `Replace tabs with ${rules.indentSize} spaces`,
      })
    }
    if (rules.indentation === 'tabs' && leadingWhitespace.includes(' ')) {
      issues.push({
        line: lineNumber,
        issue: 'Space indentation found (tabs required)',
        suggestion: 'Replace spaces with tabs',
      })
    }

    // Check for 'any' type (TypeScript)
    if (rules.strictTyping && rules.language === 'typescript') {
      if (/:\s*any\b/.test(line) || /<any>/.test(line)) {
        issues.push({
          line: lineNumber,
          issue: 'Use of "any" type',
          suggestion: 'Replace with specific type or use "unknown"',
        })
      }
    }

    // Check for var keyword (JavaScript/TypeScript)
    if (
      rules.preferImmutability &&
      (rules.language === 'typescript' || rules.language === 'javascript')
    ) {
      if (/\bvar\s+/.test(line)) {
        issues.push({
          line: lineNumber,
          issue: 'Use of "var" keyword',
          suggestion: 'Use "const" or "let" instead',
        })
      }
    }
  }

  return issues
}

/**
 * Get documentation requirements based on language
 */
export function getDocumentationRequirements(
  language: ProgrammingLanguage
): DocumentationRequirements {
  return {
    requirePublicDocs: true,
    requireParamDocs: true,
    requireReturnDocs: true,
    requireThrowsDocs: true,
    requireExamples: language === 'python', // Python tradition of doctest
  }
}

/**
 * Generate documentation template for a function
 */
export function generateDocTemplate(
  language: ProgrammingLanguage,
  functionInfo: {
    name: string
    description: string
    params: Array<{ name: string; type: string; description: string }>
    returnType?: string
    returnDescription?: string
    throws?: Array<{ type: string; description: string }>
  }
): string {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return DOCUMENTATION_TEMPLATES.tsdoc({
        description: functionInfo.description,
        params: functionInfo.params.map((p) => ({
          name: p.name,
          description: p.description,
        })),
        returns: functionInfo.returnDescription
          ? `${functionInfo.returnDescription}`
          : undefined,
        throws: functionInfo.throws?.map((t) => t.description).join(', '),
      })

    case 'python':
      return DOCUMENTATION_TEMPLATES.pythonDocstring({
        description: functionInfo.description,
        args: functionInfo.params,
        returns: functionInfo.returnType
          ? { type: functionInfo.returnType, description: functionInfo.returnDescription ?? '' }
          : undefined,
        raises: functionInfo.throws,
      })

    default:
      return DOCUMENTATION_TEMPLATES.jsdoc({
        description: functionInfo.description,
        params: functionInfo.params,
        returns: functionInfo.returnType
          ? { type: functionInfo.returnType, description: functionInfo.returnDescription ?? '' }
          : undefined,
        throws: functionInfo.throws,
      })
  }
}
