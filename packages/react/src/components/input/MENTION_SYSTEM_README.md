# Mention & Command System

A comprehensive @mention and /command autocomplete system with glassmorphism styling, context-aware suggestions, and full keyboard navigation.

## Features

### Core Functionality
- **@Mentions**: Autocomplete for users, AI agents, and bots
- **Slash Commands**: Execute commands with parameters
- **Fuzzy Search**: Flexible matching for quick access
- **Context-Aware**: Prioritizes online users and agents
- **Keyboard Navigation**: Full accessibility with ↑↓ Tab Enter Escape

### Design
- **Glassmorphism Dropdown**: Beautiful frosted glass effect with backdrop blur
- **OKLCH Gradients**: Sophisticated pastel color system
- **Smooth Animations**: Respects reduced motion preferences
- **Type Indicators**: Visual badges for user/agent/bot types
- **Role Display**: Shows user roles and capabilities

### Accessibility
- **ARIA Attributes**: Full screen reader support
- **Keyboard Navigation**: Tab, Arrow keys, Enter, Escape
- **Focus Management**: Proper focus handling and restoration
- **Reduced Motion**: Respects prefers-reduced-motion
- **Semantic HTML**: Proper role and aria attributes

## Usage

### Basic Mention Input

```tsx
import { MentionInput, type MentionableUser, type Mention } from '@clarity-chat/react'

function ChatComponent() {
  const [inputValue, setInputValue] = useState('')
  const [mentions, setMentions] = useState<Mention[]>([])

  const users: MentionableUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice',
      role: 'Product Manager',
      type: 'user',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Claude AI',
      username: 'claude',
      role: 'AI Assistant',
      type: 'agent',
      isOnline: true,
      capabilities: ['Code', 'Analysis', 'Writing'],
    },
  ]

  const handleChange = (value: string, newMentions: Mention[]) => {
    setInputValue(value)
    setMentions(newMentions)
  }

  return (
    <MentionInput
      users={users}
      value={inputValue}
      onChange={handleChange}
      onSubmit={() => console.log('Submit:', inputValue, mentions)}
      placeholder="Type @ to mention someone..."
    />
  )
}
```

### With Slash Commands

```tsx
import {
  MentionInput,
  type SlashCommand,
  type CommandParameter
} from '@clarity-chat/react'

function EnhancedChatInput() {
  const commands: SlashCommand[] = [
    {
      id: 'help',
      command: 'help',
      description: 'Show available commands',
      category: 'general',
      icon: <HelpIcon />,
    },
    {
      id: 'search',
      command: 'search',
      description: 'Search conversation history',
      category: 'search',
      parameters: [
        {
          name: 'query',
          type: 'string',
          required: true,
          description: 'Search query'
        },
      ],
    },
    {
      id: 'summarize',
      command: 'summarize',
      description: 'Summarize the conversation',
      category: 'ai',
    },
  ]

  const handleCommandExecute = (command: SlashCommand) => {
    console.log('Executing command:', command)
    // Implement command logic
  }

  return (
    <MentionInput
      users={users}
      commands={commands}
      value={inputValue}
      onChange={handleChange}
      onCommandExecute={handleCommandExecute}
      onSubmit={handleSubmit}
      placeholder="Type @ to mention or / for commands..."
      enableFuzzySearch
      enableContextFiltering
      maxSuggestions={8}
    />
  )
}
```

### Custom Mention Trigger

```tsx
<MentionInput
  users={users}
  value={inputValue}
  onChange={handleChange}
  mentionTrigger="#"  // Use # instead of @
  commandTrigger="!"  // Use ! instead of /
/>
```

### Using the Mention Hook

```tsx
import { useMentions } from '@clarity-chat/react'

function MentionManager() {
  const {
    mentions,
    addMention,
    markAsRead,
    getUnreadCount,
    getMentionsForUser,
  } = useMentions()

  const unreadCount = getUnreadCount('user-123')
  const userMentions = getMentionsForUser('user-123')

  return (
    <div>
      <p>Unread mentions: {unreadCount}</p>
      {/* Display mentions */}
    </div>
  )
}
```

### Mention List Component

```tsx
import { MentionList, type Mention } from '@clarity-chat/react'

function MentionSidebar() {
  const mentions: Mention[] = [...]
  const messages = new Map([...])
  const users = new Map([...])

  return (
    <MentionList
      mentions={mentions}
      messages={messages}
      users={users}
      currentUserId="user-123"
      onMentionClick={(mention) => {
        // Jump to message
        jumpToMessage(mention.messageId)
      }}
      onMarkAsRead={(mentionId) => {
        // Mark as read
        markMentionAsRead(mentionId)
      }}
      showOnlyUnread
    />
  )
}
```

## Props

### MentionInputProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `users` | `MentionableUser[]` | Required | Available users/agents to mention |
| `commands` | `SlashCommand[]` | `[]` | Available slash commands |
| `value` | `string` | Required | Current input value (controlled) |
| `onChange` | `(value, mentions) => void` | Required | Callback when value changes |
| `onCommandExecute` | `(command) => void` | - | Callback when command is executed |
| `onSubmit` | `() => void` | - | Callback when Enter is pressed |
| `placeholder` | `string` | `'Type @ to mention...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `mentionTrigger` | `string` | `'@'` | Mention trigger character |
| `commandTrigger` | `string` | `'/'` | Command trigger character |
| `enableFuzzySearch` | `boolean` | `true` | Enable fuzzy search |
| `maxSuggestions` | `number` | `10` | Max suggestions to show |
| `enableContextFiltering` | `boolean` | `true` | Context-aware filtering |
| `className` | `string` | - | Optional CSS class |

### MentionableUser

```typescript
interface MentionableUser {
  id: string
  name: string
  username: string
  role?: string
  avatar?: string
  isOnline?: boolean
  type?: 'user' | 'agent' | 'bot'
  capabilities?: string[]
}
```

### SlashCommand

```typescript
interface SlashCommand {
  id: string
  command: string
  description: string
  category?: 'general' | 'ai' | 'search' | 'utility'
  icon?: React.ReactNode
  action?: () => void
  parameters?: CommandParameter[]
}

interface CommandParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  required: boolean
  description?: string
  options?: string[]
}
```

### Mention

```typescript
interface Mention {
  id: string
  userId: string
  messageId: string
  position: number
  length: number
  isRead: boolean
  timestamp: number
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `@` | Trigger mention suggestions |
| `/` | Trigger command suggestions |
| `↑` | Navigate up in suggestions |
| `↓` | Navigate down in suggestions |
| `Enter` | Select highlighted suggestion |
| `Tab` | Select highlighted suggestion |
| `Escape` | Close suggestions |
| `Enter` (no suggestions) | Submit input |
| `Shift + Enter` | New line |

## Styling

The component uses the glassmorphism design system with customizable intensity:

```tsx
// Default glassmorphism styling
<MentionInput
  users={users}
  value={value}
  onChange={onChange}
  className="my-custom-class"
/>
```

### Glass Variants

The dropdown uses these glass variants:
- **intensity**: `'strong'` for dropdown background
- **gradient**: None by default (pure glass effect)
- **border**: `'light'` for subtle borders
- **animated**: None (respects reduced motion)

### Custom Styling

Override styles using className or CSS custom properties:

```css
/* Custom input styling */
.my-mention-input textarea {
  min-height: 100px;
  font-size: 16px;
}

/* Custom dropdown styling */
.my-mention-input [role="listbox"] {
  max-height: 400px;
}

/* Custom suggestion item */
.my-mention-input [role="option"] {
  padding: 16px;
}
```

## Advanced Features

### Context-Aware Prioritization

When `enableContextFiltering` is enabled, suggestions are prioritized:
1. AI agents (type='agent') appear first
2. Online users before offline users
3. Alphabetical within each group

### Fuzzy Search

Fuzzy search allows flexible matching:
- "alice" matches "Alice Johnson"
- "aj" matches "Alice Johnson"
- "pm" matches "Product Manager" (in role)

### Type Indicators

Visual indicators show user types:
- **User**: Gray badge
- **Agent**: Purple gradient badge
- **Bot**: Blue gradient badge

### Capability Badges

For agents, capability badges show their skills:
- Code, Analysis, Writing, etc.
- Up to 3 capabilities shown in suggestions

## Performance

- **Debounced Search**: Input is debounced to reduce calculations
- **Virtual Scrolling**: Large suggestion lists are virtualized
- **Memoized Components**: Suggestions are memoized to prevent re-renders
- **Reduced Motion**: Respects prefers-reduced-motion for animations

## Browser Support

- Chrome 76+ (backdrop-filter support)
- Firefox 70+
- Safari 14+
- Edge 79+

## Examples

See the full interactive demo at:
- `/apps/examples/examples-showcase/src/components/MentionCommandDemo.tsx`

## Contributing

When adding new features:
1. Update TypeScript interfaces
2. Add tests for new functionality
3. Update this README
4. Add examples to the showcase

## License

Part of the Clarity AI Chat Components library.
