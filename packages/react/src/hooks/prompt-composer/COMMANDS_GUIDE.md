# PromptComposer Slash Commands Guide

Complete guide to implementing and using slash commands in PromptComposer.

## Table of Contents

- [Overview](#overview)
- [Built-in Commands](#built-in-commands)
- [Basic Usage](#basic-usage)
- [Custom Commands](#custom-commands)
- [Advanced Features](#advanced-features)
- [Integration Patterns](#integration-patterns)
- [Best Practices](#best-practices)

## Overview

The slash command system provides a keyboard-driven interface for executing actions in PromptComposer. Users can type `/` followed by a command name to quickly access features without mouse interaction.

**Key Features:**
- 6 built-in commands for common actions
- Fuzzy search autocomplete
- Keyboard navigation (arrow keys, enter, escape)
- Command categories and grouping
- Recent commands tracking
- Custom command registration
- Dynamic availability

## Built-in Commands

The system includes 6 essential commands out of the box:

### `/clear` - Clear Conversation
Clears all messages and starts a fresh conversation.
- **Shortcut:** `Ctrl+Shift+C`
- **Category:** conversation

### `/save` - Save Conversation
Saves the current conversation to history.
- **Shortcut:** `Ctrl+S`
- **Category:** conversation

### `/load` - Load Conversation
Loads a previously saved conversation.
- **Category:** conversation

### `/context` - Manage Context
Add or remove context items (@mentions).
- **Category:** context

### `/model` - Switch Model
Change the active AI model.
- **Category:** settings

### `/settings` - Open Settings
Configure chat preferences.
- **Shortcut:** `Ctrl+,`
- **Category:** settings

## Basic Usage

### 1. Hook Setup

```tsx
import { usePromptCommands } from '@clarity-chat/react/hooks'

function MyChat() {
  const commands = usePromptCommands({
    fuzzySearch: true,
    maxRecent: 5,
    onCommandExecute: (command, args) => {
      console.log(`Executed: ${command.label}`, args)
    }
  })

  return (
    <div>
      {/* Your UI */}
    </div>
  )
}
```

### 2. Detect Slash Commands

```tsx
import { usePromptCommands } from '@clarity-chat/react/hooks'

function ChatInput() {
  const [input, setInput] = useState('')
  const commands = usePromptCommands()

  const handleInputChange = (value: string) => {
    setInput(value)

    // Detect slash commands
    if (value.startsWith('/')) {
      const query = value.slice(1) // Remove leading /
      commands.search(query)
    } else if (commands.isActive) {
      commands.cancel()
    }
  }

  return (
    <textarea
      value={input}
      onChange={(e) => handleInputChange(e.target.value)}
      placeholder="Type / for commands..."
    />
  )
}
```

### 3. Render Command Palette

```tsx
import { CommandPalette } from '@clarity-chat/react/components'

function ChatInput() {
  const commands = usePromptCommands()

  return (
    <div className="relative">
      <textarea {...inputProps} />

      {commands.isActive && (
        <CommandPalette
          commands={commands.filteredCommands}
          query={commands.query}
          selectedIndex={commands.selectedIndex}
          onExecute={(cmd) => commands.execute(cmd)}
          onSelectionChange={(idx) => commands.selectNext()}
          onClose={() => commands.cancel()}
        />
      )}
    </div>
  )
}
```

### 4. Keyboard Navigation

The hook provides keyboard navigation methods:

```tsx
// Navigate commands
commands.selectNext()     // Move down
commands.selectPrevious() // Move up
commands.selectFirst()    // Jump to first
commands.selectLast()     // Jump to last
commands.confirm()        // Execute selected command

// Cancel
commands.cancel()         // Close palette
```

## Custom Commands

### Register a Simple Command

```tsx
const commands = usePromptCommands()

React.useEffect(() => {
  commands.registerCommand({
    id: 'export',
    trigger: '/export',
    label: 'Export Chat',
    description: 'Export conversation to JSON',
    icon: <DownloadIcon />,
    category: 'tools',
    execute: async () => {
      const data = getConversationData()
      downloadJSON(data, 'chat-export.json')
    }
  })
}, [])
```

### Command with Arguments

```tsx
commands.registerCommand({
  id: 'search-code',
  trigger: '/search',
  label: 'Search Codebase',
  description: 'Search for code in your project',
  icon: <SearchIcon />,
  category: 'tools',
  execute: async (args) => {
    const query = args || await promptForQuery()
    const results = await searchCodebase(query)
    displayResults(results)
  }
})
```

### Dynamic Availability

```tsx
commands.registerCommand({
  id: 'undo',
  trigger: '/undo',
  label: 'Undo Last Message',
  description: 'Remove the last message',
  icon: <UndoIcon />,
  category: 'editing',
  // Only available when there are messages
  available: () => messages.length > 0,
  execute: async () => {
    removeLastMessage()
  }
})
```

### Command with Confirmation

```tsx
commands.registerCommand({
  id: 'delete-all',
  trigger: '/delete-all',
  label: 'Delete All Data',
  description: 'Permanently delete all conversations',
  icon: <TrashIcon />,
  category: 'dangerous',
  execute: async () => {
    const confirmed = await confirm(
      'Are you sure? This cannot be undone.'
    )
    if (confirmed) {
      deleteAllData()
    }
  }
})
```

## Advanced Features

### 1. Command Categories

Organize commands into logical groups:

```tsx
const commands = usePromptCommands({
  commands: myCommands,
  categories: [
    {
      id: 'conversation',
      label: 'Conversation',
      icon: <ChatIcon />,
      priority: 100 // Higher = shown first
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: <WrenchIcon />,
      priority: 80
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      priority: 60
    }
  ]
})
```

### 2. Recent Commands

Access recently used commands:

```tsx
const commands = usePromptCommands({
  maxRecent: 5 // Track last 5 commands
})

// Recent commands appear first in empty search
console.log(commands.recentCommands)
```

### 3. Fuzzy Search

Enable fuzzy matching for better UX:

```tsx
const commands = usePromptCommands({
  fuzzySearch: true // Default: true
})

// User types: "exprt"
// Matches: "export", "expert", etc.
```

### 4. Command State

Monitor command execution:

```tsx
const commands = usePromptCommands()

if (commands.activeCommand) {
  console.log(`Executing: ${commands.activeCommand.label}`)
}
```

### 5. Programmatic Execution

Execute commands without user interaction:

```tsx
const commands = usePromptCommands()

// Execute by ID
const clearCmd = commands.getAvailableCommands()
  .find(cmd => cmd.id === 'clear')

if (clearCmd) {
  await commands.execute(clearCmd)
}
```

## Integration Patterns

### Full PromptComposer Integration

```tsx
import { PromptComposer } from '@clarity-chat/react/components'
import { usePromptCommands, BUILTIN_COMMANDS } from '@clarity-chat/react/hooks'

function Chat() {
  const commands = usePromptCommands({
    commands: [
      ...BUILTIN_COMMANDS,
      // Add your custom commands
      {
        id: 'analyze',
        trigger: '/analyze',
        label: 'Analyze Code',
        description: 'Analyze selected code for issues',
        icon: <AnalyzeIcon />,
        category: 'tools',
        execute: async () => {
          const code = getSelectedCode()
          analyzeCode(code)
        }
      }
    ]
  })

  return (
    <PromptComposer
      api="/api/chat"
      commands={commands.getAvailableCommands()}
      onCommandExecute={(cmd, args) => commands.execute(cmd, args)}
    />
  )
}
```

### External Command Registry

```tsx
// commands/registry.ts
import type { Command } from '@clarity-chat/react/hooks'

export const commandRegistry: Record<string, Command> = {
  export: {
    id: 'export',
    trigger: '/export',
    label: 'Export Chat',
    // ...
  },
  // ... more commands
}

// In your component
const commands = usePromptCommands({
  commands: Object.values(commandRegistry)
})
```

### Context-Aware Commands

```tsx
function useContextualCommands(context: ChatContext) {
  const commands = usePromptCommands()

  React.useEffect(() => {
    // Register commands based on context
    if (context.hasSelection) {
      commands.registerCommand({
        id: 'explain-selection',
        trigger: '/explain',
        label: 'Explain Selection',
        description: 'Explain the selected text',
        execute: async () => {
          explainText(context.selection)
        }
      })
    }

    return () => {
      commands.unregisterCommand('explain-selection')
    }
  }, [context])

  return commands
}
```

## Best Practices

### 1. Command Naming

```tsx
// Good: Clear, action-oriented
'/clear', '/save', '/export'

// Bad: Vague or too long
'/c', '/do-something-with-stuff'
```

### 2. Descriptions

```tsx
// Good: Concise, explains what happens
description: 'Clear all messages and start fresh'

// Bad: Too vague or too verbose
description: 'Clear' // Too short
description: 'This command will clear all messages...' // Too long
```

### 3. Categories

```tsx
// Organize by purpose
{
  conversation: ['clear', 'save', 'load'],
  context: ['context', 'attach'],
  tools: ['search', 'analyze', 'export'],
  settings: ['model', 'settings', 'theme']
}
```

### 4. Error Handling

```tsx
commands.registerCommand({
  id: 'risky-operation',
  // ...
  execute: async () => {
    try {
      await performRiskyOperation()
      showSuccess('Operation completed')
    } catch (error) {
      showError('Operation failed')
      console.error(error)
      throw error // Re-throw for hook to handle
    }
  }
})
```

### 5. Async Commands

```tsx
commands.registerCommand({
  id: 'fetch-data',
  // ...
  execute: async () => {
    // Show loading state
    setLoading(true)

    try {
      const data = await fetchData()
      processData(data)
    } finally {
      setLoading(false)
    }
  }
})
```

### 6. Keyboard Shortcuts

```tsx
// Use standard conventions
{
  'Ctrl+S': 'Save',
  'Ctrl+Shift+C': 'Clear',
  'Ctrl+,': 'Settings',
  'Ctrl+K': 'Command Palette',
  'Escape': 'Cancel/Close'
}
```

### 7. Command Availability

```tsx
// Dynamic availability based on state
{
  available: () => {
    // Only available when conditions met
    return hasMessages && !isLoading && isOnline
  }
}
```

### 8. Unregister on Unmount

```tsx
React.useEffect(() => {
  commands.registerCommand(myCommand)

  return () => {
    commands.unregisterCommand(myCommand.id)
  }
}, [])
```

## Testing

### Test Command Detection

```tsx
import { renderHook, act } from '@testing-library/react'
import { usePromptCommands } from '@clarity-chat/react/hooks'

test('detects slash commands', () => {
  const { result } = renderHook(() => usePromptCommands())

  act(() => {
    result.current.search('cle')
  })

  expect(result.current.isActive).toBe(true)
  expect(result.current.filteredCommands.length).toBeGreaterThan(0)
})
```

### Test Command Execution

```tsx
test('executes command', async () => {
  const executeFn = vi.fn().mockResolvedValue(undefined)
  const command = {
    id: 'test',
    trigger: '/test',
    label: 'Test',
    execute: executeFn
  }

  const { result } = renderHook(() =>
    usePromptCommands({ commands: [command] })
  )

  await act(async () => {
    await result.current.execute(command)
  })

  expect(executeFn).toHaveBeenCalled()
})
```

## API Reference

### usePromptCommands(config)

**Config:**
- `commands?: Command[]` - Custom commands to register
- `categories?: CommandCategory[]` - Category definitions
- `fuzzySearch?: boolean` - Enable fuzzy matching (default: true)
- `maxRecent?: number` - Max recent commands to track (default: 5)
- `onCommandExecute?: (cmd, args?) => void` - Execution callback

**Returns:**
- `isActive: boolean` - Is command palette active?
- `query: string` - Current search query
- `filteredCommands: Command[]` - Filtered command list
- `selectedIndex: number` - Currently selected command index
- `activeCommand: Command | null` - Command being executed
- `recentCommands: Command[]` - Recently used commands
- `search(query)` - Activate search
- `execute(cmd, args?)` - Execute command
- `cancel()` - Close palette
- `selectNext()` - Navigate down
- `selectPrevious()` - Navigate up
- `selectFirst()` - Jump to first
- `selectLast()` - Jump to last
- `confirm()` - Execute selected
- `registerCommand(cmd)` - Add command
- `unregisterCommand(id)` - Remove command
- `getAvailableCommands()` - Get all available commands

### Command Type

```tsx
interface Command {
  id: string
  trigger: string           // e.g., '/clear'
  label: string             // Display name
  description: string       // Help text
  icon: React.ReactNode     // Visual icon
  category?: string         // Grouping
  available?: boolean | (() => boolean)  // Dynamic availability
  execute: (args?: string) => void | Promise<void>
  shortcut?: string         // Keyboard shortcut
}
```

## Examples

See the [examples directory](../../components/prompt-composer/__tests__/) for complete working examples.

## Troubleshooting

### Commands not showing

1. Check `available` property
2. Verify command is registered
3. Check fuzzy search query

### Keyboard navigation not working

1. Ensure CommandPalette is rendered
2. Check keyboard event handlers
3. Verify selectedIndex is updated

### Commands execute twice

1. Remove duplicate event handlers
2. Check useEffect dependencies
3. Ensure proper cleanup

## Related Documentation

- [PromptComposer Guide](./README.md)
- [Context System](./CONTEXT_GUIDE.md)
- [Token Optimization](./TOKEN_OPTIMIZATION.md)
- [Accessibility](../../components/prompt-composer/ACCESSIBILITY_CHECKLIST.md)
