import type { StoryObj } from '@storybook/react-vite';
/**
 * Checkbox component for binary selection.
 *
 * **Key Features:**
 * - Accessible with proper ARIA attributes
 * - Focus states with ring indicator
 * - Disabled state support
 * - Smooth transitions
 *
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Use for single or multiple selections
 * - Group related checkboxes together
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
    decorators: ((Story: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react-vite").ReactRenderer, ComponentProps<TCmpOrArgs>>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Checked: Story;
export declare const Disabled: Story;
export declare const WithLabel: Story;
export declare const MultipleOptions: Story;
export declare const FocusState: Story;
//# sourceMappingURL=Checkbox.stories.d.ts.map