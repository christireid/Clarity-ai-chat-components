import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocumentViewer } from '@clarity-chat/react'

const meta: Meta<typeof DocumentViewer> = {
  title: 'Components/Media/DocumentViewer',
  component: DocumentViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Display document content with metadata, highlighting, and navigation. Supports text content, structured data, and external links.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof DocumentViewer>

const mockDocument = {
  id: 'doc-1',
  name: 'Getting Started Guide',
  type: 'markdown',
  content: `# Getting Started

This is a comprehensive guide to get you started with our platform.

## Quick Start

1. Sign up for an account
2. Create your first project
3. Invite team members
4. Start building!

## Features

- **Easy Setup**: Get started in minutes
- **Team Collaboration**: Work together seamlessly
- **Advanced Analytics**: Track your progress
- **API Access**: Integrate with your tools

## Next Steps

Explore our documentation and start building amazing things!`,
  summary: 'A comprehensive guide covering setup, features, and next steps for new users.',
  metadata: {
    author: 'Documentation Team',
    created: '2024-01-15',
    lastModified: '2024-01-20',
    wordCount: 156,
  },
  sourceUrl: 'https://docs.example.com/getting-started',
  tags: ['guide', 'tutorial', 'getting-started'],
}

const codeDocument = {
  id: 'doc-2',
  name: 'API Client',
  type: 'typescript',
  content: `// API Client Implementation
import { fetch } from 'undici'

export interface ApiClientOptions {
  baseUrl: string
  timeout?: number
  retries?: number
}

export class ApiClient {
  constructor(private options: ApiClientOptions) {}

  async get<T>(endpoint: string): Promise<T> {
    const url = \`\${this.options.baseUrl}\${endpoint}\`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }

    return response.json()
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = \`\${this.options.baseUrl}\${endpoint}\`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }

    return response.json()
  }
}`,
  metadata: {
    language: 'typescript',
    lines: 42,
    size: '1.2 KB',
  },
  tags: ['api', 'typescript', 'client'],
}

export const Default: Story = {
  args: {
    document: mockDocument,
  },
}

export const WithHighlighting: Story = {
  args: {
    document: mockDocument,
    highlightQuery: 'started',
  },
}

export const CodeDocument: Story = {
  args: {
    document: codeDocument,
  },
}

export const NoDocument: Story = {
  args: {
    document: undefined,
    emptyState: <div className="text-center text-muted-foreground">No document selected</div>,
  },
}

export const WithCustomStyling: Story = {
  args: {
    document: mockDocument,
    className: 'max-h-96 border-2 border-dashed border-primary/20 rounded-lg',
  },
}