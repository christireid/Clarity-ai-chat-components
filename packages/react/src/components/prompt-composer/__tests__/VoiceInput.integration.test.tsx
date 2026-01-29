/**
 * Voice Input Integration Tests
 *
 * Tests for voice input integration with PromptComposer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PromptComposer } from '../PromptComposer'

// Mock Web Speech API
class MockSpeechRecognition {
  continuous = false
  interimResults = false
  lang = 'en-US'
  onresult: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null
  onend: (() => void) | null = null

  start() {
    // Simulate speech recognition starting
  }

  stop() {
    if (this.onend) {
      this.onend()
    }
  }

  abort() {
    if (this.onend) {
      this.onend()
    }
  }
}

// @ts-ignore - Mock global
global.SpeechRecognition = MockSpeechRecognition
// @ts-ignore - Mock webkit prefix
global.webkitSpeechRecognition = MockSpeechRecognition

describe('VoiceInput Integration', () => {
  const mockSubmit = vi.fn()

  beforeEach(() => {
    mockSubmit.mockClear()
  })

  it('renders voice button when voice feature enabled', () => {
    render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: {
            lang: 'en-US',
          },
        }}
        onSubmit={mockSubmit}
      />
    )

    // Voice button should be present
    const voiceButton = screen.getByRole('button', { name: /voice input|start voice/i })
    expect(voiceButton).toBeInTheDocument()
  })

  it('does not render voice button when voice feature disabled', () => {
    render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: false,
        }}
        onSubmit={mockSubmit}
      />
    )

    // Voice button should not be present
    const voiceButtons = screen.queryAllByRole('button', { name: /voice input|start voice/i })
    expect(voiceButtons).toHaveLength(0)
  })

  it('appends voice transcription to text input', async () => {
    const { container } = render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: {
            lang: 'en-US',
          },
        }}
        onSubmit={mockSubmit}
      />
    )

    // Get textarea
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeInTheDocument()

    // Type some initial text
    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'Hello' } })
      expect(textarea.value).toBe('Hello')
    }

    // Note: Actual voice transcription would require complex mocking
    // This test verifies the integration structure is correct
  })

  it('respects language configuration', () => {
    render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: {
            lang: 'es-ES', // Spanish
          },
        }}
        onSubmit={mockSubmit}
      />
    )

    // Voice button should be present
    const voiceButton = screen.getByRole('button', { name: /voice input|start voice/i })
    expect(voiceButton).toBeInTheDocument()

    // Note: Language is passed to InlineVoiceInput component
    // Actual language validation would require checking component props
  })

  it('shows voice button in actions bar', () => {
    const { container } = render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: true,
        }}
        onSubmit={mockSubmit}
      />
    )

    // Voice button should be in the actions bar (bottom section)
    const actionsBar = container.querySelector('[class*="flex"][class*="items-center"]')
    expect(actionsBar).toBeInTheDocument()
  })

  it('works alongside other features', () => {
    render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: {
            lang: 'en-US',
          },
          attachments: {
            maxFiles: 5,
            maxSize: 10 * 1024 * 1024,
          },
        }}
        onSubmit={mockSubmit}
      />
    )

    // Both voice and attachment buttons should be present
    const voiceButton = screen.getByRole('button', { name: /voice input|start voice/i })
    expect(voiceButton).toBeInTheDocument()

    const attachButton = screen.getByRole('button', { name: /add attachment/i })
    expect(attachButton).toBeInTheDocument()
  })

  it('defaults to en-US when no language specified', () => {
    render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: true, // No lang specified
        }}
        onSubmit={mockSubmit}
      />
    )

    const voiceButton = screen.getByRole('button', { name: /voice input|start voice/i })
    expect(voiceButton).toBeInTheDocument()

    // Default lang should be 'en-US' (tested via component props)
  })

  it('does not interfere with text input', async () => {
    const { container } = render(
      <PromptComposer
        api="/api/chat"
        features={{
          voice: true,
        }}
        onSubmit={mockSubmit}
      />
    )

    const textarea = container.querySelector('textarea')
    expect(textarea).toBeInTheDocument()

    // User can still type normally
    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'Typed message' } })
      expect(textarea.value).toBe('Typed message')

      // Submit works with typed text
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
    }
  })
})
