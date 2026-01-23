/**
 * Tool Implementation Validator
 *
 * Validates tool implementations for security and correctness before registration.
 * Helps prevent malicious or poorly-implemented tools from being executed.
 *
 * **Security Checks**:
 * - Detects dangerous patterns (eval, Function constructor)
 * - Validates execute function signature
 * - Checks for required properties
 * - Validates parameter schema
 * - Detects potential code injection vectors
 *
 * @module core/tool-implementation-validator
 */

import type { ToolDefinition } from '../types/tool-definition'

// =============================================================================
// Validation Results
// =============================================================================

/**
 * Validation issue severity
 */
export type ValidationSeverity = 'error' | 'warning' | 'info'

/**
 * Validation issue
 */
export interface ValidationIssue {
  severity: ValidationSeverity
  code: string
  message: string
  field?: string
  suggestion?: string
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

// =============================================================================
// Dangerous Patterns
// =============================================================================

/**
 * Patterns that indicate potentially dangerous code
 */
const DANGEROUS_PATTERNS = [
  {
    pattern: /\beval\s*\(/,
    code: 'DANGEROUS_EVAL',
    message: 'Tool implementation uses eval() which is a security risk',
    suggestion:
      'Use safe alternatives like JSON.parse() or implement a safe parser',
  },
  {
    pattern: /\bnew\s+Function\s*\(/,
    code: 'DANGEROUS_FUNCTION_CONSTRUCTOR',
    message:
      'Tool implementation uses Function constructor which is a security risk',
    suggestion:
      'Define functions statically instead of constructing them at runtime',
  },
  {
    pattern: /\bexec\s*\(/,
    code: 'DANGEROUS_EXEC',
    message: 'Tool implementation may execute shell commands',
    suggestion: 'Avoid executing shell commands in tool implementations',
  },
  {
    pattern: /child_process|spawn|fork/,
    code: 'DANGEROUS_CHILD_PROCESS',
    message: 'Tool implementation may spawn child processes',
    suggestion: 'Avoid spawning child processes; use sandboxed alternatives',
  },
  {
    pattern: /\bvm\.|vm\.runInContext|vm\.runInNewContext/,
    code: 'DANGEROUS_VM_MODULE',
    message:
      'Tool implementation uses Node.js vm module (potential escape vector)',
    suggestion: 'Use isolated-vm for proper sandboxing instead of vm module',
  },
]

// =============================================================================
// Validator Implementation
// =============================================================================

/**
 * Validate tool implementation
 *
 * Performs security and correctness checks on a tool implementation.
 *
 * @param tool - Tool definition to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateToolImplementation(myTool)
 *
 * if (!result.valid) {
 *   console.error('Tool validation failed:')
 *   result.errors.forEach(error => {
 *     console.error(`  - ${error.message}`)
 *   })
 *   throw new Error('Invalid tool implementation')
 * }
 *
 * if (result.warnings.length > 0) {
 *   console.warn('Tool validation warnings:')
 *   result.warnings.forEach(warning => {
 *     console.warn(`  - ${warning.message}`)
 *   })
 * }
 * ```
 */
export function validateToolImplementation(
  tool: ToolDefinition
): ValidationResult {
  const issues: ValidationIssue[] = []

  // Check required fields
  if (!tool.name) {
    issues.push({
      severity: 'error',
      code: 'MISSING_NAME',
      field: 'name',
      message: 'Tool must have a name',
      suggestion: 'Provide a unique name for the tool',
    })
  }

  if (!tool.description) {
    issues.push({
      severity: 'warning',
      code: 'MISSING_DESCRIPTION',
      field: 'description',
      message: 'Tool should have a description',
      suggestion: 'Provide a clear description of what the tool does',
    })
  }

  // Check execute function
  if (!tool.execute) {
    issues.push({
      severity: 'error',
      code: 'MISSING_EXECUTE',
      field: 'execute',
      message: 'Tool must have an execute function',
      suggestion: 'Implement the execute function',
    })
  } else if (typeof tool.execute !== 'function') {
    issues.push({
      severity: 'error',
      code: 'INVALID_EXECUTE',
      field: 'execute',
      message: 'Tool execute must be a function',
      suggestion: 'Ensure execute is a function, not a ' + typeof tool.execute,
    })
  } else {
    // Check execute function signature
    const fnString = tool.execute.toString()

    // Check for dangerous patterns in execute function
    for (const { pattern, code, message, suggestion } of DANGEROUS_PATTERNS) {
      if (pattern.test(fnString)) {
        issues.push({
          severity: 'error',
          code,
          field: 'execute',
          message,
          suggestion,
        })
      }
    }

    // Check function length (too many parameters may indicate confusion)
    if (tool.execute.length > 2) {
      issues.push({
        severity: 'warning',
        code: 'SUSPICIOUS_SIGNATURE',
        field: 'execute',
        message: `Execute function has ${tool.execute.length} parameters (expected 1-2)`,
        suggestion: 'Execute function should accept (args) or (args, context)',
      })
    }
  }

  // Check parameter schema
  if (tool.parameters) {
    if (typeof tool.parameters !== 'object' || Array.isArray(tool.parameters)) {
      issues.push({
        severity: 'error',
        code: 'INVALID_PARAMETERS_SCHEMA',
        field: 'parameters',
        message: 'Parameters schema must be an object',
        suggestion: 'Use JSON Schema format for parameters',
      })
    } else {
      // Check that schema has required properties
      if (!tool.parameters.type) {
        issues.push({
          severity: 'warning',
          code: 'MISSING_SCHEMA_TYPE',
          field: 'parameters.type',
          message: 'Parameters schema should have a type field',
          suggestion: 'Add "type": "object" to the parameters schema',
        })
      }

      // Warn if no properties defined
      if (
        !tool.parameters.properties ||
        Object.keys(tool.parameters.properties).length === 0
      ) {
        issues.push({
          severity: 'info',
          code: 'NO_PARAMETERS',
          field: 'parameters.properties',
          message: 'Tool has no parameters defined',
          suggestion: 'If tool accepts parameters, define them in the schema',
        })
      }
    }
  } else {
    issues.push({
      severity: 'info',
      code: 'NO_PARAMETER_SCHEMA',
      field: 'parameters',
      message: 'Tool has no parameter schema',
      suggestion:
        'Define a parameter schema for better validation and documentation',
    })
  }

  // Check for timeout configuration
  if (tool.timeout !== undefined) {
    if (typeof tool.timeout !== 'number' || tool.timeout <= 0) {
      issues.push({
        severity: 'error',
        code: 'INVALID_TIMEOUT',
        field: 'timeout',
        message: 'Timeout must be a positive number',
        suggestion: 'Set timeout to a positive number of milliseconds',
      })
    } else if (tool.timeout > 60000) {
      issues.push({
        severity: 'warning',
        code: 'EXCESSIVE_TIMEOUT',
        field: 'timeout',
        message: `Timeout of ${tool.timeout}ms is very long (>1 minute)`,
        suggestion: 'Consider using a shorter timeout to prevent hanging',
      })
    }
  }

  // Check for caching configuration
  if (tool.cacheable === true && !tool.cacheKey) {
    issues.push({
      severity: 'warning',
      code: 'CACHEABLE_WITHOUT_KEY',
      field: 'cacheKey',
      message: 'Tool is cacheable but has no custom cache key function',
      suggestion: 'Implement cacheKey function for fine-grained cache control',
    })
  }

  // Check for dangerous tool names
  const dangerousNames = ['exec', 'eval', 'system', 'shell', 'command']
  if (dangerousNames.some((name) => tool.name.toLowerCase().includes(name))) {
    issues.push({
      severity: 'warning',
      code: 'SUSPICIOUS_TOOL_NAME',
      field: 'name',
      message: `Tool name "${tool.name}" suggests potentially dangerous operations`,
      suggestion:
        'Ensure tool implementation is properly sandboxed and validated',
    })
  }

  // Check for requiresApproval on sensitive tools
  const sensitivePatterns = ['delete', 'remove', 'destroy', 'drop', 'truncate']
  if (
    sensitivePatterns.some((pattern) =>
      tool.name.toLowerCase().includes(pattern)
    ) &&
    !tool.requiresApproval
  ) {
    issues.push({
      severity: 'warning',
      code: 'SENSITIVE_WITHOUT_APPROVAL',
      field: 'requiresApproval',
      message: `Tool "${tool.name}" performs sensitive operations but doesn't require approval`,
      suggestion: 'Set requiresApproval: true for destructive operations',
    })
  }

  // Separate by severity
  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')

  return {
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
  }
}

/**
 * Validate and throw on errors
 *
 * Validates tool implementation and throws an error if validation fails.
 * Logs warnings but allows registration.
 *
 * @param tool - Tool definition to validate
 * @throws {Error} If validation fails (has errors)
 *
 * @example
 * ```typescript
 * // This will throw if tool has errors
 * validateToolImplementationStrict(myTool)
 *
 * // If we get here, tool passed validation (may have warnings)
 * registry.register(myTool)
 * ```
 */
export function validateToolImplementationStrict(tool: ToolDefinition): void {
  const result = validateToolImplementation(tool)

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn(`[Tool Validation] Warnings for tool "${tool.name}":`)
    result.warnings.forEach((warning) => {
      console.warn(`  - ${warning.message}`)
      if (warning.suggestion) {
        console.warn(`    Suggestion: ${warning.suggestion}`)
      }
    })
  }

  // Throw on errors
  if (!result.valid) {
    const errorMessages = result.errors
      .map((err) => {
        let msg = `  - ${err.message}`
        if (err.suggestion) {
          msg += `\n    Suggestion: ${err.suggestion}`
        }
        return msg
      })
      .join('\n')

    throw new Error(
      `Tool implementation validation failed for "${tool.name}":\n${errorMessages}`
    )
  }
}

/**
 * Check if a tool implementation is safe
 *
 * Quick check to determine if a tool implementation passes basic security checks.
 *
 * @param tool - Tool definition to check
 * @returns True if tool passes security checks
 *
 * @example
 * ```typescript
 * if (isToolImplementationSafe(myTool)) {
 *   registry.register(myTool)
 * } else {
 *   console.error('Tool failed security checks')
 * }
 * ```
 */
export function isToolImplementationSafe(tool: ToolDefinition): boolean {
  const result = validateToolImplementation(tool)

  // Only check for security-related errors
  const securityCodes = [
    'DANGEROUS_EVAL',
    'DANGEROUS_FUNCTION_CONSTRUCTOR',
    'DANGEROUS_EXEC',
    'DANGEROUS_CHILD_PROCESS',
    'DANGEROUS_VM_MODULE',
  ]

  return !result.errors.some((err) => securityCodes.includes(err.code))
}

/**
 * Get validation summary
 *
 * Returns a human-readable summary of validation results.
 *
 * @param result - Validation result
 * @returns Summary string
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return '✓ Tool implementation is valid'
  }

  const parts: string[] = []

  if (!result.valid) {
    parts.push(`✗ ${result.errors.length} error(s)`)
  } else {
    parts.push('✓ Valid')
  }

  if (result.warnings.length > 0) {
    parts.push(`⚠ ${result.warnings.length} warning(s)`)
  }

  return parts.join(', ')
}
