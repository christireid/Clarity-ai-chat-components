import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        onExport: {
            action: string;
        };
        onClose: {
            action: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const ChatExport: Story;
export declare const KnowledgeBaseExport: Story;
export declare const ProjectExport: Story;
export declare const WithDateRange: Story;
export declare const PDFFormat: Story;
export declare const DOCXFormat: Story;
export declare const MarkdownFormat: Story;
export declare const JSONFormat: Story;
export declare const HTMLFormat: Story;
export declare const Closed: Story;
export declare const LongResourceName: Story;
export declare const AllOptionsEnabled: Story;
export declare const Exporting: Story;
//# sourceMappingURL=ExportDialog.stories.d.ts.map