import type { StoryObj } from '@storybook/react-vite';
/**
 * **useThrottle Hook**
 *
 * Hook for throttling values - only updates at most once per delay period.
 * Useful for limiting the rate of updates from frequent events.
 *
 * **Key Features:**
 * - Throttle value updates
 * - Configurable delay
 * - Limits update frequency
 * - Automatic cleanup
 *
 * **Use Cases:**
 * - Scroll position tracking
 * - Resize handlers
 * - Mouse move events
 * - Window scroll events
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
export declare const ScrollTracking: Story;
export declare const ResizeTracking: Story;
export declare const Counter: Story;
//# sourceMappingURL=UseThrottle.stories.d.ts.map