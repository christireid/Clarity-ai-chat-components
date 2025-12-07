import { ContextVisualizer } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Memory/ContextVisualizer',
    component: ContextVisualizer,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
const mockMessages = [
    { id: '1', role: 'user', content: 'Hello', tokens: 5, isIncluded: true },
    { id: '2', role: 'assistant', content: 'Hi there!', tokens: 8, isIncluded: true },
];
export const Default = {
    args: { messages: mockMessages, maxTokens: 4000, currentTokens: 13, showTokens: true },
};
//# sourceMappingURL=ContextVisualizer.stories.js.map