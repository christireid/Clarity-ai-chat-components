/**
 * Hallucination Detection System
 *
 * Detects and prevents AI hallucinations by verifying responses against source documents.
 * Identifies uncited claims, contradictions, and unsupported details.
 */

import type { Source, GroundedResponse } from './prompts/citations'
import { extractCitations } from './prompts/citations'

export interface HallucinationCheck {
  isGrounded: boolean
  confidence: number // 0-1, confidence that response is fully grounded
  issues: HallucinationIssue[]
  summary: string
}

export interface HallucinationIssue {
  type:
    | 'uncited_claim'
    | 'unsupported_detail'
    | 'low_citation_coverage'
    | 'invalid_citation'
  claim: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
}

/**
 * Check response for hallucinations and grounding issues
 *
 * @param response - AI-generated response
 * @param sources - Source documents used
 * @param query - Original user query
 * @returns Hallucination analysis with confidence score
 */
export async function checkForHallucinations(
  response: string,
  sources: Source[],
  query: string
): Promise<HallucinationCheck> {
  const issues: HallucinationIssue[] = []

  // Step 1: Extract and analyze citations
  const grounded = extractCitations(response, sources)

  // Step 2: Check for uncited claims
  if (grounded.uncitedClaims.length > 0) {
    for (const claim of grounded.uncitedClaims) {
      // Check if this is a genuine factual claim or just a transition
      if (isFactualClaim(claim)) {
        issues.push({
          type: 'uncited_claim',
          claim,
          severity: 'medium',
          explanation: 'Factual claim without citation',
        })
      }
    }
  }

  // Step 3: Check citation coverage
  if (grounded.groundingScore < 0.7) {
    issues.push({
      type: 'low_citation_coverage',
      claim: `Only ${Math.round(grounded.groundingScore * 100)}% of claims are cited`,
      severity: grounded.groundingScore < 0.5 ? 'high' : 'medium',
      explanation: 'Response has insufficient citation coverage',
    })
  }

  // Step 4: Check for specific details not in sources
  const unsupportedDetails = findUnsupportedDetails(response, sources)
  for (const detail of unsupportedDetails) {
    issues.push({
      type: 'unsupported_detail',
      claim: detail,
      severity: 'high',
      explanation: 'Specific detail (number/version/name) not found in sources',
    })
  }

  // Step 5: Validate citations exist and are reasonable
  for (const citation of grounded.citations) {
    const sourceIdx = citation.sourceIndex - 1
    if (sourceIdx < 0 || sourceIdx >= sources.length) {
      issues.push({
        type: 'invalid_citation',
        claim: citation.claim,
        severity: 'high',
        explanation: `Citation [${citation.sourceIndex}] references non-existent source`,
      })
    }
  }

  // Calculate overall confidence
  const confidence = calculateGroundingConfidence(grounded, issues, sources)

  // Determine if response is adequately grounded
  const isGrounded =
    confidence >= 0.7 &&
    issues.filter((i) => i.severity === 'high').length === 0

  // Generate summary
  const summary = generateSummary(isGrounded, confidence, issues)

  return {
    isGrounded,
    confidence,
    issues,
    summary,
  }
}

/**
 * Check if a sentence is a factual claim (vs. transition/meta-statement)
 */
function isFactualClaim(sentence: string): boolean {
  const lower = sentence.toLowerCase().trim()

  // Skip meta-statements and transitions
  const nonFactualPhrases = [
    "let's",
    "here's how",
    'for example',
    'in summary',
    'to answer',
    'you can',
    'you should',
    "i don't",
    'i cannot',
    'please',
    'note that',
  ]

  if (nonFactualPhrases.some((phrase) => lower.startsWith(phrase))) {
    return false
  }

  // Check for factual indicators
  const factualIndicators = [
    ' is ',
    ' are ',
    ' was ',
    ' were ',
    ' has ',
    ' have ',
    ' provides ',
    ' allows ',
    ' enables ',
    ' requires ',
  ]

  return factualIndicators.some((indicator) => lower.includes(indicator))
}

/**
 * Find specific details in response that aren't in sources
 */
function findUnsupportedDetails(response: string, sources: Source[]): string[] {
  const unsupported: string[] = []
  const sourceContent = sources.map((s) => s.content).join(' ')

  // Extract specific version numbers
  const versions = response.match(/v?\d+\.\d+(\.\d+)?/g) || []
  for (const version of versions) {
    if (!sourceContent.includes(version)) {
      unsupported.push(`Version: ${version}`)
    }
  }

  // Extract specific measurements
  const measurements =
    response.match(/\d+\s*(ms|MB|KB|GB|px|%|bytes|seconds)/gi) || []
  for (const measurement of measurements) {
    if (!sourceContent.includes(measurement)) {
      unsupported.push(`Measurement: ${measurement}`)
    }
  }

  // Extract API names/function names that look specific
  const apiNames = response.match(/\b[a-z][a-zA-Z0-9]*\([^)]*\)/g) || []
  for (const apiName of apiNames) {
    const functionName = apiName.split('(')[0]
    if (!sourceContent.includes(functionName)) {
      unsupported.push(`API: ${apiName}`)
    }
  }

  return unsupported
}

/**
 * Calculate overall grounding confidence score
 */
function calculateGroundingConfidence(
  grounded: GroundedResponse,
  issues: HallucinationIssue[],
  sources: Source[]
): number {
  let confidence = 1.0

  // Start with citation coverage score
  confidence = grounded.groundingScore

  // Penalize for issues by severity
  for (const issue of issues) {
    if (issue.severity === 'high') {
      confidence -= 0.2
    } else if (issue.severity === 'medium') {
      confidence -= 0.1
    } else {
      confidence -= 0.05
    }
  }

  // Bonus for having citations
  if (grounded.citations.length > 0) {
    confidence += 0.1
  }

  // Bonus for using multiple sources (more thorough)
  const uniqueSources = new Set(grounded.citations.map((c) => c.sourceId))
  if (uniqueSources.size > 1) {
    confidence += 0.05
  }

  return Math.max(0, Math.min(1, confidence))
}

/**
 * Generate human-readable summary of hallucination check
 */
function generateSummary(
  isGrounded: boolean,
  confidence: number,
  issues: HallucinationIssue[]
): string {
  if (isGrounded) {
    return `Response is well-grounded (${Math.round(confidence * 100)}% confidence). ${issues.length === 0 ? 'No issues detected.' : `${issues.length} minor issue(s) detected.`}`
  }

  const highSeverityCount = issues.filter((i) => i.severity === 'high').length

  if (highSeverityCount > 0) {
    return `Response has ${highSeverityCount} high-severity grounding issue(s). Confidence: ${Math.round(confidence * 100)}%. Recommend regeneration with stricter grounding.`
  }

  return `Response has moderate grounding issues (${Math.round(confidence * 100)}% confidence). ${issues.length} issue(s) detected.`
}

/**
 * Quick check if response needs regeneration
 */
export function shouldRegenerateResponse(check: HallucinationCheck): boolean {
  // Regenerate if confidence is too low
  if (check.confidence < 0.6) return true

  // Regenerate if there are high-severity issues
  if (check.issues.some((issue) => issue.severity === 'high')) return true

  // Regenerate if too many medium-severity issues
  const mediumIssues = check.issues.filter((i) => i.severity === 'medium')
  if (mediumIssues.length > 3) return true

  return false
}
