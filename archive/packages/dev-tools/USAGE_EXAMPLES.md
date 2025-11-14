# Usage Examples

Complete examples for using React 19 enhanced developer tools.

## Basic Usage

### API Inspector

```tsx
import { useAPIInspector } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { logs, stats, startCall, completeCall } = useAPIInspector()

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({}),
      })

      completeCall(callId, {
        status: response.status,
        statusText: response.statusText,
        headers: {},
        body: await response.json(),
      })
    } catch (error) {
      recordError(callId, error as Error)
    }
  }

  return (
    <div>
      <button onClick={handleAPICall}>Make API Call</button>
      <div>Total Calls: {stats.totalCalls}</div>
      <div>Average Response: {stats.averageResponseTime.toFixed(2)}ms</div>
    </div>
  )
}
```

### Performance Profiler

```tsx
import { useProfiler } from '@clarity-chat/dev-tools/react'

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
      <div>Average Duration: {summary.avgDuration.toFixed(2)}ms</div>
    </div>
  )
}
```

### Validation

```tsx
import { useEnvValidation } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { validate, isValid, errors, warnings, isPending } = useEnvValidation()

  return (
    <div>
      <button onClick={validate} disabled={isPending}>
        {isPending ? 'Validating...' : 'Validate Environment'}
      </button>
      
      {isValid && <p>✅ All validations passed</p>}
      
      {errors.length > 0 && (
        <div>
          <h4>Errors:</h4>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error.field}: {error.message}</li>
            ))}
          </ul>
        </div>
      )}
      
      {warnings.length > 0 && (
        <div>
          <h4>Warnings:</h4>
          <ul>
            {warnings.map((warning, i) => (
              <li key={i}>{warning.field}: {warning.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Time-Travel Debugging

```tsx
import { useTimeTravel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { snapshots, current, record, goBack, goForward } = useTimeTravel()
  const [messages, setMessages] = useState([])

  const handleStateChange = (newMessages) => {
    setMessages(newMessages)
    record(newMessages, { model: 'gpt-4-turbo' }, {}, 'State Change')
  }

  return (
    <div>
      <button onClick={() => goBack(1)}>Back</button>
      <button onClick={() => goForward(1)}>Forward</button>
      <div>Current Snapshot: {current?.label}</div>
      <div>Total Snapshots: {snapshots.length}</div>
    </div>
  )
}
```

## Using Components

### API Inspector Panel

```tsx
import { APIInspectorPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <APIInspectorPanel maxLogs={100} />
}
```

### Profiler Panel

```tsx
import { ProfilerPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <ProfilerPanel />
}
```

### Validation Form

```tsx
import { ValidationForm } from '@clarity-chat/dev-tools/react'

function App() {
  return <ValidationForm type="env" />
}
```

### Time-Travel Panel

```tsx
import { TimeTravelPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <TimeTravelPanel />
}
```

### Complete Dashboard

```tsx
import { DevToolsDashboard } from '@clarity-chat/dev-tools/react'

function App() {
  return <DevToolsDashboard defaultTab="inspector" />
}
```

## Advanced Usage

### Combining Multiple Tools

```tsx
import {
  useAPIInspector,
  useProfiler,
  useTimeTravel,
} from '@clarity-chat/dev-tools/react'

function AdvancedComponent() {
  const { startCall, completeCall } = useAPIInspector()
  const { profile } = useProfiler()
  const { record } = useTimeTravel()

  const handleComplexOperation = async () => {
    // Record initial state
    record(initialMessages, config, {}, 'Before Operation')

    // Start API call tracking
    const callId = startCall({ /* ... */ })

    // Profile the operation
    const { result, metrics } = await profile('complex-operation', async () => {
      // Make API call
      const response = await fetch(/* ... */)
      return response.json()
    })

    // Complete API call
    completeCall(callId, { /* ... */ })

    // Record final state
    record(finalMessages, config, {}, 'After Operation')
  }

  return <button onClick={handleComplexOperation}>Run Operation</button>
}
```

### Custom Styling

All components accept a `className` prop for custom styling:

```tsx
import { APIInspectorPanel } from '@clarity-chat/dev-tools/react'
import './custom-styles.css'

function App() {
  return <APIInspectorPanel className="my-custom-inspector" />
}
```

## Integration with Existing Code

The React components work alongside existing TypeScript utilities:

```tsx
import { getAPIInspector } from '@clarity-chat/dev-tools'
import { useAPIInspector } from '@clarity-chat/dev-tools/react'

function HybridComponent() {
  const { logs } = useAPIInspector() // React hook
  const inspector = getAPIInspector() // TypeScript utility
  
  // Both work together!
  const allLogs = inspector.getLogs()
  
  return <div>{logs.length} logs from hook, {allLogs.length} from utility</div>
}
```

## Best Practices

1. **Enable tools early**: Enable API inspector and profiler at app startup
2. **Use optimistic updates**: Leverage `useOptimistic` for instant UI feedback
3. **Record state changes**: Use time-travel debugging to track state changes
4. **Validate configuration**: Validate environment and config at startup
5. **Monitor performance**: Use profiler to identify bottlenecks

## See Also

- [REACT_19_MIGRATION.md](./REACT_19_MIGRATION.md) - Migration guide
- [README.md](./README.md) - Complete documentation
- Storybook stories for interactive examples
