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
        type: {
            control: string;
            options: string[];
        };
        message: {
            control: string;
        };
        duration: {
            control: {
                type: string;
                min: number;
                step: number;
            };
        };
    };
    args: {
        type: string;
        message: string;
        duration: number;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Library: Story;
//# sourceMappingURL=FeedbackAnimation.stories.d.ts.map