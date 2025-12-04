import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocumentViewer } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Memory/DocumentViewer',
  component: DocumentViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component for displaying document content with metadata and highlighting support.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl h-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    document: {
      id: '1',
      name: 'Sample Document',
      type: 'text/plain',
      content: 'This is a sample document content. It can contain any text that needs to be displayed to the user.',
      summary: 'A sample document for demonstration purposes',
      metadata: {
        author: 'John Doe',
        created: '2024-01-15',
      },
      sourceUrl: 'https://example.com/document.pdf',
      tags: ['sample', 'demo'],
    },
  },
}

export const WithHighlighting: Story = {
  args: {
    document: {
      id: '2',
      name: 'Document with Highlighting',
      type: 'text/plain',
      content: 'This document contains some important keywords that can be highlighted when searching. Keywords like "important" and "highlighted" will stand out.',
      summary: 'Document demonstrating search highlighting',
    },
    highlightQuery: 'important',
  },
}

export const WithMetadata: Story = {
  args: {
    document: {
      id: '3',
      name: 'Research Paper',
      type: 'application/pdf',
      content: 'This is a research paper about artificial intelligence and machine learning. It discusses various topics including neural networks, deep learning, and natural language processing.',
      summary: 'A comprehensive research paper on AI/ML',
      metadata: {
        author: 'Jane Smith',
        created: '2024-01-20',
        pages: 25,
        language: 'en',
        category: 'Research',
      },
      sourceUrl: 'https://example.com/research.pdf',
      tags: ['research', 'ai', 'ml', 'academic'],
    },
  },
}

export const EmptyState: Story = {
  args: {
    document: null as any,
  },
}

export const CustomEmptyState: Story = {
  args: {
    document: null as any,
    emptyState: (
      <div className="text-center">
        <p className="text-lg font-semibold">No document selected</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please select a document from the list to view its contents.
        </p>
      </div>
    ),
  },
}

export const LongContent: Story = {
  args: {
    document: {
      id: '4',
      name: 'Long Document',
      type: 'text/plain',
      content: Array(20)
        .fill(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        )
        .join('\n\n'),
      summary: 'A document with extensive content to demonstrate scrolling',
    },
  },
}
