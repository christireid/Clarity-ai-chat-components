---
title: "AI Chat Analytics: The Metrics That Actually Matter"
description: "AI-specific metrics beyond page views. Task completion, response quality, cost per session, and conversation analytics."
keywords: ["AI analytics", "chat metrics", "KPIs", "conversation analytics", "user engagement"]
author: "Clarity Chat Team"
publishDate: 2025-03-27
readingTime: 11
category: "Strategy & Architecture"
relatedPosts: ["23-production-readiness-checklist", "10-token-counting", "13-cut-gpt4-bill"]
---

# AI Chat Analytics: The Metrics That Actually Matter

You're tracking page views. Your AI chat is generating 10,000 conversations a day. You have no idea if it's working.

Traditional web analytics don't map to conversational AI. "Sessions" and "bounce rate" mean nothing when users have 5-minute conversations. "Time on page" doesn't tell you if they got what they needed.

You need AI-specific metrics—and most teams aren't tracking them.

---

## Metrics That DON'T Matter for AI Chat

Stop importing your web analytics playbook. These metrics mislead more than they help:

**Page views**
What does a "page view" even mean in a chat context? The chat is one page. Users interact with it for varying durations. This metric tells you nothing.

**Bounce rate**
In web analytics, bouncing is bad—user landed and left without engaging. In chat, a user might ask one perfect question, get one perfect answer, and leave satisfied. That's a 100% bounce rate and a 100% success rate.

**Time on page**
Longer isn't necessarily better. A user who gets their answer in 30 seconds had a better experience than one who struggled for 10 minutes. Time on page could indicate confusion as easily as engagement.

**Click-through rate**
There are no links to click. CTR is meaningless.

**The problem:**
Traditional metrics optimize for engagement. AI chat should optimize for resolution—did the user get what they needed?

A user who asks one question, gets a perfect answer, and leaves immediately is a success story, not a failure. Your metrics should reflect that.

---

## Conversation Metrics

These actually tell you if your AI chat is working.

### 1. Resolution Rate

The most important metric: did the conversation end with the user's need met?

```typescript
function trackResolution(conversation: Conversation) {
  const resolved =
    conversation.userGaveFeedback?.positive ||
    conversation.completedDesiredAction ||
    !conversation.abandonedMidConversation

  analytics.track('conversation_ended', {
    conversationId: conversation.id,
    resolved,
    turnCount: conversation.messages.length,
    duration: conversation.endTime - conversation.startTime,
    resolutionMethod: resolved ? detectResolutionMethod(conversation) : null,
  })
}

function detectResolutionMethod(conversation: Conversation): string {
  if (conversation.userGaveFeedback?.positive) return 'explicit_feedback'
  if (conversation.completedDesiredAction) return 'action_completed'
  if (conversation.endedWithThanks) return 'thanks_detected'
  return 'implicit'
}
```

**Target:** 70%+ resolution rate
**Action if low:** Analyze unresolved conversations to find patterns

### 2. Messages Per Conversation

How many turns does it take to resolve queries?

| Count | Interpretation |
|-------|----------------|
| 1-2 | Either instant resolution or user giving up |
| 3-6 | Sweet spot—productive conversation |
| 7-10 | Might indicate confusion or complexity |
| 10+ | Likely frustration or AI not understanding |

```typescript
analytics.track('conversation_stats', {
  messageCount: conversation.messages.length,
  userMessages: conversation.messages.filter(m => m.role === 'user').length,
  assistantMessages: conversation.messages.filter(m => m.role === 'assistant').length,
  averageResponseLength: calculateAverageResponseLength(conversation),
})
```

Track distribution over time. If average messages per conversation is increasing, your AI might be getting worse at understanding users.

### 3. Response Quality Score

Direct feedback from users:

```tsx
// Import icons from lucide-react, heroicons, or your preferred icon library
// npm install lucide-react
import { ThumbsUp as ThumbsUpIcon, ThumbsDown as ThumbsDownIcon } from 'lucide-react'

// Analytics helper - replace with your analytics provider
const analytics = {
  track: (event: string, properties: Record<string, unknown>) => {
    console.log('[Analytics]', event, properties)
    // Send to your analytics provider (Mixpanel, Amplitude, Segment, etc.)
  }
}

function FeedbackButtons({ messageId }: { messageId: string }) {
  const trackFeedback = (score: number) => {
    analytics.track('message_feedback', {
      messageId,
      score, // 1 = positive, -1 = negative
      timestamp: new Date(),
    })
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => trackFeedback(1)} aria-label="Good response">
        <ThumbsUpIcon className="w-4 h-4" />
      </button>
      <button onClick={() => trackFeedback(-1)} aria-label="Bad response">
        <ThumbsDownIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
```

**Target:** 4.0+ out of 5 (or 80%+ positive with thumbs up/down)
**Action if low:** Review negative feedback patterns

### 4. Escalation Rate

How often do users ask for human help?

```typescript
analytics.track('escalation', {
  conversationId,
  messageNumber: currentMessageIndex,
  reason: detectEscalationReason(message), // 'frustration', 'complexity', 'explicit_request'
  conversationLengthAtEscalation: messages.length,
})
```

**Target:** <15% escalation rate
**Trend:** Should decrease over time as AI improves

---

## Performance Metrics

User experience depends heavily on speed.

### 1. Time to First Token (TTFT)

How long until the AI starts responding?

```typescript
const startTime = Date.now()

const response = await fetch('/api/chat', { /* ... */ })
const reader = response.body?.getReader()

let firstTokenTime: number | null = null

while (true) {
  const { done, value } = await reader.read()

  if (!firstTokenTime && value) {
    firstTokenTime = Date.now()
    analytics.track('performance_ttft', {
      ttft: firstTokenTime - startTime,
      model: selectedModel,
      inputTokens: countTokens(message),
    })
  }

  if (done) break
}
```

**Target:** <500ms p95
**Impact:** TTFT dramatically affects perceived speed

### 2. Tokens Per Second

Streaming speed once response starts:

```typescript
analytics.track('performance_streaming', {
  totalTokens: outputTokenCount,
  streamDuration: streamEndTime - firstTokenTime,
  tokensPerSecond: outputTokenCount / ((streamEndTime - firstTokenTime) / 1000),
})
```

**Target:** 30-50 tokens/second
**Below 20:** Noticeably slow, feels sluggish

### 3. End-to-End Latency

Total time from send to complete response:

| Query Type | Target | Acceptable | Poor |
|------------|--------|------------|------|
| Simple | <2s | <3s | >5s |
| Medium | <5s | <8s | >15s |
| Complex | <10s | <20s | >30s |

### 4. Error Rate

Percentage of requests that fail:

```typescript
analytics.track('request_result', {
  success: !error,
  errorType: error?.type,
  errorCode: error?.code,
  retryCount,
})

// Aggregate metrics
const errorRate = failedRequests / totalRequests
// Target: <1%
// Alert threshold: >3%
```

---

## Cost Metrics

Know what you're spending and why.

### 1. Cost Per Conversation

```typescript
function trackConversationCost(conversation: Conversation) {
  const totalInputTokens = conversation.messages.reduce(
    (sum, m) => sum + m.inputTokens, 0
  )
  const totalOutputTokens = conversation.messages.reduce(
    (sum, m) => sum + m.outputTokens, 0
  )

  const cost = calculateCost(totalInputTokens, totalOutputTokens, conversation.model)

  analytics.track('conversation_cost', {
    conversationId: conversation.id,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    cost,
    costPerMessage: cost / conversation.messages.length,
    userSegment: conversation.user.segment,
  })
}
```

**Track by segment:** Different user types have different cost profiles

### 2. Cost Per Resolution

The true cost-effectiveness metric—what does it cost to actually help a user?

```typescript
const costPerResolution = totalCost / resolvedConversations
// Compare to human support cost ($12-20 per ticket)
// AI should be 10-100x cheaper
```

### 3. Token Trends

Watch for context bloat:

```typescript
// Track over time
analytics.track('token_trends', {
  date: today,
  averageInputTokens: calculateAverage(inputTokens),
  averageOutputTokens: calculateAverage(outputTokens),
  p95InputTokens: calculatePercentile(inputTokens, 95),
  contextGrowthRate: compareToLastWeek(averageInputTokens),
})
```

If average input tokens is growing, your context management might need work.

---

## Behavioral Metrics

Understand how users actually interact.

### 1. Feature Usage

Which features do users actually use?

```typescript
// Track feature interactions
analytics.track('feature_used', {
  feature: 'copy_code',
  context: 'code_block',
  messageIndex: 3,
})

analytics.track('feature_used', {
  feature: 'regenerate_response',
  previousResponseLength: 450,
  feedback: 'implicit_negative', // They regenerated, so original wasn't good
})

analytics.track('feature_used', {
  feature: 'edit_message',
  originalLength: 50,
  editedLength: 75,
})
```

**Insights:**
- High copy usage = code blocks are valuable
- High regenerate usage = response quality issues
- Low edit usage = users accept first message (good UX)

### 2. Abandonment Points

Where do users give up?

```typescript
analytics.track('conversation_abandoned', {
  conversationId,
  lastMessageIndex: messages.length - 1,
  lastAction: 'waiting_for_response', // or 'reading_response', 'typing'
  waitDuration: timeSinceLastInteraction,
  lastMessageContent: anonymize(lastMessage),
})
```

**Common abandonment patterns:**
- After error messages (improve error UX)
- During long responses (show progress)
- After unhelpful response (improve AI quality)

### 3. Return Rate

Do users come back?

```typescript
const DAU = uniqueUsersToday
const MAU = uniqueUsersThisMonth
const stickinessRatio = DAU / MAU
// Target: >20% for daily utility tools
```

High return rate indicates genuine usefulness.

---

## Setting Up Analytics

Integrate with your existing stack:

```typescript
// Analytics provider setup
interface AnalyticsConfig {
  providers: Array<'posthog' | 'mixpanel' | 'amplitude' | 'segment'>
  events: {
    conversation: string[]
    message: string[]
    feature: string[]
    performance: string[]
  }
}

const config: AnalyticsConfig = {
  providers: ['posthog', 'mixpanel'],
  events: {
    conversation: ['started', 'ended', 'resolved', 'escalated', 'abandoned'],
    message: ['sent', 'received', 'feedback', 'error', 'retry'],
    feature: ['copy', 'regenerate', 'edit', 'stop', 'expand'],
    performance: ['ttft', 'streaming_speed', 'total_latency', 'error'],
  },
}

// Auto-track standard events
function useAnalytics(config: AnalyticsConfig) {
  // Hook implementation that auto-tracks based on config
}
```

---

## Dashboard Essentials

What to show on your AI chat dashboard:

**Overview (real-time):**
- Active conversations right now
- Messages in last hour
- Error rate (with alert threshold)
- Costs today vs budget

**Quality (daily/weekly):**
- Resolution rate trend
- Average messages per conversation
- Response quality score
- Escalation rate

**Performance (hourly):**
- TTFT p50, p95
- Error rate by type
- Latency distribution

**Cost (daily):**
- Total spend
- Cost per conversation
- Cost per resolution
- Token breakdown (input vs output vs context)

---

## The Takeaway

Traditional web analytics don't work for AI chat. You need conversation-specific metrics:

1. **Resolution rate** — Did users get what they needed?
2. **Messages per conversation** — How efficient is the AI?
3. **Response quality** — Are responses actually good?
4. **Cost per resolution** — What does success cost?
5. **TTFT and latency** — How fast is the experience?

Stop tracking page views. Start tracking whether your AI is actually helping people.

---

*Clarity Chat includes analytics integration with 7 providers and 35+ pre-defined events. Stop guessing if your AI chat is working—know. [See the analytics docs →](/docs/analytics)*
