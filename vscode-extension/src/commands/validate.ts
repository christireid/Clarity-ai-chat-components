/**
 * Validate Configuration Command
 */

import * as vscode from 'vscode'

export async function validateConfigCommand() {
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Validating Clarity Chat configuration...',
    cancellable: false
  }, async (progress) => {
    const issues: string[] = []
    const warnings: string[] = []

    progress.report({ increment: 0, message: 'Checking package.json...' })
    
    // Check if package.json exists
    const hasPackageJson = await checkFileExists('package.json')
    if (!hasPackageJson) {
      issues.push('package.json not found')
    }

    progress.report({ increment: 20, message: 'Checking dependencies...' })

    // Check for AI SDKs
    const packageJson = await readPackageJson()
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      if (!deps['openai'] && !deps['@anthropic-ai/sdk'] && !deps['@google/generative-ai']) {
        warnings.push('No AI provider SDK installed')
      }
    }

    progress.report({ increment: 40, message: 'Checking environment variables...' })

    // Check for .env.local
    const hasEnvFile = await checkFileExists('.env.local') || await checkFileExists('.env')
    if (!hasEnvFile) {
      warnings.push('.env.local file not found - API keys may not be configured')
    }

    progress.report({ increment: 60, message: 'Checking TypeScript configuration...' })

    // Check tsconfig.json
    const hasTsConfig = await checkFileExists('tsconfig.json')
    if (hasTsConfig) {
      const tsConfig = await readTsConfig()
      if (tsConfig && !tsConfig.compilerOptions?.strict) {
        warnings.push('TypeScript strict mode is not enabled')
      }
    }

    progress.report({ increment: 80, message: 'Checking for common issues...' })

    // Check for common anti-patterns in code
    await checkCodePatterns(issues, warnings)

    progress.report({ increment: 100, message: 'Done!' })

    // Show results
    showValidationResults(issues, warnings)
  })
}

async function checkFileExists(path: string): Promise<boolean> {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return false

  try {
    const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, path)
    await vscode.workspace.fs.stat(uri)
    return true
  } catch {
    return false
  }
}

async function readPackageJson(): Promise<any> {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return null

  try {
    const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, 'package.json')
    const content = await vscode.workspace.fs.readFile(uri)
    return JSON.parse(Buffer.from(content).toString('utf8'))
  } catch {
    return null
  }
}

async function readTsConfig(): Promise<any> {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return null

  try {
    const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, 'tsconfig.json')
    const content = await vscode.workspace.fs.readFile(uri)
    return JSON.parse(Buffer.from(content).toString('utf8'))
  } catch {
    return null
  }
}

async function checkCodePatterns(issues: string[], warnings: string[]) {
  // Find all TypeScript/JavaScript files
  const files = await vscode.workspace.findFiles('**/*.{ts,tsx,js,jsx}', '**/node_modules/**')
  
  for (const file of files.slice(0, 50)) { // Limit to first 50 files for performance
    const document = await vscode.workspace.openTextDocument(file)
    const text = document.getText()

    // Check for hardcoded API keys
    if (/['"]sk-[a-zA-Z0-9]{48,}['"]/.test(text)) {
      issues.push(`Possible hardcoded API key in ${file.path}`)
    }

    // Check for missing error handling
    if (/await\s+\w+\.chat\.completions\.create\(/.test(text) && !text.includes('try') && !text.includes('catch')) {
      warnings.push(`Missing error handling for API call in ${file.path}`)
    }
  }
}

function showValidationResults(issues: string[], warnings: string[]) {
  if (issues.length === 0 && warnings.length === 0) {
    vscode.window.showInformationMessage('✅ Configuration is valid! No issues found.')
    return
  }

  const panel = vscode.window.createWebviewPanel(
    'validationResults',
    'Clarity Chat Validation Results',
    vscode.ViewColumn.One,
    {}
  )

  panel.webview.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: var(--vscode-font-family);
          padding: 20px;
          color: var(--vscode-foreground);
        }
        h1 { color: var(--vscode-textLink-foreground); }
        .issue {
          margin: 10px 0;
          padding: 10px;
          border-left: 3px solid #f44336;
          background: rgba(244, 67, 54, 0.1);
        }
        .warning {
          margin: 10px 0;
          padding: 10px;
          border-left: 3px solid #ff9800;
          background: rgba(255, 152, 0, 0.1);
        }
        .success {
          margin: 10px 0;
          padding: 10px;
          border-left: 3px solid #4caf50;
          background: rgba(76, 175, 80, 0.1);
        }
        .icon {
          font-size: 20px;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Validation Results</h1>
      
      ${issues.length === 0 && warnings.length === 0 ? `
        <div class="success">
          <span class="icon">✅</span>
          <strong>All checks passed!</strong>
        </div>
      ` : ''}

      ${issues.length > 0 ? `
        <h2>❌ Issues (${issues.length})</h2>
        ${issues.map(issue => `<div class="issue"><span class="icon">❌</span>${issue}</div>`).join('')}
      ` : ''}

      ${warnings.length > 0 ? `
        <h2>⚠️ Warnings (${warnings.length})</h2>
        ${warnings.map(warning => `<div class="warning"><span class="icon">⚠️</span>${warning}</div>`).join('')}
      ` : ''}
    </body>
    </html>
  `
}
