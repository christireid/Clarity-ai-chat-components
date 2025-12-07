import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { ConversationBranchVisualizer, } from '@clarity-chat/react';
const meta = {
    title: 'Components/DataDisplay/ConversationBranchVisualizer',
    component: ConversationBranchVisualizer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Tree view for branching conversations (think Claude conversation forks). Supports selection, creation, rename, delete, and compact display for deep histories.',
            },
        },
    },
};
export default meta;
const baseBranches = [
    {
        id: 'root',
        parentId: null,
        title: 'Components/DataDisplay/ConversationBranchVisualizer',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
        messageIds: ['msg-1', 'msg-2', 'msg-3'],
        metadata: {
            messageCount: 18,
            tokens: 1420,
            lastMessagePreview: 'Let’s explore a multi-agent approach…',
        },
    },
    {
        id: 'analysis',
        parentId: 'root',
        title: 'Components/DataDisplay/ConversationBranchVisualizer',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        updatedAt: new Date(Date.now() - 1000 * 60 * 20),
        messageIds: ['msg-4', 'msg-5'],
        metadata: {
            messageCount: 8,
            tokens: 680,
            lastMessagePreview: 'Benchmark results look promising ✅',
        },
    },
    {
        id: 'analysis-evals',
        parentId: 'analysis',
        title: 'Components/DataDisplay/ConversationBranchVisualizer',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        messageIds: ['msg-8', 'msg-9', 'msg-10'],
        metadata: {
            messageCount: 6,
            tokens: 540,
            lastMessagePreview: 'A/B test results: variant B wins by 12%',
        },
    },
    {
        id: 'analysis-evals-feedback',
        parentId: 'analysis-evals',
        title: 'Components/DataDisplay/ConversationBranchVisualizer',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 45),
        messageIds: ['msg-11', 'msg-12'],
        metadata: {
            messageCount: 4,
            tokens: 320,
            lastMessagePreview: 'Incorporated reviewer feedback + safety guidelines.',
        },
    },
    {
        id: 'divergent',
        parentId: 'root',
        title: 'Components/DataDisplay/ConversationBranchVisualizer',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
        updatedAt: new Date(Date.now() - 1000 * 60 * 90),
        messageIds: ['msg-6', 'msg-7'],
        metadata: {
            messageCount: 5,
            tokens: 420,
            lastMessagePreview: 'Consider a canvas-based layout for tool cards?',
        },
    },
];
const BranchVisualizerDemo = ({ compact = false, maxDepth }) => {
    const [branches, setBranches] = React.useState(baseBranches);
    const [currentBranchId, setCurrentBranchId] = React.useState('analysis');
    const [counter, setCounter] = React.useState(1);
    const handleCreateBranch = React.useCallback((parentId) => {
        const now = new Date();
        const newBranch = {
            id: `draft-${counter}`,
            parentId,
            title: `Exploration ${counter}`,
            createdAt: now,
            updatedAt: now,
            messageIds: [],
            metadata: {
                messageCount: 0,
                tokens: 0,
                lastMessagePreview: 'New experiment branch ready for notes…',
            },
        };
        setBranches((prev) => [...prev, newBranch]);
        setCurrentBranchId(newBranch.id);
        setCounter((value) => value + 1);
    }, [counter]);
    const handleDelete = React.useCallback((branchId) => {
        setBranches((prev) => prev.filter((branch) => branch.id !== branchId));
        if (currentBranchId === branchId) {
            setCurrentBranchId('root');
        }
    }, [currentBranchId]);
    const handleRename = React.useCallback((branchId, newTitle) => {
        setBranches((prev) => prev.map((branch) => branch.id === branchId ? { ...branch, title: newTitle, updatedAt: new Date() } : branch));
    }, []);
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] min-h-[520px] bg-muted/20 p-6 rounded-xl border border-border", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Branch Controls" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Select a branch to inspect its metadata, or create alternate explorations without losing prior context. Branches can be renamed, nested, or removed when obsolete." }), _jsxs("div", { className: "rounded-lg border border-border bg-background p-4 space-y-3 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Active branch" }), _jsx("strong", { className: "text-foreground", children: currentBranchId })] }), _jsx("button", { type: "button", className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary", onClick: () => handleCreateBranch(currentBranchId), children: "Fork selected branch" })] }), _jsxs("div", { className: "rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground space-y-2", children: [_jsx("p", { children: "\u2728 Tips" }), _jsxs("ul", { className: "list-disc pl-4 space-y-1", children: [_jsx("li", { children: "Track hypothesis branches vs. production-ready conversations." }), _jsx("li", { children: "Visualize evaluation paths for safety and compliance reviews." }), _jsx("li", { children: "Use compact mode when embedding inside sidebars." })] })] })] }), _jsx("div", { className: "rounded-2xl border border-border bg-background p-6 shadow-sm", children: _jsx(ConversationBranchVisualizer, { branches: branches, currentBranchId: currentBranchId, onBranchSwitch: setCurrentBranchId, onBranchCreate: handleCreateBranch, onBranchDelete: handleDelete, onBranchRename: handleRename, maxDepth: maxDepth, compact: compact, className: "max-h-[640px] overflow-y-auto pr-2" }) })] }));
};
export const Default = {
    render: () => _jsx(BranchVisualizerDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Full tree visualization with interaction affordances. Hover to rename, fork, or delete leaf branches — great for product analytics and agent evaluation tooling.',
            },
        },
    },
};
export const CompactTimeline = {
    render: () => _jsx(BranchVisualizerDemo, { compact: true, maxDepth: 3 }),
    parameters: {
        docs: {
            description: {
                story: 'Compact display trimmed to three levels deep. Perfect for embedding inside chat sidebars, history drawers, or mobile experiences where vertical space is limited.',
            },
        },
    },
};
//# sourceMappingURL=ConversationBranchVisualizer.stories.js.map