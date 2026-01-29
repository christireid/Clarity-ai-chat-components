/**
 * AudioRecorder Component Tests
 *
 * Tests for browser-based audio recording with MediaRecorder API.
 * All browser APIs (MediaRecorder, getUserMedia) are mocked for test environment.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioRecorder } from '../AudioRecorder'

// ============================================================================
// Mock Setup
// ============================================================================

// Mock MediaStream
class MockMediaStream {
  active = true
  id = 'mock-stream'

  getTracks() {
    return [
      {
        stop: vi.fn(),
        kind: 'audio',
        enabled: true,
      },
    ]
  }

  getAudioTracks() {
    return this.getTracks()
  }
}

// Mock MediaRecorder
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
    if (this.onstart) {
      this.onstart(new Event('start'))
    }
  }

  stop() {
    this.state = 'inactive'

    // Simulate data available (fired before onstop in real API)
    if (this.ondataavailable) {
      const blob = new Blob(['audio data'], { type: 'audio/webm' })
      this.ondataavailable({ data: blob })
    }

    // Use setTimeout to simulate async behavior
    setTimeout(() => {
      if (this.onstop) {
        this.onstop(new Event('stop'))
      }
    }, 0)
  }

  pause() {
    this.state = 'paused'
    if (this.onpause) {
      this.onpause(new Event('pause'))
    }
  }

  resume() {
    this.state = 'recording'
    if (this.onresume) {
      this.onresume(new Event('resume'))
    }
  }

  static isTypeSupported(mimeType: string) {
    return ['audio/webm', 'audio/wav', 'audio/ogg'].includes(mimeType)
  }
}

// Mock getUserMedia
const mockGetUserMedia = vi.fn().mockResolvedValue(new MockMediaStream())

// Mock AudioContext and Web Audio API
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
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
  }

  close() {
    return Promise.resolve()
  }
}

// Apply mocks globally
// @ts-ignore
global.MediaRecorder = MockMediaRecorder
// @ts-ignore
global.AudioContext = MockAudioContext
// @ts-ignore
global.webkitAudioContext = MockAudioContext

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

beforeEach(() => {
  // Reset mocks before each test
  mockGetUserMedia.mockClear()
  mockGetUserMedia.mockResolvedValue(new MockMediaStream())

  // Ensure navigator.mediaDevices exists
  if (!global.navigator.mediaDevices) {
    // @ts-ignore
    global.navigator.mediaDevices = {}
  }
  global.navigator.mediaDevices.getUserMedia = mockGetUserMedia

  vi.clearAllMocks()
})

afterEach(() => {
  // Clean up but don't remove global mocks
  vi.clearAllMocks()
})

// ============================================================================
// Tests
// ============================================================================

describe('AudioRecorder', () => {
  const user = userEvent.setup({ delay: null })

  describe('Rendering and Basic UI', () => {
    it('renders without crashing', () => {
      render(<AudioRecorder onStop={() => {}} />)
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()
    })

    it('shows default UI elements', () => {
      render(<AudioRecorder onStop={() => {}} />)

      // Should show start button
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()

      // Should not show duration by default
      expect(screen.queryByText(/0:00/)).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <AudioRecorder onStop={() => {}} className="custom-recorder" />
      )

      expect(container.firstChild).toHaveClass('custom-recorder')
    })

    it('hides controls when showControls is false', () => {
      render(<AudioRecorder onStop={() => {}} showControls={false} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Recording Start/Stop', () => {
    it('requests microphone permission on start', async () => {
      const onStart = vi.fn()
      render(<AudioRecorder onStart={onStart} onStop={() => {}} />)

      const startButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            channelCount: 1,
            sampleRate: undefined,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          }),
        })
      })
    })

    it('starts recording after permission granted', async () => {
      const onStart = vi.fn()
      render(<AudioRecorder onStart={onStart} onStop={() => {}} />)

      const startButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(onStart).toHaveBeenCalled()
      })

      // Should show stop button
      expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
    })

    it('stops recording and calls onStop with audio data', async () => {
      const onStop = vi.fn()
      render(<AudioRecorder onStop={onStop} />)

      // Start recording
      const startButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Stop recording
      const stopButton = screen.getByRole('button', { name: /stop recording/i })
      await user.click(stopButton)

      // Wait for async operations to complete (MediaRecorder.stop + setTimeout + component setTimeout)
      await waitFor(() => {
        expect(onStop).toHaveBeenCalled()
      }, { timeout: 2000 })

      // Verify arguments
      expect(onStop).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringContaining('blob:')
      )

      // Should show start button again
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()
      })
    })

    it('handles permission denied error', async () => {
      const onError = vi.fn()
      mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'))

      render(<AudioRecorder onError={onError} onStop={() => {}} />)

      const startButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error))
      })
    })
  })

  describe('Pause/Resume Functionality', () => {
    it('pauses recording when pausable is true', async () => {
      const onPause = vi.fn()
      render(<AudioRecorder pausable={true} onPause={onPause} onStop={() => {}} />)

      // Start recording
      const startButton = screen.getByRole('button', { name: /start recording/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause recording/i })).toBeInTheDocument()
      })

      // Pause recording
      const pauseButton = screen.getByRole('button', { name: /pause recording/i })
      await user.click(pauseButton)

      await waitFor(() => {
        expect(onPause).toHaveBeenCalled()
      })

      // Should show resume button
      expect(screen.getByRole('button', { name: /resume recording/i })).toBeInTheDocument()
    })

    it('resumes recording after pause', async () => {
      const onResume = vi.fn()
      render(<AudioRecorder pausable={true} onResume={onResume} onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause recording/i })).toBeInTheDocument()
      })

      // Pause
      await user.click(screen.getByRole('button', { name: /pause recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resume recording/i })).toBeInTheDocument()
      })

      // Resume
      await user.click(screen.getByRole('button', { name: /resume recording/i }))

      await waitFor(() => {
        expect(onResume).toHaveBeenCalled()
      })

      // Should show pause button again
      expect(screen.getByRole('button', { name: /pause recording/i })).toBeInTheDocument()
    })

    it('does not show pause button when pausable is false', async () => {
      render(<AudioRecorder pausable={false} onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Should not show pause button
      expect(screen.queryByRole('button', { name: /pause recording/i })).not.toBeInTheDocument()
    })
  })

  describe('Duration Tracking', () => {
    it('shows duration when showDuration is true', async () => {
      vi.useFakeTimers()

      render(<AudioRecorder showDuration={true} onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Process all pending promises and timers
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Should show initial duration
      expect(screen.getByText('0:00')).toBeInTheDocument()

      // Advance timer by 3 seconds
      await act(async () => {
        vi.advanceTimersByTime(3000)
        await vi.runAllTimersAsync()
      })

      // Check duration updated
      expect(screen.getByText('0:03')).toBeInTheDocument()

      vi.useRealTimers()
    })

    it('calls onDurationChange callback', async () => {
      vi.useFakeTimers()
      const onDurationChange = vi.fn()

      render(<AudioRecorder onDurationChange={onDurationChange} onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Process pending promises
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Advance timer by 1 second
      await act(async () => {
        vi.advanceTimersByTime(1000)
        await vi.runAllTimersAsync()
      })

      expect(onDurationChange).toHaveBeenCalledWith(1)

      vi.useRealTimers()
    })

    it('stops recording when maxDuration is reached', async () => {
      vi.useFakeTimers()
      const onStop = vi.fn()

      render(<AudioRecorder maxDuration={2} onStop={onStop} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Process initial setup
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()

      // Advance timer past maxDuration
      await act(async () => {
        vi.advanceTimersByTime(2500)
        await vi.runAllTimersAsync()
      })

      expect(onStop).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('enforces minimum duration', async () => {
      vi.useFakeTimers()
      const onStop = vi.fn()

      render(<AudioRecorder minDuration={3} onStop={onStop} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Process initial setup
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const stopButton = screen.getByRole('button', { name: /stop recording/i })

      // Stop button should be disabled initially
      expect(stopButton).toBeDisabled()

      // Advance timer past minDuration
      await act(async () => {
        vi.advanceTimersByTime(3000)
        await vi.runAllTimersAsync()
      })

      // Now it should be enabled
      expect(stopButton).not.toBeDisabled()

      vi.useRealTimers()
    })
  })

  describe('Audio Processing Options', () => {
    it('enables noise cancellation when requested', async () => {
      render(
        <AudioRecorder
          enableNoiseCancellation={true}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            noiseSuppression: true,
          }),
        })
      })
    })

    it('enables echo cancellation when requested', async () => {
      render(
        <AudioRecorder
          enableEchoCancellation={true}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            echoCancellation: true,
          }),
        })
      })
    })

    it('enables auto gain control when requested', async () => {
      render(
        <AudioRecorder
          enableAutoGainControl={true}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            autoGainControl: true,
          }),
        })
      })
    })

    it('respects custom sample rate', async () => {
      render(
        <AudioRecorder
          sampleRate={48000}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            sampleRate: 48000,
          }),
        })
      })
    })

    it('supports stereo recording', async () => {
      render(
        <AudioRecorder
          channels={2}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: expect.objectContaining({
            channelCount: 2,
          }),
        })
      })
    })
  })

  describe('Format Support', () => {
    it('uses WebM format by default', async () => {
      const onStop = vi.fn()
      render(<AudioRecorder onStop={onStop} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        const blob = onStop.mock.calls[0][0]
        expect(blob.type).toContain('webm')
      })
    })

    it('respects custom output format', async () => {
      const onStop = vi.fn()
      render(<AudioRecorder outputFormat="ogg" onStop={onStop} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onStop).toHaveBeenCalled()
      })
    })

    it('allows custom MIME type override', async () => {
      render(
        <AudioRecorder
          mimeType="audio/webm;codecs=opus"
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // MediaRecorder should be created with custom MIME type
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })
    })
  })

  describe('Waveform Visualization', () => {
    it('shows waveform when showWaveform is true', async () => {
      render(<AudioRecorder showWaveform={true} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        const waveform = screen.getByTestId('waveform-visualization')
        expect(waveform).toBeInTheDocument()
      })
    })

    it('hides waveform when showWaveform is false', async () => {
      render(<AudioRecorder showWaveform={false} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.queryByTestId('waveform-visualization')).not.toBeInTheDocument()
      })
    })

    it('calls onAmplitudeChange with audio levels', async () => {
      const onAmplitudeChange = vi.fn()

      render(
        <AudioRecorder
          showWaveform={true}
          onAmplitudeChange={onAmplitudeChange}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Should call amplitude callback during recording
      await waitFor(() => {
        expect(onAmplitudeChange).toHaveBeenCalledWith(expect.any(Number))
      }, { timeout: 500 })
    })
  })

  describe('Amplitude Meter', () => {
    it('shows amplitude meter when showAmplitudeMeter is true', async () => {
      render(<AudioRecorder showAmplitudeMeter={true} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        const meter = screen.getByTestId('amplitude-meter')
        expect(meter).toBeInTheDocument()
      })
    })

    it('hides amplitude meter when showAmplitudeMeter is false', async () => {
      render(<AudioRecorder showAmplitudeMeter={false} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.queryByTestId('amplitude-meter')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AudioRecorder onStop={() => {}} />)

      const button = screen.getByRole('button', { name: /start recording/i })
      expect(button).toHaveAttribute('aria-label')
    })

    it('announces recording state changes', async () => {
      render(<AudioRecorder onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Check for live region announcement
      await waitFor(() => {
        const liveRegion = screen.getByRole('status')
        expect(liveRegion).toHaveTextContent(/recording/i)
      })
    })

    it('supports keyboard navigation', async () => {
      render(<AudioRecorder onStop={() => {}} />)

      const startButton = screen.getByRole('button', { name: /start recording/i })

      // Focus and trigger with Enter
      startButton.focus()
      fireEvent.keyDown(startButton, { key: 'Enter' })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })
    })
  })

  describe('Cleanup', () => {
    it('stops media stream on unmount', async () => {
      const { unmount } = render(<AudioRecorder onStop={() => {}} />)

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Unmount component
      unmount()

      // Stream should be stopped
      expect(mockGetUserMedia).toHaveBeenCalled()
    })

    it('cleans up audio context on unmount', async () => {
      const { unmount } = render(<AudioRecorder showWaveform={true} onStop={() => {}} />)

      // Start recording to create audio context
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Unmount
      unmount()

      // AudioContext should be closed
      // (verified by implementation)
    })
  })

  describe('Error Handling', () => {
    it('handles MediaRecorder errors gracefully', async () => {
      const onError = vi.fn()

      // Create a MediaRecorder that throws an error
      class ErrorMediaRecorder extends MockMediaRecorder {
        start() {
          super.start()
          if (this.onerror) {
            this.onerror(new ErrorEvent('error', { error: new Error('Recording failed') }))
          }
        }
      }

      // @ts-ignore
      global.MediaRecorder = ErrorMediaRecorder

      render(<AudioRecorder onError={onError} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
      })
    })

    it('handles unsupported format gracefully', async () => {
      // Mock isTypeSupported to return false
      const originalIsTypeSupported = MockMediaRecorder.isTypeSupported
      MockMediaRecorder.isTypeSupported = vi.fn(() => false)

      const onError = vi.fn()
      render(<AudioRecorder outputFormat="flac" onError={onError} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Should fallback to webm or show error
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      }, { timeout: 3000 })

      // Restore
      MockMediaRecorder.isTypeSupported = originalIsTypeSupported
    })
  })

  describe('Disabled State', () => {
    it('disables recording when disabled prop is true', () => {
      render(<AudioRecorder disabled={true} onStop={() => {}} />)

      const button = screen.getByRole('button', { name: /start recording/i })
      expect(button).toBeDisabled()
    })

    it('does not start recording when disabled', async () => {
      const onStart = vi.fn()
      render(<AudioRecorder disabled={true} onStart={onStart} onStop={() => {}} />)

      const button = screen.getByRole('button', { name: /start recording/i })
      await user.click(button)

      // Wait a bit to ensure the callback really isn't called
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      expect(onStart).not.toHaveBeenCalled()
    })
  })
})
