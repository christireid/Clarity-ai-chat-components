module.exports = {
  // TypeScript/JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],

  // Markdown files
  '*.md': [
    'prettier --write',
  ],

  // JSON files
  '*.json': [
    'prettier --write',
  ],

  // CSS files
  '*.{css,scss}': [
    'prettier --write',
  ],

  // YAML files
  '*.{yml,yaml}': [
    'prettier --write',
  ],
}
