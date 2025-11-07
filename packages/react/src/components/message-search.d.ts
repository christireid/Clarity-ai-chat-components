import * as React from 'react';
import type { Message } from '@clarity-chat/types';
export interface MessageSearchProps {
    messages: Message[];
    onResultsChange?: (filteredMessages: Message[]) => void;
    placeholder?: string;
    className?: string;
}
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
export declare const MessageSearch: React.NamedExoticComponent<MessageSearchProps>;
/**
 * Message Search with Suspense Boundary
 *
 * Wraps MessageSearch in a Suspense boundary for lazy loading.
 * Shows a loading skeleton while the component is being loaded.
 */
export declare const MessageSearchWithSuspense: React.NamedExoticComponent<MessageSearchProps>;
//# sourceMappingURL=message-search.d.ts.map