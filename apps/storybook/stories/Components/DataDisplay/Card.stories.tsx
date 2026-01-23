import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { expect, userEvent, within } from '@storybook/test'

/**
 * Card component provides a flexible container for content sections.
 *
 * **Key Features:**
 * - Composable structure with Header, Content, and Footer
 * - Consistent styling and spacing
 * - Flexible and customizable
 *
 * **Use Cases:**
 * - Feature highlights
 * - Content grouping
 * - Dashboard widgets
 * - Settings panels
 */
const meta = {
  title: 'Components/DataDisplay/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible container component for grouping related content.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some example text to demonstrate the layout.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test card structure renders correctly
    await expect(canvas.getByText('Card Title')).toBeInTheDocument()
    await expect(
      canvas.getByText('Card description goes here')
    ).toBeInTheDocument()
    await expect(
      canvas.getByText(/Card content with some example text/)
    ).toBeInTheDocument()
  },
}

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <input
            type="text"
            placeholder="My Awesome Project"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test card with footer and buttons
    await expect(canvas.getByText('Create Project')).toBeInTheDocument()
    await expect(canvas.getByRole('textbox')).toBeInTheDocument()

    const cancelButton = canvas.getByRole('button', { name: /cancel/i })
    const deployButton = canvas.getByRole('button', { name: /deploy/i })

    await expect(cancelButton).toBeInTheDocument()
    await expect(deployButton).toBeInTheDocument()

    // Test button click
    await userEvent.click(deployButton)
  },
}

export const FeatureCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
        <CardTitle>Lightning Fast</CardTitle>
        <CardDescription>Optimized for speed and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Built with modern technologies and best practices to ensure your
          application runs smoothly at scale.
        </p>
      </CardContent>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,345</div>
          <p className="text-xs text-gray-500">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-gray-500">+8% from last month</p>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test stats cards render with correct data
    await expect(canvas.getByText('Total Messages')).toBeInTheDocument()
    await expect(canvas.getByText('2,345')).toBeInTheDocument()
    await expect(canvas.getByText('+12% from last month')).toBeInTheDocument()

    await expect(canvas.getByText('Active Users')).toBeInTheDocument()
    await expect(canvas.getByText('573')).toBeInTheDocument()
    await expect(canvas.getByText('+8% from last month')).toBeInTheDocument()
  },
}

export const ChatPreviewCard: Story = {
  render: () => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            AI
          </div>
          <div>
            <CardTitle className="text-base">Customer Support Bot</CardTitle>
            <CardDescription className="text-xs">
              Last active 2 minutes ago
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          How can I help you track your order today?
        </p>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>156 messages</span>
          <span>•</span>
          <span>3 participants</span>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const InteractiveCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Configuration</CardTitle>
        <CardDescription>
          Customize your AI assistant's behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Temperature</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Tokens</label>
          <input
            type="number"
            defaultValue="2048"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Streaming</label>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Configuration</Button>
      </CardFooter>
    </Card>
  ),
}

export const LoadingCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  ),
}
