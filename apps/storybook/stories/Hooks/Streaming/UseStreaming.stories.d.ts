import type { StoryObj } from '@storybook/react-vite';
/**
 * **useStreaming Hook**
 *
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 *
 * **Key Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 *
 * **Use Cases:**
 * - Streaming API responses (OpenAI, Anthropic, etc.)
 * - Large file processing
 * - Real-time data feeds
 * - Progressive content rendering
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
export declare const WithCallbacks: Story;
export declare const Cancellation: Story;
export declare const FromAPI: Story;
//# sourceMappingURL=UseStreaming.stories.d.ts.map