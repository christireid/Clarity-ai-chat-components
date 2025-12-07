import type { StoryObj } from '@storybook/react-vite';
/**
 * Avatar component displays user profile pictures with fallback support.
 *
 * **Key Features:**
 * - Automatic fallback to initials
 * - Multiple sizes
 * - Status indicators
 * - Accessible with proper labels
 *
 * **Best Practices:**
 * - Always provide alt text for images
 * - Use initials as fallback
 * - Consider color contrast for text
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
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithFallback: Story;
export declare const Sizes: Story;
export declare const ChatParticipants: Story;
export declare const WithStatus: Story;
export declare const AvatarGroup: Story;
export declare const BotAvatars: Story;
export declare const Hoverable: Story;
export declare const OnlyFallback: Story;
//# sourceMappingURL=Avatar.stories.d.ts.map