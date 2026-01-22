/**
 * Component Composition Helpers - Easy Component Building
 *
 * Utilities for composing, combining, and extending Clarity Chat components
 * with minimal boilerplate and maximum flexibility.
 *
 * @module utils/component-composition
 */

import * as React from 'react'
import { ClarityChat } from '../components/chat/clarity-chat'
import { ChatWindow } from '../components/chat/chat-window'
import { MessageList } from '../components/message/message-list'
import { ChatInput } from '../components/chat/chat-input'
import { useClarityChat } from '../hooks/use-clarity-chat'

// =============================================================================
// COMPOSITION HELPERS
// =============================================================================

/**
 * Compose multiple components into a single, cohesive component
 *
 * @param components - Components to compose
 * @param layout - Layout wrapper component
 * @returns Composed component
 *
 * @example
 * ```tsx
 * const MyChat = composeComponents({
 *   Header: CustomHeader,
 *   Messages: MessageList,
 *   Input: ChatInput
 * })
 * ```
 */
export function composeComponents<T extends Record<string, React.ComponentType<any>>>(
  components: T,
  layout?: React.ComponentType<{ children: React.ReactNode }>
): React.ComponentType<React.ComponentProps<T[keyof T]>> {
  const Layout = layout || React.Fragment

  return (props: any) => (
    <Layout>
      {Object.entries(components).map(([key, Component]) => (
        <Component key={key} {...props} />
      ))}
    </Layout>
  )
}

/**
 * Create a higher-order component that adds props to a base component
 *
 * @param BaseComponent - Component to enhance
 * @param enhancer - Function that returns additional props
 * @returns Enhanced component
 *
 * @example
 * ```tsx
 * const ThemedChat = withProps(ClarityChat, () => ({
 *   className: 'dark-theme',
 *   theme: { mode: 'dark' }
 * }))
 * ```
 */
export function withProps<T extends React.ComponentType<any>, P extends Partial<React.ComponentProps<T>>>(
  BaseComponent: T,
  enhancer: (props: React.ComponentProps<T>) => P
): React.ComponentType<Omit<React.ComponentProps<T>, keyof P>> {
  return (props: Omit<React.ComponentProps<T>, keyof P>) => {
    const enhancedProps = enhancer(props as React.ComponentProps<T>)
    const mergedProps = { ...props, ...enhancedProps } as React.ComponentProps<T>
    return <BaseComponent {...mergedProps} />
  }
}

/**
 * Create a component that conditionally renders based on props
 *
 * @param condition - Function that determines if component should render
 * @param Component - Component to conditionally render
 * @param fallback - Component to render when condition is false
 * @returns Conditional component
 *
 * @example
 * ```tsx
 * const MobileChat = conditional(
 *   (props) => props.isMobile,
 *   MobileChatComponent,
 *   DesktopChatComponent
 * )
 * ```
 */
export function conditional<T extends React.ComponentType<any>>(
  condition: (props: React.ComponentProps<T>) => boolean,
  Component: T,
  Fallback: React.ComponentType<React.ComponentProps<T>> = () => null
): React.ComponentType<React.ComponentProps<T>> {
  return (props: React.ComponentProps<T>) => {
    return condition(props)
      ? <Component {...props} />
      : <Fallback {...props} />
  }
}

// =============================================================================
// PRESET COMPOSITIONS
// =============================================================================

/**
 * Pre-configured component compositions for common use cases
 */
export const Compositions = {
  /** Basic chat with header and input */
  BasicChat: composeComponents({
    Header: ({ title }: { title?: string }) => (
      <div className="chat-header">
        <h2>{title || 'AI Assistant'}</h2>
      </div>
    ),
    Messages: MessageList,
    Input: ChatInput,
  }),

  /** Chat with sidebar */
  SidebarChat: composeComponents({
    Sidebar: ({ children }: { children?: React.ReactNode }) => (
      <div className="sidebar">{children}</div>
    ),
    Main: composeComponents({
      Header: ({ title }: { title?: string }) => (
        <div className="chat-header">
          <h2>{title || 'AI Assistant'}</h2>
        </div>
      ),
      Messages: MessageList,
      Input: ChatInput,
    }),
  }, ({ children }) => (
    <div className="sidebar-layout">
      {children}
    </div>
  )),

  /** Chat with toolbar */
  ToolbarChat: composeComponents({
    Toolbar: ({ actions }: { actions?: React.ReactNode }) => (
      <div className="toolbar">{actions}</div>
    ),
    Chat: composeComponents({
      Messages: MessageList,
      Input: ChatInput,
    }),
  }),

  /** Modal chat */
  ModalChat: composeComponents({
    Modal: ({ isOpen, onClose, children }: any) => (
      isOpen ? (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      ) : null
    ),
    Chat: ClarityChat,
  }),
}

// =============================================================================
// LAYOUT HELPERS
// =============================================================================

/**
 * Create a responsive grid layout
 */
export function createGridLayout(columns: number | { sm: number, md: number, lg: number }) {
  const getColumns = (breakpoint?: string) => {
    if (typeof columns === 'number') return columns
    return columns[breakpoint as keyof typeof columns] || columns.sm
  }

  return ({ children }: { children: React.ReactNode }) => (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
        '@media (min-width: 768px)': {
          gridTemplateColumns: `repeat(${getColumns('md')}, 1fr)`,
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: `repeat(${getColumns('lg')}, 1fr)`,
        },
      } as any}
    >
      {children}
    </div>
  )
}

/**
 * Create a flex layout with common configurations
 */
export const FlexLayouts = {
  /** Vertical stack */
  VStack: ({ children, gap = 4 }: { children: React.ReactNode, gap?: number }) => (
    <div className="flex flex-col" style={{ gap: `${gap * 0.25}rem` }}>
      {children}
    </div>
  ),

  /** Horizontal stack */
  HStack: ({ children, gap = 4 }: { children: React.ReactNode, gap?: number }) => (
    <div className="flex flex-row" style={{ gap: `${gap * 0.25}rem` }}>
      {children}
    </div>
  ),

  /** Centered content */
  Center: ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center min-h-full">
      {children}
    </div>
  ),

  /** Space between items */
  SpaceBetween: ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between">
      {children}
    </div>
  ),
}

// =============================================================================
// HOOK COMPOSITION
// =============================================================================

/**
 * Compose multiple hooks into a single custom hook
 *
 * @param hooks - Array of hook functions and their configurations
 * @returns Combined hook that returns merged results
 *
 * @example
 * ```tsx
 * const useCustomChat = composeHooks([
 *   [useClarityChat, { api: '/api/chat' }],
 *   [useLocalStorage, ['chat-settings', {}]],
 *   [useTheme, []]
 * ])
 * ```
 */
export function composeHooks<
  T extends Array<[hook: (...args: any[]) => any, args: any[]]>
>(
  hooks: T
): () => UnionToIntersection<ReturnType<T[number][0]>> {
  return () => {
    const results = hooks.map(([hook, args]) => hook(...args))
    return Object.assign({}, ...results) as any
  }
}

// =============================================================================
// PROPS TRANSFORMERS
// =============================================================================

/**
 * Transform props from one format to another
 *
 * @param transformer - Function that transforms props
 * @returns Higher-order component that transforms props
 *
 * @example
 * ```tsx
 * const WithTransformedProps = transformProps(
 *   (props) => ({
 *     ...props,
 *     theme: props.darkMode ? 'dark' : 'light'
 *   })
 * )(ClarityChat)
 * ```
 */
export function transformProps<T extends React.ComponentType<any>>(
  transformer: (props: React.ComponentProps<T>) => React.ComponentProps<T>
) {
  return (Component: T) => (props: React.ComponentProps<T>) => (
    <Component {...transformer(props)} />
  )
}

/**
 * Merge default props with provided props
 *
 * @param defaultProps - Default props to merge
 * @returns Higher-order component with default props
 *
 * @example
 * ```tsx
 * const ChatWithDefaults = withDefaults({
 *   api: '/api/chat',
 *   showHeader: true
 * })(ClarityChat)
 * ```
 */
export function withDefaults<T extends React.ComponentType<any>>(
  defaultProps: Partial<React.ComponentProps<T>>
) {
  return (Component: T) => (props: React.ComponentProps<T>) => {
    const mergedProps = { ...defaultProps, ...props } as React.ComponentProps<T>
    return <Component {...mergedProps} />
  }
}

// =============================================================================
// COMPONENT VARIANTS
// =============================================================================

/**
 * Create component variants with different styles/behaviors
 *
 * @param baseComponent - Base component to create variants of
 * @param variants - Variant configurations
 * @returns Component with variant prop
 *
 * @example
 * ```tsx
 * const Button = withVariants(ChatInput, {
 *   primary: { className: 'btn-primary' },
 *   secondary: { className: 'btn-secondary' },
 *   danger: { className: 'btn-danger' }
 * })
 *
 * // Usage
 * <Button variant="primary" />
 * ```
 */
export function withVariants<
  T extends React.ComponentType<any>,
  V extends Record<string, Partial<React.ComponentProps<T>>>
>(
  BaseComponent: T,
  variants: V
): React.ComponentType<React.ComponentProps<T> & { variant?: keyof V }> {
  return ({ variant, ...props }: React.ComponentProps<T> & { variant?: keyof V }) => {
    const variantProps = variant ? variants[variant] : {}
    return <BaseComponent {...variantProps} {...(props as any)} />
  }
}

// =============================================================================
// CONTEXT PROVIDERS
// =============================================================================

/**
 * Create a context provider with a custom hook
 *
 * @param initialValue - Initial context value
 * @returns Provider component and hook
 *
 * @example
 * ```tsx
 * const [ChatProvider, useChatContext] = createContextProvider({
 *   theme: 'light',
 *   user: null
 * })
 * ```
 */
export function createContextProvider<T>(
  initialValue: T
): [React.ComponentType<{ children: React.ReactNode, value?: T }>, () => T] {
  const Context = React.createContext<T>(initialValue)

  const Provider: React.ComponentType<{ children: React.ReactNode, value?: T }> = ({
    children,
    value = initialValue
  }) => (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )

  const useContext = () => {
    const context = React.useContext(Context)
    if (context === undefined) {
      throw new Error('useContext must be used within a Provider')
    }
    return context
  }

  return [Provider, useContext]
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never