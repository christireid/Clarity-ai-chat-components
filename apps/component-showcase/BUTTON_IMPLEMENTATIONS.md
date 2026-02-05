# Button Functionality Implementation Guide

## Overview
This document details all button functionalities implemented in `/apps/component-showcase/app/chat/page.tsx`.

## Summary of Implementations

### 1. Settings Button
- **Location**: Chat header
- **Functionality**: Opens settings modal with configuration options
- **State**: `showSettings`, `settings`
- **Features**:
  - Model selection (Claude 3.5 Sonnet, Claude 3 Opus, GPT-4, GPT-4 Turbo)
  - Temperature slider (0-2)
  - Max tokens slider (512-8192)
  - Streaming toggle
  - Tools enabled toggle
  - Memory toggle
  - Auto-save toggle

### 2. Copy Buttons
- **Location**: Message actions (assistant messages)
- **Functionality**: Copy message content to clipboard
- **State**: `copiedMessageId`
- **Features**:
  - Visual feedback (checkmark for 2 seconds)
  - Uses `navigator.clipboard.writeText()`
  - Toast notification on error

### 3. Regenerate Button
- **Location**: Message actions (assistant messages)
- **Functionality**: Regenerate AI response
- **Implementation**:
  - Finds message index
  - Removes all messages after it
  - Re-sends the user prompt
  - Triggers new AI response

### 4. Delete Buttons
- **Location**: Message actions (all messages)
- **Functionality**: Remove message from conversation
- **Implementation**:
  - Filters message from state
  - Immediate removal
  - No confirmation (can be added)

### 5. Edit Buttons
- **Location**: Message actions (all messages)
- **Functionality**: Enable inline message editing
- **State**: `editingMessageId`, `editingContent`
- **Features**:
  - Inline textarea editor
  - Save/Cancel buttons
  - Updates message content in state

### 6. Menu Buttons (Dropdown)
- **Location**: Message actions (assistant messages)
- **Functionality**: Additional message options
- **Options**:
  - Edit
  - Pin/Unpin
  - Share
  - Delete

### 7. Tool Execution Buttons
- **Location**: Available Tools sidebar
- **Functionality**: Manually trigger tool execution
- **Implementation**:
  - Clickable tool cards
  - Calls `simulateToolExecution(toolName)`
  - Shows loading state
  - Displays completion with duration

### 8. File Upload Button
- **Location**: Input area (paperclip icon)
- **Functionality**: Open file picker for uploads
- **State**: `uploadedFiles`, `fileInputRef`
- **Features**:
  - Hidden `<input type="file" multiple />`
  - File preview chips
  - Remove individual files
  - Auto-adds file names to input

### 9. Voice Input Button
- **Location**: Input area (microphone icon)
- **Functionality**: Voice-to-text input
- **State**: `isRecording`
- **Features**:
  - Toggle recording state
  - Visual feedback (pulsing red, square icon)
  - Simulated transcription
  - Ready for Web Speech API integration

### 10. Export Chat Button
- **Location**: Quick Actions sidebar
- **Functionality**: Download conversation as JSON
- **State**: `showExportDialog`
- **Features**:
  - Preview dialog showing what's included
  - Downloads JSON file with timestamp
  - Includes messages, token usage, metadata

### 11. Share Button
- **Location**: Quick Actions sidebar & message dropdown
- **Functionality**: Share conversation
- **Implementation**:
  - Uses Web Share API when available
  - Falls back to clipboard copy
  - Generates shareable URL

### 12. Archive Button
- **Location**: Quick Actions sidebar
- **Functionality**: Archive current conversation
- **Implementation**:
  - Logs archive data to console
  - Shows confirmation alert
  - Ready for database integration

### 13. Branch Conversation Button
- **Location**: Quick Actions sidebar
- **Functionality**: Create conversation branch
- **Implementation**:
  - Creates new branch from current state
  - Logs branch data
  - Shows confirmation

### 14. Pin/Unpin Button
- **Location**: Message dropdown menu
- **Functionality**: Pin important messages
- **State**: `isPinned` on message object
- **Features**:
  - Toggle pin state
  - Visual pin indicator
  - Persistent in message state

### 15. Thumbs Up/Down Buttons
- **Location**: Message actions (assistant messages)
- **Functionality**: Provide feedback on AI responses
- **Implementation**: Click handlers ready for feedback API

### 16. Run Code Button
- **Location**: Code & Terminal demo
- **Functionality**: Execute code in terminal
- **Features**:
  - Simulated execution
  - Animated terminal output
  - Loading state
  - Completion status

### 17. Copy Code Button
- **Location**: Code & Terminal demo
- **Functionality**: Copy code to clipboard
- **State**: `copied`
- **Features**:
  - Clipboard API
  - Visual feedback
  - "Copied!" state for 2 seconds

### 18. Retry Button
- **Location**: Error states demo
- **Functionality**: Retry failed operations
- **State**: `retrying`
- **Features**:
  - Loading spinner
  - Disabled during retry
  - Auto-reset after 2 seconds

### 19. Approve/Reject Buttons
- **Location**: Tool Approval demo
- **Functionality**: Human-in-the-loop approvals
- **State**: `status` (pending/approved/rejected)
- **Features**:
  - Visual state changes
  - Color-coded feedback
  - Reset functionality

### 20. Date Picker Buttons
- **Location**: Date Picker demo
- **Functionality**: Select dates
- **State**: `selectedDate`
- **Features**:
  - Month navigation
  - Date selection
  - Active date highlighting

## Code Snippets

### State Setup
```typescript
// Add these to AdvancedAgenticChatDemo component
const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
const [editingContent, setEditingContent] = useState('')
const [showSettings, setShowSettings] = useState(false)
const [isRecording, setIsRecording] = useState(false)
const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
const [showExportDialog, setShowExportDialog] = useState(false)
const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
const [settings, setSettings] = useState<SettingsState>({
  model: 'claude-3.5-sonnet',
  temperature: 0.7,
  maxTokens: 4096,
  streamingEnabled: true,
  toolsEnabled: true,
  memoryEnabled: true,
  autoSave: true,
})
const fileInputRef = useRef<HTMLInputElement>(null)
```

### Handler Functions
```typescript
// Copy message
const handleCopyMessage = async (content: string, messageId: string) => {
  try {
    await navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Delete message
const handleDeleteMessage = (messageId: string) => {
  setMessages((prev) => prev.filter((m) => m.id !== messageId))
}

// Edit message
const handleEditMessage = (messageId: string, content: string) => {
  setEditingMessageId(messageId)
  setEditingContent(content)
}

const handleSaveEdit = () => {
  if (editingMessageId) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingMessageId ? { ...m, content: editingContent } : m
      )
    )
    setEditingMessageId(null)
    setEditingContent('')
  }
}

const handleCancelEdit = () => {
  setEditingMessageId(null)
  setEditingContent('')
}

// Regenerate response
const handleRegenerateResponse = async (messageId: string) => {
  const messageIndex = messages.findIndex((m) => m.id === messageId)
  if (messageIndex === -1) return

  setMessages((prev) => prev.slice(0, messageIndex))

  const userMessage = messages[messageIndex - 1]
  if (userMessage && userMessage.role === 'user') {
    setInput(userMessage.content)
    setTimeout(() => handleSend(), 100)
  }
}

// Pin message
const handlePinMessage = (messageId: string) => {
  setMessages((prev) =>
    prev.map((m) =>
      m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
    )
  )
}

// File upload
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files
  if (files) {
    const fileArray = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...fileArray])
    const fileNames = fileArray.map(f => f.name).join(', ')
    setInput((prev) => prev + `\n\nUploaded files: ${fileNames}`)
  }
}

// Voice input
const handleVoiceInput = () => {
  setIsRecording(!isRecording)

  if (!isRecording) {
    setTimeout(() => {
      setInput('This is a simulated voice input.')
      setIsRecording(false)
    }, 2000)
  }
}

// Export chat
const handleExportChat = () => {
  const chatData = {
    messages,
    timestamp: new Date().toISOString(),
    tokenUsage,
  }

  const blob = new Blob([JSON.stringify(chatData, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chat-export-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  setShowExportDialog(false)
}

// Share chat
const handleShareChat = async () => {
  const shareUrl = `${window.location.origin}/chat/shared/${Date.now()}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Chat Conversation',
        text: 'Check out this AI conversation',
        url: shareUrl,
      })
    } catch (err) {
      console.error('Share failed:', err)
    }
  } else {
    await navigator.clipboard.writeText(shareUrl)
    alert('Share link copied to clipboard!')
  }
}

// Archive chat
const handleArchiveChat = () => {
  const archiveData = {
    messages,
    timestamp: new Date().toISOString(),
    archived: true,
  }
  console.log('Archived chat:', archiveData)
  alert('Chat archived successfully!')
}

// Branch conversation
const handleBranchConversation = () => {
  const branchData = {
    parentId: 'current-chat',
    messages: [...messages],
    timestamp: new Date().toISOString(),
  }
  console.log('Created conversation branch:', branchData)
  alert('Created a new conversation branch!')
}

// Run tool
const handleRunTool = async (toolName: string) => {
  await simulateToolExecution(toolName)
}
```

### UI Components

#### Settings Dialog
```tsx
<Dialog open={showSettings} onOpenChange={setShowSettings}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Chat Settings</DialogTitle>
      <DialogDescription>Configure your chat experience</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Model selection */}
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          value={settings.model}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, model: value }))
          }
        >
          <SelectTrigger id="model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Temperature slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">Temperature</Label>
          <span className="text-sm text-muted-foreground">
            {settings.temperature}
          </span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={2}
          step={0.1}
          value={[settings.temperature]}
          onValueChange={([value]) =>
            setSettings((prev) => ({ ...prev, temperature: value }))
          }
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center justify-between">
        <Label htmlFor="streaming">Streaming</Label>
        <Switch
          id="streaming"
          checked={settings.streamingEnabled}
          onCheckedChange={(checked) =>
            setSettings((prev) => ({ ...prev, streamingEnabled: checked }))
          }
        />
      </div>
    </div>
  </DialogContent>
</Dialog>
```

#### Message Actions
```tsx
{msg.role === 'assistant' && editingMessageId !== msg.id && (
  <div className="flex items-center gap-1">
    <Tooltip content="Copy">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleCopyMessage(msg.content, msg.id)}
      >
        {copiedMessageId === msg.id ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </Tooltip>
    <Tooltip content="Regenerate">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleRegenerateResponse(msg.id)}
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </Tooltip>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEditMessage(msg.id, msg.content)}>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePinMessage(msg.id)}>
          {msg.isPinned ? (
            <>
              <PinOff className="h-4 w-4 mr-2" />
              Unpin
            </>
          ) : (
            <>
              <Pin className="h-4 w-4 mr-2" />
              Pin
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteMessage(msg.id)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)}
```

#### File Upload
```tsx
<input
  ref={fileInputRef}
  type="file"
  multiple
  onChange={handleFileUpload}
  className="hidden"
  accept="*/*"
/>

<Tooltip content="Attach files">
  <Button
    variant="ghost"
    size="icon"
    className="h-10 w-10 shrink-0"
    onClick={() => fileInputRef.current?.click()}
  >
    <Paperclip className="h-5 w-5" />
  </Button>
</Tooltip>
```

#### Voice Input
```tsx
<Tooltip content={isRecording ? 'Stop recording' : 'Voice input'}>
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      'h-10 w-10 shrink-0',
      isRecording && 'text-red-500 animate-pulse'
    )}
    onClick={handleVoiceInput}
  >
    {isRecording ? (
      <Square className="h-5 w-5" />
    ) : (
      <Mic className="h-5 w-5" />
    )}
  </Button>
</Tooltip>
```

#### Quick Actions
```tsx
<Button
  variant="outline"
  size="sm"
  className="w-full justify-start gap-2"
  onClick={() => setShowExportDialog(true)}
>
  <Download className="h-4 w-4" />
  Export Chat
</Button>

<Button
  variant="outline"
  size="sm"
  className="w-full justify-start gap-2"
  onClick={handleBranchConversation}
>
  <GitBranch className="h-4 w-4" />
  Branch Conversation
</Button>

<Button
  variant="outline"
  size="sm"
  className="w-full justify-start gap-2"
  onClick={handleShareChat}
>
  <Share className="h-4 w-4" />
  Share
</Button>

<Button
  variant="outline"
  size="sm"
  className="w-full justify-start gap-2"
  onClick={handleArchiveChat}
>
  <Archive className="h-4 w-4" />
  Archive
</Button>
```

## Required Imports

Add these to the imports section:

```typescript
import {
  // ... existing imports
  Label,
  Slider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@clarity-chat/primitives'

import {
  // ... existing icons
  Save,
} from 'lucide-react'
```

## Interface Updates

```typescript
interface SettingsState {
  model: string
  temperature: number
  maxTokens: number
  streamingEnabled: boolean
  toolsEnabled: boolean
  memoryEnabled: boolean
  autoSave: boolean
}
```

## Testing Checklist

- [ ] Settings button opens modal
- [ ] Settings can be changed and saved
- [ ] Copy button copies text to clipboard
- [ ] Copy button shows checkmark feedback
- [ ] Delete button removes messages
- [ ] Edit button enables inline editing
- [ ] Save/Cancel edit buttons work
- [ ] Regenerate button re-sends prompt
- [ ] Dropdown menu opens and closes
- [ ] Pin/Unpin toggles message state
- [ ] File upload button opens file picker
- [ ] Files can be attached and removed
- [ ] Voice input button toggles recording
- [ ] Export chat downloads JSON file
- [ ] Share button uses Web Share API or clipboard
- [ ] Archive button logs data
- [ ] Branch button creates new branch
- [ ] Tool execution buttons trigger simulation
- [ ] All buttons show proper loading states
- [ ] All buttons have proper disabled states

## Next Steps

1. Integrate with real backend APIs
2. Add confirmation dialogs for destructive actions
3. Implement undo/redo functionality
4. Add keyboard shortcuts for common actions
5. Implement real Web Speech API for voice input
6. Add file preview before sending
7. Implement conversation branching UI
8. Add analytics tracking for button clicks
