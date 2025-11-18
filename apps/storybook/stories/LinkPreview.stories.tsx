import type { Meta, StoryObj } from '@storybook/react'
import { LinkPreview, InlineLink } from '@clarity-chat/react'
import type { LinkMetadata } from '@clarity-chat/types'
import { expect, userEvent, within } from '@storybook/test'

const linkPreviewMeta = {
  title: 'Components/LinkPreview/Preview',
  component: LinkPreview,
  parameters: {
    layout: 'padded',
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof LinkPreview>

export default linkPreviewMeta
type PreviewStory = StoryObj<typeof linkPreviewMeta>

const defaultMetadata: LinkMetadata = {
  url: 'https://example.com/article',
  title: 'Understanding React Hooks',
  description: 'A comprehensive guide to React Hooks and how to use them effectively in your applications.',
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  siteName: 'Dev Blog',
  favicon: '🌐',
}

export const Default: PreviewStory = {
  args: {
    metadata: defaultMetadata,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test link preview renders
    await expect(canvas.getByText('Understanding React Hooks')).toBeInTheDocument()

    // Test description renders
    await expect(canvas.getByText(/comprehensive guide to React Hooks/)).toBeInTheDocument()

    // Test URL displays
    await expect(canvas.getByText(/example.com/)).toBeInTheDocument()

    // Test site name renders
    await expect(canvas.getByText('Dev Blog')).toBeInTheDocument()
  },
}

export const NoImage: PreviewStory = {
  args: {
    metadata: {
      ...defaultMetadata,
      image: undefined,
    },
  },
}

export const NoDescription: PreviewStory = {
  args: {
    metadata: {
      ...defaultMetadata,
      description: undefined,
    },
  },
}

export const LongTitle: PreviewStory = {
  args: {
    metadata: {
      ...defaultMetadata,
      title: 'This is a Very Long Title That Should Be Truncated After a Certain Number of Characters to Maintain Good UI Design',
    },
  },
}

export const YouTubeVideo: PreviewStory = {
  args: {
    metadata: {
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Amazing Tutorial Video',
      description: 'Learn everything you need to know about web development in this comprehensive tutorial.',
      image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
      siteName: 'YouTube',
      favicon: '▶️',
    },
  },
}

export const GitHubRepo: PreviewStory = {
  args: {
    metadata: {
      url: 'https://github.com/facebook/react',
      title: 'facebook/react',
      description: 'The library for web and native user interfaces',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
      siteName: 'GitHub',
      favicon: '🐙',
    },
  },
}

export const WithRemoveButton: PreviewStory = {
  args: {
    metadata: defaultMetadata,
    onRemove: () => console.log('Remove clicked'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test link preview renders
    await expect(canvas.getByText('Understanding React Hooks')).toBeInTheDocument()

    // Test remove button renders
    const removeButton = canvas.getByRole('button', { name: /remove/i })
    await expect(removeButton).toBeInTheDocument()

    // Test clicking remove button
    await userEvent.click(removeButton)
  },
}

export const Loading: PreviewStory = {
  args: {
    metadata: defaultMetadata,
  },
  parameters: {
    chromatic: { delay: 300 },
  },
}

// InlineLink stories
const inlineLinkMeta = {
  title: 'Components/LinkPreview/InlineLink',
  component: InlineLink,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InlineLink>

export const InlineLinkStories = inlineLinkMeta
type InlineLinkStory = StoryObj<typeof inlineLinkMeta>

export const BasicInlineLink: InlineLinkStory = {
  args: {
    url: 'https://example.com',
    children: 'Check out this article',
  },
}

export const InlineLinkWithPreview: InlineLinkStory = {
  args: {
    url: 'https://example.com/article',
    children: 'Hover to see preview',
  },
}

export const InlineLinkInText: InlineLinkStory = {
  render: () => (
    <p className="text-gray-700">
      This is some text with an{' '}
      <InlineLink url="https://example.com">embedded link</InlineLink> that
      shows a preview on hover. You can also{' '}
      <InlineLink url="https://github.com">link to other sites</InlineLink>{' '}
      seamlessly.
    </p>
  ),
}
