/**
 * Model Selector Component
 * Dropdown to select AI models with provider grouping
 */

import React from 'react'

interface Model {
  id: string
  name: string
  provider: string
  description?: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string
  onModelChange: (modelId: string) => void
  className?: string
}

const DEFAULT_MODELS: Model[] = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Most capable model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most intelligent' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fastest responses' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Multimodal AI' },
]

export function ModelSelector({
  models = DEFAULT_MODELS,
  selectedModel,
  onModelChange,
  className = '',
}: ModelSelectorProps) {
  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, Model[]>)

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
      >
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <optgroup key={provider} label={provider}>
            {providerModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
                {model.description && ` - ${model.description}`}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}
