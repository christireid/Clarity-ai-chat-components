/**
 * Citation-Grounded Prompting
 *
 * Ensures all factual claims are supported by citations
 * to reduce hallucinations and improve verifiability
 */

export interface CitationGroundedPrompt {
  systemPrompt: string
  userPrompt: string
  postProcessing: (response: string, sources: Source[]) => GroundedResponse
}

export interface Source {
  id: string
  title: string
  url: string
  content: string
}

export interface GroundedResponse {
  answer: string
  citations: Citation[]
  uncitedClaims: string[]
}

export interface Citation {
  claim: string
  sourceId: string
  sourceTitle: string
  sourceUrl: string
}

/**
 * Generate citation-grounded prompt that requires sources for all claims
 *
 * @param query - The user's query
 * @param sources - Source documents with IDs
 * @returns Citation-grounded prompt configuration
 */
export function generateCitationPrompt(
  query: string,
  sources: Source[]
): CitationGroundedPrompt {
  // Format sources with IDs
  const formattedSources = sources
    .map((source, idx) => `[${idx + 1}] ${source.title}\n${source.content}`)
    .join('\n\n')

  return {
    systemPrompt: `You are a documentation assistant that provides accurate, citation-grounded answers.

CRITICAL RULES:
1. Every factual claim MUST be followed by a citation in square brackets: [1]
2. Use ONLY information from the provided sources
3. If information is not in the sources, say "I don't have information about that in the documentation"
4. Multiple sources can support one claim: [1][2]
5. Do not invent or extrapolate beyond what the sources explicitly state

CITATION FORMAT:
"React is a JavaScript library for building user interfaces [1]. It uses a virtual DOM for efficient updates [2]."

If a source doesn't contain the answer, acknowledge this limitation rather than guessing.`,

    userPrompt: `Sources:\n${formattedSources}\n\nQuestion: ${query}\n\nProvide a citation-grounded answer:`,

    postProcessing: (response: string, sources: Source[]) => {
      return extractCitations(response, sources)
    },
  }
}

/**
 * Extract citations from AI response
 *
 * Parses [1], [2] style citations and identifies uncited claims
 *
 * @param response - AI-generated response
 * @param sources - Source documents
 * @returns Grounded response with citation metadata
 */
export function extractCitations(
  response: string,
  sources: Source[]
): GroundedResponse {
  // Find all citations [1], [2], etc.
  const citationRegex = /\[(\d+)\]/g
  const matches = [...response.matchAll(citationRegex)]

  const citations: Citation[] = []
  const citedSourceIds = new Set<number>()

  for (const match of matches) {
    const sourceIdx = parseInt(match[1], 10) - 1

    if (sourceIdx >= 0 && sourceIdx < sources.length) {
      const source = sources[sourceIdx]
      citedSourceIds.add(sourceIdx)

      // Extract claim (sentence containing citation)
      const sentenceStart = response.lastIndexOf('.', match.index ?? 0) + 1
      const sentenceEnd = response.indexOf('.', match.index ?? 0) + 1
      const claim = response.slice(sentenceStart, sentenceEnd).trim()

      citations.push({
        claim,
        sourceId: source.id,
        sourceTitle: source.title,
        sourceUrl: source.url,
      })
    }
  }

  // Identify uncited claims (sentences without citations)
  const sentences = response.split(/\.\s+/)
  const uncitedClaims = sentences.filter((sentence) => {
    // Skip short sentences and meta-commentary
    if (sentence.length < 20) return false
    if (sentence.toLowerCase().includes("i don't have")) return false
    if (sentence.toLowerCase().startsWith('here')) return false

    // Check if sentence contains factual claim indicators
    const hasCitation = /\[\d+\]/.test(sentence)
    const isFactualClaim =
      /\b(is|are|has|have|was|were|will|can|does|includes|provides|uses|supports)\b/i.test(
        sentence
      )

    return isFactualClaim && !hasCitation
  })

  return {
    answer: response,
    citations,
    uncitedClaims,
  }
}

/**
 * Generate strict citation prompt for high-risk domains
 *
 * Uses even stricter requirements for critical information
 *
 * @param query - The user's query
 * @param sources - Source documents
 * @returns Strict citation prompt
 */
export function generateStrictCitationPrompt(
  query: string,
  sources: Source[]
): CitationGroundedPrompt {
  const formattedSources = sources
    .map((source, idx) => `[${idx + 1}] ${source.title}\n${source.content}`)
    .join('\n\n')

  return {
    systemPrompt: `You are a documentation assistant with STRICT citation requirements.

MANDATORY RULES:
1. EVERY sentence must have a citation [1]
2. NO information can be included without a source
3. NO paraphrasing that changes meaning
4. NO combining information from multiple sources unless explicitly comparing
5. If unsure, state "This information is not clearly documented in the sources [1]"

You must be extremely conservative. When in doubt, cite or omit.`,

    userPrompt: `Sources:\n${formattedSources}\n\nQuestion: ${query}\n\nProvide a strictly citation-grounded answer:`,

    postProcessing: (response: string, sources: Source[]) => {
      return extractCitations(response, sources)
    },
  }
}

/**
 * Validate citation quality
 *
 * Checks if citations are properly formatted and complete
 *
 * @param grounded - Grounded response to validate
 * @returns Validation result
 */
export function validateCitations(grounded: GroundedResponse): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Check for uncited factual claims
  if (grounded.uncitedClaims.length > 0) {
    issues.push(`Found ${grounded.uncitedClaims.length} uncited factual claims`)
  }

  // Check if citations are well-distributed
  const citationCount = grounded.citations.length
  const sentenceCount = grounded.answer.split(/\.\s+/).length

  if (citationCount === 0 && sentenceCount > 2) {
    issues.push('No citations found in multi-sentence response')
  }

  if (citationCount < sentenceCount / 3) {
    issues.push('Low citation density - less than 1 citation per 3 sentences')
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
