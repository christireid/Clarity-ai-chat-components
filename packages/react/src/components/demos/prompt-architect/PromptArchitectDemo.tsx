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
import { cn } from '@clarity-chat/primitives'
import { usePromptArchitect } from './hooks/usePromptArchitect'
import { PromptEditor } from './components/PromptEditor'
import { VariableForm } from './components/VariableForm'
import { PreviewPane } from './components/PreviewPane'
import { TokenBadge } from './components/TokenBadge'
import { PresetSelector } from './components/PresetSelector'
import { VersionSelector } from './components/VersionSelector'
import { MODEL_CONFIGS } from './types'
import type { CoreMessage } from '../../../hooks/chat/use-chat-enhanced'

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

/** API error types for retry logic */
interface ApiError extends Error {
  status?: number
  isRetryable: boolean
}

/**
 * Check if an error is retryable based on status code
 */
function isRetryableError(status: number): boolean {
  // Retry on: rate limits (429), server errors (500, 502, 503, 504), or network issues
  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  )
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Parse error response from Gemini API
 */
function parseApiError(status: number, errorText: string): string {
  try {
    const parsed = JSON.parse(errorText)
    if (parsed.error?.message) {
      return parsed.error.message
    }
  } catch {
    // Return raw error text if not JSON
  }

  // Map common status codes to user-friendly messages
  switch (status) {
    case 400:
      return 'Invalid request. Please check your prompt format.'
    case 401:
      return 'Invalid API key. Please check your Gemini API key.'
    case 403:
      return 'Access denied. Your API key may not have permission for this model.'
    case 404:
      return 'Model not found. Please select a valid model.'
    case 429:
      return 'Rate limit exceeded. Please wait a moment and try again.'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. The API is temporarily unavailable.'
    default:
      return errorText || `API error (${status})`
  }
}

/**
 * Call Gemini API with retry logic and exponential backoff
 */
async function callGeminiAPI(
  apiKey: string,
  messages: CoreMessage[],
  model: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const maxRetries = 3
  const baseDelay = 1000 // 1 second

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

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check for abort before making request
      if (signal?.aborted) {
        throw new DOMException('Request was cancelled', 'AbortError')
      }

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
          signal,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        const errorMessage = parseApiError(response.status, errorText)

        // Check if we should retry
        if (isRetryableError(response.status) && attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
          console.warn(
            `[PromptArchitect] API error (${response.status}), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
          )
          await sleep(delay)
          continue
        }

        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let fullText = ''

      try {
        while (true) {
          // Check for abort during streaming
          if (signal?.aborted) {
            reader.cancel().catch(() => {
              // Ignore cancellation errors
            })
            throw new DOMException('Request was cancelled', 'AbortError')
          }

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
    } catch (error) {
      // Don't retry on abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if it's a network error and we should retry
      if (
        error instanceof TypeError &&
        error.message.includes('fetch') &&
        attempt < maxRetries
      ) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(
          `[PromptArchitect] Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(delay)
        continue
      }

      // If not retryable, throw immediately
      if (attempt >= maxRetries) {
        throw lastError
      }
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError ?? new Error('Unknown error')
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

  // Abort controller for cancelling streaming
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      // Cmd/Ctrl+Enter to run prompt
      if (isMod && e.key === 'Enter' && !isRunning) {
        e.preventDefault()
        // Trigger run - will be defined below
        document
          .querySelector<HTMLButtonElement>('[aria-label="Run prompt"]')
          ?.click()
      }

      // Escape to stop streaming or clear
      if (e.key === 'Escape') {
        if (isRunning) {
          abortControllerRef.current?.abort()
          setIsRunning(false)
          setStreamingContent('')
        } else if (previewMessages.length > 0) {
          setPreviewMessages([])
          setLastError(null)
        }
      }

      // Cmd/Ctrl+S to save version (prevent browser save dialog)
      if (isMod && e.key === 's') {
        e.preventDefault()
        saveVersion(`Version ${state.versions.length + 1}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, previewMessages.length, saveVersion, state.versions.length])

  // Run prompt
  const handleRunPrompt = React.useCallback(async () => {
    if (isRunning) return

    // Create abort controller for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

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
        // Call Gemini API with abort signal
        const response = await callGeminiAPI(
          apiKey,
          messagesArray,
          state.selectedModel,
          setStreamingContent,
          controller.signal
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
        'flex flex-col h-full min-h-[500px] lg:min-h-[600px] bg-background rounded-xl border border-border overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-foreground">
            <span className="hidden sm:inline">🏗️ </span>Prompt Architect
            <span className="hidden sm:inline"> Studio</span>
          </h1>
          {!apiKey && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className={cn(
              'px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-muted transition-colors'
            )}
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main content - split pane (stacked on mobile, side-by-side on desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left pane - Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-border overflow-hidden min-h-[300px] lg:min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-b border-border bg-muted/20 overflow-x-auto">
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
          <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
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
        <div className="w-full lg:w-1/2 flex flex-col overflow-hidden min-h-[250px] lg:min-h-0">
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
      <footer className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-t border-border bg-muted/30">
        {/* Left side - controls */}
        <div className="flex items-center gap-2 sm:gap-4 order-1">
          {/* Model selector */}
          <select
            value={state.selectedModel}
            onChange={(e) => setModel(e.target.value)}
            className={cn(
              'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md',
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
          <label className="hidden sm:flex items-center gap-2 cursor-pointer">
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
              JSON
            </span>
          </label>
        </div>

        {/* Center - Token counter (hidden on mobile) */}
        <div className="hidden sm:block order-2">
          <TokenBadge stats={state.tokenStats} compact />
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-2 order-3">
          {/* Missing variables warning (hidden on mobile) */}
          {!hasAllRequiredVariables && missingVariables.length > 0 && (
            <span className="hidden md:inline text-xs text-yellow-600 dark:text-yellow-400">
              Missing: {missingVariables.slice(0, 2).join(', ')}
              {missingVariables.length > 2 &&
                ` +${missingVariables.length - 2}`}
            </span>
          )}

          <button
            type="button"
            onClick={handleClear}
            disabled={previewMessages.length === 0 && !isRunning}
            aria-label="Clear conversation"
            className={cn(
              'px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg',
              'border border-border',
              'hover:bg-muted transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleRunPrompt}
            disabled={isRunning}
            aria-label={isRunning ? 'Running prompt' : 'Run prompt'}
            className={cn(
              'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-1 sm:gap-2'
            )}
          >
            {isRunning ? (
              <>
                <span
                  className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Running...</span>
                <span className="sm:hidden">Run</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">▶</span>
                <span className="hidden sm:inline">Run Prompt</span>
                <span className="sm:hidden">Run</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default PromptArchitectDemo
