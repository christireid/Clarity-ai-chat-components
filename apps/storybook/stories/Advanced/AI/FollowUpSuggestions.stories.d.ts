import type { Meta, StoryObj } from '@storybook/react-vite';
import { FollowUpSuggestions } from '@clarity-chat/react';
/**
 * **FollowUpSuggestions Component**
 *
 * Display contextual follow-up suggestions to keep conversations flowing.
 * Supports grid and list layouts with loading states.
 *
 * **Key Features:**
 * - Contextual suggestions based on conversation
 * - Grid and list layouts
 * - Loading states
 * - Confidence scores
 * - Keyword matching
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Chat interfaces
 * - AI assistants
 * - Conversation flows
 * - User guidance
 */
declare const meta: Meta<typeof FollowUpSuggestions>;
export default meta;
type Story = StoryObj<typeof FollowUpSuggestions>;
export declare const Default: Story;
export declare const GridLayout: Story;
export declare const ListLayout: Story;
export declare const Loading: Story;
export declare const CustomTitle: Story;
export declare const EmptyState: Story;
export declare const ManySuggestions: Story;
//# sourceMappingURL=FollowUpSuggestions.stories.d.ts.map