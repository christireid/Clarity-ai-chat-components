'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ChatWindow } from '@clarity-chat/react';
import { CustomerForm } from '@/components/CustomerForm';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
export default function Home() {
    const { customer, setCustomer } = useStore();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Load conversation history
    useEffect(() => {
        if (customer?.conversationId) {
            loadConversationHistory(customer.conversationId);
        }
    }, [customer?.conversationId]);
    const loadConversationHistory = async (conversationId) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (data && !error) {
            const formattedMessages = data.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at).getTime(),
            }));
            setMessages(formattedMessages);
        }
    };
    const handleCustomerSubmit = async (data) => {
        // Create conversation in Supabase
        const { data: conversation, error } = await supabase
            .from('conversations')
            .insert({
            customer_email: data.email,
            customer_name: data.name,
            subject: data.subject,
            status: 'open',
            priority: 'medium',
        })
            .select()
            .single();
        if (conversation && !error) {
            setCustomer({
                email: data.email,
                name: data.name,
                conversationId: conversation.id,
            });
            // Add welcome message
            const welcomeMessage = {
                id: '1',
                role: 'assistant',
                content: `Hello ${data.name}! I'm here to help with "${data.subject}". How can I assist you today?`,
                timestamp: Date.now(),
            };
            // Save to Supabase
            await supabase.from('messages').insert({
                conversation_id: conversation.id,
                role: 'assistant',
                content: welcomeMessage.content,
            });
            setMessages([welcomeMessage]);
        }
    };
    const handleSendMessage = async (content) => {
        if (!customer?.conversationId)
            return;
        // Create user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
        // Save to Supabase
        await supabase.from('messages').insert({
            conversation_id: customer.conversationId,
            role: 'user',
            content,
        });
        setIsLoading(true);
        // Simulate AI response (replace with actual API call)
        setTimeout(async () => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thank you for your message. I understand you're asking about "${content.substring(0, 50)}..."\n\nLet me help you with that. [This would be replaced with actual AI response]`,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            // Save to Supabase
            await supabase.from('messages').insert({
                conversation_id: customer.conversationId,
                role: 'assistant',
                content: aiMessage.content,
            });
            // Update conversation timestamp
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', customer.conversationId);
            setIsLoading(false);
        }, 2000);
    };
    if (!customer) {
        return (_jsx("main", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '2rem',
            }, children: _jsx(CustomerForm, { onSubmit: handleCustomerSubmit }) }));
    }
    return (_jsxs("main", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
        }, children: [_jsxs("div", { style: {
                    width: '100%',
                    maxWidth: '900px',
                    marginBottom: '1rem',
                }, children: [_jsx("h1", { style: {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                        }, children: "Customer Support Chat" }), _jsxs("p", { style: {
                            color: 'var(--foreground)',
                            opacity: 0.7,
                            fontSize: '0.875rem',
                        }, children: ["Conversation with ", customer.name, " (", customer.email, ")"] })] }), _jsx("div", { style: {
                    width: '100%',
                    maxWidth: '900px',
                    height: '600px',
                    border: '1px solid rgba(128, 128, 128, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage }) })] }));
}
//# sourceMappingURL=page.js.map