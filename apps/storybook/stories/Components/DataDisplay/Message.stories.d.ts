import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message } from '@clarity-chat/react';
/**
 * **Message Component**
 *
 * Enhanced message component for displaying chat messages with animations,
 * feedback, and interactive features.
 *
 * **Key Features:**
 * - Slide-in animations
 * - Hover actions
 * - Feedback buttons with confetti
 * - Streaming cursor pulse
 * - Avatar bounce animations
 * - Copy functionality
 * - Retry on error
 * - Markdown rendering
 *
 * **Use Cases:**
 * - Chat interfaces
 * - Messaging applications
 * - AI assistants
 * - Customer support
 */
declare const meta: Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof Message>;
export declare const UserMessage: Story;
export declare const AssistantMessage: Story;
export declare const StreamingMessage: Story;
export declare const SlideInAnimation: Story;
export declare const AvatarBounce: Story;
export declare const ActionBarReveal: Story;
export declare const FeedbackWithConfetti: Story;
export declare const StreamingCursor: Story;
export declare const WithMarkdown: Story;
export declare const WithCodeBlock: Story;
export declare const WithAttachments: Story;
export declare const SendingStatus: Story;
export declare const ErrorStatus: Story;
export declare const WithMetadata: Story;
export declare const Conversation: Story;
export declare const InteractiveDemo: Story;
//# sourceMappingURL=Message.stories.d.ts.map