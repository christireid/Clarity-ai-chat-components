# MCP Development Best Practices Research

## Model Context Protocol (MCP) Overview

Model Context Protocol is an open protocol developed by Anthropic that enables AI assistants to securely access external tools and data sources. MCP servers expose capabilities through three main interfaces:

1. **Tools** - Executable operations that agents can call
2. **Resources** - Read-only data/documentation that agents can access
3. **Prompts** - Templated prompts for common tasks

## Best Practices Identified

### 1. Error Handling & Validation

**Best Practices:**
- Always validate input parameters before processing
- Return structured error responses with clear messages
- Use proper HTTP-like error codes (400, 404, 500)
- Never expose internal errors to clients
- Log errors server-side for debugging
- Provide actionable error messages

**Pattern:**
```typescript
try {
  validateInput(args)
  const result = await processRequest(args)
  return { success: true, data: result }
} catch (error) {
  if (error instanceof ValidationError) {
    return { 
      success: false, 
      error: { code: 400, message: error.message } 
    }
  }
  // Log internal errors
  logger.error('Internal error', error)
  return { 
    success: false, 
    error: { code: 500, message: 'Internal server error' } 
  }
}
```

### 2. Type Safety

**Best Practices:**
- Use TypeScript strictly with proper types
- Define schemas for all inputs/outputs
- Use Zod or similar for runtime validation
- Export types for client usage
- Avoid `any` types

**Pattern:**
```typescript
import { z } from 'zod'

const ToolInputSchema = z.object({
  projectPath: z.string().min(1),
  provider: z.enum(['openai', 'anthropic', 'google'])
})

type ToolInput = z.infer<typeof ToolInputSchema>
```

### 3. Resource Management

**Best Practices:**
- Cache static resources (docs, examples)
- Use proper MIME types for resources
- Support content negotiation
- Implement resource versioning
- Handle large resources efficiently (streaming, pagination)

**Pattern:**
```typescript
const resourceCache = new Map<string, { content: string, mimeType: string }>()

async function getResource(uri: string): Promise<string> {
  if (resourceCache.has(uri)) {
    return resourceCache.get(uri)!.content
  }
  const content = await loadResource(uri)
  resourceCache.set(uri, { content, mimeType: 'text/markdown' })
  return content
}
```

### 4. Tool Design Patterns

**Best Practices:**
- Tools should be idempotent when possible
- Provide clear, descriptive tool names
- Include comprehensive descriptions
- Use enums for constrained values
- Validate all inputs
- Return structured, consistent responses
- Handle async operations properly
- Support cancellation/timeouts

**Pattern:**
```typescript
{
  name: 'tool_name',
  description: 'Clear, one-line description. Detailed explanation of what this tool does, when to use it, and what it returns.',
  inputSchema: {
    type: 'object',
    properties: {
      param: {
        type: 'string',
        description: 'Clear parameter description',
        enum: ['value1', 'value2'] // Use enums for constrained values
      }
    },
    required: ['param']
  }
}
```

### 5. Prompt Engineering

**Best Practices:**
- Prompts should be clear and structured
- Include context about the system
- Provide examples when helpful
- Use placeholders for dynamic content
- Keep prompts focused and actionable
- Version prompts for tracking

**Pattern:**
```typescript
function generatePrompt(args: PromptArgs): string {
  return `You are an expert in [domain].

Context:
${args.context}

Task:
${args.task}

Requirements:
${args.requirements}

Please provide:
1. [Specific output 1]
2. [Specific output 2]
3. [Specific output 3]`
}
```

### 6. Security Best Practices

**Best Practices:**
- Never expose sensitive data in responses
- Validate file paths to prevent directory traversal
- Sanitize user inputs
- Use environment variables for configuration
- Implement rate limiting
- Log security events
- Validate permissions before operations

**Pattern:**
```typescript
import path from 'path'

function validatePath(userPath: string, baseDir: string): string {
  const resolved = path.resolve(baseDir, userPath)
  if (!resolved.startsWith(path.resolve(baseDir))) {
    throw new Error('Invalid path: directory traversal detected')
  }
  return resolved
}
```

### 7. Performance Optimization

**Best Practices:**
- Cache frequently accessed data
- Use async/await properly
- Implement request batching when possible
- Lazy load heavy resources
- Use streaming for large responses
- Optimize JSON serialization

**Pattern:**
```typescript
// Cache with TTL
const cache = new Map<string, { data: any, expires: number }>()
const TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string): any | null {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  return null
}
```

### 8. Testing Strategies

**Best Practices:**
- Unit tests for each tool/resource/prompt handler
- Integration tests for full request/response cycle
- Mock external dependencies
- Test error cases
- Test edge cases
- Use test fixtures
- Test with MCP Inspector

**Pattern:**
```typescript
describe('Tool: init_project', () => {
  it('should validate required parameters', async () => {
    await expect(handleToolCall('init_project', {}))
      .rejects.toThrow('Missing required parameter: provider')
  })
  
  it('should create project structure', async () => {
    const result = await handleToolCall('init_project', {
      provider: 'openai',
      framework: 'nextjs',
      projectPath: '/tmp/test-project'
    })
    expect(result.success).toBe(true)
    expect(fs.existsSync('/tmp/test-project/package.json')).toBe(true)
  })
})
```

### 9. Logging & Observability

**Best Practices:**
- Use structured logging
- Log at appropriate levels (debug, info, warn, error)
- Include request IDs for tracing
- Log performance metrics
- Don't log sensitive data
- Use console.error for server logs (stdio transport)

**Pattern:**
```typescript
const logger = {
  debug: (msg: string, meta?: any) => console.error(JSON.stringify({ level: 'debug', msg, ...meta })),
  info: (msg: string, meta?: any) => console.error(JSON.stringify({ level: 'info', msg, ...meta })),
  error: (msg: string, error?: Error, meta?: any) => console.error(JSON.stringify({ level: 'error', msg, error: error?.message, ...meta }))
}
```

### 10. Code Organization

**Best Practices:**
- Separate tools, resources, and prompts into modules
- Use consistent naming conventions
- Export types and interfaces
- Document public APIs
- Keep handlers focused and single-purpose
- Use dependency injection for testability

**Pattern:**
```
src/
  index.ts              # Server setup and routing
  tools/
    index.ts           # Tool definitions and exports
    init-project.ts    # Individual tool implementations
    list-examples.ts
  resources/
    index.ts           # Resource definitions
    docs.ts            # Documentation resources
    models.ts          # Model data resources
  prompts/
    index.ts           # Prompt definitions
    implement-feature.ts
  types/
    index.ts           # Shared types
  utils/
    validation.ts      # Input validation utilities
    errors.ts          # Error handling utilities
    logger.ts          # Logging utilities
```

### 11. Response Formatting

**Best Practices:**
- Return consistent response structures
- Use proper MCP response formats
- Include metadata when helpful
- Format JSON responses with proper indentation
- Use appropriate MIME types

**Pattern:**
```typescript
// Tool response
return {
  content: [{
    type: 'text',
    text: JSON.stringify({
      success: true,
      data: result,
      metadata: { timestamp: Date.now() }
    }, null, 2)
  }]
}

// Resource response
return {
  contents: [{
    uri,
    mimeType: 'text/markdown',
    text: content
  }]
}
```

### 12. Versioning & Compatibility

**Best Practices:**
- Version your MCP server
- Maintain backward compatibility when possible
- Document breaking changes
- Use semantic versioning
- Support multiple API versions if needed

### 13. Documentation

**Best Practices:**
- Comprehensive README with examples
- Document all tools, resources, and prompts
- Include setup instructions
- Provide usage examples
- Document error codes and messages
- Keep documentation up-to-date

## Implementation Checklist

- [ ] Input validation for all tools
- [ ] Proper error handling with structured responses
- [ ] Type safety with TypeScript strict mode
- [ ] Resource caching for static content
- [ ] Security validation (path traversal, input sanitization)
- [ ] Comprehensive logging
- [ ] Unit tests for all handlers
- [ ] Integration tests
- [ ] Performance optimization (caching, lazy loading)
- [ ] Documentation updates
- [ ] Code organization improvements
- [ ] Consistent response formatting
