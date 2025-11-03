import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full ring-1 ring-border/70 shadow-[0_6px_16px_rgba(15,23,42,0.12)] bg-[hsl(var(--surface-muted))] transition-shadow duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
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
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, status, ...props }, ref) => {
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
      online: 'bg-success shadow-[0_2px_6px_rgba(34,197,94,0.4)]',
      offline: 'bg-muted-foreground/40 shadow-[0_2px_6px_rgba(148,163,184,0.35)]',
      away: 'bg-warning shadow-[0_2px_6px_rgba(247,170,0,0.4)]',
      busy: 'bg-destructive shadow-[0_2px_6px_rgba(255,77,79,0.45)]',
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
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
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
            {getFallbackText()}
          </div>
        )}
        
        {status && (
          <span
            className={cn(
              'absolute bottom-1 right-1 block h-3.5 w-3.5 rounded-full border-[3px] border-[hsl(var(--surface-elevated))] shadow-[0_0_0_2px_rgba(15,23,42,0.1)]',
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }
