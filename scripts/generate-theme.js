#!/usr/bin/env npx tsx
/**
 * Theme Generator CLI
 *
 * Generates Clarity Chat theme files from a primary color.
 * Creates both JSON configuration and CSS custom properties.
 *
 * Usage:
 *   npx tsx scripts/generate-theme.ts
 *   npx tsx scripts/generate-theme.ts --name "Ocean" --color "#0ea5e9" --mode dark
 *
 * @packageDocumentation
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}
function hslToString(hsl) {
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}
function adjustLightness(hsl, amount) {
    return {
        ...hsl,
        l: Math.max(0, Math.min(100, hsl.l + amount)),
    };
}
function generateTheme(name, primaryHex, mode) {
    const primary = hexToHSL(primaryHex);
    const isDark = mode === 'dark';
    return {
        name,
        mode,
        colors: {
            primary: hslToString(primary),
            primaryForeground: isDark ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 100%)',
            background: isDark ? 'hsl(0, 0%, 7%)' : 'hsl(0, 0%, 100%)',
            foreground: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 9%)',
            muted: isDark ? 'hsl(0, 0%, 15%)' : 'hsl(0, 0%, 96%)',
            mutedForeground: isDark ? 'hsl(0, 0%, 65%)' : 'hsl(0, 0%, 45%)',
            border: isDark ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 90%)',
            userBubble: hslToString(primary),
            userBubbleForeground: 'hsl(0, 0%, 100%)',
            assistantBubble: isDark ? 'hsl(0, 0%, 15%)' : 'hsl(0, 0%, 96%)',
            assistantBubbleForeground: isDark ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 9%)',
            ring: hslToString(adjustLightness(primary, isDark ? -10 : 10)),
            destructive: 'hsl(0, 84%, 60%)',
            destructiveForeground: 'hsl(0, 0%, 100%)',
        },
        spacing: {
            messagePadding: '12px 16px',
            messageGap: '8px',
            containerPadding: '16px',
        },
        borderRadius: {
            bubble: '16px',
            input: '24px',
            container: '8px',
        },
    };
}
function generateCSS(theme) {
    const slug = theme.name.toLowerCase().replace(/\s+/g, '-');
    return `:root[data-theme="${slug}"] {
  /* Primary Colors */
  --cc-primary: ${theme.colors.primary};
  --cc-primary-foreground: ${theme.colors.primaryForeground};

  /* Background & Foreground */
  --cc-background: ${theme.colors.background};
  --cc-foreground: ${theme.colors.foreground};

  /* Muted */
  --cc-muted: ${theme.colors.muted};
  --cc-muted-foreground: ${theme.colors.mutedForeground};

  /* Border & Ring */
  --cc-border: ${theme.colors.border};
  --cc-ring: ${theme.colors.ring};

  /* Message Bubbles */
  --cc-user-bubble: ${theme.colors.userBubble};
  --cc-user-bubble-foreground: ${theme.colors.userBubbleForeground};
  --cc-assistant-bubble: ${theme.colors.assistantBubble};
  --cc-assistant-bubble-foreground: ${theme.colors.assistantBubbleForeground};

  /* Destructive */
  --cc-destructive: ${theme.colors.destructive};
  --cc-destructive-foreground: ${theme.colors.destructiveForeground};

  /* Spacing */
  --cc-message-padding: ${theme.spacing.messagePadding};
  --cc-message-gap: ${theme.spacing.messageGap};
  --cc-container-padding: ${theme.spacing.containerPadding};

  /* Border Radius */
  --cc-bubble-radius: ${theme.borderRadius.bubble};
  --cc-input-radius: ${theme.borderRadius.input};
  --cc-container-radius: ${theme.borderRadius.container};
}
`;
}
// ============================================================================
// CLI
// ============================================================================
function parseArgs() {
    const args = process.argv.slice(2);
    const result = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--name' && args[i + 1]) {
            result.name = args[++i];
        }
        else if (args[i] === '--color' && args[i + 1]) {
            result.color = args[++i];
        }
        else if (args[i] === '--mode' && args[i + 1]) {
            result.mode = args[++i];
        }
    }
    return result;
}
function ask(rl, question, defaultValue) {
    const prompt = defaultValue
        ? `${question} (${defaultValue}): `
        : `${question}: `;
    return new Promise((resolve) => rl.question(prompt, (answer) => resolve(answer || defaultValue || '')));
}
async function main() {
    const parsedArgs = parseArgs();
    console.log('\n🎨 Clarity Chat Theme Generator\n');
    let themeName;
    let primaryColor;
    let mode;
    // Use CLI args if provided, otherwise prompt
    if (parsedArgs.name && parsedArgs.color && parsedArgs.mode) {
        themeName = parsedArgs.name;
        primaryColor = parsedArgs.color;
        mode = parsedArgs.mode;
    }
    else {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        try {
            themeName = parsedArgs.name || (await ask(rl, 'Theme name (e.g., Ocean)'));
            primaryColor =
                parsedArgs.color ||
                    (await ask(rl, 'Primary color (hex, e.g., #3b82f6)'));
            const modeInput = parsedArgs.mode || (await ask(rl, 'Mode (light/dark)', 'dark'));
            mode = modeInput === 'light' ? 'light' : 'dark';
        }
        finally {
            rl.close();
        }
    }
    // Validate inputs
    if (!themeName) {
        console.error('❌ Theme name is required');
        process.exit(1);
    }
    if (!primaryColor || !primaryColor.match(/^#?[0-9a-fA-F]{6}$/)) {
        console.error('❌ Invalid hex color. Use format: #3b82f6');
        process.exit(1);
    }
    // Ensure hex has #
    if (!primaryColor.startsWith('#')) {
        primaryColor = '#' + primaryColor;
    }
    // Generate theme
    const theme = generateTheme(themeName, primaryColor, mode);
    const css = generateCSS(theme);
    const slug = themeName.toLowerCase().replace(/\s+/g, '-');
    // Create themes directory
    const themesDir = path.join(process.cwd(), 'themes');
    fs.mkdirSync(themesDir, { recursive: true });
    // Write files
    const jsonPath = path.join(themesDir, `${slug}.json`);
    const cssPath = path.join(themesDir, `${slug}.css`);
    fs.writeFileSync(jsonPath, JSON.stringify(theme, null, 2));
    fs.writeFileSync(cssPath, css);
    console.log(`\n✅ Generated theme "${themeName}":`);
    console.log(`   📄 ${jsonPath}`);
    console.log(`   🎨 ${cssPath}`);
    console.log('\n📝 Usage:');
    console.log(`   1. Import the CSS: import './themes/${slug}.css'`);
    console.log(`   2. Add data attribute: <html data-theme="${slug}">`);
    console.log(`   3. Or use ThemeProvider: <ThemeProvider theme="${slug}">`);
    console.log('\n🎨 Theme Colors:');
    console.log(`   Primary:    ${theme.colors.primary}`);
    console.log(`   Background: ${theme.colors.background}`);
    console.log(`   Foreground: ${theme.colors.foreground}`);
    console.log('');
}
main().catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
//# sourceMappingURL=generate-theme.js.map