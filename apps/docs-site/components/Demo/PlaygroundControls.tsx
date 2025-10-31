'use client'

import { useState } from 'react'
import clsx from 'clsx'

export type ControlType = 'text' | 'number' | 'boolean' | 'select' | 'color'

export interface Control {
  name: string
  label: string
  type: ControlType
  defaultValue: any
  options?: string[] // For select type
  min?: number // For number type
  max?: number // For number type
  step?: number // For number type
}

interface PlaygroundControlsProps {
  controls: Control[]
  onChange: (values: Record<string, any>) => void
  className?: string
}

export function PlaygroundControls({
  controls,
  onChange,
  className,
}: PlaygroundControlsProps) {
  const initialValues = controls.reduce((acc, control) => {
    acc[control.name] = control.defaultValue
    return acc
  }, {} as Record<string, any>)

  const [values, setValues] = useState(initialValues)

  const handleChange = (name: string, value: any) => {
    const newValues = { ...values, [name]: value }
    setValues(newValues)
    onChange(newValues)
  }

  const renderControl = (control: Control) => {
    switch (control.type) {
      case 'text':
        return (
          <input
            type="text"
            value={values[control.name]}
            onChange={(e) => handleChange(control.name, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={values[control.name]}
            onChange={(e) => handleChange(control.name, Number(e.target.value))}
            min={control.min}
            max={control.max}
            step={control.step || 1}
            className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values[control.name]}
              onChange={(e) => handleChange(control.name, e.target.checked)}
              className="w-4 h-4 text-brand-500 border-border rounded focus:ring-2 focus:ring-brand-500"
            />
            <span className="text-sm text-text-secondary">
              {values[control.name] ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        )

      case 'select':
        return (
          <select
            value={values[control.name]}
            onChange={(e) => handleChange(control.name, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {control.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={values[control.name]}
              onChange={(e) => handleChange(control.name, e.target.value)}
              className="w-12 h-10 border border-border rounded cursor-pointer"
            />
            <input
              type="text"
              value={values[control.name]}
              onChange={(e) => handleChange(control.name, e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={clsx(
        'p-6 bg-bg-secondary border border-border rounded-lg space-y-4',
        className
      )}
    >
      <h4 className="font-semibold text-sm text-text-primary mb-4">
        Playground Controls
      </h4>

      {controls.map((control) => (
        <div key={control.name} className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            {control.label}
          </label>
          {renderControl(control)}
        </div>
      ))}
    </div>
  )
}
