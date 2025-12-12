import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
} from '../components/dialog'
import { Button } from '../components/button'
import { Input } from '../components/input'

/**
 * Dialog component with focus trap, animations, and full accessibility.
 *
 * ## Features
 * - Multiple animation presets (scale, slide-up, slide-down, fade, zoom)
 * - Focus trap with proper focus restoration
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Respects `prefers-reduced-motion` for accessibility
 * - Compound component pattern for flexibility
 * - Controlled and uncontrolled modes
 *
 * ## Accessibility
 * - Follows WAI-ARIA Dialog pattern
 * - Uses `aria-modal` for modal dialogs
 * - `aria-labelledby` linked to title
 * - `aria-describedby` linked to description
 * - Focus trapped within dialog when open
 * - Focus restored to trigger on close
 */
const meta: Meta<typeof Dialog> = {
  title: 'Primitives/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An accessible dialog/modal component built with compound components pattern,
featuring focus trap, keyboard navigation, and multiple animation styles.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

/**
 * Default dialog with standard layout
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            This is a basic dialog with standard styling and animations.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Dialogs are great for focused interactions that require user
            attention. They trap focus and can be dismissed with the Escape key.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * All dialog sizes displayed
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size: {size.toUpperCase()}</DialogTitle>
              <DialogDescription>
                This dialog uses the &quot;{size}&quot; size preset.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                Different sizes are useful for different content needs.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/**
 * All animation types
 */
export const AllAnimations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        ['scale', 'slide-up', 'slide-down', 'fade', 'zoom', 'none'] as const
      ).map((animation) => (
        <Dialog key={animation}>
          <DialogTrigger asChild>
            <Button variant="outline">{animation}</Button>
          </DialogTrigger>
          <DialogContent animation={animation}>
            <DialogHeader>
              <DialogTitle>Animation: {animation}</DialogTitle>
              <DialogDescription>
                This dialog uses the &quot;{animation}&quot; animation preset.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                Each animation provides a different feel for the dialog entrance
                and exit.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/**
 * Controlled dialog state
 */
export const Controlled: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm text-muted-foreground">
          Dialog state: <code>{open ? 'open' : 'closed'}</code>
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open via state</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close via state
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Open via Trigger</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog&apos;s open state is controlled externally.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                You can control the dialog programmatically using the open prop
                and onOpenChange callback.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * Dialog with form content
 */
export const WithForm: Story = {
  render: function Render() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(`Submitted: ${name} (${email})`)
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Form</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Fill out the form below to create your account.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <Input
                label="Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
}

/**
 * Destructive action confirmation dialog
 */
export const DestructiveConfirmation: Story = {
  render: function Render() {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
      setIsDeleting(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsDeleting(false)
      alert('Item deleted!')
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Item</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              item from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

/**
 * Dialog without close button
 */
export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog has no close button. Use Escape key or the footer button
            to close.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Sometimes you want to force users to make a choice rather than
            dismissing the dialog.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Dialog that doesn't close on outside click
 */
export const NoCloseOnOutsideClick: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent closeOnClickOutside={false}>
        <DialogHeader>
          <DialogTitle>Persistent Dialog</DialogTitle>
          <DialogDescription>
            Clicking outside this dialog won&apos;t close it.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Use the close button or Escape key to dismiss this dialog.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Dialog without backdrop blur
 */
export const NoBackdropBlur: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent blurBackdrop={false}>
        <DialogHeader>
          <DialogTitle>No Backdrop Blur</DialogTitle>
          <DialogDescription>
            This dialog has backdrop blur disabled.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Disabling backdrop blur can improve performance on lower-end
            devices.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Accessibility demo - focus trap
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center max-w-md">
      <p className="text-sm text-muted-foreground text-center">
        When the dialog opens, focus is trapped inside. Try pressing Tab to
        cycle through elements. Press Escape to close.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessibility Features</DialogTitle>
            <DialogDescription>
              This dialog demonstrates proper accessibility patterns.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <Input label="First Name" placeholder="Tab to next field" />
            <Input label="Last Name" placeholder="Tab to next field" />
            <p className="text-sm text-muted-foreground">
              Notice how focus cycles through the focusable elements and
              doesn&apos;t leave the dialog.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

/**
 * Scrollable dialog content
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Long Dialog</Button>
      </DialogTrigger>
      <DialogContent
        size="md"
        className="max-h-[80vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read and accept our terms of service.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="overflow-y-auto flex-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-sm text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
