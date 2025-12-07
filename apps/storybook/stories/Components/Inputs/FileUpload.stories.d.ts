import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from '@clarity-chat/react';
/**
 * **FileUpload Component**
 *
 * Drag and drop file upload component with progress tracking,
 * file validation, and multiple file support.
 *
 * **Key Features:**
 * - Drag and drop interface
 * - Click to browse files
 * - Multiple file support
 * - File size validation
 * - File type validation (accept prop)
 * - Progress tracking
 * - Error handling
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Document uploads
 * - Image uploads
 * - Multi-file selection
 * - File sharing interfaces
 * - Attachment systems
 */
declare const meta: Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof FileUpload>;
export declare const Default: Story;
export declare const ImageOnly: Story;
export declare const SingleFile: Story;
export declare const WithValidation: Story;
//# sourceMappingURL=FileUpload.stories.d.ts.map