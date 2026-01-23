# Memory Types Guide

Understanding memory types is crucial for building effective AI chat applications. This guide explains each memory type, when to use it, and provides practical examples.

---

## Overview

The Clarity Memory system supports four distinct memory types, each optimized for different kinds of information:

| Type           | Purpose                           | Retention  | Access Pattern | Examples                           |
| -------------- | --------------------------------- | ---------- | -------------- | ---------------------------------- |
| **Episodic**   | Specific events and conversations | Short-term | Chronological  | Chat messages, user questions      |
| **Semantic**   | Facts and knowledge               | Long-term  | Associative    | User preferences, learned facts    |
| **Procedural** | Processes and workflows           | Long-term  | Pattern-based  | User habits, interaction patterns  |
| **Working**    | Temporary context                 | Very short | LIFO/Stack     | Current conversation, active tasks |

---

## Memory Type Details

### 1. Episodic Memory

**Definition**: Records of specific events, conversations, and temporal experiences.

**Characteristics**:

- Time-stamped and chronologically ordered
- Contains context about when and where something happened
- Naturally decays over time (unless accessed frequently)
- High detail, specific to single events

**When to Use**:

- ✅ Chat conversation history
- ✅ User questions and assistant responses
- ✅ Tool invocations and results
- ✅ User interactions and events
- ✅ Session-specific information

**When NOT to Use**:

- ❌ General facts or knowledge
- ❌ User preferences (use semantic)
- ❌ Repeated patterns (use procedural)
- ❌ Temporary scratchpad data (use working)

**Example Usage**:

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Store a conversation message
await memory.add(
  "User asked about pricing plans and mentioned they're a startup",
  {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      messageId: 'msg_123',
      role: 'user',
      topic: 'pricing',
      entities: ['pricing', 'startup'],
    },
  }
)

// Store a tool invocation
await memory.add(
  "Searched database for customers with 'startup' tag, found 42 matches",
  {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      toolName: 'database_search',
      toolType: 'database',
      resultCount: 42,
    },
  }
)

// Recall recent conversation
const recent = await memory.recall('recent conversation about pricing', {
  types: ['episodic'],
  limit: 10,
})
```

**Retrieval Patterns**:

- Recent-first chronological queries
- Event-based searches
- Conversation threading
- Timeline reconstruction

**Best Practices**:

- Always include timestamps (automatic)
- Tag with relevant entities and topics
- Link related messages with threadId
- Store complete context (don't summarize too early)
- Use messageId for deduplication

---

### 2. Semantic Memory

**Definition**: General knowledge, facts, and learned information independent of specific experiences.

**Characteristics**:

- Timeless facts and knowledge
- Associative retrieval (concept-based)
- Long-term retention
- Consolidated from multiple episodic memories

**When to Use**:

- ✅ User preferences and settings
- ✅ Learned facts about the user
- ✅ Domain knowledge
- ✅ Relationship information
- ✅ Consolidated insights

**When NOT to Use**:

- ❌ Specific conversations (use episodic)
- ❌ Temporary states (use working)
- ❌ Time-sensitive events (use episodic)
- ❌ Repeated behavioral patterns (use procedural)

**Example Usage**:

```typescript
// Store user preferences
await memory.add(
  'User prefers concise explanations and code examples over verbose descriptions',
  {
    type: 'semantic',
    scope: 'user',
    metadata: {
      category: 'communication_style',
      confidence: 0.9,
    },
    priority: 'high',
  }
)

// Store learned facts
await memory.add(
  'User is building a SaaS product for small businesses using React and Node.js',
  {
    type: 'semantic',
    scope: 'user',
    metadata: {
      category: 'user_context',
      entities: ['SaaS', 'small business', 'React', 'Node.js'],
      keywords: ['product', 'tech stack'],
    },
    priority: 'high',
  }
)

// Recall user preferences for personalization
const preferences = await memory.recall('user preferences', {
  types: ['semantic'],
  scopes: ['user'],
  limit: 5,
})
```

**Retrieval Patterns**:

- Concept-based semantic search
- Preference queries
- Knowledge base lookup
- Personalization context

**Best Practices**:

- Keep facts atomic (one fact per memory)
- Use high confidence scores for verified facts
- Update existing facts rather than duplicating
- Include relevant metadata for filtering
- Use 'user' scope for personal preferences
- Tag with categories for organization

---

### 3. Procedural Memory

**Definition**: Knowledge about how to do things, patterns, workflows, and repeated behaviors.

**Characteristics**:

- Process and pattern-oriented
- Learned from repeated experiences
- Guides future behavior
- Often implicit (learned habits)

**When to Use**:

- ✅ User interaction patterns
- ✅ Workflow preferences
- ✅ Behavioral patterns
- ✅ Habit recognition
- ✅ Process documentation

**When NOT to Use**:

- ❌ One-time events (use episodic)
- ❌ Static facts (use semantic)
- ❌ Temporary workflows (use working)
- ❌ Declarative knowledge (use semantic)

**Example Usage**:

```typescript
// Store interaction pattern
await memory.add(
  'User typically starts sessions by asking for a summary of previous work, ' +
    'then proceeds to implementation tasks',
  {
    type: 'procedural',
    scope: 'user',
    metadata: {
      pattern: 'session_start',
      frequency: 'high',
      confidence: 0.85,
    },
  }
)

// Store workflow preference
await memory.add(
  'User prefers to review generated code before running tests, ' +
    'workflow: generate -> review -> test -> iterate',
  {
    type: 'procedural',
    scope: 'user',
    metadata: {
      pattern: 'development_workflow',
      steps: ['generate', 'review', 'test', 'iterate'],
    },
    priority: 'medium',
  }
)

// Recall patterns to adapt behavior
const patterns = await memory.recall('user workflow patterns', {
  types: ['procedural'],
  limit: 3,
})
```

**Retrieval Patterns**:

- Pattern matching
- Workflow queries
- Behavioral predictions
- Habit-based suggestions

**Best Practices**:

- Extract patterns from multiple observations
- Include frequency/confidence metrics
- Update patterns as behavior changes
- Use descriptive pattern names
- Document step sequences clearly

---

### 4. Working Memory

**Definition**: Temporary, short-lived information needed for current tasks and active conversations.

**Characteristics**:

- Very short retention (minutes to hours)
- Stack-like (LIFO) access pattern
- Cleared between sessions
- High access frequency

**When to Use**:

- ✅ Current conversation context
- ✅ Active task state
- ✅ Temporary variables
- ✅ Scratchpad data
- ✅ Multi-turn context

**When NOT to Use**:

- ❌ Long-term information (use semantic/episodic)
- ❌ Historical data (use episodic)
- ❌ Persistent preferences (use semantic)
- ❌ Learned patterns (use procedural)

**Example Usage**:

```typescript
// Store current task context
await memory.add(
  'Currently debugging authentication issue, suspect JWT token expiration',
  {
    type: 'working',
    scope: 'session',
    metadata: {
      task: 'debugging',
      issue: 'authentication',
      status: 'in_progress',
    },
  }
)

// Store multi-turn context
await memory.add(
  'User asked about database optimization, ' +
    'discussed indexing strategies, now evaluating query performance',
  {
    type: 'working',
    scope: 'thread',
    metadata: {
      conversation_topic: 'database_optimization',
      current_subtopic: 'query_performance',
    },
  }
)

// Recall current task context
const currentContext = await memory.recall('current task', {
  types: ['working'],
  scopes: ['session'],
  limit: 5,
})
```

**Retrieval Patterns**:

- Stack-based (most recent)
- Session-scoped queries
- Active task lookup
- Context continuation

**Best Practices**:

- Clear working memory between sessions
- Keep retention very short (1-2 hours)
- Use session/thread scope
- Store only immediately relevant information
- Clean up completed tasks

---

## Decision Guide

Use this flowchart to choose the right memory type:

```
Is this information temporary (< 1 hour)?
├─ YES → Working Memory
└─ NO ↓

Is this a specific event with time/context?
├─ YES → Episodic Memory
└─ NO ↓

Is this a repeated pattern or workflow?
├─ YES → Procedural Memory
└─ NO ↓

Is this a general fact or preference?
└─ YES → Semantic Memory
```

### Quick Decision Table

| Question                                      | Type       |
| --------------------------------------------- | ---------- |
| "What did the user say 5 minutes ago?"        | Episodic   |
| "What are the user's preferences?"            | Semantic   |
| "How does the user typically start sessions?" | Procedural |
| "What are we currently working on?"           | Working    |
| "What happened yesterday?"                    | Episodic   |
| "What does the user know about X?"            | Semantic   |
| "What's the user's usual workflow?"           | Procedural |
| "What's in the current context?"              | Working    |

---

## Combining Memory Types

Most effective memory systems use multiple types together:

```typescript
// Example: Processing a user preference statement
const statement = 'I always prefer to see test results before deploying'

// 1. Store the conversation (episodic)
await memory.add(statement, {
  type: 'episodic',
  scope: 'thread',
  metadata: { role: 'user', topic: 'deployment' },
})

// 2. Extract the preference (semantic)
await memory.add('User prefers to review test results before deployment', {
  type: 'semantic',
  scope: 'user',
  metadata: { category: 'deployment_preferences' },
  priority: 'high',
})

// 3. Note the workflow pattern (procedural)
await memory.add('User workflow: test -> review -> deploy', {
  type: 'procedural',
  scope: 'user',
  metadata: { pattern: 'deployment_workflow' },
})

// 4. Update current context (working)
await memory.add(
  'User discussing deployment preferences, wants test-first approach',
  {
    type: 'working',
    scope: 'session',
    metadata: { current_topic: 'deployment' },
  }
)
```

---

## Advanced Patterns

### Memory Consolidation

Convert episodic memories into semantic knowledge:

```typescript
// After observing repeated behavior across 5 conversations...
const pattern = consolidatePattern(episodicMemories)

// Store as semantic knowledge
await memory.add(pattern, {
  type: 'semantic',
  scope: 'user',
  metadata: {
    consolidatedFrom: 'episodic',
    observationCount: 5,
    confidence: 0.9,
  },
})
```

### Progressive Summarization

Compress old episodic memories while preserving important details:

```typescript
// Summarize old conversation
const summary = await summarizeConversation(oldEpisodicMemories)

// Store summary as episodic (preserves time context)
await memory.add(summary, {
  type: 'episodic',
  scope: 'thread',
  metadata: {
    isSummary: true,
    originalCount: 50,
    timeRange: { start, end },
  },
})
```

---

## Performance Considerations

| Type       | Retrieval Speed | Storage Cost | Decay Rate |
| ---------- | --------------- | ------------ | ---------- |
| Working    | Fastest         | Lowest       | Fastest    |
| Episodic   | Fast            | Medium       | Medium     |
| Semantic   | Medium          | Medium       | Slowest    |
| Procedural | Medium          | Low          | Slow       |

---

## Common Mistakes

### ❌ Wrong Type Selection

```typescript
// WRONG: Storing preference as episodic
await memory.add('User likes dark mode', { type: 'episodic' })
// Problem: Will decay over time, lost in conversation noise

// RIGHT: Store as semantic
await memory.add('User prefers dark mode', { type: 'semantic', scope: 'user' })
```

### ❌ Over-using Working Memory

```typescript
// WRONG: Storing important facts in working memory
await memory.add('User is allergic to peanuts', { type: 'working' })
// Problem: Will be cleared at session end!

// RIGHT: Store critical facts as semantic
await memory.add('User is allergic to peanuts', {
  type: 'semantic',
  scope: 'user',
  priority: 'critical',
})
```

### ❌ Mixing Types

```typescript
// WRONG: Storing timestamped events as semantic
await memory.add('User asked about pricing at 2pm', { type: 'semantic' })
// Problem: Semantic memory is timeless

// RIGHT: Store events as episodic
await memory.add('User asked about pricing', {
  type: 'episodic',
  metadata: { timestamp: '2pm', topic: 'pricing' },
})
```

---

## See Also

- [Scopes Guide](./SCOPES.md) - Understanding memory scopes
- [Configuration Guide](./CONFIGURATION.md) - Configuring memory behavior
- [Best Practices](./BEST_PRACTICES.md) - Memory system best practices
