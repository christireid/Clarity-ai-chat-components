#!/usr/bin/env node
/**
 * Clarity Chat Dev Tools CLI
 *
 * Standalone command-line interface for developer utilities including
 * validation, debugging, and configuration checks.
 */
import { Command } from 'commander';
import { version } from '../../package.json';
import { validateCommand } from './commands/validate';
import { checkCommand } from './commands/check';
import { debugCommand } from './commands/debug';
const program = new Command();
program
    .name('clarity-dev')
    .description('Developer tools CLI for Clarity Chat applications')
    .version(version);
// Register commands
program.addCommand(validateCommand);
program.addCommand(checkCommand);
program.addCommand(debugCommand);
// Parse and execute
program.parse(process.argv);
// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map