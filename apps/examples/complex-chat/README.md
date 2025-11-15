# Complex Chat Example

This example demonstrates enterprise-grade usage of Clarity Chat with:

- **Custom Layout**: Using `ChatLayout` with sidebar, header, and footer
- **Memory Integration**: Using `MemoryProvider` and `useMemoryStore` for conversation memory
- **Message Operations**: Edit, regenerate, and delete messages
- **Analytics**: Integrated analytics tracking
- **Error Handling**: Comprehensive error handling
- **Custom Styling**: Custom theme and styling

## Features Demonstrated

1. **Layered Architecture**: Shows how to compose mid-level APIs (`ChatLayout`, `MemoryProvider`) with top-level APIs (`ClarityChat`)
2. **Memory System**: Demonstrates memory integration for context-aware conversations
3. **Analytics**: Shows how to integrate analytics for tracking user behavior
4. **Custom Layout**: Demonstrates flexible layout composition
5. **Error Handling**: Shows proper error handling patterns

## Running the Example

```bash
cd apps/examples/complex-chat
pnpm install
pnpm dev
```

## Code Structure

- `App.tsx` - Main application component
- `MemorySidebar` - Custom sidebar showing memory context
- `ChatHeader` - Custom header component
- `ChatFooter` - Custom footer component

This example shows how to build a production-ready chat application using Clarity Chat's layered API architecture.
