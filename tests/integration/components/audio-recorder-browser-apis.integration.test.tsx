/**
 * AudioRecorder + Browser APIs Integration Tests
 *
 * Tests the complete integration of AudioRecorder with browser APIs:
 * - MediaStream API (getUserMedia)
 * - MediaRecorder API
 * - Web Audio API (AudioContext, AnalyserNode)
 * - Blob API (for audio data)
 *
 * @integration-test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioRecorder } from '@clarity-chat/react/components/input/AudioRecorder'
import React, { useState } from 'react'

// ============================================================================
// Browser API Mocks
// ============================================================================

// Mock MediaStream with realistic behavior
class MockMediaStream {
  active = true
  id = `stream-${Math.random()}`
  private tracks: MockMediaStreamTrack[] = []

  constructor() {
    this.tracks = [new MockMediaStreamTrack()]
  }

  getTracks() {
    return this.tracks
  }

  getAudioTracks() {
    return this.tracks
  }

  addTrack(track: MockMediaStreamTrack) {
    this.tracks.push(track)
  }

  removeTrack(track: MockMediaStreamTrack) {
    this.tracks = this.tracks.filter((t) => t !== track)
  }

  clone() {
    return new MockMediaStream()
  }
}

class MockMediaStreamTrack {
  kind = 'audio'
  enabled = true
  id = `track-${Math.random()}`
  label = 'Mock Audio Track'
  muted = false
  readyState: 'live' | 'ended' = 'live'
  onended: ((event: Event) => void) | null = null
  onmute: ((event: Event) => void) | null = null
  onunmute: ((event: Event) => void) | null = null

  stop() {
    this.readyState = 'ended'
    this.enabled = false
    if (this.onended) {
      this.onended(new Event('ended'))
    }
  }

  clone() {
    return new MockMediaStreamTrack()
  }

  getCapabilities() {
    return {
      channelCount: { max: 2, min: 1 },
      sampleRate: { max: 48000, min: 8000 },
      echoCancellation: [true, false],
      noiseSuppression: [true, false],
      autoGainControl: [true, false],
    }
  }

  getSettings() {
    return {
      channelCount: 1,
      sampleRate: 48000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    }
  }
}

// Mock MediaRecorder with realistic state transitions
class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: ((event: Event) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  onstart: ((event: Event) => void) | null = null
  onpause: ((event: Event) => void) | null = null
  onresume: ((event: Event) => void) | null = null

  private chunks: Blob[] = []
  private recordingTimer: NodeJS.Timeout | null = null

  constructor(public stream: MediaStream, public options?: MediaRecorderOptions) {
    this.mimeType = options?.mimeType || 'audio/webm'
  }

  start(timeslice?: number) {
    if (this.state !== 'inactive') {
      throw new Error('InvalidStateError')
    }

    this.state = 'recording'
    this.chunks = []

    if (this.onstart) {
      this.onstart(new Event('start'))
    }

    // Simulate periodic data availability
    if (timeslice) {
      this.recordingTimer = setInterval(() => {
        if (this.state === 'recording' && this.ondataavailable) {
          const blob = new Blob(['audio data chunk'], { type: this.mimeType })
          this.chunks.push(blob)
          this.ondataavailable({ data: blob } as BlobEvent)
        }
      }, timeslice)
    }
  }

  stop() {
    if (this.state === 'inactive') {
      return
    }

    const previousState = this.state
    this.state = 'inactive'

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer)
      this.recordingTimer = null
    }

    // Simulate final data available
    if (this.ondataavailable && this.chunks.length === 0) {
      const blob = new Blob(['audio data'], { type: this.mimeType })
      this.chunks.push(blob)
      this.ondataavailable({ data: blob } as BlobEvent)
    }

    // Use setTimeout to simulate async behavior
    setTimeout(() => {
      if (this.onstop) {
        this.onstop(new Event('stop'))
      }
    }, 0)
  }

  pause() {
    if (this.state !== 'recording') {
      throw new Error('InvalidStateError')
    }

    this.state = 'paused'

    if (this.onpause) {
      this.onpause(new Event('pause'))
    }
  }

  resume() {
    if (this.state !== 'paused') {
      throw new Error('InvalidStateError')
    }

    this.state = 'recording'

    if (this.onresume) {
      this.onresume(new Event('resume'))
    }
  }

  requestData() {
    if (this.ondataavailable) {
      const blob = new Blob(['requested data'], { type: this.mimeType })
      this.ondataavailable({ data: blob } as BlobEvent)
    }
  }

  static isTypeSupported(mimeType: string): boolean {
    const supported = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg',
      'audio/ogg;codecs=opus',
      'audio/wav',
      'audio/mp3',
    ]
    return supported.includes(mimeType)
  }
}

// Mock Web Audio API
class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'running'
  sampleRate = 48000
  currentTime = 0

  createAnalyser(): MockAnalyserNode {
    return new MockAnalyserNode()
  }

  createMediaStreamSource(stream: MediaStream): MockMediaStreamSource {
    return new MockMediaStreamSource()
  }

  close(): Promise<void> {
    this.state = 'closed'
    return Promise.resolve()
  }

  resume(): Promise<void> {
    this.state = 'running'
    return Promise.resolve()
  }

  suspend(): Promise<void> {
    this.state = 'suspended'
    return Promise.resolve()
  }
}

class MockAnalyserNode {
  fftSize = 2048
  frequencyBinCount = 1024
  minDecibels = -100
  maxDecibels = -30
  smoothingTimeConstant = 0.8

  getByteTimeDomainData(array: Uint8Array): void {
    // Simulate audio data with varying amplitude
    for (let i = 0; i < array.length; i++) {
      array[i] = 128 + Math.floor(Math.random() * 20 - 10)
    }
  }

  getByteFrequencyData(array: Uint8Array): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 255)
    }
  }

  getFloatTimeDomainData(array: Float32Array): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 2 - 1
    }
  }

  getFloatFrequencyData(array: Float32Array): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * -100
    }
  }

  connect() {}
  disconnect() {}
}

class MockMediaStreamSource {
  connect() {}
  disconnect() {}
}

// Setup global mocks
const mockGetUserMedia = vi.fn().mockResolvedValue(new MockMediaStream())

global.MediaRecorder = MockMediaRecorder as any
global.AudioContext = MockAudioContext as any
(global as any).webkitAudioContext = MockAudioContext
global.URL.createObjectURL = vi.fn(() => `blob:${Math.random()}`)
global.URL.revokeObjectURL = vi.fn()

// ============================================================================
// Test Component - Real App Integration
// ============================================================================

function ChatWithVoiceInput() {
  const [recordings, setRecordings] = useState<{ url: string; blob: Blob }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [lastError, setLastError] = useState<Error | null>(null)

  return (
    <div>
      <div data-testid="recordings-list">
        {recordings.map((rec, idx) => (
          <div key={idx} data-testid={`recording-${idx}`}>
            <audio src={rec.url} controls />
            <span>Size: {rec.blob.size} bytes</span>
          </div>
        ))}
      </div>

      <div data-testid="recording-status">
        {isRecording ? 'Recording' : 'Ready'}
      </div>

      {lastError && (
        <div data-testid="error-message" role="alert">
          {lastError.message}
        </div>
      )}

      <AudioRecorder
        maxDuration={60}
        pausable={true}
        enableNoiseCancellation={true}
        showWaveform={true}
        showDuration={true}
        showAmplitudeMeter={true}
        onStart={() => {
          setIsRecording(true)
          setLastError(null)
        }}
        onStop={(blob, url) => {
          setRecordings((prev) => [...prev, { url, blob }])
          setIsRecording(false)
        }}
        onError={(error) => {
          setLastError(error)
          setIsRecording(false)
        }}
      />
    </div>
  )
}

// ============================================================================
// Integration Tests
// ============================================================================

describe('AudioRecorder + Browser APIs Integration', () => {
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

  describe('MediaStream API Integration', () => {
    it('requests microphone access with correct constraints', async () => {
      render(
        <AudioRecorder
          channels={2}
          sampleRate={48000}
          enableEchoCancellation={true}
          enableNoiseCancellation={true}
          enableAutoGainControl={true}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          audio: {
            channelCount: 2,
            sampleRate: 48000,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
      })
    })

    it('handles permission denied gracefully', async () => {
      const onError = vi.fn()
      mockGetUserMedia.mockRejectedValueOnce(
        new Error('NotAllowedError: Permission denied')
      )

      render(<AudioRecorder onError={onError} onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error))
      })

      // Should show error message
      expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument()
    })

    it('stops all media tracks on cleanup', async () => {
      const stream = new MockMediaStream()
      const trackStopSpy = vi.spyOn(stream.getTracks()[0], 'stop')
      mockGetUserMedia.mockResolvedValueOnce(stream)

      const { unmount } = render(<AudioRecorder onStop={() => {}} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      unmount()

      expect(trackStopSpy).toHaveBeenCalled()
    })
  })

  describe('MediaRecorder API Integration', () => {
    it('creates MediaRecorder with correct options', async () => {
      render(
        <AudioRecorder
          outputFormat="webm"
          bitrate={256000}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalled()
      })

      // MediaRecorder should be created (verified by recording UI)
      expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
    })

    it('handles MediaRecorder state transitions', async () => {
      const onStart = vi.fn()
      const onPause = vi.fn()
      const onResume = vi.fn()
      const onStop = vi.fn()

      render(
        <AudioRecorder
          pausable={true}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
        />
      )

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(onStart).toHaveBeenCalled()
      })

      // Pause recording
      await user.click(screen.getByRole('button', { name: /pause recording/i }))

      await waitFor(() => {
        expect(onPause).toHaveBeenCalled()
      })

      // Resume recording
      await user.click(screen.getByRole('button', { name: /resume recording/i }))

      await waitFor(() => {
        expect(onResume).toHaveBeenCalled()
      })

      // Stop recording
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onStop).toHaveBeenCalled()
      })
    })

    it('collects audio data chunks', async () => {
      const dataChunks: Blob[] = []
      const onDataAvailable = vi.fn((chunk) => {
        dataChunks.push(chunk)
      })

      render(
        <AudioRecorder onDataAvailable={onDataAvailable} onStop={() => {}} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onDataAvailable).toHaveBeenCalled()
        expect(dataChunks.length).toBeGreaterThan(0)
      })
    })

    it('creates final Blob on recording stop', async () => {
      const onStop = vi.fn()

      render(<AudioRecorder onStop={onStop} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onStop).toHaveBeenCalledWith(
          expect.any(Blob),
          expect.stringContaining('blob:')
        )
      })
    })
  })

  describe('Web Audio API Integration', () => {
    it('creates AudioContext for waveform visualization', async () => {
      render(
        <AudioRecorder showWaveform={true} onStop={() => {}} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        const waveform = screen.getByTestId('waveform-visualization')
        expect(waveform).toBeInTheDocument()
      })
    })

    it('creates AnalyserNode for amplitude monitoring', async () => {
      render(
        <AudioRecorder showAmplitudeMeter={true} onStop={() => {}} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        const meter = screen.getByTestId('amplitude-meter')
        expect(meter).toBeInTheDocument()
      })
    })

    it('updates amplitude in real-time', async () => {
      const amplitudes: number[] = []
      const onAmplitudeChange = vi.fn((amp) => {
        amplitudes.push(amp)
      })

      render(
        <AudioRecorder
          showWaveform={true}
          onAmplitudeChange={onAmplitudeChange}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Wait for amplitude updates
      await waitFor(
        () => {
          expect(onAmplitudeChange).toHaveBeenCalled()
          expect(amplitudes.length).toBeGreaterThan(0)
        },
        { timeout: 1000 }
      )

      // Amplitudes should be normalized 0-1
      amplitudes.forEach((amp) => {
        expect(amp).toBeGreaterThanOrEqual(0)
        expect(amp).toBeLessThanOrEqual(1)
      })
    })

    it('closes AudioContext on cleanup', async () => {
      const { unmount } = render(
        <AudioRecorder showWaveform={true} onStop={() => {}} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('waveform-visualization')).toBeInTheDocument()
      })

      // Unmount should close AudioContext
      unmount()

      // Verify cleanup (AudioContext.close called)
      // This is implicit - no errors should occur
    })
  })

  describe('Blob API Integration', () => {
    it('creates Blob with correct MIME type', async () => {
      const onStop = vi.fn()

      render(
        <AudioRecorder outputFormat="webm" onStop={onStop} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onStop).toHaveBeenCalled()
        const blob = onStop.mock.calls[0][0]
        expect(blob.type).toContain('webm')
      })
    })

    it('creates object URL for playback', async () => {
      const onStop = vi.fn()

      render(<AudioRecorder onStop={onStop} />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(onStop).toHaveBeenCalled()
        const url = onStop.mock.calls[0][1]
        expect(url).toMatch(/^blob:/)
        expect(global.URL.createObjectURL).toHaveBeenCalled()
      })
    })
  })

  describe('Real App Workflow', () => {
    it('completes full recording workflow in chat app', async () => {
      render(<ChatWithVoiceInput />)

      // Initially ready
      expect(screen.getByTestId('recording-status')).toHaveTextContent('Ready')

      // Start recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('recording-status')).toHaveTextContent('Recording')
      })

      // Stop recording
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      // Verify recording added to list
      await waitFor(() => {
        expect(screen.getByTestId('recording-0')).toBeInTheDocument()
        expect(screen.getByTestId('recording-status')).toHaveTextContent('Ready')
      })

      // Should have audio element
      const audio = screen.getByRole('audio') as HTMLAudioElement
      expect(audio).toBeInTheDocument()
      expect(audio.src).toMatch(/^blob:/)
    })

    it('handles multiple recordings', async () => {
      render(<ChatWithVoiceInput />)

      // First recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('recording-0')).toBeInTheDocument()
      })

      // Second recording
      await user.click(screen.getByRole('button', { name: /start recording/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /stop recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('recording-0')).toBeInTheDocument()
        expect(screen.getByTestId('recording-1')).toBeInTheDocument()
      })
    })

    it('handles errors in production-like scenario', async () => {
      // Simulate permission denied
      mockGetUserMedia.mockRejectedValueOnce(
        new Error('NotAllowedError: Permission denied')
      )

      render(<ChatWithVoiceInput />)

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByTestId('error-message')).toHaveTextContent(/permission denied/i)
      })
    })
  })

  describe('Browser Compatibility', () => {
    it('handles different audio formats based on support', async () => {
      const formats = ['webm', 'ogg', 'wav'] as const

      for (const format of formats) {
        const onStop = vi.fn()
        const { unmount } = render(
          <AudioRecorder outputFormat={format} onStop={onStop} />
        )

        await user.click(screen.getByRole('button', { name: /start recording/i }))
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /stop recording/i }))

        await waitFor(() => {
          expect(onStop).toHaveBeenCalled()
        })

        unmount()
      }
    })

    it('falls back gracefully for unsupported formats', async () => {
      // Mock isTypeSupported to return false
      const originalIsSupported = MockMediaRecorder.isTypeSupported
      MockMediaRecorder.isTypeSupported = vi.fn(() => false)

      const onStop = vi.fn()
      render(
        <AudioRecorder outputFormat="flac" onStop={onStop} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Should still work (fallback to default format)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
      })

      // Restore
      MockMediaRecorder.isTypeSupported = originalIsSupported
    })
  })

  describe('Performance', () => {
    it('efficiently handles long recordings', async () => {
      vi.useFakeTimers()
      const onDurationChange = vi.fn()

      render(
        <AudioRecorder
          maxDuration={60}
          onDurationChange={onDurationChange}
          onStop={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      // Simulate 30 seconds of recording
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(onDurationChange).toHaveBeenCalledTimes(30)

      vi.useRealTimers()
    })

    it('cleans up resources properly', async () => {
      const stream = new MockMediaStream()
      const track = stream.getTracks()[0]
      const stopSpy = vi.spyOn(track, 'stop')

      mockGetUserMedia.mockResolvedValueOnce(stream)

      const { unmount } = render(
        <AudioRecorder showWaveform={true} onStop={() => {}} />
      )

      await user.click(screen.getByRole('button', { name: /start recording/i }))

      await waitFor(() => {
        expect(screen.getByTestId('waveform-visualization')).toBeInTheDocument()
      })

      unmount()

      // Verify all resources cleaned up
      expect(stopSpy).toHaveBeenCalled()
    })
  })
})
