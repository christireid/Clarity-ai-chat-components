import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    subcomponents: {
        AnimatedListItem: any;
        FadePresence: any;
        SlidePresence: any;
        ScalePresence: any;
        ConditionalPresence: any;
    };
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        stagger: {
            control: string;
            options: string[];
            description: string;
        };
        delay: {
            control: string;
            description: string;
        };
        className: {
            control: boolean;
        };
    };
    args: {
        stagger: string;
        delay: number;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const TaskQueue: Story;
export declare const PresencePatterns: Story;
//# sourceMappingURL=AnimatedList.stories.d.ts.map