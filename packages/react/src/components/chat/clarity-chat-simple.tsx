/**
 * ClarityChatSimple - Even Simpler Version
 * 
 * This is an ultra-minimal version of ClarityChat with even fewer props.
 * Perfect for when you just want to drop in a chat and go.
 * 
 * @example
 * ```tsx
 * import { ClarityChatSimple } from '@clarity-chat/react'
 * 
 * export default function App() {
 *   return <ClarityChatSimple endpoint="/api/chat" />
 * }
 * ```
 */

import * as React from 'react'
import { ClarityChat, type ClarityChatProps } from './clarity-chat'

/**
 * Ultra-simple props - just the endpoint
 */
export interface ClarityChatSimpleProps {
  /** API endpoint URL - the only required prop */
  endpoint: string
  /** Optional: Theme name */
  theme?: string
}

/**
 * ClarityChatSimple - Ultra-minimal chat component
 * 
 * Even simpler than ClarityChat - just provide an endpoint and you're done.
 * All other features are enabled by default with sensible defaults.
 */
export function ClarityChatSimple({
  endpoint,
  theme,
}: ClarityChatSimpleProps) {
  return (
    <ClarityChat
      api={endpoint}
      theme={theme}
      // All features enabled by default
      showTokenCounter={true}
      showNetworkStatus={true}
      enableMessageOperations={true}
    />
  )
}

ClarityChatSimple.displayName = 'ClarityChatSimple'
