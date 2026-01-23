import { jsx as _jsx } from "react/jsx-runtime";
import { FileUpload } from '@clarity-chat/react';
import { expect, within } from '@storybook/test';
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
const meta = {
    title: 'Components/Inputs/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Drag and drop file upload component with progress tracking,
file validation, and multiple file support.

## Features

- ✅ Drag and drop interface
- ✅ Click to browse files
- ✅ Multiple file support
- ✅ File size validation
- ✅ File type validation (accept prop)
- ✅ Progress tracking
- ✅ Error handling
- ✅ Accessible with keyboard navigation
- ✅ Visual feedback for drag states

## Basic Usage

\`\`\`tsx
<FileUpload
  onFilesSelected={(files) => {
    console.log('Files selected:', files)
  }}
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  accept="image/*,.pdf"
/>
\`\`\`
        `,
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    argTypes: {
        onFilesSelected: {
            description: 'Callback when files are selected',
            action: 'files-selected',
        },
        maxFiles: {
            description: 'Maximum number of files allowed',
            control: { type: 'number', min: 1, max: 20 },
        },
        maxSize: {
            description: 'Maximum file size in bytes',
            control: { type: 'number', min: 1024, max: 100 * 1024 * 1024 },
        },
        accept: {
            description: 'Accepted file types (e.g., "image/*", ".pdf,.doc")',
            control: 'text',
        },
        disabled: {
            description: 'Disable file upload',
            control: 'boolean',
        },
        multiple: {
            description: 'Allow multiple file selection',
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (_jsx("div", { style: { width: '500px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    args: {
        onFilesSelected: (files) => {
            console.log('Files selected:', files);
        },
        maxFiles: 5,
        maxSize: 10 * 1024 * 1024, // 10MB
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test file upload area renders
        await expect(canvas.getByText(/drag.*drop/i)).toBeInTheDocument();
        // Test browse button displays
        await expect(canvas.getByText(/browse/i)).toBeInTheDocument();
        // Test file size limit displays
        await expect(canvas.getByText(/10.*MB/i)).toBeInTheDocument();
        // Test max files limit displays
        await expect(canvas.getByText(/5.*files/i)).toBeInTheDocument();
    },
};
export const ImageOnly = {
    args: {
        onFilesSelected: (files) => {
            console.log('Images selected:', files);
        },
        accept: 'image/*',
        maxFiles: 3,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test file upload area renders
        await expect(canvas.getByText(/drag.*drop/i)).toBeInTheDocument();
        // Test image restriction displays
        await expect(canvas.getByText(/image/i)).toBeInTheDocument();
        // Test max files for images
        await expect(canvas.getByText(/3.*files/i)).toBeInTheDocument();
    },
};
export const SingleFile = {
    args: {
        onFilesSelected: (files) => {
            console.log('File selected:', files);
        },
        maxFiles: 1,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test file upload area renders
        await expect(canvas.getByText(/drag.*drop/i)).toBeInTheDocument();
        // Test single file mode displays
        await expect(canvas.getByText(/1.*file/i)).toBeInTheDocument();
    },
};
export const WithValidation = {
    args: {
        onFilesSelected: (files) => {
            console.log('Valid files:', files);
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: '.pdf,.doc,.docx',
        maxFiles: 2,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test file upload area renders
        await expect(canvas.getByText(/drag.*drop/i)).toBeInTheDocument();
        // Test file type restrictions display
        await expect(canvas.getByText(/pdf.*doc/i)).toBeInTheDocument();
        // Test file size limit displays
        await expect(canvas.getByText(/5.*MB/i)).toBeInTheDocument();
        // Test max files limit displays
        await expect(canvas.getByText(/2.*files/i)).toBeInTheDocument();
    },
};
//# sourceMappingURL=FileUpload.stories.js.map