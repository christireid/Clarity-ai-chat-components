/**
 * Markdown and MDX utilities
 */
import matter from 'gray-matter';
import yaml from 'js-yaml';
/** Escape special characters in markdown table cells */
export function escapeTableCell(value) {
    return value
        .replace(/\|/g, '\\|')
        .replace(/\n/g, '<br/>')
        .replace(/`/g, '\\`');
}
/** Escape type string for markdown display */
export function escapeType(type) {
    return type.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|');
}
/** Convert a name to a URL slug */
export function toSlug(name) {
    return name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
/** Convert camelCase/PascalCase to kebab-case */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}
/** Parse MDX frontmatter */
export function parseFrontmatter(content) {
    const parsed = matter(content);
    return {
        data: parsed.data,
        content: parsed.content,
    };
}
/** Remove undefined values from an object (deep) */
function removeUndefined(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined)
            continue;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = removeUndefined(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
/** Stringify frontmatter with content */
export function stringifyFrontmatter(data, content) {
    // Remove undefined values to prevent YAML serialization errors
    const cleanData = removeUndefined(data);
    // Use js-yaml directly to avoid gray-matter's dependency on removed safeDump
    const yamlContent = yaml.dump(cleanData, { lineWidth: -1, noRefs: true });
    return `---\n${yamlContent}---\n${content}`;
}
/** Create a markdown table */
export function createTable(headers, rows) {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const dataRows = rows.map((row) => `| ${row.map(escapeTableCell).join(' | ')} |`);
    return [headerRow, separatorRow, ...dataRows].join('\n');
}
/** Create a props table for component documentation */
export function createPropsTable(props) {
    const headers = ['Prop', 'Type', 'Required', 'Default', 'Description'];
    const rows = props.map((prop) => [
        `\`${prop.name}\``,
        `\`${escapeType(prop.type)}\``,
        prop.required ? 'Yes' : 'No',
        prop.default ? `\`${prop.default}\`` : '-',
        prop.description,
    ]);
    return createTable(headers, rows);
}
/** Create a parameters table for function/hook documentation */
export function createParametersTable(params) {
    const headers = ['Parameter', 'Type', 'Required', 'Description'];
    const rows = params.map((param) => [
        `\`${param.name}\``,
        `\`${escapeType(param.type)}\``,
        param.required ? 'Yes' : 'No',
        param.description,
    ]);
    return createTable(headers, rows);
}
/** Create a properties table for return type/object documentation */
export function createPropertiesTable(properties) {
    const headers = ['Property', 'Type', 'Description'];
    const rows = properties.map((prop) => [
        `\`${prop.name}\``,
        `\`${escapeType(prop.type)}\``,
        prop.description,
    ]);
    return createTable(headers, rows);
}
/** Format code block with language */
export function codeBlock(code, language = 'typescript') {
    if (!code)
        return `\`\`\`${language}\n// No code available\n\`\`\``;
    return `\`\`\`${language}\n${code}\n\`\`\``;
}
/** Format inline code */
export function inlineCode(code) {
    return `\`${code}\``;
}
/** Create an MDX callout/admonition */
export function createCallout(type, content) {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    return `<Callout type="${type}" title="${title}">\n${content}\n</Callout>`;
}
/** Create a deprecation warning */
export function createDeprecationWarning(message, alternative) {
    let content = `**Deprecated:** ${message}`;
    if (alternative) {
        content += `\n\nUse ${inlineCode(alternative)} instead.`;
    }
    return createCallout('warning', content);
}
/** Create a "since version" badge */
export function createSinceBadge(version) {
    return `<Badge variant="outline">Since v${version}</Badge>`;
}
/** Extract heading from content */
export function extractHeading(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match?.[1] ?? null;
}
/** Update a specific section in markdown content */
export function updateSection(content, sectionHeading, newSectionContent, headingLevel = 2) {
    const headingPrefix = '#'.repeat(headingLevel);
    const regex = new RegExp(`(${headingPrefix}\\s+${escapeRegex(sectionHeading)}\\n)([\\s\\S]*?)(?=\\n${headingPrefix}\\s|$)`, 'g');
    const replacement = `$1${newSectionContent}\n\n`;
    const updated = content.replace(regex, replacement);
    // If section wasn't found, append it
    if (updated === content) {
        return `${content}\n\n${headingPrefix} ${sectionHeading}\n\n${newSectionContent}\n`;
    }
    return updated;
}
/** Escape regex special characters */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/** Normalize whitespace in content */
export function normalizeWhitespace(content) {
    return content
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
        .replace(/[ \t]+$/gm, '') // Trim trailing whitespace
        .trim();
}
/** Check if content is MDX (has JSX-like tags) */
export function isMDX(content) {
    return /<[A-Z][A-Za-z]*/.test(content) || /import\s+/.test(content);
}
/** Get estimated reading time in minutes */
export function getReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
//# sourceMappingURL=markdown.js.map