/**
 * Skeleton Composition System
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { EnhancedSkeleton } from './BaseSkeleton'
import { EnhancedSkeletonText } from './SkeletonText'
import { EnhancedSkeletonAvatar } from './SkeletonAvatar'
import type { SkeletonComposerProps } from '../types'

export const SkeletonComposer: React.FC<SkeletonComposerProps> = ({
  composition,
  variant = 'shimmer',
  className,
  enableTransition = true,
}) => {
  const renderComponent = (component: any, index: number) => {
    const { type, props = {}, gridArea } = component
    const baseProps = {
      variant,
      enableTransition,
      ...props,
    }

    const style = gridArea ? { gridArea } : {}

    switch (type) {
      case 'skeleton':
        return <EnhancedSkeleton key={index} {...baseProps} style={style} />
      case 'text':
        return (
          <EnhancedSkeletonText
            key={index}
            {...baseProps}
            className={cn(props.className, 'skeleton-text')}
          />
        )
      case 'avatar':
        return (
          <EnhancedSkeletonAvatar key={index} {...baseProps} style={style} />
        )
      case 'button':
        return (
          <EnhancedSkeleton
            key={index}
            width={props.width || 100}
            height={props.height || 36}
            rounded="md"
            {...baseProps}
            style={style}
          />
        )
      case 'input':
        return (
          <EnhancedSkeleton
            key={index}
            width={props.width || '100%'}
            height={props.height || 40}
            rounded="md"
            {...baseProps}
            style={style}
          />
        )
      default:
        return null
    }
  }

  const getLayoutStyles = () => {
    switch (composition.layout) {
      case 'card':
        return 'grid grid-cols-1 gap-4 p-6 rounded-lg border border-border/40 bg-card'
      case 'list':
        return 'flex flex-col gap-4'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'message':
        return 'flex gap-3.5 p-4'
      case 'form':
        return 'space-y-4'
      case 'custom':
        return composition.responsive ? 'skeleton-responsive' : ''
      default:
        return 'grid grid-cols-1 gap-4'
    }
  }

  return (
    <div className={cn(getLayoutStyles(), className)}>
      {composition.components.map((component, index) =>
        renderComponent(component, index)
      )}
    </div>
  )
}
