import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConversationTimeline } from '@clarity-chat/react';
/**
 * **ConversationTimeline Component**
 *
 * Visual timeline showing conversation events including user messages,
 * assistant responses, tool calls, and system events.
 *
 * **Key Features:**
 * - Multiple event types (user, assistant, tool, system)
 * - Timestamp display
 * - Duration tracking
 * - Status indicators
 * - Expandable details
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Conversation history
 * - Debugging and monitoring
 * - Activity feeds
 * - Audit logs
 */
declare const meta: Meta<typeof ConversationTimeline>;
export default meta;
type Story = StoryObj<typeof ConversationTimeline>;
export declare const Default: Story;
export declare const AllEventTypes: Story;
export declare const WithStatusIndicators: Story;
export declare const WithJumpTo: Story;
export declare const LongTimeline: Story;
//# sourceMappingURL=ConversationTimeline.stories.d.ts.map