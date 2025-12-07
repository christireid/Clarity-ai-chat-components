import type { StoryObj } from '@storybook/react-vite';
/**
 * **useStreamableUI Hook**
 *
 * Hook for handling streamable UI values from various sources
 * including StreamableValue, AsyncIterable, Promise, and ReadableStream.
 *
 * **Key Features:**
 * - Support for multiple source types (StreamableValue, AsyncIterable, Promise, ReadableStream)
 * - Append or replace mode for value accumulation
 * - Custom transformation functions
 * - Completion detection
 * - Error handling
 * - Status tracking (idle, streaming, complete, error)
 *
 * **Use Cases:**
 * - Vercel AI SDK StreamableValue integration
 * - Progressive UI updates
 * - Real-time data streaming
 * - Async data handling
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
export declare const AsyncIterableSource: Story;
export declare const ReadableStreamSource: Story;
export declare const ReplaceMode: Story;
export declare const CustomTransform: Story;
export declare const ErrorHandling: Story;
//# sourceMappingURL=UseStreamableUI.stories.d.ts.map