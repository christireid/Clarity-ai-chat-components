import type { StoryObj } from '@storybook/react-vite';
/**
 * **useClarityChat Hook (Flagship API)**
 *
 * Clarity's flagship chat hook that extends useChatEnhanced with:
 * - Memory integration (sliding-window, semantic-chunks, vector-store)
 * - Transport selection (SSE/WebSocket)
 * - Context enrichment
 * - Auto memory capture
 *
 * **Key Features:**
 * - Full Vercel AI SDK compatibility
 * - Memory-aware conversations
 * - Configurable memory strategies
 * - Transport protocol selection
 * - Context summary generation
 * - Auto memory capture
 *
 * **Use Cases:**
 * - Production AI chat applications
 * - Long-context conversations
 * - Memory-enabled assistants
 * - Enterprise chat solutions
 * - Multi-turn conversations with context
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
export declare const Basic: Story;
export declare const MemoryStrategies: Story;
export declare const TransportSelection: Story;
export declare const FullFeatured: Story;
//# sourceMappingURL=UseClarityChat.stories.d.ts.map