import * as React from 'react';
export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void | Promise<void>;
    placeholder?: string;
    disabled?: boolean;
    /** Maximum character length */
    maxLength?: number;
    /** Show character counter (default: true if maxLength is set) */
    showCharCounter?: boolean;
    /** Warning threshold percentage (default: 80%) */
    warningThreshold?: number;
    /** Enable smooth expand/contract animation */
    animateHeight?: boolean;
    /** Enable focus ring glow animation */
    glowOnFocus?: boolean;
    className?: string;
}
export declare const ChatInput: React.NamedExoticComponent<ChatInputProps>;
//# sourceMappingURL=chat-input.d.ts.map