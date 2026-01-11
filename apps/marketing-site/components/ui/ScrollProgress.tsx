'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Don't render the animated progress bar if user prefers reduced motion
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-clarity-500 via-cosmic-500 to-pink-500 origin-[0%] z-50"
      style={{ scaleX }}
    />
  );
}
