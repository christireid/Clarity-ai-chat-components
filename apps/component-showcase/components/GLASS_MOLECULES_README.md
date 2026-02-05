# Glassmorphism Component Molecules

A comprehensive library of reusable glassmorphism components designed for building modern, beautiful chat interfaces. These components leverage the existing glassmorphism design system and provide consistent styling across all demos.

## Components Overview

### 1. GlassMessageBubble
**Purpose**: Message container with glass effect for chat messages

**Features**:
- Supports user, assistant, and system message variants
- Avatar integration
- Timestamp and status indicators
- Action buttons support
- Automatic layout for different message types

**Usage**:
```tsx
<GlassMessageBubble
  variant="assistant"
  avatar={<Avatar fallback="AI" />}
  timestamp={<span>2:30 PM</span>}
  status={<StatusIndicator />}
  actions={<MessageActions />}
>
  Message content here
</GlassMessageBubble>
```

**Props**:
- `variant?: 'user' | 'assistant' | 'system'` - Message type
- `avatar?: React.ReactNode` - Avatar component
- `actions?: React.ReactNode` - Action buttons
- `timestamp?: React.ReactNode` - Timestamp display
- `status?: React.ReactNode` - Status indicator
- Plus all HTMLDivElement props

---

### 2. GlassToolCard
**Purpose**: Tool display card with status indicators

**Features**:
- Icon integration
- Multiple status states (idle, running, completed, error)
- Duration display
- Badge support
- Animated states for running tools
- Hover effects

**Usage**:
```tsx
<GlassToolCard
  icon={Terminal}
  title="code_interpreter"
  description="Execute code in a sandbox"
  status="running"
  duration="1.2s"
  badge={<Badge>Ready</Badge>}
/>
```

**Props**:
- `icon?: LucideIcon` - Tool icon
- `title: string` - Tool name (required)
- `description?: string` - Tool description
- `status?: 'idle' | 'running' | 'completed' | 'error'` - Current status
- `duration?: string` - Execution duration
- `badge?: React.ReactNode` - Status badge
- Plus all HTMLDivElement props

---

### 3. GlassStatusBadge
**Purpose**: Status indicators with glass effect

**Features**:
- Multiple color variants (default, success, warning, error, info)
- Three sizes (sm, md, lg)
- Optional pulse animation
- Icon support
- Fully accessible

**Usage**:
```tsx
<GlassStatusBadge
  variant="success"
  size="md"
  pulse
  icon={CheckCircle}
>
  Online
</GlassStatusBadge>
```

**Props**:
- `variant?: 'default' | 'success' | 'warning' | 'error' | 'info'` - Color scheme
- `size?: 'sm' | 'md' | 'lg'` - Badge size
- `pulse?: boolean` - Enable pulse animation
- `icon?: LucideIcon` - Optional icon
- Plus all HTMLDivElement props

---

### 4. GlassActionButton
**Purpose**: Interactive buttons with glass effect

**Features**:
- Multiple variants (default, subtle, strong, ghost)
- Three sizes (sm, md, lg)
- Icon positioning (left/right)
- Optional glow effect
- Active/disabled states
- Focus ring for accessibility

**Usage**:
```tsx
<GlassActionButton
  variant="default"
  size="md"
  icon={Send}
  iconPosition="left"
  glow
  onClick={handleClick}
>
  Send Message
</GlassActionButton>
```

**Props**:
- `variant?: 'default' | 'subtle' | 'strong' | 'ghost'` - Visual style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `icon?: LucideIcon` - Optional icon
- `iconPosition?: 'left' | 'right'` - Icon placement
- `glow?: boolean` - Enable glow effect
- Plus all HTMLButtonElement props

---

### 5. GlassPanel
**Purpose**: Content sections with glass effect

**Features**:
- Multiple variants (default, subtle, strong)
- Customizable padding levels
- Optional border
- Shadow options (none, sm, md, lg)
- Glow effect
- Gradient background option

**Usage**:
```tsx
<GlassPanel
  variant="default"
  padding="md"
  border
  shadow="md"
  glow
  gradient
>
  Panel content here
</GlassPanel>
```

**Props**:
- `variant?: 'default' | 'subtle' | 'strong'` - Glass intensity
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding
- `border?: boolean` - Show border
- `shadow?: 'none' | 'sm' | 'md' | 'lg'` - Shadow intensity
- `glow?: boolean` - Enable glow effect
- `gradient?: boolean` - Add gradient background
- Plus all HTMLDivElement props

---

### 6. GlassInputContainer
**Purpose**: Input wrappers with glass effect

**Features**:
- Multiple variants
- Focus state styling
- Error state styling
- Icon support (left/right positioning)
- Action buttons area
- Smooth transitions

**Usage**:
```tsx
<GlassInputContainer
  variant="default"
  focused={isFocused}
  error={hasError}
  icon={<Search />}
  iconPosition="left"
  actions={<SendButton />}
>
  <Input />
</GlassInputContainer>
```

**Props**:
- `variant?: 'default' | 'subtle' | 'strong'` - Visual style
- `focused?: boolean` - Focus state
- `error?: boolean` - Error state
- `icon?: React.ReactNode` - Optional icon
- `iconPosition?: 'left' | 'right'` - Icon placement
- `actions?: React.ReactNode` - Action buttons
- Plus all HTMLDivElement props

---

## Composite Components

### GlassCard
**Purpose**: Complete card component with header and footer

**Usage**:
```tsx
<GlassCard
  variant="default"
  shadow="lg"
  header={<CardHeader />}
  footer={<CardFooter />}
>
  Card content
</GlassCard>
```

**Props**:
- All GlassPanel props
- `header?: React.ReactNode` - Card header
- `footer?: React.ReactNode` - Card footer

---

## Utility Components

### GlassDivider
**Purpose**: Divider lines with glass styling

**Usage**:
```tsx
<GlassDivider orientation="horizontal" variant="gradient" />
```

**Props**:
- `orientation?: 'horizontal' | 'vertical'` - Divider direction
- `variant?: 'solid' | 'gradient'` - Visual style

### GlassIconContainer
**Purpose**: Consistent icon containers with colored backgrounds

**Usage**:
```tsx
<GlassIconContainer
  icon={Brain}
  size="md"
  variant="primary"
/>
```

**Props**:
- `icon: LucideIcon` - Icon to display (required)
- `size?: 'sm' | 'md' | 'lg'` - Container size
- `variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'` - Color scheme

---

## Design Principles

### Consistency
All components follow the same glassmorphism design system defined in `globals.css`:
- `.glass` - Standard glass effect
- `.glass-subtle` - Lighter glass effect
- `.glass-strong` - More opaque glass effect

### Accessibility
- All interactive components support keyboard navigation
- Focus states are clearly visible
- Color contrast meets WCAG standards
- Proper ARIA attributes where applicable

### Performance
- CSS-based effects minimize JavaScript usage
- Transitions use GPU-accelerated properties
- Component re-renders are optimized with React.forwardRef
- No unnecessary DOM updates

### Composability
- Components accept all standard HTML props
- Custom className merging with cn() utility
- Ref forwarding for parent control
- Children composition support

---

## Integration with Existing System

These components are designed to work seamlessly with:
- **@clarity-chat/primitives** - Uses the same design tokens
- **@clarity-chat/react** - Can wrap or be wrapped by chat components
- **Tailwind CSS** - All styling uses Tailwind classes
- **CSS Variables** - Respects theme colors and dark mode

---

## Usage Examples

### Chat Interface
```tsx
function ChatInterface() {
  return (
    <GlassPanel variant="default" padding="none" shadow="lg">
      <div className="p-4">
        <GlassMessageBubble
          variant="assistant"
          avatar={<Avatar />}
          actions={<MessageActions />}
        >
          Hello! How can I help you?
        </GlassMessageBubble>
      </div>

      <GlassInputContainer
        icon={<Search />}
        actions={
          <>
            <GlassActionButton icon={Paperclip} />
            <GlassActionButton icon={Send} />
          </>
        }
      >
        <Input placeholder="Type a message..." />
      </GlassInputContainer>
    </GlassPanel>
  )
}
```

### Tool Execution Display
```tsx
function ToolExecutionPanel() {
  return (
    <GlassCard
      header={
        <div className="flex items-center gap-2">
          <GlassIconContainer icon={Wrench} />
          <h3>Active Tools</h3>
        </div>
      }
    >
      <div className="space-y-2">
        <GlassToolCard
          icon={Terminal}
          title="code_interpreter"
          status="running"
          duration="1.2s"
        />
        <GlassToolCard
          icon={Globe}
          title="web_search"
          status="completed"
          duration="0.8s"
        />
      </div>
    </GlassCard>
  )
}
```

### Status Dashboard
```tsx
function StatusDashboard() {
  return (
    <div className="flex flex-wrap gap-3">
      <GlassStatusBadge variant="success" icon={CheckCircle} pulse>
        System Online
      </GlassStatusBadge>
      <GlassStatusBadge variant="warning" icon={AlertTriangle}>
        High Load
      </GlassStatusBadge>
      <GlassStatusBadge variant="info" icon={Activity}>
        Processing
      </GlassStatusBadge>
    </div>
  )
}
```

---

## Best Practices

### Component Selection
- Use `GlassMessageBubble` for all chat messages
- Use `GlassToolCard` for tool/plugin displays
- Use `GlassStatusBadge` for status indicators
- Use `GlassActionButton` for all interactive buttons
- Use `GlassPanel` for content sections
- Use `GlassInputContainer` to wrap form inputs

### Styling
- Prefer component props over custom classes
- Use className only for layout/spacing
- Maintain consistent padding/margin patterns
- Follow the variant system (subtle/default/strong)

### Performance
- Memoize heavy children components
- Use callbacks for actions instead of inline functions
- Avoid deeply nested glass effects
- Limit the number of glow effects on screen

### Dark Mode
- All components automatically support dark mode
- Test in both light and dark themes
- Colors adjust via CSS variables
- No additional configuration needed

---

## Message Component Molecules

### 7. GlassMessageContainer
**Purpose**: Wrapper with proper spacing for message groups

**Features**:
- Automatic flex direction based on variant (user messages reversed)
- Smart spacing for grouped messages
- Support for first/last message indicators
- Smooth transitions

**Usage**:
```tsx
<GlassMessageContainer variant="assistant" isGrouped>
  <Avatar />
  <MessageContent />
</GlassMessageContainer>
```

**Props**:
- `variant?: 'user' | 'assistant' | 'system'` - Message type
- `isGrouped?: boolean` - Part of message group
- `isFirst?: boolean` - First in group
- `isLast?: boolean` - Last in group

---

### 8. GlassMessageHeader
**Purpose**: Name, timestamp, and status display

**Features**:
- Status indicators with icons (✓, ✓✓)
- Color-coded delivery status
- Avatar support
- Automatic layout for user/assistant variants

**Usage**:
```tsx
<GlassMessageHeader
  name="AI Assistant"
  timestamp="10:32 AM"
  status="read"
  avatar={<Avatar />}
/>
```

**Props**:
- `name?: string` - Sender name
- `avatar?: React.ReactNode` - Avatar component
- `timestamp?: string | React.ReactNode` - Message time
- `status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'`
- `variant?: 'user' | 'assistant' | 'system'`

---

### 9. GlassMessageContent
**Purpose**: Message body with markdown support

**Features**:
- Three variants: default (glass-subtle), code (monospace), rich (complex)
- Streaming cursor animation
- Hover effects
- Responsive padding

**Usage**:
```tsx
<GlassMessageContent variant="default">
  <p>Message text</p>
</GlassMessageContent>

<GlassMessageContent variant="code">
  {`const code = "example";`}
</GlassMessageContent>

<GlassMessageContent streaming>
  <p>Generating...</p>
</GlassMessageContent>
```

**Props**:
- `variant?: 'default' | 'code' | 'rich'` - Content style
- `markdown?: boolean` - Enable markdown
- `streaming?: boolean` - Show streaming cursor

---

### 10. GlassMessageFooter
**Purpose**: Reactions and read receipts

**Features**:
- Interactive reaction bubbles
- Read receipt avatars (shows 3, then +N)
- Click handlers
- Glass effect with active states
- Scale animations

**Usage**:
```tsx
<GlassMessageFooter
  reactions={[
    { emoji: '👍', count: 3, active: true },
    { emoji: '❤️', count: 1 }
  ]}
  readReceipts={[
    { name: 'Alice', avatar: 'A' },
    { name: 'Bob', avatar: 'B' }
  ]}
  onReactionClick={handleReaction}
/>
```

**Props**:
- `reactions?: Array<{ emoji: string; count: number; active?: boolean }>`
- `readReceipts?: Array<{ name: string; avatar?: string }>`
- `onReactionClick?: (emoji: string) => void`

---

### 11. GlassMessageActions
**Purpose**: Hover actions bar

**Features**:
- Absolute positioning with fade/scale animation
- Color-coded action variants
- Glass panel background
- Icon buttons with tooltips

**Usage**:
```tsx
<GlassMessageActions
  visible={isHovered}
  position="top"
  actions={[
    { icon: ThumbsUp, label: 'Like', onClick: handleLike },
    { icon: Copy, label: 'Copy', onClick: handleCopy },
    { icon: Trash2, label: 'Delete', variant: 'danger' }
  ]}
/>
```

**Props**:
- `actions?: Array<{ icon: LucideIcon; label: string; onClick?: () => void; variant?: 'default' | 'success' | 'warning' | 'danger' }>`
- `visible?: boolean` - Show/hide
- `position?: 'top' | 'bottom'`

---

### 12. GlassThreadIndicator
**Purpose**: Reply count badge

**Features**:
- Compact and expanded variants
- Last reply timestamp
- Clickable with hover states
- Vertical accent line

**Usage**:
```tsx
<GlassThreadIndicator
  count={5}
  lastReplyTime="1 hour ago"
  variant="expanded"
  onClick={openThread}
/>
```

**Props**:
- `count: number` - Number of replies (required)
- `lastReplyTime?: string` - Last reply time
- `onClick?: () => void` - Click handler
- `variant?: 'compact' | 'expanded'`

---

### 13. GlassTypingDots
**Purpose**: Animated typing indicator

**Features**:
- Three animation variants (dots, pulse, wave)
- Three sizes (sm, md, lg)
- Optional user label
- Avatar support
- Glass bubble container

**Usage**:
```tsx
<GlassTypingDots variant="dots" size="md" />

<GlassTypingDots
  variant="wave"
  userName="AI Assistant"
  showAvatar
  avatar={<Bot />}
/>
```

**Props**:
- `variant?: 'dots' | 'pulse' | 'wave'` - Animation style
- `size?: 'sm' | 'md' | 'lg'` - Indicator size
- `userName?: string` - Show typing label
- `showAvatar?: boolean` - Display avatar
- `avatar?: React.ReactNode` - Avatar component

---

## Future Enhancements

Planned additions to the molecule library:
- GlassTooltip - Tooltip with glass effect
- GlassModal - Modal dialog with glassmorphism
- GlassDropdown - Dropdown menu with glass styling
- GlassNotification - Toast/notification component
- GlassProgressBar - Progress indicator with glass effect
- GlassAccordion - Collapsible content with glass panels

---

## Migration Guide

### From Custom Cards to GlassCard
```tsx
// Before
<Card className="glass-card border-0">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>

// After
<GlassCard header={<CardHeader />}>
  ...content...
</GlassCard>
```

### From Custom Buttons to GlassActionButton
```tsx
// Before
<Button variant="ghost" className="glass">
  <Send className="h-4 w-4" />
  Send
</Button>

// After
<GlassActionButton icon={Send}>
  Send
</GlassActionButton>
```

### From Badge to GlassStatusBadge
```tsx
// Before
<Badge className="bg-green-500/20 text-green-600">
  Online
</Badge>

// After
<GlassStatusBadge variant="success">
  Online
</GlassStatusBadge>
```

---

## Troubleshooting

### Glass effect not visible
- Ensure parent container has a background
- Check z-index stacking context
- Verify backdrop-filter support in browser

### Components not responsive
- All components use Tailwind responsive classes
- Wrap in appropriate containers
- Use max-width utilities for content

### Dark mode issues
- Verify CSS variables are defined
- Check theme provider is wrapping app
- Ensure no hardcoded colors override system

---

## Support

For questions or issues:
1. Check the demo page at `/glass-demo`
2. Review component source in `components/glass-molecules.tsx`
3. Refer to the main design system in `globals.css`
4. Open an issue in the project repository
