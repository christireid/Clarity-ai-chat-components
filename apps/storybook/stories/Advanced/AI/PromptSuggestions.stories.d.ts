import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptSuggestions } from '@clarity-chat/react';
/**
 * **PromptSuggestions Component**
 *
 * Display prompt suggestions for starting or continuing conversations.
 * Supports starter prompts and follow-up prompts with icons and categories.
 *
 * **Key Features:**
 * - Starter prompts for new conversations
 * - Follow-up prompts for continuing
 * - Icons and categories
 * - Usage statistics
 * - Confidence scores
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Chat interfaces
 * - AI assistants
 * - Prompt libraries
 * - User onboarding
 */
declare const meta: Meta<typeof PromptSuggestions>;
export default meta;
type Story = StoryObj<typeof PromptSuggestions>;
export declare const StarterPrompts: Story;
export declare const FollowUpPrompts: Story;
export declare const CardsLayout: Story;
export declare const ListLayout: Story;
export declare const WithCategories: Story;
export declare const LoadingState: Story;
export declare const EmptyState: Story;
//# sourceMappingURL=PromptSuggestions.stories.d.ts.map