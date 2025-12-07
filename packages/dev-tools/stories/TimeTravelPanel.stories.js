import { jsx as _jsx } from "react/jsx-runtime";
import { TimeTravelPanel } from '../src/react/components/time-travel-panel';
import { useTimeTravel } from '../src/react/hooks/use-time-travel';
import { useEffect } from 'react';
const meta = {
    title: 'Dev Tools/Time Travel Panel',
    component: TimeTravelPanel,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Time-Travel Debugging Panel using React 19 useOptimistic for state snapshots.',
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
/**
 * Default Time Travel Panel
 */
export const Default = {
    render: () => {
        const { record } = useTimeTravel();
        useEffect(() => {
            // Simulate some state changes
            record([{ role: 'user', content: 'Hello' }], { model: 'gpt-4-turbo' }, {}, 'Initial State');
            setTimeout(() => {
                record([
                    { role: 'user', content: 'Hello' },
                    { role: 'assistant', content: 'Hi there!' },
                ], { model: 'gpt-4-turbo' }, {}, 'After Response');
            }, 500);
            setTimeout(() => {
                record([
                    { role: 'user', content: 'Hello' },
                    { role: 'assistant', content: 'Hi there!' },
                    { role: 'user', content: 'How are you?' },
                ], { model: 'gpt-4-turbo' }, {}, 'Second Question');
            }, 1000);
        }, []);
        return _jsx(TimeTravelPanel, {});
    },
};
/**
 * Empty State
 */
export const Empty = {
    render: () => _jsx(TimeTravelPanel, {}),
};
/**
 * With Many Snapshots
 */
export const WithManySnapshots = {
    render: () => {
        const { record } = useTimeTravel();
        useEffect(() => {
            // Create multiple snapshots
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    record(Array.from({ length: i + 1 }, (_, j) => ({
                        role: j % 2 === 0 ? 'user' : 'assistant',
                        content: `Message ${j}`,
                    })), { model: 'gpt-4-turbo', temperature: 0.7 }, {}, `Snapshot ${i + 1}`);
                }, i * 200);
            }
        }, []);
        return _jsx(TimeTravelPanel, {});
    },
};
//# sourceMappingURL=TimeTravelPanel.stories.js.map