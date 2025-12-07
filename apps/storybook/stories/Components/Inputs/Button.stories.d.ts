import type { StoryObj } from '@storybook/react-vite';
/**
 * Enhanced Button component with ripple effect, loading states, and success/error feedback.
 *
 * **Key Features:**
 * - Material Design ripple effect on click
 * - Loading state with spinner animation
 * - Success state with checkmark and green glow
 * - Error state with shake animation and red color
 * - All standard button variants (default, destructive, outline, secondary, ghost, link)
 * - Accessible with proper ARIA attributes and keyboard navigation
 * - Automatic state reset after duration
 *
 * **Design Philosophy:**
 * - Delightful by Default: Tactile feedback makes interactions feel responsive
 * - Minimal but Modern: Clean design with thoughtful animations
 * - Intuitive: Visual feedback confirms actions
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
        status: {
            type: string;
        };
        badges: string[];
    };
    tags: string[];
    argTypes: {
        variant: {
            control: string;
            options: string[];
            description: string;
        };
        size: {
            control: string;
            options: string[];
            description: string;
        };
        loading: {
            control: string;
            description: string;
        };
        disabled: {
            control: string;
            description: string;
        };
        ripple: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Destructive: Story;
export declare const Outline: Story;
export declare const Secondary: Story;
export declare const Ghost: Story;
export declare const Link: Story;
export declare const Sizes: Story;
export declare const IconButton: Story;
export declare const Loading: Story;
export declare const Disabled: Story;
export declare const SuccessState: Story;
export declare const ErrorState: Story;
export declare const InteractiveStates: Story;
export declare const SimulateError: Story;
export declare const ManualStateControl: Story;
export declare const RippleEffect: Story;
export declare const RippleColors: Story;
export declare const FormSubmit: Story;
export declare const SaveAction: Story;
export declare const DeleteConfirmation: Story;
export declare const ButtonGroup: Story;
export declare const WithIcons: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=Button.stories.d.ts.map