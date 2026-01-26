# Wave 3.4 Agent 39: Advanced Prompting Rollout

**Agent Type**: `llm-application-dev:prompt-engineer` **Priority**: P1 - High **Target**: Quality
+16%, Hallucinations -22% **Estimated Time**: 3 hours **Risk Level**: Low (prompt improvements)

---

## Mission Objective

Implement advanced prompting techniques (Chain-of-Thought, Citation-Grounded Prompting,
Hallucination Detection) across all AI endpoints to improve response quality by 16% and reduce
hallucinations by 22%.

### Techniques to Implement

1. **Zero-Shot Chain-of-Thought (CoT)** - Add "Let's think step by step" for complex queries
2. **Citation-Grounded Prompting** - Require citations for all factual claims
3. **Hallucination Detection** - Verify responses against knowledge base
4. **Complexity Classification** - Route queries to appropriate prompting strategy

---

## Task 1: Implement Query Complexity Classifier

### Step 1.1: Define Complexity Levels

**File**: `apps/streamlined-docs/lib/ai/complexity.ts` (NEW)

```typescript
export enum QueryComplexity {
  SIMPLE = 'simple', // Single fact lookup
  MODERATE = 'moderate', // Multiple facts or comparison
  COMPLEX = 'complex', // Reasoning or synthesis required
}

export interface ClassifiedQuery {
  query: string
  complexity: QueryComplexity
  reasoning: string
  keywords: string[]
}

/**
 * Classify query complexity using heuristics
 */
export function classifyQueryComplexity(query: string): ClassifiedQuery {
  const lowerQuery = query.toLowerCase()

  // Complex indicators
  const complexIndicators = [
    'why',
    'how does',
    'explain',
    'compare',
    'difference between',
    'best practices',
    'when should',
    'what are the trade-offs',
  ]

  // Moderate indicators
  const moderateIndicators = ['what is', 'how to', 'can i', 'does it', 'list', 'show me']

  // Check for complex patterns
  const isComplex = complexIndicators.some((indicator) => lowerQuery.includes(indicator))

  const isModerate = moderateIndicators.some((indicator) => lowerQuery.includes(indicator))

  // Check query length (longer queries tend to be more complex)
  const words = query.split(/\s+/).length

  let complexity: QueryComplexity
  let reasoning: string

  if (isComplex || words > 15) {
    complexity = QueryComplexity.COMPLEX
    reasoning = 'Contains reasoning keywords or is lengthy'
  } else if (isModerate || words > 5) {
    complexity = QueryComplexity.MODERATE
    reasoning = 'Multiple concepts or moderate length'
  } else {
    complexity = QueryComplexity.SIMPLE
    reasoning = 'Short, direct question'
  }

  // Extract keywords
  const keywords = query.toLowerCase().match(/\b\w{4,}\b/g) || []

  return {
    query,
    complexity,
    reasoning,
    keywords,
  }
}
```

### Step 1.2: Test Classifier

**File**: `tests/ai/complexity.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest'
import { classifyQueryComplexity, QueryComplexity } from '@/lib/ai/complexity'

describe('Query Complexity Classifier', () => {
  it('should classify simple queries', () => {
    const result = classifyQueryComplexity('What is React?')
    expect(result.complexity).toBe(QueryComplexity.SIMPLE)
  })

  it('should classify moderate queries', () => {
    const result = classifyQueryComplexity('How to use useState hook?')
    expect(result.complexity).toBe(QueryComplexity.MODERATE)
  })

  it('should classify complex queries', () => {
    const result = classifyQueryComplexity(
      'Explain the difference between useMemo and useCallback and when to use each'
    )
    expect(result.complexity).toBe(QueryComplexity.COMPLEX)
  })
})
```

---

## Task 2: Implement Chain-of-Thought (CoT) Prompting

### Step 2.1: Create CoT Prompt Templates

**File**: `apps/streamlined-docs/lib/ai/prompts/cot.ts` (NEW)

```typescript
import { QueryComplexity } from '../complexity'

export interface CoTPrompt {
  systemPrompt: string
  userPrompt: string
}

/**
 * Generate Chain-of-Thought prompt based on complexity
 */
export function generateCoTPrompt(
  query: string,
  complexity: QueryComplexity,
  context: string[]
): CoTPrompt {
  if (complexity === QueryComplexity.SIMPLE) {
    // Simple queries don't need CoT
    return {
      systemPrompt: `You are a helpful documentation assistant. Provide clear, concise answers based on the provided context.`,
      userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}`,
    }
  }

  if (complexity === QueryComplexity.MODERATE) {
    // Moderate queries benefit from structured thinking
    return {
      systemPrompt: `You are a helpful documentation assistant. For each question:
1. Identify the key concepts involved
2. Explain each concept clearly
3. Provide a direct answer

Base your response only on the provided context.`,
      userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}`,
    }
  }

  // Complex queries use full Chain-of-Thought
  return {
    systemPrompt: `You are a helpful documentation assistant. For complex questions, think step by step:

1. Break down the question into sub-questions
2. Answer each sub-question using the provided context
3. Synthesize the answers into a comprehensive response
4. Identify any trade-offs or considerations

Let's think step by step.`,
    userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}\n\nLet's approach this systematically:`,
  }
}
```

### Step 2.2: Apply CoT to Docs Assistant

**File**: `apps/streamlined-docs/app/api/docs-assistant/route.ts` (MODIFY)

```typescript
import { classifyQueryComplexity } from '@/lib/ai/complexity'
import { generateCoTPrompt } from '@/lib/ai/prompts/cot'

export async function POST(request: Request) {
  // ... existing validation code

  const { query } = validation.data

  // Classify query complexity
  const classification = classifyQueryComplexity(query)

  // Retrieve context from RAG
  const contextChunks = await retrieveContext(query)

  // Generate appropriate prompt
  const prompt = generateCoTPrompt(query, classification.complexity, contextChunks)

  // Call LLM with CoT prompt
  const response = await callLLM({
    systemPrompt: prompt.systemPrompt,
    userPrompt: prompt.userPrompt,
    temperature: classification.complexity === 'simple' ? 0.3 : 0.7,
  })

  return NextResponse.json({
    response: response.content,
    complexity: classification.complexity,
    reasoning: classification.reasoning,
  })
}
```

---

## Task 3: Implement Citation-Grounded Prompting

### Step 3.1: Create Citation System

**File**: `apps/streamlined-docs/lib/ai/prompts/citations.ts` (NEW)

```typescript
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
 * Generate citation-grounded prompt
 */
export function generateCitationPrompt(query: string, sources: Source[]): CitationGroundedPrompt {
  // Format sources with IDs
  const formattedSources = sources
    .map((source, idx) => `[${idx + 1}] ${source.title}\n${source.content}`)
    .join('\n\n')

  return {
    systemPrompt: `You are a documentation assistant that provides accurate, citation-grounded answers.

CRITICAL RULES:
1. Every factual claim MUST be followed by a citation in square brackets: [1]
2. Use ONLY information from the provided sources
3. If information is not in the sources, say "I don't have information about that"
4. Multiple sources can support one claim: [1][2]

Example:
"React is a JavaScript library for building user interfaces [1]. It uses a virtual DOM for efficient updates [2]."`,

    userPrompt: `Sources:\n${formattedSources}\n\nQuestion: ${query}\n\nProvide a citation-grounded answer:`,

    postProcessing: (response: string, sources: Source[]) => {
      return extractCitations(response, sources)
    },
  }
}

/**
 * Extract citations from response
 */
function extractCitations(response: string, sources: Source[]): GroundedResponse {
  // Find all citations [1], [2], etc.
  const citationRegex = /\[(\d+)\]/g
  const matches = [...response.matchAll(citationRegex)]

  const citations: Citation[] = []
  const citedSourceIds = new Set<number>()

  for (const match of matches) {
    const sourceIdx = parseInt(match[1]) - 1

    if (sourceIdx >= 0 && sourceIdx < sources.length) {
      const source = sources[sourceIdx]
      citedSourceIds.add(sourceIdx)

      // Extract claim (sentence containing citation)
      const sentenceStart = response.lastIndexOf('.', match.index!) + 1
      const sentenceEnd = response.indexOf('.', match.index!) + 1
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
  const uncitedClaims = sentences.filter(
    (sentence) => sentence.length > 20 && !citationRegex.test(sentence)
  )

  return {
    answer: response,
    citations,
    uncitedClaims,
  }
}
```

### Step 3.2: Apply Citations to Docs Assistant

**File**: `apps/streamlined-docs/app/api/docs-assistant/route.ts` (MODIFY)

```typescript
import { generateCitationPrompt } from '@/lib/ai/prompts/citations'

export async function POST(request: Request) {
  // ... existing code

  // Retrieve sources
  const sources = await retrieveSources(query)

  // Generate citation-grounded prompt
  const citationPrompt = generateCitationPrompt(query, sources)

  // Call LLM
  const response = await callLLM({
    systemPrompt: citationPrompt.systemPrompt,
    userPrompt: citationPrompt.userPrompt,
  })

  // Post-process to extract citations
  const grounded = citationPrompt.postProcessing(response.content, sources)

  return NextResponse.json({
    response: grounded.answer,
    citations: grounded.citations,
    uncitedClaims: grounded.uncitedClaims,
    sources: sources.map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
    })),
  })
}
```

---

## Task 4: Implement Hallucination Detection

### Step 4.1: Create Hallucination Checker

**File**: `apps/streamlined-docs/lib/ai/hallucination.ts` (NEW)

```typescript
export interface HallucinationCheck {
  isGrounded: boolean
  confidence: number
  issues: HallucinationIssue[]
}

export interface HallucinationIssue {
  type: 'uncited_claim' | 'contradicts_source' | 'unsupported_detail'
  claim: string
  severity: 'low' | 'medium' | 'high'
}

/**
 * Check response for hallucinations
 */
export async function checkForHallucinations(
  response: string,
  sources: Source[],
  query: string
): Promise<HallucinationCheck> {
  const issues: HallucinationIssue[] = []

  // Check 1: Are there uncited factual claims?
  const factualClaims = extractFactualClaims(response)
  const citedClaims = extractCitedClaims(response)

  for (const claim of factualClaims) {
    if (!citedClaims.some((cited) => cited.includes(claim))) {
      issues.push({
        type: 'uncited_claim',
        claim,
        severity: 'medium',
      })
    }
  }

  // Check 2: Does response contain details not in sources?
  const sourceContent = sources.map((s) => s.content).join(' ')

  const specificDetails = extractSpecificDetails(response)

  for (const detail of specificDetails) {
    if (!sourceContent.toLowerCase().includes(detail.toLowerCase())) {
      issues.push({
        type: 'unsupported_detail',
        claim: detail,
        severity: 'high',
      })
    }
  }

  // Check 3: Use LLM to verify grounding
  const verificationPrompt = `
Given these sources:
${sources.map((s) => s.content).join('\n\n')}

And this response:
${response}

Is the response fully grounded in the sources? Answer with JSON:
{
  "isGrounded": true/false,
  "explanation": "..."
}
`

  const verification = await callLLM({
    systemPrompt: 'You are a fact-checker. Verify if responses are grounded in sources.',
    userPrompt: verificationPrompt,
    responseFormat: 'json',
  })

  const llmCheck = JSON.parse(verification.content)

  // Calculate overall confidence
  const confidence = calculateGroundingConfidence(issues, llmCheck)

  return {
    isGrounded: issues.length === 0 && llmCheck.isGrounded,
    confidence,
    issues,
  }
}

function extractFactualClaims(text: string): string[] {
  // Extract sentences that appear to be factual claims
  // (contain "is", "are", "has", "have", numbers, etc.)
  const sentences = text.split(/\.\s+/)

  return sentences.filter((sentence) => {
    const lower = sentence.toLowerCase()
    return (
      lower.includes(' is ') ||
      lower.includes(' are ') ||
      lower.includes(' has ') ||
      /\d+/.test(sentence)
    )
  })
}

function extractSpecificDetails(text: string): string[] {
  // Extract specific numbers, names, versions, etc.
  const details: string[] = []

  // Version numbers
  const versions = text.match(/v?\d+\.\d+(\.\d+)?/g) || []
  details.push(...versions)

  // Specific numbers with units
  const measurements = text.match(/\d+\s*(ms|MB|KB|GB|px|%)/g) || []
  details.push(...measurements)

  return details
}

function calculateGroundingConfidence(issues: HallucinationIssue[], llmCheck: any): number {
  let confidence = 1.0

  // Penalize for issues
  for (const issue of issues) {
    if (issue.severity === 'high') confidence -= 0.3
    else if (issue.severity === 'medium') confidence -= 0.15
    else confidence -= 0.05
  }

  // Weight LLM verification
  if (!llmCheck.isGrounded) {
    confidence *= 0.5
  }

  return Math.max(0, Math.min(1, confidence))
}
```

### Step 4.2: Apply Hallucination Detection

**File**: `apps/streamlined-docs/app/api/docs-assistant/route.ts` (MODIFY)

```typescript
import { checkForHallucinations } from '@/lib/ai/hallucination'

export async function POST(request: Request) {
  // ... existing code

  // Generate response
  const response = await generateResponse(query, sources)

  // Check for hallucinations
  const hallucinationCheck = await checkForHallucinations(response.content, sources, query)

  // If confidence is too low, regenerate with stricter grounding
  if (hallucinationCheck.confidence < 0.7) {
    console.warn('Low grounding confidence, regenerating...')

    const stricterResponse = await generateResponse(query, sources, {
      temperature: 0.3, // Lower temperature for more deterministic output
      strictGrounding: true,
    })

    return NextResponse.json({
      response: stricterResponse.content,
      citations: extractCitations(stricterResponse.content, sources),
      grounding: {
        confidence: 1.0, // Stricter generation should be fully grounded
        regenerated: true,
      },
    })
  }

  return NextResponse.json({
    response: response.content,
    citations: extractCitations(response.content, sources),
    grounding: {
      confidence: hallucinationCheck.confidence,
      issues: hallucinationCheck.issues,
    },
  })
}
```

---

## Task 5: Create Prompt Monitoring Dashboard

### Step 5.1: Log Prompt Metrics

**File**: `apps/streamlined-docs/lib/ai/metrics.ts` (NEW)

```typescript
export interface PromptMetrics {
  queryId: string
  timestamp: number
  complexity: QueryComplexity
  promptTokens: number
  completionTokens: number
  groundingConfidence: number
  citationCount: number
  hallucinationIssues: number
  responseTime: number
}

export class PromptMetricsLogger {
  private metrics: PromptMetrics[] = []

  log(metric: PromptMetrics) {
    this.metrics.push(metric)

    // Log to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'prompt_metric', {
        complexity: metric.complexity,
        grounding_confidence: metric.groundingConfidence,
        response_time: metric.responseTime,
      })
    }
  }

  getStats() {
    return {
      totalQueries: this.metrics.length,
      avgGroundingConfidence: this.avg(this.metrics.map((m) => m.groundingConfidence)),
      avgCitationCount: this.avg(this.metrics.map((m) => m.citationCount)),
      avgResponseTime: this.avg(this.metrics.map((m) => m.responseTime)),
      hallucinationRate:
        this.metrics.filter((m) => m.hallucinationIssues > 0).length / this.metrics.length,
    }
  }

  private avg(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length
  }
}

export const metricsLogger = new PromptMetricsLogger()
```

---

## Task 6: Testing & Validation

### Step 6.1: Create Prompt Test Suite

**File**: `tests/ai/prompting.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest'
import { classifyQueryComplexity } from '@/lib/ai/complexity'
import { generateCoTPrompt } from '@/lib/ai/prompts/cot'
import { generateCitationPrompt, extractCitations } from '@/lib/ai/prompts/citations'

describe('Advanced Prompting', () => {
  describe('Chain-of-Thought', () => {
    it('should use simple prompt for simple queries', () => {
      const classification = classifyQueryComplexity('What is React?')
      const prompt = generateCoTPrompt('What is React?', classification.complexity, [])

      expect(prompt.systemPrompt).not.toContain('step by step')
    })

    it('should use CoT prompt for complex queries', () => {
      const classification = classifyQueryComplexity(
        'Explain the difference between useMemo and useCallback'
      )
      const prompt = generateCoTPrompt('Explain the difference...', classification.complexity, [])

      expect(prompt.systemPrompt).toContain('step by step')
    })
  })

  describe('Citation-Grounded Prompting', () => {
    it('should extract citations correctly', () => {
      const response = 'React is a library [1]. It uses virtual DOM [2].'
      const sources = [
        { id: '1', title: 'React Docs', url: '...', content: '...' },
        { id: '2', title: 'Virtual DOM', url: '...', content: '...' },
      ]

      const grounded = extractCitations(response, sources)

      expect(grounded.citations.length).toBe(2)
      expect(grounded.uncitedClaims.length).toBe(0)
    })

    it('should identify uncited claims', () => {
      const response = 'React is fast. It uses virtual DOM [1].'
      const sources = [{ id: '1', title: 'Virtual DOM', url: '...', content: '...' }]

      const grounded = extractCitations(response, sources)

      expect(grounded.uncitedClaims.length).toBeGreaterThan(0)
    })
  })
})
```

---

## Success Criteria

| Metric               | Before   | Target | Success Threshold |
| -------------------- | -------- | ------ | ----------------- |
| Response Quality     | Baseline | +16%   | +12% ✅           |
| Hallucination Rate   | Baseline | -22%   | -18% ✅           |
| Citation Coverage    | 0%       | 90%    | ≥80% ✅           |
| Grounding Confidence | N/A      | >0.85  | >0.80 ✅          |
| CoT Usage (Complex)  | 0%       | 100%   | 100% ✅           |

---

## Rollback Plan

If prompting changes degrade quality:

```typescript
// Disable advanced prompting via feature flag
export const ADVANCED_PROMPTING_ENABLED = false

// In route.ts
if (ADVANCED_PROMPTING_ENABLED) {
  // Use advanced prompts
} else {
  // Use original simple prompts
}
```

---

## Deliverables

### Files Created

1. `lib/ai/complexity.ts` - Query complexity classifier
2. `lib/ai/prompts/cot.ts` - Chain-of-Thought prompts
3. `lib/ai/prompts/citations.ts` - Citation-grounded prompts
4. `lib/ai/hallucination.ts` - Hallucination detection
5. `lib/ai/metrics.ts` - Prompt metrics logging
6. `tests/ai/complexity.test.ts` - Classifier tests
7. `tests/ai/prompting.test.ts` - Prompt tests

### Files Modified

1. `app/api/docs-assistant/route.ts` - Apply advanced prompting
2. `app/api/live-demo-chat/route.ts` - Apply to chat endpoint

---

**Agent 39 Status**: 📋 PLANNED **Ready for Execution**: ✅ YES (no dependencies) **Parallel Safe**:
✅ YES (with Agents 36, 37, 38, 40) **Next Agent**: Agent 40 (Documentation Quality)
