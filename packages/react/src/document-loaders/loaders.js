/**
 * Document Loaders
 *
 * Flexible loaders for different file types.
 * Minimal dependencies - bring your own parsing library if needed.
 */
/**
 * Text File Loader
 *
 * Simple loader for plain text files.
 */
export class TextLoader {
    constructor() {
        this.name = 'text';
        this.supportedTypes = ['text/plain', 'txt'];
    }
    async load(source) {
        let content;
        if (typeof source === 'string') {
            // Load from URL or inline text
            if (source.startsWith('http')) {
                const response = await fetch(source);
                content = await response.text();
            }
            else {
                content = source;
            }
        }
        else {
            // Load from File or Blob
            content = await source.text();
        }
        return [
            {
                content,
                metadata: {
                    type: 'text/plain',
                    source: source instanceof File ? source.name : 'unknown',
                },
            },
        ];
    }
    supports(type) {
        return this.supportedTypes.includes(type);
    }
}
/**
 * JSON Loader
 *
 * Load JSON files and convert to text.
 */
export class JSONLoader {
    constructor() {
        this.name = 'json';
        this.supportedTypes = ['application/json', 'json'];
    }
    async load(source, options) {
        let content;
        if (typeof source === 'string') {
            if (source.startsWith('http')) {
                const response = await fetch(source);
                content = await response.text();
            }
            else {
                content = source;
            }
        }
        else {
            content = await source.text();
        }
        const json = JSON.parse(content);
        // Extract specific path if provided
        let data = json;
        if (options?.jsonPath) {
            const parts = options.jsonPath.split('.');
            for (const part of parts) {
                data = data[part];
            }
        }
        // Convert to text
        const text = options?.stringify !== false
            ? JSON.stringify(data, null, 2)
            : String(data);
        return [
            {
                content: text,
                metadata: {
                    type: 'application/json',
                    source: source instanceof File ? source.name : 'unknown',
                },
            },
        ];
    }
    supports(type) {
        return this.supportedTypes.includes(type);
    }
}
/**
 * CSV Loader
 *
 * Load CSV files and convert to text.
 */
export class CSVLoader {
    constructor() {
        this.name = 'csv';
        this.supportedTypes = ['text/csv', 'csv'];
    }
    async load(source, options) {
        let content;
        if (typeof source === 'string') {
            if (source.startsWith('http')) {
                const response = await fetch(source);
                content = await response.text();
            }
            else {
                content = source;
            }
        }
        else {
            content = await source.text();
        }
        const separator = options?.separator || ',';
        const hasHeader = options?.hasHeader !== false;
        const lines = content.trim().split('\n');
        const headers = hasHeader ? lines[0].split(separator) : null;
        const dataLines = hasHeader ? lines.slice(1) : lines;
        // Convert to readable text
        const text = dataLines
            .map((line, i) => {
            const values = line.split(separator);
            if (headers) {
                return headers.map((h, j) => `${h}: ${values[j]}`).join(', ');
            }
            else {
                return `Row ${i + 1}: ${values.join(', ')}`;
            }
        })
            .join('\n');
        return [
            {
                content: text,
                metadata: {
                    type: 'text/csv',
                    source: source instanceof File ? source.name : 'unknown',
                    rows: dataLines.length,
                },
            },
        ];
    }
    supports(type) {
        return this.supportedTypes.includes(type);
    }
}
/**
 * HTML Loader
 *
 * Load HTML and extract text content.
 * Note: In browser, uses native DOM parsing. In Node, would need a library.
 */
export class HTMLLoader {
    constructor() {
        this.name = 'html';
        this.supportedTypes = ['text/html', 'html'];
    }
    async load(source, options) {
        let html;
        if (typeof source === 'string') {
            if (source.startsWith('http')) {
                const response = await fetch(source);
                html = await response.text();
            }
            else {
                html = source;
            }
        }
        else {
            html = await source.text();
        }
        // Parse HTML (browser only)
        if (typeof DOMParser !== 'undefined') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            // Remove excluded elements
            if (options?.exclude) {
                for (const selector of options.exclude) {
                    doc.querySelectorAll(selector).forEach(el => el.remove());
                }
            }
            // Extract text
            const text = doc.body.textContent || '';
            return [
                {
                    content: text.trim(),
                    metadata: {
                        type: 'text/html',
                        source: source instanceof File ? source.name : 'unknown',
                        title: doc.title,
                    },
                },
            ];
        }
        // Fallback: Simple regex-based extraction (not recommended for complex HTML)
        const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return [
            {
                content: text,
                metadata: {
                    type: 'text/html',
                    source: source instanceof File ? source.name : 'unknown',
                },
            },
        ];
    }
    supports(type) {
        return this.supportedTypes.includes(type);
    }
}
/**
 * Markdown Loader
 */
export class MarkdownLoader {
    constructor() {
        this.name = 'markdown';
        this.supportedTypes = ['text/markdown', 'md', 'markdown'];
    }
    async load(source) {
        let content;
        if (typeof source === 'string') {
            if (source.startsWith('http')) {
                const response = await fetch(source);
                content = await response.text();
            }
            else {
                content = source;
            }
        }
        else {
            content = await source.text();
        }
        return [
            {
                content,
                metadata: {
                    type: 'text/markdown',
                    source: source instanceof File ? source.name : 'unknown',
                },
            },
        ];
    }
    supports(type) {
        return this.supportedTypes.includes(type);
    }
}
/**
 * Loader Registry
 *
 * Manage multiple loaders and route to the correct one.
 */
export class LoaderRegistry {
    constructor() {
        this.loaders = [
            new TextLoader(),
            new JSONLoader(),
            new CSVLoader(),
            new HTMLLoader(),
            new MarkdownLoader(),
        ];
    }
    /**
     * Add a custom loader
     */
    register(loader) {
        this.loaders.push(loader);
    }
    /**
     * Get loader for file type
     */
    getLoader(type) {
        return this.loaders.find(l => l.supports(type));
    }
    /**
     * Load a document with automatic loader selection
     */
    async load(source, options) {
        let type;
        if (source instanceof File) {
            type = source.type || this.getTypeFromName(source.name);
        }
        else if (source instanceof Blob) {
            type = source.type;
        }
        else if (typeof source === 'string' && source.startsWith('http')) {
            // Try to get type from URL extension
            type = this.getTypeFromName(source);
        }
        else {
            type = 'text/plain';
        }
        const loader = this.getLoader(type);
        if (!loader) {
            throw new Error(`No loader found for type: ${type}`);
        }
        return await loader.load(source, options);
    }
    getTypeFromName(name) {
        const ext = name.split('.').pop()?.toLowerCase();
        const typeMap = {
            txt: 'text/plain',
            json: 'application/json',
            csv: 'text/csv',
            html: 'text/html',
            htm: 'text/html',
            md: 'text/markdown',
            markdown: 'text/markdown',
        };
        return typeMap[ext || ''] || 'text/plain';
    }
}
//# sourceMappingURL=loaders.js.map