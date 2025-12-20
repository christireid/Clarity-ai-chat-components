/**
 * Component Demo Harness
 *
 * Comprehensive manual validation harness for all Clarity Chat components and hooks.
 * This file tests every public API export from @clarity-chat/react.
 *
 * @see /DEMO_HARNESS_TEST_PLAN.md for the full test matrix
 * @see /DEMO_HARNESS_TEST_LOG.md for test results
 */

import { useState, useCallback, useRef, useEffect } from 'react'

// === Primitives (from @clarity-chat/primitives) ===
import { Button, Input, Card, Badge } from '@clarity-chat/primitives'

// === Core Components ===
import {
  // Chat Components
  ChatInput,
  ChatWindow,
  FloatingChatWidget,

  // Message Components
  StreamingMessage,
  ThinkingIndicator,
  TypingIndicator,

  // AI Components
  Citation,
  MarkdownRendererEnhanced,
  EnhancedMarkdownRenderer,
  CodeBlock,
  StreamingCodeBlock,
  EnhancedCodeBlock,

  // Feedback Components
  ErrorBoundary,
  NetworkStatus,

  // Token Components
  TokenCounter,

  // Export Components
  ExportDialog,

  // Search Components
  MessageSearch,

  // Prompt Components
  FollowUpSuggestions,
  PromptSuggestions,

  // Message Components
  CitationCard,

  // Input Components
  VoiceInput,

  // UI Components
  EmptyChatState,

  // Toast System
  ToastProvider,
  useToast,

  // Providers
  ThemeProvider,
  TokenBudgetProvider,
  LicenseProvider,
  LicenseGate,

  // === Hooks ===
  useAutoScroll,
  useTokenTracker,
  useTheme,
  useTokenBudget,
  useKeyboardShortcuts,
  useClipboard,
  useLocalStorage,
  useRetryWithBackoff,
  useThrottledCallback,
  useReducedMotion,

  // License Hooks
  useLicenseStatus,
  useIsLicensed,

  // Utilities
  cn,
} from '@clarity-chat/react'

// Import styles
import '@clarity-chat/react/dist/styles/index.css'

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  updatedAt: Date
  status: 'sent' | 'pending' | 'error'
}

// ============================================================================
// NAVIGATION
// ============================================================================

type Section =
  | 'overview'
  | 'core-chat'
  | 'ai-components'
  | 'feedback'
  | 'token-export'
  | 'search-prompts'
  | 'providers'
  | 'hooks'

const sections: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'core-chat', label: 'Core Chat' },
  { id: 'ai-components', label: 'AI Components' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'token-export', label: 'Token & Export' },
  { id: 'search-prompts', label: 'Search & Prompts' },
  { id: 'providers', label: 'Providers' },
  { id: 'hooks', label: 'Hooks' },
]

// ============================================================================
// MOCK DATA
// ============================================================================

const sampleMessages: Message[] = [
  {
    id: '1',
    chatId: 'demo',
    role: 'user',
    content: 'Hello! Can you help me understand React hooks?',
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(Date.now() - 60000),
    status: 'sent',
  },
  {
    id: '2',
    chatId: 'demo',
    role: 'assistant',
    content: `# React Hooks Overview

React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Common Hooks

1. **useState** - State management
2. **useEffect** - Side effects
3. **useContext** - Context consumption
4. **useRef** - Mutable references

\`\`\`typescript
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

> Hooks can only be called at the top level of a function component.`,
    createdAt: new Date(Date.now() - 30000),
    updatedAt: new Date(Date.now() - 30000),
    status: 'sent',
  },
]

const sampleMarkdown = `
# Markdown Demo

This is a **bold** and *italic* text with \`inline code\`.

## Code Block

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| Tables | Supported |
| Lists | Supported |
| Links | [Supported](https://example.com) |

## Task List

- [x] Completed task
- [ ] Pending task
`

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function OverviewSection() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Component Demo Harness</h2>
        <p className="text-muted-foreground">
          This harness validates all Clarity Chat components and hooks from the
          public API. Navigate through sections to test each component.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">37</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">25</div>
            <div className="text-sm text-muted-foreground">Hooks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">7</div>
            <div className="text-sm text-muted-foreground">Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Sections</div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => toast.success('Success toast works!', 'Toast Test')}
        >
          Test Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error('Error toast works!', 'Error Test')}
        >
          Test Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('Info toast works!', 'Info Test')}
        >
          Test Info Toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.warning('Warning toast works!', 'Warning Test')}
        >
          Test Warning Toast
        </Button>
      </div>
    </div>
  )
}

function CoreChatSection() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFloatingWidget, setShowFloatingWidget] = useState(false)
  const [showStreamingDemo, setShowStreamingDemo] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content: inputValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      chatId: 'demo',
      role: 'assistant',
      content: `I received your message: "${userMessage.content}". This is a demo response.`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }, [inputValue])

  // Streaming demo
  useEffect(() => {
    if (!showStreamingDemo) {
      setStreamedContent('')
      return
    }

    const fullText =
      'This is a streaming message demonstration. Watch as the text appears character by character, simulating a real AI response stream.'
    let index = 0

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setStreamedContent(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [showStreamingDemo])

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Core Chat Components</h2>

      {/* ChatInput */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ChatInput</h3>
        <div className="space-y-4">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <Badge>Value: {inputValue.length} chars</Badge>
            <Badge variant={isLoading ? 'warning' : 'success'}>
              {isLoading ? 'Loading' : 'Ready'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* ChatWindow */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ChatWindow</h3>
        <div className="h-[400px] border rounded-lg overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={(content) => {
              setInputValue(content)
              handleSend()
            }}
          />
        </div>
      </Card>

      {/* Message Indicators */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Message Indicators</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              ThinkingIndicator
            </p>
            <ThinkingIndicator />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              TypingIndicator
            </p>
            <TypingIndicator />
          </div>
        </div>
      </Card>

      {/* StreamingMessage */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">StreamingMessage</h3>
        <Button
          onClick={() => setShowStreamingDemo(!showStreamingDemo)}
          className="mb-4"
        >
          {showStreamingDemo ? 'Stop Streaming' : 'Start Streaming Demo'}
        </Button>
        {showStreamingDemo && (
          <div className="p-4 bg-muted rounded-lg">
            <StreamingMessage
              content={streamedContent}
              isStreaming={streamedContent.length < 150}
            />
          </div>
        )}
      </Card>

      {/* FloatingChatWidget */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">FloatingChatWidget</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The floating widget appears in the bottom-right corner when enabled.
        </p>
        <Button onClick={() => setShowFloatingWidget(!showFloatingWidget)}>
          {showFloatingWidget ? 'Hide Widget' : 'Show Widget'}
        </Button>
        {showFloatingWidget && (
          <FloatingChatWidget
            title="Chat Assistant"
            subtitle="How can I help you today?"
          />
        )}
      </Card>
    </div>
  )
}

function AIComponentsSection() {
  const [showEnhancedCode, setShowEnhancedCode] = useState(false)
  const { copy, copied } = useClipboard()

  const sampleCode = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage
console.log(fibonacci(10)); // 55`

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">AI Components</h2>

      {/* Citation */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Citation</h3>
        <Citation
          source={{
            documentName: 'React Hooks Reference',
            text: 'Hooks let you use different React features from your components.',
            relevanceScore: 0.95,
            url: 'https://react.dev/reference/react/hooks',
          }}
          index={1}
        />
      </Card>

      {/* CitationCard */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">CitationCard</h3>
        <CitationCard
          citation={{
            id: 'cite-1',
            url: 'https://react.dev/reference/react/hooks',
            source: 'React Hooks Reference',
            chunkText:
              'Hooks let you use different React features from your components.',
            confidence: 0.92,
          }}
          showConfidence
          onSourceClick={(url) => window.open(url, '_blank')}
        />
      </Card>

      {/* MarkdownRendererEnhanced */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">MarkdownRendererEnhanced</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MarkdownRendererEnhanced content={sampleMarkdown} />
        </div>
      </Card>

      {/* EnhancedMarkdownRenderer */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EnhancedMarkdownRenderer</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <EnhancedMarkdownRenderer content={sampleMarkdown} />
        </div>
      </Card>

      {/* CodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">CodeBlock</h3>
        <CodeBlock language="typescript" showLineNumbers title="fibonacci.ts">
          {sampleCode}
        </CodeBlock>
      </Card>

      {/* StreamingCodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">StreamingCodeBlock</h3>
        <StreamingCodeBlock
          code={sampleCode}
          language="typescript"
          isStreaming={false}
        />
      </Card>

      {/* EnhancedCodeBlock */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EnhancedCodeBlock</h3>
        <Button
          onClick={() => setShowEnhancedCode(!showEnhancedCode)}
          className="mb-4"
        >
          {showEnhancedCode ? 'Fold' : 'Unfold'} Code
        </Button>
        <EnhancedCodeBlock
          code={sampleCode}
          language="typescript"
          filename="fibonacci.ts"
          showLineNumbers
          enableFolding
          initiallyFolded={!showEnhancedCode}
        />
      </Card>
    </div>
  )
}

function FeedbackSection() {
  const [showError, setShowError] = useState(false)

  // Component that throws an error
  const ErrorComponent = () => {
    if (showError) {
      throw new Error('This is a test error from ErrorComponent')
    }
    return <div>No error</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Feedback Components</h2>

      {/* NetworkStatus */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">NetworkStatus</h3>
        <div className="flex items-center gap-4">
          <NetworkStatus />
          <span className="text-sm text-muted-foreground">
            Shows online/offline status based on navigator.onLine
          </span>
        </div>
      </Card>

      {/* ErrorBoundary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ErrorBoundary</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button to trigger an error and see the ErrorBoundary
          fallback.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowError(true)}
          className="mb-4"
        >
          Trigger Error
        </Button>
        <div className="border rounded-lg p-4">
          <ErrorBoundary
            fallback={(error) => (
              <div className="text-center p-4">
                <p className="text-destructive font-semibold mb-2">
                  Error Caught!
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error.message}
                </p>
                <Button size="sm" onClick={() => setShowError(false)}>
                  Reset
                </Button>
              </div>
            )}
          >
            <ErrorComponent />
          </ErrorBoundary>
        </div>
      </Card>

      {/* EmptyChatState */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">EmptyChatState</h3>
        <div className="border rounded-lg p-8">
          <EmptyChatState
            onStartChat={() => console.log('Start chat clicked')}
            onSuggestionSelect={(suggestion) =>
              console.log('Selected:', suggestion)
            }
            showSuggestions
          />
        </div>
      </Card>
    </div>
  )
}

function TokenExportSection() {
  const [showExport, setShowExport] = useState(false)
  const {
    tokens: totalTokens,
    addMessage,
    clear,
  } = useTokenTracker({ modelName: 'gpt-4-turbo' })

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Token & Export Components</h2>

      {/* TokenCounter */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenCounter</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <TokenCounter
              currentTokens={totalTokens}
              maxTokens={8000}
              costPerToken={0.00003}
              showCost
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() =>
                addMessage({
                  role: 'user',
                  content: 'Test message with some content to count tokens.',
                })
              }
            >
              Add Tokens
            </Button>
            <Button size="sm" variant="outline" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* TokenCounter Variants */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenCounter Variants</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Small</p>
            <TokenCounter currentTokens={100} maxTokens={1000} size="sm" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Medium (default)
            </p>
            <TokenCounter currentTokens={500} maxTokens={1000} size="md" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Large</p>
            <TokenCounter currentTokens={800} maxTokens={1000} size="lg" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Warning State (80%+)
            </p>
            <TokenCounter currentTokens={850} maxTokens={1000} />
          </div>
        </div>
      </Card>

      {/* ExportDialog */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ExportDialog</h3>
        <Button onClick={() => setShowExport(true)}>Open Export Dialog</Button>
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          onExport={async (options) => {
            console.log('Export options:', options)
            setShowExport(false)
          }}
          resourceType="chat"
          resourceName="Demo Conversation"
        />
      </Card>
    </div>
  )
}

function SearchPromptsSection() {
  const [messages] = useState<Message[]>(sampleMessages)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  const followUpSuggestions = [
    {
      id: '1',
      title: 'Tell me more about React',
      description: 'Learn more details',
    },
    {
      id: '2',
      title: 'What are the best practices?',
      description: 'Industry standards',
    },
    { id: '3', title: 'Show me an example', description: 'Code samples' },
  ]

  const promptSuggestions = [
    {
      id: '1',
      text: 'How do I use useState?',
      type: 'starter' as const,
      category: 'React',
    },
    {
      id: '2',
      text: 'Explain useEffect',
      type: 'starter' as const,
      category: 'React',
    },
    {
      id: '3',
      text: 'What is TypeScript?',
      type: 'starter' as const,
      category: 'General',
    },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Search & Prompts Components</h2>

      {/* MessageSearch */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">MessageSearch</h3>
        <MessageSearch
          messages={messages as any}
          onResultsChange={(results) =>
            setFilteredMessages(results as Message[])
          }
          placeholder="Search messages..."
        />
        {filteredMessages.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">
              Found {filteredMessages.length} message(s)
            </p>
            {filteredMessages.map((m) => (
              <div key={m.id} className="text-sm truncate">
                {m.content.slice(0, 100)}...
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* FollowUpSuggestions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">FollowUpSuggestions</h3>
        <FollowUpSuggestions
          suggestions={followUpSuggestions}
          onSelect={(suggestion) => console.log('Selected:', suggestion)}
          title="Follow-up Questions"
        />
      </Card>

      {/* PromptSuggestions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">PromptSuggestions</h3>
        <PromptSuggestions
          suggestions={promptSuggestions}
          onSelect={(suggestion) => console.log('Selected prompt:', suggestion)}
          layout="chips"
        />
      </Card>

      {/* VoiceInput */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">VoiceInput</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Requires microphone permission. Click to start recording.
        </p>
        <VoiceInput
          onTranscript={(text) => console.log('Transcript:', text)}
          onError={(error) => console.error('Voice error:', error)}
        />
      </Card>
    </div>
  )
}

function ProvidersSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Providers</h2>

      {/* ThemeProvider (already wrapping app) */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">ThemeProvider</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ThemeProvider wraps the entire app. Use useTheme to access theme
          context.
        </p>
        <ThemeDemo />
      </Card>

      {/* TokenBudgetProvider */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">TokenBudgetProvider</h3>
        <TokenBudgetProvider model="gpt-4-turbo">
          <TokenBudgetDemo />
        </TokenBudgetProvider>
      </Card>

      {/* LicenseProvider */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">LicenseProvider & LicenseGate</h3>
        <LicenseProvider licenseKey="demo-license-key">
          <LicenseDemo />
        </LicenseProvider>
      </Card>
    </div>
  )
}

function ThemeDemo() {
  const { mode, toggleMode, setPreset, availablePresets } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={toggleMode}>Toggle Mode (Current: {mode})</Button>
        {availablePresets.slice(0, 3).map((preset) => (
          <Button
            key={preset}
            variant="outline"
            onClick={() => setPreset(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Current mode: {mode} | Available presets: {availablePresets.length}
      </p>
    </div>
  )
}

function TokenBudgetDemo() {
  const budget = useTokenBudget()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>Model: {budget.model || 'Not set'}</div>
        <div>Config: {JSON.stringify(budget.config).slice(0, 50)}...</div>
      </div>
      <p className="text-sm text-muted-foreground">
        TokenBudgetProvider provides configuration context for token management.
      </p>
    </div>
  )
}

function LicenseDemo() {
  const isLicensed = useIsLicensed()
  const status = useLicenseStatus()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge variant={isLicensed ? 'success' : 'warning'}>
          {isLicensed ? 'Licensed' : 'Unlicensed'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Status: {status?.status || 'unknown'}
        </span>
      </div>
      <LicenseGate
        requiredPlan="pro"
        fallback={
          <p className="text-sm text-muted-foreground">
            Premium feature locked (requires Pro plan)
          </p>
        }
      >
        <p className="text-sm text-green-600">Premium feature unlocked!</p>
      </LicenseGate>
    </div>
  )
}

function HooksSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Hooks</h2>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useClipboard</h3>
        <ClipboardDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useLocalStorage</h3>
        <LocalStorageDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useKeyboardShortcuts</h3>
        <KeyboardShortcutsDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useThrottledCallback</h3>
        <ThrottleDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useRetryWithBackoff</h3>
        <RetryDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useReducedMotion</h3>
        <ReducedMotionDemo />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">useAutoScroll</h3>
        <AutoScrollDemo />
      </Card>
    </div>
  )
}

function ClipboardDemo() {
  const { copy, copied } = useClipboard()
  const textToCopy = 'Hello from Clarity Chat!'

  return (
    <div className="flex items-center gap-4">
      <code className="bg-muted px-2 py-1 rounded text-sm">{textToCopy}</code>
      <Button size="sm" onClick={() => copy(textToCopy)}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  )
}

function LocalStorageDemo() {
  const [value, setValue] = useLocalStorage('demo-key', 'initial value')

  return (
    <div className="space-y-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to save to localStorage"
      />
      <p className="text-sm text-muted-foreground">Stored value: {value}</p>
    </div>
  )
}

function KeyboardShortcutsDemo() {
  const [lastKey, setLastKey] = useState<string | null>(null)

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setLastKey('Mod+K'),
      description: 'Command palette',
    },
    {
      key: 'escape',
      callback: () => setLastKey('Escape'),
      description: 'Close modal',
    },
  ])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Try pressing Cmd/Ctrl+K or Escape
      </p>
      {lastKey && <Badge variant="secondary">Last pressed: {lastKey}</Badge>}
    </div>
  )
}

function ThrottleDemo() {
  const [count, setCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)

  const throttledIncrement = useThrottledCallback(() => {
    setThrottledCount((c) => c + 1)
  }, 500)

  const handleClick = () => {
    setCount((c) => c + 1)
    throttledIncrement()
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleClick}>Click rapidly!</Button>
      <div className="flex gap-4 text-sm">
        <span>Clicks: {count}</span>
        <span>Throttled calls: {throttledCount}</span>
      </div>
    </div>
  )
}

function RetryDemo() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [attemptCount, setAttemptCount] = useState(0)

  const {
    execute,
    isRetrying,
    attempt,
    reset: resetRetry,
  } = useRetryWithBackoff({
    maxRetries: 3,
    baseDelay: 500,
    onRetry: (attemptNum, delay, error) => {
      console.log(`Retry ${attemptNum} after ${delay}ms:`, error.message)
    },
  })

  const handleExecute = async () => {
    setStatus('loading')
    setAttemptCount(0)
    try {
      await execute(async () => {
        setAttemptCount((c) => c + 1)
        // Fail first 2 attempts, succeed on 3rd
        if (attemptCount < 2) {
          throw new Error('Simulated failure')
        }
        return 'Success!'
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setAttemptCount(0)
    resetRetry()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleExecute} disabled={isRetrying}>
          {isRetrying ? 'Retrying...' : 'Execute with Retry'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="flex gap-4 text-sm">
        <Badge
          variant={
            status === 'success'
              ? 'success'
              : status === 'error'
                ? 'destructive'
                : 'secondary'
          }
        >
          Status: {status}
        </Badge>
        <span>Attempt: {attempt}</span>
        <span>Calls: {attemptCount}</span>
      </div>
    </div>
  )
}

function ReducedMotionDemo() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        System prefers reduced motion: {prefersReducedMotion ? 'Yes' : 'No'}
      </p>
      <div
        className={cn(
          'w-16 h-16 bg-primary rounded-lg',
          !prefersReducedMotion && 'animate-bounce'
        )}
      />
    </div>
  )
}

function AutoScrollDemo() {
  const [items, setItems] = useState<string[]>([])
  const { scrollRef, scrollToBottom, isNearBottom } = useAutoScroll({
    dependencies: [items],
  })

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      `Item ${prev.length + 1} - ${new Date().toLocaleTimeString()}`,
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button size="sm" onClick={addItem}>
          Add Item
        </Button>
        <Button size="sm" variant="outline" onClick={scrollToBottom}>
          Scroll to Bottom
        </Button>
        <Badge variant={isNearBottom ? 'success' : 'secondary'}>
          {isNearBottom ? 'Near bottom' : 'Not near bottom'}
        </Badge>
      </div>
      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="h-40 overflow-y-auto border rounded-lg p-2 space-y-1"
      >
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click "Add Item" to test auto-scroll
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="text-sm bg-muted px-2 py-1 rounded">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================

function ComponentDemoApp() {
  const [activeSection, setActiveSection] = useState<Section>('overview')

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />
      case 'core-chat':
        return <CoreChatSection />
      case 'ai-components':
        return <AIComponentsSection />
      case 'feedback':
        return <FeedbackSection />
      case 'token-export':
        return <TokenExportSection />
      case 'search-prompts':
        return <SearchPromptsSection />
      case 'providers':
        return <ProvidersSection />
      case 'hooks':
        return <HooksSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Component Harness</h1>
              <p className="text-sm text-muted-foreground">
                Manual validation for all Clarity Chat components
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <NetworkStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary
          fallback={(error) => (
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Section Error
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message}
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </Card>
          )}
        >
          {renderSection()}
        </ErrorBoundary>
      </main>
    </div>
  )
}

// Wrap in all required providers
function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 max-w-md text-center">
            <h1 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Card>
        </div>
      )}
    >
      <ThemeProvider>
        <ToastProvider>
          <LicenseProvider licenseKey="demo-harness-key">
            <ComponentDemoApp />
          </LicenseProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
