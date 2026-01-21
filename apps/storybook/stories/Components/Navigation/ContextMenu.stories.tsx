import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenu } from '@clarity-chat/react'
import type { ContextMenuItem } from '@clarity-chat/react'

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Navigation/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Right-click context menu with support for icons, shortcuts, separators, and submenus. Keyboard accessible with Escape to close.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ContextMenu>

const mockItems: ContextMenuItem[] = [
  {
    id: 'copy',
    label: 'Copy',
    shortcut: 'Ctrl+C',
    onSelect: () => alert('Copy clicked'),
  },
  {
    id: 'paste',
    label: 'Paste',
    shortcut: 'Ctrl+V',
    onSelect: () => alert('Paste clicked'),
  },
  {
    id: 'separator-1',
    separator: true,
  },
  {
    id: 'edit',
    label: 'Edit',
    onSelect: () => alert('Edit clicked'),
  },
  {
    id: 'delete',
    label: 'Delete',
    danger: true,
    onSelect: () => alert('Delete clicked'),
  },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 border-2 border-dashed rounded-lg text-center">
      <ContextMenu items={mockItems}>
        <div className="p-4 bg-muted rounded-lg inline-block">
          Right-click me to open context menu
        </div>
      </ContextMenu>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => {
    const itemsWithIcons: ContextMenuItem[] = [
      {
        id: 'copy',
        label: 'Copy',
        icon: <span>📋</span>,
        onSelect: () => alert('Copy'),
      },
      {
        id: 'cut',
        label: 'Cut',
        icon: <span>✂️</span>,
        onSelect: () => alert('Cut'),
      },
      {
        id: 'paste',
        label: 'Paste',
        icon: <span>📄</span>,
        onSelect: () => alert('Paste'),
      },
    ]

    return (
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <ContextMenu items={itemsWithIcons}>
          <div className="p-4 bg-muted rounded-lg inline-block">
            Right-click for menu with icons
          </div>
        </ContextMenu>
      </div>
    )
  },
}

export const WithSubmenu: Story = {
  render: () => {
    const itemsWithSubmenu: ContextMenuItem[] = [
      {
        id: 'new',
        label: 'New',
        icon: <span>➕</span>,
        submenu: [
          { id: 'file', label: 'File', onSelect: () => alert('New File') },
          {
            id: 'folder',
            label: 'Folder',
            onSelect: () => alert('New Folder'),
          },
        ],
      },
      {
        id: 'open',
        label: 'Open',
        icon: <span>📂</span>,
        onSelect: () => alert('Open'),
      },
      {
        id: 'separator',
        separator: true,
      },
      {
        id: 'export',
        label: 'Export',
        icon: <span>💾</span>,
        submenu: [
          { id: 'pdf', label: 'Export as PDF', onSelect: () => alert('PDF') },
          { id: 'csv', label: 'Export as CSV', onSelect: () => alert('CSV') },
        ],
      },
    ]

    return (
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <ContextMenu items={itemsWithSubmenu}>
          <div className="p-4 bg-muted rounded-lg inline-block">
            Right-click for menu with submenus
          </div>
        </ContextMenu>
      </div>
    )
  },
}

export const WithDisabledItems: Story = {
  render: () => {
    const itemsWithDisabled: ContextMenuItem[] = [
      {
        id: 'enabled',
        label: 'Enabled Item',
        onSelect: () => alert('Enabled'),
      },
      {
        id: 'disabled',
        label: 'Disabled Item',
        disabled: true,
        onSelect: () => alert('This should not fire'),
      },
      {
        id: 'another',
        label: 'Another Enabled',
        onSelect: () => alert('Another'),
      },
    ]

    return (
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <ContextMenu items={itemsWithDisabled}>
          <div className="p-4 bg-muted rounded-lg inline-block">
            Right-click for menu with disabled items
          </div>
        </ContextMenu>
      </div>
    )
  },
}

export const WithDangerItems: Story = {
  render: () => {
    const itemsWithDanger: ContextMenuItem[] = [
      {
        id: 'normal',
        label: 'Normal Action',
        onSelect: () => alert('Normal'),
      },
      {
        id: 'separator',
        separator: true,
      },
      {
        id: 'delete',
        label: 'Delete',
        danger: true,
        onSelect: () => alert('Delete clicked'),
      },
      {
        id: 'remove',
        label: 'Remove Permanently',
        danger: true,
        onSelect: () => alert('Remove clicked'),
      },
    ]

    return (
      <div className="p-8 border-2 border-dashed rounded-lg text-center">
        <ContextMenu items={itemsWithDanger}>
          <div className="p-4 bg-muted rounded-lg inline-block">
            Right-click for menu with danger items
          </div>
        </ContextMenu>
      </div>
    )
  },
}
