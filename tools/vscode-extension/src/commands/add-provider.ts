/**
 * Add Provider Command
 */

import * as vscode from 'vscode'

export async function addProviderCommand() {
  const provider = await vscode.window.showQuickPick(
    [
      { 
        label: 'OpenAI', 
        description: 'Add OpenAI (GPT-4, GPT-3.5)', 
        value: 'openai',
        package: 'openai',
        envVar: 'OPENAI_API_KEY',
        docsUrl: 'https://platform.openai.com/api-keys'
      },
      { 
        label: 'Anthropic', 
        description: 'Add Anthropic (Claude 3)', 
        value: 'anthropic',
        package: '@anthropic-ai/sdk',
        envVar: 'ANTHROPIC_API_KEY',
        docsUrl: 'https://console.anthropic.com/settings/keys'
      },
      { 
        label: 'Google AI', 
        description: 'Add Google AI (Gemini)', 
        value: 'google',
        package: '@google/generative-ai',
        envVar: 'GOOGLE_API_KEY',
        docsUrl: 'https://makersuite.google.com/app/apikey'
      }
    ],
    { placeHolder: 'Select provider to add' }
  )

  if (!provider) return

  // Show installation instructions
  const installAction = await vscode.window.showInformationMessage(
    `Add ${provider.label} to your project?`,
    'Install Package',
    'Setup Instructions',
    'Get API Key'
  )

  if (installAction === 'Install Package') {
    vscode.window.showInformationMessage(
      `Run: npm install ${provider.package}`,
      'Copy Command'
    ).then(selection => {
      if (selection === 'Copy Command') {
        vscode.env.clipboard.writeText(`npm install ${provider.package}`)
        vscode.window.showInformationMessage('Command copied to clipboard!')
      }
    })
  } else if (installAction === 'Setup Instructions') {
    showSetupInstructions(provider)
  } else if (installAction === 'Get API Key') {
    vscode.env.openExternal(vscode.Uri.parse(provider.docsUrl))
  }
}

function showSetupInstructions(provider: any) {
  const panel = vscode.window.createWebviewPanel(
    'claritySetup',
    `Setup ${provider.label}`,
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
        code {
          background: var(--vscode-textCodeBlock-background);
          padding: 2px 6px;
          border-radius: 3px;
        }
        pre {
          background: var(--vscode-textCodeBlock-background);
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
        }
        .step {
          margin: 20px 0;
          padding: 15px;
          border-left: 3px solid var(--vscode-textLink-foreground);
          background: var(--vscode-editor-background);
        }
        a {
          color: var(--vscode-textLink-foreground);
        }
      </style>
    </head>
    <body>
      <h1>Setup ${provider.label}</h1>
      
      <div class="step">
        <h3>Step 1: Install Package</h3>
        <pre>npm install ${provider.package}</pre>
      </div>

      <div class="step">
        <h3>Step 2: Get API Key</h3>
        <p>Visit <a href="${provider.docsUrl}">${provider.docsUrl}</a> to get your API key.</p>
      </div>

      <div class="step">
        <h3>Step 3: Add to .env.local</h3>
        <pre>${provider.envVar}=your-api-key-here</pre>
      </div>

      <div class="step">
        <h3>Step 4: Use in Code</h3>
        <pre>${getProviderExample(provider.value)}</pre>
      </div>
    </body>
    </html>
  `
}

function getProviderExample(provider: string): string {
  const examples: Record<string, string> = {
    openai: `import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }]
})

console.log(response.choices[0].message.content)`,

    anthropic: `import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }]
})

console.log(response.content[0].text)`,

    google: `import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const result = await model.generateContent('Hello!')
const response = await result.response
console.log(response.text())`
  }

  return examples[provider] || ''
}
