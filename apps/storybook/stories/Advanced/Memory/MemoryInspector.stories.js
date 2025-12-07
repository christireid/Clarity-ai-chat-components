import { MemoryInspector } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Memory/MemoryInspector',
    component: MemoryInspector,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Inspect what the assistant has stored in memory. View, prune, promote, or debug contextual memory across session, thread, and global scopes.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
const mockMemories = [
    {
        id: '1',
        label: 'User preference',
        value: 'Prefers dark mode',
        scope: 'session',
        confidence: 0.95,
        lastUpdated: new Date(Date.now() - 300000),
        tokens: 5,
    },
    {
        id: '2',
        label: 'Project context',
        value: 'Working on React chat application',
        scope: 'thread',
        confidence: 0.88,
        source: 'conversation',
        lastUpdated: new Date(Date.now() - 600000),
        tokens: 8,
    },
    {
        id: '3',
        label: 'User name',
        value: 'John Doe',
        scope: 'global',
        confidence: 1.0,
        source: 'profile',
        lastUpdated: new Date(Date.now() - 86400000),
        tokens: 2,
    },
];
export const Default = {
    args: {
        memories: mockMemories,
    },
};
export const WithActions = {
    args: {
        memories: mockMemories,
        onRemove: (memory) => {
            console.log('Removing memory:', memory.id);
            alert(`Removed: ${memory.label}`);
        },
        onPromote: (memory) => {
            console.log('Promoting memory:', memory.id);
            alert(`Promoted: ${memory.label}`);
        },
        onRefresh: () => {
            console.log('Refreshing memories');
            alert('Refreshing...');
        },
    },
};
export const Loading = {
    args: {
        memories: [],
        isLoading: true,
    },
};
export const Empty = {
    args: {
        memories: [],
        isLoading: false,
    },
};
export const ManyMemories = {
    args: {
        memories: Array.from({ length: 20 }, (_, i) => ({
            id: `memory-${i}`,
            label: `Memory ${i + 1}`,
            value: `Value for memory ${i + 1}`,
            scope: ['session', 'thread', 'global'][i % 3],
            confidence: 0.9 - (i % 10) * 0.05,
            lastUpdated: new Date(Date.now() - i * 60000),
            tokens: 5 + i,
        })),
    },
};
export const CustomTitle = {
    args: {
        memories: mockMemories,
        title: 'Advanced/Memory/MemoryInspector',
        subtitle: 'Advanced/Memory/MemoryInspector',
    },
};
//# sourceMappingURL=MemoryInspector.stories.js.map