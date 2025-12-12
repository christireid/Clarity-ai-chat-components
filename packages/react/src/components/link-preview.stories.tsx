/**
 * LinkPreview Storybook Stories
 *
 * Comprehensive documentation and examples for all link preview components.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  LinkPreview,
  LinkPreviewSkeleton,
  LinkPreviewError,
  LinkPreviewCompact,
  InlineLink,
  SmartLinkPreview,
  useLinkPreview,
  type LinkMetadata,
} from './link-preview'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof LinkPreview> = {
  title: 'Components/LinkPreview',
  component: LinkPreview,
  parameters: {
    docs: {
      description: {
        component: `
A world-class link preview component that displays rich, visually appealing previews for shared URLs.

## Features
- **Multiple Variants**: Card, compact, and inline display modes
- **Smart Metadata Fetching**: Built-in hook with caching and deduplication
- **Graceful Error Handling**: Error states with retry capability
- **Full Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Reduced Motion Support**: Respects user's motion preferences
- **Lazy Loading**: Images load only when needed

## Usage

\`\`\`tsx
import {
  LinkPreview,
  SmartLinkPreview,
  useLinkPreview,
  LinkPreviewCompact
} from '@clarity-chat/react'

// Basic usage with pre-fetched metadata
<LinkPreview
  metadata={{ url: 'https://example.com', title: 'Example' }}
  onClick={() => window.open(url, '_blank')}
/>

// Auto-fetching smart preview
<SmartLinkPreview url="https://example.com" />

// Compact variant
<LinkPreview metadata={metadata} variant="compact" />

// Using the hook for custom implementations
const { metadata, loading, fetchMetadata } = useLinkPreview()
\`\`\`
        `,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'compact', 'inline'],
      description: 'Visual variant of the preview',
    },
    showImage: {
      control: 'boolean',
      description: 'Show preview image',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show description text',
    },
    showFavicon: {
      control: 'boolean',
      description: 'Show site favicon',
    },
    showDomain: {
      control: 'boolean',
      description: 'Show domain badge',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading skeleton',
    },
  },
}

export default meta
type Story = StoryObj<typeof LinkPreview>

// ============================================================================
// Sample Metadata
// ============================================================================

const githubMetadata: LinkMetadata = {
  url: 'https://github.com/anthropics/claude-code',
  title: 'anthropics/claude-code: An official CLI tool for Claude',
  description:
    'An official CLI tool for Claude that helps you build software faster with AI assistance. Features include code generation, refactoring, and intelligent suggestions.',
  image: 'https://opengraph.githubassets.com/1/anthropics/claude-code',
  siteName: 'GitHub',
  favicon: 'https://github.githubassets.com/favicons/favicon.svg',
  type: 'website',
}

const articleMetadata: LinkMetadata = {
  url: 'https://techcrunch.com/2024/12/10/ai-advances/',
  title: 'The Latest Advances in AI: A Deep Dive into Modern Language Models',
  description:
    'Exploring the cutting-edge developments in artificial intelligence, from large language models to multimodal systems that are reshaping how we interact with technology.',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  siteName: 'TechCrunch',
  favicon: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
  type: 'article',
}

const videoMetadata: LinkMetadata = {
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Amazing Developer Conference Keynote 2024',
  description:
    'Watch the incredible keynote presentation from the biggest developer conference of the year. Topics include AI, web development, and the future of software.',
  image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  siteName: 'YouTube',
  favicon: 'https://www.youtube.com/s/desktop/014dbbed/img/favicon_144x144.png',
  type: 'video',
}

const minimalMetadata: LinkMetadata = {
  url: 'https://example.com/page',
}

const longTitleMetadata: LinkMetadata = {
  url: 'https://blog.example.com/very-long-article',
  title:
    'This Is an Extremely Long Title That Will Definitely Need to Be Truncated Because It Contains Way More Characters Than Can Reasonably Fit in a Preview Card',
  description:
    'A brief description of the article that provides context about the content.',
  siteName: 'Example Blog',
}

const longDescriptionMetadata: LinkMetadata = {
  url: 'https://docs.example.com/guide',
  title: 'Comprehensive Development Guide',
  description:
    'This is an extraordinarily detailed description that spans multiple sentences and contains a wealth of information about the linked content. It covers various aspects of the topic in great depth, providing readers with a thorough understanding of what they can expect when they click through to the full article. The description continues with even more details about the content, including technical specifications, usage examples, and best practices that developers should follow when implementing these features in their own projects.',
  image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
  siteName: 'Developer Docs',
}

// ============================================================================
// Card Variant Stories
// ============================================================================

export const Default: Story = {
  args: {
    metadata: githubMetadata,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default card variant with full metadata including image, title, description, and domain.',
      },
    },
  },
}

export const CardVariant: Story = {
  args: {
    metadata: articleMetadata,
    variant: 'card',
    onClick: () => window.open(articleMetadata.url, '_blank'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Full-featured card preview with article metadata.',
      },
    },
  },
}

export const WithRemoveButton: Story = {
  args: {
    metadata: githubMetadata,
    onClick: () => console.log('Link clicked'),
    onRemove: () => console.log('Remove clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with removable option - hover to see the remove button.',
      },
    },
  },
}

// ============================================================================
// Compact Variant Stories
// ============================================================================

export const CompactVariant: Story = {
  args: {
    metadata: githubMetadata,
    variant: 'compact',
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact single-line preview, ideal for lists or tight spaces.',
      },
    },
  },
}

export const CompactWithoutImage: Story = {
  args: {
    metadata: minimalMetadata,
    variant: 'compact',
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant with minimal metadata - shows domain as fallback.',
      },
    },
  },
}

// ============================================================================
// Inline Variant Stories
// ============================================================================

export const InlineVariant: Story = {
  args: {
    metadata: githubMetadata,
    variant: 'inline',
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline link style, perfect for embedding within text content.',
      },
    },
  },
}

// ============================================================================
// Loading States
// ============================================================================

export const Loading: Story = {
  args: {
    metadata: githubMetadata,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading skeleton with shimmer animation.',
      },
    },
  },
}

export const LoadingCompact: Story = {
  args: {
    metadata: githubMetadata,
    variant: 'compact',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact loading skeleton.',
      },
    },
  },
}

export const LoadingInline: Story = {
  args: {
    metadata: githubMetadata,
    variant: 'inline',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline loading skeleton.',
      },
    },
  },
}

// ============================================================================
// Error States
// ============================================================================

export const Error: Story = {
  render: () => (
    <LinkPreviewError
      url="https://broken-link.example.com/page"
      error="Failed to fetch metadata: Network error"
      onRetry={() => console.log('Retry clicked')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error state with retry button.',
      },
    },
  },
}

export const ErrorWithoutRetry: Story = {
  render: () => (
    <LinkPreviewError
      url="https://broken-link.example.com/page"
      error="The requested resource could not be found"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error state without retry option.',
      },
    },
  },
}

// ============================================================================
// Content Edge Cases
// ============================================================================

export const NoImage: Story = {
  args: {
    metadata: {
      ...githubMetadata,
      image: undefined,
    },
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview without an image - shows link icon placeholder.',
      },
    },
  },
}

export const LongTitle: Story = {
  args: {
    metadata: longTitleMetadata,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Title is truncated with line-clamp when too long.',
      },
    },
  },
}

export const LongDescription: Story = {
  args: {
    metadata: longDescriptionMetadata,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Description is truncated with line-clamp when too long.',
      },
    },
  },
}

export const MinimalMetadata: Story = {
  args: {
    metadata: minimalMetadata,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview with only URL - gracefully displays domain.',
      },
    },
  },
}

// ============================================================================
// Display Options
// ============================================================================

export const WithoutDescription: Story = {
  args: {
    metadata: githubMetadata,
    showDescription: false,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card without description text.',
      },
    },
  },
}

export const WithoutImage: Story = {
  args: {
    metadata: githubMetadata,
    showImage: false,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card without image section.',
      },
    },
  },
}

export const MinimalDisplay: Story = {
  args: {
    metadata: githubMetadata,
    showImage: false,
    showDescription: false,
    showDomain: false,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal card showing only title and site name.',
      },
    },
  },
}

// ============================================================================
// Theme Support
// ============================================================================

export const DarkMode: Story = {
  args: {
    metadata: videoMetadata,
    onClick: () => console.log('Link clicked'),
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Preview adapts to dark mode theme.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

// ============================================================================
// Responsive Behavior
// ============================================================================

export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="max-w-xs">
        <p className="text-sm text-muted-foreground mb-2">Small (max-w-xs)</p>
        <LinkPreview metadata={githubMetadata} onClick={() => {}} />
      </div>
      <div className="max-w-md">
        <p className="text-sm text-muted-foreground mb-2">Medium (max-w-md)</p>
        <LinkPreview metadata={githubMetadata} onClick={() => {}} />
      </div>
      <div className="max-w-lg">
        <p className="text-sm text-muted-foreground mb-2">Large (max-w-lg)</p>
        <LinkPreview metadata={githubMetadata} onClick={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preview adapts to different container widths.',
      },
    },
  },
}

// ============================================================================
// Context Examples
// ============================================================================

export const InMessageContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-xl">
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm mb-3">
          Check out this awesome project I found! It&apos;s a CLI tool for Claude that
          helps you build software faster with AI assistance.
        </p>
        <LinkPreview metadata={githubMetadata} onClick={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preview displayed within a chat message bubble.',
      },
    },
  },
}

export const MultipleLinks: Story = {
  render: () => (
    <div className="space-y-3 max-w-xl">
      <p className="text-sm text-muted-foreground">Related resources:</p>
      <LinkPreview metadata={githubMetadata} variant="compact" onClick={() => {}} />
      <LinkPreview metadata={articleMetadata} variant="compact" onClick={() => {}} />
      <LinkPreview metadata={videoMetadata} variant="compact" onClick={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple compact previews in a list.',
      },
    },
  },
}

// ============================================================================
// Special Content Types
// ============================================================================

export const VideoEmbed: Story = {
  args: {
    metadata: videoMetadata,
    onClick: () => window.open(videoMetadata.url, '_blank'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Video content preview with YouTube metadata.',
      },
    },
  },
}

export const GitHubRepo: Story = {
  args: {
    metadata: githubMetadata,
    onClick: () => window.open(githubMetadata.url, '_blank'),
  },
  parameters: {
    docs: {
      description: {
        story: 'GitHub repository preview.',
      },
    },
  },
}

// ============================================================================
// InlineLink Component
// ============================================================================

export const InlineLinkBasic: Story = {
  render: () => (
    <p className="text-sm">
      Check out{' '}
      <InlineLink url="https://github.com/anthropics/claude-code">
        this awesome project
      </InlineLink>{' '}
      for AI-powered development.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline link embedded in text - hover to see preview tooltip.',
      },
    },
  },
}

export const InlineLinkWithoutPreview: Story = {
  render: () => (
    <p className="text-sm">
      Visit{' '}
      <InlineLink url="https://example.com" showHoverPreview={false}>
        Example.com
      </InlineLink>{' '}
      for more information.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline link without hover preview.',
      },
    },
  },
}

// ============================================================================
// SmartLinkPreview (Auto-fetching)
// ============================================================================

export const SmartPreview: Story = {
  render: () => (
    <div className="max-w-md">
      <SmartLinkPreview
        url="https://github.com/anthropics/claude-code"
        onLoad={(data) => console.log('Loaded:', data)}
        onError={(err) => console.log('Error:', err)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Smart preview that automatically fetches metadata.',
      },
    },
  },
}

export const SmartPreviewCompact: Story = {
  render: () => (
    <div className="max-w-md">
      <SmartLinkPreview
        url="https://github.com/anthropics/claude-code"
        variant="compact"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Smart compact preview with auto-fetch.',
      },
    },
  },
}

// ============================================================================
// Skeleton Components
// ============================================================================

export const SkeletonCard: Story = {
  render: () => <LinkPreviewSkeleton variant="card" />,
  parameters: {
    docs: {
      description: {
        story: 'Card skeleton with shimmer animation.',
      },
    },
  },
}

export const SkeletonCompact: Story = {
  render: () => <LinkPreviewSkeleton variant="compact" />,
  parameters: {
    docs: {
      description: {
        story: 'Compact skeleton.',
      },
    },
  },
}

export const SkeletonInline: Story = {
  render: () => <LinkPreviewSkeleton variant="inline" />,
  parameters: {
    docs: {
      description: {
        story: 'Inline skeleton.',
      },
    },
  },
}

// ============================================================================
// Hook Usage Example
// ============================================================================

const HookExample = () => {
  const { metadata, loading, error, fetchMetadata, reset } = useLinkPreview()
  const [url, setUrl] = React.useState('')

  const handleFetch = () => {
    if (url) {
      fetchMetadata(url)
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL..."
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !url}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="text-destructive text-sm">Error: {error}</div>
      )}

      {metadata && <LinkPreview metadata={metadata} onClick={() => {}} />}
    </div>
  )
}

export const UseLinkPreviewHook: Story = {
  render: () => <HookExample />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing useLinkPreview hook usage.',
      },
    },
  },
}

// ============================================================================
// Accessibility Example
// ============================================================================

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground">
        Tab through the previews to see focus states:
      </p>
      <LinkPreview
        metadata={githubMetadata}
        onClick={() => console.log('First link')}
        aria-label="GitHub repository for Claude Code CLI tool"
      />
      <LinkPreview
        metadata={articleMetadata}
        variant="compact"
        onClick={() => console.log('Second link')}
      />
      <LinkPreview
        metadata={videoMetadata}
        variant="compact"
        onClick={() => console.log('Third link')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demo showing keyboard navigation and focus states.',
      },
    },
  },
}

// ============================================================================
// Custom Styling
// ============================================================================

export const WithCustomStyling: Story = {
  args: {
    metadata: githubMetadata,
    className: 'border-2 border-primary/30 bg-primary/5',
    onClick: () => console.log('Clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Preview with custom className applied.',
      },
    },
  },
}
