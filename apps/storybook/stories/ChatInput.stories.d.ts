import type { StoryObj } from '@storybook/react';
/**
 * Enhanced ChatInput component with delightful microanimations and state management.
 *
 * **Key Features:**
 * - Smooth expand/contract animation as user types
 * - Character counter with color-coded feedback (blue → yellow → red)
 * - Progress bar showing character limit visually
 * - Glowing focus ring with pulse animation
 * - Send button state transitions (idle → loading → success → error)
 * - Auto-resize textarea up to 6 lines
 * - Error shake animation when over limit
 * - Helpful keyboard hints on focus
 * - Accessible with ARIA labels
 *
 * **Design Philosophy:**
 * - Delightful by Default: Every interaction provides clear feedback
 * - Progressive Disclosure: Advanced features appear contextually
 * - Forgiving UX: Clear warnings before errors, shake on invalid submit
 * - Accessible First: Keyboard shortcuts, screen reader support
 */
declare const meta: {
    title: string;
    component: import("react").NamedExoticComponent<import("@clarity-chat/react").ChatInputProps>;
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
        maxLength: {
            control: {
                type: string;
                min: number;
                max: number;
                step: number;
            };
            description: string;
        };
        showCharCounter: {
            control: string;
            description: string;
        };
        warningThreshold: {
            control: {
                type: string;
                min: number;
                max: number;
                step: number;
            };
            description: string;
        };
        animateHeight: {
            control: string;
            description: string;
        };
        glowOnFocus: {
            control: string;
            description: string;
        };
        disabled: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithCharacterLimit: Story;
export declare const CustomPlaceholder: Story;
export declare const CharacterCounterStates: Story;
export declare const CustomWarningThreshold: Story;
export declare const NoCharacterCounter: Story;
export declare const SendButtonStates: Story;
export declare const FocusGlowAnimation: Story;
export declare const HeightAnimation: Story;
export declare const ChatConversation: Story;
export declare const SupportTicket: Story;
export declare const CommentSystem: Story;
export declare const Disabled: Story;
export declare const LongContent: Story;
export declare const VeryShortLimit: Story;
export declare const Accessibility: Story;
export declare const Playground: Story;
//# sourceMappingURL=ChatInput.stories.d.ts.map