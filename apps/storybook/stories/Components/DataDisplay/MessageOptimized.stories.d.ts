import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        showAvatar: {
            control: string;
        };
        showTimestamp: {
            control: string;
        };
    };
    args: {
        showAvatar: boolean;
        showTimestamp: boolean;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const AssistantResponse: Story;
export declare const Streaming: Story;
export declare const WithFeedback: Story;
export declare const UserMessage: Story;
//# sourceMappingURL=MessageOptimized.stories.d.ts.map