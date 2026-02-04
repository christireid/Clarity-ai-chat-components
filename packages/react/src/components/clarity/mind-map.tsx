'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Plus,
  Minus,
  ChevronRight,
  Circle,
  Edit2,
  Trash2,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

export interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
  color?: string
  collapsed?: boolean
}

interface MindMapProps {
  data: MindMapNode
  onNodeClick?: (node: MindMapNode) => void
  onNodeAdd?: (parentId: string) => void
  onNodeDelete?: (nodeId: string) => void
  onNodeEdit?: (nodeId: string, newLabel: string) => void
  onNodeToggle?: (nodeId: string) => void
  className?: string
  editable?: boolean
}

export function MindMap({
  data,
  onNodeClick,
  onNodeAdd,
  onNodeDelete,
  onNodeEdit,
  onNodeToggle,
  className,
  editable = false,
}: MindMapProps) {
  const [zoom, setZoom] = React.useState(1)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((z) => Math.min(Math.max(z * delta, 0.25), 2))
    }
  }

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-background border border-border rounded-lg',
        className
      )}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 p-1 rounded-lg bg-card border border-border shadow-sm z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setZoom((z) => Math.min(z * 1.2, 2))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[40px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setZoom((z) => Math.max(z / 1.2, 0.25))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            setZoom(1)
            setPan({ x: 0, y: 0 })
          }}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Mind Map Content */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-8"
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <MindMapBranch
            node={data}
            level={0}
            direction="right"
            onNodeClick={onNodeClick}
            onNodeAdd={onNodeAdd}
            onNodeDelete={onNodeDelete}
            onNodeEdit={onNodeEdit}
            onNodeToggle={onNodeToggle}
            editable={editable}
          />
        </div>
      </div>
    </div>
  )
}

interface MindMapBranchProps {
  node: MindMapNode
  level: number
  direction: 'left' | 'right'
  onNodeClick?: (node: MindMapNode) => void
  onNodeAdd?: (parentId: string) => void
  onNodeDelete?: (nodeId: string) => void
  onNodeEdit?: (nodeId: string, newLabel: string) => void
  onNodeToggle?: (nodeId: string) => void
  editable?: boolean
}

function MindMapBranch({
  node,
  level,
  direction,
  onNodeClick,
  onNodeAdd,
  onNodeDelete,
  onNodeEdit,
  onNodeToggle,
  editable,
}: MindMapBranchProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(node.label)

  const handleSubmit = () => {
    if (editValue.trim() && editValue !== node.label) {
      onNodeEdit?.(node.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const levelColors = [
    'bg-accent text-accent-foreground',
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
  ]

  const colorClass = node.color || levelColors[level % levelColors.length]
  const hasChildren = node.children && node.children.length > 0

  return (
    <div
      className={cn(
        'flex items-center',
        direction === 'left' ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Node */}
      <div className="relative group">
        <div
          className={cn(
            'px-4 py-2 rounded-lg border cursor-pointer transition-all',
            'hover:ring-2 hover:ring-accent/30',
            level === 0 ? 'text-lg font-semibold' : 'text-sm',
            colorClass
          )}
          onClick={() => onNodeClick?.(node)}
        >
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="bg-transparent outline-none border-none min-w-[60px]"
              autoFocus
            />
          ) : (
            <span>{node.label}</span>
          )}
        </div>

        {/* Collapse/Expand Button */}
        {hasChildren && (
          <button
            onClick={() => onNodeToggle?.(node.id)}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground',
              direction === 'left' ? '-left-3' : '-right-3'
            )}
          >
            <ChevronRight
              className={cn(
                'w-3 h-3 transition-transform',
                node.collapsed && direction === 'right' && 'rotate-0',
                !node.collapsed && direction === 'right' && 'rotate-90',
                node.collapsed && direction === 'left' && 'rotate-180',
                !node.collapsed && direction === 'left' && 'rotate-90'
              )}
            />
          </button>
        )}

        {/* Actions */}
        {editable && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity',
              direction === 'left' ? '-right-24' : '-left-24'
            )}
          >
            <div className="flex items-center gap-1 p-1 rounded-md bg-card border border-border shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onNodeAdd?.(node.id)}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              {level > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => onNodeDelete?.(node.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && !node.collapsed && (
        <div
          className={cn(
            'flex flex-col gap-2',
            direction === 'left' ? 'mr-8 items-end' : 'ml-8 items-start'
          )}
        >
          {/* Connection Line */}
          <div
            className={cn(
              'absolute top-1/2 w-8 h-px bg-border',
              direction === 'left' ? 'right-full' : 'left-full'
            )}
          />

          {node.children!.map((child, index) => (
            <div key={child.id} className="relative">
              {/* Vertical connector */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute h-full w-px bg-border',
                    direction === 'left' ? 'right-0' : 'left-0',
                    '-top-1/2'
                  )}
                />
              )}
              {/* Horizontal connector */}
              <div
                className={cn(
                  'absolute top-1/2 w-4 h-px bg-border',
                  direction === 'left' ? '-right-4' : '-left-4'
                )}
              />
              <MindMapBranch
                node={child}
                level={level + 1}
                direction={direction}
                onNodeClick={onNodeClick}
                onNodeAdd={onNodeAdd}
                onNodeDelete={onNodeDelete}
                onNodeEdit={onNodeEdit}
                onNodeToggle={onNodeToggle}
                editable={editable}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Diagram Component (for flowcharts, etc.)
interface DiagramNode {
  id: string
  type: 'start' | 'end' | 'process' | 'decision' | 'io'
  label: string
  x: number
  y: number
}

interface DiagramEdge {
  id: string
  from: string
  to: string
  label?: string
}

interface DiagramProps {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  className?: string
}

export function Diagram({ nodes, edges, className }: DiagramProps) {
  const getNodeShape = (type: DiagramNode['type']) => {
    switch (type) {
      case 'start':
      case 'end':
        return 'rounded-full'
      case 'decision':
        return 'rotate-45'
      case 'io':
        return 'skew-x-12'
      default:
        return 'rounded-lg'
    }
  }

  const getNodeColor = (type: DiagramNode['type']) => {
    switch (type) {
      case 'start':
        return 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
      case 'end':
        return 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
      case 'decision':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400'
      case 'io':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400'
      default:
        return 'bg-card border-border'
    }
  }

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[400px] bg-background border border-border rounded-lg overflow-hidden',
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          return (
            <g key={edge.id}>
              <line
                x1={fromNode.x + 60}
                y1={fromNode.y + 20}
                x2={toNode.x + 60}
                y2={toNode.y + 20}
                className="stroke-border stroke-2"
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={(fromNode.x + toNode.x) / 2 + 60}
                  y={(fromNode.y + toNode.y) / 2 + 20}
                  className="fill-muted-foreground text-xs"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-border" />
          </marker>
        </defs>
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className={cn(
            'absolute px-4 py-2 border-2 min-w-[120px] text-center text-sm font-medium transition-all hover:ring-2 hover:ring-accent/30 cursor-pointer',
            getNodeShape(node.type),
            getNodeColor(node.type)
          )}
          style={{ left: node.x, top: node.y }}
        >
          <span className={node.type === 'decision' ? '-rotate-45 block' : ''}>
            {node.label}
          </span>
        </div>
      ))}
    </div>
  )
}
