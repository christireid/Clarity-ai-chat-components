import type { ChatError } from './index';
export interface ErrorDisplayProps {
    error: ChatError | Error | string | null;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
    showDetails?: boolean;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
}
export declare function ErrorDisplay({ error, onRetry, onDismiss, className, showDetails, autoDismiss, autoDismissDelay, }: ErrorDisplayProps): import("react").JSX.Element | null;
export default ErrorDisplay;
//# sourceMappingURL=ErrorDisplay.d.ts.map