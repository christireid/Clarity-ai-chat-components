'use client'

import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { TypingIndicator, StreamingMessage } from '@clarity-chat/react'
import { ScrollReveal } from '@/components/UI/ScrollReveal'

function TypingIndicatorDemo() {
  const [variant, setVariant] = useState<'dots' | 'pulse' | 'wave'>('dots')

  return (
    <div className="flex flex-col gap-6 items-center justify-center p-8 bg-background rounded-lg border border-border">
      <div className="flex gap-2 mb-4">
        {['dots', 'pulse', 'wave'].map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v as any)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              variant === v
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      <TypingIndicator variant={variant} />
    </div>
  )
}

function MotionPlayground() {
  const [stiffness, setStiffness] = useState(300)
  const [damping, setDamping] = useState(20)
  const [key, setKey] = useState(0)

  const spring: Transition = {
    type: 'spring',
    stiffness,
    damping,
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 bg-card border border-border rounded-xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              Stiffness: {stiffness}
            </label>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            value={stiffness}
            onChange={(e) => setStiffness(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls the tightness of the spring. Higher = snappier.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Damping: {damping}</label>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls how fast the motion settles. Lower = bouncier.
          </p>
        </div>

        <button
          onClick={() => setKey((k) => k + 1)}
          className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Replay Animation
        </button>
      </div>

      <div className="flex items-center justify-center bg-muted/30 rounded-lg min-h-[200px]">
        <motion.div
          key={key}
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={spring}
          className="w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center"
        >
          <span className="text-3xl">✨</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function AnimationsConceptPage() {
  return (
    <div className="docs-content">
      <ScrollReveal>
        <div className="docs-header mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            Concept
          </span>
          <h1 className="text-4xl font-bold mb-4">Animations &amp; Motion</h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Motion enhances comprehension and delight. Clarity Chat provides
            consistent animation tokens, Framer Motion variants, and animated
            primitives that make your chat feel alive.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="docs-section mb-12">
          <h2>Motion Playground</h2>
          <p className="mb-6">
            Our animation system is built on spring physics to create natural,
            responsive interactions. Experiment with the parameters below to see
            how they affect the feel of UI elements.
          </p>
          <MotionPlayground />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="docs-section mb-12">
          <h2>Motion Tokens</h2>
          <p>
            Animation behaviour is defined in{' '}
            <code>@clarity-chat/react/animations</code>. Durations and easing
            values are theme-aware so light/dark themes can have different
            personalities if needed.
          </p>
          <CodeBlock
            language="tsx"
            code={`import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_VARIANTS,
  INTERACTION_VARIANTS,
} from '@clarity-chat/react'

console.log(ANIMATION_DURATION.normal) // 250
console.log(ANIMATION_EASING.spring)   // cubic-bezier(0.34, 1.56, 0.64, 1)`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <section className="docs-section mb-12">
          <h2>Animated Components</h2>
          <p>
            We provide drop-in components that handle complex animations for
            you.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">Typing Indicator</h3>
          <p className="mb-4">
            Communicates that the AI is working. Supports multiple physics-based
            variants.
          </p>
          <ComponentPreview
            title="Typing Indicator"
            description="Interactive demo of typing indicator variants."
            code={`import { TypingIndicator } from '@clarity-chat/react'

// Render
<TypingIndicator variant="dots" />`}
          >
            <TypingIndicatorDemo />
          </ComponentPreview>

          <h3 className="text-xl font-semibold mt-8 mb-4">Streaming Message</h3>
          <p className="mb-4">
            Reveals text token-by-token for a realistic typewriter effect that
            improves reading comprehension.
          </p>
          <div className="p-6 border border-border rounded-lg bg-card">
            <StreamingMessage
              content="This message is streaming in real-time. It uses a smooth reveal animation that makes reading easier and feels more natural than a sudden block of text appearing at once."
              isStreaming={true}
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <section className="docs-section mb-12">
          <h2>Custom Motion with framer-motion</h2>
          <p>
            Because the components are built on top of framer-motion, you can
            use the exported variants or supply your own.
          </p>
          <CodeBlock
            language="tsx"
            code={`import { motion } from 'framer-motion'
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
}`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <section className="docs-section">
          <h2>Motion &amp; Accessibility</h2>
          <p>
            Respect user preferences with <code>prefers-reduced-motion</code>.
            The theme API already adjusts animations when this setting is
            detected.
          </p>
          <CodeBlock
            language="css"
            code={`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
          />
          <Callout type="warning">
            Keep motion purposeful. Message arrivals and contextual UI shifts
            benefit from animation; raw text entry or critical alerts should
            remain instant.
          </Callout>
        </section>
      </ScrollReveal>
    </div>
  )
}
