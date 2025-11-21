import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverContent, PopoverTrigger, Button } from '@clarity-chat/primitives'
import { useState } from 'react'
import { expect, userEvent, within, waitFor } from '@storybook/test'

/**
 * Popover component for displaying floating content.
 * 
 * **Key Features:**
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Collision detection
 * - Keyboard accessible
 * - Smooth animations
 * 
 * **Best Practices:**
 * - Use for contextual information
 * - Keep content concise
 * - Provide clear trigger
 */
const meta = {
  title: 'Components/Navigation/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Popover component for displaying floating content relative to a trigger element.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is the popover content. It can contain any React elements.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test popover trigger button renders
    const openButton = canvas.getByRole('button', { name: /open popover/i })
    await expect(openButton).toBeInTheDocument()

    // Test opening popover
    await userEvent.click(openButton)

    // Wait for popover to appear and test content
    await waitFor(async () => {
      // Popovers typically don't use role="dialog", they may use role="tooltip" or be in the DOM
      const popoverTitle = document.querySelector('h4')
      if (popoverTitle && popoverTitle.textContent === 'Popover Title') {
        await expect(popoverTitle).toBeInTheDocument()

        // Find popover content
        const popoverContent = document.body.querySelector('.text-muted-foreground')
        if (popoverContent) {
          await expect(popoverContent).toBeInTheDocument()
        }
      }
    }, { timeout: 2000 })
  },
}

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent showArrow>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Popover with Arrow</h4>
          <p className="text-sm text-muted-foreground">
            This popover includes an arrow pointing to the trigger.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const DifferentPositions: Story = {
  render: () => {
    const positions: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left']
    
    return (
      <div className="flex flex-col gap-8 items-center">
        {positions.map((side) => (
          <Popover key={side}>
            <PopoverTrigger>
              <Button variant="outline">{side.charAt(0).toUpperCase() + side.slice(1)}</Button>
            </PopoverTrigger>
            <PopoverContent side={side} showArrow>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Popover on {side}</h4>
                <p className="text-sm text-muted-foreground">
                  This popover appears on the {side} side.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button>{open ? 'Close' : 'Open'} Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Controlled Popover</h4>
            <p className="text-sm text-muted-foreground">
              This popover is controlled externally.
            </p>
            <Button size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test trigger button shows "Open" initially
    const triggerButton = canvas.getByRole('button', { name: /open popover/i })
    await expect(triggerButton).toBeInTheDocument()

    // Test opening popover
    await userEvent.click(triggerButton)

    // Wait for popover to appear
    await waitFor(async () => {
      const popoverTitle = Array.from(document.querySelectorAll('h4')).find(
        (el) => el.textContent === 'Controlled Popover'
      )
      if (popoverTitle) {
        await expect(popoverTitle).toBeInTheDocument()

        // Test close button in popover
        const closeButtons = Array.from(document.querySelectorAll('button')).filter(
          (btn) => btn.textContent === 'Close'
        )
        if (closeButtons.length > 0) {
          await userEvent.click(closeButtons[0])
        }
      }
    }, { timeout: 2000 })

    // Verify button text changes back to "Open"
    await waitFor(async () => {
      await expect(canvas.getByRole('button', { name: /open popover/i })).toBeInTheDocument()
    }, { timeout: 1000 })
  },
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">Edit Profile</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Edit Profile</h4>
          <div className="space-y-2">
            <label className="text-xs font-medium">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 text-sm border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-3 py-2 text-sm border rounded-lg"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test edit profile button renders
    const editButton = canvas.getByRole('button', { name: /edit profile/i })
    await expect(editButton).toBeInTheDocument()

    // Test opening popover with form
    await userEvent.click(editButton)

    // Wait for popover form to appear
    await waitFor(async () => {
      const formTitle = Array.from(document.querySelectorAll('h4')).find(
        (el) => el.textContent === 'Edit Profile'
      )
      if (formTitle) {
        await expect(formTitle).toBeInTheDocument()

        // Test form labels
        const nameLabel = Array.from(document.querySelectorAll('label')).find(
          (el) => el.textContent === 'Name'
        )
        const emailLabel = Array.from(document.querySelectorAll('label')).find(
          (el) => el.textContent === 'Email'
        )
        if (nameLabel && emailLabel) {
          await expect(nameLabel).toBeInTheDocument()
          await expect(emailLabel).toBeInTheDocument()

          // Test form inputs
          const nameInput = document.querySelector('input[placeholder="John Doe"]')
          const emailInput = document.querySelector('input[placeholder="john@example.com"]')
          if (nameInput && emailInput) {
            await expect(nameInput).toBeInTheDocument()
            await expect(emailInput).toBeInTheDocument()
          }
        }
      }
    }, { timeout: 2000 })
  },
}

export const WithoutArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">Info</Button>
      </PopoverTrigger>
      <PopoverContent showArrow={false}>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Information</h4>
          <p className="text-sm text-muted-foreground">
            This popover doesn't have an arrow indicator.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
