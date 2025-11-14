/**
 * Minimal Chat Example - The Simplest Way to Use Clarity Chat
 * 
 * This example shows how to add AI chat to your app in just 5 lines of code.
 * No configuration, no boilerplate, just works!
 */

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
