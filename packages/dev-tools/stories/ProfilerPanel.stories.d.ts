/**
 * Storybook stories for ProfilerPanel component
 * Demonstrates React 19 useOptimistic functionality
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ProfilerPanel } from '../src/react/components/profiler-panel';
declare const meta: Meta<typeof ProfilerPanel>;
export default meta;
type Story = StoryObj<typeof ProfilerPanel>;
/**
 * Default Profiler Panel
 */
export declare const Default: Story;
/**
 * Empty State
 */
export declare const Empty: Story;
/**
 * With Many Metrics
 */
export declare const WithManyMetrics: Story;
/**
 * With Memory Tracking
 */
export declare const WithMemoryTracking: Story;
//# sourceMappingURL=ProfilerPanel.stories.d.ts.map