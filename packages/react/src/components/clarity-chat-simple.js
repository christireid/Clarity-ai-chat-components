import { jsx as _jsx } from "react/jsx-runtime";
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