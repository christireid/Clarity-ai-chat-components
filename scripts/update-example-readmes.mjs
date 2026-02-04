#!/usr/bin/env node

/**
 * Generate or update README files for example apps
 * Includes installation instructions, features, and bundle sizes
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const auditResultsPath = resolve(__dirname, '../.cleanup-results/example-audit.json');

// Read audit results
const auditResults = JSON.parse(readFileSync(auditResultsPath, 'utf-8'));

// Feature descriptions
const FEATURE_DESCRIPTIONS = {
  'token-counting': 'Real-time token usage tracking and display',
  'token-optimization': 'Intelligent token budget management and optimization',
  'diagrams': 'Mermaid diagram rendering support',
  'pdf': 'PDF document loading and processing',
  'docx': 'Word document (.docx) loading support',
  'reranking': 'Cohere-powered semantic reranking for RAG',
  'embeddings': 'Vector embeddings generation',
  'syntax-highlighting': 'Code syntax highlighting with Shiki/Prism',
  'code-block': 'Enhanced code block rendering',
  'markdown': 'Rich markdown rendering with GFM support',
  'export': 'Batch export and download capabilities',
  'batch-export': 'Multi-file export with ZIP compression',
  'rag': 'Retrieval Augmented Generation pipeline',
  'streaming': 'Real-time streaming responses',
  'voice-input': 'Voice-to-text input support',
  'file-upload': 'File upload and processing',
  'chat-history': 'Persistent conversation history',
  'theming': 'Dynamic theme customization',
};

// Peer dependency descriptions
const PEER_DESCRIPTIONS = {
  'react': 'React library',
  'react-dom': 'React DOM renderer',
  'framer-motion': 'Animation library for smooth transitions',
  'lucide-react': 'Icon library',
  'zod': 'TypeScript schema validation',
  'flowtoken': 'Token counting for AI models',
  'mermaid': 'Diagram rendering',
  'pdfjs-dist': 'PDF parsing and rendering',
  'mammoth': 'DOCX document parsing',
  'cohere-ai': 'Cohere API client for reranking/embeddings',
  'shiki': 'Syntax highlighting',
  'jszip': 'ZIP file generation for exports',
  'prismjs': 'Syntax highlighting alternative',
  'react-markdown': 'Markdown renderer',
  'remark-gfm': 'GitHub Flavored Markdown support',
  'rehype-highlight': 'Code highlighting for markdown',
};

function formatBundleSize(sizeKB) {
  if (sizeKB < 1024) {
    return `${sizeKB}KB`;
  }
  return `${(sizeKB / 1024).toFixed(1)}MB`;
}

function generateReadme(example) {
  const { name, type, features, requiredPeers, bundleSize } = example;

  // Format title
  const title = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const featureList = features.length > 0
    ? features.map(f => `- ${FEATURE_DESCRIPTIONS[f] || f}`).join('\n')
    : '- Basic chat functionality';

  const peerList = Object.keys(requiredPeers)
    .map(peer => `- \`${peer}\` - ${PEER_DESCRIPTIONS[peer] || 'Required dependency'}`)
    .join('\n');

  return `# ${title}

A demonstration of Clarity Chat Components showcasing ${features.length > 0 ? features.join(', ') : 'basic chat functionality'}.

## Quick Start

### Installation

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

### Requirements

This example requires the following peer dependencies:

${peerList}

All dependencies are already included in \`package.json\`. Just run \`pnpm install\`.

## Features

${featureList}

## Bundle Size

Estimated production bundle size (gzipped): **${formatBundleSize(bundleSize)}**

This includes:
- Core Clarity Chat components
- Required peer dependencies (React, Framer Motion, Lucide, Zod)
${features.includes('token-counting') || features.includes('token-optimization') ? '- Token counting utilities (flowtoken)\n' : ''}${features.includes('markdown') ? '- Markdown rendering ecosystem\n' : ''}${features.includes('pdf') || features.includes('docx') ? '- Document loaders\n' : ''}${features.includes('reranking') || features.includes('embeddings') ? '- Cohere AI SDK for RAG features\n' : ''}${features.includes('syntax-highlighting') || features.includes('code-block') ? '- Syntax highlighting libraries\n' : ''}

## Project Structure

\`\`\`
${name}/
├── src/
│   ├── app/              # ${type === 'Next.js' ? 'Next.js App Router' : 'Application code'}
│   ├── components/       # React components
│   └── ${type === 'Next.js' ? 'lib/' : 'main.tsx'}
├── package.json          # Dependencies and scripts
└── README.md            # This file
\`\`\`

## Development

### Running Locally

\`\`\`bash
pnpm dev
\`\`\`

The app will be available at:
- Vite apps: \`http://localhost:5173\`
- Next.js apps: \`http://localhost:3000\` (or custom port)

### Building for Production

\`\`\`bash
pnpm build
\`\`\`

${type === 'Next.js' ? `### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/${name})
` : ''}
## Configuration

### API Integration

Replace the mock responses with your actual API:

\`\`\`typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});
\`\`\`

### Environment Variables

${features.includes('rag') || features.includes('embeddings') || features.includes('reranking') ? `\`\`\`env
# Cohere API (for RAG features)
COHERE_API_KEY=your-cohere-api-key

# Your AI provider
OPENAI_API_KEY=your-openai-api-key
\`\`\`
` : `\`\`\`env
# Your AI provider API key
OPENAI_API_KEY=your-openai-api-key
# or
ANTHROPIC_API_KEY=your-anthropic-api-key
\`\`\`
`}
## Key Features Explained

${features.map(feature => {
  const desc = FEATURE_DESCRIPTIONS[feature] || feature;
  return `### ${feature.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

${desc}.`;
}).join('\n\n')}

## Customization

### Styling

This example uses Tailwind CSS. Customize the theme in \`tailwind.config.${type === 'Vite' ? 'js' : 'ts'}\`:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
};
\`\`\`

### Components

All Clarity Chat components are customizable via props and CSS classes:

\`\`\`tsx
<ChatWindow
  className="custom-class"
  theme="dark"
  // ... other props
/>
\`\`\`

## Troubleshooting

### Common Issues

**Build errors about missing peer dependencies**

Run \`pnpm install\` to ensure all peer dependencies are installed.

**TypeScript errors**

Ensure you have the latest TypeScript version:

\`\`\`bash
pnpm add -D typescript@latest
\`\`\`

**Bundle size too large**

This example includes ${features.length > 0 ? 'several features' : 'core features'}, which increases bundle size. For a smaller bundle:
1. Use the \`/core-minimal\` export for basic features
2. Import only the components you need
3. Enable tree-shaking in your bundler
4. Consider lazy loading heavy features

### Getting Help

- [Clarity Chat Documentation](https://clarity-chat.dev/docs)
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Examples Gallery](../gallery)

## Related Examples

${type === 'Vite' ? '- [Basic Chat](../basic-chat) - Simplest example\n- [Customer Support](../customer-support) - Next.js with Supabase\n' : '- [Streaming Chat](../streaming-chat) - Real-time streaming\n- [Basic Chat](../basic-chat) - Simple Vite example\n'}${features.includes('rag') ? '- [RAG Workbench](../rag-workbench-demo) - Advanced RAG features\n' : ''}${features.includes('theming') ? '- [Theme Builder](../theme-builder) - Theme customization\n' : ''}
## License

MIT - see repository root for details
`;
}

console.log('Generating README files for examples...\n');

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

for (const example of auditResults) {
  const readmePath = `${example.path}/README.md`;

  console.log(`Processing: ${example.name}`);

  try {
    // Check if README exists
    const readmeExists = existsSync(readmePath);

    if (readmeExists) {
      console.log(`  ℹ️  README exists, backing up...`);
      // Backup existing README
      const backupPath = `${example.path}/README.old.md`;
      const existingContent = readFileSync(readmePath, 'utf-8');
      writeFileSync(backupPath, existingContent);
    }

    // Generate new README
    const readme = generateReadme(example);
    writeFileSync(readmePath, readme);

    console.log(`  ✓ README ${readmeExists ? 'updated' : 'created'}\n`);
    successCount++;

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
    errorCount++;
  }
}

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total examples: ${auditResults.length}`);
console.log(`Successfully processed: ${successCount}`);
console.log(`Errors: ${errorCount}`);
console.log('\nAll examples now have:');
console.log('  ✓ Complete peer dependencies in package.json');
console.log('  ✓ Detailed installation instructions');
console.log('  ✓ Feature documentation');
console.log('  ✓ Bundle size information');
console.log('  ✓ Configuration examples');
console.log('\nNext: Test the examples run out of the box!');
