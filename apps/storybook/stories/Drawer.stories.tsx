import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  Button,
  Badge,
} from '@clarity-chat/primitives'

const meta: Meta<typeof Drawer> = {
  title: 'Primitives/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A drawer component that slides in from the edge of the screen. Supports left, right, top, and bottom positions with smooth animations, focus trap, and keyboard navigation.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Drawer>

// ============================================================================
// Basic Examples by Side
// ============================================================================

export const RightSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Right Drawer (Default)</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Right Drawer</DrawerTitle>
          <DrawerDescription>Slides in from the right side</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            This is the default drawer position, commonly used for navigation, settings, or details panels.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const LeftSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Left Drawer</DrawerTitle>
          <DrawerDescription>Slides in from the left side</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            Perfect for navigation menus or sidebars on mobile devices.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const TopSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Top Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="top">
        <DrawerHeader>
          <DrawerTitle>Top Drawer</DrawerTitle>
          <DrawerDescription>Slides in from the top</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            Useful for notifications, banners, or search interfaces.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const BottomSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Bottom Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Bottom Drawer</DrawerTitle>
          <DrawerDescription>Slides in from the bottom</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            Great for mobile sheets, quick actions, or additional options.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const SmallSize: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Small Drawer (256px)</Button>
      </DrawerTrigger>
      <DrawerContent size="sm" side="right">
        <DrawerHeader>
          <DrawerTitle>Small Drawer</DrawerTitle>
          <DrawerDescription>256px width</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Compact drawer for simple content.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const MediumSize: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Medium Drawer (320px)</Button>
      </DrawerTrigger>
      <DrawerContent size="md" side="right">
        <DrawerHeader>
          <DrawerTitle>Medium Drawer</DrawerTitle>
          <DrawerDescription>320px width (default)</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Standard drawer size for most use cases.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const LargeSize: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Large Drawer (384px)</Button>
      </DrawerTrigger>
      <DrawerContent size="lg" side="right">
        <DrawerHeader>
          <DrawerTitle>Large Drawer</DrawerTitle>
          <DrawerDescription>384px width</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Larger drawer for detailed content.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const ExtraLargeSize: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Extra Large Drawer (480px)</Button>
      </DrawerTrigger>
      <DrawerContent size="xl" side="right">
        <DrawerHeader>
          <DrawerTitle>Extra Large Drawer</DrawerTitle>
          <DrawerDescription>480px width</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Extra large for complex layouts.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const FullSize: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Full Size Drawer</Button>
      </DrawerTrigger>
      <DialogContent size="full" side="right">
        <DrawerHeader>
          <DrawerTitle>Full Size Drawer</DrawerTitle>
          <DrawerDescription>Takes full screen width/height</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Useful for immersive experiences on mobile.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

// ============================================================================
// Real-World Examples
// ============================================================================

export const NavigationDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>☰ Navigation Menu</Button>
      </DrawerTrigger>
      <DrawerContent side="left" size="md">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Browse sections</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <nav className="space-y-1">
            {['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Settings', 'Help'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm"
              >
                {item}
              </button>
            ))}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const SettingsDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>⚙️ Settings</Button>
      </DrawerTrigger>
      <DrawerContent side="right" size="lg">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Appearance</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Dark mode</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">Reduce animations</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Push notifications</span>
              </label>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const FilterDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>🔍 Filters</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Filter Results</DrawerTitle>
          <DrawerDescription>Refine your search</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <div className="space-y-2">
              {['All', 'Active', 'Completed', 'Archived'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input type="radio" name="status" defaultChecked={status === 'All'} />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <div className="flex gap-2">
              <Badge>High</Badge>
              <Badge variant="secondary">Medium</Badge>
              <Badge variant="outline">Low</Badge>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline">Reset</Button>
          <Button>Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const NotificationDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>🔔 Notifications <Badge className="ml-2">3</Badge></Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>3 unread notifications</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-3">
          {[
            { title: 'New message', time: '2 min ago', unread: true },
            { title: 'Task completed', time: '1 hour ago', unread: true },
            { title: 'Meeting reminder', time: '3 hours ago', unread: true },
            { title: 'System update', time: '1 day ago', unread: false },
          ].map((notification, i) => (
            <div
              key={i}
              className={cn(
                'p-3 rounded-lg border',
                notification.unread && 'bg-primary/5 border-primary/20'
              )}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" className="w-full">
            Mark all as read
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const MobileSheet: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Mobile Sheet</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom" size="lg">
        <DrawerHeader>
          <DrawerTitle>Share Options</DrawerTitle>
          <DrawerDescription>Choose how to share</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="grid grid-cols-4 gap-4 text-center">
            {['Copy Link', 'Email', 'Twitter', 'Facebook', 'WhatsApp', 'Telegram', 'More'].map(
              (option) => (
                <button
                  key={option}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    📤
                  </div>
                  <span className="text-xs">{option}</span>
                </button>
              )
            )}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

// ============================================================================
// Configuration Examples
// ============================================================================

export const NoBackdropBlur: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>No Backdrop Blur</Button>
      </DrawerTrigger>
      <DrawerContent blurBackdrop={false}>
        <DrawerHeader>
          <DrawerTitle>Without Backdrop Blur</DrawerTitle>
          <DrawerDescription>Solid backdrop overlay</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Performance-friendly option.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

export const NoClickOutsideClose: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>No Click Outside Close</Button>
      </DrawerTrigger>
      <DrawerContent closeOnClickOutside={false}>
        <DrawerHeader>
          <DrawerTitle>Click Outside Disabled</DrawerTitle>
          <DrawerDescription>Must use close button or Escape</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">Prevents accidental closes.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
}

// ============================================================================
// Controlled Example
// ============================================================================

export const ControlledDrawer: Story = {
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
          Drawer is {open ? 'open' : 'closed'}
        </p>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Controlled Drawer</DrawerTitle>
              <DrawerDescription>State managed externally</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm">External state control example.</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    )
  },
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
