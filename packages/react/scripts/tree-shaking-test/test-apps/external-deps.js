/**
 * External dependencies test: Verify peer deps are externalized
 * Expected: React/ReactDOM should be external in production bundle
 * Should NOT bundle: react, react-dom, lucide-react (peer deps)
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { MessageCircle } from 'lucide-react'
import { ClarityChat } from '@clarity-ai/react'

function App() {
  return React.createElement(
    'div',
    null,
    React.createElement(MessageCircle, { size: 24 }),
    React.createElement(ClarityChat, {
      messages: [],
      onSendMessage: (msg) => console.log(msg),
    })
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(React.createElement(App))

export default App
