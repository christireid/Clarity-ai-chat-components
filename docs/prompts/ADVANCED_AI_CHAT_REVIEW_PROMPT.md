# Advanced AI Chat Features - Work Enhancement Review Prompt

> **Purpose**: Specialized continuation prompt for reviewing and enhancing advanced AI chat functionality in Clarity Chat. Covers streaming, agents, tools, memory, token optimization, multi-modal, and real-time features.

---

## Context Variables

Before using, fill in:

- `[BRANCH_NAME]`: The branch or PR being reviewed
- `[WORK_SUMMARY]`: One-line description of what was built
- `[FEATURE_AREA]`: streaming | agents-tools | memory | token-optimization | multi-modal | real-time | provider-abstraction

---

## The Prompt

> **Note**: Copy the content below. The prompt is presented in a collapsible section to preserve code block formatting.

<details>
<summary>Click to expand full prompt template</summary>

# Mission: Advanced AI Chat Feature Enhancement Review

You are a senior AI/ML engineer conducting a thorough review of advanced chat functionality in the Clarity Chat codebase. Your goal is to identify logical enhancements that push the feature toward production excellence while staying within scope.

**Critical Constraint**: Every suggestion must be a logical extension of the existing work. No scope creep, no tangential features, no "while we're at it" additions.

## Work Under Review

- **Branch/PR**: [BRANCH_NAME]
- **Summary**: [WORK_SUMMARY]
- **Feature Area**: [FEATURE_AREA]

---

## Phase 0: Deep Understanding

Before suggesting anything, deeply understand the AI chat feature implementation.

### 0.1 Feature Discovery

Run these commands based on your feature area:

```bash
# General: What files changed?
git diff main --name-only

# Streaming-specific
grep -rn "ReadableStream\|TextEncoder\|EventSource\|SSE" packages/react/src/ --include="*.ts"
grep -rn "useStreaming\|stream" packages/react/src/hooks/ --include="*.ts"

# Agents & Tools
grep -rn "createAgent\|Tool\|ToolUI\|function_call" packages/react/src/ --include="*.ts"
find packages/react/src -name "*agent*" -o -name "*tool*"

# Memory
grep -rn "MemoryProvider\|useMemory\|summariz" packages/ --include="*.ts"
cat packages/memory/src/index.ts

# Token Optimization
grep -rn "token\|budget\|KVCache\|segment" packages/react/src/ --include="*.ts"
find packages/react/src -path "*token*" -name "*.ts"

# Multi-modal
grep -rn "image\|audio\|file\|attachment\|MessageContent" packages/react/src/ --include="*.ts"

# Real-time / WebSocket
grep -rn "WebSocket\|ws\|realtime\|reconnect" packages/react/src/ --include="*.ts"

# Provider abstraction
grep -rn "Provider\|openai\|anthropic\|gemini" packages/react/src/ --include="*.ts"
```

### 0.2 AI Chat Feature Analysis

Answer these feature-specific questions:

**For Streaming Features:**
1. What's the streaming transport? (SSE vs WebSocket vs fetch)
2. How are partial tokens handled?
3. Is there backpressure handling?
4. What happens on connection drop?
5. Are there retry/reconnection strategies?

**For Agents & Tools:**
1. How is the tool schema defined?
2. Is there tool result UI rendering?
3. How are parallel tool calls handled?
4. Is there human-in-the-loop for dangerous tools?
5. Are tool errors gracefully handled?

**For Memory:**
1. What's the memory strategy? (sliding-window, summarization, hybrid)
2. How is context window managed?
3. Is there semantic retrieval?
4. How is conversation summarized?
5. What storage backend is used?

**For Token Optimization:**
1. Is KV-cache alignment implemented?
2. How are prompt segments prioritized?
3. Is there dynamic output limiting?
4. Is semantic caching used?
5. How is token counting done?

**For Multi-modal:**
1. Which content types are supported?
2. How are images encoded/transmitted?
3. Is there file validation?
4. How are large files handled?
5. Are there content type restrictions per provider?

**For Real-time:**
1. What's the connection lifecycle?
2. How are disconnections handled?
3. Is there message queuing during reconnection?
4. How is state synchronized?
5. Are there heartbeat/ping mechanisms?

### 0.3 Implementation Review

For the specific feature area, document:

```markdown
### Architecture Analysis
- **Data Flow**: [How data moves through the feature]
- **State Management**: [Where state lives, how it's updated]
- **Error Boundaries**: [How errors propagate and are caught]
- **Performance Characteristics**: [Time/space complexity, bottlenecks]

### Integration Points
- **Consumes**: [APIs, hooks, providers this feature uses]
- **Provides**: [What this feature exposes to consumers]
- **Provider Compatibility**: [OpenAI | Anthropic | Google | All]
```

---

## Phase 1: Feature-Specific Research

Research current best practices for the specific AI chat feature area.

### Research Queries by Feature Area

**Streaming:**
```
- "Server-sent events vs WebSocket AI streaming 2024"
- "React streaming text animation patterns"
- "AI response streaming backpressure handling"
- "Vercel AI SDK streaming implementation"
- "OpenAI streaming API best practices"
```

**Agents & Tools:**
```
- "AI function calling patterns 2024"
- "React tool UI rendering patterns"
- "AI agent orchestration patterns"
- "OpenAI function calling vs Anthropic tool use"
- "Human-in-the-loop AI tool execution"
```

**Memory:**
```
- "AI conversation memory strategies 2024"
- "RAG retrieval React integration"
- "Conversation summarization prompts"
- "Vector database conversation search"
- "Context window optimization LLM"
```

**Token Optimization:**
```
- "LLM KV-cache optimization prompts"
- "Token counting tiktoken alternatives"
- "Semantic caching AI responses"
- "Dynamic context window management"
- "Prompt compression techniques 2024"
```

**Multi-modal:**
```
- "Multi-modal AI React components"
- "Image upload AI chat patterns"
- "GPT-4 Vision integration React"
- "Audio transcription streaming"
- "File handling AI applications"
```

**Real-time:**
```
- "WebSocket reconnection strategies React"
- "Real-time sync patterns AI chat"
- "Presence indicators chat applications"
- "Optimistic updates chat React"
- "Message delivery guarantees patterns"
```

### Document Findings

For each relevant insight:

```markdown
### Research Finding #N

**Source**: [URL or reference]
**Feature Area**: [streaming | agents | memory | etc.]
**Relevance**: [1-5]

**Key Insight**:
[2-3 sentences]

**Code Pattern** (if applicable):
```typescript
// Example implementation from source
```

**Application to Clarity Chat**:
[How to apply this specifically]

**Trade-offs**:
[Any downsides or considerations]
```

---

## Phase 2: Feature-Specific Enhancement Categories

Review each category relevant to your feature area.

### Streaming Enhancements
- [ ] **Chunk Assembly** - Are partial tokens handled correctly?
- [ ] **Backpressure** - Does UI handle fast streams gracefully?
- [ ] **Cancellation** - Can users abort mid-stream?
- [ ] **Error Recovery** - Graceful handling of stream interruption?
- [ ] **Progress Indication** - Token count, time elapsed visible?
- [ ] **Markdown Streaming** - Does markdown render progressively?
- [ ] **Code Block Streaming** - Syntax highlighting during stream?
- [ ] **Typing Animation** - Natural character-by-character reveal?

### Agent & Tool Enhancements
- [ ] **Tool Schema Validation** - Are tool inputs validated?
- [ ] **Tool Result Rendering** - Custom UI for each tool type?
- [ ] **Parallel Execution** - Multiple tools run concurrently?
- [ ] **Tool Timeout** - Long-running tools handled?
- [ ] **Confirmation UI** - Dangerous actions require approval?
- [ ] **Tool Error Display** - Clear error states in UI?
- [ ] **Tool Progress** - Loading states during execution?
- [ ] **Tool History** - Can users see past tool executions?

### Memory Enhancements
- [ ] **Context Injection** - Relevant memories surfaced?
- [ ] **Memory Visualization** - Can users see what's remembered?
- [ ] **Manual Memory** - Users can pin/unpin memories?
- [ ] **Summarization Quality** - Are summaries accurate?
- [ ] **Memory Search** - Semantic search over history?
- [ ] **Memory Limits** - Graceful handling of full context?
- [ ] **Cross-Session** - Memories persist across sessions?
- [ ] **Memory Privacy** - Clear data ownership and deletion?

### Token Optimization Enhancements
- [ ] **Budget Visibility** - Users see token usage?
- [ ] **Auto-Trimming** - Smart message pruning?
- [ ] **Priority Segments** - System prompts protected?
- [ ] **Cache Hit Rate** - Semantic cache effectiveness?
- [ ] **Cost Estimation** - Price shown before send?
- [ ] **Output Limiting** - Dynamic max tokens by task?
- [ ] **Compression UI** - Show compression savings?
- [ ] **Warning Thresholds** - Alert at 80%/95% budget?

### Multi-modal Enhancements
- [ ] **Image Preview** - Thumbnails before send?
- [ ] **File Validation** - Size/type limits enforced?
- [ ] **Upload Progress** - Clear progress indicators?
- [ ] **Paste Support** - Images from clipboard?
- [ ] **Drag & Drop** - File drop zone?
- [ ] **Image in Response** - AI-generated images displayed?
- [ ] **Alt Text** - Accessibility for images?
- [ ] **File Compression** - Auto-compress large images?

### Real-time Enhancements
- [ ] **Connection Status** - Visible online/offline state?
- [ ] **Reconnection** - Automatic with exponential backoff?
- [ ] **Message Queue** - Offline messages sent on reconnect?
- [ ] **Typing Indicators** - Show when AI is "thinking"?
- [ ] **Read Receipts** - Message delivery confirmation?
- [ ] **Presence** - Multi-user awareness (if applicable)?
- [ ] **Heartbeat** - Connection health monitoring?
- [ ] **Graceful Degradation** - Fallback when WebSocket fails?

---

## Phase 3: Prioritize

For each enhancement, use this AI-chat-specific impact scale:

**Impact (1-5) for AI Chat Features:**
- 5: Prevents data loss, fixes broken core flow, or is security-critical
- 4: Major UX improvement for primary use case (sending/receiving messages)
- 3: Noticeable improvement to advanced feature (tools, memory, etc.)
- 2: Nice polish that improves perceived quality
- 1: Minor improvement most users won't notice

**Effort (1-5):**
- 1: < 1 hour (UI tweak, small fix)
- 2: 1-4 hours (new component, hook modification)
- 3: 4-8 hours (feature addition, integration work)
- 4: 1-3 days (new system, major refactor)
- 5: 3+ days (architecture change, new provider support)

---

## Phase 4: Generate Output

### Required Output Format

```markdown
## AI Chat Feature Enhancement Report

### Work Reviewed
- **Branch/PR**: [identifier]
- **Summary**: [one-line description]
- **Feature Area**: [streaming | agents-tools | memory | token-optimization | multi-modal | real-time]

### Research Summary
[3-5 key insights from AI/ML best practices research with sources]

### Provider Compatibility Check
| Enhancement | OpenAI | Anthropic | Google | Notes |
|-------------|--------|-----------|--------|-------|
| [feature] | check/warning/x | check/warning/x | check/warning/x | [notes] |

### Quick Wins (Do First)
| Enhancement | Category | Impact | Effort | Provider Support |
|-------------|----------|--------|--------|------------------|
| [specific] | [cat] | 4 | 1 | All / Partial |

### Major Improvements (Plan)
| Enhancement | Category | Impact | Effort | Provider Support |
|-------------|----------|--------|--------|------------------|
| [specific] | [cat] | 5 | 4 | All / Partial |

### Polish Items (Batch)
| Enhancement | Category | Impact | Effort | Provider Support |
|-------------|----------|--------|--------|------------------|
| [specific] | [cat] | 2 | 1 | All |

---

## Detailed Implementation Prompts

For the top 3 priority enhancements, provide AI-chat-specific implementation guidance:

### Enhancement 1: [Name]

**Category**: [streaming | agents | memory | tokens | multi-modal | real-time]
**Impact**: X/5 | **Effort**: X/5
**Provider Support**: [OpenAI check | Anthropic check | Google warning]

**Current State**:
```typescript
// Current implementation
```

**Target State**:
```typescript
// Improved implementation with AI-specific patterns
```

**Implementation Approach**:
1. [Step with AI/streaming consideration]
2. [Step with provider compatibility note]
3. [Step with UX consideration for chat context]

**Acceptance Criteria**:
- [ ] [Measurable criterion - e.g., "Stream displays within 100ms of first token"]
- [ ] [Provider criterion - e.g., "Works with all three providers"]
- [ ] [UX criterion - e.g., "Loading state visible during tool execution"]

**Test Cases**:
```typescript
describe('[Feature]', () => {
  it('should handle streaming interruption gracefully', async () => {
    // AI-specific test case
  })

  it('should work with [Provider] API', async () => {
    // Provider-specific test
  })
})
```

**Related Clarity Chat APIs**:
- `useStreamingSSE` - [how it relates]
- `useClarityChat` - [integration point]
- `ToolUIRegistry` - [if tools involved]
```

---

## Validation Checklist

Before finalizing, verify each suggestion against AI chat concerns:

- [ ] Does this work with streaming responses?
- [ ] Is it compatible with all three providers (OpenAI, Anthropic, Google)?
- [ ] Does it handle partial/incomplete AI responses?
- [ ] Is it resilient to API errors and rate limits?
- [ ] Does it maintain conversation context correctly?
- [ ] Is it accessible for users with assistive technology?
- [ ] Does it respect token limits and budgets?
- [ ] Is the UX appropriate for potentially slow AI responses?

If ANY answer is "No" without justification -> Flag for discussion.

---

## Target Outputs

- **3-5 Quick Wins**: Immediately actionable, < 4 hours each
- **2-3 Major Items**: Worth planning, need breakdown
- **3 Detailed Prompts**: With provider compatibility and test cases
- **Research Summary**: AI/ML insights that informed suggestions
- **Provider Compatibility Matrix**: Clear support status per provider

</details>

---

## Feature-Specific Quick References

### Streaming Quick Reference

```typescript
// Key patterns for streaming enhancements
import {
  useStreamingSSE,
  useStreamingWebSocket,
  StreamingMessage,
  useStreamableUI,
} from '@clarity-chat/react'

// SSE streaming pattern
const stream = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder()
    for await (const chunk of aiStream) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
    }
    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
    controller.close()
  }
})
```

### Agents & Tools Quick Reference

```typescript
// Key patterns for tool enhancements
import {
  createAgent,
  Tool,
  ToolUIRegistry,
  useClarityChatWithTools,
} from '@clarity-chat/react'

// Tool definition pattern
const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name' }
    },
    required: ['location']
  },
  execute: async (args) => {
    // Tool implementation
  }
}

// Tool UI registration
ToolUIRegistry.register('get_weather', WeatherToolUI)
```

### Memory Quick Reference

```typescript
// Key patterns for memory enhancements
import {
  MemoryProvider,
  useMemoryContext,
  MemoryService,
} from '@clarity-chat/react'

// Memory configuration
const memoryConfig: ClarityMemoryOptions = {
  enabled: true,
  strategy: 'hybrid',           // sliding-window | summarization | hybrid
  maxTokens: 2000,
  summarizationThreshold: 10,   // messages before summarizing
}
```

### Token Optimization Quick Reference

```typescript
// Key patterns for token optimization
import {
  useTokenBudget,
  buildKVCacheOptimizedPrompt,
  createSystemSegment,
  createHistorySegment,
  createUserSegment,
} from '@clarity-chat/react'

// Note: Actual function signatures require 'id' as first parameter
// KV-cache aligned prompt building
const prompt = buildKVCacheOptimizedPrompt(
  [
    createSystemSegment('sys-1', 'You are a helpful assistant.', 'must-have'),
    createHistorySegment('hist-1', 'Previous message', 'user', 'low'),
    createUserSegment('user-1', 'Current question'),
  ],
  {
    maxInputTokens: 4000,
    reservedForOutput: 1000,
  }
)
```

---

## Example Usage

### Input
```
Branch: feature/streaming-markdown-support
Summary: Added progressive markdown rendering during AI response streaming
Feature Area: streaming
```

### Expected Output Structure
```markdown
## AI Chat Feature Enhancement Report

### Work Reviewed
- **Branch/PR**: feature/streaming-markdown-support
- **Summary**: Added progressive markdown rendering during AI response streaming
- **Feature Area**: streaming

### Research Summary
1. **Vercel AI SDK** uses a token buffer approach to prevent partial word rendering...
2. **React 19 Suspense patterns** can be leveraged for streaming content...
3. **Code block streaming** best practice is to delay syntax highlighting until complete...

### Provider Compatibility Check
| Enhancement | OpenAI | Anthropic | Google | Notes |
|-------------|--------|-----------|--------|-------|
| Token buffering | All | All | All | All support streaming |

### Quick Wins (Do First)
| Enhancement | Category | Impact | Effort | Provider Support |
|-------------|----------|--------|--------|------------------|
| Token boundary buffering | Streaming | 4 | 2 | All |

[... detailed implementation prompts ...]
```

---

## Notes

This specialized prompt extends the base work-enhancement-review template with:

1. **AI-specific research queries** for each feature area
2. **Provider compatibility matrices** (OpenAI, Anthropic, Google)
3. **Feature-specific enhancement checklists** covering streaming, tools, memory, etc.
4. **AI chat test case patterns** including provider-specific tests
5. **Quick reference code snippets** for each feature area's APIs

---

*Template Version: 1.0.0 | Last Updated: December 2025*
*Specialized for Clarity Chat advanced AI features including streaming, agents, memory, and multi-modal support*
