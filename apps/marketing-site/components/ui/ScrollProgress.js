'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { motion, useScroll, useSpring } from 'framer-motion';
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    return (_jsx(motion.div, { className: "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-clarity-500 via-cosmic-500 to-pink-500 origin-[0%] z-50", style: { scaleX } }));
}
//# sourceMappingURL=ScrollProgress.js.map