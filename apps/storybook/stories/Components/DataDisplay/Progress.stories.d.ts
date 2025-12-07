import type { StoryObj } from '@storybook/react-vite';
/**
 * Progress Indicators
 *
 * **Visual feedback for:**
 * - Task completion
 * - File uploads
 * - Data processing
 * - Multi-step workflows
 * - Loading states
 *
 * **Key Features:**
 * - Smooth animations
 * - Customizable colors
 * - Multiple sizes
 * - Indeterminate state
 * - Label support
 *
 * **Design Philosophy:**
 * - Clear: Users always know progress status
 * - Smooth: Animated transitions feel natural
 * - Flexible: Works for many use cases
 * - Accessible: ARIA attributes for screen readers
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
        value: {
            control: {
                type: string;
                min: number;
                max: number;
                step: number;
            };
            description: string;
        };
        max: {
            control: string;
            description: string;
        };
        className: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Empty: Story;
export declare const Half: Story;
export declare const AlmostComplete: Story;
export declare const Complete: Story;
export declare const Sizes: Story;
export declare const ColorVariants: Story;
export declare const AnimatedProgress: Story;
export declare const StepProgress: Story;
export declare const FileUpload: Story;
export declare const DataProcessing: Story;
export declare const MultipleProgress: Story;
export declare const InstallationProgress: Story;
export declare const InteractiveDemo: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=Progress.stories.d.ts.map