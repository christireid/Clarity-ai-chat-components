import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clarity Chat - Theme Customizer Component
 *
 * A comprehensive, interactive theme customization interface.
 * Features live preview, preset selection, color pickers, and
 * accessibility information.
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { useTheme } from '../../theme/ThemeProvider';
import { modernThemes, modernThemeMetadata, getThemesByCategory, } from '../../theme/modern-presets';
import { createTheme } from '../../theme/create-theme';
import { getContrastRatio, hslStringToHex, hexToHSLString, } from '../../theme/color-utils';
import { simulateColorBlindness, generateHarmoniousPalette, } from '../../theme/color-advanced';
import { useReducedMotion } from '@clarity-chat/primitives';
import { useLocalStorage } from '../../hooks/storage/use-local-storage';
// ============================================================================
// Constants
// ============================================================================
const FONT_FAMILIES = [
    { id: 'system', label: 'System', family: 'system-ui, sans-serif' },
    { id: 'inter', label: 'Inter', family: '"Inter", system-ui, sans-serif' },
    {
        id: 'roboto',
        label: 'Roboto',
        family: '"Roboto", system-ui, sans-serif',
    },
    { id: 'mono', label: 'Monospace', family: 'ui-monospace, monospace' },
];
const SIZE_SCALES = [
    { id: 'compact', label: 'Compact', multiplier: 0.875 },
    { id: 'default', label: 'Default', multiplier: 1 },
    { id: 'large', label: 'Large', multiplier: 1.125 },
];
const ALL_COLOR_BLINDNESS_TYPES = [
    {
        type: 'protanopia',
        label: 'Protanopia',
        description: 'Red-blind',
        prevalence: '1% of males',
    },
    {
        type: 'deuteranopia',
        label: 'Deuteranopia',
        description: 'Green-blind',
        prevalence: '1% of males',
    },
    {
        type: 'tritanopia',
        label: 'Tritanopia',
        description: 'Blue-blind',
        prevalence: '0.003%',
    },
    {
        type: 'protanomaly',
        label: 'Protanomaly',
        description: 'Red-weak',
        prevalence: '1% of males',
    },
    {
        type: 'deuteranomaly',
        label: 'Deuteranomaly',
        description: 'Green-weak',
        prevalence: '5% of males',
    },
    {
        type: 'tritanomaly',
        label: 'Tritanomaly',
        description: 'Blue-weak',
        prevalence: '0.01%',
    },
    {
        type: 'achromatopsia',
        label: 'Achromatopsia',
        description: 'Total color blindness',
        prevalence: '0.003%',
    },
    {
        type: 'achromatomaly',
        label: 'Achromatomaly',
        description: 'Partial color blindness',
        prevalence: 'Rare',
    },
];
// Color role mapping for palette generator
const COLOR_ROLE_MAPPING = [
    { role: 'primary', label: 'Primary' },
    { role: 'secondary', label: 'Secondary' },
    { role: 'accent', label: 'Accent' },
    { role: 'success', label: 'Success' },
    { role: 'destructive', label: 'Destructive' },
];
// ============================================================================
// Sub-Components
// ============================================================================
/**
 * Color Picker with hex input and visual swatch
 */
function ColorPicker({ label, value, onChange, showHex = true, id, }) {
    const hex = value.startsWith('#') ? value : hslStringToHex(value);
    const [localHex, setLocalHex] = React.useState(hex);
    const pickerId = id || `color-picker-${label.toLowerCase().replace(/\s+/g, '-')}`;
    React.useEffect(() => {
        setLocalHex(hex);
    }, [hex]);
    const handleHexChange = (e) => {
        const newHex = e.target.value;
        setLocalHex(newHex);
        if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
            onChange(hexToHSLString(newHex));
        }
    };
    const handleColorChange = (e) => {
        const newHex = e.target.value;
        setLocalHex(newHex);
        onChange(hexToHSLString(newHex));
    };
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("label", { htmlFor: pickerId, className: "text-sm font-medium text-foreground min-w-[100px]", children: label }), _jsx("div", { className: "relative", children: _jsx("input", { id: pickerId, type: "color", value: hex, onChange: handleColorChange, className: "w-10 h-10 rounded-lg cursor-pointer border-2 border-border overflow-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2", style: { padding: 0 }, "aria-label": `Choose ${label} color` }) }), showHex && (_jsx("input", { type: "text", value: localHex, onChange: handleHexChange, className: "w-24 px-2 py-1.5 text-sm font-mono rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none", placeholder: "#000000", "aria-label": `${label} hex value` }))] }));
}
/**
 * Theme Preview Card with keyboard support
 */
function ThemePreviewCard({ name, isSelected, onClick, onKeyDown, }) {
    const metadata = modernThemeMetadata[name];
    const theme = modernThemes[name];
    const prefersReducedMotion = useReducedMotion();
    const bgHex = hslStringToHex(theme.colors.background);
    const fgHex = hslStringToHex(theme.colors.foreground);
    const primaryHex = hslStringToHex(theme.colors.primary);
    const secondaryHex = hslStringToHex(theme.colors.secondary);
    return (_jsxs(motion.button, { onClick: onClick, onKeyDown: onKeyDown, whileHover: { scale: prefersReducedMotion ? 1 : 1.02 }, whileTap: { scale: prefersReducedMotion ? 1 : 0.98 }, className: cn('relative rounded-xl p-3 text-left transition-all duration-200', 'border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', isSelected
            ? 'border-primary shadow-lg ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50'), style: { backgroundColor: bgHex }, role: "option", "aria-selected": isSelected, "aria-label": `${metadata.displayName} theme - ${metadata.description}`, tabIndex: 0, children: [_jsxs("div", { className: "flex gap-1.5 mb-2", "aria-hidden": "true", children: [_jsx("div", { className: "w-6 h-6 rounded-full border border-black/10", style: { backgroundColor: primaryHex } }), _jsx("div", { className: "w-6 h-6 rounded-full border border-black/10", style: { backgroundColor: secondaryHex } }), _jsx("div", { className: "w-6 h-6 rounded-full border border-black/10", style: { backgroundColor: fgHex } })] }), _jsx("p", { className: "text-sm font-semibold truncate", style: { color: fgHex }, children: metadata.displayName }), _jsxs("p", { className: "text-xs opacity-70 truncate", style: { color: fgHex }, children: [metadata.description.slice(0, 30), "..."] }), isSelected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center", "aria-hidden": "true", children: _jsx("svg", { className: "w-3 h-3 text-primary-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }))] }));
}
/**
 * Contrast Checker Badge
 */
function ContrastBadge({ foreground, background, label, }) {
    const ratio = getContrastRatio(foreground, background);
    const passesAA = ratio >= 4.5;
    const passesAAA = ratio >= 7;
    return (_jsxs("div", { className: "flex items-center gap-2 text-sm", role: "status", "aria-label": `${label} contrast ratio: ${ratio.toFixed(2)} to 1, ${passesAAA ? 'passes AAA' : passesAA ? 'passes AA' : 'fails'}`, children: [_jsxs("span", { className: "text-muted-foreground", children: [label, ":"] }), _jsxs("span", { className: cn('px-2 py-0.5 rounded font-mono text-xs', passesAAA
                    ? 'bg-success/20 text-success'
                    : passesAA
                        ? 'bg-warning/20 text-warning'
                        : 'bg-destructive/20 text-destructive'), children: [ratio.toFixed(2), ":1"] }), _jsx("span", { className: "text-xs text-muted-foreground", children: passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail' })] }));
}
/**
 * Color Blindness Preview - All 8 types with toggle
 */
function ColorBlindnessPreview({ color, showAllTypes = false, }) {
    const [expanded, setExpanded] = React.useState(showAllTypes);
    const hex = color.startsWith('#') ? color : hslStringToHex(color);
    const displayTypes = expanded
        ? ALL_COLOR_BLINDNESS_TYPES
        : ALL_COLOR_BLINDNESS_TYPES.slice(0, 3);
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 rounded-lg border border-border", style: { backgroundColor: hex }, title: "Original color" }), _jsx("span", { className: "text-[10px] text-muted-foreground block mt-0.5", children: "Original" })] }), displayTypes.map(({ type, label, description }) => {
                        const simulated = simulateColorBlindness(hex, type);
                        return (_jsxs("div", { className: "text-center", title: `${label}: ${description}`, children: [_jsx("div", { className: "w-8 h-8 rounded-lg border border-border", style: { backgroundColor: simulated } }), _jsx("span", { className: "text-[10px] text-muted-foreground block mt-0.5", children: label.slice(0, 5) })] }, type));
                    })] }), !showAllTypes && (_jsx("button", { onClick: () => setExpanded(!expanded), className: "text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded", children: expanded
                    ? 'Show fewer'
                    : `Show all ${ALL_COLOR_BLINDNESS_TYPES.length} types` }))] }));
}
/**
 * Full Color Blindness Panel with all types and descriptions
 */
function ColorBlindnessPanelFull({ colors }) {
    const [selectedColor, setSelectedColor] = React.useState('primary');
    const colorOptions = [
        { key: 'primary', label: 'Primary' },
        { key: 'destructive', label: 'Destructive' },
        { key: 'success', label: 'Success' },
        { key: 'warning', label: 'Warning' },
    ];
    const hex = colors[selectedColor]?.startsWith('#')
        ? colors[selectedColor]
        : hslStringToHex(colors[selectedColor] || '#000000');
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex gap-2 flex-wrap", children: colorOptions.map(({ key, label }) => (_jsx("button", { onClick: () => setSelectedColor(key), className: cn('px-3 py-1.5 text-sm rounded-lg transition-colors', selectedColor === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'), children: label }, key))) }), _jsxs("div", { className: "grid grid-cols-4 gap-3", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-full aspect-square rounded-lg border-2 border-border", style: { backgroundColor: hex } }), _jsx("span", { className: "text-xs text-foreground font-medium block mt-1", children: "Original" })] }), ALL_COLOR_BLINDNESS_TYPES.map(({ type, label, description, prevalence }) => {
                        const simulated = simulateColorBlindness(hex, type);
                        return (_jsxs("div", { className: "text-center group relative", children: [_jsx("div", { className: "w-full aspect-square rounded-lg border border-border transition-all group-hover:border-primary", style: { backgroundColor: simulated } }), _jsx("span", { className: "text-xs text-muted-foreground block mt-1", children: label }), _jsx("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10", children: _jsxs("div", { className: "bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-lg border whitespace-nowrap", children: [_jsx("p", { className: "font-medium", children: label }), _jsx("p", { className: "text-muted-foreground", children: description }), _jsxs("p", { className: "text-muted-foreground", children: ["Affects: ", prevalence] })] }) })] }, type));
                    })] })] }));
}
/**
 * Smart Palette Generator that applies colors to multiple roles
 */
function SmartPaletteGenerator({ baseColor, onApplyPalette, onSelectSingleColor, }) {
    const [harmony, setHarmony] = React.useState('complementary');
    const [previewMapping, setPreviewMapping] = React.useState(false);
    const hex = baseColor.startsWith('#') ? baseColor : hslStringToHex(baseColor);
    const palette = generateHarmoniousPalette(hex, harmony, 5);
    const harmonies = [
        'complementary',
        'analogous',
        'triadic',
        'tetradic',
        'split-complementary',
        'monochromatic',
    ];
    const handleApplyAll = () => {
        const newColors = {};
        palette.forEach((color, index) => {
            const role = COLOR_ROLE_MAPPING[index];
            if (role) {
                newColors[role.role] = hexToHSLString(color);
            }
        });
        onApplyPalette(newColors);
        setPreviewMapping(false);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex gap-2 flex-wrap", role: "radiogroup", "aria-label": "Color harmony type", children: harmonies.map((h) => (_jsx("button", { onClick: () => setHarmony(h), className: cn('px-2 py-1 text-xs rounded-md capitalize transition-colors', 'focus:outline-none focus:ring-2 focus:ring-ring', harmony === h
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'), role: "radio", "aria-checked": harmony === h, children: h.replace('-', ' ') }, h))) }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex gap-2", children: palette.map((color, i) => (_jsxs("div", { className: "flex-1 text-center", children: [_jsx("button", { onClick: () => onSelectSingleColor?.(hexToHSLString(color)), className: "w-full aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring", style: { backgroundColor: color }, title: `Click to set as primary: ${color}`, "aria-label": `Select color ${color} as primary` }), previewMapping && COLOR_ROLE_MAPPING[i] && (_jsxs("span", { className: "text-[10px] text-muted-foreground mt-1 block", children: ["\u2192 ", COLOR_ROLE_MAPPING[i].label] }))] }, i))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setPreviewMapping(!previewMapping), className: "text-xs text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-ring rounded", children: previewMapping ? 'Hide mapping' : 'Preview role mapping' }), _jsx("button", { onClick: handleApplyAll, className: "text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring", children: "Apply All Colors" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Click individual colors to set as primary, or \"Apply All\" to map entire palette." })] }));
}
// ============================================================================
// Main Component
// ============================================================================
export function ThemeCustomizer({ className, onThemeChange, showPresets = true, showColors = true, showTypography = true, showAccessibility = true, showExport = true, compact = false, persistTheme = true, storageKey = 'clarity-theme-customizer', }) {
    const { theme, setTheme, mode, toggleMode, resolvedTheme, setPreset, availablePresets, } = useTheme();
    const [activeTab, setActiveTab] = React.useState('presets');
    const prefersReducedMotion = useReducedMotion();
    // Persistent state
    const [persistentState, setPersistentState] = useLocalStorage(storageKey, null);
    // Local state
    const [customColors, setCustomColors] = React.useState(persistentState?.customColors || {});
    const [typography, setTypography] = React.useState(persistentState?.typography || {
        fontFamily: 'system',
        sizeScale: 'default',
    });
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    // Restore persistent state on mount
    React.useEffect(() => {
        if (persistTheme && persistentState) {
            if (persistentState.preset) {
                setPreset(persistentState.preset);
            }
            if (persistentState.customColors &&
                Object.keys(persistentState.customColors).length > 0) {
                setCustomColors(persistentState.customColors);
            }
            if (persistentState.typography) {
                setTypography(persistentState.typography);
                applyTypographyToDocument(persistentState.typography);
            }
        }
    }, []); // Only on mount
    // Determine current preset - check customTheme first, then preset property
    const getCurrentPreset = () => {
        if (theme.preset)
            return theme.preset;
        if (theme.customTheme?.name) {
            const presetNames = Object.keys(modernThemes);
            const matchingPreset = presetNames.find((p) => p === theme.customTheme?.name);
            if (matchingPreset)
                return matchingPreset;
        }
        return mode === 'dark' ? 'default-dark' : 'default';
    };
    const currentPreset = getCurrentPreset();
    const categories = getThemesByCategory();
    // Save state when it changes
    const saveState = React.useCallback((preset, colors, typo) => {
        if (persistTheme) {
            setPersistentState({ preset, customColors: colors, typography: typo });
        }
    }, [persistTheme, setPersistentState]);
    // Apply typography to document
    const applyTypographyToDocument = (typo) => {
        const root = document.documentElement;
        const fontConfig = FONT_FAMILIES.find((f) => f.id === typo.fontFamily);
        const sizeConfig = SIZE_SCALES.find((s) => s.id === typo.sizeScale);
        if (fontConfig) {
            root.style.setProperty('--font-sans', fontConfig.family);
        }
        if (sizeConfig) {
            root.style.setProperty('--font-size-multiplier', String(sizeConfig.multiplier));
        }
    };
    // Handle preset selection with transition animation
    const handlePresetSelect = (name) => {
        if (!prefersReducedMotion) {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 300);
        }
        setPreset(name);
        setCustomColors({});
        saveState(name, {}, typography);
    };
    // Handle mode toggle - auto-select matching dark/light variant
    const handleModeToggle = (newMode) => {
        setTheme({ mode: newMode });
        // Auto-select matching theme variant
        if (newMode !== 'system') {
            const baseName = currentPreset.replace('-dark', '');
            const targetPreset = newMode === 'dark' ? `${baseName}-dark` : baseName;
            if (targetPreset in modernThemes) {
                setPreset(targetPreset);
                saveState(targetPreset, customColors, typography);
            }
        }
    };
    // Handle color customization
    const handleColorChange = (key, value) => {
        const newColors = { ...customColors, [key]: value };
        setCustomColors(newColors);
        const customTheme = createTheme({
            extends: currentPreset,
            colors: newColors,
        });
        setTheme({ customTheme });
        onThemeChange?.(customTheme);
        saveState(currentPreset, newColors, typography);
    };
    // Handle applying multiple colors from palette
    const handleApplyPalette = (colors) => {
        const newColors = { ...customColors, ...colors };
        setCustomColors(newColors);
        const customTheme = createTheme({
            extends: currentPreset,
            colors: newColors,
        });
        setTheme({ customTheme });
        onThemeChange?.(customTheme);
        saveState(currentPreset, newColors, typography);
    };
    // Handle typography changes
    const handleFontFamilyChange = (fontFamily) => {
        const newTypography = { ...typography, fontFamily };
        setTypography(newTypography);
        applyTypographyToDocument(newTypography);
        saveState(currentPreset, customColors, newTypography);
    };
    const handleSizeScaleChange = (sizeScale) => {
        const newTypography = { ...typography, sizeScale };
        setTypography(newTypography);
        applyTypographyToDocument(newTypography);
        saveState(currentPreset, customColors, newTypography);
    };
    // Reset all customizations
    const handleReset = () => {
        setCustomColors({});
        setTypography({ fontFamily: 'system', sizeScale: 'default' });
        applyTypographyToDocument({ fontFamily: 'system', sizeScale: 'default' });
        setPreset(currentPreset);
        if (persistTheme) {
            setPersistentState(null);
        }
    };
    // Get current colors
    const currentColors = resolvedTheme?.colors || modernThemes['default'].colors;
    // Tab navigation with keyboard
    const handleTabKeyDown = (e, tabId) => {
        const tabIds = tabs.map((t) => t.id);
        const currentIndex = tabIds.indexOf(tabId);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % tabIds.length;
            setActiveTab(tabIds[nextIndex]);
        }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
            setActiveTab(tabIds[prevIndex]);
        }
    };
    const tabs = [
        { id: 'presets', label: 'Presets', show: showPresets },
        { id: 'colors', label: 'Colors', show: showColors },
        { id: 'typography', label: 'Typography', show: showTypography },
        { id: 'accessibility', label: 'Accessibility', show: showAccessibility },
        { id: 'export', label: 'Export', show: showExport },
    ].filter((t) => t.show);
    // Theme transition class
    const transitionClass = isTransitioning && !prefersReducedMotion
        ? 'transition-colors duration-300 ease-in-out'
        : '';
    return (_jsxs("div", { className: cn('bg-card rounded-xl border border-border shadow-lg overflow-hidden', compact ? 'max-w-md' : 'max-w-2xl', transitionClass, className), role: "region", "aria-label": "Theme Customizer", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: [_jsx("h3", { className: "font-semibold text-foreground", children: "Theme Customizer" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customize the look and feel of your chat" })] }), _jsx("div", { className: "flex border-b border-border overflow-x-auto", role: "tablist", "aria-label": "Theme customization sections", children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), onKeyDown: (e) => handleTabKeyDown(e, tab.id), className: cn('px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap', 'border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring', activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'), role: "tab", "aria-selected": activeTab === tab.id, "aria-controls": `tabpanel-${tab.id}`, id: `tab-${tab.id}`, tabIndex: activeTab === tab.id ? 0 : -1, children: tab.label }, tab.id))) }), _jsx("div", { className: "p-4", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'presets' && (_jsxs(motion.div, { id: "tabpanel-presets", role: "tabpanel", "aria-labelledby": "tab-presets", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: prefersReducedMotion ? 0 : 0.2 }, className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-medium text-foreground", id: "mode-label", children: "Mode:" }), _jsx("div", { className: "flex rounded-lg bg-muted p-1", role: "radiogroup", "aria-labelledby": "mode-label", children: ['light', 'dark', 'system'].map((m) => (_jsx("button", { onClick: () => handleModeToggle(m), className: cn('px-3 py-1.5 text-sm rounded-md capitalize transition-colors', 'focus:outline-none focus:ring-2 focus:ring-ring', theme.mode === m
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'), role: "radio", "aria-checked": theme.mode === m, children: m }, m))) }), theme.mode === 'system' && (_jsxs("span", { className: "text-xs text-muted-foreground", "aria-live": "polite", children: ["(using ", mode, ")"] }))] }), Object.entries(categories).map(([category, themeNames]) => (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: category }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", role: "listbox", "aria-label": `${category} themes`, children: themeNames
                                                .filter((name) => mode === 'dark'
                                                ? name.endsWith('-dark')
                                                : !name.endsWith('-dark'))
                                                .map((name) => (_jsx(ThemePreviewCard, { name: name, isSelected: currentPreset === name, onClick: () => handlePresetSelect(name) }, name))) })] }, category)))] }, "presets")), activeTab === 'colors' && (_jsxs(motion.div, { id: "tabpanel-colors", role: "tabpanel", "aria-labelledby": "tab-colors", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: prefersReducedMotion ? 0 : 0.2 }, className: "space-y-6", children: [_jsxs("fieldset", { className: "space-y-3", children: [_jsx("legend", { className: "text-sm font-semibold text-foreground", children: "Brand Colors" }), _jsx(ColorPicker, { label: "Primary", value: currentColors.primary, onChange: (v) => handleColorChange('primary', v), id: "color-primary" }), _jsx(ColorPicker, { label: "Secondary", value: currentColors.secondary, onChange: (v) => handleColorChange('secondary', v), id: "color-secondary" }), _jsx(ColorPicker, { label: "Accent", value: currentColors.accent, onChange: (v) => handleColorChange('accent', v), id: "color-accent" })] }), _jsxs("fieldset", { className: "space-y-3", children: [_jsx("legend", { className: "text-sm font-semibold text-foreground", children: "Background" }), _jsx(ColorPicker, { label: "Background", value: currentColors.background, onChange: (v) => handleColorChange('background', v), id: "color-background" }), _jsx(ColorPicker, { label: "Foreground", value: currentColors.foreground, onChange: (v) => handleColorChange('foreground', v), id: "color-foreground" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Palette Generator" }), _jsx(SmartPaletteGenerator, { baseColor: currentColors.primary, onApplyPalette: handleApplyPalette, onSelectSingleColor: (c) => handleColorChange('primary', c) })] }), _jsx("button", { onClick: handleReset, className: "text-sm text-muted-foreground hover:text-foreground underline focus:outline-none focus:ring-2 focus:ring-ring rounded", children: "Reset all customizations" })] }, "colors")), activeTab === 'typography' && (_jsxs(motion.div, { id: "tabpanel-typography", role: "tabpanel", "aria-labelledby": "tab-typography", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: prefersReducedMotion ? 0 : 0.2 }, className: "space-y-6", children: [_jsxs("fieldset", { className: "space-y-3", children: [_jsx("legend", { className: "text-sm font-semibold text-foreground", children: "Font Family" }), _jsx("div", { className: "grid grid-cols-2 gap-2", role: "radiogroup", "aria-label": "Select font family", children: FONT_FAMILIES.map((font) => (_jsx("button", { onClick: () => handleFontFamilyChange(font.id), className: cn('px-3 py-2 text-sm rounded-lg border transition-colors text-left', 'focus:outline-none focus:ring-2 focus:ring-ring', typography.fontFamily === font.id
                                                    ? 'border-primary bg-primary/10 text-foreground'
                                                    : 'border-border bg-background hover:border-primary/50'), style: { fontFamily: font.family }, role: "radio", "aria-checked": typography.fontFamily === font.id, children: font.label }, font.id))) })] }), _jsxs("fieldset", { className: "space-y-3", children: [_jsx("legend", { className: "text-sm font-semibold text-foreground", children: "Size Scale" }), _jsx("div", { className: "flex gap-2", role: "radiogroup", "aria-label": "Select size scale", children: SIZE_SCALES.map((size) => (_jsx("button", { onClick: () => handleSizeScaleChange(size.id), className: cn('flex-1 px-3 py-2 text-sm rounded-lg border transition-colors capitalize', 'focus:outline-none focus:ring-2 focus:ring-ring', typography.sizeScale === size.id
                                                    ? 'border-primary bg-primary/10 text-foreground'
                                                    : 'border-border bg-background hover:border-primary/50'), role: "radio", "aria-checked": typography.sizeScale === size.id, children: size.label }, size.id))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Live Preview" }), _jsxs("div", { className: "p-4 rounded-lg border border-border bg-muted/30 space-y-2", style: {
                                                fontFamily: FONT_FAMILIES.find((f) => f.id === typography.fontFamily)?.family,
                                            }, children: [_jsx("p", { className: "text-muted-foreground", style: {
                                                        fontSize: `calc(0.75rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Extra Small Text" }), _jsx("p", { className: "text-muted-foreground", style: {
                                                        fontSize: `calc(0.875rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Small Body Text" }), _jsx("p", { className: "text-foreground", style: {
                                                        fontSize: `calc(1rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Base Body Text" }), _jsx("p", { className: "text-foreground font-medium", style: {
                                                        fontSize: `calc(1.125rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Large Text" }), _jsx("p", { className: "text-foreground font-semibold", style: {
                                                        fontSize: `calc(1.25rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Heading XL" }), _jsx("p", { className: "text-foreground font-bold", style: {
                                                        fontSize: `calc(1.5rem * ${SIZE_SCALES.find((s) => s.id === typography.sizeScale)?.multiplier})`,
                                                    }, children: "Heading 2XL" })] })] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Current:", ' ', FONT_FAMILIES.find((f) => f.id === typography.fontFamily)
                                            ?.label, ' ', "font, ", typography.sizeScale, " size"] })] }, "typography")), activeTab === 'accessibility' && (_jsxs(motion.div, { id: "tabpanel-accessibility", role: "tabpanel", "aria-labelledby": "tab-accessibility", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: prefersReducedMotion ? 0 : 0.2 }, className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Contrast Ratios" }), _jsxs("div", { className: "space-y-2 p-3 rounded-lg bg-muted/50", children: [_jsx(ContrastBadge, { foreground: currentColors.foreground, background: currentColors.background, label: "Text/Background" }), _jsx(ContrastBadge, { foreground: currentColors.primaryForeground, background: currentColors.primary, label: "Primary Button" }), _jsx(ContrastBadge, { foreground: currentColors.mutedForeground, background: currentColors.muted, label: "Muted Text" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-foreground", children: ["Color Blindness Simulation", _jsx("span", { className: "text-xs font-normal text-muted-foreground ml-2", children: "(All 8 types)" })] }), _jsx(ColorBlindnessPanelFull, { colors: currentColors })] }), _jsxs("div", { className: "p-3 rounded-lg bg-info/10 border border-info/20", children: [_jsx("p", { className: "text-sm text-foreground", children: _jsx("strong", { children: "WCAG Guidelines:" }) }), _jsxs("ul", { className: "text-sm text-muted-foreground mt-1 space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "AA:" }), " 4.5:1 for normal text, 3:1 for large text"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "AAA:" }), " 7:1 for normal text, 4.5:1 for large text"] }), _jsx("li", { children: "\u2022 Color blindness affects ~8% of males, ~0.5% of females" })] })] })] }, "accessibility")), activeTab === 'export' && (_jsx(motion.div, { id: "tabpanel-export", role: "tabpanel", "aria-labelledby": "tab-export", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: prefersReducedMotion ? 0 : 0.2 }, className: "space-y-4", children: _jsx(EnhancedExportPanel, { theme: resolvedTheme, typography: typography }) }, "export"))] }) })] }));
}
/**
 * Enhanced Export Panel with complete theme output
 */
function EnhancedExportPanel({ theme, typography, }) {
    const [exportFormat, setExportFormat] = React.useState('css');
    const [includeTypography, setIncludeTypography] = React.useState(true);
    const [includeBorders, setIncludeBorders] = React.useState(true);
    const [includeShadows, setIncludeShadows] = React.useState(true);
    const [copied, setCopied] = React.useState(false);
    if (!theme)
        return null;
    const generateCSS = () => {
        const lines = [':root {', '  /* Colors */'];
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            lines.push(`  --${cssKey}: ${value};`);
        });
        if (includeBorders) {
            lines.push('', '  /* Borders */');
            lines.push(`  --radius-sm: ${theme.borders.radius.sm};`);
            lines.push(`  --radius-md: ${theme.borders.radius.md};`);
            lines.push(`  --radius-lg: ${theme.borders.radius.lg};`);
            lines.push(`  --radius-xl: ${theme.borders.radius.xl};`);
            lines.push(`  --radius-full: ${theme.borders.radius.full};`);
        }
        if (includeTypography) {
            lines.push('', '  /* Typography */');
            const fontConfig = FONT_FAMILIES.find((f) => f.id === typography.fontFamily);
            const sizeConfig = SIZE_SCALES.find((s) => s.id === typography.sizeScale);
            lines.push(`  --font-sans: ${fontConfig?.family || 'system-ui, sans-serif'};`);
            lines.push(`  --font-size-base: ${sizeConfig?.multiplier || 1}rem;`);
            lines.push(`  --font-size-sm: calc(0.875rem * ${sizeConfig?.multiplier || 1});`);
            lines.push(`  --font-size-lg: calc(1.125rem * ${sizeConfig?.multiplier || 1});`);
        }
        if (includeShadows) {
            lines.push('', '  /* Shadows */');
            lines.push(`  --shadow-sm: ${theme.shadows.sm};`);
            lines.push(`  --shadow-md: ${theme.shadows.md};`);
            lines.push(`  --shadow-lg: ${theme.shadows.lg};`);
        }
        lines.push('}');
        return lines.join('\n');
    };
    const generateSCSS = () => {
        const lines = ['// Theme Variables', ''];
        lines.push('// Colors');
        Object.entries(theme.colors).forEach(([key, value]) => {
            const scssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            lines.push(`$${scssKey}: hsl(${value});`);
        });
        if (includeBorders) {
            lines.push('', '// Borders');
            lines.push(`$radius-sm: ${theme.borders.radius.sm};`);
            lines.push(`$radius-md: ${theme.borders.radius.md};`);
            lines.push(`$radius-lg: ${theme.borders.radius.lg};`);
        }
        if (includeTypography) {
            lines.push('', '// Typography');
            const fontConfig = FONT_FAMILIES.find((f) => f.id === typography.fontFamily);
            lines.push(`$font-sans: ${fontConfig?.family || 'system-ui, sans-serif'};`);
        }
        return lines.join('\n');
    };
    const generateTailwind = () => {
        const config = {
            theme: {
                extend: {
                    colors: {},
                    borderRadius: {},
                    fontFamily: {},
                    boxShadow: {},
                },
            },
        };
        Object.entries(theme.colors).forEach(([key, value]) => {
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            config.theme.extend.colors[kebabKey] = `hsl(${value})`;
        });
        if (includeBorders) {
            ;
            config.theme.extend.borderRadius = {
                sm: theme.borders.radius.sm,
                md: theme.borders.radius.md,
                lg: theme.borders.radius.lg,
                xl: theme.borders.radius.xl,
            };
        }
        if (includeTypography) {
            const fontConfig = FONT_FAMILIES.find((f) => f.id === typography.fontFamily);
            config.theme.extend.fontFamily = {
                sans: fontConfig?.family.split(', ') || ['system-ui', 'sans-serif'],
            };
        }
        if (includeShadows) {
            ;
            config.theme.extend.boxShadow = {
                sm: theme.shadows.sm,
                md: theme.shadows.md,
                lg: theme.shadows.lg,
            };
        }
        return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
    };
    const generateFigmaTokens = () => {
        const tokens = {
            color: {},
            borderRadius: {},
            typography: {},
            shadow: {},
        };
        Object.entries(theme.colors).forEach(([key, value]) => {
            const hex = hslStringToHex(value);
            tokens.color[key] = {
                value: hex,
                type: 'color',
            };
        });
        if (includeBorders) {
            ;
            tokens.borderRadius = {
                sm: { value: theme.borders.radius.sm, type: 'borderRadius' },
                md: { value: theme.borders.radius.md, type: 'borderRadius' },
                lg: { value: theme.borders.radius.lg, type: 'borderRadius' },
            };
        }
        if (includeTypography) {
            const fontConfig = FONT_FAMILIES.find((f) => f.id === typography.fontFamily);
            tokens.typography = {
                fontFamily: { value: fontConfig?.family, type: 'fontFamily' },
                sizeScale: { value: typography.sizeScale, type: 'other' },
            };
        }
        return JSON.stringify(tokens, null, 2);
    };
    const getExportContent = () => {
        switch (exportFormat) {
            case 'json':
                return JSON.stringify({
                    ...theme,
                    _typography: typography,
                }, null, 2);
            case 'css':
                return generateCSS();
            case 'scss':
                return generateSCSS();
            case 'tailwind':
                return generateTailwind();
            case 'figma':
                return generateFigmaTokens();
        }
    };
    const handleCopy = async () => {
        await navigator.clipboard.writeText(getExportContent());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleDownload = () => {
        const content = getExportContent();
        const extensions = {
            json: 'json',
            css: 'css',
            scss: 'scss',
            tailwind: 'js',
            figma: 'tokens.json',
        };
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clarity-theme.${extensions[exportFormat]}`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Export Format" }), _jsx("div", { className: "flex gap-2 flex-wrap", role: "radiogroup", "aria-label": "Export format", children: ['css', 'scss', 'tailwind', 'json', 'figma'].map((format) => (_jsx("button", { onClick: () => setExportFormat(format), className: cn('px-3 py-1.5 text-sm rounded-md capitalize transition-colors', 'focus:outline-none focus:ring-2 focus:ring-ring', exportFormat === format
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'), role: "radio", "aria-checked": exportFormat === format, children: format === 'figma' ? 'Figma Tokens' : format.toUpperCase() }, format))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Include" }), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: includeTypography, onChange: (e) => setIncludeTypography(e.target.checked), className: "rounded border-border focus:ring-2 focus:ring-ring" }), "Typography"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: includeBorders, onChange: (e) => setIncludeBorders(e.target.checked), className: "rounded border-border focus:ring-2 focus:ring-ring" }), "Borders"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: includeShadows, onChange: (e) => setIncludeShadows(e.target.checked), className: "rounded border-border focus:ring-2 focus:ring-ring" }), "Shadows"] })] })] }), _jsx("div", { className: "relative", children: _jsx("pre", { className: "p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-xs font-mono text-foreground max-h-64", "aria-label": "Export preview", children: getExportContent() }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleCopy, className: cn('flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors', 'border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring'), "aria-live": "polite", children: copied ? '✓ Copied!' : 'Copy to Clipboard' }), _jsx("button", { onClick: handleDownload, className: "flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring", children: "Download File" })] })] }));
}
export default ThemeCustomizer;
//# sourceMappingURL=ThemeCustomizer.js.map