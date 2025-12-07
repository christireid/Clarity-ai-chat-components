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
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const BasicExample: Story;
export declare const AIStreamingExample: Story;
export declare const ConnectionStatusExample: Story;
export declare const AutoReconnectionExample: Story;
export declare const RealTimeDashboard: Story;
//# sourceMappingURL=UseStreamingSSE.stories.d.ts.map