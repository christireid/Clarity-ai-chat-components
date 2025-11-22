import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Animations & Motion - Learn Clarity Chat',
  description:
    'Explore the animation system, motion tokens, and ready-made animated components that ship with Clarity Chat.',
}

export default function AnimationsConceptPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Concept</span>
        <h1>Animations &amp; Motion</h1>
        <p className="docs-lead">
          Motion enhances comprehension and delight. Clarity Chat provides
          consistent animation tokens, framer-motion variants, and animated
          primitives.
        </p>
      </div>

      <section className="docs-section">
        <h2>Motion Tokens</h2>
        <p>
          Animation behaviour is defined in <code>@clarity-chat/react/animations</code>.
          Durations and easing values are theme-aware so light/dark themes can have
          different personalities if needed.
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
console.log(ANIMATION_EASING.spring)   // cubic-bezier(0.34, 1.56, 0.64, 1)
`}
        />
      </section>

      <section className="docs-section">
        <h2>Animated Components</h2>
        <ul>
          <li>
            <code>AnimatedList</code>: Staggered message entry for large lists
          </li>
          <li>
            <code>FeedbackAnimation</code>: Success/error confetti for celebratory flows
          </li>
          <li>
            <code>StreamingMessage</code>: Typewriter-like reveal for streaming responses
          </li>
        </ul>
        <CodeBlock
          language="tsx"
          code={`import {
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
`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Motion with framer-motion</h2>
        <p>
          Because the components are built on top of framer-motion, you can use
          the exported variants or supply your own.
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
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Motion &amp; Accessibility</h2>
        <p>
          Respect user preferences with <code>prefers-reduced-motion</code>. The
          theme API already adjusts animations when this setting is detected.
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
          Keep motion purposeful. Message arrivals and contextual UI shifts benefit
          from animation; raw text entry or critical alerts should remain instant.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Haptics &amp; Feedback</h2>
        <p>
          Pair motion with subtle haptic feedback on mobile devices.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useHaptic } from '@clarity-chat/react'

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
`}
        />
      </section>

      <section className="docs-section">
        <h2>Key Takeaways</h2>
        <ul>
          <li>Reuse motion tokens to ensure consistent feel across the product.</li>
          <li>Use <code>AnimatedList</code> for large message lists to avoid layout thrash.</li>
          <li>Extend animations with framer-motion variants while respecting reduced-motion users.</li>
          <li>Enhance critical interactions with haptics and subtle feedback animations.</li>
        </ul>
      </section>
    </div>
  )
}

