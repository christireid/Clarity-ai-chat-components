'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Globe, Code } from 'lucide-react';
import { durations } from '@/lib/constants';
import { useReducedMotion } from '@/lib/animations';
import TiltCard from '../ui/TiltCard';
const tiers = [
    {
        name: 'Open Source',
        price: { monthly: 0, annual: 0 },
        description: 'Full library, MIT licensed, forever free',
        icon: Code,
        features: [
            '170+ React components',
            'Multi-provider support',
            'Token optimization',
            'Full TypeScript support',
            'Community support',
            'Documentation & examples',
        ],
        cta: 'Get Started',
        href: '/docs/guides/getting-started',
        highlighted: false,
        gradient: 'from-gray-500 to-gray-600',
    },
    {
        name: 'Pro',
        price: { monthly: 49, annual: 39 },
        description: 'Priority support for production apps',
        icon: Sparkles,
        features: [
            'Everything in Open Source',
            'Priority email support',
            'Private Slack channel',
            'Figma design kit',
            'Commercial license',
            'Early access to new features',
            'Direct team access',
            'SLA guarantees',
        ],
        cta: 'Get Pro Support',
        href: 'https://github.com/christireid/Clarity-ai-chat-components/discussions',
        highlighted: true,
        gradient: 'from-clarity-500 to-cosmic-500',
    },
    {
        name: 'Enterprise',
        price: { monthly: 'Custom', annual: 'Custom' },
        description: 'For teams with custom requirements',
        icon: Globe,
        features: [
            'Everything in Pro',
            'Unlimited developer seats',
            'Custom component development',
            'Dedicated support engineer',
            'On-premises deployment',
            'Security review & audit',
            'Custom integrations',
            'Training & onboarding',
        ],
        cta: 'Contact Us',
        href: '/enterprise/contact',
        highlighted: false,
        gradient: 'from-cosmic-500 to-pink-500',
    },
];
export default function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState('annual');
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
    return (_jsxs("section", { id: "pricing", className: "relative py-24 sm:py-32 bg-surface-900", children: [_jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-10" }), _jsx("div", { className: "absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cosmic-500/50 to-transparent" }), _jsxs("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { ref: headerRef, initial: { opacity: 0, y: 20 }, animate: isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }, transition: { duration: durations.slow }, className: "text-center mb-12", children: [_jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-cosmic-500/10 border border-cosmic-500/20 text-cosmic-400 text-sm font-medium mb-4", children: "Pricing" }), _jsxs("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4", children: ["Simple, Transparent", _jsx("span", { className: "gradient-text", children: " Pricing" })] }), _jsx("p", { className: "text-lg text-gray-400 max-w-2xl mx-auto", children: "Start free, upgrade when you're ready. 30-day money-back guarantee on all paid plans." })] }), _jsxs("div", { className: "flex justify-center items-center gap-4 mb-12", children: [_jsx("span", { className: `text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}`, children: "Monthly" }), _jsx("button", { onClick: () => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly'), className: "relative w-14 h-7 rounded-full bg-surface-700 transition-colors", "aria-label": "Toggle billing period", children: _jsx(motion.div, { className: "absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-clarity-500 to-cosmic-500", animate: {
                                        left: billingPeriod === 'annual' ? '2rem' : '0.25rem',
                                    }, transition: { type: 'spring', stiffness: 500, damping: 30 } }) }), _jsxs("span", { className: `text-sm font-medium transition-colors flex items-center gap-2 ${billingPeriod === 'annual' ? 'text-white' : 'text-gray-500'}`, children: ["Annual", _jsx("span", { className: "px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30", children: "Save 20%" })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: tiers.map((tier, i) => {
                            const price = typeof tier.price[billingPeriod] === 'number'
                                ? tier.price[billingPeriod]
                                : tier.price[billingPeriod];
                            const Icon = tier.icon;
                            return (_jsx(TiltCard, { className: `h-full`, children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: isHeaderInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }, transition: { duration: durations.slow, delay: i * 0.1 }, className: `relative rounded-2xl ${tier.highlighted
                                        ? 'border-2 border-clarity-500/50 scale-105 z-10'
                                        : 'border border-white/10'} bg-surface-800 overflow-hidden h-full flex flex-col`, children: [tier.highlighted && (_jsx("div", { className: "absolute top-0 left-0 right-0 flex justify-center", children: _jsxs("div", { className: "px-4 py-1 bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white text-sm font-semibold rounded-b-lg flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Most Popular"] }) })), tier.highlighted && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-clarity-500/10 to-transparent pointer-events-none" })), _jsxs("div", { className: "p-8 pt-12 flex-1 flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${tier.gradient} bg-opacity-10 text-white`, children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsx("h3", { className: "text-2xl font-bold text-white", children: tier.name })] }), _jsx("p", { className: "text-gray-400 text-sm mb-6", children: tier.description }), _jsxs("div", { className: "mb-8", children: [typeof price === 'number' ? (_jsxs("div", { className: "flex items-baseline gap-1", children: [_jsxs("span", { className: "text-5xl font-bold text-white", children: ["$", price] }), price > 0 && (_jsxs("span", { className: "text-gray-400 text-lg", children: ["/", billingPeriod === 'annual' ? 'mo' : 'month'] }))] })) : (_jsx("span", { className: "text-4xl font-bold text-white", children: price })), billingPeriod === 'annual' &&
                                                            typeof price === 'number' &&
                                                            price > 0 && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: "per developer / billed annually" })), price === 0 && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Free forever for personal use" }))] }), _jsx("ul", { className: "space-y-3 mb-8 flex-1", children: tier.features.map((feature) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5 p-0.5 rounded-full bg-clarity-500/20", children: _jsx(Check, { className: "w-4 h-4 text-clarity-400" }) }), _jsx("span", { className: "text-gray-300 text-sm", children: feature })] }, feature))) }), _jsxs(Link, { href: tier.href, className: `flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold transition-all ${tier.highlighted
                                                        ? 'bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white hover:from-clarity-400 hover:to-cosmic-400 shadow-lg shadow-clarity-500/20'
                                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`, children: [tier.cta, _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }) }, tier.name));
                        }) }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: isHeaderInView ? { opacity: 1 } : { opacity: 0 }, transition: { delay: 0.5, duration: durations.slow }, className: "mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }), _jsx("span", { children: "No credit card required" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }), _jsx("span", { children: "30-day money-back guarantee" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }), _jsx("span", { children: "Cancel anytime" })] })] })] })] }));
}
//# sourceMappingURL=PricingSection.js.map