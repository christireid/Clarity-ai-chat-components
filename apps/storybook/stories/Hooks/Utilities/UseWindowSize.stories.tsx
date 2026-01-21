import type { Meta, StoryObj } from '@storybook/react-vite'
import { useWindowSize } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

/**
 * **useWindowSize Hook**
 *
 * Hook for tracking window dimensions with throttled updates
 * to prevent performance issues during window resize events.
 *
 * **Key Features:**
 * - Track window width and height
 * - Automatic throttling (150ms default)
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient
 *
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 * - Mobile/desktop detection
 */
const meta = {
  title: 'Hooks/Utilities/UseWindowSize',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useWindowSize\` hook tracks window dimensions with throttled updates
to prevent performance issues during window resize events.

## Features

- ✅ Track window width and height
- ✅ Automatic throttling (150ms default)
- ✅ SSR-safe (returns 0x0 on server)
- ✅ Automatic cleanup on unmount
- ✅ Memory efficient
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const { width, height } = useWindowSize()

return (
  <div>
    Window size: {width} x {height}
    {width < 768 ? <MobileView /> : <DesktopView />}
  </div>
)
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function BasicWindowSizeDemo() {
  const { width, height } = useWindowSize()

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Window Width:</strong> {width}px
          </div>
          <div>
            <strong>Window Height:</strong> {height}px
          </div>
          <div>
            <strong>Aspect Ratio:</strong> {(width / height).toFixed(2)}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Resize the browser window to see the values update. Updates are
        throttled to prevent performance issues.
      </p>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicWindowSizeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic window size tracking with automatic updates on resize.',
      },
    },
  },
}

function ResponsiveLayoutDemo() {
  const { width } = useWindowSize()

  const getBreakpoint = () => {
    if (width < 640) return 'Mobile (< 640px)'
    if (width < 768) return 'Tablet (640px - 768px)'
    if (width < 1024) return 'Small Desktop (768px - 1024px)'
    if (width < 1280) return 'Desktop (1024px - 1280px)'
    return 'Large Desktop (> 1280px)'
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Width:</strong> {width}px
          </div>
          <div>
            <strong>Breakpoint:</strong> {getBreakpoint()}
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        {width < 640 ? (
          <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-medium">Mobile Layout</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Optimized for small screens
            </div>
          </div>
        ) : width < 1024 ? (
          <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl mb-2">💻</div>
            <div className="font-medium">Tablet/Desktop Layout</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Optimized for medium screens
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl mb-2">🖥️</div>
            <div className="font-medium">Large Desktop Layout</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Optimized for large screens
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Resize the browser window to see the layout change based on breakpoints.
      </p>
    </div>
  )
}

export const ResponsiveLayout: Story = {
  render: () => <ResponsiveLayoutDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using window size for responsive layout switching.',
      },
    },
  },
}

function ConditionalRenderingDemo() {
  const { width, height } = useWindowSize()

  const isMobile = width < 768
  const isLandscape = width > height
  const isSmallScreen = width < 640

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Is Mobile:</strong> {isMobile ? 'Yes' : 'No'} (width &lt;
            768px)
          </div>
          <div>
            <strong>Is Landscape:</strong> {isLandscape ? 'Yes' : 'No'} (width
            &gt; height)
          </div>
          <div>
            <strong>Is Small Screen:</strong> {isSmallScreen ? 'Yes' : 'No'}{' '}
            (width &lt; 640px)
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {isMobile && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
            📱 Mobile view active
          </div>
        )}
        {isLandscape && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
            ↔️ Landscape orientation
          </div>
        )}
        {isSmallScreen && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
            ⚠️ Small screen detected
          </div>
        )}
      </div>
    </div>
  )
}

export const ConditionalRendering: Story = {
  render: () => <ConditionalRenderingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Using window size for conditional rendering based on screen size.',
      },
    },
  },
}
