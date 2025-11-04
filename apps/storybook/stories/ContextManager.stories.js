import { ContextManager } from '@clarity-chat/react';
const meta = {
    title: 'Components/ContextManager',
    component: ContextManager,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
const mockContexts = [
    { id: '1', type: 'document', title: 'docs.pdf', size: '2MB' },
    { id: '2', type: 'image', title: 'diagram.png', size: '500KB' },
];
export const Default = {
    args: { contexts: mockContexts, onRemove: (id) => console.log('Remove:', id) },
};
//# sourceMappingURL=ContextManager.stories.js.map