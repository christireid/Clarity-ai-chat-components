# Message State Components - Clarity Design System

Comprehensive documentation of all message state-related components extracted from the Clarity repository.

## Table of Contents

1. [Typing Indicators](#typing-indicators)
2. [Read Receipts](#read-receipts)
3. [Delivery Status](#delivery-status)
4. [Message Reactions](#message-reactions)
5. [Message Timestamps](#message-timestamps)
6. [Message Grouping](#message-grouping)
7. [Message Separators](#message-separators)
8. [Presence & Online Status](#presence--online-status)
9. [Unread Indicators](#unread-indicators)

---

## 1. Typing Indicators

### Basic Typing Indicator
**Location:** `/tmp/clarity/components/ai/system-message.tsx`

```typescript
export interface TypingIndicatorProps {
  users?: string[];
  showNames?: boolean;
  className?: string;
}

export function TypingIndicator({
  users = [],
  showNames = true,
  className,
}: TypingIndicatorProps)
```

**Features:**
- Animated dots (3 dots bouncing with staggered delay)
- Shows single user: "{name} is typing"
- Shows two users: "{name1} and {name2} are typing"
- Shows multiple users: "{name1} and {n} others are typing"
- Can display anonymous "typing" text when showNames is false

**Animation:**
```typescript
<span
  className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
  style={{
    animationDelay: `${i * 0.15}s`,
    animationDuration: "0.6s",
  }}
/>
```

### Multi-User Typing Indicator
**Location:** `/tmp/clarity/components/ai/participants.tsx`

```typescript
export function MultiTypingIndicator({
  participants,
  className,
}: TypingIndicatorProps)
```

**Features:**
- Designed for collaboration scenarios
- Shows participant names and counts
- Animated accent-colored dots
- Same text logic as basic typing indicator

### Thinking Dots (AI-specific)
**Location:** `/tmp/clarity/components/ai/thinking-indicator.tsx`

```typescript
export function ThinkingDots({ className }: { className?: string })
```

**Features:**
- Inline typing indicator for AI thinking states
- 1.5px dots with 150ms delay between animations
- Uses current color for theming

### Typing Awareness (Collaboration)
**Location:** `/tmp/clarity/components/ai/presence.tsx`

```typescript
export function TypingAwareness({
  users,
  maxNames = 2,
  className,
}: TypingAwarenessProps)
```

**Features:**
- Shows up to 3 avatar thumbnails of typing users
- Includes animated typing dots
- Displays formatted text based on user count
- Integrates with User presence system

### TypingStatus
**Location:** `/tmp/clarity/components/ai/read-receipts.tsx`

```typescript
export function TypingStatus({
  users,
  maxNames = 2,
  className,
}: TypingStatusProps)
```

**Variants:**
- Single user: "{name} is typing"
- Multiple users (within maxNames): "{name1} and {name2} are typing"
- Many users: "{names} and {n} others are typing"

---

## 2. Read Receipts

**Location:** `/tmp/clarity/components/ai/read-receipts.tsx`

### Types

```typescript
export interface ReadReceipt {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  readAt: Date;
}
```

### ReadReceiptAvatars

```typescript
export function ReadReceiptAvatars({
  receipts,
  maxVisible = 5,
  size = "sm" | "md" | "lg",
  showTooltip = true,
  className,
}: ReadReceiptAvatarsProps)
```

**Features:**
- Stacked avatars with negative margin (-space-x-1)
- Shows first N users, "+X" for remaining
- Avatar fallback with initials
- Z-index management for proper stacking
- Tooltip showing all users and timestamps

**Size Classes:**
- sm: h-4 w-4, text-[8px]
- md: h-5 w-5, text-[10px]
- lg: h-6 w-6, text-xs

### ReadReceiptList

```typescript
export function ReadReceiptList({
  receipts,
  className,
}: ReadReceiptListProps)
```

**Features:**
- Full list view of all receipts
- Each row shows: avatar, name, timestamp, Eye icon
- Hover effect on rows
- Shows "No one has seen this message yet" when empty
- Formatted timestamp with locale string

### AvatarWithStatus

```typescript
export function AvatarWithStatus({
  src,
  name,
  status: OnlineStatus,
  size = "sm" | "md" | "lg",
  className,
}: AvatarWithStatusProps)
```

**Features:**
- Combines avatar with online status indicator
- Status dot positioned bottom-right with ring border
- Status colors: green (online), yellow (away), red (busy), gray (offline)

---

## 3. Delivery Status

**Location:** `/tmp/clarity/components/ai/read-receipts.tsx`

### MessageStatus Type

```typescript
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed"
```

### MessageStatusIndicator

```typescript
export function MessageStatusIndicator({
  status,
  timestamp?: Date,
  showLabel = false,
  size = "sm" | "md" | "lg",
  className,
}: MessageStatusIndicatorProps)
```

**Status Icons:**
- **sending**: Clock icon (gray)
- **sent**: Single check (gray)
- **delivered**: Double check (gray)
- **read**: Double check (primary color)
- **failed**: Alert circle (destructive red)

**Features:**
- Optional timestamp tooltip
- Size variants: sm (h-3 w-3), md (h-4 w-4), lg (h-5 w-5)
- Optional text label alongside icon
- Color coding for different states

**Status Configuration:**
```typescript
const statusConfig = {
  sending: {
    icon: Clock,
    label: "Sending...",
    color: "text-muted-foreground",
  },
  sent: {
    icon: Check,
    label: "Sent",
    color: "text-muted-foreground",
  },
  delivered: {
    icon: CheckCheck,
    label: "Delivered",
    color: "text-muted-foreground",
  },
  read: {
    icon: CheckCheck,
    label: "Read",
    color: "text-primary",
  },
  failed: {
    icon: AlertCircle,
    label: "Failed",
    color: "text-destructive",
  },
}
```

### Additional Status Components

**Location:** `/tmp/clarity/components/ai/status.tsx`

```typescript
export type StatusType = "success" | "error" | "warning" | "info" | "pending" | "idle"
```

**StatusBadge:**
- Colored badges with icons
- Size variants: sm, default, lg
- Spinning animation for "pending" status

**StatusDot:**
- Small colored dots
- Optional pulse animation
- Used for connection/presence states

**OnlineStatus:**
- Shows online/offline state
- Green dot with pulse for online
- Red dot for offline

---

## 4. Message Reactions

**Location:** `/tmp/clarity/components/ai/reactions.tsx`

### Types

```typescript
export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  reacted: boolean; // has current user reacted
}
```

### ReactionBadge

```typescript
export function ReactionBadge({
  reaction,
  onToggle,
  showUsers = true,
  size = "sm" | "md" | "lg",
  className,
}: ReactionBadgeProps)
```

**Features:**
- Rounded pill with emoji and count
- Different styles for user's own reaction (primary color)
- Tooltip showing all users who reacted
- Size variants: sm (h-6), md (h-7), lg (h-8)

### ReactionList

```typescript
export function ReactionList({
  reactions,
  onToggle,
  onAdd,
  showAddButton = true,
  maxVisible = 8,
  size = "sm" | "md" | "lg",
  className,
}: ReactionListProps)
```

**Features:**
- Grid of reaction badges
- Collapse/expand for many reactions
- "+N" badge for hidden reactions
- Add reaction button with picker

### ReactionPicker

```typescript
export function ReactionPicker({
  onSelect,
  size = "sm" | "md" | "lg",
  quickOnly = false,
  className,
}: ReactionPickerProps)
```

**Quick Reactions:**
```typescript
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉", "🔥", "👀"]
```

**Categories:**
- frequent
- smileys
- gestures
- symbols
- objects

**Features:**
- Popover with emoji grid
- Quick reactions row
- Category tabs
- Grid layout (10 columns)
- Quick-only mode for minimal picker

### QuickReactionBar

```typescript
export function QuickReactionBar({
  onSelect,
  emojis = QUICK_REACTIONS.slice(0, 6),
  className,
}: QuickReactionBarProps)
```

**Features:**
- Floating bar with quick emojis
- Divider + full picker button
- Hover scale animation
- Popover background with shadow

### AnimatedReaction

```typescript
export function AnimatedReaction({
  emoji,
  onComplete,
  className,
}: AnimatedReactionProps)
```

**Features:**
- Animated emoji that bounces up and fades
- 1-second animation duration
- Calls onComplete when done
- Used for reaction feedback

### ReactionSummary

```typescript
export function ReactionSummary({
  reactions,
  maxEmojis = 3,
  className,
}: ReactionSummaryProps)
```

**Features:**
- Compact view showing top reactions
- Overlapping emoji display with z-index
- Total count
- Used in message lists/previews

### MessageReactions

```typescript
export function MessageReactions({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  position = "below" | "inline" | "floating",
  className,
}: MessageReactionsProps)
```

**Position Variants:**
- below: mt-1
- inline: ml-2
- floating: absolute -bottom-3 left-4

### ReactionAnalytics

```typescript
export function ReactionAnalytics({
  reactions,
  className,
}: ReactionAnalyticsProps)
```

**Features:**
- Shows total reaction count
- Bar chart for each reaction
- Percentage calculation
- Sorted by count (descending)

### useReactions Hook

```typescript
export function useReactions(initialReactions: Reaction[] = [])
```

**Returns:**
```typescript
{
  reactions,
  addReaction,
  removeReaction,
  toggleReaction,
  setReactions,
}
```

---

## 5. Message Timestamps

**Location:** `/tmp/clarity/components/ai/timestamp.tsx`

### Timestamp

```typescript
export function Timestamp({
  date: Date | string | number,
  format = "relative" | "absolute" | "auto",
  absoluteFormat = "short" | "medium" | "long",
  showIcon = false,
  showTooltip = true,
  live = false,
  liveInterval = 60000,
  className,
}: TimestampProps)
```

**Formats:**
- **relative**: "just now", "5s ago", "3m ago", "2h ago", "5d ago"
- **absolute**: "Jan 1", "Jan 1, 3:45 PM", "January 1, 2024, 3:45 PM"
- **auto**: relative < 24h, absolute >= 24h

**Features:**
- Live updates when `live={true}`
- Optional Clock icon
- Tooltip with full timestamp
- Proper `<time>` semantic HTML

### MessageTimestamp

```typescript
export function MessageTimestamp({
  date: Date | string | number,
  edited = false,
  className,
}: MessageTimestampProps)
```

**Features:**
- Shows time for today's messages
- Shows "Mon 3, 3:45 PM" for older messages
- "(edited)" indicator
- Chat-optimized formatting

### TimeIndicator (from message-grouping.tsx)

```typescript
export function TimeIndicator({
  timestamp,
  format = "relative" | "absolute" | "smart",
  className,
}: TimeIndicatorProps)
```

**Smart Format:**
- < 1 min: "Just now"
- < 60 min: "Nm ago"
- < 24 hours: "Nh ago"
- >= 24 hours: "MMM d"

**Features:**
- Auto-updates every minute
- Reducer-based re-rendering
- Suppresses hydration warnings

### DurationDisplay

```typescript
export function DurationDisplay({
  seconds,
  showIcon = false,
  variant = "default" | "compact" | "verbose",
  className,
}: DurationDisplayProps)
```

**Variants:**
- **compact**: "5s", "3m", "2h"
- **default**: "5s", "3m 15s", "2h 30m"
- **verbose**: "5 seconds", "3 minutes 15 seconds", "2 hours 30 minutes"

### LiveTimer

```typescript
export function LiveTimer({
  startTime?: Date,
  endTime?: Date,
  direction = "up" | "down",
  onComplete,
  className,
}: LiveTimerProps)
```

**Features:**
- Counts up from start time or down to end time
- Updates every second
- Monospace font for stability
- Calls onComplete when countdown reaches zero
- Format: "HH:MM:SS" or "MM:SS"

### DateRangeDisplay

```typescript
export function DateRangeDisplay({
  start: Date | string | number,
  end: Date | string | number,
  showIcon = false,
  className,
}: DateRangeDisplayProps)
```

**Smart Formatting:**
- Same day: single timestamp
- Same month: "Jan 1 - 5"
- Same year: "Jan 1 - Feb 5"
- Different years: "Jan 1, 2023 - Feb 5, 2024"

### LastUpdated

```typescript
export function LastUpdated({
  date,
  label = "Last updated",
  onRefresh,
  isRefreshing = false,
  className,
}: LastUpdatedProps)
```

**Features:**
- Live relative timestamp
- Optional refresh button
- Spinning icon when refreshing
- Disabled state during refresh

---

## 6. Message Grouping

**Location:** `/tmp/clarity/components/ai/message-grouping.tsx`

### Types

```typescript
export interface GroupedMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface MessageGroup {
  id: string;
  sender?: GroupedMessage["sender"];
  role: GroupedMessage["role"];
  messages: GroupedMessage[];
  timestamp: Date;
}
```

### MessageGroup

```typescript
export function MessageGroup({
  messages,
  renderMessage,
  groupingThreshold = 5, // minutes
  showDateSeparators = true,
  dateSeparatorVariant = "default" | "subtle" | "badge",
  unreadFromId,
  className,
}: GroupedMessageListProps)
```

**Grouping Logic:**
- Groups messages from same sender within threshold
- Inserts date separators for different days
- Inserts unread separator at specified message ID
- Maintains chronological order

**Features:**
- Automatic grouping by time threshold
- Date separators between different days
- Unread message indicator
- Customizable rendering

### MessageGroupComponent

```typescript
export function MessageGroupComponent({
  group,
  renderMessage,
  showAvatar = true,
  showTimestamp = true,
  className,
}: MessageGroupProps)
```

**Features:**
- Avatar shown once per group
- Sender name at top of group
- Timestamp at bottom of group
- Flex-row-reverse for user messages
- AI badge for assistant messages

### CompactMessageGroup

```typescript
export function CompactMessageGroup({
  messages,
  maxVisible = 3,
  className,
}: CompactMessageGroupProps)
```

**Features:**
- Shows last N messages
- "Show N more messages" button
- Expandable/collapsible
- Minimal styling

---

## 7. Message Separators

### DateSeparator

**Location:** `/tmp/clarity/components/ai/message-grouping.tsx`

```typescript
export function DateSeparator({
  date,
  variant = "default" | "subtle" | "badge",
  className,
}: DateSeparatorProps)
```

**Date Labels:**
- "Today"
- "Yesterday"
- "MMMM d, yyyy"

**Variants:**

1. **default**: Horizontal lines with centered text
```typescript
<div className="flex items-center gap-4 py-4">
  <div className="flex-1 h-px bg-border" />
  <span className="text-xs font-medium">{label}</span>
  <div className="flex-1 h-px bg-border" />
</div>
```

2. **subtle**: Text only, centered
```typescript
<div className="flex justify-center py-2">
  <span className="text-xs text-muted-foreground">{label}</span>
</div>
```

3. **badge**: Pill badge, centered
```typescript
<div className="flex justify-center py-4">
  <span className="px-3 py-1 rounded-full bg-muted">{label}</span>
</div>
```

### UnreadSeparator

**Location:** `/tmp/clarity/components/ai/message-grouping.tsx`

```typescript
export function UnreadSeparator({
  count,
  className,
}: UnreadSeparatorProps)
```

**Features:**
- Primary color lines and badge
- Shows "{N} new messages" or "New messages"
- Centered divider with horizontal lines
- Stands out from date separators

### DividerMessage

**Location:** `/tmp/clarity/components/ai/system-message.tsx`

```typescript
export function DividerMessage({
  content,
  dashed = false,
  className,
}: DividerMessageProps)
```

**Features:**
- Horizontal divider with custom text
- Solid or dashed line variants
- Used for conversation section breaks

### DateDivider

**Location:** `/tmp/clarity/components/ai/system-message.tsx`

```typescript
export function DateDivider({
  date,
  format = "short" | "medium" | "long" | "relative",
  className,
}: DateDividerProps)
```

**Formats:**
- **short**: "1/15"
- **medium**: "Fri, Jan 15" (or Today/Yesterday)
- **long**: "Friday, January 15, 2024"
- **relative**: Today/Yesterday or full date

---

## 8. Presence & Online Status

**Location:** `/tmp/clarity/components/ai/presence.tsx`

### Types

```typescript
export type PresenceStatus = "online" | "offline" | "away" | "busy" | "invisible"

export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "reconnecting" | "error"

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: PresenceStatus;
  lastSeen?: Date;
  isTyping?: boolean;
  customStatus?: string;
}
```

### PresenceDot

```typescript
export function PresenceDot({
  status,
  size = "sm" | "md" | "lg",
  pulse = true,
  className,
}: PresenceDotProps)
```

**Status Colors:**
- online: green-500 (with pulse)
- offline: gray-400
- away: yellow-500
- busy: red-500
- invisible: gray-400

**Sizes:**
- sm: w-2 h-2
- md: w-3 h-3
- lg: w-4 h-4

### UserPresence

```typescript
export function UserPresence({
  user,
  showName = true,
  showStatus = false,
  size = "sm" | "md" | "lg",
  className,
}: UserPresenceProps)
```

**Features:**
- Avatar with presence dot overlay
- Optional name and custom status
- Tooltip with full details
- Last seen time (relative format)
- Typing indicator in tooltip

### PresenceList

```typescript
export function PresenceList({
  users,
  maxVisible = 5,
  size = "sm" | "md" | "lg",
  className,
}: PresenceListProps)
```

**Features:**
- Stacked avatars with negative margin
- "+N" indicator for overflow
- Ring borders for separation
- Individual tooltips

### ConnectionStatusIndicator

```typescript
export function ConnectionStatusIndicator({
  status,
  onRetry,
  showLabel = true,
  className,
}: ConnectionStatusProps)
```

**Status States:**
- **connected**: Green Wifi icon
- **connecting**: Spinning RefreshCw icon (yellow)
- **disconnected**: Gray WifiOff icon
- **reconnecting**: Spinning RefreshCw icon (yellow)
- **error**: Red AlertCircle icon

**Features:**
- Optional retry button for disconnected/error states
- Color-coded icons and labels
- Loading spinner animations

### WhosHere

```typescript
export function WhosHere({
  users,
  currentUserId,
  className,
}: WhosHereProps)
```

**Features:**
- Grouped by status (Online, Away)
- Shows count per group
- Excludes current user
- UserPresence cards for each user

### LiveCursors

```typescript
export function LiveCursors({
  cursors,
  className,
}: LiveCursorsProps)
```

**Features:**
- Real-time cursor positions
- Custom color per user
- Name label next to cursor
- Smooth transitions (75ms)
- Absolute positioning overlay

### OnlineStatusIndicator (from read-receipts.tsx)

```typescript
export function OnlineStatusIndicator({
  status: OnlineStatus,
  size = "sm" | "md" | "lg",
  showLabel = false,
  className,
}: OnlineStatusIndicatorProps)
```

**Features:**
- Circular status indicator
- Optional text label
- Size variants

### LastSeen

```typescript
export function LastSeen({
  lastSeen?: Date,
  online = false,
  className,
}: LastSeenProps)
```

**Format:**
- Online: "Online now" (green)
- < 1 min: "just now"
- < 60 min: "Nm ago"
- < 24 hours: "Nh ago"
- < 7 days: "Nd ago"
- >= 7 days: Full date

---

## 9. Unread Indicators

**Location:** `/tmp/clarity/components/ai/unread-indicator.tsx`

### UnreadBadge

```typescript
export function UnreadBadge({
  count,
  max = 99,
  variant = "default" | "dot" | "pulse",
  size = "sm" | "md" | "lg",
  className,
}: UnreadBadgeProps)
```

**Variants:**

1. **default**: Standard badge with count
   - Shows count or "99+"
   - Primary background

2. **dot**: Small dot indicator
   - 2.5px rounded circle
   - No count shown

3. **pulse**: Pulsing badge
   - Includes count
   - Animated ping effect
   - Draws attention

**Sizes:**
- sm: min-w-4 h-4, text-[10px]
- md: min-w-5 h-5, text-xs
- lg: min-w-6 h-6, text-sm

### NewMessagesBanner

```typescript
export function NewMessagesBanner({
  count,
  onClick,
  onDismiss,
  position = "top" | "bottom",
  className,
}: NewMessagesBannerProps)
```

**Features:**
- Floating banner with new message count
- Arrow down icon
- Optional dismiss button
- Rounded pill design with shadow
- Position at top or bottom of viewport

### JumpToUnread

```typescript
export function JumpToUnread({
  hasUnread,
  unreadCount,
  onClick,
  className,
}: JumpToUnreadProps)
```

**Features:**
- Button to scroll to first unread
- Shows unread count badge
- ChevronDown icon
- Only visible when unread exists

### ConversationUnreadIndicator

```typescript
export function ConversationUnreadIndicator({
  unreadCount,
  lastMessagePreview,
  lastMessageTime,
  onClick,
  className,
}: ConversationUnreadProps)
```

**Features:**
- Shows last message preview
- Relative timestamp
- Unread badge on right
- Different background when unread
- Bold text for unread messages

### ChannelUnreadState

```typescript
export function ChannelUnreadState({
  channels,
  onChannelClick,
  className,
}: ChannelUnreadStateProps)
```

**Features:**
- List of channels with unread counts
- "@" indicator for mentions
- Different styling for mentions
- Total unread count summary
- Clickable channel rows

### useUnreadTracking Hook

```typescript
export function useUnreadTracking({
  initialUnreadId,
  onMarkAsRead,
}: UseUnreadTrackingOptions)
```

**Returns:**
```typescript
{
  firstUnreadId: string | undefined,
  unreadCount: number,
  markAsRead: (messageIds: string[]) => void,
  addUnread: (messageId: string) => void,
  clearUnread: () => void,
}
```

**Features:**
- Tracks first unread message
- Maintains unread count
- Marks messages as read
- Integrates with intersection observer for auto-marking
- Callback support for persistence

---

## Additional Message Components

### SystemMessage

**Location:** `/tmp/clarity/components/ai/system-message.tsx`

```typescript
export type SystemMessageType =
  | "info" | "warning" | "error" | "success"
  | "notification" | "update" | "security" | "feature"

export function SystemMessage({
  type = "info",
  title,
  content,
  icon,
  timestamp,
  showTimestamp = false,
  dismissible = false,
  onDismiss,
  action,
  variant = "default" | "filled" | "outlined" | "subtle",
  size = "sm" | "md" | "lg",
  className,
}: SystemMessageProps)
```

**Features:**
- 8 semantic types with color coding
- Optional title and custom icon
- Dismissible with X button
- Call-to-action button
- Timestamp display
- 4 visual variants

### SystemBubble

```typescript
export function SystemBubble({
  content,
  variant = "filled" | "outlined" | "shadow" | "borderless",
  shape = "default" | "round" | "corner",
  className,
}: SystemBubbleProps)
```

**Features:**
- Centered in message flow
- Various visual styles
- Shape variations
- Used for system notifications in chat

### NotificationBubble

```typescript
export function NotificationBubble({
  type,
  title,
  content,
  icon,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  position = "top-left" | "top-right" | "bottom-left" | "bottom-right",
  className,
}: NotificationBubbleProps)
```

**Features:**
- Fixed position overlay
- Auto-dismiss timer
- Slide-in animation
- Close button
- Color-coded by type

---

## Implementation Patterns

### Common Patterns

1. **Size Variants**: Most components support sm/md/lg sizes
2. **Tooltips**: Used extensively for additional context
3. **Animations**: Consistent use of Tailwind animations
4. **Color Theming**: Uses CSS variables for dark mode support
5. **Accessibility**: Semantic HTML, ARIA attributes, keyboard support

### Animation Patterns

**Typing Dots:**
```typescript
style={{
  animationDelay: `${index * 150}ms`,
  animationDuration: "0.6s"
}}
className="animate-bounce"
```

**Pulse Effect:**
```typescript
<span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
```

**Shimmer/Loading:**
```typescript
className="animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%]"
```

### Stacking Patterns

**Avatar Stacking:**
```typescript
<div className="flex -space-x-2">
  {items.map((item, i) => (
    <div key={i} style={{ zIndex: items.length - i }}>
      {/* avatar */}
    </div>
  ))}
</div>
```

**Emoji Stacking:**
```typescript
<div className="flex -space-x-1">
  {emojis.map((emoji, i) => (
    <span key={i} style={{ zIndex: maxEmojis - i }}>
      {emoji}
    </span>
  ))}
</div>
```

### Time Formatting Patterns

**Relative Time:**
```typescript
const getRelativeTime = (date: Date) => {
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}
```

**Smart Format:**
```typescript
// Recent: relative, Old: absolute
return diffHours < 24
  ? formatRelativeTime(date)
  : formatAbsoluteTime(date);
```

### Grouping Algorithm

```typescript
// Group messages by sender and time threshold
for (const message of messages) {
  // Insert date separator if different day
  if (!lastDate || !isSameDay(lastDate, message.timestamp)) {
    if (currentGroup) result.push({ type: "group", data: currentGroup });
    result.push({ type: "date", data: message.timestamp });
    currentGroup = null;
  }

  // Check if should continue current group
  const shouldGroup =
    currentGroup &&
    currentGroup.role === message.role &&
    currentGroup.sender?.id === message.sender?.id &&
    differenceInMinutes(message.timestamp, lastMessage.timestamp) < threshold;

  if (shouldGroup) {
    currentGroup.messages.push(message);
  } else {
    if (currentGroup) result.push({ type: "group", data: currentGroup });
    currentGroup = createNewGroup(message);
  }
}
```

---

## Component Dependencies

### UI Components Used:
- Avatar, AvatarFallback, AvatarImage
- Badge
- Button
- Card (various)
- Collapsible, CollapsibleContent, CollapsibleTrigger
- DropdownMenu (various)
- Popover, PopoverContent, PopoverTrigger
- ScrollArea
- Tooltip, TooltipContent, TooltipProvider, TooltipTrigger

### Icons (lucide-react):
- Status: Check, CheckCheck, CheckCircle, Clock, AlertCircle, Loader2, Eye
- Actions: Copy, ThumbsUp, ThumbsDown, Edit2, RefreshCw, MoreHorizontal
- Communication: MessageSquare, Users, Bell, AtSign
- Presence: Wifi, WifiOff, Activity, MousePointer2
- UI: ChevronDown, ChevronRight, X, Plus, SmilePlus
- Media: ImageIcon, FileText, Film, Music, Code, Paperclip

### Utilities:
- `cn()` - Tailwind class merging
- `format()` from date-fns
- `isToday()`, `isYesterday()`, `isSameDay()`, `differenceInMinutes()` from date-fns

---

## Usage Examples

### Complete Message with All States

```typescript
<div className="message-container">
  {/* User typing */}
  <TypingIndicator users={["Alice", "Bob"]} showNames />

  {/* Date separator */}
  <DateSeparator date={new Date()} variant="default" />

  {/* Message group */}
  <MessageGroup
    messages={messages}
    groupingThreshold={5}
    showDateSeparators
    unreadFromId="msg-123"
    renderMessage={(msg, isFirst, isLast) => (
      <div className="message-bubble">
        {/* Message content */}
        <p>{msg.content}</p>

        {/* Reactions */}
        {isLast && (
          <MessageReactions
            messageId={msg.id}
            reactions={msg.reactions}
            onAddReaction={handleAdd}
            onRemoveReaction={handleRemove}
            position="below"
          />
        )}

        {/* Timestamp and status */}
        <div className="flex items-center gap-2">
          <MessageTimestamp date={msg.timestamp} />
          <MessageStatusIndicator status="read" />
        </div>
      </div>
    )}
  />

  {/* Read receipts */}
  <ReadReceiptAvatars
    receipts={receipts}
    maxVisible={5}
    showTooltip
  />
</div>
```

### Presence Sidebar

```typescript
<div className="sidebar">
  {/* Connection status */}
  <ConnectionStatusIndicator status="connected" showLabel />

  {/* Who's here */}
  <WhosHere users={users} currentUserId={currentUser.id} />

  {/* Typing awareness */}
  <TypingAwareness users={typingUsers} />

  {/* Unread channels */}
  <ChannelUnreadState
    channels={channels}
    onChannelClick={handleChannelClick}
  />
</div>
```

### Collaborative Editor

```typescript
<div className="editor-container">
  {/* Live cursors */}
  <LiveCursors cursors={activeCursors} />

  {/* Collaborator list */}
  <CollaboratorAvatars
    collaborators={collaborators}
    maxVisible={5}
    showStatus
    onCollaboratorClick={handleClick}
  />

  {/* Multi-user typing */}
  <MultiTypingIndicator
    participants={typingParticipants}
  />
</div>
```

---

## File Locations Summary

| Component | File Path |
|-----------|-----------|
| Typing Indicators | `/tmp/clarity/components/ai/system-message.tsx` |
| Multi Typing | `/tmp/clarity/components/ai/participants.tsx` |
| Thinking Indicators | `/tmp/clarity/components/ai/thinking-indicator.tsx` |
| Read Receipts | `/tmp/clarity/components/ai/read-receipts.tsx` |
| Message Status | `/tmp/clarity/components/ai/read-receipts.tsx` |
| Reactions | `/tmp/clarity/components/ai/reactions.tsx` |
| Timestamps | `/tmp/clarity/components/ai/timestamp.tsx` |
| Message Grouping | `/tmp/clarity/components/ai/message-grouping.tsx` |
| Separators | `/tmp/clarity/components/ai/message-grouping.tsx` |
| System Messages | `/tmp/clarity/components/ai/system-message.tsx` |
| Presence | `/tmp/clarity/components/ai/presence.tsx` |
| Unread Indicators | `/tmp/clarity/components/ai/unread-indicator.tsx` |
| Status Components | `/tmp/clarity/components/ai/status.tsx` |
| Message Display | `/tmp/clarity/components/ai/message.tsx` |
| Collaboration | `/tmp/clarity/components/ai/collaboration.tsx` |

---

## Design Tokens

### Colors (Status)
- Success: green-500
- Error/Failed: red-500 (destructive)
- Warning: yellow-500
- Info: blue-500
- Primary: theme primary color
- Muted: theme muted-foreground
- Away: yellow-500
- Busy: red-500
- Offline: gray-400

### Spacing
- Avatar stacking: -space-x-1 to -space-x-2
- Gap between elements: gap-1 to gap-4
- Padding (badges): px-1.5 to px-4
- Border radius: rounded-full (badges), rounded-lg (cards)

### Typography
- Message content: text-sm
- Timestamps: text-xs
- Metadata: text-muted-foreground
- Emphasis: font-medium
- Code/time: font-mono tabular-nums

### Animation Durations
- Typing dots: 0.6s
- Pulse: default
- Transitions: 75ms (cursors), 300ms (general)
- Auto-close: 5000ms (notifications)
- Live updates: 60000ms (timestamps)

---

## Best Practices

1. **Always provide feedback**: Show typing, sending, sent states
2. **Use relative times** for recent activity, absolute for old
3. **Group messages** to reduce visual clutter
4. **Provide tooltips** for additional context
5. **Make interactive elements clear** with hover states
6. **Support keyboard navigation** on all controls
7. **Auto-update timestamps** for live feel
8. **Show presence** for collaborative experiences
9. **Use semantic colors** for different states
10. **Provide optimistic UI** updates before server confirmation

---

## Accessibility Considerations

- Semantic HTML (`<time>`, proper ARIA attributes)
- Keyboard navigation support
- Screen reader announcements for state changes
- Sufficient color contrast
- Focus indicators
- Alternative text for icons
- Reduced motion support for animations

---

*Documentation generated from Clarity repository analysis*
