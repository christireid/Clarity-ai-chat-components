'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Zap, Shield, Globe, Brain, Coins, Puzzle, Gauge, Cpu, Users, Lock, } from 'lucide-react';
import { durations } from '@/lib/constants';
import { fadeInUp, scaleUp, reducedMotionConfig, useReducedMotion, } from '@/lib/animations';
import TokenSavingsCalculator from '../ui/TokenSavingsCalculator';
import SpotlightCard from '../ui/SpotlightCard';
const features = [
    {
        name: 'Multi-Provider Support',
        description: 'OpenAI, Anthropic, and Google AI adapters included. Switch providers with a single prop change.',
        icon: Globe,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
    },
    {
        name: 'Streaming Built-In',
        description: 'Real-time token streaming with SSE support. Responses appear as they generate.',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
    },
    {
        name: 'Context Management',
        description: 'Memory hooks for conversation context. Window, summary, and vector memory strategies included.',
        icon: Brain,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
    },
    {
        name: 'Token Tracking',
        description: 'Built-in cost tracking and budget management. useTokenBudget hook exposes usage and savings.',
        icon: Coins,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
    },
    {
        name: '170+ Components',
        description: 'Chat windows, message lists, inputs, code blocks, file viewers, and more. All customizable.',
        icon: Puzzle,
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/20',
    },
    {
        name: 'TypeScript Strict',
        description: 'Full strict mode with zero any types. IntelliSense support and compile-time error checking.',
        icon: Cpu,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
    },
    {
        name: 'Tool Use Support',
        description: 'Function calling and tool use patterns for structured AI interactions. Build agentic workflows.',
        icon: Users,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
    },
    {
        name: '27KB Gzipped',
        description: 'Tree-shakeable exports. Only bundle what you use. No bloat, no unnecessary dependencies.',
        icon: Gauge,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
    },
];
const highlights = [
    {
        title: 'Ship Faster',
        description: 'Pre-built components mean less code to write. Copy examples from docs, customize, and deploy.',
        icon: Sparkles,
        gradient: 'from-clarity-500 to-cosmic-500',
    },
    {
        title: 'Tested & Typed',
        description: 'Full TypeScript strict mode with comprehensive test coverage. Catch issues at compile time.',
        icon: Shield,
        gradient: 'from-cosmic-500 to-pink-500',
    },
    {
        title: 'Enterprise Features',
        description: 'SSO, RBAC, and audit logging components available in the Enterprise tier for larger teams.',
        icon: Lock,
        gradient: 'from-pink-500 to-clarity-500',
    },
];
function FeatureCard({ feature, index, }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const Icon = feature.icon;
    return (_jsx(motion.div, { ref: ref, variants: fadeInUp, initial: "hidden", animate: isInView ? 'visible' : 'hidden', transition: { delay: index * 0.1 }, children: _jsxs(SpotlightCard, { className: `h-full p-6 border ${feature.borderColor} transition-all duration-300`, children: [_jsx("div", { className: `inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`, children: _jsx(Icon, { className: `w-6 h-6 ${feature.color}` }) }), _jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: feature.name }), _jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: feature.description })] }) }));
}
function HighlightCard({ highlight, index, }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const Icon = highlight.icon;
    return (_jsxs(motion.div, { ref: ref, variants: scaleUp, initial: "hidden", animate: isInView ? 'visible' : 'hidden', transition: { delay: index * 0.15 }, className: "relative group", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-r ${highlight.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity` }), _jsxs("div", { className: "relative glass-card p-8 border border-white/10 hover:border-white/20 transition-all", children: [_jsx("div", { className: `inline-flex p-4 rounded-xl bg-gradient-to-r ${highlight.gradient} mb-6`, children: _jsx(Icon, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: highlight.title }), _jsx("p", { className: "text-gray-300 leading-relaxed", children: highlight.description })] })] }));
}
/**
 * Features section showcasing library capabilities and ROI calculator.
 * Displays feature cards with highlight sections and token savings estimator.
 * Uses accessible animations with reduced-motion support.
 */
export default function FeaturesSection() {
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
    return (_jsxs("section", { id: "features", className: "relative py-24 sm:py-32 bg-surface-950", children: [_jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-20" }), _jsx("div", { className: "absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" }), _jsxs("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { ref: headerRef, variants: fadeInUp, initial: "hidden", animate: isHeaderInView ? 'visible' : 'hidden', className: "text-center mb-16", children: [_jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4", children: "Features" }), _jsxs("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4", children: ["Why Teams Choose", _jsx("span", { className: "gradient-text", children: " Clarity Chat" })] }), _jsx("p", { className: "text-lg text-gray-400 max-w-2xl mx-auto", children: "Everything you need to build world-class AI chat. Nothing you don't." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20", children: features.map((feature, i) => (_jsx(FeatureCard, { feature: feature, index: i }, feature.name))) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: highlights.map((highlight, i) => (_jsx(HighlightCard, { highlight: highlight, index: i }, highlight.title))) }), _jsxs(motion.div, { variants: fadeInUp, ...reducedMotionConfig, className: "mt-32 max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-white mb-4", children: "Stop Burning Tokens \uD83D\uDD25" }), _jsx("p", { className: "text-gray-400", children: "See how much Clarity Cache could save you." })] }), _jsx(TokenSavingsCalculator, {})] })] })] }));
}
//# sourceMappingURL=FeaturesSection.js.map