# Button Locations & Functionality Map

## Chat Interface Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CHAT HEADER                                 │
│  ┌──────┐  Agentic Assistant [Online]                              │
│  │ 🧠  │  Claude 3.5 Sonnet • Tools Enabled                        │
│  └──────┘                                      Tokens: 2137/8000    │
│                                                [⚙️ Settings Button] │ → Opens Settings Modal
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       TOKEN BUDGET BAR                              │
│  Token Budget                                    26% used           │
│  [██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        MESSAGES AREA                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 🤖  Welcome! I'm an AI assistant...                          │ │
│  │                                                              │ │
│  │     [📋 Copy] [👍] [👎] [🔄 Regen] [📌 Pin] [⋯ Menu] ←──────│─│─ Message Actions
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                         Can you help me? 👤                  │ │
│  │                                                              │ │
│  │                        [✏️ Edit] [🗑️ Delete] ←─────────────────│─│─ User Message Actions
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 🧠 Thinking...                                                │ │
│  │   ✓ Understanding the request...                            │ │
│  │   ✓ Determining which tools to use...                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ ⚙️ web_search - Running... 1.5s                              │ │ ← Tool Execution Status
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    FILE UPLOAD PREVIEW                              │
│  Attached: [📎 document.pdf (125KB) ✕] [📎 image.png (45KB) ✕]    │ ← Remove File Buttons
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       INPUT AREA                                    │
│  [📎] ┌────────────────────────────────────────────┐ [🎤] [Send]   │
│   │   │ Ask me anything or request a tool...      │  │      │     │
│   │   └────────────────────────────────────────────┘  │      │     │
│   │                                                    │      │     │
│   └─ File Upload Button                                │      │     │
│                                              Voice Input      Send  │
│                                                 Button       Button │
│                                                                     │
│  ⏎ to send    / for commands    @ to mention                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Sidebar - Available Tools

```
┌───────────────────────────────────┐
│  🔧 Available Tools               │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ 🌐 web_search               │ │ ← Click to
│  │    Search the web           │ │   Execute Tool
│  │                      [Ready]│ │
│  └─────────────────────────────┘ │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ 💻 code_interpreter         │ │
│  │    Execute code             │ │
│  │                      [Ready]│ │
│  └─────────────────────────────┘ │
│                                   │
│  ... more tools ...               │
└───────────────────────────────────┘
```

## Sidebar - Quick Actions

```
┌───────────────────────────────────┐
│  ⚡ Quick Actions                 │
│                                   │
│  [💾 Export Chat] ────────────────│─── Downloads JSON
│                                   │
│  [🌳 Branch Conversation] ────────│─── Creates Branch
│                                   │
│  [🔗 Share] ──────────────────────│─── Shares Link
│                                   │
│  [📦 Archive] ────────────────────│─── Archives Chat
└───────────────────────────────────┘
```

## Settings Modal

```
┌─────────────────────────────────────────┐
│  Chat Settings                          │
│  Configure your chat experience         │
│                                         │
│  Model: [Claude 3.5 Sonnet ▼] ←────────│─── Model Selector
│                                         │
│  Temperature: 0.7                       │
│  [●─────────────────] 0 ─── 2 ←────────│─── Temperature Slider
│                                         │
│  Max Tokens: 4096                       │
│  [●──────────] 512 ─── 8192 ←──────────│─── Token Slider
│                                         │
│  Streaming        [●] ←─────────────────│─── Toggle Switches
│  Tools Enabled    [●]                   │
│  Memory           [●]                   │
│  Auto-save        [●]                   │
│                                         │
│          [Cancel]  [Save Settings] ←────│─── Action Buttons
└─────────────────────────────────────────┘
```

## Export Dialog

```
┌─────────────────────────────────────────┐
│  Export Chat                            │
│  Download your conversation history     │
│                                         │
│  Your export will include:              │
│  ✓ All messages (12 total)             │
│  ✓ Token usage data (2,137 tokens)     │
│  ✓ Timestamps and metadata             │
│  ✓ Tool executions and results         │
│  ✓ Citations and sources               │
│                                         │
│  ⚠️ Note: May contain sensitive info    │
│                                         │
│          [Cancel]  [💾 Export JSON] ←───│─── Export Button
└─────────────────────────────────────────┘
```

## Message Dropdown Menu

```
When clicking [⋯] on a message:

┌──────────────────┐
│ ✏️  Edit        │ ← Enable inline editing
│ 📌  Pin         │ ← Toggle pin status
│ 🔗  Share       │ ← Share message
│ ───────────────  │
│ 🗑️  Delete     │ ← Delete message
└──────────────────┘
```

## Message Edit Mode

```
When editing a message:

┌────────────────────────────────────────────┐
│ ╔════════════════════════════════════════╗ │
│ ║ Can you help me with this problem?    ║ │ ← Editable Textarea
│ ║                                        ║ │
│ ╚════════════════════════════════════════╝ │
│                      [Cancel]  [💾 Save] ←─│─── Edit Actions
└────────────────────────────────────────────┘
```

## Demo Components

### Code Terminal Demo
```
┌───────────────────────────────────────────────┐
│  Code & Terminal            [▶️ Run] [📋 Copy]│ ← Action Buttons
│                                               │
│  Tabs: [Code] [Terminal]                     │
│                                               │
│  Code Block or Terminal Output...             │
└───────────────────────────────────────────────┘
```

### Tool Approval Demo
```
┌───────────────────────────────────────────────┐
│  ⚠️ Tool Approval                             │
│                                               │
│  The AI wants to execute delete_user_data     │
│                                               │
│  { "user_id": "usr_123" }                     │
│                                               │
│  [✓ Approve]  [✕ Reject] ←────────────────────│─── Approval Buttons
└───────────────────────────────────────────────┘
```

### Retry Logic Demo
```
┌───────────────────────────────────────────────┐
│  🔄 Retry Logic                               │
│                                               │
│  Request Status: [Retrying]                   │
│  ⏳ Attempt 2 of 3...                         │
│  [████████████░░░░░░░░]                       │
│                                               │
│  [🔄 Simulate Retry] ←────────────────────────│─── Retry Button
└───────────────────────────────────────────────┘
```

### Notifications Demo
```
┌───────────────────────────────────────────────┐
│  🔔 Notifications                        [2]  │
│                                               │
│  ● New message               2m ←─────────────│─── Click to
│    AI responded to your query                 │    Mark Read
│                                               │
│  ● Task completed            5m               │
│    Code execution finished                    │
│                                               │
│    Memory updated           10m               │
│    New facts stored                           │
└───────────────────────────────────────────────┘
```

### Personas Demo
```
┌───────────────────────────────────────────────┐
│  👥 Personas                                  │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │ 💻 Code Assistant      [Active] │ ←───────│─── Click to
│  │    Expert in programming        │         │    Activate
│  └─────────────────────────────────┘         │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │ ✏️  Writing Helper              │         │
│  │    Creative writing & editing   │         │
│  └─────────────────────────────────┘         │
└───────────────────────────────────────────────┘
```

### Quick Replies Demo
```
┌───────────────────────────────────────────────┐
│  💬 Quick Replies                             │
│                                               │
│  [Yes, please continue] [Can you explain more?]│ ← Click to
│  [Show me an example] [That's helpful, thanks!]│   Send Reply
└───────────────────────────────────────────────┘
```

### Message Search Demo
```
┌───────────────────────────────────────────────┐
│  🔍 Message Search                            │
│                                               │
│  [🔍 Search messages...] ←────────────────────│─── Search Input
│                                               │
│  💬 How to implement React hooks... Yesterday │
│  💬 Best practices for TypeScript... 3 days   │ ← Click to
│  💬 Understanding async/await... Last week    │   Open Message
└───────────────────────────────────────────────┘
```

### Drafts & Archive Demo
```
┌───────────────────────────────────────────────┐
│  ✏️  Drafts & Archive                         │
│                                               │
│  Drafts                                       │
│  ✏️  Can you help me with... 2m ago   [🗑️] ←─│─── Delete Draft
│  ✏️  I need to understand... 1h ago   [🗑️]   │
│                                               │
│  ─────────────────────────────────────────    │
│                                               │
│  📦 Archived messages              [12] ←─────│─── Click to View
└───────────────────────────────────────────────┘
```

## Button Interaction States

### Idle State
```
[Button Text]
```

### Hover State
```
[Button Text]  (highlighted)
```

### Loading State
```
[⏳ Button Text]  (disabled, spinning icon)
```

### Success State
```
[✓ Button Text]  (green checkmark, auto-reset after 2s)
```

### Error State
```
[⚠️ Button Text]  (red, shows error)
```

## Keyboard Shortcuts

```
⏎ Enter         → Send message
⌘/Ctrl + Enter  → Force send (with Shift = new line)
/               → Open command palette
@               → Mention/tag
⌘/Ctrl + K      → Search messages
⌘/Ctrl + ,      → Open settings
⌘/Ctrl + E      → Export chat
Esc             → Close dialogs
```

## All Interactive Elements Summary

### Header (2 buttons)
1. **Settings Button** - Opens settings modal

### Message Actions (8 buttons per assistant message)
2. **Copy Button** - Copy message content
3. **Thumbs Up** - Positive feedback
4. **Thumbs Down** - Negative feedback
5. **Regenerate** - Get new response
6. **Forward** - Forward message
7. **Pin** - Pin/unpin message
8. **Menu Button** - Open dropdown
9. **Delete** (in menu) - Remove message

### User Message Actions (2 buttons)
10. **Edit Button** - Edit message
11. **Delete Button** - Remove message

### Input Area (3 buttons)
12. **File Upload** - Attach files
13. **Voice Input** - Record voice
14. **Send Button** - Send message

### Quick Actions (4 buttons)
15. **Export Chat** - Download JSON
16. **Branch Conversation** - Create branch
17. **Share** - Share conversation
18. **Archive** - Archive chat

### Tool Cards (5+ clickable cards)
19-23. **Tool Execution Buttons** - Run specific tools

### Dialogs (4+ dialogs)
- Settings Dialog (Save/Cancel buttons)
- Export Dialog (Export/Cancel buttons)
- Confirmation Dialogs (Confirm/Cancel buttons)

### Demo Components (20+ additional buttons)
- Code Run/Copy buttons
- Approval/Reject buttons
- Retry buttons
- Date picker buttons
- Notification buttons
- Persona selection buttons
- Quick reply buttons
- Search functionality
- Draft management

**Total: 30+ unique button types with full functionality!**
