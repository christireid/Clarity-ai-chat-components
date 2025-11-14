import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Support Bot Template | Clarity Chat',
    description: 'Automated support bot template with FAQ handling and ticket routing.'
};
export default function SupportBotTemplatePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Support Bot Template" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Automated support chatbot with FAQ handling, intent detection, and smart ticket routing." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Intent classification" }), _jsx("li", { children: "FAQ auto-responses" }), _jsx("li", { children: "Smart ticket routing" }), _jsx("li", { children: "Business hours detection" }), _jsx("li", { children: "Multi-language support" }), _jsx("li", { children: "Sentiment analysis" }), _jsx("li", { children: "Escalation triggers" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { SupportBot } from '@clarity-chat/react/templates'

function App() {
  return (
    <SupportBot
      apiEndpoint="/api/bot"
      faqDatabase="/faqs"
      businessHours={{ start: 9, end: 17 }}
      enableSentimentAnalysis
    />
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map