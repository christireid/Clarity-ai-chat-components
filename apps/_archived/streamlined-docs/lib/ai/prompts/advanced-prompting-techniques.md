# Advanced Prompting Techniques - Decision Guide

**Purpose**: This document guides AI reasoning about which prompting technique(s) to use for a given
query. Instead of hardcoded if/else logic, the AI should reason about the best approach based on
query characteristics and user needs.

---

## Core Principle

**The AI should reason about the appropriate technique(s) based on:**

1. Query complexity
2. Domain requirements (accuracy, creativity, technical depth)
3. Trust requirements (casual answer vs critical decision)
4. Available context (sources, documentation)
5. User expectations (fast response vs thorough analysis)

**NOT based on:**

- Hardcoded configuration flags
- Static rules
- Binary choices

---

## Available Techniques

### 1. Chain-of-Thought (CoT)

**What it is**: Explicit step-by-step reasoning before providing an answer.

**When to use**:

- Complex queries requiring multi-step reasoning
- Technical troubleshooting
- Architectural decisions
- Comparative analysis
- When the answer path isn't obvious
- When you need to show your work

**Characteristics**:

```
Thinking: First, I need to understand...
Step 1: Analyze the requirements...
Step 2: Consider the trade-offs...
Step 3: Evaluate options...
Answer: Based on this reasoning, I recommend...
```

**Benefits**:

- Reduces hallucination through explicit reasoning
- Makes decision process transparent
- Catches logical errors mid-stream
- Improves answer quality for complex queries

**Cost**: +20-40% tokens (reasoning overhead)

**Examples where CoT helps**:

- "How should I architect a scalable chat system?"
- "Why is my React component re-rendering?"
- "What's the best way to implement caching?"
- "Compare Next.js SSR vs SSG for my use case"

**Examples where CoT is overkill**:

- "What's the API endpoint for messages?"
- "Show me the import path for ChatWindow"
- "What version of React do you use?"

### 2. Citation-Grounded Responses

**What it is**: Requiring every claim to be backed by a specific source citation.

**When to use**:

- Technical documentation queries
- API reference questions
- Version-specific information
- Security/compliance requirements
- When accuracy is critical
- When user needs to verify claims

**Characteristics**:

```
Answer: The ChatWindow component accepts a `theme` prop [1].
It supports both light and dark modes [2].

Sources:
[1] packages/react/src/components/ChatWindow.tsx:45
[2] packages/react/docs/theming.md:12
```

**Benefits**:

- Eliminates hallucination (uncited claims are flagged)
- Provides verification path
- Increases user trust
- Makes outdated information obvious

**Cost**: +30-50% tokens (citation overhead)

**Examples where citations are critical**:

- "What props does ChatWindow accept?"
- "How do I configure token limits?"
- "What's the bundle size of core-minimal?"
- "Is feature X supported in version Y?"

**Examples where citations are overkill**:

- "How do I get started with Clarity Chat?" (conceptual)
- "What are best practices for chat UIs?" (general advice)
- "Explain the architecture" (high-level overview)

### 3. Strict Mode (Enhanced Validation)

**What it is**: Extra-strict citation requirements with validation warnings.

**When to use**:

- Mission-critical decisions
- Security-related queries
- Compliance documentation
- Financial/legal implications
- Production deployment decisions
- When wrong answer has serious consequences

**Characteristics**:

- Every claim must have citation
- Citations are validated against sources
- Warnings for weak/missing citations
- Conservative error handling

**Benefits**:

- Maximum accuracy guarantee
- Flags potential issues
- Forces thorough verification

**Cost**: +40-60% tokens + validation overhead

**Examples where strict mode is justified**:

- "What are the security requirements for production?"
- "How do we handle PII in chat logs?"
- "What's our GDPR compliance strategy?"
- "Which API rate limits apply?"

**Examples where strict mode is excessive**:

- "How do I style a button?" (low stakes)
- "What's a good color for headers?" (subjective)
- "Show me example code" (demonstration)

### 4. Simple Prompting

**What it is**: Direct question-answer without special techniques.

**When to use**:

- Simple factual queries
- Quick lookups
- Low-stakes answers
- When speed matters more than perfection
- When context is minimal

**Characteristics**:

```
Question: What's the import path?
Answer: import { Chat } from '@clarity-chat/react'
```

**Benefits**:

- Fast response
- Low token cost
- Clear and direct

**Cost**: Baseline (no overhead)

**Examples where simple prompting is sufficient**:

- "Show me a basic example"
- "What's the quickest way to get started?"
- "Link to the docs"
- "What files define X?"

---

## Decision Matrix

Use this to reason about which technique(s) to apply:

| Query Type               | Complexity | Stakes | Recommended Approach     |
| ------------------------ | ---------- | ------ | ------------------------ |
| API lookup               | Low        | Low    | Simple or Citations      |
| Troubleshooting          | High       | Medium | CoT + Citations          |
| Architecture decision    | High       | High   | CoT + Citations          |
| Security question        | Medium     | High   | CoT + Citations (Strict) |
| Quick example            | Low        | Low    | Simple                   |
| Version compatibility    | Low        | Medium | Citations                |
| Performance optimization | High       | Medium | CoT + Citations          |
| Conceptual explanation   | Medium     | Low    | CoT or Simple            |

---

## Combining Techniques

### CoT + Citations (Most Powerful)

**When to use**: Complex queries where both reasoning and accuracy matter.

**Example**:

```
Query: "Should I use SSR or SSG for my docs site?"

Thinking: This requires comparing trade-offs...
Step 1: Understand the use case (docs site = mostly static)
Step 2: Consider update frequency (docs change occasionally)
Step 3: Evaluate performance needs (fast initial load critical)
Step 4: Factor in implementation cost

Answer: Use SSG with ISR [1]. Docs sites benefit from static
generation's fast load times [2], but ISR allows updates without
full rebuilds [3].

Sources:
[1] apps/streamlined-docs/next.config.js:23
[2] docs/performance.md:45
[3] apps/streamlined-docs/app/docs/page.tsx:12
```

**Benefits**: Best quality, verifiable reasoning, high trust. **Cost**: Highest token usage (CoT +
Citation overhead).

### CoT Only (For Reasoning-Heavy Tasks)

**When to use**: Complex questions where sources don't help or don't exist.

**Example**:

```
Query: "What architecture pattern should I use for real-time chat?"

Thinking: This requires evaluating multiple patterns...
Step 1: Identify requirements (real-time, scalability, cost)
Step 2: Consider options (WebSockets, SSE, polling)
Step 3: Evaluate trade-offs per option
Step 4: Make recommendation based on Clarity's context

Answer: Use WebSockets for bi-directional chat, with SSE as fallback...
```

**Benefits**: High-quality reasoning, transparent process. **Cost**: Medium token usage (CoT
overhead only).

### Citations Only (For Fact-Checking)

**When to use**: Straightforward questions where verification matters.

**Example**:

```
Query: "What props does ChatWindow accept?"

Answer: ChatWindow accepts these props [1]:
- theme: 'light' | 'dark'
- messages: Message[]
- onSend: (content: string) => void

Source:
[1] packages/react/src/components/ChatWindow.tsx:15-20
```

**Benefits**: Fast, verifiable, no reasoning overhead. **Cost**: Low-medium token usage (citation
overhead only).

---

## Anti-Patterns

### ❌ Using CoT for Simple Lookups

**Bad**:

```
Query: "What's the import path?"

Thinking: First, I need to find the package name...
Step 1: Identify the package structure...
Step 2: Locate the main export...
Step 3: Construct the import statement...

Answer: import { Chat } from '@clarity-chat/react'
```

**Why it's bad**: Wastes tokens, slows response, doesn't add value.

**Better**: Just answer directly.

### ❌ Using Citations Without Context

**Bad**:

```
Query: "How should I structure my chat app?"

Answer: Use components [1]. Add state management [2]. Handle errors [3].

Sources:
[1] docs/architecture.md
[2] docs/state.md
[3] docs/errors.md
```

**Why it's bad**: Citations don't help for conceptual questions. Sources are vague.

**Better**: Use CoT to reason through the architecture, cite only specific technical claims.

### ❌ Using Strict Mode for Low-Stakes Queries

**Bad**:

```
Query: "What color should I use for buttons?"

[Strict validation warning: No source citation for color recommendation]
[Validation error: Subjective claim requires citation]
```

**Why it's bad**: Over-engineering a simple, subjective question. No "right" answer exists.

**Better**: Use simple prompting or CoT (for explaining color theory), not strict citations.

### ❌ Mixing Techniques Without Reason

**Bad**: Applying CoT + Citations + Strict mode to every query by default.

**Why it's bad**: Maximum token cost, slow responses, frustrated users for simple questions.

**Better**: Match technique to query characteristics.

---

## Reasoning Process

When deciding which technique(s) to use, follow this process:

### Step 1: Classify the Query

Ask yourself:

- **Complexity**: Simple lookup, or multi-step reasoning?
- **Domain**: Technical fact, conceptual explanation, or subjective advice?
- **Stakes**: Low (styling), medium (architecture), or high (security)?
- **Sources**: Do I have relevant documentation to cite?

### Step 2: Match to Technique

Based on classification:

- **High complexity** → Consider CoT
- **High stakes + factual** → Consider Citations
- **Critical decision** → Consider Strict mode
- **Low complexity + low stakes** → Simple prompting

### Step 3: Consider Combinations

If multiple criteria apply:

- High complexity + high stakes + factual → CoT + Citations (Strict)
- High complexity + low stakes → CoT only
- Low complexity + high stakes + factual → Citations only
- Everything else → Simple

### Step 4: Optimize for User Experience

Bias toward:

- **Speed** for simple queries (avoid overhead)
- **Accuracy** for technical queries (use citations)
- **Transparency** for complex queries (use CoT)
- **Balance** for medium queries (pick one technique, not all)

---

## Examples with Full Reasoning

### Example 1: "What's the bundle size of core-minimal?"

**Analysis**:

- Complexity: Low (factual lookup)
- Domain: Technical fact
- Stakes: Medium (performance decision)
- Sources: Yes (documentation, examples)

**Decision**: Citations only (no reasoning needed, verification important)

**Response**:

```
The core-minimal bundle is ~30KB gzipped [1].

Source:
[1] packages/react/README.md:45
```

---

### Example 2: "Should I use memory for my chat app?"

**Analysis**:

- Complexity: Medium-high (requires understanding use case)
- Domain: Architectural decision
- Stakes: Medium
- Sources: Limited (general advice, not specific to user)

**Decision**: CoT only (reasoning helps, but no specific facts to cite)

**Response**:

```
Thinking: Memory is useful for context-aware conversations...

Step 1: Consider your use case - do conversations need historical context?
Step 2: Evaluate trade-offs - memory adds ~8KB and requires persistence
Step 3: Assess alternatives - could pass context explicitly per request

Answer: Use memory if conversations span multiple sessions or need to
reference past interactions. Skip it for single-turn Q&A or simple forms.
```

---

### Example 3: "How do I implement secure chat authentication?"

**Analysis**:

- Complexity: High (multi-faceted problem)
- Domain: Security (technical + architectural)
- Stakes: High (security critical)
- Sources: Yes (security docs, examples)

**Decision**: CoT + Citations (Strict) - reason through approach, cite every security claim

**Response**:

```
Thinking: Authentication for chat requires session management, token
validation, and secure transmission...

Step 1: Establish requirements (HTTPS [1], token-based auth [2])
Step 2: Design token flow (server-side generation, HttpOnly cookies [3])
Step 3: Implement validation (verify tokens on every request [4])
Step 4: Add security headers (CSRF protection [5], CSP [6])

Answer: Implement JWT-based authentication [2] with HttpOnly cookies [3].
Validate tokens server-side on every message [4]. Use HTTPS exclusively [1].
Add CSRF tokens for mutations [5] and strict CSP headers [6].

Sources:
[1] docs/security.md:12
[2] apps/streamlined-docs/lib/auth/jwt.ts:8
[3] apps/streamlined-docs/middleware.ts:23
[4] apps/streamlined-docs/app/api/chat/route.ts:34
[5] apps/streamlined-docs/lib/csrf.ts:5
[6] apps/streamlined-docs/middleware.ts:28
```

---

## Quality Metrics

Track these to optimize technique selection:

1. **Accuracy Rate**: % of answers that are factually correct
2. **Hallucination Rate**: % of claims without valid citations
3. **User Satisfaction**: Feedback on answer quality
4. **Response Time**: Latency per technique
5. **Token Usage**: Cost per technique
6. **Citation Validation**: % of citations that resolve correctly

**Targets**:

- Accuracy: >95% for technical queries
- Hallucination: <5% for critical queries
- Response Time: <2s for simple, <5s for complex
- Token Efficiency: <1.5x overhead for CoT, <2x for Citations

---

## Integration with Query Classifier

The query complexity classifier provides a starting point:

```typescript
type QueryComplexity = 'simple' | 'medium' | 'complex'

// Use as initial signal, not final decision:
if (complexity === 'simple') {
  // Lean toward Simple or Citations
} else if (complexity === 'complex') {
  // Lean toward CoT or CoT + Citations
}

// But still reason about:
// - Stakes (low/medium/high)
// - Domain (factual/conceptual/subjective)
// - Sources (available/limited/none)
```

---

## Conclusion

**Remember**: These are guidelines, not rules. The AI should reason about the best approach for each
query, considering:

1. What does the user really need? (speed vs accuracy vs transparency)
2. What information is available? (sources, context, examples)
3. What's at stake? (casual question vs critical decision)
4. What's the optimal balance? (quality vs cost vs speed)

**Default bias**: Start simple, add techniques only when they add clear value.
