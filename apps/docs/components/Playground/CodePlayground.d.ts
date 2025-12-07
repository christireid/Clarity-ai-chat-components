interface CodePlaygroundProps {
    initialCode: string;
    dependencies?: Record<string, string>;
    onCodeChange?: (code: string) => void;
    className?: string;
}
export declare function CodePlayground({ initialCode, dependencies, onCodeChange, className }: CodePlaygroundProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CodePlayground.d.ts.map