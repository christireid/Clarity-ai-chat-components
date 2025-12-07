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
export declare const ErrorClassificationExample: Story;
export declare const RetryStrategyExample: Story;
export declare const APIDataFetchingExample: Story;
//# sourceMappingURL=UseErrorRecovery.stories.d.ts.map