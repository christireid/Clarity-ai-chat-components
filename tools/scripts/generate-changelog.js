#!/usr/bin/env node

/**
 * Automated Changelog Generator
 * 
 * Generates a beautiful, human-readable changelog from changesets
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const config = {
  changesetDir: path.join(__dirname, '../.changeset'),
  outputFile: path.join(__dirname, '../CHANGELOG.md'),
  templateFile: path.join(__dirname, '../.changeset/CHANGELOG_TEMPLATE.md'),
}

// Get all changeset files
function getChangesetFiles() {
  const files = fs.readdirSync(config.changesetDir)
  return files.filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'CHANGELOG_TEMPLATE.md')
}

// Parse a changeset file
function parseChangeset(filename) {
  const content = fs.readFileSync(path.join(config.changesetDir, filename), 'utf8')
  const [frontmatter, ...bodyParts] = content.split('---')
  const body = bodyParts.join('---').trim()
  
  // Parse YAML frontmatter
  const packages = {}
  const lines = frontmatter.split('\n').filter(line => line.trim())
  
  lines.forEach(line => {
    const match = line.match(/"(@clarity-chat\/[^"]+)":\s*(\w+)/)
    if (match) {
      packages[match[1]] = match[2]
    }
  })
  
  return { packages, description: body, file: filename }
}

// Group changesets by package
function groupByPackage(changesets) {
  const grouped = {}
  
  changesets.forEach(changeset => {
    Object.entries(changeset.packages).forEach(([pkg, type]) => {
      if (!grouped[pkg]) {
        grouped[pkg] = { major: [], minor: [], patch: [] }
      }
      grouped[pkg][type].push(changeset)
    })
  })
  
  return grouped
}

// Format changelog entry
function formatEntry(changeset) {
  const description = changeset.description.split('\n')[0] // First line
  return `- ${description}`
}

// Generate changelog
function generateChangelog() {
  console.log('📝 Generating changelog...\n')
  
  // Get all changesets
  const changesetFiles = getChangesetFiles()
  
  if (changesetFiles.length === 0) {
    console.log('ℹ️  No changesets found')
    return
  }
  
  console.log(`Found ${changesetFiles.length} changeset(s)\n`)
  
  // Parse all changesets
  const changesets = changesetFiles.map(parseChangeset)
  
  // Group by package
  const grouped = groupByPackage(changesets)
  
  // Get current date
  const date = new Date().toISOString().split('T')[0]
  
  // Build changelog
  let changelog = `# Changelog\n\n`
  changelog += `## Unreleased (${date})\n\n`
  
  Object.entries(grouped).forEach(([pkg, types]) => {
    changelog += `### ${pkg}\n\n`
    
    if (types.major.length > 0) {
      changelog += `#### 💥 Breaking Changes\n\n`
      types.major.forEach(cs => {
        changelog += formatEntry(cs) + '\n'
      })
      changelog += '\n'
    }
    
    if (types.minor.length > 0) {
      changelog += `#### ✨ Features\n\n`
      types.minor.forEach(cs => {
        changelog += formatEntry(cs) + '\n'
      })
      changelog += '\n'
    }
    
    if (types.patch.length > 0) {
      changelog += `#### 🐛 Bug Fixes\n\n`
      types.patch.forEach(cs => {
        changelog += formatEntry(cs) + '\n'
      })
      changelog += '\n'
    }
  })
  
  // Read existing changelog if it exists
  let existingChangelog = ''
  if (fs.existsSync(config.outputFile)) {
    existingChangelog = fs.readFileSync(config.outputFile, 'utf8')
    // Remove the "# Changelog" header from existing
    existingChangelog = existingChangelog.replace(/^# Changelog\n\n/, '')
  }
  
  // Write new changelog
  fs.writeFileSync(config.outputFile, changelog + existingChangelog)
  
  console.log(`✅ Changelog generated: ${config.outputFile}\n`)
  console.log('📋 Summary:')
  console.log(`   - Packages affected: ${Object.keys(grouped).length}`)
  console.log(`   - Changesets processed: ${changesets.length}\n`)
}

// Run generator
try {
  generateChangelog()
} catch (error) {
  console.error('❌ Error generating changelog:', error.message)
  process.exit(1)
}
