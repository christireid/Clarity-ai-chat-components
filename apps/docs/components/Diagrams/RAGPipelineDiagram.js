/**
 * RAG Pipeline Diagram
 *
 * Visual representation of Retrieval-Augmented Generation flow
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { FileText, Database, Search, Sparkles, MessageSquare } from 'lucide-react';
export function RAGPipelineDiagram() {
    const steps = [
        {
            icon: _jsx(FileText, { className: "w-6 h-6" }),
            title: '1. Documents',
            description: 'PDF, DOCX, TXT',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: _jsx("span", { className: "text-xl", children: "\u2702\uFE0F" }),
            title: '2. Chunking',
            description: 'Split into segments',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: _jsx(Sparkles, { className: "w-6 h-6" }),
            title: '3. Embeddings',
            description: 'Vector conversion',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: _jsx(Database, { className: "w-6 h-6" }),
            title: '4. Vector Store',
            description: 'Chroma, Pinecone',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: _jsx(Search, { className: "w-6 h-6" }),
            title: '5. Retrieval',
            description: 'Similarity search',
            color: 'from-indigo-500 to-blue-500',
        },
        {
            icon: _jsx(MessageSquare, { className: "w-6 h-6" }),
            title: '6. Generation',
            description: 'AI response',
            color: 'from-violet-500 to-purple-500',
        },
    ];
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-8 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "RAG Pipeline Architecture" }) }), _jsx("div", { className: "hidden md:flex items-center justify-between gap-3", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.2, type: 'spring', stiffness: 200 }, className: "flex flex-col items-center text-center flex-1", children: [_jsx("div", { className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg mb-3`, children: step.icon }), _jsx("div", { className: "font-bold text-sm mb-1", children: step.title }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: step.description })] }), index < steps.length - 1 && (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.2 + 0.15, duration: 0.3 }, children: _jsxs("svg", { width: "32", height: "32", viewBox: "0 0 32 32", className: "flex-shrink-0", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `gradient-${index}`, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#3b82f6", stopOpacity: "0.3" }), _jsx("stop", { offset: "100%", stopColor: "#3b82f6", stopOpacity: "0.8" })] }) }), _jsx(motion.path, { d: "M 2 16 L 24 16", stroke: `url(#gradient-${index})`, strokeWidth: "3", strokeLinecap: "round", initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: index * 0.2 + 0.2, duration: 0.4 } }), _jsx(motion.path, { d: "M 20 12 L 28 16 L 20 20", fill: "#3b82f6", initial: { opacity: 0 }, animate: { opacity: 0.8 }, transition: { delay: index * 0.2 + 0.5 } })] }) }))] }, index))) }), _jsx("div", { className: "md:hidden space-y-4", children: steps.map((step, index) => (_jsxs("div", { children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.15 }, className: "flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("div", { className: `w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md flex-shrink-0`, children: step.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold text-sm mb-0.5", children: step.title }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: step.description })] })] }), index < steps.length - 1 && (_jsx("div", { className: "flex justify-center py-2", children: _jsx(motion.div, { initial: { opacity: 0, scaleY: 0 }, animate: { opacity: 1, scaleY: 1 }, transition: { delay: index * 0.15 + 0.1, duration: 0.2 }, children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M 12 0 L 12 18", stroke: "#3b82f6", strokeWidth: "2", strokeDasharray: "3 3" }), _jsx("path", { d: "M 8 14 L 12 22 L 16 14", fill: "#3b82f6" })] }) }) }))] }, index))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1.5 }, className: "mt-8 grid md:grid-cols-3 gap-4 text-center", children: [_jsxs("div", { className: "p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 mb-1", children: "3-5x" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Faster than fine-tuning" })] }), _jsxs("div", { className: "p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 mb-1", children: "Real-time" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Always up-to-date knowledge" })] }), _jsxs("div", { className: "p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600 mb-1", children: "Cited" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Sources included" })] })] })] }) }));
}
//# sourceMappingURL=RAGPipelineDiagram.js.map