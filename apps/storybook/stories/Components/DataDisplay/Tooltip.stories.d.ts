import type { StoryObj } from '@storybook/react-vite';
/**
 * Tooltip component for displaying helpful information on hover.
 *
 * **Key Features:**
 * - Appears on hover/focus
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Accessible with ARIA attributes
 * - Smooth animations
 *
 * **Best Practices:**
 * - Use for helpful hints and additional information
 * - Keep content concise (1-2 lines)
 * - Don't use for critical information
 */
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
        status: {
            type: string;
        };
        badges: string[];
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithArrow: Story;
export declare const DifferentPositions: Story;
export declare const LongContent: Story;
export declare const WithIcon: Story;
export declare const Disabled: Story;
export declare const WithoutArrow: Story;
export declare const CustomDelay: Story;
//# sourceMappingURL=Tooltip.stories.d.ts.map