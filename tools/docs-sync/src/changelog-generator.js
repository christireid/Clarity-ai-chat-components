/**
 * Changelog Generator
 *
 * Generates changelog entries from conventional commits
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { getCommitsBetween, getLatestTag } from './utils/git.js';
/** Conventional commit type mapping */
const COMMIT_TYPE_MAP = {
    feat: 'Features',
    fix: 'Bug Fixes',
    docs: 'Documentation',
    style: 'Styles',
    refactor: 'Refactoring',
    perf: 'Performance',
    test: 'Tests',
    chore: 'Chores',
    build: 'Build System',
    ci: 'CI/CD',
    revert: 'Reverts',
};
/** Emoji mapping for changelog sections */
const SECTION_EMOJI = {
    'Breaking Changes': '⚠️',
    Features: '✨',
    'Bug Fixes': '🐛',
    Documentation: '📚',
    Performance: '⚡',
    Refactoring: '♻️',
    Styles: '💄',
    Tests: '✅',
    Chores: '🔧',
    'Build System': '📦',
    'CI/CD': '👷',
    Reverts: '⏪',
};
/** Parse a conventional commit message */
export function parseConventionalCommit(commit) {
    const { subject, body } = commit;
    // Pattern: type(scope)!: message or type!: message or type(scope): message
    const regex = /^(\w+)(\(([^)]+)\))?(!)?:\s*(.+)$/;
    const match = subject.match(regex);
    if (!match) {
        return null;
    }
    const [, type, , scope, breakingMarker, message] = match;
    // Check for breaking change in body
    const hasBreakingBody = body.includes('BREAKING CHANGE:') ||
        body.includes('BREAKING-CHANGE:') ||
        body.toLowerCase().includes('breaking:');
    // Extract PR number from message or body
    const prMatch = subject.match(/#(\d+)/) || body.match(/#(\d+)/);
    const prNumber = prMatch ? parseInt(prMatch[1] ?? '0', 10) : undefined;
    return {
        type: type ?? 'chore',
        scope,
        message: message ?? subject,
        breaking: breakingMarker === '!' || hasBreakingBody,
        commit,
        prNumber,
    };
}
/** Generate changelog entries from commits */
export function generateChangelogEntries(commits, version) {
    const sections = {};
    const breakingChanges = [];
    for (const commit of commits) {
        const parsed = parseConventionalCommit(commit);
        if (!parsed)
            continue;
        // Skip certain types from changelog
        if (['chore', 'style', 'test', 'ci', 'build'].includes(parsed.type)) {
            continue;
        }
        const item = {
            message: parsed.message,
            scope: parsed.scope,
            hash: parsed.commit.hash,
            shortHash: parsed.commit.shortHash,
            author: parsed.commit.author,
            prNumber: parsed.prNumber,
        };
        // Handle breaking changes
        if (parsed.breaking) {
            breakingChanges.push(item);
        }
        // Add to appropriate section
        const sectionName = COMMIT_TYPE_MAP[parsed.type] ?? 'Other';
        if (!sections[sectionName]) {
            sections[sectionName] = [];
        }
        sections[sectionName]?.push(item);
    }
    // Add breaking changes section at the top
    if (breakingChanges.length > 0) {
        sections['Breaking Changes'] = breakingChanges;
    }
    return {
        version,
        date: new Date().toISOString().split('T')[0] ?? '',
        sections,
    };
}
/** Format a single changelog item */
function formatChangelogItem(item, repoUrl) {
    let line = '- ';
    if (item.scope) {
        line += `**${item.scope}:** `;
    }
    line += item.message;
    // Add links
    const links = [];
    if (item.prNumber && repoUrl) {
        links.push(`[#${item.prNumber}](${repoUrl}/pull/${item.prNumber})`);
    }
    if (repoUrl) {
        links.push(`[\`${item.shortHash}\`](${repoUrl}/commit/${item.hash})`);
    }
    else {
        links.push(`\`${item.shortHash}\``);
    }
    if (links.length > 0) {
        line += ` (${links.join(', ')})`;
    }
    return line;
}
/** Generate markdown for a changelog entry */
export function formatChangelogMarkdown(entry, repoUrl) {
    const lines = [];
    lines.push(`## [${entry.version}] - ${entry.date}`);
    lines.push('');
    // Order sections
    const sectionOrder = [
        'Breaking Changes',
        'Features',
        'Bug Fixes',
        'Performance',
        'Refactoring',
        'Documentation',
        'Other',
    ];
    for (const sectionName of sectionOrder) {
        const items = entry.sections[sectionName];
        if (!items || items.length === 0)
            continue;
        const emoji = SECTION_EMOJI[sectionName] ?? '📌';
        lines.push(`### ${emoji} ${sectionName}`);
        lines.push('');
        for (const item of items) {
            lines.push(formatChangelogItem(item, repoUrl));
        }
        lines.push('');
    }
    // Handle any sections not in the predefined order
    for (const [sectionName, items] of Object.entries(entry.sections)) {
        if (sectionOrder.includes(sectionName) || items.length === 0)
            continue;
        const emoji = SECTION_EMOJI[sectionName] ?? '📌';
        lines.push(`### ${emoji} ${sectionName}`);
        lines.push('');
        for (const item of items) {
            lines.push(formatChangelogItem(item, repoUrl));
        }
        lines.push('');
    }
    return lines.join('\n');
}
/** Generate changelog from commits between two refs */
export async function generateChangelog(sinceRef, version, config) {
    const cwd = process.cwd();
    // Get commits since the ref
    const commits = getCommitsBetween(sinceRef, 'HEAD', cwd);
    // Generate entries
    const entry = generateChangelogEntries(commits, version);
    // Generate markdown
    const markdown = formatChangelogMarkdown(entry, config.repoUrl);
    // Check for breaking changes
    const hasBreakingChanges = (entry.sections['Breaking Changes']?.length ?? 0) > 0;
    return {
        entry,
        markdown,
        hasBreakingChanges,
    };
}
/** Update the main CHANGELOG.md file */
export function updateChangelogFile(filePath, newEntry) {
    let existingContent = '';
    if (existsSync(filePath)) {
        existingContent = readFileSync(filePath, 'utf-8');
    }
    // Find where to insert the new entry
    // Usually after the title and before the first version entry
    const headerPattern = /^# Changelog\n+/;
    const firstVersionPattern = /^## \[/m;
    let newContent;
    if (headerPattern.test(existingContent)) {
        // Insert after header
        const headerMatch = existingContent.match(headerPattern);
        const headerEnd = (headerMatch?.index ?? 0) + (headerMatch?.[0]?.length ?? 0);
        const beforeFirst = existingContent.slice(0, headerEnd);
        const afterFirst = existingContent.slice(headerEnd);
        newContent = beforeFirst + '\n' + newEntry + '\n' + afterFirst;
    }
    else if (firstVersionPattern.test(existingContent)) {
        // Insert before first version
        const match = existingContent.match(firstVersionPattern);
        const insertPos = match?.index ?? 0;
        const beforeInsert = existingContent.slice(0, insertPos);
        const afterInsert = existingContent.slice(insertPos);
        newContent = beforeInsert + newEntry + '\n' + afterInsert;
    }
    else {
        // No existing structure, create new file
        newContent =
            '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n' +
                newEntry;
    }
    writeFileSync(filePath, newContent, 'utf-8');
}
/** Generate release notes from changelog entry */
export function generateReleaseNotes(entry, repoUrl) {
    const lines = [];
    lines.push(`# Release ${entry.version}`);
    lines.push('');
    lines.push(`Released on ${entry.date}`);
    lines.push('');
    // Highlight breaking changes
    if (entry.sections['Breaking Changes']?.length) {
        lines.push('## ⚠️ Breaking Changes');
        lines.push('');
        lines.push('This release contains breaking changes. Please review carefully before upgrading.');
        lines.push('');
        for (const item of entry.sections['Breaking Changes']) {
            lines.push(formatChangelogItem(item, repoUrl));
        }
        lines.push('');
    }
    // Features
    if (entry.sections['Features']?.length) {
        lines.push('## ✨ New Features');
        lines.push('');
        for (const item of entry.sections['Features']) {
            lines.push(formatChangelogItem(item, repoUrl));
        }
        lines.push('');
    }
    // Bug fixes
    if (entry.sections['Bug Fixes']?.length) {
        lines.push('## 🐛 Bug Fixes');
        lines.push('');
        for (const item of entry.sections['Bug Fixes']) {
            lines.push(formatChangelogItem(item, repoUrl));
        }
        lines.push('');
    }
    // Other changes
    const otherSections = ['Performance', 'Refactoring', 'Documentation'];
    for (const section of otherSections) {
        if (entry.sections[section]?.length) {
            const emoji = SECTION_EMOJI[section] ?? '📌';
            lines.push(`## ${emoji} ${section}`);
            lines.push('');
            for (const item of entry.sections[section] ?? []) {
                lines.push(formatChangelogItem(item, repoUrl));
            }
            lines.push('');
        }
    }
    return lines.join('\n');
}
/** Get the latest tag or a default ref */
export function getChangelogSinceRef(cwd) {
    const latestTag = getLatestTag(cwd);
    return latestTag ?? 'HEAD~10'; // Fallback to last 10 commits
}
/** Determine next version based on changes */
export function suggestNextVersion(currentVersion, hasBreakingChanges, hasFeatures) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    if (major === undefined || minor === undefined || patch === undefined) {
        return '0.1.0';
    }
    if (hasBreakingChanges) {
        // Major version bump for breaking changes (except 0.x)
        if (major === 0) {
            return `0.${minor + 1}.0`;
        }
        return `${major + 1}.0.0`;
    }
    if (hasFeatures) {
        // Minor version bump for new features
        return `${major}.${minor + 1}.0`;
    }
    // Patch version bump for fixes
    return `${major}.${minor}.${patch + 1}`;
}
/** Format changelog result for output */
export function formatChangelogResult(entry, hasBreakingChanges) {
    const lines = [];
    lines.push('📋 Changelog Generation Results');
    lines.push('═'.repeat(50));
    lines.push('');
    lines.push(`Version: ${entry.version}`);
    lines.push(`Date: ${entry.date}`);
    lines.push('');
    if (hasBreakingChanges) {
        lines.push('⚠️  Contains breaking changes!');
        lines.push('');
    }
    const sectionCounts = Object.entries(entry.sections)
        .map(([name, items]) => `${name}: ${items.length}`)
        .join(', ');
    lines.push(`Sections: ${sectionCounts}`);
    return lines.join('\n');
}
//# sourceMappingURL=changelog-generator.js.map