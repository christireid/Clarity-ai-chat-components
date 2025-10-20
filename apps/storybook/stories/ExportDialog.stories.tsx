import type { Meta, StoryObj } from '@storybook/react'
import { ExportDialog } from '@clarity-chat/react'
import type { ExportFormat } from '@clarity-chat/types'

const meta = {
  title: 'Components/ExportDialog',
  component: ExportDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onExport: { action: 'exported' },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof ExportDialog>

export default meta
type Story = StoryObj<typeof meta>

export const ChatExport: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'AI Assistant Conversation',
  },
}

export const KnowledgeBaseExport: Story = {
  args: {
    isOpen: true,
    resourceType: 'knowledge-base',
    resourceName: 'React Best Practices',
  },
}

export const ProjectExport: Story = {
  args: {
    isOpen: true,
    resourceType: 'project',
    resourceName: 'Web Development Project',
  },
}

export const WithDateRange: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'Monthly Summary',
    defaultFormat: 'pdf' as ExportFormat,
  },
}

export const PDFFormat: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'Client Meeting Notes',
    defaultFormat: 'pdf' as ExportFormat,
  },
}

export const DOCXFormat: Story = {
  args: {
    isOpen: true,
    resourceType: 'knowledge-base',
    resourceName: 'Documentation',
    defaultFormat: 'docx' as ExportFormat,
  },
}

export const MarkdownFormat: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'Technical Discussion',
    defaultFormat: 'markdown' as ExportFormat,
  },
}

export const JSONFormat: Story = {
  args: {
    isOpen: true,
    resourceType: 'project',
    resourceName: 'API Documentation',
    defaultFormat: 'json' as ExportFormat,
  },
}

export const HTMLFormat: Story = {
  args: {
    isOpen: true,
    resourceType: 'knowledge-base',
    resourceName: 'User Guide',
    defaultFormat: 'html' as ExportFormat,
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    resourceType: 'chat',
    resourceName: 'Example Chat',
  },
}

export const LongResourceName: Story = {
  args: {
    isOpen: true,
    resourceType: 'project',
    resourceName: 'Complete Enterprise Web Application Development Project with Multiple Features and Integrations',
  },
}

export const AllOptionsEnabled: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'Complete Export',
    defaultFormat: 'pdf' as ExportFormat,
  },
}

// Simulating the exporting state isn't ideal for Storybook,
// but we can document it here for reference
export const Exporting: Story = {
  args: {
    isOpen: true,
    resourceType: 'chat',
    resourceName: 'Large Conversation',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the export dialog. In actual usage, clicking Export will show a progress bar that animates from 0% to 100% before auto-closing.',
      },
    },
  },
}
