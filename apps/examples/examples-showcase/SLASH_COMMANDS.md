# Slash Command System

A fully functional slash command system with glassmorphism popup for the Clarity Chat Components Showcase.

## Features

### Command Palette
- **Glassmorphism Design**: Beautiful, modern UI with frosted glass effect
- **Smart Search**: Real-time filtering as you type
- **Category Organization**: Commands grouped by type (Chat, Settings, View, Help)
- **Keyboard Navigation**: Full arrow key and Enter/Escape support
- **Responsive**: Works on desktop and mobile devices

### Command Input
- **Slash Detection**: Automatically opens palette when "/" is typed
- **Visual Feedback**: Shows command mode indicator
- **Auto-resize**: Textarea grows with content
- **Keyboard Shortcuts**:
  - `Enter` to send
  - `Shift + Enter` for new line
  - `Escape` to close palette

## Available Commands

### Chat Commands
- `/clear` - Clear all messages (Ctrl+L)
- `/export` - Export chat history (Ctrl+E)

### Settings Commands
- `/model` - Change AI model
- `/theme` - Switch theme (Ctrl+T)
- `/settings` - Open settings panel (Ctrl+,)

### View Commands
- `/components` - View component library
- `/templates` - View pre-built templates
- `/themes` - Browse all themes
- `/playground` - Return to playground

### Help Commands
- `/help` - Show all available commands and tips

## Usage

### For Users

1. **Open Command Palette**: Type "/" in the chat input
2. **Search Commands**: Continue typing to filter commands
3. **Navigate**: Use ↑/↓ arrow keys to select
4. **Execute**: Press Enter to run the command
5. **Cancel**: Press Escape to close

### For Developers

#### Basic Setup

```tsx
import { CommandInput } from './components/CommandInput'
import type { Command } from './components/CommandPalette'

const commands: Command[] = [
  {
    id: 'clear',
    label: '/clear',
    description: 'Clear all messages',
    icon: '🗑️',
    category: 'chat',
    action: () => {
      // Your action here
    },
    shortcut: 'Ctrl+L', // Optional
  },
]

function ChatApp() {
  return (
    <CommandInput
      onSendMessage={handleSend}
      commands={commands}
    />
  )
}
```

#### Adding Custom Commands

```tsx
const customCommand: Command = {
  id: 'unique-id',
  label: '/commandname',
  description: 'What this command does',
  icon: '📌', // Emoji icon
  category: 'chat' | 'settings' | 'view' | 'help',
  action: () => {
    // Execute your command logic
  },
  shortcut: 'Ctrl+K', // Optional keyboard shortcut
}
```

## Component API

### CommandInput Props

```tsx
interface CommandInputProps {
  onSendMessage: (message: string) => void
  commands: Command[]
  placeholder?: string
  disabled?: boolean
}
```

### CommandPalette Props

```tsx
interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
  position: { top: number; left: number }
  searchQuery: string
}
```

### Command Interface

```tsx
interface Command {
  id: string                  // Unique identifier
  label: string              // Display name (e.g., "/clear")
  description: string        // Help text
  icon: string              // Emoji or icon
  category: 'chat' | 'settings' | 'view' | 'help'
  action: () => void        // Function to execute
  shortcut?: string         // Optional keyboard shortcut
}
```

## Styling

The components use CSS custom properties and support both light and dark themes automatically:

### Glassmorphism Effect
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow:
  0 8px 32px rgba(0, 0, 0, 0.1),
  0 4px 16px rgba(0, 0, 0, 0.06);
```

### Dark Mode Support
The components automatically detect dark themes and adjust the glassmorphism effect:
```css
.dark-theme .command-palette {
  background: rgba(20, 20, 30, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
}
```

## Keyboard Shortcuts

### In Command Palette
- `↑` / `↓` - Navigate commands
- `Enter` - Execute selected command
- `Escape` - Close palette

### In Input Field
- `/` - Open command palette
- `Enter` - Send message
- `Shift + Enter` - New line
- `Escape` - Close palette (if open)

## File Structure

```
src/
├── components/
│   ├── CommandPalette.tsx      # Main palette component
│   ├── CommandPalette.css      # Glassmorphism styles
│   ├── CommandInput.tsx        # Input with slash detection
│   ├── CommandInput.css        # Input styles
│   └── index.ts               # Component exports
└── App.tsx                     # Integration example
```

## Examples

### Theme Switching Command

```tsx
{
  id: 'theme',
  label: '/theme',
  description: 'Switch between available themes',
  icon: '🎨',
  category: 'settings',
  action: () => {
    const themes = ['light', 'dark', 'ocean']
    const next = themes[(current + 1) % themes.length]
    setTheme(next)
  },
  shortcut: 'Ctrl+T',
}
```

### Export Chat Command

```tsx
{
  id: 'export',
  label: '/export',
  description: 'Export chat history to file',
  icon: '💾',
  category: 'chat',
  action: () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
}
```

## Accessibility

- Full keyboard navigation support
- ARIA labels on interactive elements
- Clear visual focus indicators
- Screen reader friendly
- Responsive design for all devices

## Browser Support

- Chrome/Edge 88+
- Firefox 90+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight components (< 10KB gzipped)
- Optimized re-renders with React.memo
- Smooth 60fps animations
- Lazy command filtering
- Efficient event handling

## Future Enhancements

Planned features for future releases:

- Command history
- Recent commands section
- Command aliases
- Fuzzy search
- Command arguments
- Custom command categories
- Command templates
- Analytics integration

## Contributing

To add new commands or features:

1. Add command definition to the `commands` array
2. Implement the action handler
3. Test keyboard navigation
4. Verify dark mode appearance
5. Update documentation

## License

MIT License - See LICENSE file for details
