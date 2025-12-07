import type { StoryObj } from '@storybook/react-vite';
/**
 * **useMessageOperations Hook**
 *
 * Comprehensive hook for managing message CRUD operations with undo/redo,
 * editing, regeneration, and conversation branching.
 *
 * **Key Features:**
 * - Add, edit, delete messages
 * - Undo/redo functionality
 * - Message editing with versioning
 * - Message regeneration
 * - Conversation branching
 * - Operation history tracking
 *
 * **Use Cases:**
 * - Chat applications with editing
 * - Conversation management
 * - Message history
 * - Branching conversations
 */
declare const meta: {
    title: string;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const BasicOperations: Story;
export declare const MessageEditing: Story;
export declare const Regeneration: Story;
//# sourceMappingURL=UseMessageOperations.stories.d.ts.map