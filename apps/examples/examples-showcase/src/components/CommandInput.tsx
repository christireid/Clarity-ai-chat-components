/**
 * Command Input Component
 *
 * Enhanced chat input with slash command detection and execution
 */

import React, { useState, useRef, useEffect } from 'react'
import { CommandPalette, Command } from './CommandPalette'
import './CommandInput.css'

interface CommandInputProps {
  onSendMessage: (message: string) => void
  commands: Command[]
  placeholder?: string
  disabled?: boolean
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onSendMessage,
  commands,
  placeholder = 'Type a message or / for commands...',
  disabled = false,
}) => {
  const [value, setValue] = useState('')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 })
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect slash command
  useEffect(() => {
    if (value.startsWith('/')) {
      const query = value.slice(1) // Remove the '/'
      setCommandQuery(query)

      if (!showCommandPalette && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setPalettePosition({
          top: rect.top - 20, // Position above input
          left: rect.left,
        })
        setShowCommandPalette(true)
      }
    } else if (showCommandPalette) {
      setShowCommandPalette(false)
      setCommandQuery('')
    }
  }, [value, showCommandPalette])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }

  // Handle send
  const handleSend = () => {
    if (value.trim() && !value.startsWith('/')) {
      onSendMessage(value.trim())
      setValue('')

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey && !showCommandPalette) {
      e.preventDefault()
      handleSend()
    }

    // Close command palette on Escape
    if (e.key === 'Escape' && showCommandPalette) {
      e.preventDefault()
      setShowCommandPalette(false)
      setValue('')
    }
  }

  // Close command palette
  const handleCloseCommandPalette = () => {
    setShowCommandPalette(false)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <>
      <div ref={containerRef} className="command-input-container">
        <div className="command-input-wrapper">
          <textarea
            ref={inputRef}
            className="command-input"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
          />

          <div className="command-input-actions">
            {value.startsWith('/') && (
              <div className="command-hint">
                <span className="command-hint-icon">⚡</span>
                <span className="command-hint-text">Command mode</span>
              </div>
            )}

            <button
              className="command-input-send"
              onClick={handleSend}
              disabled={disabled || !value.trim() || value.startsWith('/')}
              aria-label="Send message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="command-input-footer">
          <div className="command-input-hints">
            <kbd>/</kbd> for commands
            <span className="separator">•</span>
            <kbd>Enter</kbd> to send
            <span className="separator">•</span>
            <kbd>Shift + Enter</kbd> for new line
          </div>
        </div>
      </div>

      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={handleCloseCommandPalette}
          commands={commands}
          position={palettePosition}
          searchQuery={commandQuery}
        />
      )}
    </>
  )
}
