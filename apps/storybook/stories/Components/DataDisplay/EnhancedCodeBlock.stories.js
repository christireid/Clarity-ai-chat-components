import { EnhancedCodeBlock } from '@clarity-chat/react';
const meta = {
    title: 'Components/DataDisplay/EnhancedCodeBlock',
    component: EnhancedCodeBlock,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};
export default meta;
const typescriptCode = `interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

function createUser(name: string, email: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date(),
  }
}

const user = createUser('John Doe', 'john@example.com')
console.log(user)`;
const pythonCode = `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    
    return sequence

# Example usage
result = fibonacci(10)
print(f"Fibonacci sequence: {result}")`;
const longCode = Array.from({ length: 50 }, (_, i) => `// Line ${i + 1}: This is a long code block that will demonstrate folding`).join('\n');
export const Default = {
    args: {
        code: typescriptCode,
        language: 'typescript',
        showLineNumbers: true,
        showCopyButton: true,
    },
};
export const WithLineNumbers = {
    args: {
        code: pythonCode,
        language: 'python',
        showLineNumbers: true,
        showCopyButton: true,
    },
};
export const WithFolding = {
    args: {
        code: longCode,
        language: 'javascript',
        showLineNumbers: true,
        enableFolding: true,
        maxHeight: 15,
        showCopyButton: true,
    },
};
export const FoldedByDefault = {
    args: {
        code: longCode,
        language: 'javascript',
        showLineNumbers: true,
        enableFolding: true,
        initiallyFolded: true,
        maxHeight: 10,
        showCopyButton: true,
    },
};
export const WithFilename = {
    args: {
        code: typescriptCode,
        language: 'typescript',
        filename: 'user.ts',
        showLineNumbers: true,
        showCopyButton: true,
    },
};
export const WithHighlightedLines = {
    args: {
        code: pythonCode,
        language: 'python',
        showLineNumbers: true,
        highlightLines: [3, 4, 5, 6],
        showCopyButton: true,
    },
};
export const LightTheme = {
    args: {
        code: typescriptCode,
        language: 'typescript',
        theme: 'light',
        showLineNumbers: true,
        showCopyButton: true,
    },
};
export const WithoutLineNumbers = {
    args: {
        code: pythonCode,
        language: 'python',
        showLineNumbers: false,
        showCopyButton: true,
    },
};
export const CustomStartLineNumber = {
    args: {
        code: typescriptCode,
        language: 'typescript',
        showLineNumbers: true,
        startLineNumber: 100,
        showCopyButton: true,
    },
};
//# sourceMappingURL=EnhancedCodeBlock.stories.js.map