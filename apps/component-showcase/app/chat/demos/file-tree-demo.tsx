'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@clarity-chat/primitives'
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  File,
} from 'lucide-react'
import type { FileNode } from '../types'

export function FileTreeDemo() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'src/components'])
  )
  const [selectedFile, setSelectedFile] = useState(
    'src/components/ChatWindow.tsx'
  )

  const fileTree: FileNode[] = [
    {
      name: 'src',
      type: 'folder' as const,
      children: [
        {
          name: 'components',
          type: 'folder' as const,
          children: [
            { name: 'ChatWindow.tsx', type: 'file' as const },
            { name: 'ChatInput.tsx', type: 'file' as const },
            { name: 'MessageList.tsx', type: 'file' as const },
          ],
        },
        {
          name: 'hooks',
          type: 'folder' as const,
          children: [{ name: 'useClarityChat.ts', type: 'file' as const }],
        },
      ],
    },
    { name: 'package.json', type: 'file' as const },
    { name: 'README.md', type: 'file' as const },
  ]

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const renderNode = (
    node: FileNode,
    path: string = '',
    depth: number = 0
  ): React.ReactNode => {
    const fullPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedFolders.has(fullPath)
    const isSelected = selectedFile === fullPath

    return (
      <div key={fullPath}>
        <button
          onClick={() =>
            node.type === 'folder'
              ? toggleFolder(fullPath)
              : setSelectedFile(fullPath)
          }
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md',
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="h-4 w-4 text-blue-500" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {node.type === 'folder' &&
          isExpanded &&
          node.children?.map((child) => renderNode(child, fullPath, depth + 1))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2 max-h-[300px] overflow-auto">
          {fileTree.map((node) => renderNode(node))}
        </div>
      </CardContent>
    </Card>
  )
}
