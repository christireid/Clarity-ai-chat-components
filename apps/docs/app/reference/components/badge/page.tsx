import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Badge - Clarity Chat Components',
  description: 'Display notification counts, status indicators, and labels with various styles and positions.',
}

export default function BadgePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Badge</h1>
        <p className="docs-lead">
          Display notification counts, status indicators, labels, and tags with customizable colors, sizes, and positions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>Badge</code> component is a versatile indicator used to display counts, status, labels,
          or tags. It can be standalone or overlaid on other components like avatars and icons.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Badges"
          code={`import { Badge } from '@clarity-chat/react'

function BasicBadges() {
  return (
    <div className="flex items-center gap-4">
      <Badge>New</Badge>
      <Badge>3</Badge>
      <Badge>Featured</Badge>
      <Badge>99+</Badge>
    </div>
  )
}

export default BasicBadges`}
          height="150px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Badge Props"
          data={badgeProps}
        />
      </section>

      <section className="docs-section">
        <h2>Variants</h2>
        <p>
          Badges come in multiple semantic variants for different use cases.
        </p>
        <LiveDemo
          title="Badge Variants"
          code={`import { Badge } from '@clarity-chat/react'

function BadgeVariants() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="default">4</Badge>
        <Badge variant="primary">12</Badge>
        <Badge variant="secondary">8</Badge>
        <Badge variant="success">✓</Badge>
        <Badge variant="warning">!</Badge>
        <Badge variant="error">5</Badge>
        <Badge variant="info">i</Badge>
      </div>
    </div>
  )
}

export default BadgeVariants`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Sizes</h2>
        <p>
          Choose from small, medium, or large sizes to fit your design.
        </p>
        <LiveDemo
          title="Badge Sizes"
          code={`import { Badge } from '@clarity-chat/react'

function BadgeSizes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>

      <div className="flex items-center gap-4">
        <Badge size="sm" variant="primary">3</Badge>
        <Badge size="md" variant="primary">12</Badge>
        <Badge size="lg" variant="primary">99+</Badge>
      </div>
    </div>
  )
}

export default BadgeSizes`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>With Icons</h2>
        <p>
          Add icons to badges for better visual communication.
        </p>
        <LiveDemo
          title="Badges with Icons"
          code={`import { Badge } from '@clarity-chat/react'

function IconBadges() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="success">
          <span className="mr-1">✓</span>
          Verified
        </Badge>
        <Badge variant="warning">
          <span className="mr-1">⚠</span>
          Alert
        </Badge>
        <Badge variant="error">
          <span className="mr-1">✕</span>
          Failed
        </Badge>
        <Badge variant="info">
          <span className="mr-1">ℹ</span>
          Info
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="primary">
          <span className="mr-1">🔔</span>
          5 notifications
        </Badge>
        <Badge variant="secondary">
          <span className="mr-1">💬</span>
          12 messages
        </Badge>
        <Badge variant="success">
          <span className="mr-1">⭐</span>
          Premium
        </Badge>
      </div>
    </div>
  )
}

export default IconBadges`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Dot Badges</h2>
        <p>
          Use minimal dot indicators for subtle notifications.
        </p>
        <LiveDemo
          title="Dot Badges"
          code={`import { Badge } from '@clarity-chat/react'

function DotBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Colored Dots</h3>
        <div className="flex items-center gap-4">
          <Badge variant="default" dot />
          <Badge variant="primary" dot />
          <Badge variant="success" dot />
          <Badge variant="warning" dot />
          <Badge variant="error" dot />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">With Text</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="success" dot />
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" dot />
            <span className="text-sm">Away</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="error" dot />
            <span className="text-sm">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" dot />
            <span className="text-sm">Offline</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Different Sizes</h3>
        <div className="flex items-center gap-4">
          <Badge variant="primary" dot size="sm" />
          <Badge variant="primary" dot size="md" />
          <Badge variant="primary" dot size="lg" />
        </div>
      </div>
    </div>
  )
}

export default DotBadges`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>Positioned Badges</h2>
        <p>
          Overlay badges on other elements like avatars, icons, or buttons.
        </p>
        <LiveDemo
          title="Positioned Badges"
          code={`import { Badge } from '@clarity-chat/react'

function PositionedBadges() {
  return (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
            👤
          </div>
          <Badge
            variant="error"
            position="top-right"
            className="absolute -top-1 -right-1"
          >
            5
          </Badge>
        </div>
        <p className="text-xs mt-2">Top Right</p>
      </div>

      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-2xl">
            📧
          </div>
          <Badge
            variant="primary"
            position="top-left"
            className="absolute -top-1 -left-1"
          >
            12
          </Badge>
        </div>
        <p className="text-xs mt-2">Top Left</p>
      </div>

      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
            🔔
          </div>
          <Badge
            variant="warning"
            position="bottom-right"
            className="absolute -bottom-1 -right-1"
          >
            3
          </Badge>
        </div>
        <p className="text-xs mt-2">Bottom Right</p>
      </div>

      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl">
            💬
          </div>
          <Badge
            variant="success"
            dot
            position="bottom-right"
            className="absolute bottom-0 right-0"
          />
        </div>
        <p className="text-xs mt-2">Status Dot</p>
      </div>
    </div>
  )
}

export default PositionedBadges`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Max Count</h2>
        <p>
          Automatically format large numbers with a maximum display value.
        </p>
        <LiveDemo
          title="Max Count Badges"
          code={`import { Badge } from '@clarity-chat/react'

function MaxCountBadges() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge variant="error" max={99}>5</Badge>
        <Badge variant="error" max={99}>42</Badge>
        <Badge variant="error" max={99}>99</Badge>
        <Badge variant="error" max={99}>100</Badge>
        <Badge variant="error" max={99}>500</Badge>
        <Badge variant="error" max={99}>1000</Badge>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="primary" max={999}>150</Badge>
        <Badge variant="primary" max={999}>999</Badge>
        <Badge variant="primary" max={999}>1000</Badge>
        <Badge variant="primary" max={999}>5000</Badge>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Numbers exceeding the max value show as "99+" or "999+"
      </div>
    </div>
  )
}

export default MaxCountBadges`}
          height="300px"
        />
      </section>

      <section className="docs-section">
        <h2>Outline Style</h2>
        <p>
          Use outlined badges for a lighter visual weight.
        </p>
        <LiveDemo
          title="Outline Badges"
          code={`import { Badge } from '@clarity-chat/react'

function OutlineBadges() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="default" outline>Default</Badge>
        <Badge variant="primary" outline>Primary</Badge>
        <Badge variant="secondary" outline>Secondary</Badge>
        <Badge variant="success" outline>Success</Badge>
        <Badge variant="warning" outline>Warning</Badge>
        <Badge variant="error" outline>Error</Badge>
        <Badge variant="info" outline>Info</Badge>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="primary" outline>3</Badge>
        <Badge variant="success" outline>✓</Badge>
        <Badge variant="warning" outline>!</Badge>
        <Badge variant="error" outline>5</Badge>
      </div>
    </div>
  )
}

export default OutlineBadges`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Removable Badges</h2>
        <p>
          Make badges removable with an onRemove handler, useful for tags and filters.
        </p>
        <LiveDemo
          title="Removable Badges"
          code={`import { Badge } from '@clarity-chat/react'

function RemovableBadges() {
  const [tags, setTags] = React.useState([
    { id: '1', label: 'React', variant: 'primary' },
    { id: '2', label: 'TypeScript', variant: 'info' },
    { id: '3', label: 'Tailwind', variant: 'secondary' },
    { id: '4', label: 'Next.js', variant: 'success' }
  ])

  const removeTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant={tag.variant}
            onRemove={() => removeTag(tag.id)}
          >
            {tag.label}
          </Badge>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-sm text-gray-500">All tags removed</p>
      )}

      <button
        onClick={() => setTags([
          { id: '1', label: 'React', variant: 'primary' },
          { id: '2', label: 'TypeScript', variant: 'info' },
          { id: '3', label: 'Tailwind', variant: 'secondary' },
          { id: '4', label: 'Next.js', variant: 'success' }
        ])}
        className="text-sm text-blue-500 hover:text-blue-700"
      >
        Reset Tags
      </button>
    </div>
  )
}

export default RemovableBadges`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Pulsing Animation</h2>
        <p>
          Add a pulsing animation to draw attention to live or important badges.
        </p>
        <LiveDemo
          title="Pulsing Badges"
          code={`import { Badge } from '@clarity-chat/react'

function PulsingBadges() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Badge variant="error" pulse>Live</Badge>
        <Badge variant="success" pulse>Active</Badge>
        <Badge variant="warning" pulse>Alert</Badge>
        <Badge variant="primary" pulse>New</Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative inline-block">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            🔔
          </div>
          <Badge
            variant="error"
            pulse
            className="absolute -top-1 -right-1"
          >
            3
          </Badge>
        </div>

        <div className="relative inline-block">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            💬
          </div>
          <Badge
            variant="success"
            dot
            pulse
            className="absolute bottom-0 right-0"
          />
        </div>
      </div>
    </div>
  )
}

export default PulsingBadges`}
          height="300px"
        />
      </section>

      <section className="docs-section">
        <h2>Interactive Badges</h2>
        <p>
          Make badges clickable for filtering, navigation, or actions.
        </p>
        <LiveDemo
          title="Interactive Badges"
          code={`import { Badge } from '@clarity-chat/react'

function InteractiveBadges() {
  const [selected, setSelected] = React.useState('all')
  const [count, setCount] = React.useState(5)

  const filters = [
    { id: 'all', label: 'All', count: 15 },
    { id: 'unread', label: 'Unread', count: 5 },
    { id: 'starred', label: 'Starred', count: 3 },
    { id: 'archived', label: 'Archived', count: 7 }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelected(filter.id)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          >
            <Badge
              variant={selected === filter.id ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {filter.label}
              <span className="ml-2 opacity-75">{filter.count}</span>
            </Badge>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded">
        <p className="text-sm">
          Selected: <strong>{selected}</strong>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Increment
        </button>
        <Badge variant="error">{count}</Badge>
        <button
          onClick={() => setCount(Math.max(0, count - 1))}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

export default InteractiveBadges`}
          height="350px"
        />
      </section>

      <section className="docs-section">
        <h2>Real-world Examples</h2>

        <h3>Chat Application Badges</h3>
        <LiveDemo
          title="Chat Badges"
          code={`import { Badge } from '@clarity-chat/react'

function ChatBadges() {
  return (
    <div className="space-y-6 max-w-md">
      <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                👨
              </div>
              <Badge
                variant="success"
                dot
                className="absolute bottom-0 right-0"
              />
            </div>
            <div>
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm text-gray-600">Hey, how are you?</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-500">2m ago</span>
            <Badge variant="error" size="sm">3</Badge>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-xl">
                👩
              </div>
              <Badge
                variant="warning"
                dot
                className="absolute bottom-0 right-0"
              />
            </div>
            <div>
              <h4 className="font-semibold">Alice Smith</h4>
              <p className="text-sm text-gray-600">Thanks for your help!</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-500">1h ago</span>
            <Badge variant="primary" size="sm">1</Badge>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                Team Chat
                <Badge variant="success" size="sm">12 online</Badge>
              </h4>
              <p className="text-sm text-gray-600">Bob: Great work everyone!</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-500">3h ago</span>
            <Badge variant="error" size="sm" pulse>15</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBadges`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Custom Badge Colors</h3>
        <pre><code>{`<Badge
  style={{
    backgroundColor: '#8b5cf6',
    color: '#ffffff'
  }}
>
  Custom Color
</Badge>

// Or with Tailwind
<Badge className="bg-purple-500 text-white">
  Custom Color
</Badge>`}</code></pre>

        <h3>Badge with Tooltip</h3>
        <pre><code>{`import { Badge, Tooltip } from '@clarity-chat/react'

<Tooltip content="5 unread messages">
  <Badge variant="error">5</Badge>
</Tooltip>`}</code></pre>

        <h3>Animated Count Changes</h3>
        <pre><code>{`import { Badge } from '@clarity-chat/react'
import { motion, AnimatePresence } from 'framer-motion'

function AnimatedBadge({ count }) {
  return (
    <Badge variant="error">
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </Badge>
  )
}`}</code></pre>

        <h3>Badge Group</h3>
        <pre><code>{`function BadgeGroup({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Badge
          key={item.id}
          variant={item.variant}
          onRemove={() => handleRemove(item.id)}
        >
          {item.label}
        </Badge>
      ))}
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>

        <Callout type="info" title="Screen Reader Support">
          Use <code>aria-label</code> for badges with only numbers or icons to provide context.
        </Callout>

        <h3>Best Practices</h3>
        <ul>
          <li>Provide meaningful aria-labels for notification badges</li>
          <li>Use semantic colors (success=green, error=red, etc.)</li>
          <li>Ensure sufficient color contrast (WCAG AA)</li>
          <li>Make interactive badges keyboard accessible</li>
          <li>Announce dynamic count changes to screen readers</li>
        </ul>

        <h3>Example</h3>
        <pre><code>{`<Badge
  variant="error"
  aria-label="5 unread notifications"
>
  5
</Badge>

<button aria-label="Notifications: 3 unread">
  <Badge variant="error">3</Badge>
</button>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Keep Badges Concise">
          Badges should be short and scannable. Use abbreviations when necessary.
        </Callout>

        <Callout type="warning" title="Don't Overuse">
          Too many badges can create visual clutter. Use them sparingly for important information.
        </Callout>

        <h3>When to Use Badges</h3>
        <ul>
          <li>Notification counts (messages, alerts)</li>
          <li>Status indicators (online, offline, busy)</li>
          <li>Labels and tags (categories, filters)</li>
          <li>Metadata (new, featured, beta)</li>
          <li>Counters (items, results)</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Use consistent badge sizes within the same context</li>
          <li>Position badges logically (top-right for counts)</li>
          <li>Animate count changes for better UX</li>
          <li>Use max values (99+) for large numbers</li>
          <li>Choose appropriate variants for semantic meaning</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { Badge, BadgeProps } from '@clarity-chat/react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  outline?: boolean
  dot?: boolean
  pulse?: boolean
  max?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
  style?: React.CSSProperties
  onRemove?: () => void
  onClick?: () => void
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/avatar" className="docs-card">
            <h3>Avatar</h3>
            <p>User profile pictures</p>
          </a>
          <a href="/reference/components/button" className="docs-card">
            <h3>Button</h3>
            <p>Action buttons</p>
          </a>
          <a href="/reference/components/tooltip" className="docs-card">
            <h3>Tooltip</h3>
            <p>Contextual information</p>
          </a>
          <a href="/examples/multi-user" className="docs-card">
            <h3>Multi-user Example</h3>
            <p>Badges in chat context</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const badgeProps = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Badge content (text, number, or icon)'
  },
  {
    name: 'variant',
    type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'",
    required: false,
    default: "'default'",
    description: 'Visual style variant'
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    required: false,
    default: "'md'",
    description: 'Badge size'
  },
  {
    name: 'outline',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Use outlined style instead of filled'
  },
  {
    name: 'dot',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Display as a small dot indicator'
  },
  {
    name: 'pulse',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Add pulsing animation'
  },
  {
    name: 'max',
    type: 'number',
    required: false,
    description: 'Maximum value to display (e.g., 99 will show "99+" for values > 99)'
  },
  {
    name: 'position',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    required: false,
    description: 'Position when overlaying on another element'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  },
  {
    name: 'onRemove',
    type: '() => void',
    required: false,
    description: 'Callback when remove button is clicked (shows × button)'
  },
  {
    name: 'onClick',
    type: '() => void',
    required: false,
    description: 'Click handler for interactive badges'
  }
]
