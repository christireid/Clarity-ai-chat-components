#!/usr/bin/env node

/**
 * Script to migrate markdown documentation files to Next.js MDX pages
 * 
 * Usage: node scripts/migrate-docs-to-mdx.js <source-dir> <target-dir> [guide-name]
 */

const fs = require('fs')
const path = require('path')

const MDX_TEMPLATE = `import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: '{TITLE} - Clarity Chat',
  description: '{DESCRIPTION}',
}

export default function {COMPONENT_NAME}() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>{TITLE}</h1>
        <p className="docs-lead">
          {DESCRIPTION}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {CONTENT}
      </div>
    </div>
  )
}
`

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (match) {
    return {
      frontmatter: match[1],
      content: match[2]
    }
  }
  
  return {
    frontmatter: null,
    content: content
  }
}

function convertMarkdownToMDX(markdown) {
  // Convert code blocks with language to CodeBlock components
  let mdx = markdown.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || 'text'
      const escapedCode = code.trim().replace(/`/g, '\\`').replace(/\$/g, '\\$')
      return `<CodeBlock language="${language}" code={\`${escapedCode}\`} />`
    }
  )
  
  // Convert callouts/admonitions (if any)
  // This is a basic conversion - may need adjustment based on actual format
  mdx = mdx.replace(
    /::: (info|warning|error|tip|note)\n([\s\S]*?):::/g,
    (match, type, content) => {
      return `<Callout type="${type}" title="${type.charAt(0).toUpperCase() + type.slice(1)}">\n${content.trim()}\n</Callout>`
    }
  )
  
  return mdx
}

function generateComponentName(fileName) {
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Guide'
}

function extractTitle(content) {
  // Try to find H1
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }
  
  // Fallback to first line
  const firstLine = content.split('\n').find(line => line.trim())
  return firstLine.replace(/^#+\s*/, '').trim() || 'Guide'
}

function extractDescription(content) {
  // Try to find first paragraph after title
  const lines = content.split('\n')
  let foundTitle = false
  
  for (const line of lines) {
    if (line.startsWith('#') && !foundTitle) {
      foundTitle = true
      continue
    }
    if (foundTitle && line.trim() && !line.startsWith('#')) {
      return line.trim().replace(/^[*-]\s*/, '').substring(0, 160)
    }
  }
  
  return 'Guide documentation'
}

function migrateFile(sourcePath, targetDir, guideName) {
  const markdown = fs.readFileSync(sourcePath, 'utf-8')
  const fileName = path.basename(sourcePath, '.md')
  const componentName = generateComponentName(fileName)
  
  const { content: markdownContent } = extractFrontmatter(markdown)
  const title = extractTitle(markdownContent)
  const description = extractDescription(markdownContent)
  
  // Convert markdown to MDX
  const mdxContent = convertMarkdownToMDX(markdownContent)
  
  // Generate the page component
  const pageContent = MDX_TEMPLATE
    .replace(/{TITLE}/g, title)
    .replace(/{DESCRIPTION}/g, description)
    .replace(/{COMPONENT_NAME}/g, componentName)
    .replace(/{CONTENT}/g, mdxContent)
  
  // Create target directory
  const targetPath = path.join(targetDir, guideName || fileName)
  fs.mkdirSync(targetPath, { recursive: true })
  
  // Write page.tsx
  const pagePath = path.join(targetPath, 'page.tsx')
  fs.writeFileSync(pagePath, pageContent, 'utf-8')
  
  console.log(`✅ Migrated: ${sourcePath} → ${pagePath}`)
  return pagePath
}

// Main execution
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/migrate-docs-to-mdx.js <source-dir> <target-dir> [guide-name]')
  process.exit(1)
}

const sourceDir = args[0]
const targetDir = args[1]
const guideName = args[2]

if (!fs.existsSync(sourceDir)) {
  console.error(`Error: Source directory does not exist: ${sourceDir}`)
  process.exit(1)
}

// Create target directory
fs.mkdirSync(targetDir, { recursive: true })

// Migrate single file or directory
if (fs.statSync(sourceDir).isFile()) {
  migrateFile(sourceDir, targetDir, guideName)
} else {
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${files.length} markdown files to migrate`)
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    migrateFile(sourcePath, targetDir)
  }
}

console.log('\n✅ Migration complete!')
console.log('\n⚠️  Note: You may need to manually review and adjust the generated MDX files.')
console.log('   - Code blocks may need escaping adjustments')
console.log('   - Callouts may need format adjustments')
console.log('   - Links may need path updates')
