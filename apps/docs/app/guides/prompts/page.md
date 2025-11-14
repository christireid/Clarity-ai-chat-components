# Prompt Templates

Clarity Chat provides a flexible prompt template system for managing and rendering AI prompts with variables, validation, and versioning. Perfect for building reusable prompts, A/B testing, and prompt management.

## Overview

The prompt template system allows you to:
- Create reusable prompt templates with variables
- Validate prompt variables before rendering
- Manage a library of prompts
- Version prompts for A/B testing
- Use built-in templates for common tasks

## Installation

Prompt utilities are included in `@clarity-chat/react`:

```tsx
import {
  PromptTemplateEngine,
  PromptTemplateLibrary,
  renderPrompt,
  builtInPrompts,
} from '@clarity-chat/react'
```

## Quick Start

### Simple Variable Substitution

```tsx
import { renderPrompt } from '@clarity-chat/react'

const prompt = renderPrompt(
  'Hello {{name}}, you are {{age}} years old.',
  { name: 'Alice', age: 30 }
)

console.log(prompt)
// "Hello Alice, you are 30 years old."
```

### Using Template Objects

```tsx
import { PromptTemplateEngine } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'

const template: PromptTemplate = {
  id: 'greeting',
  name: 'Greeting Template',
  description: 'A friendly greeting',
  template: 'Hello {{name}}! Welcome to {{app}}.',
  variables: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'User name',
    },
    {
      name: 'app',
      type: 'string',
      required: true,
      description: 'Application name',
    },
  ],
}

const engine = new PromptTemplateEngine()
const result = engine.render(template, {
  variables: {
    name: 'Alice',
    app: 'Clarity Chat',
  },
  validate: true,
})

console.log(result.prompt)
// "Hello Alice! Welcome to Clarity Chat."
```

## Template Variables

### Variable Types

Variables can be of different types:

```tsx
const template: PromptTemplate = {
  id: 'example',
  template: '{{stringVar}} {{numberVar}} {{booleanVar}}',
  variables: [
    {
      name: 'stringVar',
      type: 'string',
      required: true,
    },
    {
      name: 'numberVar',
      type: 'number',
      default: 0,
    },
    {
      name: 'booleanVar',
      type: 'boolean',
      default: false,
    },
  ],
}
```

### Nested Variables

Access nested object properties:

```tsx
const prompt = renderPrompt(
  'Hello {{user.name}}, your email is {{user.email}}.',
  {
    user: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  }
)
```

### Array Variables

Arrays are automatically joined:

```tsx
const prompt = renderPrompt(
  'Categories: {{categories}}',
  {
    categories: ['tech', 'ai', 'chat'],
  }
)
// "Categories: tech, ai, chat"
```

## Validation

### Required Variables

```tsx
const template: PromptTemplate = {
  id: 'validated',
  template: 'Hello {{name}}!',
  variables: [
    {
      name: 'name',
      type: 'string',
      required: true,
    },
  ],
}

const engine = new PromptTemplateEngine()
const result = engine.render(template, {
  variables: {},
  validate: true,
})

if (!result.success) {
  console.error(result.errors)
  // ["Missing required variable: name"]
}
```

### Custom Validation

```tsx
const template: PromptTemplate = {
  id: 'validated',
  template: 'Age: {{age}}',
  variables: [
    {
      name: 'age',
      type: 'number',
      required: true,
      validate: (value) => {
        if (typeof value !== 'number') {
          return 'Age must be a number'
        }
        if (value < 0 || value > 150) {
          return 'Age must be between 0 and 150'
        }
        return true
      },
    },
  ],
}
```

## Prompt Library

Manage a collection of prompts:

```tsx
import { PromptTemplateLibrary } from '@clarity-chat/react'

const library = new PromptTemplateLibrary()

// Add templates
library.add({
  id: 'greeting',
  name: 'Greeting',
  template: 'Hello {{name}}!',
  variables: [{ name: 'name', type: 'string', required: true }],
})

library.add({
  id: 'farewell',
  name: 'Farewell',
  template: 'Goodbye {{name}}!',
  variables: [{ name: 'name', type: 'string', required: true }],
})

// Retrieve templates
const greeting = library.get('greeting')
const farewell = library.getByName('Farewell')

// Search templates
const results = library.search('greet')
// Returns templates matching "greet"

// Get by tag
const tagged = library.getByTag('social')
```

## Built-in Templates

Clarity Chat includes built-in templates for common tasks:

```tsx
import { builtInPrompts } from '@clarity-chat/react'

// Summarize text
const summarizeTemplate = builtInPrompts.summarize
const summary = renderPrompt(summarizeTemplate.template, {
  text: 'Long article text...',
  style: 'concise',
})

// Question answering
const qaTemplate = builtInPrompts.qa
const qaPrompt = renderPrompt(qaTemplate.template, {
  context: 'Context information...',
  question: 'What is the answer?',
})

// Text classification
const classifyTemplate = builtInPrompts.classify
const classifyPrompt = renderPrompt(classifyTemplate.template, {
  text: 'Text to classify',
  categories: ['positive', 'negative', 'neutral'],
})

// Entity extraction
const extractTemplate = builtInPrompts.extract
const extractPrompt = renderPrompt(extractTemplate.template, {
  text: 'Text with entities',
  entities: ['name', 'email', 'phone'],
})

// Translation
const translateTemplate = builtInPrompts.translate
const translatePrompt = renderPrompt(translateTemplate.template, {
  text: 'Hello world',
  sourceLang: 'en',
  targetLang: 'es',
})
```

## Versioning

Track different versions of prompts:

```tsx
import type { PromptVersion } from '@clarity-chat/react'

const library = new PromptTemplateLibrary()

// Save version
library.saveVersion({
  id: 'v1',
  templateId: 'greeting',
  version: '1.0.0',
  template: 'Hello {{name}}!',
  createdAt: Date.now(),
  notes: 'Initial version',
  isActive: true,
})

// Save new version
library.saveVersion({
  id: 'v2',
  templateId: 'greeting',
  version: '2.0.0',
  template: 'Hello {{name}}! Welcome!',
  createdAt: Date.now(),
  notes: 'Added welcome message',
  isActive: true, // Deactivates previous version
})

// Get versions
const versions = library.getVersions('greeting')
const activeVersion = library.getActiveVersion('greeting')
```

## Integration with Chat

Use prompts in your chat application:

```tsx
import { ChatWindow, renderPrompt, builtInPrompts } from '@clarity-chat/react'

function ChatWithPrompts() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    // Use prompt template for system message
    const systemPrompt = renderPrompt(
      builtInPrompts.qa.template,
      {
        context: 'Your knowledge base content...',
        question: content,
      }
    )

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content },
        ],
      }),
    })

    const data = await response.json()
    setMessages(prev => [...prev, {
      id: data.id,
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Integration with Agents

Use prompts with AI agents:

```tsx
import { Agent, renderPrompt, builtInPrompts } from '@clarity-chat/react'

const agent = new Agent({
  model: openaiAdapter,
  systemPrompt: renderPrompt(
    builtInPrompts.summarize.template,
    {
      text: 'Agent context...',
      style: 'detailed',
    }
  ),
  tools: [searchTool, calculatorTool],
})
```

## Custom Delimiters

Use custom variable delimiters:

```tsx
const engine = new PromptTemplateEngine({
  start: '${',
  end: '}',
})

const result = engine.render(
  'Hello ${name}!',
  {
    variables: { name: 'Alice' },
    delimiter: { start: '${', end: '}' },
  }
)
```

## Export/Import

Save and load prompt libraries:

```tsx
const library = new PromptTemplateLibrary()

// Add templates
library.add({ id: 'template1', name: 'Template 1', template: '...' })
library.add({ id: 'template2', name: 'Template 2', template: '...' })

// Export to JSON
const json = library.export()
localStorage.setItem('prompts', json)

// Import from JSON
const savedJson = localStorage.getItem('prompts')
if (savedJson) {
  const newLibrary = new PromptTemplateLibrary()
  newLibrary.import(savedJson)
}
```

## Template Tags

Organize templates with tags:

```tsx
const template: PromptTemplate = {
  id: 'customer-support',
  name: 'Customer Support',
  template: '...',
  tags: ['support', 'customer', 'help'],
}

// Search by tag
const supportPrompts = library.getByTag('support')
```

## Complete Example

```tsx
import {
  ChatWindow,
  PromptTemplateLibrary,
  PromptTemplateEngine,
  builtInPrompts,
} from '@clarity-chat/react'

function AdvancedChatWithPrompts() {
  const [messages, setMessages] = useState([])
  const library = new PromptTemplateLibrary()
  const engine = new PromptTemplateEngine()

  useEffect(() => {
    // Initialize library with built-in prompts
    Object.values(builtInPrompts).forEach(template => {
      library.add(template)
    })

    // Add custom templates
    library.add({
      id: 'customer-support',
      name: 'Customer Support',
      template: `You are a helpful customer support agent.

Customer question: {{question}}
Customer context: {{context}}

Please provide a helpful and friendly response.`,
      variables: [
        { name: 'question', type: 'string', required: true },
        { name: 'context', type: 'string', required: false },
      ],
      tags: ['support', 'customer'],
    })
  }, [])

  const handleSend = async (content: string) => {
    // Get template
    const template = library.get('customer-support')
    if (!template) return

    // Render prompt
    const result = engine.render(template, {
      variables: {
        question: content,
        context: 'Premium customer',
      },
      validate: true,
    })

    if (!result.success) {
      console.error(result.errors)
      return
    }

    // Use rendered prompt
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'system', content: result.prompt },
          { role: 'user', content },
        ],
      }),
    })

    const data = await response.json()
    setMessages(prev => [...prev, {
      id: data.id,
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Best Practices

1. **Use Templates**: Create reusable templates instead of hardcoding prompts
2. **Validate Early**: Always validate variables before rendering
3. **Version Control**: Use versioning for prompt A/B testing
4. **Organize with Tags**: Use tags to organize related templates
5. **Document Variables**: Always provide descriptions for variables
6. **Use Built-ins**: Leverage built-in templates when possible
7. **Export/Import**: Save prompt libraries for backup and sharing

## Next Steps

- Learn about [AI Agents](/guide/agents) for advanced prompt usage
- Check out [RAG System](/guides/rag-guide) for context-aware prompts
- See [Memory System](/guide/memory) for persistent prompt context
