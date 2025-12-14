# Building AI Memory That Actually Remembers

LLMs are stateless. Every message is like meeting them for the first time.

Your users expect AI to remember that they prefer Python over JavaScript, that they asked about refunds yesterday, that their name is Sarah. But LLMs have amnesia by design—they don't remember anything between API calls.

The memory your users expect doesn't exist. You have to build it.

---

## Why LLMs Have Amnesia

Each API call is completely independent:

```typescript
// Call 1
await openai.chat.completions.create({
  messages: [{ role: "user", content: "My name is Sarah" }]
})
// AI: "Nice to meet you, Sarah!"

// Call 2 - completely separate
await openai.chat.completions.create({
  messages: [{ role: "user", content: "What's my name?" }]
})
// AI: "I don't know your name. You haven't told me."
```

The second call has no knowledge of the first. They might as well have gone to different servers on different continents.

**Why it's designed this way:**
- Stateless = massively scalable
- No server-side storage per user
- Privacy by default (nothing persists)
- Simpler infrastructure for providers

**The consequence:**
You must build and manage memory in your application layer. The LLM is just a function that takes input and returns output—everything else is your responsibility.

---

## Types of AI Memory

Not all memory is the same. Different types serve different purposes.

### 1. Session Memory (Short-term)

The current conversation history. Most basic form of "memory."

```typescript
// Store messages in client state
const [messages, setMessages] = useState<Message[]>([])

// Include full history with each API call
async function sendMessage(content: string) {
  const newMessage = { role: 'user', content }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
      newMessage,
    ],
  })

  setMessages([...messages, newMessage, response.choices[0].message])
}
```

**Use for:** Context within a single conversation
**Limitations:** Lost when session ends, grows linearly with conversation length

### 2. User Memory (Long-term Facts)

Persistent information about the user that survives across sessions.

```typescript
interface UserFact {
  id: string
  key: string
  value: string
  confidence: number
  source: 'explicit' | 'inferred'
  timestamp: Date
}

// Store in database
await db.userFacts.upsert({
  userId: user.id,
  facts: [
    { key: 'name', value: 'Sarah', confidence: 1.0, source: 'explicit' },
    { key: 'preferredLanguage', value: 'Python', confidence: 0.9, source: 'inferred' },
    { key: 'timezone', value: 'PST', confidence: 1.0, source: 'explicit' },
    { key: 'expertise', value: 'backend development', confidence: 0.85, source: 'inferred' },
  ]
})

// Include in system prompt
function buildSystemPrompt(userFacts: UserFact[]): string {
  const factsSection = userFacts
    .filter(f => f.confidence > 0.7)
    .map(f => `- ${f.key}: ${f.value}`)
    .join('\n')

  return `You are a helpful assistant.

## What You Know About This User
${factsSection}

Use this information to personalize your responses.`
}
```

**Use for:** Preferences, names, settings, established facts
**Persistence:** Database, survives indefinitely

### 3. Semantic Memory (Searchable Knowledge)

Past conversations stored as embeddings for retrieval.

```typescript
// Embedding helper - use OpenAI, Cohere, or open-source models
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Summarization helper
async function summarize(messages: Message[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Summarize this conversation in 2-3 sentences, preserving key facts and decisions.' },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    max_tokens: 150,
  })
  return response.choices[0].message.content || ''
}

async function extractTopic(messages: Message[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'What is the main topic of this conversation? Reply with 2-4 words.' },
      ...messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
    ],
    max_tokens: 20,
  })
  return response.choices[0].message.content || 'General'
}

// After each conversation, store a summary
async function storeConversation(
  userId: string,
  messages: Message[]
): Promise<void> {
  // Summarize the conversation
  const summary = await summarize(messages)

  // Generate embedding
  const embedding = await embed(summary)

  // Store in vector database
  await vectorStore.upsert({
    id: `conv-${Date.now()}`,
    embedding,
    metadata: {
      userId,
      date: new Date(),
      topic: await extractTopic(messages),
      summary,
    }
  })
}

// When user asks about past conversations
async function recallRelevantHistory(
  userId: string,
  currentQuery: string
): Promise<string[]> {
  const queryEmbedding = await embed(currentQuery)

  const results = await vectorStore.query({
    embedding: queryEmbedding,
    filter: { userId },
    topK: 3,
  })

  return results.map(r => r.metadata.summary)
}
```

**Use for:** "What did we discuss about X last week?"
**Persistence:** Vector database

### 4. Behavioral Memory (Patterns)

Learned patterns about how the user interacts.

```typescript
interface UserPattern {
  behavior: string
  confidence: number
  examples: number
}

// Pattern storage helpers
async function incrementPattern(userId: string, behavior: string): Promise<void> {
  const existing = await db.userPatterns.findOne({ userId, behavior })
  if (existing) {
    await db.userPatterns.update({
      userId,
      behavior,
      examples: existing.examples + 1,
      confidence: Math.min(0.95, existing.confidence + 0.05),
    })
  } else {
    await db.userPatterns.insert({
      userId,
      behavior,
      examples: 1,
      confidence: 0.5,
    })
  }
}

function hasPattern(patterns: UserPattern[], behavior: string, minConfidence: number): boolean {
  const pattern = patterns.find(p => p.behavior === behavior)
  return pattern ? pattern.confidence >= minConfidence : false
}

// Track patterns over time
async function updatePatterns(
  userId: string,
  message: string,
  response: string
): Promise<void> {
  // Detect patterns
  if (message.toLowerCase().includes('explain') && message.includes('?')) {
    await incrementPattern(userId, 'prefers_detailed_explanations')
  }

  if (response.includes('```') && userGavePositiveFeedback) {
    await incrementPattern(userId, 'appreciates_code_examples')
  }

  if (message.length > 500) {
    await incrementPattern(userId, 'provides_detailed_context')
  }
}

// Apply patterns to response style
function getResponseStyleHints(patterns: UserPattern[]): string {
  const hints: string[] = []

  if (hasPattern(patterns, 'prefers_detailed_explanations', 0.7)) {
    hints.push('Provide detailed explanations with context.')
  }

  if (hasPattern(patterns, 'appreciates_code_examples', 0.7)) {
    hints.push('Include code examples when relevant.')
  }

  if (hasPattern(patterns, 'prefers_concise', 0.7)) {
    hints.push('Be concise and direct.')
  }

  return hints.join('\n')
}
```

**Use for:** Adapting response style, anticipating needs
**Persistence:** Database, updated continuously

---

## Implementing Multi-Layer Memory

Combine all memory types for a complete system:

```typescript
interface MemoryContext {
  userFacts: UserFact[]
  recentMessages: Message[]
  relevantHistory: string[]
  patterns: UserPattern[]
}

async function buildFullContext(
  userId: string,
  currentMessage: string,
  sessionMessages: Message[]
): Promise<MemoryContext> {
  // Parallel fetch for speed
  const [userFacts, relevantHistory, patterns] = await Promise.all([
    db.userFacts.get(userId),
    recallRelevantHistory(userId, currentMessage),
    db.userPatterns.get(userId),
  ])

  return {
    userFacts,
    recentMessages: sessionMessages.slice(-10), // Last 10 messages
    relevantHistory,
    patterns,
  }
}

function buildPromptWithContext(
  basePrompt: string,
  context: MemoryContext
): string {
  let prompt = basePrompt

  // Add user facts
  if (context.userFacts.length > 0) {
    prompt += `\n\n## About This User\n`
    prompt += context.userFacts
      .filter(f => f.confidence > 0.7)
      .map(f => `- ${f.key}: ${f.value}`)
      .join('\n')
  }

  // Add relevant history
  if (context.relevantHistory.length > 0) {
    prompt += `\n\n## Relevant Past Conversations\n`
    prompt += context.relevantHistory.join('\n---\n')
  }

  // Add style hints from patterns
  const styleHints = getResponseStyleHints(context.patterns)
  if (styleHints) {
    prompt += `\n\n## Response Style\n${styleHints}`
  }

  return prompt
}
```

---

## Automatic Fact Extraction

Users don't explicitly say "remember that I prefer Python." You need to extract facts from natural conversation.

```typescript
async function extractFacts(message: string): Promise<UserFact[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract factual information about the user from their message.
Return JSON array of facts with keys: key, value, confidence (0-1).
Only extract explicit facts, not assumptions.
Examples of good extractions:
- "I'm a Python developer" -> { key: "profession", value: "Python developer", confidence: 0.95 }
- "I'm based in NYC" -> { key: "location", value: "New York City", confidence: 0.95 }
- "I prefer detailed explanations" -> { key: "preference_explanation_style", value: "detailed", confidence: 0.9 }

Return empty array if no clear facts are present.`,
      },
      { role: 'user', content: message },
    ],
    response_format: { type: 'json_object' },
  })

  const parsed = JSON.parse(response.choices[0].message.content || '{}')
  return parsed.facts || []
}

// Automatically extract during conversation
async function handleMessage(userId: string, message: string) {
  // Extract facts in background (don't slow down response)
  extractFacts(message).then(async (facts) => {
    if (facts.length > 0) {
      await db.userFacts.upsert(userId, facts)
    }
  })

  // Continue with normal response...
}
```

---

## Privacy Considerations

Storing information about users requires care:

```typescript
interface MemoryConfig {
  // What to remember
  allowedCategories: string[]
  blockedCategories: string[]

  // How long to remember
  factTTL: number | null  // null = forever
  conversationTTL: number  // days

  // User controls
  enableDeletion: boolean
  enableExport: boolean
  requireConsent: boolean
}

const defaultConfig: MemoryConfig = {
  allowedCategories: ['name', 'preferences', 'timezone', 'language', 'profession'],
  blockedCategories: ['health', 'financial', 'political', 'religious', 'sexual'],
  factTTL: null,
  conversationTTL: 90, // 90 days
  enableDeletion: true,
  enableExport: true,
  requireConsent: true,
}

// Respect blocked categories
async function storeFact(fact: UserFact, config: MemoryConfig): Promise<boolean> {
  // Check if category is allowed
  if (config.blockedCategories.some(cat => fact.key.includes(cat))) {
    return false // Don't store
  }

  if (!config.allowedCategories.some(cat => fact.key.includes(cat))) {
    return false // Not in whitelist
  }

  await db.userFacts.insert(fact)
  return true
}
```

---

## Let Users See and Control Their Data

Transparency builds trust:

```tsx
function MemoryInspector({ userId }: { userId: string }) {
  const [facts, setFacts] = useState<UserFact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.userFacts.get(userId).then(setFacts).finally(() => setLoading(false))
  }, [userId])

  const deleteFact = async (factId: string) => {
    await db.userFacts.delete(factId)
    setFacts(facts.filter(f => f.id !== factId))
  }

  const exportData = async () => {
    const data = await db.exportUserData(userId)
    downloadJson(data, `my-data-${Date.now()}.json`)
  }

  const clearAll = async () => {
    if (confirm('Delete all stored information about you?')) {
      await db.userFacts.deleteAll(userId)
      await vectorStore.deleteByUser(userId)
      setFacts([])
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-4">What I Remember About You</h3>

      {facts.length === 0 ? (
        <p className="text-gray-500">No stored information yet.</p>
      ) : (
        <ul className="space-y-2">
          {facts.map(fact => (
            <li key={fact.id} className="flex justify-between items-center">
              <span>
                <strong>{fact.key}:</strong> {fact.value}
              </span>
              <button
                onClick={() => deleteFact(fact.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <button onClick={exportData} className="btn-secondary">
          Export My Data
        </button>
        <button onClick={clearAll} className="btn-danger">
          Clear All
        </button>
      </div>
    </div>
  )
}
```

---

## The Takeaway

LLMs don't remember. But users expect memory. Bridging this gap requires:

1. **Session memory** — Conversation history within a session
2. **User memory** — Persistent facts stored in your database
3. **Semantic memory** — Searchable past conversations via embeddings
4. **Behavioral memory** — Learned patterns for personalization

Build all four layers for AI that actually remembers who it's talking to.

And always: let users see, control, and delete their data. Memory without consent is surveillance.

---

*Clarity Chat's memory management hooks handle multi-layer memory, fact extraction, and the MemoryInspector UI component. Build AI that remembers without building the infrastructure yourself. [See the memory docs →](/docs/memory)*
