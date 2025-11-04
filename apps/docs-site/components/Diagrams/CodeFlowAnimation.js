/**
 * Code Flow Animation
 *
 * Animated code execution with line-by-line highlighting
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
export function CodeFlowAnimation({ steps, title = 'Code Execution Flow' }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);
    const handlePlay = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(true);
    };
    const handlePause = () => {
        setIsPlaying(false);
    };
    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-bold", children: title }), _jsxs("div", { className: "flex gap-2", children: [!isPlaying ? (_jsxs("button", { onClick: handlePlay, className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2", children: [_jsx(Play, { className: "w-4 h-4" }), "Play"] })) : (_jsxs("button", { onClick: handlePause, className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2", children: [_jsx(Pause, { className: "w-4 h-4" }), "Pause"] })), _jsxs("button", { onClick: handleReset, className: "px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Reset"] })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsx("div", { className: "bg-slate-900 dark:bg-slate-950 rounded-xl border-2 border-slate-700 p-4 font-mono text-sm overflow-hidden", children: _jsx("div", { className: "space-y-1", children: steps.map((step, index) => (_jsx(motion.div, { className: `px-3 py-2 rounded transition-all ${index === currentStep
                                        ? 'bg-blue-600/30 border-l-4 border-blue-500'
                                        : index < currentStep
                                            ? 'bg-green-900/20'
                                            : 'opacity-50'}`, animate: {
                                        x: index === currentStep ? 4 : 0,
                                    }, transition: { duration: 0.2 }, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("span", { className: "text-gray-500 select-none w-6 text-right", children: step.line }), _jsx("span", { className: index <= currentStep ? 'text-green-400' : 'text-gray-500', children: step.code })] }) }, index))) }) }), _jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold", children: currentStep + 1 }), _jsxs("div", { className: "font-semibold", children: ["Step ", currentStep + 1, " of ", steps.length] })] }), _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 }, className: "text-sm text-gray-700 dark:text-gray-300", children: [_jsx("div", { className: "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-lg", children: steps[currentStep].explanation }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [Math.round(((currentStep + 1) / steps.length) * 100), "%"] })] }), _jsx("div", { className: "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-blue-500 to-blue-600", initial: { width: 0 }, animate: { width: `${((currentStep + 1) / steps.length) * 100}%` }, transition: { duration: 0.3 } }) })] })] }, currentStep) })] })] })] }) }));
}
// Example: useChat hook flow
export function UseChatFlowAnimation() {
    return (_jsx(CodeFlowAnimation, { title: "useChat Hook Execution", steps: [
            {
                line: 1,
                code: "const { messages, sendMessage } = useChat()",
                explanation: "Hook initializes with empty messages array and provides sendMessage function"
            },
            {
                line: 2,
                code: "sendMessage('Hello AI')",
                explanation: "User calls sendMessage with their message text"
            },
            {
                line: 3,
                code: "// Optimistic update",
                explanation: "Message immediately added to UI (optimistic) before API call"
            },
            {
                line: 4,
                code: "const response = await fetch('/api/chat')",
                explanation: "API request sent to backend endpoint"
            },
            {
                line: 5,
                code: "// Stream response tokens",
                explanation: "Response streams back token-by-token for real-time display"
            },
            {
                line: 6,
                code: "setMessages([...messages, aiResponse])",
                explanation: "AI response added to messages array, UI updates automatically"
            },
        ] }));
}
//# sourceMappingURL=CodeFlowAnimation.js.map