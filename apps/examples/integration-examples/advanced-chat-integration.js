import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Chat Integration Example
 *
 * Demonstrates a full-featured chat implementation with all enhancements.
 * This example shows how to use all the blueprint features together.
 *
 * Features:
 * - Enhanced markdown rendering (KaTeX, Mermaid)
 * - Prompt suggestions
 * - Advanced search and filtering
 * - Batch export
 * - Message metadata display
 * - IndexedDB persistence
 * - Configuration builder
 */
import * as React from 'react';
import { ChatWindow, ThemeProvider, themes, useChat, useMessageHistory, usePromptSuggestions, EnhancedMarkdownRenderer, PromptSuggestions, AdvancedMessageSearch, BatchExportDialog, MessageMetadata, createChatConfig, } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
export function AdvancedChatIntegration() {
    const [showBatchExport, setShowBatchExport] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredMessages, setFilteredMessages] = React.useState([]);
    // Configuration using builder pattern
    const config = React.useMemo(() => createChatConfig()
        .withStreaming({
        provider: 'openai',
        endpoint: '/api/chat/stream',
        retryPolicy: 'exponential',
    })
        .withAccessibility({
        screenReader: true,
        keyboardShortcuts: true,
    })
        .withPersistence({
        storage: 'indexeddb',
        maxHistory: 1000,
        autoSave: true,
    })
        .withMarkdown({
        enableKaTeX: true,
        enableMermaid: true,
        enableSyntaxHighlight: true,
    })
        .withSearch({
        enableFuzzySearch: true,
        enableAdvancedFilters: true,
    })
        .build(), []);
    // Message history with persistence
    const { messages, paginatedMessages, save, load, search, } = useMessageHistory({
        conversationId: 'advanced-chat-1',
        enablePagination: true,
        pageSize: 50,
        autoSave: true,
    });
    // Chat operations
    const { sendMessage, isLoading } = useChat({
        initialMessages: messages,
    });
    // Prompt suggestions
    const suggestions = usePromptSuggestions(messages, {
        maxSuggestions: 6,
        suggestionType: 'follow-up',
    });
    // Load messages on mount
    React.useEffect(() => {
        load();
    }, [load]);
    // Handle search
    React.useEffect(() => {
        if (searchQuery) {
            const results = search(searchQuery);
            setFilteredMessages(results);
        }
        else {
            setFilteredMessages(messages);
        }
    }, [searchQuery, messages, search]);
    const handleExport = async (options) => {
        console.log('Exporting:', options);
        // Implement export logic
    };
    return (_jsx(ThemeProvider, { theme: themes.ocean, children: _jsxs("div", { className: "flex flex-col h-screen", children: [_jsx("div", { className: "p-4 border-b", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Advanced Chat" }), _jsx("div", { className: "flex-1 max-w-md", children: _jsx(AdvancedMessageSearch, { messages: messages, onResultsChange: setFilteredMessages, enableAdvancedFilters: true, showFilterCount: true }) }), _jsx("button", { onClick: () => setShowBatchExport(true), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Export" })] }) }), _jsxs(ChatWindow, { className: "flex-1", children: [_jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: filteredMessages.map((message) => (_jsxs("div", { className: "space-y-2", children: [message.role === 'assistant' ? (_jsx(EnhancedMarkdownRenderer, { content: message.content, config: config.markdown, isStreaming: message.status === 'streaming' })) : (_jsx("p", { children: message.content })), _jsx(MessageMetadata, { message: message, showCost: true, showResponseTime: true, showConfidence: true, showTokens: true, showModel: true })] }, message.id))) }), suggestions.length > 0 && (_jsx("div", { className: "p-4 border-t", children: _jsx(PromptSuggestions, { suggestions: suggestions, onSelect: (suggestion) => sendMessage(suggestion.text), layout: "chips" }) })), _jsx("div", { className: "p-4 border-t", children: _jsx(ChatInput, { onSendMessage: async (content) => {
                                    await sendMessage(content);
                                    await save();
                                }, disabled: isLoading }) })] }), _jsx(BatchExportDialog, { open: showBatchExport, onOpenChange: setShowBatchExport, resources: [
                        {
                            id: 'conv-1',
                            name: 'Current Conversation',
                            type: 'chat',
                            messageCount: messages.length,
                        },
                    ], onExport: handleExport })] }) }));
}
export default AdvancedChatIntegration;
//# sourceMappingURL=advanced-chat-integration.js.map