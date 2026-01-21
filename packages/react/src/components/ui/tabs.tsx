'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

/**
 * Tabs - Accessible tabs component
 *
 * A fully accessible tabs implementation following WAI-ARIA Tabs pattern.
 * Features:
 * - Keyboard navigation with arrow keys
 * - Proper ARIA attributes linking tabs to panels
 * - Roving tabindex for focus management
 * - Support for controlled and uncontrolled modes
 */

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  /** Unique ID prefix for ARIA linking */
  id?: string
  /** Orientation affects arrow key navigation */
  orientation?: 'horizontal' | 'vertical'
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  /** Loop navigation from last to first and vice versa */
  loop?: boolean
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  /** Force mount even when inactive (useful for animations) */
  forceMount?: boolean
}

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
  baseId: string
  orientation: 'horizontal' | 'vertical'
  registerTab: (
    value: string,
    ref: React.RefObject<HTMLButtonElement | null>
  ) => void
  unregisterTab: (value: string) => void
  tabRefs: Map<string, React.RefObject<HTMLButtonElement | null>>
  loop: boolean
  setLoop: (loop: boolean) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

export function Tabs({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  children,
  className,
  id,
  orientation = 'horizontal',
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = controlledValue ?? internalValue
  const generatedId = React.useId()
  const baseId = id || `tabs-${generatedId}`
  const [loop, setLoop] = React.useState(true)

  // Track registered tabs for keyboard navigation
  const tabRefs = React.useRef(
    new Map<string, React.RefObject<HTMLButtonElement | null>>()
  )

  const handleChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [controlledValue, onValueChange]
  )

  const registerTab = React.useCallback(
    (tabValue: string, ref: React.RefObject<HTMLButtonElement | null>) => {
      tabRefs.current.set(tabValue, ref)
    },
    []
  )

  const unregisterTab = React.useCallback((tabValue: string) => {
    tabRefs.current.delete(tabValue)
  }, [])

  const contextValue = React.useMemo(
    () => ({
      value,
      onChange: handleChange,
      baseId,
      orientation,
      registerTab,
      unregisterTab,
      tabRefs: tabRefs.current,
      loop,
      setLoop,
    }),
    [value, handleChange, baseId, orientation, registerTab, unregisterTab, loop]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className, loop = true }: TabsListProps) {
  const context = useTabsContext()
  const listRef = React.useRef<HTMLDivElement>(null)

  // Update loop setting in context
  React.useEffect(() => {
    context.setLoop(loop)
  }, [loop, context])

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const tabs = Array.from(context.tabRefs.entries())
      const currentIndex = tabs.findIndex(([value]) => value === context.value)

      if (currentIndex === -1) return

      let nextIndex = currentIndex
      const isHorizontal = context.orientation === 'horizontal'
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

      switch (e.key) {
        case nextKey:
          e.preventDefault()
          nextIndex = currentIndex + 1
          // Skip disabled tabs
          while (
            nextIndex < tabs.length &&
            tabs[nextIndex]?.[1]?.current?.disabled
          ) {
            nextIndex++
          }
          if (nextIndex >= tabs.length) {
            nextIndex = context.loop ? 0 : currentIndex
          }
          break
        case prevKey:
          e.preventDefault()
          nextIndex = currentIndex - 1
          // Skip disabled tabs
          while (nextIndex >= 0 && tabs[nextIndex]?.[1]?.current?.disabled) {
            nextIndex--
          }
          if (nextIndex < 0) {
            nextIndex = context.loop ? tabs.length - 1 : currentIndex
          }
          break
        case 'Home':
          e.preventDefault()
          nextIndex = tabs.findIndex(([, ref]) => !ref.current?.disabled)
          break
        case 'End':
          e.preventDefault()
          for (let i = tabs.length - 1; i >= 0; i--) {
            if (!tabs[i]?.[1]?.current?.disabled) {
              nextIndex = i
              break
            }
          }
          break
        default:
          return
      }

      const [nextValue, nextRef] = tabs[nextIndex] || []
      if (nextValue && nextRef?.current) {
        context.onChange(nextValue)
        nextRef.current.focus()
      }
    },
    [context]
  )

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={context.orientation}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        context.orientation === 'horizontal' ? 'h-10' : 'flex-col h-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
}: TabsTriggerProps) {
  const context = useTabsContext()
  const isActive = context.value === value
  const ref = React.useRef<HTMLButtonElement>(null)

  // Generate unique IDs for ARIA linking
  const triggerId = `${context.baseId}-trigger-${value}`
  const panelId = `${context.baseId}-panel-${value}`

  // Register this tab with the context
  React.useEffect(() => {
    context.registerTab(value, ref)
    return () => context.unregisterTab(value)
  }, [value, context])

  return (
    <button
      ref={ref}
      id={triggerId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          context.onChange(value)
        }
      }}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
  forceMount = false,
}: TabsContentProps) {
  const context = useTabsContext()
  const isActive = context.value === value

  // Generate unique IDs for ARIA linking
  const triggerId = `${context.baseId}-trigger-${value}`
  const panelId = `${context.baseId}-panel-${value}`

  if (!isActive && !forceMount) return null

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      hidden={!isActive}
      className={cn(
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        !isActive && 'hidden',
        className
      )}
    >
      {children}
    </div>
  )
}
