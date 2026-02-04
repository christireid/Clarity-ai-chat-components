

# Enhanced Prompting System - Quick Reference

> **TL;DR**: Production-grade prompt engineering with automated quality checks

---

## 5-Step Integration

```typescript
import {
  classifyQueryEnhanced,      // 1. Classify
  generateEnhancedSystemPrompt, // 2. Generate prompt
  validateResponse,             // 3. Validate
  calculateQualityScores,       // 4. Score
  qualityMetricsTracker,        // 5. Track
} from '@/lib/ai/prompts'

// 1. Classify query
const classification = classifyQueryEnhanced(userQuery)

// 2. Generate optimized prompt
const prompt = generateEnhancedSystemPrompt(
  userQuery,
  classification.complexity,
  classification.requirements.needsCodeExample,
  hasSources
)

// 3. Generate response (your LLM)
const response = await llm.generate(prompt)

// 4. Validate quality
const validation = validateResponse(response, prompt.validationCriteria, userQuery)

// 5. Track metrics
const scores = calculateQualityScores(validation, performanceMetrics)
qualityMetricsTracker.log({
  queryId: crypto.randomUUID(),
  timestamp: Date.now(),
  query: userQuery,
  response,
  classification,
  validation,
  performance: performanceMetrics,
  scores,
})
```

---

## Classification Output

```typescript
const classification = classifyQueryEnhanced(query)
// {
//   complexity: 'simple' | 'moderate' | 'complex',
//   confidence: 0.0-1.0,
//   reasoning: "Overall complexity: complex (score: 0.82). High in: reasoning, comparison",
//   dimensions: {
//     syntactic: 0.6,    // Query structure
//     semantic: 0.8,     // Concept depth
//     technical: 0.7,    // Technical knowledge
//     reasoning: 0.9,    // Logical reasoning
//     comparison: 0.9    // Comparative analysis
//   },
//   requirements: {
//     needsCodeExample: true,
//     needsMultipleExamples: true,
//     needsDeepExplanation: true,
//     needsComparison: true,
//     needsStepByStep: false,
//     needsCitations: true,
//     estimatedCodeBlocks: 2,
//     estimatedParagraphs: 3
//   },
//   estimatedResponseLength: 550,
//   recommendedTemperature: 0.7
// }
```

---

## Validation Output

```typescript
const validation = validateResponse(response, criteria, query)
// {
//   valid: true,              // Pass/fail
//   score: 0.87,              // 0-1
//   issues: [],               // Array of issues
//   passed: [                 // Passed checks
//     { name: 'complete_imports', weight: 0.9, passed: true },
//     { name: 'typescript_types', weight: 0.85, passed: true },
//     // ... 13 more
//   ],
//   failed: [],               // Failed checks
//   suggestions: []           // Improvement suggestions
// }
```

---

## Quality Scores

```typescript
const scores = calculateQualityScores(validation, performance, feedback)
// {
//   overall: 87,          // 0-100 (weighted average)
//   accuracy: 92,         // Citation/technical correctness
//   completeness: 85,     // All requirements met
//   clarity: 88,          // Explanation quality
//   codeQuality: 90,      // Code standards
//   efficiency: 82,       // Quality per token
//   userSatisfaction: 85  // From feedback (optional)
// }
```

---

## Prompt Strategy

```typescript
const strategy = getRecommendedPromptStrategy(classification)
// {
//   useCoT: true,              // Chain-of-Thought
//   useCitations: true,        // Citations required
//   useStrictMode: false,      // Enhanced validation
//   explanation: "Complex reasoning requires Chain-of-Thought. Technical claims need citations."
// }
```

---

## Validation Checks (15+)

### Code Quality (5)
- ✅ Complete imports
- ✅ TypeScript types (no `any`)
- ✅ Inline comments
- ✅ Error handling
- ✅ Best practices

### Explanation Quality (4)
- ✅ Has explanation
- ✅ Addresses "why"
- ✅ Appropriate depth
- ✅ Well-structured

### Completeness (8)
- ✅ Direct answer
- ✅ Code examples
- ✅ Comprehensive explanation
- ✅ Multiple examples (if needed)
- ✅ Pitfalls mentioned
- ✅ Trade-offs discussed
- ✅ Best practices
- ✅ Advanced topics

### Citations (3)
- ✅ Has citations
- ✅ Sequential numbering
- ✅ Source list

### Format (3)
- ✅ Has structure
- ✅ Code blocks tagged
- ✅ Reasonable length

---

## Metrics Dashboard

```typescript
// Get aggregate metrics
const metrics = qualityMetricsTracker.getAggregateMetrics(7) // Last 7 days

console.log('Quality Report:', {
  totalQueries: metrics.totalQueries,
  avgQuality: metrics.averageScores.overall,
  validationPassRate: metrics.validationPassRate,
  cacheHitRate: metrics.cacheHitRate,
  avgResponseTime: metrics.averageResponseTime,
  userSatisfaction: metrics.averageRating,
})

// Export for analysis
const exportData = qualityMetricsTracker.exportMetrics(30)
fs.writeFileSync('metrics-export.json', exportData)

// Get low-performing queries
const lowQuality = qualityMetricsTracker.getLowPerformingQueries(70)
console.log('Queries needing improvement:', lowQuality.length)
```

---

## Quality Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Overall Quality | 85+ | 70+ |
| Accuracy | 90+ | 75+ |
| Completeness | 85+ | 70+ |
| Clarity | 80+ | 65+ |
| Code Quality | 90+ | 75+ |
| Validation Pass Rate | 90% | 75% |
| User Satisfaction | 4.0/5 | 3.5/5 |

---

## Code Example Standards

**All code examples must have:**

```typescript
// ✅ GOOD EXAMPLE
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = (content: string) => {
    // Create new message with proper type
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <ChatWindow
      messages={messages}
      onSend={handleSend}
    />
  )
}

export default ChatExample
```

**Requirements:**
- ✅ Complete imports
- ✅ Type definitions
- ✅ Explicit types (no `any`)
- ✅ Complete function
- ✅ Inline comments
- ✅ Export statement

---

## Explanation Structure

```markdown
# Feature Title

## Why This Exists

[Explain the purpose and problem it solves]

## How It Works

[Step-by-step explanation with mental models]

## Basic Usage

[Complete code example]

## Common Pitfalls

[What to avoid and why]

## Performance Considerations

[Optimization tips and trade-offs]

## Related Concepts

[Links to related documentation]
```

---

## Error Handling

```typescript
// Handle low quality responses
const validation = validateResponse(response, criteria, query)

if (!validation.valid) {
  if (validation.score < 0.6) {
    // Critical: regenerate
    return await regenerateWithImprovements(query, validation.suggestions)
  } else if (validation.score < 0.8) {
    // Warning: log but allow
    console.warn('Quality warning:', validation.issues)
  }
}

// Auto-retry on failures
const MAX_RETRIES = 2
let attempts = 0

while (attempts < MAX_RETRIES) {
  const response = await generateResponse(prompt)
  const validation = validateResponse(response, criteria, query)

  if (validation.valid && validation.score >= 0.7) {
    break // Success
  }

  attempts++
  console.warn(`Attempt ${attempts} failed, retrying...`)
}
```

---

## Best Practices

### 1. Always Classify First
```typescript
// ❌ Don't guess
const prompt = generateEnhancedSystemPrompt(query, 'complex', ...)

// ✅ Let the system decide
const classification = classifyQueryEnhanced(query)
const prompt = generateEnhancedSystemPrompt(query, classification.complexity, ...)
```

### 2. Use Recommended Strategy
```typescript
const strategy = getRecommendedPromptStrategy(classification)

if (strategy.useCoT && strategy.useCitations) {
  // Use advanced prompting
}
```

### 3. Always Validate
```typescript
const validation = validateResponse(response, criteria, query)
if (!validation.valid && validation.score < 0.6) {
  // Regenerate or escalate
}
```

### 4. Track Everything
```typescript
qualityMetricsTracker.log(metrics)
```

---

## Common Patterns

### Pattern 1: Simple Query
```typescript
const classification = classifyQueryEnhanced("What is the import path?")
// complexity: 'simple', confidence: 0.92

const prompt = generateEnhancedSystemPrompt(query, 'simple', false, true)
// temp: 0.3, maxTokens: 800, direct answer expected
```

### Pattern 2: Moderate Query
```typescript
const classification = classifyQueryEnhanced("How do I implement dark mode?")
// complexity: 'moderate', needsCodeExample: true

const prompt = generateEnhancedSystemPrompt(query, 'moderate', true, true)
// temp: 0.5, maxTokens: 1500, answer + code + context
```

### Pattern 3: Complex Query
```typescript
const classification = classifyQueryEnhanced("Compare memory approaches and recommend best")
// complexity: 'complex', needsComparison: true, needsMultipleExamples: true

const prompt = generateEnhancedSystemPrompt(query, 'complex', true, true)
// temp: 0.7, maxTokens: 3000, comprehensive analysis
```

---

## Debugging

### Issue: Low Validation Scores

**Check:**
```typescript
const report = formatValidationReport(validation)
console.log(report)
```

**Fix:**
- Review failed checks
- Check suggestions
- Adjust prompt parameters
- Verify examples are complete

### Issue: Poor Classification

**Check:**
```typescript
const report = formatClassificationReport(classification)
console.log(report)
```

**Fix:**
- Review confidence score
- Check dimension scores
- Verify query preprocessing
- Adjust classification thresholds

### Issue: High Token Usage

**Check:**
```typescript
const metrics = qualityMetricsTracker.getAggregateMetrics(7)
console.log('Avg tokens:', metrics.averageTokensUsed)
```

**Fix:**
- Use simpler prompts for simple queries
- Enable caching
- Adjust maxTokens limits
- Route to cheaper models

---

## Quick Tips

1. **Classification confidence < 0.7?** → Manual review recommended
2. **Validation score < 60?** → Regenerate required
3. **Validation score 60-80?** → Log warning, allow
4. **Validation score 80+?** → Good quality
5. **User feedback < 3.5?** → Review specific issues
6. **Cache hit rate < 30%?** → Improve caching strategy
7. **Response time > 3s?** → Optimize model selection

---

## Files Reference

- **`enhanced-complexity-classifier.ts`** - Query classification
- **`enhanced-system.ts`** - System prompts
- **`response-validation.ts`** - Quality validation
- **`quality-metrics.ts`** - Metrics tracking
- **`index.ts`** - Main exports
- **`README.md`** - Full documentation
- **`INTEGRATION_EXAMPLE.ts`** - Complete example
- **`QUICK_REFERENCE.md`** - This file

---

## Support

**Need help?**
- 📖 Full docs: `README.md`
- 💻 Example: `INTEGRATION_EXAMPLE.ts`
- 🧪 Tests: `tests/ai/prompting.test.ts`
- 📊 Summary: `PROMPT_QUALITY_IMPROVEMENTS.md`

---

**Last Updated**: January 27, 2026
