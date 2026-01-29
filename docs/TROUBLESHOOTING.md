# Troubleshooting Guide

Quick solutions to common issues when using Clarity Chat.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Runtime Issues](#runtime-issues)
- [New Component Issues](#new-component-issues)
  - [VoiceInput / AudioRecorder](#voiceinput--audiorecorder)
  - [OKLCH Colors](#oklch-colors)
  - [CommandPalette](#commandpalette)
- [TypeScript Issues](#typescript-issues)
- [Development Issues](#development-issues)
- [Performance Issues](#performance-issues)
- [API Provider Issues](#api-provider-issues)
- [Common Mistakes](#common-mistakes)
- [Security Issues](#security-issues)

---

## Installation Issues

### `pnpm: command not found`

**Solution:** Install pnpm globally:

```bash
npm install -g pnpm
```

### `ERESOLVE: unable to resolve dependency tree`

**Solution:** Clear npm cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build fails with TypeScript errors

**Solution:** Ensure you have TypeScript 5.0+:

```bash
npm install typescript@latest --save-dev
```

---

## Runtime Issues

### "Failed to fetch" error

**Cause:** Your API route is not running or CORS is misconfigured.

**Solutions:**

1. Check your API is running:
   ```bash
   curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[]}'
   ```

2. Add CORS headers (Next.js):
   ```tsx
   // app/api/chat/route.ts
   export async function POST(req: Request) {
     // ... your code
     return new Response(body, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Access-Control-Allow-Origin': '*',
       },
     })
   }
   ```

### Streaming not working

**Cause:** Your API isn't returning the correct content type.

**Solution:** Ensure your API returns `text/event-stream`:

```tsx
return new Response(response.body, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
})
```

### Styles not loading

**Cause:** Missing CSS import.

**Solution:** Add the import to your root component:

```tsx
import '@clarity-chat/react/styles.css'
```

For Next.js, add to `app/layout.tsx` or `_app.tsx`.

### Messages not appearing

**Cause:** State not updating correctly.

**Solution:** Ensure you're using the hook correctly:

```tsx
const { messages, append } = useClarityChat({ api: '/api/chat' })

// Correct way to send a message
const handleSend = async (content: string) => {
  await append({ role: 'user', content })
}

// Make sure to pass messages to ChatWindow
<ChatWindow messages={messages} onSendMessage={handleSend} />
```

---

## New Component Issues

### VoiceInput / AudioRecorder

#### Microphone Permission Errors

##### Error: "Microphone permission denied"

**Cause:** User hasn't granted microphone access, or browser security policy blocks access.

**Solutions:**

1. **Check browser permissions:**
   - Chrome: `chrome://settings/content/microphone`
   - Firefox: `about:preferences#privacy` → Permissions → Microphone
   - Safari: System Preferences → Security & Privacy → Microphone

2. **Must use HTTPS in production:**
   ```bash
   # MediaDevices.getUserMedia() requires secure context
   # ❌ http://example.com (will fail in production)
   # ✅ https://example.com (works)
   # ✅ http://localhost (works in development only)
   ```

3. **Handle permission errors gracefully:**
   ```tsx
   <VoiceInput
     onTranscript={(text) => console.log(text)}
     onError={(error) => {
       if (error.includes('permission denied')) {
         // Show user-friendly message with instructions
         showPermissionModal()
       }
     }}
   />
   ```

4. **Request permission explicitly (optional pattern):**
   ```tsx
   const requestMicrophoneAccess = async () => {
     try {
       await navigator.mediaDevices.getUserMedia({ audio: true })
       return true
     } catch (error) {
       console.error('Microphone access denied:', error)
       return false
     }
   }

   // Call before showing VoiceInput
   const hasPermission = await requestMicrophoneAccess()
   if (hasPermission) {
     setShowVoiceInput(true)
   }
   ```

##### Error: "No microphone found"

**Cause:** No audio input device detected.

**Solutions:**

1. **Check if microphone is connected:**
   ```tsx
   const checkMicrophone = async () => {
     const devices = await navigator.mediaDevices.enumerateDevices()
     const audioInputs = devices.filter(d => d.kind === 'audioinput')

     if (audioInputs.length === 0) {
       alert('No microphone detected. Please connect a microphone.')
       return false
     }
     return true
   }
   ```

2. **Verify system settings:**
   - macOS: System Preferences → Sound → Input
   - Windows: Settings → System → Sound → Input
   - Linux: Check `arecord -l` for available devices

3. **Test microphone:**
   ```bash
   # Open browser console and run:
   navigator.mediaDevices.getUserMedia({ audio: true })
     .then(stream => {
       console.log('Microphone works!', stream)
       stream.getTracks().forEach(track => track.stop())
     })
     .catch(err => console.error('Microphone test failed:', err))
   ```

#### MediaRecorder Not Supported

##### Error: "MediaRecorder is not defined" or "Voice input not supported"

**Cause:** Browser doesn't support MediaRecorder API or Web Speech API.

**Browser Support:**
- ✅ Chrome/Edge 88+ (full support)
- ✅ Safari 14.1+ (limited support)
- ⚠️ Firefox 105+ (MediaRecorder only, no Web Speech API)
- ❌ IE 11 (not supported)

**Solutions:**

1. **Check feature availability:**
   ```tsx
   const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
   const isMediaRecorderSupported = 'MediaRecorder' in window

   if (!isSpeechSupported) {
     return <div>Voice input requires Chrome, Edge, or Safari</div>
   }
   ```

2. **Provide fallback UI:**
   ```tsx
   import { VoiceInput } from '@clarity-chat/react'

   function MyComponent() {
     const [fallbackMode, setFallbackMode] = useState(false)

     return (
       <>
         {!fallbackMode ? (
           <VoiceInput
             onTranscript={(text) => handleInput(text)}
             onError={(error) => {
               if (error.includes('not supported')) {
                 setFallbackMode(true)
               }
             }}
           />
         ) : (
           <TextInput placeholder="Voice input not available. Type your message..." />
         )}
       </>
     )
   }
   ```

3. **Show browser upgrade prompt:**
   ```tsx
   const BrowserUpgradePrompt = () => (
     <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
       <p className="text-sm text-amber-800">
         Voice input requires a modern browser.
         <a href="https://www.google.com/chrome/" className="underline ml-1">
           Download Chrome
         </a>
       </p>
     </div>
   )
   ```

#### Voice Recognition Not Working

##### Audio records but no transcript appears

**Cause:** Web Speech API not initializing or network issues.

**Solutions:**

1. **Check browser console for errors:**
   - Open DevTools (F12) → Console tab
   - Look for "SpeechRecognition" or "webkitSpeechRecognition" errors

2. **Verify language is supported:**
   ```tsx
   // Supported languages: https://cloud.google.com/speech-to-text/docs/languages
   <VoiceInput
     lang="en-US"  // ✅ Supported
     // lang="xyz-XY" // ❌ Invalid language code
   />
   ```

3. **Check network connectivity:**
   - Web Speech API requires internet connection (uses Google's servers)
   - Test: Open chrome://settings/content/speech

4. **Add error logging:**
   ```tsx
   <VoiceInput
     onError={(error) => {
       console.error('Voice recognition error:', error)
       // Send to error tracking service
       if (window.gtag) {
         gtag('event', 'voice_error', { error_message: error })
       }
     }}
   />
   ```

##### Recording stops immediately

**Cause:** `autoStopTimeout` set too low or no speech detected.

**Solutions:**

1. **Increase auto-stop timeout:**
   ```tsx
   <AudioRecorder
     autoStopTimeout={5000}  // 5 seconds instead of default 2s
   />
   ```

2. **Adjust silence threshold:**
   ```tsx
   <AudioRecorder
     voiceActivityDetection={true}
     silenceThreshold={0.01}  // Lower = more sensitive (default)
     // Try 0.005 if it stops too early
   />
   ```

3. **Test microphone sensitivity:**
   - Speak closer to microphone
   - Check system input volume levels
   - Reduce background noise

#### Audio Quality Issues

##### Recording sounds distorted or noisy

**Solutions:**

1. **Enable noise cancellation:**
   ```tsx
   <AudioRecorder
     enableNoiseCancellation={true}
     enableEchoCancellation={true}
     noiseSuppression={true}
   />
   ```

2. **Adjust sample rate:**
   ```tsx
   <AudioRecorder
     sampleRate={48000}  // Higher quality (default: device default)
     bitrate={192000}    // Higher bitrate (default: 128000)
   />
   ```

3. **Use mono channel for voice:**
   ```tsx
   <AudioRecorder
     channels={1}  // Mono (smaller file size, sufficient for voice)
   />
   ```

##### Recording file format not compatible

**Solutions:**

1. **Check supported formats:**
   ```tsx
   // Test format support
   const isWebMSupported = MediaRecorder.isTypeSupported('audio/webm')
   const isMP3Supported = MediaRecorder.isTypeSupported('audio/mp3')

   console.log('WebM:', isWebMSupported)  // Usually true
   console.log('MP3:', isMP3Supported)    // Usually false in browser
   ```

2. **Use browser-supported format:**
   ```tsx
   <AudioRecorder
     outputFormat="webm"  // ✅ Best browser support
     // outputFormat="mp3" // ❌ Not natively supported, needs conversion
   />
   ```

3. **Convert on server if needed:**
   ```tsx
   // Client: Upload WebM
   const handleAudioUpload = async (audioBlob) => {
     const formData = new FormData()
     formData.append('audio', audioBlob, 'recording.webm')

     await fetch('/api/audio/convert', {
       method: 'POST',
       body: formData,
     })
   }

   // Server: Convert using ffmpeg or similar
   // POST /api/audio/convert
   // - Receives WebM
   // - Returns MP3/WAV as needed
   ```

### OKLCH Colors

#### Colors Not Rendering

##### Browser shows invalid/fallback colors

**Cause:** OKLCH is a modern CSS color format with limited browser support.

**Browser Support:**
- ✅ Chrome 111+ (March 2023)
- ✅ Edge 111+
- ✅ Safari 15.4+ (March 2022)
- ❌ Firefox 113+ (requires flag before 119)
- ❌ IE 11 (not supported)

**Solutions:**

1. **Provide CSS fallbacks:**
   ```tsx
   // Automatic fallback in Clarity Chat
   <div style={{
     // Browser automatically uses first supported format
     color: 'oklch(75% 0.18 195)',  // Modern browsers
     color: 'rgb(98, 182, 228)',    // Fallback
   }} />
   ```

2. **Check browser compatibility:**
   ```tsx
   const supportsOKLCH = CSS.supports('color', 'oklch(50% 0.2 180)')

   if (!supportsOKLCH) {
     console.warn('OKLCH not supported, using RGB fallback')
   }
   ```

3. **Use utility functions:**
   ```tsx
   import { toOklchString, parseOklch } from '@clarity-chat/react'

   // Convert to OKLCH
   const color = parseOklch('75% 0.18 195')
   const cssValue = toOklchString(color)
   // Output: "oklch(75% 0.18 195)"
   ```

4. **Add PostCSS plugin for automatic conversion:**
   ```bash
   npm install @csstools/postcss-oklab-function
   ```

   ```js
   // postcss.config.js
   module.exports = {
     plugins: {
       '@csstools/postcss-oklab-function': {
         preserve: true,  // Keep OKLCH, add fallback
       },
     },
   }
   ```

#### Color Contrast Issues

##### Text hard to read on background

**Cause:** Insufficient contrast between foreground and background colors.

**Solutions:**

1. **Check contrast ratio:**
   ```tsx
   import { contrastRatio, meetsWcagAA } from '@clarity-chat/react'

   const fg = parseOklch('75% 0.18 195')  // Light blue
   const bg = parseOklch('95% 0.02 180')  // Near white

   const ratio = contrastRatio(fg, bg)
   console.log('Contrast ratio:', ratio)  // 3.2:1

   if (!meetsWcagAA(fg, bg)) {
     console.warn('Contrast too low for normal text')
   }
   ```

2. **Auto-adjust colors for contrast:**
   ```tsx
   import { suggestContrastAdjustment, lighten, darken } from '@clarity-chat/react'

   const adjustment = suggestContrastAdjustment(fg, bg, 4.5)  // WCAG AA
   const adjustedColor = adjustment > 0
     ? lighten(fg, adjustment)
     : darken(fg, Math.abs(adjustment))
   ```

3. **Use contrast checker tools:**
   - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Chrome DevTools: Elements → Styles → Color picker (shows contrast ratio)

4. **Follow WCAG guidelines:**
   - **Normal text:** 4.5:1 minimum (WCAG AA)
   - **Large text (18pt+):** 3:1 minimum
   - **UI components:** 3:1 minimum

#### OKLCH Manipulation Issues

##### Colors shifting unexpectedly

**Cause:** OKLCH uses perceptual color space, different from RGB.

**Understanding OKLCH:**
- **L (Lightness):** 0-100% (0 = black, 100 = white)
- **C (Chroma):** 0-0.4 (0 = gray, 0.4 = vivid)
- **H (Hue):** 0-360° (color wheel: 0 = red, 120 = green, 240 = blue)

**Solutions:**

1. **Use appropriate manipulation functions:**
   ```tsx
   import { lighten, darken, saturate, desaturate, rotateHue } from '@clarity-chat/react'

   const baseColor = parseOklch('60% 0.15 195')

   // Lightness changes (0-100)
   const lighter = lighten(baseColor, 10)   // +10% lighter
   const darker = darken(baseColor, 10)     // -10% darker

   // Saturation changes (0-0.4)
   const vibrant = saturate(baseColor, 0.05)    // More colorful
   const muted = desaturate(baseColor, 0.05)    // More gray

   // Hue rotation (0-360 degrees)
   const complementary = rotateHue(baseColor, 180)  // Opposite color
   ```

2. **Stay within valid ranges:**
   ```tsx
   // Lightness: 0-100%
   const validL = Math.max(0, Math.min(100, lightness))

   // Chroma: 0-0.4 (higher values may not render on all displays)
   const validC = Math.max(0, Math.min(0.4, chroma))

   // Hue: 0-360 (wraps around)
   const validH = (hue + 360) % 360
   ```

3. **Test color accessibility:**
   ```tsx
   import { meetsWcagAA, meetsWcagAAA } from '@clarity-chat/react'

   const textColor = parseOklch('20% 0.05 240')
   const bgColor = parseOklch('98% 0.01 240')

   console.log('AA compliant:', meetsWcagAA(textColor, bgColor))    // true
   console.log('AAA compliant:', meetsWcagAAA(textColor, bgColor))  // Check stricter standard
   ```

### CommandPalette

#### Keyboard Shortcuts Conflicting

##### Browser shortcuts override command palette

**Cause:** Browser's default shortcuts taking precedence over custom shortcuts.

**Common Conflicts:**
- `Cmd+K` / `Ctrl+K` → Browser search bar (Chrome)
- `Cmd+/` / `Ctrl+/` → View source (some browsers)
- `Cmd+P` / `Ctrl+P` → Print dialog

**Solutions:**

1. **Prevent default behavior:**
   ```tsx
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       // Cmd+K or Ctrl+K
       if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
         e.preventDefault()  // Stop browser search
         setCommandPaletteOpen(true)
       }
     }

     document.addEventListener('keydown', handleKeyDown)
     return () => document.removeEventListener('keydown', handleKeyDown)
   }, [])
   ```

2. **Use less conflicting shortcuts:**
   ```tsx
   // Instead of Cmd+K (browser search)
   // Use Cmd+Shift+K or Cmd+Option+K

   const handleKeyDown = (e: KeyboardEvent) => {
     if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
       e.preventDefault()
       setCommandPaletteOpen(true)
     }
   }
   ```

3. **Provide multiple trigger options:**
   ```tsx
   const TRIGGER_SHORTCUTS = [
     { key: 'k', meta: true, shift: false },   // Cmd+K
     { key: '/', meta: true, shift: false },   // Cmd+/
     { key: 'p', meta: true, shift: true },    // Cmd+Shift+P (VSCode style)
   ]

   const matchesShortcut = (e: KeyboardEvent, shortcut: typeof TRIGGER_SHORTCUTS[0]) => {
     return (
       e.key.toLowerCase() === shortcut.key.toLowerCase() &&
       (e.metaKey || e.ctrlKey) === shortcut.meta &&
       e.shiftKey === shortcut.shift
     )
   }
   ```

4. **Document shortcut requirements:**
   ```tsx
   <div className="help-text">
     <p>Open command palette:</p>
     <ul>
       <li><Kbd>Cmd</Kbd> + <Kbd>K</Kbd> (Mac)</li>
       <li><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> (Windows/Linux)</li>
       <li>May conflict with browser search - try <Kbd>Cmd</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd></li>
     </ul>
   </div>
   ```

##### Multiple keyboard event listeners firing

**Cause:** Event listeners attached multiple times or not cleaned up.

**Solutions:**

1. **Use proper cleanup in useEffect:**
   ```tsx
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       // Your logic
     }

     document.addEventListener('keydown', handleKeyDown)

     // Cleanup on unmount
     return () => {
       document.removeEventListener('keydown', handleKeyDown)
     }
   }, [])  // Empty deps array = run once
   ```

2. **Use event capture for precedence:**
   ```tsx
   // Add listener in capture phase (fires before bubble phase)
   document.addEventListener('keydown', handleKeyDown, { capture: true })
   ```

3. **Stop event propagation:**
   ```tsx
   const handleKeyDown = (e: KeyboardEvent) => {
     if (shouldHandleEvent(e)) {
       e.preventDefault()
       e.stopPropagation()  // Prevent other listeners
       // Your logic
     }
   }
   ```

#### Command Palette Not Opening

##### Shortcut pressed but nothing happens

**Solutions:**

1. **Check if element has focus:**
   ```tsx
   // CommandPalette requires document focus to receive keyboard events
   // Ensure your app isn't inside an iframe or shadow DOM without proper focus

   const handleOpenPalette = () => {
     setOpen(true)
     // Force focus on next tick
     setTimeout(() => {
       document.querySelector('[role="dialog"]')?.focus()
     }, 0)
   }
   ```

2. **Verify event listener is attached:**
   ```tsx
   useEffect(() => {
     console.log('CommandPalette keyboard listener attached')

     const handleKeyDown = (e: KeyboardEvent) => {
       console.log('Key pressed:', e.key, 'Meta:', e.metaKey, 'Ctrl:', e.ctrlKey)

       if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
         console.log('Opening command palette')
         e.preventDefault()
         setOpen(true)
       }
     }

     document.addEventListener('keydown', handleKeyDown)
     return () => document.removeEventListener('keydown', handleKeyDown)
   }, [])
   ```

3. **Check for conflicting modal/overlay:**
   ```tsx
   // If another modal is open, keyboard events might be trapped
   <CommandPalette
     open={open && !otherModalOpen}  // Only show if no other modal
     onClose={() => setOpen(false)}
   />
   ```

#### Search Not Finding Commands

##### Commands exist but don't appear in search results

**Solutions:**

1. **Check search implementation:**
   ```tsx
   // CommandPalette uses case-insensitive substring matching
   // Searches in: label, description, category

   const commands: CommandItem[] = [
     {
       id: 'new-chat',
       label: 'New Chat',  // Searchable
       description: 'Start a new conversation',  // Searchable
       category: 'Chat',  // Searchable
       onSelect: () => createNewChat(),
     },
   ]

   // These searches will match:
   // - "new", "chat", "new chat"
   // - "start", "conversation"
   // - Any part of "Chat" category
   ```

2. **Add search keywords to commands:**
   ```tsx
   const commands: CommandItem[] = [
     {
       id: 'clear-history',
       label: 'Clear Chat History',
       description: 'Delete all messages from current chat (reset, remove, erase)',  // Extra keywords
       category: 'Chat',
       onSelect: clearHistory,
     },
   ]
   ```

3. **Debug search filtering:**
   ```tsx
   <CommandPalette
     items={commands}
     open={open}
     onClose={() => setOpen(false)}
     // Monitor what's being filtered
     loading={false}
     placeholder="Search commands..."
   />
   ```

#### Performance Issues with Large Command Lists

##### Palette lags with 100+ commands

**Solutions:**

1. **CommandPalette has built-in optimizations:**
   - Debounced search (150ms)
   - Virtualization for large lists
   - Memoized filtering

2. **Lazy load command categories:**
   ```tsx
   const [allCommands, setAllCommands] = useState<CommandItem[]>([])

   useEffect(() => {
     // Load commands on demand
     if (open) {
       loadCommands().then(setAllCommands)
     }
   }, [open])
   ```

3. **Limit initial results:**
   ```tsx
   const displayedCommands = useMemo(() => {
     return allCommands.slice(0, 50)  // Show first 50, load more on scroll
   }, [allCommands])
   ```

#### Accessibility Issues

##### Screen reader not announcing commands

**Solutions:**

1. **CommandPalette includes ARIA by default:**
   - `role="dialog"` on modal
   - `role="combobox"` on search input
   - `role="listbox"` on results
   - `aria-activedescendant` for keyboard selection

2. **Verify ARIA labels:**
   ```tsx
   <CommandPalette
     aria-label="Command palette"  // Announced as dialog title
     items={commands}
     open={open}
     onClose={onClose}
   />
   ```

3. **Test with screen reader:**
   - macOS: VoiceOver (Cmd+F5)
   - Windows: NVDA (free) or JAWS
   - Chrome: ChromeVox extension

---

## TypeScript Issues

### Type errors with message format

**Solution:** Use the correct type imports:

```tsx
import type { Message, CoreMessage } from '@clarity-chat/types'
```

### `Cannot find module '@clarity-chat/react'`

**Solution:** Check your `tsconfig.json` includes the node_modules:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

---

## Development Issues

### Hot reload not working

**Solution:** Restart your dev server:

```bash
# Kill existing processes
pkill -f "next dev"

# Restart
npm run dev
```

### Port already in use

**Solution:** Find and kill the process:

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3001
```

### Storybook not loading components

**Solution:** Rebuild packages first:

```bash
pnpm build:packages
pnpm storybook
```

---

## Performance Issues

### Chat is slow with many messages

**Solution:** Enable virtualization:

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  itemSize={100}
  overscanCount={5}
/>
```

### High memory usage

**Solution:** Use memory strategies to limit context:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    strategy: 'sliding-window',
    maxTokens: 4000,  // Limit context size
  },
})
```

---

## API Provider Issues

### OpenAI: Rate limit exceeded

**Solution:** Add retry logic:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  retry: {
    maxRetries: 3,
    delayMs: 1000,
  },
})
```

### Anthropic: Invalid API key

**Solution:** Verify your key format (should start with `sk-ant-`):

```bash
# Check your .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

### Google: Model not found

**Solution:** Use the correct model name:

```tsx
// Correct
model: 'gemini-1.5-pro'

// Incorrect
model: 'gemini-pro'  // Deprecated
```

---

## Common Mistakes

### Forgetting `'use client'` in Next.js

```tsx
// Add this at the top of your component file
'use client'

import { ClarityChat } from '@clarity-chat/react'
```

### Not awaiting `append()`

```tsx
// Wrong - may cause race conditions
const handleSend = (content: string) => {
  append({ role: 'user', content })
}

// Correct
const handleSend = async (content: string) => {
  await append({ role: 'user', content })
}
```

### Modifying messages directly

```tsx
// Wrong - mutating state
messages.push(newMessage)

// Correct - use the provided methods
append(newMessage)
```

---

## Security Issues

### API key exposed in browser

**Cause:** You're calling the AI API directly from client-side code.

**Solution:** Always use a server-side API route:

```tsx
// WRONG - API key visible in browser
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { Authorization: `Bearer ${apiKey}` }, // Exposed!
})

// CORRECT - Use your backend route
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
})
```

### Environment variable not loading

**Solution:** Ensure proper setup:

```bash
# Create .env.local (not .env - that may get committed!)
echo "OPENAI_API_KEY=sk-..." >> .env.local

# Add to .gitignore
echo ".env.local" >> .gitignore
```

For Next.js, only `NEXT_PUBLIC_*` variables are exposed to the browser. Keep API keys without that prefix.

### Rate limiting / API abuse

**Solution:** Add rate limiting to your API route:

```tsx
// Example using Upstash Rate Limit
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }

  // ... rest of your handler
}
```

---

## Getting More Help

If your issue isn't listed here:

1. **Search existing issues:** [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
2. **Check the docs:**
   - [Getting Started](./getting-started.md)
   - [Interactive Components Guide](./interactive-components-troubleshooting.md)
   - [Migration Guide](./MIGRATION_GUIDE.md)
3. **Open a new issue:** Include:
   - Your Clarity Chat version
   - Your React version
   - Browser and version (for VoiceInput/AudioRecorder issues)
   - Steps to reproduce
   - Error messages (full stack trace)
   - Code sample (minimal reproduction)

---

## Quick Reference

| Problem | First Thing to Try |
|---------|-------------------|
| Microphone permission denied | Check browser settings, must use HTTPS |
| Voice recognition not working | Check browser support (Chrome/Safari only) |
| MediaRecorder not supported | Use Chrome 88+, Safari 14.1+, or provide fallback |
| OKLCH colors not rendering | Check browser support (Chrome 111+, Safari 15.4+) |
| Color contrast too low | Use `meetsWcagAA()` utility function |
| CommandPalette not opening | Check keyboard shortcuts not conflicting |
| Command search not working | Commands match on label, description, category |
| Won't install | `rm -rf node_modules && npm install` |
| Won't build | `npm run typecheck` to see errors |
| Styles broken | Check CSS import |
| API errors | Check browser Network tab |
| TypeScript errors | Restart your IDE |
| Performance slow | Enable virtualization |
| Security concerns | Use server-side API routes |
| Rate limits | Add rate limiting middleware |
