/**
 * Storybook stories for TimeTravelPanel component
 * Demonstrates React 19 useOptimistic functionality
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TimeTravelPanel } from '../src/react/components/time-travel-panel';
declare const meta: Meta<typeof TimeTravelPanel>;
export default meta;
type Story = StoryObj<typeof TimeTravelPanel>;
/**
 * Default Time Travel Panel
 */
export declare const Default: Story;
/**
 * Empty State
 */
export declare const Empty: Story;
/**
 * With Many Snapshots
 */
export declare const WithManySnapshots: Story;
//# sourceMappingURL=TimeTravelPanel.stories.d.ts.map