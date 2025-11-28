/**
 * Tests for History Manager Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  HistoryManager,
  HistoryMessageRow,
  TokenUsageBar,
  HistoryToolbar,
  type HistoryMessage,
} from '../history-manager'

// Sample messages for testing
const createMessages = (count: number): HistoryMessage[] => {
  const messages: HistoryMessage[] = []
  for (let i = 0; i < count; i++) {
    messages.push({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i} content with some text to generate tokens.`,
      timestamp: new Date(Date.now() - i * 60000),
    })
  }
  return messages
}

describe('HistoryManager', () => {
  describe('rendering', () => {
    it('should render empty state when no messages', () => {
      const onChange = vi.fn()
      render(
        <HistoryManager
          messages={[]}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      expect(screen.getByText('No messages in history')).toBeDefined()
    })

    it('should render messages with token counts', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
          showTokenCounts={true}
        />
      )

      // Should show all messages
      expect(screen.getByText(/Message 0 content/)).toBeDefined()
      expect(screen.getByText(/Message 1 content/)).toBeDefined()
      expect(screen.getByText(/Message 2 content/)).toBeDefined()

      // Should show role badges
      expect(screen.getAllByText('User').length).toBeGreaterThan(0)
      expect(screen.getAllByText('AI').length).toBeGreaterThan(0)
    })

    it('should show token usage bar', () => {
      const messages = createMessages(5)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={1000}
          currentTokens={500}
        />
      )

      expect(screen.getByText('500 / 1,000 tokens')).toBeDefined()
      expect(screen.getByText('50.0%')).toBeDefined()
    })

    it('should show message count summary', () => {
      const messages = createMessages(5)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      expect(screen.getByText(/5 messages/)).toBeDefined()
    })
  })

  describe('selection', () => {
    it('should allow selecting individual messages', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      // First checkbox is "select all", rest are message checkboxes
      const messageCheckbox = checkboxes[1]!

      fireEvent.click(messageCheckbox)

      expect(messageCheckbox).toBeChecked()
    })

    it('should show selected count in toolbar', () => {
      const messages = createMessages(5)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      // Initially none selected
      expect(screen.getByText('0 of 5 selected')).toBeDefined()

      // Select one message
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1]!)

      expect(screen.getByText('1 of 5 selected')).toBeDefined()
    })

    it('should support select all', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      const selectAllCheckbox = screen.getByLabelText('Select all messages')
      fireEvent.click(selectAllCheckbox)

      expect(screen.getByText('3 of 3 selected')).toBeDefined()
    })
  })

  describe('deletion', () => {
    it('should delete selected messages', () => {
      const messages = createMessages(5)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      // Select first two messages
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1]!)
      fireEvent.click(checkboxes[2]!)

      // Click delete selected
      const deleteButton = screen.getByText(/Delete Selected \(2\)/)
      fireEvent.click(deleteButton)

      expect(onChange).toHaveBeenCalled()
      const newMessages = onChange.mock.calls[0]![0] as HistoryMessage[]
      expect(newMessages.length).toBe(3)
    })

    it('should call onPrune when messages are deleted', () => {
      const messages = createMessages(5)
      const onChange = vi.fn()
      const onPrune = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          onPrune={onPrune}
          maxTokens={4096}
        />
      )

      // Select and delete one message
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1]!)

      const deleteButton = screen.getByText(/Delete Selected \(1\)/)
      fireEvent.click(deleteButton)

      expect(onPrune).toHaveBeenCalledWith(1, expect.any(Number))
    })

    it('should handle keep last N messages', () => {
      const messages = createMessages(10)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      // Open keep last dropdown
      const keepLastButton = screen.getByText('Keep Last...')
      fireEvent.click(keepLastButton)

      // Select keep last 5
      const keepLast5 = screen.getByText('Keep last 5 messages')
      fireEvent.click(keepLast5)

      expect(onChange).toHaveBeenCalled()
      const newMessages = onChange.mock.calls[0]![0] as HistoryMessage[]
      expect(newMessages.length).toBe(5)
    })

    it('should require confirmation for clear all', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      // Click clear all
      const clearButton = screen.getByText('Clear All')
      fireEvent.click(clearButton)

      // Should show confirmation
      expect(screen.getByText('Clear all?')).toBeDefined()

      // Confirm
      const yesButton = screen.getByText('Yes')
      fireEvent.click(yesButton)

      expect(onChange).toHaveBeenCalledWith([])
    })

    it('should cancel clear all when clicking No', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
        />
      )

      // Click clear all
      const clearButton = screen.getByText('Clear All')
      fireEvent.click(clearButton)

      // Cancel
      const noButton = screen.getByText('No')
      fireEvent.click(noButton)

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('compact mode', () => {
    it('should truncate content in compact mode', () => {
      const messages: HistoryMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'A'.repeat(200), // Long content
        },
      ]
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
          compact={true}
        />
      )

      // Content should be truncated
      const content = screen.getByText(/A+\.\.\./)
      expect(content.textContent!.length).toBeLessThan(200)
    })
  })

  describe('options', () => {
    it('should hide bulk delete when allowBulkDelete is false', () => {
      const messages = createMessages(3)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
          allowBulkDelete={false}
        />
      )

      expect(screen.queryByText('Delete Selected')).toBeNull()
      expect(screen.queryByText('Keep Last...')).toBeNull()
      expect(screen.queryByText('Clear All')).toBeNull()
    })

    it('should hide token counts in message rows when showTokenCounts is false', () => {
      const messages = createMessages(1)
      const onChange = vi.fn()

      render(
        <HistoryManager
          messages={messages}
          onMessagesChange={onChange}
          maxTokens={4096}
          showTokenCounts={false}
        />
      )

      // Individual message rows should not show "X tokens" (e.g., "10 tokens")
      // But the TokenUsageBar still shows "X / Y tokens" which is expected
      // The pattern "X tokens" (without slash) appears only in message rows
      const individualTokenCount = screen.queryByText(/^\d+ tokens$/)
      expect(individualTokenCount).toBeNull()
    })
  })
})

describe('TokenUsageBar', () => {
  it('should show correct percentage', () => {
    render(
      <TokenUsageBar
        current={500}
        max={1000}
        warningThreshold={0.8}
        criticalThreshold={0.95}
      />
    )

    expect(screen.getByText('50.0%')).toBeDefined()
    expect(screen.getByText('500 / 1,000 tokens')).toBeDefined()
  })

  it('should show warning at warning threshold', () => {
    render(
      <TokenUsageBar
        current={850}
        max={1000}
        warningThreshold={0.8}
        criticalThreshold={0.95}
      />
    )

    // Should have yellow color class (warning)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-yellow-500')
  })

  it('should show critical warning at critical threshold', () => {
    render(
      <TokenUsageBar
        current={960}
        max={1000}
        warningThreshold={0.8}
        criticalThreshold={0.95}
      />
    )

    expect(screen.getByText(/Critical/)).toBeDefined()
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-red-500')
  })

  it('should cap at 100%', () => {
    render(
      <TokenUsageBar
        current={1500}
        max={1000}
        warningThreshold={0.8}
        criticalThreshold={0.95}
      />
    )

    expect(screen.getByText('100.0%')).toBeDefined()
  })
})

describe('HistoryToolbar', () => {
  it('should show selection count', () => {
    render(
      <HistoryToolbar
        selectedCount={3}
        totalCount={10}
        onDeleteSelected={vi.fn()}
        onKeepLast={vi.fn()}
        onClear={vi.fn()}
      />
    )

    expect(screen.getByText('3 of 10 selected')).toBeDefined()
  })

  it('should disable delete when none selected', () => {
    render(
      <HistoryToolbar
        selectedCount={0}
        totalCount={10}
        onDeleteSelected={vi.fn()}
        onKeepLast={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const deleteButton = screen.getByText(/Delete Selected/)
    expect(deleteButton).toBeDisabled()
  })

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <HistoryToolbar
        selectedCount={5}
        totalCount={10}
        onDeleteSelected={vi.fn()}
        onKeepLast={vi.fn()}
        onClear={vi.fn()}
        disabled={true}
      />
    )

    const deleteButton = screen.getByText(/Delete Selected/)
    const keepLastButton = screen.getByText('Keep Last...')
    const clearButton = screen.getByText('Clear All')

    expect(deleteButton).toBeDisabled()
    expect(keepLastButton).toBeDisabled()
    expect(clearButton).toBeDisabled()
  })
})

describe('HistoryMessageRow', () => {
  const defaultProps = {
    message: {
      id: '1',
      role: 'user' as const,
      content: 'Test message content',
      timestamp: new Date(),
    },
    tokenCount: 10,
    selected: false,
    onSelect: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render message content', () => {
    render(<HistoryMessageRow {...defaultProps} />)
    expect(screen.getByText('Test message content')).toBeDefined()
  })

  it('should show role badge', () => {
    render(<HistoryMessageRow {...defaultProps} />)
    expect(screen.getByText('User')).toBeDefined()
  })

  it('should show token count', () => {
    render(<HistoryMessageRow {...defaultProps} showTokenCount={true} />)
    expect(screen.getByText('10 tokens')).toBeDefined()
  })

  it('should call onSelect when checkbox clicked', () => {
    const onSelect = vi.fn()
    render(<HistoryMessageRow {...defaultProps} onSelect={onSelect} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onSelect).toHaveBeenCalledWith(true)
  })

  it('should call onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<HistoryMessageRow {...defaultProps} onDelete={onDelete} />)

    const deleteButton = screen.getByLabelText('Delete message from user')
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalled()
  })

  it('should highlight when selected', () => {
    const { container } = render(<HistoryMessageRow {...defaultProps} selected={true} />)
    const row = container.firstChild as HTMLElement
    expect(row.className).toContain('bg-accent')
  })

  it('should truncate long content in compact mode', () => {
    const longContent = 'A'.repeat(200)
    render(
      <HistoryMessageRow
        {...defaultProps}
        message={{ ...defaultProps.message, content: longContent }}
        compact={true}
      />
    )

    const content = screen.getByText(/A+\.\.\./)
    expect(content.textContent!.length).toBeLessThan(200)
  })
})
