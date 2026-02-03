'use client'

import { useState, useRef } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Image,
  File,
  X,
  AtSign,
  Hash,
  Smile,
  Code,
  Bold,
  Italic,
  List,
  Link,
  ChevronDown,
  Sparkles,
  Wand2,
  Volume2,
  VolumeX,
  Settings,
  Keyboard,
} from 'lucide-react'

// ============================================================================
// AI TEXTAREA DEMO
// ============================================================================
function AITextareaDemo() {
  const [value, setValue] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(false)
  const suggestion = 'explain how React hooks work with practical examples'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Textarea</CardTitle>
        <CardDescription>
          Textarea with AI-powered autocomplete suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="border rounded-lg overflow-hidden">
              <div className="relative">
                <textarea
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value)
                    setShowSuggestion(e.target.value.length > 5)
                  }}
                  placeholder="Start typing to see AI suggestions..."
                  className="w-full min-h-[100px] p-3 text-sm outline-none resize-none"
                  rows={4}
                />
                {showSuggestion && value && (
                  <div className="absolute inset-0 pointer-events-none p-3">
                    <span className="text-sm text-transparent">{value}</span>
                    <span className="text-sm text-muted-foreground/50">
                      {suggestion}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-2 border-t bg-muted/30">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Suggestions
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Press{' '}
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                      Tab
                    </kbd>{' '}
                    to accept
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {value.length}/4000
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Wand2 className="h-3 w-3" />
              Type a few words and AI will suggest completions based on context
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// VOICE INPUT DEMO
// ============================================================================
function VoiceInputDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Voice Input</CardTitle>
        <CardDescription>
          Speech-to-text input with visual feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recording Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                'relative w-20 h-20 rounded-full flex items-center justify-center transition-all',
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-8 w-8" />
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
                </>
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Status */}
          <div className="text-center">
            {isRecording ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-500">Recording...</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * 20}px`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the microphone to start recording
              </p>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Transcript:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {/* Voice Settings */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Volume2 className="h-4 w-4" />
              Test Audio
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FILE UPLOAD DEMO
// ============================================================================
function FileUploadDemo() {
  const [files, setFiles] = useState<
    { name: string; size: string; type: string }[]
  >([
    { name: 'document.pdf', size: '2.4 MB', type: 'pdf' },
    { name: 'screenshot.png', size: '1.2 MB', type: 'image' },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">File Upload</CardTitle>
        <CardDescription>Drag and drop file attachments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Drop Zone */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Paperclip className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, images, code files up to 10MB
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  {file.type === 'pdf' ? (
                    <File className="h-5 w-5 text-red-500" />
                  ) : (
                    <Image className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Image className="h-4 w-4" />
              Add Image
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <File className="h-4 w-4" />
              Add Document
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Code className="h-4 w-4" />
              Add Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MENTIONS DEMO
// ============================================================================
function MentionsDemo() {
  const [showMentions, setShowMentions] = useState(true)

  const users = [
    { id: '1', name: 'Alice Johnson', avatar: 'AJ', role: 'Developer' },
    { id: '2', name: 'Bob Smith', avatar: 'BS', role: 'Designer' },
    { id: '3', name: 'Carol Williams', avatar: 'CW', role: 'PM' },
  ]

  const channels = [
    { id: '1', name: 'general', members: 24 },
    { id: '2', name: 'engineering', members: 12 },
    { id: '3', name: 'design', members: 8 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mentions & Autocomplete</CardTitle>
        <CardDescription>
          @ mentions for users and # for channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Type @ to mention
                </span>
                <Hash className="h-4 w-4 text-muted-foreground ml-2" />
                <span className="text-xs text-muted-foreground">
                  Type # for channels
                </span>
              </div>
              <textarea
                placeholder="Type @ to mention someone..."
                className="w-full p-3 text-sm outline-none resize-none"
                rows={2}
                onFocus={() => setShowMentions(true)}
              />
            </div>

            {/* Mentions Popup */}
            {showMentions && (
              <div className="absolute top-full left-0 mt-1 w-64 border rounded-lg bg-card shadow-lg overflow-hidden z-10">
                <div className="p-2 border-b bg-muted/50">
                  <span className="text-xs font-medium">Users</span>
                </div>
                <div className="p-1">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {user.avatar}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t bg-muted/50">
                  <span className="text-xs font-medium">Channels</span>
                </div>
                <div className="p-1">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                    >
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {channel.members} members
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mentioned Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <AtSign className="h-3 w-3" />
              Alice Johnson
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Hash className="h-3 w-3" />
              engineering
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RICH TEXT INPUT DEMO
// ============================================================================
function RichTextInputDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rich Text Input</CardTitle>
        <CardDescription>Formatted text with toolbar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          {/* Editor */}
          <div
            className="p-3 min-h-[120px] outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            <p className="text-sm">
              Type your <strong>formatted</strong> message here...
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-2 border-t bg-muted/30">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Markdown supported
              </Badge>
            </div>
            <Button size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// KEYBOARD SHORTCUTS DEMO
// ============================================================================
function KeyboardShortcutsDemo() {
  const shortcuts = [
    { keys: ['⌘', 'Enter'], action: 'Send message' },
    { keys: ['⌘', 'K'], action: 'Open command palette' },
    { keys: ['⌘', '/'], action: 'Show keyboard shortcuts' },
    { keys: ['⌘', 'B'], action: 'Bold text' },
    { keys: ['⌘', 'I'], action: 'Italic text' },
    { keys: ['Esc'], action: 'Cancel / Close' },
    { keys: ['Tab'], action: 'Accept suggestion' },
    { keys: ['↑', '↑'], action: 'Edit last message' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
        <CardDescription>Quick actions for power users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <span className="text-sm">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-1 bg-background border rounded text-xs font-mono"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function InputPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Input"
        description="Advanced inputs, voice, file upload, and mentions"
      />

      <Tabs defaultValue="ai-textarea" className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="ai-textarea">AI Textarea</TabsTrigger>
          <TabsTrigger value="voice">Voice Input</TabsTrigger>
          <TabsTrigger value="files">File Upload</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="rich-text">Rich Text</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-textarea">
          <ComponentSection
            title="AI Textarea"
            description="Smart autocomplete powered by AI"
          >
            <AITextareaDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="voice">
          <ComponentSection
            title="Voice Input"
            description="Speech-to-text capabilities"
          >
            <VoiceInputDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="files">
          <ComponentSection
            title="File Upload"
            description="Drag and drop attachments"
          >
            <FileUploadDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="mentions">
          <ComponentSection title="Mentions" description="@ and # autocomplete">
            <MentionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="rich-text">
          <ComponentSection
            title="Rich Text"
            description="Formatted text input"
          >
            <RichTextInputDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="shortcuts">
          <ComponentSection
            title="Keyboard Shortcuts"
            description="Quick actions reference"
          >
            <KeyboardShortcutsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
