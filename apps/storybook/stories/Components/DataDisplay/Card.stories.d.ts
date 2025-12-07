import type { StoryObj } from '@storybook/react-vite';
/**
 * Card component provides a flexible container for content sections.
 *
 * **Key Features:**
 * - Composable structure with Header, Content, and Footer
 * - Consistent styling and spacing
 * - Flexible and customizable
 *
 * **Use Cases:**
 * - Feature highlights
 * - Content grouping
 * - Dashboard widgets
 * - Settings panels
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
export declare const WithFooter: Story;
export declare const FeatureCard: Story;
export declare const StatsCard: Story;
export declare const ChatPreviewCard: Story;
export declare const InteractiveCard: Story;
export declare const LoadingCard: Story;
//# sourceMappingURL=Card.stories.d.ts.map