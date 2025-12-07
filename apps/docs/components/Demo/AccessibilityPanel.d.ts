interface A11yCheck {
    name: string;
    status: 'pass' | 'warning' | 'info';
    message: string;
    wcagLevel?: 'A' | 'AA' | 'AAA';
}
interface AccessibilityPanelProps {
    componentName?: string;
    checks?: A11yCheck[];
    keyboardShortcuts?: Array<{
        key: string;
        action: string;
    }>;
    ariaAttributes?: Record<string, string>;
    className?: string;
}
export declare function AccessibilityPanel({ componentName, checks, keyboardShortcuts, ariaAttributes, className, }: AccessibilityPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AccessibilityPanel.d.ts.map