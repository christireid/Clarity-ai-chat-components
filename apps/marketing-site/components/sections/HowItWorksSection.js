'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Sparkles, Code, Zap, ArrowRight } from 'lucide-react';
import { durations } from '@/lib/constants';
import { fadeInUp, reducedMotionConfig, useReducedMotion, } from '@/lib/animations';
const steps = [
    {
        number: '01',
        title: 'Install',
        description: 'Add to your React project with npm or scaffold a new project with our CLI.',
        icon: Sparkles,
        code: `npm install @clarity-chat/react
# or scaffold a new project
npx create-clarity-chat@latest`,
    },
    {
        number: '02',
        title: 'Import & Configure',
        description: 'Import the components you need. Configure your AI provider with a single prop.',
        icon: Code,
        code: `import { ClarityChat } from '@clarity-chat/react'

export default function Chat() {
  return (
    <ClarityChat
      provider="openai"
      model="gpt-4"
      apiKey={process.env.OPENAI_API_KEY}
    />
  )
}`,
    },
    {
        number: '03',
        title: 'Customize & Ship',
        description: 'Style with Tailwind, add memory hooks, enable token tracking. Deploy when ready.',
        icon: Zap,
        code: `<ClarityChat
  provider="anthropic"
  model="claude-3-sonnet"
  className="h-screen"
  memory={{ strategy: 'window', maxTokens: 4000 }}
  tokenTracking={{ enabled: true }}
/>`,
    },
];
function StepCard({ step, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const Icon = step.icon;
    return (_jsxs(motion.div, { ref: ref, variants: fadeInUp, initial: "hidden", animate: isInView ? 'visible' : 'hidden', transition: { delay: index * 0.15 }, className: "relative", children: [index < steps.length - 1 && (_jsx("div", { className: "hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-clarity-500/50 to-transparent" })), _jsxs("div", { className: "glass-card p-6 border border-white/10 rounded-xl h-full", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-clarity-500 to-cosmic-500 text-white font-bold", children: step.number }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { className: "w-5 h-5 text-clarity-400" }), _jsx("h3", { className: "text-xl font-semibold text-white", children: step.title })] })] }), _jsx("p", { className: "text-gray-400 mb-4", children: step.description }), _jsx("pre", { className: "bg-surface-950 rounded-lg p-4 overflow-x-auto", children: _jsx("code", { className: "text-sm text-clarity-400 font-mono whitespace-pre", children: step.code }) })] })] }));
}
/**
 * Three-step guide showing the developer journey from install to ship.
 * Displays code examples for each step with animated cards.
 */
export default function HowItWorksSection() {
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
    return (_jsxs("section", { className: "relative py-24 sm:py-32 bg-surface-900", children: [_jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-10" }), _jsx("div", { className: "absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" }), _jsxs("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { ref: headerRef, variants: fadeInUp, initial: "hidden", animate: isHeaderInView ? 'visible' : 'hidden', className: "text-center mb-16", children: [_jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4", children: "How It Works" }), _jsxs("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4", children: ["Three Steps to", _jsx("span", { className: "gradient-text", children: " AI Chat" })] }), _jsx("p", { className: "text-lg text-gray-400 max-w-2xl mx-auto", children: "From install to production in minutes. No complex setup required." })] }), _jsx("div", { className: "grid gap-8 lg:grid-cols-3", children: steps.map((step, index) => (_jsx(StepCard, { step: step, index: index }, step.number))) }), _jsx(motion.div, { variants: fadeInUp, ...reducedMotionConfig, transition: { delay: 0.3 }, className: "mt-16 text-center", children: _jsxs("a", { href: "https://github.com/christireid/Clarity-ai-chat-components", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-clarity-400 hover:text-clarity-300 font-medium transition-colors", children: ["View full documentation on GitHub", _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] })] }));
}
//# sourceMappingURL=HowItWorksSection.js.map