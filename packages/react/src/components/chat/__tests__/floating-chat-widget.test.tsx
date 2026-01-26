import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FloatingChatWidget } from '../FloatingChatWidget'

// Mock useClarityChat
const mockUseClarityChat = vi.fn()
vi.mock('../../hooks/use-clarity-chat/use-clarity-chat', () => ({
  useClarityChat: (options: any) => mockUseClarityChat(options),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('FloatingChatWidget', () => {
  const defaultHookReturn = {
    messages: [],
    input: '',
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    isLoading: false,
    error: null,
    append: vi.fn(),
  }

  beforeEach(() => {
    mockUseClarityChat.mockReturnValue(defaultHookReturn)
    vi.clearAllMocks()
  })

  it('renders closed by default', () => {
    render(<FloatingChatWidget />)
    expect(screen.getByLabelText('Open Chat')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/ask about/i)).not.toBeInTheDocument()
  })

  it('opens when clicked', async () => {
    render(<FloatingChatWidget />)
    fireEvent.click(screen.getByLabelText('Open Chat'))

    // Should now show input and close button
    expect(screen.getByLabelText('Close Chat')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/ask about/i)).toBeInTheDocument()
  })

  it('displays initial message', () => {
    const initialMessage = 'Hello world'
    mockUseClarityChat.mockReturnValue({
      ...defaultHookReturn,
      messages: [{ id: '1', role: 'assistant', content: initialMessage }],
    })

    render(<FloatingChatWidget initialMessage={initialMessage} />)
    fireEvent.click(screen.getByLabelText('Open Chat'))

    expect(screen.getByText(initialMessage)).toBeInTheDocument()
  })

  it('displays error state', () => {
    mockUseClarityChat.mockReturnValue({
      ...defaultHookReturn,
      error: { message: 'Network failed' },
    })

    render(<FloatingChatWidget />)
    fireEvent.click(screen.getByLabelText('Open Chat'))

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Network failed')).toBeInTheDocument()
  })

  it('passes configuration to useClarityChat', () => {
    const memoryConfig = { enabled: true }
    const optimizationConfig = { enabled: true }

    render(
      <FloatingChatWidget
        memoryConfig={memoryConfig}
        optimizationConfig={optimizationConfig}
      />
    )

    expect(mockUseClarityChat).toHaveBeenCalledWith(
      expect.objectContaining({
        memory: memoryConfig,
        promptOptimization: optimizationConfig,
      })
    )
  })
})
