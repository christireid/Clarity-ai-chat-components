import { jsx as _jsx } from "react/jsx-runtime";
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
import * as React from 'react';
import { ClarityChat } from './clarity-chat';
/**
 * ClarityChatSimple - Ultra-minimal chat component
 *
 * Even simpler than ClarityChat - just provide an endpoint and you're done.
 * All other features are enabled by default with sensible defaults.
 */
export function ClarityChatSimple({ endpoint, theme, }) {
    return (_jsx(ClarityChat, { api: endpoint, theme: theme, 
        // All features enabled by default
        showTokenCounter: true, showNetworkStatus: true, enableMessageOperations: true }));
}
ClarityChatSimple.displayName = 'ClarityChatSimple';
//# sourceMappingURL=clarity-chat-simple.js.map