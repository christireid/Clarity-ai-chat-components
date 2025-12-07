import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
const tiers = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for learning and prototyping',
        features: [
            '15+ core components',
            '3 basic themes',
            'Community support',
            'MIT licensed',
            'Full documentation',
        ],
        cta: 'Get Started',
        href: '/docs',
        highlighted: false,
    },
    {
        name: 'Pro Team',
        price: '$499',
        period: '/year',
        description: 'Best for small teams and agencies',
        features: [
            '55+ components',
            '11 premium themes',
            '5 developer seats',
            'Priority email support (24h)',
            'All AI integrations',
            'Analytics & error tracking',
        ],
        cta: 'Start Free Trial',
        href: '/pricing',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: '$2,499',
        period: '/year',
        description: 'For companies and SaaS products',
        features: [
            '70+ components (enterprise included)',
            'Unlimited everything',
            'SSO, RBAC, white-label',
            'Dedicated support (4h SLA)',
            'Custom development',
            'SOC 2, HIPAA support',
        ],
        cta: 'Contact Sales',
        href: '/enterprise/contact',
        highlighted: false,
    },
];
export default function PricingPreview() {
    return (_jsx("section", { className: "py-24 sm:py-32 bg-gray-50 dark:bg-gray-800", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-base font-semibold text-brand-600 mb-2", children: "PRICING" }), _jsx("p", { className: "text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "Choose Your Plan" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto", children: "Start free, upgrade anytime. 30-day money-back guarantee on all paid plans." })] }), _jsx("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-3", children: tiers.map((tier) => (_jsxs("div", { className: `relative rounded-2xl border ${tier.highlighted
                            ? 'border-brand-500 shadow-xl ring-2 ring-brand-500'
                            : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 p-8 ${tier.highlighted ? 'scale-105 z-10' : ''}`, children: [tier.highlighted && (_jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2", children: _jsx("span", { className: "inline-flex rounded-full bg-brand-600 px-4 py-1 text-sm font-semibold text-white", children: "Most Popular" }) })), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: tier.name }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-4", children: tier.description }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("span", { className: "text-5xl font-bold text-gray-900 dark:text-white", children: tier.price }), tier.period && (_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: tier.period }))] })] }), _jsx("ul", { className: "space-y-3 mb-8", children: tier.features.map((feature) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(Check, { className: "h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" }), _jsx("span", { className: "text-gray-700 dark:text-gray-300 text-sm", children: feature })] }, feature))) }), _jsx(Link, { href: tier.href, className: `block w-full text-center rounded-lg px-6 py-3 font-semibold transition-all ${tier.highlighted
                                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: tier.cta })] }, tier.name))) }), _jsx("div", { className: "mt-12 text-center", children: _jsxs(Link, { href: "/pricing", className: "inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors", children: ["View full pricing comparison", _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }) })] }) }));
}
//# sourceMappingURL=PricingPreview.js.map