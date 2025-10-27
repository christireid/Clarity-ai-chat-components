# @clarity-chat/dev-tools

Comprehensive developer tools for debugging, testing, validation, and performance profiling of AI chat applications.

## Features

- 🔍 **API Inspector** - Deep inspection of AI provider API calls with timing and token tracking
- 📝 **Enhanced Logger** - Multi-level logging with colors, timestamps, and structured context
- 🧪 **Mock Providers** - Fake AI providers for testing without API calls
- ✅ **Test Helpers** - Utilities for assertions, validation, and test suites
- 🔐 **Config Validator** - Validate environment variables, API keys, and configurations
- ⚡ **Performance Profiler** - Track latency, throughput, memory usage, and streaming performance

## Installation

```bash
npm install @clarity-chat/dev-tools
```

## Quick Start

```typescript
import {
  getAPIInspector,
  createLogger,
  createMockProviders,
  validateEnv,
  getProfiler
} from '@clarity-chat/dev-tools'

// Inspect API calls
const inspector = getAPIInspector()
inspector.setEnabled(true)
inspector.setVerbose(true)

// Create structured logger
const logger = createLogger({ level: 'debug', prefix: '[MyApp]' })
logger.info('Application started', { version: '1.0.0' })

// Use mock providers for testing
const { openai } = createMockProviders()
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }]
})

// Validate configuration
const validation = validateEnv()
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors)
}

// Profile performance
const profiler = getProfiler()
profiler.start('chat-completion')
// ... your code ...
profiler.end('chat-completion')
profiler.printReport()
```

## API Inspector

Track and debug AI provider API calls with detailed logging and metrics.

### Basic Usage

```typescript
import { getAPIInspector } from '@clarity-chat/dev-tools'

const inspector = getAPIInspector()
inspector.setEnabled(true)
inspector.setVerbose(true)

// Start tracking a call
const callId = inspector.startCall({
  provider: 'openai',
  model: 'gpt-4-turbo',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: { messages: [{ role: 'user', content: 'Hello!' }] }
})

// Record first byte (for streaming)
inspector.recordFirstByte(callId)

// Record streaming chunks
inspector.recordChunk(callId, 'Hello', 1)
inspector.recordChunk(callId, ' world', 1)

// Complete the call
inspector.completeCall(callId, {
  status: 200,
  statusText: 'OK',
  headers: {},
  body: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } }
})

// Get metrics
const stats = inspector.getAverageResponseTime('openai')
const usage = inspector.getTotalUsage()
console.log(`Average response time: ${stats}ms`)
console.log(`Total tokens used: ${usage.totalTokens}`)
```

### Features

- Automatic header and body sanitization (removes API keys)
- Streaming chunk tracking
- Token usage and cost tracking
- Performance metrics (TTFB, duration)
- Error tracking
- Export logs to JSON

## Enhanced Logger

Structured logging with multiple levels, colors, and context.

### Basic Usage

```typescript
import { createLogger } from '@clarity-chat/dev-tools'

const logger = createLogger({
  level: 'debug',
  prefix: '[MyApp]',
  colors: true,
  timestamps: true,
  context: { app: 'clarity-chat', version: '1.0.0' }
})

logger.trace('Detailed debug info')
logger.debug('Debug message', { userId: '123' })
logger.info('Info message', { event: 'user-login' })
logger.warn('Warning message')
logger.error('Error occurred', new Error('Something went wrong'))

// Performance timing
logger.time('database-query')
// ... perform query ...
logger.timeEnd('database-query', 'info')

// Grouped logging
logger.group('User Authentication', () => {
  logger.info('Checking credentials')
  logger.info('Validating token')
  logger.info('Loading user profile')
})

// Child logger with additional context
const childLogger = logger.child({ userId: '123', sessionId: 'abc' })
childLogger.info('User action') // Includes userId and sessionId in context
```

### Features

- 5 log levels: trace, debug, info, warn, error
- Colored terminal output with icons
- Timestamps
- Structured context
- Performance timing
- Grouped logging
- Child loggers with inherited context
- Export logs to JSON

## Mock Providers

Fake AI provider implementations for testing without making real API calls.

### Basic Usage

```typescript
import { createMockProviders, mockScenarios } from '@clarity-chat/dev-tools'

// Create mock providers
const { openai, anthropic, google } = createMockProviders(mockScenarios.success)

// Use like real providers
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }]
})

console.log(response.choices[0].message.content) // "This is a successful mock response"

// Test streaming
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
})

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content
  if (content) process.stdout.write(content)
}
```

### Predefined Scenarios

```typescript
import { createMockProviders, mockScenarios } from '@clarity-chat/dev-tools'

// Success scenario
const providers1 = createMockProviders(mockScenarios.success)

// Multi-turn conversation
const providers2 = createMockProviders(mockScenarios.multiTurn)

// Streaming with delays
const providers3 = createMockProviders(mockScenarios.streaming)

// Rate limit error
const providers4 = createMockProviders(mockScenarios.rateLimitError)

// Authentication error
const providers5 = createMockProviders(mockScenarios.authError)

// Network error
const providers6 = createMockProviders(mockScenarios.networkError)

// Slow response
const providers7 = createMockProviders(mockScenarios.slowResponse)
```

### Custom Scenarios

```typescript
import { createMockProviders } from '@clarity-chat/dev-tools'

const providers = createMockProviders({
  responses: [
    {
      content: 'Custom response 1',
      model: 'gpt-4-turbo',
      usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 }
    },
    {
      content: 'Custom response 2',
      model: 'gpt-4-turbo',
      usage: { promptTokens: 8, completionTokens: 15, totalTokens: 23 }
    }
  ],
  delay: 100 // Simulate 100ms delay
})
```

## Test Helpers

Utilities for assertions, validation, and test suites.

### Assertions

```typescript
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertThrows,
  assertMatches,
  assertIncludes
} from '@clarity-chat/dev-tools'

assert(true, 'Value should be truthy')
assertEqual(result, 'expected', 'Values should match')
assertDeepEqual(obj1, obj2, 'Objects should be equal')

await assertThrows(
  async () => { throw new Error('Test error') },
  Error,
  'Should throw error'
)

assertMatches('Hello World', /^Hello/, 'Should start with Hello')
assertIncludes([1, 2, 3], 2, 'Array should include 2')
```

### Response Validation

```typescript
import { validateChatResponse, validateStreamChunk } from '@clarity-chat/dev-tools'

const response = await openai.chat.completions.create({ /* ... */ })
const validation = validateChatResponse(response)

if (!validation.valid) {
  console.error('Invalid response:', validation.errors)
}
```

### Streaming Helpers

```typescript
import { collectStream } from '@clarity-chat/dev-tools'

const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
})

const { content, chunks, duration } = await collectStream(
  stream,
  chunk => chunk.choices[0]?.delta?.content || null
)

console.log(`Received ${chunks.length} chunks in ${duration}ms`)
console.log(`Content: ${content}`)
```

### Test Suites

```typescript
import { createTestSuite } from '@clarity-chat/dev-tools'

const suite = createTestSuite('Chat API Tests')

suite
  .beforeAll(() => {
    console.log('Setting up tests...')
  })
  .beforeEach(() => {
    console.log('Running test...')
  })
  .test('should complete chat', async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: 'Hello!' }]
    })
    
    assert(response.choices[0].message.content)
  })
  .test('should handle streaming', async () => {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true
    })
    
    const { chunks } = await collectStream(stream)
    assert(chunks.length > 0)
  })
  .afterEach(() => {
    console.log('Test completed')
  })
  .afterAll(() => {
    console.log('All tests completed')
  })

const results = await suite.run()
console.log(`${results.passed} passed, ${results.failed} failed`)
```

## Configuration Validation

Validate environment variables, API keys, and configurations.

### Environment Validation

```typescript
import { validateEnv, printValidationResults } from '@clarity-chat/dev-tools'

const validation = validateEnv()

if (!validation.valid) {
  printValidationResults(validation, 'Environment Configuration')
  process.exit(1)
}
```

### API Key Validation

```typescript
import { validateAPIKey } from '@clarity-chat/dev-tools'

const validation = validateAPIKey('openai', process.env.OPENAI_API_KEY)

if (!validation.valid) {
  console.error('Invalid API key:', validation.errors)
}
```

### Chat Configuration Validation

```typescript
import { validateChatConfig } from '@clarity-chat/dev-tools'

const validation = validateChatConfig({
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1000
})

if (!validation.valid) {
  console.error('Invalid configuration:', validation.errors)
}
```

### Message Validation

```typescript
import { validateMessages } from '@clarity-chat/dev-tools'

const validation = validateMessages([
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' }
])

if (!validation.valid) {
  console.error('Invalid messages:', validation.errors)
}
```

## Performance Profiler

Track latency, throughput, memory usage, and streaming performance.

### Basic Usage

```typescript
import { getProfiler } from '@clarity-chat/dev-tools'

const profiler = getProfiler()

// Manual profiling
profiler.start('chat-completion', { trackMemory: true })
const response = await openai.chat.completions.create({ /* ... */ })
profiler.end('chat-completion', {
  tokens: response.usage.total_tokens,
  cost: calculateCost(response.usage)
})

// Automatic profiling
const { result, metrics } = await profiler.profile(
  'chat-completion',
  async () => {
    return await openai.chat.completions.create({ /* ... */ })
  },
  { trackMemory: true }
)

console.log(`Operation took ${metrics.duration}ms`)
```

### Streaming Profiling

```typescript
import { getProfiler } from '@clarity-chat/dev-tools'

const profiler = getProfiler()

const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
})

const { chunks, metrics } = await profiler.profileStream(stream, {
  extractSize: chunk => chunk.choices[0]?.delta?.content?.length || 0
})

profiler.printStreamingMetrics(metrics)
// Output:
// Time to First Byte: 150.25ms
// Total Chunks: 45
// Total Bytes: 230
// Duration: 1250.50ms
// Throughput: 0.18 KB/s
// Chunk Timing:
//   Average: 27.79ms
//   Min: 15.20ms
//   Max: 85.40ms
```

### Performance Reports

```typescript
import { getProfiler } from '@clarity-chat/dev-tools'

const profiler = getProfiler()

// Run multiple operations...
profiler.start('operation1')
// ...
profiler.end('operation1')

profiler.start('operation2')
// ...
profiler.end('operation2')

// Print comprehensive report
profiler.printReport()
// Output:
// 📊 Performance Report
// ==================================================
// Total Operations: 2
// Total Duration: 350.75ms
// Average Duration: 175.38ms
//
// Slowest Operation: operation2
//   Duration: 200.50ms
//
// Fastest Operation: operation1
//   Duration: 150.25ms
//
// All Operations:
//   operation2: 200.50ms
//   operation1: 150.25ms

// Export to JSON
const json = profiler.export()
```

### Token Throughput

```typescript
import { calculateTokenThroughput, formatDuration } from '@clarity-chat/dev-tools'

const profiler = getProfiler()
const { result, metrics } = await profiler.profile('chat', async () => {
  return await openai.chat.completions.create({ /* ... */ })
})

const throughput = calculateTokenThroughput(
  result.usage.total_tokens,
  metrics.duration
)

console.log(`Throughput: ${throughput.tokensPerSecond.toFixed(2)} tokens/sec`)
console.log(`Duration: ${formatDuration(metrics.duration)}`)
```

## Complete Example

Here's a complete example using all dev-tools features:

```typescript
import {
  getAPIInspector,
  createLogger,
  createMockProviders,
  validateEnv,
  getProfiler,
  createTestSuite,
  collectStream
} from '@clarity-chat/dev-tools'

// 1. Validate environment
const validation = validateEnv()
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors)
  process.exit(1)
}

// 2. Set up logger
const logger = createLogger({
  level: 'debug',
  prefix: '[ChatApp]'
})

// 3. Enable API inspector
const inspector = getAPIInspector()
inspector.setEnabled(true)
inspector.setVerbose(true)

// 4. Get profiler
const profiler = getProfiler()

// 5. Create test suite
const suite = createTestSuite('Chat API Tests')

suite
  .test('should complete chat with real provider', async () => {
    logger.info('Testing chat completion')
    
    const callId = inspector.startCall({
      provider: 'openai',
      model: 'gpt-4-turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {},
      body: {}
    })

    const { result, metrics } = await profiler.profile('chat', async () => {
      // Your actual OpenAI call here
      return { content: 'Response', usage: { total_tokens: 30 } }
    })

    inspector.completeCall(callId, {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } }
    })

    logger.info('Chat completed', {
      duration: metrics.duration,
      tokens: result.usage.total_tokens
    })
  })
  .test('should handle streaming', async () => {
    const { openai } = createMockProviders()
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true
    })

    const { content, chunks, duration } = await collectStream(
      stream,
      chunk => chunk.choices[0]?.delta?.content || null
    )

    logger.info('Streaming completed', {
      chunks: chunks.length,
      duration,
      content
    })
  })

// 6. Run tests and print reports
const results = await suite.run()
profiler.printReport()
inspector.printLogs()

console.log(`\n✅ Tests: ${results.passed} passed, ${results.failed} failed`)
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  APICallLog,
  LogLevel,
  MockProviderOptions,
  ValidationResult,
  PerformanceMetrics,
  StreamingMetrics
} from '@clarity-chat/dev-tools'
```

## License

MIT
