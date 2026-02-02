'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  MoreHorizontal,
  Share2,
  Bookmark,
  BookmarkCheck,
  Flag,
  Edit3,
  Trash2,
  Volume2,
  Download,
  Code,
  FileText,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
} from 'lucide-react'

// =============================================================================
// MESSAGE ACTIONS BAR - Comprehensive action toolbar for messages
// =============================================================================

type FeedbackType = 'positive' | 'negative' | null

interface MessageActionsBarProps {
  messageId: string
  content: string
  onCopy?: () => void
  onFeedback?: (type: FeedbackType, messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onShare?: (messageId: string) => void
  onBookmark?: (messageId: string) => void
  onPin?: (messageId: string) => void
  onReport?: (messageId: string) => void
  onSpeak?: (content: string) => void
  onDownload?: (messageId: string, format: 'txt' | 'md' | 'json') => void
  feedback?: FeedbackType
  isBookmarked?: boolean
  isPinned?: boolean
  isEditable?: boolean
  isDeletable?: boolean
  showFeedback?: boolean
  showRegenerate?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showShare?: boolean
  showBookmark?: boolean
  showPin?: boolean
  showSpeak?: boolean
  showDownload?: boolean
  showMore?: boolean
  variant?: 'default' | 'compact' | 'expanded'
  position?: 'inline' | 'floating'
  className?: string
}

export function MessageActionsBar({
  messageId,
  content,
  onCopy,
  onFeedback,
  onRegenerate,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
  onPin,
  onReport,
  onSpeak,
  onDownload,
  feedback,
  isBookmarked = false,
  isPinned = false,
  isEditable = true,
  isDeletable = true,
  showFeedback = true,
  showRegenerate = true,
  showEdit = false,
  showDelete = false,
  showShare = true,
  showBookmark = true,
  showPin = false,
  showSpeak = true,
  showDownload = false,
  showMore = true,
  variant = 'default',
  position = 'inline',
  className,
}: MessageActionsBarProps) {
  const [copied, setCopied] = React.useState(false)
  const [localFeedback, setLocalFeedback] = React.useState<FeedbackType>(
    feedback || null
  )
  const [localBookmarked, setLocalBookmarked] = React.useState(isBookmarked)
  const [localPinned, setLocalPinned] = React.useState(isPinned)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  const handleFeedback = (type: FeedbackType) => {
    const newFeedback = localFeedback === type ? null : type
    setLocalFeedback(newFeedback)
    onFeedback?.(newFeedback, messageId)
  }

  const handleBookmark = () => {
    setLocalBookmarked(!localBookmarked)
    onBookmark?.(messageId)
  }

  const handlePin = () => {
    setLocalPinned(!localPinned)
    onPin?.(messageId)
  }

  const ActionButton = ({
    icon,
    label,
    onClick,
    active = false,
    activeIcon,
    disabled = false,
  }: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
    active?: boolean
    activeIcon?: React.ReactNode
    disabled?: boolean
  }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 w-8',
              variant === 'compact' && 'h-7 w-7',
              active && 'text-primary'
            )}
          >
            {active && activeIcon ? activeIcon : icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const compactClass =
    variant === 'compact'
      ? '[&_svg]:h-3.5 [&_svg]:w-3.5'
      : '[&_svg]:h-4 [&_svg]:w-4'

  return (
    <div
      className={cn(
        'flex items-center gap-0.5',
        position === 'floating' &&
          'absolute bottom-0 left-0 right-0 translate-y-full pt-1 opacity-0 group-hover:opacity-100 transition-opacity',
        compactClass,
        className
      )}
    >
      {/* Copy */}
      <ActionButton
        icon={<Copy />}
        activeIcon={<Check />}
        label={copied ? 'Copied!' : 'Copy'}
        onClick={handleCopy}
        active={copied}
      />

      {/* Feedback */}
      {showFeedback && (
        <>
          <ActionButton
            icon={<ThumbsUp />}
            label="Good response"
            onClick={() => handleFeedback('positive')}
            active={localFeedback === 'positive'}
          />
          <ActionButton
            icon={<ThumbsDown />}
            label="Bad response"
            onClick={() => handleFeedback('negative')}
            active={localFeedback === 'negative'}
          />
        </>
      )}

      {/* Regenerate */}
      {showRegenerate && (
        <ActionButton
          icon={<RefreshCw />}
          label="Regenerate"
          onClick={() => onRegenerate?.(messageId)}
        />
      )}

      {/* Speak */}
      {showSpeak && (
        <ActionButton
          icon={<Volume2 />}
          label="Read aloud"
          onClick={() => onSpeak?.(content)}
        />
      )}

      {/* Bookmark */}
      {showBookmark && (
        <ActionButton
          icon={<Bookmark />}
          activeIcon={<BookmarkCheck />}
          label={localBookmarked ? 'Remove bookmark' : 'Bookmark'}
          onClick={handleBookmark}
          active={localBookmarked}
        />
      )}

      {/* Pin */}
      {showPin && (
        <ActionButton
          icon={<Pin />}
          activeIcon={<PinOff />}
          label={localPinned ? 'Unpin' : 'Pin'}
          onClick={handlePin}
          active={localPinned}
        />
      )}

      {/* Edit */}
      {showEdit && isEditable && (
        <ActionButton
          icon={<Edit3 />}
          label="Edit"
          onClick={() => onEdit?.(messageId)}
        />
      )}

      {/* Share */}
      {showShare && (
        <ActionButton
          icon={<Share2 />}
          label="Share"
          onClick={() => onShare?.(messageId)}
        />
      )}

      {/* More dropdown */}
      {showMore && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', variant === 'compact' && 'h-7 w-7')}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {showDownload && (
              <>
                <DropdownMenuItem
                  onClick={() => onDownload?.(messageId, 'txt')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download as TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload?.(messageId, 'md')}>
                  <Code className="h-4 w-4 mr-2" />
                  Download as Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {isDeletable && (
              <DropdownMenuItem
                onClick={() => onDelete?.(messageId)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onReport?.(messageId)}>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// =============================================================================
// BRANCH NAVIGATION - Navigate between message branches
// =============================================================================

interface BranchNavigationProps {
  currentBranch: number
  totalBranches: number
  onNavigate: (direction: 'prev' | 'next') => void
  size?: 'sm' | 'md'
  className?: string
}

export function BranchNavigation({
  currentBranch,
  totalBranches,
  onNavigate,
  size = 'sm',
  className,
}: BranchNavigationProps) {
  if (totalBranches <= 1) return null

  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={() => onNavigate('prev')}
        disabled={currentBranch <= 1}
      >
        <ChevronLeft className={iconSize} />
      </Button>
      <span className="text-xs text-muted-foreground tabular-nums min-w-[40px] text-center">
        {currentBranch} / {totalBranches}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={() => onNavigate('next')}
        disabled={currentBranch >= totalBranches}
      >
        <ChevronRight className={iconSize} />
      </Button>
    </div>
  )
}

// =============================================================================
// QUICK ACTIONS - Floating quick action buttons
// =============================================================================

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'destructive'
}

interface QuickActionsProps {
  actions: QuickAction[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export function QuickActions({
  actions,
  position = 'bottom-right',
  className,
}: QuickActionsProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }

  return (
    <div
      className={cn(
        'fixed flex flex-col gap-2 z-50',
        positionClasses[position],
        className
      )}
    >
      {actions.map((action) => (
        <TooltipProvider key={action.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={
                  action.variant === 'primary'
                    ? 'default'
                    : action.variant === 'destructive'
                      ? 'destructive'
                      : 'secondary'
                }
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={action.onClick}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{action.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

// =============================================================================
// INLINE ACTIONS - Inline text actions (highlight and action)
// =============================================================================

interface InlineActionsProps {
  selectedText: string
  position: { x: number; y: number }
  onAction: (action: string, text: string) => void
  onClose: () => void
  actions?: { id: string; label: string; icon?: React.ReactNode }[]
  className?: string
}

export function InlineActions({
  selectedText,
  position,
  onAction,
  onClose,
  actions = [
    { id: 'copy', label: 'Copy', icon: <Copy className="h-3.5 w-3.5" /> },
    {
      id: 'explain',
      label: 'Explain',
      icon: <FileText className="h-3.5 w-3.5" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <RefreshCw className="h-3.5 w-3.5" />,
    },
  ],
  className,
}: InlineActionsProps) {
  const [copied, setCopied] = React.useState(false)

  const handleAction = async (actionId: string) => {
    if (actionId === 'copy') {
      await navigator.clipboard.writeText(selectedText)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1000)
    } else {
      onAction(actionId, selectedText)
      onClose()
    }
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex items-center gap-1 p-1 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => handleAction(action.id)}
        >
          {action.id === 'copy' && copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              Copied
            </>
          ) : (
            <>
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </>
          )}
        </Button>
      ))}
    </div>
  )
}

// =============================================================================
// CONTEXT ACTIONS - Right-click context menu for messages
// =============================================================================

interface ContextAction {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  destructive?: boolean
  disabled?: boolean
  separator?: boolean
}

interface ContextActionsProps {
  children: React.ReactNode
  actions: ContextAction[]
  onAction: (actionId: string) => void
}

export function ContextActions({
  children,
  actions,
  onAction,
}: ContextActionsProps) {
  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const handleClose = () => setPosition(null)

  React.useEffect(() => {
    const handleClick = () => handleClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    if (position) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [position])

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {position && (
        <div
          className="fixed z-50 min-w-[180px] p-1 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
          style={{ left: position.x, top: position.y }}
        >
          {actions.map((action, i) => (
            <React.Fragment key={action.id}>
              {action.separator && i > 0 && (
                <div className="h-px my-1 bg-border" />
              )}
              <button
                onClick={() => {
                  onAction(action.id)
                  handleClose()
                }}
                disabled={action.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors',
                  action.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'hover:bg-muted',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {action.icon && <span className="w-4">{action.icon}</span>}
                <span className="flex-1 text-left">{action.label}</span>
                {action.shortcut && (
                  <span className="text-xs text-muted-foreground">
                    {action.shortcut}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}
