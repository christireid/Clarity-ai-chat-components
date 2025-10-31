import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'useKeyboardShortcuts - Clarity Chat Components',
  description: 'Hook for managing keyboard shortcuts in your chat application with support for combinations, sequences, and scopes.',
}

export default function UseKeyboardShortcutsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useKeyboardShortcuts</h1>
        <p className="docs-lead">
          Manage keyboard shortcuts with support for key combinations, sequences, and scoped contexts.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useKeyboardShortcuts</code> hook provides a declarative way to handle keyboard shortcuts
          in your chat application. It supports single keys, key combinations (like Cmd+K), key sequences
          (like g then i), and scoped contexts to prevent conflicts.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Keyboard Shortcuts"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithShortcuts() {
  const [messages, setMessages] = React.useState([])
  const [status, setStatus] = React.useState('Ready')

  useKeyboardShortcuts({
    'cmd+k': () => {
      setStatus('Search triggered')
    },
    'cmd+n': () => {
      setStatus('New message created')
    },
    'esc': () => {
      setStatus('Escaped')
    },
    'ctrl+shift+d': () => {
      setStatus('Debug panel opened')
    }
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Keyboard Shortcuts Demo</h3>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
        <p className="text-sm font-mono">Status: {status}</p>
      </div>
      <div className="space-y-2 text-sm">
        <div><kbd>Cmd+K</kbd> - Open search</div>
        <div><kbd>Cmd+N</kbd> - New message</div>
        <div><kbd>Esc</kbd> - Escape</div>
        <div><kbd>Ctrl+Shift+D</kbd> - Debug panel</div>
      </div>
    </div>
  )
}

export default ChatWithShortcuts`}
          height="400px"
        />
      </section>

      <section className="docs-section">
        <h2>Parameters</h2>
        <ApiTable
          title="useKeyboardShortcuts(config)"
          data={shortcutConfig}
        />
      </section>

      <section className="docs-section">
        <h2>Return Value</h2>
        <ApiTable
          title="Return Value"
          data={returnValue}
        />
      </section>

      <section className="docs-section">
        <h2>Key Sequences</h2>
        <p>
          Support for multi-key sequences like Vim or Gmail shortcuts. Define sequences with the <code>then</code> keyword.
        </p>
        <LiveDemo
          title="Key Sequences"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithSequences() {
  const [action, setAction] = React.useState('None')

  useKeyboardShortcuts({
    'g then i': () => {
      setAction('Go to inbox')
    },
    'g then s': () => {
      setAction('Go to sent')
    },
    'g then d': () => {
      setAction('Go to drafts')
    },
    '? then ?': () => {
      setAction('Show help')
    }
  }, {
    sequenceTimeout: 1000 // 1 second timeout between keys
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Vim-style Sequences</h3>
      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
        <p className="text-sm font-mono">Last Action: {action}</p>
      </div>
      <div className="space-y-2 text-sm">
        <div><kbd>g</kbd> then <kbd>i</kbd> - Go to inbox</div>
        <div><kbd>g</kbd> then <kbd>s</kbd> - Go to sent</div>
        <div><kbd>g</kbd> then <kbd>d</kbd> - Go to drafts</div>
        <div><kbd>?</kbd> then <kbd>?</kbd> - Show help</div>
      </div>
    </div>
  )
}

export default ChatWithSequences`}
          height="400px"
        />
      </section>

      <section className="docs-section">
        <h2>Scoped Shortcuts</h2>
        <p>
          Use scopes to enable/disable shortcuts based on context. This prevents conflicts when the same
          key has different meanings in different parts of your app.
        </p>
        <LiveDemo
          title="Scoped Shortcuts"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithScopes() {
  const [mode, setMode] = React.useState('normal')
  const [status, setStatus] = React.useState('Normal mode')

  // Global shortcuts (always active)
  useKeyboardShortcuts({
    'cmd+k': () => setStatus('Search (global)'),
    'esc': () => {
      setMode('normal')
      setStatus('Exited to normal mode')
    }
  })

  // Normal mode shortcuts
  useKeyboardShortcuts({
    'i': () => {
      setMode('insert')
      setStatus('Entered insert mode')
    },
    'v': () => {
      setMode('visual')
      setStatus('Entered visual mode')
    }
  }, {
    enabled: mode === 'normal',
    scoped: true
  })

  // Insert mode shortcuts
  useKeyboardShortcuts({
    'cmd+s': () => setStatus('Saved (insert mode)')
  }, {
    enabled: mode === 'insert',
    scoped: true
  })

  // Visual mode shortcuts
  useKeyboardShortcuts({
    'd': () => setStatus('Deleted selection (visual mode)'),
    'y': () => setStatus('Yanked selection (visual mode)')
  }, {
    enabled: mode === 'visual',
    scoped: true
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Modal Editing (Vim-style)</h3>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-medium">Current Mode:</span>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded font-mono text-sm">
          {mode}
        </span>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
        <p className="text-sm font-mono">{status}</p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-sm mb-1">Global (always active):</p>
          <div className="text-sm space-y-1 ml-4">
            <div><kbd>Cmd+K</kbd> - Search</div>
            <div><kbd>Esc</kbd> - Exit to normal mode</div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Normal mode:</p>
          <div className="text-sm space-y-1 ml-4">
            <div><kbd>i</kbd> - Enter insert mode</div>
            <div><kbd>v</kbd> - Enter visual mode</div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Insert mode:</p>
          <div className="text-sm space-y-1 ml-4">
            <div><kbd>Cmd+S</kbd> - Save</div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Visual mode:</p>
          <div className="text-sm space-y-1 ml-4">
            <div><kbd>d</kbd> - Delete selection</div>
            <div><kbd>y</kbd> - Yank selection</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWithScopes`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Preventing Default Behavior</h2>
        <p>
          Control whether the browser's default behavior should be prevented for each shortcut.
        </p>
        <LiveDemo
          title="Prevent Default"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithPreventDefault() {
  const [log, setLog] = React.useState([])

  const addLog = (msg) => {
    setLog(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] \${msg}\`].slice(-5))
  }

  useKeyboardShortcuts({
    // Prevent browser's print dialog
    'cmd+p': (e) => {
      addLog('Print prevented, showing custom print dialog')
      return false // preventDefault
    },
    // Prevent browser's save dialog
    'cmd+s': (e) => {
      addLog('Save prevented, saving to cloud instead')
      return false
    },
    // Allow default behavior (browser bookmark)
    'cmd+d': (e) => {
      addLog('Bookmark shortcut (default allowed)')
      return true // allow default
    },
    // Custom action without preventing default
    'cmd+f': (e) => {
      addLog('Find action (default allowed)')
      // undefined = don't prevent default
    }
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Prevent Default Control</h3>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
        <p className="text-xs font-semibold mb-2">Event Log:</p>
        {log.length === 0 ? (
          <p className="text-xs text-gray-500">Try the shortcuts below...</p>
        ) : (
          <div className="space-y-1">
            {log.map((entry, i) => (
              <div key={i} className="text-xs font-mono">{entry}</div>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div><kbd>Cmd+P</kbd> - Custom print (prevents default)</div>
        <div><kbd>Cmd+S</kbd> - Cloud save (prevents default)</div>
        <div><kbd>Cmd+D</kbd> - Bookmark (allows default)</div>
        <div><kbd>Cmd+F</kbd> - Find (allows default)</div>
      </div>
    </div>
  )
}

export default ChatWithPreventDefault`}
          height="450px"
        />
      </section>

      <section className="docs-section">
        <h2>Dynamic Shortcuts</h2>
        <p>
          Enable or disable shortcuts dynamically based on application state.
        </p>
        <LiveDemo
          title="Dynamic Shortcuts"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithDynamicShortcuts() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [message, setMessage] = React.useState('')

  // Only active when NOT editing
  useKeyboardShortcuts({
    'e': () => setIsEditing(true),
    'n': () => setMessage('New message'),
    'd': () => setMessage('Deleted')
  }, {
    enabled: !isEditing,
    preventDefault: true
  })

  // Only active when editing
  useKeyboardShortcuts({
    'cmd+enter': () => {
      setIsEditing(false)
      setMessage(\`Sent: \${message}\`)
    },
    'esc': () => {
      setIsEditing(false)
      setMessage('Cancelled')
    }
  }, {
    enabled: isEditing
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Dynamic Shortcuts</h3>
      
      <div className="flex items-center gap-3">
        <span className="text-sm">Status:</span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          {isEditing ? '✏️ Editing' : '👀 Viewing'}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-sm space-y-1">
            <div><kbd>Cmd+Enter</kbd> - Send message</div>
            <div><kbd>Esc</kbd> - Cancel editing</div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <p className="text-sm">{message || 'No message'}</p>
          </div>
          <div className="text-sm space-y-1">
            <div><kbd>e</kbd> - Start editing</div>
            <div><kbd>n</kbd> - New message</div>
            <div><kbd>d</kbd> - Delete</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWithDynamicShortcuts`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>Input Field Handling</h2>
        <p>
          By default, shortcuts are disabled when typing in input fields. You can customize this behavior.
        </p>
        <LiveDemo
          title="Input Field Handling"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithInputHandling() {
  const [message, setMessage] = React.useState('')
  const [log, setLog] = React.useState([])

  const addLog = (msg) => {
    setLog(prev => [...prev, msg].slice(-3))
  }

  // Disabled in input fields (default)
  useKeyboardShortcuts({
    's': () => addLog('S pressed (outside input)'),
  }, {
    enableInInput: false // default
  })

  // Enabled even in input fields
  useKeyboardShortcuts({
    'cmd+k': () => addLog('Search triggered (works in input)'),
    'esc': () => {
      addLog('Escaped')
      setMessage('')
    }
  }, {
    enableInInput: true
  })

  // Only modifiers work in input
  useKeyboardShortcuts({
    'cmd+b': () => addLog('Bold (modifier in input)'),
    'cmd+i': () => addLog('Italic (modifier in input)')
  }, {
    enableInInput: 'modifiers-only' // custom option
  })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Input Field Handling</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Message Input:
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here and try shortcuts..."
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
          <p className="text-xs font-semibold mb-2">Shortcut Log:</p>
          {log.length === 0 ? (
            <p className="text-xs text-gray-500">Try shortcuts...</p>
          ) : (
            <div className="space-y-1">
              {log.map((entry, i) => (
                <div key={i} className="text-xs font-mono">{entry}</div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm space-y-1">
          <div><kbd>s</kbd> - Only works outside input</div>
          <div><kbd>Cmd+K</kbd> - Works everywhere</div>
          <div><kbd>Esc</kbd> - Clear input (works everywhere)</div>
          <div><kbd>Cmd+B</kbd> / <kbd>Cmd+I</kbd> - Works in input (modifiers)</div>
        </div>
      </div>
    </div>
  )
}

export default ChatWithInputHandling`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Shortcut Help Panel</h2>
        <p>
          Build an interactive help panel that displays all available shortcuts.
        </p>
        <LiveDemo
          title="Shortcut Help Panel"
          code={`import { useKeyboardShortcuts } from '@clarity-chat/react'

function ChatWithHelpPanel() {
  const [showHelp, setShowHelp] = React.useState(false)
  const [action, setAction] = React.useState('None')

  const shortcuts = [
    { key: '?', description: 'Show/hide this help', category: 'General' },
    { key: 'cmd+k', description: 'Search messages', category: 'Navigation' },
    { key: 'cmd+n', description: 'New message', category: 'Actions' },
    { key: 'cmd+/', description: 'Toggle command palette', category: 'Actions' },
    { key: 'j', description: 'Next message', category: 'Navigation' },
    { key: 'k', description: 'Previous message', category: 'Navigation' },
    { key: 'r', description: 'Reply', category: 'Actions' },
    { key: 'e', description: 'Edit', category: 'Actions' },
    { key: 'd', description: 'Delete', category: 'Actions' },
    { key: 'esc', description: 'Close dialog', category: 'General' }
  ]

  useKeyboardShortcuts({
    '?': () => setShowHelp(!showHelp),
    'cmd+k': () => setAction('Search'),
    'cmd+n': () => setAction('New message'),
    'cmd+/': () => setAction('Command palette'),
    'j': () => setAction('Next message'),
    'k': () => setAction('Previous message'),
    'r': () => setAction('Reply'),
    'e': () => setAction('Edit'),
    'd': () => setAction('Delete'),
    'esc': () => {
      setShowHelp(false)
      setAction('Closed')
    }
  })

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = []
    acc[shortcut.category].push(shortcut)
    return acc
  }, {})

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Keyboard Shortcuts</h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {showHelp ? 'Hide' : 'Show'} Help
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
        <p className="text-sm">Last Action: <span className="font-mono">{action}</span></p>
      </div>

      {showHelp && (
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Keyboard Shortcuts</h4>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {category}
              </h5>
              <div className="space-y-2">
                {items.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Press <kbd>?</kbd> to toggle help panel
      </div>
    </div>
  )
}

export default ChatWithHelpPanel`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>
        
        <h3>Chord Progressions</h3>
        <p>
          Chain multiple shortcuts together to create complex interactions.
        </p>
        <pre><code>{`// Emacs-style chord progressions
useKeyboardShortcuts({
  'ctrl+x then ctrl+c': () => quit(),
  'ctrl+x then ctrl+s': () => save(),
  'ctrl+x then ctrl+f': () => openFile(),
  'ctrl+x then ctrl+b': () => switchBuffer(),
})

// Gmail-style navigation
useKeyboardShortcuts({
  'g then i': () => goToInbox(),
  'g then s': () => goToSent(),
  'g then t': () => goToStarred(),
  'g then d': () => goToDrafts(),
})`}</code></pre>

        <h3>Conditional Shortcuts</h3>
        <p>
          Enable shortcuts only when specific conditions are met.
        </p>
        <pre><code>{`function ChatWithConditionalShortcuts() {
  const [hasSelection, setHasSelection] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // Only when text is selected
  useKeyboardShortcuts({
    'cmd+c': () => copy(),
    'cmd+x': () => cut(),
    'delete': () => deleteSelection()
  }, {
    enabled: hasSelection
  })

  // Only when online
  useKeyboardShortcuts({
    'cmd+s': () => saveToCloud(),
    'cmd+shift+s': () => syncNow()
  }, {
    enabled: isOnline
  })

  return <Chat />
}`}</code></pre>

        <h3>Priority and Conflicts</h3>
        <p>
          Handle conflicts when multiple components register the same shortcut.
        </p>
        <pre><code>{`// Lower priority (runs first)
useKeyboardShortcuts({
  'cmd+k': () => globalSearch()
}, {
  priority: 1
})

// Higher priority (can override)
useKeyboardShortcuts({
  'cmd+k': (e) => {
    if (shouldUseLocalSearch) {
      localSearch()
      return false // stop propagation
    }
    return true // allow lower priority
  }
}, {
  priority: 10
})`}</code></pre>

        <h3>Platform-Specific Shortcuts</h3>
        <p>
          Automatically adapt shortcuts for different operating systems.
        </p>
        <pre><code>{`useKeyboardShortcuts({
  'mod+k': () => search(), // Cmd on Mac, Ctrl on Windows/Linux
  'mod+shift+p': () => commandPalette(),
  'alt+left': () => goBack(),
  'alt+right': () => goForward()
}, {
  autoConvertMod: true // converts 'mod' based on platform
})`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Integration Examples</h2>

        <h3>With Command Palette</h3>
        <pre><code>{`import { useKeyboardShortcuts } from '@clarity-chat/react'
import { CommandPalette } from '@clarity-chat/react'

function ChatWithCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useKeyboardShortcuts({
    'cmd+k': () => setIsOpen(true),
    'cmd+p': () => setIsOpen(true)
  })

  return (
    <>
      <ChatWindow />
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        commands={commands}
      />
    </>
  )
}`}</code></pre>

        <h3>With Modal Dialogs</h3>
        <pre><code>{`function ChatWithModals() {
  const [modalStack, setModalStack] = useState([])

  // Global shortcuts (always active)
  useKeyboardShortcuts({
    'cmd+n': () => openModal('new-message'),
    'cmd+o': () => openModal('settings')
  })

  // Modal shortcuts (only when modal is open)
  useKeyboardShortcuts({
    'esc': () => closeTopModal(),
    'cmd+enter': () => submitTopModal()
  }, {
    enabled: modalStack.length > 0
  })

  return <Chat />
}`}</code></pre>

        <h3>With Undo/Redo</h3>
        <pre><code>{`import { useKeyboardShortcuts } from '@clarity-chat/react'
import { useUndoRedo } from '@clarity-chat/react'

function ChatWithUndoRedo() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  useKeyboardShortcuts({
    'cmd+z': () => undo(),
    'cmd+shift+z': () => redo(),
    'cmd+y': () => redo() // Alternative redo
  }, {
    enabled: canUndo || canRedo
  })

  return <Chat />
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        
        <Callout type="tip" title="Discoverability">
          Always provide a way for users to discover available shortcuts. Consider adding:
          <ul>
            <li>A help panel (press <kbd>?</kbd> to show)</li>
            <li>Tooltips with keyboard hints</li>
            <li>Visual keyboard shortcut indicators next to actions</li>
          </ul>
        </Callout>

        <Callout type="warning" title="Avoid Conflicts">
          Be careful not to override browser or system shortcuts. Common conflicts:
          <ul>
            <li><kbd>Cmd+W</kbd> - Close tab (don't override)</li>
            <li><kbd>Cmd+T</kbd> - New tab (don't override)</li>
            <li><kbd>Cmd+R</kbd> - Refresh (use with caution)</li>
            <li><kbd>Cmd+Q</kbd> - Quit app (don't override)</li>
          </ul>
        </Callout>

        <Callout type="info" title="Platform Consistency">
          Follow platform conventions:
          <ul>
            <li><strong>macOS:</strong> Use Cmd for primary actions</li>
            <li><strong>Windows/Linux:</strong> Use Ctrl for primary actions</li>
            <li><strong>Cross-platform:</strong> Use <code>mod</code> to automatically adapt</li>
          </ul>
        </Callout>

        <h3>Naming Conventions</h3>
        <ul>
          <li><strong>Lowercase modifiers:</strong> <code>cmd</code>, <code>ctrl</code>, <code>shift</code>, <code>alt</code></li>
          <li><strong>Use + for combinations:</strong> <code>cmd+k</code>, <code>ctrl+shift+d</code></li>
          <li><strong>Use "then" for sequences:</strong> <code>g then i</code>, <code>ctrl+x then ctrl+c</code></li>
          <li><strong>Special keys:</strong> <code>esc</code>, <code>enter</code>, <code>space</code>, <code>tab</code></li>
        </ul>

        <h3>Performance Tips</h3>
        <ul>
          <li>Shortcuts are automatically cleaned up when components unmount</li>
          <li>Use scoped shortcuts to reduce the number of active listeners</li>
          <li>Enable/disable shortcuts based on context to improve performance</li>
          <li>Avoid registering hundreds of shortcuts simultaneously</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        
        <h3>Screen Reader Support</h3>
        <p>
          Ensure keyboard shortcuts are announced to screen reader users:
        </p>
        <pre><code>{`<button aria-keyshortcuts="Control+K">
  Search
  <span className="kbd">Ctrl+K</span>
</button>`}</code></pre>

        <h3>Focus Management</h3>
        <p>
          Shortcuts should respect focus states and not interfere with screen reader navigation:
        </p>
        <pre><code>{`useKeyboardShortcuts({
  'cmd+k': () => search()
}, {
  enableInInput: false, // Don't interfere with form inputs
  respectFocusTraps: true // Don't work in modal focus traps
})`}</code></pre>

        <h3>Alternative Actions</h3>
        <p>
          Always provide mouse/touch alternatives to keyboard shortcuts:
        </p>
        <ul>
          <li>Buttons for critical actions</li>
          <li>Menu items with shortcuts shown</li>
          <li>Context menus for advanced actions</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { useKeyboardShortcuts, KeyboardShortcutConfig } from '@clarity-chat/react'

interface ShortcutMap {
  [key: string]: (event: KeyboardEvent) => boolean | void
}

interface ShortcutOptions {
  enabled?: boolean
  scoped?: boolean
  enableInInput?: boolean | 'modifiers-only'
  preventDefault?: boolean
  sequenceTimeout?: number
  priority?: number
  autoConvertMod?: boolean
  respectFocusTraps?: boolean
}

function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  options?: ShortcutOptions
): {
  register: (key: string, handler: (e: KeyboardEvent) => boolean | void) => void
  unregister: (key: string) => void
  disable: () => void
  enable: () => void
  isEnabled: boolean
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/command-palette" className="docs-card">
            <h3>CommandPalette</h3>
            <p>Keyboard-driven command interface</p>
          </a>
          <a href="/reference/components/keyboard-hint" className="docs-card">
            <h3>KeyboardHint</h3>
            <p>Visual keyboard shortcut indicators</p>
          </a>
          <a href="/reference/hooks/use-undo-redo" className="docs-card">
            <h3>useUndoRedo</h3>
            <p>Undo/redo with keyboard shortcuts</p>
          </a>
          <a href="/learn/accessibility" className="docs-card">
            <h3>Accessibility Guide</h3>
            <p>Making shortcuts accessible</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const shortcutConfig = [
  {
    name: 'shortcuts',
    type: 'ShortcutMap',
    required: true,
    description: 'Object mapping keyboard shortcuts to handler functions. Keys are shortcut strings (e.g., "cmd+k"), values are handler functions that receive the keyboard event.'
  },
  {
    name: 'options',
    type: 'ShortcutOptions',
    required: false,
    description: 'Configuration options for shortcut behavior'
  },
  {
    name: 'options.enabled',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Whether shortcuts are enabled. Use for conditional shortcuts.'
  },
  {
    name: 'options.scoped',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If true, shortcuts only work when this specific component tree is active.'
  },
  {
    name: 'options.enableInInput',
    type: 'boolean | "modifiers-only"',
    required: false,
    default: 'false',
    description: 'Whether shortcuts work when typing in input fields. "modifiers-only" allows shortcuts with Cmd/Ctrl but not single keys.'
  },
  {
    name: 'options.preventDefault',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Whether to prevent default browser behavior for shortcuts.'
  },
  {
    name: 'options.sequenceTimeout',
    type: 'number',
    required: false,
    default: '800',
    description: 'Milliseconds to wait between keys in a sequence (e.g., "g then i").'
  },
  {
    name: 'options.priority',
    type: 'number',
    required: false,
    default: '0',
    description: 'Priority level for handling conflicts. Higher priority shortcuts run first.'
  },
  {
    name: 'options.autoConvertMod',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'If true, "mod" automatically converts to Cmd on Mac, Ctrl on Windows/Linux.'
  },
  {
    name: 'options.respectFocusTraps',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'If true, shortcuts are disabled inside modal focus traps.'
  }
]

const returnValue = [
  {
    name: 'register',
    type: '(key: string, handler: Function) => void',
    description: 'Dynamically register a new shortcut'
  },
  {
    name: 'unregister',
    type: '(key: string) => void',
    description: 'Remove a registered shortcut'
  },
  {
    name: 'disable',
    type: '() => void',
    description: 'Temporarily disable all shortcuts'
  },
  {
    name: 'enable',
    type: '() => void',
    description: 'Re-enable previously disabled shortcuts'
  },
  {
    name: 'isEnabled',
    type: 'boolean',
    description: 'Current enabled state of shortcuts'
  }
]
