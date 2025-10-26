/**
 * Interactive Card Component
 * 
 * Enhanced card component with hover states, focus rings, and visual transitions.
 * Demonstrates best practices for interactive elements.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { INTERACTION_VARIANTS, ANIMATION_DURATION, ANIMATION_EASING } from '../animations'

export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether card is clickable */
  interactive?: boolean
  /** Whether card is selected */
  selected?: boolean
  /** Whether card is disabled */
  disabled?: boolean
  /** Hover effect intensity */
  hoverIntensity?: 'none' | 'subtle' | 'medium' | 'strong'
  /** Show focus ring */
  showFocusRing?: boolean
  /** Show ripple effect on click */
  showRipple?: boolean
  /** Callback when card is clicked */
  onCardClick?: () => void
  /** Children */
  children: React.ReactNode
}

/**
 * Card with enhanced interactivity
 */
export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  (
    {
      interactive = false,
      selected = false,
      disabled = false,
      hoverIntensity = 'medium',
      showFocusRing = true,
      showRipple = false,
      onCardClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return

      if (showRipple) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples((prev) => [...prev, { x, y, id }])
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }

      onCardClick?.()
    }

    const hoverVariants = {
      none: {},
      subtle: { y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
      medium: { y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
      strong: { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    }

    const Component = interactive || onCardClick ? motion.div : motion.div

    return (
      <Component
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg border bg-card transition-colors',
          interactive && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          selected && 'ring-2 ring-primary ring-offset-2',
          showFocusRing && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        tabIndex={interactive && !disabled ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        aria-disabled={disabled}
        aria-pressed={selected}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (interactive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onCardClick?.()
          }
        }}
        animate={
          isHovered && !disabled && interactive
            ? hoverVariants[hoverIntensity]
            : {}
        }
        transition={{
          duration: ANIMATION_DURATION.fast / 1000,
          ease: ANIMATION_EASING.out,
        }}
        {...props}
      >
        {/* Ripple effects */}
        {showRipple && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-primary/20"
                style={{ left: ripple.x, top: ripple.y }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        {children}

        {/* Selected indicator */}
        {selected && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left"
          />
        )}
      </Component>
    )
  }
)

InteractiveCard.displayName = 'InteractiveCard'

/**
 * Interactive button with enhanced states
 */
export interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'destructive' | 'ghost'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  loading?: boolean
  /** Icon before text */
  icon?: React.ReactNode
  /** Icon after text */
  iconRight?: React.ReactNode
  /** Children */
  children?: React.ReactNode
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      success: 'bg-success text-success-foreground hover:bg-success/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    }

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? INTERACTION_VARIANTS.button.hover : {}}
        whileTap={!disabled && !loading ? INTERACTION_VARIANTS.button.tap : {}}
        transition={INTERACTION_VARIANTS.button.transition}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {!loading && icon}
        {children}
        {!loading && iconRight}
      </motion.button>
    )
  }
)

InteractiveButton.displayName = 'InteractiveButton'

/**
 * Interactive list item
 */
export interface InteractiveListItemProps {
  /** Whether item is selected */
  selected?: boolean
  /** Whether item is disabled */
  disabled?: boolean
  /** Icon */
  icon?: React.ReactNode
  /** Title */
  title: string
  /** Description */
  description?: string
  /** Badge */
  badge?: React.ReactNode
  /** onClick handler */
  onClick?: () => void
  /** Additional className */
  className?: string
}

export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  selected = false,
  disabled = false,
  icon,
  title,
  description,
  badge,
  onClick,
  className,
}) => {
  return (
    <motion.div
      whileHover={!disabled ? { x: 4, backgroundColor: 'hsl(var(--accent) / 0.5)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'bg-accent',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      tabIndex={!disabled ? 0 : undefined}
      role="button"
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {icon && (
        <div className="flex-shrink-0 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{title}</span>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"
        />
      )}
    </motion.div>
  )
}
