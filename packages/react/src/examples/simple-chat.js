import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Simple Chat Example - The Easiest Way to Get Started
 *
 * This example shows the absolute minimum code needed to get a
 * fully functional AI chat interface running.
 *
 * Copy this → paste → you're done.
 */
import { ClarityChat } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
export function SimpleChat() {
    return _jsx(ClarityChat, { api: "/api/chat" });
}
//# sourceMappingURL=simple-chat.js.map