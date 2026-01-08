'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClarityChat } from '../../hooks/use-clarity-chat/use-clarity-chat';
import { springPresets, animationPresets } from '@clarity-chat/primitives';
import { Sparkles, Key, X, Bot, User, Loader2, Send, ChevronDown, MessageCircle, } from 'lucide-react';
export function FloatingChatWidget({ apiEndpoint = '/api/chat', initialMessage = "Hi! 👋 I'm Aura. Ask me anything!", title = 'Aura', subtitle = 'AI Specialist • Online', memoryConfig, optimizationConfig, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [userApiKey, setUserApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const messagesEndRef = useRef(null);
    // Use Clarity Chat Hook
    const { messages, input, setInput, handleSubmit, isLoading, error } = useClarityChat({
        api: apiEndpoint,
        body: {
            apiKey: userApiKey,
        },
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: initialMessage,
            },
        ],
        memory: memoryConfig,
        promptOptimization: optimizationConfig,
    });
    // Helper to extract text content from message
    const getMessageContent = (content) => {
        if (typeof content === 'string')
            return content;
        if (Array.isArray(content)) {
            return content
                .filter((part) => typeof part === 'object' && part !== null && part.type === 'text')
                .map((part) => part.text)
                .join('');
        }
        return String(content);
    };
    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isLoading, error]);
    // Use standardized animation variants from primitives
    // Using 'popover' preset for the chat window as it matches the behavior best
    const windowVariants = animationPresets.tooltip.variants; // Tooltip variants are simple fades/scales, good for chat
    // Custom variant combining slide-up with scale for a more "chat-like" entrance
    const customChatVariants = {
        initial: { opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans", children: [_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { variants: customChatVariants, initial: "initial", animate: "animate", exit: "exit", transition: springPresets.snappy, className: "mb-4 w-[350px] sm:w-[400px] h-[500px] bg-popover/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-white/5 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-lg", children: _jsx(Sparkles, { className: "w-5 h-5 text-white" }) }), _jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white text-sm", children: title }), _jsx("p", { className: "text-xs text-white/80", children: subtitle })] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setShowKeyInput(!showKeyInput), className: `p-2 rounded-lg transition-colors ${userApiKey ? 'text-white bg-white/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`, title: "Enter API Key", "aria-label": "Enter API Key", children: _jsx(Key, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors", "aria-label": "Close Chat", children: _jsx(X, { className: "w-5 h-5" }) })] })] }), _jsx(AnimatePresence, { children: showKeyInput && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "bg-muted/50 border-b border-border overflow-hidden", children: _jsxs("div", { className: "p-3", children: [_jsx("label", { className: "text-[10px] uppercase text-muted-foreground font-bold mb-1 block", children: "OpenAI API Key (Optional)" }), _jsx("input", { type: "password", placeholder: "sk-...", value: userApiKey, onChange: (e) => setUserApiKey(e.target.value), className: "w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:border-primary outline-none" }), _jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: userApiKey
                                                ? 'Key set! Using your custom key.'
                                                : 'Using default demo key.' })] }) })) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth", children: [messages.map((msg) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: [msg.role === 'assistant' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0", children: _jsx(Bot, { className: "w-4 h-4 text-primary" }) })), _jsx("div", { className: `max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
                                                : 'bg-muted text-foreground border border-border rounded-bl-none shadow-sm'}`, children: getMessageContent(msg.content) }), msg.role === 'user' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0", children: _jsx(User, { className: "w-4 h-4 text-muted-foreground" }) }))] }, msg.id))), error && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex justify-center my-2", children: _jsxs("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive text-xs px-3 py-2 rounded-lg max-w-[90%] text-center", children: [_jsx("span", { className: "font-bold block mb-1", children: "Error" }), error.message || 'Something went wrong. Please try again.'] }) })), isLoading && (_jsxs("div", { className: "flex gap-3 justify-start", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0", children: _jsx(Bot, { className: "w-4 h-4 text-primary" }) }), _jsxs("div", { className: "bg-muted border border-border rounded-2xl rounded-bl-none p-3 flex gap-1 items-center", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" }), _jsx("div", { className: "w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-100" }), _jsx("div", { className: "w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-200" })] })] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-3 bg-muted/30 border-t border-border", children: _jsxs("form", { onSubmit: handleSubmit, className: "relative flex items-center", children: [_jsx("input", { autoFocus: true, type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask anything...", className: "w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground" }), _jsx("button", { type: "submit", disabled: !input.trim() || isLoading, className: "absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", "aria-label": "Send message", children: isLoading ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Send, { className: "w-4 h-4" })) })] }) })] })) }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setIsOpen(!isOpen), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: "group relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 focus:outline-none", "aria-label": isOpen ? 'Close Chat' : 'Open Chat', children: [!isOpen && (_jsx("span", { className: "absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" })), isOpen ? (_jsx(ChevronDown, { className: "w-6 h-6" })) : (_jsx(MessageCircle, { className: "w-6 h-6" })), _jsx(AnimatePresence, { children: isHovered && !isOpen && (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 }, className: "absolute right-16 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border whitespace-nowrap shadow-xl", children: ["Chat with ", title, _jsx("div", { className: "absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-[-45deg]" })] })) })] })] }));
}
//# sourceMappingURL=floating-chat-widget.js.map