/**
 * Storybook Link Component
 *
 * Creates prominent links from documentation to Storybook for interactive component exploration.
 */
interface StorybookLinkProps {
    /**
     * Path to the Storybook story (e.g., "components-chatwindow--default")
     */
    story: string;
    /**
     * Component name for display (e.g., "ChatWindow")
     */
    componentName?: string;
    /**
     * Base URL for Storybook (defaults to production URL when deployed)
     */
    storybookUrl?: string;
    /**
     * Display variant
     */
    variant?: 'callout' | 'button' | 'inline';
}
export declare function StorybookLink({ story, componentName, storybookUrl, variant }: StorybookLinkProps): import("react/jsx-runtime").JSX.Element;
/**
 * Helper to generate Storybook story path from component name
 */
export declare function getStorybookPath(componentName: string, storyName?: string): string;
/**
 * Quick link component for adding to component pages
 */
export declare function ViewInStorybook({ component, story }: {
    component: string;
    story?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=StorybookLink.d.ts.map