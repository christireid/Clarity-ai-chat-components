import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, ScrollArea, cn } from '@clarity-chat/primitives'
import type { Context, ContextType } from '@clarity-chat/types'
import { ContextCard } from './context-card'
import { FileUpload } from './file-upload'

export interface ContextManagerProps {
  contexts: Context[]
  onAdd: (contexts: Context[]) => void
  onRemove: (id: string) => void
  onToggle: (id: string) => void
  onPreview?: (context: Context) => void
  maxContexts?: number
  allowedTypes?: ContextType[]
  className?: string
}

export const ContextManager: React.FC<ContextManagerProps> = ({
  contexts,
  onAdd,
  onRemove,
  onToggle,
  onPreview,
  maxContexts = 20,
  allowedTypes = ['document', 'image', 'video', 'link', 'text'],
  className,
}) => {
  const [showUpload, setShowUpload] = React.useState(false)
  const [filter, setFilter] = React.useState<ContextType | 'all'>('all')

  const filteredContexts = React.useMemo(() => {
    if (filter === 'all') return contexts
    return contexts.filter((c) => c.type === filter)
  }, [contexts, filter])

  const activeCount = contexts.filter((c) => c.isActive).length
  const typeStats = React.useMemo(() => {
    const stats: Record<ContextType, number> = {
      document: 0,
      image: 0,
      video: 0,
      audio: 0,
      link: 0,
      text: 0,
    }
    contexts.forEach((c) => {
      stats[c.type] = (stats[c.type] || 0) + 1
    })
    return stats
  }, [contexts])

  const handleUpload = async (files: File[]) => {
    // Convert files to Context objects
    const newContexts: Context[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      projectId: '', // Will be set by parent
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'document',
      name: file.name,
      content: '', // Will be extracted
      url: URL.createObjectURL(file),
      metadata: {
        fileSize: file.size,
        mimeType: file.type,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    onAdd(newContexts)
    setShowUpload(false)
    return [] // Return empty array as upload handles context creation
  }

  const toggleAllActive = () => {
    const hasActive = contexts.some((c) => c.isActive)
    contexts.forEach((c) => {
      if (hasActive) {
        if (c.isActive) onToggle(c.id)
      } else {
        if (!c.isActive) onToggle(c.id)
      }
    })
  }

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Context Manager
              <Badge variant="secondary">
                {contexts.length}/{maxContexts}
              </Badge>
            </CardTitle>
            <CardDescription>
              {activeCount} active • {contexts.length} total
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            disabled={contexts.length >= maxContexts}
            size="sm"
          >
            {showUpload ? '✕ Cancel' : '+ Add Context'}
          </Button>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({contexts.length})
          </Button>
          {allowedTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              disabled={typeStats[type] === 0}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({typeStats[type]})
            </Button>
          ))}
        </div>

        {/* Quick Actions */}
        {contexts.length > 0 && (
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={toggleAllActive}>
              {activeCount > 0 ? 'Deactivate All' : 'Activate All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => contexts.forEach((c) => onRemove(c.id))}
              className="text-destructive"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {/* Upload Section */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <FileUpload
                onUpload={handleUpload}
                maxFiles={maxContexts - contexts.length}
                acceptedFileTypes={allowedTypes.map((type) => {
                  switch (type) {
                    case 'image':
                      return 'image/*'
                    case 'video':
                      return 'video/*'
                    case 'audio':
                      return 'audio/*'
                    case 'document':
                      return 'application/pdf,.doc,.docx,.txt'
                    default:
                      return '*'
                  }
                })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contexts List */}
        <ScrollArea className="h-full">
          {filteredContexts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-sm font-medium">No context added yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add documents, images, or links to provide context for your conversations
              </p>
              <Button onClick={() => setShowUpload(true)} className="mt-4" size="sm">
                Add First Context
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              <AnimatePresence>
                {filteredContexts.map((context) => (
                  <ContextCard
                    key={context.id}
                    context={context}
                    onRemove={onRemove}
                    onToggle={onToggle}
                    onPreview={onPreview}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
