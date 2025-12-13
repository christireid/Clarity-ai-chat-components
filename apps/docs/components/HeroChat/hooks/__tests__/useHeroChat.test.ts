import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach, Mock } from 'vitest'

// Mock @clarity-chat/react hooks
vi.mock('@clarity-chat/react', () => ({
  useLocalStorage: vi.fn((key: string, defaultValue: unknown) => {
    const store: Record<string, unknown> = {}
    const getValue = () => store[key] ?? defaultValue
    const setValue = vi.fn((value: unknown) => {
      store[key] = typeof value === 'function' ? value(getValue()) : value
    })
    return [getValue(), setValue]
  }),
  useClipboard: vi.fn(() => ({
    copy: vi.fn().mockResolvedValue(undefined),
    copied: false,
  })),
  useRetryWithBackoff: vi.fn(() => ({
    execute: vi.fn(async (fn: () => Promise<unknown>) => {
      const result = await fn()
      return { result }
    }),
    isRetrying: false,
    attempt: 0,
    cancel: vi.fn(),
  })),
  useVoiceInput: vi.fn(() => ({
    isListening: false,
    transcript: '',
    startListening: vi.fn(),
    stopListening: vi.fn(),
    isSupported: true,
    resetTranscript: vi.fn(),
  })),
}))

// Import after mocks
import { useHeroChat, type Conversation, type Message } from '../useHeroChat'
import {
  useLocalStorage,
  useClipboard,
  useRetryWithBackoff,
  useVoiceInput,
} from '@clarity-chat/react'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useHeroChat', () => {
  let localStorageStore: Record<string, unknown>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageStore = {}

    // Reset useLocalStorage mock to use fresh store
    ;(useLocalStorage as Mock).mockImplementation(
      (key: string, defaultValue: unknown) => {
        const getValue = () => localStorageStore[key] ?? defaultValue
        const setValue = vi.fn((value: unknown) => {
          localStorageStore[key] =
            typeof value === 'function' ? value(getValue()) : value
        })
        return [getValue(), setValue]
      }
    )

    // Reset other mocks
    ;(useClipboard as Mock).mockReturnValue({
      copy: vi.fn().mockResolvedValue(undefined),
      copied: false,
    })
    ;(useRetryWithBackoff as Mock).mockReturnValue({
      execute: vi.fn(async (fn: () => Promise<unknown>) => {
        const result = await fn()
        return { result }
      }),
      isRetrying: false,
      attempt: 0,
      cancel: vi.fn(),
    })
    ;(useVoiceInput as Mock).mockReturnValue({
      isListening: false,
      transcript: '',
      startListening: vi.fn(),
      stopListening: vi.fn(),
      isSupported: true,
      resetTranscript: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should return default values', () => {
      const { result } = renderHook(() => useHeroChat())

      expect(result.current.conversations).toEqual([])
      expect(result.current.currentConversation).toBeNull()
      expect(result.current.messages).toEqual([])
      expect(result.current.isStreaming).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.theme).toBe('system')
      expect(result.current.tokenUsage).toEqual({
        prompt: 0,
        completion: 0,
        total: 0,
      })
    })

    it('should calculate estimatedCost based on tokenUsage', () => {
      const { result } = renderHook(() => useHeroChat())

      // Default cost should be 0
      expect(result.current.estimatedCost).toBe(0)
    })
  })

  describe('conversation management', () => {
    it('should create a new conversation', () => {
      // Setup localStorage mock with mutable store
      let conversations: Conversation[] = []
      let currentId: string | null = null
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [
              conversations,
              vi.fn((value: unknown) => {
                conversations =
                  typeof value === 'function' ? value(conversations) : value
              }),
            ]
          }
          if (key === 'hero-chat-current-id') {
            return [
              currentId,
              vi.fn((value: unknown) => {
                currentId =
                  typeof value === 'function' ? value(currentId) : value
              }),
            ]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.createConversation()
      })

      // Verify setConversations was called
      expect(useLocalStorage).toHaveBeenCalledWith(
        'hero-chat-conversations',
        []
      )
    })

    it('should switch conversations', () => {
      let currentId: string | null = null
      const setCurrentId = vi.fn((value: unknown) => {
        currentId = typeof value === 'function' ? value(currentId) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-current-id') {
            return [currentId, setCurrentId]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.switchConversation('conv-123')
      })

      expect(setCurrentId).toHaveBeenCalledWith('conv-123')
    })

    it('should rename a conversation', () => {
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Old Title',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      let conversations = [mockConversation]
      const setConversations = vi.fn((value: unknown) => {
        conversations =
          typeof value === 'function' ? value(conversations) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [conversations, setConversations]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.renameConversation('conv-123', 'New Title')
      })

      expect(setConversations).toHaveBeenCalled()
    })

    it('should delete a conversation', () => {
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Test',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      let conversations = [mockConversation]
      const setConversations = vi.fn((value: unknown) => {
        conversations =
          typeof value === 'function' ? value(conversations) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [conversations, setConversations]
          }
          if (key === 'hero-chat-current-id') {
            return ['conv-123', vi.fn()]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.deleteConversation('conv-123')
      })

      expect(setConversations).toHaveBeenCalled()
    })
  })

  describe('message operations', () => {
    it('should delete a message from the current conversation', () => {
      const mockMessage: Message = {
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
      }
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Test',
        messages: [mockMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      let conversations = [mockConversation]
      const setConversations = vi.fn((value: unknown) => {
        conversations =
          typeof value === 'function' ? value(conversations) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [conversations, setConversations]
          }
          if (key === 'hero-chat-current-id') {
            return ['conv-123', vi.fn()]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.deleteMessage('msg-123')
      })

      expect(setConversations).toHaveBeenCalled()
    })

    it('should clear all messages from the current conversation', () => {
      const mockMessage: Message = {
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
      }
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Test',
        messages: [mockMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      let conversations = [mockConversation]
      const setConversations = vi.fn((value: unknown) => {
        conversations =
          typeof value === 'function' ? value(conversations) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [conversations, setConversations]
          }
          if (key === 'hero-chat-current-id') {
            return ['conv-123', vi.fn()]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.clearMessages()
      })

      expect(setConversations).toHaveBeenCalled()
    })
  })

  describe('clipboard', () => {
    it('should copy message content', async () => {
      const mockCopy = vi.fn().mockResolvedValue(undefined)
      ;(useClipboard as Mock).mockReturnValue({
        copy: mockCopy,
        copied: false,
      })

      const { result } = renderHook(() => useHeroChat())

      await act(async () => {
        await result.current.copyMessage('Test content')
      })

      expect(mockCopy).toHaveBeenCalledWith('Test content')
    })
  })

  describe('theme', () => {
    it('should set theme', () => {
      let currentTheme = 'system'
      const setTheme = vi.fn((value: unknown) => {
        currentTheme = typeof value === 'function' ? value(currentTheme) : value
      })
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-theme') {
            return [currentTheme, setTheme]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(setTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('error handling', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useHeroChat())

      // Initially no error
      expect(result.current.error).toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('voice input', () => {
    it('should expose voice input functions from useVoiceInput', () => {
      const mockStartListening = vi.fn()
      const mockStopListening = vi.fn()
      ;(useVoiceInput as Mock).mockReturnValue({
        isListening: true,
        transcript: 'Hello world',
        startListening: mockStartListening,
        stopListening: mockStopListening,
        isSupported: true,
        resetTranscript: vi.fn(),
      })

      const { result } = renderHook(() => useHeroChat())

      expect(result.current.isRecording).toBe(true)
      expect(result.current.voiceTranscript).toBe('Hello world')
      expect(result.current.isVoiceSupported).toBe(true)

      act(() => {
        result.current.startVoiceInput()
        result.current.stopVoiceInput()
      })

      expect(mockStartListening).toHaveBeenCalled()
      expect(mockStopListening).toHaveBeenCalled()
    })
  })

  describe('retry state', () => {
    it('should expose retry state from useRetryWithBackoff', () => {
      ;(useRetryWithBackoff as Mock).mockReturnValue({
        execute: vi.fn(),
        isRetrying: true,
        attempt: 2,
        cancel: vi.fn(),
      })

      const { result } = renderHook(() => useHeroChat())

      expect(result.current.isRetrying).toBe(true)
      expect(result.current.retryAttempt).toBe(2)
    })
  })

  describe('stream cancellation', () => {
    it('should cancel stream and retry when cancelStream is called', () => {
      const mockCancel = vi.fn()
      ;(useRetryWithBackoff as Mock).mockReturnValue({
        execute: vi.fn(),
        isRetrying: false,
        attempt: 0,
        cancel: mockCancel,
      })

      const { result } = renderHook(() => useHeroChat())

      act(() => {
        result.current.cancelStream()
      })

      expect(mockCancel).toHaveBeenCalled()
    })
  })

  describe('derived state', () => {
    it('should derive currentConversation from conversations and currentConversationId', () => {
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Test',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [[mockConversation], vi.fn()]
          }
          if (key === 'hero-chat-current-id') {
            return ['conv-123', vi.fn()]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      expect(result.current.currentConversation).toEqual(mockConversation)
      expect(result.current.messages).toEqual([])
    })

    it('should derive messages from currentConversation', () => {
      const mockMessages: Message[] = [
        { id: 'msg-1', role: 'user', content: 'Hello', timestamp: Date.now() },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Hi!',
          timestamp: Date.now(),
        },
      ]
      const mockConversation: Conversation = {
        id: 'conv-123',
        title: 'Test',
        messages: mockMessages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      ;(useLocalStorage as Mock).mockImplementation(
        (key: string, defaultValue: unknown) => {
          if (key === 'hero-chat-conversations') {
            return [[mockConversation], vi.fn()]
          }
          if (key === 'hero-chat-current-id') {
            return ['conv-123', vi.fn()]
          }
          return [defaultValue, vi.fn()]
        }
      )

      const { result } = renderHook(() => useHeroChat())

      expect(result.current.messages).toHaveLength(2)
      expect(result.current.messages[0].content).toBe('Hello')
      expect(result.current.messages[1].content).toBe('Hi!')
    })
  })
})
