import type { StoryObj } from '@storybook/react';
/**
 * Empty State Components
 *
 * **Comprehensive empty states for all scenarios:**
 * - No data or content
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 *
 * **Design Philosophy:**
 * - Clear Communication: Users always know what's happening
 * - Actionable: Provide clear next steps
 * - Delightful: Smooth animations and friendly icons
 * - Contextual: Different states for different scenarios
 */
declare const meta: {
    title: string;
    component: any;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    argTypes: {
        title: {
            control: string;
            description: string;
        };
        description: {
            control: string;
            description: string;
        };
        icon: {
            control: boolean;
            description: string;
        };
        action: {
            control: boolean;
            description: string;
        };
        secondaryAction: {
            control: boolean;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const NoData: Story;
export declare const NoSearchResults: Story;
export declare const NoConversations: Story;
export declare const ErrorState: Story;
export declare const SuccessState: Story;
export declare const WithoutDescription: Story;
export declare const WithoutAction: Story;
export declare const WithSecondaryAction: Story;
export declare const PrimaryActionVariant: Story;
export declare const DestructiveActionVariant: Story;
export declare const SuccessActionVariant: Story;
export declare const EmptyInbox: Story;
export declare const NoNotifications: Story;
export declare const NoFavorites: Story;
export declare const NoHistory: Story;
export declare const ConnectionError: Story;
export declare const PermissionDenied: Story;
export declare const NotFound: Story;
export declare const AnimatedEntry: Story;
export declare const InteractiveDemo: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=EmptyState.stories.d.ts.map