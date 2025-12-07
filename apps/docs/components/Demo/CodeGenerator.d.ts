interface CodeGeneratorProps {
    componentName: string;
    props: Record<string, any>;
    imports?: string[];
    wrapperCode?: string;
    className?: string;
}
export declare function CodeGenerator({ componentName, props, imports, wrapperCode, className, }: CodeGeneratorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CodeGenerator.d.ts.map