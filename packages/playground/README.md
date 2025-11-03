# @clarity-chat/playground

Interactive component playground and REPL for Clarity Chat.

## Features

- 🎨 **Live Code Editor** - Monaco Editor with TypeScript support
- 👁️ **Real-time Preview** - See changes instantly
- 📚 **Component Templates** - Pre-built examples to start from
- 🌓 **Dark Mode** - Light and dark themes
- 💾 **Save & Share** - Download or share your creations
- ⚡ **Auto-run** - Automatic preview updates
- 🎯 **Error Handling** - Clear error messages and debugging

## Usage

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Features

### Code Editor
- Full TypeScript support
- Syntax highlighting
- Auto-completion
- Format on paste/type
- Keyboard shortcuts

### Live Preview
- Real-time rendering
- Error boundaries
- Console output capture
- Responsive design testing

### Templates
- **Getting Started**: Basic examples
- **Chat Components**: UI components
- **Controls**: Interactive elements
- **Advanced**: Complex patterns

### Share & Export
- Copy code to clipboard
- Download as file
- Share via URL
- Import from URL

## Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save
- `Cmd/Ctrl + Enter` - Run code
- `Cmd/Ctrl + /` - Toggle comment
- `Cmd/Ctrl + D` - Duplicate line

## Examples

### Basic Chat
```typescript
import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([])
  // ... implementation
}
```

### Streaming Response
```typescript
async function simulateStreaming() {
  const words = text.split(' ')
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 100))
    setStreamedText(prev => prev + word + ' ')
  }
}
```

## Tips

1. **Use Templates** - Start with a template and modify it
2. **Auto-run** - Enable for instant feedback
3. **Error Messages** - Check the error panel for details
4. **Share Work** - Use the share button to get a URL
5. **Dark Mode** - Better for long coding sessions

## Troubleshooting

### Preview Not Updating
- Check for syntax errors
- Ensure auto-run is enabled
- Try the manual Run button

### Import Errors
- The playground uses UMD React builds
- External imports may not work
- Use inline code only

### Performance Issues
- Disable auto-run for complex code
- Use manual Run button instead
- Clear browser cache

## License

MIT

