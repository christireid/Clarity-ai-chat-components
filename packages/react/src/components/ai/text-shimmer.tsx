'use client'

/**
 * TextShimmer Component
 *
 * Animated shimmer effect for text placeholder loading states.
 * Inspired by Prompt-Kit's Text Shimmer pattern, adapted to Clarity's design system.
 *
 * Features:
 * - Animated shimmer gradient effect over placeholder lines
 * - Configurable width, number of lines, and animation speed
 * - Multiple variants (text, paragraph, heading, code)
 * - Full accessibility with aria-busy and role="status"
 * - Respects reduced motion preferences
 * - Consistent with Clarity styling patterns
 *
 * @example
 * ```tsx
 * // Basic usage - single line shimmer
 * <TextShimmer />
 *
 * // Multiple lines
 * <TextShimmer lines={3} />
 *
 * // Custom width
 * <TextShimmer width="200px" />
 *
 * // Paragraph variant with multiple lines
 * <TextShimmer variant="paragraph" lines={5} />
 *
 * // Heading variant (larger, bolder shimmer)
 * <TextShimmer variant="heading" />
 *
 * // Code block variant
 * <TextShimmer variant="code" lines={4} />
 *
 * // Custom speed
 * <TextShimmer speed="fast" />
 * <TextShimmer speed="slow" />
 *
 * // Custom line widths for more realistic appearance
 * <TextShimmer lines={3} lineWidths={['100%', '80%', '60%']} />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS as durations, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Visual variant of the text shimmer
 */
export type TextShimmerVariant = 'text' | 'paragraph' | 'heading' | 'code' | 'inline'

/**
 * Animation speed presets
 */
export type TextShimmerSpeed = 'slow' | 'normal' | 'fast'

/**
 * Size variant affecting line height and spacing
 */
export type TextShimmerSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props for the TextShimmer component
 */
export interface TextShimmerProps {
  /** Number of lines to display (default: 1) */
  lines?: number
  /** Custom width for the shimmer (CSS value, e.g., '200px', '100%', '15rem') */
  width?: string
  /** Visual variant (default: 'text') */
  variant?: TextShimmerVariant
  /** Animation speed (default: 'normal') */
  speed?: TextShimmerSpeed
  /** Size variant affecting line height (default: 'md') */
  size?: TextShimmerSize
  /** Custom line widths as array of percentages or CSS values (cycles through if fewer than lines) */
  lineWidths?: string[]
  /** Gap between lines (CSS value, default based on size) */
  lineGap?: string
  /** Border radius for lines (CSS value, default: '4px') */
  borderRadius?: string
  /** Custom CSS class for the container */
  className?: string
  /** Custom CSS class for individual lines */
  lineClassName?: string
  /** Accessible label for screen readers (default: 'Loading content') */
  'aria-label'?: string
  /** Whether shimmer is currently active (default: true) */
  active?: boolean
  /** Disable animations entirely */
  disableAnimations?: boolean
  /** Custom shimmer gradient colors */
  shimmerColors?: {
    base?: string
    highlight?: string
  }
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Speed configuration (animation duration in seconds)
 */
const SPEED_CONFIG: Record<TextShimmerSpeed, number> = {
  slow: 2.5,
  normal: 1.8,
  fast: 1.2,
}

/**
 * Size configuration
 */
const SIZE_CONFIG: Record<TextShimmerSize, { height: string; gap: string; fontSize: string }> = {
  sm: { height: 'h-3', gap: 'gap-1.5', fontSize: 'text-xs' },
  md: { height: 'h-4', gap: 'gap-2', fontSize: 'text-sm' },
  lg: { height: 'h-5', gap: 'gap-2.5', fontSize: 'text-base' },
  xl: { height: 'h-6', gap: 'gap-3', fontSize: 'text-lg' },
}

/**
 * Variant-specific configuration
 */
const VARIANT_CONFIG: Record<TextShimmerVariant, {
  defaultLines: number
  defaultSize: TextShimmerSize
  defaultWidth: string
  defaultLineWidths: string[]
  containerClass: string
}> = {
  text: {
    defaultLines: 1,
    defaultSize: 'md',
    defaultWidth: '100%',
    defaultLineWidths: ['100%'],
    containerClass: '',
  },
  inline: {
    defaultLines: 1,
    defaultSize: 'sm',
    defaultWidth: '8rem',
    defaultLineWidths: ['100%'],
    containerClass: 'inline-flex',
  },
  paragraph: {
    defaultLines: 4,
    defaultSize: 'md',
    defaultWidth: '100%',
    defaultLineWidths: ['100%', '95%', '90%', '70%'],
    containerClass: '',
  },
  heading: {
    defaultLines: 1,
    defaultSize: 'xl',
    defaultWidth: '60%',
    defaultLineWidths: ['100%'],
    containerClass: '',
  },
  code: {
    defaultLines: 3,
    defaultSize: 'sm',
    defaultWidth: '100%',
    defaultLineWidths: ['80%', '60%', '90%', '70%', '85%'],
    containerClass: 'font-mono bg-muted/30 rounded-lg p-3',
  },
}

/**
 * Default paragraph line widths for realistic appearance
 */
const DEFAULT_PARAGRAPH_LINE_WIDTHS = ['100%', '95%', '90%', '85%', '70%']

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get line width for a specific line index
 */
function getLineWidth(
  index: number,
  lines: number,
  lineWidths: string[] | undefined,
  variant: TextShimmerVariant
): string {
  const widths = lineWidths ?? VARIANT_CONFIG[variant].defaultLineWidths

  // For the last line, often make it shorter for realism
  if (index === lines - 1 && !lineWidths && lines > 1) {
    return widths[widths.length - 1] ?? '70%'
  }

  // Cycle through provided widths
  return widths[index % widths.length] ?? '100%'
}

/**
 * Validate and normalize line count
 */
function normalizeLineCount(lines: number | undefined, variant: TextShimmerVariant): number {
  if (lines === undefined) return VARIANT_CONFIG[variant].defaultLines
  if (!Number.isFinite(lines) || lines < 1) return 1
  return Math.min(Math.floor(lines), 20) // Cap at 20 lines for sanity
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Individual shimmer line with animated gradient
 */
interface ShimmerLineProps {
  width: string
  height: string
  borderRadius: string
  speed: number
  prefersReducedMotion: boolean
  className?: string
  shimmerColors?: {
    base?: string
    highlight?: string
  }
  index: number
}

const ShimmerLine: React.FC<ShimmerLineProps> = ({
  width,
  height,
  borderRadius,
  speed,
  prefersReducedMotion,
  className,
  shimmerColors,
  index,
}) => {
  // Shimmer gradient colors (using CSS variables for theme compatibility)
  const baseColor = shimmerColors?.base ?? 'hsl(var(--muted) / 0.4)'
  const highlightColor = shimmerColors?.highlight ?? 'hsl(var(--muted) / 0.7)'

  // Stagger animation delay based on line index
  const staggerDelay = index * 0.1

  if (prefersReducedMotion) {
    // Reduced motion: subtle opacity pulse only
    return (
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: staggerDelay,
        }}
        className={cn(height, 'rounded', className)}
        style={{
          width,
          borderRadius,
          backgroundColor: baseColor,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', height, className)}
      style={{ width, borderRadius }}
      aria-hidden="true"
    >
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: baseColor }}
      />

      {/* Animated shimmer gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: EASING_FRAMER.smooth,
          delay: staggerDelay,
        }}
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            ${highlightColor} 50%,
            transparent 100%
          )`,
        }}
      />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * TextShimmer - Animated text placeholder loading indicator
 *
 * A versatile shimmer component for displaying loading placeholders
 * that mimic the appearance of text content. Perfect for skeleton
 * loading states in chat interfaces, content feeds, and dashboards.
 *
 * Accessibility:
 * - Uses role="status" to announce loading state to screen readers
 * - Includes aria-busy="true" during active shimmer
 * - Provides customizable aria-label for context
 * - Respects prefers-reduced-motion for users with vestibular disorders
 */
export function TextShimmer({
  lines,
  width,
  variant = 'text',
  speed = 'normal',
  size,
  lineWidths,
  lineGap,
  borderRadius = '4px',
  className,
  lineClassName,
  'aria-label': ariaLabel = 'Loading content',
  active = true,
  disableAnimations = false,
  shimmerColors,
}: TextShimmerProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations || !active

  // Get configuration based on variant
  const variantConfig = VARIANT_CONFIG[variant]
  const effectiveSize = size ?? variantConfig.defaultSize
  const sizeConfig = SIZE_CONFIG[effectiveSize]

  // Normalize values
  const effectiveLines = normalizeLineCount(lines, variant)
  const effectiveWidth = width ?? variantConfig.defaultWidth
  const effectiveSpeed = SPEED_CONFIG[speed]
  const effectiveGap = lineGap ?? sizeConfig.gap

  // Generate array of line indices
  const lineIndices = React.useMemo(
    () => Array.from({ length: effectiveLines }, (_, i) => i),
    [effectiveLines]
  )

  // If not active, render static placeholder
  if (!active) {
    return (
      <div
        className={cn('flex flex-col', effectiveGap, variantConfig.containerClass, className)}
        style={{ width: effectiveWidth }}
        role="status"
        aria-label={ariaLabel}
      >
        {lineIndices.map((index) => (
          <div
            key={index}
            className={cn(sizeConfig.height, 'rounded bg-muted/40', lineClassName)}
            style={{
              width: getLineWidth(index, effectiveLines, lineWidths, variant),
              borderRadius,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-col', effectiveGap, variantConfig.containerClass, className)}
      style={{ width: effectiveWidth }}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {lineIndices.map((index) => (
        <ShimmerLine
          key={index}
          width={getLineWidth(index, effectiveLines, lineWidths, variant)}
          height={sizeConfig.height}
          borderRadius={borderRadius}
          speed={effectiveSpeed}
          prefersReducedMotion={prefersReducedMotion}
          className={lineClassName}
          shimmerColors={shimmerColors}
          index={index}
        />
      ))}
    </div>
  )
}

TextShimmer.displayName = 'TextShimmer'

// =============================================================================
// CONVENIENCE VARIANTS
// =============================================================================

/**
 * ParagraphShimmer - Pre-configured for paragraph-like content
 *
 * @example
 * ```tsx
 * <ParagraphShimmer />
 * <ParagraphShimmer lines={6} />
 * ```
 */
export function ParagraphShimmer(props: Omit<TextShimmerProps, 'variant'>) {
  return <TextShimmer {...props} variant="paragraph" />
}

ParagraphShimmer.displayName = 'ParagraphShimmer'

/**
 * HeadingShimmer - Pre-configured for heading-like content
 *
 * @example
 * ```tsx
 * <HeadingShimmer />
 * <HeadingShimmer width="40%" />
 * ```
 */
export function HeadingShimmer(props: Omit<TextShimmerProps, 'variant'>) {
  return <TextShimmer {...props} variant="heading" />
}

HeadingShimmer.displayName = 'HeadingShimmer'

/**
 * CodeShimmer - Pre-configured for code block-like content
 *
 * @example
 * ```tsx
 * <CodeShimmer />
 * <CodeShimmer lines={6} />
 * ```
 */
export function CodeShimmer(props: Omit<TextShimmerProps, 'variant'>) {
  return <TextShimmer {...props} variant="code" />
}

CodeShimmer.displayName = 'CodeShimmer'

/**
 * InlineShimmer - Pre-configured for inline text placeholders
 *
 * @example
 * ```tsx
 * <p>Loading <InlineShimmer width="60px" /> data...</p>
 * ```
 */
export function InlineShimmer(props: Omit<TextShimmerProps, 'variant'>) {
  return <TextShimmer {...props} variant="inline" />
}

InlineShimmer.displayName = 'InlineShimmer'

// =============================================================================
// COMPOUND COMPONENT: TextShimmerGroup
// =============================================================================

/**
 * Props for TextShimmerGroup
 */
export interface TextShimmerGroupProps {
  /** Children shimmer configurations */
  children?: React.ReactNode
  /** Shared speed for all shimmers */
  speed?: TextShimmerSpeed
  /** Shared size for all shimmers */
  size?: TextShimmerSize
  /** Gap between shimmer groups */
  gap?: string
  /** Container className */
  className?: string
  /** Whether all shimmers are active */
  active?: boolean
  /** Disable all animations */
  disableAnimations?: boolean
}

/**
 * TextShimmerGroup - Container for multiple shimmer elements
 *
 * Useful for creating complex skeleton layouts with consistent styling.
 *
 * @example
 * ```tsx
 * <TextShimmerGroup>
 *   <HeadingShimmer />
 *   <ParagraphShimmer lines={3} />
 *   <TextShimmer width="50%" />
 * </TextShimmerGroup>
 * ```
 */
export function TextShimmerGroup({
  children,
  speed = 'normal',
  size = 'md',
  gap = 'gap-4',
  className,
  active = true,
  disableAnimations = false,
}: TextShimmerGroupProps) {
  // Clone children and pass shared props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<TextShimmerProps>(child)) {
      return React.cloneElement(child, {
        speed: child.props.speed ?? speed,
        size: child.props.size ?? size,
        active: child.props.active ?? active,
        disableAnimations: child.props.disableAnimations ?? disableAnimations,
      })
    }
    return child
  })

  return (
    <div className={cn('flex flex-col', gap, className)}>
      {enhancedChildren}
    </div>
  )
}

TextShimmerGroup.displayName = 'TextShimmerGroup'

// =============================================================================
// HOOK: useTextShimmer
// =============================================================================

/**
 * Options for useTextShimmer hook
 */
export interface UseTextShimmerOptions {
  /** Initial active state */
  initialActive?: boolean
  /** Auto-deactivate after duration (ms) */
  autoDeactivateAfter?: number
  /** Callback when shimmer deactivates */
  onDeactivate?: () => void
}

/**
 * Return type for useTextShimmer hook
 */
export interface UseTextShimmerReturn {
  /** Whether shimmer is active */
  active: boolean
  /** Activate shimmer */
  activate: () => void
  /** Deactivate shimmer */
  deactivate: () => void
  /** Toggle shimmer state */
  toggle: () => void
  /** Props to spread onto TextShimmer */
  shimmerProps: { active: boolean }
}

/**
 * Hook for managing TextShimmer state
 *
 * Provides convenient state management for shimmer loading states.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const shimmer = useTextShimmer({ autoDeactivateAfter: 3000 })
 *
 *   useEffect(() => {
 *     if (isLoading) {
 *       shimmer.activate()
 *     } else {
 *       shimmer.deactivate()
 *     }
 *   }, [isLoading])
 *
 *   return <TextShimmer {...shimmer.shimmerProps} lines={3} />
 * }
 * ```
 */
export function useTextShimmer({
  initialActive = true,
  autoDeactivateAfter,
  onDeactivate,
}: UseTextShimmerOptions = {}): UseTextShimmerReturn {
  const [active, setActive] = React.useState(initialActive)

  const activate = React.useCallback(() => setActive(true), [])
  const deactivate = React.useCallback(() => {
    setActive(false)
    onDeactivate?.()
  }, [onDeactivate])
  const toggle = React.useCallback(() => setActive((prev) => !prev), [])

  // Auto-deactivate timer
  React.useEffect(() => {
    if (autoDeactivateAfter && active) {
      const timer = setTimeout(() => {
        deactivate()
      }, autoDeactivateAfter)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [autoDeactivateAfter, active, deactivate])

  return {
    active,
    activate,
    deactivate,
    toggle,
    shimmerProps: { active },
  }
}
