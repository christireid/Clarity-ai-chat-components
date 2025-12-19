import { Command } from 'commander'
import { logger } from '../utils/logger'

export const themeCommand = new Command()
  .name('theme')
  .description('Manage Clarity Chat themes')
  .command('list')
  .description('List available themes')
  .action(async () => {
    logger.info('Available themes:')
    logger.info('- default')
    logger.info('- dark')
    logger.info('- ocean')
    logger.info('- forest')
    logger.info('- midnight')
  })

themeCommand
  .command('copy')
  .description('Copy a theme to your project')
  .argument('<theme>', 'Theme name to copy')
  .action(async (theme) => {
    logger.info(`Copying theme "${theme}" to your project...`)
    logger.warn('Theme copying is coming in v1.1. For now, please visit https://clarity-chat.dev/themes to copy CSS variables.')
  })
