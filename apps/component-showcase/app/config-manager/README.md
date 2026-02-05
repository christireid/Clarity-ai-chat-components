# Configuration Manager

Comprehensive export/import functionality for saving and sharing chat configurations.

## Features

### 1. Export Functionality

Export your configurations in multiple formats:

- **JSON**: Standard JSON format with optional pretty-printing
- **TypeScript**: Type-safe TypeScript configuration file
- **YAML**: Human-readable YAML format
- **URL**: Shareable URL with encoded configuration

### 2. Import Functionality

Import configurations from various sources:

- **File Upload**: Import from `.json`, `.ts`, `.yaml` files
- **Paste JSON**: Direct JSON paste from clipboard
- **URL Import**: Import from shared configuration URLs
- **Validation**: Automatic validation on import

### 3. localStorage Persistence

Automatic configuration storage:

- **Auto-save**: Configurations saved to browser storage
- **Quick Access**: Load previously saved configurations
- **Search**: Find configurations by name or description
- **Active Config**: Track currently active configuration

### 4. Version History

Track configuration changes:

- **Version Numbers**: Semantic versioning support
- **Timestamps**: Created and updated dates
- **Change Tracking**: Monitor configuration modifications

### 5. Configuration Templates

Pre-built templates for common use cases:

- **Basic Chat**: Minimal features for simple chat
- **Advanced Assistant**: Full-featured AI assistant
- **Enterprise**: Security-focused enterprise setup

### 6. Share Configurations

Share configurations with team members:

- **Share URLs**: Generate shareable links
- **Copy to Clipboard**: Quick copy functionality
- **QR Codes**: (Future) Generate QR codes for mobile

## Usage Examples

### Export Configuration

```typescript
import { exportToJSON, exportToTypeScript, exportToURL } from './utils'

// Export as JSON
const json = exportToJSON(config, true)
downloadFile(json, 'my-config.json')

// Export as TypeScript
const ts = exportToTypeScript(config)
downloadFile(ts, 'my-config.ts', 'text/typescript')

// Export as shareable URL
const url = exportToURL(config)
navigator.clipboard.writeText(url)
```

### Import Configuration

```typescript
import { importFromJSON, importFromFile, importFromURL } from './utils'

// Import from JSON string
const result = importFromJSON(jsonString)
if (result.success) {
  console.log('Imported config:', result.config)
}

// Import from file
const file = event.target.files[0]
const result = await importFromFile(file)

// Import from URL
const result = importFromURL('https://example.com?config=...')
```

### Save to localStorage

```typescript
import {
  saveToLocalStorage,
  getAllFromLocalStorage,
  getCurrentConfig,
} from './utils'

// Save configuration
saveToLocalStorage(config)

// Load all saved configurations
const configs = getAllFromLocalStorage()

// Get current active configuration
const current = getCurrentConfig()
```

### Use Templates

```typescript
import { CONFIGURATION_TEMPLATES, getDefaultConfiguration } from './utils'

// Start with a template
const template = CONFIGURATION_TEMPLATES.find((t) => t.id === 'enterprise')
const config = {
  ...getDefaultConfiguration(),
  ...template.config,
  name: template.name,
}
```

## Configuration Schema

### ChatConfiguration

```typescript
interface ChatConfiguration {
  // Metadata
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  author?: string
  tags?: string[]

  // Theme settings
  theme: {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    fontFamily: string
  }

  // Feature flags
  features: {
    memory: boolean
    streaming: boolean
    tools: boolean
    voiceInput: boolean
    fileAttachments: boolean
    codeExecution: boolean
    webSearch: boolean
    citations: boolean
    tokenOptimization: boolean
    rateLimiting: boolean
  }

  // Model configuration
  model: {
    provider: 'openai' | 'anthropic' | 'cohere' | 'custom'
    name: string
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }

  // Layout options
  layout: {
    variant: 'default' | 'compact' | 'wide' | 'split'
    showSidebar: boolean
    showHeader: boolean
    showFooter: boolean
    messageLayout: 'bubbles' | 'flat' | 'cards'
  }

  // Advanced settings
  advanced: {
    customSystemPrompt?: string
    maxHistoryLength: number
    autoSave: boolean
    debugMode: boolean
    analytics: boolean
  }
}
```

## Validation

Configurations are automatically validated on import:

```typescript
import { validateConfiguration } from './utils'

const validation = validateConfiguration(config)

if (!validation.valid) {
  validation.errors.forEach((error) => {
    console.error(`${error.field}: ${error.message}`)
  })
}
```

### Validation Rules

- **Required Fields**: `id`, `name`, `version`
- **Theme Mode**: Must be 'light', 'dark', or 'auto'
- **Temperature**: Between 0 and 2
- **Max Tokens**: Must be positive
- **Top P**: Between 0 and 1

## Export Formats

### JSON Format

```json
{
  "id": "config-123",
  "name": "My Configuration",
  "version": "1.0.0",
  "theme": {
    "mode": "dark",
    "primaryColor": "#6366f1"
  }
}
```

### TypeScript Format

```typescript
import type { ChatConfiguration } from './types'

export const config: ChatConfiguration = {
  id: 'config-123',
  name: 'My Configuration',
  version: '1.0.0',
  // ...
}
```

### YAML Format

```yaml
id: config-123
name: My Configuration
version: 1.0.0
theme:
  mode: dark
  primaryColor: '#6366f1'
```

### URL Format

```
https://example.com/config?config=eyJpZCI6ImNvbmZpZy0xMjMi...
```

## Best Practices

### 1. Version Management

```typescript
// Always increment version on changes
const updatedConfig = {
  ...config,
  version: incrementVersion(config.version),
  updatedAt: new Date().toISOString(),
}
```

### 2. Configuration Naming

```typescript
// Use descriptive names
const config = {
  name: 'Customer Support - High Performance',
  description: 'Optimized for customer support with fast responses',
  tags: ['support', 'production', 'optimized'],
}
```

### 3. Template Usage

```typescript
// Extend templates rather than modifying
const myConfig = {
  ...CONFIGURATION_TEMPLATES.find((t) => t.id === 'enterprise').config,
  theme: { ...customTheme },
  features: { ...customFeatures },
}
```

### 4. Error Handling

```typescript
try {
  const result = importFromJSON(jsonString)
  if (!result.success) {
    // Handle errors
    result.errors?.forEach((error) => showError(error))
  }
} catch (error) {
  console.error('Import failed:', error)
}
```

## API Reference

### Export Functions

- `exportToJSON(config, prettify)`: Export to JSON string
- `exportToTypeScript(config)`: Export to TypeScript file
- `exportToYAML(config)`: Export to YAML string
- `exportToURL(config)`: Generate shareable URL
- `downloadFile(content, filename, mimeType)`: Trigger file download

### Import Functions

- `importFromJSON(jsonString)`: Parse JSON string
- `importFromFile(file)`: Read and parse file
- `importFromURL(url)`: Extract config from URL

### Storage Functions

- `saveToLocalStorage(config)`: Save configuration
- `getAllFromLocalStorage()`: Get all saved configs
- `getFromLocalStorage(id)`: Get specific config
- `deleteFromLocalStorage(id)`: Delete configuration
- `setCurrentConfig(id)`: Set active configuration
- `getCurrentConfig()`: Get active configuration

### Validation Functions

- `validateConfiguration(config)`: Validate configuration object

### Utility Functions

- `getDefaultConfiguration()`: Get default config
- `generateId()`: Generate unique ID

## Security Considerations

### Data Sanitization

```typescript
// Always validate imported data
const result = importFromJSON(userInput)
if (!result.success) {
  throw new Error('Invalid configuration')
}
```

### URL Sharing

```typescript
// Be cautious with sensitive data in URLs
// Consider encrypting sensitive configurations
const sanitizedConfig = removeSenitiveData(config)
const url = exportToURL(sanitizedConfig)
```

### localStorage Limits

```typescript
// Monitor storage usage
try {
  saveToLocalStorage(config)
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Handle storage limit
    cleanupOldConfigurations()
  }
}
```

## Troubleshooting

### Import Failures

**Problem**: Import fails with validation errors
**Solution**: Check the configuration schema and ensure all required fields are present

**Problem**: File upload not working
**Solution**: Ensure file has correct extension (`.json`, `.ts`, `.yaml`)

### Export Issues

**Problem**: Download not triggering
**Solution**: Check browser security settings and popup blockers

**Problem**: URL too long
**Solution**: Configuration is too large; consider using file export instead

### Storage Issues

**Problem**: Configuration not saving
**Solution**: Check browser localStorage quota and clear old configurations

## Future Enhancements

- [ ] QR code generation for mobile sharing
- [ ] Cloud storage integration
- [ ] Configuration diffing
- [ ] Merge conflict resolution
- [ ] Encrypted exports
- [ ] Team collaboration features
- [ ] Configuration marketplace
- [ ] Automated backups
- [ ] Git integration
- [ ] Configuration linting

## Contributing

See main repository CONTRIBUTING.md for guidelines on:

- Adding new export formats
- Extending validation rules
- Creating new templates
- Improving documentation

## License

See main repository LICENSE file.
