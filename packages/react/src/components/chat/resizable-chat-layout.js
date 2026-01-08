import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import * as React from 'react';
import { Panel, PanelGroup, PanelResizeHandle, } from 'react-resizable-panels';
import { cn } from '@clarity-chat/primitives';
/**
 * Styled resize handle component
 */
function ResizeHandle({ className, vertical = true, disabled = false, }) {
    return (_jsx(PanelResizeHandle, { className: cn('relative flex items-center justify-center', 'bg-border transition-colors', 'hover:bg-primary/20 focus-visible:bg-primary/20', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', vertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize', disabled && 'pointer-events-none opacity-50', className), disabled: disabled, children: _jsx("div", { className: cn('rounded-full bg-muted-foreground/30', 'transition-all group-hover:bg-muted-foreground/50', vertical ? 'h-8 w-0.5' : 'w-8 h-0.5') }) }));
}
/**
 * ResizableChatLayout - Chat layout with resizable panels
 *
 * Provides a flexible layout with draggable dividers between sidebar
 * and main content. Supports persistence, collapsing, and custom sizing.
 */
export function ResizableChatLayout({ children, sidebar, header, footer, defaultSidebarSize = 25, minSidebarSize = 10, maxSidebarSize = 50, sidebarPosition = 'left', persistLayout = false, storageKey = 'clarity-chat-layout', onSidebarResize, collapsible = true, defaultCollapsed = false, collapsedSize = 0, className, mainClassName, sidebarClassName, direction = 'horizontal', }) {
    const sidebarRef = React.useRef(null);
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const hasSidebar = !!sidebar;
    const hasHeader = !!header;
    const hasFooter = !!footer;
    // Handle sidebar collapse/expand
    const toggleSidebar = React.useCallback(() => {
        const panel = sidebarRef.current;
        if (panel) {
            if (isCollapsed) {
                panel.expand();
            }
            else {
                panel.collapse();
            }
        }
    }, [isCollapsed]);
    // Handle collapse state changes
    const handleCollapse = React.useCallback(() => {
        setIsCollapsed(true);
    }, []);
    const handleExpand = React.useCallback(() => {
        setIsCollapsed(false);
    }, []);
    // Sidebar panel element
    const sidebarPanel = hasSidebar ? (_jsx(Panel, { ref: sidebarRef, defaultSize: defaultCollapsed ? collapsedSize : defaultSidebarSize, minSize: minSidebarSize, maxSize: maxSidebarSize, collapsible: collapsible, collapsedSize: collapsedSize, onCollapse: handleCollapse, onExpand: handleExpand, onResize: onSidebarResize, className: cn('overflow-hidden transition-all', isCollapsed && 'min-w-0', sidebarClassName), order: sidebarPosition === 'left' ? 1 : 3, children: _jsx("div", { className: "h-full overflow-auto", children: sidebar }) })) : null;
    // Main content panel
    const mainPanel = (_jsx(Panel, { defaultSize: hasSidebar ? 100 - defaultSidebarSize : 100, minSize: 30, className: cn('overflow-hidden', mainClassName), order: 2, children: _jsx("div", { className: "h-full overflow-auto", children: children }) }));
    return (_jsxs("div", { className: cn('flex flex-col h-full', className), children: [hasHeader && (_jsx("header", { className: "flex-shrink-0 border-b border-border", children: header })), _jsx("div", { className: "flex-1 overflow-hidden", children: hasSidebar ? (_jsx(PanelGroup, { direction: direction, autoSaveId: persistLayout ? storageKey : undefined, className: "h-full", children: sidebarPosition === 'left' ? (_jsxs(_Fragment, { children: [sidebarPanel, _jsx(ResizeHandle, { vertical: direction === 'horizontal' }), mainPanel] })) : (_jsxs(_Fragment, { children: [mainPanel, _jsx(ResizeHandle, { vertical: direction === 'horizontal' }), sidebarPanel] })) })) : (_jsx("div", { className: "h-full overflow-auto", children: children })) }), hasFooter && (_jsx("footer", { className: "flex-shrink-0 border-t border-border", children: footer }))] }));
}
ResizableChatLayout.displayName = 'ResizableChatLayout';
/**
 * Hook for controlling resizable layout programmatically
 */
export function useResizableLayout() {
    const panelRef = React.useRef(null);
    return {
        ref: panelRef,
        collapse: () => panelRef.current?.collapse(),
        expand: () => panelRef.current?.expand(),
        resize: (size) => panelRef.current?.resize(size),
        getSize: () => panelRef.current?.getSize() ?? 0,
        isCollapsed: () => panelRef.current?.isCollapsed() ?? false,
    };
}
// Re-export panel components for custom layouts
export { Panel, PanelGroup, PanelResizeHandle, ResizeHandle };
//# sourceMappingURL=resizable-chat-layout.js.map