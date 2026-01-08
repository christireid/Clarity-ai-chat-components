#!/usr/bin/env tsx
/**
 * Pre-commit Review Checks
 *
 * Lightweight rule-based checks based on the code review criteria.
 * Runs automatically before commits to catch common issues.
 *
 * Usage:
 *   pnpm review:check [files...]           # Check specific files
 *   pnpm review:check --staged             # Check staged files
 *   pnpm review:check --fix src/           # Auto-fix issues
 *   pnpm review:check --output json        # JSON output for CI
 *
 * Suppression:
 *   Add inline comments to suppress specific rules:
 *   // review-ignore: consoleLog
 *   // review-ignore: consoleLog, explicitAny
 *   // review-ignore-next-line: arbitraryTailwind
 */
interface Issue {
    file: string;
    line: number;
    rule: string;
    severity: 'error' | 'warning';
    message: string;
    fixable: boolean;
    fixed?: boolean;
}
interface CheckResult {
    issues: Issue[];
    fixed: Issue[];
    passed: boolean;
    filesChecked: number;
    duration: number;
}
interface CheckDefinition {
    pattern?: RegExp;
    check?: (content: string, filePath: string) => boolean | number[];
    message: string;
    severity: 'error' | 'warning';
    fixable?: boolean;
    fix?: (line: string) => string | null;
    exclude?: string[];
}
interface Options {
    staged: boolean;
    fix: boolean;
    output: 'console' | 'json';
    help: boolean;
    files: string[];
}
declare const CHECKS: Record<string, CheckDefinition>;
interface SuppressionInfo {
    lineSuppressions: Map<number, Set<string>>;
    fileSuppressions: Set<string>;
}
declare function parseSuppressions(content: string): SuppressionInfo;
declare function isSuppressed(suppressions: SuppressionInfo, ruleName: string, lineNumber: number): boolean;
declare function checkFile(filePath: string, options: Options): Promise<{
    issues: Issue[];
    fixed: Issue[];
}>;
export { CHECKS, checkFile, parseSuppressions, isSuppressed };
export type { Issue, CheckResult, Options };
//# sourceMappingURL=review-checks.d.ts.map