/**
 * Color Contrast Validation Utilities
 *
 * Validates that color combinations meet WCAG accessibility standards.
 * WCAG 2.1 requires:
 * - AA: 4.5:1 for normal text, 3:1 for large text
 * - AAA: 7:1 for normal text, 4.5:1 for large text
 */
/**
 * Parse HSL string to components
 * Supports formats: "142.1 76.2% 36.3%" or "hsl(142.1, 76.2%, 36.3%)"
 */
export function parseHSL(hsl) {
    // Handle "H S% L%" format (CSS custom property format)
    const spaceSeparated = hsl.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
    if (spaceSeparated) {
        return {
            h: parseFloat(spaceSeparated[1]),
            s: parseFloat(spaceSeparated[2]),
            l: parseFloat(spaceSeparated[3]),
        };
    }
    // Handle "hsl(H, S%, L%)" format
    const functional = hsl.match(/hsl\(\s*([\d.]+),?\s*([\d.]+)%?,?\s*([\d.]+)%?\s*\)/);
    if (functional) {
        return {
            h: parseFloat(functional[1]),
            s: parseFloat(functional[2]),
            l: parseFloat(functional[3]),
        };
    }
    return null;
}
/**
 * Convert HSL to RGB
 */
export function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}
/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(fg, bg) {
    const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
    const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}
/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(foregroundHSL, backgroundHSL) {
    const fg = parseHSL(foregroundHSL);
    const bg = parseHSL(backgroundHSL);
    if (!fg || !bg) {
        throw new Error(`Invalid HSL format. Got fg: "${foregroundHSL}", bg: "${backgroundHSL}"`);
    }
    const fgRgb = hslToRgb(fg.h, fg.s, fg.l);
    const bgRgb = hslToRgb(bg.h, bg.s, bg.l);
    const ratio = getContrastRatio(fgRgb, bgRgb);
    return {
        ratio: Math.round(ratio * 100) / 100,
        aa: ratio >= 4.5,
        aaLarge: ratio >= 3,
        aaa: ratio >= 7,
        aaaLarge: ratio >= 4.5,
    };
}
/**
 * Semantic color pairs that should be validated
 */
export const semanticColorPairs = [
    // Primary colors
    {
        name: 'primary',
        foreground: '210 40% 98%',
        background: '221.2 83.2% 53.3%',
    },
    // Destructive colors
    {
        name: 'destructive',
        foreground: '210 40% 98%',
        background: '0 84.2% 60.2%',
    },
    // Success colors (light mode)
    { name: 'success', foreground: '0 0% 100%', background: '142.1 76.2% 36.3%' },
    // Warning colors (light mode)
    { name: 'warning', foreground: '0 0% 0%', background: '45.4 93.4% 47.5%' },
    // Info colors (light mode)
    { name: 'info', foreground: '0 0% 100%', background: '217.2 91.2% 59.8%' },
    // Muted colors
    {
        name: 'muted',
        foreground: '215.4 16.3% 46.9%',
        background: '210 40% 96.1%',
    },
    // Accent colors
    {
        name: 'accent',
        foreground: '222.2 47.4% 11.2%',
        background: '210 40% 96.1%',
    },
];
/**
 * Dark mode color pairs
 */
export const darkModeColorPairs = [
    {
        name: 'success (dark)',
        foreground: '0 0% 100%',
        background: '142.1 70.6% 45.3%',
    },
    {
        name: 'warning (dark)',
        foreground: '0 0% 0%',
        background: '45.4 93.4% 47.5%',
    },
    {
        name: 'info (dark)',
        foreground: '222.2 47.4% 11.2%',
        background: '217.2 91.2% 59.8%',
    },
];
/**
 * Validate all semantic color pairs
 */
export function validateAllColors() {
    const allPairs = [...semanticColorPairs, ...darkModeColorPairs];
    return allPairs.map((pair) => {
        const result = checkContrast(pair.foreground, pair.background);
        let level = 'Fail';
        if (result.aaa)
            level = 'AAA';
        else if (result.aa)
            level = 'AA';
        else if (result.aaLarge)
            level = 'AA Large';
        return {
            pair,
            result,
            passes: result.aa || result.aaLarge,
            level,
        };
    });
}
/**
 * Generate a contrast report as a string table
 */
export function generateContrastReport() {
    const reports = validateAllColors();
    const lines = [
        'Color Contrast Validation Report',
        '================================',
        '',
        'WCAG 2.1 Requirements:',
        '  - AA: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold)',
        '  - AAA: 7:1 for normal text, 4.5:1 for large text',
        '',
        'Results:',
        '-'.repeat(70),
        'Color Pair'.padEnd(20) +
            'Ratio'.padEnd(10) +
            'Level'.padEnd(12) +
            'Status',
        '-'.repeat(70),
    ];
    for (const report of reports) {
        const status = report.passes ? 'PASS' : 'FAIL';
        const statusIcon = report.passes ? '✓' : '✗';
        lines.push(report.pair.name.padEnd(20) +
            `${report.result.ratio}:1`.padEnd(10) +
            report.level.padEnd(12) +
            `${statusIcon} ${status}`);
    }
    lines.push('-'.repeat(70));
    const passing = reports.filter((r) => r.passes).length;
    const total = reports.length;
    lines.push('');
    lines.push(`Summary: ${passing}/${total} color pairs pass WCAG requirements`);
    const failures = reports.filter((r) => !r.passes);
    if (failures.length > 0) {
        lines.push('');
        lines.push('Failures requiring attention:');
        for (const f of failures) {
            lines.push(`  - ${f.pair.name}: ${f.result.ratio}:1 (needs 4.5:1 for AA)`);
        }
    }
    return lines.join('\n');
}
//# sourceMappingURL=color-contrast.js.map