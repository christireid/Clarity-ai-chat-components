import type { StoryObj } from '@storybook/react';
/**
 * Toast Notification System
 *
 * **Provides elegant toast notifications for:**
 * - Success messages
 * - Error alerts
 * - Information updates
 * - Warning notices
 *
 * **Key Features:**
 * - Auto-dismiss with customizable duration
 * - Queue management for multiple toasts
 * - 6 position options
 * - Optional action buttons
 * - Smooth slide-in/out animations
 * - Accessible with ARIA labels
 *
 * **Design Philosophy:**
 * - Non-intrusive: Doesn't block user workflow
 * - Contextual: Clear visual feedback for each type
 * - Actionable: Optional buttons for quick actions
 * - Responsive: Works on all screen sizes
 */
declare const meta: {
    title: string;
    component: import("react").FC<import("@clarity-chat/react").ToastProviderProps>;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    decorators: ((Story: import("@storybook/types").PartialStoryFn<import("@storybook/react").ReactRenderer, {
        children: import("react").ReactNode;
        position?: import("@clarity-chat/react").ToastPosition | undefined;
        defaultDuration?: number | undefined;
        maxToasts?: number | undefined;
    }>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const SuccessToast: Story;
export declare const ErrorToast: Story;
export declare const InfoToast: Story;
export declare const WarningToast: Story;
export declare const WithAction: Story;
export declare const UndoAction: Story;
export declare const Positions: Story;
export declare const CustomDuration: Story;
export declare const MultipleToasts: Story;
export declare const SaveConfirmation: Story;
export declare const FormValidation: Story;
export declare const CopyToClipboard: Story;
export declare const FileUpload: Story;
export declare const NetworkStatus: Story;
export declare const InteractivePlayground: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=Toast.stories.d.ts.map