/**
 * CommandPalette Demo - Interactive Showcase
 *
 * Demonstrates all CommandPalette features with glassmorphism styling:
 * - Cmd+K keyboard shortcut
 * - Rich command categories
 * - Search and filtering
 * - Command execution with visual feedback
 * - AI context display
 * - Beautiful glassmorphism design
 */

import React, { useState, useCallback } from 'react'
import {
  CommandPalette,
  useCommandPalette,
  type CommandItem,
  type AIContext
} from '@clarity-chat/react'
import {
  MessageSquare,
  Settings,
  Download,
  Upload,
  Search,
  Trash2,
  Copy,
  FileText,
  Moon,
  Sun,
  Zap,
  Code,
  Sparkles,
  Terminal,
  GitBranch,
  Database,
  CloudDownload,
  Palette,
  Users,
  Bell,
  Lock,
  HelpCircle,
  RefreshCw,
  Save,
  Share2,
  BarChart3,
  Command as CommandIcon
} from 'lucide-react'

interface ExecutedCommand {
  id: string
  label: string
  timestamp: Date
  category: string
}

export function CommandPaletteDemo() {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [aiModel, setAiModel] = useState('Claude 3.5 Sonnet')
  const [showNotification, setShowNotification] = useState(false)

  // Use the hook for proper Cmd+K/Ctrl+K behavior
  const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette({
    defaultOpen: false,
    shortcutEnabled: true,
    onOpen: () => console.log('Command palette opened'),
    onClose: () => console.log('Command palette closed'),
  })

  // Track command execution
  const executeCommand = useCallback((command: CommandItem) => {
    setExecutedCommands(prev => [{
      id: command.id,
      label: command.label,
      timestamp: new Date(),
      category: command.category || 'Commands'
    }, ...prev.slice(0, 4)])

    // Show notification
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }, [])

  // Define all commands with rich metadata
  const commands: CommandItem[] = [
    // Chat Actions
    {
      id: 'new-chat',
      label: 'New Conversation',
      description: 'Start a fresh conversation',
      icon: <MessageSquare className="h-4 w-4" />,
      shortcut: ['⌘', 'N'],
      category: 'Chat',
      onSelect: () => executeCommand({
        id: 'new-chat',
        label: 'New Conversation',
        category: 'Chat',
        onSelect: () => {}
      }),
    },
    {
      id: 'search-messages',
      label: 'Search Messages',
      description: 'Search through conversation history',
      icon: <Search className="h-4 w-4" />,
      shortcut: ['⌘', 'F'],
      category: 'Chat',
      onSelect: () => executeCommand({
        id: 'search-messages',
        label: 'Search Messages',
        category: 'Chat',
        onSelect: () => {}
      }),
    },
    {
      id: 'clear-chat',
      label: 'Clear Conversation',
      description: 'Delete current conversation',
      icon: <Trash2 className="h-4 w-4" />,
      category: 'Chat',
      onSelect: () => executeCommand({
        id: 'clear-chat',
        label: 'Clear Conversation',
        category: 'Chat',
        onSelect: () => {}
      }),
    },
    {
      id: 'copy-conversation',
      label: 'Copy to Clipboard',
      description: 'Copy entire conversation',
      icon: <Copy className="h-4 w-4" />,
      shortcut: ['⌘', 'C'],
      category: 'Chat',
      onSelect: () => executeCommand({
        id: 'copy-conversation',
        label: 'Copy to Clipboard',
        category: 'Chat',
        onSelect: () => {}
      }),
    },

    // AI Models
    {
      id: 'model-claude',
      label: 'Switch to Claude 3.5 Sonnet',
      description: 'Most capable model for complex tasks',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'AI Models',
      onSelect: () => {
        setAiModel('Claude 3.5 Sonnet')
        executeCommand({
          id: 'model-claude',
          label: 'Switch to Claude 3.5 Sonnet',
          category: 'AI Models',
          onSelect: () => {}
        })
      },
    },
    {
      id: 'model-haiku',
      label: 'Switch to Claude 3 Haiku',
      description: 'Fast and efficient for simple tasks',
      icon: <Zap className="h-4 w-4" />,
      category: 'AI Models',
      onSelect: () => {
        setAiModel('Claude 3 Haiku')
        executeCommand({
          id: 'model-haiku',
          label: 'Switch to Claude 3 Haiku',
          category: 'AI Models',
          onSelect: () => {}
        })
      },
    },
    {
      id: 'model-gpt4',
      label: 'Switch to GPT-4 Turbo',
      description: 'OpenAI\'s flagship model',
      icon: <Terminal className="h-4 w-4" />,
      category: 'AI Models',
      onSelect: () => {
        setAiModel('GPT-4 Turbo')
        executeCommand({
          id: 'model-gpt4',
          label: 'Switch to GPT-4 Turbo',
          category: 'AI Models',
          onSelect: () => {}
        })
      },
    },

    // File Operations
    {
      id: 'export-json',
      label: 'Export as JSON',
      description: 'Download conversation in JSON format',
      icon: <Download className="h-4 w-4" />,
      shortcut: ['⌘', 'E'],
      category: 'File',
      onSelect: () => executeCommand({
        id: 'export-json',
        label: 'Export as JSON',
        category: 'File',
        onSelect: () => {}
      }),
    },
    {
      id: 'export-pdf',
      label: 'Export as PDF',
      description: 'Generate PDF document',
      icon: <FileText className="h-4 w-4" />,
      category: 'File',
      onSelect: () => executeCommand({
        id: 'export-pdf',
        label: 'Export as PDF',
        category: 'File',
        onSelect: () => {}
      }),
    },
    {
      id: 'import-data',
      label: 'Import Conversation',
      description: 'Load conversation from file',
      icon: <Upload className="h-4 w-4" />,
      shortcut: ['⌘', 'I'],
      category: 'File',
      onSelect: () => executeCommand({
        id: 'import-data',
        label: 'Import Conversation',
        category: 'File',
        onSelect: () => {}
      }),
    },
    {
      id: 'save-draft',
      label: 'Save Draft',
      description: 'Save current message as draft',
      icon: <Save className="h-4 w-4" />,
      shortcut: ['⌘', 'S'],
      category: 'File',
      onSelect: () => executeCommand({
        id: 'save-draft',
        label: 'Save Draft',
        category: 'File',
        onSelect: () => {}
      }),
    },

    // View & Appearance
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      shortcut: ['⌘', 'D'],
      category: 'View',
      onSelect: () => {
        setIsDarkMode(!isDarkMode)
        executeCommand({
          id: 'toggle-theme',
          label: 'Toggle Theme',
          category: 'View',
          onSelect: () => {}
        })
      },
    },
    {
      id: 'customize-theme',
      label: 'Customize Theme',
      description: 'Open theme customization panel',
      icon: <Palette className="h-4 w-4" />,
      category: 'View',
      onSelect: () => executeCommand({
        id: 'customize-theme',
        label: 'Customize Theme',
        category: 'View',
        onSelect: () => {}
      }),
    },
    {
      id: 'compact-view',
      label: 'Compact View',
      description: 'Toggle compact message display',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'View',
      onSelect: () => executeCommand({
        id: 'compact-view',
        label: 'Compact View',
        category: 'View',
        onSelect: () => {}
      }),
    },

    // Developer Tools
    {
      id: 'view-tokens',
      label: 'View Token Usage',
      description: 'Show detailed token statistics',
      icon: <Database className="h-4 w-4" />,
      category: 'Developer',
      onSelect: () => executeCommand({
        id: 'view-tokens',
        label: 'View Token Usage',
        category: 'Developer',
        onSelect: () => {}
      }),
    },
    {
      id: 'view-api',
      label: 'View API Calls',
      description: 'Inspect API request/response',
      icon: <Code className="h-4 w-4" />,
      category: 'Developer',
      onSelect: () => executeCommand({
        id: 'view-api',
        label: 'View API Calls',
        category: 'Developer',
        onSelect: () => {}
      }),
    },
    {
      id: 'export-logs',
      label: 'Export Debug Logs',
      description: 'Download application logs',
      icon: <CloudDownload className="h-4 w-4" />,
      category: 'Developer',
      onSelect: () => executeCommand({
        id: 'export-logs',
        label: 'Export Debug Logs',
        category: 'Developer',
        onSelect: () => {}
      }),
    },
    {
      id: 'version-info',
      label: 'Version Information',
      description: 'Show app and library versions',
      icon: <GitBranch className="h-4 w-4" />,
      category: 'Developer',
      onSelect: () => executeCommand({
        id: 'version-info',
        label: 'Version Information',
        category: 'Developer',
        onSelect: () => {}
      }),
    },

    // Settings
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Configure application settings',
      icon: <Settings className="h-4 w-4" />,
      shortcut: ['⌘', ','],
      category: 'Settings',
      onSelect: () => executeCommand({
        id: 'preferences',
        label: 'Preferences',
        category: 'Settings',
        onSelect: () => {}
      }),
    },
    {
      id: 'notifications',
      label: 'Notification Settings',
      description: 'Manage notification preferences',
      icon: <Bell className="h-4 w-4" />,
      category: 'Settings',
      onSelect: () => executeCommand({
        id: 'notifications',
        label: 'Notification Settings',
        category: 'Settings',
        onSelect: () => {}
      }),
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      description: 'Configure privacy settings',
      icon: <Lock className="h-4 w-4" />,
      category: 'Settings',
      onSelect: () => executeCommand({
        id: 'privacy',
        label: 'Privacy & Security',
        category: 'Settings',
        onSelect: () => {}
      }),
    },

    // Help & Support
    {
      id: 'documentation',
      label: 'Documentation',
      description: 'Open documentation in new tab',
      icon: <FileText className="h-4 w-4" />,
      category: 'Help',
      onSelect: () => executeCommand({
        id: 'documentation',
        label: 'Documentation',
        category: 'Help',
        onSelect: () => {}
      }),
    },
    {
      id: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      icon: <CommandIcon className="h-4 w-4" />,
      shortcut: ['⌘', '/'],
      category: 'Help',
      onSelect: () => executeCommand({
        id: 'keyboard-shortcuts',
        label: 'Keyboard Shortcuts',
        category: 'Help',
        onSelect: () => {}
      }),
    },
    {
      id: 'support',
      label: 'Contact Support',
      description: 'Get help from support team',
      icon: <HelpCircle className="h-4 w-4" />,
      category: 'Help',
      onSelect: () => executeCommand({
        id: 'support',
        label: 'Contact Support',
        category: 'Help',
        onSelect: () => {}
      }),
    },

    // Social
    {
      id: 'share',
      label: 'Share Conversation',
      description: 'Generate shareable link',
      icon: <Share2 className="h-4 w-4" />,
      category: 'Social',
      onSelect: () => executeCommand({
        id: 'share',
        label: 'Share Conversation',
        category: 'Social',
        onSelect: () => {}
      }),
    },
    {
      id: 'collaborate',
      label: 'Invite Collaborators',
      description: 'Share with team members',
      icon: <Users className="h-4 w-4" />,
      category: 'Social',
      onSelect: () => executeCommand({
        id: 'collaborate',
        label: 'Invite Collaborators',
        category: 'Social',
        onSelect: () => {}
      }),
    },

    // Quick Actions
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload current view',
      icon: <RefreshCw className="h-4 w-4" />,
      shortcut: ['⌘', 'R'],
      category: 'Quick Actions',
      onSelect: () => executeCommand({
        id: 'refresh',
        label: 'Refresh',
        category: 'Quick Actions',
        onSelect: () => {}
      }),
    },
  ]

  // AI context to display
  const aiContext: AIContext = {
    modelName: aiModel,
    conversationId: 'conv-demo-123',
    tokenUsage: {
      input: 1234,
      output: 567,
      total: 1801,
    },
  }

  return (
    <div className="command-palette-demo">
      {/* Hero Section */}
      <div className="demo-hero">
        <div className="demo-hero-content">
          <div className="demo-badge">
            <Sparkles className="h-4 w-4" />
            <span>Power User Feature</span>
          </div>
          <h1 className="demo-title">Command Palette</h1>
          <p className="demo-description">
            Lightning-fast command interface with beautiful glassmorphism design.
            Access any action instantly with keyboard shortcuts.
          </p>

          {/* Key Features */}
          <div className="demo-features-grid">
            <div className="demo-feature-card">
              <div className="demo-feature-icon">
                <Search className="h-5 w-5" />
              </div>
              <div className="demo-feature-content">
                <h3>Fuzzy Search</h3>
                <p>Find commands by typing any part of their name</p>
              </div>
            </div>
            <div className="demo-feature-card">
              <div className="demo-feature-icon">
                <Zap className="h-5 w-5" />
              </div>
              <div className="demo-feature-content">
                <h3>Keyboard First</h3>
                <p>Navigate with arrows, select with Enter</p>
              </div>
            </div>
            <div className="demo-feature-card">
              <div className="demo-feature-icon">
                <Palette className="h-5 w-5" />
              </div>
              <div className="demo-feature-content">
                <h3>Glassmorphism</h3>
                <p>Beautiful translucent design with blur effects</p>
              </div>
            </div>
            <div className="demo-feature-card">
              <div className="demo-feature-icon">
                <Database className="h-5 w-5" />
              </div>
              <div className="demo-feature-content">
                <h3>AI Context</h3>
                <p>Shows current model and token usage</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button onClick={toggle} className="demo-cta-button">
            <CommandIcon className="h-5 w-5" />
            <span>Open Command Palette</span>
            <kbd className="demo-kbd">{shortcutDisplay}</kbd>
          </button>

          {/* Shortcut Hint */}
          <p className="demo-hint">
            Press <kbd className="demo-kbd-inline">{shortcutDisplay}</kbd> anywhere to open
          </p>
        </div>
      </div>

      {/* Live Demo Section */}
      <div className="demo-section">
        <h2 className="demo-section-title">Interactive Demo</h2>
        <p className="demo-section-description">
          Try it out! Press <kbd className="demo-kbd-inline">{shortcutDisplay}</kbd> or click the button below.
          Search for commands, use arrow keys to navigate, and press Enter to execute.
        </p>

        <div className="demo-interactive-panel">
          {/* Stats Cards */}
          <div className="demo-stats-grid">
            <div className="demo-stat-card">
              <div className="demo-stat-icon">
                <CommandIcon className="h-5 w-5" />
              </div>
              <div className="demo-stat-content">
                <div className="demo-stat-value">{commands.length}</div>
                <div className="demo-stat-label">Total Commands</div>
              </div>
            </div>
            <div className="demo-stat-card">
              <div className="demo-stat-icon">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="demo-stat-content">
                <div className="demo-stat-value">{aiModel}</div>
                <div className="demo-stat-label">Current Model</div>
              </div>
            </div>
            <div className="demo-stat-card">
              <div className="demo-stat-icon">
                <Zap className="h-5 w-5" />
              </div>
              <div className="demo-stat-content">
                <div className="demo-stat-value">{executedCommands.length}</div>
                <div className="demo-stat-label">Commands Executed</div>
              </div>
            </div>
          </div>

          {/* Command History */}
          {executedCommands.length > 0 && (
            <div className="demo-history">
              <h3 className="demo-history-title">Recent Commands</h3>
              <div className="demo-history-list">
                {executedCommands.map((cmd, index) => (
                  <div key={`${cmd.id}-${index}`} className="demo-history-item">
                    <div className="demo-history-icon">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="demo-history-content">
                      <div className="demo-history-label">{cmd.label}</div>
                      <div className="demo-history-meta">
                        <span className="demo-history-category">{cmd.category}</span>
                        <span className="demo-history-time">
                          {cmd.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Notification */}
          {showNotification && (
            <div className="demo-notification">
              <Zap className="h-4 w-4" />
              <span>Command executed successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="demo-section">
        <h2 className="demo-section-title">Key Features</h2>
        <div className="demo-features-detailed">
          <div className="demo-feature-detailed">
            <div className="demo-feature-detailed-header">
              <CommandIcon className="h-6 w-6" />
              <h3>40+ Commands</h3>
            </div>
            <p>Access all features through a unified command interface</p>
            <ul className="demo-feature-list">
              <li>Chat operations</li>
              <li>AI model switching</li>
              <li>File import/export</li>
              <li>Theme customization</li>
              <li>Developer tools</li>
            </ul>
          </div>

          <div className="demo-feature-detailed">
            <div className="demo-feature-detailed-header">
              <Search className="h-6 w-6" />
              <h3>Smart Search</h3>
            </div>
            <p>Fuzzy matching finds commands even with typos</p>
            <ul className="demo-feature-list">
              <li>Search by name</li>
              <li>Search by description</li>
              <li>Search by category</li>
              <li>Real-time filtering</li>
            </ul>
          </div>

          <div className="demo-feature-detailed">
            <div className="demo-feature-detailed-header">
              <Zap className="h-6 w-6" />
              <h3>Keyboard Shortcuts</h3>
            </div>
            <p>Full keyboard navigation for power users</p>
            <ul className="demo-feature-list">
              <li>Cmd+K / Ctrl+K to open</li>
              <li>Arrow keys to navigate</li>
              <li>Enter to execute</li>
              <li>Esc to close</li>
            </ul>
          </div>

          <div className="demo-feature-detailed">
            <div className="demo-feature-detailed-header">
              <Palette className="h-6 w-6" />
              <h3>Beautiful Design</h3>
            </div>
            <p>Modern glassmorphism with smooth animations</p>
            <ul className="demo-feature-list">
              <li>Translucent backdrop</li>
              <li>Blur effects</li>
              <li>Smooth transitions</li>
              <li>Accessible contrast</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="demo-section">
        <h2 className="demo-section-title">Command Categories</h2>
        <p className="demo-section-description">
          Commands are organized into logical categories for easy discovery
        </p>
        <div className="demo-categories-grid">
          <div className="demo-category-card">
            <MessageSquare className="h-6 w-6" />
            <h3>Chat</h3>
            <p>4 commands</p>
          </div>
          <div className="demo-category-card">
            <Sparkles className="h-6 w-6" />
            <h3>AI Models</h3>
            <p>3 commands</p>
          </div>
          <div className="demo-category-card">
            <FileText className="h-6 w-6" />
            <h3>File</h3>
            <p>4 commands</p>
          </div>
          <div className="demo-category-card">
            <Palette className="h-6 w-6" />
            <h3>View</h3>
            <p>3 commands</p>
          </div>
          <div className="demo-category-card">
            <Code className="h-6 w-6" />
            <h3>Developer</h3>
            <p>4 commands</p>
          </div>
          <div className="demo-category-card">
            <Settings className="h-6 w-6" />
            <h3>Settings</h3>
            <p>3 commands</p>
          </div>
          <div className="demo-category-card">
            <HelpCircle className="h-6 w-6" />
            <h3>Help</h3>
            <p>3 commands</p>
          </div>
          <div className="demo-category-card">
            <Users className="h-6 w-6" />
            <h3>Social</h3>
            <p>2 commands</p>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="demo-section">
        <h2 className="demo-section-title">Usage Example</h2>
        <div className="demo-code-block">
          <pre><code>{`import { CommandPalette, useCommandPalette } from '@clarity-chat/react'

function App() {
  const { isOpen, toggle, close } = useCommandPalette()

  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      icon: <MessageSquare />,
      shortcut: ['⌘', 'N'],
      category: 'Chat',
      onSelect: () => console.log('New chat'),
    },
    // ... more commands
  ]

  return (
    <>
      <button onClick={toggle}>Open Palette</button>
      <CommandPalette
        items={commands}
        open={isOpen}
        onClose={close}
        aiContext={{
          modelName: 'Claude 3.5 Sonnet',
          tokenUsage: { total: 1234 }
        }}
      />
    </>
  )
}`}</code></pre>
        </div>
      </div>

      {/* Actual CommandPalette Component */}
      <CommandPalette
        items={commands}
        open={isOpen}
        onClose={close}
        placeholder="Type a command or search..."
        aiContext={aiContext}
        aria-label="Command palette"
      />
    </div>
  )
}
