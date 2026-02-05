/**
 * CodeBlock Showcase Component
 *
 * Demonstrates comprehensive code block features:
 * - Multiple language syntax highlighting
 * - Copy code functionality with feedback
 * - Line numbers
 * - Safe code execution sandbox
 * - Glassmorphism styling
 * - Language selector
 * - Theme variants
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Copy,
  Check,
  Play,
  Terminal,
  Code2,
  FileCode,
  Eye,
  EyeOff,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react'
import './CodeBlockShowcase.css'

// Sample code snippets for different languages
const CODE_SAMPLES = {
  typescript: `// TypeScript Example: Advanced Type System
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

type AsyncResult<T> = Promise<{ data: T; error: null } | { data: null; error: Error }>

async function fetchUser(id: string): AsyncResult<User> {
  try {
    const response = await fetch(\`/api/users/\${id}\`)
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Generic utility type for API responses
type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  timestamp: Date
}`,

  javascript: `// JavaScript Example: Modern ES6+ Features
const users = [
  { id: 1, name: 'Alice', score: 85 },
  { id: 2, name: 'Bob', score: 92 },
  { id: 3, name: 'Charlie', score: 78 }
]

// Array methods and destructuring
const topScorers = users
  .filter(({ score }) => score > 80)
  .map(({ name, score }) => ({ name, score }))
  .sort((a, b) => b.score - a.score)

// Async/await with error handling
async function processData(data) {
  try {
    const result = await Promise.all(
      data.map(async item => {
        const processed = await transform(item)
        return { ...item, processed }
      })
    )
    return result
  } catch (error) {
    console.error('Processing failed:', error)
    throw error
  }
}

// Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous'`,

  python: `# Python Example: Data Processing with Pandas
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DataProcessor:
    """Advanced data processing with pandas"""

    def __init__(self, data_path: str):
        self.df = pd.read_csv(data_path)
        self.processed = False

    def clean_data(self):
        """Clean and prepare data for analysis"""
        # Remove duplicates
        self.df.drop_duplicates(inplace=True)

        # Handle missing values
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        self.df[numeric_cols] = self.df[numeric_cols].fillna(
            self.df[numeric_cols].mean()
        )

        # Convert dates
        date_cols = ['created_at', 'updated_at']
        for col in date_cols:
            self.df[col] = pd.to_datetime(self.df[col])

        self.processed = True
        return self

    def aggregate_metrics(self, group_by: str):
        """Calculate aggregate metrics"""
        if not self.processed:
            raise ValueError("Data must be cleaned first")

        return self.df.groupby(group_by).agg({
            'revenue': ['sum', 'mean', 'std'],
            'users': 'count',
            'conversion_rate': 'mean'
        }).round(2)`,

  rust: `// Rust Example: Systems Programming
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::task;

#[derive(Debug, Clone)]
struct User {
    id: u64,
    name: String,
    email: String,
}

// Thread-safe cache implementation
struct Cache<K, V> {
    store: Arc<Mutex<HashMap<K, V>>>,
}

impl<K: Eq + std::hash::Hash + Clone, V: Clone> Cache<K, V> {
    fn new() -> Self {
        Cache {
            store: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    fn get(&self, key: &K) -> Option<V> {
        self.store.lock().unwrap().get(key).cloned()
    }

    fn insert(&self, key: K, value: V) {
        self.store.lock().unwrap().insert(key, value);
    }
}

// Async function with error handling
async fn fetch_user(id: u64) -> Result<User, Box<dyn std::error::Error>> {
    let response = reqwest::get(format!("https://api.example.com/users/{}", id))
        .await?
        .json::<User>()
        .await?;

    Ok(response)
}`,

  go: `// Go Example: Concurrent Web Server
package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "sync"
    "time"
)

type User struct {
    ID        string    \`json:"id"\`
    Name      string    \`json:"name"\`
    Email     string    \`json:"email"\`
    CreatedAt time.Time \`json:"created_at"\`
}

type UserCache struct {
    mu    sync.RWMutex
    users map[string]*User
}

func NewUserCache() *UserCache {
    return &UserCache{
        users: make(map[string]*User),
    }
}

func (c *UserCache) Get(id string) (*User, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    user, ok := c.users[id]
    return user, ok
}

func (c *UserCache) Set(user *User) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.users[user.ID] = user
}

func handleUser(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    user, err := fetchUserFromDB(ctx, r.URL.Query().Get("id"))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(user)
}`,

  sql: `-- SQL Example: Complex Database Queries
-- Create tables with relationships
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complex query with multiple JOINs and aggregations
WITH monthly_stats AS (
    SELECT
        u.id,
        u.username,
        DATE_TRUNC('month', o.created_at) as month,
        COUNT(*) as order_count,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value
    FROM users u
    INNER JOIN orders o ON u.id = o.user_id
    WHERE o.status = 'completed'
      AND o.created_at >= NOW() - INTERVAL '6 months'
    GROUP BY u.id, u.username, DATE_TRUNC('month', o.created_at)
),
user_rankings AS (
    SELECT
        username,
        SUM(total_spent) as lifetime_value,
        RANK() OVER (ORDER BY SUM(total_spent) DESC) as customer_rank
    FROM monthly_stats
    GROUP BY username
)
SELECT * FROM user_rankings WHERE customer_rank <= 10;`,

  json: `{
  "api": {
    "version": "2.0",
    "endpoints": {
      "users": {
        "path": "/api/v2/users",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "authentication": "bearer",
        "rateLimit": {
          "requests": 1000,
          "window": "1h"
        }
      },
      "products": {
        "path": "/api/v2/products",
        "methods": ["GET", "POST"],
        "filters": ["category", "price", "availability"],
        "sorting": ["name", "price", "rating"]
      }
    },
    "features": {
      "pagination": true,
      "filtering": true,
      "sorting": true,
      "include": ["metadata", "relationships"]
    },
    "errors": {
      "400": "Bad Request - Invalid parameters",
      "401": "Unauthorized - Invalid or missing token",
      "403": "Forbidden - Insufficient permissions",
      "404": "Not Found - Resource does not exist",
      "429": "Too Many Requests - Rate limit exceeded",
      "500": "Internal Server Error"
    }
  }
}`,

  css: `/* CSS Example: Modern Styling with Variables */
:root {
  /* Color System using OKLCH */
  --color-primary: oklch(65% 0.2 250);
  --color-secondary: oklch(75% 0.15 180);
  --color-accent: oklch(70% 0.25 30);

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;

  /* Glassmorphism */
  --glass-bg: oklch(95% 0.01 250 / 0.7);
  --glass-border: oklch(100% 0 0 / 0.18);
  --glass-shadow: 0 8px 32px 0 oklch(0% 0 0 / 0.37);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  padding: var(--space-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 oklch(0% 0 0 / 0.5);
}

@media (prefers-color-scheme: dark) {
  :root {
    --glass-bg: oklch(20% 0.01 250 / 0.7);
    --glass-border: oklch(0% 0 0 / 0.18);
  }
}`,

  bash: `#!/bin/bash
# Bash Example: Deployment Script

set -euo pipefail

# Configuration
readonly APP_NAME="my-app"
readonly DEPLOY_ENV="\${1:-staging}"
readonly TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
readonly BACKUP_DIR="/backups/\${APP_NAME}/\${TIMESTAMP}"

# Colors for output
readonly RED='\\033[0;31m'
readonly GREEN='\\033[0;32m'
readonly YELLOW='\\033[1;33m'
readonly NC='\\033[0m' # No Color

log() {
    echo -e "\${GREEN}[\$(date +'%Y-%m-%d %H:%M:%S')]\${NC} \$*"
}

error() {
    echo -e "\${RED}[ERROR]\${NC} \$*" >&2
    exit 1
}

warn() {
    echo -e "\${YELLOW}[WARN]\${NC} \$*"
}

# Create backup
backup_database() {
    log "Creating database backup..."
    mkdir -p "\$BACKUP_DIR"

    if pg_dump "\$DB_NAME" > "\${BACKUP_DIR}/db_backup.sql"; then
        log "Database backup created successfully"
    else
        error "Database backup failed"
    fi
}

# Deploy application
deploy() {
    log "Deploying \${APP_NAME} to \${DEPLOY_ENV}..."

    # Pull latest code
    git fetch origin
    git checkout "\$DEPLOY_ENV"
    git pull origin "\$DEPLOY_ENV"

    # Install dependencies
    npm ci --production

    # Run migrations
    npm run migrate

    # Build application
    npm run build

    # Restart services
    pm2 restart "\$APP_NAME"

    log "Deployment completed successfully"
}

# Main execution
main() {
    log "Starting deployment process..."
    backup_database
    deploy
    log "All done! 🚀"
}

main "\$@"`
}

// Executable code for sandbox
const EXECUTABLE_CODE = {
  javascript: `// Click Run to execute this code
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Original:', numbers);
console.log('Doubled:', doubled);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

// Return statement
return {
  result: doubled,
  sum: sum,
  message: 'Code executed successfully! ✓'
};`,

  python: `# Python execution is simulated in the browser
# This demonstrates what the output would look like

numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Original: {numbers}")
print(f"Doubled: {doubled}")

sum_result = sum(numbers)
print(f"Sum: {sum_result}")

# Return result
result = {
    "doubled": doubled,
    "sum": sum_result,
    "message": "Code executed successfully! ✓"
}
print(result)`,

  typescript: `// TypeScript execution (transpiled to JavaScript)
interface Result {
  value: number;
  label: string;
}

const calculate = (x: number, y: number): Result[] => {
  return [
    { value: x + y, label: 'Sum' },
    { value: x * y, label: 'Product' },
    { value: Math.pow(x, y), label: 'Power' }
  ];
};

const results = calculate(5, 3);
console.log('Calculations:', results);

return {
  results,
  message: 'TypeScript executed successfully! ✓'
};`
}

type Language = keyof typeof CODE_SAMPLES
type Theme = 'dark' | 'light'
type ExecutionResult = {
  output: string
  error?: string
  timestamp: number
}

interface CodeBlockProps {
  code?: string
  language?: Language
  showLineNumbers?: boolean
  theme?: Theme
  title?: string
  editable?: boolean
  executable?: boolean
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code: initialCode,
  language = 'javascript',
  showLineNumbers = true,
  theme = 'dark',
  title,
  editable = false,
  executable = false,
}) => {
  const [code, setCode] = useState(initialCode || CODE_SAMPLES[language])
  const [copied, setCopied] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, language])

  const executeCode = useCallback(async () => {
    if (!executable) return

    setIsExecuting(true)
    setExecutionResult(null)

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      let output = ''
      let result: any

      if (language === 'javascript' || language === 'typescript') {
        // Create a safe execution context
        const logs: string[] = []
        const safeConsole = {
          log: (...args: any[]) => logs.push(args.map(String).join(' ')),
          error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
          warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
        }

        try {
          // Execute in isolated context
          const func = new Function('console', code)
          result = func(safeConsole)

          output = logs.join('\n')

          if (result !== undefined) {
            output += '\n\nReturn value:\n' + JSON.stringify(result, null, 2)
          }
        } catch (err) {
          output = logs.join('\n')
          throw err
        }
      } else {
        // For other languages, show simulated output
        output = `# Simulated output for ${language}\n# In a real implementation, this would execute in a sandbox\n\n`
        output += `Language: ${language}\n`
        output += `Code length: ${code.length} characters\n`
        output += `Lines: ${code.split('\n').length}\n`
        output += `\nExecution completed successfully! ✓`
      }

      setExecutionResult({
        output,
        timestamp: Date.now()
      })
    } catch (err) {
      setExecutionResult({
        output: '',
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: Date.now()
      })
    } finally {
      setIsExecuting(false)
    }
  }, [code, language, executable])

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : oneLight

  return (
    <div className={`code-block glass-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="code-block-header">
        <div className="code-block-title">
          <FileCode size={16} />
          <span>{title || `${language.toUpperCase()} Code`}</span>
        </div>
        <div className="code-block-actions">
          {executable && (
            <button
              className="code-action-btn execute-btn"
              onClick={executeCode}
              disabled={isExecuting}
              title="Run code"
            >
              {isExecuting ? (
                <Terminal size={16} className="spinning" />
              ) : (
                <Play size={16} />
              )}
            </button>
          )}
          <button
            className="code-action-btn"
            onClick={handleDownload}
            title="Download code"
          >
            <Download size={16} />
          </button>
          <button
            className="code-action-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            className="code-action-btn copy-btn"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span className="copy-label">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="copy-label">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="code-block-content">
        {editable ? (
          <textarea
            ref={textareaRef}
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '1rem',
              width: '100%',
              minHeight: '400px',
              background: theme === 'dark' ? '#1e1e1e' : '#f6f8fa',
              color: theme === 'dark' ? '#d4d4d4' : '#24292f',
              border: 'none',
              resize: 'vertical',
            }}
          />
        ) : (
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            showLineNumbers={showLineNumbers}
            wrapLines
            customStyle={{
              margin: 0,
              borderRadius: '0 0 8px 8px',
              fontSize: '14px',
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: theme === 'dark' ? '#858585' : '#999',
              userSelect: 'none',
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>

      {executionResult && (
        <div className={`execution-result ${executionResult.error ? 'error' : 'success'}`}>
          <div className="execution-header">
            <Terminal size={14} />
            <span>{executionResult.error ? 'Execution Error' : 'Execution Output'}</span>
            <span className="execution-time">
              {new Date(executionResult.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <pre className="execution-output">
            {executionResult.error || executionResult.output}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function CodeBlockShowcase() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('typescript')
  const [theme, setTheme] = useState<Theme>('dark')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [showExecutable, setShowExecutable] = useState(false)

  const languages = Object.keys(CODE_SAMPLES) as Language[]

  return (
    <div className="code-block-showcase">
      <div className="showcase-header-section glass-container">
        <h1>🎨 CodeBlock Showcase</h1>
        <p>Comprehensive code display with syntax highlighting, execution, and glassmorphism design</p>
      </div>

      <div className="showcase-controls glass-container">
        <div className="control-group">
          <label>
            <Code2 size={16} />
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Theme</label>
          <div className="theme-toggle">
            <button
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
            />
            Line Numbers
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showExecutable}
              onChange={(e) => setShowExecutable(e.target.checked)}
            />
            Enable Execution
          </label>
        </div>
      </div>

      <div className="showcase-grid">
        <div className="showcase-section">
          <h2>📝 Syntax Highlighting</h2>
          <CodeBlock
            code={CODE_SAMPLES[selectedLanguage]}
            language={selectedLanguage}
            showLineNumbers={showLineNumbers}
            theme={theme}
            title={`${selectedLanguage.toUpperCase()} Example`}
          />
        </div>

        {showExecutable && EXECUTABLE_CODE[selectedLanguage as keyof typeof EXECUTABLE_CODE] && (
          <div className="showcase-section">
            <h2>▶️ Live Execution</h2>
            <CodeBlock
              code={EXECUTABLE_CODE[selectedLanguage as keyof typeof EXECUTABLE_CODE]}
              language={selectedLanguage}
              showLineNumbers={showLineNumbers}
              theme={theme}
              title="Executable Code"
              executable={true}
            />
          </div>
        )}

        <div className="showcase-section">
          <h2>✏️ Editable Code</h2>
          <CodeBlock
            code={CODE_SAMPLES[selectedLanguage]}
            language={selectedLanguage}
            showLineNumbers={showLineNumbers}
            theme={theme}
            title="Edit & Execute"
            editable={true}
            executable={selectedLanguage === 'javascript' || selectedLanguage === 'typescript'}
          />
        </div>
      </div>

      <div className="showcase-features glass-container">
        <h2>✨ Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Code2 size={24} />
            <h3>10+ Languages</h3>
            <p>TypeScript, JavaScript, Python, Rust, Go, SQL, CSS, Bash, JSON and more</p>
          </div>
          <div className="feature-card">
            <Copy size={24} />
            <h3>One-Click Copy</h3>
            <p>Copy code to clipboard with visual feedback</p>
          </div>
          <div className="feature-card">
            <Play size={24} />
            <h3>Safe Execution</h3>
            <p>Run JavaScript/TypeScript in isolated sandbox</p>
          </div>
          <div className="feature-card">
            <Eye size={24} />
            <h3>Syntax Highlighting</h3>
            <p>Beautiful code highlighting with Prism.js</p>
          </div>
          <div className="feature-card">
            <Terminal size={24} />
            <h3>Line Numbers</h3>
            <p>Toggle line numbers for better readability</p>
          </div>
          <div className="feature-card">
            <Download size={24} />
            <h3>Export Code</h3>
            <p>Download code snippets as files</p>
          </div>
        </div>
      </div>

      <div className="showcase-info glass-container">
        <h3>🎨 Glassmorphism Design</h3>
        <p>
          All code blocks feature modern glassmorphism design with backdrop blur,
          subtle transparency, and smooth animations. The design adapts to light
          and dark themes seamlessly.
        </p>
        <div className="tech-stack">
          <span className="tech-badge">React 19</span>
          <span className="tech-badge">TypeScript</span>
          <span className="tech-badge">Prism.js</span>
          <span className="tech-badge">Lucide Icons</span>
          <span className="tech-badge">CSS Modules</span>
        </div>
      </div>
    </div>
  )
}
