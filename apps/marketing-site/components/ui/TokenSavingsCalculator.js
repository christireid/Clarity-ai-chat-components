'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Coins, Users, Zap } from 'lucide-react';
/**
 * Interactive ROI calculator for estimating token cost savings.
 * Uses conservative estimates with transparent methodology.
 * All projections are clearly labeled as estimates.
 */
export default function TokenSavingsCalculator() {
    const [mau, setMau] = useState(10000);
    const [msgsPerUser, setMsgsPerUser] = useState(50);
    const [avgTokens, setAvgTokens] = useState(1000); // Input + Output
    // Estimates based on:
    // - Average LLM costs: ~$5/1M tokens (blended input/output)
    // - Cache hit rates vary by conversation patterns (20-50% typical)
    // - Using 30% as conservative midpoint estimate
    const totalTokens = mau * msgsPerUser * avgTokens;
    const estimatedCost = (totalTokens / 1000000) * 5; // $5 per million
    const savings = estimatedCost * 0.3; // Conservative 30% estimate
    return (_jsxs("div", { className: "glass-card p-8 border border-white/10", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8", children: [_jsx("div", { className: "p-3 rounded-lg bg-green-500/10 text-green-400", children: _jsx(Gauge, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "ROI Calculator" }), _jsx("p", { className: "text-sm text-gray-400", children: "Estimate your monthly savings" })] })] }), _jsxs("div", { className: "grid gap-6 mb-8", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-center justify-between text-sm text-gray-400 mb-2", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4" }), " Monthly Active Users"] }), _jsx("span", { className: "text-white font-mono", children: mau.toLocaleString() })] }), _jsx("input", { type: "range", min: "1000", max: "100000", step: "1000", value: mau, onChange: (e) => setMau(Number(e.target.value)), className: "w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-clarity-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-center justify-between text-sm text-gray-400 mb-2", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4" }), " Msgs / User / Month"] }), _jsx("span", { className: "text-white font-mono", children: msgsPerUser })] }), _jsx("input", { type: "range", min: "10", max: "500", step: "10", value: msgsPerUser, onChange: (e) => setMsgsPerUser(Number(e.target.value)), className: "w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-clarity-500" })] })] }), _jsxs("div", { className: "bg-surface-900 rounded-xl p-6 border border-white/5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-8 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500 mb-1", children: "Current Cost" }), _jsxs("div", { className: "text-2xl font-bold text-white", children: ["$", Math.round(estimatedCost).toLocaleString(), _jsx("span", { className: "text-xs text-gray-600 font-normal", children: "/mo" })] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-green-400 mb-1", children: "Projected Savings" }), _jsxs("div", { className: "text-2xl font-bold text-green-400", children: ["$", Math.round(savings).toLocaleString(), _jsx("span", { className: "text-xs text-green-500/70 font-normal", children: "/mo" })] })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-white/5 text-center", children: _jsx("p", { className: "text-xs text-gray-500", children: "Estimates only. Actual savings depend on conversation patterns and provider." }) })] })] }));
}
//# sourceMappingURL=TokenSavingsCalculator.js.map