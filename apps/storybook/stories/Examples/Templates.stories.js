import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SupportBot, CodeAssistant, CustomerSupportTemplate, AIAssistantTemplate, CreativeWritingTemplate, DataAnalystTemplate, DocumentationBotTemplate, SalesAssistantTemplate, EducationTutorTemplate, CodeHelperTemplate, } from '@clarity-chat/react';
const meta = {
    title: 'Examples/Templates',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Pre-built chat templates optimized for specific use cases.',
            },
        },
        layout: 'fullscreen',
    },
};
export default meta;
export const SupportBotDefault = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(SupportBot, { onEscalate: () => {
                alert('Connecting to human agent...');
            } }) })),
};
export const SupportBotCustomized = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(SupportBot, { botName: "ShopBot", welcomeMessage: "\uD83D\uDC4B Hi! I'm ShopBot. How can I help you with your order today?", quickReplies: [
                { text: '📦 Track my order', action: 'track_order' },
                { text: '💰 Refund request', action: 'refund' },
                { text: '📧 Contact email', action: 'contact' },
                { text: '❓ FAQs', action: 'faqs' },
                { text: '👤 Speak to agent', action: 'escalate' },
            ], escalationThreshold: 3, onEscalate: () => {
                console.log('Escalating to human agent');
                alert('A support specialist will be with you shortly...');
            } }) })),
};
export const SupportBotWithKnowledgeBase = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(SupportBot, { botName: "HelpDesk AI", welcomeMessage: "Hello! I'm here to help with your account questions.", knowledgeBase: [
                {
                    question: 'How do I reset my password?',
                    answer: 'To reset your password:\n1. Click "Forgot Password" on the login page\n2. Enter your email address\n3. Check your email for the reset link\n4. Create a new secure password',
                    keywords: ['password', 'reset', 'login', 'forgot', 'cant access'],
                },
                {
                    question: 'How do I update my billing information?',
                    answer: 'You can update your billing information by:\n1. Going to Settings > Billing\n2. Click "Update Payment Method"\n3. Enter your new card details\n4. Click "Save Changes"',
                    keywords: ['billing', 'payment', 'credit card', 'update', 'change'],
                },
                {
                    question: 'How do I cancel my subscription?',
                    answer: 'To cancel your subscription:\n1. Go to Settings > Subscription\n2. Click "Cancel Subscription"\n3. Select a cancellation reason (optional)\n4. Confirm cancellation\n\nYou\'ll retain access until the end of your billing period.',
                    keywords: ['cancel', 'subscription', 'unsubscribe', 'stop billing'],
                },
            ], escalationThreshold: 5 }) })),
};
export const CodeAssistantDefault = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeAssistant, {}) })),
};
export const CodeAssistantWithContext = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeAssistant, { assistantName: "CodeHelper", codeContext: `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}`, supportedLanguages: ['javascript', 'typescript', 'python', 'rust'] }) })),
};
export const CodeAssistantWithExecution = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeAssistant, { assistantName: "JavaScript Runner", enableExecution: true, onExecuteCode: async (code, language) => {
                try {
                    // Simple JavaScript evaluation (in production, use a sandbox!)
                    if (language === 'javascript' || language === 'typescript') {
                        const result = eval(code);
                        return `Output: ${result}`;
                    }
                    return 'Execution only supported for JavaScript';
                }
                catch (error) {
                    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }, onCopyCode: (code) => {
                navigator.clipboard.writeText(code);
                alert('Code copied to clipboard!');
            } }) })),
};
export const CodeAssistantPython = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeAssistant, { assistantName: "Python Assistant", supportedLanguages: ['python', 'numpy', 'pandas'], codeContext: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`, enableSuggestions: true }) })),
};
export const CodeAssistantTypeScript = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeAssistant, { assistantName: "TypeScript Guru", supportedLanguages: ['typescript', 'javascript', 'react'], codeContext: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUserById(users: User[], id: number): User | undefined {
  return users.find(user => user.id === id)
}` }) })),
};
export const CustomerSupportTemplateDefault = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CustomerSupportTemplate, { companyName: "Clarity Chat", supportCategories: ['Onboarding', 'Billing', 'Security'], faqs: [
                {
                    question: 'How do I add the chat widget to my product?',
                    answer: 'Install the @clarity-chat/react package and drop the <ChatWindow /> component into your page.',
                },
                {
                    question: 'Do you support SOC 2 compliance?',
                    answer: 'Yes, our enterprise plan includes SOC 2 Type II controls and audit documentation.',
                },
            ] }) })),
};
export const AIAssistantTemplateShowcase = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(AIAssistantTemplate, { enableContextManagement: true, systemPrompt: "You are Clarity, an expert product strategist.", defaultModel: "gpt-4-turbo-preview" }) })),
};
export const CreativeWritingTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CreativeWritingTemplate, { systemPrompt: "You write vibrant launch copy with strong narrative arcs." }) })),
};
export const DataAnalystTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(DataAnalystTemplate, { systemPrompt: "You are a data analyst focused on SaaS revenue metrics.", enableContextManagement: false }) })),
};
export const SalesAssistantTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(SalesAssistantTemplate, { defaultPersona: "account-executive", playbooks: [
                {
                    id: 'meddpicc',
                    name: 'MEDDPICC Discovery',
                    steps: ['Metrics', 'Economic Buyer', 'Decision Criteria'],
                },
            ] }) })),
};
export const EducationTutorTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(EducationTutorTemplate, { systemPrompt: "You are a patient calculus tutor helping students understand derivatives." }) })),
};
export const CodeHelperTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(CodeHelperTemplate, { languages: ['typescript', 'python', 'go'] }) })),
};
export const DocumentationBotTemplateStory = {
    render: () => (_jsx("div", { className: "h-screen", children: _jsx(DocumentationBotTemplate, { companyName: "Docs.ai", supportCategories: ['API Reference', 'Auth', 'Billing'] }) })),
};
export const ComparisonView = {
    render: () => (_jsxs("div", { className: "grid grid-cols-2 gap-4 h-screen p-4", children: [_jsxs("div", { className: "border border-gray-300 rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-blue-600 text-white p-3 font-semibold", children: "Support Bot Template" }), _jsx("div", { className: "h-[calc(100%-48px)]", children: _jsx(SupportBot, { botName: "Support Assistant", onEscalate: () => alert('Escalating...') }) })] }), _jsxs("div", { className: "border border-gray-300 rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-purple-600 text-white p-3 font-semibold", children: "Code Assistant Template" }), _jsx("div", { className: "h-[calc(100%-48px)]", children: _jsx(CodeAssistant, { assistantName: "Code Helper", codeContext: "// Your code here" }) })] })] })),
};
//# sourceMappingURL=Templates.stories.js.map