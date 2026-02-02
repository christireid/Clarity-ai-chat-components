'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Database,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Layers,
  Zap,
  Target,
  FileCode,
  Link2,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  RefreshCw,
  Filter,
  SlidersHorizontal,
} from 'lucide-react'

// Types
export interface DocumentChunk {
  id: string
  content: string
  metadata: Record<string, unknown>
  embedding?: number[]
  score?: number
  source?: string
  pageNumber?: number
  charStart?: number
  charEnd?: number
}

export interface RetrievalResult {
  chunks: DocumentChunk[]
  query: string
  totalResults: number
  searchTime: number
}

export interface KnowledgeBaseDoc {
  id: string
  title: string
  source: string
  type: 'pdf' | 'web' | 'text' | 'markdown' | 'code'
  chunksCount: number
  tokensCount: number
  lastUpdated: Date
  status: 'indexed' | 'processing' | 'error'
}

// Chunk Display
interface ChunkDisplayProps {
  chunk: DocumentChunk
  query?: string
  showScore?: boolean
  showMetadata?: boolean
  onSelect?: () => void
  className?: string
}

export function ChunkDisplay({
  chunk,
  query,
  showScore = true,
  showMetadata = false,
  onSelect,
  className,
}: ChunkDisplayProps) {
  const [copied, setCopied] = React.useState(false)
  const [showMeta, setShowMeta] = React.useState(showMetadata)

  const handleCopy = () => {
    navigator.clipboard.writeText(chunk.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Highlight matching text
  const highlightText = (text: string, query?: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500/30 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div
      className={cn(
        'border rounded-lg p-3 space-y-2 hover:border-primary/50 transition-colors',
        onSelect && 'cursor-pointer',
        className
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {chunk.source && (
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {chunk.source}
            </Badge>
          )}
          {chunk.pageNumber && (
            <Badge variant="secondary" className="text-xs">
              Page {chunk.pageNumber}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {showScore && chunk.score !== undefined && (
            <Badge variant="default" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {(chunk.score * 100).toFixed(1)}%
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-sm leading-relaxed">
        {highlightText(chunk.content, query)}
      </p>

      <Collapsible open={showMeta} onOpenChange={setShowMeta}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            {showMeta ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Metadata
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
            {JSON.stringify(chunk.metadata, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// Retrieval Results
interface RetrievalResultsProps {
  results: RetrievalResult
  onChunkSelect?: (chunk: DocumentChunk) => void
  className?: string
}

export function RetrievalResults({
  results,
  onChunkSelect,
  className,
}: RetrievalResultsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Retrieved Chunks
            </CardTitle>
            <CardDescription>
              {results.totalResults} results in {results.searchTime.toFixed(0)}
              ms
            </CardDescription>
          </div>
          <Badge variant="secondary">Query: {results.query}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {results.chunks.map((chunk, index) => (
              <ChunkDisplay
                key={chunk.id}
                chunk={chunk}
                query={results.query}
                onSelect={() => onChunkSelect?.(chunk)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Embedding Visualizer
interface EmbeddingVisualizerProps {
  embedding: number[]
  label?: string
  dimensions?: number
  className?: string
}

export function EmbeddingVisualizer({
  embedding,
  label,
  dimensions = 64,
  className,
}: EmbeddingVisualizerProps) {
  const displayEmbedding = embedding.slice(0, dimensions)
  const min = Math.min(...displayEmbedding)
  const max = Math.max(...displayEmbedding)

  const normalize = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex flex-wrap gap-0.5">
        {displayEmbedding.map((val, i) => {
          const normalized = normalize(val)
          const hue = Math.floor(normalized * 2.4) // 0-240 (blue to red)
          return (
            <div
              key={i}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: `hsl(${240 - hue}, 70%, 50%)` }}
              title={`dim ${i}: ${val.toFixed(4)}`}
            />
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {dimensions} of {embedding.length} dimensions
      </p>
    </div>
  )
}

// Knowledge Base Document List
interface KnowledgeBaseListProps {
  documents: KnowledgeBaseDoc[]
  onDocumentSelect?: (doc: KnowledgeBaseDoc) => void
  onReindex?: (id: string) => void
  className?: string
}

export function KnowledgeBaseList({
  documents,
  onDocumentSelect,
  onReindex,
  className,
}: KnowledgeBaseListProps) {
  const typeIcons = {
    pdf: FileText,
    web: Link2,
    text: FileText,
    markdown: FileCode,
    code: FileCode,
  }

  const statusColors = {
    indexed: 'text-green-500',
    processing: 'text-yellow-500',
    error: 'text-red-500',
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4" />
          Knowledge Base
        </CardTitle>
        <CardDescription>{documents.length} documents indexed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc) => {
            const Icon = typeIcons[doc.type]
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onDocumentSelect?.(doc)}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg bg-muted',
                    statusColors[doc.status]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.chunksCount} chunks |{' '}
                    {doc.tokensCount.toLocaleString()} tokens
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      doc.status === 'indexed'
                        ? 'default'
                        : doc.status === 'processing'
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                  {onReindex && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onReindex(doc.id)
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Relevance Score Bar
interface RelevanceScoreProps {
  score: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function RelevanceScore({
  score,
  label,
  showPercentage = true,
  className,
}: RelevanceScoreProps) {
  const percentage = score * 100
  const color =
    percentage >= 80
      ? 'bg-green-500'
      : percentage >= 60
        ? 'bg-yellow-500'
        : percentage >= 40
          ? 'bg-orange-500'
          : 'bg-red-500'

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Context Window Visualizer
interface ContextWindowVisualizerProps {
  maxTokens: number
  systemTokens: number
  contextTokens: number
  userTokens: number
  reservedForOutput?: number
  className?: string
}

export function ContextWindowVisualizer({
  maxTokens,
  systemTokens,
  contextTokens,
  userTokens,
  reservedForOutput = 0,
  className,
}: ContextWindowVisualizerProps) {
  const used = systemTokens + contextTokens + userTokens + reservedForOutput
  const available = maxTokens - used

  const segments = [
    { label: 'System', tokens: systemTokens, color: 'bg-blue-500' },
    { label: 'Context', tokens: contextTokens, color: 'bg-purple-500' },
    { label: 'User', tokens: userTokens, color: 'bg-green-500' },
    { label: 'Reserved', tokens: reservedForOutput, color: 'bg-yellow-500' },
    { label: 'Available', tokens: available, color: 'bg-muted' },
  ]

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Context Window
        </CardTitle>
        <CardDescription>
          {used.toLocaleString()} / {maxTokens.toLocaleString()} tokens used
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-8 rounded-lg overflow-hidden flex">
          {segments.map((seg) => (
            <div
              key={seg.label}
              className={cn('h-full transition-all duration-300', seg.color)}
              style={{ width: `${(seg.tokens / maxTokens) * 100}%` }}
              title={`${seg.label}: ${seg.tokens.toLocaleString()} tokens`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2 text-sm">
              <div className={cn('w-3 h-3 rounded', seg.color)} />
              <span className="text-muted-foreground">{seg.label}:</span>
              <span className="font-mono">{seg.tokens.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Source Highlighting
interface SourceHighlightProps {
  text: string
  sources: { start: number; end: number; sourceId: string; color?: string }[]
  onSourceClick?: (sourceId: string) => void
  className?: string
}

export function SourceHighlight({
  text,
  sources,
  onSourceClick,
  className,
}: SourceHighlightProps) {
  const renderHighlightedText = () => {
    const sortedSources = [...sources].sort((a, b) => a.start - b.start)
    const result: React.ReactNode[] = []
    let lastEnd = 0

    sortedSources.forEach((source, index) => {
      if (source.start > lastEnd) {
        result.push(text.slice(lastEnd, source.start))
      }

      result.push(
        <span
          key={index}
          className={cn(
            'px-0.5 rounded cursor-pointer hover:opacity-80',
            source.color || 'bg-blue-500/30'
          )}
          onClick={() => onSourceClick?.(source.sourceId)}
        >
          {text.slice(source.start, source.end)}
        </span>
      )

      lastEnd = source.end
    })

    if (lastEnd < text.length) {
      result.push(text.slice(lastEnd))
    }

    return result
  }

  return (
    <p className={cn('leading-relaxed', className)}>
      {renderHighlightedText()}
    </p>
  )
}

// Document Upload Progress
interface DocumentUploadProgressProps {
  fileName: string
  progress: number
  status:
    | 'uploading'
    | 'processing'
    | 'chunking'
    | 'embedding'
    | 'indexing'
    | 'complete'
    | 'error'
  error?: string
  className?: string
}

export function DocumentUploadProgress({
  fileName,
  progress,
  status,
  error,
  className,
}: DocumentUploadProgressProps) {
  const statusLabels = {
    uploading: 'Uploading...',
    processing: 'Processing document...',
    chunking: 'Creating chunks...',
    embedding: 'Generating embeddings...',
    indexing: 'Indexing to vector store...',
    complete: 'Complete!',
    error: 'Error',
  }

  return (
    <div className={cn('space-y-2 p-3 border rounded-lg', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium truncate">{fileName}</span>
        </div>
        <Badge
          variant={
            status === 'error'
              ? 'destructive'
              : status === 'complete'
                ? 'default'
                : 'secondary'
          }
        >
          {statusLabels[status]}
        </Badge>
      </div>

      <Progress value={progress} className="h-1" />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// Vector Search Config
interface VectorSearchConfigProps {
  topK: number
  similarityThreshold: number
  searchType: 'similarity' | 'mmr' | 'hybrid'
  onConfigChange: (config: {
    topK?: number
    similarityThreshold?: number
    searchType?: string
  }) => void
  className?: string
}

export function VectorSearchConfig({
  topK,
  similarityThreshold,
  searchType,
  onConfigChange,
  className,
}: VectorSearchConfigProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Search Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Top K Results</label>
            <span className="text-sm font-mono">{topK}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={topK}
            onChange={(e) => onConfigChange({ topK: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Similarity Threshold</label>
            <span className="text-sm font-mono">
              {similarityThreshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={similarityThreshold * 100}
            onChange={(e) =>
              onConfigChange({
                similarityThreshold: Number(e.target.value) / 100,
              })
            }
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Search Type</label>
          <div className="flex gap-2">
            {(['similarity', 'mmr', 'hybrid'] as const).map((type) => (
              <Button
                key={type}
                variant={searchType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => onConfigChange({ searchType: type })}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DOCUMENT CHUNKING COMPONENTS
// ============================================================================

// Chunking Strategy Selector
export interface ChunkingStrategy {
  method:
    | 'fixed'
    | 'semantic'
    | 'sentence'
    | 'paragraph'
    | 'markdown'
    | 'recursive'
  chunkSize: number
  chunkOverlap: number
  separators?: string[]
}

interface ChunkingStrategySelectorProps {
  strategy: ChunkingStrategy
  onChange: (strategy: ChunkingStrategy) => void
  className?: string
}

export function ChunkingStrategySelector({
  strategy,
  onChange,
  className,
}: ChunkingStrategySelectorProps) {
  const methodDescriptions: Record<ChunkingStrategy['method'], string> = {
    fixed: 'Split text into fixed-size chunks with optional overlap',
    semantic: 'Split based on semantic meaning using embeddings',
    sentence: 'Split on sentence boundaries',
    paragraph: 'Split on paragraph boundaries',
    markdown:
      'Split respecting markdown structure (headers, lists, code blocks)',
    recursive: 'Recursively split using multiple separators',
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          Chunking Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              'fixed',
              'semantic',
              'sentence',
              'paragraph',
              'markdown',
              'recursive',
            ] as const
          ).map((method) => (
            <Button
              key={method}
              variant={strategy.method === method ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
              onClick={() => onChange({ ...strategy, method })}
            >
              {method}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {methodDescriptions[strategy.method]}
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Chunk Size</label>
              <span className="text-sm font-mono text-muted-foreground">
                {strategy.chunkSize} tokens
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={4000}
              step={100}
              value={strategy.chunkSize}
              onChange={(e) =>
                onChange({ ...strategy, chunkSize: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Chunk Overlap</label>
              <span className="text-sm font-mono text-muted-foreground">
                {strategy.chunkOverlap} tokens
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(500, strategy.chunkSize / 2)}
              step={10}
              value={strategy.chunkOverlap}
              onChange={(e) =>
                onChange({ ...strategy, chunkOverlap: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Chunk Preview Panel
interface ChunkPreviewProps {
  chunks: {
    id: string
    content: string
    tokens: number
    metadata?: {
      start?: number
      end?: number
      page?: number
      section?: string
    }
  }[]
  selectedChunkId?: string
  onSelectChunk?: (id: string) => void
  className?: string
}

export function ChunkPreview({
  chunks,
  selectedChunkId,
  onSelectChunk,
  className,
}: ChunkPreviewProps) {
  const [showAll, setShowAll] = React.useState(false)
  const displayedChunks = showAll ? chunks : chunks.slice(0, 5)

  const totalTokens = chunks.reduce((acc, c) => acc + c.tokens, 0)
  const avgTokens =
    chunks.length > 0 ? Math.round(totalTokens / chunks.length) : 0

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Chunk Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{chunks.length} chunks</Badge>
            <Badge variant="outline">
              {totalTokens.toLocaleString()} tokens
            </Badge>
          </div>
        </div>
        <CardDescription>
          Average chunk size: {avgTokens} tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {displayedChunks.map((chunk, index) => (
              <div
                key={chunk.id}
                className={cn(
                  'rounded-lg border border-border p-3 cursor-pointer transition-colors hover:bg-muted/50',
                  selectedChunkId === chunk.id && 'ring-2 ring-primary'
                )}
                onClick={() => onSelectChunk?.(chunk.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {chunk.tokens} tokens
                    </span>
                  </div>
                  {chunk.metadata?.page && (
                    <span className="text-xs text-muted-foreground">
                      Page {chunk.metadata.page}
                    </span>
                  )}
                </div>
                <p className="text-sm line-clamp-3">{chunk.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {chunks.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${chunks.length} Chunks`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Chunk Statistics Display
interface ChunkStatisticsProps {
  stats: {
    totalChunks: number
    totalTokens: number
    avgChunkSize: number
    minChunkSize: number
    maxChunkSize: number
    overlapTokens: number
    compressionRatio?: number
  }
  className?: string
}

export function ChunkStatistics({ stats, className }: ChunkStatisticsProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Total Chunks</p>
        <p className="text-xl font-bold">{stats.totalChunks}</p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Total Tokens</p>
        <p className="text-xl font-bold">
          {stats.totalTokens.toLocaleString()}
        </p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Avg Size</p>
        <p className="text-xl font-bold">{stats.avgChunkSize}</p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs text-muted-foreground">Min / Max</p>
        <p className="text-xl font-bold">
          {stats.minChunkSize} / {stats.maxChunkSize}
        </p>
      </div>
    </div>
  )
}

// Document Splitter UI
interface DocumentSplitterProps {
  document: {
    id: string
    name: string
    content: string
    type: string
    size: number
  }
  onSplit?: (
    chunks: { content: string; metadata: Record<string, unknown> }[]
  ) => void
  className?: string
}

export function DocumentSplitter({
  document,
  onSplit,
  className,
}: DocumentSplitterProps) {
  const [strategy, setStrategy] = React.useState<ChunkingStrategy>({
    method: 'recursive',
    chunkSize: 500,
    chunkOverlap: 50,
  })
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [previewChunks, setPreviewChunks] = React.useState<
    { id: string; content: string; tokens: number }[]
  >([])

  const estimatedTokens = Math.ceil(document.content.length / 4)
  const estimatedChunks = Math.ceil(
    estimatedTokens / (strategy.chunkSize - strategy.chunkOverlap)
  )

  const handlePreview = async () => {
    setIsProcessing(true)
    // Simulated chunking - in real implementation, use actual chunking library
    await new Promise((r) => setTimeout(r, 500))

    const chunks: { id: string; content: string; tokens: number }[] = []
    let start = 0
    let chunkIndex = 0

    while (start < document.content.length) {
      const end = Math.min(
        start + strategy.chunkSize * 4,
        document.content.length
      )
      const content = document.content.slice(start, end)
      chunks.push({
        id: `chunk-${chunkIndex}`,
        content,
        tokens: Math.ceil(content.length / 4),
      })
      start = end - strategy.chunkOverlap * 4
      chunkIndex++
      if (chunks.length >= 20) break // Limit preview
    }

    setPreviewChunks(chunks)
    setIsProcessing(false)
  }

  const handleSplit = () => {
    onSplit?.(
      previewChunks.map((c) => ({
        content: c.content,
        metadata: { documentId: document.id, tokens: c.tokens },
      }))
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{document.name}</h3>
          <p className="text-sm text-muted-foreground">
            ~{estimatedTokens.toLocaleString()} tokens estimated
          </p>
        </div>
        <Badge variant="outline">{document.type}</Badge>
      </div>

      <ChunkingStrategySelector strategy={strategy} onChange={setStrategy} />

      <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/30">
        <div className="text-sm">
          <span className="text-muted-foreground">Estimated chunks: </span>
          <span className="font-bold">{estimatedChunks}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button onClick={handleSplit} disabled={previewChunks.length === 0}>
            <Sparkles className="h-4 w-4 mr-2" />
            Split Document
          </Button>
        </div>
      </div>

      {previewChunks.length > 0 && <ChunkPreview chunks={previewChunks} />}
    </div>
  )
}

// Embedding Model Selector
interface EmbeddingModelSelectorProps {
  models: {
    id: string
    name: string
    provider: string
    dimensions: number
    maxTokens: number
  }[]
  selectedModel: string
  onSelect: (modelId: string) => void
  className?: string
}

export function EmbeddingModelSelector({
  models,
  selectedModel,
  onSelect,
  className,
}: EmbeddingModelSelectorProps) {
  const selected = models.find((m) => m.id === selectedModel)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Embedding Model
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {models.map((model) => (
              <div
                key={model.id}
                className={cn(
                  'rounded-lg border border-border p-3 cursor-pointer transition-colors',
                  selectedModel === model.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => onSelect(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {model.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono">{model.dimensions}d</p>
                    <p className="text-xs text-muted-foreground">
                      {model.maxTokens} max tokens
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              Selected: {selected.name} ({selected.dimensions} dimensions)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Add missing imports - Scissors icon
const Scissors = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="6" cy="6" r="3" />
    <path d="M8.12 8.12 12 12" />
    <path d="M20 4 8.12 15.88" />
    <circle cx="6" cy="18" r="3" />
    <path d="M14.8 14.8 20 20" />
  </svg>
)
