/**
 * Beautiful table formatting utilities
 * Enhanced with colors, alignment, and styling
 */
import pc from 'picocolors';
const BORDER_CHARS = {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    topMiddle: '┬',
    bottomMiddle: '┴',
    leftMiddle: '├',
    rightMiddle: '┤',
    middle: '┼',
    horizontal: '─',
    vertical: '│',
};
/**
 * Create a beautiful table
 */
export function table(data, columns, options = {}) {
    const { border = true, padding = 1, headerColor = (s) => pc.bold(pc.cyan(s)), compact = false, } = options;
    // Normalize data to array of arrays
    const rows = Array.isArray(data[0]) && typeof data[0][0] === 'string'
        ? data
        : data.map((row) => columns.map((col) => {
            const value = col.key ? row[col.key] : row[col.header];
            return value != null ? String(value) : '';
        }));
    // Calculate column widths
    const widths = columns.map((col, i) => {
        const headerWidth = col.header.length;
        const dataWidth = Math.max(...rows.map((row) => (row[i] || '').length));
        return col.width || Math.max(headerWidth, dataWidth) + padding * 2;
    });
    const output = [];
    // Top border
    if (border) {
        const topBorder = BORDER_CHARS.topLeft +
            widths
                .map((w) => BORDER_CHARS.horizontal.repeat(w))
                .join(BORDER_CHARS.topMiddle) +
            BORDER_CHARS.topRight;
        output.push(pc.dim(topBorder));
    }
    // Header
    const headerCells = columns.map((col, i) => {
        const text = col.header;
        const width = widths[i];
        const pad = ' '.repeat(padding);
        let aligned;
        if (col.align === 'center') {
            const totalPad = width - text.length - padding * 2;
            const leftPad = Math.floor(totalPad / 2);
            const rightPad = totalPad - leftPad;
            aligned = ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
        }
        else if (col.align === 'right') {
            const totalPad = width - text.length - padding * 2;
            aligned = ' '.repeat(totalPad) + text;
        }
        else {
            aligned = text.padEnd(width - padding * 2);
        }
        return pad + headerColor(aligned) + pad;
    });
    output.push(border
        ? pc.dim(BORDER_CHARS.vertical) +
            headerCells.join(pc.dim(BORDER_CHARS.vertical)) +
            pc.dim(BORDER_CHARS.vertical)
        : headerCells.join('  '));
    // Header separator
    if (border) {
        const separator = BORDER_CHARS.leftMiddle +
            widths
                .map((w) => BORDER_CHARS.horizontal.repeat(w))
                .join(BORDER_CHARS.middle) +
            BORDER_CHARS.rightMiddle;
        output.push(pc.dim(separator));
    }
    else if (!compact) {
        output.push('');
    }
    // Data rows
    rows.forEach((row, rowIndex) => {
        const cells = columns.map((col, i) => {
            const text = row[i] || '';
            const width = widths[i];
            const pad = ' '.repeat(padding);
            const colorFn = col.color || ((t) => t);
            let aligned;
            if (col.align === 'center') {
                const totalPad = width - text.length - padding * 2;
                const leftPad = Math.floor(totalPad / 2);
                const rightPad = totalPad - leftPad;
                aligned = ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
            }
            else if (col.align === 'right') {
                const totalPad = width - text.length - padding * 2;
                aligned = ' '.repeat(totalPad) + text;
            }
            else {
                aligned = text.padEnd(width - padding * 2);
            }
            return pad + colorFn(aligned) + pad;
        });
        output.push(border
            ? pc.dim(BORDER_CHARS.vertical) +
                cells.join(pc.dim(BORDER_CHARS.vertical)) +
                pc.dim(BORDER_CHARS.vertical)
            : cells.join('  '));
        // Row separator (except for last row)
        if (border && rowIndex < rows.length - 1 && !compact) {
            const separator = BORDER_CHARS.leftMiddle +
                widths
                    .map((w) => BORDER_CHARS.horizontal.repeat(w))
                    .join(BORDER_CHARS.middle) +
                BORDER_CHARS.rightMiddle;
            output.push(pc.dim(separator));
        }
    });
    // Bottom border
    if (border) {
        const bottomBorder = BORDER_CHARS.bottomLeft +
            widths
                .map((w) => BORDER_CHARS.horizontal.repeat(w))
                .join(BORDER_CHARS.bottomMiddle) +
            BORDER_CHARS.bottomRight;
        output.push(pc.dim(bottomBorder));
    }
    return output.join('\n');
}
/**
 * Create a table (wrapper for table function)
 */
export function createTable(data, columns, options = {}) {
    return table(data, columns, options);
}
/**
 * Create a list table (wrapper for listTable function)
 */
export function createListTable(items) {
    return listTable(items);
}
export function createStatusTable(rows) {
    const columns = [
        { header: 'Check', key: 'check', width: 30 },
        { header: 'Status', key: 'status', width: 10, align: 'center' },
        { header: 'Message', key: 'message' },
    ];
    const data = rows.map((row) => ({
        check: row.check,
        status: row.status === 'pass' ? '✓' : row.status === 'warn' ? '⚠' : '✗',
        message: row.message,
    }));
    return table(data, columns, {
        border: true,
        headerColor: (s) => pc.bold(pc.cyan(s)),
    });
}
/**
 * Create a simple list table (no borders)
 */
export function listTable(items) {
    const maxLabelWidth = Math.max(...items.map((item) => item.label.length));
    return items
        .map((item) => {
        const label = item.label.padEnd(maxLabelWidth);
        const colorFn = item.color || ((t) => t);
        return `${pc.dim(label)}  ${colorFn(item.value)}`;
    })
        .join('\n');
}
/**
 * Create a key-value table
 */
export function keyValueTable(data, options = {}) {
    const { labelColor = pc.dim, valueColor = (t) => t } = options;
    const maxKeyWidth = Math.max(...Object.keys(data).map((key) => key.length));
    return Object.entries(data)
        .map(([key, value]) => {
        const label = labelColor(key.padEnd(maxKeyWidth));
        const val = valueColor(String(value));
        return `${label}  ${val}`;
    })
        .join('\n');
}
//# sourceMappingURL=table.js.map