import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { MessageSquare, Users } from 'lucide-react';
/**
 * Testimonials section - currently displays a call-to-action for early adopters
 * since we do not yet have real customer testimonials to show.
 */
export default function Testimonials() {
    return (_jsx("section", { className: "py-24 sm:py-32 bg-white dark:bg-gray-900", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-base font-semibold text-brand-600 mb-2", children: "COMMUNITY" }), _jsx("p", { className: "text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "Built for Developers" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto", children: "Clarity Chat is open source and in active development. Try it out and let us know what you think." })] }), _jsx("div", { className: "max-w-lg mx-auto", children: _jsxs("div", { className: "relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center", children: [_jsx(Users, { className: "w-12 h-12 text-brand-500/40 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "Join our early adopters" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: "We are looking for developers to try Clarity Chat and share their feedback. Your experience could be featured here." }), _jsxs(Link, { href: "https://github.com/christireid/Clarity-ai-chat-components/discussions", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), "Share your feedback"] })] }) })] }) }));
}
//# sourceMappingURL=Testimonials.js.map
