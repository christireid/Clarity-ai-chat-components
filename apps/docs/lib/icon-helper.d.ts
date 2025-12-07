/**
 * Icon Helper - Fixes lucide-react type compatibility with TypeScript 5.x + React 18
 *
 * This wrapper ensures lucide-react icons work correctly with strict TypeScript checking.
 */
import React from 'react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
export type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
/**
 * Type-safe icon wrapper that fixes TS2786 errors
 * Usage: const SafeIcon = icon(ArrowLeft)
 */
export declare function icon<T extends IconComponent>(Icon: T): (props: LucideProps) => React.JSX.Element;
/**
 * Alternative: Direct casting for inline usage
 * Usage: {Icon as any}
 */
export declare const asIcon: (Icon: IconComponent) => (props: LucideProps) => React.JSX.Element;
//# sourceMappingURL=icon-helper.d.ts.map