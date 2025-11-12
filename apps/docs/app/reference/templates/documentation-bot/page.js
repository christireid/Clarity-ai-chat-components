import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Documentation Bot Template | Clarity Chat',
    description: 'Interactive documentation assistant with semantic search and code examples.'
};
export default function DocumentationBotTemplatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Documentation Bot Template" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "AI-powered documentation assistant with semantic search, code examples, and contextual help." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Semantic documentation search" }), _jsx("li", { children: "Code example generation" }), _jsx("li", { children: "API reference lookups" }), _jsx("li", { children: "Version-aware responses" }), _jsx("li", { children: "Related docs suggestions" }), _jsx("li", { children: "Feedback collection" }), _jsx("li", { children: "Usage analytics" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { DocumentationBot } from '@clarity-chat/react/templates'

function App() {
  return (
    <DocumentationBot
      apiEndpoint="/api/docs"
      docsVersion="v2.0"
      enableCodeGeneration
      showRelatedDocs
    />
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map