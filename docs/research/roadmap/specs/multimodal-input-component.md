# Multi-Modal Input Component Specification

## Overview

A unified input component for AI chat interfaces that supports multiple input modalities: text,
voice, image, and file attachments. This component provides a seamless user experience for composing
rich messages with mixed content types, combining the best patterns from leading AI chat interfaces.

## Inspiration

### Assistant UI - Composable Architecture

- **Composer Primitives**: Modular sub-components (Composer.Root, Composer.Input,
  Composer.Attachments, Composer.Send)
- **Attachment Handling**: Index-based attachment access with custom renderers
- **Multi-part Messages**: Messages composed of typed parts (text, image, file, etc.)
- **State Management**: Runtime-based state with reactive updates
- **Event Composition**: Merge custom handlers with built-in behavior

### shadcn/ui AI - Design Excellence

- **Beautiful Defaults**: Professional appearance with zero configuration
- **OKLCH Color System**: Perceptually uniform colors for consistent theming
- **Responsive Spacing**: Mobile-first with predictable scaling patterns
- **Pill Buttons**: Modern, friendly action buttons
- **Sub-component Composition**: Granular control through Card → CardHeader → CardTitle pattern

### ElevenLabs UI - Audio Excellence

- **Audio Visualization**: Real-time frequency visualization with state-based animations
- **Performance**: GPU-accelerated animations, minimal latency
- **Agent Orb**: Animated SVG orb synchronized with audio states

### Voice Input Component

- **Speech Recognition**: Browser and Whisper API integration
- **Real-time Transcription**: Continuous recognition with interim results
- **Audio Controls**: Record, pause, resume, cancel functionality
- **Visualization Types**: Waveform, bars, circular, orb

## User Stories

1. **As a user, I want to type, speak, or upload content without switching tools**
   - Acceptance: Single input area with mode toggles for text/voice/upload
   - Benefit: Faster composition, natural workflow, reduced friction

2. **As a user, I want to attach multiple files and images to my message**
   - Acceptance: Drag-and-drop or click to upload, preview attachments
   - Benefit: Rich context for AI, better communication

3. **As a user, I want to see previews of all attachments before sending**
   - Acceptance: Image thumbnails, file names, remove buttons
   - Benefit: Verify content, catch mistakes before sending

4. **As a user, I want to mix text and voice input in the same message**
   - Acceptance: Append voice transcription to text field
   - Benefit: Flexibility, use best input method for each part

5. **As a user, I want to paste images directly from clipboard**
   - Acceptance: Ctrl/Cmd+V pastes clipboard images
   - Benefit: Fast workflow, no save-then-upload

6. **As a user, I want to edit or remove attachments before sending**
   - Acceptance: Remove button per attachment, clear all option
   - Benefit: Correct mistakes, reduce wasted uploads

7. **As a developer, I want to validate files before upload**
   - Acceptance: File type, size, count validation with custom rules
   - Benefit: Prevent errors, enforce constraints, better UX

8. **As a developer, I want to customize which input modes are available**
   - Acceptance: Props to enable/disable text, voice, image, file
   - Benefit: Match app capabilities, simplify UI when needed

## Component API

### Props

```typescript
interface MultiModalInputProps {
  // Content
  value?: string // Text input value
  onChange?: (value: string) => void
  onSubmit?: (content: MessageContent) => void | Promise<void>

  // Input modes
  enableText?: boolean // default: true
  enableVoice?: boolean // default: true
  enableImage?: boolean // default: true
  enableFile?: boolean // default: true

  // Attachments
  attachments?: Attachment[]
  onAttachmentsChange?: (attachments: Attachment[]) => void
  maxAttachments?: number // default: 10
  maxAttachmentSize?: number // bytes, default: 10MB
  acceptedFileTypes?: string[] // MIME types, default: all
  acceptedImageTypes?: string[] // MIME types, default: ['image/*']

  // File handling
  onFileValidate?: (file: File) => Promise<ValidationResult>
  onFileUpload?: (file: File) => Promise<UploadResult>
  uploadProvider?: 'client' | 'custom' // default: 'client'
  customUploader?: (file: File) => Promise<string> // Returns URL

  // Voice input
  voiceProvider?: 'browser' | 'whisper' | 'custom' // default: 'browser'
  voiceLanguage?: string // default: 'en-US'
  voiceMaxDuration?: number // seconds, default: 60
  whisperApiKey?: string
  customTranscriber?: (blob: Blob) => Promise<string>

  // Behavior
  autoResize?: boolean // Auto-resize textarea, default: true
  minRows?: number // Min textarea rows, default: 1
  maxRows?: number // Max textarea rows, default: 10
  submitOnEnter?: boolean // default: true
  submitOnShiftEnter?: boolean // default: false
  placeholder?: string // default: "Type a message..."
  disabled?: boolean // default: false
  loading?: boolean // default: false

  // Styling
  className?: string
  variant?: 'default' | 'minimal' | 'bordered' | 'floating' // default: 'default'
  size?: 'sm' | 'md' | 'lg' // default: 'md'
  theme?: 'light' | 'dark' | 'auto' // default: 'auto'

  // Callbacks
  onFocus?: () => void
  onBlur?: () => void
  onVoiceStart?: () => void
  onVoiceEnd?: (transcript: string) => void
  onVoiceError?: (error: VoiceInputError) => void
  onAttachmentAdd?: (attachment: Attachment) => void
  onAttachmentRemove?: (id: string) => void
  onPaste?: (event: ClipboardEvent) => void
  onDrop?: (event: DragEvent) => void
  onError?: (error: MultiModalInputError) => void

  // Advanced
  showCharacterCount?: boolean // default: false
  maxCharacters?: number // default: undefined
  showSendButton?: boolean // default: true
  showAttachmentPreview?: boolean // default: true
  showVoiceVisualization?: boolean // default: true
  voiceVisualizationType?: 'waveform' | 'bars' | 'circular' | 'orb'
}

interface MessageContent {
  text: string
  attachments: Attachment[]
}

interface Attachment {
  id: string
  type: 'image' | 'file' | 'audio' | 'video'
  name: string
  size: number
  mimeType: string
  url?: string // Local blob URL or uploaded URL
  file?: File // Original file object
  thumbnail?: string // For images/videos
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  progress?: number // 0-100 for upload progress
  error?: string
}

interface ValidationResult {
  valid: boolean
  error?: string
}

interface UploadResult {
  url: string
  thumbnail?: string
}

interface VoiceInputError {
  code:
    | 'PERMISSION_DENIED'
    | 'DEVICE_NOT_FOUND'
    | 'TRANSCRIPTION_FAILED'
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
  message: string
  originalError?: Error
}

interface MultiModalInputError {
  code:
    | 'FILE_TOO_LARGE'
    | 'FILE_TYPE_NOT_ALLOWED'
    | 'TOO_MANY_FILES'
    | 'UPLOAD_FAILED'
    | 'VALIDATION_FAILED'
    | 'VOICE_ERROR'
  message: string
  file?: File
  originalError?: Error
}
```

### Sub-Components (Compound Component Pattern)

```typescript
// Main component with sub-components
export const MultiModalInput = {
  Root: MultiModalInputRoot,
  Textarea: MultiModalInputTextarea,
  Attachments: MultiModalInputAttachments,
  AttachmentPreview: MultiModalInputAttachmentPreview,
  Actions: MultiModalInputActions,
  VoiceButton: MultiModalInputVoiceButton,
  ImageButton: MultiModalInputImageButton,
  FileButton: MultiModalInputFileButton,
  SendButton: MultiModalInputSendButton,
  CharacterCount: MultiModalInputCharacterCount,
}

// Usage
<MultiModalInput.Root>
  <MultiModalInput.Attachments />
  <MultiModalInput.Textarea />
  <MultiModalInput.Actions>
    <MultiModalInput.VoiceButton />
    <MultiModalInput.ImageButton />
    <MultiModalInput.FileButton />
    <MultiModalInput.SendButton />
  </MultiModalInput.Actions>
  <MultiModalInput.CharacterCount />
</MultiModalInput.Root>
```

## Usage Examples

### Basic Usage

```tsx
import { MultiModalInput } from '@clarity-chat/react'

function Chat() {
  const handleSubmit = (content: MessageContent) => {
    console.log('Text:', content.text)
    console.log('Attachments:', content.attachments)
    sendMessage(content)
  }

  return <MultiModalInput onSubmit={handleSubmit} />
}
```

### Controlled Component

```tsx
import { MultiModalInput } from '@clarity-chat/react'

function ControlledInput() {
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const handleSubmit = (content: MessageContent) => {
    sendMessage(content)
    setText('')
    setAttachments([])
  }

  return (
    <MultiModalInput
      value={text}
      onChange={setText}
      attachments={attachments}
      onAttachmentsChange={setAttachments}
      onSubmit={handleSubmit}
    />
  )
}
```

### Custom File Validation and Upload

```tsx
<MultiModalInput
  onFileValidate={async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File must be under 5MB' }
    }
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Only images allowed' }
    }
    return { valid: true }
  }}
  uploadProvider="custom"
  customUploader={async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const { url, thumbnail } = await response.json()
    return { url, thumbnail }
  }}
  onSubmit={handleSubmit}
/>
```

### Voice Integration with Whisper

```tsx
<MultiModalInput
  voiceProvider="whisper"
  whisperApiKey={process.env.WHISPER_API_KEY}
  voiceLanguage="es-ES"
  voiceMaxDuration={120}
  showVoiceVisualization
  voiceVisualizationType="orb"
  onVoiceStart={() => console.log('Recording...')}
  onVoiceEnd={(transcript) => console.log('Said:', transcript)}
  onVoiceError={(error) => showError(error.message)}
  onSubmit={handleSubmit}
/>
```

### Limited Input Modes

```tsx
// Text and voice only (no file uploads)
<MultiModalInput
  enableText={true}
  enableVoice={true}
  enableImage={false}
  enableFile={false}
  onSubmit={handleSubmit}
/>

// Text only (simple chat)
<MultiModalInput
  enableVoice={false}
  enableImage={false}
  enableFile={false}
  onSubmit={handleSubmit}
/>
```

### Compound Component Customization

```tsx
import { MultiModalInput } from '@clarity-chat/react'

function CustomInput() {
  return (
    <MultiModalInput.Root>
      <MultiModalInput.Attachments />

      <div className="flex gap-2">
        <MultiModalInput.Textarea placeholder="Ask me anything..." minRows={2} maxRows={8} />

        <div className="flex flex-col gap-1">
          <MultiModalInput.VoiceButton size="sm" />
          <MultiModalInput.ImageButton size="sm" />
          <MultiModalInput.SendButton size="sm" />
        </div>
      </div>

      <div className="flex justify-between">
        <MultiModalInput.CharacterCount />
        <button onClick={clearAll}>Clear</button>
      </div>
    </MultiModalInput.Root>
  )
}
```

### With Character Limit

```tsx
<MultiModalInput
  showCharacterCount
  maxCharacters={2000}
  onSubmit={handleSubmit}
  onError={(error) => {
    if (error.code === 'VALIDATION_FAILED') {
      toast.error(error.message)
    }
  }}
/>
```

### Drag and Drop Files

```tsx
<MultiModalInput
  maxAttachments={5}
  maxAttachmentSize={10 * 1024 * 1024} // 10MB
  acceptedFileTypes={['image/*', 'application/pdf', '.doc', '.docx']}
  onDrop={(event) => {
    console.log('Files dropped:', event.dataTransfer.files)
  }}
  onAttachmentAdd={(attachment) => {
    console.log('Added:', attachment.name)
  }}
  onSubmit={handleSubmit}
/>
```

## Visual Design

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Attachments Preview (if any)                       │
│  [📷 image.jpg ❌] [📄 doc.pdf ❌]                   │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │ Type your message...                          │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  [🎤] [🖼️] [📎]                             [➤]    │
│   Voice Image File                          Send    │
└─────────────────────────────────────────────────────┘
```

### States

#### 1. Idle (Empty)

```
┌─────────────────────────────────────────────────────┐
│  Type a message...                        [🎤][📎]  │
└─────────────────────────────────────────────────────┘
```

#### 2. Typing (Text Input)

```
┌─────────────────────────────────────────────────────┐
│  Hello, how can you help me...            [🎤][📎]  │
│                                                      │
│  32 characters                                  [➤]  │
└─────────────────────────────────────────────────────┘
```

#### 3. Recording Voice

```
┌─────────────────────────────────────────────────────┐
│  ▁▃▅▇█▇▅▃▁▃▅▇ Recording... 0:15           [⏹]      │
└─────────────────────────────────────────────────────┘
```

#### 4. With Attachments

```
┌─────────────────────────────────────────────────────┐
│  Attachments (2)                                     │
│  ┌──────────┐  ┌──────────┐                         │
│  │  [Image] │  │   [PDF]  │                         │
│  │ photo.jpg│  │report.pdf│                         │
│  │   ❌     │  │   ❌     │                         │
│  └──────────┘  └──────────┘                         │
├─────────────────────────────────────────────────────┤
│  Check out these files                   [🎤][📎]  │
│                                                      │
│  23 characters                                  [➤]  │
└─────────────────────────────────────────────────────┘
```

#### 5. Uploading

```
┌─────────────────────────────────────────────────────┐
│  Attachments (1)                                     │
│  ┌──────────┐                                        │
│  │  [Image] │                                        │
│  │ photo.jpg│                                        │
│  │ ████▒▒▒▒ │  75% uploaded                         │
│  └──────────┘                                        │
├─────────────────────────────────────────────────────┤
│  Type a message...                        [🎤][📎]  │
└─────────────────────────────────────────────────────┘
```

#### 6. Error State

```
┌─────────────────────────────────────────────────────┐
│  Attachments (1)                                     │
│  ┌──────────┐                                        │
│  │  [Image] │                                        │
│  │large.jpg │                                        │
│  │   ❌❗   │  File too large (max 10MB)            │
│  └──────────┘                                        │
├─────────────────────────────────────────────────────┤
│  Type a message...                        [🎤][📎]  │
└─────────────────────────────────────────────────────┘
```

#### 7. Disabled/Loading

```
┌─────────────────────────────────────────────────────┐
│  Type a message...                        [🎤][📎]  │
│  ⏳ Sending message...                              │
└─────────────────────────────────────────────────────┘
```

### Variants

#### Default Variant

```tsx
<MultiModalInput variant="default" />
```

- Full border around entire component
- Padding around textarea and actions
- Attachment preview above input
- Actions row below textarea

#### Minimal Variant

```tsx
<MultiModalInput variant="minimal" />
```

- No border
- Minimal padding
- Actions inline with textarea
- Subtle background

#### Bordered Variant

```tsx
<MultiModalInput variant="bordered" />
```

- Strong border emphasis
- Clear separation between sections
- Elevated appearance
- Box shadow

#### Floating Variant

```tsx
<MultiModalInput variant="floating" />
```

- Rounded corners (pill-shaped)
- Floating shadow
- Compact action buttons
- Centered send button

### Size Variants

```tsx
// Small
<MultiModalInput size="sm" />
// - Smaller padding, compact buttons, 1-line default

// Medium (default)
<MultiModalInput size="md" />
// - Standard sizing, balanced spacing

// Large
<MultiModalInput size="lg" />
// - Larger padding, bigger buttons, more space
```

### Styling (from shadcn/ui AI)

```css
/* Container */
.multimodal-input {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.multimodal-input:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring) / 0.1;
}

/* Textarea */
.multimodal-input-textarea {
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--foreground);
  padding: 12px 16px;
  min-height: 44px; /* Accessible touch target */
}

.multimodal-input-textarea::placeholder {
  color: var(--muted-foreground);
}

/* Attachments preview */
.multimodal-input-attachments {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}

.multimodal-input-attachment {
  position: relative;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
  max-width: 150px;
  background: var(--background);
}

.multimodal-input-attachment-thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: calc(var(--radius) - 2px);
}

.multimodal-input-attachment-name {
  font-size: 0.75rem;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multimodal-input-attachment-size {
  font-size: 0.625rem;
  color: var(--muted-foreground);
}

.multimodal-input-attachment-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--destructive);
  color: var(--destructive-foreground);
  border: none;
  border-radius: 9999px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.multimodal-input-attachment-remove:hover {
  transform: scale(1.1);
}

.multimodal-input-attachment-progress {
  height: 4px;
  background: var(--muted);
  border-radius: 9999px;
  overflow: hidden;
}

.multimodal-input-attachment-progress-bar {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

/* Actions row */
.multimodal-input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid var(--border);
  justify-content: space-between;
}

.multimodal-input-action-button {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  border-radius: 9999px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.multimodal-input-action-button:hover {
  background: var(--accent);
  color: var(--accent-foreground);
  transform: scale(1.05);
}

.multimodal-input-action-button:active {
  transform: scale(0.95);
}

.multimodal-input-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.multimodal-input-send-button {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 9999px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.multimodal-input-send-button:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.multimodal-input-send-button:active {
  transform: scale(0.95);
}

.multimodal-input-send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Character count */
.multimodal-input-character-count {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  padding: 0 16px 8px;
  text-align: right;
}

.multimodal-input-character-count.warning {
  color: var(--warning);
}

.multimodal-input-character-count.error {
  color: var(--destructive);
}

/* Drop zone */
.multimodal-input.dragging {
  border-color: var(--primary);
  background: var(--primary) / 0.05;
  border-style: dashed;
}

.multimodal-input-drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background) / 0.9;
  color: var(--primary);
  font-weight: 500;
  font-size: 1.125rem;
  pointer-events: none;
}

/* Variants */
.multimodal-input.minimal {
  border: none;
  background: transparent;
}

.multimodal-input.bordered {
  border-width: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.multimodal-input.floating {
  border-radius: 9999px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Sizes */
.multimodal-input.sm .multimodal-input-textarea {
  padding: 8px 12px;
  font-size: 0.875rem;
  min-height: 36px;
}

.multimodal-input.lg .multimodal-input-textarea {
  padding: 16px 20px;
  font-size: 1.125rem;
  min-height: 52px;
}

/* Responsive */
@media (max-width: 640px) {
  .multimodal-input-attachments {
    gap: 6px;
    padding: 8px 12px;
  }

  .multimodal-input-attachment {
    min-width: 80px;
    max-width: 100px;
  }

  .multimodal-input-actions {
    padding: 6px 12px;
    gap: 6px;
  }

  .multimodal-input-action-button {
    min-width: 36px;
    min-height: 36px;
  }
}
```

## Implementation Details

### File Structure

```
packages/react/src/components/multimodal-input/
├── multimodal-input.tsx                 # Main component
├── multimodal-input-root.tsx            # Root wrapper
├── multimodal-input-textarea.tsx        # Auto-resizing textarea
├── multimodal-input-attachments.tsx     # Attachments container
├── multimodal-input-attachment.tsx      # Single attachment preview
├── multimodal-input-actions.tsx         # Actions toolbar
├── multimodal-input-voice-button.tsx    # Voice input button
├── multimodal-input-image-button.tsx    # Image upload button
├── multimodal-input-file-button.tsx     # File upload button
├── multimodal-input-send-button.tsx     # Send button
├── multimodal-input-character-count.tsx # Character counter
├── multimodal-input.test.tsx            # Unit tests
├── multimodal-input.stories.tsx         # Storybook stories
├── use-auto-resize.ts                   # Textarea auto-resize hook
├── use-file-upload.ts                   # File upload hook
├── use-drag-drop.ts                     # Drag and drop hook
├── use-paste.ts                         # Clipboard paste hook
├── file-validator.ts                    # File validation utilities
├── file-uploader.ts                     # File upload utilities
├── types.ts                             # TypeScript types
├── constants.ts                         # Constants and defaults
├── index.ts                             # Exports
└── README.md                            # Component documentation
```

### Core Functionality

#### 1. Auto-Resizing Textarea

```typescript
// use-auto-resize.ts
import { useEffect, useRef } from 'react'

interface UseAutoResizeOptions {
  minRows?: number
  maxRows?: number
  value: string
  enabled?: boolean
}

export function useAutoResize({
  minRows = 1,
  maxRows = 10,
  value,
  enabled = true,
}: UseAutoResizeOptions) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!enabled || !textareaRef.current) return

    const textarea = textareaRef.current
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Calculate new height
    const minHeight = lineHeight * minRows
    const maxHeight = lineHeight * maxRows
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)

    textarea.style.height = `${newHeight}px`
  }, [value, minRows, maxRows, enabled])

  return textareaRef
}
```

#### 2. File Upload

```typescript
// use-file-upload.ts
import { useState, useCallback } from 'react'
import type { Attachment, ValidationResult, UploadResult } from './types'

interface UseFileUploadOptions {
  maxAttachments?: number
  maxAttachmentSize?: number
  acceptedFileTypes?: string[]
  onValidate?: (file: File) => Promise<ValidationResult>
  onUpload?: (file: File) => Promise<UploadResult>
  uploadProvider?: 'client' | 'custom'
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback(
    async (file: File): Promise<ValidationResult> => {
      // Custom validation
      if (options.onValidate) {
        return options.onValidate(file)
      }

      // Default validation
      if (options.maxAttachmentSize && file.size > options.maxAttachmentSize) {
        return {
          valid: false,
          error: `File too large (max ${formatBytes(options.maxAttachmentSize)})`,
        }
      }

      if (options.acceptedFileTypes && options.acceptedFileTypes.length > 0) {
        const isAccepted = options.acceptedFileTypes.some((type) => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'))
          }
          return file.type === type || file.name.endsWith(type)
        })

        if (!isAccepted) {
          return {
            valid: false,
            error: `File type not allowed (${file.type})`,
          }
        }
      }

      return { valid: true }
    },
    [options]
  )

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      if (options.uploadProvider === 'custom' && options.onUpload) {
        const result = await options.onUpload(file)
        return result.url
      }

      // Client-side: Create blob URL
      return URL.createObjectURL(file)
    },
    [options]
  )

  const addFile = useCallback(
    async (file: File) => {
      // Check max attachments
      if (options.maxAttachments && attachments.length >= options.maxAttachments) {
        throw new Error(`Maximum ${options.maxAttachments} attachments allowed`)
      }

      // Validate file
      const validation = await validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Create attachment
      const attachment: Attachment = {
        id: Math.random().toString(36).slice(2),
        type: getFileType(file),
        name: file.name,
        size: file.size,
        mimeType: file.type,
        file,
        status: 'pending',
      }

      // Add to list
      setAttachments((prev) => [...prev, attachment])

      // Start upload
      try {
        setIsUploading(true)
        attachment.status = 'uploading'

        const url = await uploadFile(file)

        // Generate thumbnail for images
        let thumbnail: string | undefined
        if (file.type.startsWith('image/')) {
          thumbnail = await generateThumbnail(file)
        }

        // Update attachment with URL
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id ? { ...a, url, thumbnail, status: 'uploaded' as const } : a
          )
        )
      } catch (error) {
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id
              ? {
                  ...a,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : a
          )
        )
      } finally {
        setIsUploading(false)
      }
    },
    [attachments, options, validateFile, uploadFile]
  )

  const removeFile = useCallback((id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id)
      if (attachment?.url && attachment.url.startsWith('blob:')) {
        URL.revokeObjectURL(attachment.url)
      }
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  const clearAll = useCallback(() => {
    attachments.forEach((attachment) => {
      if (attachment.url && attachment.url.startsWith('blob:')) {
        URL.revokeObjectURL(attachment.url)
      }
    })
    setAttachments([])
  }, [attachments])

  return {
    attachments,
    isUploading,
    addFile,
    removeFile,
    clearAll,
  }
}

// Helper functions
function getFileType(file: File): Attachment['type'] {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.startsWith('video/')) return 'video'
  return 'file'
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Max thumbnail size
        const maxSize = 200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL())
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

#### 3. Drag and Drop

```typescript
// use-drag-drop.ts
import { useState, useCallback, useRef, useEffect } from 'react'

interface UseDragDropOptions {
  onDrop: (files: File[]) => void
  disabled?: boolean
}

export function useDragDrop({ onDrop, disabled = false }: UseDragDropOptions) {
  const [isDragging, setIsDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef(0)

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled) return

      dragCounter.current++
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled) return

      dragCounter.current--
      if (dragCounter.current === 0) {
        setIsDragging(false)
      }
    },
    [disabled]
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled) return

      setIsDragging(false)
      dragCounter.current = 0

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files)
        onDrop(files)
      }
    },
    [disabled, onDrop]
  )

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    element.addEventListener('dragenter', handleDragEnter)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)

    return () => {
      element.removeEventListener('dragenter', handleDragEnter)
      element.removeEventListener('dragleave', handleDragLeave)
      element.removeEventListener('dragover', handleDragOver)
      element.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return {
    dropRef,
    isDragging,
  }
}
```

#### 4. Clipboard Paste

```typescript
// use-paste.ts
import { useCallback, useEffect, useRef } from 'react'

interface UsePasteOptions {
  onPaste: (files: File[]) => void
  disabled?: boolean
}

export function usePaste({ onPaste, disabled = false }: UsePasteOptions) {
  const pasteRef = useRef<HTMLElement>(null)

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return

      const items = e.clipboardData?.items
      if (!items) return

      const files: File[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // Handle files (images, etc.)
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault()
        onPaste(files)
      }
    },
    [disabled, onPaste]
  )

  useEffect(() => {
    const element = pasteRef.current
    if (!element) return

    element.addEventListener('paste', handlePaste)

    return () => {
      element.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  return { pasteRef }
}
```

### Dependencies

```json
{
  "dependencies": {
    // Reuse VoiceInput component dependencies
    // No additional dependencies for file handling
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### Browser Support

| Feature                     | Chrome | Firefox | Safari | Edge |
| --------------------------- | ------ | ------- | ------ | ---- |
| **File API**                | 13+    | 3.6+    | 6+     | 12+  |
| **Drag and Drop API**       | 4+     | 3.5+    | 3.1+   | 12+  |
| **Clipboard API**           | 63+    | 63+     | 13.1+  | 79+  |
| **FileReader**              | 7+     | 3.6+    | 6+     | 12+  |
| **Blob URLs**               | 23+    | 4+      | 6+     | 12+  |
| **Voice (from VoiceInput)** | 25+    | ❌      | 14.1+  | 79+  |

**Fallback Strategy:**

- Progressive enhancement for drag-and-drop
- Manual file picker fallback
- Text-only mode for unsupported browsers
- Graceful degradation with clear messaging

## Accessibility

### ARIA Attributes

```tsx
<div role="form" aria-label="Message input with file attachments">
  <textarea
    role="textbox"
    aria-label="Type your message"
    aria-multiline="true"
    aria-required="false"
    aria-invalid={hasError}
    aria-describedby="char-count"
  />

  <div role="group" aria-label="Attachments" aria-live="polite">
    {attachments.map((attachment) => (
      <div
        key={attachment.id}
        role="listitem"
        aria-label={`Attachment: ${attachment.name}, ${formatBytes(attachment.size)}`}
      >
        <button
          aria-label={`Remove ${attachment.name}`}
          onClick={() => removeAttachment(attachment.id)}
        />
      </div>
    ))}
  </div>

  <div role="toolbar" aria-label="Input actions">
    <button aria-label="Record voice message" />
    <button aria-label="Attach image" />
    <button aria-label="Attach file" />
    <button aria-label="Send message" />
  </div>

  <div id="char-count" role="status" aria-live="polite" aria-atomic="true">
    {characterCount} characters
  </div>
</div>
```

### Keyboard Navigation

| Key                  | Action                                    |
| -------------------- | ----------------------------------------- |
| **Tab**              | Navigate between textarea and buttons     |
| **Shift+Tab**        | Navigate backwards                        |
| **Enter**            | Submit message (if submitOnEnter enabled) |
| **Shift+Enter**      | New line or submit (configurable)         |
| **Ctrl/Cmd+V**       | Paste from clipboard (including images)   |
| **Escape**           | Clear focus, cancel voice recording       |
| **Ctrl/Cmd+A**       | Select all text in textarea               |
| **Delete/Backspace** | Remove focused attachment                 |

### Screen Reader Support

- Announce when attachments are added/removed
- Announce upload progress ("Uploading photo.jpg, 50%")
- Announce errors ("Error: File too large")
- Announce character count warnings
- Announce when voice recording starts/stops
- Provide alternative text for all visual elements

### WCAG 2.1 Level AA Compliance

- Color contrast ratio ≥ 4.5:1 for text
- Interactive elements have minimum 44x44px touch target
- Focus indicators visible and clear (3px ring)
- No flashing content
- Keyboard accessible without mouse
- Form labels and instructions clear
- Error messages descriptive and actionable

## Testing Strategy

### Unit Tests

```typescript
describe('MultiModalInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {})
    it('renders all input modes when enabled', () => {})
    it('hides disabled input modes', () => {})
    it('renders different variants correctly', () => {})
    it('renders different sizes correctly', () => {})
  })

  describe('Text Input', () => {
    it('updates value on typing', () => {})
    it('auto-resizes textarea', () => {})
    it('respects minRows and maxRows', () => {})
    it('shows character count when enabled', () => {})
    it('prevents submission when max characters exceeded', () => {})
    it('submits on Enter when enabled', () => {})
    it('creates new line on Shift+Enter', () => {})
  })

  describe('File Upload', () => {
    it('accepts file upload via button click', () => {})
    it('accepts file upload via drag and drop', () => {})
    it('accepts image paste from clipboard', () => {})
    it('validates file size', () => {})
    it('validates file type', () => {})
    it('limits number of attachments', () => {})
    it('generates thumbnails for images', () => {})
    it('shows upload progress', () => {})
    it('handles upload errors', () => {})
    it('allows removing attachments', () => {})
  })

  describe('Voice Input', () => {
    it('starts voice recording on button click', () => {})
    it('appends transcript to text input', () => {})
    it('shows voice visualization during recording', () => {})
    it('handles voice errors gracefully', () => {})
  })

  describe('Submission', () => {
    it('calls onSubmit with text and attachments', () => {})
    it('clears input after submission', () => {})
    it('prevents submission when disabled', () => {})
    it('prevents submission when loading', () => {})
    it('prevents submission when empty', () => {})
  })

  describe('Callbacks', () => {
    it('calls onChange when text changes', () => {})
    it('calls onAttachmentsChange when attachments change', () => {})
    it('calls onFocus and onBlur', () => {})
    it('calls onVoiceStart and onVoiceEnd', () => {})
    it('calls onAttachmentAdd and onAttachmentRemove', () => {})
    it('calls onError when validation fails', () => {})
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {})
    it('supports keyboard navigation', () => {})
    it('announces state changes to screen readers', () => {})
    it('has accessible focus indicators', () => {})
  })
})
```

### Integration Tests

- Test with real file uploads
- Test with different file types (images, PDFs, documents)
- Test drag and drop from file explorer
- Test clipboard paste
- Test voice recording integration
- Test character limit enforcement
- Test error scenarios

### Visual Regression Tests

- Idle state (empty)
- Typing state (with text)
- With attachments
- Uploading state
- Error state
- Disabled/loading state
- Different variants (default, minimal, bordered, floating)
- Different sizes (sm, md, lg)
- Dark mode
- Mobile view

### Manual Testing Checklist

- [ ] File upload via button click
- [ ] Drag and drop files from desktop
- [ ] Paste images from clipboard
- [ ] Multiple file selection
- [ ] File type validation
- [ ] File size validation
- [ ] Upload progress display
- [ ] Remove attachments
- [ ] Voice recording integration
- [ ] Text + voice + files combination
- [ ] Character limit warning and enforcement
- [ ] Submit on Enter
- [ ] New line on Shift+Enter
- [ ] Auto-resize textarea
- [ ] Keyboard-only navigation
- [ ] Screen reader experience
- [ ] Touch interactions on mobile
- [ ] Different file types (images, PDFs, documents, videos)
- [ ] Large file handling
- [ ] Network failure during upload
- [ ] Cancel upload in progress

## Documentation

### API Documentation

Full TypeScript API documentation with:

- Props descriptions and types
- Default values
- Code examples for each prop
- Return types for callbacks
- Error types and codes
- Sub-component API

### Usage Guide

#### Basic Setup

```tsx
import { MultiModalInput } from '@clarity-chat/react'

function App() {
  return (
    <MultiModalInput
      onSubmit={(content) => {
        console.log('Text:', content.text)
        console.log('Files:', content.attachments)
      }}
    />
  )
}
```

#### Advanced Customization

- File validation and upload configuration
- Voice input integration
- Character limits and warnings
- Custom styling and theming
- Controlled vs uncontrolled usage
- Error handling

#### Integration Examples

- Integration with Chat component
- Custom file upload backend
- Whisper API integration for voice
- Image compression before upload
- Multi-language voice support

#### Troubleshooting

**File Upload Issues:**

- File size limits
- Supported file types
- Upload failures
- Browser compatibility

**Voice Issues:**

- Microphone permissions
- Browser support
- Transcription accuracy
- Network failures

**Performance:**

- Large file handling
- Multiple attachments
- Thumbnail generation
- Memory management

## Performance

### Optimizations

1. **Lazy Loading**
   - Load VoiceInput component only when voice button clicked
   - Load file preview components only when needed
   - Defer thumbnail generation until idle

2. **File Handling**
   - Generate thumbnails in Web Worker
   - Use blob URLs instead of data URLs
   - Revoke blob URLs when attachments removed
   - Limit thumbnail size (200x200px max)

3. **Textarea**
   - Debounce auto-resize calculations
   - Use ResizeObserver for efficient updates
   - Optimize character counting

4. **State Management**
   - Use refs for non-visual state
   - Batch state updates
   - Memoize expensive calculations
   - Optimize re-renders with React.memo

5. **Upload**
   - Queue uploads (don't upload all at once)
   - Show progress feedback
   - Cancel pending uploads on unmount
   - Retry failed uploads with exponential backoff

### Bundle Size

**Estimated Bundle Sizes:**

- Base component (text only): ~4kb gzipped
- With file upload: ~6kb gzipped
- With voice integration: ~12kb gzipped (includes VoiceInput)
- Full package: ~14kb gzipped

**Tree-shakeable:**

- Import only needed functionality
- Voice components loaded on demand
- File preview components lazy loaded

## Success Criteria

- ✅ **Supports all input modalities** (text, voice, image, file)
- ✅ **File validation and upload** works reliably across browsers
- ✅ **Drag and drop** intuitive and responsive
- ✅ **Clipboard paste** handles images correctly
- ✅ **Voice integration** seamless with VoiceInput component
- ✅ **Auto-resize textarea** smooth and performant
- ✅ **Character limits** enforced with clear feedback
- ✅ **Meets accessibility standards** (WCAG 2.1 Level AA)
- ✅ **Comprehensive tests** (>90% code coverage)
- ✅ **Complete documentation** with examples
- ✅ **Performance optimized** (<15kb gzipped)
- ✅ **Mobile support** works on iOS and Android
- ✅ **Production ready** handles edge cases and errors

## Future Enhancements

### Phase 2 (Post-Launch)

- Video recording support
- Screen capture/recording
- Drawing/annotation tool
- Code snippet formatting
- Rich text editor integration
- Emoji picker
- GIF search and insert
- Link preview cards

### Phase 3 (Advanced Features)

- Collaborative editing (multiple cursors)
- Mention autocomplete (@user)
- Hashtag autocomplete (#topic)
- Slash commands (/command)
- Template/canned responses
- Message scheduling
- Voice message playback
- Audio waveform for voice messages

## References

### Documentation

- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

### Inspiration

- [Assistant UI Documentation](https://www.assistant-ui.com/docs)
- [shadcn/ui AI](https://www.shadcn.io/ai/)
- [Voice Input Component Spec](./voice-input-component.md)

### Best Practices

- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [File Upload Best Practices](https://web.dev/articles/file-handling)
- [Drag and Drop Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/dragdrop/)
