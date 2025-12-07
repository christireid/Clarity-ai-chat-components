'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Download, TrendingUp } from 'lucide-react';
function StatItem({ icon, value, label, trend }) {
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.9 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true, margin: '-50px' }, transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20
        }, whileHover: {
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
        }, onHoverStart: () => setIsHovered(true), onHoverEnd: () => setIsHovered(false), className: "group relative text-center p-6 rounded-xl border border-transparent hover:border-brand-500/30 transition-all hover:shadow-lg hover:bg-bg-primary/50", children: [_jsx(motion.div, { className: "flex items-center justify-center mb-3 text-brand-500", animate: {
                    rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                    scale: isHovered ? 1.1 : 1
                }, transition: { duration: 0.5 }, children: icon }), _jsx(motion.div, { className: "text-3xl md:text-4xl font-bold mb-1 text-text-primary", animate: {
                    scale: isHovered ? 1.05 : 1
                }, transition: { duration: 0.2 }, children: value }), _jsx("div", { className: "text-sm text-text-secondary font-medium", children: label }), trend && (_jsxs(motion.div, { className: "flex items-center justify-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-semibold", initial: { opacity: 0, y: 5 }, whileInView: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, children: [_jsx(motion.div, { animate: {
                            y: isHovered ? [-2, 2, -2] : 0
                        }, transition: {
                            duration: 1,
                            repeat: isHovered ? Infinity : 0
                        }, children: _jsx(TrendingUp, { className: "w-3 h-3" }) }), _jsx("span", { children: trend })] })), _jsx(motion.div, { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none", initial: { opacity: 0 }, whileHover: { opacity: 1 }, transition: { duration: 0.3 } })] }));
}
export function SocialProof() {
    const stats = [
        {
            icon: _jsx(Download, { className: "w-8 h-8" }),
            value: '50K+',
            label: 'NPM Downloads',
            trend: '+12% this month'
        },
        {
            icon: _jsx(Star, { className: "w-8 h-8" }),
            value: '2.5K+',
            label: 'GitHub Stars',
            trend: 'Growing daily'
        },
        {
            icon: _jsx(Users, { className: "w-8 h-8" }),
            value: '10K+',
            label: 'Developers',
            trend: 'Worldwide'
        },
        {
            icon: _jsx("span", { className: "text-3xl", children: "\uD83C\uDFC6" }),
            value: '100%',
            label: 'WCAG AAA',
            trend: undefined
        }
    ];
    return (_jsxs("section", { className: "py-16 border-y border-border bg-bg-secondary/50 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-purple-500/5 pointer-events-none" }), _jsx("div", { className: "container-docs relative", children: _jsx(motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-100px' }, variants: {
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.1
                            }
                        }
                    }, className: "grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12", children: stats.map((stat, index) => (_jsx(motion.div, { variants: {
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 }
                        }, children: _jsx(StatItem, { ...stat }) }, index))) }) })] }));
}
//# sourceMappingURL=SocialProof.js.map