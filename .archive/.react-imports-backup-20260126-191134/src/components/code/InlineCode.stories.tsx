import type { Meta, StoryObj } from '@storybook/react'
import { InlineCode } from './InlineCode'

const meta: Meta<typeof InlineCode> = {
  title: 'Components/Code/InlineCode',
  component: InlineCode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Styled inline code component for displaying code snippets within text.

## Features
- **Three Variants**: Default, subtle, and highlighted styles
- **Monospace Font**: Proper code typography
- **Seamless Integration**: Blends naturally with surrounding text
- **Accessible**: Proper semantic HTML with \`<code>\` element
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'highlighted'],
      description: 'Visual style variant',
    },
  },
}

export default meta
type Story = StoryObj<typeof InlineCode>

export const Default: Story = {
  args: {
    children: 'npm install',
  },
}

export const Subtle: Story = {
  args: {
    children: 'useState',
    variant: 'subtle',
  },
}

export const Highlighted: Story = {
  args: {
    children: 'useEffect',
    variant: 'highlighted',
  },
}

export const InParagraph: Story = {
  render: () => (
    <p className="text-base leading-relaxed">
      To get started, run{' '}
      <InlineCode>npm install @clarity-chat/react</InlineCode> in your project
      directory. Then import the{' '}
      <InlineCode variant="subtle">CodeBlock</InlineCode> component and use it
      in your JSX. For streaming responses, use the{' '}
      <InlineCode variant="highlighted">StreamingCodeBlock</InlineCode>{' '}
      component instead.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline code naturally integrates with surrounding text.',
      },
    },
  },
}

export const VariantComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-medium mr-2">Default:</span>
        <InlineCode variant="default">const x = 1</InlineCode>
      </div>
      <div>
        <span className="text-sm font-medium mr-2">Subtle:</span>
        <InlineCode variant="subtle">const x = 1</InlineCode>
      </div>
      <div>
        <span className="text-sm font-medium mr-2">Highlighted:</span>
        <InlineCode variant="highlighted">const x = 1</InlineCode>
      </div>
    </div>
  ),
}

export const Commands: Story = {
  render: () => (
    <div className="space-y-2">
      <p>
        Install: <InlineCode>pnpm add @clarity-chat/react</InlineCode>
      </p>
      <p>
        Build: <InlineCode>pnpm build</InlineCode>
      </p>
      <p>
        Test: <InlineCode>pnpm test</InlineCode>
      </p>
    </div>
  ),
}
