'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer2,
  Plus,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  Layers,
  Grid3X3,
  Settings,
  Download,
  Upload,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Canvas Node Types
export interface CanvasNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  selected?: boolean
  locked?: boolean
  width?: number
  height?: number
}

export interface CanvasEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: 'default' | 'step' | 'smoothstep' | 'bezier'
  animated?: boolean
  label?: string
}

interface CanvasProps {
  nodes?: CanvasNode[]
  edges?: CanvasEdge[]
  onNodesChange?: (nodes: CanvasNode[]) => void
  onEdgesChange?: (edges: CanvasEdge[]) => void
  onNodeSelect?: (node: CanvasNode | null) => void
  onConnect?: (connection: { source: string; target: string }) => void
  children?: React.ReactNode
  className?: string
  showGrid?: boolean
  showMinimap?: boolean
  showControls?: boolean
  readOnly?: boolean
}

interface CanvasContextValue {
  zoom: number
  pan: { x: number; y: number }
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  selectedNodes: string[]
  setSelectedNodes: (ids: string[]) => void
  tool: 'select' | 'pan'
  setTool: (tool: 'select' | 'pan') => void
}

const CanvasContext = React.createContext<CanvasContextValue | null>(null)

export function useCanvas() {
  const context = React.useContext(CanvasContext)
  if (!context) throw new Error('useCanvas must be used within Canvas')
  return context
}

export function Canvas({
  nodes = [],
  edges = [],
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  onConnect,
  children,
  className,
  showGrid = true,
  showMinimap = true,
  showControls = true,
  readOnly = false,
}: CanvasProps) {
  const [zoom, setZoom] = React.useState(1)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })
  const [selectedNodes, setSelectedNodes] = React.useState<string[]>([])
  const [tool, setTool] = React.useState<'select' | 'pan'>('select')
  const [isPanning, setIsPanning] = React.useState(false)
  const [startPan, setStartPan] = React.useState({ x: 0, y: 0 })
  const canvasRef = React.useRef<HTMLDivElement>(null)

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true)
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      })
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Handle zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.1), 4))
  }

  // Fit view
  const fitView = () => {
    if (nodes.length === 0) return
    // Calculate bounding box and fit
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const contextValue: CanvasContextValue = {
    zoom,
    pan,
    setZoom,
    setPan,
    selectedNodes,
    setSelectedNodes,
    tool,
    setTool,
  }

  return (
    <CanvasContext.Provider value={contextValue}>
      <div
        className={cn(
          'relative w-full h-full overflow-hidden bg-background border border-border rounded-lg',
          className
        )}
      >
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className={cn(
            'absolute inset-0 cursor-default',
            tool === 'pan' && 'cursor-grab',
            isPanning && 'cursor-grabbing'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid Background */}
          {showGrid && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <pattern
                  id="grid"
                  width={20 * zoom}
                  height={20 * zoom}
                  patternUnits="userSpaceOnUse"
                  x={pan.x % (20 * zoom)}
                  y={pan.y % (20 * zoom)}
                >
                  <circle
                    cx={1}
                    cy={1}
                    r={1}
                    className="fill-muted-foreground/20"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* Transform Container */}
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* Render Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {edges.map((edge) => (
                <CanvasEdgeComponent key={edge.id} edge={edge} nodes={nodes} />
              ))}
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => (
              <CanvasNodeWrapper
                key={node.id}
                node={node}
                selected={selectedNodes.includes(node.id)}
                onSelect={() => {
                  setSelectedNodes([node.id])
                  onNodeSelect?.(node)
                }}
                onChange={
                  !readOnly
                    ? (updated) => {
                        onNodesChange?.(
                          nodes.map((n) => (n.id === updated.id ? updated : n))
                        )
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <CanvasControls
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(z * 1.2, 4))}
            onZoomOut={() => setZoom((z) => Math.max(z / 1.2, 0.1))}
            onFitView={fitView}
            tool={tool}
            onToolChange={setTool}
            readOnly={readOnly}
          />
        )}

        {/* Minimap */}
        {showMinimap && <CanvasMinimap nodes={nodes} zoom={zoom} pan={pan} />}

        {/* Additional children (panels, toolbars, etc.) */}
        {children}
      </div>
    </CanvasContext.Provider>
  )
}

// Canvas Node Wrapper
interface CanvasNodeWrapperProps {
  node: CanvasNode
  selected: boolean
  onSelect: () => void
  onChange?: (node: CanvasNode) => void
}

function CanvasNodeWrapper({
  node,
  selected,
  onSelect,
  onChange,
}: CanvasNodeWrapperProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
    if (!node.locked && onChange) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      })
    }
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      onChange?.({
        ...node,
        position: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, node, onChange])

  return (
    <div
      className={cn('absolute select-none', isDragging && 'cursor-grabbing')}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.width,
        height: node.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={cn(
          'rounded-lg border-2 transition-colors',
          selected
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-border hover:border-muted-foreground'
        )}
      >
        <BaseNode node={node} />
      </div>

      {/* Connection Handles */}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted border-2 border-border hover:bg-accent hover:border-accent cursor-crosshair" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted border-2 border-border hover:bg-accent hover:border-accent cursor-crosshair" />
    </div>
  )
}

// Base Node Component
function BaseNode({ node }: { node: CanvasNode }) {
  return (
    <div className="p-3 bg-card min-w-[150px] rounded-md">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {node.type}
      </div>
      <div className="text-sm font-medium">
        {(node.data.label as string) || node.id}
      </div>
    </div>
  )
}

// Canvas Edge Component
function CanvasEdgeComponent({
  edge,
  nodes,
}: {
  edge: CanvasEdge
  nodes: CanvasNode[]
}) {
  const sourceNode = nodes.find((n) => n.id === edge.source)
  const targetNode = nodes.find((n) => n.id === edge.target)

  if (!sourceNode || !targetNode) return null

  const sourceX = sourceNode.position.x + (sourceNode.width || 150)
  const sourceY = sourceNode.position.y + 30
  const targetX = targetNode.position.x
  const targetY = targetNode.position.y + 30

  const midX = (sourceX + targetX) / 2

  const path =
    edge.type === 'step'
      ? `M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`
      : `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`

  return (
    <g>
      <path
        d={path}
        fill="none"
        className={cn(
          'stroke-border stroke-2',
          edge.animated && 'animate-pulse'
        )}
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <text
          x={midX}
          y={(sourceY + targetY) / 2 - 5}
          className="fill-muted-foreground text-xs"
          textAnchor="middle"
        >
          {edge.label}
        </text>
      )}
    </g>
  )
}

// Canvas Controls
interface CanvasControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  tool: 'select' | 'pan'
  onToolChange: (tool: 'select' | 'pan') => void
  readOnly?: boolean
}

function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitView,
  tool,
  onToolChange,
  readOnly,
}: CanvasControlsProps) {
  return (
    <TooltipProvider>
      <div className="absolute bottom-4 left-4 flex items-center gap-1 p-1 rounded-lg bg-card border border-border shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === 'select' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onToolChange('select')}
            >
              <MousePointer2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Select (V)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={tool === 'pan' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onToolChange('pan')}
            >
              <Hand className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pan (Space + Drag)</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <span className="text-xs text-muted-foreground min-w-[40px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onZoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onFitView}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit View</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

// Canvas Minimap
interface CanvasMinimapProps {
  nodes: CanvasNode[]
  zoom: number
  pan: { x: number; y: number }
}

function CanvasMinimap({ nodes, zoom, pan }: CanvasMinimapProps) {
  const scale = 0.1

  return (
    <div className="absolute bottom-4 right-4 w-40 h-28 rounded-lg bg-card border border-border shadow-lg overflow-hidden">
      <div className="absolute inset-0 p-2">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute bg-accent/50 rounded-sm"
            style={{
              left: node.position.x * scale + 10,
              top: node.position.y * scale + 10,
              width: (node.width || 150) * scale,
              height: 20 * scale,
            }}
          />
        ))}
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-accent rounded-sm"
          style={{
            left: -pan.x * scale,
            top: -pan.y * scale,
            width: 200 / zoom,
            height: 100 / zoom,
          }}
        />
      </div>
    </div>
  )
}

// Toolbar Component
interface CanvasToolbarProps {
  onAddNode?: () => void
  onDelete?: () => void
  onCopy?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onExport?: () => void
  onImport?: () => void
  canUndo?: boolean
  canRedo?: boolean
  hasSelection?: boolean
  className?: string
}

export function CanvasToolbar({
  onAddNode,
  onDelete,
  onCopy,
  onUndo,
  onRedo,
  onExport,
  onImport,
  canUndo,
  canRedo,
  hasSelection,
  className,
}: CanvasToolbarProps) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          'absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-card border border-border shadow-lg',
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onAddNode}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Node</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCopy}
              disabled={!hasSelection}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDelete}
              disabled={!hasSelection}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onImport}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
