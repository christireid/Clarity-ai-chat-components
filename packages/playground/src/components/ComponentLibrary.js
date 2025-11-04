import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const categories = {
    'Getting Started': ['basic', 'streaming', 'conversation'],
    'Chat Components': ['chat-window', 'message-bubble', 'chat-input'],
    Controls: ['model-selector', 'token-counter'],
    Advanced: ['rag-pattern', 'function-calling'],
};
export function ComponentLibrary({ selectedTemplate, onTemplateChange, }) {
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider", children: "Templates" }), Object.entries(categories).map(([category, items]) => (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider", children: category }), _jsx("div", { className: "space-y-1", children: items.map((template) => {
                            const isSelected = selectedTemplate === template;
                            return (_jsx("button", { onClick: () => onTemplateChange(template), className: `
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${isSelected
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `, children: template
                                    .split('-')
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ') }, template));
                        }) })] }, category)))] }));
}
//# sourceMappingURL=ComponentLibrary.js.map