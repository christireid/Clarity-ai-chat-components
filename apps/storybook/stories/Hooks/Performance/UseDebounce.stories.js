import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDebounce } from '@clarity-chat/react';
import { useState, useEffect } from 'react';
/**
 * **useDebounce Hook**
 *
 * Hook for debouncing values - only updates after delay has passed
 * since last change. Useful for reducing API calls during rapid input.
 *
 * **Key Features:**
 * - Debounce value updates
 * - Configurable delay
 * - Prevents excessive updates
 * - Automatic cleanup
 *
 * **Use Cases:**
 * - Search input with API calls
 * - Form validation
 * - Auto-save functionality
 * - Filtering large lists
 */
const meta = {
    title: 'Hooks/Performance/UseDebounce',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useDebounce\` hook delays value updates until after a specified
delay has passed since the last change. This is useful for reducing
the frequency of expensive operations like API calls.

## Features

- ✅ Debounce value updates
- ✅ Configurable delay
- ✅ Prevents excessive updates
- ✅ Automatic cleanup
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // Only fires 500ms after user stops typing
  searchAPI(debouncedSearch)
}, [debouncedSearch])
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function SearchDemo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [delay, setDelay] = useState(500);
    const debouncedSearch = useDebounce(searchTerm, delay);
    const [apiCalls, setApiCalls] = useState(0);
    useEffect(() => {
        if (debouncedSearch) {
            setApiCalls((prev) => prev + 1);
            console.log('API call with:', debouncedSearch);
        }
    }, [debouncedSearch]);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Search (debounced):" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Type to search...", className: "w-full p-2 border rounded-lg" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Debounce Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "100", max: "2000", step: "100" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Current Input:" }), " ", searchTerm || '(empty)'] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Debounced Value:" }), " ", debouncedSearch || '(empty)'] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "API Calls Made:" }), " ", apiCalls] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Notice how API calls only happen after you stop typing for ", delay, "ms"] })] })] }));
}
export const SearchInput = {
    render: () => _jsx(SearchDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Debouncing search input to reduce API calls while user is typing.',
            },
        },
    },
};
function AutoSaveDemo() {
    const [content, setContent] = useState('');
    const [delay, setDelay] = useState(1000);
    const debouncedContent = useDebounce(content, delay);
    const [saves, setSaves] = useState(0);
    const [lastSaved, setLastSaved] = useState(null);
    useEffect(() => {
        if (debouncedContent && debouncedContent !== content) {
            // Simulate auto-save
            setSaves((prev) => prev + 1);
            setLastSaved(new Date().toLocaleTimeString());
            console.log('Auto-saving:', debouncedContent);
        }
    }, [debouncedContent]);
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Document Content:" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "Type your content here...", className: "w-full p-2 border rounded-lg resize-none", rows: 6 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Auto-save Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "500", max: "5000", step: "500" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Current Content Length:" }), " ", content.length, " characters"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Debounced Content Length:" }), " ", debouncedContent.length, " characters"] }), _jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Auto-saves Completed:" }), " ", saves] }), lastSaved && (_jsxs("div", { className: "text-sm text-green-600 dark:text-green-400", children: ["\u2713 Last saved at: ", lastSaved] })), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Content will auto-save ", delay, "ms after you stop typing"] })] })] }));
}
export const AutoSave = {
    render: () => _jsx(AutoSaveDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using debounce for auto-save functionality that saves after user stops typing.',
            },
        },
    },
};
function FilterDemo() {
    const [filter, setFilter] = useState('');
    const [delay, setDelay] = useState(300);
    const debouncedFilter = useDebounce(filter, delay);
    const items = [
        'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
        'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
        'Mango', 'Orange', 'Papaya', 'Quince', 'Raspberry',
    ];
    const filteredItems = debouncedFilter
        ? items.filter((item) => item.toLowerCase().includes(debouncedFilter.toLowerCase()))
        : items;
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Filter Items:" }), _jsx("input", { type: "text", value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Type to filter...", className: "w-full p-2 border rounded-lg" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Debounce Delay (ms):" }), _jsx("input", { type: "number", value: delay, onChange: (e) => setDelay(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "0", max: "1000", step: "100" })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: [_jsxs("div", { className: "text-sm mb-2", children: [_jsx("strong", { children: "Current Filter:" }), " ", filter || '(none)'] }), _jsxs("div", { className: "text-sm mb-4", children: [_jsx("strong", { children: "Debounced Filter:" }), " ", debouncedFilter || '(none)'] }), _jsxs("div", { className: "text-sm font-medium mb-2", children: ["Results (", filteredItems.length, "):"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: filteredItems.map((item) => (_jsx("span", { className: "px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm", children: item }, item))) })] })] }));
}
export const Filtering = {
    render: () => _jsx(FilterDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Debouncing filter input to reduce re-renders while user is typing.',
            },
        },
    },
};
//# sourceMappingURL=UseDebounce.stories.js.map