import { jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Message metadata component (tokens, processing time, model)
 * Extracted from Message component for better organization
 */
export const MessageMetadata = React.memo(({ metadata }) => {
    if (!metadata)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [metadata.tokens && _jsxs("span", { children: [metadata.tokens, " tokens"] }), metadata.processingTime && (_jsxs("span", { children: ["\u26A1 ", metadata.processingTime, "ms"] })), metadata.model && _jsxs("span", { children: ["\uD83E\uDD16 ", metadata.model] })] }));
});
MessageMetadata.displayName = 'MessageMetadata';
//# sourceMappingURL=message-metadata.js.map