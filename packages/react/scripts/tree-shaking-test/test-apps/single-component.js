/**
 * Single component test: Import one React component
 * Expected: Only that component + React + necessary deps
 * Should NOT include: Other components, unused utilities, theme system
 */
import * as React from 'react'
import { ChatInput } from '@clarity-ai/react'

function App() {
  return React.createElement(ChatInput, {
    onSend: (msg) => console.log(msg),
    placeholder: 'Test message',
  })
}

export default App
