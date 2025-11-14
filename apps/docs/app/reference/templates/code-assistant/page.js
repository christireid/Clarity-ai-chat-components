import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Code Assistant Template | Clarity Chat',
    description: 'Specialized template for code assistance with syntax highlighting and code actions.'
};
export default function CodeAssistantTemplatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Code Assistant Template" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Specialized chat template for coding assistance with syntax highlighting, code execution, and diff viewing." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Multi-language syntax highlighting" }), _jsx("li", { children: "Copy code button on hover" }), _jsx("li", { children: "Code diff visualization" }), _jsx("li", { children: "File tree navigation" }), _jsx("li", { children: "Terminal integration" }), _jsx("li", { children: "Code explanation mode" }), _jsx("li", { children: "Refactoring suggestions" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { CodeAssistant } from '@clarity-chat/react/templates'

function App() {
  return (
    <CodeAssistant
      apiEndpoint="/api/code"
      defaultLanguage="typescript"
      enableCodeExecution
      enableDiffView
    />
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map