# Configuration Manager - Quick Start Guide

## 5-Minute Quick Start

### 1. Create Your First Configuration (30 seconds)

Navigate to `/config-manager` and you'll see the default configuration loaded.

```typescript
// The default configuration is automatically created
{
  name: "Default Configuration",
  version: "1.0.0",
  theme: { mode: "auto", primaryColor: "#6366f1" },
  features: { memory: true, streaming: true, ... },
  model: { provider: "openai", name: "gpt-4", ... }
}
```

### 2. Customize Your Configuration (2 minutes)

Use the Configuration Editor to customize:

**Basic Tab:**
- Change the name: `"My Custom Chat"`
- Add description: `"Optimized for customer support"`
- Update version: `"1.0.0"`

**Features Tab:**
Toggle features on/off:
- ✅ Memory
- ✅ Streaming
- ✅ Tools
- ❌ Voice Input (toggle off if not needed)

**Model Tab:**
Configure AI model:
- Provider: `anthropic`
- Name: `claude-3-sonnet`
- Temperature: `0.7`
- Max Tokens: `2000`

**Theme Tab:**
Customize appearance:
- Mode: `dark`
- Primary Color: `#8b5cf6` (violet)
- Border Radius: `lg`

### 3. Save Your Configuration (10 seconds)

Click the **"Save Configuration"** button. Your config is now saved to localStorage and can be loaded anytime.

### 4. Export Your Configuration (30 seconds)

Click **"Export"** button and choose format:

- **JSON**: For data storage and APIs
- **TypeScript**: For code integration
- **YAML**: For human-readable configs
- **URL**: For sharing with team

Click **"Download"** or **"Copy"** to get your configuration.

### 5. Share with Your Team (30 seconds)

Click **"Share URL"** button. A shareable link is:
- Generated automatically
- Copied to your clipboard
- Can be sent to team members

Team members can import by:
1. Opening the URL
2. Or pasting in Import dialog

## Common Use Cases

### Use Case 1: Quick Template Start

**Goal**: Start with a pre-configured template

**Steps:**
1. Scroll to "Configuration Templates" section
2. Choose a template:
   - **Basic Chat**: Minimal setup
   - **Advanced Assistant**: Full features
   - **Enterprise**: Production-ready
3. Click "Use Template"
4. Customize as needed
5. Save

**Time**: < 1 minute

### Use Case 2: Export for Version Control

**Goal**: Save configuration to Git repository

**Steps:**
1. Click "Export"
2. Select "TypeScript" format
3. Enable "Prettify"
4. Click "Download"
5. Save to `src/config/chat-config.ts`
6. Commit to Git

**Code:**
```typescript
// src/config/chat-config.ts
import type { ChatConfiguration } from './types'

export const config: ChatConfiguration = {
  // Your exported config
}
```

**Time**: 1 minute

### Use Case 3: Share with Remote Team

**Goal**: Share configuration with remote developers

**Steps:**
1. Click "Share URL"
2. Send URL via Slack/Teams/Email
3. Recipient clicks URL
4. Configuration auto-loads
5. Recipient saves to their localStorage

**Time**: 30 seconds

### Use Case 4: Import External Configuration

**Goal**: Import config from another project

**Steps:**
1. Click "Import"
2. Choose method:
   - **File Upload**: Upload `.json` file
   - **Paste JSON**: Copy/paste JSON
   - **From URL**: Enter shared URL
3. Click "Import"
4. Validation runs automatically
5. Config loads if valid

**Time**: 30 seconds

### Use Case 5: Multiple Environment Configs

**Goal**: Manage dev, staging, production configs

**Steps:**
1. Create dev config, save as "Chat - Development"
2. Create staging config, save as "Chat - Staging"
3. Create production config, save as "Chat - Production"
4. Switch between them in "Saved Configurations"
5. Export each to appropriate environment

**Time**: 5 minutes total

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save configuration |
| `Cmd/Ctrl + E` | Open export dialog |
| `Cmd/Ctrl + I` | Open import dialog |
| `Cmd/Ctrl + K` | Search saved configs |
| `Esc` | Close dialog |

## Tips & Tricks

### Tip 1: Version Naming
Use semantic versioning for clarity:
```
1.0.0 - Initial release
1.1.0 - Added new features
1.1.1 - Bug fixes
2.0.0 - Breaking changes
```

### Tip 2: Descriptive Names
Use context in configuration names:
```
✅ "Customer Support - GPT-4 - Production"
❌ "Config 1"
```

### Tip 3: Tags for Organization
Add tags to configurations (future feature):
```typescript
tags: ["production", "gpt4", "support"]
```

### Tip 4: Regular Backups
Export important configs regularly:
1. Weekly exports to Git
2. Monthly full backups
3. Before major changes

### Tip 5: Template Customization
Start with template, then customize:
```typescript
const config = {
  ...enterpriseTemplate,
  // Your customizations
  theme: { ...customTheme },
  model: { ...customModel }
}
```

## Troubleshooting

### Problem: Configuration Won't Save
**Solution:**
- Check browser localStorage quota
- Clear old configurations
- Try incognito mode to test

### Problem: Import Fails
**Solution:**
- Validate JSON format
- Check required fields (id, name, version)
- Look at validation errors
- Try with a template first

### Problem: Export Download Not Working
**Solution:**
- Check browser popup settings
- Try "Copy" instead of "Download"
- Check browser security settings
- Try different browser

### Problem: Shared URL Too Long
**Solution:**
- Configuration is too large
- Use file export instead
- Simplify configuration
- Remove unnecessary data

### Problem: Can't Find Saved Config
**Solution:**
- Use search box
- Check browser localStorage
- Try refreshing page
- Check browser settings

## Best Practices

### 1. Configuration Naming Convention
```
[Purpose] - [Model] - [Environment]
Example: "Support Bot - Claude - Production"
```

### 2. Version Management
```
Major.Minor.Patch
1.0.0 → 1.1.0 (new features)
1.1.0 → 1.1.1 (bug fixes)
1.1.1 → 2.0.0 (breaking changes)
```

### 3. Documentation in Description
```typescript
description: `
  Customer support configuration
  - Uses GPT-4 for accuracy
  - Enabled memory for context
  - Rate limited to 100 req/min
  - Production-ready
`
```

### 4. Regular Review
- Review configs monthly
- Remove unused configs
- Update outdated versions
- Test before deploying

### 5. Team Collaboration
- Share via URL for quick review
- Export to Git for version control
- Document changes in version notes
- Use templates for consistency

## Integration Examples

### With React App

```typescript
import { config } from './config/chat-config'
import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      theme={config.theme}
      features={config.features}
      model={config.model}
    />
  )
}
```

### With Next.js

```typescript
// app/chat/page.tsx
import { config } from '@/config/chat-config'

export default function ChatPage() {
  return (
    <ChatInterface
      config={config}
      onConfigChange={handleConfigChange}
    />
  )
}
```

### With Node.js Backend

```typescript
import { config } from './config/chat-config'
import { createChatHandler } from '@clarity-chat/server'

const handler = createChatHandler({
  model: config.model,
  features: config.features,
})

app.post('/api/chat', handler)
```

## FAQ

**Q: Can I have multiple configurations?**
A: Yes! Save as many as you need. Use search to find them.

**Q: Are configurations synced across devices?**
A: Not yet. Use URL sharing or file export for now. Cloud sync coming soon.

**Q: Can I edit imported configurations?**
A: Yes! Import, edit, and save as new configuration.

**Q: What's the configuration size limit?**
A: localStorage limit (~5-10MB). Most configs are < 10KB.

**Q: Can I automate exports?**
A: Yes! Use the export functions programmatically:
```typescript
import { exportToJSON, downloadFile } from './utils'
const json = exportToJSON(config)
downloadFile(json, 'backup.json')
```

**Q: How do I validate configurations?**
A: Automatic validation on import. Check validation errors in UI.

**Q: Can I merge configurations?**
A: Manual merge for now. Import both, copy sections, save new.

**Q: What about security?**
A: No sensitive data in localStorage. Use environment variables for API keys.

## Next Steps

1. **Explore Templates**: Try all three templates
2. **Customize**: Experiment with different settings
3. **Share**: Share a config with a colleague
4. **Export**: Export to your preferred format
5. **Integrate**: Use in your application

## Resources

- [Full Documentation](./README.md)
- [API Reference](./README.md#api-reference)
- [Configuration Schema](./types.ts)
- [Examples](./README.md#usage-examples)

## Support

Need help? Check:
- Full README documentation
- Type definitions in types.ts
- Inline validation messages
- Browser console for errors

---

**Ready to start?** Head to `/config-manager` and create your first configuration! 🚀
