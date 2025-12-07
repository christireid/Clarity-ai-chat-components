import type { StoryObj } from '@storybook/react-vite';
/**
 * Popover component for displaying floating content.
 *
 * **Key Features:**
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Collision detection
 * - Keyboard accessible
 * - Smooth animations
 *
 * **Best Practices:**
 * - Use for contextual information
 * - Keep content concise
 * - Provide clear trigger
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
export declare const Controlled: Story;
export declare const WithForm: Story;
export declare const WithoutArrow: Story;
//# sourceMappingURL=Popover.stories.d.ts.map