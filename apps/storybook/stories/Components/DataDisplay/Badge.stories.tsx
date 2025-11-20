import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@clarity-chat/primitives'
import { expect, within } from '@storybook/test'

/**
 * Badge component for displaying small count indicators, status labels, and tags.
 * 
 * **Key Features:**
 * - Multiple variants (default, secondary, destructive, outline)
 * - Compact and readable
 * - Can be used with icons
 * 
 * **Use Cases:**
 * - Status indicators
 * - Notification counts
 * - Tags and labels
 * - Category markers
 */
const meta = {
  title: 'Components/DataDisplay/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Small count and label indicators for status, categories, and notifications.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test badge renders with correct text
    await expect(canvas.getByText('Badge')).toBeInTheDocument()
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test all badge variants are rendered
    await expect(canvas.getByText('Default')).toBeInTheDocument()
    await expect(canvas.getByText('Secondary')).toBeInTheDocument()
    await expect(canvas.getByText('Destructive')).toBeInTheDocument()
    await expect(canvas.getByText('Outline')).toBeInTheDocument()
  },
}

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Online:</span>
        <Badge className="bg-green-500">Active</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Processing:</span>
        <Badge className="bg-yellow-500">Pending</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Error:</span>
        <Badge variant="destructive">Failed</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Completed:</span>
        <Badge className="bg-blue-500">Success</Badge>
      </div>
    </div>
  ),
}

export const WithCounts: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Unread Messages</span>
        <Badge className="bg-red-500">12</Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">Active Chats</span>
        <Badge className="bg-green-500">3</Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">Notifications</span>
        <Badge className="bg-blue-500">99+</Badge>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test count badges display correct numbers
    await expect(canvas.getByText('12')).toBeInTheDocument()
    await expect(canvas.getByText('3')).toBeInTheDocument()
    await expect(canvas.getByText('99+')).toBeInTheDocument()
  },
}

export const Tags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">React</Badge>
      <Badge variant="outline">TypeScript</Badge>
      <Badge variant="outline">AI</Badge>
      <Badge variant="outline">Chat</Badge>
      <Badge variant="outline">Components</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test tag badges are rendered
    await expect(canvas.getByText('React')).toBeInTheDocument()
    await expect(canvas.getByText('TypeScript')).toBeInTheDocument()
    await expect(canvas.getByText('AI')).toBeInTheDocument()
    await expect(canvas.getByText('Chat')).toBeInTheDocument()
    await expect(canvas.getByText('Components')).toBeInTheDocument()
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Verified
      </Badge>
      
      <Badge className="bg-blue-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Premium
      </Badge>
      
      <Badge className="bg-yellow-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Warning
      </Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge className="text-xs px-1.5 py-0.5">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-base px-3 py-1">Large</Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Chat Session #1234</h3>
          <Badge className="bg-green-500">Active</Badge>
        </div>
        <p className="text-sm text-gray-600">Last message 2 minutes ago</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            Notifications
            <Badge variant="destructive">5 New</Badge>
          </h3>
        </div>
        <p className="text-sm text-gray-600">You have unread messages</p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">AI Model</h3>
          <div className="flex gap-1">
            <Badge variant="outline">GPT-4</Badge>
            <Badge className="bg-blue-500">Latest</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">Using the latest model</p>
      </div>
    </div>
  ),
}
