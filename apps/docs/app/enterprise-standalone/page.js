import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Shield, Building, FileText, CheckCircle } from 'lucide-react';
export const metadata = {
    title: 'Enterprise Features',
    description: 'Enterprise-grade features, security, and compliance documentation',
};
const enterpriseDocs = [
    {
        title: 'Enterprise Features',
        href: '/enterprise-standalone/enterprise-features',
        description: 'Complete overview of enterprise features including SSO, audit logs, advanced security, and compliance',
        icon: Building,
    },
    {
        title: 'Quick Reference',
        href: '/enterprise-standalone/quick-reference',
        description: 'Quick reference guide for enterprise features and configuration',
        icon: FileText,
    },
];
const enterpriseFeatures = [
    'Single Sign-On (SSO)',
    'Advanced Audit Logging',
    'Role-Based Access Control (RBAC)',
    'Data Residency Controls',
    'HIPAA Compliance',
    'SOC 2 Type II',
    'GDPR Compliance',
    'Custom SLA Agreements',
    'Dedicated Support',
    'On-Premise Deployment',
];
export default function EnterpriseStandalonePage() {
    return (_jsx("div", { className: "container-docs py-12", children: _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Shield, { className: "w-8 h-8 text-brand-500" }), _jsx("h1", { className: "text-5xl font-bold", children: "Enterprise Features" })] }), _jsx("p", { className: "text-xl text-text-secondary", children: "Enterprise-grade features, security, compliance, and support for large-scale deployments." })] }), _jsx("div", { className: "grid gap-6 mb-12", children: enterpriseDocs.map((doc) => {
                        const Icon = doc.icon;
                        return (_jsx(Link, { href: doc.href, className: "group block p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg", children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2", children: doc.title }), _jsx("p", { className: "text-text-secondary", children: doc.description })] })] }) }, doc.href));
                    }) }), _jsxs("div", { className: "border border-border rounded-xl p-8 mb-12", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Enterprise Capabilities" }), _jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: enterpriseFeatures.map((feature) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-brand-500 flex-shrink-0" }), _jsx("span", { className: "text-text-primary", children: feature })] }, feature))) })] }), _jsxs("div", { className: "p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Enterprise Support" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Need enterprise features or have questions about compliance and security? Our enterprise team is here to help." }), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx("a", { href: "mailto:enterprise@clarity-chat.dev", className: "px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "Contact Enterprise Sales" }), _jsx("a", { href: "/commercial", className: "px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border", children: "View Commercial Docs" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map