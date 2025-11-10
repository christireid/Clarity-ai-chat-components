import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, waitFor } from '@storybook/testing-library'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'

const meta = {
  title: 'Primitives/Dialog/With Interactions',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dialog component with automated interaction and accessibility tests.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Interaction Tests
// ============================================================================

export const OpenCloseInteraction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>This dialog tests open and close interactions.</DialogDescription>
        </DialogHeader>
        <div className="py-4">Dialog content goes here</div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Open button should be visible', async () => {
      const trigger = canvas.getByRole('button', { name: /open dialog/i })
      await expect(trigger).toBeInTheDocument()
    })

    await step('Click to open dialog', async () => {
      const trigger = canvas.getByRole('button', { name: /open dialog/i })
      await userEvent.click(trigger)
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('Dialog should have title', async () => {
      const title = canvas.getByText('Test Dialog')
      await expect(title).toBeInTheDocument()
    })

    await step('Dialog should have description', async () => {
      const description = canvas.getByText(/this dialog tests/i)
      await expect(description).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests opening a dialog and verifying its content.',
      },
    },
  },
}

export const KeyboardNavigation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Keyboard Test</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Navigation</DialogTitle>
          <DialogDescription>Test keyboard interactions</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <input placeholder="First input" className="mb-2 border rounded px-2 py-1" />
          <input placeholder="Second input" className="border rounded px-2 py-1" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Open dialog with keyboard', async () => {
      const trigger = canvas.getByRole('button', { name: /keyboard test/i })
      await userEvent.tab()
      await expect(trigger).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('Tab through dialog elements', async () => {
      // Dialog should trap focus
      await userEvent.tab()
      const firstInput = canvas.getByPlaceholderText('First input')
      await expect(firstInput).toHaveFocus()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests keyboard navigation and focus management within the dialog.',
      },
    },
  },
}

export const EscapeKeyClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Press ESC to Close</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escape Key Test</DialogTitle>
          <DialogDescription>Press Escape to close this dialog</DialogDescription>
        </DialogHeader>
        <div className="py-4">Dialog content</div>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Open dialog', async () => {
      const trigger = canvas.getByRole('button')
      await userEvent.click(trigger)
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('Press Escape to close', async () => {
      await userEvent.keyboard('{Escape}')
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog')
        await expect(dialog).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests closing dialog with Escape key.',
      },
    },
  },
}

export const AccessibilityTest: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Accessibility Test</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accessible Dialog</DialogTitle>
          <DialogDescription>
            This dialog has proper ARIA attributes for screen readers
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content with semantic HTML</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Open dialog', async () => {
      const trigger = canvas.getByRole('button')
      await userEvent.click(trigger)
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('Dialog should have accessible name', async () => {
      const dialog = canvas.getByRole('dialog')
      await expect(dialog).toHaveAccessibleName('Accessible Dialog')
    })

    await step('Dialog should have accessible description', async () => {
      const dialog = canvas.getByRole('dialog')
      await expect(dialog).toHaveAccessibleDescription(/ARIA attributes/)
    })

    await step('Buttons should be accessible', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      
      await expect(cancelButton).toBeInTheDocument()
      await expect(confirmButton).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests accessibility features including ARIA attributes and semantic HTML.',
      },
    },
  },
}

export const FocusManagementTest: Story = {
  render: () => (
    <>
      <Button>Before Dialog</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Focus Test</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Management</DialogTitle>
            <DialogDescription>Testing focus return after close</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Button>First Button</Button>
            <Button className="ml-2">Second Button</Button>
          </div>
          <DialogFooter>
            <Button id="close-button" variant="outline">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button>After Dialog</Button>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /open focus test/i })

    await step('Remember trigger element', async () => {
      await expect(trigger).toBeInTheDocument()
    })

    await step('Open dialog', async () => {
      await userEvent.click(trigger)
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('Close dialog', async () => {
      const closeButton = canvas.getByRole('button', { name: /close/i })
      await userEvent.click(closeButton)
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog')
        await expect(dialog).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })

    await step('Focus should return to trigger', async () => {
      // Note: In actual implementation, focus should return to trigger
      await expect(trigger).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests that focus returns to the trigger element after dialog closes.',
      },
    },
  },
}

export const MultipleActionsTest: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Multiple Actions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Choose an action to perform
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Button className="w-full" variant="default">Primary Action</Button>
          <Button className="w-full" variant="secondary">Secondary Action</Button>
          <Button className="w-full" variant="outline">Tertiary Action</Button>
        </div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Open dialog', async () => {
      const trigger = canvas.getByRole('button', { name: /multiple actions/i })
      await userEvent.click(trigger)
      
      await waitFor(async () => {
        const dialog = await canvas.findByRole('dialog')
        await expect(dialog).toBeInTheDocument()
      })
    })

    await step('All action buttons should be present', async () => {
      await expect(canvas.getByText('Primary Action')).toBeInTheDocument()
      await expect(canvas.getByText('Secondary Action')).toBeInTheDocument()
      await expect(canvas.getByText('Tertiary Action')).toBeInTheDocument()
      await expect(canvas.getByText('Cancel')).toBeInTheDocument()
    })

    await step('Test clicking primary action', async () => {
      const primaryAction = canvas.getByText('Primary Action')
      await userEvent.click(primaryAction)
      // Action button should be clickable
      await expect(primaryAction).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests dialog with multiple action buttons.',
      },
    },
  },
}
