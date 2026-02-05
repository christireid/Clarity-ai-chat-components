/**
 * Search & Navigation Demo
 *
 * Comprehensive demonstration of all search and navigation components:
 * - CommandPalette with keyboard shortcuts
 * - SearchBar with autocomplete
 * - ConversationSearch with filters
 * - MessageSearch with highlights
 * - GlobalSearch with results
 * - FilterPanel with categories
 * - TagCloud with navigation
 * - Breadcrumbs component
 */

import React, { useState, useMemo } from 'react'
import { CommandPalette, type CommandItem } from '@clarity-chat/react'
import { MessageSearch } from '@clarity-chat/react'
// import { ConversationSearch } from '@clarity-chat/react' // Not exported yet
import type { Message } from '@clarity-chat/types'
import './SearchNavigationDemo.css'

// Sample data
const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is TypeScript?',
    timestamp: new Date('2024-01-01T10:00:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
    timestamp: new Date('2024-01-01T10:00:30'),
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I use React hooks?',
    timestamp: new Date('2024-01-01T10:05:00'),
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'React hooks are functions that let you use state and lifecycle features in functional components.',
    timestamp: new Date('2024-01-01T10:05:30'),
  },
  {
    id: '5',
    role: 'user',
    content: 'Can you explain async/await in JavaScript?',
    timestamp: new Date('2024-01-01T10:10:00'),
  },
  {
    id: '6',
    role: 'assistant',
    content:
      'Async/await is syntactic sugar for working with Promises in JavaScript, making asynchronous code look synchronous.',
    timestamp: new Date('2024-01-01T10:10:30'),
  },
]

const sampleConversations = [
  { id: '1', title: 'TypeScript Discussion', lastActive: new Date('2024-01-01') },
  { id: '2', title: 'React Hooks Tutorial', lastActive: new Date('2024-01-02') },
  { id: '3', title: 'JavaScript Async Patterns', lastActive: new Date('2024-01-03') },
  { id: '4', title: 'Node.js Best Practices', lastActive: new Date('2024-01-04') },
  { id: '5', title: 'Python Data Analysis', lastActive: new Date('2024-01-05') },
]

const categories = ['TypeScript', 'React', 'JavaScript', 'Python', 'Node.js', 'Async', 'Hooks']

const tags = [
  'typescript',
  'react',
  'javascript',
  'async',
  'hooks',
  'promises',
  'nodejs',
  'python',
  'data',
  'patterns',
]

interface FilterState {
  categories: string[]
  tags: string[]
  dateRange: 'all' | 'today' | 'week' | 'month'
  role: 'all' | 'user' | 'assistant'
}

export function SearchNavigationDemo() {
  // State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [conversationQuery, setConversationQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(sampleMessages)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    dateRange: 'all',
    role: 'all',
  })
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Home', 'Search & Navigation'])

  // Command palette items
  const commands: CommandItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      description: 'View all search components',
      icon: <span>📊</span>,
      category: 'Navigation',
      onSelect: () => setActiveDemo('overview'),
      shortcut: ['Ctrl', '1'],
    },
    {
      id: 'command-palette',
      label: 'Command Palette',
      description: 'Keyboard-driven command interface',
      icon: <span>⌨️</span>,
      category: 'Search',
      onSelect: () => setActiveDemo('command-palette'),
      shortcut: ['Ctrl', '2'],
    },
    {
      id: 'message-search',
      label: 'Message Search',
      description: 'Search through message history',
      icon: <span>💬</span>,
      category: 'Search',
      onSelect: () => setActiveDemo('message-search'),
      shortcut: ['Ctrl', '3'],
    },
    {
      id: 'conversation-search',
      label: 'Conversation Search',
      description: 'Find conversations quickly',
      icon: <span>🗨️</span>,
      category: 'Search',
      onSelect: () => setActiveDemo('conversation-search'),
      shortcut: ['Ctrl', '4'],
    },
    {
      id: 'filters',
      label: 'Filters',
      description: 'Filter by categories and tags',
      icon: <span>🔍</span>,
      category: 'Navigation',
      onSelect: () => setActiveDemo('filters'),
      shortcut: ['Ctrl', '5'],
    },
    {
      id: 'tags',
      label: 'Tag Cloud',
      description: 'Browse by tags',
      icon: <span>🏷️</span>,
      category: 'Navigation',
      onSelect: () => setActiveDemo('tags'),
      shortcut: ['Ctrl', '6'],
    },
    {
      id: 'breadcrumbs',
      label: 'Breadcrumbs',
      description: 'Navigation trail',
      icon: <span>🧭</span>,
      category: 'Navigation',
      onSelect: () => setActiveDemo('breadcrumbs'),
      shortcut: ['Ctrl', '7'],
    },
    {
      id: 'global-search',
      label: 'Global Search',
      description: 'Search everything',
      icon: <span>🌐</span>,
      category: 'Search',
      onSelect: () => setActiveDemo('global-search'),
      shortcut: ['Ctrl', '8'],
    },
  ]

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    if (!conversationQuery) return sampleConversations
    const query = conversationQuery.toLowerCase()
    return sampleConversations.filter((conv) => conv.title.toLowerCase().includes(query))
  }, [conversationQuery])

  // Apply filters
  const applyFilters = useMemo(() => {
    let filtered = [...sampleMessages]

    if (filters.role !== 'all') {
      filtered = filtered.filter((msg) => msg.role === filters.role)
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((msg) =>
        filters.categories.some((cat) => msg.content.toLowerCase().includes(cat.toLowerCase()))
      )
    }

    return filtered
  }, [filters])

  // Toggle filter
  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      if (type === 'categories' || type === 'tags') {
        const array = prev[type] as string[]
        return {
          ...prev,
          [type]: array.includes(value) ? array.filter((v) => v !== value) : [...array, value],
        }
      }
      return { ...prev, [type]: value }
    })
  }

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="search-navigation-demo">
      {/* Header */}
      <div className="demo-header">
        <h1>Search & Navigation Components</h1>
        <p>Comprehensive search and navigation system with keyboard shortcuts</p>
        <button
          className="open-palette-btn"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open command palette"
        >
          <span>⌨️</span>
          <span>Press Cmd/Ctrl+K</span>
        </button>
      </div>

      {/* Command Palette */}
      <CommandPalette
        items={commands}
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        placeholder="Search commands..."
        enableKeyboardShortcut
        aria-label="Command palette"
      />

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <button
              className="breadcrumb-item"
              onClick={() => {
                if (index === 0) setActiveDemo('overview')
                setBreadcrumbs(breadcrumbs.slice(0, index + 1))
              }}
            >
              {crumb}
            </button>
            {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="demo-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'command-palette', label: 'Command Palette', icon: '⌨️' },
          { id: 'message-search', label: 'Message Search', icon: '💬' },
          { id: 'conversation-search', label: 'Conversation Search', icon: '🗨️' },
          { id: 'filters', label: 'Filters', icon: '🔍' },
          { id: 'tags', label: 'Tags', icon: '🏷️' },
          { id: 'breadcrumbs', label: 'Breadcrumbs', icon: '🧭' },
          { id: 'global-search', label: 'Global Search', icon: '🌐' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeDemo === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveDemo(tab.id)
              setBreadcrumbs([...breadcrumbs.slice(0, 2), tab.label])
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="demo-content">
        {/* Overview */}
        {activeDemo === 'overview' && (
          <div className="overview-section">
            <h2>Search & Navigation Features</h2>
            <div className="feature-grid">
              {[
                {
                  id: 'command-palette',
                  title: 'Command Palette',
                  description: 'Keyboard-driven command interface with fuzzy search',
                  features: [
                    'Cmd/Ctrl+K shortcut',
                    'Fuzzy search',
                    'Grouped categories',
                    'Keyboard navigation',
                  ],
                },
                {
                  id: 'message-search',
                  title: 'Message Search',
                  description: 'Search through message history with highlighting',
                  features: [
                    'Real-time search',
                    'Text highlighting',
                    'Result count',
                    'Search history',
                  ],
                },
                {
                  id: 'conversation-search',
                  title: 'Conversation Search',
                  description: 'Find conversations by title or content',
                  features: ['Instant filtering', 'Recent searches', 'Sort options', 'Quick access'],
                },
                {
                  id: 'filters',
                  title: 'Filter Panel',
                  description: 'Multi-faceted filtering system',
                  features: ['Category filters', 'Date ranges', 'Role filters', 'Tag filtering'],
                },
              ].map((feature) => (
                <div key={feature.id} className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul>
                    {feature.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveDemo(feature.id)} className="try-btn">
                    Try it →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Command Palette Demo */}
        {activeDemo === 'command-palette' && (
          <div className="command-palette-section">
            <h2>Command Palette</h2>
            <p>Press Cmd/Ctrl+K anywhere to open the command palette</p>

            <div className="demo-box">
              <h3>Features:</h3>
              <ul>
                <li>✨ Fuzzy search across all commands</li>
                <li>⌨️ Keyboard shortcuts for quick access</li>
                <li>📁 Organized by categories</li>
                <li>🎯 Arrow key navigation</li>
                <li>↵ Enter to execute</li>
                <li>⎋ Escape to close</li>
              </ul>

              <button onClick={() => setCommandPaletteOpen(true)} className="demo-action-btn">
                Open Command Palette
              </button>
            </div>

            <div className="command-list">
              <h3>Available Commands:</h3>
              {commands.map((cmd) => (
                <div key={cmd.id} className="command-item-display">
                  <div className="command-info">
                    <span className="command-icon">{cmd.icon}</span>
                    <div>
                      <strong>{cmd.label}</strong>
                      <p>{cmd.description}</p>
                    </div>
                  </div>
                  {cmd.shortcut && (
                    <div className="shortcut-display">
                      {cmd.shortcut.map((key, i) => (
                        <kbd key={i}>{key}</kbd>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Search Demo */}
        {activeDemo === 'message-search' && (
          <div className="message-search-section">
            <h2>Message Search</h2>
            <p>Search through your message history with real-time highlighting</p>

            <div className="search-demo">
              <MessageSearch
                messages={sampleMessages}
                onResultsChange={setFilteredMessages}
                onMessageSelect={setSelectedMessage}
                enableKeyboardShortcut
                showShortcutHint
                showResultCount
                enableHistory
                highlightMatches
              />

              <div className="search-results">
                <h3>Results ({filteredMessages.length})</h3>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-result ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="message-header">
                      <span className={`role-badge ${msg.role}`}>{msg.role}</span>
                      <span className="timestamp">
                        {msg.timestamp?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="message-content">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation Search Demo - Commented out until ConversationSearch is exported */}
        {/* {activeDemo === 'conversation-search' && (
          <div className="conversation-search-section">
            <h2>Conversation Search</h2>
            <p>Find conversations quickly by title</p>

            <ConversationSearch
              searchQuery={conversationQuery}
              onSearchChange={setConversationQuery}
            />

            <div className="conversation-list">
              {filteredConversations.map((conv) => (
                <div key={conv.id} className="conversation-item">
                  <h3>{conv.title}</h3>
                  <p>Last active: {conv.lastActive.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Filters Demo */}
        {activeDemo === 'filters' && (
          <div className="filters-section">
            <h2>Filter Panel</h2>
            <p>Combine multiple filters to narrow down results</p>

            <div className="filter-panel">
              {/* Category Filters */}
              <div className="filter-group">
                <h3>Categories</h3>
                <div className="filter-options">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`filter-chip ${filters.categories.includes(category) ? 'active' : ''}`}
                      onClick={() => toggleFilter('categories', category)}
                    >
                      {category}
                      {filters.categories.includes(category) && <span className="check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div className="filter-group">
                <h3>Role</h3>
                <div className="filter-options">
                  {(['all', 'user', 'assistant'] as const).map((role) => (
                    <button
                      key={role}
                      className={`filter-chip ${filters.role === role ? 'active' : ''}`}
                      onClick={() => toggleFilter('role', role)}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(filters.categories.length > 0 || filters.role !== 'all') && (
                <div className="active-filters">
                  <h4>Active Filters:</h4>
                  <div className="filter-pills">
                    {filters.categories.map((cat) => (
                      <span key={cat} className="filter-pill">
                        {cat}
                        <button onClick={() => toggleFilter('categories', cat)}>×</button>
                      </span>
                    ))}
                    {filters.role !== 'all' && (
                      <span className="filter-pill">
                        Role: {filters.role}
                        <button onClick={() => toggleFilter('role', 'all')}>×</button>
                      </span>
                    )}
                  </div>
                  <button
                    className="clear-filters-btn"
                    onClick={() =>
                      setFilters({ categories: [], tags: [], dateRange: 'all', role: 'all' })
                    }
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Filtered Results */}
            <div className="filtered-results">
              <h3>Filtered Messages ({applyFilters.length})</h3>
              {applyFilters.map((msg) => (
                <div key={msg.id} className="message-result">
                  <div className="message-header">
                    <span className={`role-badge ${msg.role}`}>{msg.role}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tag Cloud Demo */}
        {activeDemo === 'tags' && (
          <div className="tags-section">
            <h2>Tag Cloud</h2>
            <p>Browse content by tags</p>

            <div className="tag-cloud">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-item ${filters.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleFilter('tags', tag)}
                  style={{
                    fontSize: `${0.875 + Math.random() * 0.5}rem`,
                    opacity: filters.tags.includes(tag) ? 1 : 0.7,
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {filters.tags.length > 0 && (
              <div className="selected-tags">
                <h3>Selected Tags:</h3>
                <div className="tag-list">
                  {filters.tags.map((tag) => (
                    <span key={tag} className="selected-tag">
                      #{tag}
                      <button onClick={() => toggleFilter('tags', tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Breadcrumbs Demo */}
        {activeDemo === 'breadcrumbs' && (
          <div className="breadcrumbs-section">
            <h2>Breadcrumbs Navigation</h2>
            <p>Shows the current navigation path</p>

            <div className="breadcrumbs-demo">
              <div className="demo-breadcrumbs-large">
                {['Home', 'Docs', 'Components', 'Search', 'Message Search'].map((crumb, i, arr) => (
                  <React.Fragment key={i}>
                    <button className="breadcrumb-link">{crumb}</button>
                    {i < arr.length - 1 && <span className="separator">›</span>}
                  </React.Fragment>
                ))}
              </div>

              <h3>Interactive Example:</h3>
              <p>Current path reflects your navigation through the demo</p>
            </div>
          </div>
        )}

        {/* Global Search Demo */}
        {activeDemo === 'global-search' && (
          <div className="global-search-section">
            <h2>Global Search</h2>
            <p>Search across all content types</p>

            <div className="global-search-box">
              <input
                type="search"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="global-search-input"
              />

              {searchQuery && (
                <div className="global-results">
                  <div className="results-section">
                    <h3>Messages ({filteredMessages.length})</h3>
                    {filteredMessages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="result-item">
                        <span className={`badge ${msg.role}`}>{msg.role}</span>
                        <p>{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="results-section">
                    <h3>Conversations ({filteredConversations.length})</h3>
                    {filteredConversations.slice(0, 3).map((conv) => (
                      <div key={conv.id} className="result-item">
                        <h4>{conv.title}</h4>
                        <p>Last active: {conv.lastActive.toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="keyboard-shortcuts-help">
        <h3>Keyboard Shortcuts</h3>
        <div className="shortcuts-grid">
          <div className="shortcut">
            <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd>
            <span>Open Command Palette</span>
          </div>
          <div className="shortcut">
            <kbd>↑</kbd> <kbd>↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="shortcut">
            <kbd>↵</kbd>
            <span>Select</span>
          </div>
          <div className="shortcut">
            <kbd>Esc</kbd>
            <span>Close/Clear</span>
          </div>
        </div>
      </div>
    </div>
  )
}
