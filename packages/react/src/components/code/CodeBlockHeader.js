'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../utils/cn';
import { getLanguageDisplayName } from './utils';
/**
 * CodeBlockHeader Component
 *
 * Header bar for code blocks displaying title, language badge, and actions.
 *
 * @example
 * ```tsx
 * <CodeBlockHeader
 *   title="example.ts"
 *   language="typescript"
 *   showLanguageBadge
 * >
 *   <CopyButton text={code} />
 * </CodeBlockHeader>
 * ```
 */
export const CodeBlockHeader = React.memo(function CodeBlockHeader({ title, language, showLanguageBadge = true, actions, className, children, }) {
    const displayLanguage = language && language !== 'text' && language !== 'plaintext';
    // Don't render if there's nothing to show
    if (!title && !displayLanguage && !actions && !children) {
        return null;
    }
    return (_jsxs("div", { className: cn('flex items-center justify-between', 'px-4 py-2', 'border-b border-border/50', 'bg-muted/30', className), children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [title && (_jsx("span", { className: cn('text-sm font-medium text-muted-foreground', 'truncate max-w-[200px]'), title: title, children: title })), showLanguageBadge && displayLanguage && (_jsx("span", { className: cn('text-xs px-2 py-0.5 rounded', 'bg-muted text-muted-foreground', 'font-mono uppercase tracking-wide'), children: getLanguageDisplayName(language) }))] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [actions, children] })] }));
});
CodeBlockHeader.displayName = 'CodeBlockHeader';
export default CodeBlockHeader;
//# sourceMappingURL=CodeBlockHeader.js.map