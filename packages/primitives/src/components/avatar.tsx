'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from './ui/avatar'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full ring-2 ring-background/80 shadow-xs transition-all duration-200 ease-out',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-20 w-20 text-xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface AvatarProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Enable hover scale effect */
  hoverable?: boolean
  /** Custom status badge content */
  statusBadge?: React.ReactNode
  children?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      src,
      alt,
      fallback,
      status,
      hoverable = false,
      statusBadge,
      ...props
    },
    ref
  ) => {
    const getFallbackText = () => {
      if (fallback && fallback.trim()) return fallback.trim()
      if (alt && alt.trim()) {
        const words = alt
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0)
        if (words.length > 0) {
          return words
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        }
      }
      return '?'
    }

    const statusColors = {
      online: 'bg-success ring-success/40',
      offline: 'bg-muted-foreground/60 ring-muted-foreground/30',
      away: 'bg-warning ring-warning/40',
      busy: 'bg-destructive ring-destructive/40',
    }

    const statusLabels = {
      online: 'Online',
      offline: 'Offline',
      away: 'Away',
      busy: 'Busy',
    }

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      default: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-3.5 w-3.5',
      '2xl': 'h-4 w-4',
    }

    return (
      <ShadcnAvatar
        ref={ref}
        className={cn(
          avatarVariants({ size }),
          hoverable &&
            'hover:scale-[1.02] hover:shadow-sm cursor-pointer hover:-translate-y-[1px]',
          className
        )}
        {...props}
      >
        {/* Always render AvatarImage when src is provided - Radix UI handles loading/error internally */}
        {src ? <AvatarImage src={src} alt={alt || 'Avatar'} /> : null}
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold select-none animate-in fade-in duration-200">
          {getFallbackText()}
        </AvatarFallback>

        {/* Status Indicator */}
        {status && !statusBadge && (
          <span
            role="status"
            aria-label={`Status: ${statusLabels[status]}`}
            data-status={status}
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-background/80',
              statusSizes[size || 'default'],
              statusColors[status]
            )}
          >
            {(status === 'online' || status === 'away') && (
              <span
                className={cn(
                  'absolute inset-0 rounded-full animate-ping opacity-60',
                  status === 'online' ? 'bg-success' : 'bg-warning'
                )}
              />
            )}
          </span>
        )}

        {/* Custom Status Badge */}
        {statusBadge && (
          <span className="absolute -bottom-1 -right-1">{statusBadge}</span>
        )}
      </ShadcnAvatar>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }
