import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'ContextMenu - Clarity Chat Components',
  description: 'Right-click context menu component with keyboard navigation, submenus, and custom actions.',
}

export default function ContextMenuPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ContextMenu</h1>
        <p className="docs-lead">
          Fully accessible right-click context menu with keyboard navigation, nested submenus, icons, and keyboard shortcuts.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>ContextMenu</code> component provides a powerful, accessible context menu that can be triggered by
          right-clicking or long-pressing on an element. It supports nested submenus, keyboard navigation, icons,
          disabled states, separators, and keyboard shortcut hints.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Context Menu"
          code={`import { ContextMenu } from '@clarity-chat/react'

function BasicContextMenu() {
  const [action, setAction] = React.useState('None')

  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      onSelect: () => setAction('Copied')
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📄',
      onSelect: () => setAction('Pasted')
    },
    {
      type: 'separator'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      variant: 'danger',
      onSelect: () => setAction('Deleted')
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems}>
        <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <p className="font-semibold">Right-click here</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            or long-press on mobile
          </p>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default BasicContextMenu`}
          height="400px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="ContextMenu Props"
          data={contextMenuProps}
        />
      </section>

      <section className="docs-section">
        <h2>Menu Item Types</h2>
        <ApiTable
          title="MenuItem Interface"
          data={menuItemProps}
        />
      </section>

      <section className="docs-section">
        <h2>With Icons and Shortcuts</h2>
        <LiveDemo
          title="Icons and Keyboard Shortcuts"
          code={`import { ContextMenu } from '@clarity-chat/react'

function ContextMenuWithShortcuts() {
  const [action, setAction] = React.useState('None')

  const menuItems = [
    {
      id: 'new',
      label: 'New Message',
      icon: '✉️',
      shortcut: 'Cmd+N',
      onSelect: () => setAction('New message')
    },
    {
      id: 'reply',
      label: 'Reply',
      icon: '↩️',
      shortcut: 'Cmd+R',
      onSelect: () => setAction('Reply')
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: '➡️',
      shortcut: 'Cmd+Shift+F',
      onSelect: () => setAction('Forward')
    },
    {
      type: 'separator'
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      shortcut: 'E',
      onSelect: () => setAction('Edit')
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      shortcut: 'Del',
      variant: 'danger',
      onSelect: () => setAction('Delete')
    },
    {
      type: 'separator'
    },
    {
      id: 'star',
      label: 'Star',
      icon: '⭐',
      shortcut: 'S',
      onSelect: () => setAction('Starred')
    },
    {
      id: 'pin',
      label: 'Pin',
      icon: '📌',
      shortcut: 'P',
      onSelect: () => setAction('Pinned')
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems}>
        <div className="p-8 border-2 border-dashed rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-colors">
          <div className="text-center">
            <p className="font-semibold text-lg">Message Context Menu</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Right-click to see icons and shortcuts
            </p>
          </div>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default ContextMenuWithShortcuts`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>Nested Submenus</h2>
        <LiveDemo
          title="Nested Submenus"
          code={`import { ContextMenu } from '@clarity-chat/react'

function NestedContextMenu() {
  const [action, setAction] = React.useState('None')

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      icon: '📁',
      items: [
        {
          id: 'new',
          label: 'New',
          icon: '✨',
          items: [
            { id: 'new-chat', label: 'Chat', onSelect: () => setAction('New chat') },
            { id: 'new-channel', label: 'Channel', onSelect: () => setAction('New channel') },
            { id: 'new-dm', label: 'Direct Message', onSelect: () => setAction('New DM') }
          ]
        },
        {
          id: 'open',
          label: 'Open',
          icon: '📂',
          onSelect: () => setAction('Open')
        },
        {
          type: 'separator'
        },
        {
          id: 'save',
          label: 'Save',
          icon: '💾',
          shortcut: 'Cmd+S',
          onSelect: () => setAction('Save')
        },
        {
          id: 'save-as',
          label: 'Save As...',
          shortcut: 'Cmd+Shift+S',
          onSelect: () => setAction('Save as')
        }
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      items: [
        { id: 'undo', label: 'Undo', shortcut: 'Cmd+Z', onSelect: () => setAction('Undo') },
        { id: 'redo', label: 'Redo', shortcut: 'Cmd+Y', onSelect: () => setAction('Redo') },
        { type: 'separator' },
        { id: 'cut', label: 'Cut', shortcut: 'Cmd+X', onSelect: () => setAction('Cut') },
        { id: 'copy', label: 'Copy', shortcut: 'Cmd+C', onSelect: () => setAction('Copy') },
        { id: 'paste', label: 'Paste', shortcut: 'Cmd+V', onSelect: () => setAction('Paste') }
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
            { id: 'light', label: 'Light', onSelect: () => setAction('Light theme') },
            { id: 'dark', label: 'Dark', onSelect: () => setAction('Dark theme') },
            { id: 'auto', label: 'Auto', onSelect: () => setAction('Auto theme') }
          ]
        },
        {
          id: 'zoom',
          label: 'Zoom',
          icon: '🔍',
          items: [
            { id: 'zoom-in', label: 'Zoom In', shortcut: 'Cmd++', onSelect: () => setAction('Zoom in') },
            { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Cmd+-', onSelect: () => setAction('Zoom out') },
            { id: 'reset-zoom', label: 'Reset Zoom', shortcut: 'Cmd+0', onSelect: () => setAction('Reset zoom') }
          ]
        }
      ]
    },
    {
      type: 'separator'
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      shortcut: '?',
      onSelect: () => setAction('Help')
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems}>
        <div className="p-12 border-2 border-dashed rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-colors">
          <div className="text-center">
            <p className="font-semibold text-lg">Advanced Menu</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Right-click to explore nested menus
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Use ➡️ or hover to open submenus
            </p>
          </div>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default NestedContextMenu`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>Disabled and Conditional Items</h2>
        <LiveDemo
          title="Disabled Items"
          code={`import { ContextMenu } from '@clarity-chat/react'

function ConditionalContextMenu() {
  const [hasSelection, setHasSelection] = React.useState(false)
  const [clipboardEmpty, setClipboardEmpty] = React.useState(true)
  const [action, setAction] = React.useState('None')

  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      shortcut: 'Cmd+C',
      disabled: !hasSelection,
      onSelect: () => {
        setAction('Copied')
        setClipboardEmpty(false)
      }
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: '✂️',
      shortcut: 'Cmd+X',
      disabled: !hasSelection,
      onSelect: () => {
        setAction('Cut')
        setHasSelection(false)
        setClipboardEmpty(false)
      }
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📄',
      shortcut: 'Cmd+V',
      disabled: clipboardEmpty,
      onSelect: () => {
        setAction('Pasted')
        setHasSelection(true)
      }
    },
    {
      type: 'separator'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      shortcut: 'Del',
      variant: 'danger',
      disabled: !hasSelection,
      onSelect: () => {
        setAction('Deleted')
        setHasSelection(false)
      }
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setHasSelection(!hasSelection)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {hasSelection ? 'Deselect' : 'Select'} Text
        </button>
        <button
          onClick={() => setClipboardEmpty(!clipboardEmpty)}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          {clipboardEmpty ? 'Fill' : 'Empty'} Clipboard
        </button>
      </div>

      <ContextMenu items={menuItems}>
        <div className="p-8 border-2 border-dashed rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-colors">
          <div className="text-center">
            <p className="font-semibold text-lg">Conditional Menu</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Has selection: {hasSelection ? '✅' : '❌'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clipboard: {clipboardEmpty ? 'Empty' : 'Has content'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Right-click to see conditional items
            </p>
          </div>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default ConditionalContextMenu`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Custom Trigger Position</h2>
        <LiveDemo
          title="Custom Positioning"
          code={`import { ContextMenu } from '@clarity-chat/react'

function CustomPositionMenu() {
  const [action, setAction] = React.useState('None')
  const [position, setPosition] = React.useState('auto')

  const menuItems = [
    {
      id: 'top-left',
      label: 'Position: Top Left',
      onSelect: () => {
        setPosition('top-left')
        setAction('Positioned top-left')
      }
    },
    {
      id: 'top-right',
      label: 'Position: Top Right',
      onSelect: () => {
        setPosition('top-right')
        setAction('Positioned top-right')
      }
    },
    {
      id: 'bottom-left',
      label: 'Position: Bottom Left',
      onSelect: () => {
        setPosition('bottom-left')
        setAction('Positioned bottom-left')
      }
    },
    {
      id: 'bottom-right',
      label: 'Position: Bottom Right',
      onSelect: () => {
        setPosition('bottom-right')
        setAction('Positioned bottom-right')
      }
    },
    {
      type: 'separator'
    },
    {
      id: 'auto',
      label: 'Position: Auto',
      onSelect: () => {
        setPosition('auto')
        setAction('Auto positioning')
      }
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems} position={position}>
        <div className="p-8 border-2 border-dashed rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-colors">
          <div className="text-center">
            <p className="font-semibold text-lg">Position Control</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Current: <span className="font-mono">{position}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Right-click to change menu position
            </p>
          </div>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default CustomPositionMenu`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>With Checkboxes and Radio</h2>
        <LiveDemo
          title="Checkboxes and Radio Items"
          code={`import { ContextMenu } from '@clarity-chat/react'

function SelectableContextMenu() {
  const [showImages, setShowImages] = React.useState(true)
  const [showVideos, setShowVideos] = React.useState(false)
  const [showFiles, setShowFiles] = React.useState(true)
  const [sortBy, setSortBy] = React.useState('date')
  const [action, setAction] = React.useState('None')

  const menuItems = [
    {
      id: 'show-header',
      label: 'Show Content',
      type: 'label'
    },
    {
      id: 'show-images',
      label: 'Images',
      icon: showImages ? '☑️' : '☐',
      checked: showImages,
      onSelect: () => {
        setShowImages(!showImages)
        setAction(\`Images: \${!showImages ? 'shown' : 'hidden'}\`)
      }
    },
    {
      id: 'show-videos',
      label: 'Videos',
      icon: showVideos ? '☑️' : '☐',
      checked: showVideos,
      onSelect: () => {
        setShowVideos(!showVideos)
        setAction(\`Videos: \${!showVideos ? 'shown' : 'hidden'}\`)
      }
    },
    {
      id: 'show-files',
      label: 'Files',
      icon: showFiles ? '☑️' : '☐',
      checked: showFiles,
      onSelect: () => {
        setShowFiles(!showFiles)
        setAction(\`Files: \${!showFiles ? 'shown' : 'hidden'}\`)
      }
    },
    {
      type: 'separator'
    },
    {
      id: 'sort-header',
      label: 'Sort By',
      type: 'label'
    },
    {
      id: 'sort-date',
      label: 'Date',
      icon: sortBy === 'date' ? '🔘' : '⭕',
      checked: sortBy === 'date',
      onSelect: () => {
        setSortBy('date')
        setAction('Sort by date')
      }
    },
    {
      id: 'sort-name',
      label: 'Name',
      icon: sortBy === 'name' ? '🔘' : '⭕',
      checked: sortBy === 'name',
      onSelect: () => {
        setSortBy('name')
        setAction('Sort by name')
      }
    },
    {
      id: 'sort-size',
      label: 'Size',
      icon: sortBy === 'size' ? '🔘' : '⭕',
      checked: sortBy === 'size',
      onSelect: () => {
        setSortBy('size')
        setAction('Sort by size')
      }
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems}>
        <div className="p-8 border-2 border-dashed rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 hover:from-indigo-100 hover:to-violet-100 dark:hover:from-indigo-900/30 dark:hover:to-violet-900/30 transition-colors">
          <div className="text-center">
            <p className="font-semibold text-lg">Selectable Items</p>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-1">
              <p>Images: {showImages ? '✅' : '❌'} | Videos: {showVideos ? '✅' : '❌'} | Files: {showFiles ? '✅' : '❌'}</p>
              <p>Sort by: <span className="font-mono">{sortBy}</span></p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              Right-click to toggle options
            </p>
          </div>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default SelectableContextMenu`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Chat Message Context Menu</h2>
        <p>
          A complete example of a context menu for chat messages with all features.
        </p>
        <LiveDemo
          title="Chat Message Menu"
          code={`import { ContextMenu } from '@clarity-chat/react'

function ChatMessageContextMenu() {
  const [action, setAction] = React.useState('None')
  const [isStarred, setIsStarred] = React.useState(false)
  const [isPinned, setIsPinned] = React.useState(false)

  const menuItems = [
    {
      id: 'reply',
      label: 'Reply',
      icon: '↩️',
      shortcut: 'R',
      onSelect: () => setAction('Reply')
    },
    {
      id: 'react',
      label: 'Add Reaction',
      icon: '😀',
      items: [
        { id: 'thumbs-up', label: '👍 Thumbs Up', onSelect: () => setAction('Reacted 👍') },
        { id: 'heart', label: '❤️ Heart', onSelect: () => setAction('Reacted ❤️') },
        { id: 'laugh', label: '😂 Laugh', onSelect: () => setAction('Reacted 😂') },
        { id: 'celebrate', label: '🎉 Celebrate', onSelect: () => setAction('Reacted 🎉') },
        { type: 'separator' },
        { id: 'more', label: 'More reactions...', onSelect: () => setAction('Show reactions') }
      ]
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: '➡️',
      shortcut: 'F',
      onSelect: () => setAction('Forward')
    },
    {
      type: 'separator'
    },
    {
      id: 'copy',
      label: 'Copy Text',
      icon: '📋',
      shortcut: 'Cmd+C',
      onSelect: () => setAction('Copied text')
    },
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: '🔗',
      onSelect: () => setAction('Copied link')
    },
    {
      type: 'separator'
    },
    {
      id: 'star',
      label: isStarred ? 'Unstar' : 'Star',
      icon: isStarred ? '⭐' : '☆',
      shortcut: 'S',
      onSelect: () => {
        setIsStarred(!isStarred)
        setAction(isStarred ? 'Unstarred' : 'Starred')
      }
    },
    {
      id: 'pin',
      label: isPinned ? 'Unpin' : 'Pin',
      icon: isPinned ? '📌' : '📍',
      shortcut: 'P',
      onSelect: () => {
        setIsPinned(!isPinned)
        setAction(isPinned ? 'Unpinned' : 'Pinned')
      }
    },
    {
      type: 'separator'
    },
    {
      id: 'edit',
      label: 'Edit Message',
      icon: '✏️',
      shortcut: 'E',
      onSelect: () => setAction('Edit')
    },
    {
      id: 'delete',
      label: 'Delete Message',
      icon: '🗑️',
      shortcut: 'Del',
      variant: 'danger',
      onSelect: () => setAction('Delete')
    },
    {
      type: 'separator'
    },
    {
      id: 'report',
      label: 'Report',
      icon: '⚠️',
      variant: 'danger',
      items: [
        { id: 'spam', label: 'Spam', onSelect: () => setAction('Reported as spam') },
        { id: 'abuse', label: 'Abusive', onSelect: () => setAction('Reported as abusive') },
        { id: 'other', label: 'Other...', onSelect: () => setAction('Report other') }
      ]
    }
  ]

  return (
    <div className="p-8">
      <ContextMenu items={menuItems}>
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">John Doe</span>
                <span className="text-xs text-gray-500">2:30 PM</span>
                {isStarred && <span>⭐</span>}
                {isPinned && <span>📌</span>}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Hey team! Just wanted to share the latest updates on the project. 
                Everything is on track for the deadline.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Right-click to see message options
          </p>
        </div>
      </ContextMenu>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>
    </div>
  )
}

export default ChatMessageContextMenu`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Dynamic Menu Items</h3>
        <p>
          Generate menu items dynamically based on application state:
        </p>
        <pre><code>{`function DynamicContextMenu() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const menuItems = React.useMemo(() => {
    const items = [
      { id: 'header', label: 'Mention User', type: 'label' }
    ]

    users.forEach(user => {
      items.push({
        id: \`mention-\${user.id}\`,
        label: user.name,
        icon: user.avatar,
        onSelect: () => mentionUser(user)
      })
    })

    return items
  }, [users])

  return <ContextMenu items={menuItems}>{children}</ContextMenu>
}`}</code></pre>

        <h3>Multiple Context Menus</h3>
        <p>
          Handle different context menus in the same component:
        </p>
        <pre><code>{`function MultipleContextMenus() {
  const messageMenu = [
    { id: 'reply', label: 'Reply', onSelect: handleReply },
    { id: 'delete', label: 'Delete', variant: 'danger', onSelect: handleDelete }
  ]

  const userMenu = [
    { id: 'profile', label: 'View Profile', onSelect: viewProfile },
    { id: 'dm', label: 'Send Message', onSelect: sendDM },
    { id: 'block', label: 'Block', variant: 'danger', onSelect: blockUser }
  ]

  return (
    <div>
      <ContextMenu items={messageMenu}>
        <Message />
      </ContextMenu>
      
      <ContextMenu items={userMenu}>
        <UserAvatar />
      </ContextMenu>
    </div>
  )
}`}</code></pre>

        <h3>Custom Menu Rendering</h3>
        <p>
          Customize the appearance of menu items:
        </p>
        <pre><code>{`function CustomRenderedMenu() {
  const menuItems = [
    {
      id: 'user',
      label: 'User Info',
      render: () => (
        <div className="flex items-center gap-3 p-2">
          <img src={avatar} className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-gray-500">{status}</div>
          </div>
        </div>
      )
    },
    { type: 'separator' },
    { id: 'logout', label: 'Logout', variant: 'danger', onSelect: logout }
  ]

  return <ContextMenu items={menuItems}>{children}</ContextMenu>
}`}</code></pre>

        <h3>Context Menu with State</h3>
        <p>
          Track which item triggered the menu:
        </p>
        <pre><code>{`function MessagesWithContextMenu() {
  const [activeMessage, setActiveMessage] = useState(null)

  const getMenuItems = (message) => [
    { id: 'edit', label: 'Edit', onSelect: () => editMessage(message) },
    { id: 'delete', label: 'Delete', onSelect: () => deleteMessage(message) }
  ]

  return messages.map(message => (
    <ContextMenu
      key={message.id}
      items={getMenuItems(message)}
      onOpen={() => setActiveMessage(message)}
      onClose={() => setActiveMessage(null)}
    >
      <Message data={message} isActive={activeMessage?.id === message.id} />
    </ContextMenu>
  ))
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Keyboard Navigation</h2>
        
        <Callout type="info" title="Keyboard Shortcuts">
          <ul>
            <li><kbd>↑</kbd> <kbd>↓</kbd> - Navigate menu items</li>
            <li><kbd>→</kbd> - Open submenu</li>
            <li><kbd>←</kbd> - Close submenu</li>
            <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Select item</li>
            <li><kbd>Esc</kbd> - Close menu</li>
            <li><kbd>Home</kbd> - First item</li>
            <li><kbd>End</kbd> - Last item</li>
            <li><strong>Type to search</strong> - Jump to matching item</li>
          </ul>
        </Callout>

        <h3>Type-ahead Search</h3>
        <p>
          Quickly find menu items by typing:
        </p>
        <ul>
          <li>Type first letter to jump to matching items</li>
          <li>Continue typing to refine search</li>
          <li>Search resets after 500ms of inactivity</li>
          <li>Cycles through all matching items</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Mobile Support</h2>
        
        <h3>Long Press Trigger</h3>
        <p>
          On mobile devices, context menus are triggered by long-pressing (default 500ms):
        </p>
        <pre><code>{`<ContextMenu
  items={menuItems}
  longPressDuration={500} // milliseconds
  hapticFeedback={true}   // vibration on trigger
>
  <MobileItem />
</ContextMenu>`}</code></pre>

        <h3>Touch-Friendly Sizing</h3>
        <p>
          Menu items automatically increase in size on touch devices for better accessibility.
        </p>

        <h3>Swipe to Dismiss</h3>
        <p>
          Swipe down on the menu to close it on mobile devices.
        </p>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        
        <Callout type="tip" title="Keep Menus Concise">
          Limit context menus to 5-10 top-level items. Use submenus to organize related actions.
        </Callout>

        <Callout type="warning" title="Don't Hide Essential Actions">
          Important actions should also be available through visible buttons or keyboard shortcuts,
          not hidden in context menus alone.
        </Callout>

        <h3>Menu Organization</h3>
        <ul>
          <li>Group related actions together</li>
          <li>Use separators to divide groups</li>
          <li>Place destructive actions (delete) at the bottom</li>
          <li>Show keyboard shortcuts when available</li>
          <li>Use icons for visual scanning</li>
        </ul>

        <h3>Disabled States</h3>
        <ul>
          <li>Show disabled items (don't hide them)</li>
          <li>Provide tooltips explaining why items are disabled</li>
          <li>Use muted colors for disabled items</li>
        </ul>

        <h3>Submenu Guidelines</h3>
        <ul>
          <li>Limit nesting to 2-3 levels maximum</li>
          <li>Use submenus for 5+ related items</li>
          <li>Add visual indicators (→) for items with submenus</li>
          <li>Keep submenu delay short (200-300ms)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        
        <h3>ARIA Attributes</h3>
        <p>
          The ContextMenu automatically includes appropriate ARIA attributes:
        </p>
        <ul>
          <li><code>role="menu"</code> on the menu container</li>
          <li><code>role="menuitem"</code> on clickable items</li>
          <li><code>role="separator"</code> on dividers</li>
          <li><code>aria-haspopup</code> for items with submenus</li>
          <li><code>aria-disabled</code> for disabled items</li>
          <li><code>aria-checked</code> for checkbox/radio items</li>
        </ul>

        <h3>Focus Management</h3>
        <ul>
          <li>Focus automatically moves to first item when menu opens</li>
          <li>Focus is trapped within the menu</li>
          <li>Focus returns to trigger element when menu closes</li>
          <li>Submenus receive focus when opened</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Menu structure is announced properly</li>
          <li>Disabled items are announced as "disabled"</li>
          <li>Submenus are announced as "has submenu"</li>
          <li>Keyboard shortcuts are included in announcements</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Styling</h2>
        
        <h3>CSS Variables</h3>
        <pre><code>{`.context-menu {
  --menu-bg: var(--color-surface);
  --menu-border: var(--color-border);
  --menu-shadow: var(--shadow-lg);
  --menu-radius: var(--radius-md);
  --item-hover-bg: var(--color-surface-hover);
  --item-active-bg: var(--color-primary);
  --item-disabled-opacity: 0.5;
  --separator-color: var(--color-border);
}`}</code></pre>

        <h3>Custom Styling</h3>
        <pre><code>{`<ContextMenu
  items={menuItems}
  className="custom-menu"
  itemClassName="custom-menu-item"
  styles={{
    menu: {
      backgroundColor: 'var(--custom-bg)',
      borderRadius: '12px'
    },
    item: {
      padding: '12px 16px'
    }
  }}
>
  {children}
</ContextMenu>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { ContextMenu, MenuItem } from '@clarity-chat/react'

interface MenuItem {
  id: string
  label: string
  type?: 'item' | 'separator' | 'label'
  icon?: React.ReactNode | string
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  variant?: 'default' | 'danger'
  items?: MenuItem[]
  onSelect?: () => void
  render?: () => React.ReactNode
}

interface ContextMenuProps {
  items: MenuItem[]
  children: React.ReactNode
  position?: 'auto' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  offset?: { x: number; y: number }
  disabled?: boolean
  longPressDuration?: number
  hapticFeedback?: boolean
  closeOnSelect?: boolean
  className?: string
  itemClassName?: string
  styles?: {
    menu?: React.CSSProperties
    item?: React.CSSProperties
  }
  onOpen?: () => void
  onClose?: () => void
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-keyboard-shortcuts" className="docs-card">
            <h3>useKeyboardShortcuts</h3>
            <p>Keyboard shortcut management</p>
          </a>
          <a href="/reference/components/command-palette" className="docs-card">
            <h3>CommandPalette</h3>
            <p>Keyboard-driven command interface</p>
          </a>
          <a href="/reference/components/dropdown" className="docs-card">
            <h3>Dropdown</h3>
            <p>Click-triggered dropdown menus</p>
          </a>
          <a href="/learn/accessibility" className="docs-card">
            <h3>Accessibility Guide</h3>
            <p>Building accessible interfaces</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const contextMenuProps = [
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
    description: 'Element that triggers the context menu on right-click'
  },
  {
    name: 'position',
    type: "'auto' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    required: false,
    default: "'auto'",
    description: 'Menu positioning relative to cursor. Auto adjusts based on viewport.'
  },
  {
    name: 'offset',
    type: '{ x: number; y: number }',
    required: false,
    default: '{ x: 0, y: 0 }',
    description: 'Pixel offset from cursor position'
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Disable context menu trigger'
  },
  {
    name: 'longPressDuration',
    type: 'number',
    required: false,
    default: '500',
    description: 'Duration in milliseconds for long press on mobile (ms)'
  },
  {
    name: 'hapticFeedback',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Enable haptic feedback on mobile when menu opens'
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Close menu after selecting an item'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Custom CSS class for menu container'
  },
  {
    name: 'itemClassName',
    type: 'string',
    required: false,
    description: 'Custom CSS class for menu items'
  },
  {
    name: 'styles',
    type: '{ menu?: CSSProperties; item?: CSSProperties }',
    required: false,
    description: 'Inline styles for menu and items'
  },
  {
    name: 'onOpen',
    type: '() => void',
    required: false,
    description: 'Callback when menu opens'
  },
  {
    name: 'onClose',
    type: '() => void',
    required: false,
    description: 'Callback when menu closes'
  }
]

const menuItemProps = [
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
    type: "'item' | 'separator' | 'label'",
    required: false,
    default: "'item'",
    description: 'Type of menu item. "separator" for dividers, "label" for non-interactive headers.'
  },
  {
    name: 'icon',
    type: 'React.ReactNode | string',
    required: false,
    description: 'Icon to display before label (emoji string or React component)'
  },
  {
    name: 'shortcut',
    type: 'string',
    required: false,
    description: 'Keyboard shortcut hint (e.g., "Cmd+K")'
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Disable the menu item'
  },
  {
    name: 'checked',
    type: 'boolean',
    required: false,
    description: 'Checkbox/radio checked state'
  },
  {
    name: 'variant',
    type: "'default' | 'danger'",
    required: false,
    default: "'default'",
    description: 'Visual variant. "danger" for destructive actions (red text).'
  },
  {
    name: 'items',
    type: 'MenuItem[]',
    required: false,
    description: 'Submenu items for nested menus'
  },
  {
    name: 'onSelect',
    type: '() => void',
    required: false,
    description: 'Callback when item is selected'
  },
  {
    name: 'render',
    type: '() => React.ReactNode',
    required: false,
    description: 'Custom render function for complete control over item appearance'
  }
]
