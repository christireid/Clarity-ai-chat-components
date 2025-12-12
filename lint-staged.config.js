export default {
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    // Run lightweight review checks on staged files
    'tsx scripts/review-checks.ts',
  ],
  '*.md': ['prettier --write'],
  '*.json': ['prettier --write'],
  '*.{css,scss}': ['prettier --write'],
  '*.{yml,yaml}': ['prettier --write'],
}
