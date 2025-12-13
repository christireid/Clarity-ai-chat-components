'use client'

import { TypingIndicator } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

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

export const dynamic = 'force-dynamic'

export default function TypingIndicatorPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>TypingIndicator</h1>

      <p className="lead">
        A classic "typing..." indicator with multiple animation styles, used to
        show that the AI is generating a response or performing an action.
      </p>

      <ViewInStorybook component="TypingIndicator" />

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { TypingIndicator } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="usage">Usage</h2>

      <ComponentPreview
        title="Basic Usage"
        description="Default typing indicator with avatar."
        code={`<TypingIndicator />`}
      >
        <TypingIndicatorDemo />
      </ComponentPreview>

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

      <h2 id="props">Props</h2>

      <PropsTable props={typingIndicatorProps} />
    </>
  )
}
