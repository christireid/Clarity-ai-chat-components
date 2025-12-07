interface Heading {
    id: string;
    text: string;
    level: number;
}
interface TableOfContentsProps {
    headings?: Heading[];
    className?: string;
}
export declare function TableOfContents({ headings: propHeadings, className }: TableOfContentsProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=TableOfContents.d.ts.map