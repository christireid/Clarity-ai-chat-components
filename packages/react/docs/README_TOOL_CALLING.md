# Tool Calling Documentation

**Complete guide to implementing tool calling in Clarity Chat**

---

## 📚 Documentation Index

### 🚀 **Start Here**

**New to tool calling?** Start with the Getting Started guide:

👉 **[Getting Started Guide](./GETTING_STARTED_TOOL_CALLING.md)** - 5-minute quick start

**Build your first tool in 5 minutes** with step-by-step instructions, real-world examples, and
production-ready templates.

---

### 📖 **Core Guides**

#### 1. **[Tool Calling API Guide](./TOOL_CALLING_API_GUIDE.md)** (600+ lines)

**When to read**: Choosing between APIs (ToolOrchestrator vs ToolsEngine vs ToolExecutor)

**What's inside**:

- Visual decision tree
- API comparison table (4 APIs × 14 features)
- Detailed use cases with code examples
- Common patterns (approval flows, progress, retries)
- Troubleshooting guide

**Best for**: Understanding which API to use for your use case

---

#### 2. **[Tool Security Guide](./TOOL_SECURITY_GUIDE.md)** (Comprehensive)

**When to read**: Before deploying to production

**What's inside**:

- Threat model (4 threat actors, 6 attack vectors)
- Security boundaries with code examples
- Secure tool development template
- 4 sandboxing strategies
- Security checklists (application, tool, infrastructure)
- Incident response procedures

**Best for**: Building secure, production-ready tools

---

#### 3. **[Tool Call Types Guide](./TOOL_CALL_TYPES_GUIDE.md)** (Comprehensive)

**When to read**: Confused about ToolInvocation vs ToolsEngineCall vs ToolCallRecord?

**What's inside**:

- Explanation of 3 tool call types at different layers
- State comparison (5 vs 6 vs 11 states)
- Property name mapping (toolCallId vs id, toolName vs name, etc.)
- Type conversion utilities
- Decision tree for choosing the right type
- Common pitfalls and solutions

**Best for**: Understanding the type system

---

#### 4. **[Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md)** (Step-by-step)

**When to read**: Migrating from legacy patterns

**What's inside**:

- 6 detailed migration paths with before/after code
- Breaking changes documentation
- New features to adopt
- Rollback strategy
- Timeline recommendations

**Best for**: Upgrading existing code

---

## 🎯 **Quick Navigation**

### By Experience Level

| Level            | Recommended Path                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Beginner**     | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md) → [API Guide](./TOOL_CALLING_API_GUIDE.md) → [Security Guide](./TOOL_SECURITY_GUIDE.md) |
| **Intermediate** | [API Guide](./TOOL_CALLING_API_GUIDE.md) → [Types Guide](./TOOL_CALL_TYPES_GUIDE.md) → [Security Guide](./TOOL_SECURITY_GUIDE.md)            |
| **Migrating**    | [Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md) → [Types Guide](./TOOL_CALL_TYPES_GUIDE.md)                                             |
| **Production**   | [Security Guide](./TOOL_SECURITY_GUIDE.md) → [API Guide](./TOOL_CALLING_API_GUIDE.md)                                                        |

---

### By Use Case

| Use Case                          | Recommended Guide                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| **First time implementing tools** | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md)                                   |
| **Choosing which API to use**     | [API Guide](./TOOL_CALLING_API_GUIDE.md)                                               |
| **Building secure tools**         | [Security Guide](./TOOL_SECURITY_GUIDE.md)                                             |
| **Understanding types**           | [Types Guide](./TOOL_CALL_TYPES_GUIDE.md)                                              |
| **Migrating legacy code**         | [Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md)                                   |
| **Debugging issues**              | [Getting Started - Troubleshooting](./GETTING_STARTED_TOOL_CALLING.md#troubleshooting) |

---

### By Topic

| Topic                    | Where to Find It                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Quick Start (5 min)**  | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#5-minute-quick-start)                                                |
| **Tool Templates**       | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#common-patterns)                                                     |
| **API Decision Tree**    | [API Guide](./TOOL_CALLING_API_GUIDE.md#quick-decision-tree)                                                             |
| **Threat Model**         | [Security Guide](./TOOL_SECURITY_GUIDE.md#threat-model)                                                                  |
| **Type Conversion**      | [Types Guide](./TOOL_CALL_TYPES_GUIDE.md#interoperability)                                                               |
| **Breaking Changes**     | [Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md#breaking-changes)                                                    |
| **Production Checklist** | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#production-checklist)                                                |
| **Security Checklist**   | [Security Guide](./TOOL_SECURITY_GUIDE.md#security-checklists)                                                           |
| **Common Errors**        | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#troubleshooting)                                                     |
| **Rate Limiting**        | [API Guide](./TOOL_CALLING_API_GUIDE.md) + [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#enable-advanced-features) |
| **Audit Logging**        | [API Guide](./TOOL_CALLING_API_GUIDE.md) + [Getting Started](./GETTING_STARTED_TOOL_CALLING.md#enable-advanced-features) |
| **Approval Flows**       | [API Guide](./TOOL_CALLING_API_GUIDE.md#common-patterns)                                                                 |

---

## 🛠️ **Code Examples**

### Quick Copy-Paste Templates

#### Simple Read-Only Tool

```typescript
import { createReadOnlyTool, stringParam } from '@clarity/utils/tool-helpers'

const weatherTool = createReadOnlyTool({
  name: 'get_weather',
  description: 'Get current weather',
  parameters: {
    city: stringParam('City name'),
  },
  required: ['city'],
  execute: async ({ city }) => {
    const weather = await fetchWeather(city)
    return { temperature: weather.temp }
  },
})
```

#### Tool Requiring Approval

```typescript
import { createApprovalTool, stringParam } from '@clarity/utils/tool-helpers'

const deleteTool = createApprovalTool({
  name: 'delete_user',
  description: 'Delete a user (DESTRUCTIVE)',
  parameters: {
    userId: stringParam('User ID'),
  },
  required: ['userId'],
  execute: async ({ userId }, context) => {
    checkPermissions(context.userId, 'delete:users')
    await db.users.delete({ where: { id: userId } })
    return { deleted: true }
  },
})
```

#### API Integration Tool

```typescript
import { createAPITool, stringParam } from '@clarity/utils/tool-helpers'

const githubTool = createAPITool({
  name: 'github_search',
  description: 'Search GitHub repositories',
  parameters: {
    query: stringParam('Search query'),
  },
  required: ['query'],
  baseURL: 'https://api.github.com',
  endpoint: '/search/repositories',
  buildRequest: (args) => ({
    params: { q: args.query },
    headers: { Accept: 'application/vnd.github+json' },
  }),
  parseResponse: (data) => ({
    total: data.total_count,
    repositories: data.items.slice(0, 5),
  }),
})
```

#### ToolOrchestrator Setup

```typescript
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  tools: [weatherTool, deleteTool, githubTool],
  autoApprove: false, // NEVER true in production
  requireApproval: true,
})

// Subscribe to approval events
orchestrator.lifecycle.on('tool_pending_approval', (event) => {
  showApprovalDialog({
    toolName: event.call.toolName,
    args: event.call.args,
    onApprove: () => orchestrator.approveTool(event.call.id),
    onReject: () => orchestrator.rejectTool(event.call.id, 'User declined'),
  })
})

// Execute tool
const result = await orchestrator.executeTool('get_weather', { city: 'SF' })
```

More examples in [Getting Started Guide](./GETTING_STARTED_TOOL_CALLING.md#common-patterns)

---

## 🔍 **Quick Reference**

### Essential Imports

```typescript
// Tool definition
import type { ToolDefinition } from '@clarity/core/types/tool-definition'

// APIs
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'
import { createToolsEngine, executeTool } from '@clarity/app-api/tools-engine'
import { ToolExecutor } from '@clarity/core/tool-executor'

// Helpers
import {
  createReadOnlyTool,
  createApprovalTool,
  createAPITool,
  stringParam,
  numberParam,
  enumParam,
  requireString,
  requireNumber,
} from '@clarity/utils/tool-helpers'

// Types
import type { ToolsEngineCall } from '@clarity/app-api/tools-engine'
import type { ToolCallRecord } from '@clarity/core/tool-lifecycle'
import type { ToolInvocation } from '@clarity/types/tool-invocation'
```

### Common Patterns

| Pattern            | Guide                                                | Section         |
| ------------------ | ---------------------------------------------------- | --------------- |
| API Integration    | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md) | Pattern 1       |
| Database Query     | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md) | Pattern 2       |
| File System Access | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md) | Pattern 3       |
| Progress Tracking  | [Getting Started](./GETTING_STARTED_TOOL_CALLING.md) | Pattern 4       |
| Approval Flow      | [API Guide](./TOOL_CALLING_API_GUIDE.md)             | Common Patterns |
| Retry Logic        | [API Guide](./TOOL_CALLING_API_GUIDE.md)             | Common Patterns |
| Batch Execution    | [API Guide](./TOOL_CALLING_API_GUIDE.md)             | Common Patterns |

---

## 🚨 **Common Issues**

### "Tool not found"

**Solution**: Ensure tool is registered and name matches exactly **Guide**:
[Getting Started - Troubleshooting](./GETTING_STARTED_TOOL_CALLING.md#troubleshooting)

### "autoApprove cannot be enabled in production"

**Solution**: Set `autoApprove: false` in production **Guide**:
[Migration Guide - Breaking Changes](./MIGRATION_GUIDE_TOOL_CALLING.md#breaking-changes)

### "Which API should I use?"

**Solution**: Use the decision tree **Guide**:
[API Guide - Decision Tree](./TOOL_CALLING_API_GUIDE.md#quick-decision-tree)

### "Type confusion between ToolCall types"

**Solution**: Understand the 3 different types **Guide**: [Types Guide](./TOOL_CALL_TYPES_GUIDE.md)

More troubleshooting in [Getting Started Guide](./GETTING_STARTED_TOOL_CALLING.md#troubleshooting)

---

## ✅ **Production Checklist**

Before deploying to production:

- [ ] No `autoApprove: true` (enforced by runtime check)
- [ ] Approval flow implemented for sensitive tools
- [ ] Error handling in all tools
- [ ] Input validation for user data
- [ ] Rate limiting enabled (optional but recommended)
- [ ] Audit logging enabled (for compliance)
- [ ] Timeouts configured
- [ ] Secrets not exposed in results
- [ ] Security guide reviewed

Full checklist:
[Getting Started - Production Checklist](./GETTING_STARTED_TOOL_CALLING.md#production-checklist)

---

## 📊 **Features Overview**

### Security

- ✅ Production safeguards (autoApprove blocked)
- ✅ Rate limiting (configurable)
- ✅ Concurrency control
- ✅ Audit logging (with sensitive data redaction)
- ✅ Approval workflows
- ✅ Comprehensive security guide

### Performance

- ✅ LRU cache with automatic eviction
- ✅ Batch execution with deduplication
- ✅ Concurrency limiting
- ✅ Periodic cache cleanup
- ✅ Robust cache keys

### Developer Experience

- ✅ 5-minute quick start
- ✅ Tool templates (3 types)
- ✅ Input validation helpers (6 helpers)
- ✅ Schema builders (6 builders)
- ✅ Error handling utilities
- ✅ TypeScript support
- ✅ 3,600+ lines of documentation

---

## 🤝 **Contributing**

Found an issue or have a suggestion? Please file an issue on GitHub.

---

## 📝 **Document Versions**

| Document        | Last Updated | Version |
| --------------- | ------------ | ------- |
| Getting Started | 2026-01-22   | 1.0     |
| API Guide       | 2026-01-22   | 1.0     |
| Security Guide  | 2026-01-22   | 1.0     |
| Types Guide     | 2026-01-22   | 1.0     |
| Migration Guide | 2026-01-22   | 1.0     |

---

## 🎓 **Learning Path**

### Day 1: Getting Started

1. Read [Getting Started Guide](./GETTING_STARTED_TOOL_CALLING.md)
2. Build your first tool (5-minute quick start)
3. Try the common patterns

### Day 2: Understanding the System

1. Read [API Guide](./TOOL_CALLING_API_GUIDE.md)
2. Understand which API to use
3. Review common patterns and examples

### Day 3: Security & Production

1. Read [Security Guide](./TOOL_SECURITY_GUIDE.md)
2. Review threat model and attack vectors
3. Complete production checklist

### Day 4: Advanced Topics

1. Read [Types Guide](./TOOL_CALL_TYPES_GUIDE.md)
2. Understand type conversions
3. Enable advanced features (rate limiting, audit logging)

### Week 2: Production Deployment

1. Review all security checklists
2. Enable audit logging
3. Implement approval workflows
4. Deploy to production

---

**Ready to start?** Begin with the [Getting Started Guide](./GETTING_STARTED_TOOL_CALLING.md) 🚀

**Questions?** Check the
[Troubleshooting section](./GETTING_STARTED_TOOL_CALLING.md#troubleshooting) or file an issue on
GitHub.

**Building for production?** Review the [Security Guide](./TOOL_SECURITY_GUIDE.md) and
[Production Checklist](./GETTING_STARTED_TOOL_CALLING.md#production-checklist).
