'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Loader2,
  Check,
  Copy,
  Download,
  Share2,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Wand2,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Loading Button
export interface LoadingButtonProps extends React.ComponentProps<
  typeof Button
> {
  loading?: boolean
  loadingText?: string
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={disabled || loading}>
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}

// Copy Button
export interface CopyButtonProps {
  text: string
  onCopy?: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function CopyButton({
  text,
  onCopy,
  variant = 'ghost',
  size = 'icon',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            className={className}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Copy'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Feedback Buttons (Thumbs Up/Down)
export interface FeedbackButtonsProps {
  onLike?: () => void
  onDislike?: () => void
  liked?: boolean
  disliked?: boolean
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function FeedbackButtons({
  onLike,
  onDislike,
  liked = false,
  disliked = false,
  size = 'sm',
  className,
}: FeedbackButtonsProps) {
  const iconSize =
    size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const buttonSize =
    size === 'lg' ? 'h-9 w-9' : size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className={cn(
                buttonSize,
                liked && 'text-green-500 bg-green-500/10'
              )}
            >
              <ThumbsUp className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Good response</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDislike}
              className={cn(
                buttonSize,
                disliked && 'text-red-500 bg-red-500/10'
              )}
            >
              <ThumbsDown className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bad response</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Action Button Group
export interface ActionButton {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
}

export interface ActionButtonGroupProps {
  actions: ActionButton[]
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabels?: boolean
  className?: string
}

export function ActionButtonGroup({
  actions,
  size = 'sm',
  showLabels = false,
  className,
}: ActionButtonGroupProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {actions.map((action) => (
        <TooltipProvider key={action.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={action.variant || 'ghost'}
                size={showLabels ? size : 'icon'}
                onClick={action.onClick}
                disabled={action.disabled}
                className={size === 'sm' ? 'h-8' : undefined}
              >
                {action.icon}
                {showLabels && <span className="ml-2">{action.label}</span>}
              </Button>
            </TooltipTrigger>
            {!showLabels && (
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

// Send Button (for chat)
export interface SendButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function SendButton({
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'icon',
  className,
}: SendButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  )
}

// Voice Button
export interface VoiceButtonProps {
  isRecording: boolean
  onToggle: () => void
  disabled?: boolean
  className?: string
}

export function VoiceButton({
  isRecording,
  onToggle,
  disabled = false,
  className,
}: VoiceButtonProps) {
  return (
    <Button
      variant={isRecording ? 'destructive' : 'outline'}
      size="icon"
      onClick={onToggle}
      disabled={disabled}
      className={cn(isRecording && 'animate-pulse', className)}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  )
}

// Play/Pause Button
export interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function PlayPauseButton({
  isPlaying,
  onToggle,
  disabled = false,
  size = 'icon',
  className,
}: PlayPauseButtonProps) {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onToggle}
      disabled={disabled}
      className={className}
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  )
}

// Generate Button (AI)
export interface GenerateButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function GenerateButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Generate',
  variant = 'default',
  className,
}: GenerateButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('gap-2', className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {loading ? 'Generating...' : label}
    </Button>
  )
}

// Regenerate Button
export interface RegenerateButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function RegenerateButton({
  onClick,
  loading = false,
  disabled = false,
  className,
}: RegenerateButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled || loading}
            className={className}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Regenerate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Share Button
export interface ShareButtonProps {
  onShare: () => void
  disabled?: boolean
  className?: string
}

export function ShareButton({
  onShare,
  disabled = false,
  className,
}: ShareButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            disabled={disabled}
            className={className}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Download Button
export interface DownloadButtonComponentProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function DownloadButtonComponent({
  onClick,
  loading = false,
  disabled = false,
  className,
}: DownloadButtonComponentProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled || loading}
            className={className}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// External Link Button
export interface ExternalLinkButtonProps {
  href: string
  label?: string
  showIcon?: boolean
  className?: string
}

export function ExternalLinkButton({
  href,
  label,
  showIcon = true,
  className,
}: ExternalLinkButtonProps) {
  return (
    <Button
      variant="ghost"
      size={label ? 'sm' : 'icon'}
      asChild
      className={className}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label && <span>{label}</span>}
        {showIcon && (
          <ExternalLink className={cn('h-4 w-4', label && 'ml-2')} />
        )}
      </a>
    </Button>
  )
}

// Improve Button (AI enhancement)
export interface ImproveButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function ImproveButton({
  onClick,
  loading = false,
  disabled = false,
  className,
}: ImproveButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('gap-2', className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="h-4 w-4" />
      )}
      Improve
    </Button>
  )
}

// More Actions Button
export interface MoreActionsButtonProps {
  children: React.ReactNode
  className?: string
}

export function MoreActionsButton({
  children,
  className,
}: MoreActionsButtonProps) {
  return (
    <Button variant="ghost" size="icon" className={className}>
      <MoreHorizontal className="h-4 w-4" />
      {children}
    </Button>
  )
}
