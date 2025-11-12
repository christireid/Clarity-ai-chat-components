import { Metadata } from 'next'
import { EnhancedPlayground } from '@/components/Demo/EnhancedPlayground'
import { PlaygroundStateInspector } from '@/components/Demo/PlaygroundStateInspector'
import { AccessibilityPanel } from '@/components/Demo/AccessibilityPanel'
import { QuickActions } from '@/components/Demo/QuickActions'
import { CodeGenerator } from '@/components/Demo/CodeGenerator'

export const metadata: Metadata = {
  title: 'Enhanced Playground Demo',
  description: 'Experience our best-in-class interactive documentation playground',
}

const buttonPresets = [
  {
    name: 'Basic',
    description: 'Simple button with default styling',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return <Button>Click me</Button>
}`,
  },
  {
    name: 'Primary',
    description: 'Primary call-to-action button',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <Button variant="primary" size="lg">
      Get Started
    </Button>
  )
}`,
  },
  {
    name: 'With Icon',
    description: 'Button with an icon',
    code: `import { Button } from '@clarity-chat/react'
import { Send } from 'lucide-react'

export default function Example() {
  return (
    <Button variant="primary">
      <Send className="w-4 h-4 mr-2" />
      Send Message
    </Button>
  )
}`,
    props: { variant: 'primary', children: 'Send Message' },
  },
  {
    name: 'Loading',
    description: 'Button in loading state',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <Button isLoading variant="primary">
      Saving...
    </Button>
  )
}`,
  },
  {
    name: 'Disabled',
    description: 'Disabled button state',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <Button disabled variant="secondary">
      Unavailable
    </Button>
  )
}`,
  },
]

const buttonControls = [
  {
    name: 'variant',
    label: 'Variant',
    type: 'select' as const,
    defaultValue: 'default',
    options: ['default', 'primary', 'secondary', 'success', 'danger', 'ghost', 'outline'],
    description: 'Visual style of the button',
  },
  {
    name: 'size',
    label: 'Size',
    type: 'select' as const,
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg'],
    description: 'Button size',
  },
  {
    name: 'disabled',
    label: 'Disabled',
    type: 'boolean' as const,
    defaultValue: false,
    description: 'Disable button interaction',
  },
  {
    name: 'isLoading',
    label: 'Loading State',
    type: 'boolean' as const,
    defaultValue: false,
    description: 'Show loading spinner',
  },
  {
    name: 'fullWidth',
    label: 'Full Width',
    type: 'boolean' as const,
    defaultValue: false,
    description: 'Span full container width',
  },
]

export default function PlaygroundDemoPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">🎮 Interactive</span>
        <h1>Enhanced Playground Experience</h1>
        <p className="docs-lead">
          Best-in-class interactive documentation inspired by leading UI libraries.
          Try our enhanced playground with live prop controls, multiple presets, and instant code generation.
        </p>
      </div>

      <section className="docs-section">
        <h2>🚀 New Enhanced Playground</h2>
        <p className="mb-6">
          Our playground now features interactive prop controls, preset configurations, responsive
          viewport testing, and one-click code copying - making it easier than ever to explore components.
        </p>

        <EnhancedPlayground
          title="Button Component Playground"
          description="Experiment with different button variants, sizes, and states. Change props in real-time!"
          component="Button"
          initialCode={`import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary">
        Primary Button
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="outline">
        Outline
      </Button>
    </div>
  )
}`}
          presets={buttonPresets}
          controls={buttonControls}
          showResponsiveControls
          showQuickActions
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>✨ Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <div className="text-3xl mb-3">🎛️</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-50">
              Interactive Prop Controls
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Manipulate component props in real-time with toggles, dropdowns, and sliders.
              See changes instantly in the preview.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-50">
              Preset Configurations
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Switch between common use cases instantly. Explore basic, advanced, loading,
              and error states with one click.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-50">
              Responsive Preview
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Test components on mobile, tablet, and desktop viewports. Ensure responsive
              design works perfectly.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl border-2 border-orange-200 dark:border-orange-800">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-50">
              One-Click Copy
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Copy code, install commands, or import statements instantly. Open in CodeSandbox
              or StackBlitz with a single click.
            </p>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>🔍 State Inspector</h2>
        <p className="mb-4">
          Track component state and events in real-time for better debugging and understanding.
        </p>
        
        <PlaygroundStateInspector
          state={{
            isOpen: false,
            selectedIndex: 2,
            inputValue: 'Hello',
            isLoading: false,
          }}
          events={[
            { name: 'onClick', timestamp: Date.now() - 5000, data: { button: 'primary' } },
            { name: 'onChange', timestamp: Date.now() - 3000, data: { value: 'test' } },
            { name: 'onSubmit', timestamp: Date.now() - 1000 },
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>♿ Accessibility Panel</h2>
        <p className="mb-4">
          Comprehensive accessibility information including WCAG compliance, keyboard shortcuts, and ARIA attributes.
        </p>
        
        <AccessibilityPanel
          componentName="Button"
          keyboardShortcuts={[
            { key: 'Enter', action: 'Activate button' },
            { key: 'Space', action: 'Activate button' },
            { key: 'Tab', action: 'Navigate to next element' },
          ]}
          ariaAttributes={{
            'aria-label': 'Primary action button',
            'aria-pressed': 'false',
            'role': 'button',
            'tabindex': '0',
          }}
        />
      </section>

      <section className="docs-section">
        <h2>💻 Code Generator</h2>
        <p className="mb-4">
          Automatically generate code based on your prop selections. Toggle between TypeScript and JavaScript.
        </p>
        
        <CodeGenerator
          componentName="Button"
          props={{
            variant: 'primary',
            size: 'md',
            children: 'Click me',
          }}
          imports={["import { Send } from 'lucide-react'"]}
        />
      </section>

      <section className="docs-section">
        <h2>🎨 Quick Actions</h2>
        <p className="mb-4">
          Streamlined actions for common tasks - copy code, install commands, and external playground links.
        </p>
        
        <QuickActions
          code={`import { Button } from '@clarity-chat/react'

export default function Example() {
  return <Button variant="primary">Get Started</Button>
}`}
          componentName="Button"
          npmPackage="@clarity-chat/react"
        />
      </section>

      <section className="docs-section">
        <h2>🏆 Inspired by the Best</h2>
        <p>
          Our enhanced playground combines the best features from leading UI documentation sites:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">From Radix UI</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>✅ Interactive prop controls</li>
              <li>✅ Multiple component variants</li>
              <li>✅ Responsive previews</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">From shadcn/ui</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>✅ Copy-paste code snippets</li>
              <li>✅ CLI installation commands</li>
              <li>✅ Quick copy buttons</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">From Chakra UI</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>✅ Theme customization</li>
              <li>✅ Mobile preview modes</li>
              <li>✅ Accessibility inspector</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">From Mantine</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>✅ Rich props panel</li>
              <li>✅ Size previews</li>
              <li>✅ Color scheme toggle</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>🎯 Usage in Documentation</h2>
        <p>
          Use the EnhancedPlayground component in any documentation page:
        </p>
        
        <pre className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto my-4">
          <code className="text-sm text-gray-100 font-mono">{`<EnhancedPlayground
  title="Button Component"
  description="Interactive button playground"
  component="Button"
  initialCode={yourCode}
  presets={buttonPresets}
  controls={buttonControls}
  showResponsiveControls
  showQuickActions
/>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>🔮 Future Enhancements</h2>
        <ul className="space-y-2 mt-4">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Interactive prop controls - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Preset configurations - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Responsive viewports - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Code generator - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>State inspector - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Accessibility panel - <strong>Implemented</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">⋯</span>
            <span>AI code suggestions - <em>Planned</em></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">⋯</span>
            <span>Share playground URL - <em>Planned</em></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">⋯</span>
            <span>Performance metrics - <em>Planned</em></span>
          </li>
        </ul>
      </section>
    </div>
  )
}
