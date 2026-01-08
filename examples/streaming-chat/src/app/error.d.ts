/**
 * Error Boundary Page
 *
 * Catches runtime errors and displays a user-friendly error message
 * with a retry option. This follows Next.js App Router conventions.
 */
export default function Error({ error, reset, }: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=error.d.ts.map