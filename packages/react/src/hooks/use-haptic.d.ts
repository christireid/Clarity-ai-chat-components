import * as React from 'react';
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';
export interface UseHapticOptions {
    enabled?: boolean;
}
export declare const useHaptic: ({ enabled }?: UseHapticOptions) => {
    isSupported: boolean;
    vibrate: (pattern: HapticPattern | number | number[]) => boolean;
    stop: () => boolean;
    light: () => boolean;
    medium: () => boolean;
    heavy: () => boolean;
    success: () => boolean;
    warning: () => boolean;
    error: () => boolean;
    selection: () => boolean;
};
export interface WithHapticProps {
    onClick?: (e: React.MouseEvent) => void;
    hapticPattern?: HapticPattern;
    hapticEnabled?: boolean;
}
export declare const withHaptic: <P extends object>(Component: React.ComponentType<P>, defaultPattern?: HapticPattern) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & WithHapticProps> & React.RefAttributes<any>>;
export interface UseHapticFeedbackOptions {
    onSuccess?: HapticPattern;
    onError?: HapticPattern;
    onWarning?: HapticPattern;
    onSelection?: HapticPattern;
    enabled?: boolean;
}
export declare const useHapticFeedback: ({ onSuccess, onError, onWarning, onSelection, enabled, }?: UseHapticFeedbackOptions) => {
    triggerSuccess: () => void;
    triggerError: () => void;
    triggerWarning: () => void;
    triggerSelection: () => void;
};
//# sourceMappingURL=use-haptic.d.ts.map