/**
 * Advanced Chat Integration Example
 * 
 * Demonstrates a full-featured chat implementation with all enhancements.
 * This example shows how to use all the blueprint features together.
 * 
 * Features:
 * - Enhanced markdown rendering (KaTeX, Mermaid)
 * - Prompt suggestions
 * - Advanced search and filtering
 * - Batch export
 * - Message metadata display
 * - IndexedDB persistence
 * - Configuration builder
 */

import * as React from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useChat,
  useMessageHistory,
  usePromptSuggestions,
  EnhancedMarkdownRenderer,
  PromptSuggestions,
  AdvancedMessageSearch,
  BatchExportDialog,
  MessageMetadata,
  EnhancedCodeBlock,
  StreamingTextRenderer,
  createChatConfig,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import type { Message } from '@clarity-chat/types'

export function AdvancedChatIntegration() {
  const [showBatchExport, setShowBatchExport] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filteredMessages, setFilteredMessages] = React.useState<Message[]>([])

  // Configuration using builder pattern
  const config = React.useMemo(
    () =>
      createChatConfig()
        .withStreaming({
          provider: 'openai',
          endpoint: '/api/chat/stream',
          retryPolicy: 'exponential',
        })
        .withAccessibility({
          screenReader: true,
          keyboardShortcuts: true,
        })
        .withPersistence({
          storage: 'indexeddb',
          maxHistory: 1000,
          autoSave: true,
        })
        .withMarkdown({
          enableKaTeX: true,
          enableMermaid: true,
          enableSyntaxHighlight: true,
        })
        .withSearch({
          enableFuzzySearch: true,
          enableAdvancedFilters: true,
        })
        .build(),
    []
  )

  // Message history with persistence
  const {
    messages,
    paginatedMessages,
    save,
    load,
    search,
  } = useMessageHistory({
    conversationId: 'advanced-chat-1',
    enablePagination: true,
    pageSize: 50,
    autoSave: true,
  })

  // Chat operations
  const { sendMessage, isLoading } = useChat({
    initialMessages: messages,
  })

  // Prompt suggestions
  const suggestions = usePromptSuggestions(messages, {
    maxSuggestions: 6,
    suggestionType: 'follow-up',
  })

  // Load messages on mount
  React.useEffect(() => {
    load()
  }, [load])

  // Handle search
  React.useEffect(() => {
    if (searchQuery) {
      const results = search(searchQuery)
      setFilteredMessages(results)
    } else {
      setFilteredMessages(messages)
    }
  }, [searchQuery, messages, search])

  const handleExport = async (options: {
    resourceIds: string[]
    format: string
    includeMetadata: boolean
    includeImages: boolean
    includeAttachments: boolean
  }) => {
    console.log('Exporting:', options)
    // Implement export logic
  }

  return (
    <ThemeProvider theme={themes.ocean}>
      <div className="flex flex-col h-screen">
        {/* Header with Search */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Advanced Chat</h1>
            <div className="flex-1 max-w-md">
              <AdvancedMessageSearch
                messages={messages}
                onResultsChange={setFilteredMessages}
                enableAdvancedFilters
                showFilterCount
              />
            </div>
            <button
              onClick={() => setShowBatchExport(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Export
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow className="flex-1">
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* Message Content */}
                {message.role === 'assistant' ? (
                  <EnhancedMarkdownRenderer
                    content={message.content}
                    config={config.markdown}
                    isStreaming={message.status === 'streaming'}
                  />
                ) : (
                  <p>{message.content}</p>
                )}

                {/* Message Metadata */}
                <MessageMetadata
                  message={message}
                  showCost
                  showResponseTime
                  showConfidence
                  showTokens
                  showModel
                />
              </div>
            ))}
          </div>

          {/* Prompt Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-t">
              <PromptSuggestions
                suggestions={suggestions}
                onSelect={(suggestion) => sendMessage(suggestion.text)}
                layout="chips"
              />
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t">
            <ChatInput
              onSendMessage={async (content) => {
                await sendMessage(content)
                await save()
              }}
              disabled={isLoading}
            />
          </div>
        </ChatWindow>

        {/* Batch Export Dialog */}
        <BatchExportDialog
          open={showBatchExport}
          onOpenChange={setShowBatchExport}
          resources={[
            {
              id: 'conv-1',
              name: 'Current Conversation',
              type: 'chat',
              messageCount: messages.length,
            },
          ]}
          onExport={handleExport}
        />
      </div>
    </ThemeProvider>
  )
}

export default AdvancedChatIntegration
