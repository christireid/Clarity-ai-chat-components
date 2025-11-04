import { ContextCard } from '@clarity-chat/react';
const meta = {
    title: 'Components/ContextCard',
    component: ContextCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Document = {
    args: {
        context: {
            id: '1',
            type: 'document',
            title: 'React Documentation.pdf',
            preview: 'Complete guide to React hooks and components...',
            size: '2.5 MB',
            timestamp: Date.now(),
        },
    },
};
export const Image = {
    args: {
        context: {
            id: '2',
            type: 'image',
            title: 'diagram.png',
            preview: 'https://via.placeholder.com/150',
            size: '1.2 MB',
            timestamp: Date.now(),
        },
    },
};
export const Link = {
    args: {
        context: {
            id: '3',
            type: 'link',
            title: 'React Official Docs',
            preview: 'https://react.dev',
            url: 'https://react.dev',
            timestamp: Date.now(),
        },
    },
};
//# sourceMappingURL=ContextCard.stories.js.map