import { PromptLibrary } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/AI/PromptLibrary',
    component: PromptLibrary,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
const mockPrompts = [
    { id: '1', title: 'Advanced/AI/PromptLibrary', content: 'Review this code for best practices...', category: 'development' },
    { id: '2', title: 'Advanced/AI/PromptLibrary', content: 'Explain {concept} in simple terms...', category: 'education' },
];
export const Default = {
    args: { prompts: mockPrompts, onPromptSelect: (p) => console.log(p) },
};
//# sourceMappingURL=PromptLibrary.stories.js.map