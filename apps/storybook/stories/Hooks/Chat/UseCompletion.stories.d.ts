import type { StoryObj } from '@storybook/react-vite';
/**
 * **useCompletion Hook**
 *
 * Hook for managing text completion state with streaming support.
 * Ideal for single-turn completions, autocomplete, and text generation.
 *
 * **Key Features:**
 * - Streaming text completion
 * - Single-turn interactions
 * - Error handling and recovery
 * - Request cancellation
 * - Custom API endpoints
 * - Callback support
 *
 * **Use Cases:**
 * - Text autocomplete
 * - Single-turn AI completions
 * - Text generation
 * - Code completion
 * - Search suggestions
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
export declare const WithMockAPI: Story;
export declare const ErrorHandling: Story;
export declare const Cancellation: Story;
//# sourceMappingURL=UseCompletion.stories.d.ts.map