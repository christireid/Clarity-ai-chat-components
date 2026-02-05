'use client'

import { Code2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'

interface PropsComparisonProps {
  leftComponent: string
  rightComponent: string
}

interface PropDefinition {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
  leftValue?: string
  rightValue?: string
}

// Mock props data - in a real implementation, this would introspect actual component props
const generateProps = (componentId: string): PropDefinition[] => {
  const baseProps: PropDefinition[] = [
    {
      name: 'variant',
      type: "'default' | 'outline' | 'ghost'",
      required: false,
      default: 'default',
      description: 'Visual style variant',
      leftValue: 'default',
      rightValue: 'outline',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: 'md',
      description: 'Component size',
      leftValue: 'md',
      rightValue: 'lg',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disable user interaction',
      leftValue: 'false',
      rightValue: 'false',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'Additional CSS classes',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Component content',
    },
  ]

  return baseProps
}

export function PropsComparison({ leftComponent, rightComponent }: PropsComparisonProps) {
  const [copiedProp, setCopiedProp] = useState<string | null>(null)
  const props = generateProps(leftComponent)

  const copyPropSignature = (prop: PropDefinition) => {
    const signature = `${prop.name}${prop.required ? '' : '?'}: ${prop.type}`
    navigator.clipboard.writeText(signature)
    setCopiedProp(prop.name)
    setTimeout(() => setCopiedProp(null), 2000)
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-container">
          <Code2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Props Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare component properties and their current values
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-semibold">Property</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
              <th className="text-center py-3 px-4 text-sm font-semibold">Required</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Default</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Component A
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
                Component B
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => {
              const valuesDiffer = prop.leftValue !== prop.rightValue
              return (
                <tr
                  key={index}
                  className={cn(
                    'border-b hover:bg-muted/50 transition-colors',
                    valuesDiffer && 'bg-yellow-500/5'
                  )}
                >
                  {/* Property Name */}
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono font-medium">{prop.name}</code>
                    <div className="text-xs text-muted-foreground mt-1">
                      {prop.description}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {prop.type}
                    </code>
                  </td>

                  {/* Required */}
                  <td className="py-3 px-4 text-center">
                    {prop.required ? (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-red-500/20 text-red-700 dark:text-red-300">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-500/20 text-gray-700 dark:text-gray-300">
                        No
                      </span>
                    )}
                  </td>

                  {/* Default */}
                  <td className="py-3 px-4">
                    {prop.default && (
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {prop.default}
                      </code>
                    )}
                  </td>

                  {/* Left Value */}
                  <td className="py-3 px-4">
                    {prop.leftValue && (
                      <code
                        className={cn(
                          'text-xs font-mono px-2 py-1 rounded',
                          valuesDiffer
                            ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                            : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        )}
                      >
                        {prop.leftValue}
                      </code>
                    )}
                  </td>

                  {/* Right Value */}
                  <td className="py-3 px-4">
                    {prop.rightValue && (
                      <code
                        className={cn(
                          'text-xs font-mono px-2 py-1 rounded',
                          valuesDiffer
                            ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                            : 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                        )}
                      >
                        {prop.rightValue}
                      </code>
                    )}
                  </td>

                  {/* Copy Button */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => copyPropSignature(prop)}
                      className="p-1.5 hover:bg-muted rounded transition-colors"
                      title="Copy property signature"
                    >
                      {copiedProp === prop.name ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Usage Examples */}
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-semibold">Usage Examples</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Component */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              Component A
            </div>
            <pre className="text-xs font-mono overflow-x-auto">
              <code>{`<${leftComponent}
  variant="default"
  size="md"
  disabled={false}
>
  Content
</${leftComponent}>`}</code>
            </pre>
          </div>

          {/* Right Component */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
              Component B
            </div>
            <pre className="text-xs font-mono overflow-x-auto">
              <code>{`<${rightComponent}
  variant="outline"
  size="lg"
  disabled={false}
>
  Content
</${rightComponent}>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
