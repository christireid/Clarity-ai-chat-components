/**
 * Beautiful message utilities
 * Creates eye-catching success, error, warning, and info messages
 */
import pc from 'picocolors';
import boxen from 'boxen';
import gradient from 'gradient-string';
/**
 * Create a beautiful success message
 */
export function successMessage(message, options = {}) {
    const { title = '✅ Success', padding = 1, margin = 1, borderColor = 'green', borderStyle = 'round', titleAlignment = 'center', } = options;
    return boxen(pc.bold(pc.green(message)), {
        padding,
        margin,
        borderStyle,
        borderColor,
        title,
        titleAlignment,
    });
}
/**
 * Create a beautiful error message
 */
export function errorMessage(message, options = {}) {
    const { title = '❌ Error', padding = 1, margin = 1, borderColor = 'red', borderStyle = 'round', titleAlignment = 'center', } = options;
    return boxen(pc.bold(pc.red(message)), {
        padding,
        margin,
        borderStyle,
        borderColor,
        title,
        titleAlignment,
    });
}
/**
 * Create a beautiful warning message
 */
export function warningMessage(message, options = {}) {
    const { title = '⚠️  Warning', padding = 1, margin = 1, borderColor = 'yellow', borderStyle = 'round', titleAlignment = 'center', } = options;
    return boxen(pc.bold(pc.yellow(message)), {
        padding,
        margin,
        borderStyle,
        borderColor,
        title,
        titleAlignment,
    });
}
/**
 * Create a beautiful info message
 */
export function infoMessage(message, options = {}) {
    const { title = 'ℹ️  Info', padding = 1, margin = 1, borderColor = 'blue', borderStyle = 'round', titleAlignment = 'center', } = options;
    return boxen(pc.bold(pc.blue(message)), {
        padding,
        margin,
        borderStyle,
        borderColor,
        title,
        titleAlignment,
    });
}
/**
 * Create a beautiful tip message
 */
export function tipMessage(message, options = {}) {
    const { title = '💡 Tip', padding = 1, margin = 1, borderColor = 'cyan', borderStyle = 'round', titleAlignment = 'center', } = options;
    return boxen(pc.cyan(message), {
        padding,
        margin,
        borderStyle,
        borderColor,
        title,
        titleAlignment,
    });
}
/**
 * Create a beautiful next steps message
 */
export function nextStepsMessage(steps) {
    const content = pc.bold(pc.white('Next steps:\n\n')) +
        steps.map((step, index) => pc.cyan(`  ${index + 1}. ${step}`)).join('\n');
    return boxen(content, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        title: '🚀 Ready to Go!',
        titleAlignment: 'center',
    });
}
/**
 * Create a beautiful feature highlight
 */
export function featureHighlight(title, description, icon = '✨') {
    const content = `${pc.bold(pc.cyan(title))}\n\n${pc.gray(description)}`;
    return boxen(content, {
        padding: 1,
        margin: { left: 2, right: 0, top: 0, bottom: 0 },
        borderStyle: 'round',
        borderColor: 'cyan',
        title: icon,
        titleAlignment: 'center',
    });
}
/**
 * Create a beautiful command example
 */
export function commandExample(command, description) {
    const content = description
        ? `${pc.gray(description)}\n\n${pc.bold(pc.cyan(`$ ${command}`))}`
        : pc.bold(pc.cyan(`$ ${command}`));
    return boxen(content, {
        padding: 1,
        margin: { left: 2, right: 0, top: 0, bottom: 0 },
        borderStyle: 'single',
        borderColor: 'gray',
    });
}
//# sourceMappingURL=messages.js.map