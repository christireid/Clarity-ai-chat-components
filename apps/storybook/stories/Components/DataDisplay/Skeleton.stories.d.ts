import type { StoryObj } from '@storybook/react-vite';
/**
 * Skeleton Loaders
 *
 * **Provide visual loading placeholders for:**
 * - Text content
 * - Cards and containers
 * - Avatars and images
 * - Buttons and actions
 * - Custom shapes
 *
 * **Key Features:**
 * - Smooth shimmer animation
 * - Multiple preset shapes
 * - Customizable dimensions
 * - Respects dark mode
 * - Reduces perceived loading time
 *
 * **Design Philosophy:**
 * - Progressive: Show structure before content
 * - Predictable: Match final layout
 * - Smooth: Animated transitions
 * - Non-intrusive: Subtle and elegant
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
        className: {
            control: string;
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const CustomSize: Story;
export declare const RoundedVariants: Story;
export declare const TextSkeleton: Story;
export declare const CardSkeleton: Story;
export declare const AvatarSkeleton: Story;
export declare const ButtonSkeleton: Story;
export declare const UserProfile: Story;
export declare const MessageList: Story;
export declare const ArticleLayout: Story;
export declare const DashboardCards: Story;
export declare const DataTable: Story;
export declare const LoadingSimulation: Story;
export declare const ProgressiveLoading: Story;
export declare const Accessibility: Story;
//# sourceMappingURL=Skeleton.stories.d.ts.map