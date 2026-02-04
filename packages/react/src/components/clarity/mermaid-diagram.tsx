'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Code,
  Eye,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'

// Simple mermaid-like diagram renderer (visual representation)
// In production, you would integrate with actual mermaid.js library

interface MermaidDiagramProps {
  code: string
  title?: string
  className?: string
  editable?: boolean
  onCodeChange?: (code: string) => void
}

export function MermaidDiagram({
  code,
  title,
  className,
  editable = false,
  onCodeChange,
}: MermaidDiagramProps) {
  const [zoom, setZoom] = React.useState(1)
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>(
    'preview'
  )
  const [localCode, setLocalCode] = React.useState(code)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Parse mermaid code to render simple diagrams
  const parsedDiagram = React.useMemo(() => {
    return parseMermaidCode(localCode)
  }, [localCode])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(localCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))
  const handleReset = () => setZoom(1)

  const handleCodeChange = (newCode: string) => {
    setLocalCode(newCode)
    onCodeChange?.(newCode)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium">{title || 'Diagram'}</span>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleReset}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-px h-4 bg-border mx-1" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? 'Copied!' : 'Copy Code'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      {editable ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'preview' | 'code')}
        >
          <div className="border-b border-border bg-muted/20 px-4">
            <TabsList className="bg-transparent h-9">
              <TabsTrigger value="preview" className="gap-1.5 text-xs">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5 text-xs">
                <Code className="h-3.5 w-3.5" />
                Code
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="preview" className="m-0">
            <DiagramPreview
              diagram={parsedDiagram}
              zoom={zoom}
              containerRef={containerRef}
            />
          </TabsContent>
          <TabsContent value="code" className="m-0">
            <textarea
              value={localCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm bg-code-bg text-foreground resize-none focus:outline-none"
              spellCheck={false}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <DiagramPreview
          diagram={parsedDiagram}
          zoom={zoom}
          containerRef={containerRef}
        />
      )}
    </div>
  )
}

// Diagram preview component
function DiagramPreview({
  diagram,
  zoom,
  containerRef,
}: {
  diagram: ParsedDiagram
  zoom: number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={containerRef}
      className="p-8 overflow-auto min-h-[200px] max-h-[500px] bg-background"
    >
      <div
        className="inline-block transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {diagram.type === 'flowchart' && (
          <FlowchartRenderer nodes={diagram.nodes} edges={diagram.edges} />
        )}
        {diagram.type === 'sequence' && (
          <SequenceRenderer
            participants={diagram.participants || []}
            messages={diagram.messages || []}
          />
        )}
        {diagram.type === 'unknown' && (
          <div className="text-muted-foreground text-sm p-4 border border-dashed border-border rounded-lg">
            <p>Diagram preview not available</p>
            <pre className="mt-2 text-xs">{diagram.raw}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

// Types for parsed diagram
interface DiagramNode {
  id: string
  label: string
  shape?: 'rect' | 'rounded' | 'diamond' | 'circle'
}

interface DiagramEdge {
  from: string
  to: string
  label?: string
  type?: 'arrow' | 'line' | 'dotted'
}

interface SequenceParticipant {
  id: string
  label: string
}

interface SequenceMessage {
  from: string
  to: string
  message: string
  type?: 'solid' | 'dotted'
}

interface ParsedDiagram {
  type: 'flowchart' | 'sequence' | 'unknown'
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  participants?: SequenceParticipant[]
  messages?: SequenceMessage[]
  raw: string
}

// Simple mermaid parser
function parseMermaidCode(code: string): ParsedDiagram {
  const lines = code
    .trim()
    .split('\n')
    .map((l) => l.trim())
  const firstLine = lines[0].toLowerCase()

  if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
    return parseFlowchart(lines.slice(1), code)
  } else if (firstLine.startsWith('sequencediagram')) {
    return parseSequence(lines.slice(1), code)
  }

  return { type: 'unknown', nodes: [], edges: [], raw: code }
}

function parseFlowchart(lines: string[], raw: string): ParsedDiagram {
  const nodes: DiagramNode[] = []
  const edges: DiagramEdge[] = []
  const nodeMap = new Map<string, DiagramNode>()

  for (const line of lines) {
    // Match node definitions: A[Label] or A(Label) or A{Label}
    const nodeMatch = line.match(/(\w+)\s*[\[\(\{]([^\]\)\}]+)[\]\)\}]/)
    if (nodeMatch) {
      const [, id, label] = nodeMatch
      const shape = line.includes('[')
        ? 'rect'
        : line.includes('(')
          ? 'rounded'
          : 'diamond'
      const node = { id, label, shape: shape as DiagramNode['shape'] }
      nodes.push(node)
      nodeMap.set(id, node)
    }

    // Match edges: A --> B or A --Label--> B
    const edgeMatch = line.match(
      /(\w+)\s*(-+>|-->|-.->|=+>)\s*(?:\|([^|]+)\|)?\s*(\w+)/
    )
    if (edgeMatch) {
      const [, from, arrowType, label, to] = edgeMatch

      // Ensure nodes exist
      if (!nodeMap.has(from)) {
        const node = { id: from, label: from, shape: 'rect' as const }
        nodes.push(node)
        nodeMap.set(from, node)
      }
      if (!nodeMap.has(to)) {
        const node = { id: to, label: to, shape: 'rect' as const }
        nodes.push(node)
        nodeMap.set(to, node)
      }

      edges.push({
        from,
        to,
        label,
        type: arrowType.includes('.') ? 'dotted' : 'arrow',
      })
    }
  }

  return { type: 'flowchart', nodes, edges, raw }
}

function parseSequence(lines: string[], raw: string): ParsedDiagram {
  const participants: SequenceParticipant[] = []
  const messages: SequenceMessage[] = []
  const participantMap = new Map<string, SequenceParticipant>()

  for (const line of lines) {
    // Match participant: participant A as Alice
    const participantMatch = line.match(/participant\s+(\w+)(?:\s+as\s+(.+))?/i)
    if (participantMatch) {
      const [, id, label] = participantMatch
      const participant = { id, label: label || id }
      participants.push(participant)
      participantMap.set(id, participant)
    }

    // Match messages: A->>B: Message or A-->>B: Message
    const messageMatch = line.match(/(\w+)\s*(-+>>?|-->>?)\s*(\w+)\s*:\s*(.+)/)
    if (messageMatch) {
      const [, from, arrow, to, message] = messageMatch

      // Auto-add participants
      if (!participantMap.has(from)) {
        const p = { id: from, label: from }
        participants.push(p)
        participantMap.set(from, p)
      }
      if (!participantMap.has(to)) {
        const p = { id: to, label: to }
        participants.push(p)
        participantMap.set(to, p)
      }

      messages.push({
        from,
        to,
        message,
        type: arrow.startsWith('--') ? 'dotted' : 'solid',
      })
    }
  }

  return { type: 'sequence', nodes: [], edges: [], participants, messages, raw }
}

// Flowchart renderer
function FlowchartRenderer({
  nodes,
  edges,
}: {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}) {
  if (nodes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No nodes to display</div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {nodes.map((node, index) => {
        const outgoingEdges = edges.filter((e) => e.from === node.id)

        return (
          <React.Fragment key={node.id}>
            <FlowchartNode node={node} />
            {outgoingEdges.map((edge, edgeIndex) => (
              <div
                key={`${edge.from}-${edge.to}-${edgeIndex}`}
                className="flex flex-col items-center gap-1"
              >
                {edge.label && (
                  <span className="text-xs text-muted-foreground bg-background px-1">
                    {edge.label}
                  </span>
                )}
                <div
                  className={cn(
                    'h-8 w-0.5',
                    edge.type === 'dotted'
                      ? 'border-l-2 border-dashed border-border'
                      : 'bg-border'
                  )}
                />
                <svg
                  className="h-3 w-3 text-border"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M6 0L12 6L6 12L0 6Z" />
                </svg>
              </div>
            ))}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function FlowchartNode({ node }: { node: DiagramNode }) {
  const shapeClasses = {
    rect: 'rounded-md',
    rounded: 'rounded-full',
    diamond: 'rotate-45',
    circle: 'rounded-full aspect-square',
  }

  return (
    <div
      className={cn(
        'px-6 py-3 border-2 border-accent bg-accent/10 text-accent font-medium',
        shapeClasses[node.shape || 'rect'],
        node.shape === 'diamond' && 'px-4 py-4'
      )}
    >
      <span className={cn(node.shape === 'diamond' && '-rotate-45 block')}>
        {node.label}
      </span>
    </div>
  )
}

// Sequence diagram renderer
function SequenceRenderer({
  participants,
  messages,
}: {
  participants: SequenceParticipant[]
  messages: SequenceMessage[]
}) {
  if (participants.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No participants to display
      </div>
    )
  }

  const participantWidth = 120
  const spacing = 150

  return (
    <div className="relative">
      {/* Participants */}
      <div className="flex gap-4" style={{ gap: spacing - participantWidth }}>
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center"
            style={{ width: participantWidth }}
          >
            <div className="px-4 py-2 border-2 border-accent bg-accent/10 rounded-md text-sm font-medium">
              {p.label}
            </div>
          </div>
        ))}
      </div>

      {/* Lifelines */}
      <div
        className="flex gap-4 mt-2"
        style={{ gap: spacing - participantWidth }}
      >
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex justify-center"
            style={{ width: participantWidth }}
          >
            <div className="w-0.5 h-48 bg-border" />
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="absolute top-16 left-0 right-0 space-y-6">
        {messages.map((msg, index) => {
          const fromIndex = participants.findIndex((p) => p.id === msg.from)
          const toIndex = participants.findIndex((p) => p.id === msg.to)
          const isLeftToRight = fromIndex < toIndex
          const left =
            Math.min(fromIndex, toIndex) * spacing + participantWidth / 2
          const width = Math.abs(toIndex - fromIndex) * spacing

          return (
            <div
              key={index}
              className="relative h-6 flex items-center"
              style={{ marginLeft: left, width }}
            >
              <div
                className={cn(
                  'absolute top-0 w-full border-t-2',
                  msg.type === 'dotted'
                    ? 'border-dashed border-muted-foreground'
                    : 'border-accent'
                )}
              />
              <span
                className="absolute -top-5 text-xs text-muted-foreground bg-background px-1"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                {msg.message}
              </span>
              <svg
                className={cn(
                  'absolute h-3 w-3',
                  isLeftToRight ? 'right-0' : 'left-0',
                  msg.type === 'dotted'
                    ? 'text-muted-foreground'
                    : 'text-accent'
                )}
                viewBox="0 0 12 12"
                fill="currentColor"
                style={{ transform: isLeftToRight ? 'none' : 'rotate(180deg)' }}
              >
                <path d="M0 0L12 6L0 12V0Z" />
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Export diagram types
export type {
  DiagramNode,
  DiagramEdge,
  SequenceParticipant,
  SequenceMessage,
  ParsedDiagram,
}
