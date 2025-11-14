import type { Meta, StoryObj } from '@storybook/react'
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
} from '@clarity-chat/react'

/**
 * Skeleton Loaders
 *
 * **Provide visual loading placeholders for:**
 * - Text content
 * - Cards and containers
 * - Avatars and images
 * - Buttons and actions
 * - Custom shapes
 *
 * **Key Features:**
 * - Smooth shimmer animation
 * - Multiple preset shapes
 * - Customizable dimensions
 * - Respects dark mode
 * - Reduces perceived loading time
 *
 * **Design Philosophy:**
 * - Progressive: Show structure before content
 * - Predictable: Match final layout
 * - Smooth: Animated transitions
 * - Non-intrusive: Subtle and elegant
 */
const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton loading components that provide visual placeholders while content loads, improving perceived performance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Skeleton
// ============================================================================

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-full" />,
}

export const CustomSize: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  ),
}

export const RoundedVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-full rounded-sm" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-full rounded-full" />
    </div>
  ),
}

// ============================================================================
// Preset Components
// ============================================================================

export const TextSkeleton: Story = {
  render: () => (
    <div className="space-y-2">
      <SkeletonText lines={1} />
      <SkeletonText lines={3} />
      <SkeletonText lines={5} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preset skeleton for text content with multiple lines.',
      },
    },
  },
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preset skeleton for card layouts with image, title, and text.',
      },
    },
  },
}

export const AvatarSkeleton: Story = {
  render: () => (
    <div className="flex gap-4">
      <SkeletonAvatar size="sm" />
      <SkeletonAvatar size="md" />
      <SkeletonAvatar size="lg" />
      <SkeletonAvatar size="xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preset skeleton for user avatars in various sizes.',
      },
    },
  },
}

export const ButtonSkeleton: Story = {
  render: () => (
    <div className="flex gap-4">
      <SkeletonButton size="sm" />
      <SkeletonButton size="md" />
      <SkeletonButton size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preset skeleton for button placeholders.',
      },
    },
  },
}

// ============================================================================
// Complex Layouts
// ============================================================================

export const UserProfile: Story = {
  render: () => (
    <div className="max-w-md p-6 border border-border/50 rounded-lg shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex gap-2">
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex user profile layout with avatar, text, and buttons.',
      },
    },
  },
}

export const MessageList: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chat message list with avatars and text placeholders.',
      },
    },
  },
}

export const ArticleLayout: Story = {
  render: () => (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Featured Image */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Article layout with title, image, and body text.',
      },
    },
  },
}

export const DashboardCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 border border-border/50 rounded-lg shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] space-y-3"
        >
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard stat cards with metrics and labels.',
      },
    },
  },
}

export const DataTable: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>

      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} className="h-3 w-full" />
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Data table with header and rows.',
      },
    },
  },
}

// ============================================================================
// Loading States
// ============================================================================

export const LoadingSimulation: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<any>(null)

    React.useEffect(() => {
      // Simulate data loading
      const timer = setTimeout(() => {
        setData({
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Software engineer passionate about building great user experiences.',
        })
        setLoading(false)
      }, 3000)

      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="max-w-md p-6 border border-border/50 rounded-lg shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonAvatar size="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <div>
                <h3 className="font-semibold">{data.name}</h3>
                <p className="text-sm text-muted-foreground">{data.email}</p>
              </div>
            </div>
            <p className="text-sm">{data.bio}</p>
          </div>
        )}

        <button
          onClick={() => {
            setLoading(true)
            setData(null)
            setTimeout(() => {
              setData({
                name: 'John Doe',
                email: 'john@example.com',
                bio: 'Software engineer passionate about building great user experiences.',
              })
              setLoading(false)
            }, 3000)
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Reload
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Realistic loading simulation showing skeleton to content transition.',
      },
    },
  },
}

export const ProgressiveLoading: Story = {
  render: () => {
    const [stage, setStage] = React.useState(0)

    React.useEffect(() => {
      if (stage < 3) {
        const timer = setTimeout(() => setStage(stage + 1), 1500)
        return () => clearTimeout(timer)
      }
    }, [stage])

    return (
      <div className="max-w-2xl space-y-6">
        <button
          onClick={() => setStage(0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Restart Loading
        </button>

        <div className="space-y-4">
          {/* Stage 1: Basic structure */}
          {stage >= 0 && (
            <div className="p-6 border border-border/50 rounded-lg shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
              {stage === 0 ? (
                <SkeletonText lines={3} />
              ) : (
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              )}
            </div>
          )}

          {/* Stage 2: Image loads */}
          {stage >= 1 && (
            <div className="space-y-3">
              {stage <= 1 ? (
                <Skeleton className="h-48 w-full rounded-lg" />
              ) : (
                <div className="h-48 w-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
            </div>
          )}

          {/* Stage 3: Metadata loads */}
          {stage >= 2 && (
            <div className="flex items-center gap-3">
              {stage <= 2 ? (
                <>
                  <SkeletonAvatar size="sm" />
                  <Skeleton className="h-3 w-32" />
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600" />
                  <span className="text-sm font-medium">
                    John Doe • 2 hours ago
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Progressive loading pattern where content loads in stages.',
      },
    },
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <SkeletonCard />

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
        <strong>Accessibility Features:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li>Aria-busy and aria-live attributes for screen readers</li>
          <li>Semantic loading indicators</li>
          <li>Respects prefers-reduced-motion for animations</li>
          <li>Maintains layout structure to prevent content shift</li>
          <li>High contrast in both light and dark modes</li>
          <li>Non-distracting shimmer animation</li>
        </ul>
      </div>
    </div>
  ),
}
