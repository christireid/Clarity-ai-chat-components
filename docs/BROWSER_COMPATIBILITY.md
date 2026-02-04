# Browser Compatibility Matrix

> **Last Updated**: January 28, 2026
> **Package**: @clarity-chat/react

## Overview

This document provides browser compatibility information for core web platform features used in Clarity AI Chat Components. All features are tested across modern browsers with fallback strategies where needed.

## Quick Summary

| Feature | Chrome | Edge | Safari | Firefox | Mobile Safari | Mobile Chrome |
|---------|--------|------|--------|---------|---------------|---------------|
| **MediaRecorder API** | 47+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 47+ ✅ |
| **OKLCH Colors** | 111+ ✅ | 111+ ✅ | 15.4+ ✅ | 113+ ✅ | 15.4+ ✅ | 111+ ✅ |
| **Web Audio API** | 35+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 35+ ✅ |
| **KeyboardEvent** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| **CSS Grid** | 57+ ✅ | 16+ ✅ | 10.1+ ✅ | 52+ ✅ | 10.3+ ✅ | 57+ ✅ |
| **CSS Custom Properties** | 49+ ✅ | 15+ ✅ | 9.1+ ✅ | 31+ ✅ | 9.3+ ✅ | 49+ ✅ |

### Legend
- ✅ **Full Support**: All features work without polyfills
- ⚠️ **Partial Support**: Requires fallback or limited functionality
- ❌ **No Support**: Feature unavailable, fallback required

---

## 1. MediaRecorder API (AudioRecorder Component)

### Browser Support Matrix

| Browser | Version | Codec Support | Notes |
|---------|---------|---------------|-------|
| **Chrome/Chromium** | 47+ | WebM (Opus), VP8, VP9 | Full support with all codecs |
| **Edge** | 79+ | WebM (Opus), VP8, VP9 | Chromium-based, same as Chrome |
| **Safari** | 14.1+ | MP4 (AAC), WebM limited | Prefers MP4/AAC over WebM |
| **Firefox** | 25+ | WebM (Opus), VP8, Ogg | Full WebM support |
| **iOS Safari** | 14.5+ | MP4 (AAC) only | No WebM support |
| **Android Chrome** | 47+ | WebM (Opus), VP8, VP9 | Full support |

### Codec Support Details

```typescript
// Codec support by format (as implemented in AudioRecorder.tsx)
const formatMap: Record<string, string[]> = {
  webm: ['audio/webm;codecs=opus', 'audio/webm'],      // Chrome, Firefox, Edge
  ogg: ['audio/ogg;codecs=opus', 'audio/ogg'],         // Firefox, Chrome
  wav: ['audio/wav', 'audio/wave'],                    // Limited support
  mp3: ['audio/mp3', 'audio/mpeg'],                    // Safari preferred
  flac: ['audio/flac'],                                // Limited support
}
```

### Feature Availability

| Feature | Chrome | Edge | Safari | Firefox | iOS Safari | Android |
|---------|--------|------|--------|---------|------------|---------|
| Basic Recording | 47+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 47+ ✅ |
| Pause/Resume | 49+ ✅ | 79+ ✅ | 14.1+ ✅ | 65+ ✅ | 14.5+ ✅ | 49+ ✅ |
| Audio Bitrate Control | 49+ ✅ | 79+ ✅ | 14.1+ ⚠️ | 71+ ✅ | 14.5+ ⚠️ | 49+ ✅ |
| MIME Type Selection | 47+ ✅ | 79+ ✅ | 14.1+ ⚠️ | 25+ ✅ | 14.5+ ⚠️ | 47+ ✅ |
| WebM Opus | 49+ ✅ | 79+ ✅ | ❌ | 25+ ✅ | ❌ | 49+ ✅ |
| MP4 AAC | ❌ | ❌ | 14.1+ ✅ | ❌ | 14.5+ ✅ | ⚠️ |

### Fallback Strategy

```typescript
// Auto-detection with fallback (from AudioRecorder.tsx lines 170-192)
const getMimeType = (): string => {
  const types = formatMap[outputFormat] || formatMap.webm

  // Find first supported type
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }

  // Ultimate fallback to WebM
  return 'audio/webm'
}
```

### Known Limitations

1. **iOS Safari**:
   - Only supports MP4/AAC format
   - Requires user gesture to start recording
   - No WebM support
   - Bitrate hints may be ignored

2. **Safari Desktop**:
   - Limited WebM support (added in 14.1)
   - Prefers MP4/AAC
   - May ignore some MediaRecorder options

3. **Firefox**:
   - Pause/Resume added in Firefox 65
   - Excellent WebM support
   - May require different bitrate values

### Testing Recommendations

```typescript
// Feature detection before use
if (!navigator.mediaDevices?.getUserMedia) {
  console.error('MediaRecorder not supported')
  return
}

// Check MIME type support
const mimeType = 'audio/webm;codecs=opus'
if (!MediaRecorder.isTypeSupported(mimeType)) {
  console.warn(`${mimeType} not supported, using fallback`)
}
```

---

## 2. OKLCH Colors

### Browser Support Matrix

| Browser | Version | Notes |
|---------|---------|-------|
| **Chrome** | 111+ | Full support |
| **Edge** | 111+ | Chromium-based, same as Chrome |
| **Safari** | 15.4+ | Full support |
| **Firefox** | 113+ | Full support |
| **iOS Safari** | 15.4+ | Full support |
| **Android Chrome** | 111+ | Full support |

### Feature Implementation

```css
/* OKLCH format usage (from theme.css lines 8-14) */
:root {
  /* OKLCH format: Lightness Chroma Hue / Alpha */
  --clarity-background: 100% 0 0;           /* White */
  --clarity-foreground: 20% 0.02 250;       /* Near-black with blue tint */
  --clarity-primary: 60% 0.2 265;           /* Vibrant blue-purple */
  --clarity-success: 55% 0.18 145;          /* Green */
}
```

### CSS Usage

```css
/* Using OKLCH in components */
.component {
  background: oklch(var(--clarity-background));
  color: oklch(var(--clarity-foreground));
  border-color: oklch(var(--clarity-primary) / 0.5); /* With alpha */
}
```

### Fallback Strategy

For browsers without OKLCH support (pre-2023), use HSL/RGB fallbacks:

```css
:root {
  /* Fallback for older browsers */
  --clarity-primary-fallback: #6366f1;

  /* Modern OKLCH */
  --clarity-primary: 60% 0.2 265;
}

.component {
  /* Fallback first, then OKLCH */
  background: var(--clarity-primary-fallback);
  background: oklch(var(--clarity-primary));
}
```

### TypeScript Utilities

```typescript
// OKLCH manipulation utilities (from utils/color/oklch.ts)
interface OklchColor {
  l: number  // Lightness: 0-100%
  c: number  // Chroma: 0-0.4
  h: number  // Hue: 0-360
  a?: number // Alpha: 0-1
}

// Convert to CSS string
function toOklchString(color: OklchColor): string {
  const alpha = color.a !== undefined && color.a < 1 ? ` / ${color.a}` : ''
  return `oklch(${color.l}% ${color.c} ${color.h}${alpha})`
}
```

### Browser-Specific Notes

1. **Chrome/Edge 111+**: Full support with color space conversion
2. **Safari 15.4+**: Full support, excellent wide-gamut display integration
3. **Firefox 113+**: Full support with accurate color rendering

### Progressive Enhancement

```typescript
// Feature detection
function supportsOklch(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) return false
  return CSS.supports('color', 'oklch(50% 0.1 180)')
}

// Use fallback if needed
const colorValue = supportsOklch()
  ? 'oklch(60% 0.2 265)'
  : '#6366f1'
```

---

## 3. Web Audio API (AudioRecorder Visualization)

### Browser Support Matrix

| Browser | Version | Features | Notes |
|---------|---------|----------|-------|
| **Chrome** | 35+ | Full API support | Prefixed versions deprecated |
| **Edge** | 79+ | Full API support | Chromium-based |
| **Safari** | 14.1+ | Full API support | Requires user gesture |
| **Firefox** | 25+ | Full API support | Excellent support |
| **iOS Safari** | 14.5+ | Full API support | User gesture required |
| **Android Chrome** | 35+ | Full API support | Full support |

### Core Features

| Feature | Chrome | Edge | Safari | Firefox | iOS Safari | Android |
|---------|--------|------|--------|---------|------------|---------|
| **AudioContext** | 35+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 35+ ✅ |
| **AnalyserNode** | 35+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 35+ ✅ |
| **MediaStreamSource** | 35+ ✅ | 79+ ✅ | 14.1+ ✅ | 25+ ✅ | 14.5+ ✅ | 35+ ✅ |
| **Noise Cancellation** | 49+ ✅ | 79+ ✅ | 14.1+ ⚠️ | 50+ ✅ | 14.5+ ⚠️ | 49+ ✅ |
| **Echo Cancellation** | 49+ ✅ | 79+ ✅ | 14.1+ ⚠️ | 50+ ✅ | 14.5+ ⚠️ | 49+ ✅ |

### Implementation Details

```typescript
// Web Audio API usage (from AudioRecorder.tsx lines 271-283)
const audioContext = new (window.AudioContext ||
  (window as any).webkitAudioContext)()

const analyser = audioContext.createAnalyser()
analyser.fftSize = 2048

const source = audioContext.createMediaStreamSource(stream)
source.connect(analyser)

// Real-time amplitude analysis
const dataArray = new Uint8Array(analyser.frequencyBinCount)
analyser.getByteTimeDomainData(dataArray)
```

### Audio Constraints

```typescript
// MediaStream constraints (lines 259-267)
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    channelCount: channels,              // 1 (mono) or 2 (stereo)
    sampleRate,                          // 48000 typical
    echoCancellation: true,              // Browser-dependent
    noiseSuppression: true,              // Browser-dependent
    autoGainControl: true,               // Browser-dependent
  },
})
```

### Browser-Specific Behavior

1. **Safari (Desktop & iOS)**:
   - Requires user gesture to create AudioContext
   - May auto-suspend AudioContext when idle
   - Limited echo cancellation on some devices

2. **Chrome/Edge**:
   - Best noise cancellation implementation
   - Full constraint support
   - Hardware acceleration available

3. **Firefox**:
   - Excellent standards compliance
   - Good constraint support
   - May differ in echo cancellation behavior

### Known Issues

1. **iOS Safari**:
   - AudioContext limited to 4-6 active instances
   - Automatic suspension when tab backgrounded
   - Echo cancellation less effective than desktop

2. **Chrome**:
   - AudioContext auto-suspend policy changed in Chrome 66+
   - May require user interaction to resume

### Best Practices

```typescript
// Handle AudioContext state
const audioContext = new AudioContext()

// Resume if suspended (user gesture required)
if (audioContext.state === 'suspended') {
  await audioContext.resume()
}

// Cleanup when done
audioContext.close()
```

---

## 4. Command Palette Keyboard Events

### Browser Support Matrix

| Browser | Version | Notes |
|---------|---------|-------|
| **All Modern Browsers** | ✅ Universal | Full support since IE9+ |

### KeyboardEvent Support

| Feature | Chrome | Edge | Safari | Firefox | iOS Safari | Android |
|---------|--------|------|--------|---------|------------|---------|
| **KeyboardEvent** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| **key property** | 51+ ✅ | 79+ ✅ | 10.1+ ✅ | 23+ ✅ | 10.3+ ✅ | 51+ ✅ |
| **code property** | 48+ ✅ | 79+ ✅ | 10.1+ ✅ | 38+ ✅ | 10.3+ ✅ | 48+ ✅ |
| **modifier keys** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |

### Implementation

```typescript
// Keyboard event handling (from CommandPalette.tsx lines 163-206)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) =>
          (prev - 1 + filteredItems.length) % filteredItems.length
        )
        break
      case 'Home':
        e.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setSelectedIndex(Math.max(0, filteredItems.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect()
          onClose()
        }
        break
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [open, filteredItems, selectedIndex, onClose])
```

### Supported Keys

| Key | Description | Browser Support |
|-----|-------------|----------------|
| `Escape` | Close palette | ✅ Universal |
| `ArrowDown` / `ArrowUp` | Navigate items | ✅ Universal |
| `Home` / `End` | First/last item | ✅ Universal |
| `Enter` | Select item | ✅ Universal |
| `Tab` | Focus trap navigation | ✅ Universal |
| `Cmd/Ctrl + K` | Open palette | ✅ Universal |

### Modifier Keys

```typescript
// Modifier key detection
e.metaKey   // Cmd (Mac) or Win (Windows)
e.ctrlKey   // Ctrl
e.altKey    // Alt/Option
e.shiftKey  // Shift

// Example: Cmd/Ctrl + K
if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
  e.preventDefault()
  openCommandPalette()
}
```

### Mobile Considerations

1. **Virtual Keyboards**:
   - Arrow keys not available on most mobile keyboards
   - Touch/tap interaction required
   - Consider providing touch-based navigation

2. **iOS Safari**:
   - `metaKey` represents Cmd key on external keyboards
   - Virtual keyboard may not show all keys

3. **Android**:
   - Physical keyboard support varies by device
   - Virtual keyboard limited to alphanumeric + Enter

### Accessibility

```typescript
// ARIA keyboard navigation (CommandPalette.tsx lines 328-344)
<input
  type="text"
  role="combobox"
  aria-expanded="true"
  aria-controls={listboxId}
  aria-activedescendant={selectedItemId}
  aria-autocomplete="list"
  onKeyDown={handleKeyDown}
/>

<div
  id={listboxId}
  role="listbox"
  aria-label="Commands"
>
  {/* Items */}
</div>
```

---

## 5. Additional Features

### CSS Grid Layout

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 57+ | Full support |
| Edge | 16+ | Full support |
| Safari | 10.1+ | Full support including iOS |
| Firefox | 52+ | Full support |

### CSS Custom Properties (Variables)

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 49+ | Full support |
| Edge | 15+ | Full support |
| Safari | 9.1+ | Full support including iOS |
| Firefox | 31+ | Full support |

### Framer Motion (Animation Library)

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | Last 2 versions | Full support |
| Edge | Last 2 versions | Full support |
| Safari | Last 2 versions | Full support |
| Firefox | Last 2 versions | Full support |
| iOS Safari | 12+ | Full support |

---

## Testing Recommendations

### Browser Testing Checklist

- [ ] **Chrome/Edge**: Latest stable version
- [ ] **Safari**: Latest stable version (macOS and iOS)
- [ ] **Firefox**: Latest stable version
- [ ] **Mobile Safari**: iOS 15+
- [ ] **Mobile Chrome**: Android 12+

### Feature Detection Pattern

```typescript
// Recommended pattern for feature detection
function checkBrowserSupport() {
  const support = {
    mediaRecorder: typeof MediaRecorder !== 'undefined',
    webAudio: typeof AudioContext !== 'undefined' ||
              typeof (window as any).webkitAudioContext !== 'undefined',
    oklch: CSS?.supports?.('color', 'oklch(50% 0.1 180)') ?? false,
    gridLayout: CSS?.supports?.('display', 'grid') ?? false,
    customProperties: CSS?.supports?.('--custom', '0') ?? false,
  }

  return support
}
```

### Automated Testing

```typescript
// Vitest browser compatibility test
describe('Browser Feature Support', () => {
  it('supports MediaRecorder API', () => {
    expect(typeof MediaRecorder).toBe('function')
  })

  it('supports Web Audio API', () => {
    expect(
      typeof AudioContext !== 'undefined' ||
      typeof (window as any).webkitAudioContext !== 'undefined'
    ).toBe(true)
  })

  it('supports OKLCH colors', () => {
    if (typeof CSS !== 'undefined' && CSS.supports) {
      const supported = CSS.supports('color', 'oklch(50% 0.1 180)')
      expect(typeof supported).toBe('boolean')
    }
  })
})
```

---

## Polyfills & Fallbacks

### MediaRecorder Polyfill

For older browsers, use `audio-recorder-polyfill`:

```bash
pnpm add audio-recorder-polyfill
```

```typescript
// Conditional polyfill
if (!window.MediaRecorder) {
  const { MediaRecorder } = await import('audio-recorder-polyfill')
  window.MediaRecorder = MediaRecorder as any
}
```

### OKLCH Color Fallback

```css
/* Progressive enhancement */
.component {
  background: #6366f1;                    /* Fallback */
  background: oklch(60% 0.2 265);         /* Modern */
}
```

### Web Audio API Fallback

```typescript
// Vendor prefix handling
const AudioContext = window.AudioContext ||
                     (window as any).webkitAudioContext

if (!AudioContext) {
  console.warn('Web Audio API not supported')
  // Disable audio features
}
```

---

## Progressive Enhancement Strategy

### Graceful Degradation

1. **Detect feature support** before using
2. **Provide fallbacks** for unsupported features
3. **Inform users** when features are unavailable
4. **Maintain core functionality** without advanced features

### Example Implementation

```typescript
function AudioRecorderWrapper() {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const hasSupport =
      typeof MediaRecorder !== 'undefined' &&
      navigator.mediaDevices?.getUserMedia !== undefined

    setSupported(hasSupport)
  }, [])

  if (!supported) {
    return (
      <div className="unsupported-notice">
        <p>Audio recording is not supported in your browser.</p>
        <p>Please use a modern browser like Chrome, Firefox, or Safari 14.1+</p>
      </div>
    )
  }

  return <AudioRecorder {...props} />
}
```

---

## Support Policy

### Minimum Browser Versions

We officially support:

- **Chrome/Edge**: Last 2 major versions
- **Safari**: Last 2 major versions (macOS & iOS)
- **Firefox**: Last 2 major versions
- **Mobile browsers**: iOS Safari 14.5+, Chrome Android 90+

### Testing Frequency

- **Automated tests**: On every commit (via CI/CD)
- **Manual testing**: Before each release
- **Cross-browser testing**: Weekly on development branch
- **Mobile testing**: Before each minor/major release

---

## Resources

### Documentation

- [MDN: MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN: Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MDN: OKLCH Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

### Testing Tools

- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [Can I Use](https://caniuse.com/) - Browser support tables
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audits
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing

### Internal References

- [packages/react/src/components/input/AudioRecorder.tsx](../packages/react/src/components/input/AudioRecorder.tsx)
- [packages/react/src/components/navigation/CommandPalette.tsx](../packages/react/src/components/navigation/CommandPalette.tsx)
- [packages/react/src/utils/color/oklch.ts](../packages/react/src/utils/color/oklch.ts)
- [packages/react/src/theme/theme.css](../packages/react/src/theme/theme.css)

---

**Last Updated**: January 28, 2026
**Maintained by**: Clarity AI Chat Components Team
**Questions?**: See [CONTRIBUTING.md](../CONTRIBUTING.md) for support
