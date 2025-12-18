# @clarity-chat/dev-tools

> **Developer Tools** - Debugging, testing, validation, and performance profiling

Comprehensive developer tools for debugging, testing, validation, and performance profiling of AI
chat applications.

**Now with React 19 components and hooks!** 🎉

This package now includes React 19 components and hooks that leverage new React 19 features like
`useOptimistic` for optimistic UI updates and client-side form state management.

## ✨ Features

### Core Tools
- 🔍 **API Inspector** - Deep inspection of AI provider API calls with timing and token tracking
- 📝 **Enhanced Logger** - Multi-level logging with colors, timestamps, and structured context
- 🧪 **Mock Providers** - Fake AI providers for testing without API calls
- ✅ **Test Helpers** - Utilities for assertions, validation, and test suites
- 🔐 **Config Validator** - Validate environment variables, API keys, and configurations
- ⚡ **Performance Profiler** - Track latency, throughput, memory usage, and streaming performance

### New Enhanced Developer Tools 🆕
- 🖥️ **Enhanced Console** - Advanced debug console with filtering, search, tags, and multiple export formats
- ⚛️ **Component Monitor** - Track React component renders, performance, and get optimization recommendations
- 🎯 **Token Tracker** - Real-time AI token usage tracking with cost estimation and budget alerts
- 🔄 **State Diff** - Visual state change tracking with deep object comparison
- 🌐 **Network Timeline** - Network request waterfall visualization with HAR export
- 🛡️ **Error Tracker** - Error recovery monitoring with categorization and recommendations
- 🔔 **Dev Notifications** - Real-time developer feedback with toast-style notifications

## 📦 Installation

```bash
npm install @clarity-chat/dev-tools
# or
pnpm add @clarity-chat/dev-tools
# or
yarn add @clarity-chat/dev-tools
```

## 🚀 Quick Start

> 📖 **New to Clarity?** Check the
> [Getting Started Guide](../../docs/getting-started.md) or browse the
> [Cookbook](../../docs/cookbook/) for copy-paste ready patterns.

### TypeScript Utilities

```typescript
import {
  getAPIInspector,
  createLogger,
  createMockProviders,
  validateEnv,
  getProfiler,
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
  messages: [{ role: 'user', content: 'Hello!' }],
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
  body: { messages: [{ role: 'user', content: 'Hello!' }] },
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
  body: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
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
  context: { app: 'clarity-chat', version: '1.0.0' },
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
  messages: [{ role: 'user', content: 'Hello!' }],
})

console.log(response.choices[0].message.content) // "This is a successful mock response"

// Test streaming
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
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
      usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 },
    },
    {
      content: 'Custom response 2',
      model: 'gpt-4-turbo',
      usage: { promptTokens: 8, completionTokens: 15, totalTokens: 23 },
    },
  ],
  delay: 100, // Simulate 100ms delay
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
  assertIncludes,
} from '@clarity-chat/dev-tools'

assert(true, 'Value should be truthy')
assertEqual(result, 'expected', 'Values should match')
assertDeepEqual(obj1, obj2, 'Objects should be equal')

await assertThrows(
  async () => {
    throw new Error('Test error')
  },
  Error,
  'Should throw error'
)

assertMatches('Hello World', /^Hello/, 'Should start with Hello')
assertIncludes([1, 2, 3], 2, 'Array should include 2')
```

### Response Validation

```typescript
import { validateChatResponse, validateStreamChunk } from '@clarity-chat/dev-tools'

const response = await openai.chat.completions.create({
  /* ... */
})
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
  stream: true,
})

const { content, chunks, duration } = await collectStream(
  stream,
  (chunk) => chunk.choices[0]?.delta?.content || null
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
      messages: [{ role: 'user', content: 'Hello!' }],
    })

    assert(response.choices[0].message.content)
  })
  .test('should handle streaming', async () => {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true,
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
  maxTokens: 1000,
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
  { role: 'user', content: 'Hello!' },
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
const response = await openai.chat.completions.create({
  /* ... */
})
profiler.end('chat-completion', {
  tokens: response.usage.total_tokens,
  cost: calculateCost(response.usage),
})

// Automatic profiling
const { result, metrics } = await profiler.profile(
  'chat-completion',
  async () => {
    return await openai.chat.completions.create({
      /* ... */
    })
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
  stream: true,
})

const { chunks, metrics } = await profiler.profileStream(stream, {
  extractSize: (chunk) => chunk.choices[0]?.delta?.content?.length || 0,
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
  return await openai.chat.completions.create({
    /* ... */
  })
})

const throughput = calculateTokenThroughput(result.usage.total_tokens, metrics.duration)

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
  collectStream,
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
  prefix: '[ChatApp]',
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
      body: {},
    })

    const { result, metrics } = await profiler.profile('chat', async () => {
      // Your actual OpenAI call here
      return { content: 'Response', usage: { total_tokens: 30 } }
    })

    inspector.completeCall(callId, {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: { usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 } },
    })

    logger.info('Chat completed', {
      duration: metrics.duration,
      tokens: result.usage.total_tokens,
    })
  })
  .test('should handle streaming', async () => {
    const { openai } = createMockProviders()

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true,
    })

    const { content, chunks, duration } = await collectStream(
      stream,
      (chunk) => chunk.choices[0]?.delta?.content || null
    )

    logger.info('Streaming completed', {
      chunks: chunks.length,
      duration,
      content,
    })
  })

// 6. Run tests and print reports
const results = await suite.run()
profiler.printReport()
inspector.printLogs()

console.log(`\n✅ Tests: ${results.passed} passed, ${results.failed} failed`)
```

## New Enhanced Developer Tools

### Enhanced Console

Advanced debug console with filtering, search, context, and multiple export formats.

```typescript
import { getEnhancedConsole, createEnhancedConsole } from '@clarity-chat/dev-tools'

const console_ = getEnhancedConsole()

// Log at different levels
console_.trace('Detailed trace info')
console_.debug('Debug message')
console_.info('Info message')
console_.warn('Warning message')
console_.error('Error message')
console_.fatal('Critical error')

// Log with context
const authLogger = console_.withContext({ userId: '123', sessionId: 'abc' })
authLogger.info('User logged in')

// Log with tags for filtering
const apiLogger = console_.withTags('api', 'fetch')
apiLogger.info('API request made')

// Filter and search logs
const errors = console_.getEntries({ levels: ['error', 'fatal'] })
const apiLogs = console_.getEntries({ tags: ['api'] })
const searchResults = console_.getEntries({ search: 'login' })

// Export logs
const jsonExport = console_.export({ format: 'json', prettyPrint: true })
const csvExport = console_.export({ format: 'csv' })
const htmlExport = console_.export({ format: 'html' })

// Get statistics
const stats = console_.getStats()
console.log(`Error rate: ${(stats.errorRate * 100).toFixed(1)}%`)

// Replay logs for debugging
await console_.replay({ levels: ['error'] }, 100) // 100ms delay between entries
```

### Component Performance Monitor

Track React component renders and get performance recommendations.

```typescript
import { getComponentMonitor, createComponentMonitor } from '@clarity-chat/dev-tools'

const monitor = getComponentMonitor()

// Track component lifecycle
monitor.onMount('UserProfile', 'instance-1', { userId: '123' })
monitor.onRender('instance-1', 5.2, {
  phase: 'update',
  changedProps: ['avatar'],
  trigger: 'props'
})
monitor.onUnmount('instance-1')

// Get performance metrics
const metrics = monitor.getMetrics('instance-1')
console.log(`Render count: ${metrics.renderCount}`)
console.log(`Avg render time: ${metrics.avgRenderTime}ms`)
console.log(`Warnings: ${metrics.warnings.join(', ')}`)

// Get slowest components
const slowest = monitor.getSlowestComponents(5)

// Get recommendations
const recommendations = monitor.getRecommendations()
recommendations.forEach(rec => console.log(`💡 ${rec}`))

// Print formatted report
monitor.printReport()
```

### Token Usage Tracker

Real-time AI token usage tracking with cost estimation and budget alerts.

```typescript
import { getTokenTracker, createTokenTracker } from '@clarity-chat/dev-tools'

const tracker = createTokenTracker({
  budget: {
    dailyLimit: 10.00,
    monthlyLimit: 100.00,
    warningThreshold: 0.8, // Warn at 80%
    currency: 'USD'
  }
})

// Track token usage
tracker.track({
  provider: 'openai',
  model: 'gpt-4o-mini',
  usage: {
    promptTokens: 500,
    completionTokens: 200,
    totalTokens: 700,
  },
  conversationId: 'conv-123'
})

// Estimate cost before sending
const estimate = tracker.estimateCost('gpt-4o-mini', 1000, 500)
console.log(`Estimated cost: $${estimate.totalCost.toFixed(4)}`)

// Get usage statistics
const stats = tracker.getStats()
console.log(`Total cost: $${stats.totalCost.toFixed(4)}`)
console.log(`Avg tokens/request: ${stats.avgTokensPerRequest}`)

// Get optimization recommendations
const recommendations = tracker.getOptimizationRecommendations()

// Get daily usage trend
const dailyUsage = tracker.getDailyUsage(30) // Last 30 days

// Print formatted report
tracker.printReport()
```

### State Diff Visualizer

Visual state change tracking with deep object comparison.

```typescript
import { getStateDiff, createStateDiff, quickDiff } from '@clarity-chat/dev-tools'

const differ = createStateDiff()

// Quick diff two values
const diff = quickDiff(
  { user: { name: 'John', age: 30 } },
  { user: { name: 'John', age: 31 }, isActive: true }
)

console.log(`Added: ${diff.stats.added}`)     // 1 (isActive)
console.log(`Changed: ${diff.stats.changed}`) // 1 (age)

// Print formatted diff
differ.printDiff(diff)

// Track state changes over time
differ.snapshot({ count: 0 }, 'Initial')
differ.snapshot({ count: 1 }, 'After increment')
differ.snapshot({ count: 2, items: ['a'] }, 'Added item')

// View snapshot history
differ.printHistory()

// Get HTML diff for UI
const htmlDiff = differ.formatDiffHTML(diff)
```

### Network Request Timeline

Network request waterfall visualization with HAR export.

```typescript
import { getNetworkTimeline, createNetworkTimeline } from '@clarity-chat/dev-tools'

const timeline = createNetworkTimeline({ autoIntercept: true })

// Manually track requests
const tracker = timeline.startRequest({
  method: 'POST',
  url: 'https://api.openai.com/v1/chat/completions',
  requestHeaders: { 'Content-Type': 'application/json' },
  type: 'fetch',
  tags: ['ai', 'chat']
})

tracker.recordTTFB() // Call when first byte received

tracker.complete({
  status: 200,
  statusText: 'OK',
  responseHeaders: { 'content-type': 'application/json' },
  responseSize: 1024,
})

// Get statistics
const stats = timeline.getStats()
console.log(`Avg response time: ${stats.avgDuration}ms`)
console.log(`Avg TTFB: ${stats.avgTTFB}ms`)

// Generate ASCII waterfall chart
const waterfall = timeline.generateWaterfall()
console.log(waterfall)

// Export as HAR for browser dev tools
const har = timeline.exportHAR()

// Print formatted report
timeline.printReport()
```

### Error Recovery Tracker

Error recovery monitoring with categorization and recommendations.

```typescript
import { getErrorTracker, createErrorTracker } from '@clarity-chat/dev-tools'

const tracker = getErrorTracker()

// Track an error
const event = tracker.track({
  error: new Error('Network request failed'),
  component: 'ChatProvider',
  context: { userId: '123' }
})

// Track recovery attempt
tracker.trackRecovery(event.id, {
  strategy: 'retry',
  successful: true,
  duration: 150
})

// Mark as resolved
tracker.resolve(event.id)

// Get statistics
const stats = tracker.getStats()
console.log(`Recovery rate: ${(stats.recoveryRate * 100).toFixed(1)}%`)
console.log(`Active errors: ${stats.activeErrors}`)

// Get recommendations
const recommendations = tracker.getRecommendations()
recommendations.forEach(rec => console.log(`💡 ${rec}`))

// View error groups (similar errors grouped together)
const groups = tracker.getGroups()

// Print formatted report
tracker.printReport()
```

### Developer Notifications

Real-time developer feedback with toast-style notifications.

```typescript
import { getDevNotifications, devNotify } from '@clarity-chat/dev-tools'

const notifications = getDevNotifications()

// Quick notifications
devNotify.info('Build Started', 'Compiling TypeScript...')
devNotify.success('Build Complete', 'No errors found!')
devNotify.warning('Deprecation', 'useOldHook is deprecated')
devNotify.error('Build Failed', 'TypeScript error in index.ts')
devNotify.performance('Slow Render', 'ChatList took 250ms to render')
devNotify.build('HMR Update', 'Module updated successfully')

// Full notification API
notifications.notify({
  type: 'warning',
  title: 'High Memory Usage',
  message: 'Memory usage is at 85%',
  priority: 'high',
  duration: 10000, // 10 seconds, 0 = persistent
  actions: [
    { label: 'Clear Cache', handler: () => clearCache(), primary: true },
    { label: 'Dismiss', handler: () => {} }
  ]
})

// Subscribe to notifications
notifications.subscribe((notification) => {
  console.log(`[${notification.type}] ${notification.title}`)
})

// Filter by channel
const errors = notifications.getActive('errors')
const performance = notifications.getActive('performance')

// Dismiss notifications
notifications.dismiss(notificationId)
notifications.dismissAll()

// Print summary
notifications.printSummary()
```

## React Hooks for Enhanced Tools

```tsx
import {
  useComponentMonitor,
  useTokenTracker,
  useStateDiff,
  useErrorTracker,
  useDevNotifications,
} from '@clarity-chat/dev-tools'

// Component performance monitoring
function MyComponent() {
  const { metrics, renderCount, warnings } = useComponentMonitor({
    componentName: 'MyComponent',
    enabled: process.env.NODE_ENV === 'development'
  })

  return <div>Renders: {renderCount}</div>
}

// Token tracking
function ChatProvider() {
  const { stats, track, estimateCost } = useTokenTracker()

  const handleResponse = (response) => {
    track({
      provider: 'openai',
      model: 'gpt-4o-mini',
      usage: response.usage
    })
  }

  return <div>Total cost: ${stats.totalCost.toFixed(4)}</div>
}

// State diff tracking
function StateDebugger({ state }) {
  const { currentDiff, snapshots } = useStateDiff(state, {
    label: 'App State',
    autoTrack: true
  })

  return <div>Changes: {currentDiff?.stats.totalChanges ?? 0}</div>
}

// Error tracking
function ErrorBoundary({ children }) {
  const { track, activeErrors } = useErrorTracker({
    component: 'ErrorBoundary'
  })

  return <div>{children}</div>
}

// Developer notifications
function DevPanel() {
  const { info, success, error, active } = useDevNotifications()

  return (
    <button onClick={() => info('Test', 'Test notification')}>
      Notify ({active.length} active)
    </button>
  )
}
```

## React 19 Components and Hooks

### Components

```tsx
import {
  APIInspectorPanel,
  ProfilerPanel,
  ValidationForm,
  TimeTravelPanel,
  ModelComparisonPanel,
} from '@clarity-chat/dev-tools/react'

// API Inspector with real-time updates
<APIInspectorPanel maxLogs={100} />

// Performance profiler
<ProfilerPanel />

// Configuration validation
<ValidationForm type="env" />

// Time-travel debugging
<TimeTravelPanel />

// Model comparison
<ModelComparisonPanel promptId="prompt-1" />
```

### Hooks

```tsx
import {
  useAPIInspector,
  useProfiler,
  useEnvValidation,
  useAPIKeyValidation,
  useChatConfigValidation,
  useTimeTravel,
  useModelComparison,
} from '@clarity-chat/dev-tools/react'

// API Inspector hook with optimistic updates
const { logs, stats, startCall, completeCall } = useAPIInspector()

// Performance profiler hook
const { start, end, profile, summary } = useProfiler()

// Validation hooks
const { validate, isValid, errors, isPending } = useEnvValidation()
const { validate: validateAPIKey } = useAPIKeyValidation()
const { validate: validateConfig } = useChatConfigValidation()

// Time-travel debugging hook
const { snapshots, current, record, goBack, goForward } = useTimeTravel()

// Model comparison hook
const { addResponse, compare, getComparison, stats } = useModelComparison()
```

### React 19 Features Used

- **useOptimistic**: For optimistic UI updates in API inspector, profiler, time-travel, and model
  comparison
- **Client-Side Form State**: For form submission state in validation forms (useFormStatus requires
  Server Actions)
- **Real-time updates**: Components automatically update as data changes
- **Optimistic updates**: Instant UI feedback with automatic error handling

### React 19 Components (New!)

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  return <DevToolsDashboard />
}
```

See [QUICK_START.md](./QUICK_START.md) for a 5-minute quick start guide.

See [REACT_19_MIGRATION.md](./REACT_19_MIGRATION.md) for complete migration guide and examples.

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete integration guide.

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  APICallLog,
  LogLevel,
  MockProviderOptions,
  ValidationResult,
  PerformanceMetrics,
  StreamingMetrics,
} from '@clarity-chat/dev-tools'
```

## 📚 Documentation

- [Getting Started Guide](../../docs/getting-started.md)
- [Cookbook](../../docs/cookbook/) - Copy-paste ready patterns
- [Troubleshooting](../../docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Quick Start](./QUICK_START.md) - 5-minute quick start guide
- [React 19 Migration](./REACT_19_MIGRATION.md) - Complete migration guide
- [Integration Guide](./INTEGRATION_GUIDE.md) - Complete integration guide
- [API Reference](../../docs/api-reference.md) - Complete API documentation
- [Storybook](http://localhost:6006) - Interactive examples

## 🔧 Requirements

- Node.js 20.0.0 or higher
- For React components: React 19.0.0 or higher, React DOM 19.0.0 or higher

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](../../apps/docs/)
- [Examples](../../examples/)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)
