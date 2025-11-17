# Multi-Tenant Chat

> **Build enterprise chat with tenant isolation and RBAC**

This recipe shows how to build a multi-tenant chat system with proper isolation, role-based access control, and audit logging.

## Prerequisites

- Multi-tenancy setup configured
- RBAC (Role-Based Access Control) configured
- Audit logging enabled

## Complete Example

```tsx
import { 
  useClarityChat,
  useMultiTenancy,
  useRBAC,
  ChatWindow,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

function MultiTenantChat({ tenantId, userId }: { tenantId: string; userId: string }) {
  // Initialize multi-tenancy
  const tenancy = useMultiTenancy({
    tenantId,
    userId,
    enableIsolation: true,
    enableQuotas: true,
  })

  // Initialize RBAC
  const rbac = useRBAC({
    userId,
    tenantId,
    roles: ['user'], // User's roles
  })

  // Chat hook with tenant context
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    headers: {
      'X-Tenant-ID': tenantId,
      'X-User-ID': userId,
    },
    onBeforeSend: async (messages) => {
      // Check quotas
      const quota = await tenancy.checkQuota()
      if (!quota.allowed) {
        throw new Error('Quota exceeded')
      }

      // Check permissions
      if (!rbac.can('chat:send')) {
        throw new Error('Permission denied')
      }

      return messages
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Tenant: {tenantId} • User: {userId}
          </p>
          <div className="text-xs text-gray-500">
            {rbac.hasRole('admin') && '👑 Admin'}
            {rbac.hasRole('user') && '👤 User'}
          </div>
        </div>
      </div>
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          try {
            await append({ role: 'user', content })
          } catch (error) {
            if (error.message === 'Quota exceeded') {
              alert('You have reached your message limit')
            } else if (error.message === 'Permission denied') {
              alert('You do not have permission to send messages')
            }
          }
        }}
      />
    </div>
  )
}
```

## Step-by-Step Setup

### 1. Configure Multi-Tenancy

```tsx
import { useMultiTenancy } from '@clarity-chat/react'

const tenancy = useMultiTenancy({
  tenantId: 'tenant-123',
  userId: 'user-456',
  enableIsolation: true, // Ensure data isolation
  enableQuotas: true, // Enable usage quotas
})
```

### 2. Set Up RBAC

```tsx
import { useRBAC } from '@clarity-chat/react'

const rbac = useRBAC({
  userId: 'user-456',
  tenantId: 'tenant-123',
  roles: ['user'], // User's roles
  permissions: {
    'chat:send': true,
    'chat:delete': false,
    'chat:admin': false,
  },
})
```

### 3. Add Tenant Context to Requests

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  headers: {
    'X-Tenant-ID': tenantId,
    'X-User-ID': userId,
  },
})
```

### 4. Check Permissions Before Actions

```tsx
const handleSend = async (content: string) => {
  // Check permissions
  if (!rbac.can('chat:send')) {
    alert('Permission denied')
    return
  }

  // Check quotas
  const quota = await tenancy.checkQuota()
  if (!quota.allowed) {
    alert('Quota exceeded')
    return
  }

  await append({ role: 'user', content })
}
```

## Key Points

- **Tenant Isolation**: Always include tenant ID in requests
- **RBAC**: Check permissions before actions
- **Quotas**: Enforce usage limits per tenant
- **Audit Logging**: Log all actions for compliance

## Advanced: Admin Dashboard

```tsx
function AdminDashboard({ tenantId }: { tenantId: string }) {
  const tenancy = useMultiTenancy({ tenantId })
  const rbac = useRBAC({ tenantId, roles: ['admin'] })

  if (!rbac.hasRole('admin')) {
    return <div>Access denied</div>
  }

  const stats = tenancy.getStats()

  return (
    <div>
      <h2>Tenant Statistics</h2>
      <p>Messages: {stats.messages}</p>
      <p>Quota: {stats.quota.used} / {stats.quota.limit}</p>
    </div>
  )
}
```

## Related

- [Multi-Tenancy Guide](../../docs/guides/multi-tenancy.md)
- [RBAC Guide](../../docs/guides/rbac.md)
- [Enterprise Features](../../packages/react/README.md#enterprise-features)
