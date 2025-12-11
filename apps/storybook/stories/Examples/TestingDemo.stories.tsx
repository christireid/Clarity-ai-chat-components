/**
 * Testing Demo Stories
 *
 * Demonstrates Storybook testing capabilities including:
 * - Component states for visual regression testing
 * - Accessibility testing patterns
 * - Interaction testing examples (code shown in docs)
 *
 * These stories serve as both documentation and targets for testing.
 *
 * ## Running Tests
 *
 * ```bash
 * # Start Storybook first
 * pnpm dev
 *
 * # Run interaction tests
 * pnpm test-storybook
 *
 * # Run with accessibility checks
 * pnpm test-storybook:a11y
 * ```
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'

const meta: Meta = {
  title: 'Examples/Testing Demo',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Demonstrates Storybook testing capabilities. ' +
          'These stories include interaction tests that verify component behavior ' +
          'and serve as smoke tests for the testing infrastructure.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Simple form that demonstrates basic interaction testing.
 * The play function types into the input and clicks the button.
 */
function SimpleForm() {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Simple Form Test</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div
            role="alert"
            className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200"
          >
            Form submitted with: "{value}"
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter some text..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Test input"
            />
            <Button type="submit" disabled={!value.trim()}>
              Submit
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Simple form interaction demo.
 *
 * Example interaction test (add to story with `play` function):
 *
 * ```typescript
 * import { within, userEvent, expect } from '@storybook/test'
 *
 * play: async ({ canvasElement }) => {
 *   const canvas = within(canvasElement)
 *   const input = canvas.getByRole('textbox', { name: /test input/i })
 *   const button = canvas.getByRole('button', { name: /submit/i })
 *
 *   await expect(button).toBeDisabled()
 *   await userEvent.type(input, 'Hello, testing!')
 *   await expect(button).toBeEnabled()
 *   await userEvent.click(button)
 *
 *   const alert = await canvas.findByRole('alert')
 *   await expect(alert).toHaveTextContent('Hello, testing!')
 * }
 * ```
 */
export const InteractionTest: Story = {
  render: () => <SimpleForm />,
}

/**
 * Counter component for testing state changes.
 */
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Counter Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-center" aria-live="polite">
          {count}
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => setCount((c) => c - 1)}
            aria-label="Decrement"
          >
            -
          </Button>
          <Button onClick={() => setCount(0)} variant="ghost">
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => setCount((c) => c + 1)}
            aria-label="Increment"
          >
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Counter state testing demo.
 *
 * Example test for verifying counter functionality:
 *
 * ```typescript
 * play: async ({ canvasElement }) => {
 *   const canvas = within(canvasElement)
 *   const increment = canvas.getByRole('button', { name: /increment/i })
 *   const decrement = canvas.getByRole('button', { name: /decrement/i })
 *   const reset = canvas.getByRole('button', { name: /reset/i })
 *
 *   await userEvent.click(increment)
 *   await userEvent.click(increment)
 *   await expect(canvas.getByText('2')).toBeInTheDocument()
 *
 *   await userEvent.click(decrement)
 *   await expect(canvas.getByText('1')).toBeInTheDocument()
 *
 *   await userEvent.click(reset)
 *   await expect(canvas.getByText('0')).toBeInTheDocument()
 * }
 * ```
 */
export const CounterTest: Story = {
  render: () => <Counter />,
}

/**
 * Keyboard navigation test
 */
function KeyboardNav() {
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const items = ['First', 'Second', 'Third']

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Keyboard Navigation Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div role="menu" className="space-y-2">
          {items.map((item) => (
            <button
              key={item}
              role="menuitem"
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                focusedItem === item
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onFocus={() => setFocusedItem(item)}
              onBlur={() => setFocusedItem(null)}
            >
              {item} Item
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Use Tab to navigate between items
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Keyboard navigation testing demo.
 *
 * Example test for tab navigation:
 *
 * ```typescript
 * play: async ({ canvasElement }) => {
 *   const canvas = within(canvasElement)
 *   const items = canvas.getAllByRole('menuitem')
 *
 *   items[0].focus()
 *   await expect(items[0]).toHaveFocus()
 *
 *   await userEvent.tab()
 *   await expect(items[1]).toHaveFocus()
 *
 *   await userEvent.tab()
 *   await expect(items[2]).toHaveFocus()
 * }
 * ```
 */
export const KeyboardNavigationTest: Story = {
  render: () => <KeyboardNav />,
}

/**
 * Accessibility test - ensures proper ARIA attributes
 */
function AccessibleComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Accessibility Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          aria-expanded={isOpen}
          aria-controls="collapsible-content"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Collapse' : 'Expand'} Content
        </Button>

        <div
          id="collapsible-content"
          role="region"
          aria-labelledby="collapsible-heading"
          hidden={!isOpen}
          className={`overflow-hidden transition-all ${
            isOpen ? 'max-h-40' : 'max-h-0'
          }`}
        >
          <div className="p-4 bg-muted rounded-lg">
            <h3 id="collapsible-heading" className="font-medium mb-2">
              Collapsible Content
            </h3>
            <p className="text-sm text-muted-foreground">
              This content is properly associated with the trigger button via
              ARIA attributes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Accessibility attribute testing demo.
 *
 * Example test for ARIA attributes:
 *
 * ```typescript
 * play: async ({ canvasElement }) => {
 *   const canvas = within(canvasElement)
 *   const button = canvas.getByRole('button', { name: /expand/i })
 *
 *   await expect(button).toHaveAttribute('aria-expanded', 'false')
 *
 *   await userEvent.click(button)
 *
 *   await expect(button).toHaveAttribute('aria-expanded', 'true')
 *   const region = canvas.getByRole('region')
 *   await expect(region).not.toHaveAttribute('hidden')
 * }
 * ```
 */
export const AccessibilityTest: Story = {
  render: () => <AccessibleComponent />,
}

/**
 * Visual states for visual regression testing
 */
function VisualStates() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Button States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled input" disabled />
          <Input
            placeholder="With error"
            aria-invalid="true"
            className="border-destructive"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export const VisualRegressionTest: Story = {
  render: () => <VisualStates />,
  parameters: {
    docs: {
      description: {
        story:
          'This story displays all button and input states for visual regression testing. ' +
          'Chromatic will capture screenshots to detect any unintended visual changes.',
      },
    },
  },
}
