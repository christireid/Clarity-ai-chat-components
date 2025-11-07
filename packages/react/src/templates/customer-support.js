import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Customer Support Chat Template
 *
 * Pre-configured chat interface for customer support scenarios
 */
import { useState } from 'react';
import { ChatWindow } from '../components/chat-window';
import { ThemeProvider } from '../theme/ThemeProvider';
import { corporateTheme } from '../theme/presets';
/**
 * Customer Support Chat Template
 *
 * Features:
 * - Professional corporate theme
 * - FAQ quick responses
 * - Escalation to human agent
 * - Ticket creation
 * - Order lookup capabilities
 *
 * @example
 * ```tsx
 * <CustomerSupportTemplate
 *   companyName="Acme Corp"
 *   supportCategories={['Orders', 'Returns', 'Technical']}
 *   onEscalate={(conversation) => console.log('Escalate:', conversation)}
 * />
 * ```
 */
export function CustomerSupportTemplate({ companyName = 'Support', supportCategories = ['General', 'Orders', 'Technical', 'Billing'], faqs = [], onEscalate, apiEndpoint = '/api/support', }) {
    const chatId = 'customer-support-chat';
    const now = new Date();
    const [messages, setMessages] = useState([
        {
            id: '1',
            chatId,
            role: 'assistant',
            content: `Welcome to ${companyName} Support! How can I help you today?\n\nYou can ask me about:\n${supportCategories.map(cat => `• ${cat}`).join('\n')}`,
            status: 'sent',
            createdAt: now,
            updatedAt: now,
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendMessage = async (content) => {
        const timestamp = new Date();
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            chatId,
            role: 'user',
            content,
            status: 'sent',
            createdAt: timestamp,
            updatedAt: timestamp,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        // Check for escalation keywords
        const escalationKeywords = ['human', 'agent', 'representative', 'manager'];
        const needsEscalation = escalationKeywords.some(keyword => content.toLowerCase().includes(keyword));
        if (needsEscalation && onEscalate) {
            const escalationMessage = {
                id: (Date.now() + 1).toString(),
                chatId,
                role: 'assistant',
                content: 'I\'ll connect you with a human agent right away. Please wait a moment...',
                status: 'sent',
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: { type: 'escalation' },
            };
            setMessages(prev => [...prev, escalationMessage]);
            onEscalate([...messages, userMessage]);
            setIsLoading(false);
            return;
        }
        // Check FAQs
        const matchedFaq = faqs.find(faq => content.toLowerCase().includes(faq.question.toLowerCase()));
        if (matchedFaq) {
            const faqResponse = {
                id: (Date.now() + 1).toString(),
                chatId,
                role: 'assistant',
                content: matchedFaq.answer,
                status: 'sent',
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: { type: 'faq' },
            };
            setMessages(prev => [...prev, faqResponse]);
            setIsLoading(false);
            return;
        }
        try {
            // Call support API
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    category: detectCategory(content, supportCategories),
                    conversation: messages,
                }),
            });
            if (!response.ok)
                throw new Error('Support API error');
            const data = await response.json();
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                chatId,
                role: 'assistant',
                content: data.response || 'I understand your concern. Let me help you with that.',
                status: 'sent',
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: data.metadata,
            };
            setMessages(prev => [...prev, assistantMessage]);
        }
        catch (error) {
            // Fallback response
            const fallbackMessage = {
                id: (Date.now() + 1).toString(),
                chatId,
                role: 'assistant',
                content: 'I appreciate your patience. Let me look into that for you. Meanwhile, you can always request to speak with a human agent.',
                status: 'sent',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setMessages(prev => [...prev, fallbackMessage]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(ThemeProvider, { defaultTheme: corporateTheme, children: _jsx("div", { className: "customer-support-template", style: { height: '100%', width: '100%' }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage, emptyState: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "How can we help?" }), _jsx("div", { className: "grid gap-2 max-w-md mx-auto", children: supportCategories.map(category => (_jsx("button", { onClick: () => handleSendMessage(`I need help with ${category}`), className: "p-3 text-left rounded-lg border hover:bg-accent transition-colors", children: category }, category))) })] }) }) }) }));
}
function detectCategory(message, categories) {
    const lowerMessage = message.toLowerCase();
    for (const category of categories) {
        if (lowerMessage.includes(category.toLowerCase())) {
            return category;
        }
    }
    // Category-specific keywords
    if (lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
        return 'Orders';
    }
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        return 'Returns';
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('charge')) {
        return 'Billing';
    }
    if (lowerMessage.includes('broken') || lowerMessage.includes('not working')) {
        return 'Technical';
    }
    return 'General';
}
//# sourceMappingURL=customer-support.js.map