import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import("react").NamedExoticComponent<import("@clarity-chat/react").KnowledgeBaseViewerProps>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        onUpdate: {
            action: string;
        };
        onDelete: {
            action: string;
        };
        onExport: {
            action: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const SingleSection: Story;
export declare const ManySections: Story;
export declare const LowConfidence: Story;
export declare const HighConfidence: Story;
export declare const NoSources: Story;
export declare const LongContent: Story;
export declare const MixedTags: Story;
//# sourceMappingURL=KnowledgeBaseViewer.stories.d.ts.map