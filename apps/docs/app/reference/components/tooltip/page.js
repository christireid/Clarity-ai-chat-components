import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Tooltip - Clarity Chat Components',
    description: 'Display contextual information on hover or focus with customizable positioning and styling.',
};
export default function TooltipPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Tooltip" }), _jsx("p", { className: "docs-lead", children: "Display contextual information on hover or focus with customizable positioning, delays, and styling." })] }), _jsx(ViewInStorybook, { component: "Tooltip" }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "Tooltip" }), " component provides additional context or information when users hover over or focus on an element. It supports multiple positions, custom delays, and rich content."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function BasicTooltips() {
  return (
    <div className="flex items-center gap-4">
      <Tooltip content="This is a tooltip">
        <Button variant="primary">Hover me</Button>
      </Tooltip>

      <Tooltip content="Click to save your changes">
        <Button variant="success">Save</Button>
      </Tooltip>

      <Tooltip content="Delete this item permanently">
        <Button variant="danger">Delete</Button>
      </Tooltip>
    </div>
  )
}

render(<BasicTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Tooltip Props", data: tooltipProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Positions" }), _jsx("p", { children: "Tooltips can be positioned in 12 different locations around the trigger element." }), _jsx(CodePlayground, { initialCode: `function TooltipPositions() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-2">
        <Tooltip content="Top Start" position="top-start">
          <Button size="sm">TS</Button>
        </Tooltip>
        <Tooltip content="Top" position="top">
          <Button size="sm">T</Button>
        </Tooltip>
        <Tooltip content="Top End" position="top-end">
          <Button size="sm">TE</Button>
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <Tooltip content="Left Start" position="left-start">
            <Button size="sm">LS</Button>
          </Tooltip>
          <Tooltip content="Left" position="left">
            <Button size="sm">L</Button>
          </Tooltip>
          <Tooltip content="Left End" position="left-end">
            <Button size="sm">LE</Button>
          </Tooltip>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Hover buttons</p>
        </div>

        <div className="flex flex-col gap-2">
          <Tooltip content="Right Start" position="right-start">
            <Button size="sm">RS</Button>
          </Tooltip>
          <Tooltip content="Right" position="right">
            <Button size="sm">R</Button>
          </Tooltip>
          <Tooltip content="Right End" position="right-end">
            <Button size="sm">RE</Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Tooltip content="Bottom Start" position="bottom-start">
          <Button size="sm">BS</Button>
        </Tooltip>
        <Tooltip content="Bottom" position="bottom">
          <Button size="sm">B</Button>
        </Tooltip>
        <Tooltip content="Bottom End" position="bottom-end">
          <Button size="sm">BE</Button>
        </Tooltip>
      </div>
    </div>
  )
}

render(<TooltipPositions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Delay" }), _jsx("p", { children: "Control when tooltips appear and disappear with custom delays." }), _jsx(CodePlayground, { initialCode: `function TooltipDelays() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tooltip content="No delay" delay={0}>
        <Button variant="primary">No Delay</Button>
      </Tooltip>

      <Tooltip content="Short delay (200ms)" delay={200}>
        <Button variant="primary">Short Delay</Button>
      </Tooltip>

      <Tooltip content="Default delay (500ms)" delay={500}>
        <Button variant="primary">Default</Button>
      </Tooltip>

      <Tooltip content="Long delay (1000ms)" delay={1000}>
        <Button variant="primary">Long Delay</Button>
      </Tooltip>
    </div>
  )
}

render(<TooltipDelays />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Rich Content" }), _jsx("p", { children: "Tooltips can contain rich HTML content, not just plain text." }), _jsx(CodePlayground, { initialCode: `function RichContentTooltips() {
  const userTooltip = (
    <div className="p-2">
      <div className="flex items-center gap-3 mb-2">
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          size="md"
          status="online"
        />
        <div>
          <div className="font-semibold">John Doe</div>
          <div className="text-xs opacity-75">Senior Developer</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge size="sm" variant="success">Online</Badge>
        <Badge size="sm" variant="primary">Premium</Badge>
      </div>
    </div>
  )

  const statsTooltip = (
    <div className="p-2">
      <div className="font-semibold mb-2">Message Statistics</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="opacity-75">Sent:</span>
          <span className="font-semibold">1,234</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="opacity-75">Received:</span>
          <span className="font-semibold">5,678</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="opacity-75">Reactions:</span>
          <span className="font-semibold">890</span>
        </div>
      </div>
    </div>
  )

  const helpTooltip = (
    <div className="p-2 max-w-xs">
      <div className="font-semibold mb-2">💡 Pro Tip</div>
      <p className="text-sm opacity-90 mb-2">
        You can use keyboard shortcuts to speed up your workflow:
      </p>
      <div className="space-y-1 text-xs">
        <div><kbd className="px-1 bg-white/20 rounded">⌘K</kbd> - Search</div>
        <div><kbd className="px-1 bg-white/20 rounded">⌘N</kbd> - New message</div>
        <div><kbd className="px-1 bg-white/20 rounded">⌘/</kbd> - Commands</div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tooltip content={userTooltip}>
        <Button variant="primary">User Info</Button>
      </Tooltip>

      <Tooltip content={statsTooltip}>
        <Button variant="secondary">Stats</Button>
      </Tooltip>

      <Tooltip content={helpTooltip}>
        <Button variant="ghost">Help</Button>
      </Tooltip>
    </div>
  )
}

render(<RichContentTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Variants" }), _jsx("p", { children: "Use different color variants to convey semantic meaning." }), _jsx(CodePlayground, { initialCode: `function TooltipVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Default tooltip" variant="default">
        <Button variant="default">Default</Button>
      </Tooltip>

      <Tooltip content="Primary action" variant="primary">
        <Button variant="primary">Primary</Button>
      </Tooltip>

      <Tooltip content="Success message" variant="success">
        <Button variant="success">Success</Button>
      </Tooltip>

      <Tooltip content="Warning: Check before proceeding" variant="warning">
        <Button variant="warning">Warning</Button>
      </Tooltip>

      <Tooltip content="Error: This action cannot be undone" variant="error">
        <Button variant="danger">Error</Button>
      </Tooltip>

      <Tooltip content="Additional information" variant="info">
        <Button variant="secondary">Info</Button>
      </Tooltip>
    </div>
  )
}

render(<TooltipVariants />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Arrow Styles" }), _jsx("p", { children: "Choose between arrow, no arrow, or custom arrow styles." }), _jsx(CodePlayground, { initialCode: `function ArrowStyles() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">With Arrow (Default)</h3>
        <div className="flex flex-wrap gap-3">
          <Tooltip content="Has arrow" arrow>
            <Button size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Has arrow" position="right" arrow>
            <Button size="sm">Right</Button>
          </Tooltip>
          <Tooltip content="Has arrow" position="bottom" arrow>
            <Button size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Has arrow" position="left" arrow>
            <Button size="sm">Left</Button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Without Arrow</h3>
        <div className="flex flex-wrap gap-3">
          <Tooltip content="No arrow" arrow={false}>
            <Button size="sm" variant="outline">Top</Button>
          </Tooltip>
          <Tooltip content="No arrow" position="right" arrow={false}>
            <Button size="sm" variant="outline">Right</Button>
          </Tooltip>
          <Tooltip content="No arrow" position="bottom" arrow={false}>
            <Button size="sm" variant="outline">Bottom</Button>
          </Tooltip>
          <Tooltip content="No arrow" position="left" arrow={false}>
            <Button size="sm" variant="outline">Left</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

render(<ArrowStyles />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "On Disabled Elements" }), _jsx("p", { children: "Show tooltips even on disabled elements using a wrapper approach." }), _jsx(CodePlayground, { initialCode: `function DisabledTooltips() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">Enabled Button</h3>
        <Tooltip content="Click to save">
          <Button variant="primary">Save</Button>
        </Tooltip>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Disabled Button (Won't Work)</h3>
        <Tooltip content="This tooltip won't show">
          <Button variant="primary" disabled>Save</Button>
        </Tooltip>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Disabled Button (With Wrapper)</h3>
        <Tooltip content="You must fill out all required fields first">
          <span className="inline-block">
            <Button variant="primary" disabled>Save</Button>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

render(<DisabledTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Tooltips" }), _jsx("p", { children: "Allow users to interact with tooltip content (e.g., clicking links)." }), _jsx(CodePlayground, { initialCode: `function InteractiveTooltips() {
  const [copied, setCopied] = React.useState(false)

  const interactiveContent = (
    <div className="p-2">
      <p className="text-sm mb-2">Share this link:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value="https://example.com/share/123"
          readOnly
          className="px-2 py-1 text-xs bg-white/10 rounded flex-1"
        />
        <button
          onClick={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded"
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex gap-4">
      <Tooltip
        content={interactiveContent}
        interactive
        delay={0}
      >
        <Button variant="primary">Share</Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="p-2">
            <p className="text-sm mb-2">Learn more:</p>
            <a
              href="#"
              className="text-sm text-blue-300 hover:text-blue-200 underline"
            >
              View Documentation →
            </a>
          </div>
        }
        interactive
      >
        <Button variant="secondary">Help</Button>
      </Tooltip>
    </div>
  )
}

render(<InteractiveTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Click to Toggle" }), _jsx("p", { children: "Show tooltips on click instead of hover." }), _jsx(CodePlayground, { initialCode: `function ClickTooltips() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        content="This tooltip appears on click"
        trigger="click"
      >
        <Button variant="primary">Click me</Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="p-2">
            <p className="font-semibold mb-2">More Options</p>
            <div className="space-y-1 text-sm">
              <div className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer">
                Edit
              </div>
              <div className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer">
                Duplicate
              </div>
              <div className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer text-red-300">
                Delete
              </div>
            </div>
          </div>
        }
        trigger="click"
        interactive
      >
        <Button variant="ghost">⋮</Button>
      </Tooltip>

      <Tooltip
        content="Click outside or press ESC to close"
        trigger="click"
      >
        <Button variant="secondary">Toggle</Button>
      </Tooltip>
    </div>
  )
}

render(<ClickTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Conditional Tooltips" }), _jsx("p", { children: "Show tooltips only when certain conditions are met." }), _jsx(CodePlayground, { initialCode: `function ConditionalTooltips() {
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [count, setCount] = React.useState(0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showTooltip}
            onChange={(e) => setShowTooltip(e.target.checked)}
          />
          Enable tooltips
        </label>
      </div>

      <div className="flex gap-4">
        <Tooltip
          content="This tooltip can be toggled"
          disabled={!showTooltip}
        >
          <Button variant="primary">Hover me</Button>
        </Tooltip>

        <Tooltip
          content={\`You've clicked \${count} times\`}
          disabled={count === 0}
        >
          <Button
            variant="secondary"
            onClick={() => setCount(count + 1)}
          >
            Click Count: {count}
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

render(<ConditionalTooltips />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Tooltip with Keyboard Shortcut" }), _jsx("pre", { children: _jsx("code", { children: `import { Tooltip, Button } from '@clarity-chat/react'

const TooltipWithShortcut = () => (
  <Tooltip
    content={
      <div className="flex items-center gap-3">
        <span>Save changes</span>
        <kbd className="px-2 py-1 text-xs bg-white/20 rounded">
          ⌘S
        </kbd>
      </div>
    }
  >
    <Button variant="primary">Save</Button>
  </Tooltip>
)` }) }), _jsx("h3", { children: "Dynamic Tooltip Content" }), _jsx("pre", { children: _jsx("code", { children: `function DynamicTooltip() {
  const [status, setStatus] = useState('idle')

  const getTooltipContent = () => {
    switch (status) {
      case 'loading': return 'Processing...'
      case 'success': return '✓ Saved successfully'
      case 'error': return '✕ Failed to save'
      default: return 'Click to save'
    }
  }

  return (
    <Tooltip content={getTooltipContent()}>
      <Button onClick={handleSave}>Save</Button>
    </Tooltip>
  )
}` }) }), _jsx("h3", { children: "Tooltip with Auto-hide" }), _jsx("pre", { children: _jsx("code", { children: `<Tooltip
  content="This tooltip auto-hides after 3 seconds"
  autoHide={3000}
>
  <Button>Hover me</Button>
</Tooltip>` }) }), _jsx("h3", { children: "Tooltip Group" }), _jsx("pre", { children: _jsx("code", { children: `import { TooltipProvider } from '@clarity-chat/react'

// Share delay settings across multiple tooltips
<TooltipProvider delay={300}>
  <Tooltip content="Tooltip 1">
    <Button>Button 1</Button>
  </Tooltip>
  <Tooltip content="Tooltip 2">
    <Button>Button 2</Button>
  </Tooltip>
  <Tooltip content="Tooltip 3">
    <Button>Button 3</Button>
  </Tooltip>
</TooltipProvider>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsxs(Callout, { type: "info", title: "Screen Reader Support", children: ["Tooltips automatically include ", _jsx("code", { children: "role=\"tooltip\"" }), " and proper ARIA attributes for screen reader accessibility."] }), _jsx("h3", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep tooltip content concise and scannable" }), _jsx("li", { children: "Don't rely solely on tooltips for critical information" }), _jsx("li", { children: "Ensure tooltips don't cover important content" }), _jsx("li", { children: "Use appropriate delays (300-500ms is standard)" }), _jsx("li", { children: "Make interactive tooltips keyboard accessible" }), _jsx("li", { children: "Provide alternative ways to access tooltip information" })] }), _jsx("h3", { children: "ARIA Attributes" }), _jsx("pre", { children: _jsx("code", { children: `// Automatically added by the Tooltip component
<button
  aria-describedby="tooltip-id"
  onMouseEnter={showTooltip}
  onMouseLeave={hideTooltip}
>
  Hover me
</button>

<div
  id="tooltip-id"
  role="tooltip"
  aria-hidden={!isVisible}
>
  Tooltip content
</div>` }) }), _jsx("h3", { children: "Keyboard Support" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "Esc" }), " - Close tooltip"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Tab" }), " - Show tooltip on focus"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Shift+Tab" }), " - Hide tooltip on blur"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "tip", title: "Use Tooltips Sparingly", children: "Tooltips should provide helpful context, not essential information. If something is critical, put it in the visible UI." }), _jsx(Callout, { type: "warning", title: "Mobile Considerations", children: "Tooltips don't work well on touch devices. Consider using alternative patterns like info buttons or always-visible hints on mobile." }), _jsx("h3", { children: "When to Use Tooltips" }), _jsxs("ul", { children: [_jsx("li", { children: "Provide additional context for icons or abbreviations" }), _jsx("li", { children: "Show keyboard shortcuts" }), _jsx("li", { children: "Display full text for truncated content" }), _jsx("li", { children: "Explain why a button is disabled" }), _jsx("li", { children: "Offer helpful tips or hints" })] }), _jsx("h3", { children: "When NOT to Use Tooltips" }), _jsxs("ul", { children: [_jsx("li", { children: "For critical information users must see" }), _jsx("li", { children: "On mobile-first interfaces" }), _jsx("li", { children: "For long-form content (use popover instead)" }), _jsx("li", { children: "When the label already explains everything" }), _jsx("li", { children: "For form validation errors (use inline errors)" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep content to 1-2 lines when possible" }), _jsx("li", { children: "Use sentence case for tooltip text" }), _jsx("li", { children: "Don't use periods for single sentences" }), _jsx("li", { children: "Position tooltips to avoid covering content" }), _jsx("li", { children: "Use consistent delay times across your app" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { Tooltip, TooltipProps } from '@clarity-chat/react'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 
    | 'top' | 'top-start' | 'top-end'
    | 'right' | 'right-start' | 'right-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  delay?: number
  arrow?: boolean
  interactive?: boolean
  trigger?: 'hover' | 'click' | 'focus'
  disabled?: boolean
  autoHide?: number
  className?: string
  onShow?: () => void
  onHide?: () => void
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/popover", className: "docs-card", children: [_jsx("h3", { children: "Popover" }), _jsx("p", { children: "Rich content popovers" })] }), _jsxs("a", { href: "/reference/components/dropdown", className: "docs-card", children: [_jsx("h3", { children: "Dropdown" }), _jsx("p", { children: "Dropdown menus" })] }), _jsxs("a", { href: "/reference/components/button", className: "docs-card", children: [_jsx("h3", { children: "Button" }), _jsx("p", { children: "Action buttons" })] }), _jsxs("a", { href: "/reference/components/badge", className: "docs-card", children: [_jsx("h3", { children: "Badge" }), _jsx("p", { children: "Status indicators" })] })] })] })] }));
}
const tooltipProps = [
    {
        name: 'content',
        type: 'React.ReactNode',
        required: true,
        description: 'Tooltip content (text or JSX)'
    },
    {
        name: 'children',
        type: 'React.ReactElement',
        required: true,
        description: 'Element that triggers the tooltip (must be a single element)'
    },
    {
        name: 'position',
        type: "'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'",
        required: false,
        default: "'top'",
        description: 'Position of tooltip relative to trigger element'
    },
    {
        name: 'variant',
        type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
        required: false,
        default: "'default'",
        description: 'Visual style variant'
    },
    {
        name: 'delay',
        type: 'number',
        required: false,
        default: '500',
        description: 'Delay in milliseconds before showing tooltip'
    },
    {
        name: 'arrow',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show arrow pointing to trigger element'
    },
    {
        name: 'interactive',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Allow user to interact with tooltip content (e.g., click links)'
    },
    {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus'",
        required: false,
        default: "'hover'",
        description: 'Event that triggers tooltip'
    },
    {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable tooltip'
    },
    {
        name: 'autoHide',
        type: 'number',
        required: false,
        description: 'Automatically hide tooltip after specified milliseconds'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    },
    {
        name: 'onShow',
        type: '() => void',
        required: false,
        description: 'Callback when tooltip is shown'
    },
    {
        name: 'onHide',
        type: '() => void',
        required: false,
        description: 'Callback when tooltip is hidden'
    }
];
//# sourceMappingURL=page.js.map