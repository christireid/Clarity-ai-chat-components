'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import type { Folder, Conversation } from '../ConversationList.types'

export interface FolderListProps {
  folders: Folder[]
  conversations: Conversation[]
  activeFolderId?: string | null
  expandedFolders: Set<string>
  prefersReducedMotion: boolean
  onFolderSelect?: (folderId: string | null) => void
  onDeleteFolder?: (folderId: string) => void
  onToggleFolder: (folderId: string) => void
  conversationsByFolder: Record<string, Conversation[]>
}

/**
 * Folder navigation list
 */
export const FolderList = memo(function FolderList({
  folders,
  conversations,
  activeFolderId,
  expandedFolders,
  prefersReducedMotion,
  onFolderSelect,
  onDeleteFolder,
  onToggleFolder,
  conversationsByFolder,
}: FolderListProps) {
  return (
    <div className="border-b border-border">
      {/* All conversations / Uncategorized */}
      <button
        onClick={() => onFolderSelect?.(null)}
        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
          activeFolderId === null || activeFolderId === undefined
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-muted/50 text-foreground'
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>All Conversations</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {conversations.length}
          </span>
        </div>
      </button>

      {/* Folders */}
      {folders.map((folder) => {
        const folderConversations = conversationsByFolder[folder.id] || []
        const isExpanded = expandedFolders.has(folder.id)
        const isActive = activeFolderId === folder.id

        return (
          <div
            key={folder.id}
            className="border-b border-border/50 last:border-b-0"
          >
            <button
              onClick={() => {
                onToggleFolder(folder.id)
                onFolderSelect?.(folder.id)
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                {prefersReducedMotion ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                ) : (
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 300,
                    }}
                    viewport={{ once: true }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                )}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span className="flex-1 truncate">{folder.name}</span>
                <span className="text-xs text-muted-foreground">
                  {folderConversations.length}
                </span>
                {onDeleteFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete folder "${folder.name}"?`)) {
                        onDeleteFolder(folder.id)
                      }
                    }}
                    className="p-1 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete folder ${folder.name}`}
                  >
                    <svg
                      className="w-3 h-3 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
})

FolderList.displayName = 'FolderList'
