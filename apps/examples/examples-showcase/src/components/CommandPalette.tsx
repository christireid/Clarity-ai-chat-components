/**
 * Command Palette Component
 *
 * A glassmorphism command palette for executing slash commands
 * Features: search, filtering, keyboard navigation, command execution
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import './CommandPalette.css'

export interface Command {
  id: string
  label: string
  description: string
  icon: string
  category: 'chat' | 'settings' | 'view' | 'help'
  action: () => void
  shortcut?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
  position: { top: number; left: number }
  searchQuery: string
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  position,
  searchQuery: initialQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const paletteRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery) return commands

    const query = searchQuery.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
    )
  }, [commands, searchQuery])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSearchQuery(initialQuery)
    }
  }, [isOpen, initialQuery])

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          )
          break

        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break

        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break

        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const executeCommand = (command: Command) => {
    command.action()
    onClose()
  }

  if (!isOpen) return null

  const categoryLabels: Record<string, string> = {
    chat: '💬 Chat Actions',
    settings: '⚙️ Settings',
    view: '👁️ View',
    help: '❓ Help',
  }

  return (
    <div
      className="command-palette-overlay"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div ref={paletteRef} className="command-palette">
        {/* Search Input */}
        <div className="command-palette-header">
          <div className="search-icon">🔍</div>
          <input
            ref={inputRef}
            type="text"
            className="command-palette-search"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedIndex(0)
            }}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="command-palette-hint">ESC to close</kbd>
        </div>

        {/* Command List */}
        <div className="command-palette-body">
          {filteredCommands.length === 0 ? (
            <div className="command-palette-empty">
              <span className="empty-icon">🔍</span>
              <p>No commands found</p>
              <small>Try a different search term</small>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category} className="command-category">
                <div className="command-category-label">
                  {categoryLabels[category]}
                </div>
                {categoryCommands.map((command, idx) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  return (
                    <button
                      key={command.id}
                      ref={(el) => (itemRefs.current[globalIndex] = el)}
                      className={`command-item ${
                        selectedIndex === globalIndex ? 'selected' : ''
                      }`}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="command-item-icon">{command.icon}</div>
                      <div className="command-item-content">
                        <div className="command-item-label">{command.label}</div>
                        <div className="command-item-description">
                          {command.description}
                        </div>
                      </div>
                      {command.shortcut && (
                        <kbd className="command-item-shortcut">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="command-palette-footer">
          <div className="keyboard-hints">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> Navigate
            </span>
            <span>
              <kbd>↵</kbd> Select
            </span>
            <span>
              <kbd>ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
