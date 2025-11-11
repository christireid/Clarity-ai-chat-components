# React 19 Migration Guide for Developer Tools

## Overview

The `@clarity-chat/dev-tools` package has been enhanced with React 19 components and hooks, leveraging new React 19 features for better performance and developer experience.

## What's New

### React 19 Features Used

1. **useOptimistic Hook**
   - Used in `useAPIInspector` and `useProfiler` for optimistic UI updates
   - Provides instant feedback while async operations complete
   - Automatically reverts if operations fail

2. **useFormStatus Hook**
   - Used in `ValidationForm` component for form submission state
   - Provides built-in pending state management
   - Better integration with form actions

3. **Client-Side Validation Hooks**
   - `useEnvValidation`, `useAPIKeyValidation`, `useChatConfigValidation`
   - Async state management with loading states
   - Error and warning handling

4. **Real-Time State Management**
   - Optimistic updates for API inspector logs
   - Real-time performance metrics updates
   - Time-travel debugging with state snapshots

## New Components

### APIInspectorPanel

A React component for displaying API call logs with real-time updates.

```tsx
import { APIInspectorPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <APIInspectorPanel maxLogs={100} />
}
```

### ProfilerPanel

A React component for displaying performance metrics.

```tsx
import { ProfilerPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <ProfilerPanel />
}
```

### ValidationForm

A React component for validating configurations.

```tsx
import { ValidationForm } from '@clarity-chat/dev-tools/react'

function App() {
  return <ValidationForm type="env" />
}
```

### TimeTravelPanel

A React component for time-travel debugging.

```tsx
import { TimeTravelPanel } from '@clarity-chat/dev-tools/react'

function App() {
  return <TimeTravelPanel />
}
```

## New Hooks

### useAPIInspector

Hook for API inspector with optimistic updates.

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

    // ... make API call ...

    completeCall(callId, {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: {},
    })
  }

  return (
    <div>
      <button onClick={handleAPICall}>Make API Call</button>
      <div>Total Calls: {stats.totalCalls}</div>
    </div>
  )
}
```

### useProfiler

Hook for performance profiling with optimistic updates.

```tsx
import { useProfiler } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { start, end, profile, summary } = useProfiler()

  const handleOperation = async () => {
    const { result, metrics } = await profile('my-operation', async () => {
      // ... perform operation ...
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

### useEnvValidation, useAPIKeyValidation, useChatConfigValidation

Hooks for configuration validation.

```tsx
import { useEnvValidation } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { validate, isValid, errors, warnings, isPending } = useEnvValidation()

  return (
    <div>
      <button onClick={validate} disabled={isPending}>
        {isPending ? 'Validating...' : 'Validate Environment'}
      </button>
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
    </div>
  )
}
```

### useTimeTravel

Hook for time-travel debugging.

```tsx
import { useTimeTravel } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { snapshots, current, record, goBack, goForward } = useTimeTravel()

  const handleStateChange = (messages, config) => {
    record(messages, config, {}, 'State Change')
  }

  return (
    <div>
      <button onClick={() => goBack(1)}>Back</button>
      <button onClick={() => goForward(1)}>Forward</button>
      <div>Current Snapshot: {current?.label}</div>
    </div>
  )
}
```

## Migration from Existing Code

### Before (TypeScript-only)

```typescript
import { getAPIInspector } from '@clarity-chat/dev-tools'

const inspector = getAPIInspector()
inspector.setEnabled(true)
const callId = inspector.startCall({ ... })
inspector.completeCall(callId, { ... })
const logs = inspector.getLogs()
```

### After (React 19 Hooks)

```tsx
import { useAPIInspector } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { logs, startCall, completeCall } = useAPIInspector()

  const handleCall = () => {
    const callId = startCall({ ... })
    // ... make call ...
    completeCall(callId, { ... })
  }

  return <div>{logs.length} calls logged</div>
}
```

## Benefits

1. **Optimistic Updates**: Instant UI feedback with automatic error handling
2. **Real-Time Updates**: Components automatically update as data changes
3. **Better Type Safety**: Full TypeScript support with React 19 types
4. **Improved Performance**: React 19's automatic batching and optimizations
5. **Better Developer Experience**: Hooks provide cleaner API than class-based utilities

## Requirements

- React 19.0.0 or higher
- React DOM 19.0.0 or higher
- TypeScript 5.3.0 or higher (for TypeScript projects)

## Breaking Changes

None! The existing TypeScript utilities continue to work. The React components and hooks are additive.

## Examples

See the Storybook stories in `packages/dev-tools/stories/` for complete examples.

## Support

For issues or questions, please open an issue on GitHub.
