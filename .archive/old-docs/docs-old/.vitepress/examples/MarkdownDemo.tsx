import React, { useState } from 'react'
import { Message } from '@clarity-chat/react'

const markdownContent = `# Hello! I support Markdown 👋

Here are some formatting examples:

## Text Formatting
- **Bold text**
- *Italic text*
- \\`inline code\\`

## Code Block
\\`\\`\\`javascript
function greet(name) {
  return \\`Hello, \\${name}!\\`
}
\\`\\`\\`

## Lists
1. First item
2. Second item
3. Third item

> This is a blockquote

[Links are supported too](https://example.com)`

function MarkdownDemo() {
  const [copied, setCopied] = useState(false)

  const message = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: markdownContent,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Message
        message={message}
        onCopy={() => setCopied(true)}
        showCopyButton
      />
      {copied && (
        <p style={{ marginTop: '12px', color: '#10b981' }}>Content copied!</p>
      )}
    </div>
  )
}

export default MarkdownDemo
