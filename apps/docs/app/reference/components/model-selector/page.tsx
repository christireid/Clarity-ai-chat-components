'use client'

import { useState } from 'react'
import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Callout } from '@/components/MDX/Callout'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

const models: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Most capable model for complex tasks',
    contextWindow: 128000,
    maxTokens: 4096,
    vision: true,
    toolCalling: true,
    speed: 'medium',
    cost: 'medium',
    quality: 'best',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and cost-effective for simple tasks',
    contextWindow: 16000,
    maxTokens: 4096,
    vision: false,
    toolCalling: true,
    speed: 'fast',
    cost: 'low',
    quality: 'good',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Highest performance for reasoning and coding',
    contextWindow: 200000,
    maxTokens: 4096,
    vision: true,
    toolCalling: true,
    speed: 'slow',
    cost: 'high',
    quality: 'best',
  },
]

function BasicModelSelectorDemo() {
  const [value, setValue] = useState('gpt-4-turbo')

  return (
    <div className="w-full max-w-md p-4 border border-border rounded-lg bg-background">
      <ModelSelector
        models={models}
        value={value}
        onChange={(id) => setValue(id)}
      />
    </div>
  )
}

const modelSelectorProps: Prop[] = [
  {
    name: 'models',
    type: 'ModelInfo[]',
    required: true,
    description: 'Array of available models with their capabilities and metrics.',
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'ID of the currently selected model.',
  },
  {
    name: 'onChange',
    type: '(modelId: string, config: ModelConfig) => void',
    required: true,
    description: 'Callback function called when a model is selected.',
  },
  {
    name: 'showMetrics',
    type: 'boolean',
    default: 'true',
    description: 'Show badges for speed, cost, and quality metrics.',
  },
  {
    name: 'showDescription',
    type: 'boolean',
    default: 'true',
    description: 'Show model description in the dropdown options.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the selector interaction.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container.',
  },
]

export const dynamic = 'force-dynamic'

export default function ModelSelectorPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          ModelSelector
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          A sophisticated dropdown component for switching between AI models. It displays key metrics like speed, cost, and quality to help users make informed decisions.
        </p>
      </div>

      <ViewInStorybook component="ModelSelector" />

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <p className="mb-4">
        Pass an array of <code>ModelInfo</code> objects and handle the state for the selected value.
      </p>

      <ComponentPreview
        title="Basic Model Selector"
        description="Select between different AI models with visual indicators."
        code={`import { useState } from 'react'
import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react'

const models: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Most capable model',
    contextWindow: 128000,
    speed: 'medium',
    cost: 'medium',
    quality: 'best',
    // ... other properties
  },
  // ... other models
]

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')

  return (
    <ModelSelector
      models={models}
      value={selectedModel}
      onChange={(id) => setSelectedModel(id)}
    />
  )
}`}
      >
        <BasicModelSelectorDemo />
      </ComponentPreview>

      <h2 id="props">Props</h2>
      <PropsTable props={modelSelectorProps} />

      <h2 id="types">Types</h2>
      
      <h3>ModelInfo</h3>
      <EnhancedCodeBlock
        code={`interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string
  contextWindow: number
  maxTokens?: number
  vision?: boolean
  toolCalling?: boolean
  speed?: 'fast' | 'medium' | 'slow'
  cost?: 'low' | 'medium' | 'high'
  quality?: 'good' | 'excellent' | 'best'
}`}
        language="tsx"
      />

      <Callout type="tip">
        <p>
          The <code>speed</code>, <code>cost</code>, and <code>quality</code> fields automatically map to colored badges
          in the UI: green (good), yellow (moderate), and red (poor/expensive/slow).
        </p>
      </Callout>
    </div>
  )
}
