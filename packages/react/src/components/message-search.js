import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Input, Badge } from '@clarity-chat/primitives';
import { useDeferredSearch } from '../hooks/use-deferred-search';
import { SearchIcon } from './icons';
const { Suspense } = React;
/**
 * Message Search Component with React Concurrent Features
 *
 * Uses useDeferredValue to keep the search input responsive
 * even when filtering large message lists.
 *
 * @example
 * ```tsx
 * <MessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   placeholder="Search messages..."
 * />
 * ```
 */
export const MessageSearch = React.memo(function MessageSearch({ messages, onResultsChange, placeholder = 'Search messages...', className, }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { filteredMessages, isPending } = useDeferredSearch(messages, searchQuery);
    // Notify parent of filtered results
    React.useEffect(() => {
        onResultsChange?.(filteredMessages);
    }, [filteredMessages, onResultsChange]);
    return (_jsxs("div", { className: className, children: [_jsxs("div", { className: "relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: placeholder, className: "pl-9" }), isPending && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: _jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" }) }))] }), searchQuery && (_jsxs("div", { className: "mt-2 flex items-center justify-between text-sm text-muted-foreground", children: [_jsxs("span", { children: ["Found ", filteredMessages.length, " of ", messages.length, " messages"] }), isPending && (_jsx(Badge, { variant: "secondary", className: "animate-pulse", children: "Searching..." }))] }))] }));
});
MessageSearch.displayName = 'MessageSearch';
/**
 * Message Search with Suspense Boundary
 *
 * Wraps MessageSearch in a Suspense boundary for lazy loading.
 * Shows a loading skeleton while the component is being loaded.
 */
export const MessageSearchWithSuspense = React.memo(function MessageSearchWithSuspense(props) {
    return (_jsx(Suspense, { fallback: _jsxs("div", { className: "space-y-2 animate-pulse", children: [_jsx("div", { className: "h-10 bg-muted rounded-md" }), _jsx("div", { className: "h-4 w-32 bg-muted rounded-md" })] }), children: _jsx(MessageSearch, { ...props }) }));
});
MessageSearchWithSuspense.displayName = 'MessageSearchWithSuspense';
//# sourceMappingURL=message-search.js.map