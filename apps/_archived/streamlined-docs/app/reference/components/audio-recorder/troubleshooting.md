# AudioRecorder Troubleshooting Guide

Common issues and solutions for the AudioRecorder component.

## Table of Contents

- [Permission Issues](#permission-issues)
- [Recording Issues](#recording-issues)
- [Audio Quality Issues](#audio-quality-issues)
- [Browser Compatibility](#browser-compatibility)
- [File Size Issues](#file-size-issues)
- [Performance Issues](#performance-issues)
- [Upload Issues](#upload-issues)

## Permission Issues

### Microphone Permission Denied

**Symptom**: Recording doesn't start, error message about permission denied.

**Causes**:
- User denied microphone access
- Browser doesn't have microphone permission
- HTTPS required (doesn't work on HTTP)

**Solutions**:

1. **Check browser permissions**:
```tsx
const checkPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' })
    console.log('Permission state:', result.state)
    // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.error('Permission check failed:', error)
  }
}
```

2. **Show permission guide to users**:
```tsx
<AudioRecorder
  onError={(error) => {
    if (error.message.includes('Permission denied')) {
      alert(`
        Microphone access denied. To enable:

        Chrome: Click the camera icon in address bar
        Firefox: Click the microphone icon in address bar
        Safari: Safari → Settings → Websites → Microphone
      `)
    }
  }}
/>
```

3. **Ensure HTTPS**:
```bash
# Local development with HTTPS
npm install -g local-ssl-proxy
local-ssl-proxy --source 3001 --target 3000
```

### Permission Prompt Not Showing

**Symptom**: Permission dialog never appears.

**Causes**:
- Recording not triggered by user action
- Browser blocked repeated permission requests
- autoStart used without user gesture

**Solutions**:

1. **Always start from user action**:
```tsx
// ✅ Good: User-initiated
<button onClick={() => recorderRef.current?.start()}>
  Start Recording
</button>

// ❌ Bad: Auto-start without user action
<AudioRecorder autoStart={true} /> // May be blocked
```

2. **Reset browser permissions**:
- Chrome: chrome://settings/content/microphone
- Firefox: about:preferences#privacy
- Safari: Safari → Settings → Websites → Microphone

## Recording Issues

### No Audio Recorded

**Symptom**: Recording completes but Blob is empty or very small.

**Causes**:
- Wrong input device selected
- Microphone muted
- Browser selecting wrong audio source

**Solutions**:

1. **Test microphone**:
```tsx
const testMicrophone = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()
  const source = audioContext.createMediaStreamSource(stream)
  source.connect(analyser)

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteTimeDomainData(dataArray)

  const hasSound = dataArray.some(value => value !== 128)
  console.log('Microphone working:', hasSound)
}
```

2. **Check input device**:
```tsx
const listDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const microphones = devices.filter(d => d.kind === 'audioinput')
  console.log('Available microphones:', microphones)
}
```

3. **Specify device**:
```tsx
// Note: AudioRecorder doesn't support deviceId prop yet
// Use getUserMedia directly for device selection
const stream = await navigator.mediaDevices.getUserMedia({
  audio: { deviceId: { exact: selectedDeviceId } }
})
```

### Recording Stops Immediately

**Symptom**: Recording starts but stops within 1 second.

**Causes**:
- `minDuration` set too high
- `maxDuration` set too low
- MediaRecorder error

**Solutions**:

1. **Check duration settings**:
```tsx
<AudioRecorder
  minDuration={1}        // Set to 1 second
  maxDuration={300}      // Set to 5 minutes
/>
```

2. **Add error logging**:
```tsx
<AudioRecorder
  onError={(error) => {
    console.error('Recording error:', error)
    console.error('Error stack:', error.stack)
  }}
/>
```

### Voice Activity Detection Too Aggressive

**Symptom**: Recording pauses during speech.

**Causes**:
- `silenceThreshold` too high
- Background noise triggering detection

**Solutions**:

1. **Adjust threshold**:
```tsx
<AudioRecorder
  voiceActivityDetection={true}
  silenceThreshold={0.005}  // Lower = more sensitive (default: 0.01)
/>
```

2. **Enable noise cancellation**:
```tsx
<AudioRecorder
  voiceActivityDetection={true}
  enableNoiseCancellation={true}
  enableAutoGainControl={true}
/>
```

## Audio Quality Issues

### Poor Audio Quality

**Symptom**: Recording sounds muffled, distorted, or low quality.

**Causes**:
- Low bitrate
- Wrong format
- Mono when stereo needed
- Low sample rate

**Solutions**:

1. **Increase bitrate**:
```tsx
<AudioRecorder
  bitrate={192000}  // 192 kbps (default: 128000)
/>
```

2. **Use appropriate format**:
```tsx
// For voice
<AudioRecorder outputFormat="webm" channels={1} />

// For music
<AudioRecorder outputFormat="wav" channels={2} bitrate={256000} />
```

3. **Increase sample rate**:
```tsx
<AudioRecorder
  sampleRate={96000}  // High quality (default: 48000)
/>
```

### Background Noise

**Symptom**: Recording has unwanted background noise.

**Solutions**:

1. **Enable all noise reduction features**:
```tsx
<AudioRecorder
  enableNoiseCancellation={true}
  enableEchoCancellation={true}
  noiseSuppression={true}
/>
```

2. **Use voice activity detection**:
```tsx
<AudioRecorder
  voiceActivityDetection={true}
  silenceThreshold={0.02}
/>
```

### Echo or Feedback

**Symptom**: Recording has echo or feedback loop.

**Solutions**:

```tsx
<AudioRecorder
  enableEchoCancellation={true}
  enableNoiseCancellation={true}
/>
```

### Volume Too Low or High

**Symptom**: Recording volume is inconsistent.

**Solutions**:

```tsx
<AudioRecorder
  enableAutoGainControl={true}  // Normalizes volume
/>
```

## Browser Compatibility

### Unsupported Format

**Symptom**: Error about MIME type not supported.

**Causes**:
- Browser doesn't support requested format
- No fallback format available

**Solutions**:

1. **Check format support**:
```tsx
const checkFormats = () => {
  const formats = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg']
  formats.forEach(format => {
    console.log(`${format}:`, MediaRecorder.isTypeSupported(format))
  })
}
```

2. **Use WebM (best compatibility)**:
```tsx
<AudioRecorder outputFormat="webm" />
```

3. **Provide fallback**:
```tsx
const getSupportedFormat = () => {
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'webm'
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    return 'mp4'
  } else {
    return 'wav'
  }
}

<AudioRecorder outputFormat={getSupportedFormat()} />
```

### Browser Not Supported

**Symptom**: MediaRecorder undefined.

**Solutions**:

1. **Check support before rendering**:
```tsx
function RecorderWrapper() {
  const isSupported =
    typeof window !== 'undefined' &&
    'mediaDevices' in navigator &&
    'MediaRecorder' in window

  if (!isSupported) {
    return (
      <div className="error">
        <p>Your browser doesn't support audio recording.</p>
        <p>Please use a modern browser like Chrome, Firefox, or Safari.</p>
      </div>
    )
  }

  return <AudioRecorder {...props} />
}
```

2. **Show browser upgrade message**:
```tsx
const browserInfo = {
  name: getBrowserName(),
  version: getBrowserVersion(),
  supported: isSupported(),
}

if (!browserInfo.supported) {
  return (
    <div>
      <p>Audio recording requires {browserInfo.name} {minVersion} or higher.</p>
      <p>You are using {browserInfo.name} {browserInfo.version}.</p>
      <a href="https://browsehappy.com/">Update your browser</a>
    </div>
  )
}
```

### Safari-Specific Issues

**Symptom**: Recording works in Chrome but not Safari.

**Solutions**:

1. **Use WAV format on Safari**:
```tsx
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

<AudioRecorder
  outputFormat={isSafari ? 'wav' : 'webm'}
/>
```

2. **Require user gesture**:
```tsx
// Safari requires explicit user gesture
<button onClick={() => startRecording()}>
  Start Recording
</button>
```

## File Size Issues

### Files Too Large

**Symptom**: Recorded files are too large to upload.

**Causes**:
- High bitrate
- Stereo recording when mono sufficient
- Uncompressed format (WAV)
- Long recordings

**Solutions**:

1. **Reduce bitrate**:
```tsx
<AudioRecorder
  bitrate={64000}   // 64 kbps for voice (default: 128000)
  channels={1}      // Mono
/>
```

2. **Use compressed format**:
```tsx
<AudioRecorder
  outputFormat="webm"  // Better compression than WAV
/>
```

3. **Chunk large recordings**:
```tsx
<AudioRecorder
  onDataAvailable={(chunk) => {
    // Upload chunks incrementally
    uploadChunk(chunk)
  }}
/>
```

4. **Set max duration**:
```tsx
<AudioRecorder
  maxDuration={300}  // Limit to 5 minutes
/>
```

### Files Too Small

**Symptom**: Files are unexpectedly small, possibly corrupted.

**Causes**:
- Recording stopped too early
- Voice activity detection pausing too much
- MediaRecorder not receiving data

**Solutions**:

1. **Disable voice activity detection**:
```tsx
<AudioRecorder
  voiceActivityDetection={false}
/>
```

2. **Set minimum duration**:
```tsx
<AudioRecorder
  minDuration={3}  // Require 3+ seconds
/>
```

3. **Log data chunks**:
```tsx
<AudioRecorder
  onDataAvailable={(chunk) => {
    console.log('Chunk size:', chunk.size)
  }}
/>
```

## Performance Issues

### Browser Freezes During Recording

**Symptom**: UI becomes unresponsive during recording.

**Causes**:
- Too many visualizations
- Heavy processing in callbacks
- Memory leak

**Solutions**:

1. **Disable heavy features**:
```tsx
<AudioRecorder
  showWaveform={false}        // Disable if not needed
  showAmplitudeMeter={false}
/>
```

2. **Throttle callbacks**:
```tsx
import { throttle } from 'lodash'

const throttledAmplitude = throttle((amplitude) => {
  updateVisualization(amplitude)
}, 100) // Only update every 100ms

<AudioRecorder
  onAmplitudeChange={throttledAmplitude}
/>
```

3. **Use Web Workers for processing**:
```tsx
const worker = new Worker('audio-processor.js')

<AudioRecorder
  onDataAvailable={(chunk) => {
    // Process in worker thread
    worker.postMessage({ type: 'process', data: chunk })
  }}
/>
```

### High Memory Usage

**Symptom**: Browser uses excessive memory during long recordings.

**Solutions**:

1. **Process chunks incrementally**:
```tsx
const chunks = []

<AudioRecorder
  onDataAvailable={(chunk) => {
    // Upload immediately, don't store
    uploadChunk(chunk)
  }}
  onStop={(blob) => {
    // Don't keep large blobs in memory
    URL.revokeObjectURL(URL.createObjectURL(blob))
  }}
/>
```

2. **Limit recording duration**:
```tsx
<AudioRecorder maxDuration={600} /> {/* 10 min max */}
```

### Waveform Lag

**Symptom**: Waveform visualization stutters.

**Solutions**:

1. **Use simpler visualization**:
```tsx
// Fewer bars
const VISUALIZATION_BARS = 30 // Instead of 60
```

2. **Optimize animation**:
```tsx
// Use CSS animations instead of JS
<div
  className="animate-pulse"
  style={{ height: `${amplitude * 100}%` }}
/>
```

## Upload Issues

### Upload Fails

**Symptom**: Audio file won't upload to server.

**Causes**:
- File too large for server
- Wrong content type
- Network timeout
- CORS issues

**Solutions**:

1. **Check file size before upload**:
```tsx
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

<AudioRecorder
  onStop={async (blob) => {
    if (blob.size > MAX_SIZE) {
      alert('Recording too large. Maximum size is 10 MB.')
      return
    }

    await uploadAudio(blob)
  }}
/>
```

2. **Set correct content type**:
```tsx
const uploadAudio = async (blob: Blob) => {
  const formData = new FormData()
  formData.append('audio', blob, 'recording.webm')
  formData.append('mimeType', blob.type)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  })
}
```

3. **Increase timeout**:
```tsx
const uploadAudio = async (blob: Blob) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000) // 60s

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}
```

4. **Handle CORS**:
```tsx
// Server-side (Express)
app.use(cors({
  origin: 'https://yourapp.com',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}))
```

### Slow Upload

**Symptom**: Upload takes very long.

**Solutions**:

1. **Show upload progress**:
```tsx
const uploadWithProgress = async (blob: Blob) => {
  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    const percent = (e.loaded / e.total) * 100
    console.log(`Upload progress: ${percent}%`)
  })

  xhr.open('POST', '/api/upload')
  xhr.send(blob)
}
```

2. **Compress before upload**:
```tsx
<AudioRecorder
  bitrate={64000}      // Lower bitrate
  outputFormat="webm"  // Better compression
/>
```

3. **Use chunked upload**:
```tsx
<AudioRecorder
  onDataAvailable={(chunk) => {
    uploadChunk(chunk) // Upload as recording
  }}
/>
```

## Debug Mode

Enable comprehensive logging:

```tsx
const DebugAudioRecorder = () => {
  return (
    <AudioRecorder
      onStart={() => console.log('[AudioRecorder] Started')}
      onStop={(blob, url) => {
        console.log('[AudioRecorder] Stopped', {
          size: blob.size,
          type: blob.type,
          url,
        })
      }}
      onPause={() => console.log('[AudioRecorder] Paused')}
      onResume={() => console.log('[AudioRecorder] Resumed')}
      onDurationChange={(d) => console.log('[AudioRecorder] Duration:', d)}
      onAmplitudeChange={(a) => console.log('[AudioRecorder] Amplitude:', a)}
      onDataAvailable={(chunk) => {
        console.log('[AudioRecorder] Chunk:', chunk.size)
      }}
      onError={(error) => {
        console.error('[AudioRecorder] Error:', error)
        console.error('[AudioRecorder] Stack:', error.stack)
      }}
    />
  )
}
```

## Getting Help

If you're still experiencing issues:

1. **Check browser console** for error messages
2. **Test in different browser** to isolate browser-specific issues
3. **Try minimal example** to eliminate external factors
4. **Check GitHub issues** for similar problems
5. **Create reproduction** on CodeSandbox or StackBlitz
6. **Open issue** with detailed information:
   - Browser and version
   - Operating system
   - AudioRecorder props
   - Error messages
   - Steps to reproduce

## Related Resources

- [MDN: MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN: getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Can I Use: MediaRecorder](https://caniuse.com/mediarecorder)
- [Web Audio API Spec](https://www.w3.org/TR/webaudio/)
