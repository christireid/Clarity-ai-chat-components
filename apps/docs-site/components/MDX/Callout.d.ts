type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip';
interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}
export declare function Callout({ type, title, children }: CalloutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Callout.d.ts.map