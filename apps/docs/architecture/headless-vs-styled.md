# Headless vs. Styled Architecture

Clarity Chat offers two distinct ways to build AI interfaces. Understanding the difference is key to choosing the right approach for your project.

## At a Glance

| Approach | **Styled (ClarityChat)** | **Headless (useHeadlessChat)** |
| :--- | :--- | :--- |
| **Best For** | Fast shipping, Internal tools, MVPs | Custom Design Systems, Pixel-perfect control |
| **Setup Time** | < 5 minutes | 1-2 hours |
| **Styling** | Themes (CSS Variables) | You bring the CSS (Tailwind, CSS-in-JS, etc.) |
| **DOM Control** | Low (Opinionated) | High (100% You) |
| **Logic** | Built-in (Memory, Streaming, Errors) | Built-in (Memory, Streaming, Errors) |

---

## 1. Styled Mode (The "Shadcn for AI" Approach)

The `ClarityChat` component and its sub-components (`ChatWindow`, `MessageList`, `ChatInput`) come with beautiful defaults, accessibility baked in, and a theming system.

**Choose this if:**
*   You want a chat interface that "just works" and looks good.
*   You don't want to spend time handling scroll-to-bottom, loading states, or error animations.
*   You are happy with the standard chat layout.

```tsx
import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

### Customization in Styled Mode
You can still customize the look via the `ThemeProvider` or CSS overrides, but the *structure* (DOM nodes) is managed by Clarity.

---

## 2. Headless Mode (The "Radix for AI" Approach)

The `useHeadlessChat` hook (aliased from `useChat`) gives you the *brain* of Clarity Chat without the *body*. It handles the complex state management of streaming AI responses, but renders nothing.

**Choose this if:**
*   You are integrating into an existing app with a strict Design System (e.g., MUI, AntD, or a custom internal system).
*   You need a radically different layout (e.g., a floating bubble, a side panel, or a voice-only interface).
*   You want complete control over every `<div>` and `<span>`.

```tsx
import { useHeadlessChat } from '@clarity-chat/react'

export default function CustomChat() {
  const { messages, input, setInput, handleSubmit, isLoading } = useHeadlessChat({
    api: '/api/chat',
  })

  return (
    <div className="my-custom-chat-container">
      <div className="message-scroller">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role}`}>
            <span className="avatar">{m.role === 'user' ? '👤' : '🤖'}</span>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

### What You Get in Headless Mode
Even without the UI, you still get Clarity's robust logic:
*   **Streaming Decoder**: Handles SSE/Data streams automatically.
*   **Optimistic Updates**: User messages appear instantly.
*   **Error Handling**: Network retries and error states.
*   **Memory Integration**: (Optional) Connects to the Memory system if configured.

---

## Which one should I use?

**Start with Styled.** It's easier to "eject" to Headless later than to build Headless from scratch.

1.  Install `@clarity-chat/react`.
2.  Drop in `<ClarityChat />`.
3.  If you hit a wall with customization, switch to `useHeadlessChat` and copy the logic you need.
