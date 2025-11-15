# Customized Chat Example

Shows how to customize ClarityChat with different options and callbacks.

## Features Demonstrated

- Theme customization
- Memory integration
- Token counter
- Header with title/subtitle
- Event callbacks (onMessageSent, onMessageReceived, onError)

## Usage

```tsx
import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      theme="dark"
      enableMemory
      showTokenCounter
      showHeader
      sessionTitle="My AI Assistant"
      sessionSubtitle="Ask me anything!"
      onMessageSent={(msg) => console.log('Sent:', msg)}
      onMessageReceived={(msg) => console.log('Received:', msg)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}
```

## Run This Example

```bash
cd apps/examples/customized-chat
pnpm install
pnpm dev
```
