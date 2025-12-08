/**
 * DocsAssistant Component Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ============================================================================
// Mocks - Must be defined before imports
// ============================================================================

// Mock framer-motion first
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock all @clarity-chat/react exports
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}

vi.mock('@clarity-chat/react', () => ({
  ChatWindow: ({
    messages,
    isLoading,
    onSendMessage,
    onMessageFeedback,
    onExport,
    onClear,
    emptyState,
  }: any) => (
    <div data-testid="chat-window">
      <div data-testid="messages-count">{messages?.length || 0}</div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'idle'}</div>
      {messages?.length === 0 && emptyState}
      <button data-testid="send-btn" onClick={() => onSendMessage?.('Test')}>
        Send
      </button>
      {onExport && (
        <button data-testid="export-btn" onClick={onExport}>
          Export
        </button>
      )}
      {onClear && (
        <button data-testid="clear-btn" onClick={onClear}>
          Clear
        </button>
      )}
      {onMessageFeedback && (
        <button
          data-testid="feedback-btn"
          onClick={() => onMessageFeedback?.('msg-1', 'up')}
        >
          Feedback
        </button>
      )}
    </div>
  ),
  CitationCard: ({ citation }: any) => (
    <div data-testid="citation-card">{citation?.source}</div>
  ),
  EmptyChatState: ({ suggestions, onSuggestionSelect }: any) => (
    <div data-testid="empty-state">
      {suggestions?.map((s: any) => (
        <button
          key={s.id}
          data-testid={`suggestion-${s.id}`}
          onClick={() => onSuggestionSelect?.(s)}
        >
          {s.label}
        </button>
      ))}
    </div>
  ),
  ErrorBoundary: ({ children }: any) => (
    <div data-testid="error-boundary">{children}</div>
  ),
  ExportDialog: ({ open, onOpenChange, onExport }: any) =>
    open ? (
      <div data-testid="export-dialog">
        <button
          data-testid="export-json"
          onClick={() => onExport?.({ format: 'json' })}
        >
          JSON
        </button>
        <button
          data-testid="close-dialog"
          onClick={() => onOpenChange?.(false)}
        >
          Close
        </button>
      </div>
    ) : null,
  MessageSearch: ({ isOpen }: any) =>
    isOpen ? <div data-testid="message-search">Search</div> : null,
  NetworkStatus: () => <div data-testid="network-status">Online</div>,
  TokenCounter: ({ tokens }: any) => (
    <div data-testid="token-counter">{tokens || 0}</div>
  ),
  VoiceInput: ({ onTranscript }: any) => (
    <button
      data-testid="voice-input"
      onClick={() => onTranscript?.('Voice test')}
    >
      Voice
    </button>
  ),
  useToast: () => mockToast,
  useKeyboardShortcuts: vi.fn(),
  useClipboard: () => ({ copy: vi.fn(), copied: false }),
  useLocalStorage: (key: string, initial: any) => [initial, vi.fn(), vi.fn()],
  useThrottledCallback: (cb: any) => cb,
  useReducedMotion: () => false,
  useTokenTracker: () => ({
    tokens: 0,
    isNearLimit: false,
    isCritical: false,
    addMessage: vi.fn(),
    clear: vi.fn(),
  }),
  useFocusTrap: () => ({ current: null }),
  useFocusRestoration: () => ({ saveFocus: vi.fn(), restoreFocus: vi.fn() }),
  createSlideVariant: () => ({ initial: {}, animate: {}, exit: {} }),
  createFadeVariant: () => ({ initial: {}, animate: {}, exit: {} }),
}))

// Mock local imports
vi.mock('./ChatButton', () => ({
  ChatButton: ({ isOpen, onClick }: any) => (
    <button data-testid="chat-button" onClick={onClick}>
      {isOpen ? 'Close' : 'Open'}
    </button>
  ),
}))

vi.mock('./KeyboardShortcutsHelp', () => ({
  KeyboardShortcutsHelp: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="shortcuts-help">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock URL methods
global.URL.createObjectURL = vi.fn(() => 'blob:test')
global.URL.revokeObjectURL = vi.fn()

// Now import the component
import { DocsAssistant } from './DocsAssistant'

// ============================================================================
// Tests
// ============================================================================

describe('DocsAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<DocsAssistant />)
      expect(screen.getByTestId('chat-button')).toBeInTheDocument()
    })

    it('shows chat button initially', () => {
      render(<DocsAssistant />)
      expect(screen.getByTestId('chat-button')).toHaveTextContent('Open')
    })

    it('wraps content in ErrorBoundary', () => {
      render(<DocsAssistant />)
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })
  })

  describe('Opening and Closing', () => {
    it('opens chat when button is clicked', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('chat-window')).toBeInTheDocument()
      })
    })

    it('shows Close text when open', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('chat-button')).toHaveTextContent('Close')
      })
    })
  })

  describe('Empty State', () => {
    it('shows empty state when no messages', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      })
    })

    it('shows starter suggestions', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(
          screen.getByTestId('suggestion-getting-started')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Components Integration', () => {
    it('renders NetworkStatus', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('network-status')).toBeInTheDocument()
      })
    })

    it('renders VoiceInput', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('voice-input')).toBeInTheDocument()
      })
    })
  })

  describe('Export Functionality', () => {
    it('does not show export when no messages', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.queryByTestId('export-btn')).not.toBeInTheDocument()
      })
    })
  })

  describe('Clear Functionality', () => {
    it('does not show clear when no messages', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.queryByTestId('clear-btn')).not.toBeInTheDocument()
      })
    })
  })

  describe('Message Count', () => {
    it('shows zero messages initially', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('messages-count')).toHaveTextContent('0')
      })
    })
  })

  describe('Loading State', () => {
    it('shows idle state initially', async () => {
      render(<DocsAssistant />)

      await userEvent.click(screen.getByTestId('chat-button'))

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('idle')
      })
    })
  })
})

describe('DocsAssistant Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  it('integrates all library components', async () => {
    render(<DocsAssistant />)

    await userEvent.click(screen.getByTestId('chat-button'))

    await waitFor(() => {
      expect(screen.getByTestId('chat-window')).toBeInTheDocument()
      expect(screen.getByTestId('network-status')).toBeInTheDocument()
      expect(screen.getByTestId('voice-input')).toBeInTheDocument()
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  it('ChatWindow receives correct initial props', async () => {
    render(<DocsAssistant />)

    await userEvent.click(screen.getByTestId('chat-button'))

    await waitFor(() => {
      expect(screen.getByTestId('messages-count')).toHaveTextContent('0')
      expect(screen.getByTestId('loading-state')).toHaveTextContent('idle')
    })
  })
})
