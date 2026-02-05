# Voice Input Demo

## Overview

Comprehensive demonstration of the VoiceInput component from `@clarity-chat/react`, showcasing real-time voice recording with transcription, waveform visualization, and multi-language support.

## Features Implemented

### 1. Voice Recording Button
- Large, centered voice input button using the VoiceInput component
- Visual state changes (Ready → Recording)
- Pulse animation during recording
- Icon changes based on state

### 2. Real-time Transcription Display
- Shows transcription in real-time as you speak
- Displays both interim (in-progress) and final transcripts
- Messages collected and displayed in a scrollable list
- Distinguishes between text and voice messages with icons

### 3. Waveform Visualization
- 32-bar animated waveform display
- Gradient colors (primary to violet)
- Height varies based on simulated audio levels
- Smooth transitions and animations
- Shows pause state with muted colors

### 4. Audio Playback
- Playback controls (play/pause button)
- Progress bar visualization
- Duration display
- Appears after recording completion

### 5. Send Voice Message or Convert to Text
- Two modes: **Text** and **Voice Message**
- **Text Mode**: Auto-converts speech to text and adds to message list
- **Voice Message Mode**: Saves as voice message with transcript
- Easy mode switching with toggle buttons

### 6. Multiple Language Support
- 8 languages supported:
  - English (US) 🇺🇸
  - Spanish 🇪🇸
  - French 🇫🇷
  - German 🇩🇪
  - Japanese 🇯🇵
  - Chinese 🇨🇳
  - Italian 🇮🇹
  - Portuguese 🇧🇷
- Visual language selector with flag icons
- Active language highlighted
- Dynamically changes voice recognition language

### 7. Recording Controls
- **Pause/Resume**: Pause recording and resume later
- **Stop**: Stop recording and finalize
- **Cancel**: Discard recording completely
- Visual feedback for each action
- Disabled states when appropriate

### 8. Audio Level Indicators
- Real-time audio level display (0-100%)
- Color-coded progress bar (green → yellow → red)
- Smooth transitions
- Updates 10 times per second

## Component Structure

```
VoiceInputDemo
├── Main Card (2/3 width)
│   ├── Mode Selection (Text / Voice Message)
│   ├── Waveform Visualization (when recording)
│   ├── Audio Level Indicators
│   ├── VoiceInput Component (centered)
│   ├── Recording Controls (Pause, Stop, Cancel)
│   ├── Audio Playback
│   └── Transcribed Messages List
│
└── Sidebar (1/3 width)
    ├── Language Support
    │   └── 8 language options with flags
    ├── Features List
    │   └── 8 feature checkmarks
    └── Statistics
        ├── Messages count
        ├── Current mode
        ├── Selected language
        └── Recording duration (when active)
```

## State Management

### Recording State
- `isRecording`: Boolean - Whether currently recording
- `isPaused`: Boolean - Whether recording is paused
- `recordingTime`: Number - Seconds elapsed
- `audioLevel`: Number - Current audio level (0-100)

### Message State
- `messages`: Array - All transcribed messages
- `currentLanguage`: String - Selected language code
- `recordingMode`: 'text' | 'voice' - Current mode

### Audio State
- `audioData`: Object - Audio playback information
  - `url`: String | null - Audio blob URL
  - `duration`: Number - Recording duration
  - `isPlaying`: Boolean - Playback state

## Integration

### File Location
`/apps/component-showcase/app/chat/voice-input-demo.tsx`

### Import Statement
```tsx
import { VoiceInputDemo } from './voice-input-demo'
```

### Usage in Chat Page
Added to the **UI Components** tab:

```tsx
<ComponentSection
  title="Voice Input"
  description="Real-time voice recording with transcription, waveform visualization, and multi-language support"
  icon={Mic}
>
  <VoiceInputDemo />
</ComponentSection>
```

## Dependencies

### From @clarity-chat/react
- `VoiceInput` - Core voice input component

### From @clarity-chat/primitives
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Button`
- `Badge`
- `ScrollArea`
- `cn` - Class name utility

### Icons (lucide-react)
- `Mic`, `FileText`, `Volume2`, `Play`, `Pause`, `Square`, `X`
- `Trash2`, `Globe`, `Sparkles`, `CheckCircle`, `Activity`

## Browser Support

The VoiceInput component uses the Web Speech API:
- ✅ Chrome/Edge (best support)
- ✅ Safari (iOS 14.5+, macOS 14.3+)
- ❌ Firefox (not yet supported)
- ❌ Mobile Firefox/Samsung Internet

## Styling

### Glass Card Design
- Uses `glass-card` class for glassmorphism effect
- Transparent backgrounds with backdrop blur
- Subtle borders with white/10 opacity

### Color Scheme
- Primary gradient for waveform (primary to violet)
- Audio level gradient (green → yellow → red)
- Recording indicator (red pulse)
- Pause indicator (yellow)

### Responsive Layout
- 2-column layout on large screens (lg breakpoint)
- Stacks on smaller screens
- Scrollable message list

## Future Enhancements

Potential improvements:
1. Real audio recording (currently simulated)
2. Export voice messages as audio files
3. Voice message playback with waveform
4. Noise cancellation settings
5. Auto-punctuation toggle
6. Confidence threshold settings
7. Custom wake words
8. Voice commands integration

## Technical Details

### Simulated Features
Since this is a demo, some features are simulated:
- **Audio levels**: Random values for visualization
- **Audio playback**: Mock audio data
- **Recording timer**: Client-side timer

### Real Features
These work with actual Web Speech API:
- **Voice recognition**: Real browser speech-to-text
- **Language switching**: Actual language models
- **Transcription**: Real-time speech recognition

## Testing

To test the demo:
1. Navigate to `/chat` page
2. Click on "UI Components" tab
3. Scroll to "Voice Input" section
4. Click the microphone button
5. Grant microphone permission
6. Start speaking
7. Watch real-time transcription
8. Try different modes and languages

## Notes

- Microphone permission required
- Works best in quiet environments
- Internet connection needed (Web Speech API uses cloud processing)
- Language accuracy varies by browser and language
