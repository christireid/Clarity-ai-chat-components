# Migration Guide: MemMachine → Clarity Memory

This guide helps you migrate from MemMachine to Clarity Memory.

## Quick Comparison

### MemMachine (Python)

```python
from memmachine import MemMachineClient

client = MemMachineClient(base_url="http://localhost:8080")
memory = client.memory(
    group_id="group",
    agent_id=["agent"],
    user_id=["user"],
    session_id="session"
)
memory.add("Hello")
results = memory.search("Hello")
```

### Clarity Memory (TypeScript)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({ context: "user:session" })
await memory.add("Hello")
const results = await memory.recall("Hello")
```

## Key Differences

### 1. Context Simplification

**MemMachine**: Requires 4 IDs
- `group_id` (string)
- `agent_id` (list of strings)
- `user_id` (list of strings)
- `session_id` (string)

**Clarity Memory**: Single context ID
- `context` (string, e.g., "user123" or "user123:session456")

**Migration**:
```typescript
// Old
group_id: "group"
agent_id: ["agent"]
user_id: ["user"]
session_id: "session"

// New
context: "user:session"  // or just "user" if you don't need sessions
```

### 2. Server Dependency

**MemMachine**: Requires running server
- Docker container
- Neo4j database
- PostgreSQL database
- REST API server

**Clarity Memory**: Standalone (no server)
- Works immediately
- Optional server for production scale

**Migration**: Remove server setup, use standalone mode.

### 3. Configuration

**MemMachine**: Complex YAML config
```yaml
model:
  gpt-4o-mini:
    model_vendor: openai
    api_key: ${OPENAI_API_KEY}
embedder:
  openai-embedder:
    provider: openai
    config:
      api_key: ${OPENAI_API_KEY}
# ... many more configs
```

**Clarity Memory**: Simple TypeScript config
```typescript
const memory = clarityMemory({
  embedding: {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY,
  },
})
```

### 4. API Changes

#### Adding Memory

**MemMachine**:
```python
await inst.add_memory_episode(
    producer="user",
    produced_for="agent",
    episode_content="Hello",
    episode_type="message",
    content_type=ContentType.STRING,
    timestamp=datetime.now(),
    metadata={}
)
```

**Clarity Memory**:
```typescript
await memory.add("Hello", {
  type: "message",
  timestamp: new Date(),
})
```

#### Searching Memory

**MemMachine**:
```python
short_episode, long_episode, summary = await inst.query_memory(
    query="Hello",
    limit=20,
    property_filter={"category": "food"}
)
```

**Clarity Memory**:
```typescript
const results = await memory.recall("Hello", {
  limit: 20,
  filters: { category: "food" },
})
// Returns: { memories: [...], tokens: 1234, summary: "..." }
```

### 5. Storage

**MemMachine**: Neo4j only
- Requires Neo4j setup
- Graph database

**Clarity Memory**: Multiple options
- In-memory (default)
- File
- IndexedDB (browser)
- Redis
- PostgreSQL
- Vector DBs (Chroma, Qdrant, etc.)

**Migration**: Choose appropriate storage adapter.

## Step-by-Step Migration

### Step 1: Install Clarity Memory

```bash
npm install @clarity-chat/memory
```

### Step 2: Replace Client Initialization

**Before**:
```python
client = MemMachineClient(base_url="http://localhost:8080")
memory = client.memory(
    group_id="group",
    agent_id=["agent"],
    user_id=["user"],
    session_id="session"
)
```

**After**:
```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({ context: "user:session" })
```

### Step 3: Update Memory Operations

**Before**:
```python
memory.add("Hello", metadata={"type": "message"})
results = memory.search("Hello", limit=10)
```

**After**:
```typescript
await memory.add("Hello", { type: "message" })
const results = await memory.recall("Hello", { limit: 10 })
```

### Step 4: Configure Storage

**Before**: Neo4j setup required

**After**: Choose storage adapter
```typescript
const memory = clarityMemory({
  context: "user:session",
  store: {
    type: "file",  // or "indexeddb", "redis", "postgres", etc.
    path: "./memory.json",
  },
})
```

### Step 5: Update Context Formatting

**Before**:
```python
finalized_query = await inst.formalize_query_with_context(
    query="Hello",
    limit=20
)
# Returns XML string
```

**After**:
```typescript
const bundle = await memory.context({
  query: "Hello",
  maxTokens: 4000,
  format: "openai",
})
// Returns: { messages: [...], tokens: 3850 }
```

## Feature Mapping

| MemMachine Feature | Clarity Memory Equivalent |
|-------------------|---------------------------|
| `add_memory_episode()` | `memory.add()` |
| `query_memory()` | `memory.recall()` or `memory.search()` |
| `formalize_query_with_context()` | `memory.context()` |
| `delete_data()` | `memory.flush()` or `memory.forget()` |
| Profile Memory | `memory.extractFromMessages()` |
| Short-term memory | Automatic (configured via `shortTerm`) |
| Long-term memory | Automatic (configured via `longTerm`) |

## Advanced Migration

### Multi-User Applications

**MemMachine**:
```python
for user_id in users:
    memory = client.memory(
        group_id="app",
        user_id=[user_id],
        session_id=f"session_{user_id}"
    )
```

**Clarity Memory**:
```typescript
for (const userId of users) {
  const memory = clarityMemory({
    context: userId,
  })
}
```

### Profile Memory

**MemMachine**:
```python
profile_memory = ProfileMemory(...)
await profile_memory.add_persona_message("User likes pizza", user_id="user1")
```

**Clarity Memory**:
```typescript
await memory.extractFromMessages([
  { role: "user", content: "User likes pizza" },
], {
  extractPreferences: true,
})
```

## Common Issues

### Issue 1: Context ID Format

**Problem**: MemMachine uses 4 IDs, Clarity Memory uses 1.

**Solution**: Combine IDs into single context string.
```typescript
// Option 1: Just user ID
context: "user123"

// Option 2: User + session
context: "user123:session456"

// Option 3: Full context
context: "group:user:session"
```

### Issue 2: Async/Await

**Problem**: MemMachine Python uses async/await, Clarity Memory TypeScript also uses async/await.

**Solution**: All operations are async in Clarity Memory.
```typescript
// Always use await
await memory.add("Hello")
const results = await memory.recall("Hello")
```

### Issue 3: Storage Migration

**Problem**: MemMachine uses Neo4j, Clarity Memory uses different stores.

**Solution**: Export from MemMachine, import to Clarity Memory, or use PostgreSQL adapter for similar functionality.

## Need Help?

- Check the [API Reference](./API_REFERENCE.md)
- See [Examples](../examples/)
- Open an issue on GitHub

---

**Ready to migrate?** Start with the [Getting Started Guide](./GETTING_STARTED.md) to learn Clarity Memory's API.
