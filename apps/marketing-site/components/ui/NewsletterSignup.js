'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Star } from 'lucide-react';
import { fadeInUp, useReducedMotion } from '@/lib/animations';
/**
 * Newsletter signup form with email validation.
 * Offers AI chat implementation guide as lead magnet.
 * Uses subtle animations with reduced-motion support.
 */
export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate API call to Resend
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // In a real app, this would be a server action:
        // await subscribeToNewsletter(email)
        setStatus('success');
        setEmail('');
    };
    return (_jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-surface-900 border border-white/10 p-8 sm:p-12", children: [_jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-clarity-500/10 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-cosmic-500/10 rounded-full blur-3xl" }), _jsxs("div", { className: "relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-16 items-center", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-2xl font-bold text-white mb-3", children: ["Get the", ' ', _jsx("span", { className: "gradient-text", children: "AI Chat Implementation Guide" })] }), _jsx("p", { className: "text-gray-400 mb-6", children: "Weekly deep-dives on LLM streaming, token optimization, and UI/UX patterns for AI chat interfaces. Plus, get our \"Production Checklist\" free." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { children: "No spam" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { children: "Unsubscribe anytime" })] })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "relative", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx(Star, { className: "absolute left-4 w-5 h-5 text-gray-500" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "engineer@company.com", className: "w-full bg-surface-800 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-clarity-500/50 focus:border-clarity-500 transition-all", disabled: status === 'loading' || status === 'success' }), _jsx("button", { type: "submit", disabled: status === 'loading' || status === 'success', className: "absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-clarity-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2", children: status === 'loading' ? (_jsx(Sparkles, { className: "w-4 h-4 animate-spin" })) : status === 'success' ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), _jsx("span", { children: "Sent!" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Get Guide" }), _jsx(ArrowRight, { className: "w-3 h-3" })] })) })] }), status === 'success' && (_jsx(motion.p, { variants: fadeInUp, initial: "hidden", animate: "visible", className: "absolute -bottom-8 left-0 text-sm text-green-400", children: "Thanks! Check your inbox for the guide." }))] })] })] }));
}
//# sourceMappingURL=NewsletterSignup.js.map