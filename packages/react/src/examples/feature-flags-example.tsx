/**
 * Feature Flags Example
 *
 * Demonstrates how to use feature flags to opt-out of optional peer dependencies
 * for bundle size optimization.
 *
 * @example
 * ```bash
 * # Disable features via environment variables
 * CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
 * CLARITY_DISABLE_MARKDOWN=true
 * CLARITY_DISABLE_EXPORTS=true
 * ```
 */

'use client'

import * as React from 'react'
import { CodeBlock } from '../components/code/CodeBlock'
import { EnhancedMarkdownRenderer } from '../components/ai/EnhancedMarkdownRenderer'
import {
  exportConversation,
  exportMultipleConversations,
  type Message,
  type ExportOptions,
} from '../utils/export-utils'
import {
  isFeatureEnabled,
  isFeatureAvailable,
  getFeatureFlagSummary,
  logFeatureFlagStatus,
  setFeatureFlags,
} from '../utils/config/feature-flags'

/**
 * Example 1: Check Feature Availability Before Using
 */
export function ConditionalCodeBlock() {
  const syntaxHighlightingAvailable = isFeatureAvailable('syntax-highlighting')

  const code = `
function greet(name: string): string {
  return \`Hello, \${name}!\`
}
  `.trim()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Conditional Code Block</h2>

      {syntaxHighlightingAvailable ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Syntax highlighting is available
          </p>
          <CodeBlock language="typescript" showLineNumbers>
            {code}
          </CodeBlock>
        </div>
      ) : (
        <div>
          <p className="text-sm text-amber-600 mb-2">
            Syntax highlighting is unavailable. Showing plain text.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

/**
 * Example 2: Check Feature Status and Display Info
 */
export function FeatureStatusDisplay() {
  const [summary, setSummary] = React.useState(getFeatureFlagSummary())

  React.useEffect(() => {
    // Refresh summary on mount
    setSummary(getFeatureFlagSummary())
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Feature Status</h2>

      <div className="grid gap-4">
        {Object.entries(summary).map(([feature, status]) => (
          <div
            key={feature}
            className="p-4 border rounded-lg bg-card"
            role="region"
            aria-label={`${feature} feature status`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold capitalize">
                  {feature.replace('-', ' ')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {status.status}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  status.available
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : status.disabled
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                }`}
              >
                {status.available
                  ? 'Available'
                  : status.disabled
                    ? 'Disabled'
                    : 'Unavailable'}
              </div>
            </div>

            {status.missingDependencies.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p className="font-medium">Missing dependencies:</p>
                <ul className="list-disc list-inside mt-1">
                  {status.missingDependencies.map((dep) => (
                    <li key={dep}>{dep}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Example 3: Conditional Markdown Rendering
 */
export function ConditionalMarkdownRenderer() {
  const markdownAvailable = isFeatureAvailable('markdown')

  const content = `
# Markdown Example

This is **bold** and this is *italic*.

## Code Block

\`\`\`javascript
console.log('Hello, World!')
\`\`\`

## List

- Item 1
- Item 2
- Item 3
  `.trim()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Conditional Markdown</h2>

      {markdownAvailable ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Full markdown rendering enabled
          </p>
          <EnhancedMarkdownRenderer content={content} />
        </div>
      ) : (
        <div>
          <p className="text-sm text-amber-600 mb-2">
            Markdown rendering unavailable. Using plain text fallback.
          </p>
          <EnhancedMarkdownRenderer content={content} />
        </div>
      )}
    </div>
  )
}

/**
 * Example 4: Conditional Export Functionality
 */
export function ConditionalExportButton() {
  const batchExportsAvailable = isFeatureAvailable('batch-exports')
  const [exporting, setExporting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const sampleMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello!',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Hi there! How can I help you?',
      timestamp: new Date(),
    },
  ]

  const exportOptions: ExportOptions = {
    format: 'json',
    includeTimestamps: true,
    includeMetadata: true,
  }

  const handleSingleExport = async () => {
    setExporting(true)
    setError(null)
    try {
      const blob = await exportConversation(sampleMessages, exportOptions)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'conversation.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleBatchExport = async () => {
    if (!batchExportsAvailable) {
      setError('Batch exports are not available. Check feature flags.')
      return
    }

    setExporting(true)
    setError(null)
    try {
      const conversations = [
        { id: '1', messages: sampleMessages, title: 'Conversation 1' },
        { id: '2', messages: sampleMessages, title: 'Conversation 2' },
      ]
      const blob = await exportMultipleConversations(
        conversations,
        exportOptions
      )
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'conversations.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Conditional Exports</h2>

      <div className="flex gap-4">
        <button
          onClick={handleSingleExport}
          disabled={exporting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Export Single Conversation'}
        </button>

        <button
          onClick={handleBatchExport}
          disabled={exporting || !batchExportsAvailable}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
          title={
            !batchExportsAvailable
              ? 'Batch exports unavailable. Install jszip or enable feature.'
              : undefined
          }
        >
          {exporting ? 'Exporting...' : 'Export Multiple (Batch)'}
        </button>
      </div>

      {!batchExportsAvailable && (
        <p className="text-sm text-amber-600">
          Batch exports are unavailable. Single exports still work.
        </p>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Example 5: Runtime Feature Flag Configuration
 */
export function RuntimeConfigExample() {
  const [showSettings, setShowSettings] = React.useState(false)
  const [config, setConfig] = React.useState({
    disableSyntaxHighlighting: false,
    disableMarkdown: false,
    disableBatchExports: false,
  })

  const handleApplyConfig = () => {
    setFeatureFlags(config)
    // Force re-render by toggling state
    setShowSettings(false)
    setTimeout(() => setShowSettings(true), 100)
  }

  const handleLogStatus = () => {
    logFeatureFlagStatus()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Runtime Configuration</h2>

      <div className="p-4 border rounded-lg space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.disableSyntaxHighlighting}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  disableSyntaxHighlighting: e.target.checked,
                }))
              }
              className="rounded"
            />
            <span className="text-sm">Disable Syntax Highlighting</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.disableMarkdown}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  disableMarkdown: e.target.checked,
                }))
              }
              className="rounded"
            />
            <span className="text-sm">Disable Markdown</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.disableBatchExports}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  disableBatchExports: e.target.checked,
                }))
              }
              className="rounded"
            />
            <span className="text-sm">Disable Batch Exports</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyConfig}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Apply Configuration
          </button>

          <button
            onClick={handleLogStatus}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Log Status to Console
          </button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
          <p className="font-semibold mb-1">Note:</p>
          <p>
            Runtime configuration takes precedence over environment variables.
            Changes are applied immediately but may require component re-render
            to take effect.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Example 6: Complete Demo
 */
export function FeatureFlagsDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feature Flags Demo</h1>
        <p className="text-muted-foreground">
          Demonstrates how to use feature flags to control optional peer
          dependencies.
        </p>
      </div>

      <FeatureStatusDisplay />
      <ConditionalCodeBlock />
      <ConditionalMarkdownRenderer />
      <ConditionalExportButton />
      <RuntimeConfigExample />

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Environment Variables</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Set these in your .env file to disable features:
        </p>
        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
          {`CLARITY_DISABLE_SYNTAX_HIGHLIGHTING=true
CLARITY_DISABLE_MARKDOWN=true
CLARITY_DISABLE_EXPORTS=true`}
        </pre>
      </div>
    </div>
  )
}

export default FeatureFlagsDemo
