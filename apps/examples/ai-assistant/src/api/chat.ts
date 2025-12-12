import type { Message } from '@clarity-chat/types'

export interface ChatResponse {
  message: Message
}

/**
 * Professional demo responses for common queries.
 * These simulate realistic AI assistant behavior.
 */
const DEMO_RESPONSES: Record<string, string> = {
  greeting: `Hello! I'm your AI assistant powered by Clarity Chat components. I can help you with:

- **Coding questions** - React, TypeScript, and more
- **Explanations** - Break down complex concepts
- **Code reviews** - Analyze and improve your code
- **Best practices** - Modern development patterns

What would you like to explore today?`,

  weather: `I don't have access to real-time weather data in this demo, but I can show you how to integrate weather APIs!

Here's an example using the OpenWeatherMap API:

\`\`\`typescript
async function getWeather(city: string) {
  const response = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=YOUR_API_KEY\`
  );
  return response.json();
}
\`\`\`

Would you like to learn more about API integrations?`,

  joke: `Why do programmers prefer dark mode?

Because light attracts bugs!

Here's another one: Why did the developer go broke? Because he used up all his cache!`,

  code: `I'd be happy to help with coding! Here's a practical example of a custom React hook:

\`\`\`typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
\`\`\`

**Usage:**
\`\`\`typescript
const [theme, setTheme] = useLocalStorage('theme', 'light');
\`\`\`

What specific coding challenge are you working on?`,

  help: `## Clarity Chat Assistant

I can help you with a wide range of tasks:

### Development
- Write and explain code in any language
- Debug issues and suggest fixes
- Review code for best practices

### Learning
- Explain programming concepts
- Provide step-by-step tutorials
- Compare technologies and frameworks

### Productivity
- Generate documentation
- Create test cases
- Brainstorm solutions

**Try asking me:**
- "How do I implement authentication in React?"
- "Explain the difference between useMemo and useCallback"
- "Write a function to validate email addresses"

What can I help you with?`,

  react: `React is a powerful library for building user interfaces. Here are some key concepts:

### Core Concepts

1. **Components** - Reusable UI building blocks
2. **Props** - Data passed to components
3. **State** - Dynamic data within components
4. **Hooks** - Functions to use React features

### Example Component

\`\`\`tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {label}
    </button>
  );
}
\`\`\`

Would you like to dive deeper into any specific React topic?`,

  typescript: `TypeScript adds static typing to JavaScript, catching errors early and improving code quality.

### Key Benefits

| Feature | Benefit |
|---------|---------|
| Type Safety | Catch errors at compile time |
| IntelliSense | Better IDE autocomplete |
| Refactoring | Safer code changes |
| Documentation | Types serve as docs |

### Example

\`\`\`typescript
// Define a type
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Use the type
function getUserDisplay(user: User): string {
  return \`\${user.name} (\${user.role})\`;
}
\`\`\`

What TypeScript concepts would you like to explore?`,
}

/**
 * Get a contextual response based on the user's message.
 */
function getResponse(content: string): string {
  const lowerContent = content.toLowerCase()

  // Check for specific keywords
  if (lowerContent.includes('hello') || lowerContent.includes('hi ') || lowerContent === 'hi') {
    return DEMO_RESPONSES.greeting
  }
  if (lowerContent.includes('weather')) {
    return DEMO_RESPONSES.weather
  }
  if (lowerContent.includes('joke') || lowerContent.includes('funny')) {
    return DEMO_RESPONSES.joke
  }
  if (lowerContent.includes('react') && !lowerContent.includes('typescript')) {
    return DEMO_RESPONSES.react
  }
  if (lowerContent.includes('typescript') || lowerContent.includes('ts')) {
    return DEMO_RESPONSES.typescript
  }
  if (lowerContent.includes('code') || lowerContent.includes('example') || lowerContent.includes('function')) {
    return DEMO_RESPONSES.code
  }
  if (lowerContent.includes('help') || lowerContent.includes('what can you')) {
    return DEMO_RESPONSES.help
  }

  // Default contextual response
  const truncatedQuery = content.length > 60 ? content.substring(0, 60) + '...' : content
  return `Thanks for your question about "${truncatedQuery}".

In a production environment, this would connect to an AI provider like OpenAI or Anthropic to generate a contextual response based on:

- Your conversation history
- The specific context of your question
- Any relevant documentation or knowledge base

**This is a demo environment** showcasing the Clarity Chat UI components. To see the full AI capabilities:

1. Configure your API keys in \`.env.local\`
2. Connect to your preferred AI provider
3. Customize the system prompt for your use case

Would you like to learn more about integrating AI providers?`
}

// Simulated API call - demonstrates realistic behavior
export async function sendChatMessage(
  messages: Message[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  // Simulate realistic network delay (800-1500ms)
  const delay = 800 + Math.random() * 700
  await new Promise((resolve) => setTimeout(resolve, delay))

  if (signal?.aborted) {
    throw new Error('Request cancelled')
  }

  const lastMessage = messages[messages.length - 1]
  const response = getResponse(lastMessage.content)

  return {
    message: {
      id: Date.now().toString(),
      chatId: lastMessage.chatId,
      role: 'assistant',
      content: response,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    },
  }
}

export interface StreamChunk {
  content: string
  done: boolean
}

// Simulated streaming API - replace with actual streaming
export async function* streamChatMessage(
  messages: Message[],
  signal?: AbortSignal
): AsyncGenerator<StreamChunk> {
  const response = await sendChatMessage(messages)
  const words = response.message.content.split(' ')

  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) {
      break
    }

    await new Promise((resolve) => setTimeout(resolve, 50))
    
    yield {
      content: words[i] + ' ',
      done: i === words.length - 1,
    }
  }
}
