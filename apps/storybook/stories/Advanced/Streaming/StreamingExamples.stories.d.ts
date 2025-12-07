import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const SSETransport: Story;
export declare const WebSocketTransport: Story;
//# sourceMappingURL=StreamingExamples.stories.d.ts.map