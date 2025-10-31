import React from 'react'
import { Metadata } from 'next'
import DocsLayout from '@/components/Layout/DocsLayout'
import ApiTable from '@/components/Demo/ApiTable'
import LiveDemo from '@/components/Demo/LiveDemo'
import ComponentPreview from '@/components/Demo/ComponentPreview'
import Callout from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'useKeyboardShortcuts - Clarity Chat Components',
  description: 'React hook for managing keyboard shortcuts and hotkeys in chat applications with conflict detection, modifier keys, and custom actions.',
}

export default function UseKeyboardShortcutsPage() {
  return (
    <DocsLayout
      title="useKeyboardShortcuts"
      description="Manage keyboard shortcuts and hotkeys with conflict detection, modifier keys, and custom actions"
    >
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Overview</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            The <code>useKeyboardShortcuts</code> hook provides a robust way to manage keyboard shortcuts in your chat application. 
            It handles modifier keys (Ctrl, Alt, Shift, Meta), prevents conflicts, supports sequences, and works seamlessly across 
            different operating systems.
          </p>

          <Callout type="tip" className="mb-6">
            This hook automatically handles OS differences (Cmd on Mac, Ctrl on Windows/Linux) and prevents shortcuts from 
            firing when user is typing in input fields.
          </Callout>
        </section>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Import</h2>
          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
            <code>{`import { useKeyboardShortcuts } from '@clarity-chat/react'`}</code>
          </pre>
        </section>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Basic Usage</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define keyboard shortcuts with simple configuration objects:
          </p>

          <LiveDemo
            title="Basic Keyboard Shortcuts"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts, ChatWindow } from '@clarity-chat/react'

export default function BasicShortcutsExample() {
  const [action, setAction] = useState('')
  const [messages, setMessages] = useState([])

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'n',
        modifiers: ['ctrl'],
        description: 'New message',
        action: () => {
          setAction('New message triggered')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 's',
        modifiers: ['ctrl'],
        description: 'Save draft',
        action: () => {
          setAction('Draft saved')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 'k',
        modifiers: ['ctrl'],
        description: 'Open search',
        action: () => {
          setAction('Search opened')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: '/',
        description: 'Focus search',
        action: () => {
          setAction('Search focused')
          setTimeout(() => setAction(''), 2000)
        }
      }
    ],
    enabled: true
  })

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Try these shortcuts:</h3>
        <ul className="space-y-1 text-sm">
          <li><kbd>Ctrl</kbd> + <kbd>N</kbd> - New message</li>
          <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save draft</li>
          <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - Open search</li>
          <li><kbd>/</kbd> - Focus search</li>
        </ul>
      </div>

      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <ChatWindow
        messages={messages}
        onSendMessage={(text) => {
          const newMessage = {
            id: Date.now().toString(),
            text,
            sender: { id: 'user', name: 'You' },
            timestamp: new Date()
          }
          setMessages([...messages, newMessage])
        }}
        currentUser={{ id: 'user', name: 'You' }}
      />
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="600px"
          />
        </section>

        {/* Hook Signature */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Hook Signature</h2>
          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto mb-6">
            <code>{`const {
  shortcuts,
  addShortcut,
  removeShortcut,
  updateShortcut,
  clearShortcuts,
  enabledShortcuts,
  disableShortcut,
  enableShortcut,
  getConflicts
} = useKeyboardShortcuts(options)`}</code>
          </pre>
        </section>

        {/* Configuration */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Configuration</h2>
          <ApiTable
            title="Options"
            data={[
              {
                name: 'shortcuts',
                type: 'ShortcutConfig[]',
                required: true,
                default: '[]',
                description: 'Array of keyboard shortcut configurations'
              },
              {
                name: 'enabled',
                type: 'boolean',
                default: 'true',
                description: 'Enable or disable all shortcuts globally'
              },
              {
                name: 'preventDefault',
                type: 'boolean',
                default: 'true',
                description: 'Call preventDefault() when shortcuts are triggered'
              },
              {
                name: 'stopPropagation',
                type: 'boolean',
                default: 'false',
                description: 'Call stopPropagation() when shortcuts are triggered'
              },
              {
                name: 'ignoreInputFields',
                type: 'boolean',
                default: 'true',
                description: 'Ignore shortcuts when user is typing in input/textarea'
              },
              {
                name: 'caseSensitive',
                type: 'boolean',
                default: 'false',
                description: 'Make key matching case-sensitive'
              },
              {
                name: 'enableSequences',
                type: 'boolean',
                default: 'false',
                description: 'Enable key sequences (e.g., "g i" for GitHub Issues)'
              },
              {
                name: 'sequenceTimeout',
                type: 'number',
                default: '1000',
                description: 'Timeout in ms between sequence keys'
              },
              {
                name: 'onConflict',
                type: '(conflicts: Conflict[]) => void',
                description: 'Callback when shortcut conflicts are detected'
              }
            ]}
          />
        </section>

        {/* ShortcutConfig Type */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">ShortcutConfig Type</h2>
          <ApiTable
            title="ShortcutConfig Properties"
            data={[
              {
                name: 'key',
                type: 'string | string[]',
                required: true,
                description: 'Key or array of keys for the shortcut (e.g., "n", "Enter", ["g", "i"])'
              },
              {
                name: 'modifiers',
                type: 'Modifier[]',
                default: '[]',
                description: 'Modifier keys: "ctrl", "alt", "shift", "meta"'
              },
              {
                name: 'action',
                type: '(event: KeyboardEvent) => void',
                required: true,
                description: 'Function to execute when shortcut is triggered'
              },
              {
                name: 'description',
                type: 'string',
                description: 'Human-readable description of the shortcut'
              },
              {
                name: 'id',
                type: 'string',
                description: 'Unique identifier for the shortcut (auto-generated if not provided)'
              },
              {
                name: 'enabled',
                type: 'boolean',
                default: 'true',
                description: 'Enable or disable this specific shortcut'
              },
              {
                name: 'group',
                type: 'string',
                description: 'Group name for organizing shortcuts'
              },
              {
                name: 'priority',
                type: 'number',
                default: '0',
                description: 'Priority when multiple shortcuts match (higher = first)'
              },
              {
                name: 'allowInInput',
                type: 'boolean',
                default: 'false',
                description: 'Allow shortcut to work in input fields'
              }
            ]}
          />
        </section>

        {/* Return Values */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Return Values</h2>
          <ApiTable
            title="Hook Return Values"
            data={[
              {
                name: 'shortcuts',
                type: 'ShortcutConfig[]',
                description: 'Current array of registered shortcuts'
              },
              {
                name: 'addShortcut',
                type: '(shortcut: ShortcutConfig) => void',
                description: 'Add a new shortcut dynamically'
              },
              {
                name: 'removeShortcut',
                type: '(id: string) => void',
                description: 'Remove a shortcut by ID'
              },
              {
                name: 'updateShortcut',
                type: '(id: string, updates: Partial<ShortcutConfig>) => void',
                description: 'Update an existing shortcut'
              },
              {
                name: 'clearShortcuts',
                type: '() => void',
                description: 'Remove all shortcuts'
              },
              {
                name: 'enabledShortcuts',
                type: 'ShortcutConfig[]',
                description: 'Array of currently enabled shortcuts'
              },
              {
                name: 'disableShortcut',
                type: '(id: string) => void',
                description: 'Disable a specific shortcut'
              },
              {
                name: 'enableShortcut',
                type: '(id: string) => void',
                description: 'Enable a specific shortcut'
              },
              {
                name: 'getConflicts',
                type: '() => Conflict[]',
                description: 'Get array of conflicting shortcuts'
              }
            ]}
          />
        </section>

        {/* Modifier Keys */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Modifier Keys</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The hook automatically handles OS differences for modifier keys:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-3">macOS</h3>
              <ul className="space-y-2 text-sm">
                <li><code>ctrl</code> → <kbd>⌃ Control</kbd></li>
                <li><code>alt</code> → <kbd>⌥ Option</kbd></li>
                <li><code>shift</code> → <kbd>⇧ Shift</kbd></li>
                <li><code>meta</code> → <kbd>⌘ Command</kbd></li>
              </ul>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-3">Windows/Linux</h3>
              <ul className="space-y-2 text-sm">
                <li><code>ctrl</code> → <kbd>Ctrl</kbd></li>
                <li><code>alt</code> → <kbd>Alt</kbd></li>
                <li><code>shift</code> → <kbd>Shift</kbd></li>
                <li><code>meta</code> → <kbd>⊞ Win</kbd> / <kbd>Super</kbd></li>
              </ul>
            </div>
          </div>

          <LiveDemo
            title="Cross-Platform Modifier Keys"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function ModifierKeysExample() {
  const [triggered, setTriggered] = useState('')

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'b',
        modifiers: ['ctrl'],
        description: 'Bold text',
        action: () => {
          setTriggered('Bold (Ctrl+B / ⌘B)')
          setTimeout(() => setTriggered(''), 2000)
        }
      },
      {
        key: 'i',
        modifiers: ['ctrl'],
        description: 'Italic text',
        action: () => {
          setTriggered('Italic (Ctrl+I / ⌘I)')
          setTimeout(() => setTriggered(''), 2000)
        }
      },
      {
        key: 'k',
        modifiers: ['ctrl', 'shift'],
        description: 'Insert link',
        action: () => {
          setTriggered('Link (Ctrl+Shift+K / ⌘⇧K)')
          setTimeout(() => setTriggered(''), 2000)
        }
      },
      {
        key: 'z',
        modifiers: ['ctrl', 'shift'],
        description: 'Redo',
        action: () => {
          setTriggered('Redo (Ctrl+Shift+Z / ⌘⇧Z)')
          setTimeout(() => setTriggered(''), 2000)
        }
      }
    ]
  })

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Text Formatting Shortcuts:</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          These work the same on Mac (⌘) and Windows/Linux (Ctrl)
        </p>
        <ul className="space-y-1 text-sm">
          <li><kbd>Ctrl/⌘</kbd> + <kbd>B</kbd> - Bold</li>
          <li><kbd>Ctrl/⌘</kbd> + <kbd>I</kbd> - Italic</li>
          <li><kbd>Ctrl/⌘</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> - Insert Link</li>
          <li><kbd>Ctrl/⌘</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> - Redo</li>
        </ul>
      </div>

      {triggered && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold animate-fadeIn">
          ✓ {triggered}
        </div>
      )}

      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        <textarea
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type here and try the shortcuts above..."
        />
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="550px"
          />
        </section>

        {/* Key Sequences */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Sequences</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Enable multi-key sequences like GitHub's "g i" (go to issues) or "g p" (go to pull requests):
          </p>

          <Callout type="info" className="mb-6">
            Set <code>enableSequences: true</code> to activate sequence support. Sequences must be completed 
            within the <code>sequenceTimeout</code> (default 1000ms).
          </Callout>

          <LiveDemo
            title="Key Sequences (GitHub-style)"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function KeySequencesExample() {
  const [currentPage, setCurrentPage] = useState('Dashboard')
  const [sequence, setSequence] = useState('')

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: ['g', 'h'],
        description: 'Go to home',
        action: () => {
          setCurrentPage('Home')
          setSequence('g h')
          setTimeout(() => setSequence(''), 2000)
        }
      },
      {
        key: ['g', 'c'],
        description: 'Go to conversations',
        action: () => {
          setCurrentPage('Conversations')
          setSequence('g c')
          setTimeout(() => setSequence(''), 2000)
        }
      },
      {
        key: ['g', 's'],
        description: 'Go to settings',
        action: () => {
          setCurrentPage('Settings')
          setSequence('g s')
          setTimeout(() => setSequence(''), 2000)
        }
      },
      {
        key: ['g', 'n'],
        description: 'Go to notifications',
        action: () => {
          setCurrentPage('Notifications')
          setSequence('g n')
          setTimeout(() => setSequence(''), 2000)
        }
      },
      {
        key: ['c'],
        description: 'Create new conversation',
        action: () => {
          setCurrentPage('New Conversation')
          setSequence('c')
          setTimeout(() => setSequence(''), 2000)
        }
      }
    ],
    enableSequences: true,
    sequenceTimeout: 1000
  })

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{currentPage}</h2>
        {sequence && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Triggered by: <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded">{sequence}</kbd>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold mb-2">Navigation Shortcuts:</h3>
          <ul className="space-y-1 text-sm">
            <li><kbd>g</kbd> then <kbd>h</kbd> - Go to Home</li>
            <li><kbd>g</kbd> then <kbd>c</kbd> - Go to Conversations</li>
            <li><kbd>g</kbd> then <kbd>s</kbd> - Go to Settings</li>
            <li><kbd>g</kbd> then <kbd>n</kbd> - Go to Notifications</li>
          </ul>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold mb-2">Action Shortcuts:</h3>
          <ul className="space-y-1 text-sm">
            <li><kbd>c</kbd> - Create new conversation</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Type sequences quickly (within 1 second)
          </p>
        </div>
      </div>
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="550px"
          />
        </section>

        {/* Dynamic Shortcuts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Dynamic Shortcuts</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add, remove, and update shortcuts dynamically at runtime:
          </p>

          <LiveDemo
            title="Dynamic Shortcut Management"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function DynamicShortcutsExample() {
  const [logs, setLogs] = useState([])
  const [customKey, setCustomKey] = useState('m')

  const addLog = (message) => {
    setLogs(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] \${message}\`])
  }

  const {
    shortcuts,
    addShortcut,
    removeShortcut,
    enableShortcut,
    disableShortcut
  } = useKeyboardShortcuts({
    shortcuts: [
      {
        id: 'help',
        key: '?',
        description: 'Show help',
        action: () => addLog('Help shortcut triggered')
      },
      {
        id: 'save',
        key: 's',
        modifiers: ['ctrl'],
        description: 'Save',
        action: () => addLog('Save shortcut triggered')
      }
    ]
  })

  const handleAddCustom = () => {
    if (!customKey) return
    
    addShortcut({
      id: \`custom-\${customKey}\`,
      key: customKey,
      description: \`Custom shortcut: \${customKey}\`,
      action: () => addLog(\`Custom shortcut '\${customKey}' triggered\`)
    })
    addLog(\`Added shortcut: \${customKey}\`)
  }

  const handleRemove = (id) => {
    removeShortcut(id)
    addLog(\`Removed shortcut: \${id}\`)
  }

  const handleToggle = (id, enabled) => {
    if (enabled) {
      disableShortcut(id)
      addLog(\`Disabled shortcut: \${id}\`)
    } else {
      enableShortcut(id)
      addLog(\`Enabled shortcut: \${id}\`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-3">Add Custom Shortcut:</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value.toLowerCase())}
            placeholder="Enter key (a-z)"
            maxLength={1}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 flex-1"
          />
          <button
            onClick={handleAddCustom}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            Add Shortcut
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="font-semibold mb-3">Registered Shortcuts:</h3>
        <div className="space-y-2">
          {shortcuts.map(shortcut => (
            <div
              key={shortcut.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700"
            >
              <div className="flex-1">
                <div className="font-mono text-sm">
                  {shortcut.modifiers?.map(m => (
                    <kbd key={m} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border rounded mr-1">
                      {m}
                    </kbd>
                  ))}
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border rounded">
                    {shortcut.key}
                  </kbd>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {shortcut.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(shortcut.id, shortcut.enabled !== false)}
                  className={\`px-3 py-1 text-xs rounded \${
                    shortcut.enabled !== false
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }\`}
                >
                  {shortcut.enabled !== false ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleRemove(shortcut.id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/30"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-lg">
        <h3 className="font-semibold text-slate-50 mb-2">Activity Log:</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet. Try pressing some shortcuts!</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-xs text-slate-300 font-mono">
                {log}
              </div>
            ))
          )}
        </div>
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

        {/* Conflict Detection */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Conflict Detection</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The hook automatically detects when multiple shortcuts use the same key combination:
          </p>

          <Callout type="warning" className="mb-6">
            When conflicts are detected, the shortcut with the highest <code>priority</code> will be executed. 
            Use the <code>onConflict</code> callback to handle conflicts programmatically.
          </Callout>

          <LiveDemo
            title="Conflict Detection & Priority"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function ConflictDetectionExample() {
  const [conflicts, setConflicts] = useState([])
  const [triggered, setTriggered] = useState('')

  const { getConflicts } = useKeyboardShortcuts({
    shortcuts: [
      {
        id: 'save-low',
        key: 's',
        modifiers: ['ctrl'],
        description: 'Save (Low Priority)',
        priority: 0,
        action: () => {
          setTriggered('Save Low Priority')
          setTimeout(() => setTriggered(''), 2000)
        }
      },
      {
        id: 'save-high',
        key: 's',
        modifiers: ['ctrl'],
        description: 'Save (High Priority)',
        priority: 10,
        action: () => {
          setTriggered('Save High Priority')
          setTimeout(() => setTriggered(''), 2000)
        }
      },
      {
        id: 'submit',
        key: 'Enter',
        modifiers: ['ctrl'],
        description: 'Submit form',
        action: () => {
          setTriggered('Form submitted')
          setTimeout(() => setTriggered(''), 2000)
        }
      }
    ],
    onConflict: (detectedConflicts) => {
      setConflicts(detectedConflicts)
    }
  })

  const checkConflicts = () => {
    const detected = getConflicts()
    setConflicts(detected)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Test Shortcuts:</h3>
        <ul className="space-y-1 text-sm">
          <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save (conflicts detected!)</li>
          <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> - Submit (no conflict)</li>
        </ul>
        <button
          onClick={checkConflicts}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
        >
          Check for Conflicts
        </button>
      </div>

      {triggered && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {triggered}
          <p className="text-sm font-normal mt-1">
            The high-priority shortcut was executed because of the conflict.
          </p>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
            ⚠️ Conflicts Detected ({conflicts.length})
          </h3>
          <div className="space-y-3">
            {conflicts.map((conflict, i) => (
              <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded border border-yellow-200 dark:border-yellow-800">
                <div className="font-mono text-sm mb-2">
                  {conflict.modifiers?.map(m => (
                    <kbd key={m} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border rounded mr-1">
                      {m}
                    </kbd>
                  ))}
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border rounded">
                    {conflict.key}
                  </kbd>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Conflicting shortcuts:
                </p>
                <ul className="space-y-1 text-xs">
                  {conflict.shortcuts.map(s => (
                    <li key={s.id} className="flex items-center justify-between">
                      <span>{s.description}</span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        Priority: {s.priority || 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {conflicts.length === 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center text-slate-600 dark:text-slate-400">
          Click "Check for Conflicts" to detect conflicting shortcuts
        </div>
      )}
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="650px"
          />
        </section>

        {/* Grouped Shortcuts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Grouped Shortcuts</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Organize shortcuts into logical groups for better organization and documentation:
          </p>

          <LiveDemo
            title="Grouped Shortcuts (Help Dialog)"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function GroupedShortcutsExample() {
  const [showHelp, setShowHelp] = useState(false)
  const [action, setAction] = useState('')

  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      // Navigation group
      {
        key: 'h',
        modifiers: ['ctrl'],
        description: 'Go to home',
        group: 'Navigation',
        action: () => {
          setAction('Navigated to Home')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 'ArrowLeft',
        modifiers: ['ctrl'],
        description: 'Go back',
        group: 'Navigation',
        action: () => {
          setAction('Navigated back')
          setTimeout(() => setAction(''), 2000)
        }
      },
      // Editing group
      {
        key: 'b',
        modifiers: ['ctrl'],
        description: 'Bold text',
        group: 'Editing',
        action: () => {
          setAction('Text bolded')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 'i',
        modifiers: ['ctrl'],
        description: 'Italic text',
        group: 'Editing',
        action: () => {
          setAction('Text italicized')
          setTimeout(() => setAction(''), 2000)
        }
      },
      // Actions group
      {
        key: 'Enter',
        modifiers: ['ctrl'],
        description: 'Send message',
        group: 'Actions',
        action: () => {
          setAction('Message sent')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 'n',
        modifiers: ['ctrl'],
        description: 'New conversation',
        group: 'Actions',
        action: () => {
          setAction('New conversation created')
          setTimeout(() => setAction(''), 2000)
        }
      },
      // General group
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        group: 'General',
        action: () => setShowHelp(!showHelp)
      },
      {
        key: 'Escape',
        description: 'Close dialog',
        group: 'General',
        action: () => setShowHelp(false)
      }
    ]
  })

  // Group shortcuts
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const group = shortcut.group || 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push(shortcut)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm mb-2">
          Press <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded">?</kbd> to show keyboard shortcuts
        </p>
      </div>

      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(groupedShortcuts).map(([group, groupShortcuts]) => (
                <div key={group}>
                  <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                    {group}
                  </h3>
                  <div className="space-y-2">
                    {groupShortcuts.map(shortcut => (
                      <div
                        key={shortcut.id || shortcut.key}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="font-mono text-sm">
                          {shortcut.modifiers?.map(m => (
                            <kbd key={m} className="px-2 py-1 bg-white dark:bg-slate-900 border rounded mr-1">
                              {m}
                            </kbd>
                          ))}
                          <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded">
                            {shortcut.key}
                          </kbd>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                Press <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded">Esc</kbd> or <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded">?</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        <textarea
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Try the keyboard shortcuts..."
        />
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

        {/* Input Field Handling */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Input Field Handling</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            By default, shortcuts are disabled when the user is typing in input fields. You can override this behavior:
          </p>

          <LiveDemo
            title="Allow Shortcuts in Input Fields"
            code={`import React, { useState } from 'react'
import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function InputHandlingExample() {
  const [action, setAction] = useState('')
  const [text, setText] = useState('')

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'Enter',
        modifiers: ['ctrl'],
        description: 'Send message (works in input)',
        allowInInput: true, // Allow in input fields
        action: () => {
          setAction(\`Message sent: "\${text}"\`)
          setText('')
          setTimeout(() => setAction(''), 3000)
        }
      },
      {
        key: 's',
        modifiers: ['ctrl'],
        description: 'Save draft (works in input)',
        allowInInput: true,
        action: () => {
          setAction(\`Draft saved: "\${text}"\`)
          setTimeout(() => setAction(''), 3000)
        }
      },
      {
        key: 'Escape',
        description: 'Clear input (works in input)',
        allowInInput: true,
        action: () => {
          setText('')
          setAction('Input cleared')
          setTimeout(() => setAction(''), 2000)
        }
      },
      {
        key: 'k',
        modifiers: ['ctrl'],
        description: 'Open search (disabled in input)',
        allowInInput: false, // Default behavior
        action: () => {
          setAction('Search opened (only works outside input)')
          setTimeout(() => setAction(''), 2000)
        }
      }
    ]
  })

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Try these shortcuts:</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>In input field:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> - Send message</li>
              <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save draft</li>
              <li><kbd>Esc</kbd> - Clear input</li>
            </ul>
          </div>
          <div>
            <strong>Outside input field:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - Open search (disabled in input)</li>
            </ul>
          </div>
        </div>
      </div>

      {action && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg font-semibold">
          ✓ {action}
        </div>
      )}

      <div className="p-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg">
        <label className="block text-sm font-semibold mb-2">
          Message Input:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type here and use Ctrl+Enter to send, Ctrl+S to save, or Esc to clear..."
        />
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Shortcuts with <code>allowInInput: true</code> work while typing here
        </div>
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

        {/* Complete Chat Example */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Chat Example</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            A comprehensive example showing keyboard shortcuts in a real chat application:
          </p>

          <LiveDemo
            title="Chat App with Keyboard Shortcuts"
            code={`import React, { useState, useRef } from 'react'
import { useKeyboardShortcuts, ChatWindow } from '@clarity-chat/react'

export default function ChatWithShortcutsExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Welcome! Try these shortcuts:\\n• Ctrl+K - Search\\n• Ctrl+N - New chat\\n• Ctrl+/ - Toggle sidebar\\n• ? - Show help',
      sender: { id: 'bot', name: 'Bot' },
      timestamp: new Date(Date.now() - 60000)
    }
  ])
  const [showHelp, setShowHelp] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const inputRef = useRef(null)

  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        modifiers: ['ctrl'],
        description: 'Open search',
        group: 'Navigation',
        action: () => setShowSearch(true)
      },
      {
        key: 'n',
        modifiers: ['ctrl'],
        description: 'New conversation',
        group: 'Actions',
        action: () => {
          setMessages([{
            id: Date.now().toString(),
            text: 'Started new conversation',
            sender: { id: 'bot', name: 'Bot' },
            timestamp: new Date()
          }])
        }
      },
      {
        key: '/',
        modifiers: ['ctrl'],
        description: 'Toggle sidebar',
        group: 'View',
        action: () => setSidebarOpen(!sidebarOpen)
      },
      {
        key: 'f',
        modifiers: ['ctrl'],
        description: 'Focus message input',
        group: 'Navigation',
        action: () => inputRef.current?.focus()
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        group: 'Help',
        action: () => setShowHelp(!showHelp)
      },
      {
        key: 'Escape',
        description: 'Close dialogs',
        group: 'General',
        action: () => {
          setShowHelp(false)
          setShowSearch(false)
        }
      }
    ]
  })

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: { id: 'user', name: 'You' },
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])

    // Bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Message received! Try more keyboard shortcuts.',
        sender: { id: 'bot', name: 'Bot' },
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const groupedShortcuts = shortcuts.reduce((acc, s) => {
    const group = s.group || 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push(s)
    return acc
  }, {})

  return (
    <div className="flex h-[600px] gap-4">
      {sidebarOpen && (
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Conversations</h3>
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded cursor-pointer">
              Current Chat
            </div>
            <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-600 dark:text-slate-400">
              Previous Chat 1
            </div>
            <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-600 dark:text-slate-400">
              Previous Chat 2
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={{ id: 'user', name: 'You' }}
            inputRef={inputRef}
          />
        </div>

        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-xs text-center text-slate-600 dark:text-slate-400">
          Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded">?</kbd> for keyboard shortcuts
        </div>
      </div>

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between">
              <h3 className="font-bold">Keyboard Shortcuts</h3>
              <button onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(groupedShortcuts).map(([group, groupShortcuts]) => (
                <div key={group}>
                  <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {group}
                  </h4>
                  <div className="space-y-1">
                    {groupShortcuts.map(s => (
                      <div key={s.key} className="flex justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <span>{s.description}</span>
                        <kbd className="px-2 py-0.5 bg-white dark:bg-slate-900 border rounded text-xs">
                          {s.modifiers?.join('+')} {s.modifiers?.length ? '+' : ''} {s.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="p-4 text-center text-sm text-slate-500">
              Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border rounded">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`}
            dependencies={{
              '@clarity-chat/react': 'latest'
            }}
            height="700px"
          />
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
                <li>• Use standard keyboard shortcuts when possible (Ctrl+S for save, Ctrl+C for copy, etc.)</li>
                <li>• Provide a way to view all available shortcuts (? key or help menu)</li>
                <li>• Group related shortcuts together</li>
                <li>• Use modifier keys for important actions to prevent accidental triggers</li>
                <li>• Disable shortcuts in input fields by default (unless explicitly needed)</li>
                <li>• Test shortcuts across different operating systems</li>
                <li>• Provide visual feedback when shortcuts are triggered</li>
                <li>• Document shortcuts in your UI (tooltips, help dialogs)</li>
                <li>• Use priority to resolve conflicts explicitly</li>
              </ul>
            </div>

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                <span>✗</span> Don't
              </h3>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                <li>• Override browser shortcuts (Ctrl+W, Ctrl+T, etc.)</li>
                <li>• Create too many shortcuts (keep it simple and memorable)</li>
                <li>• Use single letters without modifiers for important actions</li>
                <li>• Forget to handle conflicts</li>
                <li>• Make shortcuts work in all contexts (respect input field focus)</li>
                <li>• Use obscure key combinations that are hard to remember</li>
                <li>• Forget to provide a way to discover shortcuts</li>
                <li>• Ignore accessibility considerations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Accessibility</h2>
          
          <Callout type="info" className="mb-6">
            Keyboard shortcuts are essential for accessibility. Many users rely on keyboard navigation exclusively.
          </Callout>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">WCAG Guidelines</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• <strong>2.1.1 Keyboard</strong> - All functionality must be available via keyboard</li>
                <li>• <strong>2.1.2 No Keyboard Trap</strong> - User can navigate away using keyboard</li>
                <li>• <strong>2.1.4 Character Key Shortcuts</strong> - Single-key shortcuts can be turned off or remapped</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Screen Reader Considerations</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Announce when shortcuts are available</li>
                <li>• Provide text descriptions for all shortcuts</li>
                <li>• Make shortcut help dialog accessible</li>
                <li>• Use ARIA attributes appropriately</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Customization</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Consider allowing users to customize shortcuts for their needs:
              </p>
              <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`const [userShortcuts, setUserShortcuts] = useLocalStorage('shortcuts', defaultShortcuts)

useKeyboardShortcuts({
  shortcuts: userShortcuts,
  // ... other options
})`}
              </pre>
            </div>
          </div>
        </section>

        {/* TypeScript Support */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">TypeScript Support</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The hook includes comprehensive TypeScript types:
          </p>

          <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
            <code>{`import { useKeyboardShortcuts } from '@clarity-chat/react'
import type { ShortcutConfig, Modifier, KeyboardShortcutsOptions } from '@clarity-chat/react'

// Type-safe shortcut configuration
const shortcuts: ShortcutConfig[] = [
  {
    key: 's',
    modifiers: ['ctrl'], // Type-checked
    description: 'Save',
    action: (event: KeyboardEvent) => {
      // Fully typed event
      console.log('Saved!', event.key)
    }
  }
]

// Type-safe options
const options: KeyboardShortcutsOptions = {
  shortcuts,
  enabled: true,
  preventDefault: true,
  ignoreInputFields: true
}

// Fully typed return values
const {
  shortcuts: registeredShortcuts,
  addShortcut,
  removeShortcut,
  getConflicts
} = useKeyboardShortcuts(options)`}</code>
          </pre>
        </section>

        {/* Related Hooks */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Related Hooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/reference/hooks/use-hotkeys"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">useHotkeys</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Simplified hotkey management (alternative API)
              </p>
            </a>
            <a
              href="/reference/hooks/use-command-palette"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">useCommandPalette</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage command palette with keyboard shortcuts
              </p>
            </a>
            <a
              href="/reference/hooks/use-focus-trap"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">useFocusTrap</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Trap focus within a modal or dialog
              </p>
            </a>
            <a
              href="/reference/hooks/use-keyboard-nav"
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold mb-1">useKeyboardNav</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Arrow key navigation for lists and menus
              </p>
            </a>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Troubleshooting</h2>
          
          <div className="space-y-4">
            <details className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Shortcuts not working in my app
              </summary>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>Check these common issues:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Ensure the component using the hook is mounted</li>
                  <li>Check if shortcuts are globally enabled (<code>enabled: true</code>)</li>
                  <li>Verify individual shortcuts aren't disabled</li>
                  <li>Check browser console for conflict warnings</li>
                  <li>Ensure you're not in an input field (unless <code>allowInInput: true</code>)</li>
                </ul>
              </div>
            </details>

            <details className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Shortcuts conflicting with browser shortcuts
              </summary>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>Avoid these browser shortcuts:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><kbd>Ctrl+W</kbd> - Close tab</li>
                  <li><kbd>Ctrl+T</kbd> - New tab</li>
                  <li><kbd>Ctrl+N</kbd> - New window</li>
                  <li><kbd>Ctrl+Q</kbd> - Quit browser</li>
                  <li><kbd>F5</kbd> / <kbd>Ctrl+R</kbd> - Refresh</li>
                </ul>
                <p className="mt-2">
                  Use <code>preventDefault: false</code> if you need browser shortcuts to work alongside yours.
                </p>
              </div>
            </details>

            <details className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Sequences not working
              </summary>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>Ensure you've enabled sequences:</p>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`useKeyboardShortcuts({
  shortcuts: [
    { key: ['g', 'h'], action: () => {} }
  ],
  enableSequences: true, // Required!
  sequenceTimeout: 1000
})`}
                </pre>
                <p className="mt-2">
                  Keys must be pressed within the timeout period (default 1000ms).
                </p>
              </div>
            </details>

            <details className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                How to handle conflicts?
              </summary>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>Use the priority system and conflict detection:</p>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`const { getConflicts } = useKeyboardShortcuts({
  shortcuts: [
    { key: 's', modifiers: ['ctrl'], priority: 10, action: () => {} },
    { key: 's', modifiers: ['ctrl'], priority: 0, action: () => {} }
  ],
  onConflict: (conflicts) => {
    console.warn('Shortcut conflicts detected:', conflicts)
  }
})`}
                </pre>
                <p className="mt-2">
                  The shortcut with the highest priority will execute when there's a conflict.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* API Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">API Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Modifier key support (Ctrl, Alt, Shift, Meta)</li>
                <li>✓ Key sequences (e.g., "g i")</li>
                <li>✓ Conflict detection</li>
                <li>✓ Priority-based execution</li>
                <li>✓ Dynamic shortcut management</li>
                <li>✓ Input field handling</li>
                <li>✓ Cross-platform (Mac/Windows/Linux)</li>
                <li>✓ TypeScript support</li>
                <li>✓ Accessibility compliant</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">Customization Options</h3>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Enable/disable globally</li>
                <li>✓ Enable/disable per shortcut</li>
                <li>✓ Custom groups</li>
                <li>✓ Custom priorities</li>
                <li>✓ Custom timeout for sequences</li>
                <li>✓ Case sensitivity</li>
                <li>✓ preventDefault control</li>
                <li>✓ Input field behavior</li>
                <li>✓ Conflict callbacks</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  )
}
