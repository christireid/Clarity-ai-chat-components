/**
 * Validate command
 *
 * Validates environment variables, API keys, and configuration
 */
import { Command } from 'commander';
import { validateEnv, validateAPIKey, validateChatConfig, printValidationResults } from '../../validate/config-validator';
import { successBox, errorBox, infoBox } from '../../ui/box';
import chalk from 'chalk';
export const validateCommand = new Command('validate')
    .description('Validate configuration and environment')
    .option('-e, --env', 'Validate environment variables')
    .option('-k, --api-key <provider>', 'Validate specific API key (openai, anthropic, google)')
    .option('-c, --config <json>', 'Validate chat configuration JSON')
    .option('-a, --all', 'Run all validations')
    .option('--json', 'Output results as JSON')
    .action((options) => {
    let hasErrors = false;
    // If no specific option, default to --all
    if (!options.env && !options.apiKey && !options.config && !options.all) {
        options.all = true;
    }
    if (options.all || options.env) {
        console.debug();
        console.debug(chalk.bold.blue('Validating environment variables...'));
        console.debug();
        const result = validateEnv();
        if (options.json) {
            console.debug(JSON.stringify(result, null, 2));
        }
        else {
            printValidationResults(result, 'Environment Variables');
        }
        if (!result.valid)
            hasErrors = true;
    }
    if (options.apiKey) {
        console.debug();
        console.debug(chalk.bold.blue(`Validating ${options.apiKey} API key...`));
        console.debug();
        const provider = options.apiKey.toLowerCase();
        if (!['openai', 'anthropic', 'google'].includes(provider)) {
            console.debug(errorBox(`Invalid provider: ${options.apiKey}. Use: openai, anthropic, or google`));
            process.exit(1);
        }
        const result = validateAPIKey(provider);
        if (options.json) {
            console.debug(JSON.stringify(result, null, 2));
        }
        else {
            printValidationResults(result, `${options.apiKey.toUpperCase()} API Key`);
        }
        if (!result.valid)
            hasErrors = true;
    }
    if (options.config) {
        console.debug();
        console.debug(chalk.bold.blue('Validating chat configuration...'));
        console.debug();
        try {
            const config = JSON.parse(options.config);
            const result = validateChatConfig(config);
            if (options.json) {
                console.debug(JSON.stringify(result, null, 2));
            }
            else {
                printValidationResults(result, 'Chat Configuration');
            }
            if (!result.valid)
                hasErrors = true;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.debug(errorBox(`Failed to parse configuration JSON: ${message}`));
            hasErrors = true;
        }
    }
    // Summary
    if (!options.json) {
        console.debug();
        if (hasErrors) {
            console.debug(errorBox('Validation completed with errors', 'Summary'));
        }
        else {
            console.debug(successBox('All validations passed!', 'Summary'));
        }
        console.debug();
    }
    process.exit(hasErrors ? 1 : 0);
});
//# sourceMappingURL=validate.js.map