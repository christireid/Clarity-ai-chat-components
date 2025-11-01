import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Model Selector',
  description: 'A dropdown component for switching between AI models with metrics like speed, cost, and quality indicators.',
}

# Model Selector

A dropdown component for switching between AI models with visual metrics badges showing speed, cost, quality, context window, and capabilities.

## Overview

The Model Selector provides an intuitive interface for choosing between different AI models from various providers (OpenAI, Anthropic, Google). It displays key metrics to help users make informed decisions about which model to use.

### Key Features

- **Model Metrics** - Speed, cost, quality badges with color coding
- **Model Capabilities** - Context window size, vision, tool calling
- **Provider Support** - OpenAI, Anthropic, Google, custom providers
- **Descriptions** - Optional detailed model descriptions
- **Keyboard Accessible** - Full ARIA support
- **Dark Mode** - Automatic theme adaptation
- **Responsive** - Adapts to container width
- **Type Safe** - Full TypeScript support

## Installation

```bash
npm install @clarity-chat/react
```

## Basic Usage

```tsx
'use client'

import { useState } from 'react'
import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo, ModelConfig } from '@clarity-chat/react/adapters'

const availableModels: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    description: 'Most capable GPT-4 model with excellent performance',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'good',
    contextWindow: 16385,
    description: 'Fast and cost-effective for most tasks',
    streaming: true,
    toolCalling: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    speed: 'medium',
    cost: 'high',
    quality: 'best',
    contextWindow: 200000,
    description: 'Most intelligent Claude model for complex tasks',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]

export default function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')

  const handleModelChange = (modelId: string, config: ModelConfig) => {
    setSelectedModel(modelId)
    console.log('Selected model:', modelId, config)
  }

  return (
    <div className="p-4">
      <ModelSelector
        models={availableModels}
        value={selectedModel}
        onChange={handleModelChange}
      />
    </div>
  )
}
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `models` | `ModelInfo[]` | **Required** | Array of available models |
| `value` | `string` | **Required** | Currently selected model ID |
| `onChange` | `(modelId: string, config: ModelConfig) => void` | **Required** | Callback when model selected |
| `showMetrics` | `boolean` | `true` | Show speed/cost/quality badges |
| `showDescription` | `boolean` | `true` | Show model descriptions |
| `disabled` | `boolean` | `false` | Disable the selector |
| `className` | `string` | `''` | Additional CSS classes |

## ModelInfo Interface

```typescript
interface ModelInfo {
  id: string                    // Model identifier (e.g., 'gpt-4-turbo')
  name: string                  // Display name (e.g., 'GPT-4 Turbo')
  provider: 'openai' | 'anthropic' | 'google'
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'good' | 'excellent' | 'best'
  contextWindow: number         // Context window size in tokens
  description?: string          // Optional description
  streaming?: boolean           // Supports streaming
  toolCalling?: boolean         // Supports tool/function calling
  vision?: boolean              // Supports vision/image input
}
```

## ModelConfig Interface

```typescript
interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  model: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
}
```

## Badge Color Coding

### Speed Badges

- **Fast** - 🟢 Green badge - Low latency models
- **Medium** - 🟡 Yellow badge - Moderate latency
- **Slow** - 🔴 Red badge - Higher latency but often better quality

### Cost Badges

- **Low** - 🟢 Green badge - $ Low cost per token
- **Medium** - 🟡 Yellow badge - $$ Moderate pricing
- **High** - 🔴 Red badge - $$$ Premium pricing

### Quality Badges

- **Good** - 🔵 Blue badge - Suitable for most tasks
- **Excellent** - 🟣 Indigo badge - High quality responses
- **Best** - 🟣 Purple badge - Top-tier performance

## Model Examples

### OpenAI Models

```tsx
const openaiModels: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    description: 'Latest GPT-4 with 128K context window',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    speed: 'medium',
    cost: 'high',
    quality: 'best',
    contextWindow: 8192,
    description: 'Original GPT-4 model',
    streaming: true,
    toolCalling: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'good',
    contextWindow: 16385,
    description: 'Fast and affordable',
    streaming: true,
    toolCalling: true,
  },
]
```

### Anthropic Models

```tsx
const anthropicModels: ModelInfo[] = [
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    speed: 'medium',
    cost: 'high',
    quality: 'best',
    contextWindow: 200000,
    description: 'Most capable Claude model',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    speed: 'fast',
    cost: 'medium',
    quality: 'excellent',
    contextWindow: 200000,
    description: 'Balanced performance and cost',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    speed: 'fast',
    cost: 'low',
    quality: 'good',
    contextWindow: 200000,
    description: 'Fast and cost-effective',
    streaming: true,
    toolCalling: true,
  },
]
```

### Google Models

```tsx
const googleModels: ModelInfo[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 32768,
    description: 'Google\'s multimodal AI model',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]
```

## Complete Example: Model Selector with Settings

```tsx
'use client'

import { useState, useEffect } from 'react'
import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo, ModelConfig } from '@clarity-chat/react/adapters'

export default function ChatSettings() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null)

  // Load available models from backend
  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models)
        setSelectedModel(data.defaultModel)
      })
  }, [])

  const handleModelChange = async (modelId: string, config: ModelConfig) => {
    setSelectedModel(modelId)
    setModelConfig(config)

    // Save selection to backend
    await fetch('/api/settings/model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId, config }),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          AI Model
        </label>
        <ModelSelector
          models={models}
          value={selectedModel}
          onChange={handleModelChange}
          showMetrics
          showDescription
        />
      </div>

      {modelConfig && (
        <div className="text-sm text-muted-foreground">
          Selected: {modelConfig.model} ({modelConfig.provider})
        </div>
      )}
    </div>
  )
}
```

## Complete Example: Model Comparison

```tsx
'use client'

import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react/adapters'

export default function ModelComparison() {
  const models: ModelInfo[] = [/* models */]
  const [model1, setModel1] = useState('gpt-4-turbo')
  const [model2, setModel2] = useState('claude-3-opus')

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Model A</h3>
        <ModelSelector
          models={models}
          value={model1}
          onChange={(id) => setModel1(id)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Model B</h3>
        <ModelSelector
          models={models}
          value={model2}
          onChange={(id) => setModel2(id)}
        />
      </div>
    </div>
  )
}
```

## Complete Example: Backend API

### Next.js App Router API

```typescript
// app/api/models/route.ts
import { NextResponse } from 'next/server'
import type { ModelInfo } from '@clarity-chat/react/adapters'

export async function GET() {
  const models: ModelInfo[] = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      speed: 'fast',
      cost: 'medium',
      quality: 'best',
      contextWindow: 128000,
      description: 'Most capable GPT-4 model',
      streaming: true,
      toolCalling: true,
      vision: true,
    },
    // Add more models
  ]

  return NextResponse.json({
    models,
    defaultModel: 'gpt-4-turbo',
  })
}

// app/api/settings/model/route.ts
export async function POST(request: Request) {
  const { modelId, config } = await request.json()
  
  // Save user's model preference
  await db.userSettings.update({
    where: { userId: session.user.id },
    data: { preferredModel: modelId },
  })

  return NextResponse.json({ success: true })
}
```

## Customization

### Hide Metrics

```tsx
<ModelSelector
  models={models}
  value={selected}
  onChange={handleChange}
  showMetrics={false}
/>
```

### Hide Descriptions

```tsx
<ModelSelector
  models={models}
  value={selected}
  onChange={handleChange}
  showDescription={false}
/>
```

### Custom Styling

```tsx
<ModelSelector
  models={models}
  value={selected}
  onChange={handleChange}
  className="max-w-md"
/>
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  ModelSelectorProps,
  ModelInfo,
  ModelConfig,
} from '@clarity-chat/react'

// All types fully documented
```

## Accessibility

The Model Selector follows accessibility best practices:

- **ARIA Roles** - `listbox` and `option` roles
- **ARIA States** - `aria-expanded`, `aria-selected`
- **Keyboard Navigation** - Arrow keys, Enter, Escape
- **Focus Management** - Proper focus handling
- **Screen Reader** - Descriptive labels for all elements
- **Visual Indicators** - Selected state clearly shown

### Keyboard Shortcuts

- **Space/Enter** - Open dropdown
- **Escape** - Close dropdown
- **Click outside** - Close dropdown

## Styling

### Dark Mode

The component automatically adapts to dark mode:

```tsx
<div className="dark">
  <ModelSelector
    models={models}
    value={selected}
    onChange={handleChange}
  />
</div>
```

### Custom Colors

Override badge colors:

```css
.model-selector .badge-fast {
  background: your-color;
}
```

## Related Components

- **[Settings Panel](../settings-panel)** - Contains model selector
- **[Command Palette](../command-palette)** - Quick model switching
- **[Select](../select)** - Base select component
- **[Dropdown](../dropdown)** - Dropdown menus

## Best Practices

### 1. Provide Accurate Metrics

Ensure metrics reflect actual performance:

```tsx
// ✅ Good - accurate metrics
{
  id: 'gpt-3.5-turbo',
  speed: 'fast',        // Actually fast
  cost: 'low',          // Actually low cost
  quality: 'good',      // Appropriate quality tier
}

// ❌ Bad - inflated metrics
{
  id: 'gpt-3.5-turbo',
  speed: 'fast',
  cost: 'low',
  quality: 'best',      // Exaggerated
}
```

### 2. Include Helpful Descriptions

Add context to help users choose:

```tsx
// ✅ Good - informative
description: 'Best for complex reasoning and creative tasks'

// ❌ Bad - vague
description: 'Good model'
```

### 3. Default to Balanced Model

Start with a good balance of speed/cost/quality:

```tsx
// ✅ Good - balanced default
const [selected, setSelected] = useState('gpt-4-turbo')

// ❌ Bad - expensive default
const [selected, setSelected] = useState('claude-3-opus')
```

### 4. Show Context Window

Display context window for long documents:

```tsx
// Component automatically shows: "128K context"
```

### 5. Handle Model Unavailability

Gracefully handle when models aren't available:

```tsx
const availableModels = models.filter(m =>
  userHasAccess(m.provider)
)

if (availableModels.length === 0) {
  return <NoModelsAvailable />
}
```

### 6. Persist Selection

Save user's model preference:

```tsx
useEffect(() => {
  localStorage.setItem('preferred-model', selectedModel)
}, [selectedModel])
```

### 7. Validate Model Access

Check if user has access to selected model:

```tsx
const handleModelChange = async (modelId, config) => {
  const hasAccess = await checkModelAccess(modelId)
  
  if (!hasAccess) {
    toast.error('Upgrade to access this model')
    return
  }
  
  setSelectedModel(modelId)
}
```

## Use Cases

### 1. Chat Interface

Model selection in chat:

```tsx
<div className="chat-header">
  <ModelSelector
    models={models}
    value={currentModel}
    onChange={switchModel}
  />
</div>
```

### 2. Settings Page

User preferences:

```tsx
<SettingsPanel>
  <SettingSection title="AI Model">
    <ModelSelector
      models={models}
      value={userModel}
      onChange={updateUserModel}
    />
  </SettingSection>
</SettingsPanel>
```

### 3. API Playground

Test different models:

```tsx
<Playground>
  <ModelSelector
    models={models}
    value={testModel}
    onChange={setTestModel}
  />
  <CodeEditor />
  <ResponseViewer />
</Playground>
```

### 4. Model Comparison Tool

Compare model outputs:

```tsx
<ComparisonView>
  <Column>
    <ModelSelector value={model1} onChange={setModel1} />
    <Output model={model1} />
  </Column>
  <Column>
    <ModelSelector value={model2} onChange={setModel2} />
    <Output model={model2} />
  </Column>
</ComparisonView>
```

## Performance Tips

### 1. Memoize Model List

Prevent unnecessary re-renders:

```tsx
const models = useMemo(() => [
  { id: 'gpt-4-turbo', /* ... */ },
  { id: 'claude-3-opus', /* ... */ },
], [])
```

### 2. Lazy Load Model Details

Load descriptions on demand:

```tsx
const [descriptions, setDescriptions] = useState<Record<string, string>>({})

const loadDescription = async (modelId: string) => {
  const desc = await fetch(`/api/models/${modelId}/description`)
  setDescriptions(prev => ({ ...prev, [modelId]: desc }))
}
```

### 3. Cache Model Configurations

```tsx
const modelCache = new Map<string, ModelConfig>()

const getModelConfig = (modelId: string) => {
  if (modelCache.has(modelId)) {
    return modelCache.get(modelId)
  }
  
  const config = createModelConfig(modelId)
  modelCache.set(modelId, config)
  return config
}
```

---

**Related Documentation:**
- [Settings Panel](../settings-panel)
- [Command Palette](../command-palette)
- [Select](../select)
- [Dropdown](../dropdown)
