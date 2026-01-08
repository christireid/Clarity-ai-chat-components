export default function Error({ error, reset, }: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=error.d.ts.map