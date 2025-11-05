import type { Meta, StoryObj } from '@storybook/react'
import { KeyboardHint } from '@clarity-chat/react'
import { useState } from 'react'
import type { KeyboardHintShortcut } from '@clarity-chat/react'

const meta: Meta<typeof KeyboardHint> = {
  title: 'Components/KeyboardHint',
  component: KeyboardHint,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Display keyboard shortcuts and hints to users. Supports multiple positions, categories, and animations. Essential for power users and accessibility.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof KeyboardHint>

const mockShortcuts: KeyboardHintShortcut[] = [
  {
    keys: ['Ctrl', 'K'],
    description: 'Open command palette',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Send message',
    category: 'Actions',
  },
  {
    keys: ['Esc'],
    description: 'Close dialog',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', 'B'],
    description: 'Toggle sidebar',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', '/'],
    description: 'Show shortcuts',
    category: 'Help',
  },
]

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return (
      <div className="relative h-screen">
        <KeyboardHint
          shortcuts={mockShortcuts}
          visible={visible}
          onClose={() => setVisible(false)}
        />
        <div className="p-8">
          <button
            onClick={() => setVisible(!visible)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Toggle Keyboard Hints
          </button>
        </div>
      </div>
    )
  },
}

export const TopRight: Story = {
  render: () => (
    <div className="relative h-screen">
      <KeyboardHint
        shortcuts={mockShortcuts}
        visible={true}
        position="top-right"
      />
    </div>
  ),
}

export const TopLeft: Story = {
  render: () => (
    <div className="relative h-screen">
      <KeyboardHint
        shortcuts={mockShortcuts}
        visible={true}
        position="top-left"
      />
    </div>
  ),
}

export const BottomLeft: Story = {
  render: () => (
    <div className="relative h-screen">
      <KeyboardHint
        shortcuts={mockShortcuts}
        visible={true}
        position="bottom-left"
      />
    </div>
  ),
}

export const Center: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return (
      <div className="relative h-screen">
        <KeyboardHint
          shortcuts={mockShortcuts}
          visible={visible}
          position="center"
          onClose={() => setVisible(false)}
        />
        <div className="p-8">
          <button
            onClick={() => setVisible(!visible)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Toggle Keyboard Hints
          </button>
        </div>
      </div>
    )
  },
}

export const ManyShortcuts: Story = {
  render: () => {
    const manyShortcuts: KeyboardHintShortcut[] = [
      ...mockShortcuts,
      { keys: ['Ctrl', 'S'], description: 'Save', category: 'Actions' },
      { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Actions' },
      { keys: ['Ctrl', 'Y'], description: 'Redo', category: 'Actions' },
      { keys: ['Ctrl', 'F'], description: 'Find', category: 'Navigation' },
      { keys: ['Ctrl', 'G'], description: 'Find next', category: 'Navigation' },
      { keys: ['F11'], description: 'Fullscreen', category: 'View' },
      { keys: ['Ctrl', 'Shift', 'P'], description: 'Command palette', category: 'Navigation' },
    ]
    
    return (
      <div className="relative h-screen">
        <KeyboardHint
          shortcuts={manyShortcuts}
          visible={true}
          position="bottom-right"
        />
      </div>
    )
  },
}

export const WithoutCategories: Story = {
  render: () => {
    const shortcutsWithoutCategories: KeyboardHintShortcut[] = [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Ctrl', 'Enter'], description: 'Send message' },
      { keys: ['Esc'], description: 'Close dialog' },
    ]
    
    return (
      <div className="relative h-screen">
        <KeyboardHint
          shortcuts={shortcutsWithoutCategories}
          visible={true}
        />
      </div>
    )
  },
}
