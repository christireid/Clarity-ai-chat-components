/**
 * Hallucination Detection
 *
 * Verifies AI responses are grounded in source documents
 * and detects potential hallucinations or unsupported claims
 */

import type { Source } from './citation-grounded-prompts'

export interface HallucinationCheck {
  isGrounded: boolean
  confidence: number
  issues: HallucinationIssue[]
  summary: string
}

export interface HallucinationIssue {
  type: 'uncited_claim' | 'contradicts_source' | 'unsupported_detail' | 'invented_api'
  claim: string
  severity: 'low' | 'medium' | 'high'
  suggestion?: string
}

/**
 * Check response for hallucinations using multiple heuristics
 *
 * This is a fast, deterministic check that doesn't require LLM calls
 *
 * @param response - AI-generated response
 * @param sources - Source documents
 * @param query - Original query
 * @returns Hallucination check result
 */
export function checkForHallucinations(
  response: string,
  sources: Source[],
  query: string
): HallucinationCheck {
  const issues: HallucinationIssue[] = []

  // Check 1: Are there uncited factual claims?
  const factualClaims = extractFactualClaims(response)
  const citedClaims = extractCitedClaims(response)

  for (const claim of factualClaims) {
    if (!citedClaims.some((cited) => cited.includes(claim.substring(0, 30)))) {
      issues.push({
        type: 'uncited_claim',
        claim,
        severity: 'medium',
        suggestion: 'Add citation or remove claim',
      })
    }
  }

  // Check 2: Does response contain specific details not in sources?
  const sourceContent = sources.map((s) => s.content.toLowerCase()).join(' ')
  const specificDetails = extractSpecificDetails(response)

  for (const detail of specificDetails) {
    if (!sourceContent.includes(detail.toLowerCase())) {
      issues.push({
        type: 'unsupported_detail',
        claim: detail,
        severity: 'high',
        suggestion: 'Verify this detail exists in source documentation',
      })
    }
  }

  // Check 3: Look for invented API names or methods
  const apiReferences = extractAPIReferences(response)
  for (const apiRef of apiReferences) {
    if (!sourceContent.includes(apiRef.toLowerCase())) {
      issues.push({
        type: 'invented_api',
        claim: apiRef,
        severity: 'high',
        suggestion: 'This API name may not exist in the documentation',
      })
    }
  }

  // Check 4: Look for contradictions
  const contradictions = findContradictions(response, sources)
  issues.push(...contradictions)

  // Calculate overall confidence
  const confidence = calculateGroundingConfidence(issues, sources.length)

  // Generate summary
  const summary = generateSummary(issues, confidence)

  return {
    isGrounded: issues.filter((i) => i.severity === 'high').length === 0,
    confidence,
    issues,
    summary,
  }
}

/**
 * Extract factual claims from text
 *
 * Identifies sentences that appear to make factual statements
 */
function extractFactualClaims(text: string): string[] {
  const sentences = text.split(/\.\s+/)

  return sentences.filter((sentence) => {
    const lower = sentence.toLowerCase()

    // Look for factual claim indicators
    return (
      lower.includes(' is ') ||
      lower.includes(' are ') ||
      lower.includes(' has ') ||
      lower.includes(' have ') ||
      lower.includes(' uses ') ||
      lower.includes(' provides ') ||
      lower.includes(' supports ') ||
      /\d+/.test(sentence) // Contains numbers
    )
  })
}

/**
 * Extract claims that have citations
 */
function extractCitedClaims(text: string): string[] {
  const sentences = text.split(/\.\s+/)

  return sentences.filter((sentence) => /\[\d+\]/.test(sentence))
}

/**
 * Extract specific details like version numbers, sizes, etc.
 */
function extractSpecificDetails(text: string): string[] {
  const details: string[] = []

  // Version numbers (v1.2.3, 2.0, etc.)
  const versions = text.match(/v?\d+\.\d+(\.\d+)?/g) || []
  details.push(...versions)

  // Specific numbers with units
  const measurements = text.match(/\d+\s*(ms|MB|KB|GB|px|%|seconds|minutes)/gi) || []
  details.push(...measurements)

  // Specific dates
  const dates = text.match(/\b\d{4}-\d{2}-\d{2}\b/g) || []
  details.push(...dates)

  return details
}

/**
 * Extract API references (hook names, component names, etc.)
 */
function extractAPIReferences(text: string): string[] {
  const references: string[] = []

  // React hooks (use*)
  const hooks = text.match(/\buse[A-Z]\w+/g) || []
  references.push(...hooks)

  // Component names (capitalized)
  const components = text.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)+/g) || []
  references.push(...components)

  // Method names with parentheses
  const methods = text.match(/\b\w+\(\)/g) || []
  references.push(...methods)

  return references
}

/**
 * Find contradictions between response and sources
 */
function findContradictions(response: string, sources: Source[]): HallucinationIssue[] {
  const issues: HallucinationIssue[] = []

  // Look for negations in response vs sources
  const responseNegations = extractNegations(response)

  for (const negation of responseNegations) {
    // Check if sources contradict this negation
    for (const source of sources) {
      if (source.content.toLowerCase().includes(negation.positive.toLowerCase())) {
        issues.push({
          type: 'contradicts_source',
          claim: negation.original,
          severity: 'high',
          suggestion: `This contradicts source: "${source.title}"`,
        })
      }
    }
  }

  return issues
}

/**
 * Extract negations from text (e.g., "does not support", "is not available")
 */
function extractNegations(text: string): Array<{ original: string; positive: string }> {
  const negations: Array<{ original: string; positive: string }> = []
  const sentences = text.split(/\.\s+/)

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase()

    if (
      lower.includes('does not') ||
      lower.includes("doesn't") ||
      lower.includes('is not') ||
      lower.includes("isn't") ||
      lower.includes('cannot') ||
      lower.includes("can't")
    ) {
      // Convert to positive form
      const positive = lower
        .replace(/does not /g, 'does ')
        .replace(/doesn't /g, 'does ')
        .replace(/is not /g, 'is ')
        .replace(/isn't /g, 'is ')
        .replace(/cannot /g, 'can ')
        .replace(/can't /g, 'can ')

      negations.push({
        original: sentence,
        positive,
      })
    }
  }

  return negations
}

/**
 * Calculate overall grounding confidence
 */
function calculateGroundingConfidence(issues: HallucinationIssue[], sourceCount: number): number {
  let confidence = 1.0

  // Penalize for issues
  for (const issue of issues) {
    if (issue.severity === 'high') confidence -= 0.3
    else if (issue.severity === 'medium') confidence -= 0.15
    else confidence -= 0.05
  }

  // Penalize if very few sources
  if (sourceCount < 2) {
    confidence *= 0.8
  }

  return Math.max(0, Math.min(1, confidence))
}

/**
 * Generate human-readable summary
 */
function generateSummary(issues: HallucinationIssue[], confidence: number): string {
  if (issues.length === 0) {
    return `✓ Response appears fully grounded (confidence: ${(confidence * 100).toFixed(0)}%)`
  }

  const highSeverity = issues.filter((i) => i.severity === 'high').length
  const mediumSeverity = issues.filter((i) => i.severity === 'medium').length
  const lowSeverity = issues.filter((i) => i.severity === 'low').length

  const parts: string[] = []

  if (highSeverity > 0) {
    parts.push(`${highSeverity} high-severity issue${highSeverity > 1 ? 's' : ''}`)
  }
  if (mediumSeverity > 0) {
    parts.push(`${mediumSeverity} medium-severity issue${mediumSeverity > 1 ? 's' : ''}`)
  }
  if (lowSeverity > 0) {
    parts.push(`${lowSeverity} low-severity issue${lowSeverity > 1 ? 's' : ''}`)
  }

  return `⚠ Found ${parts.join(', ')} (confidence: ${(confidence * 100).toFixed(0)}%)`
}

/**
 * Quick check for obvious hallucinations
 *
 * Fast pre-check before expensive LLM verification
 */
export function quickHallucinationCheck(response: string, sources: Source[]): boolean {
  // Check if response is much longer than sources (likely hallucinating)
  const responseLength = response.length
  const sourcesLength = sources.reduce((acc, s) => acc + s.content.length, 0)

  if (responseLength > sourcesLength * 1.5) {
    return false // Likely hallucinating
  }

  // Check for common hallucination phrases
  const hallucinationIndicators = [
    'in my experience',
    'i believe',
    'it is well known',
    'everyone knows',
    'obviously',
    'clearly',
    'it is common knowledge',
  ]

  const lower = response.toLowerCase()
  if (hallucinationIndicators.some((indicator) => lower.includes(indicator))) {
    return false
  }

  return true // Passes quick check
}
