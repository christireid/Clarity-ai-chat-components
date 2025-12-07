import { ExportDialog } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Enterprise/ExportDialog',
    component: ExportDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onExport: { action: 'exported' },
        onClose: { action: 'closed' },
    },
};
export default meta;
export const ChatExport = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'AI Assistant Conversation',
    },
};
export const KnowledgeBaseExport = {
    args: {
        isOpen: true,
        resourceType: 'knowledge-base',
        resourceName: 'React Best Practices',
    },
};
export const ProjectExport = {
    args: {
        isOpen: true,
        resourceType: 'project',
        resourceName: 'Web Development Project',
    },
};
export const WithDateRange = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'Monthly Summary',
        defaultFormat: 'pdf',
    },
};
export const PDFFormat = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'Client Meeting Notes',
        defaultFormat: 'pdf',
    },
};
export const DOCXFormat = {
    args: {
        isOpen: true,
        resourceType: 'knowledge-base',
        resourceName: 'Documentation',
        defaultFormat: 'docx',
    },
};
export const MarkdownFormat = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'Technical Discussion',
        defaultFormat: 'markdown',
    },
};
export const JSONFormat = {
    args: {
        isOpen: true,
        resourceType: 'project',
        resourceName: 'API Documentation',
        defaultFormat: 'json',
    },
};
export const HTMLFormat = {
    args: {
        isOpen: true,
        resourceType: 'knowledge-base',
        resourceName: 'User Guide',
        defaultFormat: 'html',
    },
};
export const Closed = {
    args: {
        isOpen: false,
        resourceType: 'chat',
        resourceName: 'Example Chat',
    },
};
export const LongResourceName = {
    args: {
        isOpen: true,
        resourceType: 'project',
        resourceName: 'Complete Enterprise Web Application Development Project with Multiple Features and Integrations',
    },
};
export const AllOptionsEnabled = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'Complete Export',
        defaultFormat: 'pdf',
    },
};
// Simulating the exporting state isn't ideal for Storybook,
// but we can document it here for reference
export const Exporting = {
    args: {
        isOpen: true,
        resourceType: 'chat',
        resourceName: 'Large Conversation',
    },
    parameters: {
        docs: {
            description: {
                story: 'This story shows the export dialog. In actual usage, clicking Export will show a progress bar that animates from 0% to 100% before auto-closing.',
            },
        },
    },
};
//# sourceMappingURL=ExportDialog.stories.js.map