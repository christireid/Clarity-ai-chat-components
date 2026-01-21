import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import {
  ConversationList,
  type ConversationListProps,
  type Conversation,
} from '../conversation/conversation-list'

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'First Conversation',
    preview: 'This is the first conversation preview',
    timestamp: Date.now() - 3600000,
    messageCount: 5,
    unreadCount: 2,
    isPinned: true,
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Second Conversation',
    preview: 'This is the second conversation preview',
    timestamp: Date.now() - 7200000,
    messageCount: 10,
    unreadCount: 0,
    isPinned: false,
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Third Conversation',
    preview: 'This is the third conversation preview',
    timestamp: Date.now() - 86400000,
    messageCount: 3,
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
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

const renderConversationList = (
  overrides: Partial<ConversationListProps> = {}
) => {
  const props: ConversationListProps = {
    conversations: mockConversations,
    onSelect: vi.fn(),
    ...overrides,
  }

  render(<ConversationList {...props} />)
  return props
}

describe('ConversationList Accessibility', () => {
  describe('Button Role and ARIA Attributes', () => {
    it('renders conversation items with role="button"', () => {
      renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })
      expect(buttons.length).toBe(3)
    })

    it('has aria-label describing the conversation', () => {
      renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })
      expect(buttons[0]).toHaveAttribute(
        'aria-label',
        'Select conversation: First Conversation'
      )
      expect(buttons[1]).toHaveAttribute(
        'aria-label',
        'Select conversation: Second Conversation'
      )
      expect(buttons[2]).toHaveAttribute(
        'aria-label',
        'Select conversation: Third Conversation'
      )
    })

    it('has aria-pressed="true" for selected items', () => {
      renderConversationList({ selectedIds: ['1', '2'] })
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })

      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'true')
      expect(buttons[2]).toHaveAttribute('aria-pressed', 'false')
    })

    it('has aria-pressed="false" for non-selected items', () => {
      renderConversationList({ selectedIds: [] })
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed', 'false')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('conversation items are focusable with tabIndex=0', () => {
      renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabindex', '0')
      })
    })

    it('selects conversation on Enter key', () => {
      const props = renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })

      fireEvent.keyDown(buttons[0], { key: 'Enter' })
      expect(props.onSelect).toHaveBeenCalledWith('1')
    })

    it('selects conversation on Space key', () => {
      const props = renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })

      fireEvent.keyDown(buttons[1], { key: ' ' })
      expect(props.onSelect).toHaveBeenCalledWith('2')
    })
  })

  describe('Filter Buttons Accessibility', () => {
    it('filter buttons have role="group" when showFilters is true', () => {
      renderConversationList({ showFilters: true })
      const filterGroup = screen.getByRole('group', { name: /filter options/i })
      expect(filterGroup).toBeInTheDocument()
    })

    it('pinned filter button has aria-pressed attribute', () => {
      renderConversationList({ showFilters: true })
      const pinnedButton = screen.getByRole('button', { name: /pinned/i })
      expect(pinnedButton).toHaveAttribute('aria-pressed', 'false')
    })

    it('favorites filter button has aria-pressed attribute', () => {
      renderConversationList({ showFilters: true })
      const favoritesButton = screen.getByRole('button', { name: /favorites/i })
      expect(favoritesButton).toHaveAttribute('aria-pressed', 'false')
    })

    it('toggles aria-pressed on filter button click', () => {
      renderConversationList({ showFilters: true })
      const pinnedButton = screen.getByRole('button', { name: /pinned/i })

      expect(pinnedButton).toHaveAttribute('aria-pressed', 'false')
      fireEvent.click(pinnedButton)
      expect(pinnedButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Focus Visible Styles', () => {
    it('conversation items have focus-visible classes', () => {
      renderConversationList()
      const buttons = screen.getAllByRole('button', {
        name: /select conversation/i,
      })
      buttons.forEach((button) => {
        expect(button.className).toContain('focus-visible:ring')
      })
    })
  })
})
