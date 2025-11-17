/**
 * Code Flow Animation
 *
 * Animated code execution with line-by-line highlighting
 */
interface CodeFlowAnimationProps {
    steps: Array<{
        line: number;
        code: string;
        explanation: string;
        highlight?: boolean;
    }>;
    title?: string;
}
export declare function CodeFlowAnimation({ steps, title }: CodeFlowAnimationProps): import("react/jsx-runtime").JSX.Element;
export declare function UseChatFlowAnimation(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CodeFlowAnimation.d.ts.map