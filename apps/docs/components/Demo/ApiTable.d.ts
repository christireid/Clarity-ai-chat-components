export interface PropDefinition {
    name: string;
    type: string;
    required?: boolean;
    default?: string;
    description: string;
}
interface ApiTableProps {
    title?: string;
    data: PropDefinition[];
    className?: string;
}
export declare function ApiTable({ title, data, className }: ApiTableProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ApiTable.d.ts.map