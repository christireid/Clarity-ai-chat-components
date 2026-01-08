'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { durations } from '@/lib/constants';
import { useReducedMotion } from '@/lib/animations';
const codeExamples = [
    {
        title: 'Quick Start',
        description: 'Get started with just 3 lines of code',
        code: `import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return <ClarityChat apiKey={process.env.OPENAI_KEY} />
}`,
    },
    {
        title: 'With Memory',
        description: 'Add intelligent context management',
        code: `import { ClarityChat, useMemory } from '@clarity-chat/react'

export default function App() {
  const memory = useMemory({ strategy: 'sliding-window' })

  return (
    <ClarityChat
      apiKey={process.env.OPENAI_KEY}
      memory={memory}
    />
  )
}`,
    },
    {
        title: 'Multi-Provider',
        description: 'Switch between AI providers seamlessly',
        code: `import { ClarityChat, useProvider } from '@clarity-chat/react'

export default function App() {
  const provider = useProvider({
    providers: ['openai', 'anthropic', 'gemini'],
    fallback: 'anthropic'
  })

  return <ClarityChat provider={provider} />
}`,
    },
    {
        title: 'Token Optimization',
        description: 'Reduce API costs by 40%+',
        code: `import { ClarityChat, useTokenOptimizer } from '@clarity-chat/react'

export default function App() {
  const optimizer = useTokenOptimizer({
    kvCacheAlignment: true,
    contextCompression: true,
    maxTokens: 4096
  })

  return <ClarityChat optimizer={optimizer} />
}`,
    },
];
// Simple syntax highlighter
function highlightCode(code) {
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
        const tokens = [];
        let remaining = line;
        let key = 0;
        // Patterns for highlighting
        const patterns = [
            // Strings
            {
                regex: /^('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/,
                className: 'text-emerald-400',
            },
            // Comments
            { regex: /^(\/\/.*)/, className: 'text-gray-500 italic' },
            // Keywords
            {
                regex: /^(import|export|default|from|const|let|var|function|return|if|else)\b/,
                className: 'text-purple-400',
            },
            // React/Next keywords
            { regex: /^(use[A-Z]\w*)\b/, className: 'text-pink-400' },
            // Components/Types
            { regex: /^(<\/?[A-Z]\w*)/, className: 'text-clarity-400' },
            // JSX closing tag
            { regex: /^(\/>|>)/, className: 'text-gray-400' },
            // Properties
            { regex: /^([a-zA-Z_]\w*)\s*[:=]/, className: 'text-orange-400' },
            // Braces and operators
            { regex: /^([{}()[\].,;:=<>+\-*/&|!?]+)/, className: 'text-gray-400' },
            // Numbers
            { regex: /^(\d+)/, className: 'text-orange-300' },
            // Environment variables
            { regex: /^(process\.env\.\w+)/, className: 'text-yellow-400' },
            // Identifiers
            { regex: /^([a-zA-Z_]\w*)/, className: 'text-gray-200' },
            // Whitespace
            { regex: /^(\s+)/, className: '' },
        ];
        while (remaining.length > 0) {
            let matched = false;
            for (const { regex, className } of patterns) {
                const match = remaining.match(regex);
                if (match) {
                    tokens.push(_jsx("span", { className: className, children: match[1] }, key++));
                    remaining = remaining.slice(match[1].length);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                tokens.push(_jsx("span", { className: "text-gray-200", children: remaining[0] }, key++));
                remaining = remaining.slice(1);
            }
        }
        return (_jsx("div", { className: "leading-6", children: tokens.length > 0 ? tokens : '\u00A0' }, lineIndex));
    });
}
export default function CodePreview() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const nextExample = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % codeExamples.length);
    }, []);
    const prevExample = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + codeExamples.length) % codeExamples.length);
    }, []);
    // Auto-cycle through examples
    useEffect(() => {
        if (isPaused)
            return;
        const interval = setInterval(nextExample, 6000);
        return () => clearInterval(interval);
    }, [isPaused, nextExample]);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(codeExamples[activeIndex].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const activeExample = codeExamples[activeIndex];
    return (_jsxs("div", { className: "relative w-full max-w-2xl mx-auto", onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), children: [_jsxs("div", { className: "rounded-xl overflow-hidden bg-surface-900 border border-white/10 shadow-2xl shadow-black/50", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-surface-800 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex gap-1.5", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-red-500/80" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-500/80" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-green-500/80" })] }), _jsx("span", { className: "ml-3 text-xs text-gray-400 font-mono", children: "App.tsx" })] }), _jsx("button", { onClick: handleCopy, className: "flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors", "aria-label": copied ? 'Copied!' : 'Copy code', children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-3.5 h-3.5 text-green-400" }), _jsx("span", { className: "text-green-400", children: "Copied!" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Copy" })] })) })] }), _jsx("div", { className: "relative", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: durations.moderate }, className: "p-4 font-mono text-sm overflow-x-auto", children: _jsx("pre", { className: "text-gray-200", children: highlightCode(activeExample.code) }) }, activeIndex) }) }), _jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-surface-800 border-t border-white/5", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-white", children: activeExample.title }), _jsx("p", { className: "text-xs text-gray-400", children: activeExample.description })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: prevExample, className: "p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors", "aria-label": "Previous example", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("div", { className: "flex gap-1.5", children: codeExamples.map((_, i) => (_jsx("button", { onClick: () => setActiveIndex(i), className: `w-1.5 h-1.5 rounded-full transition-all ${i === activeIndex
                                                ? 'bg-clarity-400 w-4'
                                                : 'bg-gray-600 hover:bg-gray-500'}`, "aria-label": `Go to example ${i + 1}`, "aria-current": i === activeIndex ? 'true' : 'false' }, i))) }), _jsx("button", { onClick: nextExample, className: "p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors", "aria-label": "Next example", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] })] }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-clarity-500/20 via-cosmic-500/20 to-pink-500/20 rounded-xl blur-xl -z-10 opacity-50" })] }));
}
//# sourceMappingURL=CodePreview.js.map