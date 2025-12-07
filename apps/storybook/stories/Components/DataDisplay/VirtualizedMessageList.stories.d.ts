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
        enableVirtualization: {
            control: string;
        };
        estimatedMessageHeight: {
            control: {
                type: string;
                min: number;
                step: number;
            };
        };
        overscan: {
            control: {
                type: string;
                min: number;
                max: number;
            };
        };
        loadingCount: {
            control: {
                type: string;
                min: number;
                max: number;
            };
        };
    };
    args: {
        enableVirtualization: boolean;
        estimatedMessageHeight: number;
        overscan: number;
        loadingCount: number;
        className: string;
    };
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const LargeConversation: Story;
export declare const LoadingSkeleton: Story;
export declare const NonVirtualized: Story;
export declare const EmptyState: Story;
export declare const WithError: Story;
export declare const StreamingMessage: Story;
//# sourceMappingURL=VirtualizedMessageList.stories.d.ts.map