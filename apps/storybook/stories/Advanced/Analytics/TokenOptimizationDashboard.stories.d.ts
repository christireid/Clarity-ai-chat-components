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
        showBreakdown: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        realTime: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        refreshInterval: {
            control: string;
            description: string;
            table: {
                defaultValue: {
                    summary: string;
                };
            };
        };
        costPerToken: {
            control: string;
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
export declare const WithoutBreakdown: Story;
export declare const SmallScale: Story;
export declare const MediumScale: Story;
export declare const LargeScale: Story;
export declare const EnterpriseScale: Story;
export declare const RealTimeMonitoring: Story;
export declare const BeforeAfterComparison: Story;
export declare const InteractiveDemo: Story;
export declare const FullPageDashboard: Story;
//# sourceMappingURL=TokenOptimizationDashboard.stories.d.ts.map