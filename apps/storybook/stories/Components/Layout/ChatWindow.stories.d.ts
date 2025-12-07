import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatWindow } from '@clarity-chat/react';
/**
 * **ChatWindow Component**
 *
 * Complete chat window component that orchestrates MessageList and ChatInput
 * to provide a full-featured chat interface.
 *
 * **Key Features:**
 * - Message display and management
 * - Input handling with send functionality
 * - Loading states
 * - Empty state handling
 * - Auto-scroll to latest message
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 *
 * **Use Cases:**
 * - AI chat interfaces
 * - Customer support
 * - Messaging applications
 * - Conversational UIs
 */
declare const meta: Meta<typeof ChatWindow>;
export default meta;
type Story = StoryObj<typeof ChatWindow>;
export declare const Default: Story;
export declare const Loading: Story;
export declare const EmptyChat: Story;
export declare const LongConversation: Story;
export declare const Interactive: Story;
export declare const WithError: Story;
export declare const Streaming: Story;
//# sourceMappingURL=ChatWindow.stories.d.ts.map