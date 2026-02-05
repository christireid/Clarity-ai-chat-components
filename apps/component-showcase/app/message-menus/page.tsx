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
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
} from '@clarity-chat/primitives'
import {
  MessageContextMenu,
  ReactionPicker,
  QuickReactionBar,
  ForwardDialog,
  EditMessageMode,
  DeleteConfirmationDialog,
  ShareDialog,
  type Conversation,
} from '@/../../packages/react/src/components/messages'
import {
  Menu,
  Smile,
  Forward,
  Edit,
  Trash2,
  Share2,
  User,
  Bot,
  MessageSquare,
  MousePointerClick,
  Pin,
  Bookmark,
  Copy,
  CheckCircle2,
} from 'lucide-react'

// ============================================================================
// SAMPLE DATA
// ============================================================================
const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    type: 'user',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey, how are you?',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    type: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Thanks for the help!',
    unreadCount: 2,
  },
  {
    id: '3',
    name: 'Team Alpha',
    type: 'group',
    lastMessage: 'Meeting at 3pm',
    unreadCount: 5,
  },
  {
    id: '4',
    name: 'Product Updates',
    type: 'channel',
    lastMessage: 'New feature released',
    isOnline: true,
  },
  {
    id: '5',
    name: 'Carol White',
    type: 'user',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'See you tomorrow',
  },
]

// ============================================================================
// CONTEXT MENU DEMO
// ============================================================================
function ContextMenuDemo() {
  const [actions, setActions] = useState<string[]>([])

  const addAction = (action: string) => {
    setActions((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${action}`])
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Message Context Menu</CardTitle>
        <CardDescription>
          Right-click on messages to see all available actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Message with Context Menu */}
          <div>
            <h4 className="text-sm font-medium mb-3">Your Message (Full Actions)</h4>
            <MessageContextMenu
              messageId="msg-1"
              isOwn={true}
              canEdit={true}
              canDelete={true}
              onReply={(id) => addAction(`Reply to ${id}`)}
              onForward={(id) => addAction(`Forward ${id}`)}
              onCopy={(id) => addAction(`Copy ${id}`)}
              onEdit={(id) => addAction(`Edit ${id}`)}
              onDelete={(id) => addAction(`Delete ${id}`)}
              onPin={(id, loc) => addAction(`Pin ${id} to ${loc}`)}
              onBookmark={(id) => addAction(`Bookmark ${id}`)}
              onReact={(id) => addAction(`React to ${id}`)}
              onQuote={(id) => addAction(`Quote ${id}`)}
              onShare={(id, type) => addAction(`Share ${id} as ${type}`)}
              onDownload={(id) => addAction(`Download ${id}`)}
              onMark={(id, type) => addAction(`Mark ${id} as ${type}`)}
              onArchive={(id) => addAction(`Archive ${id}`)}
            >
              <div className="cursor-pointer">
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm gradient-accent text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3 max-w-[70%] glow-sm">
                    <p className="text-sm">Right-click me to see all actions!</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      10:30 AM
                    </span>
                  </div>
                </div>
              </div>
            </MessageContextMenu>
          </div>

          {/* Assistant Message */}
          <div>
            <h4 className="text-sm font-medium mb-3">AI Message (Limited Actions)</h4>
            <MessageContextMenu
              messageId="msg-2"
              isOwn={false}
              onReply={(id) => addAction(`Reply to ${id}`)}
              onCopy={(id) => addAction(`Copy ${id}`)}
              onBookmark={(id) => addAction(`Bookmark ${id}`)}
              onReact={(id) => addAction(`React to ${id}`)}
              onShare={(id, type) => addAction(`Share ${id} as ${type}`)}
              onReport={(id) => addAction(`Report ${id}`)}
            >
              <div className="cursor-pointer">
                <div className="flex gap-3">
                  <div className="icon-container-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="glass-subtle rounded-xl rounded-tl-none p-3 max-w-[70%]">
                    <p className="text-sm">Right-click to see available actions</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      10:31 AM
                    </span>
                  </div>
                </div>
              </div>
            </MessageContextMenu>
          </div>

          {/* Action Log */}
          {actions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Action Log</h4>
              <div className="p-3 bg-muted/30 rounded-lg space-y-1 max-h-[200px] overflow-y-auto">
                {actions.map((action, i) => (
                  <div key={i} className="text-xs font-mono text-muted-foreground">
                    {action}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActions([])}
                className="mt-2"
              >
                Clear Log
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// REACTION PICKER DEMO
// ============================================================================
function ReactionPickerDemo() {
  const [reactions, setReactions] = useState<Record<string, number>>({})

  const handleReact = (emoji: string) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }))
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Reaction Picker</CardTitle>
        <CardDescription>
          Emoji picker with search and categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Full Picker */}
          <div>
            <h4 className="text-sm font-medium mb-3">Emoji Picker</h4>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <span className="text-sm">Add a reaction:</span>
              <ReactionPicker onSelect={handleReact} />
            </div>
          </div>

          {/* Quick Reaction Bar */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Reactions</h4>
            <div className="p-4 bg-muted/30 rounded-lg">
              <QuickReactionBar onReact={handleReact} />
            </div>
          </div>

          {/* Reaction Display */}
          {Object.keys(reactions).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Reactions</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReactions({})}
                className="mt-3"
              >
                Clear Reactions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FORWARD DIALOG DEMO
// ============================================================================
function ForwardDialogDemo() {
  const [open, setOpen] = useState(false)
  const [forwarded, setForwarded] = useState<string[]>([])

  const handleForward = (messageId: string, conversationIds: string[]) => {
    setForwarded(conversationIds)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Forward Dialog</CardTitle>
        <CardDescription>
          Select conversations to forward messages to
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Forward className="h-4 w-4" />
            Open Forward Dialog
          </Button>

          {forwarded.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-2">Forwarded to:</p>
              <div className="flex flex-wrap gap-2">
                {forwarded.map((id) => {
                  const conv = SAMPLE_CONVERSATIONS.find((c) => c.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      {conv?.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <ForwardDialog
            open={open}
            onOpenChange={setOpen}
            messageId="msg-forward"
            conversations={SAMPLE_CONVERSATIONS}
            onForward={handleForward}
            multiSelect={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDIT MODE DEMO
// ============================================================================
function EditModeDemo() {
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState(
    'This is the original message. Click edit to change it.'
  )

  const handleSave = async (messageId: string, newContent: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMessage(newContent)
    setIsEditing(false)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Edit Message Mode</CardTitle>
        <CardDescription>
          Inline editing with save/cancel actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEditing ? (
            <EditMessageMode
              messageId="msg-edit"
              initialContent={message}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              maxLength={500}
              showCharacterCount
            />
          ) : (
            <div className="flex gap-3">
              <div className="icon-container-sm gradient-accent text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 gradient-accent text-white rounded-xl rounded-tl-none p-3 glow-sm">
                <p className="text-sm">{message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-70">10:35 AM</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-6 px-2 text-xs bg-white/10 hover:bg-white/20"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DELETE CONFIRMATION DEMO
// ============================================================================
function DeleteConfirmationDemo() {
  const [open, setOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async (messageId: string, options: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleted(true)
    setTimeout(() => setDeleted(false), 3000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Delete Confirmation</CardTitle>
        <CardDescription>
          Modal with delete options and warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={() => setOpen(true)}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Message
          </Button>

          {deleted && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">
                Message deleted successfully
              </span>
            </div>
          )}

          <DeleteConfirmationDialog
            open={open}
            onOpenChange={setOpen}
            messageId="msg-delete"
            messagePreview="This is a sample message that will be deleted."
            showDeleteForEveryone={true}
            showDeleteHistory={true}
            canUndoDelete={true}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SHARE DIALOG DEMO
// ============================================================================
function ShareDialogDemo() {
  const [open, setOpen] = useState(false)

  const handleGenerateLink = async (messageId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return `https://example.com/messages/${messageId}`
  }

  const handleGenerateEmbed = async (messageId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return `<iframe src="https://example.com/embed/${messageId}" width="100%" height="400"></iframe>`
  }

  const handleExport = (messageId: string, format: 'txt' | 'md' | 'json') => {
    console.log(`Exporting ${messageId} as ${format}`)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Share Dialog</CardTitle>
        <CardDescription>
          Share via link, embed code, or export
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Message
        </Button>

        <ShareDialog
          open={open}
          onOpenChange={setOpen}
          messageId="msg-share"
          messageContent="This is a sample message to share with others."
          onGenerateLink={handleGenerateLink}
          onGenerateEmbed={handleGenerateEmbed}
          onExport={handleExport}
        />
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function MessageMenusPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -left-40 opacity-30" />
        <div className="orb-cyan bottom-20 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Message Menus"
        description="Complete set of message interaction menus and dialogs"
        icon={Menu}
        badge="7 Components"
      />

      <Tabs defaultValue="context" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="context"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Menu className="h-4 w-4" />
            Context Menu
          </TabsTrigger>
          <TabsTrigger
            value="reactions"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Smile className="h-4 w-4" />
            Reactions
          </TabsTrigger>
          <TabsTrigger
            value="forward"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Forward className="h-4 w-4" />
            Forward
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Edit className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="delete"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </TabsTrigger>
          <TabsTrigger
            value="share"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Share2 className="h-4 w-4" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="context">
          <ComponentSection
            title="Message Context Menu"
            description="Right-click context menu with all message actions"
            icon={Menu}
          >
            <ContextMenuDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="reactions">
          <ComponentSection
            title="Reaction Picker"
            description="Emoji picker with search and quick reactions"
            icon={Smile}
          >
            <ReactionPickerDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="forward">
          <ComponentSection
            title="Forward Dialog"
            description="Select conversations to forward messages"
            icon={Forward}
          >
            <ForwardDialogDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="edit">
          <ComponentSection
            title="Edit Message Mode"
            description="Inline editing with validation"
            icon={Edit}
          >
            <EditModeDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="delete">
          <ComponentSection
            title="Delete Confirmation"
            description="Confirmation dialog with options"
            icon={Trash2}
          >
            <DeleteConfirmationDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="share">
          <ComponentSection
            title="Share Dialog"
            description="Share via link, embed, or export"
            icon={Share2}
          >
            <ShareDialogDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
