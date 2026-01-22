# Chat Components

Core chat interface components for building AI chat applications.

## Overview

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `ClarityChat` | All-in-one chat | ⭐ Drop-in ready |
| `ChatWindow` | Mid-level chat UI | ⭐⭐ Customizable |
| `ChatInput` | Message input | ⭐⭐ Feature-rich |
| `ChatLayout` | Layout container | ⭐⭐ Flexible |
| `FloatingChatWidget` | Floating widget | ⭐ Easy integration |
| `MobileChatOptimized` | Mobile-first chat | ⭐⭐ Responsive |
| `VirtualizedMessageList` | Performance list | ⭐⭐⭐ Large datasets |

---

## ClarityChat

**The simplest way to add AI chat to your app. All-in-one component with everything built-in.**

### Props

```typescript
interface ClarityChatProps {
  // Required
  api: string                                    // API endpoint URL

  // Optional
  chatId?: string                                // Chat session ID
  className?: string                             // Custom CSS class

  // Header
  header?: {
    show?: boolean
    title?: string
    subtitle?: string
    actions?: React.ReactNode
    showMessageCount?: boolean
  }

  // Message Actions
  messageActions?: {
    onCopy?: (id: string, content: string) => void
    onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
    onEdit?: (messageId: string) => void
    onRegenerate?: (messageId: string) => void
    onDelete?: (messageId: string) => void
  }

  // Prompts
  prompts?: {
    starterPrompts?: Array<{ text: string; category?: string }>
    enableSuggestions?: boolean
    maxSuggestions?: number
  }

  // Rate Limiting
  rateLimiting?: {
    enable?: boolean
    maxConcurrentRequests?: number
    maxQueueSize?: number
    showQueueStatus?: boolean
    onRequestQueued?: (position: number, estimatedWaitMs: number) => void
    onRateLimited?: (resetAt: number) => void
    onQueueFull?: () => void
  }

  // Features
  memory?: {
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  }
  autoScroll?: boolean
  showTokenCounter?: boolean
  showNetworkStatus?: boolean
  enableMessageOperations?: boolean

  // Callbacks
  onError?: (error: Error) => void
  onExport?: () => void
  onClear?: () => void
}
```

### Examples

#### Minimal Setup

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

#### With Memory

```tsx
function ChatWithMemory() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'vector-store',
      }}
    />
  )
}
```

#### Full Featured

```tsx
function AdvancedChat() {
  return (
    <ClarityChat
      api="/api/chat"
      chatId="session-123"
      header={{
        show: true,
        title: "AI Assistant",
        subtitle: "Powered by GPT-4",
        showMessageCount: true,
      }}
      messageActions={{
        onCopy: (id, content) => {
          navigator.clipboard.writeText(content)
          toast.success('Copied!')
        },
        onFeedback: (id, type, comment) => {
          trackFeedback(id, type, comment)
        },
        onRegenerate: (id) => {
          console.log('Regenerating message:', id)
        },
      }}
      prompts={{
        starterPrompts: [
          { text: 'What can you help me with?', category: 'General' },
          { text: 'Explain quantum computing', category: 'Science' },
          { text: 'Write a Python function', category: 'Code' },
        ],
        enableSuggestions: true,
        maxSuggestions: 3,
      }}
      rateLimiting={{
        enable: true,
        maxConcurrentRequests: 3,
        showQueueStatus: true,
        onRateLimited: (resetAt) => {
          toast.warning(`Rate limited. Resets at ${new Date(resetAt).toLocaleTimeString()}`)
        },
      }}
      showTokenCounter
      showNetworkStatus
      enableMessageOperations
      autoScroll
      onError={(error) => {
        console.error('Chat error:', error)
        sendToErrorTracking(error)
      }}
    />
  )
}
```

#### Ultra-Simple Preset

```tsx
import { chat } from '@clarity-chat/react'

function App() {
  // One-liner that returns JSX!
  return chat('/api/chat')
}
```

#### Custom Theme

```tsx
function ThemedChat() {
  return (
    <ClarityChat
      api="/api/chat"
      theme="ocean"  // Built-in theme
      className="my-custom-chat"
    />
  )
}
```

### When to Use

- **Use ClarityChat when:** You want the fastest way to add chat with all features
- **Complexity:** ⭐ Drop-in ready
- **Alternatives:** `ChatWindow` for more control, `ChatInput` + hooks for full customization

---

## ChatWindow

**Mid-level chat UI component. More customizable than ClarityChat while still being easy to use.**

### Props

```typescript
interface ChatWindowProps {
  // Core
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (message: string) => void

  // Header
  showHeader?: boolean
  title?: string
  subtitle?: string
  headerActions?: React.ReactNode

  // Input
  placeholder?: string
  inputDisabled?: boolean
  maxLength?: number
  showTokenCounter?: boolean

  // Message Display
  renderMessage?: (message: Message) => React.ReactNode
  showTimestamps?: boolean
  showAvatars?: boolean
  groupMessagesByTime?: boolean

  // Features
  enableCopy?: boolean
  enableFeedback?: boolean
  enableRegenerate?: boolean
  starterPrompts?: Array<{ text: string }>

  // Layout
  height?: string | number
  className?: string

  // Callbacks
  onMessageAction?: (action: MessageAction) => void
  onError?: (error: Error) => void
}
```

### Examples

#### Basic ChatWindow

```tsx
import { ChatWindow } from '@clarity-chat/react/components'
import { useChat } from '@clarity-chat/react/hooks'

function MyChat() {
  const { messages, isLoading, append } = useChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={append}
      showHeader
      title="Support Chat"
    />
  )
}
```

#### Custom Message Rendering

```tsx
function CustomChatWindow() {
  const { messages, append } = useChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={append}
      renderMessage={(message) => (
        <div className="my-custom-message">
          <Avatar user={message.role} />
          <div className="content">
            {message.content}
          </div>
          {message.metadata && (
            <div className="metadata">
              {JSON.stringify(message.metadata)}
            </div>
          )}
        </div>
      )}
    />
  )
}
```

#### With Starter Prompts

```tsx
function ChatWithPrompts() {
  const { messages, append } = useChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={append}
      starterPrompts={[
        { text: 'Tell me a joke' },
        { text: 'Explain AI in simple terms' },
        { text: 'Help me write an email' },
      ]}
      placeholder="Ask me anything..."
    />
  )
}
```

#### Fixed Height Container

```tsx
function FixedHeightChat() {
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={append}
      height={600}  // 600px tall
      className="border rounded-lg shadow-lg"
    />
  )
}
```

### When to Use

- **Use ChatWindow when:** You need more control than ClarityChat but don't want to build from scratch
- **Complexity:** ⭐⭐ Customizable
- **Alternatives:** `ClarityChat` for simplicity, custom layout with hooks for full control

---

## ChatInput

**Feature-rich message input component with attachments, voice, token counting, and more.**

### Props

```typescript
interface ChatInputProps {
  // Core
  value?: string
  onChange?: (value: string) => void
  onSubmit: (message: string, attachments?: File[]) => void

  // State
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
  maxLength?: number

  // Features
  showTokenCounter?: boolean
  showAttachments?: boolean
  showVoiceInput?: boolean
  showEmojiPicker?: boolean
  showFormatting?: boolean

  // Attachments
  acceptedFileTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  onAttachmentError?: (error: Error) => void

  // Shortcuts
  submitOnEnter?: boolean          // Default: true
  submitOnCtrlEnter?: boolean      // Default: false

  // Styling
  className?: string
  inputClassName?: string
  height?: string | number

  // Callbacks
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}
```

### Examples

#### Basic Input

```tsx
import { ChatInput } from '@clarity-chat/react/components'

function SimpleInput() {
  const [value, setValue] = useState('')

  const handleSubmit = (message: string) => {
    console.log('Sending:', message)
    sendMessage(message)
    setValue('')
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Type a message..."
    />
  )
}
```

#### Full Featured Input

```tsx
function AdvancedInput() {
  return (
    <ChatInput
      onSubmit={handleSubmit}
      placeholder="Message AI Assistant..."
      maxLength={4000}
      showTokenCounter
      showAttachments
      showVoiceInput
      showEmojiPicker
      showFormatting
      acceptedFileTypes={['image/*', '.pdf', '.doc', '.docx']}
      maxFileSize={10 * 1024 * 1024}  // 10MB
      maxFiles={5}
      onAttachmentError={(error) => {
        toast.error(`Attachment error: ${error.message}`)
      }}
    />
  )
}
```

#### Ctrl+Enter to Submit

```tsx
function CtrlEnterInput() {
  return (
    <ChatInput
      onSubmit={handleSubmit}
      submitOnEnter={false}        // Disable Enter
      submitOnCtrlEnter={true}     // Enable Ctrl+Enter
      placeholder="Press Ctrl+Enter to send"
    />
  )
}
```

#### With Attachments

```tsx
function InputWithAttachments() {
  const handleSubmit = (message: string, attachments?: File[]) => {
    console.log('Message:', message)
    console.log('Attachments:', attachments)

    // Upload attachments first
    if (attachments && attachments.length > 0) {
      uploadFiles(attachments).then((urls) => {
        sendMessage(message, urls)
      })
    } else {
      sendMessage(message)
    }
  }

  return (
    <ChatInput
      onSubmit={handleSubmit}
      showAttachments
      acceptedFileTypes={['image/*']}
      maxFiles={3}
    />
  )
}
```

#### Voice Input

```tsx
function VoiceEnabledInput() {
  return (
    <ChatInput
      onSubmit={handleSubmit}
      showVoiceInput
      placeholder="Type or speak your message..."
    />
  )
}
```

### When to Use

- **Use ChatInput when:** You need a standalone input component with features
- **Complexity:** ⭐⭐ Feature-rich
- **Alternatives:** HTML `<textarea>` for simple cases, custom input for full control

---

## FloatingChatWidget

**Floating chat widget that appears in the corner of your site.**

### Props

```typescript
interface FloatingChatWidgetProps {
  // Core
  api: string

  // Position
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  offset?: { x: number; y: number }

  // Appearance
  buttonText?: string
  buttonIcon?: React.ReactNode
  buttonColor?: string
  minimized?: boolean

  // Behavior
  openByDefault?: boolean
  closeOnEscape?: boolean
  closeOnClickOutside?: boolean

  // Features
  showUnreadBadge?: boolean
  enableNotifications?: boolean

  // Callbacks
  onOpen?: () => void
  onClose?: () => void
  onMinimize?: () => void
}
```

### Examples

#### Basic Widget

```tsx
import { FloatingChatWidget } from '@clarity-chat/react/components'

function App() {
  return (
    <div>
      <YourMainContent />
      <FloatingChatWidget
        api="/api/chat"
        position="bottom-right"
      />
    </div>
  )
}
```

#### Custom Styling

```tsx
function StyledWidget() {
  return (
    <FloatingChatWidget
      api="/api/chat"
      position="bottom-right"
      offset={{ x: 20, y: 20 }}
      buttonText="Chat with us"
      buttonColor="#6366f1"
      buttonIcon={<ChatIcon />}
    />
  )
}
```

#### With Notifications

```tsx
function NotificationWidget() {
  return (
    <FloatingChatWidget
      api="/api/chat"
      showUnreadBadge
      enableNotifications
      onOpen={() => {
        markMessagesAsRead()
      }}
    />
  )
}
```

### When to Use

- **Use FloatingChatWidget when:** Adding support chat to a website
- **Complexity:** ⭐ Easy integration
- **Alternatives:** `ClarityChat` embedded in page

---

## VirtualizedMessageList

**High-performance message list using virtualization for large conversations.**

### Props

```typescript
interface VirtualizedMessageListProps {
  messages: Message[]
  height: number
  itemHeight?: number | ((index: number) => number)
  overscan?: number
  renderMessage: (message: Message, index: number) => React.ReactNode
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  className?: string
}
```

### Examples

#### Basic Virtualized List

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react/components'

function LargeChat() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <VirtualizedMessageList
      messages={messages}
      height={600}
      renderMessage={(message) => (
        <MessageCard message={message} />
      )}
    />
  )
}
```

#### Infinite Scroll

```tsx
function InfiniteScrollChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const older = await fetchOlderMessages(messages[0].id)
    setMessages((prev) => [...older, ...prev])
    setHasMore(older.length > 0)
  }

  return (
    <VirtualizedMessageList
      messages={messages}
      height={600}
      onLoadMore={loadMore}
      hasMore={hasMore}
      renderMessage={(message) => <MessageCard message={message} />}
    />
  )
}
```

#### Variable Height Items

```tsx
function VariableHeightList() {
  return (
    <VirtualizedMessageList
      messages={messages}
      height={600}
      itemHeight={(index) => {
        const msg = messages[index]
        // Estimate height based on content length
        return 80 + Math.ceil(msg.content.length / 50) * 20
      }}
      renderMessage={(message) => <MessageCard message={message} />}
    />
  )
}
```

### When to Use

- **Use VirtualizedMessageList when:** Displaying 1000+ messages for performance
- **Complexity:** ⭐⭐⭐ Performance-critical
- **Alternatives:** Standard message list for < 1000 messages

---

## MobileChatOptimized

**Mobile-first chat component optimized for touch interfaces.**

### Props

```typescript
interface MobileChatOptimizedProps {
  // Core
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean

  // Mobile Features
  enableSwipeActions?: boolean
  enableHapticFeedback?: boolean
  enableVoiceInput?: boolean
  keyboardAdjustment?: boolean

  // Layout
  showTopBar?: boolean
  topBarTitle?: string
  onBack?: () => void

  // Callbacks
  onMessageSwipe?: (messageId: string, direction: 'left' | 'right') => void
}
```

### Examples

#### Basic Mobile Chat

```tsx
import { MobileChatOptimized } from '@clarity-chat/react/components'

function MobileChat() {
  return (
    <MobileChatOptimized
      messages={messages}
      onSendMessage={handleSend}
      showTopBar
      topBarTitle="Support Chat"
      onBack={() => router.back()}
    />
  )
}
```

#### With Swipe Actions

```tsx
function SwipeableChat() {
  return (
    <MobileChatOptimized
      messages={messages}
      onSendMessage={handleSend}
      enableSwipeActions
      enableHapticFeedback
      onMessageSwipe={(id, direction) => {
        if (direction === 'left') {
          deleteMessage(id)
        } else {
          replyToMessage(id)
        }
      }}
    />
  )
}
```

### When to Use

- **Use MobileChatOptimized when:** Building mobile-first or mobile-only apps
- **Complexity:** ⭐⭐ Mobile-optimized
- **Alternatives:** `ClarityChat` with responsive styles

---

## Common Patterns

### Chat with Authentication

```tsx
function AuthenticatedChat() {
  const { user } = useAuth()

  if (!user) {
    return <LoginPrompt />
  }

  return (
    <ClarityChat
      api="/api/chat"
      chatId={`user-${user.id}`}
      header={{
        title: `Chat with ${user.name}`,
        subtitle: user.email,
      }}
    />
  )
}
```

### Multi-Tab Chat

```tsx
function MultiTabChat() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ClarityChat api="/api/chat/general" chatId="general" />
        </TabsContent>
        <TabsContent value="support">
          <ClarityChat api="/api/chat/support" chatId="support" />
        </TabsContent>
        <TabsContent value="sales">
          <ClarityChat api="/api/chat/sales" chatId="sales" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Chat with Custom Header

```tsx
function ChatWithCustomHeader() {
  return (
    <ClarityChat
      api="/api/chat"
      header={{
        show: true,
        title: "AI Assistant",
        actions: (
          <div className="flex gap-2">
            <button onClick={handleExport}>Export</button>
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleClear}>Clear</button>
          </div>
        ),
      }}
    />
  )
}
```

---

## Troubleshooting

### Chat Not Rendering

**Problem:** Component shows blank screen.

**Solutions:**
1. Import CSS: `import '@clarity-chat/react/styles.css'`
2. Check API endpoint is correct
3. Verify React version >= 18

### Messages Not Updating

**Problem:** New messages don't appear.

**Solutions:**
1. Ensure `messages` prop is updated correctly
2. Check `key` prop on messages for uniqueness
3. Verify state management (use hooks correctly)

### Layout Issues on Mobile

**Problem:** Chat doesn't fit mobile screen.

**Solutions:**
1. Use `MobileChatOptimized` component
2. Set `height="100vh"` or use flex container
3. Add viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## Related Components

- **[Message Components](./message.md)**: Message display components
- **[Input Components](./input.md)**: Specialized input components
- **[UI Components](./ui.md)**: Base UI components

---

## Best Practices

### 1. Start with ClarityChat

Always start with the highest-level component:

```tsx
// Good - simple and works
<ClarityChat api="/api/chat" />

// Avoid - too much complexity for simple case
<ChatWindow messages={messages} onSendMessage={append} ... />
```

### 2. Use Virtualization for Large Chats

```tsx
// Good - handles 10,000+ messages
<VirtualizedMessageList messages={messages} height={600} ... />

// Avoid - will freeze with many messages
<MessageList messages={messages} />
```

### 3. Handle Errors Gracefully

```tsx
<ClarityChat
  api="/api/chat"
  onError={(error) => {
    console.error(error)
    toast.error('Chat error. Please try again.')
    sendToErrorTracking(error)
  }}
/>
```

### 4. Enable Rate Limiting in Production

```tsx
<ClarityChat
  api="/api/chat"
  rateLimiting={{
    enable: true,
    maxConcurrentRequests: 3,
    showQueueStatus: true,
  }}
/>
```

### 5. Use Mobile-Optimized Components on Mobile

```tsx
function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileChatOptimized {...props} />
  }

  return <ClarityChat {...props} />
}
```
