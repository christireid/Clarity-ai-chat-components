import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BatchExportDialog, } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Advanced/Enterprise/BatchExportDialog',
    component: BatchExportDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
const sampleResources = [
    {
        id: 'conv-1',
        name: 'Python Programming Help',
        type: 'chat',
        messageCount: 45,
        lastModified: new Date('2024-01-15'),
        size: 125000,
    },
    {
        id: 'conv-2',
        name: 'Project Planning Discussion',
        type: 'chat',
        messageCount: 32,
        lastModified: new Date('2024-01-14'),
        size: 89000,
    },
    {
        id: 'conv-3',
        name: 'Code Review Session',
        type: 'chat',
        messageCount: 67,
        lastModified: new Date('2024-01-13'),
        size: 210000,
    },
    {
        id: 'conv-4',
        name: 'Learning JavaScript',
        type: 'chat',
        messageCount: 28,
        lastModified: new Date('2024-01-12'),
        size: 75000,
    },
];
const InteractiveWrapper = (args) => {
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState([]);
    const handleExport = async (options) => {
        console.log('Exporting:', options);
        // Simulate progress
        const newProgress = options.resourceIds.map((id) => ({
            resourceId: id,
            status: 'pending',
            progress: 0,
        }));
        setProgress(newProgress);
        // Simulate export progress
        for (const resourceId of options.resourceIds) {
            const index = newProgress.findIndex((p) => p.resourceId === resourceId);
            if (index !== -1) {
                newProgress[index].status = 'exporting';
                setProgress([...newProgress]);
                // Simulate progress updates
                for (let p = 0; p <= 100; p += 25) {
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    newProgress[index].progress = p;
                    setProgress([...newProgress]);
                }
                newProgress[index].status = 'completed';
                newProgress[index].progress = 100;
                setProgress([...newProgress]);
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open Batch Export" }), _jsx(BatchExportDialog, { ...args, open: open, onOpenChange: setOpen, onExport: handleExport, progress: progress })] }));
};
export const Default = {
    render: InteractiveWrapper,
    args: {
        resources: sampleResources,
    },
};
export const WithProgress = {
    render: InteractiveWrapper,
    args: {
        resources: sampleResources,
    },
};
export const ManyResources = {
    render: InteractiveWrapper,
    args: {
        resources: Array.from({ length: 20 }, (_, i) => ({
            id: `conv-${i}`,
            name: `Conversation ${i + 1}`,
            type: 'chat',
            messageCount: Math.floor(Math.random() * 100) + 10,
            lastModified: new Date(2024, 0, 15 - i),
            size: Math.floor(Math.random() * 200000) + 50000,
        })),
    },
};
export const WithErrors = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [progress, setProgress] = useState([
            {
                resourceId: 'conv-1',
                status: 'completed',
                progress: 100,
            },
            {
                resourceId: 'conv-2',
                status: 'error',
                progress: 0,
                error: 'Export failed: File too large',
            },
            {
                resourceId: 'conv-3',
                status: 'exporting',
                progress: 45,
            },
        ]);
        return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open Batch Export" }), _jsx(BatchExportDialog, { open: open, onOpenChange: setOpen, resources: sampleResources, onExport: async () => { }, progress: progress })] }));
    },
};
//# sourceMappingURL=BatchExportDialog.stories.js.map