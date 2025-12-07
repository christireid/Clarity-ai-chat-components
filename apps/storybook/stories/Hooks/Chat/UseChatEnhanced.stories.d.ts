import type { StoryObj } from '@storybook/react-vite';
/**
 * **useChat Hook (Enhanced)**
 *
 * Enhanced useChat hook with full Vercel AI SDK compatibility.
 * Provides complete chat interface with streaming support, message management,
 * tool calling, and multi-modal content.
 *
 * **Key Features:**
 * - Vercel AI SDK compatible API
 * - Streaming support (SSE and data protocols)
 * - Multi-modal messages (text, images, tool calls)
 * - Tool invocation support
 * - Message management
 * - Error handling and recovery
 * - Request cancellation
 * - Form handling
 *
 * **Use Cases:**
 * - AI chat interfaces
 * - Multi-turn conversations
 * - Tool-using assistants
 * - Multi-modal chat applications
 * - Enterprise chat solutions
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
export declare const WithInitialMessages: Story;
export declare const AppendMessage: Story;
export declare const Reload: Story;
export declare const ErrorHandling: Story;
//# sourceMappingURL=UseChatEnhanced.stories.d.ts.map