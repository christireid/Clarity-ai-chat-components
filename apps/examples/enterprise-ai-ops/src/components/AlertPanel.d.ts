interface AlertPanelProps {
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    onDismiss: () => void;
}
export declare function AlertPanel({ type, title, message, onDismiss }: AlertPanelProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AlertPanel.d.ts.map