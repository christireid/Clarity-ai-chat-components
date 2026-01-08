'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durations } from '@/lib/constants';
import { useReducedMotion } from '@/lib/animations';
import { Check, Copy, Brain, Users, Sparkles, Zap, Cpu, Code, Shield, Star, } from 'lucide-react';
// --- Syntax Highlighting Colors ---
const COLORS = {
    keyword: '#ff7b72', // Pink/Red for import, export, return
    function: '#d2a8ff', // Purple for function names
    string: '#a5d6ff', // Light blue for strings
    component: '#7ee787', // Green for components
    comment: '#8b949e', // Grey for comments
    normal: '#c9d1d9', // White/Grey for normal text
    prop: '#79c0ff', // Blue for props
    background: '#0d1117', // GitHub Dark Dimmed
};
const ChatMessage = ({ role, content, isStreaming = false, }) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`, children: [role === 'assistant' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-clarity-500 to-cosmic-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-clarity-500/20", children: _jsx(Brain, { className: "w-4 h-4 text-white" }) })), _jsxs("div", { className: `max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${role === 'user'
                ? 'bg-surface-800 text-white rounded-br-none border border-surface-700'
                : 'bg-surface-700 text-gray-100 rounded-bl-none border border-surface-600'}`, children: [content, isStreaming && (_jsx("span", { className: "inline-block w-1.5 h-4 ml-1 align-middle bg-clarity-400 animate-pulse" }))] }), role === 'user' && (_jsx("div", { className: "w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center flex-shrink-0 border border-surface-600", children: _jsx(Users, { className: "w-4 h-4 text-gray-400" }) }))] }));
const DemoSteps = [
    {
        id: 'basic',
        label: 'Basic Chat',
        icon: Zap,
        description: 'Get started in seconds.',
        lines: [
            {
                text: "import { ClarityChat } from '@clarity-chat/react'",
                type: 'import',
            },
            { text: '', type: 'normal' },
            { text: 'export default function App() {', type: 'function' },
            { text: '  return (', type: 'normal' },
            { text: '    <ClarityChat ', type: 'component' },
            { text: '      apiKey="sk-..." ', type: 'prop' },
            { text: '    />', type: 'component' },
            { text: '  )', type: 'normal' },
            { text: '}', type: 'function' },
        ],
        chatState: (_jsxs(_Fragment, { children: [_jsx(ChatMessage, { role: "user", content: "Hello, how does this work?" }), _jsx(ChatMessage, { role: "assistant", content: "I am a basic instance of Clarity Chat. I process text input using the standard provider configuration." })] })),
    },
    {
        id: 'memory',
        label: 'Smart Memory',
        icon: Brain,
        description: 'Persist context automatically.',
        lines: [
            {
                text: "import { ClarityChat, useMemory } from '@clarity-chat/react'",
                type: 'import',
            },
            { text: '', type: 'normal' },
            { text: 'export default function App() {', type: 'function' },
            { text: '  const memory = useMemory()', type: 'normal' },
            { text: '  return (', type: 'normal' },
            { text: '    <ClarityChat ', type: 'component' },
            { text: '      memory={memory}', type: 'prop' },
            { text: '      contextWindow={4096}', type: 'prop' },
            { text: '    />', type: 'component' },
            { text: '  )', type: 'normal' },
            { text: '}', type: 'function' },
        ],
        chatState: (_jsxs(_Fragment, { children: [_jsx(ChatMessage, { role: "user", content: "My name is Sarah." }), _jsx(ChatMessage, { role: "assistant", content: "Nice to meet you, Sarah! I've saved that to my memory." }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "my-4 mx-auto max-w-xs bg-surface-900 rounded-lg border border-surface-700 p-2 text-xs font-mono text-gray-400 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), _jsxs("span", { children: ["Memory Updated: ", `{ "name": "Sarah" }`] })] }), _jsx(ChatMessage, { role: "user", content: "What's my name?" }), _jsx(ChatMessage, { role: "assistant", content: "Your name is Sarah." })] })),
    },
    {
        id: 'streaming',
        label: 'Streaming UI',
        icon: Sparkles,
        description: '60fps token streaming.',
        lines: [
            {
                text: "import { ClarityChat } from '@clarity-chat/react'",
                type: 'import',
            },
            { text: '', type: 'normal' },
            { text: 'export default function App() {', type: 'function' },
            { text: '  return (', type: 'normal' },
            { text: '    <ClarityChat ', type: 'component' },
            { text: '      stream={true}', type: 'prop' },
            { text: '      theme="cyberpunk"', type: 'prop' },
            { text: '      animation="smooth"', type: 'prop' },
            { text: '    />', type: 'component' },
            { text: '  )', type: 'normal' },
            { text: '}', type: 'function' },
        ],
        chatState: (_jsxs(_Fragment, { children: [_jsx(ChatMessage, { role: "user", content: "Write a haiku about code." }), _jsx(ChatMessage, { role: "assistant", content: "Logic flows like water,\\n bugs hide in the deep dark depths,\\n coffee fuels the mind.", isStreaming: true })] })),
    },
];
export default function SplitScreenDemo() {
    const [activeStep, setActiveStep] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    // Auto-advance
    useEffect(() => {
        if (isPaused)
            return;
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % DemoSteps.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isPaused]);
    const handleCopy = () => {
        // Construct raw code string from lines
        const code = DemoSteps[activeStep].lines.map((l) => l.text).join('\n');
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full max-w-6xl mx-auto", onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), children: [_jsxs("div", { className: "relative rounded-xl overflow-hidden bg-[#0d1117] border border-surface-700 shadow-2xl shadow-black/50 flex flex-col h-[450px] group", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-surface-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-[#ff5f56]" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-[#ffbd2e]" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-[#27c93f]" })] }), _jsx("div", { className: "ml-4 px-3 py-1 bg-[#0d1117] rounded-t-md text-xs text-gray-300 font-mono border-t border-l border-r border-surface-700 relative top-2.5", children: "App.tsx" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-[10px] text-gray-500 uppercase font-semibold tracking-wider mr-2", children: isPaused ? 'Paused' : 'Auto-Play' }), _jsx("button", { onClick: handleCopy, className: "text-gray-400 hover:text-white transition-colors p-1 hover:bg-surface-700 rounded", children: copied ? (_jsx(Check, { className: "w-3.5 h-3.5" })) : (_jsx(Copy, { className: "w-3.5 h-3.5" })) })] })] }), _jsxs("div", { className: "p-4 overflow-auto flex-1 font-mono text-sm leading-7 relative", children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-surface-800 text-right pr-3 pt-4 text-gray-600 select-none", children: Array.from({ length: 12 }).map((_, i) => (_jsx("div", { children: i + 1 }, i))) }), _jsx("div", { className: "pl-10", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, transition: { duration: durations.normal }, children: DemoSteps[activeStep].lines.map((line, idx) => (_jsx("div", { className: "whitespace-pre", children: _jsx("span", { style: {
                                                    color: line.type === 'import'
                                                        ? COLORS.keyword
                                                        : line.type === 'function'
                                                            ? COLORS.function
                                                            : line.type === 'component'
                                                                ? COLORS.component
                                                                : line.type === 'prop'
                                                                    ? COLORS.prop
                                                                    : COLORS.normal,
                                                }, children: line.text }) }, idx))) }, activeStep) }) })] }), _jsxs("div", { className: "bg-[#161b22] border-t border-surface-700 px-3 py-1 flex items-center justify-between text-[10px] text-gray-400 font-mono select-none", children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Code, { className: "w-3 h-3" }), " READY"] }), _jsx("div", { children: "master*" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { children: "Ln 9, Col 1" }), _jsx("div", { children: "UTF-8" }), _jsx("div", { children: "TypeScript React" })] })] })] }), _jsxs("div", { className: "relative rounded-xl overflow-hidden bg-surface-950 border border-surface-700 shadow-2xl shadow-clarity-500/10 flex flex-col h-[450px]", children: [_jsxs("div", { className: "h-14 border-b border-surface-800 flex items-center px-4 bg-surface-900/80 backdrop-blur-md justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-green-500" }), _jsx("div", { className: "absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold text-white", children: "Clarity Assistant" }), _jsx("div", { className: "text-[10px] text-gray-400", children: "Always online" })] })] }), _jsx("div", { className: "flex gap-1", children: DemoSteps.map((step, idx) => {
                                    const isActive = activeStep === idx;
                                    const Icon = step.icon;
                                    return (_jsx("button", { onClick: () => setActiveStep(idx), className: `p-1.5 rounded-lg transition-all ${isActive ? 'bg-surface-800 text-clarity-400' : 'text-gray-600 hover:text-gray-400'}`, title: step.label, children: _jsx(Icon, { className: "w-4 h-4" }) }, step.id));
                                }) })] }), _jsxs("div", { className: "flex-1 p-4 bg-surface-950 overflow-y-auto relative scroll-smooth", children: [_jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_10%)]" }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 }, transition: { duration: durations.moderate }, className: "relative z-10 flex flex-col justify-end min-h-full pb-2", children: DemoSteps[activeStep].chatState }, activeStep) })] }), _jsx("div", { className: "p-4 border-t border-surface-800 bg-surface-900/50 backdrop-blur-sm", children: _jsxs("div", { className: "h-11 rounded-xl bg-surface-800/50 border border-surface-700 flex items-center px-4 text-sm text-gray-500 shadow-inner", children: [_jsx("span", { className: "animate-pulse", children: "|" }), _jsx("span", { className: "ml-1", children: "Type a message..." })] }) })] })] }));
}
//# sourceMappingURL=SplitScreenDemo.js.map