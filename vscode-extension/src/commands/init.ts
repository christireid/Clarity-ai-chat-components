/**
 * Initialize Project Command
 */

import * as vscode from 'vscode'

export async function initProjectCommand() {
  // Get workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open')
    return
  }

  // Select provider
  const provider = await vscode.window.showQuickPick(
    [
      { label: 'OpenAI', description: 'GPT-4, GPT-3.5 Turbo', value: 'openai' },
      { label: 'Anthropic', description: 'Claude 3 Opus, Sonnet, Haiku', value: 'anthropic' },
      { label: 'Google AI', description: 'Gemini Pro', value: 'google' },
      { label: 'All Providers', description: 'Include all AI providers', value: 'all' }
    ],
    { placeHolder: 'Select AI provider(s) to use' }
  )

  if (!provider) return

  // Select framework
  const framework = await vscode.window.showQuickPick(
    [
      { label: 'Next.js', description: 'React framework with API routes', value: 'nextjs' },
      { label: 'Express', description: 'Node.js web framework', value: 'express' },
      { label: 'Hono', description: 'Lightweight web framework', value: 'hono' },
      { label: 'Standalone', description: 'No framework, just the SDK', value: 'standalone' }
    ],
    { placeHolder: 'Select framework' }
  )

  if (!framework) return

  // Show progress
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Initializing Clarity Chat project...',
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0, message: 'Creating files...' })

    // Create .env.local template
    const envContent = generateEnvTemplate(provider.value)
    await createFile('.env.local', envContent)

    progress.report({ increment: 33, message: 'Installing dependencies...' })

    // Create package.json snippet or show installation instructions
    const installInstructions = generateInstallInstructions(provider.value, framework.value)
    
    progress.report({ increment: 66, message: 'Creating example code...' })

    // Create example file
    const exampleCode = generateExampleCode(provider.value, framework.value)
    const fileName = framework.value === 'nextjs' ? 'app/api/chat/route.ts' : 'src/index.ts'
    await createFile(fileName, exampleCode)

    progress.report({ increment: 100, message: 'Done!' })

    vscode.window.showInformationMessage(
      'Clarity Chat project initialized!',
      'View Files',
      'Install Dependencies'
    ).then(selection => {
      if (selection === 'View Files') {
        vscode.commands.executeCommand('workbench.view.explorer')
      } else if (selection === 'Install Dependencies') {
        vscode.window.showInformationMessage(installInstructions)
      }
    })
  })
}

function generateEnvTemplate(provider: string): string {
  const lines: string[] = [
    '# Clarity Chat Environment Variables',
    '# Add your API keys below',
    ''
  ]

  if (provider === 'openai' || provider === 'all') {
    lines.push(
      '# OpenAI API Key',
      '# Get from: https://platform.openai.com/api-keys',
      'OPENAI_API_KEY=sk-...',
      ''
    )
  }

  if (provider === 'anthropic' || provider === 'all') {
    lines.push(
      '# Anthropic API Key',
      '# Get from: https://console.anthropic.com/settings/keys',
      'ANTHROPIC_API_KEY=sk-ant-...',
      ''
    )
  }

  if (provider === 'google' || provider === 'all') {
    lines.push(
      '# Google AI API Key',
      '# Get from: https://makersuite.google.com/app/apikey',
      'GOOGLE_API_KEY=...',
      ''
    )
  }

  return lines.join('\n')
}

function generateInstallInstructions(provider: string, framework: string): string {
  const packages: string[] = []

  if (provider === 'openai' || provider === 'all') {
    packages.push('openai')
  }
  if (provider === 'anthropic' || provider === 'all') {
    packages.push('@anthropic-ai/sdk')
  }
  if (provider === 'google' || provider === 'all') {
    packages.push('@google/generative-ai')
  }

  if (framework === 'express') {
    packages.push('express')
  } else if (framework === 'hono') {
    packages.push('hono')
  }

  return `npm install ${packages.join(' ')}`
}

function generateExampleCode(provider: string, framework: string): string {
  // Generate different example based on provider and framework
  // This is a simplified version - full implementation would have more variations
  
  if (framework === 'nextjs') {
    return `import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: message }]
    })

    return NextResponse.json({
      content: response.choices[0].message.content
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
`
  }

  return `import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ]
  })

  console.log(response.choices[0].message.content)
}

main()
`
}

async function createFile(relativePath: string, content: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return

  const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, relativePath)
  
  try {
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'))
  } catch (error) {
    console.error(`Failed to create file ${relativePath}:`, error)
  }
}
