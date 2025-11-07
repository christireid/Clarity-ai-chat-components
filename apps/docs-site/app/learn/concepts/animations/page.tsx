import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Motion & Animations',
  description: 'Leverage Clarity Chat’s animation system for polished, accessible motion design.',
}

export default function AnimationConceptsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Motion &amp; Animations</h1>

      <p className="lead">
        Delight users with purposeful motion. Clarity Chat ships a full animation system—constants,
        presets, helpers, and ready-to-use animated components—built on Framer Motion and tuned for
        accessibility.
      </p>

      <h2 id="animation-system">Animation System</h2>
      <p>
        Import animation constants and variants from <code>@clarity-chat/react/animations</code> to
        keep motion consistent across products.
      </p>
      <CodeBlock
        language="tsx"
        title="Using animation variants"
        code={`import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS, INTERACTION_VARIANTS } from '@clarity-chat/react/animations'

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeSlideUp}
      initial="initial"
      animate="animate"
      whileHover={INTERACTION_VARIANTS.card.hover}
      className="rounded-xl border border-border bg-bg p-6 shadow-sm"
    >
      {children}
    </motion.div>
  )
}`}
      />

      <h2 id="durations-easing">Durations &amp; Easing</h2>
      <p>
        The <code>ANIMATION_DURATION</code> and <code>ANIMATION_EASING</code> maps provide shared
        timing tokens. Use them when building custom transitions so micro-interactions and page
        transitions feel cohesive.
      </p>

      <h2 id="list-animations">List Animations</h2>
      <p>
        <code>AnimatedList</code> and the <code>ANIMATION_VARIANTS.listContainer</code> /
        <code>listItem</code> combos handle staggered entrance/exit for message lists, tool feeds, and
        branching timelines.
      </p>
      <ul>
        <li>
          <strong>Virtualized lists:</strong> combine <code>AnimatedList</code> with{' '}
          <code>VirtualizedMessageList</code> for smooth scrolling through 10k+ messages.
        </li>
        <li>
          <strong>Branching UIs:</strong> <code>ConversationBranchVisualizer</code> uses these presets
          out of the box.
        </li>
      </ul>

      <h2 id="loading-feedback">Loading &amp; Feedback</h2>
      <p>
        Skeletons, spinners, and success animations all use <code>LOADING_ANIMATION</code> presets.
        Drop them into your custom surfaces or use the ready-made <code>FeedbackAnimation</code> and
        <code>ThinkingIndicator</code> components.
      </p>

      <h2 id="gesture-interactions">Gesture Interactions</h2>
      <p>
        <code>INTERACTION_VARIANTS</code> standardise hover, tap, and focus states for buttons, icon
        buttons, cards, and draggable items. Pair them with <code>Draggable</code> +{' '}
        <code>ContextMenu</code> to create rich, keyboard-accessible interactions.
      </p>

      <Callout type="warning">
        <p>
          Avoid choreography overload—respect reduced motion preferences. Components automatically
          honour <code>prefers-reduced-motion</code>, but remember to wrap custom motion with the same
          checks.
        </p>
      </Callout>

      <h2 id="performance">Performance Tips</h2>
      <ul>
        <li>Batch animation-heavy updates using <code>React.startTransition</code>.</li>
        <li>
          Use <code>VirtualizedMessageList</code> + <code>useMessageListPerformance</code> to monitor
          render time.
        </li>
        <li>
          Defer expensive motion until idle with <code>requestIdleCallback</code> (see{' '}
          <code>useMessageListPerformance</code> implementation).
        </li>
      </ul>

      <p>
        Continue with the <a href="/guides/performance">performance guide</a> to learn how animation
        presets interact with virtualization and streaming pipelines.
      </p>
    </>
  )
}
