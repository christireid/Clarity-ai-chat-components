'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Network } from 'lucide-react'

interface Node {
  id: string
  label: string
  type: 'concept' | 'document' | 'entity'
}

interface Edge {
  source: string
  target: string
  strength: number
}

interface KnowledgeGraphProps {
  nodes: Node[]
  edges: Edge[]
}

export function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const prefersReducedMotion = useReducedMotion()

  // Simple force-directed layout simulation
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    const centerX = 400
    const centerY = 300
    const radius = 150

    nodes.forEach((node, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2
      pos[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    })

    return pos
  }, [nodes])

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8">
      <div className="flex items-center mb-6">
        <Network className="w-6 h-6 mr-2 text-purple-600" />
        <h2 className="text-2xl font-bold">Knowledge Graph</h2>
      </div>

      <div className="relative h-[calc(100%-80px)]">
        <svg className="w-full h-full">
          {/* Edges */}
          {edges.map((edge, idx) => {
            const source = positions[edge.source]
            const target = positions[edge.target]
            if (!source || !target) return null

            return (
              <motion.line
                key={idx}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#6366f1"
                strokeWidth={edge.strength * 3}
                opacity={0.3}
                initial={prefersReducedMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const pos = positions[node.id]
            if (!pos) return null

            return (
              <g key={node.id}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={30}
                  fill={
                    node.type === 'concept'
                      ? '#6366f1'
                      : node.type === 'document'
                      ? '#8b5cf6'
                      : '#ec4899'
                  }
                  initial={prefersReducedMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                />
                <motion.text
                  x={pos.x}
                  y={pos.y + 50}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  {node.label}
                </motion.text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
