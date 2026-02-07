import type { ComponentDoc } from '@/components/doc-panel'

export const playgroundDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // AnimatedDots
  // ===========================================================================
  AnimatedDots: {
    name: 'AnimatedDots',
    description:
      'Animated loading dots with multiple animation variants (bounce, pulse, wave, fade). Configurable dot count, size, stagger delay, and fully respects reduced motion preferences.',
    importPath: '@clarity-chat/react/internal',
    usageCode: `import { AnimatedDots } from '@clarity-chat/react/internal'

<AnimatedDots variant="bounce" size="md" count={3} />
<AnimatedDots variant="wave" size="lg" count={4} staggerDelay={0.2} />
<AnimatedDots variant="pulse" size="sm" className="text-primary" />`,
    props: [
      {
        name: 'variant',
        type: '"bounce" | "pulse" | "wave" | "fade"',
        default: '"bounce"',
        description: 'Animation style for the dots.',
        commonlyUsed: true,
      },
      {
        name: 'count',
        type: 'number',
        default: '3',
        description: 'Number of dots (1–10).',
        commonlyUsed: true,
      },
      {
        name: 'size',
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: 'Size preset: sm = 4px, md = 8px, lg = 12px.',
        commonlyUsed: true,
      },
      {
        name: 'staggerDelay',
        type: 'number',
        default: '0.15',
        description:
          'Delay in seconds between each dot starting its animation.',
      },
      {
        name: 'duration',
        type: 'number',
        description:
          'Override animation duration. Each variant has its own default.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'CSS class for the container element.',
      },
      {
        name: 'dotClassName',
        type: 'string',
        description: 'CSS class applied to each individual dot.',
      },
    ],
    notes: [
      'Imported from @clarity-chat/react/internal — these APIs are experimental.',
      'Automatically respects prefers-reduced-motion media query.',
    ],
    sourceFile: 'packages/react/src/components/message/AnimatedDots.tsx',
  },

  // ===========================================================================
  // CopyButton
  // ===========================================================================
  CopyButton: {
    name: 'CopyButton',
    description:
      'A copy-to-clipboard button with visual feedback. Shows a check icon after copying, supports icon-only mode and custom labels.',
    importPath: '@clarity-chat/react/internal',
    usageCode: `import { CopyButton } from '@clarity-chat/react/internal'

<CopyButton text="Hello, World!" />
<CopyButton text={codeString} iconOnly />
<CopyButton text={text} copyText="Copy code" copiedText="Copied!" />`,
    props: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The text to copy to the clipboard.',
        commonlyUsed: true,
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Show only the copy icon without any text label.',
        commonlyUsed: true,
      },
      {
        name: 'copyText',
        type: 'string',
        default: '"Copy"',
        description: 'Label shown before copying.',
      },
      {
        name: 'copiedText',
        type: 'string',
        default: '"Copied!"',
        description: 'Label shown after successful copy.',
      },
      {
        name: 'showTooltip',
        type: 'boolean',
        default: 'false',
        description: 'Show a tooltip on hover.',
      },
      {
        name: 'onCopy',
        type: '() => void',
        description: 'Callback fired after successful copy.',
      },
      {
        name: 'onCopyError',
        type: '() => void',
        description: 'Callback fired if copy fails (e.g., non-HTTPS context).',
      },
    ],
    notes: [
      'Uses navigator.clipboard.writeText with a fallback for non-HTTPS contexts.',
      'Imported from @clarity-chat/react/internal — these APIs are experimental.',
    ],
    sourceFile: 'packages/react/src/components/ui/CopyButton.tsx',
  },

  // ===========================================================================
  // TypingIndicator
  // ===========================================================================
  TypingIndicator: {
    name: 'TypingIndicator',
    description:
      'Classic chat typing indicator showing that the AI is composing a response. Supports avatar display and multiple animation variants.',
    importPath: '@clarity-chat/react',
    usageCode: `import { TypingIndicator } from '@clarity-chat/react'

<TypingIndicator variant="dots" />
<TypingIndicator variant="pulse" showAvatar avatarFallback="AI" />
<TypingIndicator variant="wave" label="Claude is thinking" />`,
    props: [
      {
        name: 'variant',
        type: '"dots" | "pulse" | "wave"',
        default: '"dots"',
        description: 'Animation style.',
        commonlyUsed: true,
      },
      {
        name: 'showAvatar',
        type: 'boolean',
        default: 'false',
        description: 'Show an avatar circle next to the indicator.',
        commonlyUsed: true,
      },
      {
        name: 'avatarFallback',
        type: 'string',
        default: '"AI"',
        description: 'Text shown inside the avatar when no image is provided.',
      },
      {
        name: 'avatarSrc',
        type: 'string',
        description: 'URL for the avatar image.',
      },
      {
        name: 'label',
        type: 'string',
        default: '"AI is typing"',
        description: 'Accessible label and visual text.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names.',
      },
    ],
    sourceFile: 'packages/react/src/components/message/TypingIndicator.tsx',
  },

  // ===========================================================================
  // Progress
  // ===========================================================================
  Progress: {
    name: 'Progress',
    description:
      'A progress bar component from the primitives package. Displays a visual indicator of completion percentage.',
    importPath: '@clarity-chat/primitives',
    usageCode: `import { Progress } from '@clarity-chat/primitives'

<Progress value={60} />
<Progress value={100} className="h-2" />`,
    props: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'Current progress value (0–100).',
        commonlyUsed: true,
      },
      {
        name: 'max',
        type: 'number',
        default: '100',
        description: 'Maximum value for the progress bar.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'CSS class for styling the progress bar container.',
      },
    ],
    notes: [
      'Based on Radix UI Progress primitive.',
      'Use className="h-2" for a thinner bar, or "h-4" for a thicker one.',
    ],
  },
}
