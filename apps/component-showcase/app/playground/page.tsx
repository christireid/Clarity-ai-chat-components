'use client'

import { PageHeader, ComponentSection } from '@/components/component-section'
import { Playground, type PlaygroundConfig } from '@/components/playground'
import { playgroundDocs } from '@/data/docs/playground-docs'
import { Gamepad2 } from 'lucide-react'
import { TypingIndicator } from '@clarity-chat/react'
import { AnimatedDots, CopyButton } from '@clarity-chat/react/internal'
import { Progress } from '@clarity-chat/primitives'

// ---------------------------------------------------------------------------
// Playground Configs
// ---------------------------------------------------------------------------

const animatedDotsConfig: PlaygroundConfig = {
  name: 'AnimatedDots',
  importStatement:
    "import { AnimatedDots } from '@clarity-chat/react/internal'",
  component: (props) => (
    <AnimatedDots
      variant={props.variant as 'bounce' | 'pulse' | 'wave' | 'fade'}
      count={props.count as number}
      size={props.size as 'sm' | 'md' | 'lg'}
      staggerDelay={props.staggerDelay as number}
      className=""
      dotClassName=""
      duration={undefined as unknown as number}
    />
  ),
  controls: [
    {
      name: 'variant',
      type: 'select',
      default: 'bounce',
      options: ['bounce', 'pulse', 'wave', 'fade'],
    },
    {
      name: 'size',
      type: 'select',
      default: 'md',
      options: ['sm', 'md', 'lg'],
    },
    { name: 'count', type: 'number', default: 3, min: 1, max: 8, step: 1 },
    {
      name: 'staggerDelay',
      type: 'number',
      default: 0.15,
      min: 0.05,
      max: 0.5,
      step: 0.05,
    },
  ],
}

const copyButtonConfig: PlaygroundConfig = {
  name: 'CopyButton',
  importStatement: "import { CopyButton } from '@clarity-chat/react/internal'",
  component: (props) => (
    <CopyButton
      text={props.text as string}
      onCopy={() => {}}
      onCopyError={() => {}}
      iconOnly={props.iconOnly as boolean}
      showTooltip={props.showTooltip as boolean}
      copyText={props.copyText as string}
      copiedText={props.copiedText as string}
    >
      {!(props.iconOnly as boolean) && ((props.copyText as string) || 'Copy')}
    </CopyButton>
  ),
  controls: [
    { name: 'text', type: 'string', default: 'Hello, World!' },
    { name: 'iconOnly', type: 'boolean', default: false },
    { name: 'showTooltip', type: 'boolean', default: false },
    { name: 'copyText', type: 'string', default: 'Copy' },
    { name: 'copiedText', type: 'string', default: 'Copied!' },
  ],
}

const typingIndicatorConfig: PlaygroundConfig = {
  name: 'TypingIndicator',
  importStatement: "import { TypingIndicator } from '@clarity-chat/react'",
  component: (props) => (
    <TypingIndicator
      showAvatar={props.showAvatar as boolean}
      avatarSrc=""
      avatarFallback={props.avatarFallback as string}
      label={props.label as string}
      variant={props.variant as 'dots' | 'pulse' | 'wave'}
      className=""
    />
  ),
  controls: [
    {
      name: 'variant',
      type: 'select',
      default: 'dots',
      options: ['dots', 'pulse', 'wave'],
    },
    { name: 'showAvatar', type: 'boolean', default: true },
    { name: 'avatarFallback', type: 'string', default: 'AI' },
    { name: 'label', type: 'string', default: 'AI is typing' },
  ],
}

const progressConfig: PlaygroundConfig = {
  name: 'Progress',
  importStatement: "import { Progress } from '@clarity-chat/primitives'",
  component: (props) => (
    <div className="w-full max-w-xs">
      <Progress value={props.value as number} className="h-2" />
      {(props.showLabel as boolean) && (
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {String(props.value)}%
        </p>
      )}
    </div>
  ),
  controls: [
    { name: 'value', type: 'number', default: 60, min: 0, max: 100, step: 1 },
    { name: 'showLabel', type: 'boolean', default: false },
  ],
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PlaygroundPage() {
  return (
    <div>
      <PageHeader
        title="Interactive Playground"
        description="Experiment with components in real-time. Adjust props and see the result instantly."
        icon={Gamepad2}
        badge="Interactive"
      />

      <ComponentSection
        title="AnimatedDots"
        description="Animated loading dots with multiple variants, sizes, and timing controls."
        icon={Gamepad2}
        docs={playgroundDocs['AnimatedDots']}
      >
        <Playground config={animatedDotsConfig} />
      </ComponentSection>

      <ComponentSection
        title="CopyButton"
        description="A copy-to-clipboard button with customizable text and visual feedback."
        icon={Gamepad2}
        docs={playgroundDocs['CopyButton']}
      >
        <Playground config={copyButtonConfig} />
      </ComponentSection>

      <ComponentSection
        title="TypingIndicator"
        description="Classic chat typing indicator with avatar and animation variants."
        icon={Gamepad2}
        docs={playgroundDocs['TypingIndicator']}
      >
        <Playground config={typingIndicatorConfig} />
      </ComponentSection>

      <ComponentSection
        title="Progress"
        description="A progress bar with adjustable value and optional label."
        icon={Gamepad2}
        docs={playgroundDocs['Progress']}
      >
        <Playground config={progressConfig} />
      </ComponentSection>
    </div>
  )
}
