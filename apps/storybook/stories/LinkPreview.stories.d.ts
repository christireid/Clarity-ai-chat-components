import type { StoryObj } from '@storybook/react';
declare const linkPreviewMeta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        onRemove: {
            action: string;
        };
    };
};
export default linkPreviewMeta;
type PreviewStory = StoryObj<typeof linkPreviewMeta>;
export declare const Default: PreviewStory;
export declare const NoImage: PreviewStory;
export declare const NoDescription: PreviewStory;
export declare const LongTitle: PreviewStory;
export declare const YouTubeVideo: PreviewStory;
export declare const GitHubRepo: PreviewStory;
export declare const WithRemoveButton: PreviewStory;
export declare const Loading: PreviewStory;
declare const inlineLinkMeta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
    };
    tags: string[];
};
export declare const InlineLinkStories: {
    title: string;
    component: any;
    parameters: {
        layout: string;
    };
    tags: string[];
};
type InlineLinkStory = StoryObj<typeof inlineLinkMeta>;
export declare const BasicInlineLink: InlineLinkStory;
export declare const InlineLinkWithPreview: InlineLinkStory;
export declare const InlineLinkInText: InlineLinkStory;
//# sourceMappingURL=LinkPreview.stories.d.ts.map