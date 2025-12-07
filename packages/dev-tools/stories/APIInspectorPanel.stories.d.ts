/**
 * Storybook stories for APIInspectorPanel component
 * Demonstrates React 19 useOptimistic functionality
 */
import type { Meta, StoryObj } from '@storybook/react';
import { APIInspectorPanel } from '../src/react/components/api-inspector-panel';
declare const meta: Meta<typeof APIInspectorPanel>;
export default meta;
type Story = StoryObj<typeof APIInspectorPanel>;
/**
 * Default API Inspector Panel
 */
export declare const Default: Story;
/**
 * Empty State
 */
export declare const Empty: Story;
/**
 * With Many Logs
 */
export declare const WithManyLogs: Story;
/**
 * With Errors
 */
export declare const WithErrors: Story;
//# sourceMappingURL=APIInspectorPanel.stories.d.ts.map