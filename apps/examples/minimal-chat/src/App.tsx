/**
 * Minimal Chat Example - The Simplest Way to Use Clarity Chat
 *
 * This example shows how to add AI chat to your app in just ONE LINE of code.
 * No configuration, no boilerplate, just works!
 *
 * To add advanced features, just add a `features` or `preset` prop:
 *
 * - <ClarityChatApp api="/api/chat" features={{ memory: true }} />
 * - <ClarityChatApp api="/api/chat" preset="pro" />
 * - <ClarityChatApp api="/api/chat" preset="enterprise" />
 *
 * Available presets: simple | pro | memory | rag | tools | enterprise
 */

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
