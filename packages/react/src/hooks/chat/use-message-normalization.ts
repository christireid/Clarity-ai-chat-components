'use client'

import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import type { CoreMessage } from './use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'

/**
 * Hook to normalize messages from potentially CoreMessage[] to Message[]
 * 
 * Handles the conversion from Vercel AI SDK 'CoreMessage' format to Clarity's
 * internal 'Message' format (with metadata, timestamps, etc).
 * 
 * @param messages - Array of messages (either CoreMessage[] or Message[])
 * @returns Normalized array of Message[]
 */
export function useMessageNormalization(
  messages: Message[] | CoreMessage[]
): Message[] {
  return React.useMemo(() => {
    if (!messages || messages.length === 0) return []

    // Check if it's CoreMessage[] format by checking first message structure
    // CoreMessage has 'role' and 'content' but no 'status' or 'createdAt'
    // Message has 'status', 'createdAt', etc.
    const firstMessage = messages[0]
    
    // Type guard for CoreMessage
    const isCoreMessage =
      firstMessage &&
      'role' in firstMessage &&
      'content' in firstMessage &&
      !('status' in firstMessage) &&
      !('createdAt' in firstMessage)

    if (isCoreMessage) {
      return convertCoreMessagesToMessages(messages as CoreMessage[])
    }

    // Already Message[]
    return messages as Message[]
  }, [messages])
}
