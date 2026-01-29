/**
 * Real App Integration Test
 *
 * Tests multiple components working together in a realistic application scenario:
 * - CommandPalette for navigation
 * - AudioRecorder for voice input
 * - OKLCH colors for glassmorphic UI
 * - Keyboard navigation throughout
 * - Theme switching
 * - Accessibility features
 *
 * This test validates that all components integrate seamlessly in a production-like environment.
 *
 * @integration-test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@clarity-chat/react/components/navigation/CommandPalette'
import type { CommandItem, AIContext } from '@clarity-chat/react/components/navigation/CommandPalette'
import { AudioRecorder } from '@clarity-chat/react/components/input/AudioRecorder'
import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// Mock Browser APIs
// ============================================================================

class MockMediaStream {
  active = true
  id = `stream-${Math.random()}`
  getTracks() {
    return [{ stop: vi.fn(), kind: 'audio', enabled: true }]
  }
  getAudioTracks() {
    return this.getTracks()
  }
}

class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  ondataavailable: ((event: any) => void) | null = null
  onstop: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null
  onstart: ((event: any) => void) | null = null
  onpause: ((event: any) => void) | null = null
  onresume: ((event: any) => void) | null = null

  constructor(public stream: MediaStream, public options?: any) {}

  start() {
    this.state = 'recording'
    if (this.onstart) this.onstart(new Event('start'))
  }

  stop() {
    this.state = 'inactive'
    if (this.ondataavailable) {
      this.ondataavailable({ data: new Blob(['audio'], { type: 'audio/webm' }) })
    }
    setTimeout(() => {
      if (this.onstop) this.onstop(new Event('stop'))
    }, 0)
  }

  pause() {
    this.state = 'paused'
    if (this.onpause) this.onpause(new Event('pause'))
  }

  resume() {
    this.state = 'recording'
    if (this.onresume) this.onresume(new Event('resume'))
  }

  static isTypeSupported() {
    return true
  }
}

class MockAudioContext {
  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteTimeDomainData: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
  }
  createMediaStreamSource() {
    return { connect: vi.fn(), disconnect: vi.fn() }
  }
  close() {
    return Promise.resolve()
  }
}

global.MediaRecorder = MockMediaRecorder as any
global.AudioContext = MockAudioContext as any
(global as any).webkitAudioContext = MockAudioContext
global.URL.createObjectURL = vi.fn(() => `blob:${Math.random()}`)

const mockGetUserMedia = vi.fn().mockResolvedValue(new MockMediaStream())

// ============================================================================
// Comprehensive App Component
// ============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  audioUrl?: string
}

interface AppState {
  messages: Message[]
  isRecording: boolean
  commandPaletteOpen: boolean
  theme: 'light' | 'dark'
  selectedModel: string
  conversationId: string
  tokenUsage: { input: number; output: number; total: number }
}

function ComprehensiveAIChatApp() {
  const [state, setState] = useState<AppState>({
    messages: [],
    isRecording: false,
    commandPaletteOpen: false,
    theme: 'light',
    selectedModel: 'Claude 3.5 Sonnet',
    conversationId: 'conv-001',
    tokenUsage: { input: 0, output: 0, total: 0 },
  })

  // Command palette commands
  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'AI',
      shortcut: ['Cmd', 'N'],
      onSelect: () => {
        setState((prev) => ({
          ...prev,
          messages: [],
          conversationId: `conv-${Date.now()}`,
          tokenUsage: { input: 0, output: 0, total: 0 },
          commandPaletteOpen: false,
        }))
      },
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      category: 'View',
      shortcut: ['Cmd', 'T'],
      onSelect: () => {
        setState((prev) => ({
          ...prev,
          theme: prev.theme === 'light' ? 'dark' : 'light',
          commandPaletteOpen: false,
        }))
      },
    },
    {
      id: 'change-model-claude',
      label: 'Switch to Claude',
      description: 'Use Claude 3.5 Sonnet',
      category: 'AI',
      onSelect: () => {
        setState((prev) => ({
          ...prev,
          selectedModel: 'Claude 3.5 Sonnet',
          commandPaletteOpen: false,
        }))
      },
    },
    {
      id: 'change-model-gpt4',
      label: 'Switch to GPT-4',
      description: 'Use GPT-4 Turbo',
      category: 'AI',
      onSelect: () => {
        setState((prev) => ({
          ...prev,
          selectedModel: 'GPT-4 Turbo',
          commandPaletteOpen: false,
        }))
      },
    },
    {
      id: 'clear-chat',
      label: 'Clear Chat',
      description: 'Delete all messages',
      category: 'Edit',
      shortcut: ['Cmd', 'K'],
      onSelect: () => {
        setState((prev) => ({
          ...prev,
          messages: [],
          commandPaletteOpen: false,
        }))
      },
    },
  ]

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K opens command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setState((prev) => ({
          ...prev,
          commandPaletteOpen: !prev.commandPaletteOpen,
        }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle audio recording
  const handleAudioStop = useCallback((audioBlob: Blob, audioUrl: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: '[Voice Message]',
      timestamp: new Date(),
      audioUrl,
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      isRecording: false,
      tokenUsage: {
        input: prev.tokenUsage.input + 100,
        output: prev.tokenUsage.output,
        total: prev.tokenUsage.total + 100,
      },
    }))

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'I received your voice message. How can I help?',
        timestamp: new Date(),
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        tokenUsage: {
          input: prev.tokenUsage.input,
          output: prev.tokenUsage.output + 50,
          total: prev.tokenUsage.total + 50,
        },
      }))
    }, 500)
  }, [])

  const aiContext: AIContext = {
    modelName: state.selectedModel,
    conversationId: state.conversationId,
    tokenUsage: state.tokenUsage,
  }

  return (
    <div className={state.theme === 'dark' ? 'dark' : ''}>
      <div
        data-testid="app-root"
        className={cn(
          'min-h-screen',
          'bg-background text-foreground',
          'transition-colors duration-300'
        )}
      >
        {/* Header with glassmorphism */}
        <header
          data-testid="app-header"
          className={cn(
            'sticky top-0 z-10',
            'bg-glass-pastel-blue dark:bg-glass-pastel-blue-dark',
            'border-b border-glass-light dark:border-glass-dark-light',
            'backdrop-blur-lg backdrop-saturate-150',
            'px-6 py-4'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Model: {state.selectedModel}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                data-testid="theme-toggle"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    theme: prev.theme === 'light' ? 'dark' : 'light',
                  }))
                }
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-glass-pastel-purple dark:bg-glass-pastel-purple-dark',
                  'border border-glass-medium dark:border-glass-dark-medium',
                  'hover:scale-105 transition-transform'
                )}
              >
                {state.theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>

              <button
                data-testid="open-command-palette"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    commandPaletteOpen: true,
                  }))
                }
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-glass-pastel-pink dark:bg-glass-pastel-pink-dark',
                  'border border-glass-medium dark:border-glass-dark-medium',
                  'hover:scale-105 transition-transform'
                )}
              >
                ⌘K Commands
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Messages */}
          <div data-testid="messages-container" className="space-y-4 mb-8">
            {state.messages.length === 0 ? (
              <div
                data-testid="empty-state"
                className={cn(
                  'text-center py-12',
                  'bg-glass-pastel-blue dark:bg-glass-pastel-blue-dark',
                  'rounded-xl border border-glass-light dark:border-glass-dark-light',
                  'backdrop-blur-lg'
                )}
              >
                <p className="text-xl font-medium mb-2">No messages yet</p>
                <p className="text-muted-foreground">
                  Start recording or press ⌘K for commands
                </p>
              </div>
            ) : (
              state.messages.map((message) => (
                <div
                  key={message.id}
                  data-testid={`message-${message.role}`}
                  className={cn(
                    'p-4 rounded-lg',
                    'border border-glass-medium dark:border-glass-dark-medium',
                    'backdrop-blur-sm',
                    message.role === 'user' &&
                      'bg-ai-user ml-auto max-w-[80%]',
                    message.role === 'assistant' &&
                      'bg-ai-assistant mr-auto max-w-[80%]',
                    message.role === 'system' && 'bg-ai-system'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="font-medium capitalize">{message.role}</div>
                    <div className="flex-1">
                      <p>{message.content}</p>
                      {message.audioUrl && (
                        <audio
                          data-testid="message-audio"
                          src={message.audioUrl}
                          controls
                          className="mt-2 w-full"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Audio Recorder */}
          <div
            data-testid="audio-recorder-container"
            className={cn(
              'bg-glass-pastel-green dark:bg-glass-pastel-green-dark',
              'rounded-xl border border-glass-light dark:border-glass-dark-light',
              'backdrop-blur-lg',
              'p-6'
            )}
          >
            <AudioRecorder
              maxDuration={60}
              pausable={true}
              enableNoiseCancellation={true}
              showWaveform={true}
              showDuration={true}
              showAmplitudeMeter={true}
              onStart={() =>
                setState((prev) => ({ ...prev, isRecording: true }))
              }
              onStop={handleAudioStop}
              onError={(error) => {
                console.error('Recording error:', error)
                setState((prev) => ({ ...prev, isRecording: false }))
              }}
            />
          </div>

          {/* Stats */}
          <div
            data-testid="stats-container"
            className={cn(
              'mt-8 grid grid-cols-3 gap-4',
              'bg-glass-pastel-amber dark:bg-glass-pastel-amber-dark',
              'rounded-xl border border-glass-light dark:border-glass-dark-light',
              'backdrop-blur-lg',
              'p-6'
            )}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{state.messages.length}</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {state.tokenUsage.total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{state.conversationId}</div>
              <div className="text-sm text-muted-foreground">
                Conversation ID
              </div>
            </div>
          </div>
        </main>

        {/* Command Palette */}
        <CommandPalette
          items={commands}
          open={state.commandPaletteOpen}
          onClose={() =>
            setState((prev) => ({ ...prev, commandPaletteOpen: false }))
          }
          aiContext={aiContext}
          placeholder="Search commands..."
          aria-label="Application command palette"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Integration Tests
// ============================================================================

describe('Real App Integration - All Components Together', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUserMedia.mockClear()
    mockGetUserMedia.mockResolvedValue(new MockMediaStream())

    if (!global.navigator.mediaDevices) {
      // @ts-ignore
      global.navigator.mediaDevices = {}
    }
    global.navigator.mediaDevices.getUserMedia = mockGetUserMedia
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Complete User Workflows', () => {
    it('completes full voice message workflow', async () => {
      render(<ComprehensiveAIChatApp />)

      // Initially empty
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Stop recording
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      // Wait for message to appear
      await waitFor(() => {
        expect(screen.getByTestId('message-user')).toBeInTheDocument()
      })

      // Should have audio element
      expect(screen.getByTestId('message-audio')).toBeInTheDocument()

      // Wait for AI response
      await waitFor(
        () => {
          expect(screen.getByTestId('message-assistant')).toBeInTheDocument()
        },
        { timeout: 1000 }
      )

      // Stats should update
      const stats = screen.getByTestId('stats-container')
      expect(stats).toHaveTextContent('2') // 2 messages
    })

    it('uses command palette to change theme', async () => {
      render(<ComprehensiveAIChatApp />)

      const root = screen.getByTestId('app-root')

      // Initially light mode
      expect(root).not.toHaveClass('dark')

      // Open command palette with keyboard
      fireEvent.keyDown(window, { key: 'k', metaKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Search for theme command
      const input = screen.getByRole('combobox')
      await user.type(input, 'theme')

      await waitFor(() => {
        expect(screen.getByText('Toggle Theme')).toBeInTheDocument()
      })

      // Select command
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'Enter' })

      // Wait for theme change
      await waitFor(() => {
        expect(root).toHaveClass('dark')
      })
    })

    it('uses command palette to switch AI model', async () => {
      render(<ComprehensiveAIChatApp />)

      const header = screen.getByTestId('app-header')

      // Initially Claude
      expect(header).toHaveTextContent('Claude 3.5 Sonnet')

      // Open command palette with button
      await user.click(screen.getByTestId('open-command-palette'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Search for GPT-4
      const input = screen.getByRole('combobox')
      await user.type(input, 'gpt')

      await waitFor(() => {
        expect(screen.getByText('Switch to GPT-4')).toBeInTheDocument()
      })

      // Click command
      await user.click(screen.getByText('Switch to GPT-4'))

      // Verify model changed
      await waitFor(() => {
        expect(header).toHaveTextContent('GPT-4 Turbo')
      })
    })

    it('clears chat via command palette', async () => {
      render(<ComprehensiveAIChatApp />)

      // Add a message first
      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('message-user')).toBeInTheDocument()
      })

      // Open command palette
      fireEvent.keyDown(window, { key: 'k', metaKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Search for clear
      const input = screen.getByRole('combobox')
      await user.type(input, 'clear')

      await waitFor(() => {
        expect(screen.getByText('Clear Chat')).toBeInTheDocument()
      })

      // Execute clear
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'Enter' })

      // Messages should be gone
      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      })
    })
  })

  describe('Glassmorphism UI', () => {
    it('applies glassmorphic effects throughout app', () => {
      render(<ComprehensiveAIChatApp />)

      const header = screen.getByTestId('app-header')
      const audioContainer = screen.getByTestId('audio-recorder-container')
      const statsContainer = screen.getByTestId('stats-container')

      // All should have glassmorphic classes
      expect(header).toHaveClass('backdrop-blur-lg')
      expect(audioContainer).toHaveClass('backdrop-blur-lg')
      expect(statsContainer).toHaveClass('backdrop-blur-lg')

      // All should have OKLCH background colors
      expect(header).toHaveClass('bg-glass-pastel-blue')
      expect(audioContainer).toHaveClass('bg-glass-pastel-green')
      expect(statsContainer).toHaveClass('bg-glass-pastel-amber')
    })

    it('maintains glassmorphism in dark mode', async () => {
      render(<ComprehensiveAIChatApp />)

      // Toggle to dark mode
      await user.click(screen.getByTestId('theme-toggle'))

      await waitFor(() => {
        const root = screen.getByTestId('app-root')
        expect(root).toHaveClass('dark')
      })

      // Glassmorphic effects should persist
      const header = screen.getByTestId('app-header')
      expect(header).toHaveClass('backdrop-blur-lg')
      expect(header).toHaveClass('dark:bg-glass-pastel-blue-dark')
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates entire app with keyboard only', async () => {
      render(<ComprehensiveAIChatApp />)

      // Open command palette with keyboard
      fireEvent.keyDown(window, { key: 'k', metaKey: true })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Navigate commands
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'ArrowDown' })

      // Close with Escape
      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Tab through interface (focus should move naturally)
      const themeToggle = screen.getByTestId('theme-toggle')
      themeToggle.focus()
      expect(themeToggle).toHaveFocus()

      // Trigger with Enter
      fireEvent.keyDown(themeToggle, { key: 'Enter' })
      await user.click(themeToggle)

      await waitFor(() => {
        const root = screen.getByTestId('app-root')
        expect(root).toHaveClass('dark')
      })
    })

    it('maintains focus context when switching between components', async () => {
      render(<ComprehensiveAIChatApp />)

      const paletteButton = screen.getByTestId('open-command-palette')

      // Focus button
      paletteButton.focus()
      expect(paletteButton).toHaveFocus()

      // Open palette
      await user.click(paletteButton)

      await waitFor(() => {
        const input = screen.getByRole('combobox')
        expect(input).toHaveFocus()
      })

      // Close palette
      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(paletteButton).toHaveFocus()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels throughout', () => {
      render(<ComprehensiveAIChatApp />)

      // Check key interactive elements
      const themeToggle = screen.getByTestId('theme-toggle')
      expect(themeToggle).toBeInTheDocument()

      const commandButton = screen.getByTestId('open-command-palette')
      expect(commandButton).toBeInTheDocument()

      // Open command palette to check its accessibility
      fireEvent.click(commandButton)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-label')
    })

    it('announces dynamic content changes', async () => {
      render(<ComprehensiveAIChatApp />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Check for live region in AudioRecorder
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Performance', () => {
    it('renders complete app quickly', () => {
      const startTime = performance.now()

      render(<ComprehensiveAIChatApp />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render in under 200ms
      expect(renderTime).toBeLessThan(200)
    })

    it('handles rapid interactions without lag', async () => {
      render(<ComprehensiveAIChatApp />)

      // Rapid theme toggles
      const themeToggle = screen.getByTestId('theme-toggle')

      for (let i = 0; i < 10; i++) {
        await user.click(themeToggle)
      }

      // Should still be responsive
      expect(themeToggle).toBeInTheDocument()
    })

    it('maintains performance with multiple messages', async () => {
      render(<ComprehensiveAIChatApp />)

      // Add multiple recordings
      for (let i = 0; i < 5; i++) {
        await user.click(
          screen.getByRole('button', { name: /start recording/i })
        )
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: /stop recording/i })
          ).toBeInTheDocument()
        })
        await user.click(screen.getByRole('button', { name: /stop recording/i }))

        // Wait for message to appear
        await waitFor(() => {
          const messages = screen.queryAllByTestId(/^message-/)
          expect(messages.length).toBeGreaterThan(i * 2)
        })
      }

      // Should still be responsive
      expect(screen.getByTestId('app-root')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles microphone permission denied gracefully', async () => {
      mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'))

      render(<ComprehensiveAIChatApp />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Should show error in AudioRecorder
      await waitFor(() => {
        expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument()
      })

      // App should still be functional
      expect(screen.getByTestId('app-root')).toBeInTheDocument()
    })

    it('recovers from failed recording', async () => {
      const { rerender } = render(<ComprehensiveAIChatApp />)

      // First recording fails
      mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'))

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument()
      })

      // Reset mock to allow next recording
      mockGetUserMedia.mockResolvedValue(new MockMediaStream())

      // Rerender to clear error state
      rerender(<ComprehensiveAIChatApp />)

      // Second recording should work
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /stop recording/i })
        ).toBeInTheDocument()
      })
    })
  })
})
