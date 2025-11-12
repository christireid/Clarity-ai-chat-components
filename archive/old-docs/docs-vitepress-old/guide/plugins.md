# Plugin System

Extend Clarity Chat with custom plugins to add functionality, integrate with third-party services, or customize behavior.

## Overview

The plugin system allows you to:
- Create custom plugins for specific functionality
- Hook into chat lifecycle events
- Extend components and hooks
- Share plugins with the community
- Manage plugin dependencies

## Creating a Plugin

### Basic Plugin Structure

```tsx
import { Plugin, PluginContext } from '@clarity-chat/react'

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  
  initialize(context: PluginContext) {
    console.log('Plugin initialized')
  },
  
  cleanup() {
    console.log('Plugin cleaned up')
  },
}
```

### Plugin with Hooks

```tsx
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  
  hooks: {
    // Called after a message is sent
    afterSendMessage: async (message, context) => {
      await analytics.track('message_sent', {
        messageId: message.id,
        content: message.content,
        userId: context.userId,
      })
    },
    
    // Called after a message is received
    afterReceiveMessage: async (message, context) => {
      await analytics.track('message_received', {
        messageId: message.id,
        userId: context.userId,
      })
    },
    
    // Called before sending a message
    beforeSendMessage: async (message, context) => {
      // Modify message before sending
      return {
        ...message,
        metadata: {
          ...message.metadata,
          timestamp: Date.now(),
        },
      }
    },
  },
}
```

## Using Plugins

### Register a Plugin

```tsx
import { PluginManager } from '@clarity-chat/react'

const pluginManager = new PluginManager()

// Register a plugin
pluginManager.register(analyticsPlugin)

// Initialize all plugins
await pluginManager.initialize()
```

### Use with Chat

```tsx
import { ChatWindow, PluginProvider } from '@clarity-chat/react'

function App() {
  const pluginManager = new PluginManager()
  pluginManager.register(analyticsPlugin)
  
  return (
    <PluginProvider manager={pluginManager}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </PluginProvider>
  )
}
```

## Available Hooks

### Message Hooks

- `beforeSendMessage` - Called before sending a message
- `afterSendMessage` - Called after sending a message
- `beforeReceiveMessage` - Called before receiving a message
- `afterReceiveMessage` - Called after receiving a message
- `onMessageError` - Called when a message error occurs

### Lifecycle Hooks

- `onChatStart` - Called when chat starts
- `onChatEnd` - Called when chat ends
- `onStreamStart` - Called when streaming starts
- `onStreamEnd` - Called when streaming ends

### Component Hooks

- `renderMessage` - Customize message rendering
- `renderInput` - Customize input rendering
- `renderToolbar` - Customize toolbar rendering

## Example Plugins

### Analytics Plugin

```tsx
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  
  hooks: {
    afterSendMessage: async (message) => {
      await trackEvent('message_sent', {
        messageId: message.id,
        length: message.content.length,
      })
    },
    
    afterReceiveMessage: async (message) => {
      await trackEvent('message_received', {
        messageId: message.id,
        responseTime: message.metadata?.responseTime,
      })
    },
  },
}
```

### Logging Plugin

```tsx
const loggingPlugin: Plugin = {
  name: 'logging',
  version: '1.0.0',
  
  hooks: {
    beforeSendMessage: async (message) => {
      console.log('[Chat] Sending:', message.content)
    },
    
    afterReceiveMessage: async (message) => {
      console.log('[Chat] Received:', message.content)
    },
    
    onMessageError: async (error, context) => {
      console.error('[Chat] Error:', error, context)
    },
  },
}
```

### Custom Styling Plugin

```tsx
const stylingPlugin: Plugin = {
  name: 'custom-styling',
  version: '1.0.0',
  
  hooks: {
    renderMessage: (message, defaultRender) => {
      if (message.role === 'assistant') {
        return (
          <div className="custom-assistant-message">
            {defaultRender(message)}
          </div>
        )
      }
      return defaultRender(message)
    },
  },
}
```

### Rate Limiting Plugin

```tsx
const rateLimitPlugin: Plugin = {
  name: 'rate-limit',
  version: '1.0.0',
  
  hooks: {
    beforeSendMessage: async (message, context) => {
      const canSend = await checkRateLimit(context.userId)
      
      if (!canSend) {
        throw new Error('Rate limit exceeded')
      }
    },
  },
}
```

## Plugin Configuration

### Plugin Options

```tsx
const configurablePlugin: Plugin = {
  name: 'configurable',
  version: '1.0.0',
  
  options: {
    enabled: true,
    logLevel: 'info',
    maxRetries: 3,
  },
  
  initialize(context, options) {
    if (options.enabled) {
      console.log(`Plugin initialized with log level: ${options.logLevel}`)
    }
  },
}
```

### Plugin Dependencies

```tsx
const dependentPlugin: Plugin = {
  name: 'dependent',
  version: '1.0.0',
  
  dependencies: ['analytics', 'logging'],
  
  initialize(context) {
    // Dependencies are guaranteed to be initialized first
    const analytics = context.getPlugin('analytics')
    const logging = context.getPlugin('logging')
  },
}
```

## Plugin Manager API

### Registering Plugins

```tsx
const manager = new PluginManager()

// Register single plugin
manager.register(plugin)

// Register multiple plugins
manager.register([plugin1, plugin2, plugin3])

// Register with options
manager.register(plugin, { enabled: true, config: {} })
```

### Managing Plugins

```tsx
// Get plugin
const plugin = manager.getPlugin('analytics')

// Check if plugin is registered
if (manager.hasPlugin('analytics')) {
  // Plugin exists
}

// Enable/disable plugin
manager.enablePlugin('analytics')
manager.disablePlugin('analytics')

// Unregister plugin
manager.unregister('analytics')
```

### Plugin Events

```tsx
// Listen to plugin events
manager.on('plugin:registered', (plugin) => {
  console.log('Plugin registered:', plugin.name)
})

manager.on('plugin:error', (error, plugin) => {
  console.error('Plugin error:', error, plugin.name)
})
```

## Best Practices

1. **Version Your Plugins**: Use semantic versioning
2. **Handle Errors**: Always handle errors gracefully
3. **Document Dependencies**: Declare plugin dependencies
4. **Test Plugins**: Test plugins in isolation
5. **Performance**: Keep plugin hooks lightweight
6. **Async Operations**: Use async/await for async operations
7. **Cleanup**: Implement cleanup logic

## Next Steps

- [Plugin API Reference](/api/plugins) - Complete plugin API
- [Creating Plugins](/guide/creating-plugins) - Detailed plugin creation guide
- [Plugin Examples](/examples/plugins) - More plugin examples
