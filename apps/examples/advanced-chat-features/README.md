# Advanced Chat Features Example

This example demonstrates all modern AI chat features available in Clarity Chat.

## Features Demonstrated

- ✅ **Message Operations**
  - Edit user messages
  - Regenerate AI responses
  - Delete any message

- ✅ **Undo/Redo**
  - Full operation history
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

- ✅ **Conversation Branching**
  - Create alternative conversation paths
  - Switch between branches

- ✅ **Export Functionality**
  - Export to Markdown
  - Export to JSON
  - Export to plain text

- ✅ **Token Tracking**
  - Real-time token counting
  - Cost estimation

- ✅ **Auto-scroll**
  - Smooth scrolling to new messages

## Running

```bash
npm install
npm run dev
```

## Usage

1. **Edit Messages**: Hover over a user message and click "Edit"
2. **Regenerate**: Hover over an AI response and click "Regenerate"
3. **Delete**: Hover over any message and click "Delete"
4. **Undo/Redo**: Use the buttons in the header or keyboard shortcuts
5. **Export**: Click the "Export" button to save the conversation
6. **Branch**: Create conversation branches (coming soon)

## Code Highlights

This example shows how to:
- Use `useMessageOperations` hook for message management
- Integrate token tracking
- Handle edit/regenerate/delete operations
- Export conversations
- Implement undo/redo functionality
