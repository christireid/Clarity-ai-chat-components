/**
 * Hover Provider for Clarity Chat
 * 
 * Provides documentation on hover for AI models and APIs
 */

import * as vscode from 'vscode'

interface ModelInfo {
  name: string
  provider: string
  description: string
  contextWindow: string
  pricing: {
    input: string
    output: string
  }
  capabilities: string[]
  bestFor: string[]
  docs: string
}

const MODEL_INFO: Record<string, ModelInfo> = {
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'The latest GPT-4 model with improved performance and 128K context window',
    contextWindow: '128,000 tokens',
    pricing: {
      input: '$0.01 per 1K tokens',
      output: '$0.03 per 1K tokens'
    },
    capabilities: ['Text generation', 'Code generation', 'Function calling', 'JSON mode'],
    bestFor: ['Complex reasoning', 'Long-form content', 'Code generation', 'Analysis'],
    docs: 'https://platform.openai.com/docs/models/gpt-4-turbo'
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'OpenAI\'s most capable model for complex tasks',
    contextWindow: '8,192 tokens',
    pricing: {
      input: '$0.03 per 1K tokens',
      output: '$0.06 per 1K tokens'
    },
    capabilities: ['Text generation', 'Code generation', 'Function calling'],
    bestFor: ['Complex reasoning', 'Creative writing', 'Technical analysis'],
    docs: 'https://platform.openai.com/docs/models/gpt-4'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient model for most tasks',
    contextWindow: '16,385 tokens',
    pricing: {
      input: '$0.0005 per 1K tokens',
      output: '$0.0015 per 1K tokens'
    },
    capabilities: ['Text generation', 'Code generation', 'Function calling'],
    bestFor: ['Quick responses', 'Simple tasks', 'Cost efficiency'],
    docs: 'https://platform.openai.com/docs/models/gpt-3-5-turbo'
  },
  'claude-3-opus-20240229': {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable Claude model for complex tasks',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.015 per 1K tokens',
      output: '$0.075 per 1K tokens'
    },
    capabilities: ['Text generation', 'Analysis', 'Code generation', 'Vision'],
    bestFor: ['Complex analysis', 'Creative writing', 'Research', 'Long documents'],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview'
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced Claude model for everyday tasks',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.003 per 1K tokens',
      output: '$0.015 per 1K tokens'
    },
    capabilities: ['Text generation', 'Analysis', 'Code generation', 'Vision'],
    bestFor: ['Balanced performance', 'General tasks', 'Cost efficiency'],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview'
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fastest Claude model for quick responses',
    contextWindow: '200,000 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.00125 per 1K tokens'
    },
    capabilities: ['Text generation', 'Analysis', 'Vision'],
    bestFor: ['Speed', 'Simple tasks', 'High volume', 'Cost efficiency'],
    docs: 'https://docs.anthropic.com/claude/docs/models-overview'
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s multimodal AI model for text tasks',
    contextWindow: '32,768 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.0005 per 1K tokens'
    },
    capabilities: ['Text generation', 'Code generation', 'Analysis'],
    bestFor: ['General tasks', 'Cost efficiency', 'Fast responses'],
    docs: 'https://ai.google.dev/models/gemini'
  },
  'gemini-pro-vision': {
    name: 'Gemini Pro Vision',
    provider: 'Google',
    description: 'Gemini Pro with vision capabilities',
    contextWindow: '16,384 tokens',
    pricing: {
      input: '$0.00025 per 1K tokens',
      output: '$0.0005 per 1K tokens'
    },
    capabilities: ['Text generation', 'Image understanding', 'Analysis'],
    bestFor: ['Image analysis', 'Multimodal tasks', 'Visual Q&A'],
    docs: 'https://ai.google.dev/models/gemini'
  }
}

export class HoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, /['"][\w\-]+['"]/g)
    if (!range) return

    const word = document.getText(range).replace(/['"]/g, '')
    
    // Check if it's a model name
    const modelInfo = MODEL_INFO[word]
    if (modelInfo) {
      return new vscode.Hover(this.createModelHover(modelInfo))
    }

    // Check for environment variables
    if (word.includes('API_KEY')) {
      return new vscode.Hover(this.createEnvVarHover(word))
    }

    return undefined
  }

  private createModelHover(info: ModelInfo): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.supportHtml = true
    md.isTrusted = true

    md.appendMarkdown(`## ${info.name}\n\n`)
    md.appendMarkdown(`**Provider:** ${info.provider}\n\n`)
    md.appendMarkdown(`${info.description}\n\n`)
    md.appendMarkdown(`---\n\n`)
    md.appendMarkdown(`**Context Window:** ${info.contextWindow}\n\n`)
    md.appendMarkdown(`**Pricing:**\n`)
    md.appendMarkdown(`- Input: ${info.pricing.input}\n`)
    md.appendMarkdown(`- Output: ${info.pricing.output}\n\n`)
    md.appendMarkdown(`**Capabilities:**\n`)
    info.capabilities.forEach(cap => {
      md.appendMarkdown(`- ${cap}\n`)
    })
    md.appendMarkdown(`\n**Best For:**\n`)
    info.bestFor.forEach(use => {
      md.appendMarkdown(`- ${use}\n`)
    })
    md.appendMarkdown(`\n---\n\n`)
    md.appendMarkdown(`[📖 Documentation](${info.docs})`)

    return md
  }

  private createEnvVarHover(envVar: string): vscode.MarkdownString {
    const md = new vscode.MarkdownString()
    md.supportHtml = true
    md.isTrusted = true

    const envDocs: Record<string, { provider: string; url: string; description: string }> = {
      'OPENAI_API_KEY': {
        provider: 'OpenAI',
        url: 'https://platform.openai.com/api-keys',
        description: 'Your OpenAI API key for accessing GPT models'
      },
      'ANTHROPIC_API_KEY': {
        provider: 'Anthropic',
        url: 'https://console.anthropic.com/settings/keys',
        description: 'Your Anthropic API key for accessing Claude models'
      },
      'GOOGLE_API_KEY': {
        provider: 'Google AI',
        url: 'https://makersuite.google.com/app/apikey',
        description: 'Your Google AI API key for accessing Gemini models'
      }
    }

    const info = envDocs[envVar]
    if (info) {
      md.appendMarkdown(`## ${envVar}\n\n`)
      md.appendMarkdown(`**Provider:** ${info.provider}\n\n`)
      md.appendMarkdown(`${info.description}\n\n`)
      md.appendMarkdown(`**Setup:**\n`)
      md.appendMarkdown(`1. Get your API key from [${info.provider}](${info.url})\n`)
      md.appendMarkdown(`2. Add to your \`.env.local\` file:\n`)
      md.appendMarkdown(`\`\`\`bash\n${envVar}=your-api-key-here\n\`\`\`\n`)
      md.appendMarkdown(`3. Load in your code:\n`)
      md.appendMarkdown(`\`\`\`typescript\nconst apiKey = process.env.${envVar}\n\`\`\`\n`)
    }

    return md
  }
}
