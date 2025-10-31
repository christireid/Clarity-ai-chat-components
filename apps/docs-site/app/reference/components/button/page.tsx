import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Button - Clarity Chat Components',
  description: 'Versatile button component with variants, sizes, icons, and loading states.',
}

export default function ButtonPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Button</h1>
        <p className="docs-lead">
          Versatile button component with multiple variants, sizes, icons, loading states, and full accessibility support.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>Button</code> component provides a consistent, accessible way to trigger actions.
          It supports various styles, sizes, icons, loading states, and can be rendered as a button or link.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Buttons"
          code={`import { Button } from '@clarity-chat/react'

function BasicButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button>Default Button</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}

export default BasicButtons`}
          height="150px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Button Props"
          data={buttonProps}
        />
      </section>

      <section className="docs-section">
        <h2>Variants</h2>
        <p>
          Choose from multiple semantic variants to convey different actions.
        </p>
        <LiveDemo
          title="Button Variants"
          code={`import { Button } from '@clarity-chat/react'

function ButtonVariants() {
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

export default ButtonVariants`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Sizes</h2>
        <p>
          Buttons come in four sizes to fit different contexts.
        </p>
        <LiveDemo
          title="Button Sizes"
          code={`import { Button } from '@clarity-chat/react'

function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="xs" variant="primary">Extra Small</Button>
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  )
}

export default ButtonSizes`}
          height="150px"
        />
      </section>

      <section className="docs-section">
        <h2>With Icons</h2>
        <p>
          Add icons before or after button text, or use icon-only buttons.
        </p>
        <LiveDemo
          title="Buttons with Icons"
          code={`import { Button } from '@clarity-chat/react'

function IconButtons() {
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

export default IconButtons`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>Loading State</h2>
        <p>
          Show loading spinner while an action is in progress.
        </p>
        <LiveDemo
          title="Loading Buttons"
          code={`import { Button } from '@clarity-chat/react'

function LoadingButtons() {
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

export default LoadingButtons`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Disabled State</h2>
        <p>
          Disable buttons to prevent interaction.
        </p>
        <LiveDemo
          title="Disabled Buttons"
          code={`import { Button } from '@clarity-chat/react'

function DisabledButtons() {
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

export default DisabledButtons`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Full Width</h2>
        <p>
          Make buttons span the full width of their container.
        </p>
        <LiveDemo
          title="Full Width Buttons"
          code={`import { Button } from '@clarity-chat/react'

function FullWidthButtons() {
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

export default FullWidthButtons`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Button Groups</h2>
        <p>
          Group related buttons together for better visual hierarchy.
        </p>
        <LiveDemo
          title="Button Groups"
          code={`import { Button } from '@clarity-chat/react'

function ButtonGroups() {
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

export default ButtonGroups`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>As Link</h2>
        <p>
          Render buttons as links for navigation while maintaining button styling.
        </p>
        <LiveDemo
          title="Button Links"
          code={`import { Button } from '@clarity-chat/react'

function ButtonLinks() {
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

export default ButtonLinks`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>With Keyboard Shortcuts</h2>
        <p>
          Display keyboard shortcuts alongside button labels.
        </p>
        <LiveDemo
          title="Buttons with Shortcuts"
          code={`import { Button } from '@clarity-chat/react'

function ShortcutButtons() {
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

export default ShortcutButtons`}
          height="250px"
        />
      </section>

      <section className="docs-section">
        <h2>Confirmation Buttons</h2>
        <p>
          Implement confirmation flows with button states.
        </p>
        <LiveDemo
          title="Confirmation Pattern"
          code={`import { Button } from '@clarity-chat/react'

function ConfirmationButtons() {
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

export default ConfirmationButtons`}
          height="300px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Split Button with Dropdown</h3>
        <pre><code>{`import { Button, Dropdown } from '@clarity-chat/react'

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
}`}</code></pre>

        <h3>Button with Badge</h3>
        <pre><code>{`import { Button, Badge } from '@clarity-chat/react'

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
</Button>`}</code></pre>

        <h3>Async Button with Error Handling</h3>
        <pre><code>{`function AsyncButton() {
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
}`}</code></pre>

        <h3>Button with Tooltip</h3>
        <pre><code>{`import { Button, Tooltip } from '@clarity-chat/react'

<Tooltip content="Save your changes (⌘S)">
  <Button variant="primary" iconOnly>
    💾
  </Button>
</Tooltip>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>

        <Callout type="info" title="Keyboard Navigation">
          All buttons are keyboard accessible by default. Use Tab to focus and Enter/Space to activate.
        </Callout>

        <h3>Best Practices</h3>
        <ul>
          <li>Use descriptive button labels that explain the action</li>
          <li>Provide <code>aria-label</code> for icon-only buttons</li>
          <li>Disable buttons during loading to prevent double-submission</li>
          <li>Use appropriate button variants for semantic meaning</li>
          <li>Ensure sufficient color contrast (WCAG AA minimum)</li>
          <li>Make focus states clearly visible</li>
        </ul>

        <h3>ARIA Attributes</h3>
        <pre><code>{`// Icon-only button
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
</Button>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Use Semantic Variants">
          Choose button variants that match the action: primary for main actions,
          danger for destructive actions, success for confirmations.
        </Callout>

        <Callout type="warning" title="Avoid Too Many Primary Buttons">
          Each screen should have only one primary action button to avoid confusion.
        </Callout>

        <h3>When to Use Each Variant</h3>
        <ul>
          <li><strong>Primary:</strong> Main call-to-action (Save, Submit, Continue)</li>
          <li><strong>Secondary:</strong> Secondary actions (Cancel, Back)</li>
          <li><strong>Danger:</strong> Destructive actions (Delete, Remove)</li>
          <li><strong>Success:</strong> Positive confirmations (Approve, Accept)</li>
          <li><strong>Outline:</strong> Less prominent actions</li>
          <li><strong>Ghost:</strong> Tertiary actions, icon buttons</li>
          <li><strong>Link:</strong> Navigation within text</li>
        </ul>

        <h3>Button Placement</h3>
        <ul>
          <li>Place primary action on the right in forms</li>
          <li>Place cancel/back buttons on the left</li>
          <li>Group related actions together</li>
          <li>Use consistent spacing between buttons</li>
          <li>Stack buttons vertically on mobile</li>
        </ul>

        <h3>Loading States</h3>
        <ul>
          <li>Show loading spinner for actions taking more than 1 second</li>
          <li>Disable button during loading to prevent double-clicks</li>
          <li>Keep button text or show progress message</li>
          <li>Provide feedback when action completes</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { Button, ButtonProps } from '@clarity-chat/react'

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
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/badge" className="docs-card">
            <h3>Badge</h3>
            <p>Notification indicators</p>
          </a>
          <a href="/reference/components/tooltip" className="docs-card">
            <h3>Tooltip</h3>
            <p>Contextual hints</p>
          </a>
          <a href="/reference/components/dropdown" className="docs-card">
            <h3>Dropdown</h3>
            <p>Action menus</p>
          </a>
          <a href="/reference/hooks/use-keyboard-shortcuts" className="docs-card">
            <h3>useKeyboardShortcuts</h3>
            <p>Keyboard shortcut handling</p>
          </a>
        </div>
      </section>
    </div>
  )
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
]
