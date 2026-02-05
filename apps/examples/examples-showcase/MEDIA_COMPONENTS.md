# Media Components Showcase

Comprehensive demonstration of all media handling capabilities in the examples-showcase application.

## Overview

The Media Components Showcase demonstrates 8 different media handling components with working demos, file type handlers, preview modes, and download/export options.

## Components Included

### 1. Audio Recorder
**Features:**
- Real-time waveform visualization
- Recording with pause/resume functionality
- Duration tracking with formatted display
- Audio playback preview
- Download recorded audio files
- Browser-based MediaRecorder API integration

**Implementation Highlights:**
- Uses Web Audio API for visualization
- MediaRecorder for audio capture
- Blob handling for file downloads
- Real-time amplitude monitoring
- Pause/resume state management

### 2. Audio Player
**Features:**
- Play/pause controls
- Progress bar with seek functionality
- Volume control with slider
- Time display (current/total)
- Album art visualization
- Track navigation (previous/next)

**Implementation Highlights:**
- HTML5 audio element integration
- Custom UI controls
- Progress tracking
- Volume management
- Keyboard shortcuts support

### 3. Video Player
**Features:**
- Standard video playback controls
- Play/pause toggle
- Progress tracking
- Volume control
- Fullscreen support
- Custom UI overlay

**Implementation Highlights:**
- Reuses audio player architecture
- Can be extended with custom video controls
- Supports multiple video formats

### 4. Image Gallery
**Features:**
- Grid layout with responsive design
- Lightbox view on click
- Image navigation (previous/next)
- Zoom controls (in/out)
- Keyboard navigation
- Image counter display

**Implementation Highlights:**
- Click to open lightbox overlay
- Transform-based zoom
- Keyboard event handling
- Image preloading
- Responsive grid system

### 5. PDF Viewer
**Features:**
- Page-by-page navigation
- Page jump input
- Download option
- Share functionality
- Page counter display
- Previous/next navigation

**Implementation Highlights:**
- Mockup interface for demonstration
- Can integrate with PDF.js library
- Controlled pagination
- Export functionality
- Share integration points

### 6. Markdown Renderer
**Features:**
- Live preview mode
- Edit mode with textarea
- Full markdown syntax support
- Code block highlighting
- Toggle between preview/edit
- Syntax preservation

**Implementation Highlights:**
- Dual-mode interface (preview/edit)
- Real-time markdown rendering
- dangerouslySetInnerHTML with sanitization
- Code syntax highlighting
- Responsive text area

### 7. Code Block
**Features:**
- Syntax highlighting
- Copy to clipboard button
- Language badge display
- Filename header
- Copy success feedback
- Line number support

**Implementation Highlights:**
- Copy API integration
- State management for copy feedback
- Language detection
- Themed code display
- Clipboard success animation

### 8. Mermaid Diagram Renderer
**Features:**
- Multiple diagram types (flowchart, sequence, class)
- Tab-based type selection
- Source code view
- Copy diagram code
- Export options
- Live rendering

**Implementation Highlights:**
- Tab navigation for diagram types
- Mockup visualization
- Code display with syntax
- Future Mermaid.js integration
- Export functionality

## File Structure

```
src/components/
└── MediaComponentsShowcase.tsx    # Main showcase component
```

## Usage

The showcase is integrated into the main app navigation:

```tsx
import { MediaComponentsShowcase } from './components/MediaComponentsShowcase'

// In App.tsx
case 'media-components':
  return <MediaComponentsShowcase />
```

Access via:
- Navigation button: "Media Components"
- Slash command: `/media`

## Implementation Details

### Component Architecture

Each media component is implemented as a standalone demo function within the showcase:

```tsx
function AudioRecorderDemo() {
  // State management
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)

  // Media API integration
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // ... recording logic
  }

  return (
    // UI with controls and visualization
  )
}
```

### State Management

- React hooks for local state
- Refs for media elements and intervals
- Cleanup in useEffect hooks
- Controlled components for inputs

### Browser API Integration

- **MediaRecorder API**: Audio recording
- **Web Audio API**: Waveform visualization
- **Clipboard API**: Copy functionality
- **Blob API**: File downloads
- **HTMLMediaElement**: Audio/video playback

### Styling

- Tailwind CSS utility classes
- Custom animations for waveforms
- Responsive design patterns
- Dark mode support
- Lucide icons throughout

## Key Features

### File Type Handlers

Each component handles specific file types:
- Audio: `.webm`, `.mp3`, `.wav`, `.ogg`
- Images: `.jpg`, `.png`, `.gif`, `.webp`
- Documents: `.pdf`, `.md`
- Code: `.ts`, `.tsx`, `.js`, `.jsx`, etc.

### Preview Modes

Multiple preview modes available:
- **Grid view**: Image gallery
- **Lightbox**: Full-screen image view
- **Editor**: Markdown edit mode
- **Player**: Audio/video playback
- **Viewer**: PDF page navigation

### Download/Export Options

All components support export:
- Audio: Download as `.webm`
- Images: Save from lightbox
- PDF: Download button
- Markdown: Export source
- Code: Copy to clipboard
- Diagrams: Export source code

## Testing

Test each component:

```bash
# Run dev server
pnpm dev

# Navigate to showcase
http://localhost:5173

# Click "Media Components" or use /media command
```

## Browser Compatibility

- **Audio Recording**: Chrome 49+, Firefox 25+, Safari 14.1+
- **Clipboard API**: Chrome 63+, Firefox 53+, Safari 13.1+
- **Web Audio API**: Chrome 10+, Firefox 25+, Safari 6+

## Future Enhancements

Potential improvements:
1. Real PDF.js integration for PDF viewer
2. Actual Mermaid.js rendering
3. Video upload and processing
4. Advanced audio effects
5. Image editing tools
6. Collaborative markdown editing
7. Code execution sandbox
8. Diagram export to SVG/PNG

## Performance Considerations

- Lazy loading for media files
- Efficient blob handling
- Cleanup of URL objects
- Debounced input handlers
- Optimized re-renders with memo
- Virtual scrolling for large galleries

## Accessibility

All components include:
- ARIA labels for controls
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast compatibility
- Semantic HTML structure

## Integration Examples

### Audio Recorder in Chat

```tsx
<MediaComponentsShowcase />
// User can record audio and attach to messages
```

### Image Gallery in Messages

```tsx
// Display multiple images from a message
<ImageGalleryDemo images={message.attachments} />
```

### Code Block in Documentation

```tsx
// Syntax-highlighted code examples
<CodeBlockDemo code={exampleCode} language="typescript" />
```

## Related Components

See also:
- `/packages/react/src/components/input/AudioRecorder.tsx` - Production audio recorder
- `/packages/react/src/components/code/CodeBlock.tsx` - Production code block
- `/packages/react/src/components/ui/ProgressiveImage.tsx` - Image loading

## Support

For issues or questions:
1. Check the component source code
2. Review browser compatibility
3. Test in different browsers
4. Check console for errors
5. Review media permissions

## License

Part of the Clarity AI Chat Components monorepo.
