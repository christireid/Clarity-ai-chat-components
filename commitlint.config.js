/**
 * Commitlint Configuration
 * Enforces Conventional Commits format
 * 
 * Format: <type>(<scope>): <subject>
 * Example: feat(button): add loading state
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Type enum
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Code style (formatting, semicolons, etc)
        'refactor', // Code refactoring (no feat/fix)
        'perf',     // Performance improvement
        'test',     // Adding/updating tests
        'build',    // Build system or dependencies
        'ci',       // CI configuration
        'chore',    // Other changes (no src/test)
        'revert',   // Revert previous commit
      ],
    ],
    
    // Scope enum (optional but if provided, must be in list)
    'scope-enum': [
      2,
      'always',
      [
        // Packages
        'primitives',
        'react',
        'types',
        'memory',
        'error-handling',
        'cli',
        'dev-tools',
        
        // Components
        'button',
        'input',
        'card',
        'dialog',
        'badge',
        'message',
        'chat-window',
        'chat-input',
        
        // Infrastructure
        'ci',
        'deps',
        'config',
        'scripts',
        'tooling',
        'docs',
        'examples',
        'storybook',
        
        // Design
        'ui',
        'a11y',
        'theme',
        'design-system',
      ],
    ],
    
    // Subject rules
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    
    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    
    // Footer rules
    'footer-leading-blank': [2, 'always'],
    
    // Header rules
    'header-max-length': [2, 'always', 100],
  },
  
  // Custom prompts for commitizen (if installed)
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'cannot be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: "Select the type of change you're committing:",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Changes that do not affect code logic',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'Code refactoring without feature changes',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'Performance improvements',
            title: 'Performance',
            emoji: '🚀',
          },
          test: {
            description: 'Adding or updating tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: 'Build system or dependency changes',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'CI configuration changes',
            title: 'CI',
            emoji: '⚙️',
          },
          chore: {
            description: 'Other changes that don't modify src or tests',
            title: 'Chores',
            emoji: '♻️',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (optional)',
      },
      subject: {
        description: 'Write a short description of the change',
      },
      body: {
        description: 'Provide a longer description (optional)',
      },
      footer: {
        description: 'List any breaking changes or issues closed (optional)',
      },
    },
  },
}
