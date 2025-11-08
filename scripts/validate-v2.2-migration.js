#!/usr/bin/env node

/**
 * v2.2 Migration Validation Script
 * 
 * Validates that v2.2 refinements have been applied correctly
 * and that no regressions were introduced.
 * 
 * Usage: node scripts/validate-v2.2-migration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating v2.2 Migration...\n');

let errors = 0;
let warnings = 0;
let successes = 0;

// Helper functions
function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function checkFileContains(filePath, searchString) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return false;
  const content = fs.readFileSync(fullPath, 'utf-8');
  return content.includes(searchString);
}

function success(message) {
  console.log(`✅ ${message}`);
  successes++;
}

function error(message) {
  console.log(`❌ ${message}`);
  errors++;
}

function warning(message) {
  console.log(`⚠️  ${message}`);
  warnings++;
}

// Validation checks
console.log('📦 Checking package versions...');
if (checkFileContains('packages/react/package.json', '"version": "2.2.0"')) {
  success('@clarity-chat/react version is 2.2.0');
} else {
  error('@clarity-chat/react version is not 2.2.0');
}

if (checkFileContains('packages/primitives/package.json', '"version": "2.2.0"')) {
  success('@clarity-chat/primitives version is 2.2.0');
} else {
  error('@clarity-chat/primitives version is not 2.2.0');
}

console.log('\n🎨 Checking design tokens...');
if (checkFileContains('packages/react/src/theme/theme.css', '--shadow-xs')) {
  success('New shadow-xs token exists');
} else {
  error('shadow-xs token missing');
}

if (checkFileContains('packages/react/src/theme/theme.css', '--shadow-focus-primary')) {
  success('Focus glow shadow tokens exist');
} else {
  error('Focus glow shadow tokens missing');
}

if (checkFileContains('packages/react/src/theme/theme.css', '--border-subtle')) {
  success('Border opacity tokens exist');
} else {
  error('Border opacity tokens missing');
}

console.log('\n🔧 Checking Tailwind config...');
if (checkFileContains('tailwind.config.js', "'xs': '0 1px 2px rgba(0, 0, 0, 0.04)'")) {
  success('Refined shadow utilities in Tailwind config');
} else {
  error('Shadow utilities not updated in Tailwind config');
}

if (checkFileContains('tailwind.config.js', 'focus-primary')) {
  success('Focus shadow utilities in Tailwind config');
} else {
  error('Focus shadow utilities missing in Tailwind config');
}

if (checkFileContains('tailwind.config.js', 'error-shake')) {
  success('New animation keyframes added');
} else {
  error('New animation keyframes missing');
}

console.log('\n🧩 Checking component refinements...');

// Button
if (checkFileContains('packages/primitives/src/components/button.tsx', 'shadow-xs')) {
  success('Button uses refined shadow system');
} else {
  error('Button not using refined shadows');
}

if (checkFileContains('packages/primitives/src/components/button.tsx', '-translate-y-px')) {
  success('Button uses 1px hover lift');
} else {
  error('Button still using old hover lift');
}

if (checkFileContains('packages/primitives/src/components/button.tsx', 'ring-1')) {
  success('Button uses refined focus ring (1px)');
} else {
  error('Button still using old focus ring');
}

if (checkFileContains('packages/primitives/src/components/button.tsx', 'active:scale-[0.98]')) {
  success('Button has active scale feedback');
} else {
  warning('Button missing active scale (minor)');
}

// Input
if (checkFileContains('packages/primitives/src/components/input.tsx', 'border-input/40')) {
  success('Input uses subtle border opacity');
} else {
  error('Input not using refined borders');
}

if (checkFileContains('packages/primitives/src/components/input.tsx', 'shadow-focus-primary')) {
  success('Input uses soft focus glow');
} else {
  error('Input not using soft focus glow');
}

if (checkFileContains('packages/primitives/src/components/input.tsx', 'placeholder:text-muted-foreground/60')) {
  success('Input has softer placeholder (60%)');
} else {
  error('Input placeholder not refined');
}

// Badge
if (checkFileContains('packages/primitives/src/components/badge.tsx', 'bg-primary/10 text-primary')) {
  success('Badge uses transparent background design');
} else {
  error('Badge not using new transparent design');
}

// Card
if (checkFileContains('packages/primitives/src/components/card.tsx', 'border-border/40')) {
  success('Card uses subtle border opacity');
} else {
  error('Card not using refined borders');
}

// Dialog
if (checkFileContains('packages/primitives/src/components/dialog.tsx', 'bg-black/50')) {
  success('Dialog uses lighter backdrop (50%)');
} else {
  error('Dialog still using old backdrop');
}

if (checkFileContains('packages/primitives/src/components/dialog.tsx', 'border-border/20')) {
  success('Dialog content has whisper-light border');
} else {
  error('Dialog border not refined');
}

// Chat components
if (checkFileContains('packages/react/src/components/message.tsx', 'p-3')) {
  success('Message uses tighter padding');
} else {
  warning('Message padding may not be updated');
}

if (checkFileContains('packages/react/src/components/chat-window.tsx', 'backdrop-blur-sm')) {
  success('ChatWindow header has frosted glass effect');
} else {
  warning('ChatWindow header may not have frosted effect');
}

if (checkFileContains('packages/react/src/components/chat-input.tsx', 'border-border/40')) {
  success('ChatInput uses light divider');
} else {
  warning('ChatInput divider may not be refined');
}

if (checkFileContains('packages/react/src/components/thinking-indicator.tsx', 'border-border/30')) {
  success('ThinkingIndicator has very light border');
} else {
  warning('ThinkingIndicator border may not be refined');
}

console.log('\n📚 Checking documentation...');
const requiredDocs = [
  'UI_UX_ELEVATION_PLAN.md',
  'UI_UX_IMPROVEMENTS_COMPLETE.md',
  'UPGRADE_GUIDE_V2.2.md',
  'VISUAL_COMPARISON_V2.2.md',
  'CHANGELOG_V2.2.md',
  'V2.2_QUICK_REFERENCE.md',
  'START_HERE_V2.2.md',
];

requiredDocs.forEach(doc => {
  if (checkFileExists(doc)) {
    success(`${doc} exists`);
  } else {
    error(`${doc} missing`);
  }
});

console.log('\n📊 Validation Summary:');
console.log(`─────────────────────────`);
console.log(`✅ Successes: ${successes}`);
console.log(`⚠️  Warnings:  ${warnings}`);
console.log(`❌ Errors:    ${errors}`);
console.log(`─────────────────────────`);

if (errors === 0 && warnings === 0) {
  console.log('\n🎉 Perfect! All v2.2 refinements validated successfully!');
  console.log('✨ Your migration is complete and correct.');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n✅ Migration validated! (with minor warnings)');
  console.log('⚠️  Check warnings above - they may be non-critical.');
  process.exit(0);
} else {
  console.log('\n❌ Migration validation failed!');
  console.log('Please fix the errors above before shipping.');
  process.exit(1);
}
