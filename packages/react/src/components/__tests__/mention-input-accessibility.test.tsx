import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import {
  MentionInput,
  type MentionInputProps,
  type MentionableUser,
} from '../input/mention-system'

const mockUsers: MentionableUser[] = [
  {
    id: '1',
    name: 'Alice Smith',
    username: 'alice',
    role: 'Admin',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    username: 'bob',
    role: 'User',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    username: 'charlie',
    role: 'Moderator',
    isOnline: true,
  },
]

beforeAll(() => {
  Object.defineProperty(window.HTMLElement.prototype, 'hasPointerCapture', {
    value: () => false,
    configurable: true,
  })
  Object.defineProperty(window.HTMLElement.prototype, 'releasePointerCapture', {
    value: () => {},
    configurable: true,
  })
})

const renderMentionInput = (overrides: Partial<MentionInputProps> = {}) => {
  const props: MentionInputProps = {
    users: mockUsers,
    value: '',
    onChange: vi.fn(),
    ...overrides,
  }

  render(<MentionInput {...props} />)
  return props
}

// Helper to trigger the suggestions dropdown
const triggerSuggestions = (textarea: HTMLElement) => {
  fireEvent.change(textarea, { target: { value: '@', selectionStart: 1 } })
}

describe('MentionInput Accessibility', () => {
  describe('ARIA Combobox Pattern', () => {
    it('has role="combobox" on the textarea', () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')
      expect(textarea).toHaveAttribute('role', 'combobox')
    })

    it('has aria-expanded="false" when suggestions are hidden', () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')
      expect(textarea).toHaveAttribute('aria-expanded', 'false')
    })

    it('has aria-expanded="true" when suggestions are shown', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        expect(textarea).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('has aria-autocomplete="list" attribute', () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')
      expect(textarea).toHaveAttribute('aria-autocomplete', 'list')
    })

    it('has aria-label for screen readers', () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')
      expect(textarea).toHaveAttribute(
        'aria-label',
        'Message input with mention support'
      )
    })
  })

  describe('Listbox Pattern', () => {
    it('renders listbox with role="listbox" when suggestions are shown', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        const listbox = screen.getByRole('listbox')
        expect(listbox).toBeInTheDocument()
      })
    })

    it('renders options with role="option"', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(3) // All 3 mock users
      })
    })

    it('marks first option with aria-selected="true" by default', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveAttribute('aria-selected', 'true')
        expect(options[1]).toHaveAttribute('aria-selected', 'false')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates down through options with ArrowDown', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      fireEvent.keyDown(textarea, { key: 'ArrowDown' })

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options[1]).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('closes listbox on Escape', async () => {
      renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      fireEvent.keyDown(textarea, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('selects option on Enter', async () => {
      const props = renderMentionInput()
      const textarea = screen.getByPlaceholderText('Type @ to mention...')

      triggerSuggestions(textarea)

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(props.onChange).toHaveBeenCalled()
      })
    })
  })
})
