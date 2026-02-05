'use client'

export interface KnowledgeEntry {
  id: string
  title: string
  category: 'component' | 'hook' | 'adapter' | 'memory' | 'token' | 'tool' | 'rag' | 'setup'
  tags: string[]
  content: string
  codeExample: string
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ─── Components ─────────────────────────────────────────────
  {
    id: 'chatwindow',
    title: 'ChatWindow',
    category: 'component',
    tags: ['chat', 'window', 'container', 'messages', 'scroll', 'ui'],
    content:
      'ChatWindow is the top-level container component that renders a complete chat interface. It manages scroll behavior, auto-scrolling to new messages, scroll-to-bottom button, and provides a consistent frame for MessageBubble children. It accepts a messages array, an optional header slot, and a footer slot typically used for ChatInput. You can customize the background, padding, and max-height. ChatWindow supports both light and dark themes out of the box via CSS variables.',
    codeExample: `import { ChatWindow } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <ChatWindow
      messages={messages}
      header={<ChatHeader title="Support" />}
      footer={
        <ChatInput onSend={(text) => handleSend(text)} />
      }
      autoScroll
      className="h-[600px]"
    />
  )
}`,
  },
  {
    id: 'chatinput',
    title: 'ChatInput',
    category: 'component',
    tags: ['input', 'textarea', 'send', 'message', 'compose', 'typing'],
    content:
      'ChatInput provides a rich text input area with auto-resize, submit-on-enter, shift+enter for newline, character count, and an optional toolbar for attachments, voice input, and slash commands. It exposes an onSend callback with the message text and any attached files. You can customize placeholder text, max length, and whether to show the toolbar. ChatInput also integrates with the mention system and slash command system via onSlashCommand and onMention callbacks.',
    codeExample: `import { ChatInput } from '@clarity-chat/react'

<ChatInput
  onSend={(text, attachments) => {
    console.log('Message:', text)
    console.log('Files:', attachments)
  }}
  placeholder="Ask about components..."
  maxLength={4000}
  showToolbar
  onSlashCommand={(cmd) => handleSlashCommand(cmd)}
  onMention={(mention) => handleMention(mention)}
/>`,
  },
  {
    id: 'streamingmessage',
    title: 'StreamingMessage',
    category: 'component',
    tags: ['streaming', 'message', 'real-time', 'typewriter', 'tokens', 'animation'],
    content:
      'StreamingMessage renders a message that streams in character by character, simulating an AI typing response. It accepts a content string that grows over time and handles smooth rendering with a blinking cursor at the end. When streaming completes, the cursor disappears and the full message is rendered statically. It supports markdown rendering inline while streaming, including code blocks that format live.',
    codeExample: `import { StreamingMessage } from '@clarity-chat/react'

function ChatResponse({ isStreaming, content }) {
  if (isStreaming) {
    return (
      <StreamingMessage
        content={content}
        showCursor
        onComplete={() => console.log('Done streaming')}
      />
    )
  }

  return <MessageBubble content={content} role="assistant" />
}`,
  },
  {
    id: 'messagebubble',
    title: 'MessageBubble',
    category: 'component',
    tags: ['message', 'bubble', 'chat', 'user', 'assistant', 'avatar', 'markdown'],
    content:
      'MessageBubble renders an individual chat message with role-based styling (user vs assistant), an optional avatar, timestamp, and action buttons (copy, edit, delete, regenerate). It supports rendering markdown content with syntax-highlighted code blocks. The component accepts feedback state (thumbs up/down) and integrates with the MessageActions component for hover toolbar display.',
    codeExample: `import { MessageBubble } from '@clarity-chat/react'

<MessageBubble
  role="assistant"
  content="Here is your answer with **markdown** support."
  timestamp={new Date()}
  avatar="/bot-avatar.png"
  actions={
    <MessageActions
      onCopy={() => copyToClipboard(content)}
      onRegenerate={() => regenerate(messageId)}
      onFeedback={(type) => saveFeedback(messageId, type)}
    />
  }
/>`,
  },
  {
    id: 'codeblock',
    title: 'CodeBlock',
    category: 'component',
    tags: ['code', 'syntax', 'highlight', 'copy', 'download', 'programming'],
    content:
      'CodeBlock renders syntax-highlighted code with line numbers, a language label, copy-to-clipboard button, and optional download button. It supports dozens of languages via a built-in highlighter. You can also add a "Run" button for interactive demos. The component auto-detects language from code fences in markdown or accepts an explicit language prop.',
    codeExample: `import { CodeBlock } from '@clarity-chat/react'

<CodeBlock
  code={\`function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`
}\`}
  language="typescript"
  showLineNumbers
  title="greeting.ts"
  onCopy={() => toast('Copied!')}
/>`,
  },
  {
    id: 'typingindicator',
    title: 'TypingIndicator',
    category: 'component',
    tags: ['typing', 'indicator', 'loading', 'dots', 'animation', 'status'],
    content:
      'TypingIndicator shows an animated three-dot indicator while the AI is processing. It mimics the familiar chat typing animation. You can customize the dot color, size, and animation speed. The component can be placed inside a MessageBubble frame or rendered standalone.',
    codeExample: `import { TypingIndicator } from '@clarity-chat/react'

{isLoading && (
  <TypingIndicator
    label="Assistant is typing"
    dotSize={8}
    speed="normal"
    className="ml-12"
  />
)}`,
  },
  {
    id: 'thinkingindicator',
    title: 'ThinkingIndicator',
    category: 'component',
    tags: ['thinking', 'chain-of-thought', 'reasoning', 'steps', 'expand', 'collapse'],
    content:
      'ThinkingIndicator displays the model\'s chain-of-thought reasoning steps in an expandable panel. Each step is rendered with a sequence number and timestamp. While the model is actively thinking, a spinner and pulsing "Processing..." label are shown. Users can expand/collapse the thinking steps to see the reasoning process.',
    codeExample: `import { ThinkingIndicator } from '@clarity-chat/react'

<ThinkingIndicator
  steps={[
    { id: '1', content: 'Analyzing the user query...', timestamp: new Date() },
    { id: '2', content: 'Searching knowledge base...', timestamp: new Date() },
    { id: '3', content: 'Found 3 relevant entries', timestamp: new Date() },
  ]}
  isActive={isThinking}
  onToggle={(expanded) => setExpanded(expanded)}
/>`,
  },
  {
    id: 'modelselector',
    title: 'ModelSelector',
    category: 'component',
    tags: ['model', 'selector', 'provider', 'openai', 'anthropic', 'google', 'dropdown'],
    content:
      'ModelSelector provides a dropdown UI for selecting the AI provider (OpenAI, Anthropic, Google) and a specific model within that provider. It shows model metadata like context window size, cost per 1K tokens, and a brief description. The component integrates with the adapter system to ensure the correct adapter is loaded when switching providers.',
    codeExample: `import { ModelSelector } from '@clarity-chat/react'

<ModelSelector
  providers={['openai', 'anthropic', 'google']}
  selectedProvider="anthropic"
  selectedModel="claude-3.5-sonnet"
  onProviderChange={(p) => setProvider(p)}
  onModelChange={(m) => setModel(m)}
  showCost
  showContextWindow
/>`,
  },
  {
    id: 'tokenusagemeter',
    title: 'TokenUsageMeter',
    category: 'component',
    tags: ['token', 'usage', 'meter', 'budget', 'cost', 'progress', 'bar'],
    content:
      'TokenUsageMeter visualizes token consumption with a progress bar, input/output breakdown, and estimated cost. It changes color based on usage percentage (green under 70%, yellow 70-90%, red above 90%). The component can display budget limits and warns when approaching the limit. Integrate with useTokenBudgetMonitor for real-time tracking.',
    codeExample: `import { TokenUsageMeter } from '@clarity-chat/react'

<TokenUsageMeter
  budget={16000}
  used={{ input: 2400, output: 1800, total: 4200 }}
  costPerInputToken={0.005}
  costPerOutputToken={0.015}
  showBreakdown
  showCost
  warningThreshold={0.8}
/>`,
  },
  {
    id: 'promptlibrary',
    title: 'PromptLibrary',
    category: 'component',
    tags: ['prompt', 'library', 'saved', 'templates', 'reuse', 'favorites'],
    content:
      'PromptLibrary is a component for managing saved prompt templates. Users can save, categorize, search, and reuse prompts. Each prompt has a label, text content, and optional category. Click a prompt to insert it into the chat input. The component supports drag-and-drop reordering and export/import of prompt collections.',
    codeExample: `import { PromptLibrary } from '@clarity-chat/react'

<PromptLibrary
  prompts={savedPrompts}
  onSelect={(prompt) => setInputValue(prompt.text)}
  onSave={(prompt) => savePrompt(prompt)}
  onDelete={(id) => deletePrompt(id)}
  categories={['General', 'Code Review', 'Debug']}
  searchable
/>`,
  },
  {
    id: 'commandpalette',
    title: 'CommandPalette',
    category: 'component',
    tags: ['command', 'palette', 'slash', 'search', 'actions', 'keyboard', 'shortcuts'],
    content:
      'CommandPalette provides a slash-command interface that appears when the user types "/" in the chat input. It lists available commands with descriptions, icons, and keyboard shortcuts. Commands are filterable by typing after the slash. The palette supports categories, nested commands, and custom command handlers.',
    codeExample: `import { CommandPalette } from '@clarity-chat/react'

<CommandPalette
  commands={[
    { name: 'components', description: 'Browse all components', icon: 'layers' },
    { name: 'hooks', description: 'Browse all hooks', icon: 'code' },
    { name: 'example', description: 'Show code example', icon: 'file-code', args: ['name'] },
    { name: 'clear', description: 'Clear conversation', icon: 'trash' },
  ]}
  onSelect={(cmd, args) => executeCommand(cmd, args)}
  filter={inputAfterSlash}
/>`,
  },
  {
    id: 'fileupload',
    title: 'FileUpload',
    category: 'component',
    tags: ['file', 'upload', 'drag', 'drop', 'attachment', 'document'],
    content:
      'FileUpload provides a drag-and-drop zone for attaching files to the chat context. It supports multiple file types (.ts, .tsx, .js, .json, .md, .txt, .pdf, .csv, etc.), shows file icons based on extension, displays file size, and allows removal. Files can be used as additional context for the AI model. The component shows a highlighted border when files are dragged over.',
    codeExample: `import { FileUpload } from '@clarity-chat/react'

<FileUpload
  files={attachedFiles}
  onFilesChange={(files) => setAttachedFiles(files)}
  accept=".ts,.tsx,.js,.json,.md,.txt,.pdf"
  maxFileSize={10 * 1024 * 1024}
  maxFiles={5}
/>`,
  },
  {
    id: 'voiceinput',
    title: 'VoiceInput',
    category: 'component',
    tags: ['voice', 'input', 'speech', 'microphone', 'audio', 'recognition', 'accessibility'],
    content:
      'VoiceInput adds speech-to-text capability to the chat input. When activated, it listens for speech via the Web Speech API and transcribes it into the text input. It shows a visual waveform indicator while recording and supports configurable languages. Great for accessibility and hands-free interaction.',
    codeExample: `import { VoiceInput } from '@clarity-chat/react'

<VoiceInput
  onTranscript={(text) => setInputValue(prev => prev + text)}
  onStart={() => setRecording(true)}
  onStop={() => setRecording(false)}
  language="en-US"
  continuous={false}
/>`,
  },
  {
    id: 'exportdialog',
    title: 'ExportDialog',
    category: 'component',
    tags: ['export', 'dialog', 'download', 'json', 'markdown', 'conversation', 'save'],
    content:
      'ExportDialog provides a modal for exporting the current conversation in various formats: JSON, Markdown, plain text, or PDF. Users can choose which messages to include, whether to include thinking steps, and the filename. The dialog previews the export before downloading.',
    codeExample: `import { ExportDialog } from '@clarity-chat/react'

<ExportDialog
  open={showExport}
  onClose={() => setShowExport(false)}
  messages={currentMessages}
  conversationTitle="My Chat Session"
  formats={['json', 'markdown', 'text']}
  includeThinking
/>`,
  },
  {
    id: 'citationcard',
    title: 'CitationCard',
    category: 'component',
    tags: ['citation', 'source', 'reference', 'rag', 'card', 'link', 'relevance'],
    content:
      'CitationCard renders a source citation from the RAG pipeline. It displays the source title, a brief snippet, a relevance score badge, and an optional link. Multiple CitationCards can be displayed after an AI response to show which knowledge entries were used. Supports types: library, web, academic, documentation, news.',
    codeExample: `import { CitationCard } from '@clarity-chat/react'

<CitationCard
  title="ChatWindow Component"
  snippet="Top-level container that manages scroll and renders messages."
  type="documentation"
  relevance={0.95}
  url="/docs/components/chat-window"
  onClick={() => showFullEntry(entry)}
/>`,
  },
  {
    id: 'toolcard',
    title: 'ToolCard',
    category: 'component',
    tags: ['tool', 'card', 'execution', 'function', 'status', 'result'],
    content:
      'ToolCard displays the status and result of a tool/function execution. It shows the tool name, input parameters, execution status (pending, running, completed, error), duration, and output. The card collapses the output by default and expands on click. Useful for showing the model\'s tool use in the conversation.',
    codeExample: `import { ToolCard } from '@clarity-chat/react'

<ToolCard
  name="searchKnowledgeBase"
  input='{ "query": "ChatWindow scroll behavior" }'
  status="completed"
  output='Found 3 matching entries...'
  duration="120ms"
  icon="search"
/>`,
  },

  // ─── Hooks ──────────────────────────────────────────────────
  {
    id: 'useclaritychat',
    title: 'useClarityChat',
    category: 'hook',
    tags: ['hook', 'chat', 'main', 'state', 'messages', 'send', 'conversation', 'core'],
    content:
      'useClarityChat is the primary hook for managing chat state. It provides messages, sendMessage, editMessage, deleteMessage, regenerate, clearChat, and conversation metadata. It integrates with the adapter layer to handle streaming responses from any provider. It also manages loading state, error state, and retry logic. This is the single hook you need to get a full chat working.',
    codeExample: `import { useClarityChat } from '@clarity-chat/react'

function ChatApp() {
  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    regenerate,
    isLoading,
    error,
    clearChat,
  } = useClarityChat({
    adapter: 'anthropic',
    model: 'claude-3.5-sonnet',
    systemPrompt: 'You are a helpful assistant.',
    onError: (err) => console.error(err),
  })

  return (
    <ChatWindow
      messages={messages}
      footer={<ChatInput onSend={sendMessage} disabled={isLoading} />}
    />
  )
}`,
  },
  {
    id: 'usestreaming',
    title: 'useStreaming',
    category: 'hook',
    tags: ['hook', 'streaming', 'real-time', 'chunks', 'sse', 'events'],
    content:
      'useStreaming manages the streaming state for receiving chunked responses from AI models. It handles SSE (Server-Sent Events) connections, accumulates chunks into a growing message, tracks completion state, and supports cancellation. Use this hook when you need fine-grained control over the streaming process beyond what useClarityChat provides.',
    codeExample: `import { useStreaming } from '@clarity-chat/react'

function StreamingChat() {
  const {
    content,
    isStreaming,
    startStream,
    cancelStream,
    reset,
  } = useStreaming({
    onChunk: (chunk) => console.log('Received:', chunk),
    onComplete: (fullText) => saveMessage(fullText),
    onError: (err) => showError(err),
  })

  return (
    <>
      <StreamingMessage content={content} showCursor={isStreaming} />
      {isStreaming && (
        <button onClick={cancelStream}>Stop generating</button>
      )}
    </>
  )
}`,
  },
  {
    id: 'usetokenbudgetmonitor',
    title: 'useTokenBudgetMonitor',
    category: 'hook',
    tags: ['hook', 'token', 'budget', 'monitor', 'cost', 'optimization', 'limit'],
    content:
      'useTokenBudgetMonitor tracks token usage across the conversation, calculates costs, and fires warnings when approaching budget limits. It supports per-message token counting, cumulative tracking, budget caps, and optimization suggestions. The hook integrates with the TokenUsageMeter component for visualization.',
    codeExample: `import { useTokenBudgetMonitor } from '@clarity-chat/react'

const {
  usage,
  budget,
  isOverBudget,
  estimatedCost,
  addUsage,
  resetUsage,
  setBudget,
  suggestions,
} = useTokenBudgetMonitor({
  budget: 16000,
  costPerInputToken: 0.005,
  costPerOutputToken: 0.015,
  warningThreshold: 0.8,
  onWarning: () => toast('Approaching token budget!'),
  onExceeded: () => toast.error('Token budget exceeded!'),
})`,
  },
  {
    id: 'usechat',
    title: 'useChat',
    category: 'hook',
    tags: ['hook', 'chat', 'lightweight', 'simple', 'minimal'],
    content:
      'useChat is a lightweight alternative to useClarityChat for simple use cases. It provides basic message management (send, receive, clear) without streaming, memory, or token tracking. Perfect for quick prototypes or simple chatbots where you don\'t need the full feature set.',
    codeExample: `import { useChat } from '@clarity-chat/react'

const { messages, send, clear, isLoading } = useChat({
  endpoint: '/api/chat',
  headers: { Authorization: 'Bearer ...' },
})

// Simple send
await send('Hello, how are you?')`,
  },
  {
    id: 'usememorystore',
    title: 'useMemoryStore',
    category: 'hook',
    tags: ['hook', 'memory', 'store', 'context', 'persistence', 'recall'],
    content:
      'useMemoryStore manages conversation memory with configurable strategies: sliding-window (recent N messages), semantic-chunks (similarity-based retrieval), and vector-store (full semantic search). It handles memory compression, summarization of old messages, and provides a recall function to retrieve relevant context for new messages.',
    codeExample: `import { useMemoryStore } from '@clarity-chat/react'

const {
  memories,
  addMemory,
  recall,
  clearMemory,
  strategy,
  setStrategy,
  usage,
} = useMemoryStore({
  strategy: 'semantic-chunks',
  maxTokens: 8192,
  autoSummarize: true,
  onOverflow: (excess) => console.warn(\`Memory overflow by \${excess} tokens\`),
})

// Recall relevant context for a query
const context = await recall('How do I set up streaming?')`,
  },

  // ─── Adapters ───────────────────────────────────────────────
  {
    id: 'openai-adapter',
    title: 'OpenAI Adapter',
    category: 'adapter',
    tags: ['adapter', 'openai', 'gpt', 'api', 'provider', 'integration'],
    content:
      'The OpenAI adapter connects Clarity Chat to OpenAI\'s API (GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo). It handles authentication, request formatting, streaming via SSE, error handling, and function calling. The adapter translates Clarity Chat\'s universal message format to OpenAI\'s API format and back. It supports all OpenAI-specific features including JSON mode, seed, and temperature.',
    codeExample: `import { createOpenAIAdapter } from '@clarity-chat/adapters'

const adapter = createOpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4096,
  stream: true,
})

// Use with useClarityChat
const chat = useClarityChat({ adapter })

// Or use standalone
const response = await adapter.chat([
  { role: 'system', content: 'You are helpful.' },
  { role: 'user', content: 'Hello!' },
])`,
  },
  {
    id: 'anthropic-adapter',
    title: 'Anthropic Adapter',
    category: 'adapter',
    tags: ['adapter', 'anthropic', 'claude', 'api', 'provider', 'integration'],
    content:
      'The Anthropic adapter connects Clarity Chat to Anthropic\'s API (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku). It handles the Messages API format, streaming, system prompts, and tool use. The adapter supports Anthropic-specific features like extended thinking, prompt caching, and the 200K context window. It translates between Clarity Chat\'s universal format and Anthropic\'s API.',
    codeExample: `import { createAnthropicAdapter } from '@clarity-chat/adapters'

const adapter = createAnthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3.5-sonnet',
  maxTokens: 8192,
  stream: true,
  systemPrompt: 'You are a coding assistant.',
})

// Use with useClarityChat
const chat = useClarityChat({ adapter })

// Supports extended thinking
const response = await adapter.chat(messages, {
  thinking: { enabled: true, budgetTokens: 4096 },
})`,
  },
  {
    id: 'google-adapter',
    title: 'Google Adapter',
    category: 'adapter',
    tags: ['adapter', 'google', 'gemini', 'api', 'provider', 'integration'],
    content:
      'The Google adapter connects Clarity Chat to Google\'s Gemini API (Gemini 2.0 Flash, Gemini 1.5 Pro). It handles the Gemini content format, streaming, multi-modal input (text + images), and function calling. The adapter supports Gemini\'s massive context windows (up to 2M tokens) and translates between Clarity Chat\'s format and Google\'s API.',
    codeExample: `import { createGoogleAdapter } from '@clarity-chat/adapters'

const adapter = createGoogleAdapter({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-2.0-flash',
  maxOutputTokens: 8192,
  stream: true,
})

// Use with useClarityChat
const chat = useClarityChat({ adapter })

// Supports multi-modal
const response = await adapter.chat([
  { role: 'user', content: 'Describe this image', images: [imageBuffer] },
])`,
  },

  // ─── Memory System ──────────────────────────────────────────
  {
    id: 'memory-setup',
    title: 'Memory System Setup',
    category: 'memory',
    tags: ['memory', 'setup', 'configuration', 'sliding-window', 'semantic', 'vector', 'context'],
    content:
      'The Clarity Chat memory system provides three strategies for managing conversation context. Sliding Window keeps the most recent N messages in context. Semantic Chunks groups related messages and retrieves the most relevant chunks. Vector Store uses embeddings to find semantically similar past messages. Configure memory at the provider level or per-conversation. Memory integrates with token optimization to stay within budget.',
    codeExample: `import { ClarityChatProvider, MemoryConfig } from '@clarity-chat/react'

const memoryConfig: MemoryConfig = {
  strategy: 'semantic-chunks',
  maxTokens: 8192,
  autoSummarize: true,
  summarizeAfter: 20, // messages
  chunkSize: 5,
  overlapSize: 1,
  vectorStore: {
    dimensions: 1536,
    similarity: 'cosine',
  },
}

function App() {
  return (
    <ClarityChatProvider memory={memoryConfig}>
      <ChatInterface />
    </ClarityChatProvider>
  )
}`,
  },

  // ─── Token Optimization ─────────────────────────────────────
  {
    id: 'token-setup',
    title: 'Token Optimization Setup',
    category: 'token',
    tags: ['token', 'optimization', 'setup', 'compression', 'summarization', 'pruning', 'budget'],
    content:
      'Token optimization reduces API costs by compressing context, summarizing old messages, and pruning low-relevance content. Enable optimization techniques individually: Context Compression removes redundant whitespace and shortens verbose messages. Auto Summarization replaces long message chains with summaries. Context Pruning removes messages with low relevance scores. Set a budget to cap spending per conversation.',
    codeExample: `import { ClarityChatProvider, TokenConfig } from '@clarity-chat/react'

const tokenConfig: TokenConfig = {
  budget: 16000,
  optimization: {
    compression: true,
    summarization: true,
    pruning: true,
  },
  tracking: {
    showExpenditure: true,
    warningThreshold: 0.8,
    onBudgetExceeded: () => {
      console.warn('Budget exceeded!')
    },
  },
  costRates: {
    inputPerToken: 0.000005,
    outputPerToken: 0.000015,
  },
}

function App() {
  return (
    <ClarityChatProvider tokens={tokenConfig}>
      <ChatInterface />
    </ClarityChatProvider>
  )
}`,
  },

  // ─── RAG ────────────────────────────────────────────────────
  {
    id: 'rag-pipeline',
    title: 'RAG Pipeline',
    category: 'rag',
    tags: ['rag', 'retrieval', 'augmented', 'generation', 'search', 'knowledge', 'embeddings', 'pipeline'],
    content:
      'The Clarity Chat RAG pipeline integrates retrieval-augmented generation into the chat flow. When a user sends a message, the pipeline: 1) Generates an embedding for the query, 2) Searches a vector store or knowledge base for relevant documents, 3) Ranks results by relevance, 4) Injects top-K results into the model context as citations, 5) The model generates a response informed by the retrieved knowledge. Citations are displayed as CitationCards after the response.',
    codeExample: `import { createRAGPipeline } from '@clarity-chat/rag'

const rag = createRAGPipeline({
  vectorStore: myVectorStore,
  embedModel: 'text-embedding-3-small',
  topK: 5,
  minRelevance: 0.7,
  reranker: 'cohere-rerank-v3',
})

// Integrate with chat
const chat = useClarityChat({
  adapter: myAdapter,
  rag: rag,
  onCitations: (citations) => setCitations(citations),
})

// Or use standalone
const results = await rag.search('How do I use ChatWindow?')`,
  },

  // ─── Tool System ────────────────────────────────────────────
  {
    id: 'tool-registration',
    title: 'Tool Registration',
    category: 'tool',
    tags: ['tool', 'function', 'calling', 'registration', 'execution', 'schema'],
    content:
      'The tool registration system lets you define functions the AI model can call during conversations. Register tools with a name, description, parameter schema, and handler function. The model will decide when to call tools based on the conversation. Tool executions are displayed as ToolCards in the chat, showing status, input, and output. Supports parallel tool calls and tool chaining.',
    codeExample: `import { registerTool } from '@clarity-chat/tools'

registerTool({
  name: 'searchDocs',
  description: 'Search the documentation for a topic',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'number', description: 'Max results' },
    },
    required: ['query'],
  },
  handler: async ({ query, limit = 5 }) => {
    const results = await searchKnowledgeBase(query, limit)
    return { results }
  },
})

// Use with chat
const chat = useClarityChat({
  adapter: myAdapter,
  tools: ['searchDocs', 'runCode'],
})`,
  },

  // ─── Plugin System ──────────────────────────────────────────
  {
    id: 'plugin-system',
    title: 'Plugin System',
    category: 'setup',
    tags: ['plugin', 'system', 'extend', 'middleware', 'hooks', 'lifecycle', 'custom'],
    content:
      'The Clarity Chat plugin system lets you extend functionality with custom middleware. Plugins can hook into the message lifecycle (beforeSend, afterReceive, onError), add custom UI components, register new tools, and modify adapter behavior. Plugins are composable and can be shared as npm packages. Use the plugin API to build custom integrations, analytics, moderation, or any extension.',
    codeExample: `import { createPlugin } from '@clarity-chat/plugins'

const analyticsPlugin = createPlugin({
  name: 'analytics',
  version: '1.0.0',
  hooks: {
    beforeSend: (message) => {
      trackEvent('message_sent', { length: message.content.length })
      return message // pass through
    },
    afterReceive: (message) => {
      trackEvent('message_received', {
        tokens: message.tokenCount,
        latency: message.latency,
      })
      return message
    },
    onError: (error) => {
      trackError(error)
    },
  },
})

// Register plugin
<ClarityChatProvider plugins={[analyticsPlugin]}>
  <ChatInterface />
</ClarityChatProvider>`,
  },

  // ─── Setup / App ────────────────────────────────────────────
  {
    id: 'claritychatapp',
    title: 'ClarityChatApp',
    category: 'setup',
    tags: ['app', 'setup', 'provider', 'wrapper', 'configuration', 'root', 'main'],
    content:
      'ClarityChatApp is the root provider component that wraps your entire chat application. It initializes the adapter, memory system, token tracking, RAG pipeline, and plugin system. All child components can access the chat context via hooks. This is the recommended entry point for setting up a full-featured Clarity Chat application.',
    codeExample: `import { ClarityChatApp } from '@clarity-chat/react'
import { createAnthropicAdapter } from '@clarity-chat/adapters'

const adapter = createAnthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3.5-sonnet',
})

function App() {
  return (
    <ClarityChatApp
      adapter={adapter}
      memory={{ strategy: 'sliding-window', maxTokens: 8192 }}
      tokens={{ budget: 16000, optimization: { compression: true } }}
      theme="system"
    >
      <Sidebar />
      <ChatWindow />
      <SettingsPanel />
    </ClarityChatApp>
  )
}`,
  },
  {
    id: 'mentionsystem',
    title: 'MentionSystem',
    category: 'component',
    tags: ['mention', 'at', 'autocomplete', 'popup', 'components', 'hooks', 'reference'],
    content:
      'MentionSystem provides an @-mention autocomplete popup for referencing components, hooks, or other entities in chat messages. When the user types "@" in the input, a filterable popup appears listing available items. Selecting an item inserts a styled mention tag into the message. The mention data can be used to automatically inject relevant documentation into the AI context.',
    codeExample: `import { MentionSystem } from '@clarity-chat/react'

<MentionSystem
  trigger="@"
  items={[
    { id: 'chatwindow', label: 'ChatWindow', type: 'component' },
    { id: 'chatinput', label: 'ChatInput', type: 'component' },
    { id: 'useclaritychat', label: 'useClarityChat', type: 'hook' },
    { id: 'usestreaming', label: 'useStreaming', type: 'hook' },
  ]}
  onSelect={(item) => insertMention(item)}
  filter={textAfterAt}
  renderItem={(item) => (
    <div className="flex items-center gap-2">
      <Badge>{item.type}</Badge>
      <span>{item.label}</span>
    </div>
  )}
/>`,
  },
]

/**
 * Search the knowledge base using basic keyword matching.
 * Splits the query into tokens and scores each entry by how many
 * tags, title words, or content words match. Returns entries sorted
 * by descending match score, filtered to those with at least one match.
 */
export function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1)

  if (queryTokens.length === 0) return []

  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0
    const titleLower = entry.title.toLowerCase()
    const contentLower = entry.content.toLowerCase()
    const tagsJoined = entry.tags.join(' ').toLowerCase()

    for (const token of queryTokens) {
      // Exact title match gets highest score
      if (titleLower === token) score += 10
      // Title contains token
      if (titleLower.includes(token)) score += 5
      // Tag match
      if (entry.tags.some(tag => tag.includes(token))) score += 3
      // Category match
      if (entry.category.includes(token)) score += 2
      // Content match
      if (contentLower.includes(token)) score += 1
    }

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.entry)
}
