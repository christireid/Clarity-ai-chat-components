'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { ChatInput, CodeBlock, MarkdownRenderer } from '@clarity-chat/react'
import {
  Card,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'

export default function ChatComponentsPage() {
  const [inputValue, setInputValue] = useState('')

  const sampleMarkdown = `# Hello World

This is a **markdown** example with:

- Bullet points
- *Italic text*
- \`inline code\`

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

> A blockquote for emphasis
`

  const sampleCode = `import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <ClarityChatApp
      api="/api/chat"
      theme="dark"
      enableStreaming
    />
  )
}`

  return (
    <div className="space-y-12">
      <PageHeader
        title="Chat Components"
        description="Core chat interface components for building conversational AI experiences"
      />

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="rendering">Rendering</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-8">
          <ComponentSection
            title="ChatInput"
            description="Feature-rich input component with file attachments, voice input, and keyboard shortcuts"
          >
            <Card className="p-4">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={(message: string) => {
                  console.log('Sending:', message)
                  setInputValue('')
                }}
                placeholder="Type a message..."
                disabled={false}
                maxLength={2000}
                className=""
                id="chat-input-demo"
                aria-label="Chat message input"
              />
            </Card>
          </ComponentSection>
        </TabsContent>

        <TabsContent value="messages" className="space-y-8">
          <ComponentSection
            title="Message Display"
            description="Various message display patterns"
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    AI
                  </div>
                  <div className="flex-1 bg-muted rounded-lg p-3">
                    <p className="text-sm">
                      Hello! How can I assist you today?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium">
                    U
                  </div>
                  <div className="flex-1 bg-primary/10 rounded-lg p-3 text-right">
                    <p className="text-sm">Can you help me with React?</p>
                  </div>
                </div>
              </div>
            </Card>
          </ComponentSection>
        </TabsContent>

        <TabsContent value="rendering" className="space-y-8">
          <ComponentSection
            title="MarkdownRenderer"
            description="Enhanced markdown rendering with syntax highlighting and copy support"
          >
            <Card className="p-6">
              <MarkdownRenderer content={sampleMarkdown} />
            </Card>
          </ComponentSection>

          <ComponentSection
            title="CodeBlock"
            description="Syntax highlighted code block with copy functionality"
          >
            <Card className="p-0 overflow-hidden">
              <CodeBlock language="typescript" showLineNumbers>
                {sampleCode}
              </CodeBlock>
            </Card>
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
