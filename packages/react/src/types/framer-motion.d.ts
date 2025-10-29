/**
 * Framer Motion type declarations isolation
 * 
 * This file isolates Framer Motion types to prevent conflicts during
 * TypeScript declaration file generation with tsup.
 * 
 * Issue: Framer Motion has complex type definitions that can cause
 * conflicts when generating .d.ts files with tsup.
 * 
 * Solution: Declare minimal type interfaces for the Framer Motion
 * features we actually use, avoiding the full complexity of the
 * framer-motion package types.
 */

declare module 'framer-motion' {
  import * as React from 'react'

  // Motion component props
  export interface MotionProps {
    ref?: React.Ref<any>
    initial?: any
    animate?: any
    exit?: any
    transition?: any
    variants?: any
    whileHover?: any
    whileTap?: any
    whileFocus?: any
    whileDrag?: any
    drag?: boolean | 'x' | 'y'
    dragConstraints?: any
    dragElastic?: number
    dragMomentum?: boolean
    layout?: boolean | 'position' | 'size'
    layoutId?: string
    style?: React.CSSProperties | any
    className?: string
    onAnimationStart?: any
    onAnimationComplete?: any
    onMouseEnter?: any
    onMouseLeave?: any
    onClick?: any
    children?: React.ReactNode
  }

  // Motion HTML elements
  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLDivElement>>
    span: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLSpanElement>>
    button: React.ForwardRefExoticComponent<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>
    a: React.ForwardRefExoticComponent<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>
    p: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLParagraphElement>>
    ul: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLUListElement>>
    li: React.ForwardRefExoticComponent<MotionProps & React.LiHTMLAttributes<HTMLLIElement>>
    img: React.ForwardRefExoticComponent<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>
    svg: React.ForwardRefExoticComponent<MotionProps & React.SVGAttributes<SVGSVGElement>>
    path: React.ForwardRefExoticComponent<MotionProps & React.SVGAttributes<SVGPathElement>>
    [key: string]: any
  }

  // AnimatePresence component
  export interface AnimatePresenceProps {
    children?: React.ReactNode
    initial?: boolean
    mode?: 'sync' | 'wait' | 'popLayout'
    onExitComplete?: () => void
    custom?: any
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>

  // useAnimation hook
  export interface AnimationControls {
    start: (definition: any) => Promise<any>
    stop: () => void
    set: (definition: any) => void
  }

  export function useAnimation(): AnimationControls

  // useMotionValue hook
  export class MotionValue<T = any> {
    get(): T
    set(value: T): void
    onChange(callback: (latest: T) => void): () => void
  }

  export function useMotionValue<T>(initial: T): MotionValue<T>

  // useTransform hook
  export function useTransform<T>(
    value: MotionValue,
    inputRange: number[],
    outputRange: T[],
    options?: any
  ): MotionValue<T>

  // useSpring hook
  export function useSpring(value: MotionValue | number, config?: any): MotionValue

  // useScroll hook
  export interface ScrollMotionValues {
    scrollX: MotionValue<number>
    scrollY: MotionValue<number>
    scrollXProgress: MotionValue<number>
    scrollYProgress: MotionValue<number>
  }

  export function useScroll(options?: any): ScrollMotionValues

  // useInView hook
  export function useInView(options?: any): boolean

  // Variants type
  export interface Variants {
    [key: string]: any
  }

  // Transition type
  export interface Transition {
    duration?: number
    delay?: number
    ease?: string | number[]
    type?: 'spring' | 'tween' | 'inertia'
    stiffness?: number
    damping?: number
    mass?: number
    velocity?: number
    restSpeed?: number
    restDelta?: number
    [key: string]: any
  }
}
