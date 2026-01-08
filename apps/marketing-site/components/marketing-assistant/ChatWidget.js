'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from 'ai/react';
import { Sparkles, Shield, X, ArrowRight, ChevronRight } from 'lucide-react';
// Inline SVG icons for compatibility with lucide-react 0.400.0
const MessageCircleIcon = ({ className }) => (_jsx("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" }) }));
const UserIcon = ({ className }) => (_jsxs("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "8", r: "5" }), _jsx("path", { d: "M20 21a8 8 0 1 0-16 0" })] }));
const ChevronDownIcon = ({ className }) => (_jsx("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
export default function MarketingAssistant({ apiEndpoint = '/api/chat', initialMessage = "Hi! 👋 I'm Aura, your Clarity Chat specialist. Ask me about features, pricing, or how to get started!", title = 'Aura', subtitle = 'AI Specialist • Online', } = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [userApiKey, setUserApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const messagesEndRef = useRef(null);
    // Use Vercel AI SDK chat hook directly
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
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
    });
    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isLoading, error]);
    const customChatVariants = {
        initial: { opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            handleSubmit(e);
        }
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans", children: [_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { variants: customChatVariants, initial: "initial", animate: "animate", exit: "exit", transition: { type: 'spring', damping: 25, stiffness: 300 }, className: "mb-4 w-[350px] sm:w-[400px] h-[500px] bg-surface-900/95 backdrop-blur-xl border border-surface-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-white/5 bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-lg", children: _jsx(Sparkles, { className: "w-5 h-5 text-white" }) }), _jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-brand-500 rounded-full" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white text-sm", children: title }), _jsx("p", { className: "text-xs text-white/80", children: subtitle })] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setShowKeyInput(!showKeyInput), className: `p-2 rounded-lg transition-colors ${userApiKey ? 'text-white bg-white/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`, title: "Enter API Key", "aria-label": "Enter API Key", children: _jsx(Shield, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors", "aria-label": "Close Chat", children: _jsx(X, { className: "w-5 h-5" }) })] })] }), _jsx(AnimatePresence, { children: showKeyInput && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "bg-surface-800/50 border-b border-surface-700 overflow-hidden", children: _jsxs("div", { className: "p-3", children: [_jsx("label", { className: "text-[10px] uppercase text-surface-400 font-bold mb-1 block", children: "OpenAI API Key (Optional)" }), _jsx("input", { type: "password", placeholder: "sk-...", value: userApiKey, onChange: (e) => setUserApiKey(e.target.value), className: "w-full bg-surface-900 border border-surface-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-brand-500 outline-none" }), _jsx("p", { className: "text-[10px] text-surface-400 mt-1", children: userApiKey
                                                ? 'Key set! Using your custom key.'
                                                : 'Using default demo key.' })] }) })) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth", children: [messages.map((msg) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: [msg.role === 'assistant' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0", children: _jsx(Sparkles, { className: "w-4 h-4 text-brand-500" }) })), _jsx("div", { className: `max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-brand-500 text-white rounded-br-none shadow-md'
                                                : 'bg-surface-800 text-white border border-surface-700 rounded-bl-none shadow-sm'}`, children: msg.content }), msg.role === 'user' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0", children: _jsx(UserIcon, { className: "w-4 h-4 text-surface-400" }) }))] }, msg.id))), error && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex justify-center my-2", children: _jsxs("div", { className: "bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg max-w-[90%] text-center", children: [_jsx("span", { className: "font-bold block mb-1", children: "Error" }), error.message || 'Something went wrong. Please try again.'] }) })), isLoading && (_jsxs("div", { className: "flex gap-3 justify-start", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0", children: _jsx(Sparkles, { className: "w-4 h-4 text-brand-500" }) }), _jsxs("div", { className: "bg-surface-800 border border-surface-700 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("div", { className: "w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce", style: { animationDelay: '300ms' } })] })] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-3 bg-surface-800/30 border-t border-surface-700", children: _jsxs("form", { onSubmit: onSubmit, className: "relative flex items-center", children: [_jsx("input", { autoFocus: true, type: "text", value: input, onChange: handleInputChange, placeholder: "Ask anything...", className: "w-full bg-surface-900 border border-surface-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors placeholder:text-surface-500" }), _jsx("button", { type: "submit", disabled: !input.trim() || isLoading, className: "absolute right-2 p-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", "aria-label": "Send message", children: isLoading ? (_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsx(ArrowRight, { className: "w-4 h-4" })) })] }) })] })) }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setIsOpen(!isOpen), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: "group relative flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 focus:outline-none", "aria-label": isOpen ? 'Close Chat' : 'Open Chat', children: [!isOpen && (_jsx("span", { className: "absolute inset-0 rounded-full bg-brand-500 opacity-20 animate-ping" })), isOpen ? (_jsx(ChevronDownIcon, { className: "w-6 h-6" })) : (_jsx(MessageCircleIcon, { className: "w-6 h-6" })), _jsx(AnimatePresence, { children: isHovered && !isOpen && (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 }, className: "absolute right-16 top-1/2 -translate-y-1/2 bg-surface-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-700 whitespace-nowrap shadow-xl", children: ["Chat with ", title, _jsx("div", { className: "absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-surface-800 border-r border-b border-surface-700 rotate-[-45deg]" })] })) })] })] }));
}
//# sourceMappingURL=ChatWidget.js.map