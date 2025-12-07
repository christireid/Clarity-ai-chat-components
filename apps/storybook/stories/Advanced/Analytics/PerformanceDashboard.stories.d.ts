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
        detailed: {
            control: string;
        };
        updateInterval: {
            control: {
                type: string;
                min: number;
                step: number;
            };
        };
    };
    args: {
        detailed: boolean;
        updateInterval: number;
    };
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const LiveMetrics: Story;
export declare const Compact: Story;
//# sourceMappingURL=PerformanceDashboard.stories.d.ts.map