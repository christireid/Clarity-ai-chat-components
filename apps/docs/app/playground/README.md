# Interactive Playground

Try Clarity Chat components live in your browser with our interactive playground.

## Features

- 🎨 **Live Code Editor** - Monaco Editor with TypeScript support
- ⚡ **Instant Preview** - See changes in real-time
- 📦 **10+ Templates** - Pre-built examples to get started
- 🔄 **Flexible Layout** - Side-by-side or stacked views
- 📤 **Export Options** - Download, share, or open in CodeSandbox
- 🎯 **Full Component Library** - All Clarity Chat components available
- 🌓 **Dark Mode** - Automatic theme switching

## Template Categories

### Basics
- Simple Chat - Get started with basic chat functionality
- Chat with Avatars - Add custom avatars and metadata
- Themed Chat - Apply custom colors and styling
- Thinking Indicator - Show AI processing state

### Advanced
- File Upload - Handle document uploads
- Markdown & Code - Rich content rendering
- RAG Document Chat - Retrieval with citations
- Error Handling - Graceful error recovery
- Streaming Progress - Progress tracking

### Interactive
- Command Palette - Keyboard-driven commands
- Follow-up Suggestions - Smart suggestion chips
- Keyboard Shortcuts - Custom hotkeys

### Optimization
- Token Tracking - Monitor usage and costs

### Monitoring
- Performance Dashboard - Real-time metrics
- Memory Inspector - Visualize conversation context
- Conversation Timeline - Event flow visualization

### Enterprise
- Enterprise SSO - Authentication setup

## How to Use

### 1. Select a Template
Browse templates in the left sidebar and click to load

### 2. Edit Code
Make changes in the Monaco editor - changes apply instantly

### 3. Preview
See your component render live in the preview panel

### 4. Share or Export
- **Copy Code** - Copy to clipboard
- **Download** - Save as .tsx file
- **Share** - Generate shareable URL
- **Open in CodeSandbox** - Continue building in full IDE

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Force re-run preview
- `Ctrl/Cmd + S` - Download code
- `Ctrl/Cmd + K` - Copy code
- `Ctrl/Cmd + /` - Toggle preview

## Layout Options

### Side-by-Side
- Code editor on left
- Live preview on right
- Drag divider to resize

### Stacked
- Code editor on top
- Live preview below
- Vertical resize handle

## Templates

All templates are production-ready and include:
- TypeScript definitions
- Proper error handling
- Responsive design
- Dark mode support
- Accessibility features

## Extending the Playground

### Add Custom Templates

Edit `lib/playground-templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Custom Template',
  category: 'custom',
  description: 'My custom example',
  code: `import { ChatWindow } from '@clarity-chat/react'
  
export default function App() {
  return <ChatWindow />
}`,
  dependencies: {
    // Additional npm packages if needed
  }
}
```

### Add New Categories

Categories are automatically generated from templates.

## Technical Details

### Dependencies
- `@monaco-editor/react` - Code editor
- `react-live` - Live code execution
- `@heroicons/react` - Icons
- `next-themes` - Theme switching

### Component Scope
All components from `@clarity-chat/react` are available:
- ChatWindow, Message, MessageList
- Button, Input, Avatar, Badge
- MemoryInspector, PerformanceDashboard
- And 50+ more components

### React Hooks Available
- useState, useEffect, useCallback, useMemo, useRef
- All Clarity Chat custom hooks

## Sharing

### Share URL Format
```
https://docs.clarity-chat.dev/playground?code=BASE64_ENCODED_CODE
```

### CodeSandbox Export
Automatically creates:
- `package.json` with dependencies
- `index.html` with React root
- `index.tsx` with app setup
- `App.tsx` with your code

## Troubleshooting

### Code Not Running
- Check for syntax errors in the editor
- Ensure all imports are correct
- Look for error messages below preview

### Preview Not Updating
- Try changing layout mode
- Refresh the page
- Check browser console for errors

### TypeScript Errors
- Monaco editor shows red underlines
- Hover for error details
- Fix or ignore for playground purposes

## Best Practices

1. **Start with a Template** - Don't start from scratch
2. **Keep Code Simple** - Playground is for demos, not full apps
3. **Use TypeScript** - Better autocomplete and error checking
4. **Test Responsiveness** - Resize preview to test
5. **Share Your Creations** - Help others learn

## Next Steps

After experimenting in the playground:
1. Copy code to your project
2. Install Clarity Chat: `npm install @clarity-chat/react`
3. Import components and use them
4. Refer to full documentation for advanced features

## Links

- [Documentation Home](/)
- [Component Reference](/reference/components)
- [Tutorials](/learn/tutorials)
- [Examples](/examples)
- [Cookbook](/cookbook)
