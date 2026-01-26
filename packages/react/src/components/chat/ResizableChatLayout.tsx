/**
 * ResizableChatLayout - Flexible chat layout with resizable panels
 *
 * Built on react-resizable-panels for smooth, accessible resizing.
 * Provides the same structure as ChatLayout but with user-adjustable panel sizes.
 *
 * @example
 * ```tsx
 * <ResizableChatLayout
 *   sidebar={<RAGContext />}
 *   header={<SessionHeader />}
 *   footer={<TokenCounter />}
 *   defaultSidebarSize={25}
 *   minSidebarSize={15}
 *   maxSidebarSize={40}
 * >
 *   <ChatWindow {...chat} />
 * </ResizableChatLayout>
 * ```
 *
 * @see https://github.com/bvaughn/react-resizable-panels
 * @license MIT (react-resizable-panels)
 */

import * as React from 'react'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ImperativePanelHandle,
} from 'react-resizable-panels'
import { cn } from '@clarity-chat/primitives'

/**
 * Props for the resize handle
 */
export interface ResizeHandleProps {
  /** Additional class name */
  className?: string
  /** Whether the handle is vertical (between left/right panels) */
  vertical?: boolean
  /** Disable the handle */
  disabled?: boolean
}

/**
 * Styled resize handle component
 */
function ResizeHandle({
  className,
  vertical = true,
  disabled = false,
}: ResizeHandleProps) {
  return (
    <PanelResizeHandle
      className={cn(
        'relative flex items-center justify-center',
        'bg-border transition-colors',
        'hover:bg-primary/20 focus-visible:bg-primary/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        vertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      disabled={disabled}
    >
      <div
        className={cn(
          'rounded-full bg-muted-foreground/30',
          'transition-all group-hover:bg-muted-foreground/50',
          vertical ? 'h-8 w-0.5' : 'w-8 h-0.5'
        )}
      />
    </PanelResizeHandle>
  )
}

/**
 * Props for ResizableChatLayout
 */
export interface ResizableChatLayoutProps {
  /** Main chat content */
  children: React.ReactNode
  /** Optional sidebar content */
  sidebar?: React.ReactNode
  /** Optional header content */
  header?: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
  /** Default sidebar size as percentage (1-100) */
  defaultSidebarSize?: number
  /** Minimum sidebar size as percentage */
  minSidebarSize?: number
  /** Maximum sidebar size as percentage */
  maxSidebarSize?: number
  /** Whether sidebar is on the right */
  sidebarPosition?: 'left' | 'right'
  /** Whether to persist layout to localStorage */
  persistLayout?: boolean
  /** Key for localStorage persistence */
  storageKey?: string
  /** Callback when sidebar size changes */
  onSidebarResize?: (size: number) => void
  /** Whether the layout is collapsible */
  collapsible?: boolean
  /** Whether the sidebar starts collapsed */
  defaultCollapsed?: boolean
  /** Size when collapsed (percentage) */
  collapsedSize?: number
  /** Custom className */
  className?: string
  /** Custom className for the main panel */
  mainClassName?: string
  /** Custom className for the sidebar panel */
  sidebarClassName?: string
  /** Direction of the panel group */
  direction?: 'horizontal' | 'vertical'
}

/**
 * ResizableChatLayout - Chat layout with resizable panels
 *
 * Provides a flexible layout with draggable dividers between sidebar
 * and main content. Supports persistence, collapsing, and custom sizing.
 */
export function ResizableChatLayout({
  children,
  sidebar,
  header,
  footer,
  defaultSidebarSize = 25,
  minSidebarSize = 10,
  maxSidebarSize = 50,
  sidebarPosition = 'left',
  persistLayout = false,
  storageKey = 'clarity-chat-layout',
  onSidebarResize,
  collapsible = true,
  defaultCollapsed = false,
  collapsedSize = 0,
  className,
  mainClassName,
  sidebarClassName,
  direction = 'horizontal',
}: ResizableChatLayoutProps) {
  const sidebarRef = React.useRef<ImperativePanelHandle>(null)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const hasSidebar = !!sidebar
  const hasHeader = !!header
  const hasFooter = !!footer

  // Handle sidebar collapse/expand
  const toggleSidebar = React.useCallback(() => {
    const panel = sidebarRef.current
    if (panel) {
      if (isCollapsed) {
        panel.expand()
      } else {
        panel.collapse()
      }
    }
  }, [isCollapsed])

  // Handle collapse state changes
  const handleCollapse = React.useCallback(() => {
    setIsCollapsed(true)
  }, [])

  const handleExpand = React.useCallback(() => {
    setIsCollapsed(false)
  }, [])

  // Sidebar panel element
  const sidebarPanel = hasSidebar ? (
    <Panel
      ref={sidebarRef}
      defaultSize={defaultCollapsed ? collapsedSize : defaultSidebarSize}
      minSize={minSidebarSize}
      maxSize={maxSidebarSize}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      onCollapse={handleCollapse}
      onExpand={handleExpand}
      onResize={onSidebarResize}
      className={cn(
        'overflow-hidden transition-all',
        isCollapsed && 'min-w-0',
        sidebarClassName
      )}
      order={sidebarPosition === 'left' ? 1 : 3}
    >
      <div className="h-full overflow-auto">{sidebar}</div>
    </Panel>
  ) : null

  // Main content panel
  const mainPanel = (
    <Panel
      defaultSize={hasSidebar ? 100 - defaultSidebarSize : 100}
      minSize={30}
      className={cn('overflow-hidden', mainClassName)}
      order={2}
    >
      <div className="h-full overflow-auto">{children}</div>
    </Panel>
  )

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {hasHeader && (
        <header className="flex-shrink-0 border-b border-border">
          {header}
        </header>
      )}

      <div className="flex-1 overflow-hidden">
        {hasSidebar ? (
          <PanelGroup
            direction={direction}
            autoSaveId={persistLayout ? storageKey : undefined}
            className="h-full"
          >
            {sidebarPosition === 'left' ? (
              <>
                {sidebarPanel}
                <ResizeHandle vertical={direction === 'horizontal'} />
                {mainPanel}
              </>
            ) : (
              <>
                {mainPanel}
                <ResizeHandle vertical={direction === 'horizontal'} />
                {sidebarPanel}
              </>
            )}
          </PanelGroup>
        ) : (
          <div className="h-full overflow-auto">{children}</div>
        )}
      </div>

      {hasFooter && (
        <footer className="flex-shrink-0 border-t border-border">
          {footer}
        </footer>
      )}
    </div>
  )
}

ResizableChatLayout.displayName = 'ResizableChatLayout'

/**
 * Hook for controlling resizable layout programmatically
 */
export function useResizableLayout() {
  const panelRef = React.useRef<ImperativePanelHandle>(null)

  return {
    ref: panelRef,
    collapse: () => panelRef.current?.collapse(),
    expand: () => panelRef.current?.expand(),
    resize: (size: number) => panelRef.current?.resize(size),
    getSize: () => panelRef.current?.getSize() ?? 0,
    isCollapsed: () => panelRef.current?.isCollapsed() ?? false,
  }
}

// Re-export panel components for custom layouts
export { Panel, PanelGroup, PanelResizeHandle, ResizeHandle }
export type { ImperativePanelHandle }
