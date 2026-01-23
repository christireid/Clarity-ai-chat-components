import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '@clarity-chat/primitives'
import { expect, within } from '@storybook/test'

/**
 * Avatar component displays user profile pictures with fallback support.
 *
 * **Key Features:**
 * - Automatic fallback to initials
 * - Multiple sizes
 * - Status indicators
 * - Accessible with proper labels
 *
 * **Best Practices:**
 * - Always provide alt text for images
 * - Use initials as fallback
 * - Consider color contrast for text
 */
const meta = {
  title: 'Components/DataDisplay/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Display user or bot avatars with automatic fallbacks and status indicators.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User avatar',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test avatar image renders with correct alt text
    const avatar = canvas.getByRole('img', { name: /user avatar/i })
    await expect(avatar).toBeInTheDocument()
    await expect(avatar).toHaveAttribute('alt', 'User avatar')
  },
}

export const WithFallback: Story = {
  args: {
    src: 'invalid-url',
    alt: 'John Doe',
    fallback: 'JD',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test fallback text displays when image fails to load
    await expect(canvas.getByText(/JD/i)).toBeInTheDocument()
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs" src="https://github.com/shadcn.png" alt="Extra Small" />
      <Avatar size="sm" src="https://github.com/shadcn.png" alt="Small" />
      <Avatar src="https://github.com/shadcn.png" alt="Default" />
      <Avatar size="lg" src="https://github.com/shadcn.png" alt="Large" />
      <Avatar size="xl" src="https://github.com/shadcn.png" alt="Extra Large" />
      <Avatar size="2xl" src="https://github.com/shadcn.png" alt="2X Large" />
    </div>
  ),
}

export const ChatParticipants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar src="https://github.com/shadcn.png" alt="John Doe" />
        <div>
          <div className="font-semibold">John Doe</div>
          <div className="text-sm text-gray-500">Software Engineer</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar fallback="AI" alt="AI Assistant" />
        <div>
          <div className="font-semibold">AI Assistant</div>
          <div className="text-sm text-gray-500">Always ready to help</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar
          src="https://github.com/vercel.png"
          alt="Support Bot"
          fallback="SB"
        />
        <div>
          <div className="font-semibold">Support Bot</div>
          <div className="text-sm text-gray-500">Customer Support</div>
        </div>
      </div>
    </div>
  ),
}

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-6">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Online user"
        status="online"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Away user"
        status="away"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Busy user"
        status="busy"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Offline user"
        status="offline"
      />
    </div>
  ),
}

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar
        size="lg"
        src="https://github.com/shadcn.png"
        alt="User 1"
        className="ring-2 ring-white"
      />
      <Avatar
        size="lg"
        src="https://github.com/vercel.png"
        alt="User 2"
        className="ring-2 ring-white"
      />
      <Avatar
        size="lg"
        fallback="U3"
        alt="User 3"
        className="ring-2 ring-white"
      />
      <Avatar
        size="lg"
        fallback="+5"
        alt="+5 more"
        className="ring-2 ring-white bg-gray-200"
      />
    </div>
  ),
}

export const BotAvatars: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar fallback="🤖" alt="Bot" />
      <Avatar fallback="⚡" alt="Fast Bot" />
      <Avatar fallback="🌟" alt="Premium Bot" />
      <Avatar fallback="🚀" alt="Rocket Bot" />
    </div>
  ),
}

export const Hoverable: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar src="https://github.com/shadcn.png" alt="Hoverable" hoverable />
      <Avatar fallback="AI" alt="Hoverable AI" hoverable />
    </div>
  ),
}

export const OnlyFallback: Story = {
  args: {
    fallback: 'AB',
    alt: 'Alice Brown',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test avatar displays fallback text
    await expect(canvas.getByText(/AB/i)).toBeInTheDocument()
  },
}
