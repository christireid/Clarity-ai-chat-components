import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '@clarity-chat/primitives'

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar/Essentials',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Avatar component displays user profile pictures with automatic fallback
support. This track shows the essential patterns you'll use in 90% of cases.

## When to Use Avatar

- ✅ User profile pictures
- ✅ Bot/assistant avatars
- ✅ Chat participants
- ✅ User lists

## Key Features

- **Automatic Fallback** - Falls back to initials if image fails
- **Multiple Sizes** - xs, sm, default, lg, xl, 2xl
- **Status Indicators** - Show online/offline status
- **Accessibility** - WCAG AA compliant with AAA targets
        `,
      },
    },
  },
  argTypes: {
    src: {
      description: 'Image source URL',
      control: { type: 'text' },
    },
    alt: {
      description: 'Alt text for accessibility',
      control: { type: 'text' },
    },
    fallback: {
      description: 'Fallback text (usually initials)',
      control: { type: 'text' },
    },
    size: {
      description: 'Avatar size',
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User avatar',
  },
  parameters: {
    docs: {
      description: {
        story: `
Avatar with image. The most common pattern.

**Key Points:**
- Always provide alt text
- Use high-quality images
- Ensure images are square (1:1 aspect ratio)

This pattern works for 90% of use cases.
        `,
      },
    },
  },
}

export const WithFallback: Story = {
  args: {
    src: 'invalid-url',
    alt: 'John Doe',
    fallback: 'JD',
  },
  parameters: {
    docs: {
      description: {
        story: `
Avatar with fallback initials. Automatically shows when image fails to load.

**Best Practice:** Always provide fallback initials for better UX.

**Usage:**
- Extract initials from user name
- Use 1-2 characters
- Ensure good contrast
        `,
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: `
Different avatar sizes for various contexts.

**Sizes:**
- **xs** - Compact lists, notifications
- **sm** - Small lists, inline avatars
- **default** - Standard size, most common
- **lg** - Profile pages, headers
- **xl** - Hero sections, prominent displays
- **2xl** - Large displays, featured content
        `,
      },
    },
  },
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
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Common pattern for chat participants. Shows avatar with user information.

**Pattern:**
- Avatar on the left
- Name and description on the right
- Consistent spacing
- Clear hierarchy
        `,
      },
    },
  },
}

export const InitialsOnly: Story = {
  args: {
    alt: 'Jane Smith',
    fallback: 'JS',
  },
  parameters: {
    docs: {
      description: {
        story: `
Avatar with only initials (no image). Use when user hasn't uploaded a picture.

**Best Practice:** Extract initials from user's name automatically.
        `,
      },
    },
  },
}
