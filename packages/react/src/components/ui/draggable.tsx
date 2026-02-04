'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

export interface DragInfo {
  point: { x: number; y: number }
  offset: { x: number; y: number }
  velocity: { x: number; y: number }
}

export interface DraggableProps {
  children: React.ReactNode
  onDragStart?: () => void
  onDragEnd?: (info: DragInfo) => void
  onDrop?: (targetId: string | null) => void
  dragId?: string
  disabled?: boolean
  axis?: 'x' | 'y' | 'both'
  showGhost?: boolean
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export function Draggable({
  children,
  onDragStart,
  onDragEnd,
  onDrop,
  dragId,
  disabled = false,
  axis = 'both',
  showGhost = true,
  className,
  ref,
}: DraggableProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragStart = () => {
    if (disabled) return
    setIsDragging(true)
    onDragStart?.()
  }

  const handleDragEnd = (_event: unknown, info: DragInfo) => {
    setIsDragging(false)
    onDragEnd?.(info)

    // Detect drop target
    const element = document.elementFromPoint(info.point.x, info.point.y)
    const dropZone = element?.closest('[data-drop-zone]')
    const targetId = dropZone?.getAttribute('data-drop-zone') || null
    onDrop?.(targetId)
  }

  const dragConstraints = React.useMemo(() => {
    if (axis === 'x') return { top: 0, bottom: 0 }
    if (axis === 'y') return { left: 0, right: 0 }
    return undefined
  }, [axis])

  return (
    <motion.div
      ref={ref}
      drag={!disabled}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={
        prefersReducedMotion
          ? {
              zIndex: 50,
              cursor: 'grabbing',
            }
          : {
              scale: 1.05,
              opacity: showGhost ? 0.7 : 1,
              zIndex: 50,
              cursor: 'grabbing',
            }
      }
      animate={
        prefersReducedMotion
          ? {}
          : {
              scale: isDragging ? 1.05 : 1,
              rotate: isDragging ? 2 : 0,
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }
      }
      className={cn(
        'touch-none',
        !disabled && 'cursor-grab active:cursor-grabbing',
        isDragging && 'shadow-2xl',
        className
      )}
      data-drag-id={dragId}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

Draggable.displayName = 'Draggable'

export interface DropZoneProps {
  children: React.ReactNode
  onDrop?: (dragId: string | null) => void
  dropId: string
  acceptTypes?: string[]
  isOver?: boolean
  className?: string
  activeClassName?: string
  ref?: React.Ref<HTMLDivElement>
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.5, 0.8, 0.5],
}

export function DropZone({
  children,
  onDrop,
  dropId,
  className,
  activeClassName,
  ref,
}: DropZoneProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = React.useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsHovered(true)
  }

  const handleDragLeave = () => {
    setIsHovered(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsHovered(false)

    // Get the dragged element ID
    const dragId = e.dataTransfer.getData('text/plain')
    onDrop?.(dragId || null)
  }

  return (
    <motion.div
      ref={ref}
      data-drop-zone={dropId}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      animate={
        prefersReducedMotion
          ? {}
          : {
              scale: isHovered ? 1.02 : 1,
              borderColor: isHovered ? 'rgb(59, 130, 246)' : 'transparent',
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: ANIMATION_DURATION.fast / 1000,
              ease: EASING_FRAMER.out,
            }
      }
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-all',
        isHovered && (activeClassName || 'border-primary bg-primary/5'),
        className
      )}
      viewport={{ once: true }}
    >
      {/* Drop Indicator */}
      {isHovered &&
        (prefersReducedMotion ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-primary/10" />
          </div>
        ) : (
          <motion.div
            {...ANIMATION_PRESETS.fadeIn}
            className="absolute inset-0 pointer-events-none"
            viewport={{ once: true }}
          >
            <motion.div
              animate={pulseAnimation}
              transition={{
                repeat: Infinity,
                duration: durations.slower,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-lg bg-primary/10"
              viewport={{ once: true }}
            />
          </motion.div>
        ))}

      {children}
    </motion.div>
  )
}

DropZone.displayName = 'DropZone'

// Hook for drag and drop state management
export interface UseDragDropOptions<T> {
  items: T[]
  onReorder?: (items: T[]) => void
}

export const useDragDrop = <T extends { id: string }>({
  items,
  onReorder,
}: UseDragDropOptions<T>) => {
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [droppedOn, setDroppedOn] = React.useState<string | null>(null)

  const handleDragStart = React.useCallback((id: string) => {
    setDraggingId(id)
  }, [])

  const handleDrop = React.useCallback(
    (sourceId: string, targetId: string) => {
      setDraggingId(null)
      setDroppedOn(targetId)

      if (sourceId === targetId) return

      const sourceIndex = items.findIndex((item) => item.id === sourceId)
      const targetIndex = items.findIndex((item) => item.id === targetId)

      if (sourceIndex === -1 || targetIndex === -1) return

      const newItems = [...items]
      const [removed] = newItems.splice(sourceIndex, 1)
      if (removed !== undefined) {
        newItems.splice(targetIndex, 0, removed)
        onReorder?.(newItems)
      }

      // Clear dropped indicator after animation
      setTimeout(() => setDroppedOn(null), 500)
    },
    [items, onReorder]
  )

  const handleDragCancel = React.useCallback(() => {
    setDraggingId(null)
  }, [])

  return {
    draggingId,
    droppedOn,
    handleDragStart,
    handleDrop,
    handleDragCancel,
  }
}
