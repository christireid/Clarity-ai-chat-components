type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'quote';
interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}
export declare function Callout({ type, title, children, className, icon, collapsible, defaultCollapsed, }: CalloutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Callout.d.ts.map