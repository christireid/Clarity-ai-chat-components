# Role-Based Access Control (RBAC)

Clarity Chat provides optional RBAC utilities for implementing permissions and access control in your AI chat applications. The system is flexible and extensible - you bring your own storage backend.

## Overview

RBAC allows you to:
- Define roles with specific permissions
- Assign roles to users
- Check permissions before allowing actions
- Support role inheritance
- Integrate with multi-tenant applications

## Installation

RBAC utilities are included in `@clarity-chat/react`:

```tsx
import {
  RBACManager,
  MemoryRBACStorage,
  CommonRoles,
} from '@clarity-chat/react'
```

## Quick Start

### 1. Set Up Storage

Create a storage backend (or use the in-memory storage for development):

```tsx
import { MemoryRBACStorage, CommonRoles } from '@clarity-chat/react'

const storage = new MemoryRBACStorage()

// Add predefined roles
storage.addRole(CommonRoles.ADMIN)
storage.addRole(CommonRoles.USER)
storage.addRole(CommonRoles.VIEWER)
storage.addRole(CommonRoles.DEVELOPER)
```

### 2. Create RBAC Manager

```tsx
import { RBACManager } from '@clarity-chat/react'

const rbac = new RBACManager(storage)
```

### 3. Assign Roles to Users

```tsx
// Assign roles to users
storage.assignRoles('user-123', ['user'])
storage.assignRoles('admin-456', ['admin'])
storage.assignRoles('dev-789', ['developer'])
```

### 4. Check Permissions

```tsx
// Check if user can send messages
const canSend = await rbac.hasPermission(
  { userId: 'user-123', roles: ['user'] },
  'chat.send'
)

if (canSend) {
  // Allow sending message
} else {
  // Show error or disable UI
}
```

## Common Roles

Clarity Chat provides predefined roles:

- **ADMIN**: Full access (`*` permission)
- **USER**: Standard user access (chat.send, chat.read, document.upload, document.read)
- **VIEWER**: Read-only access (chat.read, document.read)
- **DEVELOPER**: Developer access (includes API access and settings)

```tsx
import { CommonRoles } from '@clarity-chat/react'

storage.addRole(CommonRoles.ADMIN)
storage.addRole(CommonRoles.USER)
storage.addRole(CommonRoles.VIEWER)
storage.addRole(CommonRoles.DEVELOPER)
```

## Custom Roles

Create custom roles with specific permissions:

```tsx
storage.addRole({
  id: 'power-user',
  name: 'Power User',
  description: 'Enhanced user with additional permissions',
  permissions: [
    'chat.send',
    'chat.read',
    'document.upload',
    'document.read',
    'api.access',
    'settings.modify',
  ],
})
```

## Role Inheritance

Roles can inherit permissions from other roles:

```tsx
storage.addRole({
  id: 'moderator',
  name: 'Moderator',
  permissions: ['chat.moderate', 'user.ban'],
  inherits: ['user'], // Inherits all user permissions
})

// Moderator now has: chat.moderate, user.ban, chat.send, chat.read, document.upload, document.read
```

## Permission Checking

### Single Permission

```tsx
const canSend = await rbac.hasPermission(
  { userId: 'user-123', roles: ['user'] },
  'chat.send'
)
```

### Multiple Permissions (Any)

```tsx
const canAccess = await rbac.hasAnyPermission(
  { userId: 'user-123', roles: ['user'] },
  ['chat.send', 'chat.read']
)
```

### Multiple Permissions (All)

```tsx
const canManage = await rbac.hasAllPermissions(
  { userId: 'admin-456', roles: ['admin'] },
  ['chat.send', 'chat.delete', 'user.manage']
)
```

### Get All Permissions

```tsx
const permissions = await rbac.getUserPermissions({
  userId: 'user-123',
  roles: ['user'],
})

console.log(permissions)
// ['chat.send', 'chat.read', 'document.upload', 'document.read']
```

## Integration with Chat

Protect chat actions with RBAC:

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { RBACManager, MemoryRBACStorage } from '@clarity-chat/react'

function ProtectedChat() {
  const [messages, setMessages] = useState([])
  const storage = new MemoryRBACStorage()
  const rbac = new RBACManager(storage)
  
  // Initialize roles
  storage.addRole(CommonRoles.USER)
  storage.assignRoles('current-user', ['user'])

  const handleSend = async (content: string) => {
    // Check permission before sending
    const canSend = await rbac.hasPermission(
      { userId: 'current-user', roles: ['user'] },
      'chat.send'
    )

    if (!canSend) {
      alert('You do not have permission to send messages')
      return
    }

    // Send message...
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Multi-Tenant RBAC

Support tenant-specific roles:

```tsx
// Assign roles within a tenant context
storage.assignRoles('user-123', ['user'], 'tenant-acme')
storage.assignRoles('user-123', ['admin'], 'tenant-corp')

// Check permissions with tenant context
const canSend = await rbac.hasPermission(
  {
    userId: 'user-123',
    roles: ['user'],
    tenantId: 'tenant-acme',
  },
  'chat.send'
)
```

## Custom Storage Backend

Implement your own storage backend:

```tsx
import type { RBACStorage, Role } from '@clarity-chat/react'

class DatabaseRBACStorage implements RBACStorage {
  async getRole(roleId: string): Promise<Role | null> {
    // Query your database
    const role = await db.roles.findOne({ id: roleId })
    return role
  }

  async getUserRoles(userId: string, tenantId?: string): Promise<string[]> {
    // Query user roles from database
    const userRoles = await db.userRoles.find({
      userId,
      tenantId,
    })
    return userRoles.map(ur => ur.roleId)
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const role = await this.getRole(roleId)
    return role?.permissions || []
  }
}

// Use custom storage
const storage = new DatabaseRBACStorage()
const rbac = new RBACManager(storage)
```

## Permission Patterns

### Resource-Based Permissions

```tsx
// Resource:action pattern
'chat.send'      // Send messages
'chat.read'      // Read messages
'chat.delete'    // Delete messages
'document.upload' // Upload documents
'document.read'   // Read documents
'user.manage'     // Manage users
'settings.modify' // Modify settings
```

### Wildcard Permissions

```tsx
// Admin role with full access
storage.addRole({
  id: 'admin',
  name: 'Administrator',
  permissions: ['*'], // All permissions
})
```

## Caching

RBAC Manager caches roles for performance:

```tsx
// Clear cache when roles change
rbac.clearCache()
```

## Best Practices

1. **Define Clear Permissions**: Use consistent naming (`resource.action`)
2. **Use Role Inheritance**: Avoid duplicating permissions
3. **Check Early**: Verify permissions before expensive operations
4. **Cache Strategically**: Clear cache when roles change
5. **Tenant Isolation**: Always include tenantId in multi-tenant apps
6. **Fail Securely**: Default to denying access if permission check fails

## Example: Full RBAC Integration

```tsx
import {
  ChatWindow,
  RBACManager,
  MemoryRBACStorage,
  CommonRoles,
} from '@clarity-chat/react'

function SecureChatApp() {
  const [messages, setMessages] = useState([])
  const [userRole, setUserRole] = useState('viewer')
  
  const storage = new MemoryRBACStorage()
  const rbac = new RBACManager(storage)

  useEffect(() => {
    // Initialize roles
    storage.addRole(CommonRoles.ADMIN)
    storage.addRole(CommonRoles.USER)
    storage.addRole(CommonRoles.VIEWER)
    
    // Assign role to current user
    storage.assignRoles('current-user', [userRole])
  }, [userRole])

  const handleSend = async (content: string) => {
    const canSend = await rbac.hasPermission(
      { userId: 'current-user', roles: [userRole] },
      'chat.send'
    )

    if (!canSend) {
      return
    }

    // Send message...
  }

  const canSend = rbac.hasPermission(
    { userId: 'current-user', roles: [userRole] },
    'chat.send'
  )

  return (
    <div>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        disabled={!canSend}
      />
      {!canSend && (
        <p>You need the "user" role to send messages</p>
      )}
    </div>
  )
}
```

## Next Steps

- Learn about [Multi-Tenancy](/guide/multi-tenancy) for tenant isolation
- Check out [Usage Quotas](/guide/usage-quotas) for resource limits
- See [Audit Logging](/guide/audit-logging) for permission tracking
