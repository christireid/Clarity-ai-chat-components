import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@clarity-chat/react'
import { useState } from 'react'

/**
 * **Dialog Accessibility Stories**
 *
 * Demonstrates focus trap, keyboard navigation, and mobile accessibility fixes.
 *
 * **Key Features:**
 * - ✅ Focus trap implementation
 * - ✅ Keyboard navigation (Tab, Escape)
 * - ✅ Mobile focus management
 * - ✅ ARIA compliance
 * - ✅ Screen reader support
 *
 * **Regression Tests Cover:**
 * - ISSUE-002: Dialog focus trap
 * - ISSUE-003: Mobile escape handling
 * - Keyboard accessibility
 * - Screen reader compatibility
 */

const meta = {
  title: 'Components/UI/Dialog/Accessibility',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Dialog accessibility demonstrations and regression testing for focus management.

## Focus Management

The Dialog component implements comprehensive focus management:

- **Focus Trapping**: Focus stays within dialog bounds
- **Initial Focus**: Proper focus placement on open
- **Focus Restoration**: Returns focus to trigger element on close
- **Mobile Support**: Handles mobile virtual keyboards

## Keyboard Navigation

- **Tab Navigation**: Cycles through focusable elements
- **Escape Key**: Closes dialog
- **Enter/Space**: Activates focused buttons
- **Arrow Keys**: Navigate lists/options

## Accessibility Features

- **ARIA Labels**: Proper dialog and description labeling
- **Screen Reader**: Full screen reader compatibility
- **Reduced Motion**: Respects user motion preferences
- **Touch Support**: Mobile-friendly touch interactions

## Test Scenarios

### Focus Management
- Focus trap functionality
- Focus restoration
- Mobile focus handling

### Keyboard Navigation
- Tab order and navigation
- Escape key handling
- Button activation

### Screen Reader Support
- ARIA attributes
- Semantic structure
- Announcement handling
        `,
      },
    },
  },
  argTypes: {
    open: {
      description: 'Whether the dialog is open',
      control: 'boolean',
    },
    onOpenChange: {
      description: 'Callback when dialog open state changes',
      action: 'openChanged',
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * **Basic Focus Trap**
 *
 * Demonstrates focus trapping within the dialog.
 */
export const BasicFocusTrap: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Focus Trap Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click "Open Dialog" then use Tab to navigate. Focus should stay within the dialog.
          Press Escape to close.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Open Focus Trap Test
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Focus Trap Dialog</DialogTitle>
              <DialogDescription>
                Focus should be trapped within this dialog. Use Tab to navigate between elements.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="input1" className="text-sm font-medium">
                  Input Field 1
                </label>
                <input
                  id="input1"
                  type="text"
                  placeholder="First input"
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="input2" className="text-sm font-medium">
                  Input Field 2
                </label>
                <input
                  id="input2"
                  type="text"
                  placeholder="Second input"
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input id="checkbox" type="checkbox" />
                <label htmlFor="checkbox" className="text-sm">
                  Checkbox option
                </label>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Save Changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * **Keyboard Navigation**
 *
 * Tests comprehensive keyboard navigation including Tab, Escape, and Enter.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string>('')
    const [inputValue, setInputValue] = useState('')

    const options = ['Option A', 'Option B', 'Option C', 'Option D']

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Keyboard Navigation Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test keyboard navigation: Tab (navigate), Enter/Space (activate), Escape (close).
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Open Keyboard Test
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Navigation Test</DialogTitle>
              <DialogDescription>
                Use Tab to navigate, Enter/Space to activate buttons, Escape to close.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="test-input" className="text-sm font-medium">
                  Test Input
                </label>
                <input
                  id="test-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type here..."
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select an Option</label>
                <div className="space-y-1">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full text-left px-3 py-2 rounded border ${
                        selectedOption === option
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selectedOption && (
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium">{selectedOption}</span>
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * **Mobile Focus Handling**
 *
 * Tests mobile-specific focus management and virtual keyboard handling.
 */
export const MobileFocusHandling: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    })

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Mobile Focus Handling Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test on mobile devices: Focus management, virtual keyboard handling, touch interactions.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Open Mobile Test
        </button>

        <div className="mt-4 p-4 bg-muted rounded text-sm">
          <h3 className="font-semibold mb-2">Mobile Testing Instructions:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Test on actual mobile device or browser dev tools mobile emulation</li>
            <li>• Focus should trap within dialog bounds</li>
            <li>• Virtual keyboard should not break focus management</li>
            <li>• Touch interactions should work properly</li>
            <li>• Escape gesture should close dialog on mobile</li>
          </ul>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mobile Focus Test</DialogTitle>
              <DialogDescription>
                Test focus management on mobile devices with virtual keyboards.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="mobile-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="mobile-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="mobile-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="mobile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="mobile-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="mobile-message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message"
                  rows={3}
                  className="px-3 py-2 border rounded resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Submit
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * **Screen Reader Compatibility**
 *
 * Tests ARIA attributes and screen reader compatibility.
 */
export const ScreenReaderCompatibility: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Screen Reader Compatibility Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test with screen readers: JAWS, NVDA, VoiceOver. Check ARIA attributes and announcements.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          aria-describedby="sr-instructions"
        >
          Open Screen Reader Test
        </button>

        <div id="sr-instructions" className="mt-4 p-4 bg-muted rounded text-sm">
          <h3 className="font-semibold mb-2">Screen Reader Testing:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Dialog should announce as modal dialog</li>
            <li>• Title and description should be announced</li>
            <li>• Focus changes should be announced</li>
            <li>• Button roles and states should be clear</li>
            <li>• Closing should return focus appropriately</li>
          </ul>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Screen Reader Accessibility Test</DialogTitle>
              <DialogDescription>
                This dialog tests screen reader compatibility with proper ARIA attributes,
                semantic structure, and focus management.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                <p className="text-blue-800 text-sm">
                  Screen readers should announce this section clearly with proper heading structure.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Form Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="sr-option1"
                      type="radio"
                      name="sr-options"
                      defaultChecked
                      aria-describedby="option1-desc"
                    />
                    <label htmlFor="sr-option1" className="text-sm">
                      Option 1: Primary choice
                    </label>
                    <span id="option1-desc" className="text-xs text-muted-foreground sr-only">
                      This is the recommended primary option
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="sr-option2"
                      type="radio"
                      name="sr-options"
                      aria-describedby="option2-desc"
                    />
                    <label htmlFor="sr-option2" className="text-sm">
                      Option 2: Alternative choice
                    </label>
                    <span id="option2-desc" className="text-xs text-muted-foreground sr-only">
                      This is an alternative option with different features
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 text-sm" role="status" aria-live="polite">
                  All form fields have been completed successfully.
                </p>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                aria-describedby="cancel-help"
              >
                Cancel
              </button>
              <span id="cancel-help" className="sr-only">
                Closes the dialog without saving changes
              </span>

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                aria-describedby="save-help"
              >
                Save Changes
              </button>
              <span id="save-help" className="sr-only">
                Saves all changes and closes the dialog
              </span>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * **Focus Restoration**
 *
 * Tests that focus returns to the trigger element when dialog closes.
 */
export const FocusRestoration: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [focusRestored, setFocusRestored] = useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    const handleOpen = () => {
      setOpen(true)
      setFocusRestored(false)
    }

    const handleClose = () => {
      setOpen(false)
      // Focus should automatically restore to trigger
      setTimeout(() => {
        if (document.activeElement === triggerRef.current) {
          setFocusRestored(true)
        }
      }, 100)
    }

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Focus Restoration Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Open dialog, then close it. Focus should return to the "Open Dialog" button.
        </p>

        <div className="space-y-4">
          <button
            ref={triggerRef}
            onClick={handleOpen}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Open Focus Restoration Test
          </button>

          {focusRestored && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              ✅ Focus successfully restored to trigger button!
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <strong>Testing Steps:</strong>
            <ol className="mt-1 ml-4 list-decimal space-y-1">
              <li>Click "Open Focus Restoration Test"</li>
              <li>Dialog opens and focus moves inside</li>
              <li>Close dialog (Escape key or close button)</li>
              <li>Focus should return to the "Open Focus Restoration Test" button</li>
              <li>Green success message should appear</li>
            </ol>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Focus Restoration Test</DialogTitle>
              <DialogDescription>
                Close this dialog to test focus restoration to the trigger button.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                When you close this dialog, focus should automatically return to the
                "Open Focus Restoration Test" button above.
              </p>
            </div>

            <DialogFooter>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Close & Test Focus Restoration
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/**
 * **Complex Dialog Content**
 *
 * Tests accessibility with complex nested content and interactive elements.
 */
export const ComplexDialogContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'help'>('general')

    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold mb-4">Complex Dialog Content Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test accessibility with tabs, forms, and complex nested content.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Open Complex Dialog
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Complex Dialog with Tabs</DialogTitle>
              <DialogDescription>
                This dialog contains tabs, forms, and complex nested content to test comprehensive accessibility.
              </DialogDescription>
            </DialogHeader>

            {/* Tab Navigation */}
            <div className="border-b">
              <nav className="flex space-x-1" role="tablist" aria-label="Dialog sections">
                {[
                  { id: 'general', label: 'General' },
                  { id: 'advanced', label: 'Advanced' },
                  { id: 'help', label: 'Help' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Panels */}
            <div className="py-4">
              {activeTab === 'general' && (
                <div id="general-panel" role="tabpanel" aria-labelledby="general-tab">
                  <h3 className="font-semibold mb-3">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="setting-name" className="text-sm font-medium">
                        Display Name
                      </label>
                      <input
                        id="setting-name"
                        type="text"
                        defaultValue="User Name"
                        className="px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input id="setting-notifications" type="checkbox" defaultChecked />
                      <label htmlFor="setting-notifications" className="text-sm">
                        Enable notifications
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div id="advanced-panel" role="tabpanel" aria-labelledby="advanced-tab">
                  <h3 className="font-semibold mb-3">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="setting-timeout" className="text-sm font-medium">
                        Session Timeout (minutes)
                      </label>
                      <input
                        id="setting-timeout"
                        type="number"
                        defaultValue="30"
                        min="5"
                        max="120"
                        className="px-3 py-2 border rounded w-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme Preference</label>
                      <div className="space-y-1">
                        {['Light', 'Dark', 'System'].map((theme) => (
                          <div key={theme} className="flex items-center space-x-2">
                            <input
                              id={`theme-${theme.toLowerCase()}`}
                              type="radio"
                              name="theme"
                              defaultChecked={theme === 'System'}
                            />
                            <label
                              htmlFor={`theme-${theme.toLowerCase()}`}
                              className="text-sm"
                            >
                              {theme}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div id="help-panel" role="tabpanel" aria-labelledby="help-tab">
                  <h3 className="font-semibold mb-3">Help & Support</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      This dialog demonstrates complex accessibility patterns including:
                    </p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Tabbed interfaces with proper ARIA attributes</li>
                      <li>Form controls with labels and descriptions</li>
                      <li>Radio button groups and checkboxes</li>
                      <li>Focus management within complex content</li>
                      <li>Screen reader navigation support</li>
                    </ul>
                    <p>
                      Use keyboard navigation to test all interactive elements within this dialog.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Save Settings
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}