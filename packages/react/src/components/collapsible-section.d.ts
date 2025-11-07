/**
 * Collapsible Section Component
 *
 * Animated expand/collapse section with smooth height transitions.
 * Perfect for accordions, FAQ sections, and expandable list items.
 */
import * as React from 'react';
export interface CollapsibleSectionProps {
    /** Whether the section is open */
    open?: boolean;
    /** Controlled open state */
    onOpenChange?: (open: boolean) => void;
    /** Default open state (uncontrolled) */
    defaultOpen?: boolean;
    /** Trigger element (button to toggle) */
    trigger: React.ReactNode;
    /** Content to show/hide */
    children: React.ReactNode;
    /** Custom CSS class for container */
    className?: string;
    /** Custom CSS class for trigger */
    triggerClassName?: string;
    /** Custom CSS class for content */
    contentClassName?: string;
    /** Animation duration in seconds */
    duration?: number;
    /** Disabled state */
    disabled?: boolean;
}
/**
 * Collapsible section with smooth height animation
 */
export declare const CollapsibleSection: React.NamedExoticComponent<CollapsibleSectionProps>;
/**
 * Accordion - Multiple collapsible sections where only one can be open
 */
export interface AccordionProps {
    /** Accordion items */
    items: Array<{
        id: string;
        trigger: React.ReactNode;
        content: React.ReactNode;
    }>;
    /** Currently open item ID */
    openId?: string;
    /** Callback when open item changes */
    onOpenChange?: (id: string | null) => void;
    /** Default open item ID */
    defaultOpenId?: string;
    /** Allow multiple items open at once */
    allowMultiple?: boolean;
    /** Custom CSS class */
    className?: string;
    /** Animation duration */
    duration?: number;
}
export declare const Accordion: React.NamedExoticComponent<AccordionProps>;
/**
 * Simple expandable list item
 */
export interface ExpandableListItemProps {
    /** Title */
    title: string;
    /** Badge or extra info */
    badge?: React.ReactNode;
    /** Icon */
    icon?: React.ReactNode;
    /** Content to show when expanded */
    children: React.ReactNode;
    /** Default open state */
    defaultOpen?: boolean;
    /** Custom CSS class */
    className?: string;
}
export declare const ExpandableListItem: React.NamedExoticComponent<ExpandableListItemProps>;
//# sourceMappingURL=collapsible-section.d.ts.map