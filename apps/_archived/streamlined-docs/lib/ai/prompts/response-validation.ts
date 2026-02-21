/**
 * Response Quality Validation
 *
 * Validates AI responses against quality criteria including:
 * - Code example completeness and correctness
 * - Explanation clarity and depth
 * - Response completeness
 * - Citation accuracy
 * - Format adherence
 */

import type { ValidationCriteria } from './enhanced-system'

export interface ValidationResult {
  valid: boolean
  score: number // 0-1
  issues: ValidationIssue[]
  passed: ValidationCheck[]
  failed: ValidationCheck[]
  suggestions: string[]
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info'
  category: ValidationCategory
  message: string
  location?: string
  suggestion?: string
}

export interface ValidationCheck {
  name: string
  passed: boolean
  weight: number
  message?: string
}

export type ValidationCategory =
  | 'code_quality'
  | 'explanation_clarity'
  | 'completeness'
  | 'citation_accuracy'
  | 'format_adherence'
  | 'technical_accuracy'

export interface ResponseComponents {
  codeBlocks: CodeBlock[]
  explanations: string[]
  citations: Citation[]
  headings: string[]
  lists: string[]
  plainText: string
}

export interface CodeBlock {
  language: string
  code: string
  startLine: number
  endLine: number
}

export interface Citation {
  number: number
  text: string
  location: string
}

/**
 * Validate response quality against criteria
 */
export function validateResponse(
  response: string,
  criteria: ValidationCriteria,
  query: string
): ValidationResult {
  const components = parseResponseComponents(response)
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  // 1. Code Quality Validation (if code required)
  if (criteria.requireCodeExamples) {
    const codeChecks = validateCodeQuality(
      components.codeBlocks,
      criteria.codeQualityChecks
    )
    checks.push(...codeChecks.checks)
    issues.push(...codeChecks.issues)
    suggestions.push(...codeChecks.suggestions)
  }

  // 2. Explanation Quality Validation
  const explanationChecks = validateExplanationQuality(
    components.explanations,
    components.plainText,
    criteria.minExplanationDepth,
    query
  )
  checks.push(...explanationChecks.checks)
  issues.push(...explanationChecks.issues)
  suggestions.push(...explanationChecks.suggestions)

  // 3. Completeness Validation
  const completenessChecks = validateCompleteness(
    response,
    components,
    criteria.completenessChecks,
    query
  )
  checks.push(...completenessChecks.checks)
  issues.push(...completenessChecks.issues)
  suggestions.push(...completenessChecks.suggestions)

  // 4. Citation Validation (if citations required)
  if (criteria.requireCitations) {
    const citationChecks = validateCitations(components.citations, response)
    checks.push(...citationChecks.checks)
    issues.push(...citationChecks.issues)
    suggestions.push(...citationChecks.suggestions)
  }

  // 5. Format Validation
  const formatChecks = validateFormat(components, response)
  checks.push(...formatChecks.checks)
  issues.push(...formatChecks.issues)
  suggestions.push(...formatChecks.suggestions)

  // Calculate overall score
  const passed = checks.filter((c) => c.passed)
  const failed = checks.filter((c) => !c.passed)

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0)
  const passedWeight = passed.reduce((sum, check) => sum + check.weight, 0)
  const score = totalWeight > 0 ? passedWeight / totalWeight : 0

  // Response is valid if score >= 0.7 and no error-level issues
  const errorIssues = issues.filter((i) => i.severity === 'error')
  const valid = score >= 0.7 && errorIssues.length === 0

  return {
    valid,
    score,
    issues,
    passed,
    failed,
    suggestions,
  }
}

/**
 * Parse response into components for validation
 */
function parseResponseComponents(response: string): ResponseComponents {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const citationRegex = /\[(\d+)\]/g
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const listRegex = /^[\s]*[-*]\s+(.+)$/gm

  const codeBlocks: CodeBlock[] = []
  let match: RegExpExecArray | null

  // Extract code blocks
  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1] || 'plaintext'
    const code = match[2].trim()
    const startLine = response.substring(0, match.index).split('\n').length
    const endLine = startLine + code.split('\n').length

    codeBlocks.push({
      language,
      code,
      startLine,
      endLine,
    })
  }

  // Extract citations
  const citations: Citation[] = []
  const citationMatches = [...response.matchAll(citationRegex)]
  citationMatches.forEach((match) => {
    citations.push({
      number: parseInt(match[1], 10),
      text: match[0],
      location: `Character ${match.index}`,
    })
  })

  // Extract headings
  const headings: string[] = []
  while ((match = headingRegex.exec(response)) !== null) {
    headings.push(match[2])
  }

  // Extract lists
  const lists: string[] = []
  while ((match = listRegex.exec(response)) !== null) {
    lists.push(match[1])
  }

  // Extract explanations (paragraphs that aren't code or headings)
  const explanations = response
    .split('\n\n')
    .filter((para) => {
      return (
        para.trim().length > 50 &&
        !para.startsWith('#') &&
        !para.startsWith('```') &&
        !para.startsWith('-') &&
        !para.startsWith('*')
      )
    })

  // Plain text (without code blocks)
  const plainText = response.replace(/```[\s\S]*?```/g, '').trim()

  return {
    codeBlocks,
    explanations,
    citations,
    headings,
    lists,
    plainText,
  }
}

/**
 * Validate code quality
 */
function validateCodeQuality(
  codeBlocks: CodeBlock[],
  qualityChecks: ValidationCriteria['codeQualityChecks']
): {
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  suggestions: string[]
} {
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  if (codeBlocks.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'code_quality',
      message: 'No code examples found in response',
      suggestion: 'Add at least one code example to illustrate the concept',
    })
    return { checks, issues, suggestions }
  }

  codeBlocks.forEach((block, index) => {
    const blockId = `Code block ${index + 1}`

    // Check: Complete imports
    if (
      qualityChecks.some(
        (c) => c.name === 'complete_imports' && c.required
      )
    ) {
      const hasImports = /^import\s+/m.test(block.code)
      const hasFromClarity = /@clarity-chat\//.test(block.code)

      checks.push({
        name: 'complete_imports',
        passed: hasImports || block.language === 'bash' || block.language === 'json',
        weight: 0.9,
        message: hasImports ? 'Imports present' : 'Missing import statements',
      })

      if (!hasImports && block.language === 'tsx' && block.code.length > 100) {
        issues.push({
          severity: 'error',
          category: 'code_quality',
          message: `${blockId}: Missing import statements`,
          location: `Lines ${block.startLine}-${block.endLine}`,
          suggestion:
            'Add import statements for all used components and functions',
        })
      }
    }

    // Check: TypeScript types
    if (
      qualityChecks.some(
        (c) => c.name === 'typescript_types' && c.required
      )
    ) {
      const hasAny = /:\s*any\b/.test(block.code)
      const hasTypes =
        /:\s*\w+(\[\]|<[^>]+>)?/.test(block.code) ||
        /interface\s+\w+/.test(block.code) ||
        /type\s+\w+/.test(block.code)

      checks.push({
        name: 'typescript_types',
        passed: (hasTypes && !hasAny) || block.language !== 'tsx',
        weight: 0.85,
        message: hasAny ? 'Contains `any` types' : hasTypes ? 'Proper types used' : 'Missing type annotations',
      })

      if (hasAny) {
        issues.push({
          severity: 'warning',
          category: 'code_quality',
          message: `${blockId}: Contains \`any\` types`,
          location: `Lines ${block.startLine}-${block.endLine}`,
          suggestion: 'Replace `any` with specific types',
        })
      }

      if (!hasTypes && block.language === 'tsx' && block.code.includes('function')) {
        suggestions.push(
          `${blockId}: Add explicit TypeScript types to parameters and return values`
        )
      }
    }

    // Check: Inline comments
    if (
      qualityChecks.some(
        (c) => c.name === 'inline_comments' && c.required
      )
    ) {
      const commentLines = (block.code.match(/\/\/.+/g) || []).length
      const codeLines = block.code.split('\n').filter((l) => l.trim()).length
      const commentRatio = commentLines / Math.max(codeLines, 1)

      const hasEnoughComments = commentRatio >= 0.1 || codeLines < 10

      checks.push({
        name: 'inline_comments',
        passed: hasEnoughComments,
        weight: 0.6,
        message: hasEnoughComments
          ? 'Adequate comments'
          : 'Insufficient comments',
      })

      if (!hasEnoughComments && codeLines > 15) {
        suggestions.push(
          `${blockId}: Add comments to explain complex logic (${commentLines} comments for ${codeLines} lines)`
        )
      }
    }

    // Check: Error handling
    if (
      qualityChecks.some(
        (c) => c.name === 'error_handling' && c.required
      )
    ) {
      const hasTryCatch = /try\s*{[\s\S]*?}\s*catch/.test(block.code)
      const hasErrorCheck = /if\s*\([^)]*error/i.test(block.code)
      const hasErrorHandling = hasTryCatch || hasErrorCheck

      checks.push({
        name: 'error_handling',
        passed: hasErrorHandling || block.code.length < 200,
        weight: 0.7,
        message: hasErrorHandling
          ? 'Error handling present'
          : 'No error handling',
      })

      if (!hasErrorHandling && block.code.length > 300) {
        suggestions.push(
          `${blockId}: Add error handling for robustness (try/catch or error checks)`
        )
      }
    }

    // Check: Best practices
    if (
      qualityChecks.some(
        (c) => c.name === 'best_practices' && c.required
      )
    ) {
      const issues: string[] = []

      // Check for common anti-patterns
      if (/useState\(\)/.test(block.code)) {
        issues.push('useState without initial value')
      }
      if (/useEffect\(\(\)\s*=>[\s\S]*?\)\s*\)/.test(block.code)) {
        issues.push('useEffect without dependency array')
      }
      if (/console\.log/.test(block.code)) {
        issues.push('console.log in production code')
      }

      checks.push({
        name: 'best_practices',
        passed: issues.length === 0,
        weight: 0.8,
        message:
          issues.length === 0
            ? 'Follows best practices'
            : `Anti-patterns found: ${issues.join(', ')}`,
      })
    }
  })

  return { checks, issues, suggestions }
}

/**
 * Validate explanation quality
 */
function validateExplanationQuality(
  explanations: string[],
  plainText: string,
  minDepth: ValidationCriteria['minExplanationDepth'],
  query: string
): {
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  suggestions: string[]
} {
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  // Check: Has explanation
  const hasExplanation = explanations.length > 0 && plainText.length > 100

  checks.push({
    name: 'has_explanation',
    passed: hasExplanation,
    weight: 1.0,
    message: hasExplanation
      ? `${explanations.length} explanation paragraphs`
      : 'No explanation provided',
  })

  if (!hasExplanation) {
    issues.push({
      severity: 'error',
      category: 'explanation_clarity',
      message: 'Response lacks explanation',
      suggestion: 'Add explanatory paragraphs to help users understand',
    })
    return { checks, issues, suggestions }
  }

  // Check: Addresses "why"
  const addressesWhy =
    /\b(because|reason|why|purpose|enables|allows)\b/i.test(plainText)

  checks.push({
    name: 'addresses_why',
    passed: addressesWhy,
    weight: 0.85,
    message: addressesWhy ? 'Explains reasoning' : 'Lacks "why" explanation',
  })

  if (!addressesWhy) {
    suggestions.push(
      'Explain WHY the approach works or why the feature exists, not just HOW to use it'
    )
  }

  // Check: Depth appropriate for complexity
  const wordCount = plainText.split(/\s+/).length
  let minWords = 0
  let maxWords = 0

  if (minDepth === 'shallow') {
    minWords = 50
    maxWords = 200
  } else if (minDepth === 'moderate') {
    minWords = 150
    maxWords = 400
  } else {
    // deep
    minWords = 300
    maxWords = 800
  }

  const depthAppropriate = wordCount >= minWords && wordCount <= maxWords * 1.5

  checks.push({
    name: 'appropriate_depth',
    passed: depthAppropriate,
    weight: 0.8,
    message: depthAppropriate
      ? `Appropriate length (${wordCount} words)`
      : wordCount < minWords
        ? `Too brief (${wordCount} words, expected ${minWords}+)`
        : `Too verbose (${wordCount} words, expected <${maxWords})`,
  })

  if (wordCount < minWords) {
    suggestions.push(
      `Expand explanation to meet minimum depth for this query complexity (${wordCount}/${minWords} words)`
    )
  } else if (wordCount > maxWords * 1.5) {
    suggestions.push(
      `Consider condensing explanation (${wordCount} words, target ${maxWords})`
    )
  }

  // Check: Uses progressive disclosure
  const hasStructure =
    /^(##|###)\s+/m.test(plainText) || explanations.length >= 2

  checks.push({
    name: 'structured_explanation',
    passed: hasStructure,
    weight: 0.7,
    message: hasStructure
      ? 'Well-structured'
      : 'Lacks structure',
  })

  if (!hasStructure && wordCount > 200) {
    suggestions.push(
      'Use headings or multiple paragraphs to structure the explanation'
    )
  }

  return { checks, issues, suggestions }
}

/**
 * Validate response completeness
 */
function validateCompleteness(
  response: string,
  components: ResponseComponents,
  completenessChecks: ValidationCriteria['completenessChecks'],
  query: string
): {
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  suggestions: string[]
} {
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  // Check each completeness criterion
  completenessChecks.forEach((criterion) => {
    let passed = false
    let message = ''

    switch (criterion.name) {
      case 'direct_answer':
        // First paragraph should address the query
        const firstPara = components.plainText.split('\n\n')[0] || ''
        passed = firstPara.length > 50
        message = passed ? 'Direct answer in first paragraph' : 'Missing direct answer'
        break

      case 'code_example':
      case 'example_or_explanation':
        passed = components.codeBlocks.length > 0 || components.explanations.length > 1
        message = passed ? 'Examples provided' : 'Missing examples'
        break

      case 'comprehensive_explanation':
        passed = components.explanations.length >= 2 && components.plainText.length > 300
        message = passed ? 'Comprehensive explanation' : 'Explanation lacks depth'
        break

      case 'multiple_examples':
        passed = components.codeBlocks.length >= 2
        message = passed ? `${components.codeBlocks.length} examples` : 'Only one example'
        break

      case 'pitfalls':
        passed = /\b(avoid|pitfall|common mistake|gotcha|warning|note|important)\b/i.test(response)
        message = passed ? 'Pitfalls mentioned' : 'No pitfalls mentioned'
        break

      case 'tradeoffs':
        passed = /\b(trade-?off|pros? and cons?|advantage|disadvantage|versus|compared to)\b/i.test(response)
        message = passed ? 'Trade-offs discussed' : 'No trade-offs discussed'
        break

      case 'best_practices':
        passed = /\b(best practice|recommended|should|avoid|prefer)\b/i.test(response)
        message = passed ? 'Best practices mentioned' : 'No best practices'
        break

      case 'advanced_topics':
        passed = /\b(advanced|performance|optimization|production|scale)\b/i.test(response)
        message = passed ? 'Advanced topics covered' : 'No advanced topics'
        break

      default:
        passed = true
        message = 'Check not implemented'
    }

    checks.push({
      name: criterion.name,
      passed,
      weight: criterion.weight,
      message,
    })

    if (!passed && criterion.weight > 0.7) {
      suggestions.push(`Add ${criterion.description}`)
    }
  })

  return { checks, issues, suggestions }
}

/**
 * Validate citations
 */
function validateCitations(
  citations: Citation[],
  response: string
): {
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  suggestions: string[]
} {
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  // Check: Has citations
  const hasCitations = citations.length > 0

  checks.push({
    name: 'has_citations',
    passed: hasCitations,
    weight: 1.0,
    message: hasCitations
      ? `${citations.length} citations`
      : 'No citations found',
  })

  if (!hasCitations) {
    issues.push({
      severity: 'warning',
      category: 'citation_accuracy',
      message: 'Response lacks citations',
      suggestion:
        'Add citations in format [1], [2], etc. after factual claims',
    })
    return { checks, issues, suggestions }
  }

  // Check: Citations are sequential
  const citationNumbers = citations.map((c) => c.number).sort((a, b) => a - b)
  const sequential = citationNumbers.every(
    (num, idx) => num === idx + 1 || (idx > 0 && num === citationNumbers[idx - 1])
  )

  checks.push({
    name: 'sequential_citations',
    passed: sequential,
    weight: 0.6,
    message: sequential ? 'Citations sequential' : 'Citation numbering issues',
  })

  if (!sequential) {
    suggestions.push('Ensure citations are numbered sequentially starting from [1]')
  }

  // Check: Has source list
  const hasSourceList =
    /\n\n(Sources?|References?):\s*\n/i.test(response) ||
    /\[\d+\]\s+[^\n]+/m.test(response)

  checks.push({
    name: 'has_source_list',
    passed: hasSourceList,
    weight: 0.8,
    message: hasSourceList ? 'Source list present' : 'Missing source list',
  })

  if (!hasSourceList) {
    suggestions.push(
      'Add a "Sources:" section at the end listing all cited sources'
    )
  }

  return { checks, issues, suggestions }
}

/**
 * Validate response format
 */
function validateFormat(
  components: ResponseComponents,
  response: string
): {
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  suggestions: string[]
} {
  const checks: ValidationCheck[] = []
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  // Check: Has structure (headings or paragraphs)
  const hasStructure = components.headings.length > 0 || components.explanations.length > 1

  checks.push({
    name: 'has_structure',
    passed: hasStructure,
    weight: 0.7,
    message: hasStructure ? 'Well-structured' : 'Lacks structure',
  })

  // Check: Code blocks have language tags
  const codeBlocksTagged = components.codeBlocks.every(
    (block) => block.language && block.language !== 'plaintext'
  )

  checks.push({
    name: 'code_blocks_tagged',
    passed: codeBlocksTagged || components.codeBlocks.length === 0,
    weight: 0.5,
    message: codeBlocksTagged ? 'Code blocks tagged' : 'Some code blocks missing language tags',
  })

  if (!codeBlocksTagged) {
    suggestions.push('Add language identifiers to all code blocks (e.g., ```tsx)')
  }

  // Check: Reasonable length
  const wordCount = response.split(/\s+/).length
  const reasonableLength = wordCount >= 50 && wordCount <= 2000

  checks.push({
    name: 'reasonable_length',
    passed: reasonableLength,
    weight: 0.6,
    message: reasonableLength
      ? `Appropriate length (${wordCount} words)`
      : wordCount < 50
        ? 'Too short'
        : 'Too long',
  })

  return { checks, issues, suggestions }
}

/**
 * Get human-readable validation report
 */
export function formatValidationReport(result: ValidationResult): string {
  let report = `# Response Quality Report\n\n`
  report += `**Overall Score**: ${(result.score * 100).toFixed(1)}% ${result.valid ? '✅ PASS' : '❌ FAIL'}\n\n`

  if (result.failed.length > 0) {
    report += `## Failed Checks (${result.failed.length})\n\n`
    result.failed.forEach((check) => {
      report += `- ❌ **${check.name}** (weight: ${check.weight}): ${check.message}\n`
    })
    report += `\n`
  }

  if (result.issues.length > 0) {
    report += `## Issues (${result.issues.length})\n\n`
    result.issues.forEach((issue) => {
      const emoji = issue.severity === 'error' ? '🚨' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'
      report += `${emoji} **[${issue.category}]** ${issue.message}\n`
      if (issue.location) {
        report += `   Location: ${issue.location}\n`
      }
      if (issue.suggestion) {
        report += `   💡 ${issue.suggestion}\n`
      }
      report += `\n`
    })
  }

  if (result.suggestions.length > 0) {
    report += `## Suggestions for Improvement\n\n`
    result.suggestions.forEach((suggestion) => {
      report += `- ${suggestion}\n`
    })
    report += `\n`
  }

  report += `## Passed Checks (${result.passed.length})\n\n`
  result.passed.forEach((check) => {
    report += `- ✅ ${check.name}\n`
  })

  return report
}
