import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: any;
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        showCost: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        size: {
            control: string;
            options: string[];
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithCost: Story;
export declare const SmallBadge: Story;
export declare const MediumBadge: Story;
export declare const LargeBadge: Story;
export declare const SizeComparison: Story;
export declare const InHeader: Story;
export declare const InToolbar: Story;
export declare const InSidebar: Story;
export declare const LiveUpdates: Story;
export declare const DifferentSavingsLevels: Story;
export declare const InteractiveDemo: Story;
//# sourceMappingURL=TokenOptimizationBadge.stories.d.ts.map