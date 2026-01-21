/**
 * Documentation Sync Rules Engine
 *
 * Defines rules for what documentation must be updated when code changes.
 * Zero tolerance for stale documentation.
 *
 * @module scripts/doc-sync-rules
 */

export interface SyncRule {
  /** Rule identifier */
  id: string
  /** Trigger condition */
  trigger: string
  /** Pattern to match in source code changes */
  pattern: RegExp
  /** Documentation targets that must be updated */
  updates: SyncTarget[]
}

export interface SyncTarget {
  /** Target type */
  target:
    | 'jsdoc'
    | 'readme'
    | 'api_docs'
    | 'examples'
    | 'tests'
    | 'storybook'
    | 'package_json'
  /** Action to take */
  action: string
}

export interface SyncViolation {
  /** Source file that changed */
  sourceFile: string
  /** Rule that was triggered */
  rule: string
  /** Documentation file missing update */
  missingUpdate: string
  /** Suggested action */
  action: string
}

/**
 * Documentation sync rules
 */
export const SYNC_RULES: SyncRule[] = [
  // Rule 1: Function signature changes
  {
    id: 'function-signature',
    trigger: 'function_signature_change',
    pattern: /export\s+(async\s+)?function\s+\w+\s*(<[^>]*>)?\s*\([^)]*\)/,
    updates: [
      { target: 'jsdoc', action: 'update_params_and_returns' },
      { target: 'readme', action: 'check_examples' },
      { target: 'examples', action: 'verify_compile' },
      { target: 'tests', action: 'verify_pass' },
    ],
  },

  // Rule 2: Class method changes
  {
    id: 'class-method',
    trigger: 'class_method_change',
    pattern: /^\s+(public|private|protected)?\s*(async\s+)?\w+\s*\([^)]*\)/m,
    updates: [
      { target: 'jsdoc', action: 'update_method_doc' },
      { target: 'readme', action: 'check_class_examples' },
    ],
  },

  // Rule 3: Type/Interface changes
  {
    id: 'type-change',
    trigger: 'type_change',
    pattern: /export\s+(type|interface)\s+\w+/,
    updates: [
      { target: 'jsdoc', action: 'update_type_references' },
      { target: 'readme', action: 'check_type_examples' },
    ],
  },

  // Rule 4: Hook signature changes
  {
    id: 'hook-change',
    trigger: 'hook_change',
    pattern: /export\s+function\s+use\w+/,
    updates: [
      { target: 'jsdoc', action: 'update_hook_doc' },
      { target: 'readme', action: 'update_react_section' },
      { target: 'examples', action: 'update_react_examples' },
    ],
  },

  // Rule 5: Component prop changes
  {
    id: 'component-props',
    trigger: 'component_props_change',
    pattern: /interface\s+\w+Props/,
    updates: [
      { target: 'jsdoc', action: 'update_props_doc' },
      { target: 'readme', action: 'check_component_examples' },
    ],
  },

  // Rule 6: Default value changes
  {
    id: 'default-change',
    trigger: 'default_change',
    pattern: /DEFAULT_|default.*=/,
    updates: [
      { target: 'jsdoc', action: 'update_default_mention' },
      { target: 'readme', action: 'update_defaults_table' },
    ],
  },

  // Rule 7: Export changes
  {
    id: 'export-change',
    trigger: 'export_change',
    pattern: /^export\s+\{/m,
    updates: [
      { target: 'readme', action: 'update_api_overview_table' },
      { target: 'package_json', action: 'verify_exports_field' },
    ],
  },
]

/**
 * Get target file path for a documentation target
 */
export function getTargetFile(
  sourceFile: string,
  target: string
): string | null {
  const baseName = sourceFile.replace(/\.tsx?$/, '')

  switch (target) {
    case 'readme':
      return 'README.md'
    case 'examples':
      return 'examples/README.md'
    case 'jsdoc':
      return sourceFile // JSDoc is in the same file
    case 'tests':
      return `src/__tests__/${baseName.split('/').pop()}.test.ts`
    case 'package_json':
      return 'package.json'
    default:
      return null
  }
}

/**
 * Check if a rule applies to a diff
 */
export function checkRuleApplies(rule: SyncRule, diff: string): boolean {
  return rule.pattern.test(diff)
}

/**
 * Get all applicable rules for a diff
 */
export function getApplicableRules(diff: string): SyncRule[] {
  return SYNC_RULES.filter((rule) => checkRuleApplies(rule, diff))
}
