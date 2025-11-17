/**
 * Configuration Builder Example
 * 
 * Demonstrates the builder pattern for configuring Clarity Chat.
 * Shows how to create type-safe configurations with the ChatConfigBuilder.
 */

import * as React from 'react'
import { createChatConfig, getDefaultChatConfig, type ChatConfig } from '@clarity-chat/react'

export function ConfigBuilderExample() {
  const [config, setConfig] = React.useState<ChatConfig>(getDefaultChatConfig())

  // Example 1: Basic configuration
  const basicConfig = React.useMemo(
    () =>
      createChatConfig()
        .withStreaming({
          provider: 'openai',
          endpoint: '/api/chat',
          retryPolicy: 'exponential',
        })
        .build(),
    []
  )

  // Example 2: Full configuration
  const fullConfig = React.useMemo(
    () =>
      createChatConfig()
        .withStreaming({
          provider: 'openai',
          endpoint: '/api/chat/stream',
          retryPolicy: 'exponential',
          maxRetries: 5,
          initialDelay: 1000,
          maxDelay: 30000,
        })
        .withAccessibility({
          screenReader: true,
          highContrast: false,
          keyboardShortcuts: true,
          focusManagement: true,
          ariaLabels: true,
        })
        .withPersistence({
          storage: 'indexeddb',
          maxHistory: 1000,
          autoSave: true,
          saveInterval: 5000,
          encryption: false,
        })
        .withMarkdown({
          enableKaTeX: true,
          enableMermaid: true,
          enableSyntaxHighlight: true,
          codeTheme: 'dark',
        })
        .withSearch({
          enableFuzzySearch: true,
          enableAdvancedFilters: true,
          maxResults: 100,
        })
        .withExport({
          formats: ['pdf', 'markdown', 'json', 'html'],
          defaultFormat: 'markdown',
          includeMetadata: true,
          includeImages: true,
        })
        .build(),
    []
  )

  // Example 3: Custom configuration
  const customConfig = React.useMemo(
    () =>
      createChatConfig()
        .withStreaming({
          provider: 'anthropic',
          endpoint: '/api/anthropic/chat',
          retryPolicy: 'exponential',
        })
        .withPersistence({
          storage: 'localstorage',
          maxHistory: 100,
        })
        .build(),
    []
  )

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Configuration Builder Examples</h1>

      {/* Basic Config */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Configuration</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>{JSON.stringify(basicConfig, null, 2)}</code>
        </pre>
      </section>

      {/* Full Config */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Configuration</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>{JSON.stringify(fullConfig, null, 2)}</code>
        </pre>
      </section>

      {/* Custom Config */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Configuration</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>{JSON.stringify(customConfig, null, 2)}</code>
        </pre>
      </section>

      {/* Interactive Config Builder */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Builder</h2>
        <div className="space-y-4">
          <button
            onClick={() => setConfig(fullConfig)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Use Full Config
          </button>
          <button
            onClick={() => setConfig(basicConfig)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
          >
            Use Basic Config
          </button>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
            <code>{JSON.stringify(config, null, 2)}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}

export default ConfigBuilderExample
