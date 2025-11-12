import React, { useState } from 'react'
import { Message } from '@clarity-chat/react'

function ActionsDemo() {
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied] = useState(false)
  const [retries, setRetries] = useState(0)

  const message = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: `# Interactive Message

Try these actions:
- 👍 Thumbs up/down for feedback
- 📋 Copy button to copy content
- 🔄 Retry for error messages

Current feedback: ${feedback || 'None'}
Copy status: ${copied ? 'Copied!' : 'Not copied'}
Retries: ${retries}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Message
        message={message}
        onFeedback={value => setFeedback(value)}
        onCopy={() => setCopied(true)}
        onRetry={() => setRetries(prev => prev + 1)}
      />
    </div>
  )
}

export default ActionsDemo
