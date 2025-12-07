import type { Meta, StoryObj } from '@storybook/react-vite';
import { VirtualizedMessageList as MessageList } from '@clarity-chat/react';
/**
 * **MessageList Component**
 *
 * Message list component with auto-scroll, scroll-to-bottom button,
 * and comprehensive message management features.
 *
 * **Key Features:**
 * - Auto-scroll to latest message
 * - Scroll-to-bottom button
 * - Message rendering with animations
 * - Copy, feedback, and retry actions
 * - Empty state handling
 * - Virtual scrolling support
 *
 * **Use Cases:**
 * - Chat interfaces
 * - Messaging applications
 * - AI assistants
 * - Conversation views
 */
declare const meta: Meta<typeof MessageList>;
export default meta;
type Story = StoryObj<typeof MessageList>;
export declare const Default: Story;
export declare const EmptyList: Story;
export declare const SingleMessage: Story;
export declare const LongConversation: Story;
export declare const WithCodeBlocks: Story;
//# sourceMappingURL=MessageList.stories.d.ts.map