#!/usr/bin/env tsx

/**
 * Security Audit Script
 *
 * Comprehensive security audit for the Clarity Chat component library.
 * Checks for XSS vulnerabilities, CSP issues, and security best practices.
 */

import fs from 'fs'
import path from 'path'
import {
  auditComponentSecurity,
  generateSecurityHeaders,
  validateCSPDirectives,
  detectXSSPatterns,
  DEFAULT_SECURITY_CONFIG,
} from '../packages/react/src/utils/security'

// ============================================================================
// AUDIT CONFIGURATION
// ============================================================================

interface AuditConfig {
  /** Components to audit */
  components: string[]
  /** Files to scan for security issues */
  scanFiles: string[]
  /** Security configuration to validate */
  securityConfig: any
  /** Output format */
  outputFormat: 'json' | 'markdown' | 'console'
  /** Output file path */
  outputFile?: string
}

const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  components: [
    'EnhancedMarkdownRenderer',
    'CodeBlock',
    'Citation',
    'DocumentViewer',
    'MediaRenderer',
  ],
  scanFiles: [
    'packages/react/src/components/**/*.tsx',
    'packages/react/src/components/**/*.ts',
    'packages/react/src/utils/**/*.ts',
    'packages/primitives/src/**/*.ts',
    'apps/docs/**/*.tsx',
    'apps/storybook/**/*.tsx',
  ],
  securityConfig: DEFAULT_SECURITY_CONFIG,
  outputFormat: 'console',
}

// ============================================================================
// FILE SCANNING UTILITIES
// ============================================================================

/**
 * Find files matching patterns
 */
function findFiles(patterns: string[]): string[] {
  const files: string[] = []

  patterns.forEach(pattern => {
    // Simple glob implementation - in production, use a proper glob library
    const baseDir = pattern.split('*')[0].replace('/**', '')
    const scanDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        entries.forEach(entry => {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            scanDir(fullPath)
          } else if (entry.isFile() && matchesPattern(fullPath, pattern)) {
            files.push(fullPath)
          }
        })
      } catch (error) {
        // Skip directories we can't read
      }
    }

    scanDir(baseDir || '.')
  })

  return files
}

/**
 * Simple pattern matching (basic implementation)
 */
function matchesPattern(filePath: string, pattern: string): boolean {
  const regex = new RegExp(
    pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\//g, '\\/')
  )
  return regex.test(filePath) && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))
}

// ============================================================================
// SECURITY SCANNING
// ============================================================================

/**
 * Scan file for security issues
 */
function scanFileForSecurityIssues(filePath: string): {
  file: string
  issues: Array<{
    type: 'xss' | 'csp' | 'sanitization' | 'dangerous-pattern'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    line?: number
    code?: string
  }>
} {
  const issues: Array<{
    type: 'xss' | 'csp' | 'sanitization' | 'dangerous-pattern'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    line?: number
    code?: string
  }> = []

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Check for dangerous patterns
      if (line.includes('dangerouslySetInnerHTML')) {
        issues.push({
          type: 'dangerous-pattern',
          severity: 'high',
          description: 'Use of dangerouslySetInnerHTML without sanitization',
          line: lineNumber,
          code: line.trim(),
        })
      }

      if (line.includes('innerHTML') && !line.includes('sanitiz')) {
        issues.push({
          type: 'dangerous-pattern',
          severity: 'medium',
          description: 'Direct innerHTML manipulation detected',
          line: lineNumber,
          code: line.trim(),
        })
      }

      if (line.includes('eval(')) {
        issues.push({
          type: 'xss',
          severity: 'critical',
          description: 'Use of eval() function - high security risk',
          line: lineNumber,
          code: line.trim(),
        })
      }

      if (line.includes('document.write')) {
        issues.push({
          type: 'xss',
          severity: 'high',
          description: 'Use of document.write - can lead to XSS',
          line: lineNumber,
          code: line.trim(),
        })
      }

      // Check for missing sanitization
      if (line.includes('markdown') && line.includes('render') && !line.includes('sanitiz')) {
        issues.push({
          type: 'sanitization',
          severity: 'medium',
          description: 'Markdown rendering without sanitization',
          line: lineNumber,
          code: line.trim(),
        })
      }
    })

    // Check for XSS patterns in the entire file content
    const xssPatterns = detectXSSPatterns(content)
    xssPatterns.forEach(pattern => {
      issues.push({
        type: 'xss',
        severity: pattern.severity,
        description: `XSS pattern detected: ${pattern.description}`,
        code: pattern.pattern,
      })
    })

  } catch (error) {
    issues.push({
      type: 'dangerous-pattern',
      severity: 'low',
      description: `Could not scan file: ${error.message}`,
    })
  }

  return {
    file: filePath,
    issues,
  }
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Generate security audit report
 */
function generateSecurityReport(
  config: AuditConfig,
  fileScans: Array<ReturnType<typeof scanFileForSecurityIssues>>,
  componentAudits: Array<ReturnType<typeof auditComponentSecurity>>
): {
  summary: {
    totalFiles: number
    totalIssues: number
    issuesBySeverity: Record<string, number>
    issuesByType: Record<string, number>
    overallScore: number
  }
  files: Array<ReturnType<typeof scanFileForSecurityIssues>>
  components: Array<ReturnType<typeof auditComponentSecurity>>
  recommendations: string[]
} {
  const allIssues = [
    ...fileScans.flatMap(scan => scan.issues),
    ...componentAudits.flatMap(audit => audit.vulnerabilities.map(v => ({
      type: v.type,
      severity: v.severity,
      description: v.description,
    }))),
  ]

  const issuesBySeverity: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  const issuesByType: Record<string, number> = {}

  allIssues.forEach(issue => {
    issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1
    issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1
  })

  // Calculate overall security score
  const totalIssues = allIssues.length
  const criticalIssues = issuesBySeverity.critical
  const highIssues = issuesBySeverity.high
  const mediumIssues = issuesBySeverity.medium

  let score = 100
  score -= criticalIssues * 20  // -20 for each critical issue
  score -= highIssues * 10      // -10 for each high issue
  score -= mediumIssues * 5     // -5 for each medium issue
  score -= Math.max(0, totalIssues - criticalIssues - highIssues - mediumIssues) * 2 // -2 for each low issue
  score = Math.max(0, Math.min(100, score))

  // Generate recommendations
  const recommendations: string[] = []

  if (issuesBySeverity.critical > 0) {
    recommendations.push('🚨 Address all critical security issues immediately')
  }

  if (issuesBySeverity.high > 0) {
    recommendations.push('⚠️ Review and fix high-severity security issues')
  }

  if (issuesByType.xss && issuesByType.xss > 0) {
    recommendations.push('🛡️ Implement proper input sanitization for all user content')
  }

  if (issuesByType['dangerous-pattern'] && issuesByType['dangerous-pattern'] > 0) {
    recommendations.push('🔒 Replace dangerous DOM manipulation with secure alternatives')
  }

  if (score < 80) {
    recommendations.push('📊 Consider security review and penetration testing')
  }

  return {
    summary: {
      totalFiles: fileScans.length,
      totalIssues,
      issuesBySeverity,
      issuesByType,
      overallScore: score,
    },
    files: fileScans,
    components: componentAudits,
    recommendations,
  }
}

/**
 * Output report in specified format
 */
function outputReport(
  report: ReturnType<typeof generateSecurityReport>,
  format: 'json' | 'markdown' | 'console',
  outputFile?: string
): void {
  let output = ''

  switch (format) {
    case 'json':
      output = JSON.stringify(report, null, 2)
      break

    case 'markdown':
      output = generateMarkdownReport(report)
      break

    case 'console':
    default:
      output = generateConsoleReport(report)
      break
  }

  if (outputFile) {
    fs.writeFileSync(outputFile, output)
    console.log(`Security audit report saved to: ${outputFile}`)
  } else {
    console.log(output)
  }
}

/**
 * Generate console-friendly report
 */
function generateConsoleReport(report: ReturnType<typeof generateSecurityReport>): string {
  const { summary, recommendations } = report

  let output = '\n🔒 Security Audit Report\n'
  output += '='.repeat(50) + '\n\n'

  // Summary
  output += '📊 Summary:\n'
  output += `   Files Scanned: ${summary.totalFiles}\n`
  output += `   Total Issues: ${summary.totalIssues}\n`
  output += `   Security Score: ${summary.overallScore}/100\n\n`

  output += '🚨 Issues by Severity:\n'
  Object.entries(summary.issuesBySeverity).forEach(([severity, count]) => {
    const emoji = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
    }[severity] || '⚪'
    output += `   ${emoji} ${severity.toUpperCase()}: ${count}\n`
  })

  output += '\n🏷️ Issues by Type:\n'
  Object.entries(summary.issuesByType).forEach(([type, count]) => {
    output += `   ${type}: ${count}\n`
  })

  // Recommendations
  if (recommendations.length > 0) {
    output += '\n💡 Recommendations:\n'
    recommendations.forEach(rec => {
      output += `   • ${rec}\n`
    })
  }

  // File issues
  const filesWithIssues = report.files.filter(f => f.issues.length > 0)
  if (filesWithIssues.length > 0) {
    output += '\n📁 Files with Security Issues:\n'
    filesWithIssues.forEach(file => {
      output += `   ${file.file} (${file.issues.length} issues)\n`
      file.issues.slice(0, 3).forEach(issue => {
        output += `     ${getSeverityEmoji(issue.severity)} ${issue.description}\n`
      })
      if (file.issues.length > 3) {
        output += `     ... and ${file.issues.length - 3} more\n`
      }
    })
  }

  output += '\n' + '='.repeat(50) + '\n'

  return output
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report: ReturnType<typeof generateSecurityReport>): string {
  const { summary, recommendations } = report

  let output = '# 🔒 Security Audit Report\n\n'

  // Summary
  output += '## 📊 Summary\n\n'
  output += `- **Files Scanned:** ${summary.totalFiles}\n`
  output += `- **Total Issues:** ${summary.totalIssues}\n`
  output += `- **Security Score:** ${summary.overallScore}/100\n\n`

  output += '## 🚨 Issues by Severity\n\n'
  Object.entries(summary.issuesBySeverity).forEach(([severity, count]) => {
    const emoji = getSeverityEmoji(severity as any)
    output += `- ${emoji} **${severity.toUpperCase()}:** ${count}\n`
  })

  output += '\n## 🏷️ Issues by Type\n\n'
  Object.entries(summary.issuesByType).forEach(([type, count]) => {
    output += `- **${type}:** ${count}\n`
  })

  // Recommendations
  if (recommendations.length > 0) {
    output += '\n## 💡 Recommendations\n\n'
    recommendations.forEach(rec => {
      output += `- ${rec}\n`
    })
    output += '\n'
  }

  // Detailed file issues
  const filesWithIssues = report.files.filter(f => f.issues.length > 0)
  if (filesWithIssues.length > 0) {
    output += '## 📁 Files with Security Issues\n\n'
    filesWithIssues.forEach(file => {
      output += `### ${file.file}\n\n`
      output += `**Issues:** ${file.issues.length}\n\n`
      file.issues.forEach(issue => {
        output += `- ${getSeverityEmoji(issue.severity)} **${issue.severity.toUpperCase()}:** ${issue.description}\n`
        if (issue.line) {
          output += `  - **Line:** ${issue.line}\n`
        }
        if (issue.code) {
          output += `  - **Code:** \`${issue.code}\`\n`
        }
      })
      output += '\n'
    })
  }

  return output
}

/**
 * Get emoji for severity level
 */
function getSeverityEmoji(severity: 'critical' | 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'critical': return '🔴'
    case 'high': return '🟠'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

/**
 * Run comprehensive security audit
 */
async function runSecurityAudit(config: Partial<AuditConfig> = {}): Promise<void> {
  const auditConfig = { ...DEFAULT_AUDIT_CONFIG, ...config }

  console.log('🔒 Starting security audit...')

  // Find files to scan
  const files = findFiles(auditConfig.scanFiles)
  console.log(`📁 Found ${files.length} files to scan`)

  // Scan files for security issues
  const fileScans = files.map(scanFileForSecurityIssues)
  console.log(`🔍 Scanned ${fileScans.length} files`)

  // Audit components
  const componentAudits = auditConfig.components.map(componentName => {
    // For demo purposes, we'll create mock audits
    // In a real implementation, you'd load actual component content
    return auditComponentSecurity(componentName, '', auditConfig.securityConfig)
  })

  // Generate report
  const report = generateSecurityReport(auditConfig, fileScans, componentAudits)

  // Validate CSP
  const cspValidation = validateCSPDirectives(auditConfig.securityConfig.cspDirectives)
  if (!cspValidation.valid || cspValidation.warnings.length > 0) {
    console.log('⚠️ CSP Configuration Issues:')
    cspValidation.errors.forEach(error => console.log(`   🔴 ${error}`))
    cspValidation.warnings.forEach(warning => console.log(`   🟡 ${warning}`))
  }

  // Output report
  outputReport(report, auditConfig.outputFormat, auditConfig.outputFile)

  // Exit with appropriate code
  const hasCriticalIssues = report.summary.issuesBySeverity.critical > 0
  const hasHighIssues = report.summary.issuesBySeverity.high > 0

  if (hasCriticalIssues) {
    console.log('\n❌ Security audit failed: Critical issues found')
    process.exit(1)
  } else if (hasHighIssues) {
    console.log('\n⚠️ Security audit completed with warnings: High-severity issues found')
    process.exit(0) // Don't fail CI for high-severity issues, but warn
  } else {
    console.log('\n✅ Security audit passed')
    process.exit(0)
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

// Parse command line arguments
function parseArgs(): Partial<AuditConfig> {
  const args = process.argv.slice(2)
  const config: Partial<AuditConfig> = {}

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
      case '-f':
        config.outputFormat = args[++i] as 'json' | 'markdown' | 'console'
        break
      case '--output':
      case '-o':
        config.outputFile = args[++i]
        break
      case '--components':
        config.components = args[++i].split(',')
        break
      case '--help':
      case '-h':
        console.log(`
Security Audit Tool

Usage: tsx scripts/security-audit.ts [options]

Options:
  -f, --format <format>     Output format: json, markdown, console (default: console)
  -o, --output <file>       Output file path
  --components <list>       Comma-separated list of components to audit
  -h, --help               Show this help message

Examples:
  tsx scripts/security-audit.ts
  tsx scripts/security-audit.ts --format json --output security-report.json
  tsx scripts/security-audit.ts --components EnhancedMarkdownRenderer,CodeBlock
        `)
        process.exit(0)
    }
  }

  return config
}

// Run audit if called directly
if (require.main === module) {
  runSecurityAudit(parseArgs()).catch(error => {
    console.error('Security audit failed:', error)
    process.exit(1)
  })
}

export { runSecurityAudit, scanFileForSecurityIssues, generateSecurityReport }