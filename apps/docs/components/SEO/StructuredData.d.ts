/**
 * Structured Data (JSON-LD) Component
 *
 * Adds structured data to pages for better SEO and rich snippets.
 * Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export interface StructuredDataProps {
    type?: 'website' | 'software' | 'documentation' | 'article';
    title?: string;
    description?: string;
    url?: string;
}
export declare function StructuredData({ type, title, description, url }: StructuredDataProps): import("react/jsx-runtime").JSX.Element;
/**
 * Organization structured data
 */
export declare function OrganizationStructuredData(): import("react/jsx-runtime").JSX.Element;
/**
 * Breadcrumb structured data
 */
export interface BreadcrumbItem {
    name: string;
    url: string;
}
export declare function BreadcrumbStructuredData({ items }: {
    items: BreadcrumbItem[];
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StructuredData.d.ts.map