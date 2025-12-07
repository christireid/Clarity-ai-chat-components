import type { StoryObj } from '@storybook/react-vite';
/**
 * **usePrevious Hook**
 *
 * Hook for getting the previous value of state or prop from the last render.
 * Useful for tracking changes and implementing undo/comparison features.
 *
 * **Key Features:**
 * - Track previous value
 * - Compare current vs previous
 * - Undefined on first render
 * - Automatic updates
 * - Memory efficient
 *
 * **Use Cases:**
 * - Tracking value changes
 * - Comparing current vs previous
 * - Animation triggers
 * - Undo functionality
 * - Debugging state changes
 */
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
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Counter: Story;
export declare const InputChange: Story;
export declare const Undo: Story;
//# sourceMappingURL=UsePrevious.stories.d.ts.map