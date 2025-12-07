import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Animations & Motion - Learn Clarity Chat',
    description: 'Explore the animation system, motion tokens, and ready-made animated components that ship with Clarity Chat.',
};
export default function AnimationsConceptPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Concept" }), _jsx("h1", { children: "Animations & Motion" }), _jsx("p", { className: "docs-lead", children: "Motion enhances comprehension and delight. Clarity Chat provides consistent animation tokens, framer-motion variants, and animated primitives." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Motion Tokens" }), _jsxs("p", { children: ["Animation behaviour is defined in ", _jsx("code", { children: "@clarity-chat/react/animations" }), ". Durations and easing values are theme-aware so light/dark themes can have different personalities if needed."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_VARIANTS,
  INTERACTION_VARIANTS,
} from '@clarity-chat/react'

console.log(ANIMATION_DURATION.normal) // 250
console.log(ANIMATION_EASING.spring)   // cubic-bezier(0.34, 1.56, 0.64, 1)
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Animated Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "AnimatedList" }), ": Staggered message entry for large lists"] }), _jsxs("li", { children: [_jsx("code", { children: "FeedbackAnimation" }), ": Success/error confetti for celebratory flows"] }), _jsxs("li", { children: [_jsx("code", { children: "StreamingMessage" }), ": Typewriter-like reveal for streaming responses"] })] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  AnimatedList,
  ANIMATION_VARIANTS,
  ChatWindow,
} from '@clarity-chat/react'

function AnimatedTranscript({ messages }: { messages: Message[] }) {
  return (
    <AnimatedList
      items={messages}
      getKey={(message) => message.id}
      motionProps={{
        variants: ANIMATION_VARIANTS.listItem,
      }}
      renderItem={(message) => (
        <Message
          message={message}
          variants={ANIMATION_VARIANTS.fadeSlideUp}
        />
      )}
    />
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Motion with framer-motion" }), _jsx("p", { children: "Because the components are built on top of framer-motion, you can use the exported variants or supply your own." }), _jsx(CodeBlock, { language: "tsx", code: `import { motion } from 'framer-motion'
import {
  ANIMATION_VARIANTS,
  ANIMATION_DURATION,
  StreamingMessage,
} from '@clarity-chat/react'

const bounceVariant = {
  initial: { y: 0 },
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      repeat: Infinity,
    },
  },
}

function LiveTypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <motion.span variants={bounceVariant} animate="animate" />
      <StreamingMessage status="streaming" />
    </div>
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Motion & Accessibility" }), _jsxs("p", { children: ["Respect user preferences with ", _jsx("code", { children: "prefers-reduced-motion" }), ". The theme API already adjusts animations when this setting is detected."] }), _jsx(CodeBlock, { language: "css", code: `@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}` }), _jsx(Callout, { type: "warning", children: "Keep motion purposeful. Message arrivals and contextual UI shifts benefit from animation; raw text entry or critical alerts should remain instant." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Haptics & Feedback" }), _jsx("p", { children: "Pair motion with subtle haptic feedback on mobile devices." }), _jsx(CodeBlock, { language: "tsx", code: `import { useHaptic } from '@clarity-chat/react'

function SendButton() {
  const haptic = useHaptic()

  return (
    <button
      onClick={() => {
        haptic('light')
        sendMessage()
      }}
      className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
    >
      Send
    </button>
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Key Takeaways" }), _jsxs("ul", { children: [_jsx("li", { children: "Reuse motion tokens to ensure consistent feel across the product." }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "AnimatedList" }), " for large message lists to avoid layout thrash."] }), _jsx("li", { children: "Extend animations with framer-motion variants while respecting reduced-motion users." }), _jsx("li", { children: "Enhance critical interactions with haptics and subtle feedback animations." })] })] })] }));
}
//# sourceMappingURL=page.js.map