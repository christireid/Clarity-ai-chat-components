/**
 * ContextMentionInput Tests
 *
 * Tests for @mention integration with context providers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContextMentionInput } from '../ContextMentionInput'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type { ContextProvider, ContextItem } from '../../../hooks/prompt-composer/types'

// Mock context providers
const mockFileProvider: ContextProvider = {
  type: 'file',
  search: vi.fn(async (query: string) => {
    const files = [
      {
        id: 'file1',
        type: 'file' as const,
        label: 'Button.tsx',
        description: 'src/components/Button.tsx',
        summary: 'Button component - 250 lines',
      },
      {
        id: 'file2',
        type: 'file' as const,
        label: 'Input.tsx',
        description: 'src/components/Input.tsx',
        summary: 'Input component - 180 lines',
      },
    ]

    return files
      .filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
      .map((f) => createContextItem(f))
  }),
  priority: 80,
}

const mockDocProvider: ContextProvider = {
  type: 'doc',
  search: vi.fn(async (query: string) => {
    const docs = [
      {
        id: 'doc1',
        type: 'doc' as const,
        label: 'API Reference',
        description: '/docs/api',
        summary: 'API Reference - Complete documentation',
      },
    ]

    return docs
      .filter((d) => d.label.toLowerCase().includes(query.toLowerCase()))
      .map((d) => createContextItem(d))
  }),
  priority: 60,
}

const mockUserProvider: ContextProvider = {
  type: 'user',
  search: vi.fn(async (query: string) => {
    const users = [
      {
        id: 'user1',
        type: 'user' as const,
        label: 'sarah',
        description: 'Sarah Chen - Senior Engineer',
        summary: '@sarah - Senior Engineer',
      },
    ]

    return users
      .filter((u) => u.label.toLowerCase().includes(query.toLowerCase()))
      .map((u) => createContextItem(u))
  }),
  priority: 40,
}

describe('ContextMentionInput', () => {
  const mockOnChange = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests
  // ==========================================================================

  it('renders input field', () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
        placeholder="Type @ to mention..."
      />
    )

    expect(screen.getByPlaceholderText('Type @ to mention...')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
        disabled
      />
    )

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  // ==========================================================================
  // Provider Selection Tests
  // ==========================================================================

  it('shows provider suggestions when @ is typed', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider, mockDocProvider, mockUserProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@', selectionStart: 1 } })

    await waitFor(() => {
      expect(screen.getByText('file')).toBeInTheDocument()
      expect(screen.getByText('doc')).toBeInTheDocument()
      expect(screen.getByText('user')).toBeInTheDocument()
    })
  })

  it('filters providers with fuzzy search', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider, mockDocProvider, mockUserProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@fil', selectionStart: 4 } })

    await waitFor(() => {
      expect(screen.getByText('file')).toBeInTheDocument()
      expect(screen.queryByText('doc')).not.toBeInTheDocument()
    })
  })

  it('hides suggestions when whitespace is typed after @', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@', selectionStart: 1 } })

    await waitFor(() => {
      expect(screen.getByText('file')).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: '@ ', selectionStart: 2 } })

    await waitFor(() => {
      expect(screen.queryByText('file')).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Item Search Tests
  // ==========================================================================

  it('searches provider when @type: is typed', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:', selectionStart: 6 } })

    await waitFor(() => {
      expect(mockFileProvider.search).toHaveBeenCalledWith('')
    })
  })

  it('shows file search results', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button', selectionStart: 12 } })

    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
      expect(screen.queryByText('Input.tsx')).not.toBeInTheDocument()
    })
  })

  it('displays "Searching..." while loading results', async () => {
    const slowProvider: ContextProvider = {
      type: 'file',
      search: vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      ),
      priority: 80,
    }

    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[slowProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:test', selectionStart: 10 } })

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Keyboard Navigation Tests
  // ==========================================================================

  it('navigates suggestions with arrow keys', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider, mockDocProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@', selectionStart: 1 } })

    await waitFor(() => {
      expect(screen.getByText('file')).toBeInTheDocument()
    })

    // Arrow down to select next
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    // First suggestion should have selected state
    const suggestions = screen.getAllByRole('button')
    expect(suggestions[0]).toHaveClass('bg-accent')
  })

  it('inserts mention on Enter key', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button', selectionStart: 12 } })

    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  it('closes suggestions on Escape key', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@', selectionStart: 1 } })

    await waitFor(() => {
      expect(screen.getByText('file')).toBeInTheDocument()
    })

    fireEvent.keyDown(input, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('file')).not.toBeInTheDocument()
    })
  })

  it('submits on Enter when no suggestions shown', () => {
    render(
      <ContextMentionInput
        value="test"
        onChange={mockOnChange}
        providers={[mockFileProvider]}
        onSubmit={mockOnSubmit}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  // ==========================================================================
  // Token Budget Tests
  // ==========================================================================

  it('disables suggestions that exceed token budget', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
        tokenBudget={100}
        currentTokens={90}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button', selectionStart: 12 } })

    await waitFor(() => {
      const button = screen.getByText('Button.tsx').closest('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Budget exceeded')).toBeInTheDocument()
    })
  })

  it('allows suggestions within token budget', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
        tokenBudget={1000}
        currentTokens={0}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button', selectionStart: 12 } })

    await waitFor(() => {
      const button = screen.getByText('Button.tsx').closest('button')
      expect(button).not.toBeDisabled()
    })
  })

  // ==========================================================================
  // Context Item Extraction Tests
  // ==========================================================================

  it('extracts context items from @mentions', async () => {
    render(
      <ContextMentionInput
        value="@file:Button.tsx "
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button.tsx ', selectionStart: 17 } })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
      const calls = mockOnChange.mock.calls
      const lastCall = calls[calls.length - 1]
      const [_, contextItems] = lastCall
      expect(contextItems).toHaveLength(1)
      expect(contextItems[0].label).toBe('Button.tsx')
    })
  })

  // ==========================================================================
  // Click Selection Tests
  // ==========================================================================

  it('inserts mention on suggestion click', async () => {
    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[mockFileProvider]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@file:Button', selectionStart: 12 } })

    await waitFor(() => {
      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    const suggestion = screen.getByText('Button.tsx')
    fireEvent.click(suggestion)

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Multiple Provider Tests
  // ==========================================================================

  it('shows correct provider icon for each type', async () => {
    const iconFile = <span data-testid="icon-file">📄</span>
    const iconDoc = <span data-testid="icon-doc">📖</span>

    const fileProviderWithIcon: ContextProvider = {
      ...mockFileProvider,
      icon: iconFile,
    }

    const docProviderWithIcon: ContextProvider = {
      ...mockDocProvider,
      icon: iconDoc,
    }

    render(
      <ContextMentionInput
        value=""
        onChange={mockOnChange}
        providers={[fileProviderWithIcon, docProviderWithIcon]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '@', selectionStart: 1 } })

    await waitFor(() => {
      expect(screen.getByTestId('icon-file')).toBeInTheDocument()
      expect(screen.getByTestId('icon-doc')).toBeInTheDocument()
    })
  })
})
