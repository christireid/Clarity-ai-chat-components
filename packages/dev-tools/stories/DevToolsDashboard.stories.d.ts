/**
 * Storybook story for DevToolsDashboard component
 * Comprehensive demo of all dev tools
 */
import type { Meta, StoryObj } from '@storybook/react';
import { DevToolsDashboard } from '../src/react/components/dev-tools-dashboard';
declare const meta: Meta<typeof DevToolsDashboard>;
export default meta;
type Story = StoryObj<typeof DevToolsDashboard>;
/**
 * Default Dashboard
 */
export declare const Default: Story;
/**
 * Inspector Only
 */
export declare const InspectorOnly: Story;
/**
 * Profiler Only
 */
export declare const ProfilerOnly: Story;
/**
 * All Tools
 */
export declare const AllTools: Story;
//# sourceMappingURL=DevToolsDashboard.stories.d.ts.map