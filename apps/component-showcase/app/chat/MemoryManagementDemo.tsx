'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  Database,
  Activity,
  Layers,
  MessageSquare,
  Search,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Bug,
  Gauge,
  PieChart,
  Info,
  CheckCircle,
  RotateCw,
} from 'lucide-react'

export function MemoryManagementDemo() {
  const [strategy, setStrategy] = useState<
    'sliding-window' | 'semantic-chunks' | 'vector-store'
  >('sliding-window')
  const [messages, setMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([
    {
      id: '1',
      role: 'user',
      content: 'What is React?',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'React is a JavaScript library for building user interfaces.',
    },
    {
      id: '3',
      role: 'user',
      content: 'Tell me about hooks',
    },
    {
      id: '4',
      role: 'assistant',
      content:
        'Hooks are functions that let you use state and lifecycle features.',
    },
  ])
  const [contextWindow, setContextWindow] = useState(4096)
  const [currentTokens, setCurrentTokens] = useState(1234)
  const [retrievalExample, setRetrievalExample] = useState<string | null>(null)
  const [errorSimulation, setErrorSimulation] = useState(false)
  const [isRetrieving, setIsRetrieving] = useState(false)

  // Memory stats
  const stats = {
    totalEntries: messages.length,
    tokensUsed: currentTokens,
    tokensAvailable: contextWindow - currentTokens,
    utilization: Math.round((currentTokens / contextWindow) * 100),
    oldestEntry: '5 minutes ago',
    newestEntry: 'Just now',
    averageImportance: 0.72,
  }

  const simulateRetrieval = async () => {
    setIsRetrieving(true)
    setRetrievalExample(null)

    await new Promise((r) => setTimeout(r, 800))

    const examples = {
      'sliding-window': `Retrieved last ${Math.min(messages.length, 3)} messages:
- "${messages[messages.length - 1]?.content}" (Latest)
- "${messages[messages.length - 2]?.content}"
${messages.length > 2 ? `- "${messages[messages.length - 3]?.content}"` : ''}

Strategy: Simple chronological window, O(1) lookup`,

      'semantic-chunks': `Retrieved semantically similar chunks:
- Chunk 1: "React hooks allow functional components..." (similarity: 0.89)
- Chunk 2: "useState and useEffect are core hooks..." (similarity: 0.84)
- Chunk 3: "Hooks revolutionized React development..." (similarity: 0.78)

Strategy: Content-based chunking with importance scoring`,

      'vector-store': `Vector search results for current query:
- Vector ID: vec_89a3 | Similarity: 0.92 | "React hooks documentation..."
- Vector ID: vec_12f5 | Similarity: 0.87 | "useState hook pattern..."
- Vector ID: vec_45c9 | Similarity: 0.81 | "useEffect dependencies..."

Strategy: Embedding-based similarity search in vector database`,
    }

    setRetrievalExample(examples[strategy])
    setIsRetrieving(false)
  }

  const addMessage = () => {
    const newMsg = {
      id: String(Date.now()),
      role: 'user' as const,
      content: `New message ${messages.length + 1}`,
    }
    setMessages([...messages, newMsg])
    setCurrentTokens(currentTokens + 150)
  }

  const clearMemory = () => {
    setMessages([])
    setCurrentTokens(0)
    setRetrievalExample(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Panel */}
      <Card className="lg:col-span-2 glass-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Memory Management
            </CardTitle>
            <Badge
              variant={errorSimulation ? 'destructive' : 'success'}
              className="gap-1"
            >
              {errorSimulation ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Error
                </>
              ) : (
                <>
                  <Activity className="h-3 w-3" />
                  Active
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            Manage conversation context with multiple memory strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Memory Strategy</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  value: 'sliding-window' as const,
                  title: 'Sliding Window',
                  desc: 'Keep recent N messages',
                  icon: Activity,
                },
                {
                  value: 'semantic-chunks' as const,
                  title: 'Semantic Chunks',
                  desc: 'Content-based chunks',
                  icon: Layers,
                },
                {
                  value: 'vector-store' as const,
                  title: 'Vector Store',
                  desc: 'Embedding similarity',
                  icon: Database,
                },
              ].map((strat) => (
                <button
                  key={strat.value}
                  onClick={() => setStrategy(strat.value)}
                  className={cn(
                    'flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left',
                    strategy === strat.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        strategy === strat.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <strat.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{strat.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{strat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Context Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Current Context</label>
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                {messages.length} messages
              </Badge>
            </div>
            <ScrollArea className="h-48 border rounded-lg p-3 bg-muted/50">
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                    No messages in memory
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex gap-2 p-2 rounded bg-background text-sm"
                    >
                      <Badge
                        variant={msg.role === 'user' ? 'default' : 'secondary'}
                        className="text-xs shrink-0"
                      >
                        {msg.role}
                      </Badge>
                      <span className="flex-1 truncate">{msg.content}</span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Memory Retrieval Example */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Memory Retrieval</label>
              <Button
                size="sm"
                variant="outline"
                onClick={simulateRetrieval}
                disabled={isRetrieving || messages.length === 0}
                className="gap-2"
              >
                {isRetrieving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Retrieving...
                  </>
                ) : (
                  <>
                    <Search className="h-3 w-3" />
                    Retrieve
                  </>
                )}
              </Button>
            </div>
            {retrievalExample ? (
              <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                <pre className="text-xs whitespace-pre-wrap font-mono text-blue-600 dark:text-blue-400">
                  {retrievalExample}
                </pre>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                Click "Retrieve" to see how {strategy} fetches context
              </div>
            )}
          </div>

          {/* Error Handling */}
          {errorSimulation && (
            <div className="p-4 rounded-lg border bg-red-500/10 border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-red-600">
                    Memory Storage Error
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Failed to persist to vector store. Falling back to
                    in-memory storage.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setErrorSimulation(false)}
                      className="text-red-600"
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setErrorSimulation(false)}
                      className="gap-1"
                    >
                      <RotateCw className="h-3 w-3" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={addMessage} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearMemory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Memory
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setErrorSimulation(!errorSimulation)}
              className="gap-2"
            >
              <Bug className="h-4 w-4" />
              Simulate Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Sidebar */}
      <div className="space-y-4">
        {/* Context Window Tracking */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Context Window
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Used</span>
                <span className="font-mono">
                  {currentTokens.toLocaleString()} /{' '}
                  {contextWindow.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    stats.utilization > 90
                      ? 'bg-red-500'
                      : stats.utilization > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  )}
                  style={{ width: `${stats.utilization}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.utilization}% utilized
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="font-mono">
                  {stats.tokensAvailable.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Window Size</span>
                <span className="font-mono">
                  {contextWindow.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Statistics */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Memory Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">Tokens Used</p>
                <p className="text-2xl font-bold">{stats.tokensUsed}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Oldest Entry</span>
                <span>{stats.oldestEntry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Newest Entry</span>
                <span>{stats.newestEntry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Importance</span>
                <span className="font-mono">{stats.averageImportance}</span>
              </div>
            </div>

            <div className="p-2 rounded bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-primary">
                <Activity className="h-3 w-3" />
                <span>Memory system active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Info */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Strategy Info
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            {strategy === 'sliding-window' && (
              <>
                <p className="text-muted-foreground">
                  Keeps the most recent N messages in a fixed-size window. Fast
                  and simple, ideal for real-time conversations.
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>O(1) lookup time</span>
                </div>
              </>
            )}
            {strategy === 'semantic-chunks' && (
              <>
                <p className="text-muted-foreground">
                  Divides conversation into semantic chunks with importance
                  scoring. Balances recency with relevance.
                </p>
                <div className="flex items-center gap-1 text-blue-600">
                  <Layers className="h-3 w-3" />
                  <span>Content-aware chunking</span>
                </div>
              </>
            )}
            {strategy === 'vector-store' && (
              <>
                <p className="text-muted-foreground">
                  Uses embeddings for semantic similarity search. Best for
                  long-term memory and contextual retrieval.
                </p>
                <div className="flex items-center gap-1 text-purple-600">
                  <Database className="h-3 w-3" />
                  <span>Embedding-based search</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
