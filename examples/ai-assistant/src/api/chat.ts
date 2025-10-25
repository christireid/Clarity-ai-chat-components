import type { Message } from '@clarity-chat/types'

export interface ChatResponse {
  message: Message
}

// Simulated API call - replace with actual API
export async function sendChatMessage(
  messages: Message[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (signal?.aborted) {
    throw new Error('Request cancelled')
  }

  const lastMessage = messages[messages.length - 1]
  const content = lastMessage.content.toLowerCase()

  // Simple AI simulation based on keywords
  let response = ''

  if (content.includes('hello') || content.includes('hi')) {
    response = "Hello! I'm your AI assistant. How can I help you today?"
  } else if (content.includes('weather')) {
    response = "I don't have access to real-time weather data, but I can help you with other questions!"
  } else if (content.includes('joke')) {
    response = "Why don't scientists trust atoms? Because they make up everything! 😄"
  } else if (content.includes('code')) {
    response = "I can help with coding! Here's a simple example:\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`\n}\n```"
  } else if (content.includes('help')) {
    response = "I can assist you with:\n- Answering general questions\n- Explaining concepts\n- Writing code examples\n- Providing suggestions\n- And more!\n\nJust ask me anything!"
  } else {
    response = `I understand you're asking about "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}". Let me provide a thoughtful response.\n\nThis is a demo response that would be replaced with actual AI-generated content from providers like OpenAI, Anthropic, or Google. The response would be contextual, helpful, and based on the conversation history.`
  }

  return {
    message: {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
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
