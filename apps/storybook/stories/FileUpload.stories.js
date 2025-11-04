import { jsx as _jsx } from "react/jsx-runtime";
import { FileUpload } from '@clarity-chat/react';
const meta = {
    title: 'Components/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Drag and drop file upload component with progress tracking.',
            },
        },
    },
    tags: ['autodocs'],
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
};
export const ImageOnly = {
    args: {
        onFilesSelected: (files) => {
            console.log('Images selected:', files);
        },
        accept: 'image/*',
        maxFiles: 3,
    },
};
export const SingleFile = {
    args: {
        onFilesSelected: (files) => {
            console.log('File selected:', files);
        },
        maxFiles: 1,
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
};
//# sourceMappingURL=FileUpload.stories.js.map