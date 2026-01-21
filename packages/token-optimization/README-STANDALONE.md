# Using Token Optimization in Any React App

The `@clarity-chat/token-optimization` package is **completely standalone** and can be used in any React application, not just with Clarity Chat components.

## What's Standalone vs. What's Not

### ✅ Completely Standalone (No Dependencies on Clarity Chat)

All core functionality works in any React app:

#### **Week 3: React Hooks**
```typescript
import {
  useContextWindow,
  useQualityRouter,
  useCacheStats,
  useEstimateCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
} from '@clarity-chat/token-optimization'
```
- **Zero dependencies** on Clarity Chat
- Works with any React 18+ app
- SSR compatible (Next.js, Remix, etc.)

#### **Week 4: Vision/Multimodal**
```typescript
import {
  VisionTokenCounter,
  ImageOptimizer,
  MultimodalCostEstimator,
  createMultimodalMessage,
  MULTIMODAL_MODEL_PRICING,
} from '@clarity-chat/token-optimization/vision'
```
- **Zero dependencies** on Clarity Chat
- Pure TypeScript/JavaScript
- Works in Node.js, browser, or React

#### **Week 1: Compression Strategies**
```typescript
import {
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
  AdaptiveConversationStrategy,
} from '@clarity-chat/token-optimization/compression'
```
- **Zero dependencies** on Clarity Chat
- Pure functions, no React required

#### **Week 2: Cascading Router**
```typescript
import {
  CascadingRouter,
  createOpenAICascadingRouter,
  createAnthropicCascadingRouter,
} from '@clarity-chat/token-optimization/routing'
```
- **Zero dependencies** on Clarity Chat
- Works with any LLM provider

### ⚠️ Requires Clarity Chat Primitives

Only pre-built UI components require `@clarity-chat/primitives`:

```typescript
// These components require @clarity-chat/primitives
import {
  TokenUsageMeter,
  TokenCostPreview,
  TokenOptimizationDashboard,
} from '@clarity-chat/token-optimization/react'
```

**You don't need these components!** The hooks provide all the functionality - you can build your own UI.

## Installation

### Option 1: Core Package Only (Recommended)

```bash
npm install @clarity-chat/token-optimization react
```

This gives you:
- All React hooks ✅
- Vision/multimodal optimization ✅
- Compression strategies ✅
- Cascading router ✅
- Token counting ✅
- Cost estimation ✅

### Option 2: With Pre-built UI Components

```bash
npm install @clarity-chat/token-optimization @clarity-chat/primitives react framer-motion
```

Adds:
- Pre-styled UI components
- Glassmorphic design
- Animations

## Quick Start (Standalone React App)

### Example 1: Basic Token Optimization

```typescript
// app.tsx - Works in ANY React app
import React, { useState } from 'react'
import { useContextWindow, useQualityRouter } from '@clarity-chat/token-optimization'

export function ChatApp() {
  const [input, setInput] = useState('')

  // Context management - NO clarity-chat dependency
  const { messages, addMessage, currentTokens, utilization } = useContextWindow({
    maxTokens: 4000,
    strategy: 'adaptive',
    autoOptimize: true,
  })

  // Quality routing - NO clarity-chat dependency
  const { execute, isGenerating, lastResult } = useQualityRouter({
    provider: 'openai',
    qualityThreshold: 0.7,
  })

  const handleSend = async () => {
    addMessage({ role: 'user', content: input })

    const result = await execute(input, async (model) => {
      // Your own API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages, model: model.name }),
      })
      return await response.json()
    })

    addMessage({ role: 'assistant', content: result.response })
    setInput('')
  }

  return (
    <div>
      {/* Your own UI - no clarity-chat components needed */}
      <div>Tokens: {currentTokens} / 4000 ({(utilization * 100).toFixed(1)}%)</div>

      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={isGenerating}>Send</button>
    </div>
  )
}
```

### Example 2: Cost Tracking

```typescript
// cost-tracker.tsx - Works in ANY React app
import React from 'react'
import { useBudgetAlerts, MODEL_PRICING_PRESETS } from '@clarity-chat/token-optimization'

export function CostTracker() {
  const { totalCost, budgetRemaining, budgetUtilization, alerts, addCost } = useBudgetAlerts({
    dailyBudget: 10, // $10/day
    warningThreshold: 0.75,
  })

  return (
    <div>
      {/* Your own UI */}
      <h2>Budget: ${totalCost.toFixed(2)} / $10.00</h2>
      <div style={{
        width: `${budgetUtilization * 100}%`,
        backgroundColor: budgetUtilization > 0.9 ? 'red' : 'green'
      }} />

      {alerts.map((alert) => (
        <div key={alert.id} className="alert">
          {alert.message}
        </div>
      ))}
    </div>
  )
}
```

### Example 3: Vision/Multimodal

```typescript
// image-analysis.tsx - Works in ANY React app
import React from 'react'
import {
  createMultimodalMessage,
  createImageContent,
  MultimodalCostEstimator,
  MULTIMODAL_MODEL_PRICING,
} from '@clarity-chat/token-optimization/vision'

export function ImageAnalysis() {
  const estimator = new MultimodalCostEstimator({
    pricing: MULTIMODAL_MODEL_PRICING['gpt-4o'],
  })

  const analyzeImage = (imageData: string, dimensions: { width: number; height: number }) => {
    const image = createImageContent(imageData, 'image/jpeg', dimensions)
    const message = createMultimodalMessage('user', 'What is in this image?', [image])
    const cost = estimator.estimateMessage(message)

    console.log(`Cost: $${cost.totalCost.toFixed(6)}`)
    console.log(`Text tokens: ${cost.textTokens}`)
    console.log(`Image tokens: ${cost.imageTokens}`)
  }

  return <div>{/* Your UI */}</div>
}
```

## Framework Compatibility

### ✅ Next.js

```typescript
// app/page.tsx
'use client'

import { useContextWindow } from '@clarity-chat/token-optimization'

export default function Page() {
  const { messages, addMessage } = useContextWindow({
    maxTokens: 4000,
    strategy: 'adaptive',
  })

  // Works perfectly!
  return <div>...</div>
}
```

### ✅ Remix

```typescript
// app/routes/chat.tsx
import { useContextWindow } from '@clarity-chat/token-optimization'

export default function ChatRoute() {
  const { messages } = useContextWindow({
    maxTokens: 4000,
  })

  // Works perfectly!
  return <div>...</div>
}
```

### ✅ Vite/Create React App

```typescript
// src/App.tsx
import { useContextWindow } from '@clarity-chat/token-optimization'

function App() {
  const { messages } = useContextWindow({
    maxTokens: 4000,
  })

  // Works perfectly!
  return <div>...</div>
}
```

### ✅ Vanilla React (CDN)

```html
<script type="module">
  import { useContextWindow } from 'https://esm.sh/@clarity-chat/token-optimization'
  // Works!
</script>
```

## TypeScript Support

Full TypeScript support with zero additional configuration:

```typescript
import type {
  ConversationMessage,
  UseContextWindowReturn,
  CascadingResult,
  MultimodalMessage,
  VisionTokenResult,
} from '@clarity-chat/token-optimization'

// All types are exported and fully documented
const message: ConversationMessage = {
  role: 'user',
  content: 'Hello',
}
```

## Non-React Usage

Core functionality works without React:

```typescript
// Node.js script
import {
  SlidingWindowStrategy,
  CascadingRouter,
  VisionTokenCounter,
} from '@clarity-chat/token-optimization'

// No React needed!
const strategy = new SlidingWindowStrategy({ windowSize: 10 })
const result = await strategy.optimize(messages)

const counter = new VisionTokenCounter({ provider: 'openai' })
const tokens = counter.count({ dimensions: { width: 1024, height: 1024 } })
```

## Build Your Own UI

The hooks provide all state and logic - you provide the UI:

```typescript
import { useContextWindow, useBudgetAlerts, useCacheStats } from '@clarity-chat/token-optimization'

function MyCustomUI() {
  // Get all the data you need
  const context = useContextWindow({ maxTokens: 4000 })
  const budget = useBudgetAlerts({ dailyBudget: 10 })
  const cache = useCacheStats({ cache: myCache })

  // Build ANY UI you want with Tailwind, Material-UI, Ant Design, etc.
  return (
    <div className="your-custom-styles">
      <YourContextDisplay tokens={context.currentTokens} />
      <YourBudgetDisplay cost={budget.totalCost} />
      <YourCacheDisplay hitRate={cache.stats.hitRate} />
    </div>
  )
}
```

## Package Structure

```
@clarity-chat/token-optimization
├── / (main exports)
│   ├── Token counting ✅ Standalone
│   ├── React hooks ✅ Standalone
│   ├── Compression ✅ Standalone
│   └── Routing ✅ Standalone
├── /vision
│   ├── Vision token counter ✅ Standalone
│   ├── Image optimizer ✅ Standalone
│   ├── Multimodal types ✅ Standalone
│   └── Cost estimator ✅ Standalone
├── /compression
│   └── Strategies ✅ Standalone
├── /cache
│   └── Caching systems ✅ Standalone
└── /react (UI components)
    └── Requires @clarity-chat/primitives ⚠️
```

## Summary

**✅ You CAN use in any React app:**
- All React hooks (Week 3)
- Vision/multimodal optimization (Week 4)
- Compression strategies (Week 1)
- Cascading router (Week 2)
- Token counting
- Cost estimation
- Caching

**⚠️ Optional Clarity Chat dependency:**
- Pre-built UI components (TokenUsageMeter, etc.)
- You don't need these - build your own UI with the hooks!

## Examples Repository

See `examples/standalone/` for complete examples that work in any React app:
- Next.js app
- Vite app
- Remix app
- Plain React app

## Questions?

The package is designed to be framework-agnostic. If you find any dependencies on Clarity Chat in the core functionality, please open an issue!
