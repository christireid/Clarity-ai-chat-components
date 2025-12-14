# Context Windows Are Lying to You: Managing 1M Tokens in Practice

Gemini 2.5 Pro supports 1 million tokens. So why does your app break at 50,000?

Marketing says "1M context window." Reality says performance degrades long before you hit that limit. The NoLiMa study found that for most popular LLMs, "performance degrades significantly as context length increases."

Your 45-message conversation shouldn't end with "Error: Maximum context length exceeded." But in 23% of AI chat apps I've tested, it does—without warning.

---

## The Context Window Lie

Here's what the vendors tell you:

| Model | Stated Limit |
|-------|--------------|
| GPT-4o | 128K tokens |
| Claude 3.5 Sonnet | 200K tokens |
| Gemini 2.5 Pro | 1M tokens |

Here's what actually happens:

| Model | Stated | Practical Limit |
|-------|--------|-----------------|
| GPT-4o | 128K | ~80K before quality drops |
| Claude 3.5 | 200K | ~120K before issues |
| Gemini 2.5 | 1M | ~500K usable |

Performance degrades gradually. At 50% capacity, you might not notice. At 80%, responses get slower, less coherent, more likely to miss details from earlier context. At 95%, you're rolling dice on every request.

The marketing number is a ceiling, not a target.

---

## How Conversation History Works

Here's the uncomfortable truth: LLMs are stateless.

Every message you send includes the *entire* conversation history. The model doesn't "remember" previous messages—you resend them every time.

```
Message 1: "Hello"
→ Sent to API: "Hello"
→ Total tokens: ~5

Message 2: "How are you?"
→ Sent to API: "Hello" + "Hi there!" + "How are you?"
→ Total tokens: ~15

Message 3: "Tell me about quantum computing"
→ Sent to API: [All previous messages] + "Tell me about quantum computing"
→ Total tokens: ~25

...

Message 30: "Thanks"
→ Sent to API: [All 29 previous messages + responses] + "Thanks"
→ Total tokens: ~15,000
```

Your API cost isn't per-message—it's cumulative. And that cumulative context grows with every exchange.

By message 50, you might be sending 50,000 tokens with each request. By message 100, you're at 100,000+. Eventually, you hit the wall.

---

## Context Management Strategies

You have four main options, each with tradeoffs.

### Strategy 1: Sliding Window

Keep only the last N messages. Simple and predictable.

```tsx
function useSlidingWindow(maxMessages: number = 20) {
  const [allMessages, setAllMessages] = useState<Message[]>([])

  const contextMessages = useMemo(() => {
    // Always keep system prompt
    const systemPrompt = allMessages.find(m => m.role === 'system')
    const conversationMessages = allMessages.filter(m => m.role !== 'system')

    // Take last N messages
    const recentMessages = conversationMessages.slice(-maxMessages)

    return systemPrompt
      ? [systemPrompt, ...recentMessages]
      : recentMessages
  }, [allMessages, maxMessages])

  return { allMessages, contextMessages, setAllMessages }
}
```

**Pros:** Simple, predictable memory usage
**Cons:** Loses early context ("What was the first thing I asked?")

### Strategy 2: Token Budget

Keep messages until you hit a token limit.

```tsx
function useTokenBudget(maxTokens: number = 4000) {
  const [messages, setMessages] = useState<Message[]>([])

  const contextMessages = useMemo(() => {
    let tokenCount = 0
    const result: Message[] = []

    // Iterate backwards (most recent first)
    for (let i = messages.length - 1; i >= 0; i--) {
      const msgTokens = estimateTokens(messages[i].content)

      if (tokenCount + msgTokens > maxTokens) {
        break
      }

      tokenCount += msgTokens
      result.unshift(messages[i])
    }

    return result
  }, [messages, maxTokens])

  return { messages, contextMessages, setMessages }
}

function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English
  return Math.ceil(text.length / 4)
}
```

**Pros:** Maximizes context within budget
**Cons:** Sudden cutoffs, loses earliest context

### Strategy 3: Summarization

Compress old messages into a summary, keeping recent ones intact.

```tsx
async function summarizeOldMessages(messages: Message[]): Promise<string> {
  const oldMessages = messages.slice(0, -10) // Keep last 10 intact

  if (oldMessages.length < 5) {
    return '' // Not enough to summarize
  }

  const response = await fetch('/api/summarize', {
    method: 'POST',
    body: JSON.stringify({
      messages: oldMessages,
      instruction: 'Summarize this conversation concisely, preserving key facts and decisions.',
    }),
  })

  return response.json().then(r => r.summary)
}

function useConversationWithSummary() {
  const [messages, setMessages] = useState<Message[]>([])
  const [summary, setSummary] = useState<string>('')

  const contextMessages = useMemo(() => {
    const result: Message[] = []

    // Add summary as system context if exists
    if (summary) {
      result.push({
        role: 'system',
        content: `Previous conversation summary:\n${summary}`,
      })
    }

    // Add recent messages
    result.push(...messages.slice(-10))

    return result
  }, [messages, summary])

  const pruneAndSummarize = async () => {
    const newSummary = await summarizeOldMessages(messages)
    setSummary(prev => prev + '\n\n' + newSummary)
    setMessages(prev => prev.slice(-10))
  }

  return { messages, contextMessages, pruneAndSummarize }
}
```

**Pros:** Preserves key information, compact
**Cons:** Loses nuance, adds latency, costs tokens to summarize

### Strategy 4: Semantic Retrieval (RAG)

Store all messages in a vector database. Retrieve only relevant ones for each query.

```tsx
// Embedding helper - use OpenAI, Cohere, or open-source models
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

function useSemanticContext(vectorStore: VectorStore) {
  const [messages, setMessages] = useState<Message[]>([])

  const getRelevantContext = async (query: string, k: number = 5) => {
    // Get embeddings for query
    const queryEmbedding = await embed(query)

    // Find similar messages
    const similar = await vectorStore.query(queryEmbedding, {
      topK: k,
      filter: { conversationId: currentConversation },
    })

    return similar.map(s => s.message)
  }

  const buildContext = async (query: string) => {
    const relevant = await getRelevantContext(query, 5)
    const recent = messages.slice(-5)

    // Combine relevant historical + recent
    return [...relevant, ...recent]
  }

  return { messages, buildContext, setMessages }
}
```

**Pros:** Intelligent retrieval, handles long histories
**Cons:** Complex infrastructure, embedding costs, potential relevance misses

---

## Making Token Usage Visible

Users shouldn't be surprised when they hit context limits. Show them:

```tsx
// Utility for conditional class names (npm install clsx tailwind-merge)
// Or use a simple version:
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

function formatNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()
}

interface TokenCounterProps {
  current: number
  max: number
  warningThreshold?: number
  onPrune?: () => void
}

function TokenCounter({
  current,
  max,
  warningThreshold = 0.8,
  onPrune,
}: TokenCounterProps) {
  const percentage = current / max
  const isWarning = percentage > warningThreshold
  const isCritical = percentage > 0.95

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all",
            isCritical ? "bg-red-500" :
            isWarning ? "bg-yellow-500" :
            "bg-blue-500"
          )}
          style={{ width: `${percentage * 100}%` }}
        />
      </div>

      <span className={cn(
        isCritical ? "text-red-600" :
        isWarning ? "text-yellow-600" :
        "text-gray-500"
      )}>
        {formatNumber(current)} / {formatNumber(max)} tokens
      </span>

      {isCritical && onPrune && (
        <button
          onClick={onPrune}
          className="text-xs text-blue-600 hover:underline"
        >
          Free up space
        </button>
      )}
    </div>
  )
}
```

---

## Practical Token Budgeting

Here's how to allocate your context window:

```
Total Context Window: 128,000 tokens (GPT-4o)

Reserved:
├── System prompt: 1,000 tokens (fixed)
├── Output buffer: 4,000 tokens (for AI response)
└── Safety margin: 3,000 tokens (overhead, encoding)

Available for conversation: 120,000 tokens

Allocation:
├── RAG/retrieved context: 20,000 tokens (16%)
├── Recent messages: 80,000 tokens (67%)
└── User's new message: 20,000 tokens (17%)
```

Don't fill to 100%. Leave room for the response and some safety margin.

---

## Warning Before It's Too Late

Proactive warnings prevent frustration:

```tsx
function useTokenWarnings(maxTokens: number) {
  const [tokenCount, setTokenCount] = useState(0)

  useEffect(() => {
    const percentage = tokenCount / maxTokens

    if (percentage > 0.9) {
      showWarning({
        title: "Running low on context",
        message: "Consider starting a new conversation or removing old messages.",
        action: { label: "Clear old messages", onClick: pruneOldMessages }
      })
    }
  }, [tokenCount, maxTokens])

  return { tokenCount, setTokenCount }
}
```

---

## The Error That Should Never Happen

"Maximum context length exceeded" should never surprise users. Before sending any request, validate:

```tsx
// Helper functions for context management
function estimateTotalTokens(messages: Array<{ role: string; content: string }>): number {
  // Rough estimate: ~4 chars per token for English
  // For production, use tiktoken for accurate counts
  const contentTokens = messages.reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4), 0)
  const overheadTokens = messages.length * 4 // Role markers, formatting
  return contentTokens + overheadTokens
}

async function confirmPrune(options: { message: string }): Promise<boolean> {
  // Show a confirmation dialog to the user
  return window.confirm(options.message)
}

async function pruneOldMessages(): Promise<void> {
  // Remove oldest messages while keeping recent context
  // Implementation depends on your state management
}

async function actualSend(content: string): Promise<void> {
  // Your actual API call to send the message
}

// Assumes contextMessages and maxTokens are in scope from component state
async function sendMessage(content: string) {
  const totalTokens = estimateTotalTokens([
    ...contextMessages,
    { role: 'user', content },
  ])

  if (totalTokens > maxTokens * 0.95) {
    // Don't send—prompt user first
    const shouldPrune = await confirmPrune({
      message: "This message would exceed the context limit. Remove older messages to continue?",
    })

    if (shouldPrune) {
      await pruneOldMessages()
      return sendMessage(content) // Retry
    } else {
      return // User cancelled
    }
  }

  // Safe to send
  await actualSend(content)
}
```

---

## The Takeaway

Context windows are more nuanced than marketing suggests:

1. **Stated limits ≠ practical limits** — Performance degrades before you hit the wall
2. **Every message includes full history** — Tokens grow cumulatively
3. **Choose your management strategy** — Sliding window, token budget, summarization, or RAG
4. **Show users their usage** — No surprise errors
5. **Warn before limits** — Proactive beats reactive

Your users' conversations shouldn't end with cryptic errors. Manage context intentionally, and long conversations become a feature, not a failure mode.

---

*Clarity Chat provides `useTokenTracker`, `useSlidingContextManager`, and `TokenCounter` components for automatic context management with user-facing visibility. [See context management docs →](/docs/hooks/context-management)*
