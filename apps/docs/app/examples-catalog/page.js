import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ShoppingCart, Code, Users, FileText, Mail, Heart, DollarSign, GraduationCap, BarChart3, Microscope, } from 'lucide-react';
export default function ExamplesCatalogPage() {
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "Examples Catalog" }), _jsx("p", { className: "text-xl text-text-secondary", children: "16 production-ready examples covering the top 10 AI chatbot use cases" })] }), _jsx("section", { className: "bg-bg-secondary rounded-xl p-8", children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-brand-500 mb-2", children: "16" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Total Examples" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-brand-500 mb-2", children: "10" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Industries Covered" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-brand-500 mb-2", children: "100%" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Use Case Coverage" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-brand-500 mb-2", children: "11" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Production Ready" })] })] }) }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "\uD83C\uDFAF Featured Production Demos" }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: featuredExamples.map((example) => (_jsx("div", { className: "bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 bg-brand-500/10 rounded-lg", children: example.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: example.name }), _jsx("p", { className: "text-text-secondary mb-4", children: example.description }), _jsx("div", { className: "space-y-2 mb-4", children: example.features.slice(0, 4).map((feature) => (_jsxs("div", { className: "text-sm text-text-secondary", children: ["\u2713 ", feature] }, feature))) }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("span", { className: "px-2 py-1 bg-bg-secondary text-xs rounded", children: example.technology }), _jsx("span", { className: "px-2 py-1 bg-bg-secondary text-xs rounded", children: example.complexity }), example.isNew && (_jsx("span", { className: "px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded", children: "NEW" }))] }), _jsx(Link, { href: `/examples/${example.path}`, className: "text-brand-500 hover:text-brand-600 font-semibold", children: "View Documentation \u2192" })] })] }) }, example.path))) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "\uD83C\uDFE2 By Industry" }), _jsx("div", { className: "space-y-4", children: industries.map((industry) => (_jsxs("div", { className: "bg-bg border border-border rounded-lg p-6", children: [_jsx("h3", { className: "text-xl font-bold mb-3", children: industry.name }), _jsx("div", { className: "flex flex-wrap gap-3", children: industry.examples.map((example) => (_jsx(Link, { href: `/examples/${example.toLowerCase().replace(/\s+/g, '-')}`, className: "px-4 py-2 bg-bg-secondary hover:bg-brand-500/10 rounded-lg transition-colors", children: example }, example))) })] }, industry.name))) })] }), _jsxs("section", { className: "bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Ready to Build?" }), _jsx("p", { className: "text-xl mb-8 opacity-90", children: "Start with an example and adapt it to your needs" }), _jsx(Link, { href: "https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples", target: "_blank", rel: "noopener noreferrer", className: "inline-block px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors", children: "Browse on GitHub" })] })] }));
}
const featuredExamples = [
    {
        name: 'E-Commerce Assistant',
        path: 'ecommerce-assistant',
        icon: _jsx(ShoppingCart, { className: "w-6 h-6 text-brand-500" }),
        description: 'AI-powered shopping with product recommendations',
        features: [
            'Product search',
            'Recommendations',
            'Cart management',
            'Price comparison',
        ],
        technology: 'Next.js 15 + GPT-4',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'Code Assistant',
        path: 'code-assistant',
        icon: _jsx(Code, { className: "w-6 h-6 text-brand-500" }),
        description: 'AI coding companion with debugging and generation',
        features: ['Multi-language', 'Debugging', 'Code review', 'Test generation'],
        technology: 'Monaco Editor + GPT-4',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'AI Agents Workflow',
        path: 'ai-agents-workflow',
        icon: _jsx(Users, { className: "w-6 h-6 text-brand-500" }),
        description: 'Multi-agent system with specialized agents',
        features: [
            '5 agents',
            'Tool calling',
            'Task decomposition',
            'Parallel execution',
        ],
        technology: 'Next.js 15 + GPT-4',
        complexity: 'Advanced',
        isNew: true,
    },
    {
        name: 'Document Summarizer',
        path: 'document-summarizer',
        icon: _jsx(FileText, { className: "w-6 h-6 text-brand-500" }),
        description: 'Intelligent document summarization',
        features: ['Multi-document', 'Key points', 'Entity recognition', 'Q&A'],
        technology: 'GPT-4 Turbo 128k',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'Email Assistant',
        path: 'email-assistant',
        icon: _jsx(Mail, { className: "w-6 h-6 text-brand-500" }),
        description: 'AI-powered email composition',
        features: [
            'Tone adjustment',
            'Multi-language',
            'Templates',
            'Grammar check',
        ],
        technology: 'Claude 3 + Next.js',
        complexity: 'Beginner',
        isNew: true,
    },
    {
        name: 'Healthcare Assistant',
        path: 'healthcare-assistant',
        icon: _jsx(Heart, { className: "w-6 h-6 text-brand-500" }),
        description: 'Healthcare chatbot (demo only)',
        features: [
            'Appointments',
            'Symptom checker',
            'Medication reminders',
            'Emergency detection',
        ],
        technology: 'Next.js + Supabase',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'Financial Advisor',
        path: 'financial-advisor',
        icon: _jsx(DollarSign, { className: "w-6 h-6 text-brand-500" }),
        description: 'Financial planning (demo only)',
        features: ['Budgeting', 'Expense tracking', 'Savings goals', 'Reports'],
        technology: 'Next.js + Chart.js',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'AI Tutor',
        path: 'ai-tutor',
        icon: _jsx(GraduationCap, { className: "w-6 h-6 text-brand-500" }),
        description: 'Intelligent tutoring system',
        features: [
            'Adaptive learning',
            'Multi-subject',
            'Practice problems',
            'Gamification',
        ],
        technology: 'Next.js + GPT-4',
        complexity: 'Intermediate',
        isNew: true,
    },
    {
        name: 'Model Comparison',
        path: 'model-comparison-demo',
        icon: _jsx(Microscope, { className: "w-6 h-6 text-brand-500" }),
        description: 'Compare AI providers side-by-side',
        features: [
            'Multi-provider',
            'Quality scoring',
            'Cost analysis',
            'Streaming',
        ],
        technology: 'Next.js 15',
        complexity: 'Advanced',
        isNew: false,
    },
    {
        name: 'RAG Workbench',
        path: 'rag-workbench-demo',
        icon: _jsx(FileText, { className: "w-6 h-6 text-brand-500" }),
        description: 'Document Q&A with RAG',
        features: [
            'Document upload',
            'Semantic search',
            'Context injection',
            'Chunk visualization',
        ],
        technology: 'Next.js 15',
        complexity: 'Advanced',
        isNew: false,
    },
    {
        name: 'Analytics Console',
        path: 'analytics-console-demo',
        icon: _jsx(BarChart3, { className: "w-6 h-6 text-brand-500" }),
        description: 'Real-time AI analytics dashboard',
        features: [
            'Usage tracking',
            'Cost monitoring',
            'Charts',
            'Performance metrics',
        ],
        technology: 'Recharts + Next.js',
        complexity: 'Advanced',
        isNew: false,
    },
];
const industries = [
    {
        name: 'E-Commerce & Retail',
        examples: ['E-Commerce Assistant'],
    },
    {
        name: 'Software Development',
        examples: ['Code Assistant', 'AI Agents Workflow'],
    },
    {
        name: 'Healthcare',
        examples: ['Healthcare Assistant'],
    },
    {
        name: 'Financial Services',
        examples: ['Financial Advisor'],
    },
    {
        name: 'Education',
        examples: ['AI Tutor'],
    },
    {
        name: 'Customer Support',
        examples: ['Customer Support Demo'],
    },
    {
        name: 'Knowledge Management',
        examples: ['Document Summarizer', 'RAG Workbench'],
    },
    {
        name: 'Communication',
        examples: ['Email Assistant'],
    },
    {
        name: 'Analytics',
        examples: ['Analytics Console'],
    },
];
//# sourceMappingURL=page.js.map