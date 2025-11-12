# Quick Start Guide - React 19 Dev Tools

Get started with React 19 enhanced developer tools in 5 minutes.

## Installation

```bash
npm install @clarity-chat/dev-tools
```

## Basic Usage

### 1. Add the Dashboard

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

### 2. Use Individual Hooks

```tsx
import { useAPIInspector, useProfiler } from '@clarity-chat/dev-tools/react'

function MyComponent() {
  const { startCall, completeCall } = useAPIInspector()
  const { profile } = useProfiler()

  const handleAPICall = async () => {
    const callId = startCall({
      provider: 'openai',
      model: 'gpt-4-turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {},
      body: {},
    })

    const { metrics } = await profile('api-call', async () => {
      const response = await fetch('...')
      return response.json()
    })

    completeCall(callId, {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: await response.json(),
    })
  }

  return <button onClick={handleAPICall}>Make Call</button>
}
```

### 3. Validate Configuration

```tsx
import { useEnvValidation, ValidationForm } from '@clarity-chat/dev-tools/react'

function ConfigCheck() {
  const { validate, isValid } = useEnvValidation()

  return (
    <div>
      <button onClick={validate}>Validate</button>
      {isValid && <p>✅ All valid</p>}
      <ValidationForm type="env" />
    </div>
  )
}
```

## Available Components

- **DevToolsDashboard** - All-in-one dashboard
- **APIInspectorPanel** - API call logs
- **ProfilerPanel** - Performance metrics
- **ValidationForm** - Configuration validation
- **TimeTravelPanel** - State debugging
- **ModelComparisonPanel** - Model comparison

## Available Hooks

- **useAPIInspector** - Track API calls
- **useProfiler** - Monitor performance
- **useEnvValidation** - Validate environment
- **useAPIKeyValidation** - Validate API keys
- **useChatConfigValidation** - Validate config
- **useTimeTravel** - Debug state changes
- **useModelComparison** - Compare models

## React 19 Features

All hooks use `useOptimistic` for instant UI updates - no loading states needed!

## Next Steps

- See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration
- See [REACT_19_MIGRATION.md](./REACT_19_MIGRATION.md) for migration guide
- See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for complete examples
