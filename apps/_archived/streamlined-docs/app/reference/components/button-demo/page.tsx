'use client'

/**
 * Button Component Documentation
 *
 * Demonstrates the new ComponentPreview with live code editing
 * and shadcn/ui-style Preview/Code tabs.
 */

import { ComponentPreview } from '@/components/Docs/ComponentPreview'
import { CodePreview, CodeTabs } from '@/components/Docs/CodePreview'
import { InstallTabs, ComingSoonNotice } from '@/components/Docs/InstallTabs'

const basicButtonCode = `function ButtonDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Clicked {count} times
      </button>

      <p className="text-gray-600 dark:text-gray-400">
        Click the button to increment
      </p>
    </div>
  )
}`

const variantsCode = `function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Primary
      </button>
      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white">
        Secondary
      </button>
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Destructive
      </button>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
        Outline
      </button>
      <button className="px-4 py-2 text-blue-500 hover:underline">
        Link
      </button>
    </div>
  )
}`

const installCode = `npm install @clarity-chat/react`

const usageCode = `import { Button } from '@clarity-chat/react'

export function MyComponent() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  )
}`

const propsCode = `interface ButtonProps {
  /** The button variant style */
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  /** The button size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in loading state */
  loading?: boolean
  /** Click handler */
  onClick?: () => void
  /** Button content */
  children: React.ReactNode
}`

export default function ButtonDemoPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Button
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A versatile button component with multiple variants, sizes, and
          states.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Installation
        </h2>

        {/* Coming Soon Notice */}
        <ComingSoonNotice className="mb-4" />

        <InstallTabs packageName="@clarity-chat/react" />
      </section>

      {/* Basic Example with Live Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Interactive Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click the Preview tab to see the component in action, or switch to
          Code to view and copy the source.
        </p>
        <ComponentPreview
          code={basicButtonCode}
          title="Interactive Counter"
          previewHeight="200px"
        />
      </section>

      {/* Variants */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Variants
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The Button component comes with several visual variants to fit
          different use cases.
        </p>
        <ComponentPreview
          code={variantsCode}
          title="Button Variants"
          previewHeight="150px"
        />
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Usage
        </h2>
        <CodePreview code={usageCode} language="tsx" title="Example.tsx" />
      </section>

      {/* Multiple Files Example */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Multi-File Example
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          For complex examples, you can use CodeTabs to show multiple files:
        </p>
        <CodeTabs
          files={[
            { name: 'Button.tsx', code: usageCode, language: 'tsx' },
            { name: 'types.ts', code: propsCode, language: 'typescript' },
            { name: 'install', code: installCode, language: 'bash' },
          ]}
        />
      </section>

      {/* Props */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Props
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                  variant
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">{`'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'`}</td>
                <td className="py-3 px-4 font-mono text-sm text-gray-500">{`'primary'`}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  The visual style variant
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                  size
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">{`'sm' | 'md' | 'lg'`}</td>
                <td className="py-3 px-4 font-mono text-sm text-gray-500">{`'md'`}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  The button size
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                  disabled
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                  boolean
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-500">
                  false
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Whether the button is disabled
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                  loading
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                  boolean
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-500">
                  false
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Shows loading spinner
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Accessibility
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Full keyboard navigation support (Tab, Enter, Space)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>ARIA attributes for loading and disabled states</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Focus visible indicator for keyboard users</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Color contrast meets WCAG 2.2 AA standards</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
