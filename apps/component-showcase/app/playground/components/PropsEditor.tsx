'use client'

import { usePlayground } from '../context/PlaygroundContext'
import { PropDefinition, PropValue } from '../types'
import { Sliders, RotateCcw, BookOpen } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { useState } from 'react'

export function PropsEditor() {
  const { getComponentDefinition, props, updateProp, resetProps } = usePlayground()
  const component = getComponentDefinition()
  const [expandedExamples, setExpandedExamples] = useState(false)

  if (!component) return null

  const loadExample = (exampleProps: Record<string, PropValue>) => {
    Object.entries(exampleProps).forEach(([key, value]) => {
      updateProp(key, value)
    })
  }

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <button
          onClick={resetProps}
          className="px-3 py-1.5 text-sm rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Examples */}
      {component.examples && component.examples.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpandedExamples(!expandedExamples)}
            className="w-full flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Quick Examples</span>
            <span className="ml-auto text-xs">
              {expandedExamples ? '▼' : '▶'}
            </span>
          </button>

          {expandedExamples && (
            <div className="space-y-2 pt-2">
              {component.examples.map((example) => (
                <button
                  key={example.name}
                  onClick={() => loadExample(example.props)}
                  className="w-full text-left glass-panel p-3 hover:bg-white/80 dark:hover:bg-white/10 transition-colors rounded-lg"
                >
                  <div className="font-medium text-sm">{example.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {example.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Props List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {component.props.map((prop) => (
          <PropEditor
            key={prop.name}
            prop={prop}
            value={props[prop.name]}
            onChange={(value) => updateProp(prop.name, value)}
          />
        ))}
      </div>
    </div>
  )
}

interface PropEditorProps {
  prop: PropDefinition
  value: PropValue
  onChange: (value: PropValue) => void
}

function PropEditor({ prop, value, onChange }: PropEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <label className="text-sm font-medium flex items-center gap-2">
            {prop.name}
            {prop.required && (
              <span className="text-xs text-red-500">*</span>
            )}
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {prop.description}
          </p>
        </div>
        <span className="text-xs badge-glass">{prop.type}</span>
      </div>

      <div>
        {prop.type === 'string' && (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg glass-panel focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        )}

        {prop.type === 'number' && (
          <div className="space-y-2">
            <input
              type="range"
              value={value as number}
              onChange={(e) => onChange(Number(e.target.value))}
              min={prop.min}
              max={prop.max}
              step={prop.step}
              className="w-full"
            />
            <input
              type="number"
              value={value as number}
              onChange={(e) => onChange(Number(e.target.value))}
              min={prop.min}
              max={prop.max}
              step={prop.step}
              className="w-full px-3 py-2 rounded-lg glass-panel focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
        )}

        {prop.type === 'boolean' && (
          <button
            onClick={() => onChange(!value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center justify-between',
              value && 'bg-primary/10 border border-primary/30'
            )}
          >
            <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
            <div
              className={cn(
                'w-10 h-6 rounded-full transition-colors relative',
                value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <div
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  value ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </div>
          </button>
        )}

        {prop.type === 'select' && prop.options && (
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg glass-panel focus:ring-2 focus:ring-primary/50 transition-shadow"
          >
            {prop.options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {prop.type === 'color' && (
          <div className="flex gap-2">
            <input
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-20 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg glass-panel focus:ring-2 focus:ring-primary/50 transition-shadow font-mono text-sm"
            />
          </div>
        )}

        {prop.type === 'json' && (
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value))
              } catch {
                // Invalid JSON, don't update
              }
            }}
            rows={4}
            className="w-full px-3 py-2 rounded-lg glass-panel focus:ring-2 focus:ring-primary/50 transition-shadow font-mono text-sm"
          />
        )}
      </div>
    </div>
  )
}
