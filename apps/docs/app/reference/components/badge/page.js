import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Badge - Clarity Chat Components',
    description: 'Display notification counts, status indicators, and labels with various styles and positions.',
};
export default function BadgePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Badge" }), _jsx("p", { className: "docs-lead", children: "Display notification counts, status indicators, labels, and tags with customizable colors, sizes, and positions." })] }), _jsx(ViewInStorybook, { component: "Badge" }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "Badge" }), " component is a versatile indicator used to display counts, status, labels, or tags. It can be standalone or overlaid on other components like avatars and icons."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function BasicBadges() {
  return (
    <div className="flex items-center gap-4">
      <Badge>New</Badge>
      <Badge>3</Badge>
      <Badge>Featured</Badge>
      <Badge>99+</Badge>
    </div>
  )
}

render(<BasicBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Badge Props", data: badgeProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Variants" }), _jsx("p", { children: "Badges come in multiple semantic variants for different use cases." }), _jsx(CodePlayground, { initialCode: `function BadgeVariants() {
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

render(<BadgeVariants />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sizes" }), _jsx("p", { children: "Choose from small, medium, or large sizes to fit your design." }), _jsx(CodePlayground, { initialCode: `function BadgeSizes() {
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

render(<BadgeSizes />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Icons" }), _jsx("p", { children: "Add icons to badges for better visual communication." }), _jsx(CodePlayground, { initialCode: `function IconBadges() {
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

render(<IconBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dot Badges" }), _jsx("p", { children: "Use minimal dot indicators for subtle notifications." }), _jsx(CodePlayground, { initialCode: `function DotBadges() {
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

render(<DotBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Positioned Badges" }), _jsx("p", { children: "Overlay badges on other elements like avatars, icons, or buttons." }), _jsx(CodePlayground, { initialCode: `function PositionedBadges() {
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

render(<PositionedBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Max Count" }), _jsx("p", { children: "Automatically format large numbers with a maximum display value." }), _jsx(CodePlayground, { initialCode: `function MaxCountBadges() {
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

render(<MaxCountBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Outline Style" }), _jsx("p", { children: "Use outlined badges for a lighter visual weight." }), _jsx(CodePlayground, { initialCode: `function OutlineBadges() {
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

render(<OutlineBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Removable Badges" }), _jsx("p", { children: "Make badges removable with an onRemove handler, useful for tags and filters." }), _jsx(CodePlayground, { initialCode: `function RemovableBadges() {
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

render(<RemovableBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Pulsing Animation" }), _jsx("p", { children: "Add a pulsing animation to draw attention to live or important badges." }), _jsx(CodePlayground, { initialCode: `function PulsingBadges() {
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

render(<PulsingBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Badges" }), _jsx("p", { children: "Make badges clickable for filtering, navigation, or actions." }), _jsx(CodePlayground, { initialCode: `function InteractiveBadges() {
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

render(<InteractiveBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-world Examples" }), _jsx("h3", { children: "Chat Application Badges" }), _jsx(CodePlayground, { initialCode: `function ChatBadges() {
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

render(<ChatBadges />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Custom Badge Colors" }), _jsx("pre", { children: _jsx("code", { children: `<Badge
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
</Badge>` }) }), _jsx("h3", { children: "Badge with Tooltip" }), _jsx("pre", { children: _jsx("code", { children: `import { Badge, Tooltip } from '@clarity-chat/react'

<Tooltip content="5 unread messages">
  <Badge variant="error">5</Badge>
</Tooltip>` }) }), _jsx("h3", { children: "Animated Count Changes" }), _jsx("pre", { children: _jsx("code", { children: `import { Badge } from '@clarity-chat/react'
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
}` }) }), _jsx("h3", { children: "Badge Group" }), _jsx("pre", { children: _jsx("code", { children: `function BadgeGroup({ items }) {
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsxs(Callout, { type: "info", title: "Screen Reader Support", children: ["Use ", _jsx("code", { children: "aria-label" }), " for badges with only numbers or icons to provide context."] }), _jsx("h3", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Provide meaningful aria-labels for notification badges" }), _jsx("li", { children: "Use semantic colors (success=green, error=red, etc.)" }), _jsx("li", { children: "Ensure sufficient color contrast (WCAG AA)" }), _jsx("li", { children: "Make interactive badges keyboard accessible" }), _jsx("li", { children: "Announce dynamic count changes to screen readers" })] }), _jsx("h3", { children: "Example" }), _jsx("pre", { children: _jsx("code", { children: `<Badge
  variant="error"
  aria-label="5 unread notifications"
>
  5
</Badge>

<button aria-label="Notifications: 3 unread">
  <Badge variant="error">3</Badge>
</button>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "tip", title: "Keep Badges Concise", children: "Badges should be short and scannable. Use abbreviations when necessary." }), _jsx(Callout, { type: "warning", title: "Don't Overuse", children: "Too many badges can create visual clutter. Use them sparingly for important information." }), _jsx("h3", { children: "When to Use Badges" }), _jsxs("ul", { children: [_jsx("li", { children: "Notification counts (messages, alerts)" }), _jsx("li", { children: "Status indicators (online, offline, busy)" }), _jsx("li", { children: "Labels and tags (categories, filters)" }), _jsx("li", { children: "Metadata (new, featured, beta)" }), _jsx("li", { children: "Counters (items, results)" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Use consistent badge sizes within the same context" }), _jsx("li", { children: "Position badges logically (top-right for counts)" }), _jsx("li", { children: "Animate count changes for better UX" }), _jsx("li", { children: "Use max values (99+) for large numbers" }), _jsx("li", { children: "Choose appropriate variants for semantic meaning" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { Badge, BadgeProps } from '@clarity-chat/react'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/avatar", className: "docs-card", children: [_jsx("h3", { children: "Avatar" }), _jsx("p", { children: "User profile pictures" })] }), _jsxs("a", { href: "/reference/components/button", className: "docs-card", children: [_jsx("h3", { children: "Button" }), _jsx("p", { children: "Action buttons" })] }), _jsxs("a", { href: "/reference/components/tooltip", className: "docs-card", children: [_jsx("h3", { children: "Tooltip" }), _jsx("p", { children: "Contextual information" })] }), _jsxs("a", { href: "/examples/multi-user", className: "docs-card", children: [_jsx("h3", { children: "Multi-user Example" }), _jsx("p", { children: "Badges in chat context" })] })] })] })] }));
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
];
//# sourceMappingURL=page.js.map