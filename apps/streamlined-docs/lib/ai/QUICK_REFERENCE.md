# Query Enhancement - Quick Reference

## 🚀 Quick Start

```typescript
import { processQuery } from '@/lib/ai/query-processing'

// Process any query
const result = await processQuery('How to use ChatWindow?')

// Use optimized search query
const docs = await search(result.searchQueries.hybrid)

// Get response guidance
console.log(result.responseGuidance.style)           // 'instructional'
console.log(result.responseGuidance.includeCodeExamples) // true
```

## 📊 Intent Types at a Glance

| Query Example | Intent | Use Case |
|--------------|--------|----------|
| "What is ChatWindow?" | DEFINITION | Quick reference |
| "Show me an example" | EXAMPLE | Code samples |
| "How to integrate X?" | TUTORIAL | Step-by-step |
| "X not working" | TROUBLESHOOTING | Problem solving |
| "X vs Y" | COMPARISON | Decision making |
| "What props does X have?" | API_LOOKUP | API docs |

## 🔧 Common Patterns

### Pattern 1: Simple Query Processing

```typescript
const result = await processQuery(query)
const docs = await search(result.searchQueries.hybrid)
```

### Pattern 2: With Conversation Context

```typescript
const result = await processQuery(query, {
  conversationId: session.id
})
```

### Pattern 3: Multi-Perspective Search

```typescript
const { primary, perspectives } = await processWithPerspectives(query)
// Search with all perspectives for better coverage
```

### Pattern 4: Generate RAG Prompt

```typescript
const processed = await processQuery(query)
const prompt = generateRAGPrompt(processed)
// Use prompt.systemPrompt, prompt.userPrompt, prompt.searchQuery
```

## 🎯 Intent-Based Routing

```typescript
switch (result.intent.primary) {
  case QueryIntent.TROUBLESHOOTING:
    return troubleshootingFlow(result)
  case QueryIntent.EXAMPLE:
    return exampleFlow(result)
  case QueryIntent.TUTORIAL:
    return tutorialFlow(result)
}
```

## 🔍 Search Strategy Selection

| Complexity | Strategy | Reason |
|-----------|----------|--------|
| SIMPLE | keyword | Exact matches work best |
| MODERATE | hybrid | Balance needed |
| COMPLEX | semantic | Understanding required |

```typescript
const strategy = result.complexity === 'simple'
  ? result.searchQueries.keyword
  : result.searchQueries.hybrid
```

## 💬 Conversation Context

```typescript
// Turn 1
await processQuery('What is ChatWindow?', { conversationId: 'c1' })

// Turn 2 - resolves "it" to "ChatWindow"
await processQuery('How to use it?', { conversationId: 'c1' })
```

## 📈 Query Expansion

```typescript
const expanded = expandQuery('How to use LLM?', classified)

// Original: "How to use LLM?"
// Expanded: "How to use LLM (language model)?"
// Acronyms: { LLM: "Large Language Model" }
// Related: ["prompt", "token", "completion"]
```

## 🎨 Response Guidance

```typescript
const guidance = result.responseGuidance

// Use sections for structure
guidance.sections // ['Prerequisites', 'Step-by-Step Guide', ...]

// Adapt style
guidance.style // 'instructional' | 'code-focused' | 'concise' ...

// Include code if needed
if (guidance.includeCodeExamples) {
  // Add code examples
}

// Focus on solutions
if (guidance.isProblemSolving) {
  // Provide solutions and fixes
}
```

## ⚡ Performance Tips

```typescript
// Cache common queries
const cache = new Map<string, ProcessedQuery>()

// Disable expensive features for simple queries
const options = query.length < 20
  ? { generatePerspectives: false, useHyDE: false }
  : { generatePerspectives: true, useHyDE: true }

// Batch process multiple queries
const results = await processBatch([query1, query2, query3])
```

## 🧪 Testing Helpers

```typescript
// Check intent confidence
if (result.intent.confidence < 0.6) {
  // Ask for clarification
}

// Debug processed query
console.log(formatProcessedQueryDebug(result))

// Track for analytics
trackQuery(result)

// Get statistics
const stats = getStatistics()
```

## 🛠️ Utility Functions

```typescript
// Quick checks
isConversationalQuery('Hello!')        // true
isCodeRequest('Show me an example')    // true
isProblemSolvingQuery('X not working') // true
needsDetailedExplanation(query)        // true/false

// Extract information
extractTopic('How to use ChatWindow?') // 'ChatWindow'
getOptimalSearchStrategy(query)        // 'keyword' | 'semantic' | 'hybrid'

// Generate suggestions
generateFollowUpSuggestions(query)     // ['Tell me more...', ...]
```

## 📦 Presets

```typescript
// API documentation
await processQuery(query, API_DOCS_OPTIONS)

// Tutorials
await processQuery(query, TUTORIAL_OPTIONS)

// Troubleshooting
await processQuery(query, TROUBLESHOOTING_OPTIONS)

// Conversational
await processQuery(query, CONVERSATIONAL_OPTIONS)

// Or auto-detect
const options = getRecommendedOptions(query)
await processQuery(query, options)
```

## 🔗 Integration Examples

### With RAG System

```typescript
const processed = await processQuery(query)
const prompt = generateRAGPrompt(processed)
const ragContext = await generateEnhancedRAGContext(prompt.searchQuery)

const response = await llm.generate({
  system: prompt.systemPrompt + '\n\n' + ragContext.context,
  user: prompt.userPrompt
})
```

### With Streaming

```typescript
const processed = await processQuery(query, { conversationId })
const prompt = generateRAGPrompt(processed)

for await (const chunk of streamResponse(prompt)) {
  yield chunk
}
```

### With Error Handling

```typescript
try {
  const result = await processQuery(query)

  if (result.intent.confidence < 0.5) {
    return askClarifyingQuestion(result)
  }

  return await generateResponse(result)
} catch (error) {
  console.error('Query processing failed:', error)
  return fallbackResponse(query)
}
```

## 📊 Entity Types

| Type | Examples |
|------|----------|
| COMPONENT | ChatWindow, MessageList |
| HOOK | useChat, useState |
| PROP | onSend, className |
| API | /api/chat |
| ERROR | TypeError, Error 500 |
| VERSION | v1.2.3, latest |

## 🎯 Skill Levels

| Level | Indicators | Response Style |
|-------|-----------|----------------|
| BEGINNER | "what is", "how to start", "help" | Simple, detailed |
| INTERMEDIATE | "implement", "integrate", "best practice" | Practical |
| ADVANCED | "optimize", "internals", "performance" | Technical |

## 🔢 Confidence Scores

| Range | Meaning | Action |
|-------|---------|--------|
| 0.9-1.0 | Very confident | Proceed |
| 0.7-0.9 | Confident | Proceed |
| 0.5-0.7 | Uncertain | Consider alternatives |
| 0.0-0.5 | Low confidence | Ask clarification |

## 📝 Processing Options

```typescript
interface ProcessingOptions {
  // Conversation tracking
  conversationId?: string
  includeConversationHistory?: boolean  // default: true

  // Query expansion
  includeSynonyms?: boolean             // default: true
  includeRelatedTerms?: boolean         // default: true
  includeAlternatives?: boolean         // default: true
  expandAcronyms?: boolean              // default: true
  maxAlternatives?: number              // default: 5

  // Search optimization
  generatePerspectives?: boolean        // default: true
  useHyDE?: boolean                     // default: true
  maxPerspectives?: number              // default: 5

  // Domain context
  domain?: 'react' | 'typescript' | 'ai' | 'general'
}
```

## 🎪 Full Example

```typescript
import { processQuery, generateRAGPrompt } from '@/lib/ai/query-processing'

async function handleQuery(query: string, sessionId: string) {
  // 1. Process query
  const processed = await processQuery(query, {
    conversationId: sessionId,
    includeConversationHistory: true,
    domain: 'react'
  })

  // 2. Check confidence
  if (processed.intent.confidence < 0.6) {
    return {
      needsClarification: true,
      suggestions: generateFollowUpSuggestions(query)
    }
  }

  // 3. Generate RAG prompt
  const prompt = generateRAGPrompt(processed)

  // 4. Search documentation
  const docs = await hybridSearch(prompt.searchQuery, {
    topK: 5,
    enableReranking: true
  })

  // 5. Generate response with LLM
  const response = await llm.generate({
    system: prompt.systemPrompt,
    user: prompt.userPrompt,
    context: docs.context
  })

  return {
    response,
    sources: docs.sources,
    metadata: {
      intent: processed.intent.primary,
      confidence: processed.intent.confidence,
      processingTime: processed.metadata.processingTime
    }
  }
}
```

## 📚 Further Reading

- Full guide: `QUERY_ENHANCEMENT_GUIDE.md`
- Tests: `__tests__/query-enhancement.test.ts`
- Source: All files in `lib/ai/`

---

**Pro Tip:** Start simple with `processQuery()`, then add features as needed!
