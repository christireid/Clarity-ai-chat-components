# Streaming Components API

Complete API reference for streaming components: StreamingMessage, ToolInvocationCard, CitationCard, and ModelSelector.

## StreamingMessage

Renders AI responses with real-time streaming, tool calls, citations, and thinking steps.

### Props

```typescript
interface StreamingMessageProps {
  /** Message content (plain text or JSON) */
  content: string
  
  /** Whether currently streaming */
  isStreaming?: boolean
  
  /** Tool/function calls */
  toolCalls?: ToolCall[]
  
  /** RAG citations */
  citations?: Citation[]
  
  /** Chain-of-thought thinking steps */
  thinkingSteps?: string[]
  
  /** Error message */
  error?: Error | string
  
  /** Show thinking steps section */
  showThinking?: boolean
  
  /** Show citations section */
  showCitations?: boolean
  
  /** Show tool calls section */
  showTools?: boolean
  
  /** Retry callback for errors */
  onRetry?: () => void
  
  /** Additional CSS classes */
  className?: string
}
```

### Example

```tsx
import { StreamingMessage } from '@clarity-chat/react'

<StreamingMessage
  content={streamingText}
  isStreaming={true}
  toolCalls={[
    {
      id: 'call_1',
      type: 'function',
      function: { name: 'web_search', arguments: '{"query":"AI"}' }
    }
  ]}
  citations={[
    {
      id: 'cite_1',
      source: 'Wikipedia',
      chunkText: 'Artificial intelligence...',
      confidence: 0.92
    }
  ]}
  thinkingSteps={[
    'Analyzing user query...',
    'Searching knowledge base...',
    'Generating response...'
  ]}
  showThinking
  showTools
  showCitations
  error={null}
  onRetry={handleRetry}
/>
```

### Features

- **Token Streaming**: Displays text with animated cursor
- **Partial JSON**: Automatically detects and formats JSON
- **Tool Integration**: Embeds ToolInvocationCard components
- **Citations**: Embeds CitationCard components
- **Thinking Steps**: Shows chain-of-thought with checkmarks
- **Error Handling**: Displays errors with retry button
- **Animations**: Smooth fade-in with Framer Motion

### JSON Detection

Automatically formats JSON objects:

```tsx
// Input: '{"name": "John", "age": 30}'
// Output: Formatted JSON with syntax highlighting

<StreamingMessage content='{"name": "John", "age": 30}' />
```

Handles partial JSON during streaming:

```tsx
// Input: '{"name": "John", "age":'
// Output: Plain text until complete

<StreamingMessage content='{"name": "John", "age":' isStreaming />
```

## ToolInvocationCard

Displays function/tool invocations with approval workflow.

### Props

```typescript
interface ToolInvocationCardProps {
  /** Tool call data */
  toolCall: ToolCall
  
  /** Current status */
  status?: ToolStatus
  
  /** Execution result */
  result?: unknown
  
  /** Error if execution failed */
  error?: Error | string
  
  /** Requires user approval */
  requiresApproval?: boolean
  
  /** Approval callback */
  onApprove?: (tool: ToolCall) => void | Promise<void>
  
  /** Rejection callback */
  onReject?: (tool: ToolCall) => void
  
  /** Retry callback for errors */
  onRetry?: (tool: ToolCall) => void
  
  /** Additional CSS classes */
  className?: string
}

type ToolStatus = 
  | 'pending'    // Waiting for approval
  | 'approved'   // Approved, not yet executed
  | 'rejected'   // User rejected
  | 'executing'  // Currently running
  | 'success'    // Completed successfully
  | 'error'      // Failed with error
```

### Example

```tsx
import { ToolInvocationCard } from '@clarity-chat/react'

const [status, setStatus] = useState('pending')
const [result, setResult] = useState(null)

const handleApprove = async (tool) => {
  setStatus('executing')
  try {
    const res = await executeTool(tool.function.name, tool.function.arguments)
    setResult(res)
    setStatus('success')
  } catch (error) {
    setStatus('error')
  }
}

<ToolInvocationCard
  toolCall={{
    id: 'call_1',
    type: 'function',
    function: {
      name: 'web_search',
      arguments: '{"query": "AI trends 2024", "limit": 5}'
    }
  }}
  status={status}
  result={result}
  requiresApproval
  onApprove={handleApprove}
  onReject={(tool) => setStatus('rejected')}
  onRetry={handleApprove}
/>
```

### Status Colors

| Status | Color | Icon |
|--------|-------|------|
| pending | Yellow | ⏱️ |
| approved | Blue | ✓ |
| rejected | Red | ✗ |
| executing | Blue | ⟳ |
| success | Green | ✓ |
| error | Red | ! |

### Features

- **JSON Formatting**: Pretty-prints function arguments
- **Expandable Result**: Click to show/hide execution result
- **Status Indicators**: Color-coded status with icons
- **Approval Workflow**: Optional approve/reject buttons
- **Error Recovery**: Retry button on failure
- **Animations**: Smooth transitions with Framer Motion

## CitationCard

Displays RAG sources with confidence scores and metadata.

### Props

```typescript
interface CitationCardProps {
  /** Citation data */
  citation: Citation
  
  /** Start expanded */
  defaultExpanded?: boolean
  
  /** Preview text length */
  previewLength?: number
  
  /** Show confidence badge */
  showConfidence?: boolean
  
  /** Additional CSS classes */
  className?: string
}

interface Citation {
  id: string
  source: string
  chunkText: string
  confidence: number
  url?: string
  metadata?: {
    date?: string
    page?: number
    section?: string
    author?: string
  }
}
```

### Example

```tsx
import { CitationCard } from '@clarity-chat/react'

<CitationCard
  citation={{
    id: 'cite_1',
    source: 'Nature: AI Research 2024',
    chunkText: 'Recent advances in artificial intelligence have led to breakthrough performance in natural language understanding tasks. Large language models demonstrate emergent capabilities...',
    confidence: 0.92,
    url: 'https://nature.com/articles/ai-research-2024',
    metadata: {
      date: '2024-01-15',
      page: 42,
      section: 'Machine Learning',
      author: 'Dr. Jane Smith'
    }
  }}
  defaultExpanded={false}
  previewLength={150}
  showConfidence
/>
```

### Confidence Colors

| Confidence | Color | Label |
|------------|-------|-------|
| ≥ 0.9 | Green | High |
| 0.7 - 0.89 | Blue | Medium |
| 0.5 - 0.69 | Yellow | Fair |
| < 0.5 | Red | Low |

### Features

- **Expandable Text**: Click to expand/collapse full text
- **Confidence Badge**: Color-coded confidence percentage
- **External Links**: Button to open source URL
- **Metadata Badges**: Date, page, section, author
- **Preview Truncation**: Customizable preview length
- **Animations**: Smooth expand/collapse with Framer Motion

## ModelSelector

Visual selector for switching between AI models.

### Props

```typescript
interface ModelSelectorProps {
  /** Available models */
  models: ModelMetadata[]
  
  /** Selected model ID */
  value: string
  
  /** Selection callback */
  onChange: (modelId: string, config: ModelConfig) => void
  
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  
  /** Disabled state */
  disabled?: boolean
  
  /** Additional CSS classes */
  className?: string
}

interface ModelMetadata {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  speed: 'fastest' | 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'good' | 'better' | 'best'
  contextWindow: number
  description?: string
}
```

### Example

```tsx
import { ModelSelector, allModels } from '@clarity-chat/react'

function App() {
  const [model, setModel] = useState('gpt-4-turbo')
  const [config, setConfig] = useState({})

  return (
    <ModelSelector
      models={allModels}
      value={model}
      onChange={(modelId, modelConfig) => {
        setModel(modelId)
        setConfig(modelConfig)
      }}
      showMetrics
    />
  )
}
```

### Filter Models

```tsx
// OpenAI only
<ModelSelector
  models={allModels.filter(m => m.provider === 'openai')}
  value={model}
  onChange={handleChange}
/>

// Fast models only
<ModelSelector
  models={allModels.filter(m => m.speed === 'fastest')}
  value={model}
  onChange={handleChange}
/>

// Cheap models only
<ModelSelector
  models={allModels.filter(m => m.cost === 'low')}
  value={model}
  onChange={handleChange}
/>
```

### Features

- **Provider Grouping**: Models grouped by provider
- **Metric Badges**: Speed, cost, and quality indicators
- **Context Window**: Shows token limit
- **Descriptions**: Hover for model details
- **Keyboard Navigation**: Arrow keys and Enter
- **Search**: Type to filter models
- **Responsive**: Mobile-friendly dropdown

### Badge Colors

**Speed**:
- Fastest: Green
- Fast: Blue
- Medium: Yellow
- Slow: Red

**Cost**:
- Low: Green
- Medium: Yellow
- High: Red

**Quality**:
- Good: Yellow
- Better: Blue
- Best: Green

## Common Types

### ToolCall

```typescript
interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON-encoded
  }
}
```

### Citation

```typescript
interface Citation {
  id: string
  source: string
  chunkText: string
  confidence: number
  url?: string
  metadata?: {
    date?: string
    page?: number
    section?: string
    author?: string
  }
}
```

### ModelConfig

```typescript
interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google'
  model: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
}
```

## Usage Examples

### Complete Streaming Flow

```tsx
import { 
  openAIAdapter, 
  StreamingMessage, 
  ToolInvocationCard, 
  CitationCard,
  ModelSelector,
  allModels
} from '@clarity-chat/react'

function Chat() {
  const [model, setModel] = useState('gpt-4-turbo')
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [toolCalls, setToolCalls] = useState([])
  const [citations, setCitations] = useState([])
  const [toolStatuses, setToolStatuses] = useState({})

  const handleStream = async () => {
    setContent('')
    setIsStreaming(true)

    const config = {
      provider: 'openai',
      model,
      apiKey: process.env.OPENAI_API_KEY
    }

    try {
      for await (const chunk of openAIAdapter.stream(messages, config)) {
        switch (chunk.type) {
          case 'token':
            setContent(prev => prev + chunk.content)
            break
          case 'tool_call':
            setToolCalls(prev => [...prev, chunk.toolCall])
            setToolStatuses(prev => ({ ...prev, [chunk.toolCall.id]: 'pending' }))
            break
          case 'citation':
            setCitations(prev => [...prev, chunk.citation])
            break
        }
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const handleApprove = async (tool) => {
    setToolStatuses(prev => ({ ...prev, [tool.id]: 'executing' }))
    try {
      await executeTool(tool)
      setToolStatuses(prev => ({ ...prev, [tool.id]: 'success' }))
    } catch {
      setToolStatuses(prev => ({ ...prev, [tool.id]: 'error' }))
    }
  }

  return (
    <div>
      <ModelSelector
        models={allModels}
        value={model}
        onChange={(id) => setModel(id)}
      />
      
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
      />
      
      {toolCalls.map(tool => (
        <ToolInvocationCard
          key={tool.id}
          toolCall={tool}
          status={toolStatuses[tool.id]}
          requiresApproval
          onApprove={handleApprove}
        />
      ))}
      
      {citations.map(citation => (
        <CitationCard
          key={citation.id}
          citation={citation}
          showConfidence
        />
      ))}
    </div>
  )
}
```

## See Also

- [Streaming Guide](/guide/streaming)
- [Model Adapters API](/api/model-adapters)
- [Examples](/examples/streaming)
- [Storybook](https://storybook.clarity-chat.dev)
