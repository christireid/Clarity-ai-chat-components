# AudioRecorder Best Practices

Robust patterns and best practices for implementing audio recording in your application.

## Table of Contents

- [User Experience](#user-experience)
- [Performance](#performance)
- [Error Handling](#error-handling)
- [Security](#security)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## User Experience

### 1. Request Permissions Thoughtfully

**Don't**: Auto-request microphone permission on page load
```tsx
// ❌ Bad: Unexpected permission request
useEffect(() => {
  navigator.mediaDevices.getUserMedia({ audio: true })
}, [])
```

**Do**: Request permission in response to user action with context
```tsx
// ✅ Good: Clear user intent
<div className="permission-prompt">
  <p>We need microphone access to record your voice message.</p>
  <button onClick={handleRequestPermission}>
    Allow Microphone Access
  </button>
</div>
```

### 2. Provide Visual Feedback

Always show recording state clearly:

```tsx
<AudioRecorder
  showWaveform={true}          // Real-time visualization
  showDuration={true}           // Time elapsed
  showAmplitudeMeter={true}     // Input level
  onAmplitudeChange={(amplitude) => {
    // Warn if input too low
    if (amplitude < 0.05) {
      showWarning('Microphone input is very low')
    }
  }}
/>
```

### 3. Set Appropriate Limits

```tsx
<AudioRecorder
  maxDuration={300}      // 5 minutes - prevents huge files
  minDuration={1}        // 1 second - prevents accidental clicks
  onDurationChange={(duration) => {
    // Warn when approaching limit
    if (duration >= 270) { // 4.5 minutes
      showWarning('You have 30 seconds remaining')
    }
  }}
/>
```

### 4. Allow Retry and Preview

```tsx
function RecordingFlow() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

  if (isConfirmed && audioUrl) {
    return <UploadingState url={audioUrl} />
  }

  return (
    <div>
      {!audioUrl ? (
        // Recording phase
        <AudioRecorder
          onStop={(blob, url) => setAudioUrl(url)}
        />
      ) : (
        // Preview and confirm phase
        <div>
          <audio controls src={audioUrl} />
          <button onClick={() => setAudioUrl(null)}>
            Re-record
          </button>
          <button onClick={() => setIsConfirmed(true)}>
            Confirm and Upload
          </button>
        </div>
      )}
    </div>
  )
}
```

### 5. Show Progress During Upload

```tsx
async function uploadWithProgress(blob: Blob) {
  const [progress, setProgress] = useState(0)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      const percent = (e.loaded / e.total) * 100
      setProgress(percent)
    })

    xhr.addEventListener('load', () => resolve(xhr.response))
    xhr.addEventListener('error', () => reject(new Error('Upload failed')))

    xhr.open('POST', '/api/upload')
    xhr.send(blob)
  })
}

// In component
{uploading && (
  <div className="upload-progress">
    <div className="progress-bar" style={{ width: `${progress}%` }} />
    <p>{Math.round(progress)}% uploaded</p>
  </div>
)}
```

## Performance

### 1. Lazy Load the Component

```tsx
import { lazy, Suspense } from 'react'

const AudioRecorder = lazy(() =>
  import('@clarity-chat/react').then(module => ({
    default: module.AudioRecorder
  }))
)

function MyComponent() {
  return (
    <Suspense fallback={<RecorderSkeleton />}>
      <AudioRecorder {...props} />
    </Suspense>
  )
}
```

### 2. Cleanup Object URLs

```tsx
function useAudioRecording() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    // Cleanup on unmount or when URL changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const handleStop = (blob: Blob, url: string) => {
    // Revoke previous URL if exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(url)
  }

  return { audioUrl, handleStop }
}
```

### 3. Optimize for Long Recordings

```tsx
// Stream chunks to server instead of buffering
<AudioRecorder
  maxDuration={3600}  // 1 hour
  onDataAvailable={async (chunk) => {
    // Upload immediately, don't store in memory
    await uploadChunk(chunk)
  }}
  onStop={async () => {
    // Finalize on server
    await finalizeRecording()
  }}
/>
```

### 4. Throttle Expensive Callbacks

```tsx
import { throttle } from 'lodash'

const throttledAmplitude = useMemo(
  () => throttle((amplitude: number) => {
    updateVisualization(amplitude)
  }, 100), // Update every 100ms instead of 60fps
  []
)

<AudioRecorder onAmplitudeChange={throttledAmplitude} />
```

### 5. Reduce Bitrate for Voice

```tsx
// Voice recordings don't need high bitrate
<AudioRecorder
  bitrate={64000}     // 64 kbps is fine for voice
  channels={1}        // Mono for voice
  outputFormat="webm" // Best compression
/>
```

## Error Handling

### 1. Comprehensive Error Handling

```tsx
function RobustRecorder() {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (error: Error) => {
    console.error('Recording error:', error)
    setError(error)

    // Categorize errors
    if (error.message.includes('Permission denied')) {
      showPermissionGuide()
    } else if (error.message.includes('not supported')) {
      showBrowserUpgradeMessage()
    } else {
      showGenericErrorMessage()
    }

    // Track errors
    analytics.track('recording_error', {
      message: error.message,
      stack: error.stack,
    })
  }

  return (
    <div>
      <AudioRecorder onError={handleError} />
      {error && <ErrorDisplay error={error} />}
    </div>
  )
}
```

### 2. Graceful Degradation

```tsx
function RecorderWithFallback() {
  const isSupported =
    typeof window !== 'undefined' &&
    'mediaDevices' in navigator &&
    'MediaRecorder' in window

  if (!isSupported) {
    return <FileUploadFallback />
  }

  return <AudioRecorder {...props} />
}
```

### 3. Retry Logic

```tsx
async function uploadWithRetry(blob: Blob, maxRetries = 3) {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await uploadAudio(blob)
    } catch (error) {
      lastError = error as Error
      console.log(`Upload attempt ${i + 1} failed, retrying...`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  throw lastError!
}
```

### 4. Network Error Handling

```tsx
async function uploadAudio(blob: Blob) {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: blob,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new Error('Network connection lost. Please check your internet.')
    }
    throw error
  }
}
```

## Security

### 1. Validate File Size

```tsx
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

<AudioRecorder
  onStop={(blob) => {
    if (blob.size > MAX_FILE_SIZE) {
      alert('Recording too large. Maximum size is 10 MB.')
      return
    }
    uploadAudio(blob)
  }}
/>
```

### 2. Validate MIME Type

```tsx
const ALLOWED_TYPES = ['audio/webm', 'audio/wav', 'audio/ogg', 'audio/mp4']

<AudioRecorder
  onStop={(blob) => {
    if (!ALLOWED_TYPES.includes(blob.type)) {
      console.error('Invalid audio type:', blob.type)
      return
    }
    uploadAudio(blob)
  }}
/>
```

### 3. Use HTTPS

```tsx
// Check if running on HTTPS
if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
  console.warn('AudioRecorder requires HTTPS in production')
}
```

### 4. Implement Rate Limiting

```tsx
function useRateLimit(maxUploads = 10, windowMs = 60000) {
  const uploads = useRef<number[]>([])

  const canUpload = () => {
    const now = Date.now()
    // Remove uploads outside time window
    uploads.current = uploads.current.filter(time => now - time < windowMs)
    return uploads.current.length < maxUploads
  }

  const recordUpload = () => {
    uploads.current.push(Date.now())
  }

  return { canUpload, recordUpload }
}

function RateLimitedRecorder() {
  const { canUpload, recordUpload } = useRateLimit()

  const handleStop = async (blob: Blob) => {
    if (!canUpload()) {
      alert('Too many uploads. Please wait a moment.')
      return
    }

    recordUpload()
    await uploadAudio(blob)
  }

  return <AudioRecorder onStop={handleStop} />
}
```

### 5. Sanitize Filenames

```tsx
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

<AudioRecorder
  onStop={(blob) => {
    const filename = sanitizeFilename(`recording_${Date.now()}.webm`)
    const file = new File([blob], filename, { type: blob.type })
    uploadAudio(file)
  }}
/>
```

## Accessibility

### 1. Keyboard Navigation

```tsx
// Component already supports keyboard navigation
// Ensure focus management in your UI
function AccessibleRecorder() {
  const recorderRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    // Focus recorder after starting
    recorderRef.current?.focus()
  }

  return (
    <div ref={recorderRef} tabIndex={0}>
      <AudioRecorder onStart={handleStart} />
    </div>
  )
}
```

### 2. Screen Reader Announcements

```tsx
function AnnouncedRecorder() {
  const [status, setStatus] = useState('Ready')

  return (
    <div>
      <AudioRecorder
        onStart={() => setStatus('Recording started')}
        onStop={() => setStatus('Recording stopped')}
        onPause={() => setStatus('Recording paused')}
      />

      {/* Live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {status}
      </div>
    </div>
  )
}
```

### 3. Provide Text Alternatives

```tsx
<div className="recording-controls">
  <AudioRecorder />

  {/* Alternative for users who can't record */}
  <details className="mt-4">
    <summary>Can't record audio?</summary>
    <p>
      You can also <a href="/upload">upload an audio file</a> or{' '}
      <a href="/text">type your message instead</a>.
    </p>
  </details>
</div>
```

## Testing

### 1. Mock MediaRecorder

```typescript
// test-utils/mocks.ts
export class MockMediaRecorder implements MediaRecorder {
  state: RecordingState = 'inactive'
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null

  start() {
    this.state = 'recording'
  }

  stop() {
    this.state = 'inactive'
    const blob = new Blob(['test audio'], { type: 'audio/webm' })
    this.ondataavailable?.({ data: blob } as BlobEvent)
    this.onstop?.()
  }

  pause() {
    this.state = 'paused'
  }

  resume() {
    this.state = 'recording'
  }
}

// Setup in tests
beforeAll(() => {
  global.MediaRecorder = MockMediaRecorder as any
  global.navigator.mediaDevices = {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  } as any
})
```

### 2. Test Recording Flow

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AudioRecorder } from '@clarity-chat/react'

describe('AudioRecorder', () => {
  it('records and stops', async () => {
    const onStop = vi.fn()
    render(<AudioRecorder onStop={onStop} />)

    // Start recording
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText(/recording/i)).toBeInTheDocument()
    })

    // Stop recording
    const stopButton = screen.getByRole('button', { name: /stop/i })
    fireEvent.click(stopButton)

    await waitFor(() => {
      expect(onStop).toHaveBeenCalled()
    })
  })

  it('handles permission denial', async () => {
    const onError = vi.fn()

    // Mock permission denial
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(
      new Error('Permission denied')
    )

    render(<AudioRecorder onError={onError} />)

    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Permission denied' })
      )
    })
  })
})
```

### 3. Integration Tests

```typescript
describe('Audio Upload Integration', () => {
  it('uploads recorded audio', async () => {
    const mockServer = setupMockServer()

    render(<RecordingFlow />)

    // Record audio
    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    await waitFor(() => screen.getByText(/recording/i))

    fireEvent.click(screen.getByRole('button', { name: /stop/i }))

    // Confirm and upload
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(mockServer.lastRequest.url).toBe('/api/upload')
      expect(mockServer.lastRequest.body).toBeInstanceOf(FormData)
    })
  })
})
```

## Production Deployment

### 1. Environment Checks

```tsx
// lib/audio-support.ts
export function checkAudioSupport() {
  const checks = {
    mediaDevices: 'mediaDevices' in navigator,
    mediaRecorder: 'MediaRecorder' in window,
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
  }

  const isSupported = Object.values(checks).every(Boolean)

  return {
    isSupported,
    checks,
    browserInfo: {
      name: getBrowserName(),
      version: getBrowserVersion(),
    },
  }
}

// Use in production
function ProductionRecorder() {
  const support = checkAudioSupport()

  useEffect(() => {
    // Log support info
    analytics.track('audio_support_check', support)
  }, [])

  if (!support.isSupported) {
    return <UnsupportedBrowserMessage details={support} />
  }

  return <AudioRecorder {...props} />
}
```

### 2. Error Tracking

```tsx
import * as Sentry from '@sentry/react'

<AudioRecorder
  onError={(error) => {
    // Log to error tracking service
    Sentry.captureException(error, {
      tags: {
        component: 'AudioRecorder',
      },
      contexts: {
        audio: {
          browser: navigator.userAgent,
          mediaDevices: 'mediaDevices' in navigator,
          mediaRecorder: 'MediaRecorder' in window,
        },
      },
    })

    // Show user-friendly error
    showError('Recording failed. Please try again.')
  }}
/>
```

### 3. Analytics

```tsx
<AudioRecorder
  onStart={() => {
    analytics.track('recording_started')
  }}
  onStop={(blob) => {
    analytics.track('recording_completed', {
      duration: blob.size / 128000, // Estimate duration
      size: blob.size,
      format: blob.type,
    })
  }}
  onError={(error) => {
    analytics.track('recording_error', {
      error: error.message,
    })
  }}
/>
```

### 4. CDN Configuration

```tsx
// Store recordings on CDN
async function uploadToCDN(blob: Blob) {
  // Generate unique filename
  const filename = `recordings/${Date.now()}-${Math.random().toString(36).slice(2)}.webm`

  // Upload to S3/CloudFront
  const uploadUrl = await getSignedUploadUrl(filename)

  await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': blob.type,
    },
  })

  return `https://cdn.yourapp.com/${filename}`
}
```

### 5. Monitoring

```tsx
// Monitor recording success rates
useEffect(() => {
  const startTime = Date.now()

  return () => {
    const duration = Date.now() - startTime
    metrics.timing('recording_session_duration', duration)
  }
}, [])

<AudioRecorder
  onStop={(blob) => {
    metrics.increment('recording_completed')
    metrics.histogram('recording_size', blob.size)
  }}
  onError={() => {
    metrics.increment('recording_failed')
  }}
/>
```

## Summary Checklist

### User Experience
- [ ] Request permissions with context
- [ ] Show visual feedback during recording
- [ ] Set appropriate duration limits
- [ ] Allow preview and retry
- [ ] Show upload progress

### Performance
- [ ] Lazy load component
- [ ] Cleanup object URLs
- [ ] Optimize for long recordings
- [ ] Throttle expensive callbacks
- [ ] Use appropriate bitrate

### Error Handling
- [ ] Handle all error types
- [ ] Provide fallbacks
- [ ] Implement retry logic
- [ ] Track errors

### Security
- [ ] Validate file size
- [ ] Validate MIME type
- [ ] Use HTTPS
- [ ] Implement rate limiting
- [ ] Sanitize filenames

### Accessibility
- [ ] Support keyboard navigation
- [ ] Provide screen reader announcements
- [ ] Offer text alternatives

### Testing
- [ ] Mock MediaRecorder
- [ ] Test recording flow
- [ ] Integration tests

### Production
- [ ] Check environment support
- [ ] Set up error tracking
- [ ] Add analytics
- [ ] Configure CDN
- [ ] Monitor metrics

## Related Resources

- [API Reference](/reference/components/audio-recorder)
- [Troubleshooting Guide](/reference/components/audio-recorder/troubleshooting)
- [Examples](/examples/audio-recorder)
