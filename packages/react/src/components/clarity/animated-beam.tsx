'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// TYPES
// ============================================================================

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>
  fromRef: React.RefObject<HTMLElement | null>
  toRef: React.RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  duration?: number
  delay?: number
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  particleSize?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  className?: string
}

export interface AnimatedBeamMultipleProps {
  containerRef: React.RefObject<HTMLElement | null>
  fromRefs: React.RefObject<HTMLElement | null>[]
  toRef: React.RefObject<HTMLElement | null>
  curvature?: number
  duration?: number
  pathColor?: string
  gradientStartColor?: string
  gradientStopColor?: string
  className?: string
}

// ============================================================================
// ANIMATED BEAM
// ============================================================================

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 2,
  delay = 0,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  particleSize = 3,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  className,
}: AnimatedBeamProps) {
  const id = React.useId()
  const [pathD, setPathD] = React.useState('')
  const [svgDimensions, setSvgDimensions] = React.useState({
    width: 0,
    height: 0,
  })

  const gradientId = `gradient-${id}`
  const filterId = `glow-${id}`

  React.useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const fromRect = fromRef.current.getBoundingClientRect()
      const toRect = toRef.current.getBoundingClientRect()

      const svgWidth = containerRect.width
      const svgHeight = containerRect.height
      setSvgDimensions({ width: svgWidth, height: svgHeight })

      const startX =
        fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset
      const startY =
        fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset
      const endX =
        toRect.left - containerRect.left + toRect.width / 2 + endXOffset
      const endY =
        toRect.top - containerRect.top + toRect.height / 2 + endYOffset

      const controlX = (startX + endX) / 2
      const controlY = (startY + endY) / 2 + curvature

      const path = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
      setPathD(path)
    }

    updatePath()

    const resizeObserver = new ResizeObserver(updatePath)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  return (
    <svg
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      width={svgDimensions.width}
      height={svgDimensions.height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background path */}
      <path
        d={pathD}
        fill="none"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {/* Animated gradient path */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
        style={{
          strokeDasharray: '20 80',
          strokeDashoffset: 0,
          animation: `beam-dash ${duration}s linear infinite ${delay}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      />

      {/* Animated particle */}
      <circle
        r={particleSize}
        fill={gradientStartColor}
        filter={`url(#${filterId})`}
      >
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
          keyPoints={reverse ? '1;0' : '0;1'}
          keyTimes="0;1"
          calcMode="linear"
        >
          <mpath href={`#${id}-path`} />
        </animateMotion>
      </circle>

      {/* Hidden path for animateMotion */}
      <path id={`${id}-path`} d={pathD} fill="none" stroke="none" />

      <style>
        {`
          @keyframes beam-dash {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </svg>
  )
}

// ============================================================================
// ANIMATED BEAM MULTIPLE - Multiple beams to one target
// ============================================================================

export function AnimatedBeamMultiple({
  containerRef,
  fromRefs,
  toRef,
  curvature = 0,
  duration = 2,
  pathColor = 'gray',
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  className,
}: AnimatedBeamMultipleProps) {
  return (
    <>
      {fromRefs.map((fromRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          curvature={curvature + (index - Math.floor(fromRefs.length / 2)) * 50}
          duration={duration}
          delay={index * 0.2}
          pathColor={pathColor}
          gradientStartColor={gradientStartColor}
          gradientStopColor={gradientStopColor}
          className={className}
        />
      ))}
    </>
  )
}

// ============================================================================
// BEAM NODE - Circular node for beam endpoints
// ============================================================================

export interface BeamNodeProps {
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
}

export const BeamNode = React.forwardRef<HTMLDivElement, BeamNodeProps>(
  ({ children, className, size = 'md', variant = 'default' }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    }

    const variantClasses = {
      default: 'bg-background border-2 border-border shadow-sm',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'bg-transparent border-2 border-primary',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-full',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {children}
      </div>
    )
  }
)
BeamNode.displayName = 'BeamNode'

// ============================================================================
// BEAM CONTAINER - Container for beam layout
// ============================================================================

export interface BeamContainerProps {
  children: React.ReactNode
  className?: string
}

export const BeamContainer = React.forwardRef<
  HTMLDivElement,
  BeamContainerProps
>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}
    </div>
  )
})
BeamContainer.displayName = 'BeamContainer'

// ============================================================================
// INTEGRATION BEAM DIAGRAM - Common use case component
// ============================================================================

export interface IntegrationBeamDiagramProps {
  centerIcon?: React.ReactNode
  centerLabel?: string
  integrations?: Array<{
    icon: React.ReactNode
    label?: string
  }>
  className?: string
}

export function IntegrationBeamDiagram({
  centerIcon,
  centerLabel,
  integrations = [],
  className,
}: IntegrationBeamDiagramProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const centerRef = React.useRef<HTMLDivElement>(null)
  const integrationRefs = React.useRef<(HTMLDivElement | null)[]>([])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center min-h-[300px]',
        className
      )}
    >
      {/* Center node */}
      <div className="relative z-10">
        <BeamNode ref={centerRef} size="lg" variant="primary">
          {centerIcon}
        </BeamNode>
        {centerLabel && (
          <p className="text-center text-sm font-medium mt-2">{centerLabel}</p>
        )}
      </div>

      {/* Integration nodes in a circle */}
      {integrations.map((integration, index) => {
        const angle = (index / integrations.length) * 2 * Math.PI - Math.PI / 2
        const radius = 120
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <div
            key={index}
            className="absolute z-10"
            style={{
              left: `calc(50% + ${x}px - 1.5rem)`,
              top: `calc(50% + ${y}px - 1.5rem)`,
            }}
          >
            <BeamNode
              ref={(el) => {
                integrationRefs.current[index] = el
              }}
              size="md"
              variant="outline"
            >
              {integration.icon}
            </BeamNode>
            {integration.label && (
              <p className="text-center text-xs text-muted-foreground mt-1 w-12 truncate">
                {integration.label}
              </p>
            )}
          </div>
        )
      })}

      {/* Animated beams */}
      {integrations.map((_, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={{ current: integrationRefs.current[index] }}
          toRef={centerRef}
          curvature={0}
          duration={2 + Math.random()}
          delay={index * 0.3}
        />
      ))}
    </div>
  )
}

// ============================================================================
// FLOW BEAM - Horizontal flow with beams
// ============================================================================

export interface FlowBeamProps {
  steps: Array<{
    icon: React.ReactNode
    label: string
    description?: string
  }>
  className?: string
}

export function FlowBeam({ steps, className }: FlowBeamProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex items-center justify-between gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <BeamNode
              ref={(el) => {
                stepRefs.current[index] = el
              }}
              size="lg"
              variant={
                index === 0
                  ? 'primary'
                  : index === steps.length - 1
                    ? 'primary'
                    : 'default'
              }
            >
              {step.icon}
            </BeamNode>
            <p className="text-sm font-medium mt-2">{step.label}</p>
            {step.description && (
              <p className="text-xs text-muted-foreground text-center max-w-[100px]">
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Beams between steps */}
      {steps.slice(0, -1).map((_, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={{ current: stepRefs.current[index] }}
          toRef={{ current: stepRefs.current[index + 1] }}
          curvature={0}
          duration={1.5}
          delay={index * 0.5}
        />
      ))}
    </div>
  )
}
