import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Star } from 'lucide-react';
const testimonials = [
    {
        content: 'Clarity Chat was a game-changer. We passed our HIPAA audit with flying colors, and patients love the accessibility features. The money we saved on development went straight into improving our AI models.',
        author: 'Dr. Michael Rodriguez',
        role: 'CTO',
        company: 'HealthAI',
        avatar: '/avatars/michael.jpg',
        stats: '$150K saved, 5 weeks to launch',
    },
    {
        content: 'We were quoted $300K and 12 months by agencies. With Clarity Chat Enterprise, we launched in 2 months and saved $400K. The ROI was immediate.',
        author: 'Sarah Chen',
        role: 'VP of Engineering',
        company: 'TechCorp',
        avatar: '/avatars/sarah.jpg',
        stats: '$400K saved, 8 weeks vs 12 months',
    },
    {
        content: "Clarity Chat paid for itself in 3 days. We've seen $2.4M in additional revenue just this quarter. The ROI is insane.",
        author: 'David Park',
        role: 'VP of Product',
        company: 'ShopSmart',
        avatar: '/avatars/david.jpg',
        stats: '24,000% ROI, $2.4M revenue impact',
    },
    {
        content: 'As a startup with limited resources, Clarity Chat was a no-brainer. We got enterprise-quality components at startup pricing. That $499 license enabled a $3M fundraise.',
        author: 'Emily Watson',
        role: 'Founder & CEO',
        company: 'EduTech',
        avatar: '/avatars/emily.jpg',
        stats: 'Enabled $3M Series A raise',
    },
    {
        content: "The ROI was clear within the first month. We're handling 80% more queries with fewer agents, and customers are happier than ever.",
        author: 'James Liu',
        role: 'CEO',
        company: 'FinanceFlow',
        avatar: '/avatars/james.jpg',
        stats: '80% automation, $125K/year savings',
    },
    {
        content: "Our developer experience went from confusing to delightful overnight. The AI assistant answers questions we didn't even think to document.",
        author: 'Alex Thompson',
        role: 'Head of Developer Relations',
        company: 'DevTools Inc',
        avatar: '/avatars/alex.jpg',
        stats: '60% faster onboarding',
    },
];
export default function Testimonials() {
    return (_jsx("section", { className: "py-24 sm:py-32 bg-white dark:bg-gray-900", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-base font-semibold text-brand-600 mb-2", children: "TESTIMONIALS" }), _jsx("p", { className: "text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "Loved by Developers" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto", children: "Real companies, real results. See how teams save time and money with Clarity Chat." })] }), _jsx("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", children: testimonials.map((testimonial) => (_jsxs("div", { className: "relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow", children: [_jsx("div", { className: "flex gap-1 mb-4", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: "h-5 w-5 fill-yellow-400 text-yellow-400" }, i))) }), _jsxs("blockquote", { className: "text-gray-700 dark:text-gray-300 mb-6 leading-relaxed", children: ["\"", testimonial.content, "\""] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-white font-bold", children: testimonial.author
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('') }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900 dark:text-white", children: testimonial.author }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [testimonial.role, ", ", testimonial.company] })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "text-sm font-semibold text-brand-600", children: testimonial.stats }) })] }, testimonial.author))) }), _jsx("div", { className: "mt-12 text-center", children: _jsxs(Link, { href: "/case-studies", className: "inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors", children: ["Read full case studies", _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }) })] }) }));
}
function ArrowRight({ className }) {
    return (_jsx("svg", { className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) }));
}
//# sourceMappingURL=Testimonials.js.map