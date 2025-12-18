import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlock } from './CodeBlock'
import { CODE_THEMES, getDarkThemes, getLightThemes } from './themes'

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/Code/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
World-class code display component with Shiki-powered syntax highlighting.

## Features
- **Shiki Highlighting**: Uses the same engine as VS Code for accurate syntax highlighting
- **15+ Themes**: Material, Night Owl, GitHub, Dracula, and more
- **Premium Fonts**: Fira Code with ligature support
- **Line Features**: Numbers, highlighting, and diff visualization
- **Copy Button**: Animated copy-to-clipboard with feedback
- **Expandable**: Collapse long code blocks with expand/collapse
- **Accessible**: WCAG 2.1 AA compliant, keyboard navigable
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: 'select',
      options: Object.keys(CODE_THEMES),
      description: 'Syntax highlighting theme',
    },
    language: {
      control: 'text',
      description: 'Programming language for highlighting',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Show line numbers gutter',
    },
    showCopyButton: {
      control: 'boolean',
      description: 'Show copy to clipboard button',
    },
    wordWrap: {
      control: 'boolean',
      description: 'Enable word wrapping',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height before collapse',
    },
  },
}

export default meta
type Story = StoryObj<typeof CodeBlock>

// Sample code snippets
const typeScriptCode = `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! Welcome to our platform.\`;
}

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
};

logger.debug(greetUser(user));`

const pythonCode = `import asyncio
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class User:
    id: str
    name: str
    email: str

async def fetch_users() -> List[User]:
    """Fetch users from the database."""
    await asyncio.sleep(1)  # Simulate async operation
    return [
        User(id="1", name="Alice", email="alice@example.com"),
        User(id="2", name="Bob", email="bob@example.com"),
    ]

async def main():
    users = await fetch_users()
    for user in users:
        print(f"User: {user.name} ({user.email})")

if __name__ == "__main__":
    asyncio.run(main())`

const reactCode = `import { useState, useCallback } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  return (
    <div className="counter">
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`

// Basic stories
export const Default: Story = {
  args: {
    children: typeScriptCode,
    language: 'typescript',
    theme: 'github-dark',
  },
}

export const WithTitle: Story = {
  args: {
    children: typeScriptCode,
    language: 'typescript',
    theme: 'github-dark',
    title: 'user-service.ts',
  },
}

export const WithLineNumbers: Story = {
  args: {
    children: typeScriptCode,
    language: 'typescript',
    theme: 'github-dark',
    showLineNumbers: true,
  },
}

export const WithHighlightedLines: Story = {
  args: {
    children: typeScriptCode,
    language: 'typescript',
    theme: 'github-dark',
    showLineNumbers: true,
    highlightLines: '7-9,14',
    title: 'user-service.ts',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Highlight specific lines to draw attention. Use comma-separated values and ranges (e.g., "2,5-7,10").',
      },
    },
  },
}

export const DiffView: Story = {
  args: {
    children: `function greet(name) {
-  logger.debug('Hello ' + name);
+  logger.debug(\`Hello, \${name}!\`);
   return name;
}`,
    language: 'javascript',
    theme: 'github-dark',
    showLineNumbers: true,
    addedLines: '3',
    removedLines: '2',
    title: 'greet.js',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Show diff-style highlighting with added (green) and removed (red) lines.',
      },
    },
  },
}

export const Python: Story = {
  args: {
    children: pythonCode,
    language: 'python',
    theme: 'one-dark-pro',
    showLineNumbers: true,
    title: 'main.py',
  },
}

export const ReactJSX: Story = {
  args: {
    children: reactCode,
    language: 'tsx',
    theme: 'night-owl',
    showLineNumbers: true,
    title: 'Counter.tsx',
  },
}

export const LongCodeCollapsible: Story = {
  args: {
    children: Array(50).fill(typeScriptCode).join('\n\n'),
    language: 'typescript',
    theme: 'github-dark',
    showLineNumbers: true,
    maxHeight: 300,
    title: 'long-file.ts',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long code blocks can be collapsed with a maximum height. Users can expand to see all content.',
      },
    },
  },
}

export const WithWordWrap: Story = {
  args: {
    children: `const veryLongString = "This is a very long string that demonstrates word wrapping functionality in the code block component. When wordWrap is enabled, long lines will wrap instead of requiring horizontal scrolling.";`,
    language: 'javascript',
    theme: 'github-dark',
    wordWrap: true,
  },
}

export const NoCopyButton: Story = {
  args: {
    children: typeScriptCode,
    language: 'typescript',
    theme: 'github-dark',
    showCopyButton: false,
  },
}

// Theme showcase
export const ThemeShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {getDarkThemes()
        .slice(0, 6)
        .map((theme) => (
          <CodeBlock
            key={theme}
            language="typescript"
            theme={theme}
            title={CODE_THEMES[theme].name}
            showLineNumbers
          >
            {`const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};`}
          </CodeBlock>
        ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of available dark themes.',
      },
    },
  },
}

export const LightThemes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
      {getLightThemes()
        .slice(0, 4)
        .map((theme) => (
          <CodeBlock
            key={theme}
            language="typescript"
            theme={theme}
            title={CODE_THEMES[theme].name}
            showLineNumbers
          >
            {`const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};`}
          </CodeBlock>
        ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of available light themes.',
      },
    },
  },
}
