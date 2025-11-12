import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Empty State | Clarity Chat',
    description: 'Comprehensive empty state components for various scenarios with actions.'
};
export default function EmptyStatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Empty State" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Collection of empty state components for no data, search results, errors, success, and loading scenarios." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Available Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "EmptyState" }), " - Base component"] }), _jsxs("li", { children: [_jsx("strong", { children: "EmptyChatState" }), " - No messages"] }), _jsxs("li", { children: [_jsx("strong", { children: "NoSearchResultsState" }), " - No results"] }), _jsxs("li", { children: [_jsx("strong", { children: "NoConversationsState" }), " - No conversations"] }), _jsxs("li", { children: [_jsx("strong", { children: "NoFilesState" }), " - No files uploaded"] }), _jsxs("li", { children: [_jsx("strong", { children: "ErrorState" }), " - Error messages"] }), _jsxs("li", { children: [_jsx("strong", { children: "SuccessState" }), " - Success messages"] }), _jsxs("li", { children: [_jsx("strong", { children: "LoadingState" }), " - Loading spinner"] }), _jsxs("li", { children: [_jsx("strong", { children: "OfflineState" }), " - No connection"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { 
  EmptyChatState, 
  NoSearchResultsState,
  ErrorState 
} from '@clarity-chat/react'

// Empty chat
<EmptyChatState onStartChat={() => focusInput()} />

// No search results
<NoSearchResultsState 
  searchQuery="test"
  onClearSearch={() => setQuery('')}
/>

// Error state
<ErrorState 
  title="Failed to load"
  description="Could not fetch messages"
  onRetry={() => refetch()}
  onGoBack={() => router.back()}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Custom Empty State" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { EmptyState } from '@clarity-chat/react'

<EmptyState
  icon={<CustomIcon />}
  title="No items found"
  description="Try adjusting your filters"
  action={{
    label: "Reset Filters",
    onClick: resetFilters,
    variant: "primary"
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: openHelp
  }}
/>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Animated icon entrances" }), _jsx("li", { children: "Primary and secondary actions" }), _jsx("li", { children: "Customizable icons and messaging" }), _jsx("li", { children: "Smooth transitions" }), _jsx("li", { children: "Consistent styling across states" })] })] })] }));
}
//# sourceMappingURL=page.js.map