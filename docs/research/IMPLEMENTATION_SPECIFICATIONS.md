# Implementation Specifications

**Version:** 1.0 **Last Updated:** 2026-01-27 **Status:** Consolidated Reference

## Table of Contents

1. [Overview](#overview)
2. [Component Specifications](#component-specifications)
   - [Voice Input Component](#voice-input-component)
   - [Thread Management Component](#thread-management-component)
   - [Tool Calling UI Component](#tool-calling-ui-component)
   - [Streaming Shimmer Component](#streaming-shimmer-component)
   - [Command Palette Enhanced](#command-palette-enhanced)
   - [Token Analytics Dashboard](#token-analytics-dashboard)
   - [Model Selector Component](#model-selector-component)
   - [Multimodal Input Component](#multimodal-input-component)
   - [Reasoning Visualization Component](#reasoning-visualization-component)
   - [Settings Panel Component](#settings-panel-component)
3. [API Refactoring Initiatives](#api-refactoring-initiatives)
   - [Compound Components Migration](#compound-components-migration)
   - [Slot-Based Customization](#slot-based-customization)
4. [Cross-Cutting Concerns](#cross-cutting-concerns)
5. [Implementation Priorities](#implementation-priorities)

---

## Overview

This document consolidates all implementation specifications for the Clarity AI Chat Components
library. It serves as the definitive technical reference for implementing planned features and
improvements.

### Design Principles

- **Composition over Configuration**: Favor flexible composition patterns over rigid configuration
  options
- **Progressive Disclosure**: Start simple, reveal complexity as needed
- **Accessibility First**: WCAG 2.1 AA compliance throughout
- **TypeScript Native**: Full type safety with runtime validation
- **Framework Agnostic Core**: React implementation with portable patterns

### Technical Stack

- **Language**: TypeScript 5.0+
- **UI Framework**: React 18+ (with Hooks)
- **Styling**: CSS-in-JS / Tailwind CSS compatible
- **Validation**: Zod for schema validation
- **State Management**: Zustand for complex state
- **Build Tool**: Vite / Next.js compatible
- **Testing**: Vitest + React Testing Library

---

## Component Specifications

### Voice Input Component

**Priority**: Medium **Status**: Planned **Dependencies**: Multimodal Input Component

#### Overview

Voice-to-text input component with real-time transcription, audio visualization, and multi-provider
support (Browser Web Speech API, OpenAI Whisper, custom endpoints).

#### Core Requirements

**Functional**

- Voice recording with start/stop controls
- Real-time audio visualization (waveform)
- Multi-provider transcription support
- Streaming transcription display
- Error handling and recovery
- Recording time limits and warnings

**Non-Functional**

- <100ms recording start latency
- <500ms transcription streaming start
- Browser microphone permission handling
- Mobile Safari compatibility
- Automatic gain control (AGC) support

#### API Design

```typescript
interface VoiceInputProps {
  // Provider configuration
  provider?: 'browser' | 'whisper' | 'custom'
  whisperConfig?: {
    apiKey: string
    model?: 'whisper-1'
    language?: string
  }
  customProvider?: (audio: Blob) => Promise<string>

  // Behavior
  autoStart?: boolean
  maxDuration?: number // seconds, default 60
  continuous?: boolean // restart on silence

  // Callbacks
  onTranscript?: (text: string, isFinal: boolean) => void
  onError?: (error: VoiceInputError) => void
  onRecordingStateChange?: (isRecording: boolean) => void

  // UI customization
  showVisualization?: boolean
  showTimer?: boolean
  visualizationMode?: 'waveform' | 'bars' | 'minimal'

  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
}

interface VoiceInputError {
  type: 'permission_denied' | 'not_supported' | 'network' | 'unknown'
  message: string
  originalError?: Error
}
```

#### Component Architecture

```
VoiceInput (container)
├── VoiceButton (trigger)
├── AudioVisualizer (canvas)
├── TranscriptDisplay (streaming text)
└── VoiceInputProvider (state management)
```

**State Management**

```typescript
interface VoiceInputState {
  isRecording: boolean
  transcript: string
  interimTranscript: string
  duration: number
  error: VoiceInputError | null
  audioLevel: number // 0-1 for visualization
}
```

#### Implementation Details

**Browser Web Speech API**

```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
recognition.continuous = true
recognition.interimResults = true
recognition.lang = 'en-US'

recognition.onresult = (event) => {
  let interimTranscript = ''
  let finalTranscript = ''

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript
    if (event.results[i].isFinal) {
      finalTranscript += transcript + ' '
    } else {
      interimTranscript += transcript
    }
  }

  onTranscript(finalTranscript || interimTranscript, !!finalTranscript)
}
```

**OpenAI Whisper Integration**

```typescript
async function transcribeWithWhisper(audioBlob: Blob, config: WhisperConfig) {
  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.webm')
  formData.append('model', config.model || 'whisper-1')
  if (config.language) formData.append('language', config.language)

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}` },
    body: formData,
  })

  const result = await response.json()
  return result.text
}
```

**Audio Visualization**

```typescript
function AudioVisualizer({ audioStream }: { audioStream: MediaStream }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;

    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d')!;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        ctx.fillStyle = `hsl(${200 + (dataArray[i] / 255) * 60}, 70%, 50%)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    draw();
    analyzerRef.current = analyzer;

    return () => {
      audioContext.close();
    };
  }, [audioStream]);

  return <canvas ref={canvasRef} width={300} height={100} />;
}
```

#### Accessibility

- Keyboard controls: Space to toggle recording
- Screen reader announcements for recording state
- Visual indicators for non-audio users
- Error messages in accessible alerts
- ARIA live regions for transcript updates

#### Testing Strategy

**Unit Tests**

- Provider switching logic
- Error handling for all error types
- Transcript assembly (interim + final)
- Timer accuracy

**Integration Tests**

- Microphone permission flow
- Audio recording and playback
- Transcription provider integration
- State synchronization

**E2E Tests**

- Full voice input workflow
- Error recovery scenarios
- Mobile device compatibility

#### Open Questions

1. Should we support offline transcription with local models?
2. How to handle language auto-detection?
3. Should we provide audio preprocessing (noise reduction)?
4. Cache transcriptions for reliability?

---

### Thread Management Component

**Priority**: High **Status**: Planned **Dependencies**: None (foundational)

#### Overview

Comprehensive thread/conversation management system with multi-threading support, message CRUD
operations, token tracking, and export/import capabilities. Inspired by Assistant UI's store-based
architecture.

#### Core Requirements

**Functional**

- Create, read, update, delete threads
- Add, edit, delete messages within threads
- Branch conversations at any point
- Token usage tracking per thread
- Thread metadata (title, created/updated timestamps)
- Export threads (JSON, Markdown)
- Import threads from various formats
- Search across threads

**Non-Functional**

- Support 1000+ messages per thread without performance degradation
- <50ms state updates
- Persistent storage (localStorage/IndexedDB)
- Optimistic UI updates

#### API Design

```typescript
// Thread types
interface Thread {
  id: string
  title: string
  messages: Message[]
  metadata: ThreadMetadata
  createdAt: Date
  updatedAt: Date
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string | MultimodalContent[]
  threadId: string
  parentId?: string // for branching
  tokens?: number
  metadata?: Record<string, unknown>
  createdAt: Date
}

interface ThreadMetadata {
  totalTokens: number
  messageCount: number
  model?: string
  tags?: string[]
  starred?: boolean
}

// Provider component
interface ThreadProviderProps {
  children: React.ReactNode
  storage?: 'memory' | 'localStorage' | 'indexedDB' | 'custom'
  customStorage?: ThreadStorage
  onThreadChange?: (thread: Thread) => void
}

// Hook APIs
interface UseThreadReturn {
  thread: Thread | null
  messages: Message[]
  addMessage: (
    content: string | MultimodalContent[],
    role: 'user' | 'assistant'
  ) => Promise<Message>
  updateMessage: (messageId: string, content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  branchAt: (messageId: string) => Promise<Thread>
  isLoading: boolean
  error: Error | null
}

interface UseThreadListReturn {
  threads: Thread[]
  createThread: (title?: string) => Promise<Thread>
  deleteThread: (threadId: string) => Promise<void>
  switchThread: (threadId: string) => Promise<void>
  searchThreads: (query: string) => Thread[]
  exportThread: (threadId: string, format: 'json' | 'markdown') => Promise<string>
  importThread: (data: string, format: 'json' | 'markdown') => Promise<Thread>
}
```

#### Component Architecture

```
ThreadProvider (context provider)
├── useThreadStore (Zustand store)
├── ThreadList (thread switcher UI)
│   ├── ThreadListItem
│   └── CreateThreadButton
├── ThreadHeader (title, metadata)
├── MessageList (virtualized list)
│   ├── MessageItem
│   │   ├── MessageContent
│   │   ├── MessageActions (edit, delete, branch)
│   │   └── TokenBadge
│   └── BranchIndicator
└── ThreadActions (export, delete, star)
```

#### State Management (Zustand Store)

```typescript
interface ThreadStore {
  // State
  threads: Map<string, Thread>
  activeThreadId: string | null
  isLoading: boolean
  error: Error | null

  // Actions
  createThread: (title?: string) => Promise<Thread>
  deleteThread: (threadId: string) => Promise<void>
  updateThread: (threadId: string, updates: Partial<Thread>) => Promise<void>
  switchThread: (threadId: string) => Promise<void>

  addMessage: (threadId: string, message: Omit<Message, 'id' | 'createdAt'>) => Promise<Message>
  updateMessage: (threadId: string, messageId: string, content: string) => Promise<void>
  deleteMessage: (threadId: string, messageId: string) => Promise<void>
  branchAt: (threadId: string, messageId: string) => Promise<Thread>

  // Storage
  persist: () => Promise<void>
  restore: () => Promise<void>
}

const useThreadStore = create<ThreadStore>()(
  persist(
    (set, get) => ({
      threads: new Map(),
      activeThreadId: null,
      isLoading: false,
      error: null,

      createThread: async (title = 'New Conversation') => {
        const thread: Thread = {
          id: generateId(),
          title,
          messages: [],
          metadata: {
            totalTokens: 0,
            messageCount: 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          threads: new Map(state.threads).set(thread.id, thread),
          activeThreadId: thread.id,
        }))

        await get().persist()
        return thread
      },

      addMessage: async (threadId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          threadId,
          createdAt: new Date(),
        }

        set((state) => {
          const thread = state.threads.get(threadId)
          if (!thread) throw new Error('Thread not found')

          const updatedThread = {
            ...thread,
            messages: [...thread.messages, message],
            metadata: {
              ...thread.metadata,
              totalTokens: thread.metadata.totalTokens + (message.tokens || 0),
              messageCount: thread.messages.length + 1,
            },
            updatedAt: new Date(),
          }

          return {
            threads: new Map(state.threads).set(threadId, updatedThread),
          }
        })

        await get().persist()
        return message
      },

      branchAt: async (threadId, messageId) => {
        const originalThread = get().threads.get(threadId)
        if (!originalThread) throw new Error('Thread not found')

        const messageIndex = originalThread.messages.findIndex((m) => m.id === messageId)
        if (messageIndex === -1) throw new Error('Message not found')

        const branchedMessages = originalThread.messages.slice(0, messageIndex + 1)

        const newThread: Thread = {
          id: generateId(),
          title: `${originalThread.title} (Branch)`,
          messages: branchedMessages.map((m) => ({
            ...m,
            id: generateId(),
            threadId: '', // will be set below
          })),
          metadata: {
            totalTokens: branchedMessages.reduce((sum, m) => sum + (m.tokens || 0), 0),
            messageCount: branchedMessages.length,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        newThread.messages.forEach((m) => (m.threadId = newThread.id))

        set((state) => ({
          threads: new Map(state.threads).set(newThread.id, newThread),
          activeThreadId: newThread.id,
        }))

        await get().persist()
        return newThread
      },

      persist: async () => {
        // Implementation depends on storage type
      },

      restore: async () => {
        // Implementation depends on storage type
      },
    }),
    {
      name: 'clarity-threads',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

#### Storage Adapters

```typescript
interface ThreadStorage {
  save(threads: Thread[]): Promise<void>
  load(): Promise<Thread[]>
  clear(): Promise<void>
}

class LocalStorageAdapter implements ThreadStorage {
  private key = 'clarity-threads'

  async save(threads: Thread[]): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(threads))
  }

  async load(): Promise<Thread[]> {
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : []
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key)
  }
}

class IndexedDBAdapter implements ThreadStorage {
  private dbName = 'ClarityThreads'
  private storeName = 'threads'

  async save(threads: Thread[]): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)

    await store.clear()
    for (const thread of threads) {
      await store.add(thread)
    }

    await tx.done
  }

  async load(): Promise<Thread[]> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)
    return await store.getAll()
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clear(): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    await tx.objectStore(this.storeName).clear()
    await tx.done
  }
}
```

#### Export/Import

```typescript
// Markdown export
function exportToMarkdown(thread: Thread): string {
  const lines: string[] = [
    `# ${thread.title}`,
    '',
    `Created: ${thread.createdAt.toLocaleString()}`,
    `Messages: ${thread.metadata.messageCount}`,
    `Total Tokens: ${thread.metadata.totalTokens}`,
    '',
    '---',
    '',
  ]

  for (const message of thread.messages) {
    lines.push(`## ${message.role.toUpperCase()}`)
    lines.push('')
    lines.push(typeof message.content === 'string' ? message.content : '[Multimodal Content]')
    if (message.tokens) {
      lines.push('')
      lines.push(`*Tokens: ${message.tokens}*`)
    }
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

// JSON export
function exportToJSON(thread: Thread): string {
  return JSON.stringify(thread, null, 2)
}

// JSON import
function importFromJSON(data: string): Thread {
  const thread = JSON.parse(data)
  // Validate schema with Zod
  return ThreadSchema.parse(thread)
}
```

#### Accessibility

- Keyboard navigation through thread list
- ARIA labels for thread actions
- Screen reader announcements for new messages
- Focus management when switching threads

#### Testing Strategy

**Unit Tests**

- CRUD operations for threads and messages
- Branching logic
- Token calculation
- Storage adapter implementations

**Integration Tests**

- State persistence and restoration
- Multi-thread scenarios
- Export/import functionality

**Performance Tests**

- 1000+ message thread rendering
- Storage operation benchmarks
- Memory usage profiling

---

### Tool Calling UI Component

**Priority**: High **Status**: Planned **Dependencies**: None

#### Overview

Generative UI component system for visualizing and interacting with AI tool/function calls. Supports
dynamic component registry, streaming status updates, and rich result rendering.

#### Core Requirements

**Functional**

- Display tool call status (pending, running, complete, error)
- Render tool-specific UI components
- Show parameters and results
- Support streaming updates
- Handle errors gracefully
- Tool call history and replay

**Non-Functional**

- <16ms component registration
- Smooth status transitions
- Zero layout shift during streaming
- Custom component hot-swapping

#### API Design

```typescript
// Tool UI Component
interface ToolUIComponent<TParams = unknown, TResult = unknown> {
  name: string
  displayName?: string
  icon?: React.ComponentType
  renderParams?: (params: TParams) => React.ReactNode
  renderResult?: (result: TResult) => React.ReactNode
  renderStreaming?: (partial: Partial<TResult>) => React.ReactNode
  renderError?: (error: Error) => React.ReactNode
}

// Tool call data
interface ToolCall<TParams = unknown, TResult = unknown> {
  id: string
  name: string
  params: TParams
  result?: TResult
  error?: Error
  status: 'pending' | 'running' | 'complete' | 'error'
  startedAt?: Date
  completedAt?: Date
  metadata?: Record<string, unknown>
}

// Registry
interface ToolUIRegistry {
  register<TParams, TResult>(toolName: string, component: ToolUIComponent<TParams, TResult>): void
  unregister(toolName: string): void
  get(toolName: string): ToolUIComponent | undefined
  has(toolName: string): boolean
}

// Main component
interface ToolCallUIProps {
  toolCall: ToolCall
  compact?: boolean
  showTimestamps?: boolean
  onRetry?: (toolCall: ToolCall) => void
  onCancel?: (toolCall: ToolCall) => void
}
```

#### Component Architecture

```
ToolCallProvider (registry + context)
├── ToolCallUI (main component)
│   ├── ToolHeader (name, icon, status badge)
│   ├── ToolParams (renders params UI)
│   ├── ToolProgress (for running status)
│   ├── ToolResult (renders result UI)
│   ├── ToolError (error display with retry)
│   └── ToolActions (retry, cancel, copy)
└── DefaultToolUI (fallback renderer)
```

#### Registry Implementation

```typescript
const toolRegistry = new Map<string, ToolUIComponent>();

export function registerToolUI<TParams, TResult>(
  toolName: string,
  component: ToolUIComponent<TParams, TResult>
) {
  toolRegistry.set(toolName, component as ToolUIComponent);
}

export function makeToolUI<TParams, TResult>(
  toolName: string
): (component: ToolUIComponent<TParams, TResult>) => void {
  return (component) => registerToolUI(toolName, component);
}

// Usage:
makeToolUI('web_search')({
  displayName: 'Web Search',
  icon: SearchIcon,
  renderParams: (params: { query: string }) => (
    <div>Searching for: <strong>{params.query}</strong></div>
  ),
  renderResult: (result: { results: SearchResult[] }) => (
    <SearchResults results={result.results} />
  ),
});
```

#### Status State Machine

```typescript
type ToolStatus = 'pending' | 'running' | 'complete' | 'error'

const statusTransitions: Record<ToolStatus, ToolStatus[]> = {
  pending: ['running', 'error'],
  running: ['complete', 'error'],
  complete: [],
  error: ['pending'], // retry
}

function canTransition(from: ToolStatus, to: ToolStatus): boolean {
  return statusTransitions[from].includes(to)
}
```

#### Default Tool UI

```typescript
function DefaultToolUI({ toolCall }: { toolCall: ToolCall }) {
  return (
    <div className="tool-call">
      <div className="tool-header">
        <Code className="tool-icon" />
        <span className="tool-name">{toolCall.name}</span>
        <StatusBadge status={toolCall.status} />
      </div>

      {toolCall.params && (
        <details className="tool-params">
          <summary>Parameters</summary>
          <pre>{JSON.stringify(toolCall.params, null, 2)}</pre>
        </details>
      )}

      {toolCall.status === 'running' && (
        <div className="tool-progress">
          <Spinner /> Executing...
        </div>
      )}

      {toolCall.result && (
        <div className="tool-result">
          <pre>{JSON.stringify(toolCall.result, null, 2)}</pre>
        </div>
      )}

      {toolCall.error && (
        <div className="tool-error">
          <AlertCircle className="error-icon" />
          <span>{toolCall.error.message}</span>
          <button onClick={() => onRetry?.(toolCall)}>Retry</button>
        </div>
      )}
    </div>
  );
}
```

#### Example Custom Tool UIs

```typescript
// File System Tool
makeToolUI('read_file')({
  displayName: 'Read File',
  icon: FileText,
  renderParams: (params: { path: string }) => (
    <div className="flex items-center gap-2">
      <FileText size={16} />
      <code>{params.path}</code>
    </div>
  ),
  renderResult: (result: { content: string; size: number }) => (
    <div>
      <div className="text-sm text-gray-500 mb-2">
        {result.size} bytes
      </div>
      <CodeBlock language="auto" code={result.content} />
    </div>
  ),
});

// Web Search Tool
makeToolUI('web_search')({
  displayName: 'Web Search',
  icon: Search,
  renderParams: (params: { query: string; limit?: number }) => (
    <div>
      Searching for: <strong>{params.query}</strong>
      {params.limit && ` (top ${params.limit} results)`}
    </div>
  ),
  renderResult: (result: { results: SearchResult[] }) => (
    <div className="space-y-2">
      {result.results.map((r, i) => (
        <div key={i} className="border rounded p-3">
          <a href={r.url} className="font-medium text-blue-600 hover:underline">
            {r.title}
          </a>
          <p className="text-sm text-gray-600 mt-1">{r.snippet}</p>
        </div>
      ))}
    </div>
  ),
  renderStreaming: (partial: { results?: SearchResult[] }) => (
    <div className="space-y-2">
      {partial.results?.map((r, i) => (
        <div key={i} className="border rounded p-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-full" />
        </div>
      )) || <Spinner />}
    </div>
  ),
});

// Calculator Tool
makeToolUI('calculate')({
  displayName: 'Calculator',
  icon: Calculator,
  renderParams: (params: { expression: string }) => (
    <code className="text-lg">{params.expression}</code>
  ),
  renderResult: (result: { result: number }) => (
    <div className="text-2xl font-bold text-green-600">
      = {result.result}
    </div>
  ),
});
```

#### Accessibility

- Semantic HTML for tool status
- ARIA live regions for status updates
- Keyboard accessible retry/cancel buttons
- Screen reader announcements for tool completion

#### Testing Strategy

**Unit Tests**

- Registry add/remove/get operations
- Status transition validation
- Component rendering for each status

**Integration Tests**

- Full tool execution lifecycle
- Custom tool UI rendering
- Error handling and retry flows

---

### Streaming Shimmer Component

**Priority**: Medium **Status**: Planned **Dependencies**: None

#### Overview

CSS-first animation component for streaming text with typing effects, shimmer loading states, and
token-aware timing. Provides smooth visual feedback during AI response generation.

#### Core Requirements

**Functional**

- Typing animation for streaming text
- Shimmer effect for loading states
- Multiple animation modes (typing, shimmer, fade, instant)
- Token-aware timing (pause at sentence boundaries)
- Smooth cursor blinking
- Configurable animation speed

**Non-Functional**

- 60 FPS animations
- GPU-accelerated where possible
- Zero layout shift
- <5ms animation frame updates
- Accessible (respects prefers-reduced-motion)

#### API Design

```typescript
interface StreamingShimmerProps {
  content: string
  mode?: 'typing' | 'shimmer' | 'fade' | 'instant'
  speed?: 'slow' | 'normal' | 'fast' | number // characters per second
  showCursor?: boolean
  cursorStyle?: 'block' | 'line' | 'underline'
  pauseAtSentences?: boolean
  sentencePauseMs?: number
  onComplete?: () => void
  className?: string
}

interface ShimmerOptions {
  duration?: number // ms
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom'
  gradient?: [string, string, string] // [start, middle, end] colors
}
```

#### Component Implementation

```typescript
export function StreamingShimmer({
  content,
  mode = 'typing',
  speed = 'normal',
  showCursor = true,
  cursorStyle = 'line',
  pauseAtSentences = true,
  sentencePauseMs = 300,
  onComplete,
  className,
}: StreamingShimmerProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const charsPerSecond = typeof speed === 'number' ? speed : {
    slow: 20,
    normal: 40,
    fast: 80,
  }[speed];

  useEffect(() => {
    if (mode === 'instant') {
      setDisplayedText(content);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let index = 0;
    let timeoutId: number;

    function typeNext() {
      if (index >= content.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      const char = content[index];
      setDisplayedText(content.slice(0, index + 1));
      index++;

      // Pause at sentence boundaries
      const isPunctuation = /[.!?]/.test(char);
      const delay = isPunctuation && pauseAtSentences
        ? sentencePauseMs
        : 1000 / charsPerSecond;

      timeoutId = window.setTimeout(typeNext, delay);
    }

    typeNext();

    return () => clearTimeout(timeoutId);
  }, [content, mode, charsPerSecond, pauseAtSentences, sentencePauseMs, onComplete]);

  if (mode === 'shimmer') {
    return <ShimmerText className={className}>{content}</ShimmerText>;
  }

  if (mode === 'fade') {
    return <FadeInText className={className}>{content}</FadeInText>;
  }

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <Cursor style={cursorStyle} />
      )}
    </span>
  );
}

// Cursor component
function Cursor({ style }: { style: 'block' | 'line' | 'underline' }) {
  return (
    <span
      className={cn(
        'inline-block animate-blink',
        style === 'block' && 'w-2 h-5 bg-current',
        style === 'line' && 'w-0.5 h-5 bg-current',
        style === 'underline' && 'w-2 h-0.5 bg-current translate-y-1'
      )}
      aria-hidden="true"
    />
  );
}

// Shimmer effect
function ShimmerText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('inline-block bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 bg-clip-text text-transparent animate-shimmer', className)}>
      {children}
    </span>
  );
}

// Fade in effect
function FadeInText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('inline-block animate-fade-in', className)}>
      {children}
    </span>
  );
}
```

#### CSS Animations

```css
@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-blink,
  .animate-shimmer,
  .animate-fade-in {
    animation: none;
  }
}
```

#### Token-Aware Timing

```typescript
function getDelayForToken(token: string, baseDelay: number): number {
  // Pause longer at sentence boundaries
  if (/[.!?]$/.test(token)) return baseDelay * 3

  // Pause at commas
  if (token.endsWith(',')) return baseDelay * 1.5

  // Longer words get slightly more time
  if (token.length > 8) return baseDelay * 1.2

  return baseDelay
}
```

#### Accessibility

- Respects prefers-reduced-motion
- Provides instant mode for accessibility
- ARIA live region for screen readers
- No flashing animations (WCAG guideline)

#### Testing Strategy

**Unit Tests**

- Animation timing calculations
- Token-aware delay logic
- Mode switching

**Visual Regression Tests**

- Cursor styles
- Shimmer gradient
- Fade transitions

---

### Command Palette Enhanced

**Priority**: Medium **Status**: Planned **Dependencies**: None

#### Overview

Enhanced command palette with fuzzy search, recent commands tracking, keyboard navigation, and
extensible command system.

#### Core Requirements

**Functional**

- Fuzzy search across all commands
- Recent commands with frequency tracking
- Keyboard navigation (arrow keys, vim-style j/k)
- Command categories and grouping
- Custom command registration
- Search history
- Keyboard shortcuts display

**Non-Functional**

- <50ms search response
- <100ms command execution
- Support 1000+ commands
- Smooth scroll animation
- Mobile-friendly (touch support)

#### API Design

```typescript
interface Command {
  id: string
  label: string
  description?: string
  category?: string
  keywords?: string[]
  shortcut?: string[]
  icon?: React.ComponentType
  action: () => void | Promise<void>
  enabled?: () => boolean
}

interface CommandPaletteProps {
  commands?: Command[]
  placeholder?: string
  maxRecent?: number
  showCategories?: boolean
  showShortcuts?: boolean
  onCommandExecute?: (command: Command) => void
  renderCommand?: (command: Command) => React.ReactNode
}

interface UseCommandPaletteReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  registerCommand: (command: Command) => () => void
  unregisterCommand: (commandId: string) => void
}
```

#### Component Architecture

```
CommandPalette (container)
├── CommandInput (search field)
├── CommandList (results)
│   ├── RecentCommands (if query empty)
│   ├── CategoryGroup
│   │   └── CommandItem[]
│   └── EmptyState
└── CommandPaletteProvider (state + registry)
```

#### Fuzzy Search Implementation

```typescript
function fuzzyMatch(search: string, target: string): { score: number; matches: number[] } {
  const searchLower = search.toLowerCase()
  const targetLower = target.toLowerCase()

  let score = 0
  let searchIndex = 0
  const matches: number[] = []

  for (let i = 0; i < targetLower.length; i++) {
    if (searchIndex < searchLower.length && targetLower[i] === searchLower[searchIndex]) {
      score++
      matches.push(i)
      searchIndex++
    }
  }

  // Bonus for consecutive matches
  let consecutiveBonus = 0
  for (let i = 1; i < matches.length; i++) {
    if (matches[i] === matches[i - 1] + 1) {
      consecutiveBonus += 5
    }
  }

  // Bonus for start of word matches
  const wordStartBonus =
    matches.filter((idx) => idx === 0 || targetLower[idx - 1] === ' ').length * 10

  return {
    score: score + consecutiveBonus + wordStartBonus,
    matches,
  }
}

function searchCommands(query: string, commands: Command[]): Command[] {
  if (!query) return commands

  const results = commands
    .map((cmd) => ({
      command: cmd,
      match: fuzzyMatch(
        query,
        `${cmd.label} ${cmd.description || ''} ${cmd.keywords?.join(' ') || ''}`
      ),
    }))
    .filter((result) => result.match.score > 0)
    .sort((a, b) => b.match.score - a.match.score)
    .map((result) => result.command)

  return results
}
```

#### Recent Commands Tracking

```typescript
interface RecentCommand {
  commandId: string
  lastUsed: Date
  useCount: number
}

class RecentCommandsStore {
  private key = 'clarity-recent-commands'
  private maxRecent = 10

  track(commandId: string) {
    const recent = this.load()
    const existing = recent.find((r) => r.commandId === commandId)

    if (existing) {
      existing.lastUsed = new Date()
      existing.useCount++
    } else {
      recent.push({
        commandId,
        lastUsed: new Date(),
        useCount: 1,
      })
    }

    // Sort by lastUsed desc, limit to maxRecent
    recent.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
    this.save(recent.slice(0, this.maxRecent))
  }

  getRecent(): string[] {
    return this.load().map((r) => r.commandId)
  }

  private load(): RecentCommand[] {
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : []
  }

  private save(recent: RecentCommand[]) {
    localStorage.setItem(this.key, JSON.stringify(recent))
  }
}
```

#### Keyboard Navigation

```typescript
function useKeyboardNavigation(items: Command[], onSelect: (cmd: Command) => void) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0) // Reset on items change
  }, [items])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'j': // Vim-style
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1))
        break

      case 'ArrowUp':
      case 'k': // Vim-style
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        break

      case 'Enter':
        e.preventDefault()
        if (items[selectedIndex]) {
          onSelect(items[selectedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        // Close palette
        break
    }
  }

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  }
}
```

#### Example Usage

```typescript
function App() {
  const { registerCommand } = useCommandPalette();

  useEffect(() => {
    const unregister = registerCommand({
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'Chat',
      shortcut: ['Cmd', 'N'],
      icon: MessageSquare,
      action: () => {
        // Create new chat
      },
    });

    return unregister;
  }, [registerCommand]);

  return (
    <CommandPaletteProvider>
      <YourApp />
      <CommandPalette />
    </CommandPaletteProvider>
  );
}
```

#### Accessibility

- Keyboard-first design
- ARIA combobox pattern
- Screen reader announcements
- Focus trap when open
- Escape to close

#### Testing Strategy

**Unit Tests**

- Fuzzy search algorithm
- Recent commands tracking
- Keyboard navigation logic

**Integration Tests**

- Command registration/unregistration
- Search and filter
- Command execution

---

### Token Analytics Dashboard

**Priority**: High **Status**: Planned **Dependencies**: Thread Management Component

#### Overview

Real-time token tracking and cost calculation dashboard with multi-provider cost modeling, budget
tracking, and predictive alerts.

#### Core Requirements

**Functional**

- Real-time token usage tracking
- Per-message and per-thread token counts
- Multi-provider cost calculation (OpenAI, Anthropic, etc.)
- Budget limits and alerts
- Usage history and trends
- Export usage data (CSV, JSON)
- Cost projections

**Non-Functional**

- <10ms token count updates
- Accurate cost calculations
- Minimal performance overhead
- Persistent storage of analytics

#### API Design

```typescript
interface TokenAnalyticsProps {
  threadId?: string // null for global view
  showChart?: boolean
  showCosts?: boolean
  budget?: TokenBudget
  providers?: ProviderConfig[]
}

interface TokenBudget {
  maxTokens?: number
  maxCost?: number // in USD
  period?: 'daily' | 'weekly' | 'monthly'
  alertThreshold?: number // percentage (e.g., 80)
}

interface TokenMetrics {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
  provider: string
  model: string
}

interface ProviderConfig {
  name: string
  models: ModelPricing[]
}

interface ModelPricing {
  model: string
  inputTokenPer1M: number // cost per 1M input tokens
  outputTokenPer1M: number // cost per 1M output tokens
}
```

#### Implementation

```typescript
// Token counter
function countTokens(text: string, encoding: 'cl100k_base' | 'o200k_base' = 'cl100k_base'): number {
  // Use tiktoken or similar library
  const encoder = getEncoding(encoding)
  const tokens = encoder.encode(text)
  return tokens.length
}

// Cost calculator
function calculateCost(metrics: TokenMetrics, pricing: ModelPricing): number {
  const inputCost = (metrics.promptTokens / 1_000_000) * pricing.inputTokenPer1M
  const outputCost = (metrics.completionTokens / 1_000_000) * pricing.outputTokenPer1M
  return inputCost + outputCost
}

// Analytics store
interface TokenAnalyticsStore {
  metrics: Map<string, TokenMetrics[]> // threadId → metrics
  budget: TokenBudget | null

  track(threadId: string, metrics: TokenMetrics): void
  getThreadMetrics(threadId: string): TokenMetrics[]
  getTotalMetrics(): TokenMetrics
  checkBudget(): { exceeded: boolean; usage: number; limit: number }
  exportData(format: 'csv' | 'json'): string
}
```

#### Accessibility

- High contrast visualizations
- Screen reader accessible charts
- Keyboard navigation for data tables

#### Testing Strategy

**Unit Tests**

- Token counting accuracy
- Cost calculation precision
- Budget threshold detection

---

### Model Selector Component

**Priority**: High **Status**: Planned **Dependencies**: None

#### Overview

Multi-provider model selection interface with auto-routing, capability-driven UI, and intelligent
model recommendations.

#### Core Requirements

**Functional**

- Browse models by provider
- Filter by capabilities (multimodal, tools, context length)
- Auto-routing (select best model for task)
- Model comparison view
- Custom model configuration
- Recent/favorite models

**Non-Functional**

- <50ms model switching
- Accurate capability detection
- Graceful provider API failures

#### API Design

```typescript
interface ModelSelectorProps {
  selected?: string // model ID
  providers?: Provider[]
  capabilities?: Capability[]
  onSelect?: (model: Model) => void
  autoRoute?: boolean
}

interface Model {
  id: string
  name: string
  provider: string
  contextLength: number
  capabilities: Capability[]
  pricing?: ModelPricing
  description?: string
}

type Capability = 'multimodal' | 'tools' | 'streaming' | 'vision' | 'reasoning'

interface Provider {
  id: string
  name: string
  models: Model[]
  apiKeyRequired: boolean
}
```

#### Component Architecture

```
ModelSelector
├── ProviderTabs
├── ModelList
│   └── ModelCard (name, capabilities, pricing)
├── CapabilityFilter
├── ModelComparison (side-by-side)
└── AutoRouteToggle
```

#### Auto-Routing Logic

```typescript
function selectBestModel(task: Task, models: Model[]): Model {
  const required = task.capabilities
  const candidates = models.filter((m) => required.every((cap) => m.capabilities.includes(cap)))

  // Score by context length and cost
  return candidates.sort((a, b) => {
    if (task.contextLength > a.contextLength) return 1
    if (task.contextLength > b.contextLength) return -1
    return (a.pricing?.inputTokenPer1M || 0) - (b.pricing?.inputTokenPer1M || 0)
  })[0]
}
```

---

### Multimodal Input Component

**Priority**: High **Status**: Planned **Dependencies**: Voice Input Component

#### Overview

Unified input component supporting text, voice, images, and file attachments with drag-and-drop and
clipboard integration.

#### Core Requirements

**Functional**

- Text input with auto-resize
- Voice input integration
- Image upload/paste (with preview)
- File attachments (multiple)
- Drag-and-drop support
- Clipboard paste
- Character/token limits
- Input history (up/down arrows)

**Non-Functional**

- <100ms input response
- Support files up to 10MB
- Image optimization (resize, compress)
- Accessible keyboard controls

#### API Design

```typescript
interface MultimodalInputProps {
  value?: InputValue
  onChange?: (value: InputValue) => void
  onSubmit?: (value: InputValue) => void
  placeholder?: string
  maxLength?: number
  maxTokens?: number
  enableVoice?: boolean
  enableImages?: boolean
  enableFiles?: boolean
  acceptedFileTypes?: string[]
  maxFileSize?: number // bytes
}

interface InputValue {
  text?: string
  images?: ImageAttachment[]
  files?: FileAttachment[]
  voice?: AudioAttachment
}

interface ImageAttachment {
  id: string
  url: string
  file: File
  width?: number
  height?: number
}

interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  file: File
}
```

#### Component Architecture

```
MultimodalInput
├── TextArea (auto-resize)
├── VoiceButton (integrates VoiceInput)
├── ImagePreview[]
│   └── RemoveButton
├── FileList[]
│   └── FileItem (name, size, remove)
├── DropZone (drag-and-drop overlay)
└── InputActions (submit, attach buttons)
```

#### Drag-and-Drop Implementation

```typescript
function useDragAndDrop(onDrop: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    onDrop(files)
  }

  return {
    isDragging,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  }
}
```

#### Clipboard Integration

```typescript
async function handlePaste(e: React.ClipboardEvent) {
  const items = Array.from(e.clipboardData.items)

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        addImage(file)
      }
    }
  }
}
```

#### Auto-Resize Textarea

```typescript
function AutoResizeTextarea(props: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [props.value]);

  return <textarea ref={ref} {...props} />;
}
```

---

### Reasoning Visualization Component

**Priority**: Medium **Status**: Planned **Dependencies**: None

#### Overview

Component for visualizing AI chain-of-thought (CoT) reasoning with progressive disclosure, step
visualization, and support for multiple reasoning patterns.

#### Core Requirements

**Functional**

- Display reasoning steps sequentially
- Progressive disclosure (collapsible sections)
- Support for linear, reflective, and multi-step reasoning
- Step status indicators (thinking, complete, error)
- Syntax highlighting for code in reasoning
- Copy individual steps
- Export full reasoning chain

**Non-Functional**

- Smooth expand/collapse animations
- Readable typography for long-form content
- Mobile-responsive layout

#### API Design

```typescript
interface ReasoningVisualizationProps {
  reasoning: ReasoningChain
  mode?: 'expanded' | 'collapsed' | 'summary'
  showTimestamps?: boolean
  enableCopy?: boolean
  onStepClick?: (step: ReasoningStep) => void
}

interface ReasoningChain {
  id: string
  type: 'linear' | 'reflective' | 'multi-step'
  steps: ReasoningStep[]
  conclusion?: string
  metadata?: ReasoningMetadata
}

interface ReasoningStep {
  id: string
  label: string
  content: string
  status: 'thinking' | 'complete' | 'error'
  timestamp?: Date
  substeps?: ReasoningStep[]
}

interface ReasoningMetadata {
  totalSteps: number
  duration?: number // ms
  model?: string
}
```

#### Component Architecture

```
ReasoningVisualization
├── ReasoningHeader (type, metadata)
├── StepList
│   └── ReasoningStep[]
│       ├── StepHeader (label, status badge)
│       ├── StepContent (markdown rendering)
│       ├── SubSteps[] (recursive)
│       └── StepActions (copy, expand/collapse)
└── ConclusionBlock
```

#### Implementation

```typescript
function ReasoningVisualization({
  reasoning,
  mode = 'collapsed',
  showTimestamps = false,
  enableCopy = true,
  onStepClick,
}: ReasoningVisualizationProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    mode === 'expanded' ? new Set(reasoning.steps.map(s => s.id)) : new Set()
  );

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <div className="reasoning-visualization">
      <ReasoningHeader type={reasoning.type} metadata={reasoning.metadata} />

      <div className="step-list">
        {reasoning.steps.map((step, index) => (
          <ReasoningStepComponent
            key={step.id}
            step={step}
            index={index}
            isExpanded={expandedSteps.has(step.id)}
            onToggle={() => toggleStep(step.id)}
            showTimestamp={showTimestamps}
            enableCopy={enableCopy}
            onClick={() => onStepClick?.(step)}
          />
        ))}
      </div>

      {reasoning.conclusion && (
        <div className="conclusion">
          <h3>Conclusion</h3>
          <Markdown content={reasoning.conclusion} />
        </div>
      )}
    </div>
  );
}

function ReasoningStepComponent({
  step,
  index,
  isExpanded,
  onToggle,
  showTimestamp,
  enableCopy,
  onClick,
}: {
  step: ReasoningStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  showTimestamp: boolean;
  enableCopy: boolean;
  onClick: () => void;
}) {
  return (
    <div className={cn('reasoning-step', step.status)}>
      <div className="step-header" onClick={onToggle}>
        <div className="step-info">
          <span className="step-number">{index + 1}</span>
          <span className="step-label">{step.label}</span>
          <StatusBadge status={step.status} />
        </div>

        {showTimestamp && step.timestamp && (
          <time className="step-timestamp">
            {step.timestamp.toLocaleTimeString()}
          </time>
        )}

        <button className="expand-button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </button>
      </div>

      {isExpanded && (
        <div className="step-content">
          <Markdown content={step.content} />

          {step.substeps && step.substeps.length > 0 && (
            <div className="substeps">
              {step.substeps.map((substep, subIndex) => (
                <ReasoningStepComponent
                  key={substep.id}
                  step={substep}
                  index={subIndex}
                  isExpanded={true}
                  onToggle={() => {}}
                  showTimestamp={showTimestamp}
                  enableCopy={enableCopy}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}

          {enableCopy && (
            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(step.content)}
            >
              <Copy size={14} /> Copy
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

#### Styling

```css
.reasoning-visualization {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reasoning-step {
  border-left: 3px solid var(--gray-300);
  padding-left: 1rem;
  transition: border-color 0.2s;
}

.reasoning-step.thinking {
  border-left-color: var(--yellow-500);
}

.reasoning-step.complete {
  border-left-color: var(--green-500);
}

.reasoning-step.error {
  border-left-color: var(--red-500);
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.step-header:hover {
  background-color: var(--gray-50);
}

.step-content {
  padding: 1rem;
  margin-top: 0.5rem;
  background-color: var(--gray-50);
  border-radius: 4px;
}

.substeps {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px dashed var(--gray-300);
}
```

#### Accessibility

- Keyboard navigation (Tab, Enter to expand/collapse)
- ARIA expanded state
- Screen reader announcements for status changes
- Focus management

#### Testing Strategy

**Unit Tests**

- Expand/collapse logic
- Step filtering and sorting
- Copy functionality

**Visual Regression Tests**

- Expanded/collapsed states
- Status indicator styling
- Nested substeps rendering

---

### Settings Panel Component

**Priority**: Medium **Status**: Planned **Dependencies**: None

#### Overview

Comprehensive settings management panel with sections for general preferences, model configuration,
API keys, behavior, appearance, privacy, and advanced options.

#### Core Requirements

**Functional**

- Tabbed sections (General, Model, API Keys, Behavior, Appearance, Privacy, Advanced)
- Form validation
- Secure API key handling (encryption at rest)
- Theme switching (light, dark, auto)
- Export/import settings
- Reset to defaults
- Search settings

**Non-Functional**

- Instant settings preview
- Secure credential storage
- Settings persistence
- Mobile-responsive layout

#### API Design

```typescript
interface SettingsPanelProps {
  sections?: SettingsSection[]
  onSave?: (settings: Settings) => void
  onReset?: () => void
  defaultValues?: Partial<Settings>
}

interface SettingsSection {
  id: string
  label: string
  icon?: React.ComponentType
  fields: SettingsField[]
}

interface SettingsField {
  id: string
  label: string
  description?: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'secret'
  defaultValue?: any
  options?: { value: any; label: string }[]
  validation?: (value: any) => string | null
  sensitive?: boolean // for API keys
}

interface Settings {
  general: GeneralSettings
  model: ModelSettings
  apiKeys: ApiKeySettings
  behavior: BehaviorSettings
  appearance: AppearanceSettings
  privacy: PrivacySettings
  advanced: AdvancedSettings
}

interface GeneralSettings {
  language: string
  timezone: string
  dateFormat: string
}

interface ModelSettings {
  defaultProvider: string
  defaultModel: string
  temperature: number
  maxTokens: number
  topP: number
}

interface ApiKeySettings {
  openai?: string
  anthropic?: string
  google?: string
  custom?: Record<string, string>
}

interface BehaviorSettings {
  autoSave: boolean
  autoSaveInterval: number // seconds
  confirmBeforeDelete: boolean
  showTokenCounts: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  fontFamily: string
  codeTheme: string
}

interface PrivacySettings {
  telemetry: boolean
  shareUsageData: boolean
  storeConversationsLocally: boolean
}

interface AdvancedSettings {
  debugMode: boolean
  experimentalFeatures: boolean
  customEndpoint?: string
}
```

#### Component Architecture

```
SettingsPanel
├── SettingsSidebar (section tabs)
├── SettingsContent
│   ├── SectionHeader
│   ├── SettingsForm
│   │   └── FieldGroup[]
│   │       └── FormField (input, select, toggle, etc.)
│   └── SectionActions (save, reset)
├── SettingsSearch
└── SettingsFooter (export, import)
```

#### Secure API Key Handling

```typescript
// Encrypt API keys before storage
async function encryptApiKey(key: string, userSecret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(userSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const cryptoKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('clarity-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )

  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data)

  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv)
  result.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...result))
}

// Decrypt when needed
async function decryptApiKey(encrypted: string, userSecret: string): Promise<string> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
  const iv = data.slice(0, 12)
  const encryptedData = data.slice(12)

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(userSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const cryptoKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('clarity-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encryptedData
  )

  return decoder.decode(decrypted)
}
```

#### Theme Switching

```typescript
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return { theme, setTheme }
}
```

#### Settings Persistence

```typescript
class SettingsStore {
  private key = 'clarity-settings'

  save(settings: Settings) {
    localStorage.setItem(this.key, JSON.stringify(settings))
  }

  load(): Settings | null {
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : null
  }

  reset() {
    localStorage.removeItem(this.key)
  }

  export(): string {
    const settings = this.load()
    return JSON.stringify(settings, null, 2)
  }

  import(data: string) {
    const settings = JSON.parse(data)
    this.save(settings)
  }
}
```

#### Accessibility

- Keyboard navigation through tabs
- Form field labels and ARIA attributes
- Focus indicators
- Screen reader announcements for saved settings

#### Testing Strategy

**Unit Tests**

- Form validation logic
- API key encryption/decryption
- Settings save/load/reset

**Integration Tests**

- Theme switching
- Export/import functionality
- Settings persistence

**Security Tests**

- API key encryption strength
- Secure storage verification

---

## API Refactoring Initiatives

### Compound Components Migration

**Priority**: High **Status**: Planned **Impact**: Breaking change (requires migration guide)

#### Overview

Migrate from prop-based configuration to compound component pattern with context-based state
sharing. This improves composition flexibility and reduces prop drilling.

#### Current Pattern (Prop-Based)

```typescript
<ChatInterface
  messages={messages}
  onSend={handleSend}
  showTimestamps={true}
  showTokenCounts={true}
  enableVoice={true}
  theme="dark"
  messageRenderer={customRenderer}
/>
```

**Problems:**

- Prop explosion (20+ props)
- Limited customization points
- Hard to extend with new features
- Poor composition story

#### New Pattern (Compound Components)

```typescript
<ChatInterface>
  <ChatInterface.Header>
    <ChatInterface.Title>Conversation</ChatInterface.Title>
    <ChatInterface.Actions>
      <ExportButton />
      <SettingsButton />
    </ChatInterface.Actions>
  </ChatInterface.Header>

  <ChatInterface.Messages>
    {messages.map(msg => (
      <ChatInterface.Message key={msg.id} message={msg}>
        <ChatInterface.MessageContent />
        <ChatInterface.MessageTimestamp />
        <ChatInterface.MessageActions />
      </ChatInterface.Message>
    ))}
  </ChatInterface.Messages>

  <ChatInterface.Input>
    <ChatInterface.TextArea />
    <ChatInterface.VoiceButton />
    <ChatInterface.SendButton />
  </ChatInterface.Input>
</ChatInterface>
```

**Benefits:**

- Explicit composition
- Flexible ordering
- Easy to add custom components
- Self-documenting structure
- Better TypeScript inference

#### Implementation Strategy

**Phase 1: Add Compound Components (Non-Breaking)**

- Create compound component API alongside existing props API
- Both patterns work simultaneously
- Add deprecation warnings to prop-based API

**Phase 2: Migration Guide**

- Provide codemod for automatic migration
- Document migration examples
- Add adapter layer for gradual migration

**Phase 3: Remove Old API (v2.0)**

- Remove prop-based API
- Simplify internal implementation
- Update all examples and documentation

#### Context Architecture

```typescript
// ChatInterface context
interface ChatInterfaceContextValue {
  messages: Message[];
  activeMessage: string | null;
  setActiveMessage: (id: string | null) => void;
  onSend: (content: string) => void;
  theme: Theme;
  // ... other shared state
}

const ChatInterfaceContext = createContext<ChatInterfaceContextValue | null>(null);

export function ChatInterface({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const contextValue: ChatInterfaceContextValue = {
    messages,
    activeMessage,
    setActiveMessage,
    onSend: handleSend,
    theme: 'light',
  };

  return (
    <ChatInterfaceContext.Provider value={contextValue}>
      <div className="chat-interface">
        {children}
      </div>
    </ChatInterfaceContext.Provider>
  );
}

// Sub-components
ChatInterface.Header = function Header({ children }: { children: React.ReactNode }) {
  const context = useChatInterface();
  return <header className="chat-header">{children}</header>;
};

ChatInterface.Messages = function Messages({ children }: { children: React.ReactNode }) {
  const context = useChatInterface();
  return <div className="message-list">{children}</div>;
};

// Hook for accessing context
function useChatInterface() {
  const context = useContext(ChatInterfaceContext);
  if (!context) {
    throw new Error('ChatInterface compound components must be used within <ChatInterface>');
  }
  return context;
}
```

#### Backward Compatibility

```typescript
// Adapter for old prop-based API
export function LegacyChatInterface(props: LegacyChatInterfaceProps) {
  console.warn(
    'LegacyChatInterface is deprecated. Please migrate to compound components. ' +
    'See migration guide: https://docs.clarity.ai/migration/compound-components'
  );

  return (
    <ChatInterface>
      <ChatInterface.Header>
        <ChatInterface.Title>{props.title}</ChatInterface.Title>
      </ChatInterface.Header>

      <ChatInterface.Messages>
        {props.messages.map(msg => (
          <ChatInterface.Message key={msg.id} message={msg}>
            {props.messageRenderer ? (
              props.messageRenderer(msg)
            ) : (
              <>
                <ChatInterface.MessageContent />
                {props.showTimestamps && <ChatInterface.MessageTimestamp />}
              </>
            )}
          </ChatInterface.Message>
        ))}
      </ChatInterface.Messages>

      <ChatInterface.Input>
        <ChatInterface.TextArea />
        {props.enableVoice && <ChatInterface.VoiceButton />}
        <ChatInterface.SendButton />
      </ChatInterface.Input>
    </ChatInterface>
  );
}
```

#### Migration Timeline

- **v1.5**: Introduce compound components (beta)
- **v1.6**: Deprecate prop-based API with warnings
- **v1.7-v1.9**: Coexistence period (6 months)
- **v2.0**: Remove prop-based API

---

### Slot-Based Customization

**Priority**: High **Status**: Planned **Impact**: Additive (non-breaking)

#### Overview

Introduce semantic slot-based customization pattern for flexible UI composition. Slots provide named
insertion points with semantic meaning rather than directional naming.

#### Slot Pattern Design

```typescript
interface SlotProps {
  Header?: React.ReactNode;
  Prefix?: React.ReactNode;
  Field?: React.ReactNode;
  Suffix?: React.ReactNode;
  Footer?: React.ReactNode;
}

function ComponentWithSlots({ Header, Prefix, Field, Suffix, Footer }: SlotProps) {
  return (
    <div className="component">
      {Header && <div className="slot-header">{Header}</div>}

      <div className="slot-main">
        {Prefix && <div className="slot-prefix">{Prefix}</div>}
        <div className="slot-field">{Field}</div>
        {Suffix && <div className="slot-suffix">{Suffix}</div>}
      </div>

      {Footer && <div className="slot-footer">{Footer}</div>}
    </div>
  );
}
```

#### Semantic Naming (Not Directional)

**Good (Semantic):**

- `Header` / `Footer` - Position-agnostic, describes role
- `Prefix` / `Suffix` - Language-agnostic (RTL-safe)
- `Leading` / `Trailing` - Works in any direction

**Bad (Directional):**

- `Left` / `Right` - Breaks in RTL languages
- `Top` / `Bottom` - Assumes vertical layout
- `Before` / `After` - Ambiguous positioning

#### Progressive Disclosure Levels

**Level 1: Simple Props**

```typescript
<Input
  label="Email"
  placeholder="Enter email"
  type="email"
/>
```

**Level 2: Slot Props**

```typescript
<Input
  Field={<input type="email" placeholder="Enter email" />}
  Prefix={<MailIcon />}
  Suffix={<button>Verify</button>}
/>
```

**Level 3: Render Props**

```typescript
<Input
  Field={(props) => <CustomInput {...props} />}
  Prefix={(state) => state.hasError ? <ErrorIcon /> : <MailIcon />}
/>
```

**Level 4: Full Compound Components**

```typescript
<Input>
  <Input.Label>Email</Input.Label>
  <Input.Prefix><MailIcon /></Input.Prefix>
  <Input.Field type="email" />
  <Input.Suffix><button>Verify</button></Input.Suffix>
  <Input.Error>Invalid email</Input.Error>
</Input>
```

#### Implementation Examples

**Chat Input with Slots**

```typescript
interface ChatInputProps {
  Header?: React.ReactNode;
  Prefix?: React.ReactNode;
  Field?: React.ReactNode;
  Suffix?: React.ReactNode;
  Footer?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

function ChatInput({
  Header,
  Prefix,
  Field,
  Suffix,
  Footer,
  value,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="chat-input">
      {Header && <div className="input-header">{Header}</div>}

      <div className="input-main">
        {Prefix && <div className="input-prefix">{Prefix}</div>}

        <div className="input-field">
          {Field || (
            <textarea
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="Type a message..."
            />
          )}
        </div>

        {Suffix && <div className="input-suffix">{Suffix}</div>}
      </div>

      {Footer && <div className="input-footer">{Footer}</div>}
    </div>
  );
}

// Usage
<ChatInput
  Header={<TokenCounter current={120} max={4096} />}
  Prefix={<AttachButton />}
  Suffix={
    <>
      <VoiceButton />
      <SendButton />
    </>
  }
  Footer={<CommandSuggestions />}
/>
```

**Message Component with Slots**

```typescript
interface MessageProps {
  Header?: React.ReactNode;
  Prefix?: React.ReactNode;
  Content?: React.ReactNode;
  Suffix?: React.ReactNode;
  Footer?: React.ReactNode;
  message: Message;
}

function Message({ Header, Prefix, Content, Suffix, Footer, message }: MessageProps) {
  return (
    <div className={cn('message', `message-${message.role}`)}>
      {Header && <div className="message-header">{Header}</div>}

      <div className="message-main">
        {Prefix && <div className="message-prefix">{Prefix}</div>}

        <div className="message-content">
          {Content || <Markdown>{message.content}</Markdown>}
        </div>

        {Suffix && <div className="message-suffix">{Suffix}</div>}
      </div>

      {Footer && <div className="message-footer">{Footer}</div>}
    </div>
  );
}

// Usage
<Message
  message={msg}
  Header={<Timestamp value={msg.createdAt} />}
  Prefix={<Avatar user={msg.user} />}
  Suffix={<MessageActions message={msg} />}
  Footer={
    <>
      <TokenBadge count={msg.tokens} />
      <ReactionBar reactions={msg.reactions} />
    </>
  }
/>
```

#### TypeScript Support

```typescript
// Slot type helpers
type SlotProp<TProps = {}> = React.ReactNode | ((props: TProps) => React.ReactNode)

interface WithSlots {
  Header?: SlotProp
  Prefix?: SlotProp
  Field?: SlotProp
  Suffix?: SlotProp
  Footer?: SlotProp
}

// Render slot utility
function renderSlot<TProps>(slot: SlotProp<TProps> | undefined, props?: TProps): React.ReactNode {
  if (!slot) return null
  if (typeof slot === 'function') return slot(props || ({} as TProps))
  return slot
}
```

#### Benefits

1. **Flexibility**: Insert custom UI at any point
2. **Composition**: Combine multiple elements in slots
3. **Semantic**: Clear naming describes purpose
4. **Accessible**: RTL-safe, responsive-friendly
5. **Progressive**: Start simple, add complexity as needed

#### Adoption Strategy

- Add slot props to existing components (non-breaking)
- Document slot patterns in component guides
- Provide examples for common customizations
- Eventually prefer slots over specific props

---

## Cross-Cutting Concerns

### Accessibility

**Standards**: WCAG 2.1 AA compliance across all components

**Key Requirements:**

- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels, live regions, roles)
- Focus management and visible focus indicators
- Color contrast ratios (4.5:1 for text, 3:1 for UI components)
- Respect user preferences (prefers-reduced-motion, prefers-color-scheme)
- Alternative text for images and icons
- Semantic HTML structure

**Testing:**

- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast validation

### Performance

**Targets:**

- Initial render: <100ms
- Interaction response: <16ms (60 FPS)
- Component mount: <50ms
- State updates: <16ms

**Strategies:**

- Code splitting by route/component
- Lazy loading for heavy components
- Virtual scrolling for long lists (1000+ items)
- Memoization for expensive calculations
- Debounced/throttled event handlers
- Web Workers for CPU-intensive tasks
- CSS GPU acceleration for animations

**Monitoring:**

- Core Web Vitals (LCP, FID, CLS)
- Custom performance metrics
- Bundle size tracking
- Lighthouse CI in pipeline

### Security

**Requirements:**

- Secure API key storage (encryption at rest)
- XSS prevention (sanitize user input)
- CSRF protection for form submissions
- Content Security Policy (CSP) headers
- No sensitive data in localStorage without encryption
- Secure communication (HTTPS only)

**Best Practices:**

- Input validation and sanitization
- Output encoding
- Principle of least privilege
- Regular dependency audits
- Security headers configuration

### Internationalization (i18n)

**Support:**

- RTL language support (Arabic, Hebrew)
- Date/time localization
- Number formatting
- Currency formatting
- Pluralization rules
- Translation infrastructure

**Implementation:**

- Use `Intl` APIs for formatting
- Semantic slot naming (not directional)
- Logical CSS properties (`inline-start` vs `left`)
- Externalized strings (translation keys)

### Theme System

**Design Tokens:**

- Color system (OKLCH color space)
- Typography scale
- Spacing scale
- Border radii
- Shadows
- Z-index layers

**Themes:**

- Light mode
- Dark mode
- High contrast mode
- Custom theme support

**Implementation:**

- CSS custom properties
- Theme context provider
- Persist user preference
- Respect system preference

### Error Handling

**Strategy:**

- Error boundaries for component crashes
- Graceful degradation
- User-friendly error messages
- Error logging and reporting
- Retry mechanisms for network failures
- Fallback UI for failed states

**User Experience:**

- Clear error messages
- Actionable recovery steps
- Don't lose user data
- Preserve form state on errors

---

## Implementation Priorities

### Phase 1: Foundation (Q1 2026)

**Goal**: Establish core infrastructure and patterns

**Components:**

1. Thread Management (High Priority)
   - Foundational for all chat features
   - Required by: Token Analytics, Multimodal Input
   - Est: 3 weeks

2. Compound Components Migration (High Priority)
   - API foundation for all components
   - Required by: All new components
   - Est: 4 weeks

3. Slot-Based Customization (High Priority)
   - Composition pattern for flexibility
   - Required by: All new components
   - Est: 2 weeks

**Deliverables:**

- Thread management system
- Compound component API
- Slot-based pattern library
- Migration guide
- Updated documentation

### Phase 2: Core Features (Q2 2026)

**Goal**: Build essential user-facing features

**Components:**

1. Tool Calling UI (High Priority)
   - Critical for AI agent interactions
   - Est: 2 weeks

2. Token Analytics Dashboard (High Priority)
   - Cost visibility for users
   - Depends on: Thread Management
   - Est: 2 weeks

3. Model Selector (High Priority)
   - Multi-provider support
   - Est: 2 weeks

4. Multimodal Input (High Priority)
   - Modern AI chat experience
   - Depends on: Thread Management, Voice Input
   - Est: 3 weeks

**Deliverables:**

- Tool execution visualization
- Token cost tracking
- Model selection UI
- Multimodal input support

### Phase 3: Enhanced Experience (Q3 2026)

**Goal**: Add polish and advanced features

**Components:**

1. Voice Input (Medium Priority)
   - Required by: Multimodal Input
   - Est: 2 weeks

2. Streaming Shimmer (Medium Priority)
   - UX polish for streaming
   - Est: 1 week

3. Command Palette (Medium Priority)
   - Power user feature
   - Est: 2 weeks

4. Reasoning Visualization (Medium Priority)
   - CoT transparency
   - Est: 2 weeks

**Deliverables:**

- Voice input component
- Streaming animations
- Command palette
- Reasoning display

### Phase 4: Configuration & Settings (Q4 2026)

**Goal**: Complete the component library

**Components:**

1. Settings Panel (Medium Priority)
   - User preferences
   - Est: 2 weeks

**Deliverables:**

- Settings management UI
- Theme switching
- API key management
- Final documentation

### Success Metrics

**Adoption:**

- 80% of new projects use compound components
- 50% migration of existing projects by end of year
- 5+ community contributions

**Quality:**

- 90%+ test coverage
- WCAG 2.1 AA compliance across all components
- <100ms render time for all components
- <50KB gzipped per component

**Developer Experience:**

- <5 minutes to first component
- <30 minutes to build custom chat interface
- Documentation rated 4.5+/5

---

## Appendix

### Glossary

- **Compound Components**: React pattern where components work together by sharing state through
  context
- **Slot**: Named insertion point for custom UI within a component
- **Progressive Disclosure**: UX principle of revealing complexity gradually
- **Token**: Unit of text processed by AI models (roughly 4 characters)
- **Chain-of-Thought (CoT)**: AI reasoning process showing intermediate steps
- **Fuzzy Search**: Search allowing approximate string matching

### References

- [React Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Radix UI Slot Pattern](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Assistant UI Architecture](https://github.com/Yonom/assistant-ui)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)

### Change Log

- **2026-01-27**: Initial consolidated specification document created
  - Merged 10 component specifications
  - Merged 2 API refactoring plans
  - Added implementation timeline and priorities
