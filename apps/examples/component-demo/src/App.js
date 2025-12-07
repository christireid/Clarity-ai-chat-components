import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Component Demo
 *
 * Comprehensive demonstration of Clarity Chat Components
 */
import { useState, useCallback } from 'react';
import { Button, Input, Card, Dialog, DialogContent, DialogHeader, DialogTitle, Tooltip, Badge, } from '@clarity-chat/primitives';
import { ChatInput, EmptyState, Message, ThinkingIndicator, ToastProvider, useToast, useAutoScroll, TokenCounter, NetworkStatus, useTokenTracker, ErrorBoundary, Progress, Skeleton, } from '@clarity-chat/react';
import '@clarity-chat/primitives/dist/index.css';
import '@clarity-chat/react/dist/styles/index.css';
function ComponentDemoApp() {
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    // Form state
    const [inputValue, setInputValue] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '' });
    // Chat state
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Hooks
    const toast = useToast();
    const { scrollRef } = useAutoScroll({ dependencies: [messages] });
    const { tokens: totalTokens, addMessage: addTokenMessage } = useTokenTracker({
        modelName: 'gpt-3.5-turbo'
    });
    const handleSend = useCallback(async () => {
        if (!inputValue.trim())
            return;
        const userMessage = {
            id: Date.now().toString(),
            chatId: 'demo',
            role: 'user',
            content: inputValue,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sent',
        };
        setMessages(prev => [...prev, userMessage]);
        const messageContent = inputValue;
        setInputValue('');
        setIsLoading(true);
        // Track tokens
        addTokenMessage({ role: 'user', content: messageContent });
        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiResponse = `I received your message: "${messageContent}". This is a demo response showcasing the Message component!`;
        const aiMessage = {
            id: (Date.now() + 1).toString(),
            chatId: 'demo',
            role: 'assistant',
            content: aiResponse,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sent',
        };
        setMessages(prev => [...prev, aiMessage]);
        addTokenMessage({ role: 'assistant', content: aiResponse });
        setIsLoading(false);
    }, [inputValue, addTokenMessage]);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Component Demo" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Common patterns with Clarity Chat Components" })] }), _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(TokenCounter, { currentTokens: totalTokens, maxTokens: 16000, costPerToken: 0.0000015, showCost: false, size: "sm" }), _jsx(NetworkStatus, {})] })] }) }) }), _jsxs("main", { className: "container mx-auto px-4 py-8", children: [_jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Buttons" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(Button, { variant: "default", children: "Default" }), _jsx(Button, { variant: "secondary", children: "Secondary" }), _jsx(Button, { variant: "outline", children: "Outline" }), _jsx(Button, { variant: "ghost", children: "Ghost" }), _jsx(Button, { variant: "destructive", children: "Destructive" }), _jsx(Button, { disabled: true, children: "Disabled" }), _jsx(Button, { size: "sm", children: "Small" }), _jsx(Button, { size: "lg", children: "Large" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Form Elements" }), _jsx(Card, { className: "p-6 max-w-md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Name" }), _jsx(Input, { placeholder: "Enter your name", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Email" }), _jsx(Input, { type: "email", placeholder: "your@email.com", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })) })] }), _jsx(Button, { className: "w-full", onClick: () => toast.success(`Welcome, ${formData.name || 'Guest'}!`, 'Form Submitted!'), children: "Submit Form" })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Cards" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Basic Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Simple card with shadow and border" })] }), _jsxs(Card, { className: "p-6 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-pointer", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Interactive Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Hover for lift effect" })] }), _jsxs(Card, { className: "p-6 ring-2 ring-primary", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Selected Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "With primary ring" })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Badges & Status" }), _jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [_jsx(Badge, { children: "Default" }), _jsx(Badge, { variant: "secondary", children: "Secondary" }), _jsx(Badge, { variant: "success", children: "Success" }), _jsx(Badge, { variant: "warning", children: "Warning" }), _jsx(Badge, { variant: "destructive", children: "Error" }), _jsx(Badge, { variant: "outline", children: "Outline" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Progress & Loading" }), _jsxs(Card, { className: "p-6 max-w-md space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Progress Bar" }), _jsx(Progress, { value: 65 }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "65% complete" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Loading Skeleton" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Dialog / Modal" }), _jsx(Button, { onClick: () => setDialogOpen(true), children: "Open Dialog" }), _jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Example Dialog" }) }), _jsx("p", { className: "text-sm text-muted-foreground py-4", children: "This is a modal dialog built with Clarity Chat primitives. It includes backdrop blur and smooth animations." }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: () => {
                                                        setDialogOpen(false);
                                                        toast.success('Dialog action was successful', 'Action Confirmed');
                                                    }, children: "Confirm" })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Tooltips" }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Tooltip, { content: "This is a helpful tooltip", children: _jsx(Button, { children: "Hover for tooltip" }) }), _jsx(Tooltip, { content: "Tooltips help provide context", side: "right", children: _jsx(Button, { variant: "outline", children: "Hover me too" }) })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Chat Interface" }), _jsx(Card, { className: "max-w-2xl", children: _jsxs("div", { className: "h-[400px] flex flex-col", children: [_jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 ? (_jsx(EmptyState, { icon: _jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), title: "No messages yet", description: "Send a message to start the conversation" })) : (messages.map((message) => (_jsx(Message, { message: message }, message.id)))), isLoading && _jsx(ThinkingIndicator, {})] }), _jsx("div", { className: "border-t border-border/50 p-4", children: _jsx(ChatInput, { value: inputValue, onChange: (value) => setInputValue(value), onSubmit: handleSend, placeholder: "Type your message...", disabled: isLoading }) })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Feature Grid" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
                                    { emoji: '🎨', title: 'Design System', desc: '50+ refined components' },
                                    { emoji: '⚡', title: 'Performance', desc: 'Optimized for speed' },
                                    { emoji: '♿', title: 'Accessible', desc: 'WCAG 2.1 AA compliant' },
                                    { emoji: '📱', title: 'Responsive', desc: 'Mobile-first design' },
                                ].map((feature, i) => (_jsxs(Card, { className: "p-6 text-center cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]", children: [_jsx("div", { className: "text-4xl mb-2", children: feature.emoji }), _jsx("h3", { className: "font-semibold mb-1", children: feature.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: feature.desc })] }, i))) })] })] })] }));
}
// Wrap in ErrorBoundary and ToastProvider
function App() {
    return (_jsx(ErrorBoundary, { fallback: (error) => (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs(Card, { className: "p-8 max-w-md text-center", children: [_jsx("h1", { className: "text-xl font-semibold text-destructive mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: error.message }), _jsx(Button, { onClick: () => window.location.reload(), children: "Reload Page" })] }) })), children: _jsx(ToastProvider, { children: _jsx(ComponentDemoApp, {}) }) }));
}
export default App;
//# sourceMappingURL=App.js.map