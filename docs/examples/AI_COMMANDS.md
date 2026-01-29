# AI-Specific Command Palette Examples

> **Comprehensive catalog of AI command patterns for CommandPalette component**
>
> Last Updated: January 28, 2026

## Table of Contents

1. [Overview](#overview)
2. [Conversation Management](#conversation-management)
3. [Content Generation](#content-generation)
4. [Analysis Commands](#analysis-commands)
5. [Export & Import Commands](#export--import-commands)
6. [Settings & Configuration](#settings--configuration)
7. [Model & Provider Commands](#model--provider-commands)
8. [Memory & Context Commands](#memory--context-commands)
9. [Advanced Patterns](#advanced-patterns)
10. [Complete Examples](#complete-examples)

---

## Overview

The `CommandPalette` component provides a keyboard-driven command interface for AI chat applications. This guide catalogs common AI-specific command patterns organized by category.

### Basic Structure

```tsx
import { CommandPalette, type CommandItem } from '@clarity-chat/react'

const commands: CommandItem[] = [
  {
    id: 'unique-id',
    label: 'Command Label',
    description: 'What this command does',
    icon: <IconComponent />,
    shortcut: ['cmd', 'k'],
    category: 'Category Name',
    onSelect: () => {
      // Command implementation
    },
  },
]
```

### Key Features

- **Keyboard Navigation**: Arrow keys, Enter, Escape
- **Fuzzy Search**: Search by label, description, or category
- **AI Context Display**: Model, conversation, token usage
- **Category Grouping**: Organized command structure
- **Accessibility**: Full ARIA support, screen reader compatible

---

## Conversation Management

Commands for managing conversations, branches, and chat history.

### New Conversation

```tsx
import { MessageSquarePlus } from 'lucide-react'

const newConversationCommand: CommandItem = {
  id: 'conversation-new',
  label: 'New Conversation',
  description: 'Start a fresh conversation',
  icon: <MessageSquarePlus className="w-5 h-5" />,
  shortcut: ['cmd', 'n'],
  category: 'Conversation',
  onSelect: () => {
    // Clear current messages
    clearMessages()
    // Reset conversation state
    resetConversation()
    // Optional: Navigate to new conversation
    router.push('/chat/new')
  },
}
```

### Save Conversation

```tsx
import { Save } from 'lucide-react'

const saveConversationCommand: CommandItem = {
  id: 'conversation-save',
  label: 'Save Conversation',
  description: 'Save current conversation to history',
  icon: <Save className="w-5 h-5" />,
  shortcut: ['cmd', 's'],
  category: 'Conversation',
  onSelect: async () => {
    const conversationId = await saveConversation({
      messages,
      metadata: {
        title: generateTitle(messages),
        timestamp: Date.now(),
      },
    })
    showToast({
      title: 'Conversation saved',
      description: `ID: ${conversationId}`,
    })
  },
}
```

### Load Previous Conversation

```tsx
import { FolderOpen } from 'lucide-react'

const loadConversationCommand: CommandItem = {
  id: 'conversation-load',
  label: 'Load Conversation',
  description: 'Open a saved conversation',
  icon: <FolderOpen className="w-5 h-5" />,
  shortcut: ['cmd', 'o'],
  category: 'Conversation',
  onSelect: () => {
    // Open conversation selector modal
    openConversationSelector({
      onSelect: (conversationId) => {
        loadConversation(conversationId)
      },
    })
  },
}
```

### Delete Conversation

```tsx
import { Trash2 } from 'lucide-react'

const deleteConversationCommand: CommandItem = {
  id: 'conversation-delete',
  label: 'Delete Conversation',
  description: 'Permanently delete current conversation',
  icon: <Trash2 className="w-5 h-5 text-destructive" />,
  category: 'Conversation',
  onSelect: () => {
    openConfirmDialog({
      title: 'Delete Conversation?',
      description: 'This action cannot be undone.',
      onConfirm: async () => {
        await deleteConversation(currentConversationId)
        clearMessages()
        router.push('/chat/new')
      },
    })
  },
}
```

### Branch Conversation

```tsx
import { GitBranch } from 'lucide-react'

const branchConversationCommand: CommandItem = {
  id: 'conversation-branch',
  label: 'Branch from Here',
  description: 'Create a new branch from selected message',
  icon: <GitBranch className="w-5 h-5" />,
  shortcut: ['cmd', 'b'],
  category: 'Conversation',
  onSelect: () => {
    if (!selectedMessageId) {
      showToast({
        title: 'No message selected',
        variant: 'warning',
      })
      return
    }

    const branchPoint = messages.findIndex((m) => m.id === selectedMessageId)
    const branchedMessages = messages.slice(0, branchPoint + 1)

    createBranch({
      parentId: currentConversationId,
      messages: branchedMessages,
      metadata: {
        branchPoint: selectedMessageId,
        timestamp: Date.now(),
      },
    })
  },
}
```

### Search Conversations

```tsx
import { Search } from 'lucide-react'

const searchConversationsCommand: CommandItem = {
  id: 'conversation-search',
  label: 'Search Conversations',
  description: 'Find messages across all conversations',
  icon: <Search className="w-5 h-5" />,
  shortcut: ['cmd', 'f'],
  category: 'Conversation',
  onSelect: () => {
    openSearchPanel({
      scope: 'all-conversations',
      filters: ['messages', 'titles', 'metadata'],
    })
  },
}
```

---

## Content Generation

Commands for AI-powered content creation and transformation.

### Generate Summary

```tsx
import { FileText } from 'lucide-react'

const generateSummaryCommand: CommandItem = {
  id: 'generate-summary',
  label: 'Generate Summary',
  description: 'Summarize the current conversation',
  icon: <FileText className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 's'],
  category: 'Generate',
  onSelect: async () => {
    setIsGenerating(true)
    try {
      const summary = await generateSummary({
        messages,
        format: 'markdown',
        maxLength: 500,
      })

      // Append summary as assistant message
      appendMessage({
        role: 'assistant',
        content: `## Conversation Summary\n\n${summary}`,
        metadata: { type: 'summary' },
      })
    } finally {
      setIsGenerating(false)
    }
  },
}
```

### Generate Action Items

```tsx
import { CheckSquare } from 'lucide-react'

const generateActionItemsCommand: CommandItem = {
  id: 'generate-actions',
  label: 'Extract Action Items',
  description: 'Generate actionable tasks from conversation',
  icon: <CheckSquare className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 'a'],
  category: 'Generate',
  onSelect: async () => {
    const actionItems = await extractActionItems({
      messages,
      format: 'checklist',
    })

    openSidebar({
      title: 'Action Items',
      content: <ActionItemsList items={actionItems} />,
    })
  },
}
```

### Generate Code

```tsx
import { Code2 } from 'lucide-react'

const generateCodeCommand: CommandItem = {
  id: 'generate-code',
  label: 'Generate Code',
  description: 'Transform description into code',
  icon: <Code2 className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 'c'],
  category: 'Generate',
  onSelect: () => {
    openPromptDialog({
      title: 'Generate Code',
      placeholder: 'Describe the code you want to generate...',
      suggestions: [
        'Create a React component that...',
        'Write a function to...',
        'Build an API endpoint for...',
      ],
      onSubmit: async (prompt) => {
        const code = await generateCode({
          prompt,
          language: preferredLanguage,
          framework: preferredFramework,
        })

        appendMessage({
          role: 'assistant',
          content: `\`\`\`${preferredLanguage}\n${code}\n\`\`\``,
        })
      },
    })
  },
}
```

### Generate Documentation

```tsx
import { BookOpen } from 'lucide-react'

const generateDocsCommand: CommandItem = {
  id: 'generate-docs',
  label: 'Generate Documentation',
  description: 'Create documentation from conversation',
  icon: <BookOpen className="w-5 h-5" />,
  category: 'Generate',
  onSelect: async () => {
    const docs = await generateDocumentation({
      messages,
      format: 'markdown',
      sections: ['overview', 'examples', 'api-reference'],
    })

    downloadFile({
      content: docs,
      filename: `documentation-${Date.now()}.md`,
      type: 'text/markdown',
    })
  },
}
```

### Rewrite in Different Style

```tsx
import { Wand2 } from 'lucide-react'

const rewriteStyleCommand: CommandItem = {
  id: 'generate-rewrite',
  label: 'Rewrite in Different Style',
  description: 'Transform text style or tone',
  icon: <Wand2 className="w-5 h-5" />,
  category: 'Generate',
  onSelect: () => {
    if (!selectedText) {
      showToast({
        title: 'No text selected',
        variant: 'warning',
      })
      return
    }

    openStyleSelector({
      styles: [
        'professional',
        'casual',
        'academic',
        'creative',
        'concise',
        'detailed',
      ],
      onSelect: async (style) => {
        const rewritten = await rewriteText({
          text: selectedText,
          style,
        })

        appendMessage({
          role: 'assistant',
          content: `**Rewritten (${style}):**\n\n${rewritten}`,
        })
      },
    })
  },
}
```

---

## Analysis Commands

Commands for analyzing content, data, and conversations.

### Analyze Sentiment

```tsx
import { BarChart3 } from 'lucide-react'

const analyzeSentimentCommand: CommandItem = {
  id: 'analyze-sentiment',
  label: 'Analyze Sentiment',
  description: 'Analyze emotional tone of conversation',
  icon: <BarChart3 className="w-5 h-5" />,
  category: 'Analysis',
  onSelect: async () => {
    const analysis = await analyzeSentiment({
      messages,
      granularity: 'message',
    })

    openVisualizationPanel({
      title: 'Sentiment Analysis',
      data: analysis,
      chartType: 'line',
    })
  },
}
```

### Analyze Token Usage

```tsx
import { Activity } from 'lucide-react'

const analyzeTokensCommand: CommandItem = {
  id: 'analyze-tokens',
  label: 'Analyze Token Usage',
  description: 'View detailed token consumption metrics',
  icon: <Activity className="w-5 h-5" />,
  shortcut: ['cmd', 't'],
  category: 'Analysis',
  onSelect: () => {
    const tokenStats = calculateTokenStats(messages)

    openDashboard({
      title: 'Token Analysis',
      metrics: [
        {
          label: 'Total Tokens',
          value: tokenStats.total,
          trend: calculateTrend(tokenStats),
        },
        {
          label: 'Input Tokens',
          value: tokenStats.input,
          percentage: (tokenStats.input / tokenStats.total) * 100,
        },
        {
          label: 'Output Tokens',
          value: tokenStats.output,
          percentage: (tokenStats.output / tokenStats.total) * 100,
        },
        {
          label: 'Estimated Cost',
          value: calculateCost(tokenStats, currentModel),
          format: 'currency',
        },
      ],
    })
  },
}
```

### Detect Topics

```tsx
import { Tags } from 'lucide-react'

const detectTopicsCommand: CommandItem = {
  id: 'analyze-topics',
  label: 'Detect Topics',
  description: 'Identify main themes and topics',
  icon: <Tags className="w-5 h-5" />,
  category: 'Analysis',
  onSelect: async () => {
    const topics = await detectTopics({
      messages,
      maxTopics: 10,
      confidence: 0.7,
    })

    openSidebar({
      title: 'Detected Topics',
      content: (
        <TopicCloud
          topics={topics}
          onTopicClick={(topic) => {
            searchConversation({ query: topic.name })
          }}
        />
      ),
    })
  },
}
```

### Quality Check

```tsx
import { CheckCircle2 } from 'lucide-react'

const qualityCheckCommand: CommandItem = {
  id: 'analyze-quality',
  label: 'Quality Check',
  description: 'Evaluate response quality and accuracy',
  icon: <CheckCircle2 className="w-5 h-5" />,
  category: 'Analysis',
  onSelect: async () => {
    const lastAssistantMessage = messages
      .reverse()
      .find((m) => m.role === 'assistant')

    if (!lastAssistantMessage) {
      showToast({ title: 'No assistant response to analyze' })
      return
    }

    const quality = await evaluateQuality({
      message: lastAssistantMessage,
      criteria: ['accuracy', 'completeness', 'clarity', 'relevance'],
    })

    openReportPanel({
      title: 'Quality Analysis',
      scores: quality,
      recommendations: generateRecommendations(quality),
    })
  },
}
```

### Compare Responses

```tsx
import { GitCompare } from 'lucide-react'

const compareResponsesCommand: CommandItem = {
  id: 'analyze-compare',
  label: 'Compare Responses',
  description: 'Compare multiple AI responses side-by-side',
  icon: <GitCompare className="w-5 h-5" />,
  category: 'Analysis',
  onSelect: async () => {
    if (!selectedMessageId) {
      showToast({ title: 'Select a message to compare' })
      return
    }

    // Generate alternative responses
    const alternatives = await generateAlternatives({
      prompt: getPromptForMessage(selectedMessageId),
      count: 3,
      models: ['claude-3-opus', 'claude-3-sonnet', 'gpt-4'],
    })

    openComparisonView({
      original: getMessageById(selectedMessageId),
      alternatives,
      onSelect: (responseId) => {
        replaceMessage(selectedMessageId, alternatives[responseId])
      },
    })
  },
}
```

---

## Export & Import Commands

Commands for data portability and backup.

### Export Conversation

```tsx
import { Download } from 'lucide-react'

const exportConversationCommand: CommandItem = {
  id: 'export-conversation',
  label: 'Export Conversation',
  description: 'Download conversation in various formats',
  icon: <Download className="w-5 h-5" />,
  shortcut: ['cmd', 'e'],
  category: 'Export/Import',
  onSelect: () => {
    openExportDialog({
      formats: [
        { id: 'json', label: 'JSON', extension: '.json' },
        { id: 'markdown', label: 'Markdown', extension: '.md' },
        { id: 'pdf', label: 'PDF', extension: '.pdf' },
        { id: 'html', label: 'HTML', extension: '.html' },
      ],
      onExport: async (format) => {
        const exported = await exportConversation({
          messages,
          format,
          includeMetadata: true,
        })

        downloadFile({
          content: exported,
          filename: `conversation-${Date.now()}.${format}`,
        })
      },
    })
  },
}
```

### Export Selected Messages

```tsx
import { FileDown } from 'lucide-react'

const exportSelectedCommand: CommandItem = {
  id: 'export-selected',
  label: 'Export Selected Messages',
  description: 'Export only selected messages',
  icon: <FileDown className="w-5 h-5" />,
  category: 'Export/Import',
  onSelect: () => {
    if (selectedMessageIds.length === 0) {
      showToast({
        title: 'No messages selected',
        description: 'Select messages to export',
      })
      return
    }

    const selectedMessages = messages.filter((m) =>
      selectedMessageIds.includes(m.id)
    )

    const markdown = messagesToMarkdown(selectedMessages)

    downloadFile({
      content: markdown,
      filename: `selected-messages-${Date.now()}.md`,
    })
  },
}
```

### Import Conversation

```tsx
import { Upload } from 'lucide-react'

const importConversationCommand: CommandItem = {
  id: 'import-conversation',
  label: 'Import Conversation',
  description: 'Load conversation from file',
  icon: <Upload className="w-5 h-5" />,
  shortcut: ['cmd', 'i'],
  category: 'Export/Import',
  onSelect: () => {
    openFileDialog({
      accept: '.json,.md,.txt',
      onSelect: async (file) => {
        try {
          const imported = await importConversation(file)

          // Validate imported data
          const validated = validateConversation(imported)

          if (!validated.valid) {
            showToast({
              title: 'Invalid file format',
              description: validated.errors.join(', '),
              variant: 'destructive',
            })
            return
          }

          // Load imported conversation
          loadConversation(validated.data)

          showToast({
            title: 'Conversation imported',
            description: `${validated.data.messages.length} messages loaded`,
          })
        } catch (error) {
          showToast({
            title: 'Import failed',
            description: error.message,
            variant: 'destructive',
          })
        }
      },
    })
  },
}
```

### Share Conversation

```tsx
import { Share2 } from 'lucide-react'

const shareConversationCommand: CommandItem = {
  id: 'export-share',
  label: 'Share Conversation',
  description: 'Generate shareable link',
  icon: <Share2 className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 's'],
  category: 'Export/Import',
  onSelect: async () => {
    const shareableLink = await createShareableLink({
      messages,
      expiresIn: '7d',
      password: generatePassword(),
    })

    copyToClipboard(shareableLink.url)

    showToast({
      title: 'Link copied to clipboard',
      description: 'Expires in 7 days',
      action: {
        label: 'View Settings',
        onClick: () => openShareSettings(shareableLink.id),
      },
    })
  },
}
```

### Backup All Conversations

```tsx
import { Database } from 'lucide-react'

const backupAllCommand: CommandItem = {
  id: 'export-backup',
  label: 'Backup All Conversations',
  description: 'Create full backup archive',
  icon: <Database className="w-5 h-5" />,
  category: 'Export/Import',
  onSelect: async () => {
    setIsBackingUp(true)

    try {
      const backup = await createBackup({
        includeConversations: true,
        includeSettings: true,
        includeMemory: true,
        format: 'zip',
      })

      downloadFile({
        content: backup,
        filename: `clarity-backup-${Date.now()}.zip`,
      })

      showToast({
        title: 'Backup complete',
        description: `${backup.conversationCount} conversations backed up`,
      })
    } finally {
      setIsBackingUp(false)
    }
  },
}
```

---

## Settings & Configuration

Commands for managing preferences and AI behavior.

### Switch Model

```tsx
import { Cpu } from 'lucide-react'

const switchModelCommand: CommandItem = {
  id: 'settings-model',
  label: 'Switch AI Model',
  description: 'Change the active AI model',
  icon: <Cpu className="w-5 h-5" />,
  shortcut: ['cmd', 'm'],
  category: 'Settings',
  onSelect: () => {
    openModelSelector({
      currentModel,
      availableModels: [
        {
          id: 'claude-3-opus',
          name: 'Claude 3 Opus',
          description: 'Most capable model',
          pricing: { input: 15, output: 75 },
        },
        {
          id: 'claude-3-sonnet',
          name: 'Claude 3 Sonnet',
          description: 'Balanced performance',
          pricing: { input: 3, output: 15 },
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          description: 'Fast and efficient',
          pricing: { input: 0.25, output: 1.25 },
        },
      ],
      onSelect: (modelId) => {
        setModel(modelId)
        showToast({
          title: 'Model changed',
          description: `Now using ${getModelName(modelId)}`,
        })
      },
    })
  },
}
```

### Adjust Temperature

```tsx
import { Thermometer } from 'lucide-react'

const adjustTemperatureCommand: CommandItem = {
  id: 'settings-temperature',
  label: 'Adjust Temperature',
  description: 'Control response creativity (0-1)',
  icon: <Thermometer className="w-5 h-5" />,
  category: 'Settings',
  onSelect: () => {
    openSliderDialog({
      title: 'Response Temperature',
      value: temperature,
      min: 0,
      max: 1,
      step: 0.1,
      labels: {
        0: 'Focused',
        0.5: 'Balanced',
        1: 'Creative',
      },
      description:
        'Lower values produce more focused responses, higher values are more creative',
      onChange: (value) => {
        setTemperature(value)
      },
    })
  },
}
```

### Set System Prompt

```tsx
import { Terminal } from 'lucide-react'

const setSystemPromptCommand: CommandItem = {
  id: 'settings-system-prompt',
  label: 'Set System Prompt',
  description: 'Customize AI behavior and personality',
  icon: <Terminal className="w-5 h-5" />,
  category: 'Settings',
  onSelect: () => {
    openTextEditor({
      title: 'System Prompt',
      value: systemPrompt,
      placeholder: 'You are a helpful AI assistant...',
      maxLength: 2000,
      suggestions: [
        {
          label: 'Code Assistant',
          prompt:
            'You are an expert software engineer. Provide clear, well-documented code examples.',
        },
        {
          label: 'Creative Writer',
          prompt:
            'You are a creative writer. Use vivid language and engaging storytelling.',
        },
        {
          label: 'Academic Tutor',
          prompt:
            'You are a patient tutor. Explain concepts clearly with examples.',
        },
      ],
      onSave: (prompt) => {
        setSystemPrompt(prompt)
        showToast({ title: 'System prompt updated' })
      },
    })
  },
}
```

### Configure Token Budget

```tsx
import { DollarSign } from 'lucide-react'

const configureTokenBudgetCommand: CommandItem = {
  id: 'settings-token-budget',
  label: 'Configure Token Budget',
  description: 'Set token usage limits and alerts',
  icon: <DollarSign className="w-5 h-5" />,
  category: 'Settings',
  onSelect: () => {
    openBudgetConfiguration({
      currentBudget: tokenBudget,
      currentUsage: tokenUsage,
      onSave: (config) => {
        setTokenBudget({
          maxTokensPerRequest: config.maxPerRequest,
          dailyLimit: config.dailyLimit,
          alertThreshold: config.alertThreshold,
          hardLimit: config.hardLimit,
        })

        showToast({
          title: 'Budget configured',
          description: `Daily limit: ${config.dailyLimit.toLocaleString()} tokens`,
        })
      },
    })
  },
}
```

### Toggle Memory

```tsx
import { Brain } from 'lucide-react'

const toggleMemoryCommand: CommandItem = {
  id: 'settings-memory',
  label: 'Toggle Conversation Memory',
  description: `Memory is ${memoryEnabled ? 'enabled' : 'disabled'}`,
  icon: <Brain className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 'm'],
  category: 'Settings',
  onSelect: () => {
    setMemoryEnabled(!memoryEnabled)

    showToast({
      title: memoryEnabled ? 'Memory disabled' : 'Memory enabled',
      description: memoryEnabled
        ? 'AI will not remember this conversation'
        : 'AI will remember context across sessions',
    })
  },
}
```

### Manage API Keys

```tsx
import { Key } from 'lucide-react'

const manageAPIKeysCommand: CommandItem = {
  id: 'settings-api-keys',
  label: 'Manage API Keys',
  description: 'Configure AI provider credentials',
  icon: <Key className="w-5 h-5" />,
  category: 'Settings',
  onSelect: () => {
    openAPIKeyManager({
      providers: ['anthropic', 'openai', 'google'],
      onSave: async (keys) => {
        // Encrypt and store keys
        await secureStorage.setKeys(keys)

        showToast({
          title: 'API keys updated',
          description: 'Changes take effect immediately',
        })
      },
    })
  },
}
```

---

## Model & Provider Commands

Commands for managing AI models and providers.

### Compare Models

```tsx
import { LayoutGrid } from 'lucide-react'

const compareModelsCommand: CommandItem = {
  id: 'model-compare',
  label: 'Compare Models',
  description: 'Side-by-side model comparison',
  icon: <LayoutGrid className="w-5 h-5" />,
  category: 'Models',
  onSelect: () => {
    openModelComparison({
      models: availableModels,
      criteria: ['speed', 'quality', 'cost', 'context-length'],
      onSelect: (modelId) => {
        setModel(modelId)
        closeCommandPalette()
      },
    })
  },
}
```

### View Model Info

```tsx
import { Info } from 'lucide-react'

const viewModelInfoCommand: CommandItem = {
  id: 'model-info',
  label: 'View Model Information',
  description: 'Detailed specs for current model',
  icon: <Info className="w-5 h-5" />,
  category: 'Models',
  onSelect: () => {
    const info = getModelInfo(currentModel)

    openInfoPanel({
      title: info.name,
      sections: [
        {
          title: 'Capabilities',
          content: info.capabilities,
        },
        {
          title: 'Context Window',
          content: `${info.contextLength.toLocaleString()} tokens`,
        },
        {
          title: 'Pricing',
          content: `Input: $${info.pricing.input}/MTok, Output: $${info.pricing.output}/MTok`,
        },
        {
          title: 'Best For',
          content: info.useCases,
        },
      ],
    })
  },
}
```

### Test Provider Connection

```tsx
import { Zap } from 'lucide-react'

const testConnectionCommand: CommandItem = {
  id: 'model-test',
  label: 'Test Provider Connection',
  description: 'Verify API connectivity',
  icon: <Zap className="w-5 h-5" />,
  category: 'Models',
  onSelect: async () => {
    setIsTesting(true)

    try {
      const result = await testProviderConnection({
        provider: currentProvider,
        timeout: 5000,
      })

      showToast({
        title: result.success ? 'Connection successful' : 'Connection failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })
    } finally {
      setIsTesting(false)
    }
  },
}
```

---

## Memory & Context Commands

Commands for managing conversation memory and context.

### View Memory

```tsx
import { Database } from 'lucide-react'

const viewMemoryCommand: CommandItem = {
  id: 'memory-view',
  label: 'View Conversation Memory',
  description: 'See what the AI remembers',
  icon: <Database className="w-5 h-5" />,
  shortcut: ['cmd', 'shift', 'v'],
  category: 'Memory',
  onSelect: async () => {
    const memory = await getConversationMemory({
      conversationId: currentConversationId,
    })

    openSidebar({
      title: 'Conversation Memory',
      content: (
        <MemoryViewer
          facts={memory.facts}
          entities={memory.entities}
          preferences={memory.preferences}
          onEdit={(item) => editMemoryItem(item)}
          onDelete={(id) => deleteMemoryItem(id)}
        />
      ),
    })
  },
}
```

### Clear Memory

```tsx
import { Eraser } from 'lucide-react'

const clearMemoryCommand: CommandItem = {
  id: 'memory-clear',
  label: 'Clear Memory',
  description: 'Reset AI memory for this conversation',
  icon: <Eraser className="w-5 h-5" />,
  category: 'Memory',
  onSelect: () => {
    openConfirmDialog({
      title: 'Clear Memory?',
      description: 'The AI will forget everything about this conversation.',
      variant: 'destructive',
      onConfirm: async () => {
        await clearMemory(currentConversationId)
        showToast({ title: 'Memory cleared' })
      },
    })
  },
}
```

### Add to Memory

```tsx
import { Plus } from 'lucide-react'

const addToMemoryCommand: CommandItem = {
  id: 'memory-add',
  label: 'Add to Memory',
  description: 'Manually add important information',
  icon: <Plus className="w-5 h-5" />,
  category: 'Memory',
  onSelect: () => {
    openMemoryEditor({
      type: 'fact',
      onSave: async (item) => {
        await addMemoryItem({
          conversationId: currentConversationId,
          type: item.type,
          content: item.content,
          importance: item.importance,
        })

        showToast({
          title: 'Added to memory',
          description: 'AI will remember this information',
        })
      },
    })
  },
}
```

### Optimize Context

```tsx
import { Sparkles } from 'lucide-react'

const optimizeContextCommand: CommandItem = {
  id: 'memory-optimize',
  label: 'Optimize Context',
  description: 'Compress conversation to reduce tokens',
  icon: <Sparkles className="w-5 h-5" />,
  category: 'Memory',
  onSelect: async () => {
    const beforeTokens = countTokens(messages)

    const optimized = await optimizeContext({
      messages,
      targetReduction: 0.3, // 30% reduction
      preserveImportant: true,
    })

    const afterTokens = countTokens(optimized.messages)
    const saved = beforeTokens - afterTokens

    setMessages(optimized.messages)

    showToast({
      title: 'Context optimized',
      description: `Saved ${saved.toLocaleString()} tokens (${Math.round((saved / beforeTokens) * 100)}%)`,
    })
  },
}
```

---

## Advanced Patterns

### Dynamic Command Generation

Generate commands based on application state:

```tsx
function useAICommands() {
  const { messages, currentModel, memoryEnabled } = useClarityChat()

  const commands: CommandItem[] = useMemo(() => {
    const baseCommands = [
      /* ... static commands ... */
    ]

    // Add context-aware commands
    if (messages.length > 0) {
      baseCommands.push({
        id: 'analyze-current',
        label: 'Analyze This Conversation',
        description: `${messages.length} messages`,
        icon: <BarChart3 />,
        category: 'Analysis',
        onSelect: () => analyzeConversation(messages),
      })
    }

    // Add model-specific commands
    if (currentModel.supports.vision) {
      baseCommands.push({
        id: 'analyze-image',
        label: 'Analyze Image',
        description: 'Vision-capable model',
        icon: <Image />,
        category: 'Generate',
        onSelect: () => openImageAnalysis(),
      })
    }

    return baseCommands
  }, [messages, currentModel])

  return commands
}
```

### Conditional Categories

Show/hide categories based on context:

```tsx
const commands: CommandItem[] = [
  // Admin-only commands
  ...(isAdmin
    ? [
        {
          id: 'admin-dashboard',
          label: 'Admin Dashboard',
          category: 'Admin',
          onSelect: () => router.push('/admin'),
        },
      ]
    : []),

  // Premium-only commands
  ...(isPremium
    ? [
        {
          id: 'advanced-analysis',
          label: 'Advanced Analysis',
          category: 'Premium',
          onSelect: () => openAdvancedAnalysis(),
        },
      ]
    : []),
]
```

### Async Command Loading

Load commands asynchronously:

```tsx
function useAsyncCommands() {
  const [commands, setCommands] = useState<CommandItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCommands() {
      try {
        // Fetch user-specific commands from API
        const userCommands = await fetchUserCommands()

        // Fetch available integrations
        const integrations = await fetchIntegrations()

        const allCommands = [
          ...staticCommands,
          ...userCommands,
          ...integrations.map((int) => ({
            id: `integration-${int.id}`,
            label: int.name,
            description: int.description,
            icon: <int.icon />,
            category: 'Integrations',
            onSelect: () => activateIntegration(int.id),
          })),
        ]

        setCommands(allCommands)
      } finally {
        setLoading(false)
      }
    }

    loadCommands()
  }, [])

  return { commands, loading }
}
```

### Command Shortcuts Manager

Centralized shortcut management:

```tsx
const SHORTCUTS = {
  newConversation: ['cmd', 'n'],
  saveConversation: ['cmd', 's'],
  search: ['cmd', 'f'],
  export: ['cmd', 'e'],
  import: ['cmd', 'i'],
  switchModel: ['cmd', 'm'],
  toggleMemory: ['cmd', 'shift', 'm'],
  analyze: ['cmd', 't'],
} as const

function createCommandWithShortcut(
  id: keyof typeof SHORTCUTS,
  config: Omit<CommandItem, 'id' | 'shortcut'>
): CommandItem {
  return {
    id,
    shortcut: SHORTCUTS[id],
    ...config,
  }
}
```

---

## Complete Examples

### Basic AI Chat Application

```tsx
'use client'

import { useState } from 'react'
import {
  CommandPalette,
  type CommandItem,
  useClarityChat,
} from '@clarity-chat/react'
import {
  MessageSquarePlus,
  Save,
  Download,
  Settings,
  Cpu,
  BarChart3,
} from 'lucide-react'

export function ChatWithCommands() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const {
    messages,
    append,
    isLoading,
    stop,
    reload,
    clearMessages,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Define commands
  const commands: CommandItem[] = [
    {
      id: 'new',
      label: 'New Conversation',
      description: 'Start fresh',
      icon: <MessageSquarePlus className="w-5 h-5" />,
      shortcut: ['cmd', 'n'],
      category: 'Conversation',
      onSelect: () => {
        clearMessages()
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'save',
      label: 'Save Conversation',
      description: 'Save to history',
      icon: <Save className="w-5 h-5" />,
      shortcut: ['cmd', 's'],
      category: 'Conversation',
      onSelect: async () => {
        await saveConversation(messages)
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'export',
      label: 'Export as Markdown',
      description: 'Download conversation',
      icon: <Download className="w-5 h-5" />,
      shortcut: ['cmd', 'e'],
      category: 'Export',
      onSelect: () => {
        exportToMarkdown(messages)
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'analyze',
      label: 'Analyze Tokens',
      description: 'View usage statistics',
      icon: <BarChart3 className="w-5 h-5" />,
      shortcut: ['cmd', 't'],
      category: 'Analysis',
      onSelect: () => {
        showTokenAnalysis(messages)
        setCommandPaletteOpen(false)
      },
    },
    {
      id: 'model',
      label: 'Switch Model',
      description: 'Change AI model',
      icon: <Cpu className="w-5 h-5" />,
      shortcut: ['cmd', 'm'],
      category: 'Settings',
      onSelect: () => {
        openModelSelector()
        setCommandPaletteOpen(false)
      },
    },
  ]

  // Keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Chat interface */}
        <ChatWindow messages={messages} />
        <ChatInput onSend={append} disabled={isLoading} />
      </div>

      {/* Command Palette */}
      <CommandPalette
        items={commands}
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        placeholder="Search commands..."
        aiContext={{
          modelName: 'Claude 3.5 Sonnet',
          conversationId: currentConversationId,
          tokenUsage: {
            total: calculateTotalTokens(messages),
          },
        }}
      />
    </>
  )
}
```

### Advanced Example with All Features

```tsx
'use client'

import { useState, useMemo } from 'react'
import {
  CommandPalette,
  type CommandItem,
  type AIContext,
  useClarityChat,
  useMemoryFeedback,
  useTokenBudget,
} from '@clarity-chat/react'

export function AdvancedChatApp() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  const { messages, append, clearMessages } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true },
  })

  const { memory, optimizeContext } = useMemoryFeedback()
  const { usage, budget } = useTokenBudget()

  // AI context for command palette footer
  const aiContext: AIContext = useMemo(
    () => ({
      modelName: currentModel.name,
      conversationId: currentConversationId,
      tokenUsage: {
        input: usage.input,
        output: usage.output,
        total: usage.total,
      },
      metadata: {
        'Memory Items': memory.facts.length,
        'Budget Used': `${Math.round((usage.total / budget.daily) * 100)}%`,
      },
    }),
    [currentModel, usage, budget, memory]
  )

  // Generate commands dynamically
  const commands: CommandItem[] = useMemo(() => {
    return [
      // Conversation commands
      ...conversationCommands(messages, clearMessages),

      // Generation commands
      ...generationCommands(messages, append),

      // Analysis commands
      ...analysisCommands(messages, usage),

      // Export commands
      ...exportCommands(messages),

      // Settings commands
      ...settingsCommands(currentModel, setModel),

      // Memory commands (only if memory enabled)
      ...(memory.enabled ? memoryCommands(memory, optimizeContext) : []),
    ]
  }, [messages, currentModel, memory, usage])

  return (
    <>
      <ChatInterface />

      <CommandPalette
        items={commands}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        loading={isGenerating}
        aiContext={aiContext}
        aria-label="AI Command Palette"
      />
    </>
  )
}
```

---

## Best Practices

### 1. Organize by Category

Group related commands for easier discovery:

```tsx
const CATEGORIES = {
  CONVERSATION: 'Conversation',
  GENERATE: 'Generate',
  ANALYZE: 'Analysis',
  EXPORT: 'Export/Import',
  SETTINGS: 'Settings',
  MEMORY: 'Memory',
  MODELS: 'Models',
} as const
```

### 2. Provide Clear Descriptions

Help users understand what each command does:

```tsx
// ✅ Good
{
  label: 'Generate Summary',
  description: 'Summarize the current conversation',
}

// ❌ Bad
{
  label: 'Summary',
  description: 'Summary',
}
```

### 3. Use Consistent Keyboard Shortcuts

Follow platform conventions:

- `cmd/ctrl + n`: New
- `cmd/ctrl + s`: Save
- `cmd/ctrl + o`: Open
- `cmd/ctrl + f`: Search
- `cmd/ctrl + e`: Export
- `cmd/ctrl + m`: Model/settings

### 4. Show Loading States

Provide feedback during async operations:

```tsx
const [loading, setLoading] = useState(false)

<CommandPalette items={commands} loading={loading} />
```

### 5. Handle Errors Gracefully

Always provide user feedback:

```tsx
onSelect: async () => {
  try {
    await performAction()
    showToast({ title: 'Success' })
  } catch (error) {
    showToast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  }
}
```

### 6. Add Context-Aware Commands

Show commands only when relevant:

```tsx
const commands = [
  ...baseCommands,

  // Only show if messages exist
  ...(messages.length > 0
    ? [
        {
          id: 'clear',
          label: 'Clear Messages',
          onSelect: clearMessages,
        },
      ]
    : []),
]
```

---

## Accessibility Considerations

1. **Keyboard Navigation**: All commands accessible via keyboard
2. **ARIA Labels**: Proper labels for screen readers
3. **Focus Management**: Focus trap and restoration
4. **Live Regions**: Announce results count
5. **Reduced Motion**: Respect user preferences

---

## Performance Tips

1. **Debounce Search**: Use built-in debouncing (150ms)
2. **Memoize Commands**: Use `useMemo` for dynamic commands
3. **Lazy Loading**: Load commands asynchronously if needed
4. **Virtual Scrolling**: Handled automatically for long lists

---

## Related Components

- [MessageSearch](/reference/components/message-search) - Full-text conversation search
- [PromptLibrary](/reference/components/prompt-library) - Pre-built prompt templates
- [TokenUsageMeter](/reference/components/token-usage-meter) - Token tracking display

---

## Additional Resources

- [CommandPalette API Reference](/reference/components/command-palette)
- [Keyboard Shortcuts Guide](/guides/keyboard-shortcuts)
- [AI Chat Patterns](/guides/ai-chat-patterns)

---

**Last Updated**: January 28, 2026
