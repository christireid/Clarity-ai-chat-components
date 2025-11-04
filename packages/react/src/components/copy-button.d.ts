import * as React from 'react';
import { type ButtonProps } from '@clarity-chat/primitives';
export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'state'> {
    text: string;
    onCopy?: () => void;
    /** Show icon only (no text) */
    iconOnly?: boolean;
    /** Custom copy text */
    copyText?: string;
    /** Custom copied text */
    copiedText?: string;
}
export declare const CopyButton: React.NamedExoticComponent<CopyButtonProps>;
//# sourceMappingURL=copy-button.d.ts.map