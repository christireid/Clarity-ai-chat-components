#!/usr/bin/env node
/**
 * Clarity Chat Codemods CLI
 * Run automated code transformations
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { runTransform } from './runner.js';
import { availableTransforms } from './transforms/index.js';
const program = new Command();
program
    .name('clarity-codemod')
    .description('Automated code transformations for Clarity Chat upgrades')
    .version('0.1.0');
program
    .command('list')
    .description('List available codemods')
    .action(() => {
    console.log(chalk.bold.cyan('\n📝 Available Codemods\n'));
    availableTransforms.forEach((transform) => {
        console.log(chalk.yellow(`  ${transform.name}`));
        console.log(chalk.gray(`  ${transform.description}`));
        console.log(chalk.gray(`  Version: ${transform.from} → ${transform.to}`));
        console.log();
    });
});
program
    .command('run <transform> <path>')
    .description('Run a codemod transformation')
    .option('-d, --dry', 'Dry run (no files will be changed)')
    .option('-p, --print', 'Print transformed files')
    .option('-v, --verbose', 'Show verbose output')
    .option('--parser <parser>', 'Parser to use (babel, tsx, ts)', 'tsx')
    .action(async (transformName, path, options) => {
    console.log(chalk.bold.cyan('\n🔧 Running Codemod\n'));
    const transform = availableTransforms.find((t) => t.name === transformName);
    if (!transform) {
        console.error(chalk.red(`❌ Transform "${transformName}" not found`));
        console.log(chalk.gray('\nRun') +
            chalk.cyan(' clarity-codemod list ') +
            chalk.gray('to see available transforms'));
        process.exit(1);
    }
    console.log(chalk.white(`Transform: ${chalk.cyan(transform.name)}`));
    console.log(chalk.white(`Description: ${chalk.gray(transform.description)}`));
    console.log(chalk.white(`Path: ${chalk.gray(path)}`));
    if (options.dry) {
        console.log(chalk.yellow('⚠️  Dry run mode - no files will be modified'));
    }
    console.log();
    const spinner = ora('Transforming files...').start();
    try {
        const result = await runTransform(transform.name, path, {
            dry: options.dry,
            print: options.print,
            verbose: options.verbose,
            parser: options.parser,
        });
        spinner.succeed('Transformation complete');
        console.log();
        console.log(chalk.bold.white('Results:'));
        console.log(chalk.green(`  ✓ Transformed: ${result.ok}`));
        console.log(chalk.gray(`  - No change: ${result.nochange}`));
        console.log(chalk.yellow(`  ⚠ Skipped: ${result.skip}`));
        if (result.error > 0) {
            console.log(chalk.red(`  ✗ Errors: ${result.error}`));
        }
        console.log(chalk.gray(`  ⏱️  Time: ${result.timeElapsed}`));
        console.log();
        if (options.dry) {
            console.log(chalk.yellow('💡 Run without --dry to apply changes'));
        }
        else {
            console.log(chalk.green.bold('✓ Files have been updated!'));
        }
        console.log();
    }
    catch (error) {
        spinner.fail('Transformation failed');
        console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
    }
});
program
    .command('migrate <from-version> <to-version> <path>')
    .description('Automatically migrate code between versions')
    .option('-d, --dry', 'Dry run (no files will be changed)')
    .option('-v, --verbose', 'Show verbose output')
    .action(async (fromVersion, toVersion, path, options) => {
    console.log(chalk.bold.cyan('\n🚀 Running Migration\n'));
    console.log(chalk.white(`From: v${fromVersion}`));
    console.log(chalk.white(`To: v${toVersion}`));
    console.log(chalk.white(`Path: ${path}`));
    console.log();
    // Find transforms needed for this migration
    const transforms = availableTransforms.filter((t) => {
        const from = parseFloat(t.from.replace('v', ''));
        const to = parseFloat(t.to.replace('v', ''));
        const fromVer = parseFloat(fromVersion);
        const toVer = parseFloat(toVersion);
        return from >= fromVer && to <= toVer;
    });
    if (transforms.length === 0) {
        console.log(chalk.yellow('No transforms needed for this migration'));
        return;
    }
    console.log(chalk.white(`Found ${transforms.length} transform(s) to apply:\n`));
    transforms.forEach((t, i) => {
        console.log(chalk.cyan(`  ${i + 1}. ${t.name}`) +
            chalk.gray(` (${t.from} → ${t.to})`));
    });
    console.log();
    for (const transform of transforms) {
        console.log(chalk.bold(`Running: ${transform.name}`));
        try {
            const result = await runTransform(transform.name, path, {
                dry: options.dry,
                verbose: options.verbose,
            });
            console.log(chalk.green(`  ✓ ${result.ok} files transformed`));
        }
        catch (error) {
            console.error(chalk.red(`  ✗ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
        console.log();
    }
    if (options.dry) {
        console.log(chalk.yellow('💡 Run without --dry to apply changes'));
    }
    else {
        console.log(chalk.green.bold('✓ Migration complete!'));
    }
    console.log();
});
program.parse();
//# sourceMappingURL=cli.js.map