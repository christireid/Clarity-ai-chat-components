/**
 * Input Components Showcase
 *
 * Comprehensive demonstration of all input methods available in Clarity Chat.
 *
 * Features:
 * 1. ChatInput with attachments
 * 2. VoiceInput with waveform visualization
 * 3. FileUpload with drag-drop
 * 4. ImageUpload with preview
 * 5. CodeEditor with syntax highlighting
 * 6. RichTextEditor with formatting
 * 7. EmojiPicker
 * 8. MentionInput with autocomplete
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Image as ImageIcon,
  File,
  Code,
  Type,
  Smile,
  AtSign,
  Paperclip,
  Upload,
  X,
  Check,
  AlertCircle,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  Link as LinkIcon,
} from 'lucide-react'
import {
  ChatInput,
  VoiceInput,
  MentionSystem,
} from '@clarity-chat/react'
import {
  FileUpload,
} from '@clarity-chat/react/internal'
import { Button, Textarea, cn } from '@clarity-chat/primitives'
import type { MessageAttachment } from '@clarity-chat/types'

// Code syntax highlighting
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Sample data
const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '🔥', '⭐', '✨', '💯', '✅', '❌', '⚠️', '💡', '🎉', '🎊',
]

const MENTION_SUGGESTIONS = [
  { id: '1', name: 'Alice Johnson', avatar: '👩', role: 'Designer' },
  { id: '2', name: 'Bob Smith', avatar: '👨', role: 'Developer' },
  { id: '3', name: 'Charlie Brown', avatar: '🧑', role: 'Manager' },
  { id: '4', name: 'Diana Prince', avatar: '👩', role: 'Product Owner' },
  { id: '5', name: 'Ethan Hunt', avatar: '👨', role: 'Engineer' },
]

const CODE_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'rust',
  'go',
  'html',
  'css',
  'json',
  'markdown',
]

interface DemoSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: 'chat-input',
    title: 'Chat Input with Attachments',
    description: 'Full-featured chat input with file attachments and inline actions',
    icon: <Type className="w-5 h-5" />,
  },
  {
    id: 'voice-input',
    title: 'Voice Input with Waveform',
    description: 'Voice recording with real-time audio visualization',
    icon: <Mic className="w-5 h-5" />,
  },
  {
    id: 'file-upload',
    title: 'File Upload with Drag-Drop',
    description: 'Multi-file upload with drag-and-drop support',
    icon: <File className="w-5 h-5" />,
  },
  {
    id: 'image-upload',
    title: 'Image Upload with Preview',
    description: 'Image upload with instant preview and crop options',
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    id: 'code-editor',
    title: 'Code Editor with Syntax Highlighting',
    description: 'Multi-language code editor with syntax highlighting',
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: 'rich-text',
    title: 'Rich Text Editor',
    description: 'WYSIWYG editor with formatting toolbar',
    icon: <Bold className="w-5 h-5" />,
  },
  {
    id: 'emoji-picker',
    title: 'Emoji Picker',
    description: 'Searchable emoji picker with categories',
    icon: <Smile className="w-5 h-5" />,
  },
  {
    id: 'mention-input',
    title: 'Mention Input with Autocomplete',
    description: '@mention support with fuzzy search',
    icon: <AtSign className="w-5 h-5" />,
  },
]

export function InputComponentsShowcase() {
  const [activeSection, setActiveSection] = useState<string>('chat-input')
  const [results, setResults] = useState<string[]>([])

  const addResult = useCallback((message: string) => {
    setResults((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return (
    <div className="input-showcase">
      {/* Header */}
      <div className="showcase-header">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Input Components Showcase
        </h1>
        <p className="text-muted-foreground mt-2">
          Interactive demonstrations of all input methods and components
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="showcase-tabs">
        <div className="tabs-scroll">
          {DEMO_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'tab-button',
                activeSection === section.id && 'active'
              )}
            >
              <span className="tab-icon">{section.icon}</span>
              <span className="tab-label">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="showcase-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="demo-container"
          >
            {/* Section Header */}
            <div className="demo-header">
              <div className="demo-header-content">
                {DEMO_SECTIONS.find((s) => s.id === activeSection)?.icon}
                <div>
                  <h2 className="text-2xl font-bold">
                    {DEMO_SECTIONS.find((s) => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {DEMO_SECTIONS.find((s) => s.id === activeSection)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="demo-body">
              {activeSection === 'chat-input' && (
                <ChatInputDemo addResult={addResult} />
              )}
              {activeSection === 'voice-input' && (
                <VoiceInputDemo addResult={addResult} />
              )}
              {activeSection === 'file-upload' && (
                <FileUploadDemo addResult={addResult} />
              )}
              {activeSection === 'image-upload' && (
                <ImageUploadDemo addResult={addResult} />
              )}
              {activeSection === 'code-editor' && (
                <CodeEditorDemo addResult={addResult} />
              )}
              {activeSection === 'rich-text' && (
                <RichTextEditorDemo addResult={addResult} />
              )}
              {activeSection === 'emoji-picker' && (
                <EmojiPickerDemo addResult={addResult} />
              )}
              {activeSection === 'mention-input' && (
                <MentionInputDemo addResult={addResult} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Results Log */}
        {results.length > 0 && (
          <div className="results-log">
            <div className="results-header">
              <h3 className="text-sm font-semibold">Activity Log</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResults}
                className="h-8 px-3"
              >
                Clear
              </Button>
            </div>
            <div className="results-content">
              {results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="result-item"
                >
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm">{result}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Demo Components

function ChatInputDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      addResult(`Message sent: "${message}" with ${attachments.length} attachment(s)`)
      setMessage('')
      setAttachments([])
    }
  }

  const handleFileAdd = async (files: File[]): Promise<MessageAttachment[]> => {
    const newAttachments: MessageAttachment[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
    addResult(`Added ${files.length} file(s)`)
    return newAttachments
  }

  return (
    <div className="demo-chat-input">
      <div className="demo-description">
        <p>A fully-featured chat input with support for:</p>
        <ul>
          <li>Multi-line text input with auto-resize</li>
          <li>File attachments with preview</li>
          <li>Keyboard shortcuts (Enter to send, Shift+Enter for new line)</li>
          <li>Character counter with visual feedback</li>
        </ul>
      </div>

      <div className="input-demo-area">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="attachments-preview">
            {attachments.map((att) => (
              <div key={att.id} className="attachment-item">
                {att.type === 'image' && att.url ? (
                  <img src={att.url} alt={att.name} className="attachment-thumb" />
                ) : (
                  <File className="w-8 h-8 text-muted-foreground" />
                )}
                <div className="attachment-info">
                  <p className="text-sm font-medium truncate">{att.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(att.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="input-wrapper">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here... (Shift+Enter for new line)"
            autoResize
            maxRows={8}
            className="chat-textarea"
          />
          <div className="input-actions">
            <FileUpload onUpload={handleFileAdd} maxFiles={5}>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Paperclip className="w-4 h-4" />
              </Button>
            </FileUpload>
            <Button
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
              className="send-button"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>

        <div className="input-hint">
          <p className="text-xs text-muted-foreground">
            Press <kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for new line • Attach files
          </p>
        </div>
      </div>
    </div>
  )
}

function VoiceInputDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [transcript, setTranscript] = useState('')

  const handleTranscript = (text: string) => {
    setTranscript(text)
    addResult(`Voice transcript: "${text}"`)
  }

  return (
    <div className="demo-voice-input">
      <div className="demo-description">
        <p>Voice input with real-time transcription featuring:</p>
        <ul>
          <li>Real-time audio waveform visualization</li>
          <li>Speech-to-text transcription</li>
          <li>Noise cancellation and echo reduction</li>
          <li>Recording state management</li>
        </ul>
      </div>

      <div className="voice-demo-area">
        <VoiceInput
          onTranscript={handleTranscript}
          size="lg"
          showWaveform
          showInterim
        />

        {transcript && (
          <div className="transcript-display">
            <h4 className="text-sm font-semibold mb-2">Transcript:</h4>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        <div className="feature-list">
          <div className="feature-item">
            <Mic className="w-5 h-5 text-primary" />
            <span>Click to start/stop recording</span>
          </div>
          <div className="feature-item">
            <Check className="w-5 h-5 text-green-500" />
            <span>Automatic punctuation and formatting</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileUploadDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    setUploading(true)
    addResult(`Uploading ${files.length} file(s)...`)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUploadedFiles((prev) => [...prev, ...files])
    setUploading(false)
    addResult(`Successfully uploaded ${files.length} file(s)`)

    return files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      type: 'file',
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }))
  }

  return (
    <div className="demo-file-upload">
      <div className="demo-description">
        <p>Advanced file upload with:</p>
        <ul>
          <li>Drag-and-drop support</li>
          <li>Multiple file selection</li>
          <li>File type validation</li>
          <li>Size limits and progress indication</li>
        </ul>
      </div>

      <FileUpload
        onUpload={handleUpload}
        maxFiles={10}
        maxFileSize={10 * 1024 * 1024}
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
          'application/pdf': ['.pdf'],
          'text/*': ['.txt', '.md'],
        }}
      >
        <div className="upload-dropzone">
          <Upload className="w-12 h-12 text-primary mb-4" />
          <p className="text-lg font-semibold mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-muted-foreground">
            Supports images, PDFs, and text files up to 10MB
          </p>
        </div>
      </FileUpload>

      {uploading && (
        <div className="upload-progress">
          <div className="spinner" />
          <span>Uploading...</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-list">
          <h4 className="text-sm font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file, i) => (
            <div key={i} className="file-list-item">
              <File className="w-5 h-5 text-primary" />
              <div className="file-info">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {file.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ImageUploadDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [images, setImages] = useState<Array<{ url: string; name: string }>>([])

  const handleImageUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))

    const newImages = imageFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }))

    setImages((prev) => [...prev, ...newImages])
    addResult(`Added ${imageFiles.length} image(s)`)

    return imageFiles.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      type: 'image',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }))
  }

  return (
    <div className="demo-image-upload">
      <div className="demo-description">
        <p>Image upload with preview featuring:</p>
        <ul>
          <li>Instant image preview thumbnails</li>
          <li>Grid layout for multiple images</li>
          <li>Image format validation (PNG, JPG, WebP)</li>
          <li>Optimized for photos and screenshots</li>
        </ul>
      </div>

      <FileUpload
        onUpload={handleImageUpload}
        maxFiles={12}
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
      >
        <div className="image-upload-zone">
          <ImageIcon className="w-12 h-12 text-primary mb-4" />
          <p className="text-lg font-semibold mb-2">Upload Images</p>
          <p className="text-sm text-muted-foreground">PNG, JPG, WebP, or GIF</p>
        </div>
      </FileUpload>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="image-preview-item"
            >
              <img src={img.url} alt={img.name} className="preview-img" />
              <div className="image-overlay">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="image-name">{img.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function CodeEditorDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [code, setCode] = useState('// Write your code here\nfunction hello() {\n  console.log("Hello, World!");\n}')
  const [language, setLanguage] = useState('typescript')

  return (
    <div className="demo-code-editor">
      <div className="demo-description">
        <p>Code editor with syntax highlighting:</p>
        <ul>
          <li>Multi-language support (TypeScript, Python, Java, etc.)</li>
          <li>Syntax highlighting with Prism</li>
          <li>Line numbers and code formatting</li>
          <li>Copy to clipboard functionality</li>
        </ul>
      </div>

      <div className="code-editor-controls">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          {CODE_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(code)
            addResult('Code copied to clipboard')
          }}
        >
          <File className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>

      <div className="code-editor-wrapper">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code..."
          className="code-textarea"
          rows={12}
          spellCheck={false}
        />
      </div>

      <div className="code-preview">
        <h4 className="text-sm font-semibold mb-2">Preview with Syntax Highlighting:</h4>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

function RichTextEditorDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [content, setContent] = useState('')
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)

  const applyFormat = (format: string) => {
    if (!selection) return

    const before = content.slice(0, selection.start)
    const selected = content.slice(selection.start, selection.end)
    const after = content.slice(selection.end)

    let formatted = selected
    switch (format) {
      case 'bold':
        formatted = `**${selected}**`
        break
      case 'italic':
        formatted = `*${selected}*`
        break
      case 'underline':
        formatted = `__${selected}__`
        break
      case 'link':
        formatted = `[${selected}](url)`
        break
    }

    setContent(before + formatted + after)
    addResult(`Applied ${format} formatting`)
  }

  return (
    <div className="demo-rich-text">
      <div className="demo-description">
        <p>Rich text editor with formatting toolbar:</p>
        <ul>
          <li>Text formatting (bold, italic, underline)</li>
          <li>Lists and alignment controls</li>
          <li>Link insertion</li>
          <li>Markdown output support</li>
        </ul>
      </div>

      <div className="rich-text-toolbar">
        <div className="toolbar-group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button variant="ghost" size="sm" title="Bullet List">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="toolbar-group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('link')}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={(e: any) => {
          setSelection({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
          })
        }}
        placeholder="Start typing... Select text to format"
        className="rich-text-area"
        rows={10}
      />

      {content && (
        <div className="rich-text-preview">
          <h4 className="text-sm font-semibold mb-2">Preview:</h4>
          <div className="preview-content">{content}</div>
        </div>
      )}
    </div>
  )
}

function EmojiPickerDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEmojis = searchQuery
    ? EMOJIS.filter((emoji) => emoji.includes(searchQuery))
    : EMOJIS

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmojis((prev) => [...prev, emoji])
    addResult(`Selected emoji: ${emoji}`)
  }

  return (
    <div className="demo-emoji-picker">
      <div className="demo-description">
        <p>Emoji picker with search:</p>
        <ul>
          <li>Grid layout of popular emojis</li>
          <li>Search and filter functionality</li>
          <li>Recently used tracking</li>
          <li>Category organization</li>
        </ul>
      </div>

      <div className="emoji-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search emojis..."
          className="search-input"
        />
      </div>

      <div className="emoji-grid">
        {filteredEmojis.map((emoji, i) => (
          <motion.button
            key={i}
            onClick={() => handleEmojiSelect(emoji)}
            className="emoji-button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {selectedEmojis.length > 0 && (
        <div className="selected-emojis">
          <h4 className="text-sm font-semibold mb-2">Selected:</h4>
          <div className="emoji-list">
            {selectedEmojis.map((emoji, i) => (
              <span key={i} className="selected-emoji">
                {emoji}
              </span>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(selectedEmojis.join(' '))
              addResult('Copied emojis to clipboard')
            }}
            className="mt-3"
          >
            Copy All
          </Button>
        </div>
      )}
    </div>
  )
}

function MentionInputDemo({ addResult }: { addResult: (msg: string) => void }) {
  const [text, setText] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionedUsers, setMentionedUsers] = useState<typeof MENTION_SUGGESTIONS>([])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setText(value)

    // Check for @ mention
    const cursorPos = e.target.selectionStart
    const beforeCursor = value.slice(0, cursorPos)
    const match = beforeCursor.match(/@(\w*)$/)

    if (match) {
      setShowMentions(true)
      setMentionQuery(match[1])
    } else {
      setShowMentions(false)
      setMentionQuery('')
    }
  }

  const handleMentionSelect = (user: typeof MENTION_SUGGESTIONS[0]) => {
    const cursorPos = text.length
    const beforeMention = text.slice(0, cursorPos).replace(/@\w*$/, '')
    const afterMention = text.slice(cursorPos)

    setText(`${beforeMention}@${user.name} ${afterMention}`)
    setMentionedUsers((prev) => [...prev, user])
    setShowMentions(false)
    addResult(`Mentioned: @${user.name}`)
  }

  const filteredSuggestions = mentionQuery
    ? MENTION_SUGGESTIONS.filter((user) =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
    : MENTION_SUGGESTIONS

  return (
    <div className="demo-mention-input">
      <div className="demo-description">
        <p>Mention input with autocomplete:</p>
        <ul>
          <li>@mention support with fuzzy search</li>
          <li>User suggestions with avatars and roles</li>
          <li>Keyboard navigation (up/down arrows)</li>
          <li>Auto-completion on Enter or Tab</li>
        </ul>
      </div>

      <div className="mention-input-wrapper">
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type @ to mention someone..."
          className="mention-textarea"
          rows={6}
        />

        <AnimatePresence>
          {showMentions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mention-suggestions"
            >
              <div className="suggestions-header">
                <AtSign className="w-4 h-4" />
                <span>Mention</span>
                {mentionQuery && <span className="query-badge">@{mentionQuery}</span>}
              </div>
              <div className="suggestions-list">
                {filteredSuggestions.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleMentionSelect(user)}
                    className="suggestion-item"
                  >
                    <span className="user-avatar">{user.avatar}</span>
                    <div className="user-info">
                      <p className="user-name">{user.name}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mention-hint">
          <AtSign className="w-4 h-4" />
          <span>Type @ to mention team members</span>
        </div>
      </div>

      {mentionedUsers.length > 0 && (
        <div className="mentioned-users">
          <h4 className="text-sm font-semibold mb-2">Mentioned:</h4>
          <div className="user-chips">
            {mentionedUsers.map((user, i) => (
              <div key={i} className="user-chip">
                <span>{user.avatar}</span>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
