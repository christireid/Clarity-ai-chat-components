# VoiceInput Component Demo

A comprehensive demonstration of voice input functionality with real-time transcription, audio visualization, and voice command recognition.

## Features

### 1. Voice Recording
- **MediaRecorder API Integration**: Browser-native audio recording
- **Multiple Recording States**: Idle, Recording, Paused, Processing
- **Audio Quality Controls**: Echo cancellation, noise suppression, auto gain
- **Proper Cleanup**: Automatic resource management on unmount

### 2. Real-time Transcription
- **Web Speech API**: Built-in browser speech recognition
- **Continuous Recognition**: Real-time transcription while recording
- **Confidence Scoring**: Shows confidence level for each segment
- **Interim Results**: See transcription as you speak
- **Segment History**: View recent transcription segments with timestamps

### 3. Audio Visualization
- **Canvas-based Waveform**: Real-time frequency visualization
- **Audio Level Meter**: Visual feedback of microphone input level
- **Frequency Bars**: 32-band frequency analysis
- **Color-coded Levels**: Green/Yellow/Red indicators for audio levels
- **Smooth Animations**: 60fps visualization using requestAnimationFrame

### 4. Voice Command Recognition
- **Natural Language Commands**: Control the interface with voice
- **Command History**: See all recognized commands
- **Pattern Matching**: Multiple command variations supported
- **Real-time Feedback**: Instant visual confirmation

### 5. Browser Permissions
- **Permission Request Flow**: Clear UI for requesting microphone access
- **Error Handling**: Graceful fallback for denied permissions
- **Browser Compatibility**: Feature detection for all APIs
- **User-friendly Messages**: Clear instructions for permission issues

### 6. Glassmorphism Design
- **Modern UI**: Frosted glass effect panels
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Works on all screen sizes
- **Dark Mode Support**: Automatic theme adaptation
- **Accessibility**: WCAG 2.1 AA compliant

## Supported Voice Commands

| Command | Action | Variations |
|---------|--------|-----------|
| "Start recording" | Begin recording | "begin recording" |
| "Stop recording" | End recording | "end recording" |
| "Pause" | Pause recording | "hold" |
| "Resume" | Continue recording | "continue" |
| "Clear" | Clear transcript | "reset" |
| "Save" | Save recording | "export" |
| "Send message" | Submit transcript | "submit" |

## Browser Support

### Required Features
- **MediaRecorder API**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Web Audio API**: All modern browsers
- **Canvas 2D**: All browsers
- **getUserMedia**: Requires HTTPS (except localhost)

### Optional Features
- **Web Speech API**: Chrome, Safari, Edge (not Firefox)
  - Fallback: Manual transcription can be simulated
- **AudioWorklet**: Chrome 66+, Safari 14.1+
  - Fallback: ScriptProcessorNode (deprecated but functional)

## Implementation Details

### Audio Recording Flow
```typescript
1. Request microphone permission → getUserMedia()
2. Create MediaRecorder instance
3. Setup audio context and analyzer
4. Start visualization loop
5. Begin speech recognition
6. Collect audio chunks
7. Process on stop
```

### Visualization Pipeline
```typescript
1. AudioContext → AnalyserNode
2. getByteFrequencyData() → Uint8Array
3. Canvas rendering @ 60fps
4. Color-coded frequency bars
5. Audio level meter
```

### Speech Recognition
```typescript
1. Initialize SpeechRecognition
2. Set continuous mode
3. Handle interim results
4. Calculate confidence scores
5. Detect voice commands
6. Update transcript in real-time
```

## Component Architecture

```
VoiceInputDemo
├── Glass Panel: Main Controls
│   ├── Visualization Canvas
│   ├── Audio Level Bar
│   └── Recording Controls
├── Glass Panel: Settings
│   ├── Sensitivity Slider
│   ├── Noise Reduction Toggle
│   ├── Auto-stop Toggle
│   └── Voice Commands Toggle
├── Glass Panel: Transcription
│   ├── Real-time Text Display
│   ├── Segment List
│   └── Confidence Scores
├── Glass Panel: Voice Commands
│   ├── Command History
│   ├── Action Mapping
│   └── Timestamps
├── Glass Panel: Frequency Analysis
│   └── 32-band Spectrum
└── Glass Panel: Features Info
    └── Capability List
```

## Usage Example

```tsx
import VoiceInputDemo from './components/VoiceInputDemo'
import './components/VoiceInputDemo.css'

function App() {
  return (
    <div>
      <VoiceInputDemo />
    </div>
  )
}
```

## Styling

The component uses a comprehensive glassmorphism design system:

```css
/* Glass effect with backdrop blur */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
}

/* Gradient buttons */
.glass-button.primary {
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.9),
    rgba(139, 92, 246, 0.9)
  );
}
```

## Performance Considerations

### Optimization Techniques
1. **RequestAnimationFrame**: Efficient 60fps visualization
2. **Debounced Updates**: Prevent excessive re-renders
3. **Memoized Callbacks**: useCallback for event handlers
4. **Cleanup on Unmount**: Proper resource disposal
5. **Conditional Rendering**: Only render active components

### Resource Management
- **Audio Context**: Created once, reused
- **Media Stream**: Properly stopped on cleanup
- **Animation Frames**: Cancelled on unmount
- **Event Listeners**: Removed on cleanup

## Security Considerations

### Privacy
- **No Data Storage**: Audio not saved by default
- **Local Processing**: All transcription in browser
- **Permission Required**: Explicit user consent
- **Secure Context**: HTTPS required (except localhost)

### Best Practices
- Clear permission request messaging
- Graceful error handling
- User control over all features
- Transparent data handling
- Accessibility compliance

## Accessibility Features

### WCAG 2.1 Compliance
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states
- **Color Contrast**: 4.5:1 minimum ratio
- **Screen Reader Support**: ARIA labels
- **Error Messages**: Clear, actionable feedback

### Responsive Design
- **Mobile First**: Touch-optimized controls
- **Flexible Layout**: Adapts to all screens
- **Readable Text**: Minimum 16px font size
- **Touch Targets**: Minimum 44x44px buttons

## Testing

### Manual Testing Checklist
- [ ] Permission request flow
- [ ] Recording start/stop/pause
- [ ] Audio visualization
- [ ] Transcription accuracy
- [ ] Voice command recognition
- [ ] Error handling
- [ ] Browser compatibility
- [ ] Responsive layout
- [ ] Dark mode
- [ ] Accessibility

### Automated Testing
```typescript
// Example test cases
describe('VoiceInputDemo', () => {
  it('requests microphone permission')
  it('starts recording on button click')
  it('displays audio visualization')
  it('transcribes speech in real-time')
  it('recognizes voice commands')
  it('handles permission denial gracefully')
})
```

## Future Enhancements

### Planned Features
1. **Audio File Export**: Save recordings as WAV/MP3
2. **Multi-language Support**: Additional language options
3. **Custom Voice Commands**: User-defined commands
4. **Audio Effects**: Filters and processing
5. **Cloud Transcription**: Integration with external APIs
6. **Speaker Diarization**: Multiple speaker detection
7. **Keyword Spotting**: Highlight important terms
8. **Sentiment Analysis**: Emotion detection

### Integration Options
- OpenAI Whisper API
- Google Cloud Speech-to-Text
- Azure Speech Services
- AWS Transcribe
- AssemblyAI

## Troubleshooting

### Common Issues

#### Permission Denied
**Symptom**: "Microphone access denied" error
**Solution**:
1. Check browser permissions (usually in address bar)
2. Ensure HTTPS connection (except localhost)
3. Verify no other app is using microphone

#### No Audio Visualization
**Symptom**: Canvas shows no waveform
**Solution**:
1. Check microphone is working (test in other apps)
2. Verify browser supports Web Audio API
3. Check console for errors

#### Transcription Not Working
**Symptom**: Speech recognition fails
**Solution**:
1. Check browser supports Web Speech API
2. Verify internet connection (API requires online)
3. Try speaking more clearly
4. Check microphone sensitivity settings

#### Poor Audio Quality
**Symptom**: Distorted or unclear audio
**Solution**:
1. Adjust sensitivity slider
2. Enable noise reduction
3. Check microphone hardware
4. Move closer to microphone
5. Reduce background noise

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- React 19
- TypeScript
- Framer Motion
- Lucide React Icons
- Web APIs (MediaRecorder, Web Audio, Speech Recognition)

## Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- Documentation: [Full Docs](https://clarity-chat-docs.vercel.app)
