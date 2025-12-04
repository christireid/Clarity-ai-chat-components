import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextCard } from '@clarity-chat/react'

/**
 * **ContextCard Component**
 * 
 * Component for displaying context items (documents, images, links)
 * used in chat conversations with preview and metadata.
 * 
 * **Key Features:**
 * - Multiple context types (document, image, link)
 * - Preview display
 * - Metadata (size, timestamp)
 * - Visual type indicators
 * - Accessible with ARIA labels
 * 
 * **Use Cases:**
 * - Document references in chat
 * - Image attachments
 * - Link previews
 * - Context management
 */
const meta: Meta<typeof ContextCard> = {
  title: 'Components/DataDisplay/ContextCard',
  component: ContextCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Component for displaying context items (documents, images, links)
used in chat conversations with preview and metadata.

## Features

- ✅ Multiple context types (document, image, link)
- ✅ Preview display
- ✅ Metadata (size, timestamp)
- ✅ Visual type indicators
- ✅ Accessible with ARIA labels
- ✅ Clickable links and previews

## Basic Usage

\`\`\`tsx
<ContextCard
  context={{
    id: '1',
    type: 'document',
    title: 'Components/DataDisplay/ContextCard',
    preview: 'Document preview text...',
    size: '2.5 MB',
    timestamp: Date.now(),
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    context: {
      description: 'Context item data (document, image, or link)',
      control: { type: 'object' },
    },
    onRemove: {
      description: 'Callback when context is removed',
      action: 'removed',
    },
    showRemove: {
      description: 'Show remove button',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof ContextCard>

export const Document: Story = {
  args: {
    context: {
      id: '1',
      type: 'document',
      title: 'Components/DataDisplay/ContextCard',
      preview: 'Complete guide to React hooks and components...',
      size: '2.5 MB',
      timestamp: Date.now(),
    },
  },
}

export const Image: Story = {
  args: {
    context: {
      id: '2',
      type: 'image',
      title: 'Components/DataDisplay/ContextCard',
      preview: 'https://via.placeholder.com/150',
      size: '1.2 MB',
      timestamp: Date.now(),
    },
  },
}

export const Link: Story = {
  args: {
    context: {
      id: '3',
      type: 'link',
      title: 'Components/DataDisplay/ContextCard',
      preview: 'https://react.dev',
      url: 'https://react.dev',
      timestamp: Date.now(),
    },
  },
}
