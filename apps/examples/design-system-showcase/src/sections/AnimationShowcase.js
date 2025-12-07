import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Animation Showcase
 *
 * Demonstrates animation patterns and transitions
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@clarity-chat/primitives';
export function AnimationShowcase() {
    const [showFade, setShowFade] = useState(false);
    const [showSlide, setShowSlide] = useState(false);
    const [showScale, setShowScale] = useState(false);
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Animation Patterns" }), _jsx("p", { className: "text-muted-foreground", children: "Subtle, intentional animations that enhance the user experience" })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Transition Durations" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { duration: 0.15 }, className: "p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: "Instant" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "duration-150" }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "150ms" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, className: "p-6 rounded-lg ring-1 ring-primary/30 bg-primary/5 cursor-pointer", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: "Fast" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "duration-200" }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "200ms \u2B50" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { duration: 0.3 }, className: "p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: "Normal" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "duration-300" }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "300ms" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, transition: { duration: 0.5 }, className: "p-6 rounded-lg ring-1 ring-border/30 bg-card cursor-pointer", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: "Slow" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "duration-500" }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "500ms" })] })] }), _jsx("p", { className: "text-sm text-muted-foreground mt-4", children: "\u2B50 Most components use duration-200 (200ms) for optimal perceived performance" })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Entrance Animations" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-medium", children: "Fade In" }), _jsx("div", { className: "h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center", children: showFade && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Faded In" })) }), _jsxs(Button, { size: "sm", onClick: () => setShowFade(!showFade), children: [showFade ? 'Hide' : 'Show', " Fade"] }), _jsx("pre", { className: "text-xs bg-background rounded p-2 ring-1 ring-border/30", children: _jsx("code", { children: `initial={{ opacity: 0 }}
animate={{ opacity: 1 }}` }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-medium", children: "Slide In" }), _jsx("div", { className: "h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center overflow-hidden", children: showSlide && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Slid In" })) }), _jsxs(Button, { size: "sm", onClick: () => setShowSlide(!showSlide), children: [showSlide ? 'Hide' : 'Show', " Slide"] }), _jsx("pre", { className: "text-xs bg-background rounded p-2 ring-1 ring-border/30", children: _jsx("code", { children: `initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}` }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-medium", children: "Scale In" }), _jsx("div", { className: "h-32 rounded-lg ring-1 ring-border/30 bg-muted/30 flex items-center justify-center", children: showScale && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 }, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Scaled In" })) }), _jsxs(Button, { size: "sm", onClick: () => setShowScale(!showScale), children: [showScale ? 'Hide' : 'Show', " Scale"] }), _jsx("pre", { className: "text-xs bg-background rounded p-2 ring-1 ring-border/30", children: _jsx("code", { children: `initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}` }) })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Hover Animations" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(motion.div, { whileHover: { y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }, transition: { duration: 0.2 }, className: "p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs cursor-pointer", children: [_jsx("h4", { className: "font-medium mb-2", children: "Lift on Hover" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "-translate-y-[2px]" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { duration: 0.2 }, className: "p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs cursor-pointer", children: [_jsx("h4", { className: "font-medium mb-2", children: "Scale on Hover" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "scale: 1.05" })] }), _jsxs(motion.div, { whileHover: { boxShadow: '0 0 20px rgb(var(--primary) / 0.3)' }, transition: { duration: 0.2 }, className: "p-6 rounded-lg ring-1 ring-primary/30 bg-primary/5 shadow-xs cursor-pointer", children: [_jsx("h4", { className: "font-medium mb-2", children: "Glow on Hover" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Custom shadow" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Loading Animations" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-6 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-4", children: "Spinner" }), _jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full" })] }), _jsxs("div", { className: "p-6 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-4", children: "Pulse" }), _jsx(motion.div, { animate: { opacity: [0.5, 1, 0.5] }, transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, className: "w-16 h-16 bg-primary/20 rounded-full" })] }), _jsxs("div", { className: "p-6 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-4", children: "Bounce" }), _jsx(motion.div, { animate: { y: [0, -10, 0] }, transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }, className: "w-8 h-8 bg-primary rounded-full" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Stagger Animation" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: i * 0.1 }, className: "h-24 rounded-lg ring-1 ring-border/30 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-medium", children: i + 1 }, i))) }), _jsx("p", { className: "text-sm text-muted-foreground mt-4", children: "Items appear with 100ms delay between each" })] }), _jsxs("section", { className: "bg-muted/30 rounded-lg p-6 ring-1 ring-border/30", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Code Example" }), _jsx("pre", { className: "bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30", children: _jsx("code", { children: `import { motion } from 'framer-motion'

// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Hover animation
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Button
</motion.button>

// Loading spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 1, 
    repeat: Infinity, 
    ease: 'linear' 
  }}
  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
/>

// Stagger children
<motion.div>
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>` }) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Animation Guidelines" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg ring-1 ring-green-500/30 bg-green-500/5", children: [_jsx("h4", { className: "font-medium mb-2 text-green-600", children: "\u2705 Do" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Use duration-200 for most interactions" }), _jsx("li", { children: "\u2022 Keep animations subtle and purposeful" }), _jsx("li", { children: "\u2022 Provide visual feedback for user actions" }), _jsx("li", { children: "\u2022 Use easing for natural movement" }), _jsx("li", { children: "\u2022 Test on slower devices" })] })] }), _jsxs("div", { className: "p-4 rounded-lg ring-1 ring-destructive/30 bg-destructive/5", children: [_jsx("h4", { className: "font-medium mb-2 text-destructive", children: "\u274C Don't" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 Overuse animations" }), _jsxs("li", { children: ["\u2022 Make animations too slow (", '>', "500ms)"] }), _jsx("li", { children: "\u2022 Animate without purpose" }), _jsx("li", { children: "\u2022 Use jarring movements" }), _jsx("li", { children: "\u2022 Ignore reduced-motion preferences" })] })] })] })] })] }));
}
//# sourceMappingURL=AnimationShowcase.js.map