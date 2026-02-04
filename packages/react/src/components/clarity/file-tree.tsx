'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@clarity-chat/primitives'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  FileVideo,
  FileAudio,
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  Copy,
  Clipboard,
  Download,
  MoreHorizontal,
} from 'lucide-react'
import type { FileNode } from './types/ai-types'

interface FileTreeProps {
  files: FileNode[]
  selectedFile?: string
  onSelect?: (file: FileNode) => void
  onRename?: (file: FileNode, newName: string) => void
  onDelete?: (file: FileNode) => void
  onCopy?: (file: FileNode) => void
  onPaste?: (targetDir: FileNode) => void
  onCreateFile?: (parentDir: FileNode) => void
  onCreateFolder?: (parentDir: FileNode) => void
  showActions?: boolean
  className?: string
}

const fileIcons: Record<string, { icon: React.ElementType; color: string }> = {
  // Code files
  js: { icon: FileCode, color: 'text-yellow-500' },
  jsx: { icon: FileCode, color: 'text-yellow-500' },
  ts: { icon: FileCode, color: 'text-blue-500' },
  tsx: { icon: FileCode, color: 'text-blue-500' },
  py: { icon: FileCode, color: 'text-green-500' },
  rb: { icon: FileCode, color: 'text-red-500' },
  go: { icon: FileCode, color: 'text-cyan-500' },
  rs: { icon: FileCode, color: 'text-orange-500' },
  java: { icon: FileCode, color: 'text-red-600' },
  cpp: { icon: FileCode, color: 'text-blue-600' },
  c: { icon: FileCode, color: 'text-blue-400' },
  h: { icon: FileCode, color: 'text-purple-500' },
  css: { icon: FileCode, color: 'text-pink-500' },
  scss: { icon: FileCode, color: 'text-pink-600' },
  html: { icon: FileCode, color: 'text-orange-500' },
  vue: { icon: FileCode, color: 'text-emerald-500' },
  svelte: { icon: FileCode, color: 'text-orange-600' },

  // Data files
  json: { icon: FileJson, color: 'text-yellow-600' },
  yaml: { icon: FileJson, color: 'text-red-400' },
  yml: { icon: FileJson, color: 'text-red-400' },
  xml: { icon: FileJson, color: 'text-orange-400' },
  toml: { icon: FileJson, color: 'text-gray-500' },

  // Text files
  md: { icon: FileText, color: 'text-blue-400' },
  txt: { icon: FileText, color: 'text-gray-500' },
  log: { icon: FileText, color: 'text-gray-400' },

  // Media
  png: { icon: FileImage, color: 'text-purple-500' },
  jpg: { icon: FileImage, color: 'text-purple-500' },
  jpeg: { icon: FileImage, color: 'text-purple-500' },
  gif: { icon: FileImage, color: 'text-purple-400' },
  svg: { icon: FileImage, color: 'text-orange-500' },
  webp: { icon: FileImage, color: 'text-purple-600' },
  mp4: { icon: FileVideo, color: 'text-red-500' },
  webm: { icon: FileVideo, color: 'text-red-400' },
  mov: { icon: FileVideo, color: 'text-red-600' },
  mp3: { icon: FileAudio, color: 'text-green-500' },
  wav: { icon: FileAudio, color: 'text-green-400' },
  ogg: { icon: FileAudio, color: 'text-green-600' },
}

export function FileTree({
  files,
  selectedFile,
  onSelect,
  onRename,
  onDelete,
  onCopy,
  onPaste,
  onCreateFile,
  onCreateFolder,
  showActions = true,
  className,
}: FileTreeProps) {
  return (
    <div className={cn('text-sm', className)}>
      {files.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedFile={selectedFile}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onCopy={onCopy}
          onPaste={onPaste}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
          showActions={showActions}
        />
      ))}
    </div>
  )
}

interface FileTreeNodeProps {
  node: FileNode
  depth: number
  selectedFile?: string
  onSelect?: (file: FileNode) => void
  onRename?: (file: FileNode, newName: string) => void
  onDelete?: (file: FileNode) => void
  onCopy?: (file: FileNode) => void
  onPaste?: (targetDir: FileNode) => void
  onCreateFile?: (parentDir: FileNode) => void
  onCreateFolder?: (parentDir: FileNode) => void
  showActions?: boolean
}

function FileTreeNode({
  node,
  depth,
  selectedFile,
  onSelect,
  onRename,
  onDelete,
  onCopy,
  onPaste,
  onCreateFile,
  onCreateFolder,
  showActions,
}: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = React.useState(depth < 2)
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [newName, setNewName] = React.useState(node.name)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isDirectory = node.type === 'directory'
  const isSelected = selectedFile === node.id
  const extension = node.name.split('.').pop()?.toLowerCase() || ''
  const fileIconData = fileIcons[extension]
  const FileIcon = isDirectory
    ? isOpen
      ? FolderOpen
      : Folder
    : fileIconData?.icon || File
  const iconColor = isDirectory
    ? 'text-amber-500'
    : fileIconData?.color || 'text-muted-foreground'

  const handleClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen)
    } else {
      onSelect?.(node)
    }
  }

  const handleRename = () => {
    if (newName && newName !== node.name) {
      onRename?.(node, newName)
    }
    setIsRenaming(false)
  }

  React.useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  const content = (
    <div
      className={cn(
        'flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors group',
        isSelected ? 'bg-secondary' : 'hover:bg-secondary/50'
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={handleClick}
    >
      {isDirectory && (
        <span className="p-0.5">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </span>
      )}
      {!isDirectory && <span className="w-5" />}

      <FileIcon className={cn('h-4 w-4 shrink-0', iconColor)} />

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setIsRenaming(false)
          }}
          className="flex-1 bg-transparent border-b border-ai-user outline-none text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{node.name}</span>
      )}

      {node.modified && (
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
          {formatDate(node.modified)}
        </span>
      )}
    </div>
  )

  if (showActions) {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          {content}
          {isDirectory && isOpen && node.children && (
            <div>
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  onSelect={onSelect}
                  onRename={onRename}
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onPaste={onPaste}
                  onCreateFile={onCreateFile}
                  onCreateFolder={onCreateFolder}
                  showActions={showActions}
                />
              ))}
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {isDirectory && (
            <>
              <ContextMenuItem onClick={() => onCreateFile?.(node)}>
                <FilePlus className="h-4 w-4 mr-2" />
                New File
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onCreateFolder?.(node)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={() => setIsRenaming(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onCopy?.(node)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </ContextMenuItem>
          {isDirectory && (
            <ContextMenuItem onClick={() => onPaste?.(node)}>
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-destructive"
            onClick={() => onDelete?.(node)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <>
      {content}
      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onPaste={onPaste}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </>
  )
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Breadcrumb navigation for file paths
export function FileBreadcrumb({
  path,
  onNavigate,
  className,
}: {
  path: string
  onNavigate?: (path: string) => void
  className?: string
}) {
  const parts = path.split('/').filter(Boolean)

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      <button
        onClick={() => onNavigate?.('/')}
        className="hover:text-ai-user transition-colors"
      >
        <Folder className="h-4 w-4" />
      </button>
      {parts.map((part, idx) => {
        const currentPath = '/' + parts.slice(0, idx + 1).join('/')
        const isLast = idx === parts.length - 1

        return (
          <React.Fragment key={currentPath}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => onNavigate?.(currentPath)}
              className={cn(
                'hover:text-ai-user transition-colors',
                isLast && 'text-foreground font-medium'
              )}
            >
              {part}
            </button>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// File card for displaying file info
export function FileCard({
  file,
  onOpen,
  onDownload,
  className,
}: {
  file: FileNode
  onOpen?: () => void
  onDownload?: () => void
  className?: string
}) {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const FileIcon = fileIcons[extension] || File

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group',
        className
      )}
    >
      <div className="p-2 rounded-lg bg-secondary">
        <FileIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{file.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {file.size && <span>{formatFileSize(file.size)}</span>}
          {file.modified && (
            <>
              <span>·</span>
              <span>{formatDate(file.modified)}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onOpen}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Package info display
export interface PackageInfo {
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function PackageInfoCard({
  packageInfo,
  className,
}: {
  packageInfo: PackageInfo
  className?: string
}) {
  const [showDeps, setShowDeps] = React.useState(false)
  const allDeps = {
    ...packageInfo.dependencies,
    ...packageInfo.devDependencies,
  }
  const depCount = Object.keys(allDeps).length

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{packageInfo.name}</h4>
            <p className="text-xs text-muted-foreground">
              v{packageInfo.version}
            </p>
          </div>
          {packageInfo.license && (
            <span className="text-xs px-2 py-1 rounded-md bg-secondary">
              {packageInfo.license}
            </span>
          )}
        </div>
        {packageInfo.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {packageInfo.description}
          </p>
        )}
      </div>

      {depCount > 0 && (
        <Collapsible open={showDeps} onOpenChange={setShowDeps}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-secondary/50 transition-colors">
            <span className="text-sm">{depCount} dependencies</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                showDeps && 'rotate-180'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-3 max-h-[200px] overflow-auto">
              {Object.entries(allDeps).map(([name, version]) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-1 text-sm"
                >
                  <span className="font-mono">{name}</span>
                  <span className="text-muted-foreground font-mono text-xs">
                    {version}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
