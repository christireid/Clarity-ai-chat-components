import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Terminal, Sparkles } from 'lucide-react';
export default function CLIPage() {
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Terminal, { className: "w-10 h-10 text-brand-500" }), _jsx("h1", { className: "text-5xl font-bold", children: "Beautiful CLI" })] }), _jsxs("p", { className: "text-xl text-text-secondary", children: ["Gorgeous terminal experience inspired by", ' ', _jsx("a", { href: "https://github.com/charmbracelet", target: "_blank", rel: "noopener noreferrer", className: "text-brand-500 hover:underline", children: "charmbracelet" }), "'s amazing libraries."] })] }), _jsxs("section", { className: "bg-bg-secondary rounded-xl p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDCE6 Installation" }), _jsx("pre", { className: "bg-bg p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: "npm install -g @clarity-chat/cli" }) }), _jsxs("p", { className: "text-sm text-text-secondary mt-4", children: ["Or use without installation:", ' ', _jsx("code", { className: "px-2 py-1 bg-bg rounded", children: "npx @clarity-chat/cli" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "\uD83C\uDFAF Commands" }), _jsx("div", { className: "space-y-6", children: commands.map((cmd) => (_jsxs("div", { className: "bg-bg border border-border rounded-xl p-6", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold mb-1", children: [cmd.emoji, " ", cmd.name] }), _jsx("p", { className: "text-text-secondary", children: cmd.description })] }) }), _jsx("pre", { className: "bg-bg-secondary p-4 rounded-lg text-sm overflow-x-auto mb-3", children: _jsx("code", { children: cmd.usage }) }), cmd.features && (_jsx("div", { className: "flex flex-wrap gap-2", children: cmd.features.map((feature) => (_jsx("span", { className: "px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded", children: feature }, feature))) }))] }, cmd.name))) })] }), _jsxs("section", { className: "bg-bg-secondary rounded-xl p-8", children: [_jsxs("h2", { className: "text-2xl font-bold mb-4", children: [_jsx(Sparkles, { className: "w-6 h-6 inline mr-2" }), "Beautiful TUI Components"] }), _jsx("p", { className: "text-text-secondary mb-6", children: "9+ terminal UI components inspired by Lipgloss for gorgeous output" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Spinners" }), _jsx("div", { className: "text-sm text-text-secondary", children: "dots, arrows, pulse" })] }), _jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Progress Bars" }), _jsx("div", { className: "text-sm text-text-secondary", children: "percentage, ETA" })] }), _jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Box Drawing" }), _jsx("div", { className: "text-sm text-text-secondary", children: "4 border styles" })] }), _jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Tables" }), _jsx("div", { className: "text-sm text-text-secondary", children: "proper alignment" })] }), _jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Tree Views" }), _jsx("div", { className: "text-sm text-text-secondary", children: "hierarchical data" })] }), _jsxs("div", { className: "bg-bg rounded-lg p-4", children: [_jsx("div", { className: "font-semibold mb-2", children: "Lists" }), _jsx("div", { className: "text-sm text-text-secondary", children: "bulleted, numbered" })] })] })] })] }));
}
const commands = [
    {
        name: 'browse',
        emoji: '🎨',
        description: 'Interactive component catalog with 15+ components',
        usage: 'clarity-chat browse',
        features: ['Interactive UI', 'Categories', 'Quick install'],
    },
    {
        name: 'search',
        emoji: '🔍',
        description: 'Search for components with fuzzy matching',
        usage: 'clarity-chat search <query>',
        features: ['Fuzzy search', 'Relevance scoring'],
    },
    {
        name: 'upgrade',
        emoji: '🚀',
        description: 'Smart package updates with changelog integration',
        usage: 'clarity-chat upgrade --interactive',
        features: ['Interactive', 'Changelog', 'Breaking changes'],
    },
    {
        name: 'analyze',
        emoji: '📊',
        description: 'Analyze project usage and generate reports',
        usage: 'clarity-chat analyze --report',
        features: ['Usage stats', 'Reports', 'Recommendations'],
    },
    {
        name: 'benchmark',
        emoji: '⚡',
        description: 'Run performance benchmarks with statistics',
        usage: 'clarity-chat benchmark --save --compare',
        features: ['Statistics', 'Comparison', 'Reports'],
    },
    {
        name: 'init',
        emoji: '🎯',
        description: 'Initialize a new Clarity Chat project',
        usage: 'clarity-chat init',
        features: ['Interactive wizard', 'Framework detection'],
    },
    {
        name: 'add',
        emoji: '➕',
        description: 'Add components to your project',
        usage: 'clarity-chat add <component>',
        features: ['Auto-install', 'Dependencies'],
    },
    {
        name: 'generate',
        emoji: '🔧',
        description: 'Generate code (component, hook, test)',
        usage: 'clarity-chat generate component',
        features: ['Templates', 'TypeScript'],
    },
    {
        name: 'doctor',
        emoji: '🩺',
        description: 'Check project health and auto-fix issues',
        usage: 'clarity-chat doctor --fix',
        features: ['Health check', 'Auto-fix'],
    },
    {
        name: 'keys',
        emoji: '🔑',
        description: 'Manage API keys securely',
        usage: 'clarity-chat keys',
        features: ['Secure storage', 'Validation'],
    },
    {
        name: 'dev',
        emoji: '🔥',
        description: 'Start development server',
        usage: 'clarity-chat dev --open',
        features: ['Hot reload', 'Auto-open'],
    },
    {
        name: 'docs',
        emoji: '📚',
        description: 'Open documentation or search',
        usage: 'clarity-chat docs [query]',
        features: ['Quick access', 'Search'],
    },
];
//# sourceMappingURL=page.js.map