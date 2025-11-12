/**
 * Component Composition Diagram
 *
 * Shows how components compose together
 */
interface ComponentCompositionDiagramProps {
    components: Array<{
        name: string;
        description: string;
        children?: string[];
    }>;
}
export declare function ComponentCompositionDiagram({ components }: ComponentCompositionDiagramProps): import("react/jsx-runtime").JSX.Element;
export declare function ChatWindowComposition(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ComponentCompositionDiagram.d.ts.map