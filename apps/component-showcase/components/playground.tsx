'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { cn } from '@clarity-chat/primitives'
import { CodeHighlight } from './code-highlight'
import { SectionErrorBoundary } from './section-error-boundary'
import { Settings2, Eye } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PropControl {
  name: string
  type: 'boolean' | 'string' | 'number' | 'select'
  default: string | number | boolean
  options?: string[] // for select type
  min?: number // for number type
  max?: number // for number type
  step?: number
}

interface PlaygroundConfig {
  name: string
  component: (props: Record<string, unknown>) => ReactNode
  controls: PropControl[]
  /** Initial code shown before user changes anything */
  importStatement: string
}

// ---------------------------------------------------------------------------
// Controls Renderer
// ---------------------------------------------------------------------------

function ControlField({
  control,
  value,
  onChange,
}: {
  control: PropControl
  value: unknown
  onChange: (val: unknown) => void
}) {
  switch (control.type) {
    case 'boolean':
      return (
        <label className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium">{control.name}</span>
          <button
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(!value)}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
              value ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform mt-0.5',
                value ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
              )}
            />
          </button>
        </label>
      )

    case 'string':
      return (
        <label className="space-y-1">
          <span className="text-xs font-medium">{control.name}</span>
          <input
            type="text"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-xs font-mono"
          />
        </label>
      )

    case 'number':
      return (
        <label className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{control.name}</span>
            <span className="text-xs text-muted-foreground font-mono">
              {String(value)}
            </span>
          </div>
          <input
            type="range"
            min={control.min ?? 0}
            max={control.max ?? 100}
            step={control.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
      )

    case 'select':
      return (
        <label className="space-y-1">
          <span className="text-xs font-medium">{control.name}</span>
          <div className="flex flex-wrap gap-1">
            {control.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-mono transition-colors',
                  value === opt
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </label>
      )

    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Code Generator
// ---------------------------------------------------------------------------

function generateCode(
  config: PlaygroundConfig,
  values: Record<string, unknown>
): string {
  const propStrings: string[] = []

  for (const control of config.controls) {
    const val = values[control.name]
    if (val === control.default) continue // skip defaults

    if (control.type === 'boolean') {
      propStrings.push(val ? control.name : `${control.name}={false}`)
    } else if (control.type === 'number') {
      propStrings.push(`${control.name}={${val}}`)
    } else {
      const escaped = String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      propStrings.push(`${control.name}="${escaped}"`)
    }
  }

  const propsStr = propStrings.length > 0 ? ' ' + propStrings.join(' ') : ''
  return `${config.importStatement}\n\n<${config.name}${propsStr} />`
}

// ---------------------------------------------------------------------------
// Playground Component
// ---------------------------------------------------------------------------

export function Playground({ config }: { config: PlaygroundConfig }) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    for (const ctrl of config.controls) {
      initial[ctrl.name] = ctrl.default
    }
    return initial
  })

  const code = useMemo(() => generateCode(config, values), [config, values])

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      {/* Preview */}
      <div className="p-6 bg-muted/10 min-h-[120px] flex items-center justify-center">
        <SectionErrorBoundary sectionTitle={`${config.name} Playground`}>
          {config.component(values)}
        </SectionErrorBoundary>
      </div>

      {/* Controls + Code */}
      <div className="grid md:grid-cols-2 border-t border-border/50">
        {/* Controls Panel */}
        <div className="p-4 border-b md:border-b-0 md:border-r border-border/50">
          <div className="flex items-center gap-1.5 mb-3">
            <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Controls
            </h5>
          </div>
          <div className="space-y-3">
            {config.controls.map((ctrl) => (
              <ControlField
                key={ctrl.name}
                control={ctrl}
                value={values[ctrl.name]}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, [ctrl.name]: val }))
                }
              />
            ))}
          </div>
        </div>

        {/* Code Output */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 px-4 pt-4 pb-2">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Code
            </h5>
          </div>
          <div className="flex-1">
            <CodeHighlight code={code} language="tsx" />
          </div>
        </div>
      </div>
    </div>
  )
}

export type { PlaygroundConfig, PropControl }
