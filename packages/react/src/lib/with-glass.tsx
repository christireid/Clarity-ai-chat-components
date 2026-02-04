/**
 * Glass Enhancement Higher-Order Component
 *
 * Automatically applies glassmorphism styles to components when enabled.
 * Integrates with UIEnhancementsProvider and glassVariants system.
 *
 * @example
 * ```tsx
 * export const GlassCard = withGlass(Card, {
 *   intensity: 'medium',
 *   gradient: 'blue',
 *   hover: 'lift'
 * })
 * ```
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  glassVariants,
  type GlassVariants,
} from '@clarity-chat/primitives/glass-variants'
import { useGlassmorphism } from '../contexts/ui-enhancements'

export interface WithGlassOptions extends GlassVariants {
  /**
   * Whether to always apply glass styles regardless of context
   * @default false
   */
  forceGlass?: boolean

  /**
   * Custom className to merge with glass styles
   */
  className?: string
}

export interface GlassComponentProps {
  /**
   * Override glass variants for this specific instance
   */
  glassVariants?: Partial<GlassVariants>

  /**
   * Disable glass effects for this instance
   */
  disableGlass?: boolean
}

/**
 * Higher-order component that adds glassmorphism support
 *
 * Automatically applies glass styles when:
 * 1. UIEnhancementsProvider has glassmorphism enabled, OR
 * 2. forceGlass option is true
 *
 * @param Component - Component to enhance with glass effects
 * @param defaultOptions - Default glass variant options
 */
export function withGlass<P extends object>(
  Component: React.ComponentType<P>,
  defaultOptions: WithGlassOptions = {}
): React.FC<P & GlassComponentProps> {
  const {
    forceGlass = false,
    className: defaultClassName,
    ...defaultGlassVariants
  } = defaultOptions

  const GlassEnhancedComponent = React.forwardRef<unknown, P & GlassComponentProps>(
    ({ glassVariants: instanceVariants, disableGlass, className, ...props }, ref) => {
      const glassmorphismEnabled = useGlassmorphism()
      const shouldApplyGlass = (forceGlass || glassmorphismEnabled) && !disableGlass

      const glassClassName = shouldApplyGlass
        ? glassVariants({
            ...defaultGlassVariants,
            ...instanceVariants,
          })
        : ''

      return (
        <Component
          ref={ref}
          className={cn(glassClassName, defaultClassName, className)}
          {...(props as P)}
        />
      )
    }
  )

  GlassEnhancedComponent.displayName = `withGlass(${Component.displayName || Component.name || 'Component'})`

  return GlassEnhancedComponent as React.FC<P & GlassComponentProps>
}

/**
 * Hook to get glass variant classes based on current UI enhancements
 *
 * @param options - Glass variant options
 * @returns className string with glass styles if enabled
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const glassClass = useGlassVariant({ intensity: 'medium', gradient: 'blue' })
 *   return <div className={cn('my-component', glassClass)}>...</div>
 * }
 * ```
 */
export function useGlassVariant(options: GlassVariants = {}): string {
  const glassmorphismEnabled = useGlassmorphism()

  return React.useMemo(() => {
    if (!glassmorphismEnabled) return ''
    return glassVariants(options)
  }, [glassmorphismEnabled, options])
}

/**
 * Component wrapper that conditionally applies glass styles
 *
 * @example
 * ```tsx
 * <GlassWrapper intensity="medium" gradient="purple">
 *   <div>Content with glass background</div>
 * </GlassWrapper>
 * ```
 */
export interface GlassWrapperProps extends GlassVariants {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  forceGlass?: boolean
}

export const GlassWrapper: React.FC<GlassWrapperProps> = ({
  children,
  className,
  as: Component = 'div',
  forceGlass = false,
  ...glassOptions
}) => {
  const glassmorphismEnabled = useGlassmorphism()
  const shouldApplyGlass = forceGlass || glassmorphismEnabled

  const glassClassName = shouldApplyGlass ? glassVariants(glassOptions) : ''

  return (
    <Component className={cn(glassClassName, className)}>
      {children}
    </Component>
  )
}

GlassWrapper.displayName = 'GlassWrapper'
