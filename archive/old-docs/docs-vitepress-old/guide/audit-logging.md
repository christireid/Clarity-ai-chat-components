# Audit Logging

Track all actions in your chat application for compliance, security, and debugging purposes.

## Overview

Audit logging helps you:
- Track user actions for compliance
- Debug issues with detailed logs
- Monitor security events
- Generate audit reports
- Meet regulatory requirements

## Quick Start

```tsx
import { AuditLogger, MemoryAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  retentionDays: 90,
  redactFields: ['password', 'apiKey'],
})

// Log an action
await audit.log('chat.message.sent', {
  messageId: '123',
  content: 'Hello',
}, {
  userId: 'user-456',
  sessionId: 'session-789',
  result: 'success',
})
```

## Storage Backends

### Memory Storage (Development)

```tsx
import { MemoryAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
})
```

### Database Storage

```tsx
import { DatabaseAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new DatabaseAuditStorage({
    connectionString: process.env.DATABASE_URL,
    tableName: 'audit_logs',
  }),
})
```

### Cloud Storage

```tsx
import { CloudAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new CloudAuditStorage({
    provider: 'aws', // or 'gcp', 'azure'
    bucket: 'audit-logs',
    region: 'us-east-1',
  }),
})
```

## Logging Actions

### Basic Logging

```tsx
await audit.log('chat.message.sent', {
  messageId: '123',
  content: 'Hello',
})
```

### With Metadata

```tsx
await audit.log(
  'chat.message.sent',
  {
    messageId: '123',
    content: 'Hello',
  },
  {
    userId: 'user-456',
    sessionId: 'session-789',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    result: 'success',
    duration: 250, // ms
  }
)
```

### Logging Errors

```tsx
try {
  await sendMessage(message)
} catch (error) {
  await audit.log('chat.message.error', {
    messageId: message.id,
    error: error.message,
    stack: error.stack,
  }, {
    userId: currentUser.id,
    result: 'error',
  })
}
```

## Querying Logs

### Query by User

```tsx
const logs = await audit.query({
  userId: 'user-456',
  limit: 100,
})
```

### Query by Action

```tsx
const logs = await audit.query({
  action: 'chat.message.sent',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
})
```

### Query with Filters

```tsx
const logs = await audit.query({
  userId: 'user-456',
  action: 'chat.message.sent',
  result: 'success',
  startDate: new Date('2024-01-01'),
  limit: 50,
  sort: 'desc',
})
```

## Field Redaction

Automatically redact sensitive fields:

```tsx
const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  redactFields: ['password', 'apiKey', 'token', 'secret'],
})

// Password will be redacted in logs
await audit.log('user.login', {
  username: 'alice',
  password: 'secret123', // Will be redacted
})
```

### Custom Redaction

```tsx
const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  redactFields: ['password'],
  redactFunction: (field, value) => {
    if (field === 'email') {
      return value.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    }
    return '***'
  },
})
```

## Retention Policies

### Automatic Cleanup

```tsx
const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  retentionDays: 90, // Keep logs for 90 days
  autoCleanup: true, // Automatically delete old logs
})
```

### Manual Cleanup

```tsx
// Delete logs older than 90 days
await audit.cleanup({
  olderThan: 90, // days
})

// Delete logs matching criteria
await audit.cleanup({
  action: 'chat.message.sent',
  olderThan: 30,
})
```

## Integration with Chat

### Automatic Logging

```tsx
import { ChatWindow, AuditProvider } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
})

function App() {
  return (
    <AuditProvider logger={audit} autoLog={true}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </AuditProvider>
  )
}
```

### Manual Logging

```tsx
import { useAudit } from '@clarity-chat/react'

function ChatComponent() {
  const { log } = useAudit()
  
  const handleSend = async (content: string) => {
    await log('chat.message.sent', {
      content,
      timestamp: Date.now(),
    }, {
      userId: currentUser.id,
    })
    
    await sendMessage(content)
  }
  
  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Audit Reports

### Generate Report

```tsx
const report = await audit.generateReport({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  format: 'json', // or 'csv', 'pdf'
})

// Report includes:
// - Total actions
// - Actions by type
// - Actions by user
// - Error rate
// - Average duration
```

### Export Logs

```tsx
// Export to JSON
const json = await audit.export({
  format: 'json',
  filters: { userId: 'user-456' },
})

// Export to CSV
const csv = await audit.export({
  format: 'csv',
  startDate: new Date('2024-01-01'),
})
```

## Best Practices

1. **Log Everything**: Log all important actions
2. **Include Context**: Add user, session, and request context
3. **Redact Sensitive Data**: Never log passwords or tokens
4. **Set Retention**: Configure appropriate retention periods
5. **Monitor Logs**: Set up alerts for suspicious activity
6. **Performance**: Use async logging to avoid blocking
7. **Compliance**: Ensure logs meet regulatory requirements

## Compliance

### GDPR Compliance

```tsx
const audit = new AuditLogger({
  storage: new DatabaseAuditStorage(),
  retentionDays: 365, // Required retention period
  redactFields: ['email', 'phone', 'address'], // PII fields
  gdprCompliant: true, // Enable GDPR features
})

// Delete user data on request
await audit.deleteUserData('user-456')
```

### HIPAA Compliance

```tsx
const audit = new AuditLogger({
  storage: new EncryptedAuditStorage(),
  retentionDays: 2555, // 7 years
  encryption: true,
  accessControl: true,
})
```

## Next Steps

- [Audit API Reference](/api/audit) - Complete audit API
- [Storage Backends](/guide/audit-storage) - Storage options
- [Compliance Guide](/guide/compliance) - Regulatory compliance
