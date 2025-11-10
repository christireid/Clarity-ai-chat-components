/**
 * Lint-Staged Configuration
 * Runs linters and formatters on staged files before commit
 */

module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // JSON files
  '*.json': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],

  // CSS files
  '*.css': ['prettier --write'],

  // Package.json files (run after any changes to ensure consistency)
  'package.json': ['prettier --write'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write'],
}
