/**
 * Multiple components test: Import 3 related components
 * Expected: Only these components + shared dependencies
 * Should NOT include: Unrelated components, theme customizer, dashboards
 */
import * as React from 'react'
import { ChatInput, ClarityChat, FollowUpSuggestions } from '@clarity-ai/react'

function App() {
  const [messages, setMessages] = React.useState([])

  return React.createElement(
    'div',
    null,
    React.createElement(ClarityChat, {
      messages,
      onSendMessage: (msg) => setMessages([...messages, msg]),
    }),
    React.createElement(ChatInput, {
      onSend: (msg) => console.log(msg),
    }),
    React.createElement(FollowUpSuggestions, {
      suggestions: ['Hello', 'Help'],
    })
  )
}

export default App
