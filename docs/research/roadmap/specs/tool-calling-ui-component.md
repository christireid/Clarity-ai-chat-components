# Tool Calling Generative UI Component - Detailed Specification

**Created**: January 27, 2026
**Status**: Design Specification
**Priority**: P1 (Critical - Q2 2026)
**Estimated Effort**: 3-4 weeks
**Complexity**: High

---

## Executive Summary

A comprehensive tool calling visualization system that renders AI tool executions as interactive React components rather than plain JSON or text. This system enables "Generative UI" patterns where AI agents can output structured, context-aware interfaces based on tool execution results.

**Key Innovation**: Move beyond static tool call displays to dynamic, interactive components that enhance user understanding and enable rich interactions with tool results.

**Competitive Benchmark**: Assistant UI (best-in-class implementation with `makeAssistantToolUI` pattern)

---

## Problem Statement

### Current Limitations

1. **Static Tool Displays**: Most libraries render tool calls as JSON dumps or plain text
2. **Poor User Experience**: Technical tool names and raw parameters confuse non-technical users
3. **Limited Interactivity**: Tool results are passive displays without user interaction
4. **Generic Rendering**: All tools look the same regardless of their purpose
5. **Streaming Challenges**: Tool execution state changes aren't clearly communicated

### User Pain Points

- **Developers**: Hard to create custom tool UIs, no standard patterns
- **End Users**: Can't understand what AI is doing, technical jargon
- **Product Teams**: Want rich tool visualizations but no easy way to implement

### Market Opportunity

- **Assistant UI**: Leading with generative UI, 8.2k+ stars
- **LangChain UI**: Has generative UI framework but complex setup
- **shadcn/ui AI**: Basic tool components but not truly generative
- **Gap**: Need robust, easy-to-use generative tool UI system

---

## Solution Overview

### Core Concept

A **component registry system** that maps tool names to React components, enabling:

1. **Tool-Specific Rendering**: Each tool gets custom UI tailored to its purpose
2. **Status-Aware Display**: Visual states for pending, running, complete, error
3. **Progressive Updates**: Tool results stream in incrementally
4. **Interactive Results**: Users can interact with tool outputs
5. **Fallback Handling**: Graceful degradation for unknown tools

### Architecture Philosophy

```
Tool Call (Data) → Registry Lookup → Component Selection → Dynamic Render
     ↓                    ↓                    ↓                 ↓
  toolName          Find UI Config      Pick Component      Render with Props
  args/result       + Fallback          Based on Status     + Event Handlers
  status
```

---

## Design Specifications

### 1. Component Hierarchy

```tsx
<Message.Parts>
  <ToolCallGroup>
    <ToolCall toolCallId="..." toolName="search" status="running">
      <ToolHeader>
        <ToolIcon name="search" />
        <ToolTitle>Searching web...</ToolTitle>
        <ToolStatus status="running" />
      </ToolHeader>

      <ToolFallback args={...}>
        {/* Renders while tool executes */}
        <Spinner /> Searching for "React hooks"...
      </ToolFallback>

      <ToolResult result={...}>
        {/* Renders when complete - custom per tool */}
        <SearchResultsCard results={result.items} />
      </ToolResult>

      <ToolError error={...}>
        {/* Renders on error */}
        Search failed: Rate limit exceeded
      </ToolError>
    </ToolCall>
  </ToolCallGroup>
</Message.Parts>
```

### 2. Component Specifications

#### **ToolCall** (Root Component)

**Purpose**: Container for individual tool execution

**Props**:
```tsx
interface ToolCallProps {
  // Identity
  toolCallId: string;
  toolName: string;

  // Data
  args: Record<string, unknown>;
  result?: unknown;
  error?: Error | string;

  // State
  status: 'pending' | 'running' | 'complete' | 'error';

  // Display
  variant?: 'default' | 'compact' | 'inline';
  collapsible?: boolean;
  defaultExpanded?: boolean;

  // Customization
  components?: {
    ToolFallback?: ComponentType<ToolFallbackProps>;
    ToolResult?: ComponentType<ToolResultProps>;
    ToolError?: ComponentType<ToolErrorProps>;
    ToolHeader?: ComponentType<ToolHeaderProps>;
  };

  // Events
  onStatusChange?: (status: ToolCallStatus) => void;
  onInteraction?: (action: string, data: unknown) => void;
}
```

**Variants**:
- `default`: Full card with header, body, footer
- `compact`: Minimal display, no header
- `inline`: Inline with message text (like citations)

**Behavior**:
- Auto-expands on status change
- Collapses after completion (configurable)
- Streams updates as tool executes
- Handles errors gracefully

---

#### **ToolFallback**

**Purpose**: Loading/pending state display while tool executes

**Props**:
```tsx
interface ToolFallbackProps {
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'running';

  // Display
  showArgs?: boolean;
  showSpinner?: boolean;
  message?: string;

  // Customization
  className?: string;
  children?: ReactNode;
}
```

**Default Rendering**:
```tsx
<ToolFallback args={{ query: "React hooks", limit: 10 }}>
  <Spinner size="sm" />
  <span>Searching for "React hooks"...</span>
  {showArgs && (
    <ToolArgs args={args} truncate={true} />
  )}
</ToolFallback>
```

**Best Practices**:
- Show user-friendly description of what's happening
- Display relevant args (e.g., search query)
- Animate to indicate progress
- Avoid technical jargon (toolName, raw JSON)

---

#### **ToolResult**

**Purpose**: Custom UI for tool execution results

**Props**:
```tsx
interface ToolResultProps {
  result: unknown; // Tool-specific result data
  toolName: string;
  metadata?: Record<string, unknown>;

  // Customization
  interactive?: boolean;
  className?: string;

  // Events
  onAction?: (action: string, data: unknown) => void;
}
```

**Example Implementations**:

**Search Tool**:
```tsx
const SearchToolResult = ({ result }) => (
  <div className="search-results">
    <h3>{result.query}</h3>
    <p className="text-muted">{result.count} results</p>

    <div className="results-list">
      {result.items.map(item => (
        <SearchResultCard
          key={item.id}
          title={item.title}
          snippet={item.snippet}
          url={item.url}
          onClick={() => window.open(item.url)}
        />
      ))}
    </div>
  </div>
);
```

**Analytics Tool**:
```tsx
const AnalyticsToolResult = ({ result }) => (
  <div className="analytics-result">
    <h3>Analytics Overview</h3>

    <InteractiveChart
      data={result.timeSeries}
      type="line"
      onClick={(point) => console.log('Clicked:', point)}
    />

    <MetricsGrid metrics={result.summary} />

    <Button onClick={() => exportData(result)}>
      Export Data
    </Button>
  </div>
);
```

**File System Tool**:
```tsx
const FileTreeToolResult = ({ result }) => (
  <FileTreeViewer
    files={result.files}
    onFileClick={(file) => previewFile(file)}
    onFolderToggle={(folder) => toggleFolder(folder)}
  />
);
```

**Best Practices**:
- Make results scannable and visual
- Use appropriate data visualization
- Enable interactions where relevant
- Handle large result sets gracefully
- Provide export/copy options

---

#### **ToolError**

**Purpose**: Error state display when tool execution fails

**Props**:
```tsx
interface ToolErrorProps {
  error: Error | string;
  toolName: string;
  args: Record<string, unknown>;

  // Actions
  onRetry?: () => void;
  onDismiss?: () => void;

  // Display
  showDetails?: boolean;
  className?: string;
}
```

**Default Rendering**:
```tsx
<ToolError error={error}>
  <ErrorIcon className="text-destructive" />
  <div>
    <h4>Search Failed</h4>
    <p>{getErrorMessage(error)}</p>

    {showDetails && (
      <Collapsible>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </Collapsible>
    )}
  </div>

  <div className="actions">
    {onRetry && <Button onClick={onRetry}>Retry</Button>}
    {onDismiss && <Button variant="ghost" onClick={onDismiss}>Dismiss</Button>}
  </div>
</ToolError>
```

**Best Practices**:
- User-friendly error messages
- Suggest resolution when possible
- Offer retry action
- Log technical details for debugging
- Don't expose sensitive info

---

#### **ToolGroup**

**Purpose**: Group related tool calls together

**Props**:
```tsx
interface ToolGroupProps {
  toolCalls: ToolCallData[];

  // Display
  variant?: 'stacked' | 'grid' | 'tabs';
  collapsible?: boolean;
  defaultExpanded?: boolean;

  // Behavior
  showCount?: boolean;
  groupBy?: 'status' | 'type' | 'timestamp';

  // Events
  onToolClick?: (toolCallId: string) => void;
}
```

**Variants**:

**Stacked** (Default):
```tsx
<ToolGroup variant="stacked">
  <ToolCall name="search_products" />
  <ToolCall name="get_inventory" />
  <ToolCall name="calculate_price" />
</ToolGroup>
```

**Grid** (Parallel Tools):
```tsx
<ToolGroup variant="grid" columns={2}>
  <ToolCall name="weather_forecast" />
  <ToolCall name="traffic_status" />
  <ToolCall name="news_headlines" />
  <ToolCall name="calendar_events" />
</ToolGroup>
```

**Tabs** (Alternative Approaches):
```tsx
<ToolGroup variant="tabs">
  <ToolCall name="approach_a" label="Option A" />
  <ToolCall name="approach_b" label="Option B" />
  <ToolCall name="approach_c" label="Option C" />
</ToolGroup>
```

---

#### **ToolHeader**

**Purpose**: Tool call header with icon, title, status

**Props**:
```tsx
interface ToolHeaderProps {
  toolName: string;
  displayName?: string;
  icon?: ReactNode | string;
  status: ToolCallStatus;

  // Actions
  actions?: ReactNode;
  collapsible?: boolean;
  onToggle?: () => void;
}
```

**Default Rendering**:
```tsx
<ToolHeader>
  <ToolIcon name={toolName} />
  <ToolTitle>{displayName || humanize(toolName)}</ToolTitle>
  <ToolStatus status={status} />
  <ToolActions>
    {collapsible && <CollapseButton />}
    <CopyButton />
    <MoreButton />
  </ToolActions>
</ToolHeader>
```

---

#### **ToolStatus**

**Purpose**: Visual status indicator

**Props**:
```tsx
interface ToolStatusProps {
  status: 'pending' | 'running' | 'complete' | 'error';

  // Display
  variant?: 'badge' | 'icon' | 'text' | 'dot';
  showLabel?: boolean;
  animated?: boolean;
}
```

**Status Mappings**:
```tsx
const STATUS_CONFIG = {
  pending: {
    icon: <ClockIcon />,
    label: 'Queued',
    color: 'muted',
    animated: false,
  },
  running: {
    icon: <Spinner />,
    label: 'Running',
    color: 'primary',
    animated: true,
  },
  complete: {
    icon: <CheckIcon />,
    label: 'Complete',
    color: 'success',
    animated: false,
  },
  error: {
    icon: <XIcon />,
    label: 'Failed',
    color: 'destructive',
    animated: false,
  },
};
```

---

### 3. Registry System

#### **makeToolUI** (Registration Function)

**Purpose**: Register custom UI components for specific tools

**API**:
```tsx
function makeToolUI(
  toolName: string,
  components: {
    ToolFallback?: ComponentType<ToolFallbackProps>;
    ToolResult?: ComponentType<ToolResultProps>;
    ToolError?: ComponentType<ToolErrorProps>;
  }
): void;
```

**Usage**:
```tsx
// Register weather tool UI
makeToolUI('get_weather', {
  ToolFallback: ({ args }) => (
    <div className="tool-pending">
      <Spinner />
      <span>Checking weather for {args.location}...</span>
    </div>
  ),

  ToolResult: ({ result }) => (
    <WeatherCard
      location={result.location}
      temperature={result.temperature}
      conditions={result.conditions}
      forecast={result.forecast}
    />
  ),
});

// Register search tool UI
makeToolUI('web_search', {
  ToolFallback: ({ args }) => (
    <div className="search-pending">
      <SearchIcon className="animate-pulse" />
      <span>Searching for "{args.query}"...</span>
    </div>
  ),

  ToolResult: ({ result }) => (
    <SearchResults
      query={result.query}
      results={result.items}
      onResultClick={(item) => window.open(item.url)}
    />
  ),

  ToolError: ({ error, onRetry }) => (
    <div className="search-error">
      <p>Search failed: {error.message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  ),
});

// Register analytics tool UI
makeToolUI('analytics_query', {
  ToolResult: ({ result }) => (
    <div className="analytics-result">
      <h3>{result.metric}</h3>
      <InteractiveChart
        data={result.timeSeries}
        type={result.chartType}
      />
      <MetricsTable data={result.breakdown} />
      <Button onClick={() => exportData(result)}>
        Export CSV
      </Button>
    </div>
  ),
});
```

#### **useToolRegistry** (Hook)

**Purpose**: Access registered tool UIs

**API**:
```tsx
function useToolRegistry(): {
  getToolUI: (toolName: string) => ToolUIConfig | undefined;
  registerToolUI: (toolName: string, config: ToolUIConfig) => void;
  hasToolUI: (toolName: string) => boolean;
};
```

**Usage**:
```tsx
const ToolCallRenderer = ({ toolCall }) => {
  const { getToolUI, hasToolUI } = useToolRegistry();

  const toolUI = getToolUI(toolCall.toolName);

  if (!hasToolUI(toolCall.toolName)) {
    return <DefaultToolCall {...toolCall} />;
  }

  const { ToolFallback, ToolResult, ToolError } = toolUI;

  if (toolCall.status === 'error') {
    return <ToolError error={toolCall.error} />;
  }

  if (toolCall.status === 'complete') {
    return <ToolResult result={toolCall.result} />;
  }

  return <ToolFallback args={toolCall.args} status={toolCall.status} />;
};
```

---

### 4. Status Management

#### Status State Machine

```
┌─────────┐
│ pending │
└────┬────┘
     │
     v
┌─────────┐
│ running │
└────┬────┘
     │
     ├──────────┐
     v          v
┌─────────┐  ┌───────┐
│complete │  │ error │
└─────────┘  └───────┘
```

#### Status Transitions

```tsx
type ToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

interface StatusTransition {
  from: ToolCallStatus[];
  to: ToolCallStatus;
  validate?: (data: unknown) => boolean;
  onTransition?: (data: unknown) => void;
}

const STATUS_TRANSITIONS: StatusTransition[] = [
  {
    from: ['pending'],
    to: 'running',
    onTransition: (data) => {
      console.log('Tool execution started');
    },
  },
  {
    from: ['running'],
    to: 'complete',
    validate: (data) => data.result !== undefined,
    onTransition: (data) => {
      console.log('Tool execution completed');
    },
  },
  {
    from: ['running'],
    to: 'error',
    validate: (data) => data.error !== undefined,
    onTransition: (data) => {
      console.error('Tool execution failed:', data.error);
    },
  },
];
```

#### **useToolStatus** Hook

```tsx
function useToolStatus(toolCallId: string) {
  const [status, setStatus] = useState<ToolCallStatus>('pending');
  const [error, setError] = useState<Error | null>(null);

  const updateStatus = useCallback((newStatus: ToolCallStatus, data?: unknown) => {
    // Validate transition
    const transition = STATUS_TRANSITIONS.find(
      t => t.from.includes(status) && t.to === newStatus
    );

    if (!transition) {
      console.warn(`Invalid status transition: ${status} -> ${newStatus}`);
      return;
    }

    if (transition.validate && !transition.validate(data)) {
      console.warn('Status transition validation failed');
      return;
    }

    // Execute transition
    setStatus(newStatus);
    transition.onTransition?.(data);

    // Handle error state
    if (newStatus === 'error' && data?.error) {
      setError(data.error);
    }
  }, [status]);

  return { status, error, updateStatus };
}
```

---

### 5. Streaming Support

#### Progressive Tool Result Updates

**Use Case**: Stream tool results as they're generated (e.g., large search results)

**Implementation**:
```tsx
interface StreamingToolResultProps {
  toolCallId: string;
  onChunk: (chunk: unknown) => void;
  onComplete: (result: unknown) => void;
  onError: (error: Error) => void;
}

const StreamingToolResult = ({ toolCallId, onChunk, onComplete, onError }) => {
  const [chunks, setChunks] = useState<unknown[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const stream = subscribeToToolStream(toolCallId);

    stream.on('chunk', (chunk) => {
      setChunks(prev => [...prev, chunk]);
      onChunk(chunk);
    });

    stream.on('complete', (result) => {
      setIsComplete(true);
      onComplete(result);
    });

    stream.on('error', (error) => {
      onError(error);
    });

    return () => stream.close();
  }, [toolCallId]);

  return (
    <div className="streaming-result">
      {chunks.map((chunk, i) => (
        <ToolResultChunk key={i} data={chunk} />
      ))}

      {!isComplete && (
        <div className="streaming-indicator">
          <Spinner size="sm" />
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
};
```

**Example: Streaming Search Results**:
```tsx
makeToolUI('streaming_search', {
  ToolResult: ({ result, toolCallId }) => {
    const [items, setItems] = useState<SearchResult[]>([]);

    return (
      <div className="search-results">
        <h3>Search Results</h3>

        <StreamingToolResult
          toolCallId={toolCallId}
          onChunk={(chunk) => {
            setItems(prev => [...prev, chunk]);
          }}
          onComplete={(final) => {
            console.log('Search complete:', final);
          }}
        />

        <div className="results-list">
          {items.map(item => (
            <SearchResultCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    );
  },
});
```

---

### 6. Interactive Tool Results

#### Click Interactions

**Use Case**: Tool results that trigger actions on interaction

**Example: Stock Lookup**:
```tsx
makeToolUI('get_stock_price', {
  ToolResult: ({ result, onAction }) => {
    const [selectedStock, setSelectedStock] = useState(null);

    return (
      <div className="stock-result">
        <StockCard
          symbol={result.symbol}
          price={result.price}
          change={result.change}
          onClick={() => {
            setSelectedStock(result.symbol);
            // Trigger follow-up action
            onAction('view_details', { symbol: result.symbol });
          }}
        />

        {selectedStock && (
          <StockDetailsPanel
            symbol={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </div>
    );
  },
});
```

#### Form Interactions

**Use Case**: Tool results with user input (human-in-the-loop)

**Example: Confirmation Required**:
```tsx
makeToolUI('delete_file', {
  ToolFallback: ({ args, onApprove, onReject }) => (
    <div className="tool-approval">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm File Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{args.filename}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onReject}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onApprove}
              className="bg-destructive"
            >
              Delete File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),

  ToolResult: ({ result }) => (
    <div className="deletion-complete">
      <CheckIcon className="text-success" />
      <span>File "{result.filename}" deleted successfully</span>
    </div>
  ),
});
```

#### Data Export

**Use Case**: Export tool results in various formats

**Example: Analytics Export**:
```tsx
makeToolUI('analytics_report', {
  ToolResult: ({ result }) => {
    const exportData = (format: 'csv' | 'json' | 'pdf') => {
      switch (format) {
        case 'csv':
          downloadCSV(result.data);
          break;
        case 'json':
          downloadJSON(result);
          break;
        case 'pdf':
          generatePDF(result);
          break;
      }
    };

    return (
      <div className="analytics-report">
        <AnalyticsChart data={result.data} />

        <div className="export-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <DownloadIcon />
                Export
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportData('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  },
});
```

---

## API Design

### Type Definitions

```tsx
// Core types
type ToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

interface ToolCallData {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  error?: Error | string;
  status: ToolCallStatus;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, unknown>;
}

// Component props
interface ToolFallbackProps {
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'running';
  showArgs?: boolean;
  showSpinner?: boolean;
  message?: string;
  className?: string;
  children?: ReactNode;
}

interface ToolResultProps {
  result: unknown;
  toolName: string;
  metadata?: Record<string, unknown>;
  interactive?: boolean;
  className?: string;
  onAction?: (action: string, data: unknown) => void;
}

interface ToolErrorProps {
  error: Error | string;
  toolName: string;
  args: Record<string, unknown>;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

// Registry types
interface ToolUIConfig {
  ToolFallback?: ComponentType<ToolFallbackProps>;
  ToolResult?: ComponentType<ToolResultProps>;
  ToolError?: ComponentType<ToolErrorProps>;
  metadata?: {
    displayName?: string;
    description?: string;
    icon?: string | ComponentType;
    category?: string;
  };
}

interface ToolRegistry {
  [toolName: string]: ToolUIConfig;
}

// Hook return types
interface UseToolRegistryReturn {
  getToolUI: (toolName: string) => ToolUIConfig | undefined;
  registerToolUI: (toolName: string, config: ToolUIConfig) => void;
  unregisterToolUI: (toolName: string) => void;
  hasToolUI: (toolName: string) => boolean;
  getAllToolUIs: () => ToolRegistry;
}

interface UseToolStatusReturn {
  status: ToolCallStatus;
  error: Error | null;
  updateStatus: (newStatus: ToolCallStatus, data?: unknown) => void;
  reset: () => void;
}
```

### Core Functions

```tsx
// Registration
function makeToolUI(
  toolName: string,
  config: ToolUIConfig
): void;

function makeToolUIBatch(
  configs: Record<string, ToolUIConfig>
): void;

// Hooks
function useToolRegistry(): UseToolRegistryReturn;

function useToolStatus(toolCallId: string): UseToolStatusReturn;

function useToolCall(toolCallId: string): {
  data: ToolCallData;
  status: ToolCallStatus;
  execute: () => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
};

// Utilities
function getToolDisplayName(toolName: string): string;

function getToolIcon(toolName: string): ReactNode;

function formatToolArgs(args: Record<string, unknown>): string;

function isToolResultInteractive(toolName: string): boolean;
```

---

## Visual Design

### Status Colors

```tsx
const STATUS_COLORS = {
  pending: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-muted',
    icon: 'text-muted-foreground',
  },
  running: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary',
    icon: 'text-primary',
  },
  complete: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success',
    icon: 'text-success',
  },
  error: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
    icon: 'text-destructive',
  },
};
```

### Layout Patterns

**Card Layout** (Default):
```tsx
<div className="tool-call-card rounded-lg border p-4">
  <ToolHeader />
  <ToolBody />
  <ToolFooter />
</div>
```

**Inline Layout** (Compact):
```tsx
<span className="tool-call-inline">
  <ToolIcon /> <ToolStatus /> <ToolName />
</span>
```

**Grid Layout** (Multiple Tools):
```tsx
<div className="tool-call-grid grid grid-cols-2 gap-4">
  <ToolCall />
  <ToolCall />
  <ToolCall />
  <ToolCall />
</div>
```

### Animation

**Status Transitions**:
```css
.tool-call {
  transition: all 200ms ease-in-out;
}

.tool-call[data-status="running"] {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.tool-status-icon {
  transition: transform 200ms ease-in-out;
}

.tool-status-icon[data-status="complete"] {
  transform: scale(1.1);
}
```

**Streaming Content**:
```css
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-result-chunk {
  animation: slide-in 300ms ease-out;
}
```

---

## Integration Patterns

### 1. Message Integration

```tsx
<Message role="assistant">
  <MessageContent>
    <p>I'll search for that information.</p>

    <Message.Parts>
      {message.parts.map(part => {
        if (part.type === 'tool-call') {
          return (
            <ToolCall
              key={part.toolCallId}
              toolCallId={part.toolCallId}
              toolName={part.toolName}
              args={part.args}
              result={part.result}
              status={part.status}
            />
          );
        }

        if (part.type === 'text') {
          return <MessageText key={part.id}>{part.text}</MessageText>;
        }

        return null;
      })}
    </Message.Parts>

    <p>Here's what I found.</p>
  </MessageContent>
</Message>
```

### 2. Streaming Integration

```tsx
const { messages, streamMessage } = useChat();

useEffect(() => {
  const stream = streamMessage('What's the weather?');

  stream.on('tool_call_start', (toolCall) => {
    // Update UI: tool status -> running
    updateToolStatus(toolCall.id, 'running');
  });

  stream.on('tool_call_chunk', (chunk) => {
    // Update UI: append to result
    appendToolResult(chunk.toolCallId, chunk.data);
  });

  stream.on('tool_call_complete', (toolCall) => {
    // Update UI: tool status -> complete
    updateToolStatus(toolCall.id, 'complete', toolCall.result);
  });

  stream.on('tool_call_error', (error) => {
    // Update UI: tool status -> error
    updateToolStatus(error.toolCallId, 'error', error);
  });
}, []);
```

### 3. Backend Integration

**Vercel AI SDK**:
```tsx
import { useChat } from '@ai-sdk/react';
import { makeToolUI } from '@clarity-chat/react';

// Register tool UIs
makeToolUI('get_weather', {
  ToolResult: WeatherCard,
});

function ChatComponent() {
  const { messages } = useChat({
    api: '/api/chat',
    tools: {
      get_weather: {
        description: 'Get weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          const weather = await fetchWeather(location);
          return weather;
        },
      },
    },
  });

  return (
    <Chat>
      {messages.map(message => (
        <Message key={message.id} {...message} />
      ))}
    </Chat>
  );
}
```

**LangChain**:
```tsx
import { ChatLangChain } from '@clarity-chat/langchain';
import { makeToolUI } from '@clarity-chat/react';

makeToolUI('search', {
  ToolResult: SearchResults,
});

function LangChainChat() {
  return (
    <ChatLangChain
      agent={myAgent}
      toolUIRegistry={toolRegistry}
    />
  );
}
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)
- ✅ Tool call data types
- ✅ Status state machine
- ✅ Registry system implementation
- ✅ Basic ToolCall component
- ✅ Default ToolFallback/ToolResult/ToolError

### Phase 2: Component Library (Week 2)
- ✅ ToolHeader component
- ✅ ToolStatus indicator
- ✅ ToolGroup component
- ✅ ToolArgs display utility
- ✅ Status transition animations
- ✅ Error handling UI

### Phase 3: Advanced Features (Week 3)
- ✅ Streaming support
- ✅ Interactive tool results
- ✅ Human-in-the-loop patterns
- ✅ Progressive updates
- ✅ Tool result export utilities
- ✅ Collapsible tool calls

### Phase 4: Built-in Tool UIs (Week 4)
- ✅ Common tool templates (search, weather, analytics)
- ✅ Chart/graph tool results
- ✅ File system tool results
- ✅ API response tool results
- ✅ Database query tool results
- ✅ Documentation and examples

---

## Success Metrics

### User Experience
- Tool execution is visually clear and intuitive
- Users understand what AI is doing at each step
- Tool results are scannable and actionable
- Error states provide clear resolution paths

### Developer Experience
- Registering custom tool UIs takes < 10 lines of code
- Built-in tool templates cover 80% of use cases
- Type safety prevents runtime errors
- Documentation has examples for all common patterns

### Performance
- Tool UI registration has no performance impact
- Streaming tool results render smoothly (60fps)
- Large tool result sets are virtualized
- Bundle size impact < 50KB gzipped

### Adoption
- 50% of Clarity Chat users register at least one custom tool UI
- Built-in tool templates are used in 80% of projects
- GitHub stars increase by 500+ after launch
- Community contributes 10+ custom tool UI examples

---

## Technical Considerations

### Type Safety
- All tool configurations are fully typed
- Result types are inferred from tool definitions
- TypeScript provides autocomplete for tool names
- Zod schemas validate tool args/results at runtime

### Performance
- Tool registry uses Map for O(1) lookups
- Component re-renders are minimized with React.memo
- Large result sets use virtualization
- Streaming updates use efficient state updates

### Accessibility
- Tool status is announced to screen readers
- Keyboard navigation for interactive results
- Focus management during status transitions
- ARIA labels for all status indicators

### Security
- Tool results are sanitized before rendering
- XSS protection for user-generated content
- Safe execution context for interactive results
- Rate limiting for tool execution

---

## Competitive Analysis

### Assistant UI
**Strengths**:
- Excellent `makeAssistantToolUI` pattern
- Robust implementation
- Great TypeScript support

**Our Improvements**:
- Simpler API (fewer concepts)
- Better streaming support
- Built-in tool templates
- More comprehensive documentation

### LangChain UI
**Strengths**:
- Generative UI framework
- Good streaming support

**Our Improvements**:
- Easier to use (less setup)
- Better DX (fewer dependencies)
- More polished components
- Clear documentation

### shadcn/ui AI
**Strengths**:
- Beautiful default styling
- Good component quality

**Our Improvements**:
- More powerful tool UI system
- Better interactive patterns
- Streaming support
- Component registry

---

## Documentation Requirements

### Getting Started Guide
1. Basic tool call display
2. Registering custom tool UI
3. Handling tool status
4. Streaming tool results
5. Interactive tool results

### API Reference
- All component props
- All hook signatures
- Registry functions
- Type definitions
- Utility functions

### Examples
- 10+ common tool types
- Weather tool example
- Search tool example
- Analytics tool example
- File system tool example
- Database query example
- API call example
- Human-in-the-loop example

### Migration Guide
- From basic tool display
- From Assistant UI patterns
- From custom implementations

---

## Open Questions

1. **Tool Versioning**: How to handle tool schema changes?
2. **Tool Marketplace**: Should we build a community tool UI library?
3. **Multi-Step Tools**: How to visualize tools that call other tools?
4. **Tool Chaining**: Should we show relationships between tool calls?
5. **Tool History**: Should we persist tool execution history?
6. **Tool Analytics**: Should we track tool performance metrics?

---

## Next Steps

1. ✅ **Get stakeholder approval** on this specification
2. ✅ **Create detailed design mockups** for all components
3. ✅ **Set up component storybook** for visual development
4. ✅ **Implement Phase 1** (Core Infrastructure)
5. ✅ **Implement Phase 2** (Component Library)
6. ✅ **Implement Phase 3** (Advanced Features)
7. ✅ **Implement Phase 4** (Built-in Tool UIs)
8. ✅ **Write comprehensive documentation**
9. ✅ **Create example applications**
10. ✅ **Launch and gather feedback**

---

## Conclusion

The Tool Calling Generative UI component system will be a **game-changer** for Clarity Chat, enabling developers to create rich, interactive tool visualizations with minimal code. By learning from Assistant UI's excellent patterns and improving on them with better DX, streaming support, and built-in templates, we'll create the **best tool calling UI system** in the React ecosystem.

**Key Differentiators**:
1. Simpler API than Assistant UI
2. Better streaming support than LangChain
3. More interactive than shadcn/ui AI
4. Built-in tool templates (unique)
5. Comprehensive documentation
6. Robust quality

**Timeline**: 4 weeks (Q2 2026)
**Priority**: P1 (Critical)
**Impact**: High - enables advanced AI interaction patterns

---

**Document Version**: 1.0
**Last Updated**: January 27, 2026
**Next Review**: After Phase 1 completion
**Owner**: Clarity Chat Team
**Status**: Ready for Implementation
