import { jsx as _jsx } from "react/jsx-runtime";
import { ProfilerPanel } from '../src/react/components/profiler-panel';
import { useProfiler } from '../src/react/hooks/use-profiler';
import { useEffect } from 'react';
const meta = {
    title: 'Dev Tools/Profiler Panel',
    component: ProfilerPanel,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Performance Profiler Panel using React 19 useOptimistic for real-time metrics updates.',
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
/**
 * Default Profiler Panel
 */
export const Default = {
    render: () => {
        const { profile, setEnabled } = useProfiler();
        useEffect(() => {
            setEnabled(true);
            // Simulate some operations
            profile('database-query', async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return { rows: 100 };
            });
            profile('api-call', async () => {
                await new Promise(resolve => setTimeout(resolve, 200));
                return { data: 'response' };
            });
            profile('file-read', async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
                return { content: 'file content' };
            });
        }, []);
        return _jsx(ProfilerPanel, {});
    },
};
/**
 * Empty State
 */
export const Empty = {
    render: () => _jsx(ProfilerPanel, {}),
};
/**
 * With Many Metrics
 */
export const WithManyMetrics = {
    render: () => {
        const { profile, setEnabled } = useProfiler();
        useEffect(() => {
            setEnabled(true);
            // Create multiple operations
            for (let i = 0; i < 10; i++) {
                profile(`operation-${i}`, async () => {
                    await new Promise(resolve => setTimeout(resolve, 50 + i * 10));
                    return { result: i };
                });
            }
        }, []);
        return _jsx(ProfilerPanel, {});
    },
};
/**
 * With Memory Tracking
 */
export const WithMemoryTracking = {
    render: () => {
        const { start, end, setEnabled } = useProfiler();
        useEffect(() => {
            setEnabled(true);
            start('memory-intensive-operation', { trackMemory: true });
            setTimeout(() => {
                end('memory-intensive-operation', { custom: { memoryUsed: '50MB' } });
            }, 500);
        }, []);
        return _jsx(ProfilerPanel, {});
    },
};
//# sourceMappingURL=ProfilerPanel.stories.js.map