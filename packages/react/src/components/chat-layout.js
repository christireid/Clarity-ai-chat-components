import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@clarity-chat/primitives';
/**
 * ChatLayout - Mid-level layout component
 *
 * Provides flexible layout structure for chat UIs with optional
 * sidebar, header, and footer sections.
 */
export function ChatLayout({ children, sidebar, header, footer, variant = 'default', className, }) {
    const hasSidebar = !!sidebar;
    const hasHeader = !!header;
    const hasFooter = !!footer;
    return (_jsxs("div", { className: cn('flex flex-col h-full', variant === 'split' && hasSidebar && 'flex-row', className), children: [hasHeader && (_jsx("header", { className: "flex-shrink-0 border-b border-border", children: header })), _jsxs("div", { className: cn('flex flex-1 overflow-hidden', variant === 'split' && hasSidebar && 'flex-row'), children: [hasSidebar && (_jsx("aside", { className: cn('flex-shrink-0 border-r border-border', variant === 'split' ? 'w-80' : 'w-64'), children: sidebar })), _jsx("main", { className: "flex-1 overflow-hidden", children: children })] }), hasFooter && (_jsx("footer", { className: "flex-shrink-0 border-t border-border", children: footer }))] }));
}
ChatLayout.displayName = 'ChatLayout';
//# sourceMappingURL=chat-layout.js.map