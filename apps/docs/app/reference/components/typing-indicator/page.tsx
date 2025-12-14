'use client'

import { TypingIndicator } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

function TypingIndicatorDemo() {
  return (
    <div className="flex flex-col gap-4 p-4 border border-border rounded-lg bg-background">
      <TypingIndicator />
    </div>
  )
}

function VariantsDemo() {
  return (
    <div className="flex flex-col gap-6 p-4 border border-border rounded-lg bg-background">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Dots (Default)</p>
        <TypingIndicator variant="dots" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pulse</p>
        <TypingIndicator variant="pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Wave</p>
        <TypingIndicator variant="wave" />
      </div>
    </div>
  )
}

const typingIndicatorProps: Prop[] = [
  {
    name: 'showAvatar',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the avatar next to the indicator.',
  },
  {
    name: 'avatarSrc',
    type: 'string',
    description: 'URL for the avatar image.',
  },
  {
    name: 'avatarFallback',
    type: 'string',
    default: "'AI'",
    description: 'Fallback text for the avatar.',
  },
  {
    name: 'variant',
    type: "'dots' | 'pulse' | 'wave'",
    default: "'dots'",
    description: 'The animation style.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'AI is typing'",
    description: 'ARIA label for accessibility.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function TypingIndicatorPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            TypingIndicator
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A classic "typing..." indicator with multiple animation styles, used
            to show that the AI is generating a response or performing an
            action.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ViewInStorybook component="TypingIndicator" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h2 id="import">Import</h2>
        <EnhancedCodeBlock
          code={`import { TypingIndicator } from '@clarity-chat/react'`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="usage">Usage</h2>
        <ComponentPreview
          title="Basic Usage"
          description="Default typing indicator with avatar."
          code={`<TypingIndicator />`}
        >
          <TypingIndicatorDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="variants">Variants</h2>
        <ComponentPreview
          title="Animation Variants"
          description="Different animation styles for the typing bubble."
          code={`<TypingIndicator variant="dots" />
<TypingIndicator variant="pulse" />
<TypingIndicator variant="wave" />`}
        >
          <VariantsDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="props">Props</h2>
        <PropsTable props={typingIndicatorProps} />
      </ScrollReveal>
    </div>
  )
}
