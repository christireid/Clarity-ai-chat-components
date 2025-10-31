import React from 'react'
import { Metadata } from 'next'
import DocsLayout from '@/components/Layout/DocsLayout'
import ApiTable from '@/components/Demo/ApiTable'
import LiveDemo from '@/components/Demo/LiveDemo'
import ComponentPreview from '@/components/Demo/ComponentPreview'
import Callout from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'ContextMenu - Clarity Chat Components',
  description: 'Right-click context menu component with keyboard navigation, submenus, separators, and custom actions for chat applications.',
}

export default function ContextMenuPage() {
  return (
    <DocsLayout
      title="ContextMenu"
      description="Right-click menus with keyboard navigation, submenus, and custom actions"
    >
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Overview</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            The <code>ContextMenu</code> component provides rich right-click context menus for messages, users, and other 
            chat elements. It supports keyboard navigation, nested submenus, icons, shortcuts, danger states, and custom actions.
          </p>

          <Callout type="tip" className="mb-6">
            Context menus automatically position themselves to stay within viewport boundaries and support full keyboard 
            navigation with arrow keys, Enter, and Escape.
          </Callout>
        </section>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Import</h2>
          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
            <code>{`import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@clarity-chat/react'`}</code>
          </pre>
        </section>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Basic Usage</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Wrap any element with ContextMenu to add right-click functionality:
          </p>

          <LiveDemo
            title="Basic Context Menu"
            code={`import React, { useState } from 'react'
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@clarity-chat/react'

export default function BasicContextMenuExample() {
  const [action, setAction] = useState('')

  const handleAction = (actionName) => {
    setAction(actionName)
    setTimeout(() => setAction(''), 2000)
  }

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ Action: {action}
        </div>
      )}

      <ContextMenu
        items={[
          {
            id: 'copy',
            label: 'Copy',
            icon: '📋',
            shortcut: 'Ctrl+C',
            onSelect: () => handleAction('Copied to clipboard')
          },
          {
            id: 'paste',
            label: 'Paste',
            icon: '📄',
            shortcut: 'Ctrl+V',
            onSelect: () => handleAction('Pasted from clipboard')
          },
          { type: 'separator' },
          {
            id: 'select-all',
            label: 'Select All',
            shortcut: 'Ctrl+A',
            onSelect: () => handleAction('Selected all')
          },
          { type: 'separator' },
          {
            id: 'delete',
            label: 'Delete',
            icon: '🗑️',
            danger: true,
            onSelect: () => handleAction('Deleted')
          }
        ]}
      >
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 text-center cursor-default">
          <p className="text-lg font-semibold mb-2">Right-click me!</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Or try keyboard navigation: Tab to focus, then use arrow keys
          </p>
        </div>
      </ContextMenu>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Keyboard Navigation:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• <kbd>↑</kbd> <kbd>↓</kbd> - Navigate items</li>
          <li>• <kbd>Enter</kbd> - Select item</li>
          <li>• <kbd>Escape</kbd> - Close menu</li>
          <li>• <kbd>Tab</kbd> - Focus trigger element</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="600px"
          />
        </section>

        {/* Props */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Props</h2>
          <ApiTable
            title="ContextMenu Props"
            data={[
              {
                name: 'items',
                type: 'MenuItem[]',
                required: true,
                description: 'Array of menu items to display'
              },
              {
                name: 'children',
                type: 'React.ReactNode',
                required: true,
                description: 'Element that triggers the context menu'
              },
              {
                name: 'trigger',
                type: '"contextmenu" | "click" | "both"',
                default: '"contextmenu"',
                description: 'How to trigger the menu (right-click, left-click, or both)'
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable the context menu'
              },
              {
                name: 'modal',
                type: 'boolean',
                default: 'true',
                description: 'Close menu when clicking outside'
              },
              {
                name: 'onOpenChange',
                type: '(open: boolean) => void',
                description: 'Callback when menu opens or closes'
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes for the menu container'
              },
              {
                name: 'align',
                type: '"start" | "center" | "end"',
                default: '"start"',
                description: 'Horizontal alignment relative to trigger'
              },
              {
                name: 'side',
                type: '"top" | "right" | "bottom" | "left"',
                default: '"bottom"',
                description: 'Preferred side to position the menu'
              },
              {
                name: 'sideOffset',
                type: 'number',
                default: '0',
                description: 'Offset in pixels from the trigger'
              },
              {
                name: 'collisionPadding',
                type: 'number',
                default: '8',
                description: 'Padding from viewport edges for collision detection'
              },
              {
                name: 'avoidCollisions',
                type: 'boolean',
                default: 'true',
                description: 'Automatically adjust position to avoid collisions'
              }
            ]}
          />
        </section>

        {/* MenuItem Type */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">MenuItem Type</h2>
          <ApiTable
            title="MenuItem Properties"
            data={[
              {
                name: 'id',
                type: 'string',
                required: true,
                description: 'Unique identifier for the menu item'
              },
              {
                name: 'label',
                type: 'string',
                required: true,
                description: 'Display text for the menu item'
              },
              {
                name: 'type',
                type: '"item" | "separator" | "submenu"',
                default: '"item"',
                description: 'Type of menu item'
              },
              {
                name: 'icon',
                type: 'string | React.ReactNode',
                description: 'Icon to display before the label (emoji or component)'
              },
              {
                name: 'shortcut',
                type: 'string',
                description: 'Keyboard shortcut hint to display'
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable this menu item'
              },
              {
                name: 'danger',
                type: 'boolean',
                default: 'false',
                description: 'Style as a destructive action (red)'
              },
              {
                name: 'checked',
                type: 'boolean',
                description: 'Show checkmark (for checkbox-style items)'
              },
              {
                name: 'items',
                type: 'MenuItem[]',
                description: 'Nested submenu items (when type is "submenu")'
              },
              {
                name: 'onSelect',
                type: '() => void',
                description: 'Callback when item is selected'
              }
            ]}
          />
        </section>

        {/* Message Context Menu */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Message Context Menu</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            A practical example showing context menu actions for chat messages:
          </p>

          <LiveDemo
            title="Message Context Menu"
            code={`import React, { useState } from 'react'
import { ContextMenu, Message } from '@clarity-chat/react'

export default function MessageContextMenuExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey there! Right-click on any message to see options.',
      sender: { id: 'user1', name: 'Alice' },
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      text: 'This is a great feature! 🎉',
      sender: { id: 'user2', name: 'Bob' },
      timestamp: new Date(Date.now() - 60000),
      reactions: ['👍', '❤️']
    },
    {
      id: '3',
      text: 'You can reply, edit, delete, and more...',
      sender: { id: 'user1', name: 'Alice' },
      timestamp: new Date(Date.now() - 30000)
    }
  ])
  
  const [action, setAction] = useState('')

  const showAction = (actionName) => {
    setAction(actionName)
    setTimeout(() => setAction(''), 2000)
  }

  const handleAction = (messageId, actionType) => {
    switch (actionType) {
      case 'reply':
        showAction(\`Replying to message \${messageId}\`)
        break
      case 'edit':
        showAction(\`Editing message \${messageId}\`)
        break
      case 'copy':
        const message = messages.find(m => m.id === messageId)
        navigator.clipboard.writeText(message?.text || '')
        showAction('Copied to clipboard')
        break
      case 'pin':
        showAction(\`Pinned message \${messageId}\`)
        break
      case 'forward':
        showAction(\`Forwarding message \${messageId}\`)
        break
      case 'delete':
        setMessages(messages.filter(m => m.id !== messageId))
        showAction(\`Deleted message \${messageId}\`)
        break
      case 'report':
        showAction(\`Reported message \${messageId}\`)
        break
    }
  }

  const getMessageMenu = (message) => [
    {
      id: 'reply',
      label: 'Reply',
      icon: '↩️',
      shortcut: 'R',
      onSelect: () => handleAction(message.id, 'reply')
    },
    {
      id: 'react',
      label: 'React',
      icon: '😊',
      items: [
        {
          id: 'react-like',
          label: '👍 Like',
          onSelect: () => showAction('Reacted with 👍')
        },
        {
          id: 'react-love',
          label: '❤️ Love',
          onSelect: () => showAction('Reacted with ❤️')
        },
        {
          id: 'react-laugh',
          label: '😂 Laugh',
          onSelect: () => showAction('Reacted with 😂')
        },
        {
          id: 'react-wow',
          label: '😮 Wow',
          onSelect: () => showAction('Reacted with 😮')
        }
      ]
    },
    { type: 'separator' },
    {
      id: 'copy',
      label: 'Copy Text',
      icon: '📋',
      shortcut: 'Ctrl+C',
      onSelect: () => handleAction(message.id, 'copy')
    },
    {
      id: 'pin',
      label: 'Pin Message',
      icon: '📌',
      onSelect: () => handleAction(message.id, 'pin')
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: '➡️',
      onSelect: () => handleAction(message.id, 'forward')
    },
    { type: 'separator' },
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      shortcut: 'E',
      disabled: message.sender.id !== 'user1',
      onSelect: () => handleAction(message.id, 'edit')
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      shortcut: 'Del',
      danger: true,
      disabled: message.sender.id !== 'user1',
      onSelect: () => handleAction(message.id, 'delete')
    },
    { type: 'separator' },
    {
      id: 'report',
      label: 'Report',
      icon: '⚠️',
      danger: true,
      onSelect: () => handleAction(message.id, 'report')
    }
  ]

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold animate-fadeIn">
          ✓ {action}
        </div>
      )}

      <div className="space-y-3">
        {messages.map(message => (
          <ContextMenu key={message.id} items={getMessageMenu(message)}>
            <div className="cursor-default">
              <Message
                {...message}
                variant={message.sender.id === 'user1' ? 'sent' : 'received'}
              />
            </div>
          </ContextMenu>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Tips:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• Right-click any message to see context menu</li>
          <li>• Notice "Edit" and "Delete" are disabled for Bob's messages</li>
          <li>• "React" has a submenu with emoji reactions</li>
          <li>• Dangerous actions (Delete, Report) are styled in red</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="750px"
          />
        </section>

        {/* Nested Submenus */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Nested Submenus</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create multi-level menus with nested items:
          </p>

          <LiveDemo
            title="Nested Submenus"
            code={`import React, { useState } from 'react'
import { ContextMenu } from '@clarity-chat/react'

export default function NestedSubmenuExample() {
  const [action, setAction] = useState('')
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState('medium')

  const showAction = (text) => {
    setAction(text)
    setTimeout(() => setAction(''), 2000)
  }

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      icon: '📁',
      items: [
        {
          id: 'new',
          label: 'New',
          icon: '➕',
          items: [
            {
              id: 'new-conversation',
              label: 'Conversation',
              onSelect: () => showAction('New conversation created')
            },
            {
              id: 'new-group',
              label: 'Group Chat',
              onSelect: () => showAction('New group chat created')
            },
            {
              id: 'new-channel',
              label: 'Channel',
              onSelect: () => showAction('New channel created')
            }
          ]
        },
        {
          id: 'open',
          label: 'Open',
          icon: '📂',
          shortcut: 'Ctrl+O',
          onSelect: () => showAction('Open dialog shown')
        },
        { type: 'separator' },
        {
          id: 'save',
          label: 'Save',
          icon: '💾',
          shortcut: 'Ctrl+S',
          onSelect: () => showAction('Saved')
        },
        {
          id: 'export',
          label: 'Export',
          icon: '📤',
          items: [
            {
              id: 'export-pdf',
              label: 'Export as PDF',
              onSelect: () => showAction('Exported as PDF')
            },
            {
              id: 'export-txt',
              label: 'Export as Text',
              onSelect: () => showAction('Exported as Text')
            },
            {
              id: 'export-html',
              label: 'Export as HTML',
              onSelect: () => showAction('Exported as HTML')
            }
          ]
        }
      ]
    },
    {
      id: 'view',
      label: 'View',
      icon: '👁️',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          icon: '🎨',
          items: [
            {
              id: 'theme-light',
              label: 'Light',
              checked: theme === 'light',
              onSelect: () => {
                setTheme('light')
                showAction('Theme: Light')
              }
            },
            {
              id: 'theme-dark',
              label: 'Dark',
              checked: theme === 'dark',
              onSelect: () => {
                setTheme('dark')
                showAction('Theme: Dark')
              }
            },
            {
              id: 'theme-auto',
              label: 'Auto',
              checked: theme === 'auto',
              onSelect: () => {
                setTheme('auto')
                showAction('Theme: Auto')
              }
            }
          ]
        },
        {
          id: 'font-size',
          label: 'Font Size',
          icon: '📏',
          items: [
            {
              id: 'font-small',
              label: 'Small',
              checked: fontSize === 'small',
              onSelect: () => {
                setFontSize('small')
                showAction('Font size: Small')
              }
            },
            {
              id: 'font-medium',
              label: 'Medium',
              checked: fontSize === 'medium',
              onSelect: () => {
                setFontSize('medium')
                showAction('Font size: Medium')
              }
            },
            {
              id: 'font-large',
              label: 'Large',
              checked: fontSize === 'large',
              onSelect: () => {
                setFontSize('large')
                showAction('Font size: Large')
              }
            }
          ]
        },
        { type: 'separator' },
        {
          id: 'fullscreen',
          label: 'Fullscreen',
          shortcut: 'F11',
          onSelect: () => showAction('Toggled fullscreen')
        }
      ]
    },
    { type: 'separator' },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      items: [
        {
          id: 'docs',
          label: 'Documentation',
          shortcut: 'F1',
          onSelect: () => showAction('Documentation opened')
        },
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts',
          shortcut: '?',
          onSelect: () => showAction('Shortcuts dialog opened')
        },
        { type: 'separator' },
        {
          id: 'about',
          label: 'About',
          onSelect: () => showAction('About dialog opened')
        }
      ]
    }
  ]

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <ContextMenu items={menuItems}>
        <div className="p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 text-center cursor-default">
          <h3 className="text-xl font-bold mb-2">Multi-Level Menu</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Right-click to see nested submenus
          </p>
          <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
            <p>Current theme: <strong className="text-slate-700 dark:text-slate-300">{theme}</strong></p>
            <p>Font size: <strong className="text-slate-700 dark:text-slate-300">{fontSize}</strong></p>
          </div>
        </div>
      </ContextMenu>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• 3 levels of nested submenus</li>
          <li>• Checkmarks for selected options</li>
          <li>• Separators between menu groups</li>
          <li>• Keyboard shortcuts displayed</li>
          <li>• Icons for visual hierarchy</li>
          <li>• Hover to open submenus</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
        </section>

        {/* Click Trigger */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Click Trigger</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Context menus can be triggered by left-click, right-click, or both:
          </p>

          <LiveDemo
            title="Click Trigger Options"
            code={`import React, { useState } from 'react'
import { ContextMenu } from '@clarity-chat/react'

export default function ClickTriggerExample() {
  const [action, setAction] = useState('')

  const showAction = (text) => {
    setAction(text)
    setTimeout(() => setAction(''), 2000)
  }

  const menuItems = [
    {
      id: 'action1',
      label: 'Action 1',
      icon: '⚡',
      onSelect: () => showAction('Action 1 triggered')
    },
    {
      id: 'action2',
      label: 'Action 2',
      icon: '🎯',
      onSelect: () => showAction('Action 2 triggered')
    },
    {
      id: 'action3',
      label: 'Action 3',
      icon: '✨',
      onSelect: () => showAction('Action 3 triggered')
    }
  ]

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContextMenu items={menuItems} trigger="contextmenu">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700 text-center cursor-default">
            <div className="text-2xl mb-2">🖱️</div>
            <h3 className="font-semibold mb-1">Right-Click</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              trigger="contextmenu"
            </p>
          </div>
        </ContextMenu>

        <ContextMenu items={menuItems} trigger="click">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700 text-center cursor-pointer">
            <div className="text-2xl mb-2">👆</div>
            <h3 className="font-semibold mb-1">Left-Click</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              trigger="click"
            </p>
          </div>
        </ContextMenu>

        <ContextMenu items={menuItems} trigger="both">
          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700 text-center cursor-pointer">
            <div className="text-2xl mb-2">🖱️👆</div>
            <h3 className="font-semibold mb-1">Both</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              trigger="both"
            </p>
          </div>
        </ContextMenu>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="font-semibold mb-2">Trigger Options:</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <code className="px-2 py-1 bg-white dark:bg-slate-900 rounded">contextmenu</code> 
            <span className="ml-2">- Right-click only (default)</span>
          </li>
          <li>
            <code className="px-2 py-1 bg-white dark:bg-slate-900 rounded">click</code> 
            <span className="ml-2">- Left-click only</span>
          </li>
          <li>
            <code className="px-2 py-1 bg-white dark:bg-slate-900 rounded">both</code> 
            <span className="ml-2">- Both left and right-click</span>
          </li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="650px"
          />
        </section>

        {/* Positioning */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Positioning</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Control menu positioning with alignment and collision detection:
          </p>

          <Callout type="info" className="mb-6">
            The context menu automatically adjusts its position to stay within the viewport when <code>avoidCollisions</code> is enabled.
          </Callout>

          <LiveDemo
            title="Menu Positioning"
            code={`import React, { useState } from 'react'
import { ContextMenu } from '@clarity-chat/react'

export default function PositioningExample() {
  const [action, setAction] = useState('')

  const menuItems = [
    {
      id: 'item1',
      label: 'Menu Item 1',
      onSelect: () => {
        setAction('Item 1 selected')
        setTimeout(() => setAction(''), 2000)
      }
    },
    {
      id: 'item2',
      label: 'Menu Item 2',
      onSelect: () => {
        setAction('Item 2 selected')
        setTimeout(() => setAction(''), 2000)
      }
    },
    {
      id: 'item3',
      label: 'Menu Item 3',
      onSelect: () => {
        setAction('Item 3 selected')
        setTimeout(() => setAction(''), 2000)
      }
    }
  ]

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        {/* Top-left corner */}
        <div className="col-span-1">
          <ContextMenu items={menuItems} side="bottom" align="start">
            <button className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium">
              Top-Left
            </button>
          </ContextMenu>
        </div>

        {/* Top-right corner */}
        <div className="col-span-1 col-start-4">
          <ContextMenu items={menuItems} side="bottom" align="end">
            <button className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium">
              Top-Right
            </button>
          </ContextMenu>
        </div>

        {/* Center */}
        <div className="col-span-4 flex justify-center items-center min-h-[200px]">
          <ContextMenu items={menuItems} side="bottom" align="center">
            <button className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 font-semibold">
              Center (Right-Click)
            </button>
          </ContextMenu>
        </div>

        {/* Bottom-left corner */}
        <div className="col-span-1">
          <ContextMenu items={menuItems} side="top" align="start">
            <button className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium">
              Bottom-Left
            </button>
          </ContextMenu>
        </div>

        {/* Bottom-right corner */}
        <div className="col-span-1 col-start-4">
          <ContextMenu items={menuItems} side="top" align="end">
            <button className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium">
              Bottom-Right
            </button>
          </ContextMenu>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Positioning Options:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• <code>side</code>: "top" | "right" | "bottom" | "left"</li>
          <li>• <code>align</code>: "start" | "center" | "end"</li>
          <li>• <code>sideOffset</code>: Offset in pixels</li>
          <li>• <code>avoidCollisions</code>: Auto-adjust to stay in viewport</li>
          <li>• <code>collisionPadding</code>: Padding from edges</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
        </section>

        {/* Disabled States */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Disabled States</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Disable the entire menu or individual items:
          </p>

          <LiveDemo
            title="Disabled Menu Items"
            code={`import React, { useState } from 'react'
import { ContextMenu } from '@clarity-chat/react'

export default function DisabledStatesExample() {
  const [action, setAction] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [menuDisabled, setMenuDisabled] = useState(false)

  const showAction = (text) => {
    setAction(text)
    setTimeout(() => setAction(''), 2000)
  }

  const menuItems = [
    {
      id: 'basic-action',
      label: 'Basic Action',
      icon: '✅',
      onSelect: () => showAction('Basic action executed')
    },
    {
      id: 'always-disabled',
      label: 'Always Disabled',
      icon: '🚫',
      disabled: true,
      onSelect: () => showAction('This should not trigger')
    },
    { type: 'separator' },
    {
      id: 'premium-only',
      label: 'Premium Feature',
      icon: '⭐',
      disabled: !isPremium,
      onSelect: () => showAction('Premium feature activated')
    },
    {
      id: 'premium-action',
      label: 'Advanced Export',
      icon: '💎',
      disabled: !isPremium,
      onSelect: () => showAction('Advanced export completed')
    },
    { type: 'separator' },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      danger: true,
      onSelect: () => showAction('Deleted')
    }
  ]

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <div className="flex gap-4">
        <label className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Premium Account</span>
        </label>

        <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={menuDisabled}
            onChange={(e) => setMenuDisabled(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Disable Menu</span>
        </label>
      </div>

      <ContextMenu items={menuItems} disabled={menuDisabled}>
        <div className={\`p-8 rounded-lg border-2 border-dashed text-center cursor-default transition-all \${
          menuDisabled
            ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 opacity-50'
            : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700'
        }\`}>
          <h3 className="text-lg font-bold mb-2">
            {menuDisabled ? 'Menu Disabled' : 'Right-click for Menu'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isPremium ? '⭐ Premium features enabled' : '🔒 Premium features locked'}
          </p>
        </div>
      </ContextMenu>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• Toggle premium account to enable/disable premium features</li>
          <li>• Disabled items are grayed out and cannot be clicked</li>
          <li>• Disabling the entire menu prevents it from opening</li>
          <li>• Visual feedback for disabled state</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
        </section>

        {/* User Context Menu */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">User Context Menu</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Complete example with user profiles and actions:
          </p>

          <LiveDemo
            title="User Profile Context Menu"
            code={`import React, { useState } from 'react'
import { ContextMenu, Avatar } from '@clarity-chat/react'

export default function UserContextMenuExample() {
  const [action, setAction] = useState('')
  const [users] = useState([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: '👩‍💼',
      status: 'online',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: '👨‍💻',
      status: 'away',
      role: 'member'
    },
    {
      id: '3',
      name: 'Carol Williams',
      avatar: '👩‍🎨',
      status: 'offline',
      role: 'member'
    }
  ])

  const showAction = (text) => {
    setAction(text)
    setTimeout(() => setAction(''), 2000)
  }

  const getUserMenu = (user) => {
    const isAdmin = user.role === 'admin'
    
    return [
      {
        id: 'view-profile',
        label: 'View Profile',
        icon: '👤',
        onSelect: () => showAction(\`Viewing \${user.name}'s profile\`)
      },
      {
        id: 'send-message',
        label: 'Send Message',
        icon: '💬',
        shortcut: 'M',
        onSelect: () => showAction(\`Messaging \${user.name}\`)
      },
      {
        id: 'video-call',
        label: 'Video Call',
        icon: '📹',
        disabled: user.status === 'offline',
        onSelect: () => showAction(\`Calling \${user.name}\`)
      },
      { type: 'separator' },
      {
        id: 'add-friend',
        label: 'Add to Friends',
        icon: '➕',
        onSelect: () => showAction(\`Added \${user.name} as friend\`)
      },
      {
        id: 'mute',
        label: 'Mute Notifications',
        icon: '🔕',
        onSelect: () => showAction(\`Muted \${user.name}\`)
      },
      { type: 'separator' },
      {
        id: 'admin',
        label: 'Admin Actions',
        icon: '⚙️',
        disabled: !isAdmin,
        items: [
          {
            id: 'make-admin',
            label: 'Promote to Admin',
            onSelect: () => showAction(\`Promoted \${user.name} to admin\`)
          },
          {
            id: 'kick',
            label: 'Kick User',
            danger: true,
            onSelect: () => showAction(\`Kicked \${user.name}\`)
          },
          {
            id: 'ban',
            label: 'Ban User',
            danger: true,
            onSelect: () => showAction(\`Banned \${user.name}\`)
          }
        ]
      },
      { type: 'separator' },
      {
        id: 'report',
        label: 'Report User',
        icon: '⚠️',
        danger: true,
        onSelect: () => showAction(\`Reported \${user.name}\`)
      }
    ]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-slate-400'
      default: return 'bg-slate-400'
    }
  }

  return (
    <div className="space-y-4">
      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <div className="space-y-3">
        {users.map(user => (
          <ContextMenu key={user.id} items={getUserMenu(user)}>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-default">
              <div className="relative">
                <div className="text-4xl">{user.avatar}</div>
                <div className={\`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 \${getStatusColor(user.status)}\`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{user.name}</h3>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                  {user.status}
                </p>
              </div>
              <div className="text-sm text-slate-400">
                Right-click →
              </div>
            </div>
          </ContextMenu>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>• User-specific menu items</li>
          <li>• Video call disabled for offline users</li>
          <li>• Admin-only actions for Alice (admin)</li>
          <li>• Status indicators (online/away/offline)</li>
          <li>• Role badges</li>
          <li>• Contextual actions based on user state</li>
        </ul>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="750px"
          />
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Accessibility</h2>
          
          <Callout type="info" className="mb-6">
            The ContextMenu component is built with accessibility in mind and follows WCAG guidelines.
          </Callout>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• <kbd>↑</kbd> <kbd>↓</kbd> - Navigate through menu items</li>
                <li>• <kbd>→</kbd> - Open submenu</li>
                <li>• <kbd>←</kbd> - Close submenu</li>
                <li>• <kbd>Enter</kbd> / <kbd>Space</kbd> - Select item</li>
                <li>• <kbd>Escape</kbd> - Close menu</li>
                <li>• <kbd>Home</kbd> - Jump to first item</li>
                <li>• <kbd>End</kbd> - Jump to last item</li>
                <li>• Type characters to jump to matching items</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">ARIA Attributes</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• <code>role="menu"</code> - Menu container</li>
                <li>• <code>role="menuitem"</code> - Individual items</li>
                <li>• <code>role="separator"</code> - Separators</li>
                <li>• <code>aria-haspopup="true"</code> - Items with submenus</li>
                <li>• <code>aria-expanded</code> - Submenu state</li>
                <li>• <code>aria-disabled</code> - Disabled items</li>
                <li>• <code>aria-checked</code> - Checkbox-style items</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Screen Reader Support</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Announces menu opening and closing</li>
                <li>• Reads item labels and shortcuts</li>
                <li>• Indicates disabled and danger states</li>
                <li>• Announces checkmarks for selected items</li>
                <li>• Navigates through submenus clearly</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Focus Management</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Automatically focuses first item when menu opens</li>
                <li>• Returns focus to trigger when menu closes</li>
                <li>• Maintains focus within menu (focus trap)</li>
                <li>• Visible focus indicators for all items</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <span>✓</span> Do
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• Keep menus concise (5-10 items maximum per level)</li>
                <li>• Group related actions together with separators</li>
                <li>• Use clear, action-oriented labels ("Delete message" not just "Delete")</li>
                <li>• Provide keyboard shortcuts for common actions</li>
                <li>• Use icons to improve scannability</li>
                <li>• Disable items that aren't applicable rather than hiding them</li>
                <li>• Use danger styling for destructive actions</li>
                <li>• Position menus to avoid screen edges</li>
                <li>• Test with keyboard and screen readers</li>
              </ul>
            </div>

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                <span>✗</span> Don't
              </h3>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                <li>• Don't create deeply nested menus (max 2-3 levels)</li>
                <li>• Don't use context menus as the only way to access features</li>
                <li>• Don't include too many items in a single menu</li>
                <li>• Don't use vague labels ("Options", "Settings")</li>
                <li>• Don't forget to handle disabled states properly</li>
                <li>• Don't ignore mobile/touch interactions</li>
                <li>• Don't override browser's native context menu for text selection</li>
                <li>• Don't forget to test edge cases (viewport boundaries)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* TypeScript Support */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">TypeScript Support</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The ContextMenu component includes full TypeScript support:
          </p>

          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
            <code>{`import { ContextMenu, MenuItem } from '@clarity-chat/react'
import type { ContextMenuProps, MenuItemType } from '@clarity-chat/react'

// Type-safe menu items
const menuItems: MenuItem[] = [
  {
    id: 'copy',
    label: 'Copy',
    icon: '📋',
    shortcut: 'Ctrl+C',
    onSelect: () => console.log('Copied')
  },
  {
    type: 'separator'
  },
  {
    id: 'submenu',
    label: 'More',
    items: [
      {
        id: 'nested',
        label: 'Nested Action',
        onSelect: () => {}
      }
    ]
  }
]

// Type-safe props
const props: ContextMenuProps = {
  items: menuItems,
  trigger: 'contextmenu',
  disabled: false,
  onOpenChange: (open: boolean) => {
    console.log('Menu is', open ? 'open' : 'closed')
  }
}

// Usage
<ContextMenu {...props}>
  <div>Right-click me</div>
</ContextMenu>`}</code>
          </pre>
        </section>

        {/* Related Components */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Related Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/reference/components/command-palette"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">CommandPalette</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Keyboard-driven command interface
              </p>
            </a>
            <a
              href="/reference/components/dropdown-menu"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">DropdownMenu</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click-triggered dropdown menus
              </p>
            </a>
            <a
              href="/reference/components/tooltip"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">Tooltip</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hover-triggered informational popups
              </p>
            </a>
            <a
              href="/reference/hooks/use-keyboard-shortcuts"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">useKeyboardShortcuts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage keyboard shortcuts
              </p>
            </a>
          </div>
        </section>

        {/* API Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">API Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Right-click/click trigger</li>
                <li>✓ Keyboard navigation</li>
                <li>✓ Nested submenus</li>
                <li>✓ Icons and shortcuts</li>
                <li>✓ Separators</li>
                <li>✓ Disabled states</li>
                <li>✓ Danger styling</li>
                <li>✓ Checkmarks</li>
                <li>✓ Auto positioning</li>
                <li>✓ Accessibility</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">Positioning</h3>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Collision detection</li>
                <li>✓ Viewport boundary handling</li>
                <li>✓ Custom alignment</li>
                <li>✓ Side preference</li>
                <li>✓ Offset control</li>
                <li>✓ Responsive</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  )
}
