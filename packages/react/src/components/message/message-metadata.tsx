import * as React from 'react'
import type { Message } from '@clarity-chat/types'

export interface MessageMetadataProps {
  metadata?: Message['metadata']
}

/**
 * Message metadata component (tokens, processing time, model)
 * Extracted from Message component for better organization
 */
export const MessageMetadata = React.memo<MessageMetadataProps>(
  ({ metadata }) => {
    if (!metadata) return null

    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {metadata.tokens && <span>{metadata.tokens} tokens</span>}
        {metadata.processingTime && (
          <span>⚡ {metadata.processingTime}ms</span>
        )}
        {metadata.model && <span>🤖 {metadata.model}</span>}
      </div>
    )
  }
)

MessageMetadata.displayName = 'MessageMetadata'
