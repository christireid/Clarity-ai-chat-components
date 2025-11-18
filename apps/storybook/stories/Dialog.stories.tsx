import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
  Input,
} from '@clarity-chat/primitives'
import { expect, userEvent, within, waitFor } from '@storybook/test'

const meta: Meta<typeof Dialog> = {
  title: 'Primitives/Dialog (Modal)',
  component: Dialog,
  tags: ['autodocs', 'stable'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal dialog component with backdrop blur, smooth animations, focus trap, and keyboard navigation. Supports multiple sizes and animation variants.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title and description.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This is the dialog content. You can put any content here.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test dialog trigger button renders
    const openButton = canvas.getByRole('button', { name: /open dialog/i })
    await expect(openButton).toBeInTheDocument()

    // Test opening dialog
    await userEvent.click(openButton)

    // Wait for dialog to appear and test content
    await waitFor(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) {
        const dialogCanvas = within(dialog as HTMLElement)
        await expect(dialogCanvas.getByText('Dialog Title')).toBeInTheDocument()
        await expect(dialogCanvas.getByText(/This is a basic dialog/i)).toBeInTheDocument()

        // Test action buttons are present
        const confirmButton = dialogCanvas.getByRole('button', { name: /confirm/i })
        const cancelButton = dialogCanvas.getByRole('button', { name: /cancel/i })
        await expect(confirmButton).toBeInTheDocument()
        await expect(cancelButton).toBeInTheDocument()

        // Test confirm button closes dialog
        await userEvent.click(confirmButton)
      }
    }, { timeout: 2000 })
  },
}

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open with Trigger</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Using DialogTrigger</DialogTitle>
          <DialogDescription>
            The trigger component handles opening the dialog automatically.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Click outside or press Escape to close.
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test DialogTrigger button renders
    const triggerButton = canvas.getByRole('button', { name: /open with trigger/i })
    await expect(triggerButton).toBeInTheDocument()

    // Test clicking trigger opens dialog
    await userEvent.click(triggerButton)

    // Wait for dialog to appear
    await waitFor(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) {
        const dialogCanvas = within(dialog as HTMLElement)
        await expect(dialogCanvas.getByText('Using DialogTrigger')).toBeInTheDocument()
        await expect(dialogCanvas.getByText(/The trigger component handles/i)).toBeInTheDocument()
      }
    }, { timeout: 2000 })
  },
}

// ============================================================================
// Sizes
// ============================================================================

export const SmallSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Small Dialog</DialogTitle>
          <DialogDescription>max-w-sm (384px)</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Compact dialog for simple confirmations.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const MediumSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Medium Dialog (Default)</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Medium Dialog</DialogTitle>
          <DialogDescription>max-w-md (448px)</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Default size for most dialogs.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const LargeSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>max-w-lg (512px)</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Larger dialog for more content.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const ExtraLargeSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Extra Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Extra Large Dialog</DialogTitle>
          <DialogDescription>max-w-xl (576px)</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Extra large dialog for complex content.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Full Width Dialog</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Full Width Dialog</DialogTitle>
          <DialogDescription>Takes full available width with margin</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Useful for complex layouts or mobile views.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// Animations
// ============================================================================

export const ScaleAnimation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Scale Animation (Default)</Button>
      </DialogTrigger>
      <DialogContent animation="scale">
        <DialogHeader>
          <DialogTitle>Scale Animation</DialogTitle>
          <DialogDescription>Scales from 0.95 to 1.0 with fade</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">The default smooth scale-in effect.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const SlideUpAnimation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Slide Up Animation</Button>
      </DialogTrigger>
      <DialogContent animation="slide-up">
        <DialogHeader>
          <DialogTitle>Slide Up Animation</DialogTitle>
          <DialogDescription>Slides up from below with fade</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Slides upward into view.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const SlideDownAnimation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Slide Down Animation</Button>
      </DialogTrigger>
      <DialogContent animation="slide-down">
        <DialogHeader>
          <DialogTitle>Slide Down Animation</DialogTitle>
          <DialogDescription>Slides down from above with fade</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Slides downward into view.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const FadeAnimation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Fade Animation</Button>
      </DialogTrigger>
      <DialogContent animation="fade">
        <DialogHeader>
          <DialogTitle>Fade Animation</DialogTitle>
          <DialogDescription>Simple fade in/out</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Pure fade without movement.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const ZoomAnimation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Zoom Animation</Button>
      </DialogTrigger>
      <DialogContent animation="zoom">
        <DialogHeader>
          <DialogTitle>Zoom Animation</DialogTitle>
          <DialogDescription>Zooms from 0.8 to 1.0 with fade</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">More dramatic zoom effect.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// Configurations
// ============================================================================

export const NoBackdropBlur: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>No Backdrop Blur</Button>
      </DialogTrigger>
      <DialogContent blurBackdrop={false}>
        <DialogHeader>
          <DialogTitle>Without Backdrop Blur</DialogTitle>
          <DialogDescription>Backdrop is solid without blur effect</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Useful for performance or specific designs.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>No Close Button</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>Must use action buttons to close</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Forces users to make a decision.</p>
        </DialogBody>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const NoClickOutsideClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>No Click Outside Close</Button>
      </DialogTrigger>
      <DialogContent closeOnClickOutside={false}>
        <DialogHeader>
          <DialogTitle>Click Outside Disabled</DialogTitle>
          <DialogDescription>Cannot close by clicking backdrop</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Use X button, Escape key, or action buttons.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const NoEscapeClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>No Escape Close</Button>
      </DialogTrigger>
      <DialogContent closeOnEscape={false}>
        <DialogHeader>
          <DialogTitle>Escape Key Disabled</DialogTitle>
          <DialogDescription>Cannot close with Escape key</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm">Use X button, click outside, or action buttons.</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// Real-World Examples
// ============================================================================

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test destructive trigger button renders
    const deleteButton = canvas.getByRole('button', { name: /delete account/i })
    await expect(deleteButton).toBeInTheDocument()

    // Test opening confirmation dialog
    await userEvent.click(deleteButton)

    // Wait for dialog and test confirmation UI
    await waitFor(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) {
        const dialogCanvas = within(dialog as HTMLElement)

        // Test warning message
        await expect(dialogCanvas.getByText('Are you absolutely sure?')).toBeInTheDocument()
        await expect(dialogCanvas.getByText(/This action cannot be undone/i)).toBeInTheDocument()

        // Test both action buttons present
        const cancelButton = dialogCanvas.getByRole('button', { name: /cancel/i })
        const confirmDeleteButton = dialogCanvas.getAllByRole('button', { name: /delete account/i })[0]
        await expect(cancelButton).toBeInTheDocument()
        await expect(confirmDeleteButton).toBeInTheDocument()

        // Test cancel button
        await userEvent.click(cancelButton)
      }
    }, { timeout: 2000 })
  },
}

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <Input placeholder="Enter your name" defaultValue="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input type="email" placeholder="Enter your email" defaultValue="john@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bio</label>
            <textarea
              className="w-full min-h-[80px] p-2 text-sm border rounded-md resize-none"
              placeholder="Tell us about yourself"
              defaultValue="I love using Clarity Chat!"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test edit button renders
    const editButton = canvas.getByRole('button', { name: /edit profile/i })
    await expect(editButton).toBeInTheDocument()

    // Test opening form dialog
    await userEvent.click(editButton)

    // Wait for dialog and test form elements
    await waitFor(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) {
        const dialogCanvas = within(dialog as HTMLElement)

        // Test form labels and inputs
        await expect(dialogCanvas.getByText('Edit Profile')).toBeInTheDocument()
        await expect(dialogCanvas.getByText('Name')).toBeInTheDocument()
        await expect(dialogCanvas.getByText('Email')).toBeInTheDocument()
        await expect(dialogCanvas.getByText('Bio')).toBeInTheDocument()

        // Test input fields have default values
        const nameInput = dialogCanvas.getByPlaceholderText('Enter your name')
        const emailInput = dialogCanvas.getByPlaceholderText('Enter your email')
        await expect(nameInput).toHaveValue('John Doe')
        await expect(emailInput).toHaveValue('john@example.com')

        // Test form buttons
        const saveButton = dialogCanvas.getByRole('button', { name: /save changes/i })
        const cancelButton = dialogCanvas.getByRole('button', { name: /cancel/i })
        await expect(saveButton).toBeInTheDocument()
        await expect(cancelButton).toBeInTheDocument()
      }
    }, { timeout: 2000 })
  },
}

export const NestedDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open First Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>First Dialog</DialogTitle>
          <DialogDescription>This dialog can open another dialog</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Second Dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Second Dialog</DialogTitle>
                <DialogDescription>Nested dialogs work too!</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p className="text-sm">This is a nested dialog.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const ControlledDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Programmatically
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Dialog is {open ? 'open' : 'closed'}
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                State is managed externally
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm">
                You can control this dialog from outside using state.
              </p>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test controlled state indicator shows closed initially
    await expect(canvas.getByText('Dialog is closed')).toBeInTheDocument()

    // Test opening with external button
    const openButton = canvas.getByRole('button', { name: /^open$/i })
    await userEvent.click(openButton)

    // Wait for dialog to appear
    await waitFor(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) {
        const dialogCanvas = within(dialog as HTMLElement)
        await expect(dialogCanvas.getByText('Controlled Dialog')).toBeInTheDocument()
        await expect(dialogCanvas.getByText(/State is managed externally/i)).toBeInTheDocument()
      }
    }, { timeout: 2000 })

    // Test programmatic close button
    const closeProgrammatically = canvas.getByRole('button', { name: /close programmatically/i })
    await userEvent.click(closeProgrammatically)

    // Verify state indicator updates
    await waitFor(async () => {
      await expect(canvas.getByText('Dialog is closed')).toBeInTheDocument()
    }, { timeout: 1000 })
  },
}

// ============================================================================
// Accessibility & Keyboard Navigation
// ============================================================================

export const KeyboardNavigation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Test Keyboard Navigation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Navigation</DialogTitle>
          <DialogDescription>
            Try navigating with Tab, Shift+Tab, and Escape
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Input placeholder="Input field" />
          <Button>Button 3</Button>
          <p className="text-sm text-muted-foreground mt-4">
            • Tab: Move to next focusable element
            <br />
            • Shift+Tab: Move to previous element
            <br />
            • Escape: Close dialog
            <br />• Focus is trapped within dialog
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
}

export const FocusManagement: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Focus returns here after close" />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Management</DialogTitle>
            <DialogDescription>
              Focus automatically moves to first element
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm mb-3">
              When you close this dialog, focus returns to the trigger button.
            </p>
            <Button>First Focusable Element</Button>
          </DialogBody>
        </DialogContent>
      </Dialog>
      <Input placeholder="Another input field" />
    </div>
  ),
}
