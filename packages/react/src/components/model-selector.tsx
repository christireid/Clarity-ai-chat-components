/**
 * Model Selector Component
 * 
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 */

import * as React from 'react'
import type { ModelConfig, ModelInfo } from '../adapters/types'

export interface ModelSelectorProps {
  /** Available models */
  models: ModelInfo[]
  /** Currently selected model ID */
  value: string
  /** Callback when model is selected */
  onChange: (modelId: string, config: ModelConfig) => void
  /** Additional CSS class */
  className?: string
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Show extended info */
  showDescription?: boolean
}

export function ModelSelector({
  models,
  value,
  onChange,
  className = '',
  showMetrics = true,
  disabled = false,
  showDescription = true
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedModel = models.find(m => m.id === value)
  
  const handleSelect = (model: ModelInfo) => {
    onChange(model.id, {
      provider: model.provider,
      model: model.id
    })
    setIsOpen(false)
  }
  
  const getBadgeColor = (type: string, value: string) => {
    const colors: Record<string, Record<string, string>> = {
      speed: {
        fast: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        slow: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      },
      cost: {
        low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      },
      quality: {
        good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        excellent: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        best: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      }
    }
    return colors[type]?.[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium truncate">
            {selectedModel?.name || 'Select model'}
          </span>
          {showMetrics && selectedModel && (
            <div className="flex gap-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor('speed', selectedModel.speed)}`}>
                {selectedModel.speed}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor('cost', selectedModel.cost)}`}>
                ${selectedModel.cost}
              </span>
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="listbox"
            className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-auto"
          >
            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                role="option"
                aria-selected={model.id === value}
                onClick={() => handleSelect(model)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {model.name}
                    </span>
                    {showMetrics && (
                      <div className="flex gap-1 flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor('speed', model.speed)}`}>
                          {model.speed}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor('quality', model.quality)}`}>
                          {model.quality}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor('cost', model.cost)}`}>
                          ${model.cost}
                        </span>
                      </div>
                    )}
                  </div>
                  {showDescription && model.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {model.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {(model.contextWindow / 1000).toFixed(0)}K context
                    {model.vision && ' · Vision'}
                    {model.toolCalling && ' · Tools'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
