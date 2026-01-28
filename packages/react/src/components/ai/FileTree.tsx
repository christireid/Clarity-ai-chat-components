'use client'

/**
 * FileTree Component
 *
 * A file/folder tree component for displaying directory structures.
 * Supports expand/collapse, file icons, and selection.
 *
 * Features:
 * - Nested folder structure
 * - File type icons
 * - Expand/collapse folders
 * - Single/multi selection
 * - Search/filter
 * - Keyboard navigation
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <FileTree
 *   data={[
 *     {
 *       name: 'src',
 *       type: 'folder',
 *       children: [
 *         { name: 'index.ts', type: 'file' },
 *         { name: 'utils.ts', type: 'file' },
 *       ],
 *     },
 *   ]}
 *   onSelect={(node) => console.log(node)}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type FileTreeSize = 'sm' | 'md' | 'lg'

export interface FileTreeNode {
  /** Unique identifier (defaults to path) */
  id?: string
  /** File/folder name */
  name: string
  /** Full path */
  path?: string
  /** Node type */
  type: 'file' | 'folder'
  /** Children (for folders) */
  children?: FileTreeNode[]
  /** File extension (auto-detected from name) */
  extension?: string
  /** Custom icon */
  icon?: React.ReactNode
  /** Whether disabled */
  isDisabled?: boolean
  /** Whether modified */
  isModified?: boolean
  /** Whether new */
  isNew?: boolean
  /** Metadata */
  metadata?: Record<string, unknown>
}

export interface FileTreeProps {
  /** Tree data */
  data: FileTreeNode[]
  /** Size preset */
  size?: FileTreeSize
  /** Initially expanded paths */
  defaultExpanded?: string[]
  /** Expand all by default */
  defaultExpandAll?: boolean
  /** Selected paths */
  selectedPaths?: string[]
  /** Selection mode */
  selectionMode?: 'single' | 'multiple' | 'none'
  /** Show file icons */
  showIcons?: boolean
  /** Show file extensions */
  showExtensions?: boolean
  /** Show file status indicators */
  showStatus?: boolean
  /** Enable search */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Node click handler */
  onSelect?: (node: FileTreeNode) => void
  /** Expand/collapse handler */
  onToggle?: (path: string, isExpanded: boolean) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function getExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

function getFileIcon(extension: string, type: 'file' | 'folder', isExpanded?: boolean): React.ReactNode {
  if (type === 'folder') {
    return isExpanded ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="file-tree-icon-folder-open">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="file-tree-icon-folder">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )
  }

  // File icons by extension
  const iconMap: Record<string, { color: string; icon: React.ReactNode }> = {
    ts: { color: '#3178c6', icon: 'TS' },
    tsx: { color: '#3178c6', icon: 'TSX' },
    js: { color: '#f7df1e', icon: 'JS' },
    jsx: { color: '#61dafb', icon: 'JSX' },
    json: { color: '#cbcb41', icon: '{ }' },
    md: { color: '#083fa1', icon: 'MD' },
    css: { color: '#264de4', icon: 'CSS' },
    scss: { color: '#cc6699', icon: 'SCSS' },
    html: { color: '#e34c26', icon: 'HTML' },
    py: { color: '#3776ab', icon: 'PY' },
    rs: { color: '#dea584', icon: 'RS' },
    go: { color: '#00add8', icon: 'GO' },
  }

  const config = iconMap[extension]
  if (config) {
    return (
      <span className="file-tree-icon-badge" style={{ backgroundColor: config.color }}>
        {typeof config.icon === 'string' ? <span style={{ fontSize: '0.6em' }}>{config.icon}</span> : config.icon}
      </span>
    )
  }

  // Default file icon
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="file-tree-icon-file">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function getNodePath(node: FileTreeNode, parentPath?: string): string {
  return node.path || (parentPath ? `${parentPath}/${node.name}` : node.name)
}

function filterNodes(nodes: FileTreeNode[], query: string): FileTreeNode[] {
  if (!query) return nodes

  const lowerQuery = query.toLowerCase()

  return nodes.reduce<FileTreeNode[]>((acc, node) => {
    const matchesName = node.name.toLowerCase().includes(lowerQuery)
    const filteredChildren = node.children ? filterNodes(node.children, query) : undefined

    if (matchesName || (filteredChildren && filteredChildren.length > 0)) {
      acc.push({
        ...node,
        children: filteredChildren,
      })
    }

    return acc
  }, [])
}

// ============================================================================
// FileTreeItem Component
// ============================================================================

interface FileTreeItemProps {
  node: FileTreeNode
  depth: number
  size: FileTreeSize
  parentPath?: string
  isExpanded: boolean
  isSelected: boolean
  showIcons: boolean
  showExtensions: boolean
  showStatus: boolean
  selectionMode: 'single' | 'multiple' | 'none'
  onToggle: (path: string) => void
  onSelect: (node: FileTreeNode) => void
  expandedPaths: Set<string>
  selectedPaths: Set<string>
}

function FileTreeItem({
  node,
  depth,
  size,
  parentPath,
  isExpanded,
  isSelected,
  showIcons,
  showExtensions,
  showStatus,
  selectionMode,
  onToggle,
  onSelect,
  expandedPaths,
  selectedPaths,
}: FileTreeItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const path = getNodePath(node, parentPath)
  const extension = node.extension || getExtension(node.name)
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === 'folder') {
      onToggle(path)
    }
    if (selectionMode !== 'none' && !node.isDisabled) {
      onSelect(node)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e as unknown as React.MouseEvent)
    }
    if (e.key === 'ArrowRight' && node.type === 'folder' && !isExpanded) {
      onToggle(path)
    }
    if (e.key === 'ArrowLeft' && node.type === 'folder' && isExpanded) {
      onToggle(path)
    }
  }

  return (
    <div className="file-tree-item-wrapper">
      <motion.div
        className={cn(
          'file-tree-item',
          `file-tree-item-${size}`,
          isSelected && 'file-tree-item-selected',
          node.isDisabled && 'file-tree-item-disabled',
          node.type === 'folder' && 'file-tree-item-folder'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={node.type === 'folder' ? isExpanded : undefined}
        initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: DURATION_SECONDS.fast,
          ease: EASING_FRAMER.standard,
        }}
      >
        {/* Expand/collapse arrow */}
        {node.type === 'folder' && (
          <motion.span
            className="file-tree-arrow"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: DURATION_SECONDS.fast }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.span>
        )}

        {/* Spacer for files at same level as folders */}
        {node.type === 'file' && <span className="file-tree-spacer" />}

        {/* Icon */}
        {showIcons && (
          <span className="file-tree-icon">
            {node.icon || getFileIcon(extension, node.type, isExpanded)}
          </span>
        )}

        {/* Name */}
        <span className="file-tree-name">
          {showExtensions || node.type === 'folder'
            ? node.name
            : node.name.replace(`.${extension}`, '')}
        </span>

        {/* Status indicators */}
        {showStatus && (
          <>
            {node.isModified && <span className="file-tree-status-modified" title="Modified">●</span>}
            {node.isNew && <span className="file-tree-status-new" title="New">+</span>}
          </>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            className="file-tree-children"
            role="group"
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION_SECONDS.fast }}
          >
            {node.children!.map((child) => {
              const childPath = getNodePath(child, path)
              return (
                <FileTreeItem
                  key={childPath}
                  node={child}
                  depth={depth + 1}
                  size={size}
                  parentPath={path}
                  isExpanded={expandedPaths.has(childPath)}
                  isSelected={selectedPaths.has(childPath)}
                  showIcons={showIcons}
                  showExtensions={showExtensions}
                  showStatus={showStatus}
                  selectionMode={selectionMode}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  expandedPaths={expandedPaths}
                  selectedPaths={selectedPaths}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// FileTree Component
// ============================================================================

export function FileTree({
  data,
  size = 'md',
  defaultExpanded = [],
  defaultExpandAll = false,
  selectedPaths: controlledSelectedPaths,
  selectionMode = 'single',
  showIcons = true,
  showExtensions = true,
  showStatus = true,
  searchable = false,
  searchPlaceholder = 'Search files...',
  onSelect,
  onToggle,
  className,
}: FileTreeProps) {
  const prefersReducedMotion = useReducedMotion()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (defaultExpandAll) {
      const allPaths = new Set<string>()
      const collectPaths = (nodes: FileTreeNode[], parentPath?: string) => {
        nodes.forEach((node) => {
          if (node.type === 'folder') {
            const path = getNodePath(node, parentPath)
            allPaths.add(path)
            if (node.children) {
              collectPaths(node.children, path)
            }
          }
        })
      }
      collectPaths(data)
      return allPaths
    }
    return new Set(defaultExpanded)
  })
  const [internalSelectedPaths, setInternalSelectedPaths] = React.useState<Set<string>>(new Set())

  const selectedPaths = controlledSelectedPaths
    ? new Set(controlledSelectedPaths)
    : internalSelectedPaths

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      const isExpanded = !next.has(path)
      if (isExpanded) {
        next.add(path)
      } else {
        next.delete(path)
      }
      onToggle?.(path, isExpanded)
      return next
    })
  }

  const handleSelect = (node: FileTreeNode) => {
    const path = node.path || node.name
    if (!controlledSelectedPaths) {
      setInternalSelectedPaths((prev) => {
        const next = new Set(prev)
        if (selectionMode === 'single') {
          next.clear()
          next.add(path)
        } else if (selectionMode === 'multiple') {
          if (next.has(path)) {
            next.delete(path)
          } else {
            next.add(path)
          }
        }
        return next
      })
    }
    onSelect?.(node)
  }

  const filteredData = searchQuery ? filterNodes(data, searchQuery) : data

  return (
    <motion.div
      className={cn('file-tree', `file-tree-${size}`, className)}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      role="tree"
      aria-label="File tree"
    >
      {/* Search */}
      {searchable && (
        <div className="file-tree-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="file-tree-search-input"
            aria-label="Search files"
          />
          {searchQuery && (
            <button
              type="button"
              className="file-tree-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Tree */}
      <div className="file-tree-content" role="group">
        {filteredData.map((node) => {
          const path = getNodePath(node)
          return (
            <FileTreeItem
              key={path}
              node={node}
              depth={0}
              size={size}
              isExpanded={expandedPaths.has(path)}
              isSelected={selectedPaths.has(path)}
              showIcons={showIcons}
              showExtensions={showExtensions}
              showStatus={showStatus}
              selectionMode={selectionMode}
              onToggle={handleToggle}
              onSelect={handleSelect}
              expandedPaths={expandedPaths}
              selectedPaths={selectedPaths}
            />
          )
        })}

        {filteredData.length === 0 && searchQuery && (
          <div className="file-tree-empty">
            No files matching "{searchQuery}"
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// useFileTree Hook
// ============================================================================

export interface UseFileTreeOptions {
  /** Initial data */
  initialData?: FileTreeNode[]
}

export interface UseFileTreeReturn {
  /** Tree data */
  data: FileTreeNode[]
  /** Set tree data */
  setData: (data: FileTreeNode[]) => void
  /** Add node */
  addNode: (path: string, node: FileTreeNode) => void
  /** Remove node */
  removeNode: (path: string) => void
  /** Rename node */
  renameNode: (path: string, newName: string) => void
  /** Find node by path */
  findNode: (path: string) => FileTreeNode | undefined
}

export function useFileTree(options: UseFileTreeOptions = {}): UseFileTreeReturn {
  const { initialData = [] } = options
  const [data, setData] = React.useState<FileTreeNode[]>(initialData)

  const findNode = React.useCallback(
    (path: string): FileTreeNode | undefined => {
      const parts = path.split('/')
      let current: FileTreeNode[] | undefined = data
      let node: FileTreeNode | undefined

      for (const part of parts) {
        node = current?.find((n) => n.name === part)
        if (!node) return undefined
        current = node.children
      }

      return node
    },
    [data]
  )

  const addNode = React.useCallback((path: string, node: FileTreeNode) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev))
      const parts = path.split('/')
      let current = newData

      for (let i = 0; i < parts.length; i++) {
        const found = current.find((n: FileTreeNode) => n.name === parts[i])
        if (found && found.children) {
          current = found.children
        }
      }

      current.push(node)
      return newData
    })
  }, [])

  const removeNode = React.useCallback((path: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev))
      const parts = path.split('/')
      const name = parts.pop()!
      let current = newData

      for (const part of parts) {
        const found = current.find((n: FileTreeNode) => n.name === part)
        if (found && found.children) {
          current = found.children
        }
      }

      const index = current.findIndex((n: FileTreeNode) => n.name === name)
      if (index !== -1) {
        current.splice(index, 1)
      }

      return newData
    })
  }, [])

  const renameNode = React.useCallback((path: string, newName: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev))
      const parts = path.split('/')
      const oldName = parts.pop()!
      let current = newData

      for (const part of parts) {
        const found = current.find((n: FileTreeNode) => n.name === part)
        if (found && found.children) {
          current = found.children
        }
      }

      const node = current.find((n: FileTreeNode) => n.name === oldName)
      if (node) {
        node.name = newName
      }

      return newData
    })
  }, [])

  return {
    data,
    setData,
    addNode,
    removeNode,
    renameNode,
    findNode,
  }
}

export default FileTree
