/**
 * Open External Commands
 * Commands to open documentation, Storybook, and other external resources
 */

import * as vscode from 'vscode'

const URLS = {
  docs: 'https://docs.claritychat.dev',
  storybook: 'https://storybook.claritychat.dev',
  github: 'https://github.com/code-and-clarity/clarity-chat',
  examples:
    'https://github.com/code-and-clarity/clarity-chat/tree/main/examples',
  discord: 'https://discord.gg/claritychat',
  changelog:
    'https://github.com/code-and-clarity/clarity-chat/blob/main/CHANGELOG.md',
}

/**
 * Open Documentation
 */
export async function openDocsCommand() {
  // Ask what documentation to open
  const selection = await vscode.window.showQuickPick(
    [
      {
        label: '$(home) Getting Started',
        description: 'Quick start guide',
        value: '/getting-started',
      },
      {
        label: '$(symbol-class) Components',
        description: 'Component reference',
        value: '/components',
      },
      {
        label: '$(symbol-method) Hooks',
        description: 'Hooks reference',
        value: '/hooks',
      },
      {
        label: '$(cloud) API Routes',
        description: 'Server-side setup',
        value: '/api-routes',
      },
      {
        label: '$(database) Memory Management',
        description: 'Conversation memory',
        value: '/memory',
      },
      {
        label: '$(dashboard) Token Optimization',
        description: 'Cost optimization',
        value: '/token-optimization',
      },
      {
        label: '$(sync) Migration Guide',
        description: 'From Vercel AI SDK',
        value: '/migration',
      },
      {
        label: '$(book) API Reference',
        description: 'Full API docs',
        value: '/api',
      },
      {
        label: '$(file-code) Examples',
        description: 'Code examples',
        value: '/examples',
      },
    ],
    {
      placeHolder: 'What documentation do you need?',
      title: 'Clarity Chat Documentation',
    }
  )

  if (!selection) return

  const url = `${URLS.docs}${selection.value}`
  vscode.env.openExternal(vscode.Uri.parse(url))
}

/**
 * Open Storybook
 */
export async function openStorybookCommand() {
  // Ask what component to view
  const selection = await vscode.window.showQuickPick(
    [
      {
        label: '$(home) All Components',
        description: 'Browse all components',
        value: '',
      },
      {
        label: '$(symbol-class) ClarityChat',
        description: 'Main chat component',
        value: '?path=/docs/components-claritychat--docs',
      },
      {
        label: '$(list-ordered) MessageList',
        description: 'Message display',
        value: '?path=/docs/components-messagelist--docs',
      },
      {
        label: '$(edit) ChatInput',
        description: 'Input component',
        value: '?path=/docs/components-chatinput--docs',
      },
      {
        label: '$(pulse) StreamingMessage',
        description: 'Streaming text',
        value: '?path=/docs/components-streamingmessage--docs',
      },
      {
        label: '$(database) MemoryProvider',
        description: 'Memory context',
        value: '?path=/docs/providers-memoryprovider--docs',
      },
    ],
    {
      placeHolder: 'Select component to view in Storybook',
      title: 'Clarity Chat Storybook',
    }
  )

  if (!selection) return

  const url = `${URLS.storybook}${selection.value}`
  vscode.env.openExternal(vscode.Uri.parse(url))
}

/**
 * Open GitHub Repository
 */
export async function openGitHubCommand() {
  const selection = await vscode.window.showQuickPick(
    [
      {
        label: '$(github) Repository',
        description: 'Main repository',
        value: URLS.github,
      },
      {
        label: '$(issues) Issues',
        description: 'Report bugs or request features',
        value: `${URLS.github}/issues`,
      },
      {
        label: '$(git-pull-request) Pull Requests',
        description: 'Contribute',
        value: `${URLS.github}/pulls`,
      },
      {
        label: '$(file-code) Examples',
        description: 'Example projects',
        value: URLS.examples,
      },
      {
        label: '$(history) Changelog',
        description: 'Version history',
        value: URLS.changelog,
      },
    ],
    {
      placeHolder: 'Select what to open',
      title: 'Clarity Chat on GitHub',
    }
  )

  if (!selection) return

  vscode.env.openExternal(vscode.Uri.parse(selection.value))
}

/**
 * Join Discord Community
 */
export function openDiscordCommand() {
  vscode.env.openExternal(vscode.Uri.parse(URLS.discord))
}

/**
 * Show Quick Links
 */
export async function showQuickLinksCommand() {
  const selection = await vscode.window.showQuickPick(
    [
      {
        label: '$(book) Documentation',
        description: 'Complete guides and API reference',
        value: 'docs',
      },
      {
        label: '$(preview) Storybook',
        description: 'Interactive component playground',
        value: 'storybook',
      },
      {
        label: '$(github) GitHub',
        description: 'Source code and issues',
        value: 'github',
      },
      {
        label: '$(comment-discussion) Discord',
        description: 'Community support',
        value: 'discord',
      },
      {
        label: '$(file-code) Examples',
        description: 'Sample projects',
        value: 'examples',
      },
    ],
    {
      placeHolder: 'Quick Links',
      title: 'Clarity Chat Resources',
    }
  )

  if (!selection) return

  switch (selection.value) {
    case 'docs':
      await openDocsCommand()
      break
    case 'storybook':
      await openStorybookCommand()
      break
    case 'github':
      await openGitHubCommand()
      break
    case 'discord':
      openDiscordCommand()
      break
    case 'examples':
      vscode.env.openExternal(vscode.Uri.parse(URLS.examples))
      break
  }
}
