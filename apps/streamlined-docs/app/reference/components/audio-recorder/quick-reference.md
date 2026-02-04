# AudioRecorder Quick Reference

Fast reference guide for the AudioRecorder component with common patterns and solutions.

## Quick Start

```tsx
import { AudioRecorder } from '@clarity-chat/react'

<AudioRecorder
  maxDuration={60}
  onStop={(blob, url) => console.log('Done:', blob)}
/>
```

## Common Configurations

### Voice Messages

```tsx
<AudioRecorder
  maxDuration={60}
  outputFormat="webm"
  channels={1}
  enableNoiseCancellation={true}
/>
```

### High-Quality Recording

```tsx
<AudioRecorder
  bitrate={256000}
  sampleRate={96000}
  channels={2}
  outputFormat="wav"
/>
```

### Voice Commands

```tsx
<AudioRecorder
  voiceActivityDetection={true}
  silenceThreshold={0.02}
  enableNoiseCancellation={true}
/>
```

### Podcast Recording

```tsx
<AudioRecorder
  maxDuration={7200}
  bitrate={192000}
  channels={2}
  pausable={true}
  enableAutoGainControl={true}
/>
```

## Props Cheat Sheet

| Prop | Type | Default | Use Case |
|------|------|---------|----------|
| `maxDuration` | `number` | `300` | Max recording time in seconds |
| `minDuration` | `number` | `1` | Min time before stop allowed |
| `outputFormat` | `'webm' \| 'mp3' \| 'wav' \| 'ogg' \| 'flac'` | `'webm'` | Audio format (browser-dependent) |
| `bitrate` | `number` | `128000` | Audio quality (bits/sec) |
| `channels` | `1 \| 2` | `1` | Mono (1) or Stereo (2) |
| `enableNoiseCancellation` | `boolean` | `false` | Reduce background noise |
| `enableEchoCancellation` | `boolean` | `false` | Remove echo |
| `enableAutoGainControl` | `boolean` | `false` | Normalize volume |
| `voiceActivityDetection` | `boolean` | `false` | Auto-pause on silence |
| `silenceThreshold` | `number` | `0.01` | Silence detection level (0-1) |
| `pausable` | `boolean` | `true` | Enable pause/resume |
| `showWaveform` | `boolean` | `true` | Show waveform visualization |
| `showDuration` | `boolean` | `true` | Show timer |
| `showControls` | `boolean` | `true` | Show buttons |
| `showAmplitudeMeter` | `boolean` | `true` | Show audio level |

## Callbacks

| Callback | Parameters | When Called |
|----------|-----------|-------------|
| `onStart` | `()` | Recording starts |
| `onStop` | `(blob: Blob, url: string)` | Recording stops |
| `onPause` | `()` | Recording paused |
| `onResume` | `()` | Recording resumed |
| `onDataAvailable` | `(chunk: Blob)` | Audio chunk ready |
| `onError` | `(error: Error)` | Error occurs |
| `onDurationChange` | `(seconds: number)` | Every second |
| `onAmplitudeChange` | `(amplitude: number)` | ~60 times/sec |

## Format Support

| Format | Chrome | Firefox | Safari | Edge | Notes |
|--------|--------|---------|--------|------|-------|
| WebM/Opus | ✅ | ✅ | ❌ | ✅ | Best compatibility |
| WAV | ⚠️ | ⚠️ | ✅ | ⚠️ | Large files |
| MP3 | ❌ | ❌ | ✅ | ❌ | Safari only |
| OGG/Opus | ✅ | ✅ | ❌ | ✅ | Good compression |

**Recommendation**: Use `webm` for best cross-browser support

## Bitrate Guide

| Use Case | Bitrate | Quality | File Size |
|----------|---------|---------|-----------|
| Voice messages | 64 kbps | Good | ~480 KB/min |
| Voice calls | 96 kbps | Very Good | ~720 KB/min |
| Podcasts | 128 kbps | Excellent | ~960 KB/min |
| Music (stereo) | 192 kbps | High | ~1.4 MB/min |
| Studio (stereo) | 256 kbps | Very High | ~1.9 MB/min |

## Error Handling

```tsx
<AudioRecorder
  onError={(error) => {
    if (error.message.includes('Permission denied')) {
      // Handle permission denial
      alert('Microphone access required')
    } else if (error.message.includes('not supported')) {
      // Handle unsupported format
      alert('Browser does not support this format')
    } else {
      // Handle other errors
      console.error('Recording error:', error)
    }
  }}
/>
```

## Upload to Server

```tsx
const handleStop = async (audioBlob: Blob) => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const { url } = await response.json()
  console.log('Uploaded:', url)
}
```

## Check Browser Support

```tsx
const isSupported =
  'mediaDevices' in navigator &&
  'MediaRecorder' in window &&
  MediaRecorder.isTypeSupported('audio/webm')

if (!isSupported) {
  return <p>Browser not supported</p>
}
```

## Memory Management

```tsx
// Component automatically cleans up on unmount
// For manual cleanup:
useEffect(() => {
  return () => {
    // Revoke blob URLs when done
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
  }
}, [audioUrl])
```

## Accessibility

- **Keyboard**: Tab to focus, Enter/Space to activate
- **Screen Readers**: Status announcements via ARIA live regions
- **Focus**: Visible focus indicators on all controls
- **Labels**: Descriptive aria-labels on all buttons

## Performance Tips

1. **Long recordings**: Use `onDataAvailable` for incremental processing
2. **Multiple instances**: Limit to 1-2 recorders on page
3. **Virtual scrolling**: For lists of recordings
4. **Cleanup**: Always revoke object URLs when done
5. **Reduced motion**: Component respects `prefers-reduced-motion`

## Common Issues

### No audio recorded
- Check microphone permissions
- Verify browser support
- Test microphone with other apps

### Poor quality
- Increase bitrate (192kbps+)
- Enable noise cancellation
- Use 2 channels for stereo
- Increase sample rate

### Large file sizes
- Lower bitrate (64-96kbps for voice)
- Use 1 channel (mono)
- Enable voice activity detection
- Use webm/opus format

### Browser compatibility
- Check MediaRecorder support
- Use webm format
- Provide fallback UI
- Test on target browsers

## TypeScript

```typescript
import type { AudioRecorderProps } from '@clarity-chat/react'

const config: AudioRecorderProps = {
  maxDuration: 60,
  outputFormat: 'webm',
  onStop: (blob, url) => {
    // Type-safe callback
  },
}
```

## Related Components

- **VoiceInput**: Speech-to-text input
- **FileUpload**: File upload with drag-and-drop
- **ChatInput**: Multi-modal chat input

## Resources

- [MDN: MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN: Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Can I Use: MediaRecorder](https://caniuse.com/mediarecorder)
- [Web Audio API Spec](https://www.w3.org/TR/webaudio/)
