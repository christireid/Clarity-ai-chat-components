#!/usr/bin/env node
import { logger } from '@clarity-chat/utils/logger';

/**
 * Clarity Chat Codemods CLI
 * Run automated code transformations
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { runTransform } from './runner.js'
import { availableTransforms } from './transforms/index.js'

const program = new Command()

program
  .name('clarity-codemod')
  .description('Automated code transformations for Clarity Chat upgrades')
  .version('0.1.0')

program
  .command('list')
  .description('List available codemods')
  .action(() => {
    logger.debug(chalk.bold.cyan('\n📝 Available Codemods\n'))

    availableTransforms.forEach((transform) => {
      logger.debug(chalk.yellow(`  ${transform.name}`))
      logger.debug(chalk.gray(`  ${transform.description}`))
      logger.debug(chalk.gray(`  Version: ${transform.from} → ${transform.to}`))
      logger.debug()
    })
  })

program
  .command('run <transform> <path>')
  .description('Run a codemod transformation')
  .option('-d, --dry', 'Dry run (no files will be changed)')
  .option('-p, --print', 'Print transformed files')
  .option('-v, --verbose', 'Show verbose output')
  .option('--parser <parser>', 'Parser to use (babel, tsx, ts)', 'tsx')
  .action(async (transformName, path, options) => {
    logger.debug(chalk.bold.cyan('\n🔧 Running Codemod\n'))

    const transform = availableTransforms.find((t) => t.name === transformName)
    if (!transform) {
      logger.error(chalk.red(`❌ Transform "${transformName}" not found`))
      logger.debug(
        chalk.gray('\nRun') +
          chalk.cyan(' clarity-codemod list ') +
          chalk.gray('to see available transforms')
      )
      process.exit(1)
    }

    logger.debug(chalk.white(`Transform: ${chalk.cyan(transform.name)}`))
    logger.debug(
      chalk.white(`Description: ${chalk.gray(transform.description)}`)
    )
    logger.debug(chalk.white(`Path: ${chalk.gray(path)}`))
    if (options.dry) {
      logger.debug(chalk.yellow('⚠️  Dry run mode - no files will be modified'))
    }
    logger.debug()

    const spinner = ora('Transforming files...').start()

    try {
      const result = await runTransform(transform.name, path, {
        dry: options.dry,
        print: options.print,
        verbose: options.verbose,
        parser: options.parser,
      })

      spinner.succeed('Transformation complete')

      logger.debug()
      logger.debug(chalk.bold.white('Results:'))
      logger.debug(chalk.green(`  ✓ Transformed: ${result.ok}`))
      logger.debug(chalk.gray(`  - No change: ${result.nochange}`))
      logger.debug(chalk.yellow(`  ⚠ Skipped: ${result.skip}`))
      if (result.error > 0) {
        logger.debug(chalk.red(`  ✗ Errors: ${result.error}`))
      }
      logger.debug(chalk.gray(`  ⏱️  Time: ${result.timeElapsed}`))
      logger.debug()

      if (options.dry) {
        logger.debug(chalk.yellow('💡 Run without --dry to apply changes'))
      } else {
        logger.debug(chalk.green.bold('✓ Files have been updated!'))
      }
      logger.debug()
    } catch (error) {
      spinner.fail('Transformation failed')
      logger.error(
        chalk.red(
          `\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      )
      process.exit(1)
    }
  })

program
  .command('migrate <from-version> <to-version> <path>')
  .description('Automatically migrate code between versions')
  .option('-d, --dry', 'Dry run (no files will be changed)')
  .option('-v, --verbose', 'Show verbose output')
  .action(async (fromVersion, toVersion, path, options) => {
    logger.debug(chalk.bold.cyan('\n🚀 Running Migration\n'))
    logger.debug(chalk.white(`From: v${fromVersion}`))
    logger.debug(chalk.white(`To: v${toVersion}`))
    logger.debug(chalk.white(`Path: ${path}`))
    logger.debug()

    // Find transforms needed for this migration
    const transforms = availableTransforms.filter((t) => {
      const from = parseFloat(t.from.replace('v', ''))
      const to = parseFloat(t.to.replace('v', ''))
      const fromVer = parseFloat(fromVersion)
      const toVer = parseFloat(toVersion)

      return from >= fromVer && to <= toVer
    })

    if (transforms.length === 0) {
      logger.debug(chalk.yellow('No transforms needed for this migration'))
      return
    }

    logger.debug(
      chalk.white(`Found ${transforms.length} transform(s) to apply:\n`)
    )
    transforms.forEach((t, i) => {
      logger.debug(
        chalk.cyan(`  ${i + 1}. ${t.name}`) +
          chalk.gray(` (${t.from} → ${t.to})`)
      )
    })
    logger.debug()

    for (const transform of transforms) {
      logger.debug(chalk.bold(`Running: ${transform.name}`))

      try {
        const result = await runTransform(transform.name, path, {
          dry: options.dry,
          verbose: options.verbose,
        })

        logger.debug(chalk.green(`  ✓ ${result.ok} files transformed`))
      } catch (error) {
        logger.error(
          chalk.red(
            `  ✗ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        )
      }
      logger.debug()
    }

    if (options.dry) {
      logger.debug(chalk.yellow('💡 Run without --dry to apply changes'))
    } else {
      logger.debug(chalk.green.bold('✓ Migration complete!'))
    }
    logger.debug()
  })

program.parse()
