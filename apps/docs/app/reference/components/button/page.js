import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Button - Clarity Chat Components',
    description: 'Versatile button component with variants, sizes, icons, and loading states.',
};
export default function ButtonPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: "Component" }), _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Stable" })] }), _jsx("h1", { children: "Button" }), _jsx("p", { className: "docs-lead", children: "Versatile button component with multiple variants, sizes, icons, loading states, and full accessibility support." })] }), _jsx(ViewInStorybook, { component: "Button" }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "Button" }), " component provides a consistent, accessible way to trigger actions. It supports various styles, sizes, icons, loading states, and can be rendered as a button or link."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Playground" }), _jsx("p", { className: "mb-6", children: "Experiment with the Button component! Try different variants, sizes, and states." }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function BasicButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button>Default Button</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}

render(<BasicButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Button Props", data: buttonProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Variants" }), _jsx("p", { children: "Choose from multiple semantic variants to convey different actions." }), _jsx(CodePlayground, { initialCode: `function ButtonVariants() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline">Outline</Button>
        <Button variant="outline-primary">Outline Primary</Button>
        <Button variant="outline-secondary">Outline Secondary</Button>
        <Button variant="outline-danger">Outline Danger</Button>
      </div>
    </div>
  )
}

render(<ButtonVariants />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sizes" }), _jsx("p", { children: "Buttons come in four sizes to fit different contexts." }), _jsx(CodePlayground, { initialCode: `function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="xs" variant="primary">Extra Small</Button>
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  )
}

render(<ButtonSizes />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Icons" }), _jsx("p", { children: "Add icons before or after button text, or use icon-only buttons." }), _jsx(CodePlayground, { initialCode: `function IconButtons() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3">Icon Before Text</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <span className="mr-2">➕</span>
            Add Message
          </Button>
          <Button variant="success">
            <span className="mr-2">✓</span>
            Save
          </Button>
          <Button variant="danger">
            <span className="mr-2">🗑️</span>
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Icon After Text</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            Send
            <span className="ml-2">→</span>
          </Button>
          <Button variant="secondary">
            Download
            <span className="ml-2">⬇</span>
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Icon Only</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" iconOnly aria-label="Add">
            ➕
          </Button>
          <Button variant="secondary" iconOnly aria-label="Edit">
            ✏️
          </Button>
          <Button variant="danger" iconOnly aria-label="Delete">
            🗑️
          </Button>
          <Button variant="ghost" iconOnly aria-label="Settings">
            ⚙️
          </Button>
        </div>
      </div>
    </div>
  )
}

render(<IconButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Loading State" }), _jsx("p", { children: "Show loading spinner while an action is in progress." }), _jsx(CodePlayground, { initialCode: `function LoadingButtons() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          isLoading={isLoading}
          onClick={handleClick}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>

        <Button
          variant="success"
          isLoading={isLoading}
        >
          Submit Form
        </Button>

        <Button
          variant="secondary"
          isLoading={isLoading}
        >
          <span className="mr-2">⬇</span>
          Download
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline-primary"
          isLoading={isLoading}
          size="sm"
        >
          Small Loading
        </Button>
        <Button
          variant="outline-primary"
          isLoading={isLoading}
          size="lg"
        >
          Large Loading
        </Button>
      </div>
    </div>
  )
}

render(<LoadingButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Disabled State" }), _jsx("p", { children: "Disable buttons to prevent interaction." }), _jsx(CodePlayground, { initialCode: `function DisabledButtons() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>Default Disabled</Button>
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="success" disabled>Success Disabled</Button>
        <Button variant="danger" disabled>Danger Disabled</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" disabled>Outline Disabled</Button>
        <Button variant="ghost" disabled>Ghost Disabled</Button>
        <Button variant="link" disabled>Link Disabled</Button>
      </div>
    </div>
  )
}

render(<DisabledButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Full Width" }), _jsx("p", { children: "Make buttons span the full width of their container." }), _jsx(CodePlayground, { initialCode: `function FullWidthButtons() {
  return (
    <div className="space-y-3 max-w-md">
      <Button variant="primary" fullWidth>
        Primary Full Width
      </Button>
      <Button variant="secondary" fullWidth>
        Secondary Full Width
      </Button>
      <Button variant="outline" fullWidth>
        Outline Full Width
      </Button>
    </div>
  )
}

render(<FullWidthButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Button Groups" }), _jsx("p", { children: "Group related buttons together for better visual hierarchy." }), _jsx(CodePlayground, { initialCode: `function ButtonGroups() {
  const [selected, setSelected] = React.useState('day')
  const [alignment, setAlignment] = React.useState('left')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Segmented Control</h3>
        <div className="inline-flex rounded-lg border overflow-hidden">
          {['day', 'week', 'month', 'year'].map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={\`px-4 py-2 text-sm font-medium transition-colors \${
                selected === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }\`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Text Alignment</h3>
        <div className="inline-flex rounded-lg border overflow-hidden">
          {[
            { value: 'left', icon: '⬅' },
            { value: 'center', icon: '↔' },
            { value: 'right', icon: '➡' },
            { value: 'justify', icon: '⬌' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setAlignment(option.value)}
              className={\`px-4 py-2 transition-colors \${
                alignment === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }\`}
              aria-label={\`Align \${option.value}\`}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Action Bar</h3>
        <div className="flex gap-2">
          <Button variant="primary">
            <span className="mr-2">💾</span>
            Save
          </Button>
          <Button variant="secondary">
            Cancel
          </Button>
          <div className="flex-1" />
          <Button variant="danger">
            <span className="mr-2">🗑️</span>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

render(<ButtonGroups />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "As Link" }), _jsx("p", { children: "Render buttons as links for navigation while maintaining button styling." }), _jsx(CodePlayground, { initialCode: `function ButtonLinks() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          as="a"
          href="/docs"
        >
          View Documentation
        </Button>

        <Button
          variant="secondary"
          as="a"
          href="/examples"
        >
          Browse Examples
        </Button>

        <Button
          variant="outline"
          as="a"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <span className="ml-2">↗</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="link" as="a" href="/home">
          Home
        </Button>
        <Button variant="link" as="a" href="/about">
          About
        </Button>
        <Button variant="link" as="a" href="/contact">
          Contact
        </Button>
      </div>
    </div>
  )
}

render(<ButtonLinks />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Keyboard Shortcuts" }), _jsx("p", { children: "Display keyboard shortcuts alongside button labels." }), _jsx(CodePlayground, { initialCode: `function ShortcutButtons() {
  return (
    <div className="space-y-3 max-w-md">
      <Button variant="primary" fullWidth>
        <div className="flex items-center justify-between w-full">
          <span>Save Changes</span>
          <kbd className="px-2 py-0.5 text-xs bg-white/20 rounded">⌘S</kbd>
        </div>
      </Button>

      <Button variant="secondary" fullWidth>
        <div className="flex items-center justify-between w-full">
          <span>Open Search</span>
          <kbd className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded">⌘K</kbd>
        </div>
      </Button>

      <Button variant="ghost" fullWidth>
        <div className="flex items-center justify-between w-full">
          <span>New Message</span>
          <kbd className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">⌘N</kbd>
        </div>
      </Button>
    </div>
  )
}

render(<ShortcutButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Confirmation Buttons" }), _jsx("p", { children: "Implement confirmation flows with button states." }), _jsx(CodePlayground, { initialCode: `function ConfirmationButtons() {
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [deleted, setDeleted] = React.useState(false)

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      setTimeout(() => setIsConfirming(false), 3000)
    } else {
      setDeleted(true)
      setIsConfirming(false)
    }
  }

  const handleReset = () => {
    setDeleted(false)
    setIsConfirming(false)
  }

  if (deleted) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Item deleted successfully
          </p>
        </div>
        <Button variant="secondary" onClick={handleReset}>
          Reset Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
        <p className="text-sm mb-3">This is a demo item</p>
        <Button
          variant={isConfirming ? 'danger' : 'outline-danger'}
          onClick={handleDelete}
        >
          {isConfirming ? 'Click again to confirm' : 'Delete Item'}
        </Button>
      </div>

      {isConfirming && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Confirmation expires in 3 seconds...
        </p>
      )}
    </div>
  )
}

render(<ConfirmationButtons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Split Button with Dropdown" }), _jsx("pre", { children: _jsx("code", { children: `import { Button, Dropdown } from '@clarity-chat/react'

function SplitButton() {
  const actions = [
    { id: 'save-draft', label: 'Save as Draft' },
    { id: 'save-template', label: 'Save as Template' },
    { type: 'separator' },
    { id: 'discard', label: 'Discard Changes', variant: 'danger' }
  ]

  return (
    <div className="inline-flex rounded-lg overflow-hidden">
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
      <Dropdown items={actions} placement="bottom-end">
        <Button variant="primary" className="border-l border-white/20 px-2">
          ▼
        </Button>
      </Dropdown>
    </div>
  )
}` }) }), _jsx("h3", { children: "Button with Badge" }), _jsx("pre", { children: _jsx("code", { children: `import { Button, Badge } from '@clarity-chat/react'

<Button variant="primary">
  <div className="relative">
    Notifications
    <Badge
      variant="error"
      size="sm"
      className="absolute -top-2 -right-2"
    >
      5
    </Badge>
  </div>
</Button>` }) }), _jsx("h3", { children: "Async Button with Error Handling" }), _jsx("pre", { children: _jsx("code", { children: `function AsyncButton() {
  const [state, setState] = useState('idle') // idle | loading | success | error

  const handleClick = async () => {
    setState('loading')
    try {
      await performAction()
      setState('success')
      setTimeout(() => setState('idle'), 2000)
    } catch (error) {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case 'loading': return 'Saving...'
      case 'success': return '✓ Saved'
      case 'error': return '✕ Error'
      default: return 'Save'
    }
  }

  return (
    <Button
      variant={state === 'error' ? 'danger' : 'primary'}
      isLoading={state === 'loading'}
      disabled={state === 'loading'}
      onClick={handleClick}
    >
      {getButtonContent()}
    </Button>
  )
}` }) }), _jsx("h3", { children: "Button with Tooltip" }), _jsx("pre", { children: _jsx("code", { children: `import { Button, Tooltip } from '@clarity-chat/react'

<Tooltip content="Save your changes (⌘S)">
  <Button variant="primary" iconOnly>
    💾
  </Button>
</Tooltip>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx(Callout, { type: "info", title: "Keyboard Navigation", children: "All buttons are keyboard accessible by default. Use Tab to focus and Enter/Space to activate." }), _jsx("h3", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Use descriptive button labels that explain the action" }), _jsxs("li", { children: ["Provide ", _jsx("code", { children: "aria-label" }), " for icon-only buttons"] }), _jsx("li", { children: "Disable buttons during loading to prevent double-submission" }), _jsx("li", { children: "Use appropriate button variants for semantic meaning" }), _jsx("li", { children: "Ensure sufficient color contrast (WCAG AA minimum)" }), _jsx("li", { children: "Make focus states clearly visible" })] }), _jsx("h3", { children: "ARIA Attributes" }), _jsx("pre", { children: _jsx("code", { children: `// Icon-only button
<Button iconOnly aria-label="Delete message">
  🗑️
</Button>

// Loading button
<Button isLoading aria-busy="true" aria-label="Saving changes">
  Save
</Button>

// Toggle button
<Button
  aria-pressed={isActive}
  onClick={() => setIsActive(!isActive)}
>
  Toggle Feature
</Button>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "tip", title: "Use Semantic Variants", children: "Choose button variants that match the action: primary for main actions, danger for destructive actions, success for confirmations." }), _jsx(Callout, { type: "warning", title: "Avoid Too Many Primary Buttons", children: "Each screen should have only one primary action button to avoid confusion." }), _jsx("h3", { children: "When to Use Each Variant" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Primary:" }), " Main call-to-action (Save, Submit, Continue)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Secondary:" }), " Secondary actions (Cancel, Back)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Danger:" }), " Destructive actions (Delete, Remove)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Success:" }), " Positive confirmations (Approve, Accept)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Outline:" }), " Less prominent actions"] }), _jsxs("li", { children: [_jsx("strong", { children: "Ghost:" }), " Tertiary actions, icon buttons"] }), _jsxs("li", { children: [_jsx("strong", { children: "Link:" }), " Navigation within text"] })] }), _jsx("h3", { children: "Button Placement" }), _jsxs("ul", { children: [_jsx("li", { children: "Place primary action on the right in forms" }), _jsx("li", { children: "Place cancel/back buttons on the left" }), _jsx("li", { children: "Group related actions together" }), _jsx("li", { children: "Use consistent spacing between buttons" }), _jsx("li", { children: "Stack buttons vertically on mobile" })] }), _jsx("h3", { children: "Loading States" }), _jsxs("ul", { children: [_jsx("li", { children: "Show loading spinner for actions taking more than 1 second" }), _jsx("li", { children: "Disable button during loading to prevent double-clicks" }), _jsx("li", { children: "Keep button text or show progress message" }), _jsx("li", { children: "Provide feedback when action completes" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { Button, ButtonProps } from '@clarity-chat/react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'default' 
    | 'primary' 
    | 'secondary' 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'ghost' 
    | 'link'
    | 'outline'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
  className?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/badge", className: "docs-card", children: [_jsx("h3", { children: "Badge" }), _jsx("p", { children: "Notification indicators" })] }), _jsxs("a", { href: "/reference/components/tooltip", className: "docs-card", children: [_jsx("h3", { children: "Tooltip" }), _jsx("p", { children: "Contextual hints" })] }), _jsxs("a", { href: "/reference/components/dropdown", className: "docs-card", children: [_jsx("h3", { children: "Dropdown" }), _jsx("p", { children: "Action menus" })] }), _jsxs("a", { href: "/reference/hooks/use-keyboard-shortcuts", className: "docs-card", children: [_jsx("h3", { children: "useKeyboardShortcuts" }), _jsx("p", { children: "Keyboard shortcut handling" })] })] })] })] }));
}
const buttonProps = [
    {
        name: 'variant',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link' | 'outline' | 'outline-primary' | 'outline-secondary' | 'outline-danger'",
        required: false,
        default: "'default'",
        description: 'Visual style variant'
    },
    {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        required: false,
        default: "'md'",
        description: 'Button size'
    },
    {
        name: 'fullWidth',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Make button span full width of container'
    },
    {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show loading spinner and disable button'
    },
    {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disable button interaction'
    },
    {
        name: 'iconOnly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Style as icon-only button (square, no padding). Must provide aria-label.'
    },
    {
        name: 'as',
        type: "'button' | 'a'",
        required: false,
        default: "'button'",
        description: 'Render as button or anchor element'
    },
    {
        name: 'href',
        type: 'string',
        required: false,
        description: 'URL when rendering as link (as="a")'
    },
    {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Button content'
    },
    {
        name: 'onClick',
        type: '(event: React.MouseEvent) => void',
        required: false,
        description: 'Click handler'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map