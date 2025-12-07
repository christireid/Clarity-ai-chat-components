import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextCard } from '@clarity-chat/react';
/**
 * **ContextCard Component**
 *
 * Component for displaying context items (documents, images, links)
 * used in chat conversations with preview and metadata.
 *
 * **Key Features:**
 * - Multiple context types (document, image, link)
 * - Preview display
 * - Metadata (size, timestamp)
 * - Visual type indicators
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Document references in chat
 * - Image attachments
 * - Link previews
 * - Context management
 */
declare const meta: Meta<typeof ContextCard>;
export default meta;
type Story = StoryObj<typeof ContextCard>;
export declare const Document: Story;
export declare const Image: Story;
export declare const Link: Story;
//# sourceMappingURL=ContextCard.stories.d.ts.map