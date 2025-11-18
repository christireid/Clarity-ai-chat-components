import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@clarity-chat/primitives'
import { useState } from 'react'
import { expect, userEvent, within } from '@storybook/test'

/**
 * Checkbox component for binary selection.
 * 
 * **Key Features:**
 * - Accessible with proper ARIA attributes
 * - Focus states with ring indicator
 * - Disabled state support
 * - Smooth transitions
 * 
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Use for single or multiple selections
 * - Group related checkboxes together
 */
const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox input component for binary selection with accessible focus states.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id="checkbox-default"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="checkbox-default" className="text-sm font-medium cursor-pointer">
          Accept terms and conditions
        </label>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test checkbox renders unchecked initially
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toBeInTheDocument()
    await expect(checkbox).not.toBeChecked()

    // Test clicking checkbox toggles it
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()

    // Test clicking again unchecks it
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  },
}

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id="checkbox-checked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="checkbox-checked" className="text-sm font-medium cursor-pointer">
          Newsletter subscription
        </label>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-unchecked" disabled />
        <label htmlFor="checkbox-disabled-unchecked" className="text-sm text-muted-foreground">
          Disabled unchecked
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-checked" checked disabled />
        <label htmlFor="checkbox-disabled-checked" className="text-sm text-muted-foreground">
          Disabled checked
        </label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test disabled checkboxes
    const checkboxes = canvas.getAllByRole('checkbox')

    // First checkbox should be disabled and unchecked
    await expect(checkboxes[0]).toBeDisabled()
    await expect(checkboxes[0]).not.toBeChecked()

    // Second checkbox should be disabled and checked
    await expect(checkboxes[1]).toBeDisabled()
    await expect(checkboxes[1]).toBeChecked()
  },
}

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex items-start gap-2">
        <Checkbox
          id="checkbox-label"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5"
        />
        <div className="flex flex-col">
          <label htmlFor="checkbox-label" className="text-sm font-medium cursor-pointer">
            Enable notifications
          </label>
          <span className="text-xs text-muted-foreground">
            Receive updates about your account activity
          </span>
        </div>
      </div>
    )
  },
}

export const MultipleOptions: Story = {
  render: () => {
    const [options, setOptions] = useState({
      email: false,
      sms: false,
      push: true,
    })

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Notification preferences</h3>
        {Object.entries(options).map(([key, checked]) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              id={`checkbox-${key}`}
              checked={checked}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, [key]: e.target.checked }))
              }
            />
            <label htmlFor={`checkbox-${key}`} className="text-sm font-medium cursor-pointer capitalize">
              {key}
            </label>
          </div>
        ))}
      </div>
    )
  },
}

export const FocusState: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-focus" autoFocus />
      <label htmlFor="checkbox-focus" className="text-sm font-medium">
        Focused checkbox (check focus ring)
      </label>
    </div>
  ),
}
