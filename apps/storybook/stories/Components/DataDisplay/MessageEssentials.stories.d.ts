import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message } from '@clarity-chat/react';
/**
 * **Message Component - Essentials Track**
 *
 * This track focuses on the most common use cases for the Message component.
 * These examples are production-ready and can be copied directly into your app.
 *
 * For advanced patterns, see the "Enterprise" and "Composability" tracks.
 */
declare const meta: Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof Message>;
/**
 * **Essential Pattern 1: Basic User Message**
 *
 * The simplest use case - displaying a user message.
 * This is what you'll use most often.
 */
export declare const UserMessage: Story;
/**
 * **Essential Pattern 2: Basic Assistant Message**
 *
 * Display an assistant response with markdown support.
 * This handles most AI responses.
 */
export declare const AssistantMessage: Story;
/**
 * **Essential Pattern 3: Conversation Flow**
 *
 * Show multiple messages in a conversation.
 * This demonstrates the typical chat pattern.
 */
export declare const Conversation: Story;
/**
 * **Essential Pattern 4: Loading State**
 *
 * Show a message that's still being generated.
 * Essential for streaming responses.
 */
export declare const LoadingState: Story;
/**
 * **Essential Pattern 5: Error State**
 *
 * Show an error message with retry option.
 * Important for handling failures gracefully.
 */
export declare const ErrorState: Story;
/**
 * **Essential Pattern 6: With Timestamps**
 *
 * Show messages with timestamps.
 * Useful for longer conversations.
 */
export declare const WithTimestamps: Story;
//# sourceMappingURL=MessageEssentials.stories.d.ts.map