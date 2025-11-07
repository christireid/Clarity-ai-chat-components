import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button } from '@clarity-chat/primitives';
import { useClipboard } from '../hooks/use-clipboard';
import { CopyIcon, CheckIcon } from './icons';
export const CopyButton = React.memo(function CopyButton({ text, onCopy, iconOnly = false, copyText = 'Copy', copiedText = 'Copied!', children, ...props }) {
    const { copy, copied } = useClipboard({
        timeout: 2000,
        onSuccess: onCopy,
    });
    const handleCopy = async () => {
        await copy(text);
    };
    return (_jsx(Button, { variant: "ghost", size: "sm", state: copied ? 'success' : 'idle', onClick: handleCopy, "aria-label": copied ? copiedText : copyText, ...props, children: copied ? (_jsxs(_Fragment, { children: [_jsx(CheckIcon, { size: 16 }), !iconOnly && (children || copiedText)] })) : (_jsxs(_Fragment, { children: [_jsx(CopyIcon, { size: 16 }), !iconOnly && (children || copyText)] })) }));
});
CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=copy-button.js.map