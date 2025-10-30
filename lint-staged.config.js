module.exports = {
  // TypeScript and TSX files
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit', // Type check all files
  ],

  // JavaScript and JSX files
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],

  // JSON files
  '*.json': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],

  // CSS and SCSS files
  '*.{css,scss}': ['prettier --write'],

  // Package.json files
  'package.json': ['prettier --write', 'sort-package-json'],
}
