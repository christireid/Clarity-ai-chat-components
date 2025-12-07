import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Type-safe icon wrapper that fixes TS2786 errors
 * Usage: const SafeIcon = icon(ArrowLeft)
 */
export function icon(Icon) {
    // @ts-expect-error - Intentional type workaround for lucide-react compatibility
    return (props) => _jsx(Icon, { ...props });
}
/**
 * Alternative: Direct casting for inline usage
 * Usage: {Icon as any}
 */
export const asIcon = (Icon) => Icon;
//# sourceMappingURL=icon-helper.js.map