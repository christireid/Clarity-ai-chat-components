import type { StoryObj } from '@storybook/react-vite';
/**
 * **useAssistant Hook**
 *
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 *
 * **Key Features:**
 * - Assistant thread management
 * - Tool calling support
 * - Multi-step workflows
 * - Status tracking (idle, in_progress, awaiting_message)
 * - Streaming responses
 * - Error handling
 * - Request cancellation
 *
 * **Use Cases:**
 * - AI assistants with tools
 * - Multi-step agent workflows
 * - Thread-based conversations
 * - Tool-using agents
 * - Enterprise assistant applications
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
export declare const StatusTracking: Story;
export declare const ToolCalling: Story;
export declare const ThreadManagement: Story;
//# sourceMappingURL=UseAssistant.stories.d.ts.map