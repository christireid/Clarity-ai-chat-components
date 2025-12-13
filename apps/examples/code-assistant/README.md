# 💻 AI Code Assistant Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchristireid%2FClarity-ai-chat-components&project-name=code-assistant&root-directory=apps%2Fexamples%2Fcode-assistant&env=OPENAI_API_KEY)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/christireid/Clarity-ai-chat-components/tree/main/apps/examples/code-assistant)

Intelligent code assistant that helps with programming tasks, debugging, code generation, and code
review.

## ✨ Features

- 🎨 **Syntax Highlighting** - Monaco Editor with 50+ languages
- 🐛 **Debugging Help** - AI analyzes errors and suggests fixes
- ⚡ **Code Generation** - Generate functions, classes, tests
- 📝 **Code Review** - Get AI feedback on code quality
- 🔍 **Code Explanation** - Understand complex code
- 🔄 **Refactoring Suggestions** - Improve code structure
- 🧪 **Test Generation** - Auto-generate unit tests
- 📚 **Documentation** - Generate JSDoc comments
- 🎯 **Multi-Language** - TypeScript, Python, JavaScript, Go, Rust, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- OpenAI API key (GPT-4 recommended for best results)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your OpenAI API key
echo "OPENAI_API_KEY=sk-..." >> .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### AI Capabilities

The assistant uses **GPT-4** with specialized system prompts for:

1. **Code Generation**

   ```typescript
   "Generate a {language} {description}"
   → Produces complete, working code
   ```

2. **Debugging**

   ```typescript
   "Fix this error: {error_message}"
   → Analyzes stack traces, suggests fixes
   ```

3. **Code Review**

   ```typescript
   "Review this code: {code}"
   → Provides feedback on:
     - Performance
     - Security
     - Best practices
     - Bugs
   ```

4. **Explanation**
   ```typescript
   "Explain this code: {code}"
   → Breaks down complex logic
   ```

### Editor Features

**Monaco Editor Integration:**

- Full IntelliSense support
- Syntax highlighting for 50+ languages
- Auto-completion
- Multi-cursor editing
- Find and replace
- Code folding
- Minimap

## 💡 Use Cases

### 1. Code Generation

**Developer**: "Generate a TypeScript function that sorts an array of objects by a property"

**Assistant**:

```typescript
function sortByProperty<T>(array: T[], property: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return order === 'asc' ? -1 : 1
    if (a[property] > b[property]) return order === 'asc' ? 1 : -1
    return 0
  })
}
```

### 2. Debugging

**Developer**: "Why am I getting 'Cannot read property of undefined'?"

**Assistant**: _Analyzes your code_  
"The error occurs because you're accessing a property before checking if the object exists. Here's
the fix..."

### 3. Code Review

**Developer**: "Review this React component"

**Assistant**:

- ✅ Good use of hooks
- ⚠️ Missing error boundary
- ⚠️ useEffect dependency warning
- 💡 Consider memoization for performance

### 4. Refactoring

**Developer**: "Refactor this code to be more maintainable"

**Assistant**: _Suggests improvements_

- Extract repeated logic into functions
- Use TypeScript interfaces
- Add error handling

## 🎯 Key Features Demonstrated

### Multi-Language Support

```typescript
const languages = [
  'typescript',
  'javascript',
  'python',
  'go',
  'rust',
  'java',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
]
```

### Code Templates

- React Components
- API Routes
- Database Models
- Unit Tests
- Utility Functions

### Context Awareness

- Remembers previous code snippets in conversation
- Maintains programming context
- Suggests related improvements

## 🔧 Advanced Features

### 1. Multi-File Projects

```typescript
// Assistant can work across files
"Create a user authentication system with:
- User model (TypeScript interface)
- API route for login
- React hook for auth state
- Unit tests"
```

### 2. Framework-Specific Help

```typescript
// Specialized for frameworks
'Create a Next.js API route with middleware'
'Build a React component with Tailwind CSS'
'Write a Prisma schema for a blog'
```

### 3. Security Analysis

```typescript
// Identifies security issues
"Review this code for security vulnerabilities"
→ Points out SQL injection risks, XSS vulnerabilities, etc.
```

### 4. Performance Optimization

```typescript
// Suggests optimizations
"Optimize this algorithm"
→ Analyzes time/space complexity, suggests improvements
```

## 🎨 UI Features

### Split View

- Code editor on left
- AI chat on right
- Resizable panels

### Code Actions

- Copy code to clipboard
- Insert code into editor
- Save snippets
- Export conversation

### Syntax Themes

- Light mode
- Dark mode
- High contrast
- Custom themes

## 🚀 Production Enhancements

### 1. Version Control Integration

```typescript
// Integrate with Git
- Show diffs
- Create commits
- Explain changes
```

### 2. Linting Integration

```typescript
// Run ESLint/Prettier
- Auto-fix common issues
- Explain lint errors
```

### 3. Testing Integration

```typescript
// Run tests in context
- Execute unit tests
- Explain test failures
- Generate test cases
```

### 4. Documentation Generation

```typescript
// Auto-generate docs
- JSDoc comments
- README files
- API documentation
```

## 📊 Sample Interactions

### Example 1: API Route

```
User: "Create a Next.js API route for user authentication"
```
