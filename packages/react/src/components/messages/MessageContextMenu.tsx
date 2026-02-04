'use client'

import * as React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Reply,
  Forward,
  Copy,
  Edit,
  Pin,
  Bookmark,
  Share2,
  Trash2,
  MoreHorizontal,
  Smile,
  Quote,
  Download,
  Star,
  Flag,
  Archive,
  Volume2,
  VolumeX,
  PinOff,
  BookmarkX,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export interface MessageContextMenuProps {
  children: React.ReactNode
  messageId: string
  isOwn?: boolean
  isPinned?: boolean
  isBookmarked?: boolean
  isMuted?: boolean
  canEdit?: boolean
  canDelete?: boolean
  onReply?: (messageId: string) => void
  onForward?: (messageId: string) => void
  onCopy?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onPin?: (messageId: string, location: 'top' | 'bottom') => void
  onUnpin?: (messageId: string) => void
  onBookmark?: (messageId: string) => void
  onUnbookmark?: (messageId: string) => void
  onReact?: (messageId: string) => void
  onQuote?: (messageId: string) => void
  onShare?: (messageId: string, type: 'link' | 'embed' | 'export') => void
  onDownload?: (messageId: string) => void
  onMark?: (messageId: string, type: 'read' | 'unread' | 'important') => void
  onMute?: (messageId: string) => void
  onUnmute?: (messageId: string) => void
  onReport?: (messageId: string) => void
  onArchive?: (messageId: string) => void
}

/**
 * MessageContextMenu - Full-featured right-click context menu for messages
 *
 * Provides comprehensive message interaction options including:
 * - Reply, forward, quote
 * - Copy, edit, delete
 * - Pin/unpin (with location selector)
 * - Bookmark/unbookmark
 * - React with emoji
 * - Share (link, embed, export)
 * - Mark as read/unread/important
 * - Mute/unmute
 * - Report, archive
 *
 * @example
 * ```tsx
 * <MessageContextMenu
 *   messageId="msg-123"
 *   isOwn={true}
 *   canEdit={true}
 *   onReply={(id) => console.log('Reply to', id)}
 *   onEdit={(id) => console.log('Edit', id)}
 *   onDelete={(id) => console.log('Delete', id)}
 * >
 *   <div className="message">Message content</div>
 * </MessageContextMenu>
 * ```
 */
export function MessageContextMenu({
  children,
  messageId,
  isOwn = false,
  isPinned = false,
  isBookmarked = false,
  isMuted = false,
  canEdit = false,
  canDelete = false,
  onReply,
  onForward,
  onCopy,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onBookmark,
  onUnbookmark,
  onReact,
  onQuote,
  onShare,
  onDownload,
  onMark,
  onMute,
  onUnmute,
  onReport,
  onArchive,
}: MessageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Primary Actions */}
        {onReply && (
          <ContextMenuItem onClick={() => onReply(messageId)}>
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </ContextMenuItem>
        )}
        {onForward && (
          <ContextMenuItem onClick={() => onForward(messageId)}>
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </ContextMenuItem>
        )}
        {onQuote && (
          <ContextMenuItem onClick={() => onQuote(messageId)}>
            <Quote className="h-4 w-4 mr-2" />
            Quote
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* Content Actions */}
        {onCopy && (
          <ContextMenuItem onClick={() => onCopy(messageId)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </ContextMenuItem>
        )}
        {onDownload && (
          <ContextMenuItem onClick={() => onDownload(messageId)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* Organization Actions */}
        {isPinned ? (
          onUnpin && (
            <ContextMenuItem onClick={() => onUnpin(messageId)}>
              <PinOff className="h-4 w-4 mr-2" />
              Unpin Message
            </ContextMenuItem>
          )
        ) : (
          onPin && (
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Pin className="h-4 w-4 mr-2" />
                Pin Message
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => onPin(messageId, 'top')}>
                  Pin to Top
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onPin(messageId, 'bottom')}>
                  Pin to Bottom
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )
        )}

        {isBookmarked ? (
          onUnbookmark && (
            <ContextMenuItem onClick={() => onUnbookmark(messageId)}>
              <BookmarkX className="h-4 w-4 mr-2" />
              Remove Bookmark
            </ContextMenuItem>
          )
        ) : (
          onBookmark && (
            <ContextMenuItem onClick={() => onBookmark(messageId)}>
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </ContextMenuItem>
          )
        )}

        {/* Reaction */}
        {onReact && (
          <ContextMenuItem onClick={() => onReact(messageId)}>
            <Smile className="h-4 w-4 mr-2" />
            Add Reaction
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {/* Mark Actions */}
        {onMark && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Mark as
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onMark(messageId, 'read')}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Read
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onMark(messageId, 'unread')}>
                <XCircle className="h-4 w-4 mr-2" />
                Unread
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onMark(messageId, 'important')}>
                <Star className="h-4 w-4 mr-2" />
                Important
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {/* Share Actions */}
        {onShare && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onShare(messageId, 'link')}>
                Copy Link
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onShare(messageId, 'embed')}>
                Get Embed Code
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onShare(messageId, 'export')}>
                Export Message
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {/* Mute/Unmute */}
        {isMuted ? (
          onUnmute && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => onUnmute(messageId)}>
                <Volume2 className="h-4 w-4 mr-2" />
                Unmute Thread
              </ContextMenuItem>
            </>
          )
        ) : (
          onMute && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => onMute(messageId)}>
                <VolumeX className="h-4 w-4 mr-2" />
                Mute Thread
              </ContextMenuItem>
            </>
          )
        )}

        {/* Archive */}
        {onArchive && (
          <ContextMenuItem onClick={() => onArchive(messageId)}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </ContextMenuItem>
        )}

        {/* Moderation Actions (Only for own messages) */}
        {isOwn && (
          <>
            <ContextMenuSeparator />
            {canEdit && onEdit && (
              <ContextMenuItem onClick={() => onEdit(messageId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Message
              </ContextMenuItem>
            )}
            {canDelete && onDelete && (
              <ContextMenuItem
                onClick={() => onDelete(messageId)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Message
              </ContextMenuItem>
            )}
          </>
        )}

        {/* Report (Only for others' messages) */}
        {!isOwn && onReport && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onReport(messageId)}
              className="text-destructive focus:text-destructive"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report Message
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
