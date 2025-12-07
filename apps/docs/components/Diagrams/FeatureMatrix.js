/**
 * Feature Comparison Matrix
 *
 * Compare Clarity vs competitors
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
export function FeatureMatrix() {
    const features = [
        { name: 'React.memo Optimization', clarity: true, vercel: false, langchain: false, gradio: false },
        { name: 'WCAG 2.1 AA Accessible', clarity: true, vercel: 'partial', langchain: false, gradio: false },
        { name: 'AI Agents Support', clarity: true, vercel: false, langchain: true, gradio: false },
        { name: 'Vector Store Integration', clarity: true, vercel: false, langchain: true, gradio: false },
        { name: 'Multi-tenancy', clarity: true, vercel: false, langchain: false, gradio: false },
        { name: 'RBAC System', clarity: true, vercel: false, langchain: false, gradio: false },
        { name: 'PII Detection', clarity: true, vercel: false, langchain: false, gradio: false },
        { name: 'Real-time Streaming', clarity: true, vercel: true, langchain: true, gradio: 'partial' },
        { name: 'Dark Mode', clarity: true, vercel: true, langchain: false, gradio: true },
        { name: 'TypeScript Support', clarity: true, vercel: true, langchain: true, gradio: false },
        { name: 'Customizable Themes', clarity: true, vercel: 'partial', langchain: false, gradio: 'partial' },
        { name: 'Industry Demos', clarity: 12, vercel: 3, langchain: 2, gradio: 4 },
    ];
    const Icon = ({ value }) => {
        if (value === true)
            return _jsx(Check, { className: "w-5 h-5 text-green-500" });
        if (value === false)
            return _jsx(X, { className: "w-5 h-5 text-gray-300 dark:text-gray-600" });
        if (value === 'partial')
            return _jsx(Minus, { className: "w-5 h-5 text-yellow-500" });
        return _jsx("span", { className: "text-sm font-semibold text-blue-600 dark:text-blue-400", children: value });
    };
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-3 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent", children: "Feature Comparison" }) }), _jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mb-8", children: "How Clarity stacks up against alternatives" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-slate-100 dark:bg-slate-800", children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700", children: "Feature" }), _jsx("th", { className: "px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700", children: _jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("span", { className: "text-brand-600 dark:text-brand-400", children: "Clarity" }), _jsx("span", { className: "px-2 py-0.5 bg-brand-500 text-white rounded-full text-xs", children: "You" })] }) }), _jsx("th", { className: "px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700", children: "Vercel AI" }), _jsx("th", { className: "px-6 py-4 text-center text-sm font-bold border-r-2 border-slate-200 dark:border-slate-700", children: "LangChain" }), _jsx("th", { className: "px-6 py-4 text-center text-sm font-bold", children: "Gradio" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-slate-800", children: features.map((feature, index) => (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.05 }, className: "border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium border-r border-slate-100 dark:border-slate-700", children: feature.name }), _jsx("td", { className: "px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700", children: _jsx("div", { className: "flex justify-center", children: _jsx(Icon, { value: feature.clarity }) }) }), _jsx("td", { className: "px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700", children: _jsx("div", { className: "flex justify-center", children: _jsx(Icon, { value: feature.vercel }) }) }), _jsx("td", { className: "px-6 py-4 text-center border-r border-slate-100 dark:border-slate-700", children: _jsx("div", { className: "flex justify-center", children: _jsx(Icon, { value: feature.langchain }) }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("div", { className: "flex justify-center", children: _jsx(Icon, { value: feature.gradio }) }) })] }, feature.name))) })] }) }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.8 }, className: "mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { children: "Fully supported" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Minus, { className: "w-4 h-4 text-yellow-500" }), _jsx("span", { children: "Partially supported" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(X, { className: "w-4 h-4 text-gray-300" }), _jsx("span", { children: "Not supported" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1 }, className: "mt-8 p-6 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl shadow-xl text-white text-center", children: [_jsx("div", { className: "text-xl font-bold mb-2", children: "\uD83C\uDFC6 Most Feature-Complete" }), _jsx("div", { className: "text-brand-100", children: "Clarity offers enterprise features that others don't" })] })] }) }));
}
//# sourceMappingURL=FeatureMatrix.js.map