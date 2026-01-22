# Getting Started with Tool Calling

**Quick start guide for implementing tool calling in your application**

---

## Table of Contents

1. [Installation](#installation)
2. [5-Minute Quick Start](#5-minute-quick-start)
3. [Core Concepts](#core-concepts)
4. [Your First Tool](#your-first-tool)
5. [Common Patterns](#common-patterns)
6. [Next Steps](#next-steps)

---

## Installation

Tool calling is built into the Clarity Chat SDK. No additional installation required!

```bash
npm install @clarity/react
# or
yarn add @clarity/react
```

---

## 5-Minute Quick Start

Get up and running with tool calling in 5 minutes:

### Step 1: Define Your Tool

```typescript
import type { ToolDefinition } from '@clarity/core/types/tool-definition'

const weatherTool: ToolDefinition = {
  name: 'get_weather',
  description: 'Get current weather for a city',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'City name (e.g., "San Francisco")',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units',
        default: 'celsius',
      },
    },
    required: ['city'],
  },
  execute: async (args) => {
    // Your implementation here
    const response = await fetch(
      `https://api.weather.com/v1/weather?city=${args.city}&units=${args.units}`
    )
    const data = await response.json()

    return {
      temperature: data.temp,
      condition: data.condition,
      city: args.city,
    }
  },
}
```

### Step 2: Register and Use

```typescript
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

// Create orchestrator with your tools
const orchestrator = new ToolOrchestrator({
  tools: [weatherTool],
  autoApprove: false, // Require approval in production
})

// Execute a tool
const result = await orchestrator.executeTool('get_weather', {
  city: 'San Francisco',
  units: 'celsius',
})

console.log(result.result) // { temperature: 72, condition: 'sunny', city: 'San Francisco' }
```

### Step 3: Add Approval Flow (Production)

```typescript
// Subscribe to approval events
orchestrator.lifecycle.on('tool_pending_approval', (event) => {
  // Show approval UI to user
  showApprovalDialog({
    toolName: event.call.toolName,
    args: event.call.args,
    onApprove: () => orchestrator.approveTool(event.call.id),
    onReject: () => orchestrator.rejectTool(event.call.id, 'User declined'),
  })
})

// Now tools require approval
const orchestrator = new ToolOrchestrator({
  tools: [weatherTool],
  requireApproval: true, // ✅ Safe for production
})
```

**That's it!** You now have a working tool calling system. 🎉

---

## Core Concepts

### What is Tool Calling?

Tool calling allows AI models to **call functions** in your code based on natural language
conversations.

**Example conversation**:

```
User: "What's the weather in Paris?"
AI: [Calls get_weather tool with { city: 'Paris' }]
System: [Executes tool, returns weather data]
AI: "It's currently 18°C and sunny in Paris!"
```

### Key Components

1. **ToolDefinition**: Describes what a tool does and how to call it
2. **ToolOrchestrator**: Manages tool lifecycle (validation, execution, events)
3. **Tool Execution**: Runs your function with validated arguments
4. **Lifecycle Events**: Track tool execution (requested, approved, executing, completed)

---

## Your First Tool

Let's build a calculator tool step by step.

### 1. Import Types

```typescript
import type { ToolDefinition } from '@clarity/core/types/tool-definition'
```

### 2. Define the Tool

```typescript
const calculatorTool: ToolDefinition = {
  // Unique identifier
  name: 'calculator',

  // Clear description for the AI model
  description: 'Perform mathematical calculations. Supports +, -, *, /, and parentheses.',

  // JSON Schema for parameters
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate (e.g., "2 + 2" or "(10 * 5) / 2")',
      },
    },
    required: ['expression'],
  },

  // Implementation
  execute: async (args, context) => {
    // Validate input
    if (typeof args.expression !== 'string') {
      throw new Error('Expression must be a string')
    }

    // Safe evaluation (never use eval()!)
    const result = safeEvaluate(args.expression)

    return {
      expression: args.expression,
      result,
      timestamp: Date.now(),
    }
  },

  // Optional: metadata
  requiresApproval: false, // Simple read-only operation
  cacheable: true, // Cache results for same expression
  timeout: 5000, // Max 5 seconds
}
```

### 3. Test Your Tool

```typescript
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  tools: [calculatorTool],
  autoApprove: true, // Only for testing!
})

// Test it
const result = await orchestrator.executeTool('calculator', {
  expression: '(10 + 5) * 2',
})

console.log(result.result) // { expression: '(10 + 5) * 2', result: 30, timestamp: ... }
```

### 4. Handle Errors

```typescript
const calculatorTool: ToolDefinition = {
  // ... (same as above)

  execute: async (args, context) => {
    try {
      const result = safeEvaluate(args.expression)

      return {
        expression: args.expression,
        result,
        timestamp: Date.now(),
      }
    } catch (error) {
      // Return user-friendly error
      throw new Error(
        `Failed to evaluate "${args.expression}": ${error.message}. ` +
          `Please check the expression and try again.`
      )
    }
  },
}
```

---

## Common Patterns

### Pattern 1: API Integration

```typescript
const githubTool: ToolDefinition = {
  name: 'github_search',
  description: 'Search GitHub repositories',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      language: { type: 'string', description: 'Filter by language (optional)' },
    },
    required: ['query'],
  },
  execute: async (args) => {
    const url = new URL('https://api.github.com/search/repositories')
    url.searchParams.set('q', args.query)
    if (args.language) {
      url.searchParams.append('q', `language:${args.language}`)
    }

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/vnd.github+json' },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      total: data.total_count,
      repositories: data.items.slice(0, 5).map((repo: any) => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url,
      })),
    }
  },
  requiresApproval: false, // Public read-only API
  cacheable: true, // Cache search results
  timeout: 10000, // 10 second timeout
}
```

### Pattern 2: Database Query

```typescript
const databaseTool: ToolDefinition = {
  name: 'query_users',
  description: 'Search users in the database',
  parameters: {
    type: 'object',
    properties: {
      email: { type: 'string', description: 'User email to search' },
      limit: { type: 'number', description: 'Max results', default: 10 },
    },
    required: ['email'],
  },
  execute: async (args, context) => {
    // Check authorization
    if (!context.userId) {
      throw new Error('Authentication required')
    }

    // Check permissions
    const hasPermission = await checkPermission(context.userId, 'read:users')
    if (!hasPermission) {
      throw new Error('Insufficient permissions to query users')
    }

    // Execute query
    const users = await db.users.findMany({
      where: { email: { contains: args.email } },
      take: args.limit,
      select: { id: true, email: true, name: true }, // Don't expose passwords!
    })

    return { users, total: users.length }
  },
  requiresApproval: true, // Sensitive operation!
  cacheable: false, // Don't cache user data
  timeout: 5000,
}
```

### Pattern 3: File System Access

```typescript
const readFileTool: ToolDefinition = {
  name: 'read_file',
  description: 'Read contents of a file',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'File path to read' },
    },
    required: ['path'],
  },
  execute: async (args, context) => {
    // Validate path (prevent directory traversal)
    const safePath = path.normalize(args.path)
    if (safePath.includes('..')) {
      throw new Error('Invalid path: directory traversal not allowed')
    }

    // Check if file exists
    if (!fs.existsSync(safePath)) {
      throw new Error(`File not found: ${safePath}`)
    }

    // Read file
    const content = await fs.promises.readFile(safePath, 'utf-8')

    return {
      path: safePath,
      content,
      size: content.length,
      lines: content.split('\n').length,
    }
  },
  requiresApproval: true, // Sensitive operation!
  cacheable: true,
  timeout: 5000,
}
```

### Pattern 4: Progress Tracking (Long-Running)

```typescript
const exportTool: ToolDefinition = {
  name: 'export_data',
  description: 'Export data to CSV',
  parameters: {
    type: 'object',
    properties: {
      format: { type: 'string', enum: ['csv', 'json'], default: 'csv' },
    },
  },
  execute: async (args, context) => {
    const total = 10000
    let processed = 0

    // Report progress
    const updateProgress = () => {
      context.updateProgress?.(Math.floor((processed / total) * 100))
    }

    const results = []
    for (let i = 0; i < total; i += 100) {
      const batch = await fetchDataBatch(i, 100)
      results.push(...batch)
      processed += batch.length
      updateProgress()
    }

    const exported =
      args.format === 'csv' ? convertToCSV(results) : JSON.stringify(results, null, 2)

    return {
      format: args.format,
      recordCount: results.length,
      data: exported,
    }
  },
  requiresApproval: true,
  cacheable: false,
  timeout: 60000, // 1 minute for large export
}
```

---

## Next Steps

### 1. Production Checklist

Before deploying to production, ensure:

- [ ] **No `autoApprove: true`** (blocked by runtime check)
- [ ] **Approval flow implemented** for sensitive tools
- [ ] **Error handling** in all tools
- [ ] **Input validation** for user-provided data
- [ ] **Rate limiting enabled** (see ToolExecutor config)
- [ ] **Audit logging enabled** (for compliance)
- [ ] **Timeout configured** for all tools
- [ ] **Secrets not exposed** in tool results

### 2. Read the Guides

- **[Tool Calling API Guide](./TOOL_CALLING_API_GUIDE.md)**: Which API to use (ToolOrchestrator vs
  ToolsEngine vs ToolExecutor)
- **[Tool Security Guide](./TOOL_SECURITY_GUIDE.md)**: Security best practices and threat model
- **[Tool Call Types Guide](./TOOL_CALL_TYPES_GUIDE.md)**: Understanding the three tool call types
- **[Migration Guide](./MIGRATION_GUIDE_TOOL_CALLING.md)**: Migrating from legacy patterns

### 3. Enable Advanced Features

#### Rate Limiting

```typescript
import { ToolExecutor } from '@clarity/core/tool-executor'

const executor = new ToolExecutor(lifecycle, {
  enableRateLimit: true,
  maxRequestsPerWindow: 100, // 100 requests
  rateLimitWindowMs: 60000, // per minute
})
```

#### Audit Logging

```typescript
import { ToolLifecycleManager } from '@clarity/core/tool-lifecycle'

const lifecycle = new ToolLifecycleManager({
  auditLog: {
    enabled: true,
    maxEntries: 10000,
    includeSensitiveData: false, // Redact passwords, tokens, etc.
  },
})

// Export logs for compliance
const logs = lifecycle.exportAuditLogs({
  toolName: 'sensitive_operation',
  startTime: Date.now() - 86400000, // Last 24 hours
})
```

#### Caching with LRU

```typescript
const executor = new ToolExecutor(lifecycle, {
  cache: {
    maxSize: 1000, // Max 1000 entries
    enablePeriodicCleanup: true, // Auto-cleanup
    cleanupIntervalMs: 60000, // Every minute
  },
})
```

### 4. Join the Community

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Comprehensive guides available
- **Examples**: Check `examples/` directory for more patterns

---

## Quick Reference

### Tool Definition Template

```typescript
import type { ToolDefinition } from '@clarity/core/types/tool-definition'

const myTool: ToolDefinition = {
  name: 'my_tool',
  description: 'Clear description for AI model',
  parameters: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Description' },
    },
    required: ['param1'],
  },
  execute: async (args, context) => {
    // Validate inputs
    // Check permissions
    // Execute operation
    // Return results
    return { success: true }
  },
  requiresApproval: true, // For sensitive operations
  cacheable: false, // Whether to cache results
  timeout: 5000, // Max execution time (ms)
}
```

### ToolOrchestrator Template

```typescript
import { ToolOrchestrator } from '@clarity/core/tool-orchestrator'

const orchestrator = new ToolOrchestrator({
  tools: [tool1, tool2],
  autoApprove: false, // NEVER true in production
  requireApproval: true, // Require approval by default
  timeout: 30000, // Global timeout
})

// Subscribe to events
orchestrator.lifecycle.on('tool_pending_approval', (event) => {
  // Show approval UI
})

orchestrator.lifecycle.on('tool_completed', (event) => {
  // Handle success
})

// Execute tool
const result = await orchestrator.executeTool('tool_name', { param: 'value' })
```

---

## Troubleshooting

### Common Issues

**Issue**: Tool not found

```
Error: Tool not found: my_tool
```

**Solution**: Ensure tool is registered and name matches exactly.

**Issue**: Validation error

```
Error: Parameter validation failed: param1 is required
```

**Solution**: Check parameters match the JSON schema.

**Issue**: Timeout

```
Error: Tool execution timed out after 5000ms
```

**Solution**: Increase timeout or optimize tool execution.

**Issue**: autoApprove blocked in production

```
Error: autoApprove cannot be enabled in production
```

**Solution**: Set `autoApprove: false` and implement approval flow.

---

## Examples

See the `examples/` directory for complete working examples:

- **Basic Calculator**: Simple arithmetic tool
- **Weather API**: Fetching external API data
- **Database Query**: Safe database access with permissions
- **File System**: Reading files with path validation
- **Batch Processing**: Processing multiple items with progress
- **Approval Flow**: Complete approval UI implementation

---

**Ready to build?** Start with the [5-Minute Quick Start](#5-minute-quick-start) and refer to the
[guides](./TOOL_CALLING_API_GUIDE.md) as needed.

**Questions?** Check the [troubleshooting section](#troubleshooting) or file an issue on GitHub.

Happy coding! 🚀
