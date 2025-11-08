import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border border-background shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] transition-all duration-150 ease-out',
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Enable hover scale effect */
  hoverable?: boolean
  /** Custom status badge content */
  statusBadge?: React.ReactNode
}

const Avatar = React.memo(
  React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
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
  ) {
    const [imageError, setImageError] = React.useState(false)

    const getFallbackText = () => {
      if (fallback) return fallback
      if (alt) {
        return alt
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
      return '?'
    }

    const statusColors = {
      online: 'bg-green-500 ring-green-400/30',
      offline: 'bg-gray-400 ring-gray-300/30',
      away: 'bg-yellow-500 ring-yellow-400/30',
      busy: 'bg-red-500 ring-red-400/30',
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
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, className }),
          hoverable &&
            'hover:scale-105 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] cursor-pointer hover:-translate-y-px'
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold select-none">
            {getFallbackText()}
          </div>
        )}

        {/* Status Indicator */}
        {status && !statusBadge && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full border-2 border-background shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-2',
              statusSizes[size || 'default'],
              statusColors[status]
            )}
          >
            {status === 'online' && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </span>
        )}

        {/* Custom Status Badge */}
        {statusBadge && (
          <span className="absolute -bottom-1 -right-1">{statusBadge}</span>
        )}
      </div>
    )
  })
)

Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }
