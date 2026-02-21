/**
 * Citation-Grounded Prompting
 *
 * Ensures all factual claims are grounded in source documents with proper citations.
 * Prevents hallucinations by requiring explicit source attribution.
 *
 * Format: "React is a JavaScript library [1]. It uses virtual DOM [2]."
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
  groundingScore: number // 0-1, percentage of claims with citations
}

export interface Citation {
  claim: string
  sourceId: string
  sourceTitle: string
  sourceUrl: string
  sourceIndex: number
}

/**
 * Generate citation-grounded prompt that requires source attribution
 *
 * @param query - User's question
 * @param sources - Retrieved source documents
 * @returns Prompt that enforces citation requirements
 */
export function generateCitationPrompt(
  query: string,
  sources: Source[]
): CitationGroundedPrompt {
  // Format sources with numbered IDs for citation
  const formattedSources = sources
    .map(
      (source, idx) =>
        `[${idx + 1}] ${source.title}
URL: ${source.url}
Content: ${source.content}`
    )
    .join('\n\n---\n\n')

  return {
    systemPrompt: `You are a documentation assistant that provides accurate, citation-grounded answers.

CRITICAL CITATION RULES:
1. Every factual claim MUST be followed by a citation in square brackets: [1]
2. Use ONLY information from the provided sources
3. If information is not in the sources, say "I don't have information about that in the documentation"
4. Multiple sources can support one claim: [1][2]
5. Cite the specific source number that contains the information
6. Do NOT make claims without citations

GOOD EXAMPLE:
"The useChatStream hook manages streaming responses [1]. It accepts a streamUrl parameter for the API endpoint [1]. You can customize the request headers using the headers option [2]."

BAD EXAMPLE (no citations):
"The hook is very useful and easy to use. It handles everything automatically."

Remember: Every factual statement needs a [source number].`,

    userPrompt: `Available Sources:
${formattedSources}

Question: ${query}

Provide a citation-grounded answer with [source numbers] after each claim:`,

    postProcessing: (response: string, sources: Source[]) => {
      return extractCitations(response, sources)
    },
  }
}

/**
 * Extract and validate citations from response
 *
 * @param response - AI-generated response with citations
 * @param sources - Source documents used
 * @returns Parsed grounded response with citation metadata
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

  // Extract citations from response
  for (const match of matches) {
    const sourceIdx = parseInt(match[1], 10) - 1

    if (sourceIdx >= 0 && sourceIdx < sources.length) {
      const source = sources[sourceIdx]
      citedSourceIds.add(sourceIdx)

      // Extract claim (sentence containing citation)
      const matchIndex = match.index ?? 0
      const beforeMatch = response.slice(0, matchIndex)
      const afterMatch = response.slice(matchIndex)

      // Find sentence boundaries
      const sentenceStart = Math.max(
        beforeMatch.lastIndexOf('.'),
        beforeMatch.lastIndexOf('\n')
      )
      const sentenceEnd = afterMatch.indexOf('.')

      const claim = response
        .slice(
          sentenceStart + 1,
          sentenceEnd > 0 ? matchIndex + sentenceEnd + 1 : matchIndex + 100
        )
        .trim()

      citations.push({
        claim,
        sourceId: source.id,
        sourceTitle: source.title,
        sourceUrl: source.url,
        sourceIndex: sourceIdx + 1,
      })
    }
  }

  // Identify uncited claims (substantive sentences without citations)
  const sentences = response.split(/\.\s+/)
  const uncitedClaims = sentences.filter((sentence) => {
    // Skip very short sentences (likely transitions)
    if (sentence.trim().length < 15) return false

    // Skip sentences that are questions
    if (sentence.includes('?')) return false

    // Skip sentences with citations
    if (citationRegex.test(sentence)) return false

    // Skip common transition phrases
    const transitionPhrases = [
      "let's",
      "here's",
      'for example',
      'in summary',
      'to clarify',
      "i don't have",
    ]
    const lower = sentence.toLowerCase()
    if (transitionPhrases.some((phrase) => lower.includes(phrase))) return false

    // This is likely an uncited claim
    return true
  })

  // Calculate grounding score
  const totalClaims = sentences.filter((s) => s.trim().length > 15).length
  const citedClaims = sentences.filter((s) => citationRegex.test(s)).length
  const groundingScore = totalClaims > 0 ? citedClaims / totalClaims : 0

  return {
    answer: response,
    citations,
    uncitedClaims,
    groundingScore,
  }
}

/**
 * Verify that citations are valid (source contains the claim)
 *
 * @param grounded - Response with extracted citations
 * @param sources - Original source documents
 * @returns Validation results for each citation
 */
export function verifyCitations(
  grounded: GroundedResponse,
  sources: Source[]
): CitationValidation[] {
  return grounded.citations.map((citation) => {
    const sourceIdx = citation.sourceIndex - 1
    const source = sources[sourceIdx]

    if (!source) {
      return {
        citation,
        isValid: false,
        reason: 'Source not found',
      }
    }

    // Simple validation: check if source content contains key terms from claim
    const claimKeywords =
      citation.claim.toLowerCase().match(/\b\w{4,}\b/g) || []
    const sourceContent = source.content.toLowerCase()

    const matchedKeywords = claimKeywords.filter((keyword) =>
      sourceContent.includes(keyword)
    )

    const matchRate = matchedKeywords.length / claimKeywords.length

    return {
      citation,
      isValid: matchRate > 0.5, // At least 50% of keywords should be in source
      reason:
        matchRate > 0.5
          ? 'Claim appears grounded in source'
          : `Only ${Math.round(matchRate * 100)}% keyword match`,
      matchRate,
    }
  })
}

export interface CitationValidation {
  citation: Citation
  isValid: boolean
  reason: string
  matchRate?: number
}
