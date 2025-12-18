/**
 * Conversation Branch Visualizer
 *
 * Provides a tree-based visualization for conversation branching,
 * similar to Claude's conversation branches feature.
 *
 * @blueprint Feature 2.3 - Conversation Branching
 * @priority HIGH
 * @status NEW - Implementation based on blueprint analysis
 */

'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// Types
// ============================================================================

export interface ConversationBranch {
  id: string
  parentId: string | null
  messageIds: string[]
  title?: string
  createdAt: Date
  updatedAt: Date
  metadata?: {
    messageCount: number
    lastMessagePreview?: string
    tokens?: number
  }
}

export interface BranchNode extends ConversationBranch {
  children: BranchNode[]
  depth: number
}

export interface ConversationBranchVisualizerProps {
  /** All branches in the conversation tree */
  branches: ConversationBranch[]
  
  /** Currently active branch ID */
  currentBranchId: string
  
  /** Callback when user switches to a different branch */
  onBranchSwitch: (branchId: string) => void
  
  /** Callback when user creates a new branch */
  onBranchCreate?: (parentBranchId: string) => void
  
  /** Callback when user deletes a branch */
  onBranchDelete?: (branchId: string) => void
  
  /** Callback when user renames a branch */
  onBranchRename?: (branchId: string, newTitle: string) => void
  
  /** Maximum depth to display (default: unlimited) */
  maxDepth?: number
  
  /** Compact mode for smaller displays */
  compact?: boolean
  
  /** Custom CSS class */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Builds a tree structure from flat branch array
 */
function buildBranchTree(branches: ConversationBranch[]): BranchNode[] {
  const branchMap = new Map<string, BranchNode>()
  const rootNodes: BranchNode[] = []

  // First pass: create all nodes
  branches.forEach(branch => {
    branchMap.set(branch.id, {
      ...branch,
      children: [],
      depth: 0,
    })
  })

  // Second pass: build tree structure and calculate depths
  branches.forEach(branch => {
    const node = branchMap.get(branch.id)!
    
    if (branch.parentId === null) {
      rootNodes.push(node)
    } else {
      const parent = branchMap.get(branch.parentId)
      if (parent) {
        node.depth = parent.depth + 1
        parent.children.push(node)
      }
    }
  })

  return rootNodes
}

/**
 * Finds path from root to target branch
 */
function findBranchPath(
  nodes: BranchNode[],
  targetId: string,
  path: string[] = []
): string[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node.id]
    
    if (node.id === targetId) {
      return currentPath
    }
    
    const found = findBranchPath(node.children, targetId, currentPath)
    if (found) {
      return found
    }
  }
  
  return null
}

// ============================================================================
// Sub-Components
// ============================================================================

interface BranchNodeProps {
  node: BranchNode
  isActive: boolean
  isInActivePath: boolean
  onSelect: (branchId: string) => void
  onDelete?: (branchId: string) => void
  onRename?: (branchId: string, newTitle: string) => void
  onCreateChild?: (parentId: string) => void
  compact?: boolean
}

function BranchNodeComponent({
  node,
  isActive,
  isInActivePath,
  onSelect,
  onDelete,
  onRename,
  onCreateChild,
  compact = false,
}: BranchNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(node.title || 'Untitled Branch')
  const [isHovered, setIsHovered] = useState(false)

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== node.title) {
      onRename?.(node.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditTitle(node.title || 'Untitled Branch')
      setIsEditing(false)
    }
  }

  return (
    <div className="relative">
      {/* Branch Node */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className={cn(
          'group relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 ease-out',
          'hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] cursor-pointer',
          isActive && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          isInActivePath && !isActive && 'border-blue-300 bg-blue-25 dark:bg-blue-900/10',
          !isActive && !isInActivePath && 'border-gray-200 dark:border-gray-700',
          compact ? 'text-sm' : 'text-base'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(node.id)}
      >
        {/* Branch Icon */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        )}>
          {node.children.length > 0 ? '🌳' : '🌿'}
        </div>

        {/* Branch Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className={cn(
                'w-full px-2 py-1 border rounded',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div>
              <div className={cn(
                'font-medium truncate',
                isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
              )}>
                {node.title || 'Untitled Branch'}
              </div>
              {!compact && node.metadata?.lastMessagePreview && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {node.metadata.lastMessagePreview}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        {!compact && (
          <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
            {node.metadata?.messageCount || 0} msgs
          </div>
        )}

        {/* Action Buttons (shown on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {onRename && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Rename branch"
                  aria-label="Rename branch"
                >
                  ✏️
                </button>
              )}
              {onCreateChild && (
                <button
                  onClick={() => onCreateChild(node.id)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Create child branch"
                  aria-label="Create child branch"
                >
                  ➕
                </button>
              )}
              {onDelete && node.children.length === 0 && (
                <button
                  onClick={() => onDelete(node.id)}
                  className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-900"
                  title="Delete branch"
                  aria-label="Delete branch"
                >
                  🗑️
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className={cn('ml-6 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2')}>
          {node.children.map((child) => (
            <BranchNodeComponent
              key={child.id}
              node={child}
              isActive={isActive}
              isInActivePath={isInActivePath}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onCreateChild={onCreateChild}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function ConversationBranchVisualizer({
  branches,
  currentBranchId,
  onBranchSwitch,
  onBranchCreate,
  onBranchDelete,
  onBranchRename,
  maxDepth,
  compact = false,
  className,
}: ConversationBranchVisualizerProps) {
  // Build tree structure
  const branchTree = useMemo(() => buildBranchTree(branches), [branches])

  // Find active path
  const activePath = useMemo(
    () => findBranchPath(branchTree, currentBranchId) || [],
    [branchTree, currentBranchId]
  )

  // Filter by max depth if specified
  const filteredTree = useMemo(() => {
    if (!maxDepth) return branchTree

    function filterByDepth(nodes: BranchNode[], currentDepth: number): BranchNode[] {
      if (currentDepth >= maxDepth!) return []
      
      return nodes.map(node => ({
        ...node,
        children: filterByDepth(node.children, currentDepth + 1),
      }))
    }

    return filterByDepth(branchTree, 0)
  }, [branchTree, maxDepth])

  // Render tree
  function renderTree(nodes: BranchNode[]) {
    return nodes.map((node) => (
      <BranchNodeComponent
        key={node.id}
        node={node}
        isActive={node.id === currentBranchId}
        isInActivePath={activePath.includes(node.id)}
        onSelect={onBranchSwitch}
        onDelete={onBranchDelete}
        onRename={onBranchRename}
        onCreateChild={onBranchCreate}
        compact={compact}
      />
    ))
  }

  return (
    <div className={cn('conversation-branch-visualizer', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Conversation Branches
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {branches.length} {branches.length === 1 ? 'branch' : 'branches'}
        </div>
      </div>

      {/* Tree */}
      <div className="space-y-2">
        {filteredTree.length > 0 ? (
          renderTree(filteredTree)
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No branches found
          </div>
        )}
      </div>

      {/* Help Text */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <p>💡 Click a branch to switch to it. Hover to see actions.</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Hook for Branch Management
// ============================================================================

export interface UseBranchManagementOptions {
  conversationId: string
  onBranchChange?: (branchId: string) => void
}

export function useBranchManagement({ conversationId: _conversationId, onBranchChange }: UseBranchManagementOptions) {
  const [branches, setBranches] = useState<ConversationBranch[]>([])
  const [currentBranchId, setCurrentBranchId] = useState<string>('main')

  // Create a new branch
  const createBranch = (parentBranchId: string, fromMessageId?: string) => {
    const newBranch: ConversationBranch = {
      id: `branch-${Date.now()}`,
      parentId: parentBranchId,
      messageIds: fromMessageId ? [fromMessageId] : [],
      title: `Branch ${branches.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        messageCount: fromMessageId ? 1 : 0,
      },
    }

    setBranches((prev) => [...prev, newBranch])
    switchBranch(newBranch.id)
  }

  // Switch to a different branch
  const switchBranch = (branchId: string) => {
    setCurrentBranchId(branchId)
    onBranchChange?.(branchId)
  }

  // Delete a branch
  const deleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId))
    
    // If deleting current branch, switch to parent or main
    if (branchId === currentBranchId) {
      const branch = branches.find((b) => b.id === branchId)
      switchBranch(branch?.parentId || 'main')
    }
  }

  // Rename a branch
  const renameBranch = (branchId: string, newTitle: string) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId
          ? { ...b, title: newTitle, updatedAt: new Date() }
          : b
      )
    )
  }

  return {
    branches,
    currentBranchId,
    createBranch,
    switchBranch,
    deleteBranch,
    renameBranch,
  }
}

export default ConversationBranchVisualizer
