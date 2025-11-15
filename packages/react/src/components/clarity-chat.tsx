/**
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Customized usage
 * import { ClarityChat } from '@clarity-chat/react'
 * 
 * export default function App() {
 *   return (
 *     <ClarityChat
 *       api="/api/chat"
 *       theme="dark"
 *       enableMemory
 *       showTokenCounter
 *       onMessageSent={(msg) => console.log('Sent:', msg)}
 *     />
 *   )
 * }
 * // With memory enabled
 * <ClarityChat 
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'vector-store' }}
 * />
 * ```
 */

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from '../hooks/use-clarity-chat'
  )
}

ClarityChat.displayName = 'ClarityChat'
