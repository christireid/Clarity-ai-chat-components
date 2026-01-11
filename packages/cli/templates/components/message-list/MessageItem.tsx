/**
 * Message Item Component
 * Individual message display with role-based styling
 */

import React from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
  isStreaming?: boolean
}

interface MessageItemProps {
  message: Message
  showTimestamp?: boolean
  className?: string
}

export function MessageItem({
  message,
  showTimestamp = false,
  className = '',
}: MessageItemProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div className="flex flex-col gap-1 max-w-[80%]">
        {/* Avatar and name */}
        {!isUser && (
          <div className="flex items-center gap-2 ml-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">AI</span>
            </div>
            <span className="text-xs text-gray-500">Assistant</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {/* Streaming cursor */}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && message.createdAt && (
          <span className={`text-xs text-gray-400 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}
