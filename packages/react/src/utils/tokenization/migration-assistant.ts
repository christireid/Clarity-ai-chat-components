import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

export interface MigrationRule {
  from: string
  to: string
  description: string
  severity: 'low' | 'medium' | 'high'
  autoFixable: boolean
  examples: {
    before: string
    after: string
  }[]
}

export interface MigrationAnalysis {
  totalFiles: number
  affectedFiles: number
  totalIssues: number
  breakingChanges: number
  estimatedEffort: 'low' | 'medium' | 'high'
  recommendations: string[]
  rules: MigrationRule[]
}

export interface MigrationResult {
  success: boolean
  message: string
  changes: Array<{
    file: string
    line: number
    column: number
    oldCode: string
    newCode: string
    rule: string
  }>
  warnings: string[]
  errors: string[]
}

export interface LegacyAPI {
  name: string
  pattern: RegExp
  replacement: string
  description: string
}

export interface MigrationIssue {
  type: string
  line: number
  message: string
}

/**
 * Migration assistant for transitioning from legacy token counting to @clarity-chat/token-optimization
 */
export class TokenMigrationAssistant {
  private legacyAPIs: LegacyAPI[] = [
    {
      name: 'estimateTokens',
      pattern: /estimateTokens\s*\(\s*([^)]+)\s*\)/g,
      replacement: 'AccurateTokenCounter.count($1)',
      description: 'Replace estimateTokens with AccurateTokenCounter.count',
    },
    {
      name: 'estimateTokensByProvider',
      pattern: /estimateTokensByProvider\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
      replacement: 'AccurateTokenCounter.count($2)',
      description:
        'Replace estimateTokensByProvider with AccurateTokenCounter.count (model parameter removed)',
    },
    {
      name: 'countTokens',
      pattern: /countTokens\s*\(\s*([^)]+)\s*\)/g,
      replacement: 'AccurateTokenCounter.count($1)',
      description: 'Replace countTokens with AccurateTokenCounter.count',
    },
    {
      name: 'countConversationTokens',
      pattern: /countConversationTokens\s*\(\s*([^)]+)\s*\)/g,
      replacement: 'AccurateTokenCounter.count($1)',
      description:
        'Replace countConversationTokens with AccurateTokenCounter.count',
    },
    {
      name: 'legacyTokenCounter',
      pattern: /new\s+LegacyTokenCounter\s*\(\s*\)/g,
      replacement: 'TokenCounter',
      description: 'Replace LegacyTokenCounter instantiation',
    },
    {
      name: 'tiktoken',
      pattern: /tiktoken\.encode\s*\(\s*([^)]+)\s*\)\.length/g,
      replacement: 'AccurateTokenCounter.count($1)',
      description: 'Replace tiktoken encoding with AccurateTokenCounter.count',
    },
  ]

  private migrationRules: MigrationRule[] = [
    {
      from: 'estimateTokens(text)',
      to: 'AccurateTokenCounter.count(text)',
      description: 'Simple token estimation function',
      severity: 'low',
      autoFixable: true,
      examples: [
        {
          before: 'const tokens = estimateTokens(userInput);',
          after: 'const tokens = AccurateTokenCounter.count(userInput);',
        },
      ],
    },
    {
      from: 'estimateTokensByProvider(model, text)',
      to: 'AccurateTokenCounter.count(text)',
      description: 'Model-specific token estimation',
      severity: 'medium',
      autoFixable: true,
      examples: [
        {
          before: 'const tokens = estimateTokensByProvider("gpt-4", text);',
          after: 'const tokens = AccurateTokenCounter.count(text);',
        },
      ],
    },
    {
      from: 'countTokens(text)',
      to: 'AccurateTokenCounter.count(text)',
      description: 'Accurate token counting function',
      severity: 'low',
      autoFixable: true,
      examples: [
        {
          before: 'const tokens = countTokens(conversationText);',
          after: 'const tokens = AccurateTokenCounter.count(conversationText);',
        },
      ],
    },
    {
      from: 'countConversationTokens(messages)',
      to: 'AccurateTokenCounter.count(messages)',
      description: 'Conversation token counting',
      severity: 'medium',
      autoFixable: true,
      examples: [
        {
          before: 'const tokens = countConversationTokens(messageHistory);',
          after: 'const tokens = AccurateTokenCounter.count(messageHistory);',
        },
      ],
    },
    {
      from: 'LegacyTokenCounter',
      to: 'TokenCounter',
      description: 'Legacy token counter class',
      severity: 'high',
      autoFixable: true,
      examples: [
        {
          before: 'const counter = new LegacyTokenCounter();',
          after: '// Remove - TokenCounter is a static utility',
        },
      ],
    },
    {
      from: 'Model-specific ratios',
      to: 'Unified counting',
      description: 'Custom model ratios and caching',
      severity: 'high',
      autoFixable: false,
      examples: [
        {
          before: 'const ratio = getCharsPerToken("gpt-4"); // 4.0',
          after:
            '// Model-specific ratios are handled internally by TokenCounter',
        },
      ],
    },
  ]

  /**
   * Analyze codebase for migration requirements
   */
  public analyzeCodebase(codebase: string): MigrationAnalysis {
    const issues = this.findIssues(codebase)
    const affectedFiles = this.countAffectedFiles(codebase)
    const breakingChanges = issues.filter(
      (issue) =>
        this.migrationRules.find((rule) => rule.from.includes(issue.type))
          ?.severity === 'high'
    ).length

    const estimatedEffort = this.estimateEffort(issues.length, breakingChanges)
    const recommendations = this.generateRecommendations(
      issues,
      breakingChanges
    )

    return {
      totalFiles: this.countTotalFiles(codebase),
      affectedFiles,
      totalIssues: issues.length,
      breakingChanges,
      estimatedEffort,
      recommendations,
      rules: this.migrationRules,
    }
  }

  /**
   * Generate migration report
   */
  public generateReport(codebase: string): string {
    const analysis = this.analyzeCodebase(codebase)

    return `
# Token Counting Migration Report
Generated on: ${new Date().toISOString()}

## Summary
- **Total Files**: ${analysis.totalFiles}
- **Affected Files**: ${analysis.affectedFiles}
- **Total Issues**: ${analysis.totalIssues}
- **Breaking Changes**: ${analysis.breakingChanges}
- **Estimated Effort**: ${analysis.estimatedEffort.toUpperCase()}

## Migration Rules
${analysis.rules
  .map(
    (rule) => `
### ${rule.from} → ${rule.to}
- **Severity**: ${rule.severity}
- **Auto-fixable**: ${rule.autoFixable}
- **Description**: ${rule.description}
${rule.examples
  .map(
    (ex) => `
**Example:**
\`\`\`javascript
// Before
${ex.before}

// After
${ex.after}
\`\`\`
`
  )
  .join('')}
`
  )
  .join('')}

## Recommendations
${analysis.recommendations.map((rec) => `- ${rec}`).join('\n')}

## Next Steps
1. Review breaking changes and plan migration strategy
2. Run auto-fix for low and medium severity issues
3. Manually address high severity issues
4. Test thoroughly with your existing test suite
5. Update documentation and inform team members

## Important Notes
- Always backup your code before running automated migrations
- Test the migration on a development branch first
- Some manual adjustments may be required after auto-fix
- Monitor performance after migration as token counting behavior may differ slightly
`
  }

  /**
   * Auto-fix migration issues
   */
  public autoFix(codebase: string): MigrationResult {
    const changes: MigrationResult['changes'] = []
    const warnings: string[] = []
    const errors: string[] = []

    try {
      let modifiedCode = codebase

      // Apply auto-fixable rules
      this.migrationRules
        .filter((rule) => rule.autoFixable && rule.severity !== 'high')
        .forEach((rule) => {
          const replacements = this.findAndReplace(modifiedCode, rule)
          if (replacements.length > 0) {
            changes.push(...replacements)
            // Apply the replacements to modifiedCode
            replacements.forEach((replacement) => {
              modifiedCode = modifiedCode.replace(
                replacement.oldCode,
                replacement.newCode
              )
            })
          }
        })

      return {
        success: true,
        message: `Successfully applied ${changes.length} automatic fixes`,
        changes,
        warnings: [
          'Review all changes before committing',
          'Run your test suite to ensure functionality is preserved',
          'Some manual adjustments may be required',
        ],
        errors,
      }
    } catch (error) {
      return {
        success: false,
        message: `Auto-fix failed: ${error instanceof Error ? error.message : String(error)}`,
        changes,
        warnings,
        errors: [
          `Auto-fix error: ${error instanceof Error ? error.message : String(error)}`,
        ],
      }
    }
  }

  /**
   * Manual migration helper
   */
  public manualMigrate(codeFragment: string): {
    suggestions: string[]
    warnings: string[]
    examples: { before: string; after: string }[]
  } {
    const suggestions: string[] = []
    const warnings: string[] = []
    const examples: { before: string; after: string }[] = []

    // Find applicable rules
    const applicableRules = this.migrationRules.filter((rule) =>
      this.containsPattern(codeFragment, rule.from)
    )

    if (applicableRules.length === 0) {
      suggestions.push('No migration patterns found in this code fragment')
      return { suggestions, warnings, examples }
    }

    applicableRules.forEach((rule) => {
      suggestions.push(`${rule.from} → ${rule.to}: ${rule.description}`)
      warnings.push(`Severity: ${rule.severity}`)
      examples.push(...rule.examples)
    })

    return { suggestions, warnings, examples }
  }

  /**
   * Validate migration
   */
  public validateMigration(
    original: string,
    migrated: string
  ): {
    isValid: boolean
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []

    // Check for remaining legacy patterns
    const remainingIssues = this.findIssues(migrated)
    if (remainingIssues.length > 0) {
      issues.push(`${remainingIssues.length} legacy patterns still present`)
    }

    // Check for proper imports
    if (!migrated.includes('@clarity-chat/token-optimization')) {
      suggestions.push('Add import for @clarity-chat/token-optimization')
    }

    // Check for removed functionality
    if (
      original.includes('getCharsPerToken') &&
      !migrated.includes('getCharsPerToken')
    ) {
      suggestions.push(
        'Model-specific ratios are no longer needed - TokenCounter handles this internally'
      )
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    }
  }

  /**
   * Find issues in codebase
   */
  private findIssues(codebase: string): MigrationIssue[] {
    const issues: MigrationIssue[] = []

    this.legacyAPIs.forEach((api) => {
      const matches = codebase.match(api.pattern)
      if (matches) {
        const lines = codebase.split('\n')
        lines.forEach((line, index) => {
          if (api.pattern.test(line)) {
            issues.push({
              type: api.name,
              line: index + 1,
              message: `Legacy API found: ${api.description}`,
            })
          }
        })
      }
    })

    return issues
  }

  /**
   * Find and replace patterns
   */
  private findAndReplace(
    code: string,
    rule: MigrationRule
  ): MigrationResult['changes'] {
    const changes: MigrationResult['changes'] = []
    const lines = code.split('\n')

    lines.forEach((line, lineIndex) => {
      // Simple pattern matching - in production, use proper AST parsing
      if (line.includes(rule.from.split('(')[0])) {
        const newLine = this.applyRule(line, rule)
        if (newLine !== line) {
          changes.push({
            file: 'unknown', // Would be set by caller
            line: lineIndex + 1,
            column: 1,
            oldCode: line,
            newCode: newLine,
            rule: rule.from,
          })
        }
      }
    })

    return changes
  }

  /**
   * Apply migration rule
   */
  private applyRule(line: string, rule: MigrationRule): string {
    // Simple replacement - in production, use proper AST transformation
    if (rule.from.includes('estimateTokens')) {
      return line.replace(
        /estimateTokens\s*\([^)]+\)/g,
        rule.to.replace(
          'AccurateTokenCounter.count(text)',
          'AccurateTokenCounter.count($1)'
        )
      )
    }
    if (rule.from.includes('estimateTokensByProvider')) {
      return line.replace(
        /estimateTokensByProvider\s*\([^,]+,\s*[^)]+\)/g,
        rule.to.replace(
          'AccurateTokenCounter.count(text)',
          'AccurateTokenCounter.count($2)'
        )
      )
    }
    if (rule.from.includes('countTokens')) {
      return line.replace(
        /countTokens\s*\([^)]+\)/g,
        rule.to.replace(
          'AccurateTokenCounter.count(text)',
          'AccurateTokenCounter.count($1)'
        )
      )
    }
    if (rule.from.includes('countConversationTokens')) {
      return line.replace(
        /countConversationTokens\s*\([^)]+\)/g,
        rule.to.replace(
          'AccurateTokenCounter.count(messages)',
          'AccurateTokenCounter.count($1)'
        )
      )
    }

    return line
  }

  /**
   * Helper methods
   */
  private containsPattern(code: string, pattern: string): boolean {
    return code.includes(pattern.split('(')[0])
  }

  private countAffectedFiles(codebase: string): number {
    return this.findIssues(codebase).length
  }

  private countTotalFiles(codebase: string): number {
    return codebase
      .split('\n')
      .filter((line) => line.includes('import') || line.includes('require'))
      .length
  }

  private estimateEffort(
    totalIssues: number,
    breakingChanges: number
  ): 'low' | 'medium' | 'high' {
    if (breakingChanges > 0 || totalIssues > 50) return 'high'
    if (totalIssues > 20) return 'medium'
    return 'low'
  }

  private generateRecommendations(
    issues: MigrationIssue[],
    breakingChanges: number
  ): string[] {
    const recommendations: string[] = []

    if (breakingChanges > 0) {
      recommendations.push('Carefully review breaking changes before migration')
      recommendations.push('Test extensively in development environment')
    }

    if (issues.length > 20) {
      recommendations.push('Consider migrating in phases')
      recommendations.push('Start with non-critical components')
    }

    recommendations.push(
      'Update all imports to use @clarity-chat/token-optimization'
    )
    recommendations.push('Remove custom token counting logic')
    recommendations.push('Test token counting accuracy after migration')

    return recommendations
  }
}

// Export singleton instance
export const tokenMigrationAssistant = new TokenMigrationAssistant()

// Convenience functions
export function analyzeTokenMigration(codebase: string) {
  return tokenMigrationAssistant.analyzeCodebase(codebase)
}

export function generateMigrationReport(codebase: string) {
  return tokenMigrationAssistant.generateReport(codebase)
}

export function autoFixTokenMigration(codebase: string) {
  return tokenMigrationAssistant.autoFix(codebase)
}

export function manualMigrateTokens(codeFragment: string) {
  return tokenMigrationAssistant.manualMigrate(codeFragment)
}
