/**
 * Streaming Provider Component
 * Context provider for managing streaming state across components
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'

interface StreamingMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  createdAt: Date
}

interface StreamingState {
  messages: StreamingMessage[]
  isStreaming: boolean
  error: Error | null
  currentStreamId: string | null
}

type StreamingAction =
  | { type: 'ADD_MESSAGE'; payload: StreamingMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'APPEND_TO_MESSAGE'; payload: { id: string; chunk: string } }
  | { type: 'START_STREAMING'; payload: { id: string } }
  | { type: 'STOP_STREAMING' }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_MESSAGES' }

function streamingReducer(state: StreamingState, action: StreamingAction): StreamingState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content }
            : msg
        ),
      }

    case 'APPEND_TO_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: msg.content + action.payload.chunk }
            : msg
        ),
      }

    case 'START_STREAMING':
      return {
        ...state,
        isStreaming: true,
        currentStreamId: action.payload.id,
        error: null,
      }

    case 'STOP_STREAMING':
      return {
        ...state,
        isStreaming: false,
        currentStreamId: null,
        messages: state.messages.map((msg) =>
          msg.id === state.currentStreamId
            ? { ...msg, isStreaming: false }
            : msg
        ),
      }

    case 'SET_ERROR':
      return {
        ...state,
        isStreaming: false,
        error: action.payload,
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      }

    default:
      return state
  }
}

interface StreamingContextValue extends StreamingState {
  addMessage: (message: Omit<StreamingMessage, 'id' | 'createdAt'>) => string
  updateMessage: (id: string, content: string) => void
  appendToMessage: (id: string, chunk: string) => void
  startStreaming: (id: string) => void
  stopStreaming: () => void
  setError: (error: Error) => void
  clearError: () => void
  clearMessages: () => void
}

const StreamingContext = createContext<StreamingContextValue | null>(null)

interface StreamingProviderProps {
  children: ReactNode
}

export function StreamingProvider({ children }: StreamingProviderProps) {
  const [state, dispatch] = useReducer(streamingReducer, {
    messages: [],
    isStreaming: false,
    error: null,
    currentStreamId: null,
  })

  const addMessage = useCallback(
    (message: Omit<StreamingMessage, 'id' | 'createdAt'>) => {
      const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          ...message,
          id,
          createdAt: new Date(),
        },
      })
      return id
    },
    []
  )

  const updateMessage = useCallback((id: string, content: string) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, content } })
  }, [])

  const appendToMessage = useCallback((id: string, chunk: string) => {
    dispatch({ type: 'APPEND_TO_MESSAGE', payload: { id, chunk } })
  }, [])

  const startStreaming = useCallback((id: string) => {
    dispatch({ type: 'START_STREAMING', payload: { id } })
  }, [])

  const stopStreaming = useCallback(() => {
    dispatch({ type: 'STOP_STREAMING' })
  }, [])

  const setError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  const value: StreamingContextValue = {
    ...state,
    addMessage,
    updateMessage,
    appendToMessage,
    startStreaming,
    stopStreaming,
    setError,
    clearError,
    clearMessages,
  }

  return (
    <StreamingContext.Provider value={value}>
      {children}
    </StreamingContext.Provider>
  )
}

export function useStreamingContext() {
  const context = useContext(StreamingContext)
  if (!context) {
    throw new Error('useStreamingContext must be used within a StreamingProvider')
  }
  return context
}
