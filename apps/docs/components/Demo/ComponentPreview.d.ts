import { ReactNode } from 'react';
interface ComponentPreviewProps {
    children: ReactNode;
    code: string;
    title?: string;
    description?: string;
    language?: string;
    className?: string;
}
export declare function ComponentPreview({ children, code, title, description, language, className, }: ComponentPreviewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ComponentPreview.d.ts.map