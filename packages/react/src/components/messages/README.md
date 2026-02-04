# Message Interaction Components

Complete set of interactive components for message interactions in chat applications.

## Components

### 1. MessageContextMenu

Full-featured right-click context menu for messages with all available actions.

**Features:**
- Reply, forward, quote
- Copy, edit, delete
- Pin/unpin with location selector (top/bottom)
- Bookmark/unbookmark
- React with emoji
- Share (link, embed, export)
- Mark as read/unread/important
- Mute/unmute threads
- Report, archive

**Usage:**
```tsx
<MessageContextMenu
  messageId="msg-123"
  isOwn={true}
  canEdit={true}
  canDelete={true}
  onReply={(id) => console.log('Reply to', id)}
  onEdit={(id) => console.log('Edit', id)}
  onDelete={(id) => console.log('Delete', id)}
  onPin={(id, location) => console.log('Pin', id, 'to', location)}
>
  <div className="message">Message content</div>
</MessageContextMenu>
```

### 2. ReactionPicker

Emoji picker with search, categories, and quick reactions.

**Features:**
- Categorized emoji grid
- Search functionality
- Frequently used section
- Keyboard navigation
- Quick access bar

**Usage:**
```tsx
// Full picker
<ReactionPicker
  onSelect={(emoji) => console.log('Selected:', emoji)}
/>

// Quick reaction bar
<QuickReactionBar
  onReact={(emoji) => addReaction(emoji)}
  reactions={['👍', '❤️', '😂', '😮', '😢', '🎉']}
/>
```

### 3. ForwardDialog

Dialog for selecting conversations to forward messages to.

**Features:**
- Search conversations
- Filter by type (user/group/channel)
- Multi-select support
- Preview of selected conversations
- Online status indicators

**Usage:**
```tsx
<ForwardDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  messageId="msg-123"
  conversations={conversations}
  onForward={(msgId, convIds) => {
    forwardMessage(msgId, convIds)
  }}
  multiSelect={true}
/>
```

### 4. EditMessageMode

Inline message editing with validation and save/cancel actions.

**Features:**
- Auto-resize textarea
- Character count
- Content validation
- Loading state during save
- Keyboard shortcuts (Cmd/Ctrl+Enter to save, Esc to cancel)
- Error handling

**Usage:**
```tsx
<EditMessageMode
  messageId="msg-123"
  initialContent="Original message"
  onSave={async (id, content) => {
    await updateMessage(id, content)
  }}
  onCancel={() => setEditMode(false)}
  maxLength={500}
  showCharacterCount
/>
```

### 5. DeleteConfirmationDialog

Confirmation modal for deleting messages with options.

**Features:**
- Warning message with preview
- Delete for self vs everyone option
- Delete conversation history option
- Destructive styling
- Loading state
- Undo capability info

**Usage:**
```tsx
<DeleteConfirmationDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  messageId="msg-123"
  messagePreview="This is the message to delete..."
  showDeleteForEveryone={true}
  showDeleteHistory={true}
  onDelete={async (id, options) => {
    await deleteMessage(id, options)
  }}
/>
```

### 6. ShareDialog

Multi-tab dialog for sharing messages via link, embed, or export.

**Features:**
- Copy shareable link
- Generate embed code
- Export in multiple formats (txt, md, json)
- Social media sharing (Twitter, Facebook, LinkedIn, Email)
- Copy functionality with feedback

**Usage:**
```tsx
<ShareDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  messageId="msg-123"
  messageContent="Message to share"
  onGenerateLink={async (id) => createShareLink(id)}
  onGenerateEmbed={async (id) => createEmbedCode(id)}
  onExport={(id, format) => exportMessage(id, format)}
/>
```

## Complete Example

Here's a complete example showing all components working together:

```tsx
'use client'

import { useState } from 'react'
import {
  MessageContextMenu,
  ReactionPicker,
  ForwardDialog,
  EditMessageMode,
  DeleteConfirmationDialog,
  ShareDialog,
} from '@clarity-chat/react'

export function MessageInteraction({ message }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showForward, setShowForward] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showShare, setShowShare] = useState(false)

  return (
    <>
      <MessageContextMenu
        messageId={message.id}
        isOwn={message.isOwn}
        canEdit={message.canEdit}
        canDelete={message.canDelete}
        onEdit={() => setIsEditing(true)}
        onForward={() => setShowForward(true)}
        onDelete={() => setShowDelete(true)}
        onShare={() => setShowShare(true)}
      >
        {isEditing ? (
          <EditMessageMode
            messageId={message.id}
            initialContent={message.content}
            onSave={async (id, content) => {
              await updateMessage(id, content)
              setIsEditing(false)
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="message">
            {message.content}
            <ReactionPicker
              onSelect={(emoji) => addReaction(message.id, emoji)}
            />
          </div>
        )}
      </MessageContextMenu>

      <ForwardDialog
        open={showForward}
        onOpenChange={setShowForward}
        messageId={message.id}
        conversations={conversations}
        onForward={forwardMessage}
      />

      <DeleteConfirmationDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        messageId={message.id}
        onDelete={deleteMessage}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        messageId={message.id}
        messageContent={message.content}
        onGenerateLink={generateShareLink}
        onExport={exportMessage}
      />
    </>
  )
}
```

## Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support with standard shortcuts
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Focus traps in dialogs and proper focus restoration
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Styling

Components use Tailwind CSS and are fully customizable:

- All components accept `className` prop for custom styling
- Built with `@clarity-chat/primitives` for consistent design
- Support for light/dark themes
- Glassmorphism effects available via utility classes

## Dependencies

These components require:
- `@clarity-chat/primitives` - Base UI components
- `lucide-react` - Icons
- `react` >= 18.0.0
- `tailwindcss` >= 3.0.0

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
