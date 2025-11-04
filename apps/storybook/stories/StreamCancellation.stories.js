import { StreamCancellation } from '@clarity-chat/react';
const meta = {
    title: 'Components/StreamCancellation',
    component: StreamCancellation,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: { isStreaming: true, onCancel: () => console.log('Cancelled') },
};
export const WithProgress = {
    args: { isStreaming: true, progress: 65, onCancel: () => { } },
};
//# sourceMappingURL=StreamCancellation.stories.js.map