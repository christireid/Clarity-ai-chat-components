// @ts-nocheck
'use client'

import * as React from 'react'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'

export function DevHelpersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Development Helpers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Utilities that enhance the development experience with validation, logging, and setup assistance.
        </p>
      </div>

      <Callout type="info">
        <strong>🛠️ Development-Only:</strong> These utilities are optimized for development and automatically
        disable themselves in production builds.
      </Callout>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Setup Validation</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">validateSetup()</h3>
            <p className="text-muted-foreground mt-1">
              Validates common setup issues and provides actionable guidance.
            </p>
            <CodeBlock
              code={`import { validateSetup } from '@clarity-chat/react'

// Manual validation
const { issues, suggestions } = validateSetup()

if (issues.length > 0) {
  console.log('Setup Issues:', issues)
  console.log('Suggestions:', suggestions)
}`}
              language="tsx"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Automatically runs in development mode to catch common setup problems.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration Presets</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ConfigPresets</h3>
            <p className="text-muted-foreground mt-1">
              Ready-to-use configuration presets for common use cases.
            </p>
            <CodeBlock
              code={`import { ConfigPresets, createConfig } from '@clarity-chat/react'

// Use a preset directly
const minimalConfig = ConfigPresets.minimal
const enterpriseConfig = ConfigPresets.enterprise

// Merge preset with custom overrides
const customConfig = createConfig('enterprise', {
  memory: { maxTokens: 20000 },
  customSetting: 'value'
})`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Available Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">minimal</h4>
                <p className="text-sm text-muted-foreground">Basic chat functionality only</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">withMemory</h4>
                <p className="text-sm text-muted-foreground">Chat with memory management</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">enterprise</h4>
                <p className="text-sm text-muted-foreground">Full-featured enterprise setup</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">streaming</h4>
                <p className="text-sm text-muted-foreground">Optimized for real-time streaming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Development Logging</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">devLog</h3>
            <p className="text-muted-foreground mt-1">
              Development-only logging utilities that automatically disable in production.
            </p>
            <CodeBlock
              code={`import { devLog } from '@clarity-chat/react'

function MyComponent() {
  const handleMessage = (message: string) => {
    devLog.info('Processing message:', message)

    try {
      // Your logic here
      devLog.info('Message processed successfully')
    } catch (error) {
      devLog.error('Failed to process message:', error)
    }
  }

  return (
    <button onClick={() => handleMessage('Hello!')}>
      Send Message
    </button>
  )
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Start Templates</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">QuickStartTemplates</h3>
            <p className="text-muted-foreground mt-1">
              Ready-to-copy code templates for common setups.
            </p>
            <CodeBlock
              code={`import { QuickStartTemplates, showQuickStart } from '@clarity-chat/react'

// Display a template in console
showQuickStart('basic')
showQuickStart('enterprise')

// Use template directly
console.log(QuickStartTemplates.basic)
console.log(QuickStartTemplates.withMemory)`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Performance Monitoring</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">DevPerformanceMonitor</h3>
            <p className="text-muted-foreground mt-1">
              Development-time performance monitoring for components and features.
            </p>
            <CodeBlock
              code={`import { DevPerformanceMonitor } from '@clarity-chat/react'

const monitor = DevPerformanceMonitor.getInstance()

// Track render performance
monitor.trackRender('MyComponent', 16.5)

// Get performance stats
const stats = monitor.getMetrics()
// { MyComponent: { loadTime: 16.5, size: 0 } }`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">validateSetup()</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Validates setup and returns issues/suggestions.
            </p>
            <CodeBlock
              code={`validateSetup(): { issues: string[]; suggestions: string[] }`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">ConfigPresets</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Pre-built configuration objects for common use cases.
            </p>
            <CodeBlock
              code={`ConfigPresets: {
  minimal: Config
  withMemory: Config
  enterprise: Config
  streaming: Config
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">createConfig(preset, overrides)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Merge a preset with custom configuration overrides.
            </p>
            <CodeBlock
              code={`createConfig(
  preset: keyof ConfigPresets,
  overrides: Partial<Config>
): Config`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">devLog</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Development-only logging utilities.
            </p>
            <CodeBlock
              code={`devLog: {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">QuickStartTemplates</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Code templates as strings for copy-paste usage.
            </p>
            <CodeBlock
              code={`QuickStartTemplates: {
  basic: string
  withMemory: string
  enterprise: string
  // ... more templates
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">showQuickStart(template)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Display a quick start template in the console.
            </p>
            <CodeBlock
              code={`showQuickStart(template: keyof QuickStartTemplates): void`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Best Practices</h2>

        <div className="space-y-4">
          <Callout type="tip">
            <strong>Development Workflow:</strong> Use these helpers during development to catch
            issues early and get guidance on best practices.
          </Callout>

          <div className="space-y-3">
            <h4 className="font-semibold">Recommended Development Setup</h4>
            <CodeBlock
              code={`// In your development entry point
import { validateSetup, devLog } from '@clarity-chat/react'

// Validate setup on app start
const { issues, suggestions } = validateSetup()
if (issues.length > 0) {
  devLog.warn('Setup issues detected:', issues)
  suggestions.forEach(suggestion => devLog.info('💡', suggestion))
}

// Use dev logging throughout your app
devLog.info('App initialized successfully')`}
              language="tsx"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Performance Monitoring</h4>
            <CodeBlock
              code={`// Track component performance
import { DevPerformanceMonitor } from '@clarity-chat/react'

const monitor = DevPerformanceMonitor.getInstance()

function MyComponent() {
  React.useEffect(() => {
    const startTime = performance.now()
    return () => {
      const loadTime = performance.now() - startTime
      monitor.trackRender('MyComponent', loadTime)
    }
  }, [])

  return <div>My Component</div>
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>
    </div>
  )
}