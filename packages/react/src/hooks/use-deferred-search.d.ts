import type { Message } from '@clarity-chat/types';
/**
 * Hook for deferred search with React 18 concurrent features
 *
 * Uses useDeferredValue to defer expensive search operations,
 * keeping the UI responsive while searching through messages.
 *
 * @param messages - Array of messages to search through
 * @param searchQuery - Current search query
 * @returns Filtered messages and isPending state
 *
 * @example
 * ```tsx
 * const { filteredMessages, isPending } = useDeferredSearch(messages, searchQuery)
 *
 * return (
 *   <div>
 *     {isPending && <SearchingIndicator />}
 *     {filteredMessages.map(msg => <Message key={msg.id} {...msg} />)}
 *   </div>
 * )
 * ```
 */
export declare function useDeferredSearch(messages: Message[], searchQuery: string): {
    filteredMessages: Message[];
    isPending: boolean;
    searchQuery: string;
    deferredQuery: string;
};
//# sourceMappingURL=use-deferred-search.d.ts.map