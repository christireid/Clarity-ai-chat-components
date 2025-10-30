import type { Meta, StoryObj } from '@storybook/react'
import { ModelSelector } from '@clarity-chat/react'
import { useState } from 'react'
import type { ModelInfo, ModelConfig } from '@clarity-chat/types'

const meta: Meta<typeof ModelSelector> = {
  title: 'Components/ModelSelector',
  component: ModelSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Model Selector** - Beautiful AI model picker with rich comparison metrics:

- 🤖 Support for OpenAI, Anthropic, and Google models
- ⚡ Speed ratings (fast/medium/slow)
- 💰 Cost indicators (low/medium/high)
- ⭐ Quality ratings (good/excellent/best)
- 🔍 Model capabilities (vision, tools, context window)
- 📊 Real-time comparison while browsing
- 🎨 Color-coded badges for quick scanning
- ♿ Full keyboard navigation
- 🌙 Dark mode support

Perfect for multi-model AI applications where users need to choose the best model for their task.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showMetrics: {
      control: 'boolean',
      description: 'Show speed, cost, and quality badges',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show model descriptions in dropdown',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable model selection',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock model data
const openAIModels: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'high',
    quality: 'best',
    contextWindow: 128000,
    description: 'Most capable GPT-4 model with vision, JSON mode, and function calling. Optimized for complex tasks.',
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
    description: 'Original GPT-4 with excellent reasoning and creative capabilities.',
    streaming: true,
    toolCalling: true,
    vision: false,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'low',
    quality: 'good',
    contextWindow: 16384,
    description: 'Fast and cost-effective model for simple tasks and high-volume applications.',
    streaming: true,
    toolCalling: true,
    vision: false,
  },
]

const anthropicModels: ModelInfo[] = [
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    speed: 'medium',
    cost: 'high',
    quality: 'best',
    contextWindow: 200000,
    description: 'Most intelligent Claude model with superior performance on complex tasks and extended thinking.',
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
    description: 'Balanced model offering great performance at lower cost. Best for most production use cases.',
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
    description: 'Fastest and most cost-effective Claude model. Ideal for high-volume, simple tasks.',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]

const googleModels: ModelInfo[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    speed: 'fast',
    cost: 'medium',
    quality: 'excellent',
    contextWindow: 32768,
    description: 'Google\'s flagship model with strong reasoning and multimodal capabilities.',
    streaming: true,
    toolCalling: true,
    vision: false,
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: 'google',
    speed: 'medium',
    cost: 'medium',
    quality: 'excellent',
    contextWindow: 32768,
    description: 'Gemini Pro with advanced vision capabilities for image understanding.',
    streaming: true,
    toolCalling: true,
    vision: true,
  },
]

const allModels: ModelInfo[] = [
  ...openAIModels,
  ...anthropicModels,
  ...googleModels,
]

// Basic Stories
export const Default: Story = {
  args: {
    models: allModels,
    value: 'gpt-4-turbo',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const OpenAIModels: Story = {
  args: {
    models: openAIModels,
    value: 'gpt-4-turbo',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const AnthropicModels: Story = {
  args: {
    models: anthropicModels,
    value: 'claude-3-opus',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const GoogleModels: Story = {
  args: {
    models: googleModels,
    value: 'gemini-pro',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const WithoutMetrics: Story = {
  args: {
    models: allModels,
    value: 'gpt-4-turbo',
    showMetrics: false,
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const WithoutDescriptions: Story = {
  args: {
    models: allModels,
    value: 'gpt-4-turbo',
    showDescription: false,
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const Disabled: Story = {
  args: {
    models: allModels,
    value: 'gpt-4-turbo',
    disabled: true,
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const MinimalUI: Story = {
  args: {
    models: allModels,
    value: 'gpt-3.5-turbo',
    showMetrics: false,
    showDescription: false,
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

// Interactive Stories
const InteractiveExample = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [config, setConfig] = useState<ModelConfig | null>(null)

  const handleChange = (modelId: string, newConfig: ModelConfig) => {
    setSelectedModel(modelId)
    setConfig(newConfig)
  }

  const currentModel = allModels.find((m) => m.id === selectedModel)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">Select AI Model</label>
        <ModelSelector
          models={allModels}
          value={selectedModel}
          onChange={handleChange}
        />
      </div>

      {currentModel && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Selected Model Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Model Name</p>
              <p className="font-medium">{currentModel.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Provider</p>
              <p className="font-medium capitalize">{currentModel.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Speed</p>
              <p className="font-medium capitalize">{currentModel.speed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cost</p>
              <p className="font-medium capitalize">{currentModel.cost}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quality</p>
              <p className="font-medium capitalize">{currentModel.quality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Context Window</p>
              <p className="font-medium">{(currentModel.contextWindow / 1000).toFixed(0)}K tokens</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {currentModel.streaming && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  ⚡ Streaming
                </span>
              )}
              {currentModel.toolCalling && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  🔧 Tool Calling
                </span>
              )}
              {currentModel.vision && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  👁️ Vision
                </span>
              )}
            </div>
          </div>

          {config && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Config</p>
              <pre className="bg-white dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const InteractiveWithDetails: Story = {
  render: () => <InteractiveExample />,
}

const ModelComparison = () => {
  const [model1, setModel1] = useState('gpt-4-turbo')
  const [model2, setModel2] = useState('claude-3-opus')

  const getModel = (id: string) => allModels.find((m) => m.id === id)

  const model1Data = getModel(model1)
  const model2Data = getModel(model2)

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Model Comparison Tool
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Compare two models side-by-side to make informed decisions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Model 1</label>
          <ModelSelector
            models={allModels}
            value={model1}
            onChange={(id) => setModel1(id)}
          />
          {model1Data && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
              <p><strong>Speed:</strong> {model1Data.speed}</p>
              <p><strong>Cost:</strong> {model1Data.cost}</p>
              <p><strong>Quality:</strong> {model1Data.quality}</p>
              <p><strong>Context:</strong> {(model1Data.contextWindow / 1000).toFixed(0)}K</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model 2</label>
          <ModelSelector
            models={allModels}
            value={model2}
            onChange={(id) => setModel2(id)}
          />
          {model2Data && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
              <p><strong>Speed:</strong> {model2Data.speed}</p>
              <p><strong>Cost:</strong> {model2Data.cost}</p>
              <p><strong>Quality:</strong> {model2Data.quality}</p>
              <p><strong>Context:</strong> {(model2Data.contextWindow / 1000).toFixed(0)}K</p>
            </div>
          )}
        </div>
      </div>

      {model1Data && model2Data && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Comparison Summary
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>
              <strong>Faster:</strong> {model1Data.speed === 'fast' && model2Data.speed !== 'fast'
                ? model1Data.name
                : model2Data.speed === 'fast' && model1Data.speed !== 'fast'
                ? model2Data.name
                : 'Tie'}
            </li>
            <li>
              <strong>Lower Cost:</strong> {model1Data.cost === 'low' && model2Data.cost !== 'low'
                ? model1Data.name
                : model2Data.cost === 'low' && model1Data.cost !== 'low'
                ? model2Data.name
                : 'Tie'}
            </li>
            <li>
              <strong>Higher Quality:</strong> {model1Data.quality === 'best' && model2Data.quality !== 'best'
                ? model1Data.name
                : model2Data.quality === 'best' && model1Data.quality !== 'best'
                ? model2Data.name
                : 'Tie'}
            </li>
            <li>
              <strong>Larger Context:</strong> {model1Data.contextWindow > model2Data.contextWindow
                ? model1Data.name
                : model2Data.contextWindow > model1Data.contextWindow
                ? model2Data.name
                : 'Tie'}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export const ComparisonTool: Story = {
  render: () => <ModelComparison />,
}

// Edge Cases
export const SingleModel: Story = {
  args: {
    models: [openAIModels[0]],
    value: 'gpt-4-turbo',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const LongModelNames: Story = {
  args: {
    models: [
      {
        id: 'very-long-model-name',
        name: 'SuperAdvancedAI Model v4.5 Pro Max Ultra (Extended Context Version)',
        provider: 'openai',
        speed: 'fast',
        cost: 'high',
        quality: 'best',
        contextWindow: 128000,
        description: 'This is an extremely long model name to test how the UI handles overflow and text truncation in various scenarios.',
      },
    ],
    value: 'very-long-model-name',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const ManyModels: Story = {
  args: {
    models: [
      ...allModels,
      ...allModels.map((m, i) => ({ ...m, id: `${m.id}-copy-${i}`, name: `${m.name} (Copy ${i + 1})` })),
    ],
    value: 'gpt-4-turbo',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}

export const NoModelSelected: Story = {
  args: {
    models: allModels,
    value: '',
    onChange: (modelId, config) => console.log('Selected:', modelId, config),
  },
}
