import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@clarity-chat/primitives'
import { useState } from 'react'
import { expect, within, userEvent } from '@storybook/test'

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
  },
  tags: ['autodocs'],
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
    const checkbox = canvas.getByRole('checkbox', { name: /accept terms/i })
    
    await expect(checkbox).toBeVisible()
    await expect(checkbox).not.toBeChecked()
    
    // Test clicking checkbox
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    
    // Test clicking again to uncheck
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    
    // Test keyboard navigation
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    
    // Test Space key to toggle
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify all checkboxes are visible
    const emailCheckbox = canvas.getByRole('checkbox', { name: /email/i })
    const smsCheckbox = canvas.getByRole('checkbox', { name: /sms/i })
    const pushCheckbox = canvas.getByRole('checkbox', { name: /push/i })
    
    await expect(emailCheckbox).toBeVisible()
    await expect(smsCheckbox).toBeVisible()
    await expect(pushCheckbox).toBeVisible()
    
    // Verify initial states
    await expect(emailCheckbox).not.toBeChecked()
    await expect(smsCheckbox).not.toBeChecked()
    await expect(pushCheckbox).toBeChecked()
    
    // Test toggling email checkbox
    await userEvent.click(emailCheckbox)
    await expect(emailCheckbox).toBeChecked()
    
    // Test toggling push checkbox
    await userEvent.click(pushCheckbox)
    await expect(pushCheckbox).not.toBeChecked()
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
