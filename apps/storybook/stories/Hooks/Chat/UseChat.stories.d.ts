import type { StoryObj } from '@storybook/react-vite';
/**
 * **useChat Hook**
 *
 * The core hook for managing chat state, messages, and async operations.
 *
 * **Key Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Loading states
 * - Message history
 *
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 * - Customer support
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
export declare const ErrorHandling: Story;
export declare const Cancellation: Story;
//# sourceMappingURL=UseChat.stories.d.ts.map