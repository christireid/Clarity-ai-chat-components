# Migration Guide

This guide helps you migrate to the latest version of Clarity Memory system or from other memory solutions.

---

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [From Pre-1.0 Versions](#from-pre-10-versions)
3. [From Other Memory Systems](#from-other-memory-systems)
4. [Breaking Changes](#breaking-changes)
5. [Migration Checklist](#migration-checklist)
6. [Common Migration Issues](#common-migration-issues)

---

## Migration Overview

### What Changed in 1.0

The 1.0 release represents a major architectural overhaul focused on:

- **Privacy-First Design**: GDPR/CCPA compliance with ConsentManager
- **Typed Errors**: Complete error hierarchy with specific error codes
- **Configuration Presets**: Environment and application presets
- **Enhanced TypeScript Support**: Full type safety
- **Improved API**: Cleaner, more consistent method signatures
- **Better Performance**: Token management, caching, deduplication

### Migration Time Estimate

| Current State       | Migration Time | Complexity     |
| ------------------- | -------------- | -------------- |
| Pre-0.5 version     | 8-16 hours     | High           |
| 0.5-0.9 version     | 4-8 hours      | Medium         |
| Other memory system | 16-24 hours    | High           |
| New implementation  | N/A            | Start with 1.0 |

---

## From Pre-1.0 Versions

### Step 1: Update Dependencies

```bash
# Update to latest version
npm install @clarity-chat/memory@latest

# or yarn
yarn add @clarity-chat/memory@latest

# or pnpm
pnpm add @clarity-chat/memory@latest
```

### Step 2: Update Imports

```typescript
// ❌ OLD: Pre-1.0 imports
import { MemoryService } from '@clarity-chat/memory'
import { MemoryConfig } from '@clarity-chat/memory/types'

// ✅ NEW: 1.0 imports
import { clarityMemory, createBrowserConfig } from '@clarity-chat/memory'
import type { MemoryItem, MemoryType, MemoryScope } from '@clarity-chat/memory'
```

### Step 3: Update Configuration

```typescript
// ❌ OLD: Pre-1.0 configuration
const memory = new MemoryService({
  maxSize: 1000,
  maxTokens: 2000,
  useEmbeddings: true,
  embeddingModel: 'text-embedding-ada-002',
})

// ✅ NEW: 1.0 configuration with presets
import { clarityMemory, createBrowserConfig } from '@clarity-chat/memory'
import { OpenAIEmbeddings } from '@langchain/openai'

const memory = clarityMemory(
  createBrowserConfig({
    tokenBudget: 'generous', // 4000 tokens
    embeddingProvider: new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
    }),
  })
)
```

### Step 4: Update API Calls

#### Adding Memories

```typescript
// ❌ OLD: Pre-1.0 API
await memory.store({
  content: 'User message',
  type: 'message',
  userId: 'user_123',
  threadId: 'thread_456',
})

// ✅ NEW: 1.0 API with explicit options object
await memory.add('User message', {
  type: 'episodic',
  scope: 'thread',
  metadata: {
    userId: 'user_123',
    threadId: 'thread_456',
    role: 'user',
  },
})
```

#### Querying Memories

```typescript
// ❌ OLD: Pre-1.0 query API
const results = await memory.search('pricing', {
  userId: 'user_123',
  limit: 10,
})

// ✅ NEW: 1.0 query API with filters
const results = await memory.query('pricing', {
  filters: {
    scope: 'user',
    metadata: { userId: 'user_123' },
  },
  limit: 10,
})
```

#### Deleting Memories

```typescript
// ❌ OLD: Pre-1.0 deletion
await memory.remove(memoryId)
await memory.clearUser(userId)

// ✅ NEW: 1.0 deletion with GDPR compliance
await memory.deleteMemory(memoryId)
await memory.deleteUserData(userId, {
  includeScopes: ['user', 'thread', 'session'],
  auditLog: true,
})
```

### Step 5: Update React Components

```typescript
// ❌ OLD: Pre-1.0 React usage
import { MemoryProvider, useMemory } from '@clarity-chat/memory'

function App() {
  const memoryService = new MemoryService(config)

  return (
    <MemoryProvider service={memoryService}>
      <ChatComponent />
    </MemoryProvider>
  )
}

function ChatComponent() {
  const memory = useMemory()

  const handleMessage = async (message: string) => {
    await memory.store({ content: message, type: 'message' })
  }
}

// ✅ NEW: 1.0 React usage
import { MemoryProvider, useMemoryService } from '@clarity-chat/memory'

function App() {
  return (
    <MemoryProvider>
      <ChatComponent />
    </MemoryProvider>
  )
}

function ChatComponent() {
  const memory = useMemoryService()

  const handleMessage = async (message: string) => {
    await memory.add(message, {
      type: 'episodic',
      scope: 'thread',
      metadata: { role: 'user' },
    })
  }
}
```

### Step 6: Add Consent Management

**New in 1.0**: Privacy-first architecture requires consent management.

```typescript
// ✅ NEW: Implement consent UI
import { useMemoryConsent } from '@clarity-chat/memory'

function ConsentBanner() {
  const { hasConsent, grantConsent, loading } = useMemoryConsent('user_123')

  if (hasConsent) return null

  const handleGrant = async () => {
    await grantConsent({
      scopes: ['user', 'thread', 'session'],
      purposes: ['personalization', 'analytics'],
      expiresAt: new Date('2026-12-31'),
    })
  }

  return (
    <div className="consent-banner">
      <p>We use memory to personalize your experience.</p>
      <button onClick={handleGrant} disabled={loading}>
        Grant Consent
      </button>
    </div>
  )
}
```

**Temporary workaround for testing** (not recommended for production):

```typescript
// Disable consent requirement during migration
const memory = clarityMemory({
  privacy: {
    enabled: false, // ⚠️ Disable only for testing!
  },
})
```

### Step 7: Update Error Handling

```typescript
// ❌ OLD: Generic error handling
try {
  await memory.store(data)
} catch (error) {
  console.error('Memory error:', error)
}

// ✅ NEW: Typed error handling
import {
  MemoryError,
  MemoryConsentError,
  MemoryOperationError,
  MemoryConfigError,
} from '@clarity-chat/memory'

try {
  await memory.add(content, options)
} catch (error) {
  if (error instanceof MemoryConsentError) {
    // Handle consent issues
    console.error('Consent required:', error.code)
    showConsentDialog()
  } else if (error instanceof MemoryOperationError) {
    // Handle operation failures
    console.error('Operation failed:', error.operation, error.code)
    showErrorMessage('Failed to save memory')
  } else if (error instanceof MemoryConfigError) {
    // Handle configuration issues
    console.error('Configuration error:', error.code)
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error)
  }
}
```

### Step 8: Migrate Memory Types

```typescript
// ❌ OLD: String-based types
const types = ['message', 'fact', 'event', 'temp']

// ✅ NEW: Standardized memory types
import type { MemoryType } from '@clarity-chat/memory'

const types: MemoryType[] = ['episodic', 'semantic', 'procedural', 'working']

// Migration mapping
const typeMapping = {
  message: 'episodic',
  event: 'episodic',
  fact: 'semantic',
  knowledge: 'semantic',
  pattern: 'procedural',
  workflow: 'procedural',
  temp: 'working',
  scratch: 'working',
}

// Update existing memories
async function migrateMemoryTypes() {
  const allMemories = await oldMemory.getAll()

  for (const mem of allMemories) {
    const newType = typeMapping[mem.type] || 'episodic'

    await memory.add(mem.content, {
      type: newType,
      scope: 'user',
      metadata: {
        ...mem.metadata,
        migratedFrom: mem.type,
      },
    })
  }
}
```

### Step 9: Test Migration

```typescript
// Create comprehensive migration test suite
describe('Memory Migration', () => {
  it('should migrate existing memories', async () => {
    // Setup: Create old-style memory
    const oldData = {
      content: 'Test memory',
      type: 'message',
      userId: 'user_123',
    }

    // Migrate
    await memory.add(oldData.content, {
      type: 'episodic',
      scope: 'user',
      metadata: { userId: oldData.userId },
    })

    // Verify
    const results = await memory.query('test', {
      filters: { metadata: { userId: 'user_123' } },
    })

    expect(results).toHaveLength(1)
    expect(results[0].content).toBe('Test memory')
    expect(results[0].type).toBe('episodic')
  })

  it('should handle consent requirements', async () => {
    // Grant consent
    await memory.grantConsent('user_123', {
      scopes: ['user'],
      purposes: ['personalization'],
    })

    // Should now work
    await expect(
      memory.add('Test', {
        type: 'semantic',
        scope: 'user',
        metadata: { userId: 'user_123' },
      })
    ).resolves.toBeDefined()
  })

  it('should handle new error types', async () => {
    // Test consent error
    await expect(
      memory.add('Test', {
        type: 'semantic',
        scope: 'user',
        metadata: { userId: 'user_no_consent' },
      })
    ).rejects.toThrow(MemoryConsentError)
  })
})
```

---

## From Other Memory Systems

### From LangChain Memory

```typescript
// ❌ OLD: LangChain ConversationBufferMemory
import { ConversationBufferMemory } from 'langchain/memory'

const memory = new ConversationBufferMemory({
  returnMessages: true,
  memoryKey: 'chat_history',
})

// ✅ NEW: Clarity Memory
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  maxMemoryCount: 100,
  maxTotalTokens: 2000,
})

// Store messages
await memory.add(userMessage, {
  type: 'episodic',
  scope: 'thread',
  metadata: { role: 'user', threadId: 'thread_123' },
})

await memory.add(aiMessage, {
  type: 'episodic',
  scope: 'thread',
  metadata: { role: 'assistant', threadId: 'thread_123' },
})

// Retrieve conversation history
const history = await memory.query('', {
  filters: {
    type: 'episodic',
    scope: 'thread',
    metadata: { threadId: 'thread_123' },
  },
  limit: 20,
})
```

### From Mem0

```typescript
// ❌ OLD: Mem0 API
import { Memory } from 'mem0ai'

const memory = new Memory({
  apiKey: process.env.MEM0_API_KEY,
})

await memory.add('User prefers dark mode', {
  user_id: 'user_123',
})

const memories = await memory.search('preferences', {
  user_id: 'user_123',
})

// ✅ NEW: Clarity Memory
import { clarityMemory } from '@clarity-chat/memory'
import { OpenAIEmbeddings } from '@langchain/openai'

const memory = clarityMemory({
  embeddingProvider: new OpenAIEmbeddings(),
})

// Grant consent first
await memory.grantConsent('user_123', {
  scopes: ['user'],
  purposes: ['personalization'],
})

// Store preference
await memory.add('User prefers dark mode', {
  type: 'semantic',
  scope: 'user',
  metadata: {
    userId: 'user_123',
    category: 'preferences',
  },
})

// Search preferences
const memories = await memory.query('preferences', {
  filters: {
    scope: 'user',
    metadata: { userId: 'user_123', category: 'preferences' },
  },
})
```

### From Zep

```typescript
// ❌ OLD: Zep Memory
import { ZepClient } from '@getzep/zep-js'

const zep = new ZepClient({ apiKey: process.env.ZEP_API_KEY })

await zep.memory.addMemory('session_123', {
  messages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ],
})

const history = await zep.memory.getMemory('session_123')

// ✅ NEW: Clarity Memory
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Store conversation
await memory.add('User: Hello', {
  type: 'episodic',
  scope: 'session',
  metadata: {
    sessionId: 'session_123',
    role: 'user',
  },
})

await memory.add('Assistant: Hi there!', {
  type: 'episodic',
  scope: 'session',
  metadata: {
    sessionId: 'session_123',
    role: 'assistant',
  },
})

// Retrieve history
const history = await memory.query('', {
  filters: {
    scope: 'session',
    metadata: { sessionId: 'session_123' },
  },
  limit: 50,
})
```

### Migration Script Template

```typescript
// migration-script.ts
import { clarityMemory } from '@clarity-chat/memory'
import { OldMemorySystem } from './old-system'

async function migrateFromOldSystem() {
  const oldMemory = new OldMemorySystem()
  const newMemory = clarityMemory()

  console.log('Starting migration...')

  try {
    // 1. Fetch all old memories
    const oldMemories = await oldMemory.getAllMemories()
    console.log(`Found ${oldMemories.length} memories to migrate`)

    // 2. Grant consent for all users
    const userIds = [...new Set(oldMemories.map((m) => m.userId))]
    console.log(`Granting consent for ${userIds.length} users`)

    for (const userId of userIds) {
      await newMemory.grantConsent(userId, {
        scopes: ['user', 'thread', 'session'],
        purposes: ['personalization'],
        expiresAt: new Date('2026-12-31'),
      })
    }

    // 3. Migrate memories
    let migrated = 0
    let failed = 0

    for (const oldMem of oldMemories) {
      try {
        // Map old types to new types
        const type = mapMemoryType(oldMem.type)
        const scope = determineScope(oldMem)

        await newMemory.add(oldMem.content, {
          type,
          scope,
          metadata: {
            userId: oldMem.userId,
            threadId: oldMem.threadId,
            originalId: oldMem.id,
            migratedAt: new Date().toISOString(),
            ...oldMem.metadata,
          },
        })

        migrated++

        if (migrated % 100 === 0) {
          console.log(`Migrated ${migrated}/${oldMemories.length}`)
        }
      } catch (error) {
        console.error(`Failed to migrate memory ${oldMem.id}:`, error)
        failed++
      }
    }

    console.log(`✅ Migration complete: ${migrated} migrated, ${failed} failed`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

function mapMemoryType(oldType: string): MemoryType {
  const mapping = {
    message: 'episodic',
    conversation: 'episodic',
    event: 'episodic',
    fact: 'semantic',
    preference: 'semantic',
    knowledge: 'semantic',
    pattern: 'procedural',
    workflow: 'procedural',
    temp: 'working',
  }

  return mapping[oldType] || 'episodic'
}

function determineScope(oldMem: any): MemoryScope {
  if (oldMem.sessionId) return 'session'
  if (oldMem.threadId) return 'thread'
  if (oldMem.userId) return 'user'
  return 'global'
}

// Run migration
migrateFromOldSystem().catch(console.error)
```

---

## Breaking Changes

### 1. API Method Renames

| Old Method      | New Method             | Notes                    |
| --------------- | ---------------------- | ------------------------ |
| `store()`       | `add()`                | Simplified naming        |
| `search()`      | `query()`              | Consistent with industry |
| `remove()`      | `deleteMemory()`       | Explicit naming          |
| `clearUser()`   | `deleteUserData()`     | GDPR compliance          |
| `getMemories()` | `query()` with filters | Unified API              |

### 2. Configuration Changes

| Old Config       | New Config                    | Migration                           |
| ---------------- | ----------------------------- | ----------------------------------- |
| `maxSize`        | `maxMemoryCount`              | Rename                              |
| `maxTokens`      | `maxTotalTokens`              | Rename + add `maxTokensPerMemory`   |
| `useEmbeddings`  | `embeddingProvider`           | Provide instance instead of boolean |
| `embeddingModel` | `embeddingProvider.modelName` | Nested in provider config           |

### 3. Type Changes

```typescript
// ❌ OLD: String unions
type MemoryType = 'message' | 'fact' | 'event' | 'temp'

// ✅ NEW: Standardized types
type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'working'
```

### 4. Scope Introduction

**New in 1.0**: Memory scopes for better organization.

```typescript
// ❌ OLD: No scope concept
await memory.store({ content, userId, threadId })

// ✅ NEW: Explicit scopes
await memory.add(content, {
  type: 'episodic',
  scope: 'thread', // New: global | user | thread | session
  metadata: { userId, threadId },
})
```

### 5. Consent Requirement

**New in 1.0**: Privacy-first requires consent.

```typescript
// ❌ OLD: No consent required
await memory.store({ content, userId })

// ✅ NEW: Consent required for user-scoped memories
await memory.grantConsent(userId, {
  scopes: ['user'],
  purposes: ['personalization'],
})
await memory.add(content, {
  type: 'semantic',
  scope: 'user',
  metadata: { userId },
})
```

### 6. Error Types

```typescript
// ❌ OLD: Generic Error
throw new Error('Memory operation failed')

// ✅ NEW: Typed errors
throw new MemoryOperationError(
  'ADD_FAILED',
  'Failed to add memory',
  'addMemory'
)
```

---

## Migration Checklist

### Pre-Migration

- [ ] **Backup existing data**: Export all current memories
- [ ] **Review current usage**: Document how memory is currently used
- [ ] **Check dependencies**: Ensure compatible versions
- [ ] **Test environment**: Set up isolated test environment
- [ ] **Read changelog**: Review all breaking changes

### During Migration

- [ ] **Update package**: Install latest version
- [ ] **Update imports**: Change to new import paths
- [ ] **Update configuration**: Use new config structure
- [ ] **Add consent management**: Implement consent UI
- [ ] **Update API calls**: Use new method signatures
- [ ] **Update error handling**: Use typed errors
- [ ] **Migrate memory types**: Map old types to new types
- [ ] **Update React components**: Use new hooks
- [ ] **Run migration script**: Migrate existing data
- [ ] **Update tests**: Adapt test suite

### Post-Migration

- [ ] **Test thoroughly**: Run full test suite
- [ ] **Monitor errors**: Watch for new error types
- [ ] **Check performance**: Ensure no regressions
- [ ] **Update documentation**: Update internal docs
- [ ] **Train team**: Brief team on changes
- [ ] **Gradual rollout**: Deploy to staging first
- [ ] **Monitor production**: Watch metrics closely
- [ ] **Clean up**: Remove old code and dependencies

---

## Common Migration Issues

### Issue 1: Missing Consent

**Problem**: Operations failing with `MemoryConsentError`.

**Solution**:

```typescript
// Option 1: Grant consent programmatically
const userIds = ['user_1', 'user_2', 'user_3']

for (const userId of userIds) {
  await memory.grantConsent(userId, {
    scopes: ['user', 'thread'],
    purposes: ['personalization'],
  })
}

// Option 2: Temporarily disable (testing only)
const memory = clarityMemory({
  privacy: { enabled: false },
})
```

### Issue 2: Token Limit Exceeded

**Problem**: Existing data exceeds new token limits.

**Solution**:

```typescript
// Option 1: Increase limits
const memory = clarityMemory({
  maxTotalTokens: 8000, // Increase
  maxTokensPerMemory: 1000,
})

// Option 2: Clean old data before migrating
async function cleanOldData() {
  const old = await oldMemory.getMemoriesOlderThan(30) // 30 days
  for (const mem of old) {
    await oldMemory.delete(mem.id)
  }
}
```

### Issue 3: Type Mapping Errors

**Problem**: Old memory types don't map cleanly to new types.

**Solution**:

```typescript
// Create detailed mapping with fallbacks
function mapMemoryType(oldType: string): MemoryType {
  const mapping: Record<string, MemoryType> = {
    // Episodic
    message: 'episodic',
    chat: 'episodic',
    conversation: 'episodic',
    event: 'episodic',
    interaction: 'episodic',

    // Semantic
    fact: 'semantic',
    knowledge: 'semantic',
    preference: 'semantic',
    setting: 'semantic',

    // Procedural
    pattern: 'procedural',
    workflow: 'procedural',
    habit: 'procedural',

    // Working
    temp: 'working',
    scratch: 'working',
    cache: 'working',
  }

  const mapped = mapping[oldType.toLowerCase()]

  if (!mapped) {
    console.warn(`Unknown type "${oldType}", defaulting to episodic`)
    return 'episodic'
  }

  return mapped
}
```

### Issue 4: Performance Regression

**Problem**: Queries slower after migration.

**Solution**:

```typescript
// 1. Enable caching
const memory = clarityMemory({
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
})

// 2. Use configuration presets
import { createProductionConfig } from '@clarity-chat/memory'

const memory = clarityMemory(
  createProductionConfig({
    enableCaching: true,
    enableCompression: true,
  })
)

// 3. Add appropriate filters
const results = await memory.query('search', {
  filters: {
    type: 'episodic',
    scope: 'thread',
  },
  limit: 10, // Limit results
})
```

### Issue 5: React Hook Errors

**Problem**: Hooks not working after migration.

**Solution**:

```typescript
// Ensure MemoryProvider is at root
function App() {
  return (
    <MemoryProvider>
      {/* All components here can use memory hooks */}
      <ChatApp />
    </MemoryProvider>
  )
}

// Use correct hook names
import {
  useMemoryService, // Was: useMemory
  useMemories, // Was: useMemoryList
  useMemoryQuery, // Was: useSearch
} from '@clarity-chat/memory'
```

---

## Version Compatibility

| Clarity Memory Version | Node.js | React              | TypeScript |
| ---------------------- | ------- | ------------------ | ---------- |
| 1.0.x                  | ≥16.0.0 | ≥17.0.0 (optional) | ≥4.5.0     |
| 0.9.x                  | ≥14.0.0 | ≥16.8.0 (optional) | ≥4.0.0     |
| 0.5.x                  | ≥14.0.0 | ≥16.8.0 (optional) | ≥4.0.0     |

---

## Rollback Plan

If migration fails, here's how to rollback:

```bash
# 1. Restore from backup
npm install @clarity-chat/memory@0.9.0

# 2. Restore old code
git revert <migration-commit>

# 3. Restore data
node restore-backup.js

# 4. Test rollback
npm test
```

---

## Getting Help

Need help with migration?

1. **Check documentation**: Review all guides in `/docs`
2. **Migration support**: File an issue with `migration` label
3. **GitHub Discussions**: Ask in the [migration help discussion](https://github.com/christireid/Clarity-ai-chat-components/discussions)
4. **Professional support**: Contact support@clarity.ai for migration assistance

---

## Post-Migration Best Practices

After successful migration:

1. **Monitor production**: Watch error rates and performance
2. **Gather feedback**: Collect user and developer feedback
3. **Optimize configuration**: Fine-tune based on usage patterns
4. **Update documentation**: Document your specific setup
5. **Clean up**: Remove old dependencies and code
6. **Train team**: Ensure everyone understands new patterns

---

**Ready to migrate?** Start with the [Migration Checklist](#migration-checklist) and reach out if you need help!
