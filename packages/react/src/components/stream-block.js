'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
import { useStreamableUI } from '../hooks/use-streamable-ui';
const spacingMap = {
    none: 'space-y-0',
    compact: 'space-y-2',
    relaxed: 'space-y-4',
};
const indicatorClass = 'inline-flex h-2 w-2 rounded-full bg-primary/60 animate-pulse align-middle ml-2';
export function StreamBlock({ source = null, mode = 'append', renderItem, fallback = null, errorFallback, as, className, spacing = 'compact', showIndicator = true, hookOptions, }) {
    const Component = (as ?? 'div');
    const { values, status, error } = useStreamableUI(source ?? null, {
        mode,
        ...hookOptions,
    });
    const items = values;
    const renderFragment = React.useCallback((item, index) => renderItem ? renderItem(item, index, items) : item, [items, renderItem]);
    if (error && errorFallback) {
        const content = typeof errorFallback === 'function' ? errorFallback(error) : errorFallback;
        return (_jsx(Component, { className: cn('clarity-stream-block flex flex-col', className), "data-status": "error", "aria-live": "assertive", children: content }));
    }
    const hasContent = items.length > 0;
    const spacingClass = spacingMap[spacing];
    return (_jsxs(Component, { className: cn('clarity-stream-block relative flex flex-col', spacingClass, className), "data-status": status, "aria-live": "polite", role: status === 'streaming' ? 'status' : undefined, children: [hasContent
                ? items.map((item, index) => (_jsx(React.Fragment, { children: renderFragment(item, index) }, index)))
                : fallback, showIndicator && status === 'streaming' && (_jsx("span", { className: indicatorClass, "aria-hidden": "true" }))] }));
}
//# sourceMappingURL=stream-block.js.map