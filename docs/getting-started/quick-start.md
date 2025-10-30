# Quick Start Guide

Build your first AI chat application in **5 minutes**! ⚡

---

## 🎯 **What We'll Build**

A functional chat interface with:
- ✅ Message sending and receiving
- ✅ AI response simulation
- ✅ Beautiful ocean theme
- ✅ Typing indicators
- ✅ Markdown support

---

## 📝 **Step 1: Create a New React App**

If you don't have a React app yet:

```bash
# Using Vite (recommended)
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app
npm install

# Or using Create React App
npx create-react-app my-chat-app --template typescript
cd my-chat-app
```

---

## 📦 **Step 2: Install Clarity Chat**

```bash
npm install @clarity-chat/react
```

---

## 🎨 **Step 3: Create Your First Chat Component**

Replace your `src/App.tsx` with:

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response (replace with your API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}". This is a simulated response!`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="h-screen bg-gray-50">
      <ThemeProvider theme={themes.ocean}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type your message..."
        />
      </ThemeProvider>
    </div>
  )
}

export default App
```

---

## 🚀 **Step 4: Run Your App**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the URL shown in your terminal).

**🎉 Congratulations!** You now have a working chat interface!

---

## 🎨 **Step 5: Try Different Themes**

Clarity Chat comes with 11 built-in themes. Try changing the theme:

```tsx
// Replace 'themes.ocean' with any of these:
themes.default    // Clean, professional
themes.dark       // Dark mode
themes.ocean      // Blue ocean vibes
themes.sunset     // Warm sunset colors
themes.forest     // Green nature theme
themes.corporate  // Professional business
themes.glassmorphism // Modern glass effect
themes.neon       // Cyberpunk neon
themes.minimal    // Ultra minimal
themes.warm       // Cozy warm tones
themes.cool       // Cool blue/gray
```

Example:
```tsx
<ThemeProvider theme={themes.glassmorphism}>
  <ChatWindow {...props} />
</ThemeProvider>
```

---

## 🤖 **Step 6: Connect to a Real AI API**

### **OpenAI Example**

```bash
npm install openai
```

```tsx
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo! Use a backend in production
})

const handleSendMessage = async (content: string) => {
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, userMessage])
  setIsLoading(true)

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content },
      ],
    })

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.choices[0].message.content || 'No response',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    // Handle error appropriately
  } finally {
    setIsLoading(false)
  }
}
```

⚠️ **Security Note:** Never expose API keys in frontend code. Use a backend API route in production.

### **Next.js API Route Example**

```tsx
// app/api/chat/route.ts
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
  })

  return NextResponse.json(response.choices[0].message)
}
```

```tsx
// Frontend code
const handleSendMessage = async (content: string) => {
  // ... add user message ...

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...messages, { role: 'user', content }],
    }),
  })

  const data = await response.json()
  // ... add AI message ...
}
```

---

## ✨ **Step 7: Add More Features**

### **Enable Streaming Responses**

```tsx
import { useStreaming } from '@clarity-chat/react'

function App() {
  const { streamMessage, isStreaming } = useStreaming()

  const handleSendMessage = async (content: string) => {
    await streamMessage('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isStreaming}
    />
  )
}
```

### **Add Voice Input**

```tsx
import { VoiceInput } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  renderInput={(props) => (
    <div className="flex gap-2">
      <input {...props} />
      <VoiceInput onTranscript={(text) => handleSendMessage(text)} />
    </div>
  )}
/>
```

### **Add File Upload**

```tsx
import { FileUpload } from '@clarity-chat/react'

const [files, setFiles] = useState<File[]>([])

<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  attachments={files}
  onAttachmentsChange={setFiles}
/>
```

---

## 🎓 **What's Next?**

You've built your first chat app! Now explore:

### **Core Concepts**
- [Understanding Components](./first-component.md) - Deep dive into ChatWindow
- [Theming Guide](../guides/theming.md) - Customize your chat's appearance
- [Message Streaming](../guides/streaming.md) - Real-time responses

### **Production Features**
- [Error Handling](../guides/error-handling.md) - Robust error recovery
- [Analytics](../guides/analytics.md) - Track user interactions
- [Accessibility](../guides/accessibility.md) - WCAG compliance

### **Advanced Topics**
- [Custom AI Providers](../examples/integrations.md) - OpenAI, Anthropic, Azure
- [Custom Themes](../guides/theming.md#custom-themes) - Build your own
- [Performance Optimization](../guides/performance.md) - Scale to 1000+ messages

---

## 📚 **Additional Resources**

- **[Examples Gallery](../examples/README.md)** - 9 working examples
- **[API Reference](../api/components.md)** - Complete API docs
- **[Storybook](https://storybook.clarity-chat.dev)** - Interactive component explorer

---

## 🤝 **Need Help?**

- 💬 [Join Discord](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 📖 [Full Documentation](../README.md)

---

## 🎯 **Common Next Steps**

Most developers do one of these next:

1. **[Add OpenAI Integration](../examples/integrations.md#openai)** (30 min)
2. **[Customize Theme](../guides/theming.md#custom-themes)** (20 min)
3. **[Deploy to Vercel](../guides/deployment.md)** (15 min)
4. **[Add Analytics](../guides/analytics.md)** (25 min)

---

**Congratulations on building your first AI chat app!** 🎉

**Next:** [Understanding Your First Component →](./first-component.md)
