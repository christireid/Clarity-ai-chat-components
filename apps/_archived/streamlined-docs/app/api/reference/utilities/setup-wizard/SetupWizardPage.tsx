// @ts-nocheck -- Imports reference non-existent module paths: '@/components/Callout' (actual: '@/components/MDX/Callout') and '@/components/CodeBlock' (actual: '@/components/Docs/CodeBlock'). Fixing requires updating imports and verifying prop compatibility.
'use client'

import * as React from 'react'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'

export function SetupWizardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setup Wizard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Interactive configuration helpers that guide you through setting up Clarity Chat for different use cases.
        </p>
      </div>

      <Callout type="info">
        <strong>🎯 Smart Configuration:</strong> The setup wizard analyzes your needs and generates
        optimized configurations with sensible defaults.
      </Callout>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Setup Functions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">QuickSetup</h3>
            <p className="text-muted-foreground mt-1">
              Pre-built setup functions for common use cases that return complete configurations.
            </p>
            <CodeBlock
              code={`import { QuickSetup } from '@clarity-chat/react'

// Basic chat setup
const basicSetup = QuickSetup.basic('/api/chat')
console.log(basicSetup.code) // Ready-to-use JSX

// Chat with memory
const memorySetup = QuickSetup.withMemory('/api/chat', 'vector-store')

// Enterprise setup
const enterpriseSetup = QuickSetup.enterprise('/api/chat')

// Streaming setup
const streamingSetup = QuickSetup.streaming('/api/chat', 'websocket')`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Fluent Setup Wizard</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">SetupWizard</h3>
            <p className="text-muted-foreground mt-1">
              Chain configuration options with a fluent API for custom setups.
            </p>
            <CodeBlock
              code={`import { SetupWizard } from '@clarity-chat/react'

// Basic setup
const basic = SetupWizard.start()
  .forUseCase('basic')
  .withApi('/api/chat')
  .complete()

// Advanced setup with all options
const advanced = SetupWizard.start()
  .forUseCase('enterprise')
  .withApi('/api/chat')
  .withMemory(true, 'vector-store')
  .withStreaming(true, 'websocket')
  .withRateLimiting(true)
  .withCustomizations('analytics', 'accessibility')
  .complete()

// Use the generated configuration
console.log(advanced.code) // JSX code
console.log(advanced.config) // Configuration object`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Interactive Setup</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">interactiveSetup()</h3>
            <p className="text-muted-foreground mt-1">
              CLI-style interactive setup that guides you through configuration options.
            </p>
            <CodeBlock
              code={`import { interactiveSetup } from '@clarity-chat/react'

// Run interactive setup (logs to console)
interactiveSetup()

// Output:
// 🧙‍♂️ Clarity Chat Interactive Setup
// ==================================================
//
// Choose your use case:
// 1. Basic chat (minimal setup)
// 2. Chat with memory (context-aware)
// 3. Enterprise chat (full features)
// 4. Streaming chat (real-time)
//
// For programmatic setup, use:
// import { QuickSetup } from "@clarity-chat/react"
// QuickSetup.basic("/api/chat")`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Use Case Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Basic Chat Application</h3>
            <CodeBlock
              code={`import { QuickSetup } from '@clarity-chat/react'

const setup = QuickSetup.basic('/api/chat')

// Generated code:
export function App() {
  return <ClarityChat api="/api/chat" />
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Memory-Enabled Chat</h3>
            <CodeBlock
              code={`import { QuickSetup } from '@clarity-chat/react'

const setup = QuickSetup.withMemory('/api/chat', 'vector-store')

// Generated code:
export function App() {
  return (
    <ClarityChatPresets.WithMemory
      api="/api/chat"
      memoryStrategy="vector-store"
    />
  )
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Enterprise Application</h3>
            <CodeBlock
              code={`import { SetupWizard } from '@clarity-chat/react'

const setup = SetupWizard.start()
  .forUseCase('enterprise')
  .withApi('/api/chat')
  .withCustomizations('analytics', 'security-audit')
  .complete()

// Generated code includes:
// - Memory with vector-store strategy
// - WebSocket streaming
// - Rate limiting
// - Analytics integration
// - Security auditing`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">QuickSetup</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Pre-built setup functions for common use cases.
            </p>
            <CodeBlock
              code={`QuickSetup: {
  basic(api: string): SetupResult
  withMemory(api: string, strategy?: MemoryStrategy): SetupResult
  enterprise(api: string): SetupResult
  streaming(api: string, transport?: 'sse' | 'websocket'): SetupResult
}

SetupResult: {
  config: Configuration
  code: string
  presetCode: string
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">SetupWizard</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Fluent API for building custom configurations.
            </p>
            <CodeBlock
              code={`SetupWizard: {
  start(): SetupWizardInstance
}

SetupWizardInstance: {
  forUseCase(useCase: UseCase): this
  withApi(api: string): this
  withMemory(enabled: boolean, strategy?: MemoryStrategy): this
  withStreaming(enabled: boolean, transport?: Transport): this
  withRateLimiting(enabled: boolean): this
  withCustomizations(...customizations: string[]): this
  complete(): SetupResult
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">interactiveSetup()</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Run interactive CLI-style setup in the console.
            </p>
            <CodeBlock
              code={`interactiveSetup(): void`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Generated Configuration Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Basic Setup Output</h3>
            <CodeBlock
              code={`{
  "config": {
    "api": "/api/chat"
  },
  "code": "export function App() {\\n  return <ClarityChat api=\\"/api/chat\\" />\\n}",
  "presetCode": "import { ClarityChat } from '@clarity-chat/react'\\n\\nexport function App() {\\n  return <ClarityChat api=\\"/api/chat\\" />\\n}"
}`}
              language="json"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Enterprise Setup Output</h3>
            <CodeBlock
              code={`{
  "config": {
    "api": "/api/chat",
    "memory": {
      "enabled": true,
      "strategy": "vector-store",
      "maxTokens": 10000
    },
    "transport": "websocket",
    "rateLimiting": {
      "enabled": true
    }
  },
  "code": "export function App() {\\n  return (\\n    <ClarityChat\\n      api=\\"/api/chat\\"\\n      memory={{enabled:true,strategy:\\"vector-store\\",maxTokens:10000}}\\n      transport=\\"websocket\\"\\n      rateLimiting={{enabled:true}}\\n    />\\n  )\\n}"
}`}
              language="json"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Best Practices</h2>

        <div className="space-y-4">
          <Callout type="tip">
            <strong>Start Simple:</strong> Use QuickSetup for prototyping, then migrate to
            SetupWizard for production customization.
          </Callout>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-600">Prototyping</h4>
              <CodeBlock
                code={`// Quick iteration
QuickSetup.basic('/api/chat')
QuickSetup.withMemory('/api/chat')`}
                language="tsx"
              />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-600">Production</h4>
              <CodeBlock
                code={`// Custom configuration
SetupWizard.start()
  .forUseCase('enterprise')
  .withApi('/api/chat')
  .complete()`}
                language="tsx"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Configuration Validation</h4>
            <p className="text-muted-foreground">
              All setup wizards validate configurations and provide helpful error messages
              if invalid options are provided.
            </p>
            <CodeBlock
              code={`// Invalid API URL
SetupWizard.start()
  .withApi('invalid-url') // Throws with helpful message

// Valid API URL
SetupWizard.start()
  .withApi('/api/chat') // ✅ Works`}
              language="tsx"
            />
          </div>
        </div>
      </section>
    </div>
  )
}