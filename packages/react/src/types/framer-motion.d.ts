/**
 * Type declarations for framer-motion (peer dependency)
 *
 * framer-motion is a peer dependency and may not be installed during development.
 * This declaration file provides type safety for animation imports.
 *
 * @see https://www.framer.com/motion/
 */

declare module 'framer-motion' {
  import type { ComponentType, FC, HTMLAttributes, SVGAttributes, RefAttributes, ReactNode, CSSProperties } from 'react'

  // --- Core Types ---

  export type TargetAndTransition = {
    [key: string]: unknown
    transition?: Transition
  }

  export type VariantLabels = string | string[]

  export interface Variant {
    [key: string]: unknown
  }

  export interface Variants {
    [key: string]: Variant | TargetAndTransition | undefined
  }

  export interface Transition {
    type?: 'tween' | 'spring' | 'inertia' | 'keyframes' | string
    duration?: number
    delay?: number
    ease?: string | number[] | readonly number[]
    repeat?: number
    repeatType?: 'loop' | 'reverse' | 'mirror' | string
    repeatDelay?: number
    stiffness?: number
    damping?: number
    mass?: number
    velocity?: number
    staggerChildren?: number
    delayChildren?: number
    direction?: number
    [key: string]: unknown
  }

  // --- Motion Component Props ---

  export interface MotionProps {
    initial?: boolean | string | TargetAndTransition | VariantLabels
    animate?: string | TargetAndTransition | VariantLabels
    exit?: string | TargetAndTransition | VariantLabels
    variants?: Variants
    transition?: Transition
    whileHover?: string | TargetAndTransition
    whileTap?: string | TargetAndTransition
    whileFocus?: string | TargetAndTransition
    whileDrag?: string | TargetAndTransition
    whileInView?: string | TargetAndTransition
    drag?: boolean | 'x' | 'y'
    dragConstraints?: { top?: number; right?: number; bottom?: number; left?: number } | RefAttributes<Element>
    dragElastic?: number | boolean
    dragMomentum?: boolean
    onDragStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
    onDrag?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
    onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
    layout?: boolean | 'position' | 'size'
    layoutId?: string
    onLayoutAnimationStart?: () => void
    onLayoutAnimationComplete?: () => void
    onAnimationStart?: () => void
    onAnimationComplete?: () => void
    style?: CSSProperties
    className?: string
    children?: ReactNode
    key?: string | number
    [key: string]: unknown
  }

  export type HTMLMotionProps<T extends keyof HTMLElementTagNameMap = 'div'> =
    MotionProps & HTMLAttributes<HTMLElementTagNameMap[T]>

  export type SVGMotionProps<T extends keyof SVGElementTagNameMap = 'svg'> =
    MotionProps & SVGAttributes<SVGElementTagNameMap[T]>

  // --- Pan Info ---

  export interface PanInfo {
    point: { x: number; y: number }
    delta: { x: number; y: number }
    offset: { x: number; y: number }
    velocity: { x: number; y: number }
  }

  // --- Motion Value ---

  export interface MotionValue<T = number> {
    get(): T
    set(v: T): void
    onChange(callback: (value: T) => void): () => void
    destroy(): void
  }

  // --- Motion Component ---

  type MotionComponentProps<T extends keyof HTMLElementTagNameMap> =
    MotionProps & HTMLAttributes<HTMLElementTagNameMap[T]> & RefAttributes<HTMLElementTagNameMap[T]>

  type MotionSVGComponentProps<T extends keyof SVGElementTagNameMap> =
    MotionProps & SVGAttributes<SVGElementTagNameMap[T]> & RefAttributes<SVGElementTagNameMap[T]>

  type MotionComponent = {
    [K in keyof HTMLElementTagNameMap]: FC<MotionComponentProps<K>>
  } & {
    [K in keyof SVGElementTagNameMap]: FC<MotionSVGComponentProps<K>>
  }

  export const motion: MotionComponent

  // --- AnimatePresence ---

  export interface AnimatePresenceProps {
    initial?: boolean
    mode?: 'sync' | 'wait' | 'popLayout'
    onExitComplete?: () => void
    children?: ReactNode
  }

  export const AnimatePresence: FC<AnimatePresenceProps>

  // --- MotionConfig ---

  export interface MotionConfigProps {
    reducedMotion?: 'user' | 'always' | 'never'
    transition?: Transition
    children?: ReactNode
  }

  export const MotionConfig: FC<MotionConfigProps>

  // --- Reorder ---

  export namespace Reorder {
    interface GroupProps<T> {
      as?: string | ComponentType
      axis?: 'x' | 'y'
      values: T[]
      onReorder: (newOrder: T[]) => void
      children?: ReactNode
      [key: string]: unknown
    }

    interface ItemProps<T> {
      as?: string | ComponentType
      value: T
      children?: ReactNode
      [key: string]: unknown
    }

    const Group: <T>(props: GroupProps<T>) => ReactNode
    const Item: <T>(props: ItemProps<T> & MotionProps) => ReactNode
  }

  // --- Hooks ---

  export function useReducedMotion(): boolean | null
  export function useMotionValue<T = number>(initial: T): MotionValue<T>
  export function useTransform<I, O>(
    value: MotionValue<I>,
    inputRange: I[],
    outputRange: O[],
    options?: { clamp?: boolean }
  ): MotionValue<O>
  export function useSpring(
    source: MotionValue<number> | number,
    config?: { stiffness?: number; damping?: number; mass?: number }
  ): MotionValue<number>
  export function useAnimationControls(): AnimationControls
  export function useInView(
    ref: RefAttributes<Element>,
    options?: { once?: boolean; margin?: string; amount?: number | 'some' | 'all' }
  ): boolean
  export function useScroll(options?: {
    target?: RefAttributes<Element>
    container?: RefAttributes<Element>
    offset?: string[]
  }): {
    scrollX: MotionValue<number>
    scrollY: MotionValue<number>
    scrollXProgress: MotionValue<number>
    scrollYProgress: MotionValue<number>
  }

  // --- Animation Controls ---

  export interface AnimationControls {
    start(definition: string | TargetAndTransition, transitionOverride?: Transition): Promise<void>
    stop(): void
    set(definition: string | TargetAndTransition): void
  }

  // --- Layout Group ---

  export interface LayoutGroupProps {
    id?: string
    children?: ReactNode
  }

  export const LayoutGroup: FC<LayoutGroupProps>
}
