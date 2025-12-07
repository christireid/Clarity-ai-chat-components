import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'ContextMenu - Clarity Chat Components',
    description: 'Right-click context menu component with keyboard navigation, submenus, and custom actions.',
};
export default function ContextMenuPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "ContextMenu" }), _jsx("p", { className: "docs-lead", children: "Fully accessible right-click context menu with keyboard navigation, nested submenus, icons, and keyboard shortcuts." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "ContextMenu" }), " component provides a powerful, accessible context menu that can be triggered by right-clicking or long-pressing on an element. It supports nested submenus, keyboard navigation, icons, disabled states, separators, and keyboard shortcut hints."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function BasicContextMenu() {
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

render(<BasicContextMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "ContextMenu Props", data: contextMenuProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Menu Item Types" }), _jsx(ApiTable, { title: "MenuItem Interface", data: menuItemProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Icons and Shortcuts" }), _jsx(CodePlayground, { initialCode: `function ContextMenuWithShortcuts() {
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

render(<ContextMenuWithShortcuts />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Nested Submenus" }), _jsx(CodePlayground, { initialCode: `function NestedContextMenu() {
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

render(<NestedContextMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Disabled and Conditional Items" }), _jsx(CodePlayground, { initialCode: `function ConditionalContextMenu() {
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

render(<ConditionalContextMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Trigger Position" }), _jsx(CodePlayground, { initialCode: `function CustomPositionMenu() {
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

render(<CustomPositionMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Checkboxes and Radio" }), _jsx(CodePlayground, { initialCode: `function SelectableContextMenu() {
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

render(<SelectableContextMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Chat Message Context Menu" }), _jsx("p", { children: "A complete example of a context menu for chat messages with all features." }), _jsx(CodePlayground, { initialCode: `function ChatMessageContextMenu() {
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

render(<ChatMessageContextMenu />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Dynamic Menu Items" }), _jsx("p", { children: "Generate menu items dynamically based on application state:" }), _jsx("pre", { children: _jsx("code", { children: `function DynamicContextMenu() {
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
}` }) }), _jsx("h3", { children: "Multiple Context Menus" }), _jsx("p", { children: "Handle different context menus in the same component:" }), _jsx("pre", { children: _jsx("code", { children: `function MultipleContextMenus() {
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
}` }) }), _jsx("h3", { children: "Custom Menu Rendering" }), _jsx("p", { children: "Customize the appearance of menu items:" }), _jsx("pre", { children: _jsx("code", { children: `function CustomRenderedMenu() {
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
}` }) }), _jsx("h3", { children: "Context Menu with State" }), _jsx("p", { children: "Track which item triggered the menu:" }), _jsx("pre", { children: _jsx("code", { children: `function MessagesWithContextMenu() {
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Keyboard Navigation" }), _jsx(Callout, { type: "info", title: "Keyboard Shortcuts", children: _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "\u2191" }), " ", _jsx("kbd", { children: "\u2193" }), " - Navigate menu items"] }), _jsxs("li", { children: [_jsx("kbd", { children: "\u2192" }), " - Open submenu"] }), _jsxs("li", { children: [_jsx("kbd", { children: "\u2190" }), " - Close submenu"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Enter" }), " / ", _jsx("kbd", { children: "Space" }), " - Select item"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Esc" }), " - Close menu"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Home" }), " - First item"] }), _jsxs("li", { children: [_jsx("kbd", { children: "End" }), " - Last item"] }), _jsxs("li", { children: [_jsx("strong", { children: "Type to search" }), " - Jump to matching item"] })] }) }), _jsx("h3", { children: "Type-ahead Search" }), _jsx("p", { children: "Quickly find menu items by typing:" }), _jsxs("ul", { children: [_jsx("li", { children: "Type first letter to jump to matching items" }), _jsx("li", { children: "Continue typing to refine search" }), _jsx("li", { children: "Search resets after 500ms of inactivity" }), _jsx("li", { children: "Cycles through all matching items" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Mobile Support" }), _jsx("h3", { children: "Long Press Trigger" }), _jsx("p", { children: "On mobile devices, context menus are triggered by long-pressing (default 500ms):" }), _jsx("pre", { children: _jsx("code", { children: `<ContextMenu
  items={menuItems}
  longPressDuration={500} // milliseconds
  hapticFeedback={true}   // vibration on trigger
>
  <MobileItem />
</ContextMenu>` }) }), _jsx("h3", { children: "Touch-Friendly Sizing" }), _jsx("p", { children: "Menu items automatically increase in size on touch devices for better accessibility." }), _jsx("h3", { children: "Swipe to Dismiss" }), _jsx("p", { children: "Swipe down on the menu to close it on mobile devices." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "tip", title: "Keep Menus Concise", children: "Limit context menus to 5-10 top-level items. Use submenus to organize related actions." }), _jsx(Callout, { type: "warning", title: "Don't Hide Essential Actions", children: "Important actions should also be available through visible buttons or keyboard shortcuts, not hidden in context menus alone." }), _jsx("h3", { children: "Menu Organization" }), _jsxs("ul", { children: [_jsx("li", { children: "Group related actions together" }), _jsx("li", { children: "Use separators to divide groups" }), _jsx("li", { children: "Place destructive actions (delete) at the bottom" }), _jsx("li", { children: "Show keyboard shortcuts when available" }), _jsx("li", { children: "Use icons for visual scanning" })] }), _jsx("h3", { children: "Disabled States" }), _jsxs("ul", { children: [_jsx("li", { children: "Show disabled items (don't hide them)" }), _jsx("li", { children: "Provide tooltips explaining why items are disabled" }), _jsx("li", { children: "Use muted colors for disabled items" })] }), _jsx("h3", { children: "Submenu Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Limit nesting to 2-3 levels maximum" }), _jsx("li", { children: "Use submenus for 5+ related items" }), _jsx("li", { children: "Add visual indicators (\u2192) for items with submenus" }), _jsx("li", { children: "Keep submenu delay short (200-300ms)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx("h3", { children: "ARIA Attributes" }), _jsx("p", { children: "The ContextMenu automatically includes appropriate ARIA attributes:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "role=\"menu\"" }), " on the menu container"] }), _jsxs("li", { children: [_jsx("code", { children: "role=\"menuitem\"" }), " on clickable items"] }), _jsxs("li", { children: [_jsx("code", { children: "role=\"separator\"" }), " on dividers"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-haspopup" }), " for items with submenus"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-disabled" }), " for disabled items"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-checked" }), " for checkbox/radio items"] })] }), _jsx("h3", { children: "Focus Management" }), _jsxs("ul", { children: [_jsx("li", { children: "Focus automatically moves to first item when menu opens" }), _jsx("li", { children: "Focus is trapped within the menu" }), _jsx("li", { children: "Focus returns to trigger element when menu closes" }), _jsx("li", { children: "Submenus receive focus when opened" })] }), _jsx("h3", { children: "Screen Reader Support" }), _jsxs("ul", { children: [_jsx("li", { children: "Menu structure is announced properly" }), _jsx("li", { children: "Disabled items are announced as \"disabled\"" }), _jsx("li", { children: "Submenus are announced as \"has submenu\"" }), _jsx("li", { children: "Keyboard shortcuts are included in announcements" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Styling" }), _jsx("h3", { children: "CSS Variables" }), _jsx("pre", { children: _jsx("code", { children: `.context-menu {
  --menu-bg: var(--color-surface);
  --menu-border: var(--color-border);
  --menu-shadow: var(--shadow-lg);
  --menu-radius: var(--radius-md);
  --item-hover-bg: var(--color-surface-hover);
  --item-active-bg: var(--color-primary);
  --item-disabled-opacity: 0.5;
  --separator-color: var(--color-border);
}` }) }), _jsx("h3", { children: "Custom Styling" }), _jsx("pre", { children: _jsx("code", { children: `<ContextMenu
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
</ContextMenu>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { ContextMenu, MenuItem } from '@clarity-chat/react'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/hooks/use-keyboard-shortcuts", className: "docs-card", children: [_jsx("h3", { children: "useKeyboardShortcuts" }), _jsx("p", { children: "Keyboard shortcut management" })] }), _jsxs("a", { href: "/reference/components/command-palette", className: "docs-card", children: [_jsx("h3", { children: "CommandPalette" }), _jsx("p", { children: "Keyboard-driven command interface" })] }), _jsxs("a", { href: "/reference/components/dropdown", className: "docs-card", children: [_jsx("h3", { children: "Dropdown" }), _jsx("p", { children: "Click-triggered dropdown menus" })] }), _jsxs("a", { href: "/learn/accessibility", className: "docs-card", children: [_jsx("h3", { children: "Accessibility Guide" }), _jsx("p", { children: "Building accessible interfaces" })] })] })] })] }));
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
];
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
];
//# sourceMappingURL=page.js.map