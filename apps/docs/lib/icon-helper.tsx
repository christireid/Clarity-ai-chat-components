/**
 * Icon Helper - Fixes lucide-react type compatibility with TypeScript 5.x + React 18
 * 
 * This wrapper ensures lucide-react icons work correctly with strict TypeScript checking.
 */

import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

/**
 * Type-safe icon wrapper that fixes TS2786 errors
 * Usage: const SafeIcon = icon(ArrowLeft)
 */
export function icon<T extends IconComponent>(
  Icon: T
): (props: LucideProps) => JSX.Element {
  return (props: LucideProps) => <Icon {...props} />
}

/**
 * Alternative: Direct casting for inline usage
 * Usage: {Icon as any}
 */
export const asIcon = (Icon: IconComponent) => Icon as unknown as (props: LucideProps) => JSX.Element
