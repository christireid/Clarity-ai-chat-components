import type { StoryObj } from '@storybook/react-vite';
/**
 * **useWindowSize Hook**
 *
 * Hook for tracking window dimensions with throttled updates
 * to prevent performance issues during window resize events.
 *
 * **Key Features:**
 * - Track window width and height
 * - Automatic throttling (150ms default)
 * - SSR-safe (returns 0x0 on server)
 * - Automatic cleanup on unmount
 * - Memory efficient
 *
 * **Use Cases:**
 * - Responsive component rendering
 * - Conditional layout switching
 * - Dynamic sizing calculations
 * - Mobile/desktop detection
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
export declare const BasicUsage: Story;
export declare const ResponsiveLayout: Story;
export declare const ConditionalRendering: Story;
//# sourceMappingURL=UseWindowSize.stories.d.ts.map