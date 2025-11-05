import type { Meta, StoryObj } from '@storybook/react'
import { KeyboardHint } from '@clarity-chat/react'

/**
 * KeyboardHint displays keyboard shortcuts in a visually appealing way.
 * 
 * **Key Features:**
 * - Platform-aware (⌘ on Mac, Ctrl on Windows)
 * - Multiple key combinations
 * - Customizable styling
 * - Accessible labels
 * 
 * **Use Cases:**
 * - Shortcut tooltips
 * - Help documentation
 * - Command palettes
 * - Onboarding guides
 */
const meta = {
  title: 'Components/KeyboardHint',
  component: KeyboardHint,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display keyboard shortcuts with platform-aware formatting.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KeyboardHint>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    keys: ['Enter'],
  },
}

export const Combination: Story = {
  args: {
    keys: ['Cmd', 'K'],
  },
}

export const CommonShortcuts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Save</span>
        <KeyboardHint keys={['Cmd', 'S']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Copy</span>
        <KeyboardHint keys={['Cmd', 'C']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Paste</span>
        <KeyboardHint keys={['Cmd', 'V']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Undo</span>
        <KeyboardHint keys={['Cmd', 'Z']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Redo</span>
        <KeyboardHint keys={['Cmd', 'Shift', 'Z']} />
      </div>
    </div>
  ),
}

export const ChatShortcuts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Send message</span>
        <KeyboardHint keys={['Cmd', 'Enter']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">New line</span>
        <KeyboardHint keys={['Shift', 'Enter']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Search messages</span>
        <KeyboardHint keys={['Cmd', 'F']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Open command palette</span>
        <KeyboardHint keys={['Cmd', 'K']} />
      </div>
      
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <span className="text-sm">Focus input</span>
        <KeyboardHint keys={['/']} />
      </div>
    </div>
  ),
}

export const InTooltip: Story = {
  render: () => (
    <div className="flex gap-4">
      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
        <span>Save</span>
        <KeyboardHint keys={['Cmd', 'S']} size="sm" />
      </button>
      
      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-3">
        <span>Cancel</span>
        <KeyboardHint keys={['Esc']} size="sm" />
      </button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm">Small:</span>
        <KeyboardHint keys={['Cmd', 'K']} size="sm" />
      </div>
      
      <div className="flex items-center gap-3">
        <span>Default:</span>
        <KeyboardHint keys={['Cmd', 'K']} />
      </div>
      
      <div className="flex items-center gap-3 text-lg">
        <span>Large:</span>
        <KeyboardHint keys={['Cmd', 'K']} size="lg" />
      </div>
    </div>
  ),
}

export const NavigationKeys: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center">
        <KeyboardHint keys={['↑']} />
        <p className="text-xs text-gray-600 mt-2">Up</p>
      </div>
      
      <div />
      
      <div className="text-center">
        <KeyboardHint keys={['⇧']} />
        <p className="text-xs text-gray-600 mt-2">Shift</p>
      </div>
      
      <div className="text-center">
        <KeyboardHint keys={['←']} />
        <p className="text-xs text-gray-600 mt-2">Left</p>
      </div>
      
      <div className="text-center">
        <KeyboardHint keys={['↓']} />
        <p className="text-xs text-gray-600 mt-2">Down</p>
      </div>
      
      <div className="text-center">
        <KeyboardHint keys={['→']} />
        <p className="text-xs text-gray-600 mt-2">Right</p>
      </div>
    </div>
  ),
}
