interface Template {
    id: string;
    name: string;
    category: string;
    description: string;
    code: string;
    dependencies?: Record<string, string>;
}
interface TemplateSelectorProps {
    templates: Template[];
    selectedId: string;
    onSelect: (id: string) => void;
}
export declare function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TemplateSelector.d.ts.map