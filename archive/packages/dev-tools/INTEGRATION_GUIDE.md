# Integration Guide - React 19 Dev Tools

Complete guide for integrating React 19 enhanced developer tools into your application.

## Quick Start

### Installation

```bash
npm install @clarity-chat/dev-tools
```

### Basic Setup

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  return (
    <div>
      <YourApp />
      <DevToolsDashboard />
    </div>
  )
}
```

## Individual Components

### API Inspector

Track and inspect API calls in real-time:

```tsx
import { useAPIInspector, APIInspectorPanel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { startCall, completeCall, logs, stats } = useAPIInspector()

  const handleAPICall = async () => {
    const callId = startCall({
      provider: 'openai',
      model: 'gpt-4-turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {},
      body: {},
    })

    try {
      const response = await fetch('...')
      completeCall(callId, {
        status: response.status,
        statusText: response.statusText,
        headers: {},
        body: await response.json(),
      })
    } catch (error) {
      recordError(callId, error)
    }
  }

  return (
    <div>
      <button onClick={handleAPICall}>Make Call</button>
      <APIInspectorPanel />
    </div>
  )
}
```

### Performance Profiler

Monitor performance metrics:

```tsx
import { useProfiler, ProfilerPanel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { profile, summary } = useProfiler()

  const handleOperation = async () => {
    const { result, metrics } = await profile('my-operation', async () => {
      // Your async operation
      await new Promise(resolve => setTimeout(resolve, 100))
      return 'result'
    })

    console.log(`Operation took ${metrics.duration}ms`)
  }

  return (
    <div>
      <button onClick={handleOperation}>Run Operation</button>
      <ProfilerPanel />
    </div>
  )
}
```

### Validation

Validate configuration and environment:

```tsx
import { ValidationForm, useEnvValidation } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { validate, isValid, errors, isPending } = useEnvValidation()

  return (
    <div>
      <button onClick={validate} disabled={isPending}>
        {isPending ? 'Validating...' : 'Validate'}
      </button>
      {isValid && <p>✅ All validations passed</p>}
      <ValidationForm type="env" />
    </div>
  )
}
```

### Time-Travel Debugging

Debug state changes with time-travel:

```tsx
import { useTimeTravel, TimeTravelPanel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { record, snapshots, current, goBack, goForward } = useTimeTravel()
  const [messages, setMessages] = useState([])

  const handleStateChange = (newMessages) => {
    setMessages(newMessages)
    record(newMessages, { model: 'gpt-4-turbo' }, {}, 'State Change')
  }

  return (
    <div>
      <button onClick={() => goBack(1)}>Back</button>
      <button onClick={() => goForward(1)}>Forward</button>
      <TimeTravelPanel />
    </div>
  )
}
```

### Model Comparison

Compare AI model responses:

```tsx
import { useModelComparison, ModelComparisonPanel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { addResponse, compare, getComparison } = useModelComparison()

  const handleCompare = async () => {
    // Add responses from different models
    addResponse('prompt-1', {
      model: 'gpt-4-turbo',
      provider: 'openai',
      content: 'Response from GPT-4',
      metadata: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
        latency: 500,
        cost: 0.0003,
      },
      timestamp: new Date(),
    })

    // Compare
    compare('prompt-1', 'Your prompt here')
  }

  return (
    <div>
      <button onClick={handleCompare}>Compare Models</button>
      <ModelComparisonPanel promptId="prompt-1" />
    </div>
  )
}
```

## Complete Dashboard

Use the comprehensive dashboard for all tools:

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  return (
    <DevToolsDashboard
      defaultTab="inspector"
      showInspector={true}
      showProfiler={true}
      showValidation={true}
      showTimeTravel={true}
      showModelComparison={true}
    />
  )
}
```

## React 19 Features

### useOptimistic

All hooks using `useOptimistic` provide instant UI feedback:

- **useAPIInspector** - Logs appear immediately
- **useProfiler** - Metrics update instantly
- **useTimeTravel** - Snapshots update immediately
- **useModelComparison** - Comparisons update instantly

### Client-Side State Management

Validation hooks use client-side state management:

- **useEnvValidation** - Async validation with loading states
- **useAPIKeyValidation** - API key validation
- **useChatConfigValidation** - Configuration validation

## Integration Patterns

### Development Only

Show dev tools only in development:

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <DevToolsDashboard />}
    </>
  )
}
```

### Conditional Rendering

Show specific tools based on conditions:

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  const showDevTools = useFeatureFlag('dev-tools')

  return (
    <DevToolsDashboard
      showInspector={showDevTools}
      showProfiler={showDevTools}
      showValidation={true}
      showTimeTravel={false}
      showModelComparison={showDevTools}
    />
  )
}
```

### Custom Styling

Apply custom styles to components:

```tsx
import { APIInspectorPanel } from '@clarity-chat/dev-tools/react'
import './custom-styles.css'

function App() {
  return <APIInspectorPanel className="my-custom-inspector" />
}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```tsx
import type {
  APICallLog,
  PerformanceMetrics,
  ModelResponse,
  ComparisonResult,
  StateSnapshot,
} from '@clarity-chat/dev-tools'
```

## Best Practices

1. **Enable Early**: Enable API inspector and profiler at app startup
2. **Use Optimistic Updates**: Leverage `useOptimistic` for instant UI feedback
3. **Record State Changes**: Use time-travel debugging to track important state changes
4. **Validate Configuration**: Validate environment and config at startup
5. **Monitor Performance**: Use profiler to identify bottlenecks
6. **Compare Models**: Use model comparison to choose the best model for your use case

## Examples

See the [examples directory](./examples/) for complete working examples:

- `react-19-demo.tsx` - Comprehensive demo of all features
- Storybook stories - Interactive component demos

## Migration from TypeScript Utilities

If you're already using the TypeScript utilities, you can gradually migrate:

```tsx
// Old way
import { getAPIInspector } from '@clarity-chat/dev-tools'
const inspector = getAPIInspector()

// New way (React 19)
import { useAPIInspector } from '@clarity-chat/dev-tools/react'
const { logs, stats } = useAPIInspector()

// Both work together!
const inspector = getAPIInspector()
const { logs } = useAPIInspector()
```

## Troubleshooting

### React 19 Required

Make sure you're using React 19:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

### Type Errors

Ensure TypeScript types are installed:

```bash
npm install --save-dev @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### Build Errors

Check that your `tsconfig.json` includes React support:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable"]
  }
}
```

## Support

For more information, see:
- [REACT_19_MIGRATION.md](./REACT_19_MIGRATION.md) - Migration guide
- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - Usage examples
- [README.md](./README.md) - Complete documentation
