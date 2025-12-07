import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Customer Support Template | Clarity Chat',
    description: 'Customer support chat template with ticket management and knowledge base integration.'
};
export default function CustomerSupportTemplatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Customer Support Template" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Complete customer support chat interface with ticket creation, knowledge base search, and agent handoff." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Ticket creation and tracking" }), _jsx("li", { children: "Knowledge base integration" }), _jsx("li", { children: "Agent handoff capability" }), _jsx("li", { children: "Customer information display" }), _jsx("li", { children: "Canned responses library" }), _jsx("li", { children: "Satisfaction ratings" }), _jsx("li", { children: "Conversation escalation" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { CustomerSupport } from '@clarity-chat/react/templates'

function App() {
  return (
    <CustomerSupport
      apiEndpoint="/api/support"
      knowledgeBaseUrl="/kb"
      enableAgentHandoff
      showCustomerInfo
    />
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map