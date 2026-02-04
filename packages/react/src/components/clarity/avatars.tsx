'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Bot, User, Sparkles, Zap, Code, Globe, Brain, Cpu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Types
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-muted-foreground',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
}

// User avatar with status
interface UserAvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  status?: AvatarStatus
  showTooltip?: boolean
  className?: string
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  status,
  showTooltip = false,
  className,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const avatar = (
    <div className="relative inline-block">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src || '/placeholder.svg'} alt={name} />
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            statusColors[status],
            size === 'xs' && 'h-2 w-2',
            size === 'sm' && 'h-2.5 w-2.5',
            size === 'md' && 'h-3 w-3',
            size === 'lg' && 'h-3.5 w-3.5',
            size === 'xl' && 'h-4 w-4'
          )}
        />
      )}
    </div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatar}</TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{name}</p>
            {status && (
              <p className="text-xs capitalize text-muted-foreground">
                {status}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return avatar
}

// AI/Model avatar
export type ModelType =
  | 'gpt'
  | 'claude'
  | 'gemini'
  | 'llama'
  | 'mistral'
  | 'custom'

const modelStyles: Record<ModelType, { bg: string; icon: React.ReactNode }> = {
  gpt: { bg: 'bg-emerald-500', icon: <Sparkles className="text-white" /> },
  claude: { bg: 'bg-amber-500', icon: <Brain className="text-white" /> },
  gemini: { bg: 'bg-blue-500', icon: <Globe className="text-white" /> },
  llama: { bg: 'bg-purple-500', icon: <Cpu className="text-white" /> },
  mistral: { bg: 'bg-orange-500', icon: <Zap className="text-white" /> },
  custom: { bg: 'bg-muted', icon: <Bot className="text-foreground" /> },
}

interface ModelAvatarProps {
  model?: ModelType
  name?: string
  size?: AvatarSize
  className?: string
}

export function ModelAvatar({
  model = 'custom',
  name,
  size = 'md',
  className,
}: ModelAvatarProps) {
  const style = modelStyles[model]
  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'rounded-full flex items-center justify-center',
              style.bg,
              sizeClasses[size],
              className
            )}
          >
            {React.cloneElement(style.icon as React.ReactElement, {
              className: iconSizes[size],
            })}
          </div>
        </TooltipTrigger>
        {name && (
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Avatar group/stack
interface AvatarGroupProps {
  avatars: Array<{
    src?: string
    name: string
    status?: AvatarStatus
  }>
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const safeAvatars = avatars || []
  const visible = safeAvatars.slice(0, max)
  const remaining = safeAvatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, index) => (
        <UserAvatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          status={avatar.status}
          size={size}
          showTooltip
          className="ring-2 ring-background"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

// Message sender display
interface SenderDisplayProps {
  name: string
  avatar?: string
  role?: 'user' | 'assistant' | 'system' | 'tool'
  model?: ModelType
  timestamp?: Date
  size?: AvatarSize
  className?: string
}

export function SenderDisplay({
  name,
  avatar,
  role = 'user',
  model,
  timestamp,
  size = 'sm',
  className,
}: SenderDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {role === 'assistant' || role === 'system' ? (
        <ModelAvatar model={model} name={name} size={size} />
      ) : (
        <UserAvatar src={avatar} name={name} size={size} />
      )}
      <div className="flex flex-col">
        <span className="font-medium text-sm leading-tight">{name}</span>
        {timestamp && (
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}

// Participant badge
interface ParticipantBadgeProps {
  name: string
  avatar?: string
  role?: string
  onRemove?: () => void
  className?: string
}

export function ParticipantBadge({
  name,
  avatar,
  role,
  onRemove,
  className,
}: ParticipantBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-sm',
        className
      )}
    >
      <UserAvatar src={avatar} name={name} size="xs" />
      <span className="font-medium">{name}</span>
      {role && <span className="text-xs text-muted-foreground">({role})</span>}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      )}
    </div>
  )
}

// Typing indicator avatar
interface TypingAvatarProps {
  name?: string
  model?: ModelType
  size?: AvatarSize
  className?: string
}

export function TypingAvatar({
  name,
  model = 'custom',
  size = 'sm',
  className,
}: TypingAvatarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <ModelAvatar model={model} name={name} size={size} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
        </span>
      </div>
      {name && (
        <span className="text-sm text-muted-foreground">
          {name} is typing...
        </span>
      )}
    </div>
  )
}
