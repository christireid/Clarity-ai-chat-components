import * as React from 'react';
export interface KeyboardHintShortcut {
    keys: string[];
    description: string;
    category?: string;
}
export interface KeyboardHintProps {
    shortcuts: KeyboardHintShortcut[];
    visible: boolean;
    onClose?: () => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    className?: string;
}
export declare const KeyboardHint: React.ForwardRefExoticComponent<KeyboardHintProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=keyboard-hint.d.ts.map