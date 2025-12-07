import type { StoryObj } from '@storybook/react-vite';
/**
 * **AdvancedChatInput Component**
 *
 * Advanced chat input component with prompt library integration,
 * file attachments, suggestions, and rich text editing.
 *
 * **Key Features:**
 * - Prompt library integration (@ mentions)
 * - Command palette (/ commands)
 * - File attachments
 * - Rich text editing
 * - Auto-suggestions
 * - Variable substitution
 * - Keyboard shortcuts
 *
 * **Use Cases:**
 * - AI chat interfaces with prompts
 * - Command-based interfaces
 * - Multi-modal chat inputs
 * - Enterprise chat applications
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
        onSubmit: {
            description: string;
            action: string;
        };
        onSuggestionRequest: {
            description: string;
            action: string;
        };
        maxLength: {
            description: string;
            control: {
                type: string;
                min: number;
                max: number;
            };
        };
        placeholder: {
            description: string;
            control: string;
        };
        disabled: {
            description: string;
            control: string;
        };
        showCharCounter: {
            description: string;
            control: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Interactive: Story;
export declare const WithCharacterLimit: Story;
export declare const Disabled: Story;
//# sourceMappingURL=AdvancedChatInput.stories.d.ts.map