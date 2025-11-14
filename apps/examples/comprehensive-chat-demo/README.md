# Comprehensive Chat Demo

This example demonstrates **all modern AI chat features** working together in a single application.

## Features Demonstrated

### ✅ Message Operations
- Edit user messages
- Regenerate AI responses
- Delete any message
- Undo/Redo with keyboard shortcuts (Ctrl+Z, Ctrl+Y)

### ✅ Conversation Management
- Multiple conversations
- Conversation list with search
- Pin/favorite conversations
- Conversation branching

### ✅ Search & Discovery
- Advanced message search with filters
- Full-text search with highlighting
- Filter by role, date, model, tokens

### ✅ Export & Organization
- Export to Markdown, JSON, plain text
- Command palette (Ctrl+K)
- Keyboard shortcuts throughout

### ✅ Advanced Features
- Token tracking and cost estimation
- Citation display (RAG)
- Auto-scroll
- Error boundary

## Running

```bash
npm install
npm run dev
```

## Keyboard Shortcuts

- **Ctrl+K** (or Cmd+K) - Open command palette
- **Ctrl+Z** - Undo last operation
- **Ctrl+Y** - Redo last undone operation
- **Ctrl+B** - Toggle sidebar
- **Ctrl+N** - New chat
- **Ctrl+E** - Export conversation

## Architecture

This demo showcases:
- Integration of multiple hooks (`useMessageOperations`, `useTokenTracker`, `useAutoScroll`)
- Multiple components working together (`ChatWindow`, `ConversationList`, `AdvancedMessageSearch`, `CommandPalette`, `CitationCard`)
- Keyboard shortcuts and command palette
- Conversation management
- Export functionality

## Use Cases

Perfect for:
- Understanding how all features work together
- Reference implementation for production apps
- Testing feature integration
- Demonstrating capabilities to stakeholders
