'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
export function QueryBuilder({ onQuery, suggestedQueries }) {
    const [query, setQuery] = useState('');
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4", children: [_jsxs("h3", { className: "font-semibold mb-3 flex items-center", children: [_jsx(Sparkles, { className: "w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" }), "Natural Language Query"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyPress: (e) => {
                                    if (e.key === 'Enter' && query.trim()) {
                                        onQuery(query);
                                        setQuery('');
                                    }
                                }, placeholder: "Ask about your data...", className: "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsx("button", { onClick: () => {
                                    if (query.trim()) {
                                        onQuery(query);
                                        setQuery('');
                                    }
                                }, className: "px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors", children: _jsx(Search, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Suggested Queries" }), _jsx("div", { className: "space-y-2", children: suggestedQueries.map((suggestion, idx) => (_jsx(motion.button, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.05 }, onClick: () => onQuery(suggestion), className: "w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors", children: suggestion }, idx))) })] })] }));
}
//# sourceMappingURL=QueryBuilder.js.map