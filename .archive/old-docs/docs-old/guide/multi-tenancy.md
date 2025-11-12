# Multi-Tenancy

Clarity Chat provides optional utilities for building multi-tenant AI applications. These utilities help you isolate data, manage tenant-specific configurations, and enforce quotas per tenant.

## Overview

Multi-tenancy features include:
- Tenant isolation (namespaces, cache prefixes, database names)
- Tenant context management
- Tenant-specific quotas and settings
- Integration with vector stores, caches, and databases
- Tenant status management

## Installation

Multi-tenancy utilities are included in `@clarity-chat/react`:

```tsx
import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'
```

## Quick Start

### 1. Set Up Storage

Create a storage backend (or use the in-memory storage for development):

```tsx
import { MemoryTenantStorage } from '@clarity-chat/react'

const storage = new MemoryTenantStorage()
```

### 2. Create Tenant Manager

```tsx
import { TenantManager } from '@clarity-chat/react'

const tenants = new TenantManager(storage)
```

### 3. Add Tenants

```tsx
await storage.addTenant({
  id: 'acme-corp',
  name: 'Acme Corp',
  status: 'active',
  plan: 'enterprise',
  quotas: {
    tokens: 1000000,
    requests: 10000,
    storage: 1000000000, // 1GB
    users: 100,
  },
  createdAt: Date.now(),
})
```

### 4. Set Tenant Context

```tsx
const tenant = await tenants.getTenant('acme-corp')

tenants.setContext({
  tenant,
  userId: 'user-123',
  roles: ['user'],
})
```

### 5. Use Tenant Isolation

```tsx
// Get namespace for vector store
const namespace = tenants.getNamespace('acme-corp')
// Returns: "tenant_acme-corp"

// Get cache prefix
const cachePrefix = tenants.getCachePrefix('acme-corp')
// Returns: "tenant:acme-corp:"

// Get database name
const dbName = tenants.getDatabaseName('acme-corp')
// Returns: "clarity_tenant_acme-corp"
```

## Tenant Isolation

### Vector Store Isolation

Isolate vector data per tenant:

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'
import { TenantManager } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'documents',
})

const tenants = new TenantManager(storage)

// Set tenant context
tenants.setContext({
  tenant: await tenants.getTenant('acme-corp'),
  userId: 'user-123',
})

// Use tenant namespace
const namespace = tenants.getNamespace('acme-corp')

// Store vectors with tenant isolation
await vectorStore.upsert(vectors, { namespace })

// Query only tenant's data
const results = await vectorStore.query({
  namespace,
  vector: queryEmbedding,
  topK: 10,
})
```

### Cache Isolation

Isolate cache data per tenant:

```tsx
const tenants = new TenantManager(storage)
const cachePrefix = tenants.getCachePrefix('acme-corp')

// Store cache with tenant prefix
await cache.set(`${cachePrefix}user:123`, userData)

// Retrieve tenant-specific cache
const userData = await cache.get(`${cachePrefix}user:123`)
```

### Database Isolation

Use tenant-specific database names:

```tsx
const tenants = new TenantManager(storage)
const dbName = tenants.getDatabaseName('acme-corp')

// Connect to tenant-specific database
const db = await connectToDatabase(dbName)

// All queries are automatically isolated
const messages = await db.messages.find({ userId: 'user-123' })
```

## Tenant Context

Set and retrieve tenant context for request-scoped operations:

```tsx
// Set context at request start
tenants.setContext({
  tenant: await tenants.getTenant('acme-corp'),
  userId: 'user-123',
  roles: ['user'],
  permissions: ['chat.send', 'chat.read'],
})

// Get context anywhere in your app
const context = tenants.getContext()
if (context) {
  console.log(`Tenant: ${context.tenant.name}`)
  console.log(`User: ${context.userId}`)
}
```

## Tenant Status

Check and manage tenant status:

```tsx
// Check if tenant is active
const isActive = await tenants.isActive('acme-corp')

if (!isActive) {
  throw new Error('Tenant account is suspended')
}

// Update tenant status
const tenant = await tenants.getTenant('acme-corp')
tenant.status = 'suspended'
await tenants.updateTenant(tenant)
```

## Tenant Quotas

Check and enforce tenant quotas:

```tsx
// Check if tenant has quota available
const hasQuota = await tenants.checkQuota('acme-corp', 'tokens')

if (!hasQuota) {
  throw new Error('Tenant has exceeded token quota')
}

// Get tenant quotas
const tenant = await tenants.getTenant('acme-corp')
console.log(tenant.quotas)
// {
//   tokens: 1000000,
//   requests: 10000,
//   storage: 1000000000,
//   users: 100,
// }
```

## Integration with Usage Quotas

Combine with the Usage Quotas system:

```tsx
import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'
import { TenantManager } from '@clarity-chat/react'

const quotaStorage = new MemoryQuotaStorage()
const quotaManager = new QuotaManager(quotaStorage)

const tenants = new TenantManager(storage)

// Set tenant context
const tenant = await tenants.getTenant('acme-corp')
tenants.setContext({ tenant, userId: 'user-123' })

// Check quota with tenant namespace
const namespace = tenants.getNamespace('acme-corp')
const hasQuota = await quotaManager.checkQuota({
  userId: 'user-123',
  type: 'tokens',
  amount: 1000,
  namespace,
})

if (hasQuota) {
  // Consume quota
  await quotaManager.consumeQuota({
    userId: 'user-123',
    type: 'tokens',
    amount: 1000,
    namespace,
  })
}
```

## Custom Storage Backend

Implement your own tenant storage:

```tsx
import type { TenantStorage, Tenant } from '@clarity-chat/react'

class DatabaseTenantStorage implements TenantStorage {
  async getTenant(tenantId: string): Promise<Tenant | null> {
    const tenant = await db.tenants.findOne({ id: tenantId })
    return tenant
  }

  async updateTenant(tenant: Tenant): Promise<void> {
    await db.tenants.updateOne(
      { id: tenant.id },
      { $set: tenant }
    )
  }

  async listTenants(options?: { limit?: number; offset?: number }): Promise<Tenant[]> {
    return await db.tenants
      .find({})
      .skip(options?.offset || 0)
      .limit(options?.limit || 100)
      .toArray()
  }
}

// Use custom storage
const storage = new DatabaseTenantStorage()
const tenants = new TenantManager(storage)
```

## Tenant Plans

Manage different plans/tiers:

```tsx
await storage.addTenant({
  id: 'startup-1',
  name: 'Startup Inc',
  status: 'active',
  plan: 'starter',
  quotas: {
    tokens: 100000,
    requests: 1000,
    storage: 100000000, // 100MB
    users: 5,
  },
  createdAt: Date.now(),
})

await storage.addTenant({
  id: 'enterprise-1',
  name: 'Enterprise Corp',
  status: 'active',
  plan: 'enterprise',
  quotas: {
    tokens: 10000000,
    requests: 100000,
    storage: 10000000000, // 10GB
    users: 1000,
  },
  createdAt: Date.now(),
})
```

## Complete Example

```tsx
import {
  ChatWindow,
  TenantManager,
  MemoryTenantStorage,
  PineconeVectorStore,
} from '@clarity-chat/react'

function MultiTenantChatApp() {
  const [messages, setMessages] = useState([])
  const [tenantId, setTenantId] = useState('acme-corp')
  
  const storage = new MemoryTenantStorage()
  const tenants = new TenantManager(storage)
  
  const vectorStore = new PineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'documents',
  })

  useEffect(() => {
    // Initialize tenant
    storage.addTenant({
      id: tenantId,
      name: 'Acme Corp',
      status: 'active',
      quotas: { tokens: 1000000 },
      createdAt: Date.now(),
    })

    // Set tenant context
    const tenant = await tenants.getTenant(tenantId)
    tenants.setContext({
      tenant,
      userId: 'current-user',
    })
  }, [tenantId])

  const handleSend = async (content: string) => {
    // Check tenant status
    const isActive = await tenants.isActive(tenantId)
    if (!isActive) {
      alert('Your account is suspended')
      return
    }

    // Use tenant namespace for RAG
    const namespace = tenants.getNamespace(tenantId)
    const results = await vectorStore.query({
      namespace,
      vector: await generateEmbedding(content),
      topK: 5,
    })

    // Send message with tenant context
    // ...
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Best Practices

1. **Always Set Context**: Set tenant context at the start of each request
2. **Use Namespaces**: Always use tenant namespaces for data isolation
3. **Check Status**: Verify tenant is active before processing requests
4. **Enforce Quotas**: Check quotas before consuming resources
5. **Isolate Storage**: Use tenant-specific storage backends when possible
6. **Clear Context**: Clear tenant context after request completes

## Next Steps

- Learn about [RBAC](/guide/rbac) for tenant-specific permissions
- Check out [Usage Quotas](/guide/usage-quotas) for resource limits
- See [Webhooks](/guide/webhooks) for tenant-specific events
