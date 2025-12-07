import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { DollarSign, Briefcase } from 'lucide-react';
export const metadata = {
    title: 'Commercial Documentation',
    description: 'Business documentation, pricing, licensing, and sales materials for Clarity Chat',
};
const sections = [
    {
        title: 'Pricing & Licensing',
        icon: DollarSign,
        description: 'Pricing tiers, licensing options, and commercial terms',
        items: [
            { title: 'Pricing Guide', href: '/commercial/pricing', description: 'Complete pricing information and tier comparison' },
            { title: 'Pro License', href: '/commercial/license-pro', description: 'Commercial license for Pro tier' },
            { title: 'Enterprise License', href: '/commercial/license-enterprise', description: 'Enterprise agreement and terms' },
            { title: 'Terms of Service', href: '/commercial/terms-of-service', description: 'Terms and conditions' },
            { title: 'Privacy Policy', href: '/commercial/privacy-policy', description: 'GDPR/CCPA compliant privacy policy' },
        ],
    },
    {
        title: 'Sales & Marketing',
        icon: Briefcase,
        description: 'Sales materials and marketing resources',
        items: [
            { title: 'Sales Deck', href: '/commercial/sales-deck', description: 'Presentation materials and demo scripts' },
            { title: 'Case Studies', href: '/commercial/case-studies', description: 'Customer success stories and ROI examples' },
            { title: 'Implementation Guide', href: '/commercial/implementation-guide', description: 'Onboarding and implementation resources' },
        ],
    },
];
export default function CommercialPage() {
    return (_jsx("div", { className: "container-docs py-12", children: _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "Commercial Documentation" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Business documentation, pricing, licensing, and sales materials for Clarity Chat." })] }), _jsx("div", { className: "grid gap-8", children: sections.map((section) => {
                        const Icon = section.icon;
                        return (_jsxs("div", { className: "border border-border rounded-xl p-8", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsx("div", { className: "p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg", children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: section.title }), _jsx("p", { className: "text-text-secondary", children: section.description })] })] }), _jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: section.items.map((item) => (_jsxs(Link, { href: item.href, className: "group p-4 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all", children: [_jsx("div", { className: "font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-1", children: item.title }), _jsx("div", { className: "text-sm text-text-secondary", children: item.description })] }, item.href))) })] }, section.title));
                    }) }), _jsxs("div", { className: "mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Need Help?" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Have questions about pricing, licensing, or implementation? We're here to help." }), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx("a", { href: "mailto:sales@clarity-chat.dev", className: "px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "Contact Sales" }), _jsx("a", { href: "https://discord.gg/clarity-chat", target: "_blank", rel: "noopener noreferrer", className: "px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border", children: "Join Discord" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map