import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'MessageInput - Clarity Chat Components',
  description: 'Rich message input component with mentions, emoji picker, file attachments, and formatting.',
}

export default function MessageInputPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>MessageInput</h1>
        <p className="docs-lead">
          Feature-rich message input with mentions, emojis, file attachments, markdown support, and keyboard shortcuts.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>MessageInput</code> component provides a complete input solution for chat applications.
          It includes support for text formatting, mentions, emoji picker, file attachments, voice messages,
          typing indicators, and keyboard shortcuts.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Message Input"
          code={`import { MessageInput } from '@clarity-chat/react'

function BasicInput() {
  const [messages, setMessages] = React.useState([])

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      sender: { id: 'user1', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded">
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type a message..."
      />
    </div>
  )
}

export default BasicInput`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="MessageInput Props"
          data={messageInputProps}
        />
      </section>

      <section className="docs-section">
        <h2>With Emoji Picker</h2>
        <p>
          Add emoji support with a built-in emoji picker.
        </p>
        <LiveDemo
          title="Emoji Picker"
          code={`import { MessageInput } from '@clarity-chat/react'

function EmojiInput() {
  const [messages, setMessages] = React.useState([])

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Send a message with emojis! 😊
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded">
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type a message with emojis..."
        enableEmoji
        emojiPickerPosition="top"
      />
    </div>
  )
}

export default EmojiInput`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With File Attachments</h2>
        <p>
          Allow users to attach images, videos, documents, and other files.
        </p>
        <LiveDemo
          title="File Attachments"
          code={`import { MessageInput } from '@clarity-chat/react'

function FileAttachmentInput() {
  const [messages, setMessages] = React.useState([])

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      attachments: message.attachments,
      timestamp: new Date()
    }])
  }

  const handleFileSelect = (files) => {
    console.log('Selected files:', files)
    // In production, upload files to server
    return Promise.resolve(
      files.map(file => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[350px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Send messages with attachments 📎
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                {msg.text && <p className="text-sm mb-2">{msg.text}</p>}
                {msg.attachments?.length > 0 && (
                  <div className="space-y-2">
                    {msg.attachments.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                        <span>📎</span>
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type a message or attach files..."
        enableAttachments
        onFileSelect={handleFileSelect}
        maxFileSize={10 * 1024 * 1024} // 10MB
        acceptedFileTypes={['image/*', 'video/*', '.pdf', '.doc', '.docx']}
      />
    </div>
  )
}

export default FileAttachmentInput`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>With Mentions</h2>
        <p>
          Enable user mentions with @ symbol and autocomplete.
        </p>
        <LiveDemo
          title="User Mentions"
          code={`import { MessageInput } from '@clarity-chat/react'

function MentionsInput() {
  const [messages, setMessages] = React.useState([])

  const users = [
    { id: '1', name: 'Alice Smith', avatar: '👩' },
    { id: '2', name: 'Bob Johnson', avatar: '👨' },
    { id: '3', name: 'Charlie Brown', avatar: '🧑' },
    { id: '4', name: 'Diana Prince', avatar: '👸' },
    { id: '5', name: 'Eve Anderson', avatar: '👩‍💼' }
  ]

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      mentions: message.mentions,
      timestamp: new Date()
    }])
  }

  const renderMessage = (text, mentions) => {
    if (!mentions?.length) return text

    let result = text
    mentions.forEach(mention => {
      const user = users.find(u => u.id === mention.id)
      if (user) {
        result = result.replace(
          \`@\${mention.name}\`,
          \`<span class="bg-blue-100 dark:bg-blue-900/40 px-1 rounded font-semibold">@\${user.name}</span>\`
        )
      }
    })
    return result
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Try mentioning users with @ symbol
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                <p 
                  className="text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMessage(msg.text, msg.mentions) 
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type @ to mention someone..."
        enableMentions
        users={users}
        mentionTrigger="@"
      />
    </div>
  )
}

export default MentionsInput`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With Markdown Support</h2>
        <p>
          Enable markdown formatting for rich text messages.
        </p>
        <LiveDemo
          title="Markdown Formatting"
          code={`import { MessageInput } from '@clarity-chat/react'

function MarkdownInput() {
  const [messages, setMessages] = React.useState([])

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      formatted: message.formatted,
      timestamp: new Date()
    }])
  }

  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\`(.+?)\`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs space-y-1">
        <p className="font-semibold mb-2">Formatting Guide:</p>
        <p><code>**bold**</code> - <strong>bold</strong></p>
        <p><code>*italic*</code> - <em>italic</em></p>
        <p><code>\`code\`</code> - <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">code</code></p>
        <p><code>~~strikethrough~~</code> - <del>strikethrough</del></p>
      </div>

      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Try formatting your messages!
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <p 
                  className="text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(msg.text) 
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type with **markdown** formatting..."
        enableMarkdown
        showFormattingToolbar
      />
    </div>
  )
}

export default MarkdownInput`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>With Voice Messages</h2>
        <p>
          Record and send voice messages with audio recording.
        </p>
        <LiveDemo
          title="Voice Messages"
          code={`import { MessageInput } from '@clarity-chat/react'

function VoiceInput() {
  const [messages, setMessages] = React.useState([])
  const [isRecording, setIsRecording] = React.useState(false)

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      audio: message.audio,
      timestamp: new Date()
    }])
  }

  const handleVoiceRecord = async () => {
    setIsRecording(true)
    
    // Simulate recording
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsRecording(false)
    
    return {
      url: 'data:audio/wav;base64,...', // In production, upload to server
      duration: 2.5,
      waveform: [0.2, 0.5, 0.8, 0.6, 0.3]
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Send text or voice messages 🎤
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
                {msg.text && <p className="text-sm">{msg.text}</p>}
                {msg.audio && (
                  <div className="flex items-center gap-2 mt-2">
                    <span>🎤</span>
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center px-2">
                      <div className="flex gap-0.5 items-end h-full">
                        {msg.audio.waveform.map((height, i) => (
                          <div
                            key={i}
                            className="w-1 bg-blue-500 rounded"
                            style={{ height: \`\${height * 100}%\` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {msg.audio.duration}s
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type or hold to record..."
        enableVoiceMessages
        onVoiceRecord={handleVoiceRecord}
        isRecording={isRecording}
      />
    </div>
  )
}

export default VoiceInput`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With Typing Indicator</h2>
        <p>
          Show typing indicator when user is composing a message.
        </p>
        <LiveDemo
          title="Typing Indicator"
          code={`import { MessageInput } from '@clarity-chat/react'

function TypingInput() {
  const [messages, setMessages] = React.useState([])
  const [isTyping, setIsTyping] = React.useState(false)
  const typingTimeoutRef = React.useRef()

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      timestamp: new Date()
    }])
    setIsTyping(false)
  }

  const handleTyping = (text) => {
    if (text.length > 0) {
      setIsTyping(true)
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set typing to false after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    } else {
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded">
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
        
        {isTyping && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <span>You are typing...</span>
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        onChange={handleTyping}
        placeholder="Start typing to see indicator..."
        showTypingIndicator
      />
    </div>
  )
}

export default TypingInput`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With Character Limit</h2>
        <p>
          Set maximum character limits with visual feedback.
        </p>
        <LiveDemo
          title="Character Limit"
          code={`import { MessageInput } from '@clarity-chat/react'

function LimitedInput() {
  const [messages, setMessages] = React.useState([])
  const [charCount, setCharCount] = React.useState(0)
  const maxChars = 200

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      timestamp: new Date()
    }])
    setCharCount(0)
  }

  const handleChange = (text) => {
    setCharCount(text.length)
  }

  const getRemainingColor = () => {
    const remaining = maxChars - charCount
    if (remaining < 20) return 'text-red-500'
    if (remaining < 50) return 'text-yellow-500'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Messages limited to {maxChars} characters
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-500">
                  {msg.text.length} chars
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <MessageInput
          onSend={handleSend}
          onChange={handleChange}
          placeholder="Type your message..."
          maxLength={maxChars}
        />
        
        <div className="flex items-center justify-between text-sm">
          <span className={getRemainingColor()}>
            {charCount} / {maxChars} characters
          </span>
          {charCount > maxChars * 0.9 && (
            <span className="text-xs text-yellow-600">
              ⚠️ Approaching limit
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default LimitedInput`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Multi-line Support</h2>
        <p>
          Enable multi-line messages with auto-resize and custom key bindings.
        </p>
        <LiveDemo
          title="Multi-line Input"
          code={`import { MessageInput } from '@clarity-chat/react'

function MultilineInput() {
  const [messages, setMessages] = React.useState([])

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      text: message.text,
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm space-y-1">
        <p className="font-semibold">Key Bindings:</p>
        <p><kbd>Enter</kbd> - New line</p>
        <p><kbd>Cmd+Enter</kbd> or <kbd>Ctrl+Enter</kbd> - Send message</p>
        <p><kbd>Shift+Enter</kbd> - New line (alternative)</p>
      </div>

      <div className="border rounded-lg p-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Multi-line messages supported
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded">
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type message (Cmd+Enter to send)..."
        multiline
        maxRows={5}
        autoResize
        submitOn="cmd+enter"
      />
    </div>
  )
}

export default MultilineInput`}
          height="600px"
        />
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <p>
          All features combined in a production-ready input component.
        </p>
        <LiveDemo
          title="Complete Message Input"
          code={`import { MessageInput } from '@clarity-chat/react'

function CompleteInput() {
  const [messages, setMessages] = React.useState([])

  const users = [
    { id: '1', name: 'Alice', avatar: '👩' },
    { id: '2', name: 'Bob', avatar: '👨' },
    { id: '3', name: 'Charlie', avatar: '🧑' }
  ]

  const handleSend = (message) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      ...message,
      sender: { id: 'me', name: 'You' },
      timestamp: new Date()
    }])
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 h-[350px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8 space-y-2">
            <p className="font-semibold">Full-featured input!</p>
            <p className="text-sm">Try emojis, mentions, files, formatting...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {msg.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {msg.text && (
                  <p className="text-sm whitespace-pre-wrap mb-2">{msg.text}</p>
                )}
                {msg.attachments?.length > 0 && (
                  <div className="space-y-1">
                    {msg.attachments.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                        <span>📎</span>
                        <span className="flex-1 truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="Type a message..."
        enableEmoji
        enableAttachments
        enableMentions
        enableMarkdown
        showFormattingToolbar
        users={users}
        multiline
        maxRows={4}
        autoResize
        submitOn="cmd+enter"
      />
    </div>
  )
}

export default CompleteInput`}
          height="650px"
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Draft Auto-save</h3>
        <pre><code>{`function DraftSavingInput() {
  const [draft, setDraft] = useState('')
  
  useEffect(() => {
    // Load draft from localStorage
    const saved = localStorage.getItem('message-draft')
    if (saved) setDraft(saved)
  }, [])
  
  const handleChange = (text) => {
    setDraft(text)
    // Debounced save to localStorage
    debouncedSave(text)
  }
  
  const debouncedSave = debounce((text) => {
    localStorage.setItem('message-draft', text)
  }, 500)
  
  const handleSend = (message) => {
    localStorage.removeItem('message-draft')
    sendMessage(message)
  }
  
  return (
    <MessageInput
      value={draft}
      onChange={handleChange}
      onSend={handleSend}
    />
  )
}`}</code></pre>

        <h3>Command Suggestions</h3>
        <pre><code>{`function CommandInput() {
  const [showCommands, setShowCommands] = useState(false)
  const [commandSearch, setCommandSearch] = useState('')
  
  const commands = [
    { trigger: '/gif', description: 'Search for GIFs' },
    { trigger: '/poll', description: 'Create a poll' },
    { trigger: '/remind', description: 'Set a reminder' },
    { trigger: '/status', description: 'Set your status' }
  ]
  
  const handleChange = (text) => {
    if (text.startsWith('/')) {
      setShowCommands(true)
      setCommandSearch(text.slice(1))
    } else {
      setShowCommands(false)
    }
  }
  
  const filteredCommands = commands.filter(cmd =>
    cmd.trigger.includes(commandSearch)
  )
  
  return (
    <div>
      {showCommands && (
        <CommandSuggestions commands={filteredCommands} />
      )}
      <MessageInput onChange={handleChange} />
    </div>
  )
}`}</code></pre>

        <h3>Smart Reply Suggestions</h3>
        <pre><code>{`function SmartReplyInput({ lastMessage }) {
  const suggestions = generateSmartReplies(lastMessage)
  
  const handleSuggestionClick = (suggestion) => {
    sendMessage({ text: suggestion })
  }
  
  return (
    <div>
      {suggestions.length > 0 && (
        <div className="smart-replies">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-chip"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <MessageInput />
    </div>
  )
}`}</code></pre>

        <h3>Link Preview</h3>
        <pre><code>{`function LinkPreviewInput() {
  const [preview, setPreview] = useState(null)
  
  const handleChange = async (text) => {
    const urls = extractUrls(text)
    
    if (urls.length > 0) {
      const metadata = await fetchLinkMetadata(urls[0])
      setPreview(metadata)
    } else {
      setPreview(null)
    }
  }
  
  return (
    <div>
      {preview && (
        <LinkPreview
          title={preview.title}
          description={preview.description}
          image={preview.image}
          url={preview.url}
        />
      )}
      <MessageInput onChange={handleChange} />
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Keyboard Shortcuts</h2>
        
        <Callout type="info" title="Default Shortcuts">
          <ul>
            <li><kbd>Enter</kbd> - Send message (single-line mode)</li>
            <li><kbd>Cmd/Ctrl + Enter</kbd> - Send message (multi-line mode)</li>
            <li><kbd>Shift + Enter</kbd> - New line</li>
            <li><kbd>Cmd/Ctrl + B</kbd> - Bold</li>
            <li><kbd>Cmd/Ctrl + I</kbd> - Italic</li>
            <li><kbd>Cmd/Ctrl + K</kbd> - Insert link</li>
            <li><kbd>@</kbd> - Mention user</li>
            <li><kbd>/</kbd> - Trigger commands</li>
            <li><kbd>Esc</kbd> - Clear input / Cancel editing</li>
          </ul>
        </Callout>

        <h3>Custom Key Bindings</h3>
        <pre><code>{`<MessageInput
  keyBindings={{
    send: 'cmd+enter',
    newLine: 'shift+enter',
    bold: 'cmd+b',
    italic: 'cmd+i',
    code: 'cmd+e',
    clearInput: 'esc'
  }}
/>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>

        <h3>ARIA Attributes</h3>
        <p>
          The MessageInput automatically includes proper ARIA attributes:
        </p>
        <ul>
          <li><code>role="textbox"</code> for the input area</li>
          <li><code>aria-label</code> for screen reader context</li>
          <li><code>aria-multiline</code> for multi-line inputs</li>
          <li><code>aria-required</code> when input is required</li>
          <li><code>aria-describedby</code> for error messages</li>
          <li><code>aria-expanded</code> for dropdown states</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li>All buttons are keyboard accessible</li>
          <li>Tab order follows logical flow</li>
          <li>Focus visible on all interactive elements</li>
          <li>Escape closes dropdowns and dialogs</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Button actions are announced</li>
          <li>Character count is announced</li>
          <li>Attachment status is announced</li>
          <li>Error states are clearly communicated</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Provide Clear Feedback">
          Always show visual feedback for user actions like file uploads,
          mentions, and sending messages. Use loading states and success indicators.
        </Callout>

        <Callout type="warning" title="Validate Input">
          Validate message content before sending. Check for empty messages,
          file size limits, and rate limiting to prevent spam.
        </Callout>

        <h3>UX Guidelines</h3>
        <ul>
          <li>Show character count when approaching limit</li>
          <li>Disable send button when input is empty</li>
          <li>Auto-focus input after sending message</li>
          <li>Save drafts automatically</li>
          <li>Show upload progress for files</li>
          <li>Provide keyboard shortcuts reference</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Debounce typing indicators</li>
          <li>Compress files before upload</li>
          <li>Lazy load emoji picker</li>
          <li>Virtualize long mention lists</li>
          <li>Optimize re-renders with memoization</li>
        </ul>

        <h3>Mobile Considerations</h3>
        <ul>
          <li>Use native file picker on mobile</li>
          <li>Optimize for small screens</li>
          <li>Support voice input on mobile</li>
          <li>Handle keyboard appearance gracefully</li>
          <li>Provide large touch targets (44x44px minimum)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { MessageInput, MessageInputProps, MessageData } from '@clarity-chat/react'

interface MessageData {
  text: string
  mentions?: Mention[]
  attachments?: Attachment[]
  audio?: AudioData
  formatted?: string
  metadata?: Record<string, any>
}

interface MessageInputProps {
  onSend: (message: MessageData) => void | Promise<void>
  onChange?: (text: string) => void
  placeholder?: string
  value?: string
  disabled?: boolean
  
  // Features
  enableEmoji?: boolean
  enableAttachments?: boolean
  enableMentions?: boolean
  enableMarkdown?: boolean
  enableVoiceMessages?: boolean
  
  // Configuration
  multiline?: boolean
  maxRows?: number
  autoResize?: boolean
  maxLength?: number
  minLength?: number
  
  // Attachments
  onFileSelect?: (files: File[]) => Promise<Attachment[]>
  maxFileSize?: number
  maxFiles?: number
  acceptedFileTypes?: string[]
  
  // Mentions
  users?: User[]
  mentionTrigger?: string
  
  // Voice
  onVoiceRecord?: () => Promise<AudioData>
  isRecording?: boolean
  
  // UI
  showFormattingToolbar?: boolean
  showCharCount?: boolean
  showTypingIndicator?: boolean
  emojiPickerPosition?: 'top' | 'bottom'
  
  // Key bindings
  submitOn?: 'enter' | 'cmd+enter' | 'ctrl+enter'
  keyBindings?: Record<string, string>
  
  // Style
  className?: string
  inputClassName?: string
  buttonClassName?: string
  
  // Events
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (e: KeyboardEvent) => void
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/chat-window" className="docs-card">
            <h3>ChatWindow</h3>
            <p>Complete chat interface</p>
          </a>
          <a href="/reference/components/message" className="docs-card">
            <h3>Message Component</h3>
            <p>Message display component</p>
          </a>
          <a href="/reference/hooks/use-messages" className="docs-card">
            <h3>useMessages</h3>
            <p>Message state management</p>
          </a>
          <a href="/examples/multi-user" className="docs-card">
            <h3>Multi-user Example</h3>
            <p>Complete chat with all features</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const messageInputProps = [
  {
    name: 'onSend',
    type: '(message: MessageData) => void | Promise<void>',
    required: true,
    description: 'Callback when user sends a message'
  },
  {
    name: 'onChange',
    type: '(text: string) => void',
    required: false,
    description: 'Callback when input text changes'
  },
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    default: '"Type a message..."',
    description: 'Placeholder text for empty input'
  },
  {
    name: 'value',
    type: 'string',
    required: false,
    description: 'Controlled input value'
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Disable the input'
  },
  {
    name: 'enableEmoji',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable emoji picker button'
  },
  {
    name: 'enableAttachments',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable file attachment button'
  },
  {
    name: 'enableMentions',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable user mentions with @ trigger'
  },
  {
    name: 'enableMarkdown',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable markdown formatting support'
  },
  {
    name: 'enableVoiceMessages',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable voice message recording'
  },
  {
    name: 'multiline',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Allow multi-line messages'
  },
  {
    name: 'maxRows',
    type: 'number',
    required: false,
    default: '3',
    description: 'Maximum rows for multi-line input'
  },
  {
    name: 'autoResize',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Auto-resize input based on content'
  },
  {
    name: 'maxLength',
    type: 'number',
    required: false,
    description: 'Maximum character limit'
  },
  {
    name: 'showFormattingToolbar',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show formatting toolbar (bold, italic, etc.)'
  },
  {
    name: 'submitOn',
    type: "'enter' | 'cmd+enter' | 'ctrl+enter'",
    required: false,
    default: "'enter'",
    description: 'Keyboard shortcut to send message'
  }
]
