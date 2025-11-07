/**
 * Simple logging utility
 */
import chalk from 'chalk';
export function getLogger(namespace) {
    const prefix = chalk.gray(`[${namespace}]`);
    return {
        info: (message, ...args) => {
            console.log(prefix, chalk.blue('ℹ'), message, ...args);
        },
        warn: (message, ...args) => {
            console.warn(prefix, chalk.yellow('⚠'), message, ...args);
        },
        error: (message, ...args) => {
            const errorMessage = message instanceof Error ? message.message : message;
            console.error(prefix, chalk.red('✖'), errorMessage, ...args);
            if (message instanceof Error && message.stack) {
                console.error(chalk.gray(message.stack));
            }
        },
        success: (message, ...args) => {
            console.log(prefix, chalk.green('✔'), message, ...args);
        },
        debug: (message, ...args) => {
            if (process.env.DEBUG) {
                console.log(prefix, chalk.magenta('🐛'), message, ...args);
            }
        },
    };
}
//# sourceMappingURL=logger.js.map