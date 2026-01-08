/**
 * Markdown and MDX utilities
 */
import type { DocFrontmatter } from '../types/index.js';
/** Escape special characters in markdown table cells */
export declare function escapeTableCell(value: string): string;
/** Escape type string for markdown display */
export declare function escapeType(type: string): string;
/** Convert a name to a URL slug */
export declare function toSlug(name: string): string;
/** Convert camelCase/PascalCase to kebab-case */
export declare function toKebabCase(str: string): string;
/** Parse MDX frontmatter */
export declare function parseFrontmatter(content: string): {
    data: DocFrontmatter;
    content: string;
};
/** Stringify frontmatter with content */
export declare function stringifyFrontmatter(data: DocFrontmatter, content: string): string;
/** Create a markdown table */
export declare function createTable(headers: string[], rows: string[][]): string;
/** Create a props table for component documentation */
export declare function createPropsTable(props: Array<{
    name: string;
    type: string;
    required: boolean;
    default: string | null;
    description: string;
}>): string;
/** Create a parameters table for function/hook documentation */
export declare function createParametersTable(params: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
}>): string;
/** Create a properties table for return type/object documentation */
export declare function createPropertiesTable(properties: Array<{
    name: string;
    type: string;
    description: string;
}>): string;
/** Format code block with language */
export declare function codeBlock(code: string | undefined | null, language?: string): string;
/** Format inline code */
export declare function inlineCode(code: string): string;
/** Create an MDX callout/admonition */
export declare function createCallout(type: 'note' | 'tip' | 'warning' | 'danger' | 'info', content: string): string;
/** Create a deprecation warning */
export declare function createDeprecationWarning(message: string, alternative?: string): string;
/** Create a "since version" badge */
export declare function createSinceBadge(version: string): string;
/** Extract heading from content */
export declare function extractHeading(content: string): string | null;
/** Update a specific section in markdown content */
export declare function updateSection(content: string, sectionHeading: string, newSectionContent: string, headingLevel?: number): string;
/** Normalize whitespace in content */
export declare function normalizeWhitespace(content: string): string;
/** Check if content is MDX (has JSX-like tags) */
export declare function isMDX(content: string): boolean;
/** Get estimated reading time in minutes */
export declare function getReadingTime(content: string): number;
//# sourceMappingURL=markdown.d.ts.map