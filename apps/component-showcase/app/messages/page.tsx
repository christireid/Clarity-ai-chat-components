'use client'

import { useState } from 'react'
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
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Check,
  Clock,
  CheckCheck,
  MoreHorizontal,
  Reply,
  Forward,
  Pin,
  Bookmark,
  Trash2,
  Edit,
  Smile,
  Sparkles,
  MessagesSquare,
  Loader2,
  MousePointerClick,
  Layers,
  Lightbulb,
  CornerDownRight,
  X,
  Send,
  Share2,
} from 'lucide-react'

// ============================================================================
// MESSAGE BUBBLE VARIANTS
// ============================================================================
function MessageBubbleVariants() {
  return (
    <div className="space-y-6">
      {/* Basic Messages */}
      <div>
        <h4 className="text-sm font-medium mb-3">Basic Messages</h4>
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          {/* User Message */}
          <div className="flex gap-3 flex-row-reverse">
            <div className="icon-container-sm gradient-accent text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3.5 max-w-[70%] glow-sm">
              <p className="text-sm">
                Hello! Can you help me with a coding question?
              </p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                10:32 AM
              </span>
            </div>
          </div>

          {/* Assistant Message */}
          <div className="flex gap-3">
            <div className="icon-container-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div className="glass-subtle rounded-xl rounded-tl-none p-3.5 max-w-[70%]">
              <p className="text-sm">
                Of course! I'd be happy to help. What would you like to know?
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                10:32 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages with Status */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          Messages with Delivery Status
        </h4>
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3 flex-row-reverse">
            <div className="icon-container-sm gradient-accent text-white">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="gradient-accent text-white rounded-xl glow-sm p-3">
              <p className="text-sm">Message read</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:33</span>
                <CheckCheck className="h-3 w-3 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STREAMING MESSAGE DEMO
// ============================================================================
function StreamingMessageDemo() {
  const [isStreaming, setIsStreaming] = useState(true)
  const text =
    'React Hooks are a powerful feature that allows you to use state and other React features in functional components. They were introduced in React 16.8 and have become the standard way to manage state in modern React applications.'

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Streaming Message</CardTitle>
            <CardDescription>
              Real-time text streaming with typing animation
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? 'Stop' : 'Start'} Streaming
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 bg-muted rounded-lg rounded-tl-none p-3">
              <p className="text-sm">
                {text}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                )}
              </p>
              {isStreaming && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Generating...
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TYPING INDICATOR DEMO
// ============================================================================
function TypingIndicatorDemo() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Typing Indicators</CardTitle>
        <CardDescription>
          Various typing indicator styles for chat interfaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bouncing Dots */}
          <div>
            <h4 className="text-sm font-medium mb-3">Bouncing Dots</h4>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none p-3">
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE ACTIONS DEMO - Types
// ============================================================================
interface ActionMessage {
  id: string
  content: string
  author: 'user' | 'assistant'
  timestamp: string
  isPinned?: boolean
  reactions?: { emoji: string; count: number }[]
}

// ============================================================================
// MESSAGE ACTIONS DEMO
// ============================================================================
function MessageActionsDemo() {
  // Message state
  const [messages, setMessages] = useState<ActionMessage[]>([
    {
      id: '1',
      content: 'This is a sample message with full action functionality. Try all the buttons!',
      author: 'assistant',
      timestamp: '10:30 AM',
      isPinned: false,
      reactions: [],
    },
    {
      id: '2',
      content: 'You can copy, reply, edit, delete, forward, react, pin, and share messages!',
      author: 'user',
      timestamp: '10:31 AM',
      isPinned: false,
      reactions: [],
    },
  ])

  // Action states
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const [showForwardDialog, setShowForwardDialog] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [selectedChat, setSelectedChat] = useState('')

  // Available emojis for reactions
  const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '💯']

  // Mock chats for forwarding
  const availableChats = [
    { id: 'chat1', name: 'Team Chat', avatar: '👥' },
    { id: 'chat2', name: 'Project Discussion', avatar: '💼' },
    { id: 'chat3', name: 'Support Team', avatar: '🛟' },
  ]

  // Action handlers
  const handleCopy = async (messageId: string, content: string) => {
    setLoadingAction(`copy-${messageId}`)
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleReply = (messageId: string) => {
    setReplyToMessageId(messageId)
    setReplyContent('')
  }

  const handleSendReply = () => {
    if (!replyContent.trim()) return

    setLoadingAction('send-reply')
    setTimeout(() => {
      const newMessage: ActionMessage = {
        id: Date.now().toString(),
        content: replyContent,
        author: 'user',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isPinned: false,
        reactions: [],
      }
      setMessages([...messages, newMessage])
      setReplyToMessageId(null)
      setReplyContent('')
      setLoadingAction(null)
    }, 500)
  }

  const handleEdit = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId)
    setEditContent(currentContent)
  }

  const handleSaveEdit = (messageId: string) => {
    if (!editContent.trim()) return

    setLoadingAction(`edit-${messageId}`)
    setTimeout(() => {
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, content: editContent } : msg
      ))
      setEditingMessageId(null)
      setEditContent('')
      setLoadingAction(null)
    }, 500)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditContent('')
  }

  const handleDelete = (messageId: string) => {
    setShowDeleteDialog(messageId)
    setShowMoreMenu(null)
  }

  const confirmDelete = () => {
    if (!showDeleteDialog) return

    setLoadingAction(`delete-${showDeleteDialog}`)
    setTimeout(() => {
      setMessages(messages.filter(msg => msg.id !== showDeleteDialog))
      setShowDeleteDialog(null)
      setLoadingAction(null)
    }, 500)
  }

  const handleForward = (messageId: string) => {
    setShowForwardDialog(messageId)
    setSelectedChat('')
    setShowMoreMenu(null)
  }

  const confirmForward = () => {
    if (!showForwardDialog || !selectedChat) return

    setLoadingAction(`forward-${showForwardDialog}`)
    setTimeout(() => {
      const chat = availableChats.find(c => c.id === selectedChat)
      setShowForwardDialog(null)
      setSelectedChat('')
      setLoadingAction(null)
      alert(`Message forwarded to ${chat?.name}!`)
    }, 500)
  }

  const handleReact = (messageId: string, emoji: string) => {
    setLoadingAction(`react-${messageId}`)
    setTimeout(() => {
      setMessages(messages.map(msg => {
        if (msg.id !== messageId) return msg

        const reactions = msg.reactions || []
        const existingReaction = reactions.find(r => r.emoji === emoji)

        if (existingReaction) {
          return {
            ...msg,
            reactions: reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          }
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1 }],
          }
        }
      }))
      setShowEmojiPicker(null)
      setLoadingAction(null)
    }, 300)
  }

  const handlePin = (messageId: string) => {
    setLoadingAction(`pin-${messageId}`)
    setTimeout(() => {
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      ))
      setLoadingAction(null)
      setShowMoreMenu(null)
    }, 300)
  }

  const handleShare = (messageId: string) => {
    setShowShareDialog(messageId)
    setShowMoreMenu(null)
  }

  const copyShareLink = () => {
    if (!showShareDialog) return

    const shareLink = `https://chat.example.com/messages/${showShareDialog}`
    navigator.clipboard.writeText(shareLink)
    setShowShareDialog(null)
    alert('Share link copied to clipboard!')
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Message Actions</CardTitle>
        <CardDescription>
          Fully functional message actions with state management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Messages with Actions */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* Message Bubble */}
                <div
                  className={cn(
                    'flex gap-3 relative group',
                    message.author === 'user' && 'flex-row-reverse'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'icon-container-sm shrink-0',
                      message.author === 'user' && 'gradient-accent text-white'
                    )}
                  >
                    {message.author === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 max-w-[70%]">
                    {editingMessageId === message.id ? (
                      // Edit Mode
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(message.id)}
                            disabled={loadingAction === `edit-${message.id}`}
                          >
                            {loadingAction === `edit-${message.id}` && (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            )}
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Normal Mode
                      <div
                        className={cn(
                          'rounded-xl p-3.5 relative',
                          message.author === 'user'
                            ? 'gradient-accent text-white rounded-tr-none glow-sm'
                            : 'glass-subtle rounded-tl-none',
                          message.isPinned && 'ring-2 ring-primary ring-offset-2'
                        )}
                      >
                        {message.isPinned && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Pin className="h-3 w-3 fill-current" />
                            </div>
                          </div>
                        )}

                        <p className="text-sm">{message.content}</p>
                        <span
                          className={cn(
                            'text-xs mt-1 block',
                            message.author === 'user'
                              ? 'text-right opacity-70'
                              : 'text-muted-foreground'
                          )}
                        >
                          {message.timestamp}
                        </span>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {message.reactions.map((reaction) => (
                              <div
                                key={reaction.emoji}
                                className="bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-muted-foreground">
                                  {reaction.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons - Show on hover */}
                    {editingMessageId !== message.id && (
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity',
                          message.author === 'user' && 'justify-end'
                        )}
                      >
                        <div className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border">
                          {/* Copy */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopy(message.id, message.content)}
                            disabled={loadingAction === `copy-${message.id}`}
                            title="Copy message"
                          >
                            {loadingAction === `copy-${message.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : copiedMessageId === message.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Reply */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleReply(message.id)}
                            title="Reply to message"
                          >
                            <Reply className="h-4 w-4" />
                          </Button>

                          {/* Edit (only for user messages) */}
                          {message.author === 'user' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(message.id, message.content)}
                              title="Edit message"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          {/* React */}
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setShowEmojiPicker(
                                  showEmojiPicker === message.id ? null : message.id
                                )
                              }
                              title="Add reaction"
                            >
                              <Smile className="h-4 w-4" />
                            </Button>

                            {/* Emoji Picker Popover */}
                            {showEmojiPicker === message.id && (
                              <div className="absolute bottom-full mb-2 left-0 z-50">
                                <div className="glass-card p-2 rounded-lg shadow-xl border flex gap-1">
                                  {availableEmojis.map((emoji) => (
                                    <button
                                      key={emoji}
                                      className="w-8 h-8 rounded hover:bg-muted flex items-center justify-center text-lg transition-colors"
                                      onClick={() => handleReact(message.id, emoji)}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Forward */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleForward(message.id)}
                            title="Forward message"
                          >
                            <Forward className="h-4 w-4" />
                          </Button>

                          {/* More Menu */}
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setShowMoreMenu(
                                  showMoreMenu === message.id ? null : message.id
                                )
                              }
                              title="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>

                            {/* More Menu Dropdown */}
                            {showMoreMenu === message.id && (
                              <div className="absolute bottom-full mb-2 right-0 z-50 w-48">
                                <div className="glass-card rounded-lg shadow-xl border overflow-hidden">
                                  <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    onClick={() => handlePin(message.id)}
                                    disabled={loadingAction === `pin-${message.id}`}
                                  >
                                    {loadingAction === `pin-${message.id}` ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Pin className="h-4 w-4" />
                                    )}
                                    {message.isPinned ? 'Unpin' : 'Pin'}
                                  </button>
                                  <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    onClick={() => handleShare(message.id)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                    Share
                                  </button>
                                  <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                                  >
                                    <Bookmark className="h-4 w-4" />
                                    Bookmark
                                  </button>
                                  <button
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors"
                                    onClick={() => handleDelete(message.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Reply Composer */}
            {replyToMessageId && (
              <div className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-lg">
                <div className="flex items-start gap-2 mb-2">
                  <CornerDownRight className="h-4 w-4 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Replying to message
                    </p>
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      {messages.find((m) => m.id === replyToMessageId)?.content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setReplyToMessageId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendReply()
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyContent.trim() || loadingAction === 'send-reply'}
                  >
                    {loadingAction === 'send-reply' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="glass-card p-6 rounded-lg shadow-xl border max-w-md w-full mx-4">
                <div className="flex items-start gap-4">
                  <div className="bg-destructive/10 text-destructive rounded-full p-2">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Delete Message</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Are you sure you want to delete this message? This action
                      cannot be undone.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(null)}
                        disabled={loadingAction === `delete-${showDeleteDialog}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={loadingAction === `delete-${showDeleteDialog}`}
                      >
                        {loadingAction === `delete-${showDeleteDialog}` ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forward Dialog */}
          {showForwardDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="glass-card p-6 rounded-lg shadow-xl border max-w-md w-full mx-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <Forward className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Forward Message</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a chat to forward this message to:
                    </p>
                    <div className="space-y-2 mb-4">
                      {availableChats.map((chat) => (
                        <button
                          key={chat.id}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors',
                            selectedChat === chat.id
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted'
                          )}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <span className="text-2xl">{chat.avatar}</span>
                          <span className="text-sm font-medium">{chat.name}</span>
                          {selectedChat === chat.id && (
                            <Check className="h-4 w-4 ml-auto text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowForwardDialog(null)
                          setSelectedChat('')
                        }}
                        disabled={loadingAction === `forward-${showForwardDialog}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={confirmForward}
                        disabled={
                          !selectedChat ||
                          loadingAction === `forward-${showForwardDialog}`
                        }
                      >
                        {loadingAction === `forward-${showForwardDialog}` ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Forwarding...
                          </>
                        ) : (
                          'Forward'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Dialog */}
          {showShareDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="glass-card p-6 rounded-lg shadow-xl border max-w-md w-full mx-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Share Message</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Anyone with this link can view the message:
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        readOnly
                        value={`https://chat.example.com/messages/${showShareDialog}`}
                        className="flex-1 px-3 py-2 rounded-lg border bg-muted text-sm"
                      />
                      <Button size="sm" onClick={copyShareLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowShareDialog(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="glass-subtle rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Available Actions
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Copy className="h-3 w-3" />
                <strong>Copy:</strong> Copy message to clipboard
              </li>
              <li className="flex items-center gap-2">
                <Reply className="h-3 w-3" />
                <strong>Reply:</strong> Open reply composer
              </li>
              <li className="flex items-center gap-2">
                <Edit className="h-3 w-3" />
                <strong>Edit:</strong> Enable inline editing (user messages only)
              </li>
              <li className="flex items-center gap-2">
                <Trash2 className="h-3 w-3" />
                <strong>Delete:</strong> Remove message with confirmation
              </li>
              <li className="flex items-center gap-2">
                <Forward className="h-3 w-3" />
                <strong>Forward:</strong> Forward to another chat
              </li>
              <li className="flex items-center gap-2">
                <Smile className="h-3 w-3" />
                <strong>React:</strong> Add emoji reactions
              </li>
              <li className="flex items-center gap-2">
                <Pin className="h-3 w-3" />
                <strong>Pin:</strong> Pin/unpin important messages
              </li>
              <li className="flex items-center gap-2">
                <Share2 className="h-3 w-3" />
                <strong>Share:</strong> Generate shareable link
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE GROUPING DEMO
// ============================================================================
function MessageGroupingDemo() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Message Grouping</CardTitle>
        <CardDescription>
          Group consecutive messages with date separators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground px-2">Today</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="bg-muted rounded-lg rounded-tl-none p-3">
                  <p className="text-sm">Hello! How can I help you today?</p>
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  10:30 AM
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FOLLOW UP SUGGESTIONS DEMO
// ============================================================================
function FollowUpSuggestionsDemo() {
  const suggestions = [
    'Tell me more about React hooks',
    'Show me a useEffect example',
    'What are custom hooks?',
    'Compare useState vs useReducer',
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Follow-up Suggestions</CardTitle>
        <CardDescription>
          Smart contextual suggestions after AI responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Chip Style</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => alert(`Selected: ${suggestion}`)}
                >
                  <Sparkles className="h-3 w-3" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function MessagesPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -left-40 opacity-30" />
        <div className="orb-cyan bottom-20 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Messages"
        description="Message bubbles, streaming, typing indicators, and actions"
        icon={MessagesSquare}
        badge="12+ Components"
      />

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="bubbles"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessagesSquare className="h-4 w-4" />
            Message Bubbles
          </TabsTrigger>
          <TabsTrigger
            value="streaming"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Loader2 className="h-4 w-4" />
            Streaming
          </TabsTrigger>
          <TabsTrigger
            value="typing"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bot className="h-4 w-4" />
            Typing Indicators
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MousePointerClick className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger
            value="grouping"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layers className="h-4 w-4" />
            Grouping
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bubbles">
          <ComponentSection
            title="Message Bubble Variants"
            description="Different styles and layouts for chat messages"
            icon={MessagesSquare}
          >
            <MessageBubbleVariants />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="streaming">
          <ComponentSection
            title="Streaming Messages"
            description="Real-time text generation with visual feedback"
            icon={Loader2}
          >
            <StreamingMessageDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="typing">
          <ComponentSection
            title="Typing Indicators"
            description="Show when someone is composing a message"
            icon={Bot}
          >
            <TypingIndicatorDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="actions">
          <ComponentSection
            title="Message Actions"
            description="Interactive actions for messages"
            icon={MousePointerClick}
          >
            <MessageActionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="grouping">
          <ComponentSection
            title="Message Grouping"
            description="Group messages by sender and time"
            icon={Layers}
          >
            <MessageGroupingDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="suggestions">
          <ComponentSection
            title="Follow-up Suggestions"
            description="Smart contextual suggestions"
            icon={Lightbulb}
          >
            <FollowUpSuggestionsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
