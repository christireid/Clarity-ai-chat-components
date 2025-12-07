export interface Prop {
    name: string;
    type: string;
    default?: string;
    required?: boolean;
    description?: string;
    deprecated?: boolean;
    deprecatedMessage?: string;
}
interface PropsTableProps {
    props: Prop[];
    title?: string;
    className?: string;
}
export declare function PropsTable({ props, title, className }: PropsTableProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=PropsTable.d.ts.map