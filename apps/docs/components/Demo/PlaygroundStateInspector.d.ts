interface StateInspectorProps {
    state?: Record<string, any>;
    events?: Array<{
        name: string;
        timestamp: number;
        data?: any;
    }>;
    className?: string;
}
export declare function PlaygroundStateInspector({ state, events, className, }: StateInspectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlaygroundStateInspector.d.ts.map