import type { StoryObj } from '@storybook/react-vite';
/**
 * **useClarityChat Hook - Essentials Track**
 *
 * This track focuses on the most common use cases for useClarityChat.
 * These examples are production-ready and can be copied directly into your app.
 *
 * For advanced patterns, see the "Enterprise" track.
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
/**
 * **Essential Pattern 1: Basic Chat**
 *
 * The simplest use case - a basic chat interface with minimal configuration.
 * This is what you'll use most often.
 */
export declare const BasicChat: Story;
/**
 * **Essential Pattern 2: With ChatWindow**
 *
 * Use the ChatWindow component for a complete, production-ready interface.
 * This is the recommended pattern for most applications.
 */
export declare const WithChatWindow: Story;
/**
 * **Essential Pattern 3: With Memory**
 *
 * Enable conversation memory for context-aware responses.
 * This is essential for multi-turn conversations.
 */
export declare const WithMemory: Story;
//# sourceMappingURL=Essentials.stories.d.ts.map