# Memory Scopes Guide

Memory scopes determine the visibility, lifetime, and accessibility of memories. Understanding scopes is essential for building privacy-compliant, well-organized memory systems.

---

## Overview

The Clarity Memory system supports four hierarchical scopes:

| Scope       | Visibility          | Lifetime         | Use Case             | Example                             |
| ----------- | ------------------- | ---------------- | -------------------- | ----------------------------------- |
| **Global**  | All users           | Permanent        | Shared knowledge     | Product documentation, FAQ answers  |
| **User**    | Single user         | Long-term        | Personal data        | Preferences, history, learned facts |
| **Session** | Current session     | Session duration | Temporary context    | Active tasks, session state         |
| **Thread**  | Conversation thread | Thread lifetime  | Conversation context | Chat messages, thread-specific info |

---

## Scope Hierarchy

```
Global (broadest, longest-lived)
  ↓
User (personal, persistent)
  ↓
Thread (conversation-bound)
  ↓
Session (temporary, shortest-lived)
```

**Inheritance**: Narrower scopes can access broader scopes (with permissions), but not vice versa.

---

## Scope Details

### 1. Global Scope

**Definition**: Shared across all users and sessions. Represents universal knowledge.

**Characteristics**:

- **Visibility**: All users
- **Lifetime**: Permanent (until manually deleted)
- **Privacy**: Public information only
- **Use Cases**: Shared knowledge base, product information, FAQs

**When to Use**:

- ✅ Product documentation and features
- ✅ Common FAQ answers
- ✅ Public knowledge base
- ✅ Shared best practices
- ✅ System-wide facts

**When NOT to Use**:

- ❌ Personal information (use 'user')
- ❌ Conversation-specific data (use 'thread')
- ❌ Temporary context (use 'session')
- ❌ Anything requiring privacy

**Example Usage**:

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Store product information (available to all users)
await memory.add(
  'Our Pro plan includes unlimited projects, 50GB storage, and priority support',
  {
    type: 'semantic',
    scope: 'global',
    metadata: {
      category: 'product_info',
      plan: 'pro',
      lastUpdated: new Date(),
    },
  }
)

// Store FAQ answer
await memory.add(
  'To reset your password, click "Forgot Password" on the login page',
  {
    type: 'semantic',
    scope: 'global',
    metadata: {
      category: 'faq',
      topic: 'password_reset',
    },
  }
)

// Query global knowledge
const productInfo = await memory.recall('pricing plans', {
  scopes: ['global'],
  types: ['semantic'],
})
```

**Privacy Considerations**:

- ⚠️ **Never store PII** (personal identifiable information)
- ⚠️ **No user-specific data**
- ⚠️ **Only public information**
- ✅ Safe for cross-user access
- ✅ GDPR-compliant (no personal data)

**Best Practices**:

- Use for truly universal knowledge only
- Version control global memories
- Regular audits for outdated information
- Clear ownership and update processes
- Document global memory governance

---

### 2. User Scope

**Definition**: Personal to a single user. Persists across sessions and conversations.

**Characteristics**:

- **Visibility**: Single user only
- **Lifetime**: Long-term (user lifetime)
- **Privacy**: User-private
- **Use Cases**: Preferences, personal history, learned facts

**When to Use**:

- ✅ User preferences and settings
- ✅ Personal information
- ✅ User-specific learned facts
- ✅ Cross-session context
- ✅ User profile data

**When NOT to Use**:

- ❌ Shared/public information (use 'global')
- ❌ Conversation-specific data (use 'thread')
- ❌ Temporary session state (use 'session')

**Example Usage**:

```typescript
// Store user preference
await memory.add('User prefers code examples in TypeScript over JavaScript', {
  type: 'semantic',
  scope: 'user',
  metadata: {
    userId: 'user_123',
    category: 'code_preferences',
    confidence: 0.95,
  },
  priority: 'high',
})

// Store user context
await memory.add(
  'User is a senior frontend developer working at a fintech startup, ' +
    'specializing in React and performance optimization',
  {
    type: 'semantic',
    scope: 'user',
    metadata: {
      userId: 'user_123',
      category: 'user_profile',
      entities: ['frontend', 'React', 'fintech', 'performance'],
    },
    priority: 'high',
  }
)

// Store interaction pattern
await memory.add(
  'User typically works in 2-hour focused sessions, prefers morning hours',
  {
    type: 'procedural',
    scope: 'user',
    metadata: {
      userId: 'user_123',
      pattern: 'work_habits',
    },
  }
)

// Recall user-specific memories
const userContext = await memory.recall('user profile and preferences', {
  scopes: ['user'],
  metadata: { userId: 'user_123' },
  limit: 10,
})
```

**Privacy Considerations**:

- ✅ GDPR-compliant with consent
- ✅ User can request deletion (Right to Erasure)
- ✅ User can export data (Data Portability)
- ✅ Requires userId in metadata
- ⚠️ Implement proper access controls
- ⚠️ Encrypt sensitive data at rest

**Best Practices**:

- Always include userId in metadata
- Implement consent management
- Provide data export functionality
- Honor deletion requests
- Use high importance for critical preferences
- Regular cleanup of stale data
- Audit logs for access tracking

---

### 3. Thread Scope

**Definition**: Bound to a specific conversation thread. Persists for the thread's lifetime.

**Characteristics**:

- **Visibility**: Thread participants
- **Lifetime**: Thread lifetime (can be hours to weeks)
- **Privacy**: Thread-private
- **Use Cases**: Conversation history, thread context

**When to Use**:

- ✅ Chat messages and responses
- ✅ Thread-specific context
- ✅ Conversation-bound information
- ✅ Multi-turn dialogue state
- ✅ Thread-local facts

**When NOT to Use**:

- ❌ Cross-thread information (use 'user')
- ❌ Universal facts (use 'global')
- ❌ Very temporary state (use 'session')
- ❌ User preferences (use 'user')

**Example Usage**:

```typescript
// Store conversation message
await memory.add('User asked: "How do I optimize database queries?"', {
  type: 'episodic',
  scope: 'thread',
  metadata: {
    userId: 'user_123',
    threadId: 'thread_456',
    messageId: 'msg_789',
    role: 'user',
    topic: 'database_optimization',
  },
})

// Store assistant response
await memory.add(
  'Suggested three strategies: indexing, query optimization, and caching. ' +
    'User showed interest in caching approach.',
  {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      threadId: 'thread_456',
      messageId: 'msg_790',
      role: 'assistant',
      topic: 'database_optimization',
      subtopic: 'caching',
    },
  }
)

// Store thread-local context
await memory.add(
  'In this conversation, user is working on PostgreSQL database with 10M rows',
  {
    type: 'working',
    scope: 'thread',
    metadata: {
      threadId: 'thread_456',
      context_type: 'technical_details',
    },
  }
)

// Recall thread history
const threadHistory = await memory.recall(
  'conversation about database optimization',
  {
    scopes: ['thread'],
    metadata: { threadId: 'thread_456' },
    limit: 50,
  }
)
```

**Thread Management**:

```typescript
// Get all memories for a thread
const threadMemories = await memory.query({
  scopes: ['thread'],
  metadata: { threadId: 'thread_456' },
})

// Delete entire thread
await memory.deleteMemories({
  scopes: ['thread'],
  metadata: { threadId: 'thread_456' },
})

// Archive old thread (compress & summarize)
const summary = await memory.summarizeThread('thread_456')
await memory.add(summary, {
  type: 'episodic',
  scope: 'user', // Move to user scope for cross-thread access
  metadata: {
    threadId: 'thread_456',
    isSummary: true,
    originalMessageCount: 100,
  },
})
```

**Privacy Considerations**:

- ✅ Thread-private by default
- ✅ Isolated from other threads
- ✅ Can be deleted independently
- ⚠️ Include threadId for proper scoping
- ⚠️ Consider thread lifetime policies

**Best Practices**:

- Always include threadId in metadata
- Use for conversation-specific information only
- Implement thread cleanup policies
- Summarize long threads periodically
- Link related messages with messageId
- Archive completed threads

---

### 4. Session Scope

**Definition**: Temporary, session-bound information. Cleared when session ends.

**Characteristics**:

- **Visibility**: Current session only
- **Lifetime**: Session duration (typically < 1 hour)
- **Privacy**: Session-private
- **Use Cases**: Temporary state, active tasks, scratchpad

**When to Use**:

- ✅ Current task state
- ✅ Temporary variables
- ✅ Active workflow context
- ✅ Short-lived scratchpad data
- ✅ Session-specific flags

**When NOT to Use**:

- ❌ Long-term information (use 'user')
- ❌ Conversation history (use 'thread')
- ❌ Persistent preferences (use 'user')
- ❌ Anything that needs to survive session end

**Example Usage**:

```typescript
// Store current task
await memory.add('Currently debugging authentication bug in login flow', {
  type: 'working',
  scope: 'session',
  metadata: {
    sessionId: 'session_xyz',
    task: 'debugging',
    priority: 'high',
  },
})

// Store temporary context
await memory.add('User is in "code review mode", focusing on security issues', {
  type: 'working',
  scope: 'session',
  metadata: {
    sessionId: 'session_xyz',
    mode: 'code_review',
    focus: 'security',
  },
})

// Store scratchpad data
await memory.add('Temporary calculation: 42 active users, 15 pending reviews', {
  type: 'working',
  scope: 'session',
  metadata: {
    sessionId: 'session_xyz',
    dataType: 'scratchpad',
  },
})

// Recall session context
const sessionContext = await memory.recall('current task and focus', {
  scopes: ['session'],
  metadata: { sessionId: 'session_xyz' },
})
```

**Session Lifecycle**:

```typescript
// Session start: Clear old session memories
await memory.deleteMemories({
  scopes: ['session'],
  metadata: { sessionId: 'old_session' },
})

// During session: Use freely
await memory.add('...', { scope: 'session' })

// Session end: Optionally consolidate important info
const importantInfo = await extractImportantInfo(sessionMemories)
if (importantInfo) {
  await memory.add(importantInfo, {
    type: 'semantic',
    scope: 'user', // Promote to user scope
  })
}

// Clean up session
await memory.deleteMemories({ scopes: ['session'] })
```

**Privacy Considerations**:

- ✅ Automatically cleaned up
- ✅ Shortest retention period
- ✅ No long-term privacy concerns
- ⚠️ Still include sessionId for tracking

**Best Practices**:

- Clear session memory at session end
- Set very short retention (< 1 hour)
- Use for truly temporary data only
- Consider promoting important info to user scope
- Don't rely on session memory persisting
- Include sessionId for proper scoping

---

## Scope Selection Decision Guide

Use this flowchart to choose the right scope:

```
Does this need to be shared across all users?
├─ YES → Global Scope
└─ NO ↓

Does this need to persist after the session ends?
├─ NO → Session Scope
└─ YES ↓

Is this specific to a conversation thread?
├─ YES → Thread Scope
└─ NO → User Scope
```

### Quick Decision Table

| Question                                     | Scope          |
| -------------------------------------------- | -------------- |
| "Should all users see this?"                 | Global         |
| "Is this personal to the user?"              | User           |
| "Is this specific to this conversation?"     | Thread         |
| "Is this only needed right now?"             | Session        |
| "Should this persist across sessions?"       | User or Thread |
| "Should this be deleted when session ends?"  | Session        |
| "Should this be available in other threads?" | User or Global |

---

## Cross-Scope Queries

Query multiple scopes simultaneously with proper prioritization:

```typescript
// Query across scopes (narrower scopes prioritized)
const results = await memory.recall('user preferences and current context', {
  scopes: ['session', 'thread', 'user', 'global'],
  limit: 20,
})

// Results will be weighted by scope:
// 1. Session (most relevant, immediate context)
// 2. Thread (conversation-specific context)
// 3. User (personal preferences)
// 4. Global (general knowledge)
```

**Scope Priority Order** (most to least relevant):

1. Session → Current immediate context
2. Thread → Current conversation context
3. User → Personal persistent context
4. Global → Universal knowledge

---

## Scope Combinations with Memory Types

| Type / Scope   | Global    | User           | Thread         | Session        |
| -------------- | --------- | -------------- | -------------- | -------------- |
| **Episodic**   | Rare      | ✅ Common      | ✅ Very Common | ✅ Common      |
| **Semantic**   | ✅ Common | ✅ Very Common | Rare           | Rare           |
| **Procedural** | ✅ Common | ✅ Very Common | Rare           | Never          |
| **Working**    | Never     | Rare           | ✅ Common      | ✅ Very Common |

**Common Patterns**:

- `episodic` + `thread`: Chat messages
- `semantic` + `user`: User preferences
- `working` + `session`: Current task state
- `semantic` + `global`: Shared knowledge
- `procedural` + `user`: User habits

---

## Privacy & Compliance by Scope

### GDPR Compliance

| Scope   | Right to Access | Right to Erasure | Data Portability | Consent Required |
| ------- | --------------- | ---------------- | ---------------- | ---------------- |
| Global  | N/A (public)    | N/A (public)     | N/A (public)     | No               |
| User    | ✅ Required     | ✅ Required      | ✅ Required      | Yes              |
| Thread  | ✅ Required     | ✅ Required      | ✅ Required      | Yes              |
| Session | ✅ Optional     | ✅ Optional      | ❌ (temporary)   | Optional         |

### Data Retention

```typescript
// Configure retention by scope
const memory = clarityMemory({
  retention: {
    global: Infinity, // Never auto-delete
    user: 365 * 24 * 60 * 60 * 1000, // 1 year
    thread: 90 * 24 * 60 * 60 * 1000, // 90 days
    session: 60 * 60 * 1000, // 1 hour
  },
})
```

---

## Advanced Patterns

### Scope Promotion

Promote important information from narrower to broader scopes:

```typescript
// Session → Thread (when task completes)
const importantSessionData = await memory.get(sessionMemoryId)
await memory.add(importantSessionData.content, {
  type: 'episodic',
  scope: 'thread', // Promote to thread
  metadata: { promotedFrom: 'session' },
})

// Thread → User (when conversation reveals preference)
await memory.add('User prefers detailed error messages', {
  type: 'semantic',
  scope: 'user', // Promote to user
  metadata: { learnedFrom: 'thread_456' },
})
```

### Scope Demotion

Archive or compress data to narrower scopes:

```typescript
// Global → User (personalized version)
const globalKnowledge = await memory.get(globalMemoryId)
await memory.add(`${globalKnowledge.content} (customized for user)`, {
  type: 'semantic',
  scope: 'user', // User-specific version
})
```

### Scope-Based Cleanup

```typescript
// Clean up old thread memories
await memory.deleteMemories({
  scopes: ['thread'],
  timeRange: {
    end: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
})

// Archive user memories
const oldUserMemories = await memory.query({
  scopes: ['user'],
  timeRange: {
    end: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
  },
})
// Summarize and store as compressed semantic memory
```

---

## Common Mistakes

### ❌ Wrong Scope Selection

```typescript
// WRONG: Personal preference as global
await memory.add('User likes dark mode', { scope: 'global' })
// Problem: Applies to ALL users!

// RIGHT: Store as user-scoped
await memory.add('User likes dark mode', {
  scope: 'user',
  metadata: { userId },
})
```

### ❌ Missing Scope Identifiers

```typescript
// WRONG: No identifiers
await memory.add('Message text', { scope: 'thread' })
// Problem: Can't query or manage properly

// RIGHT: Include proper IDs
await memory.add('Message text', {
  scope: 'thread',
  metadata: { userId, threadId, messageId },
})
```

### ❌ Over-using Session Scope

```typescript
// WRONG: Important preference in session
await memory.add('User is allergic to peanuts', { scope: 'session' })
// Problem: Lost when session ends!

// RIGHT: Critical info in user scope
await memory.add('User is allergic to peanuts', {
  scope: 'user',
  priority: 'critical',
})
```

---

## See Also

- [Memory Types Guide](./MEMORY_TYPES.md) - Understanding memory types
- [Privacy Guide](./PRIVACY.md) - GDPR compliance and privacy
- [Best Practices](./BEST_PRACTICES.md) - Memory system best practices
