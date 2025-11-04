import { PromptLibrary } from '@clarity-chat/react';
const meta = {
    title: 'Components/PromptLibrary',
    component: PromptLibrary,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
const mockPrompts = [
    { id: '1', title: 'Code Review', content: 'Review this code for best practices...', category: 'development' },
    { id: '2', title: 'Explain Concept', content: 'Explain {concept} in simple terms...', category: 'education' },
];
export const Default = {
    args: { prompts: mockPrompts, onPromptSelect: (p) => console.log(p) },
};
//# sourceMappingURL=PromptLibrary.stories.js.map