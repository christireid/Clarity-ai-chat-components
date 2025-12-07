import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Customer Support Chat Template
 *
 * Pre-configured chat interface for customer support scenarios
 */
import { useState, useCallback } from 'react';
import { ChatWindow } from '../components/chat-window';
import { ThemeProvider } from '../theme/ThemeProvider';
import { corporateTheme } from '../theme/presets';
import { useMessageOperations } from '../hooks/use-message-operations';
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
    // Use message operations hook
    const { messages: operationMessages, addMessage, editMessage, deleteMessage, undo, redo, canUndo, canRedo, } = useMessageOperations({
        initialMessages: [
            {
                id: '1',
                chatId,
                role: 'assistant',
                content: `Welcome to ${companyName} Support! How can I help you today?\n\nYou can ask me about:\n${supportCategories.map(cat => `• ${cat}`).join('\n')}`,
                timestamp: now.getTime(),
            },
        ],
        onEdit: (messageId, newContent) => {
            console.log('Message edited:', messageId, newContent);
        },
        onDelete: (messageId) => {
            console.log('Message deleted:', messageId);
        },
    });
    // Convert to Message format
    const messages = operationMessages.map(msg => ({
        id: msg.id,
        chatId,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp),
        updatedAt: new Date(msg.timestamp),
        status: 'sent',
    }));
    const [isLoading, setIsLoading] = useState(false);
    // Handle message operations
    const handleEdit = useCallback((messageId) => {
        const message = messages.find(m => m.id === messageId);
        if (!message)
            return;
        const newContent = prompt('Edit message:', message.content) || message.content;
        if (newContent !== message.content) {
            editMessage(messageId, newContent);
        }
    }, [messages, editMessage]);
    const handleDelete = useCallback((messageId) => {
        if (confirm('Delete this message?')) {
            deleteMessage(messageId);
        }
    }, [deleteMessage]);
    const handleSendMessage = async (content) => {
        // Add user message using operations hook
        addMessage({
            chatId,
            role: 'user',
            content,
            timestamp: Date.now(),
        });
        setIsLoading(true);
        // Check for escalation keywords
        const escalationKeywords = ['human', 'agent', 'representative', 'manager'];
        const needsEscalation = escalationKeywords.some(keyword => content.toLowerCase().includes(keyword));
        if (needsEscalation && onEscalate) {
            addMessage({
                chatId,
                role: 'assistant',
                content: 'I\'ll connect you with a human agent right away. Please wait a moment...',
                timestamp: Date.now(),
            });
            onEscalate(messages);
            setIsLoading(false);
            return;
        }
        // Check FAQs
        const matchedFaq = faqs.find(faq => content.toLowerCase().includes(faq.question.toLowerCase()));
        if (matchedFaq) {
            addMessage({
                chatId,
                role: 'assistant',
                content: matchedFaq.answer,
                timestamp: Date.now(),
            });
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
            addMessage({
                chatId,
                role: 'assistant',
                content: data.response || 'I understand your concern. Let me help you with that.',
                timestamp: Date.now(),
            });
        }
        catch (_error) {
            // Fallback response
            addMessage({
                chatId,
                role: 'assistant',
                content: 'I appreciate your patience. Let me look into that for you. Meanwhile, you can always request to speak with a human agent.',
                timestamp: Date.now(),
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleExport = () => {
        const text = messages.map(m => `${m.role === 'user' ? 'Customer' : 'Support'}: ${m.content}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `support-conversation-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsx(ThemeProvider, { defaultTheme: corporateTheme, children: _jsx("div", { className: "customer-support-template", style: { height: '100%', width: '100%' }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage, onEditMessage: handleEdit, onDeleteMessage: handleDelete, onExport: handleExport, emptyState: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "How can we help?" }), _jsx("div", { className: "grid gap-2 max-w-md mx-auto", children: supportCategories.map(category => (_jsx("button", { onClick: () => handleSendMessage(`I need help with ${category}`), className: "p-3 text-left rounded-lg border hover:bg-accent transition-colors", children: category }, category))) })] }) }) }) }));
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