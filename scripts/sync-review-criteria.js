#!/usr/bin/env tsx
/**
 * Sync Review Criteria
 *
 * Validates that review-checks.ts rules align with docs/prompts/criteria/*.md
 * and generates a mapping report.
 *
 * Usage:
 *   pnpm review:sync          # Validate alignment
 *   pnpm review:sync --report # Generate detailed report
 */
import * as fs from 'fs';
import * as path from 'path';
const CRITERIA_DIR = 'docs/prompts/criteria';
const CHECKS_FILE = 'scripts/review-checks.ts';
// Map check rules to their criteria categories
const RULE_TO_CRITERIA = {
    arbitraryTailwind: ['tailwind.md'],
    hardcodedColors: ['tailwind.md'],
    missingUseClient: ['architecture.md', 'security.md'],
    explicitAny: ['typescript.md'],
    dangerousHtml: ['security.md'],
    dynamicUrl: ['security.md'],
    nativeImg: ['performance.md'],
    inlineArrowJsx: ['performance.md'],
    consoleLog: ['architecture.md'],
    todoComments: ['architecture.md'],
};
function parseCriteriaFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const items = [];
    // Extract checklist items (lines starting with - [ ] or - [x])
    const checklistPattern = /^[-*]\s*\[[ x]\]\s*(.+)$/gm;
    let match;
    while ((match = checklistPattern.exec(content)) !== null) {
        items.push(match[1].trim());
    }
    // Extract bold items that might be rules
    const boldPattern = /\*\*([^*]+)\*\*/g;
    while ((match = boldPattern.exec(content)) !== null) {
        const item = match[1].trim();
        if (item.length > 3 && item.length < 100) {
            items.push(item);
        }
    }
    return {
        category: fileName.replace('.md', ''),
        file: fileName,
        items: [...new Set(items)], // Dedupe
    };
}
function loadAllCriteria() {
    const criteriaPath = path.join(process.cwd(), CRITERIA_DIR);
    if (!fs.existsSync(criteriaPath)) {
        console.error(`Criteria directory not found: ${criteriaPath}`);
        return [];
    }
    const files = fs.readdirSync(criteriaPath).filter((f) => f.endsWith('.md') && f !== 'README.md');
    return files.map((file) => parseCriteriaFile(path.join(criteriaPath, file)));
}
function extractRulesFromChecks() {
    const checksPath = path.join(process.cwd(), CHECKS_FILE);
    const content = fs.readFileSync(checksPath, 'utf-8');
    // Extract rule names from CHECKS object
    const rulePattern = /^\s*(\w+):\s*\{/gm;
    const rules = [];
    let match;
    while ((match = rulePattern.exec(content)) !== null) {
        const ruleName = match[1];
        // Filter out non-rule matches
        if (ruleName !== 'pattern' &&
            ruleName !== 'check' &&
            ruleName !== 'message' &&
            ruleName !== 'severity' &&
            ruleName !== 'fixable' &&
            ruleName !== 'fix' &&
            ruleName !== 'exclude') {
            rules.push(ruleName);
        }
    }
    return rules;
}
function generateReport(criteria, rules) {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║         Review Criteria Sync Report                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    // Rules coverage
    console.log('📋 RULES COVERAGE\n');
    console.log('Rule                    │ Criteria Files');
    console.log('────────────────────────┼─────────────────────────────────');
    for (const rule of rules) {
        const criteriaFiles = RULE_TO_CRITERIA[rule] || ['(unmapped)'];
        const status = RULE_TO_CRITERIA[rule] ? '✓' : '⚠';
        console.log(`${status} ${rule.padEnd(20)} │ ${criteriaFiles.join(', ')}`);
    }
    // Criteria coverage
    console.log('\n\n📚 CRITERIA FILES\n');
    for (const item of criteria) {
        const rulesForCriteria = Object.entries(RULE_TO_CRITERIA)
            .filter(([_, files]) => files.includes(item.file))
            .map(([rule]) => rule);
        console.log(`\n${item.category.toUpperCase()} (${item.file})`);
        console.log(`  Automated checks: ${rulesForCriteria.length > 0 ? rulesForCriteria.join(', ') : 'None'}`);
        console.log(`  Manual review items: ${item.items.length}`);
    }
    // Summary
    const mappedRules = rules.filter((r) => RULE_TO_CRITERIA[r]);
    const unmappedRules = rules.filter((r) => !RULE_TO_CRITERIA[r]);
    console.log('\n\n📊 SUMMARY\n');
    console.log(`Total automated rules:    ${rules.length}`);
    console.log(`Mapped to criteria:       ${mappedRules.length}`);
    console.log(`Unmapped rules:           ${unmappedRules.length}`);
    console.log(`Criteria files:           ${criteria.length}`);
    if (unmappedRules.length > 0) {
        console.log(`\n⚠️  Unmapped rules: ${unmappedRules.join(', ')}`);
        console.log('   Add these to RULE_TO_CRITERIA in sync-review-criteria.ts');
    }
    // Coverage by category
    console.log('\n\n📈 COVERAGE BY CATEGORY\n');
    console.log('Category      │ Auto Rules │ Coverage');
    console.log('──────────────┼────────────┼──────────');
    for (const item of criteria) {
        const rulesForCriteria = Object.entries(RULE_TO_CRITERIA)
            .filter(([_, files]) => files.includes(item.file))
            .map(([rule]) => rule);
        const coverage = rulesForCriteria.length > 0 ? '✓ Partial' : '○ Manual only';
        console.log(`${item.category.padEnd(13)} │ ${String(rulesForCriteria.length).padEnd(10)} │ ${coverage}`);
    }
    console.log('\n');
}
function validateAlignment(criteria, rules) {
    let valid = true;
    // Check all rules are mapped
    for (const rule of rules) {
        if (!RULE_TO_CRITERIA[rule]) {
            console.warn(`⚠️  Rule '${rule}' is not mapped to any criteria file`);
            valid = false;
        }
    }
    // Check all criteria files have at least one rule
    for (const item of criteria) {
        const hasRules = Object.values(RULE_TO_CRITERIA).some((files) => files.includes(item.file));
        if (!hasRules && item.file !== 'clarity-chat.md') {
            console.warn(`⚠️  Criteria file '${item.file}' has no automated checks`);
        }
    }
    return valid;
}
function main() {
    const args = process.argv.slice(2);
    const showReport = args.includes('--report') || args.includes('-r');
    const criteria = loadAllCriteria();
    const rules = extractRulesFromChecks();
    if (criteria.length === 0) {
        console.error('No criteria files found');
        process.exit(1);
    }
    if (showReport) {
        generateReport(criteria, rules);
    }
    const valid = validateAlignment(criteria, rules);
    if (valid) {
        console.log('✓ All rules are mapped to criteria files');
    }
    else {
        console.log('\nRun with --report for detailed coverage analysis');
    }
}
main();
//# sourceMappingURL=sync-review-criteria.js.map