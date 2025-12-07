'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
const testimonials = [
    {
        quote: "Clarity Chat cut our development time by 60%. The components are polished, accessible, and just work out of the box.",
        author: "Sarah Chen",
        role: "Lead Developer",
        company: "TechCorp",
    },
    {
        quote: "Best React chat library I've used. The TypeScript support is excellent and the documentation is crystal clear.",
        author: "Marcus Rodriguez",
        role: "Senior Engineer",
        company: "StartupXYZ",
    },
    {
        quote: "The accessibility features are top-notch. Finally, a chat UI that works perfectly for all our users.",
        author: "Priya Patel",
        role: "Product Manager",
        company: "Enterprise Inc",
    },
];
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};
const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20
        }
    },
};
export function Testimonials() {
    return (_jsx("section", { className: "py-24", children: _jsxs("div", { className: "container-docs", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }, className: "text-center mb-16", children: [_jsx(motion.h2, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.1 }, className: "text-4xl font-bold mb-4 bg-gradient-to-r from-text-primary to-brand-500 bg-clip-text text-transparent", children: "Loved by Developers" }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.2 }, className: "text-xl text-text-secondary max-w-2xl mx-auto", children: "Join thousands of developers building beautiful chat experiences" })] }), _jsx(motion.div, { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-50px' }, className: "grid md:grid-cols-3 gap-8", children: testimonials.map((testimonial, index) => (_jsxs(motion.div, { variants: item, whileHover: {
                            scale: 1.03,
                            y: -8,
                            transition: { duration: 0.2, ease: 'easeOut' }
                        }, whileTap: { scale: 0.98 }, className: "relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-xl overflow-hidden", children: [_jsx(motion.div, { initial: { rotate: 0 }, whileHover: { rotate: [0, -10, 10, -10, 0], scale: 1.1 }, transition: { duration: 0.5 }, children: _jsx(MessageSquare, { className: "w-8 h-8 text-brand-500/20 mb-4" }) }), _jsxs("p", { className: "text-text-secondary mb-6 leading-relaxed relative z-10 italic", children: ["\"", testimonial.quote, "\""] }), _jsxs("div", { className: "flex items-center gap-3 relative z-10", children: [_jsx(motion.div, { className: "w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md", whileHover: { scale: 1.1, rotate: 5 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, children: testimonial.author.split(' ').map(n => n[0]).join('') }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-text-primary", children: testimonial.author }), _jsxs("div", { className: "text-sm text-text-secondary", children: [testimonial.role, " at ", testimonial.company] })] })] }), _jsx(motion.div, { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none", initial: { opacity: 0 }, whileHover: { opacity: 1 }, transition: { duration: 0.3 } }), _jsx(motion.div, { className: "absolute -inset-0.5 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 blur-md pointer-events-none", initial: { opacity: 0 }, whileHover: { opacity: 1 }, transition: { duration: 0.3 } })] }, index))) })] }) }));
}
//# sourceMappingURL=Testimonials.js.map