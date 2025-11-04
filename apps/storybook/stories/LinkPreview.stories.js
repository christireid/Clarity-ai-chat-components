import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LinkPreview, InlineLink } from '@clarity-chat/react';
const linkPreviewMeta = {
    title: 'Components/LinkPreview/Preview',
    component: LinkPreview,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        onRemove: { action: 'removed' },
    },
};
export default linkPreviewMeta;
const defaultMetadata = {
    url: 'https://example.com/article',
    title: 'Understanding React Hooks',
    description: 'A comprehensive guide to React Hooks and how to use them effectively in your applications.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    siteName: 'Dev Blog',
    favicon: '🌐',
};
export const Default = {
    args: {
        metadata: defaultMetadata,
    },
};
export const NoImage = {
    args: {
        metadata: {
            ...defaultMetadata,
            image: undefined,
        },
    },
};
export const NoDescription = {
    args: {
        metadata: {
            ...defaultMetadata,
            description: undefined,
        },
    },
};
export const LongTitle = {
    args: {
        metadata: {
            ...defaultMetadata,
            title: 'This is a Very Long Title That Should Be Truncated After a Certain Number of Characters to Maintain Good UI Design',
        },
    },
};
export const YouTubeVideo = {
    args: {
        metadata: {
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Amazing Tutorial Video',
            description: 'Learn everything you need to know about web development in this comprehensive tutorial.',
            image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
            siteName: 'YouTube',
            favicon: '▶️',
        },
    },
};
export const GitHubRepo = {
    args: {
        metadata: {
            url: 'https://github.com/facebook/react',
            title: 'facebook/react',
            description: 'The library for web and native user interfaces',
            image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
            siteName: 'GitHub',
            favicon: '🐙',
        },
    },
};
export const WithRemoveButton = {
    args: {
        metadata: defaultMetadata,
        onRemove: () => console.log('Remove clicked'),
    },
};
export const Loading = {
    args: {
        metadata: defaultMetadata,
    },
    parameters: {
        chromatic: { delay: 300 },
    },
};
// InlineLink stories
const inlineLinkMeta = {
    title: 'Components/LinkPreview/InlineLink',
    component: InlineLink,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};
export const InlineLinkStories = inlineLinkMeta;
export const BasicInlineLink = {
    args: {
        url: 'https://example.com',
        children: 'Check out this article',
    },
};
export const InlineLinkWithPreview = {
    args: {
        url: 'https://example.com/article',
        children: 'Hover to see preview',
    },
};
export const InlineLinkInText = {
    render: () => (_jsxs("p", { className: "text-gray-700", children: ["This is some text with an", ' ', _jsx(InlineLink, { url: "https://example.com", children: "embedded link" }), " that shows a preview on hover. You can also", ' ', _jsx(InlineLink, { url: "https://github.com", children: "link to other sites" }), ' ', "seamlessly."] })),
};
//# sourceMappingURL=LinkPreview.stories.js.map