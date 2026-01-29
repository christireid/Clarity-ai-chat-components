/**
 * CommandPalette + Keyboard Hooks Integration Tests
 *
 * Tests the complete integration of CommandPalette with keyboard hooks,
 * focus management, and accessibility features in a real-world scenario.
 *
 * @integration-test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@clarity-chat/react/components/navigation/CommandPalette'
import type { CommandItem, AIContext } from '@clarity-chat/react/components/navigation/CommandPalette'
import React, { useState, useEffect } from 'react'

// ============================================================================
// Test Component - Simulates Real App Usage
// ============================================================================

interface AppWithCommandPaletteProps {
  onCommandExecute?: (commandId: string) => void
  initialOpen?: boolean
  commands?: CommandItem[]
  aiContext?: AIContext
}

function AppWithCommandPalette({
  onCommandExecute,
  initialOpen = false,
  commands,
  aiContext,
}: AppWithCommandPaletteProps) {
  const [open, setOpen] = useState(initialOpen)
  const [selectedModel, setSelectedModel] = useState('Claude 3.5 Sonnet')
  const [messages, setMessages] = useState<string[]>([])
  const [conversationId, setConversationId] = useState('conv-123')

  // Simulate global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const defaultCommands: CommandItem[] = commands || [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'AI',
      shortcut: ['Cmd', 'N'],
      onSelect: () => {
        setMessages([])
        setConversationId(`conv-${Date.now()}`)
        onCommandExecute?.('new-chat')
      },
    },
    {
      id: 'save-conversation',
      label: 'Save Conversation',
      description: 'Save current chat',
      category: 'File',
      shortcut: ['Cmd', 'S'],
      onSelect: () => {
        onCommandExecute?.('save-conversation')
      },
    },
    {
      id: 'change-model-gpt4',
      label: 'Change to GPT-4',
      description: 'Switch to GPT-4 model',
      category: 'AI',
      onSelect: () => {
        setSelectedModel('GPT-4')
        onCommandExecute?.('change-model-gpt4')
      },
    },
    {
      id: 'change-model-claude',
      label: 'Change to Claude',
      description: 'Switch to Claude 3.5 Sonnet',
      category: 'AI',
      onSelect: () => {
        setSelectedModel('Claude 3.5 Sonnet')
        onCommandExecute?.('change-model-claude')
      },
    },
    {
      id: 'export-markdown',
      label: 'Export as Markdown',
      description: 'Export conversation to .md file',
      category: 'File',
      shortcut: ['Cmd', 'E'],
      onSelect: () => {
        onCommandExecute?.('export-markdown')
      },
    },
  ]

  const contextInfo: AIContext = aiContext || {
    modelName: selectedModel,
    conversationId,
    tokenUsage: {
      input: 1500,
      output: 800,
      total: 2300,
    },
  }

  return (
    <div>
      <div data-testid="app-state">
        <div data-testid="current-model">{selectedModel}</div>
        <div data-testid="conversation-id">{conversationId}</div>
        <div data-testid="message-count">{messages.length}</div>
      </div>

      <button onClick={() => setOpen(true)} data-testid="open-palette-button">
        Open Command Palette (⌘K)
      </button>

      <CommandPalette
        items={defaultCommands}
        open={open}
        onClose={() => setOpen(false)}
        aiContext={contextInfo}
        placeholder="Search commands..."
        aria-label="Command palette for AI chat"
      />
    </div>
  )
}

// ============================================================================
// Integration Tests
// ============================================================================

describe('CommandPalette + Keyboard Hooks Integration', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Cleanup any lingering event listeners
    const events = ['keydown', 'keyup', 'keypress']
    events.forEach((event) => {
      window.removeEventListener(event, () => {})
    })
  })

  describe('Global Keyboard Shortcuts', () => {
    it('opens palette with Cmd+K shortcut', async () => {
      render(<AppWithCommandPalette />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Trigger Cmd+K (or Ctrl+K)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('toggles palette open/close with repeated Cmd+K', async () => {
      render(<AppWithCommandPalette />)

      // Open with Cmd+K
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Close with Cmd+K again
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('closes palette with Escape key', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates through commands with Arrow keys', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // Get the input (combobox)
      const input = screen.getByRole('combobox')
      expect(input).toBeInTheDocument()

      // Press ArrowDown multiple times
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      await waitFor(() => {
        // First item should be selected
        const firstOption = screen.getAllByRole('option')[0]
        expect(firstOption).toHaveAttribute('aria-selected', 'true')
      })

      fireEvent.keyDown(document, { key: 'ArrowDown' })
      await waitFor(() => {
        // Second item should be selected
        const secondOption = screen.getAllByRole('option')[1]
        expect(secondOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('navigates backwards with ArrowUp', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Navigate down first
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      await waitFor(() => {
        const secondOption = screen.getAllByRole('option')[1]
        expect(secondOption).toHaveAttribute('aria-selected', 'true')
      })

      // Navigate back up
      fireEvent.keyDown(document, { key: 'ArrowUp' })

      await waitFor(() => {
        const firstOption = screen.getAllByRole('option')[0]
        expect(firstOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('jumps to first item with Home key', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Navigate to middle item
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // Press Home
      fireEvent.keyDown(document, { key: 'Home' })

      await waitFor(() => {
        const firstOption = screen.getAllByRole('option')[0]
        expect(firstOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('jumps to last item with End key', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Press End
      fireEvent.keyDown(document, { key: 'End' })

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        const lastOption = options[options.length - 1]
        expect(lastOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('executes selected command with Enter key', async () => {
      const onExecute = vi.fn()
      render(<AppWithCommandPalette initialOpen={true} onCommandExecute={onExecute} />)

      // Navigate to a command
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      await waitFor(() => {
        const firstOption = screen.getAllByRole('option')[0]
        expect(firstOption).toHaveAttribute('aria-selected', 'true')
      })

      // Execute with Enter
      fireEvent.keyDown(document, { key: 'Enter' })

      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith('new-chat')
      })
    })
  })

  describe('Search + Keyboard Navigation', () => {
    it('filters commands while maintaining keyboard navigation', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const input = screen.getByRole('combobox')

      // Type search query
      await user.type(input, 'model')

      // Wait for debounced search
      await waitFor(() => {
        const options = screen.getAllByRole('option')
        // Should only show model-related commands
        expect(options.length).toBeLessThan(5)
        expect(screen.getByText('Change to GPT-4')).toBeInTheDocument()
        expect(screen.getByText('Change to Claude')).toBeInTheDocument()
      })

      // Navigate through filtered results
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      await waitFor(() => {
        const firstOption = screen.getAllByRole('option')[0]
        expect(firstOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('clears search and restores all commands', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const input = screen.getByRole('combobox')

      // Search for something
      await user.type(input, 'model')

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBeLessThan(5)
      })

      // Clear search
      const clearButton = screen.getByLabelText('Clear search')
      await user.click(clearButton)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(5) // All commands
      })
    })
  })

  describe('Focus Management', () => {
    it('focuses input when palette opens', async () => {
      render(<AppWithCommandPalette />)

      const button = screen.getByTestId('open-palette-button')
      await user.click(button)

      await waitFor(() => {
        const input = screen.getByRole('combobox')
        expect(input).toHaveFocus()
      })
    })

    it('restores focus when palette closes', async () => {
      render(<AppWithCommandPalette />)

      const button = screen.getByTestId('open-palette-button')
      button.focus()
      expect(button).toHaveFocus()

      // Open palette
      await user.click(button)

      await waitFor(() => {
        const input = screen.getByRole('combobox')
        expect(input).toHaveFocus()
      })

      // Close palette
      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(button).toHaveFocus()
      })
    })

    it('traps focus within dialog', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // Verify combobox is focusable
      const input = screen.getByRole('combobox')
      expect(input).toBeInTheDocument()

      // Tab through focusable elements (should stay within dialog)
      fireEvent.keyDown(input, { key: 'Tab' })

      // Focus should remain within dialog boundaries
      const focusedElement = document.activeElement
      expect(dialog.contains(focusedElement)).toBe(true)
    })
  })

  describe('AI Context Integration', () => {
    it('displays AI context information', () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Check for model name
      expect(screen.getByText(/Claude 3\.5 Sonnet/i)).toBeInTheDocument()

      // Check for conversation ID
      expect(screen.getByText(/conv-123/i)).toBeInTheDocument()

      // Check for token usage
      expect(screen.getByText(/2,300 tokens/i)).toBeInTheDocument()
    })

    it('updates context when model changes', async () => {
      const onExecute = vi.fn()
      render(<AppWithCommandPalette initialOpen={true} onCommandExecute={onExecute} />)

      // Initially shows Claude
      expect(screen.getByText(/Claude 3\.5 Sonnet/i)).toBeInTheDocument()

      // Search for GPT-4
      const input = screen.getByRole('combobox')
      await user.type(input, 'gpt')

      await waitFor(() => {
        expect(screen.getByText('Change to GPT-4')).toBeInTheDocument()
      })

      // Select GPT-4 command
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'Enter' })

      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith('change-model-gpt4')
      })
    })
  })

  describe('Real App Workflow', () => {
    it('completes full command execution workflow', async () => {
      const onExecute = vi.fn()
      render(<AppWithCommandPalette onCommandExecute={onExecute} />)

      // 1. Open with button
      const button = screen.getByTestId('open-palette-button')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // 2. Search for command
      const input = screen.getByRole('combobox')
      await user.type(input, 'new chat')

      await waitFor(() => {
        expect(screen.getByText('New Chat')).toBeInTheDocument()
      })

      // 3. Navigate with keyboard
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // 4. Execute with Enter
      fireEvent.keyDown(document, { key: 'Enter' })

      // 5. Verify command executed and palette closed
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith('new-chat')
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('handles rapid keyboard navigation', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Rapid arrow key presses
      for (let i = 0; i < 10; i++) {
        fireEvent.keyDown(document, { key: 'ArrowDown' })
      }

      // Should wrap around and handle gracefully
      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.some((opt) => opt.getAttribute('aria-selected') === 'true')).toBe(true)
      })
    })

    it('handles mouse and keyboard interaction together', async () => {
      const onExecute = vi.fn()
      render(<AppWithCommandPalette initialOpen={true} onCommandExecute={onExecute} />)

      // Start with keyboard navigation
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      await waitFor(() => {
        const secondOption = screen.getAllByRole('option')[1]
        expect(secondOption).toHaveAttribute('aria-selected', 'true')
      })

      // Then click a different command with mouse
      const exportCommand = screen.getByText('Export as Markdown')
      await user.click(exportCommand)

      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith('export-markdown')
      })
    })
  })

  describe('Accessibility', () => {
    it('announces filtered results to screen readers', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const input = screen.getByRole('combobox')

      // Type search query
      await user.type(input, 'model')

      // Wait for announcement
      await waitFor(() => {
        const liveRegion = screen.getByText(/commands available/i)
        expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('properly labels all interactive elements', () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      // Check combobox
      const input = screen.getByRole('combobox')
      expect(input).toHaveAttribute('aria-controls')
      expect(input).toHaveAttribute('aria-expanded', 'true')

      // Check dialog
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-label')

      // Check listbox
      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()
    })

    it('maintains aria-activedescendant during navigation', async () => {
      render(<AppWithCommandPalette initialOpen={true} />)

      const input = screen.getByRole('combobox')

      // Navigate down
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      await waitFor(() => {
        const activedescendant = input.getAttribute('aria-activedescendant')
        expect(activedescendant).toBeTruthy()

        // Verify the referenced element exists and is selected
        const selectedElement = document.getElementById(activedescendant!)
        expect(selectedElement).toHaveAttribute('aria-selected', 'true')
      })
    })
  })

  describe('Performance', () => {
    it('handles large command lists efficiently', async () => {
      const largeCommandList: CommandItem[] = Array.from({ length: 100 }, (_, i) => ({
        id: `cmd-${i}`,
        label: `Command ${i}`,
        description: `Description for command ${i}`,
        category: i % 2 === 0 ? 'AI' : 'File',
        onSelect: vi.fn(),
      }))

      render(
        <AppWithCommandPalette
          initialOpen={true}
          commands={largeCommandList}
        />
      )

      const input = screen.getByRole('combobox')

      // Type search - should filter quickly
      const startTime = performance.now()
      await user.type(input, '50')

      await waitFor(() => {
        const filtered = screen.getAllByRole('option')
        expect(filtered.length).toBeGreaterThan(0)
      })

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete in under 1 second even with 100 items
      expect(duration).toBeLessThan(1000)
    })

    it('debounces search input correctly', async () => {
      const onExecute = vi.fn()
      render(<AppWithCommandPalette initialOpen={true} onCommandExecute={onExecute} />)

      const input = screen.getByRole('combobox')

      // Type rapidly
      await user.type(input, 'save')

      // Should debounce and only filter once
      await waitFor(() => {
        expect(screen.getByText('Save Conversation')).toBeInTheDocument()
      })

      // Verify filtered results are correct
      const options = screen.getAllByRole('option')
      expect(options.length).toBeLessThan(5)
    })
  })
})
