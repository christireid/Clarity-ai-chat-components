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
        showDetails: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        showCacheStats: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        showRoutingStats: {
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
export declare const SmallSize: Story;
export declare const LargeSize: Story;
export declare const MinimalView: Story;
export declare const CacheOnly: Story;
export declare const RoutingOnly: Story;
export declare const LowUsage: Story;
export declare const MediumUsage: Story;
export declare const HighUsage: Story;
export declare const EnterpriseUsage: Story;
export declare const RealTimeUpdates: Story;
export declare const SideBySideComparison: Story;
export declare const InteractiveDemo: Story;
//# sourceMappingURL=TokenOptimizationPanel.stories.d.ts.map