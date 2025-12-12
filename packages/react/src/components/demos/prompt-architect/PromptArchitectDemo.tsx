'use client'

/**
 * Prompt Architect Studio Demo
 *
 * A mini-IDE for prompt engineering that demonstrates the library's
 * prompt construction, variable injection, and template management capabilities.
 *
 * ## Features
 * - Dynamic variable extraction from {{ variable }} syntax
 * - Real-time token counting
 * - Prompt versioning
 * - Structured JSON output mode
 * - Preset prompt library
 * - Live chat preview with streaming
 *
 * @example
 * ```tsx
 * <PromptArchitectDemo />
 *
 * // With API integration
 * <PromptArchitectDemo
 *   apiKey="your-api-key"
 *   defaultModel="gemini-1.5-pro"
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '../../../utils/cn'
import { usePromptArchitect } from './hooks/usePromptArchitect'
import { PromptEditor } from './components/PromptEditor'
import { VariableForm } from './components/VariableForm'
import { PreviewPane } from './components/PreviewPane'
import { TokenBadge } from './components/TokenBadge'
import { PresetSelector } from './components/PresetSelector'
import { VersionSelector } from './components/VersionSelector'
import { MODEL_CONFIGS } from './types'
import type { CoreMessage } from '../../../hooks/use-chat-enhanced'

// =============================================================================
// TYPES
// =============================================================================

export interface PromptArchitectDemoProps {
  /** Gemini API key for live responses */
  apiKey?: string
  /** Default model to use */
  defaultModel?: string
  /** Initial system prompt */
  initialSystemPrompt?: string
  /** Initial user prompt */
  initialUserPrompt?: string
  /** Enable auto-save to localStorage */
  autoSave?: boolean
  /** Custom API endpoint (if not using Gemini) */
  apiEndpoint?: string
  /** Additional class name */
  className?: string
}

// =============================================================================
// GEMINI API INTEGRATION
// =============================================================================

async function callGeminiAPI(
  apiKey: string,
  messages: CoreMessage[],
  model: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  // Convert messages to Gemini format
  const systemMessage = messages.find((m) => m.role === 'system')
  const otherMessages = messages.filter((m) => m.role !== 'system')

  const contents = otherMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const systemInstruction = systemMessage
    ? { parts: [{ text: systemMessage.content }] }
    : undefined

  // Use streaming endpoint
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              fullText += text
              onChunk(fullText)
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullText
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Prompt Architect Studio Demo Component
 */
export function PromptArchitectDemo({
  apiKey,
  defaultModel = 'gemini-1.5-flash',
  initialSystemPrompt,
  initialUserPrompt,
  autoSave = true,
  className,
}: PromptArchitectDemoProps) {
  const {
    state,
    compiledSystemPrompt,
    compiledUserPrompt,
    messagesArray,
    hasAllRequiredVariables,
    missingVariables,
    setSystemPrompt,
    setUserPromptTemplate,
    setVariableValue,
    saveVersion,
    loadVersion,
    deleteVersion,
    loadPreset,
    toggleDebugView,
    setDebugViewMode,
    toggleStructuredOutput,
    setModel,
    clearPreview,
    reset,
  } = usePromptArchitect({
    initialSystemPrompt,
    initialUserPrompt,
    autoSave,
    defaultModel,
  })

  // Streaming state
  const [isRunning, setIsRunning] = React.useState(false)
  const [streamingContent, setStreamingContent] = React.useState('')
  const [previewMessages, setPreviewMessages] = React.useState(
    state.previewMessages
  )
  const [lastError, setLastError] = React.useState<string | null>(null)

  // Run prompt
  const handleRunPrompt = React.useCallback(async () => {
    if (isRunning) return

    // Clear previous state
    setPreviewMessages([])
    setStreamingContent('')
    setLastError(null)
    setIsRunning(true)

    // Add system and user messages to preview
    const newMessages = []
    if (compiledSystemPrompt.trim()) {
      newMessages.push({
        id: `msg-system-${Date.now()}`,
        role: 'system' as const,
        content: compiledSystemPrompt,
        isCompiled: true,
        timestamp: new Date(),
      })
    }
    if (compiledUserPrompt.trim()) {
      newMessages.push({
        id: `msg-user-${Date.now()}`,
        role: 'user' as const,
        content: compiledUserPrompt,
        isCompiled: true,
        timestamp: new Date(),
      })
    }
    setPreviewMessages(newMessages)

    try {
      if (apiKey) {
        // Call Gemini API
        const response = await callGeminiAPI(
          apiKey,
          messagesArray,
          state.selectedModel,
          setStreamingContent
        )

        // Add final assistant message
        setPreviewMessages((prev) => [
          ...prev,
          {
            id: `msg-assistant-${Date.now()}`,
            role: 'assistant' as const,
            content: response,
            isCompiled: true,
            timestamp: new Date(),
          },
        ])
        setStreamingContent('')
      } else {
        // Demo mode - simulate streaming
        const demoResponse = state.structuredOutputMode
          ? `{
  "thinking": "Let me analyze this request step by step...",
  "result": "Based on your prompt, here's a helpful response that demonstrates the Prompt Architect Studio capabilities.",
  "confidence": 0.92
}`
          : `I understand your request! Here's my response based on the prompt you've constructed.

This demo showcases the **Prompt Architect Studio** features:

1. **Variable Extraction** - Your {{ variables }} are automatically detected
2. **Token Counting** - Real-time estimation helps optimize prompts
3. **Version Control** - Save and compare different prompt versions
4. **JSON Mode** - Get structured outputs when enabled

To enable live AI responses, provide a Gemini API key.`

        // Simulate streaming
        for (let i = 0; i < demoResponse.length; i++) {
          await new Promise((r) => setTimeout(r, 15))
          setStreamingContent(demoResponse.slice(0, i + 1))
        }

        // Add final message
        setPreviewMessages((prev) => [
          ...prev,
          {
            id: `msg-assistant-${Date.now()}`,
            role: 'assistant' as const,
            content: demoResponse,
            isCompiled: true,
            timestamp: new Date(),
          },
        ])
        setStreamingContent('')
      }
    } catch (error) {
      setLastError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsRunning(false)
    }
  }, [
    isRunning,
    apiKey,
    messagesArray,
    state.selectedModel,
    state.structuredOutputMode,
    compiledSystemPrompt,
    compiledUserPrompt,
  ])

  // Clear handler
  const handleClear = React.useCallback(() => {
    setPreviewMessages([])
    setStreamingContent('')
    setLastError(null)
    clearPreview()
  }, [clearPreview])

  return (
    <div
      className={cn(
        'flex flex-col h-full min-h-[600px] bg-background rounded-xl border border-border overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">
            🏗️ Prompt Architect Studio
          </h1>
          {!apiKey && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-muted transition-colors'
            )}
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main content - split pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left pane - Editor */}
        <div className="w-1/2 flex flex-col border-r border-border overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
            <PresetSelector onSelect={loadPreset} />
            <VersionSelector
              versions={state.versions}
              activeVersionId={state.activeVersionId}
              onSelect={loadVersion}
              onSave={saveVersion}
              onDelete={deleteVersion}
              isDirty={state.isDirty}
            />
          </div>

          {/* Editors */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <PromptEditor
              label="System Prompt"
              value={state.systemPrompt}
              onChange={setSystemPrompt}
              tokenCount={state.tokenStats.systemPromptTokens}
              placeholder="You are a helpful assistant..."
              minHeight={120}
              maxHeight={200}
            />

            <PromptEditor
              label="User Prompt"
              value={state.userPromptTemplate}
              onChange={setUserPromptTemplate}
              tokenCount={state.tokenStats.userPromptTokens}
              placeholder="Help me with {{ task }}..."
              minHeight={100}
              maxHeight={180}
            />

            <div className="border-t border-border pt-4">
              <VariableForm
                variables={state.extractedVariables}
                values={state.variableValues}
                onChange={setVariableValue}
                showTypeHints
              />
            </div>
          </div>
        </div>

        {/* Right pane - Preview */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <PreviewPane
            messages={previewMessages}
            isStreaming={isRunning && streamingContent.length > 0}
            streamingContent={streamingContent}
            error={lastError}
            showDebugView={state.showDebugView}
            debugViewMode={state.debugViewMode}
            onDebugModeChange={setDebugViewMode}
            onToggleDebugView={toggleDebugView}
            systemPromptTemplate={state.systemPrompt}
            userPromptTemplate={state.userPromptTemplate}
            compiledSystemPrompt={compiledSystemPrompt}
            compiledUserPrompt={compiledUserPrompt}
            variableValues={state.variableValues}
            messagesArray={messagesArray}
          />
        </div>
      </div>

      {/* Footer toolbar */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Model selector */}
          <select
            value={state.selectedModel}
            onChange={(e) => setModel(e.target.value)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md',
              'border border-border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary/50'
            )}
          >
            {MODEL_CONFIGS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          {/* JSON mode toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={state.structuredOutputMode}
              aria-label="Toggle JSON structured output mode"
              onClick={toggleStructuredOutput}
              className={cn(
                'relative inline-flex h-5 w-9 items-center rounded-full',
                'transition-colors duration-200',
                state.structuredOutputMode ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'inline-block h-3 w-3 transform rounded-full bg-white shadow-sm',
                  'transition-transform duration-200',
                  state.structuredOutputMode ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              JSON Mode
            </span>
          </label>
        </div>

        {/* Center - Token counter */}
        <TokenBadge stats={state.tokenStats} compact />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Missing variables warning */}
          {!hasAllRequiredVariables && missingVariables.length > 0 && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              Missing: {missingVariables.slice(0, 2).join(', ')}
              {missingVariables.length > 2 &&
                ` +${missingVariables.length - 2}`}
            </span>
          )}

          <button
            type="button"
            onClick={handleClear}
            disabled={previewMessages.length === 0 && !isRunning}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'border border-border',
              'hover:bg-muted transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleRunPrompt}
            disabled={isRunning}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2'
            )}
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <span>▶</span>
                Run Prompt
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default PromptArchitectDemo
