# @clarity-chat/errors

Enhanced error handling system with developer-friendly error messages, actionable solutions, and helpful debugging context.

## Features

- 🎯 **Clear Error Messages**: User-friendly descriptions of what went wrong
- 💡 **Actionable Solutions**: Step-by-step instructions to fix the problem
- 📝 **Code Examples**: Show the correct way to fix issues
- 🔗 **Documentation Links**: Direct links to relevant docs
- 🐛 **Debug Context**: Capture location, action, and relevant data
- 📊 **Multiple Formats**: Terminal, JSON API, and logging formats

## Installation

```bash
npm install @clarity-chat/errors
```

## Usage

### Basic Example

```typescript
import { APIKeyMissingError } from '@clarity-chat/errors'

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  throw new APIKeyMissingError('openai')
}

// Error output includes:
// - Clear message: "OPENAI API key is not configured"
// - Solutions with steps
// - Code examples
// - Links to docs
```

### API Route Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { handleError, APIAuthenticationError } from '@clarity-chat/errors'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      throw new APIAuthenticationError('openai')
    }
    
    // ... your code
    
  } catch (error) {
    const { statusCode, body } = handleError(error as Error)
    return NextResponse.json(body, { status: statusCode })
  }
}
```

### With Error Handler Middleware

```typescript
import { createErrorHandler } from '@clarity-chat/errors'

const withError = createErrorHandler()

export const POST = withError(async (req, res) => {
  // Your code here
  // Errors are automatically caught and formatted
})
```

## Error Types

### API Errors

#### APIKeyMissingError
Thrown when required API key is missing from environment.

```typescript
if (!process.env.OPENAI_API_KEY) {
  throw new APIKeyMissingError('openai')
}
```

**Solutions provided**:
- How to add API key to .env.local
- Where to get an API key
- Example .env.local format

#### APIRateLimitError
Thrown when API rate limit is exceeded.

```typescript
throw new APIRateLimitError('openai', 60) // 60 seconds retry
```

**Solutions provided**:
- Wait and retry automatically
- Check rate limits and upgrade
- Implement exponential backoff with code example

#### APIAuthenticationError
Thrown when API authentication fails.

```typescript
throw new APIAuthenticationError('anthropic')
```

**Solutions provided**:
- Verify API key is correct
- Generate new API key
- Check for expiration

#### APINetworkError
Thrown when network connection fails.

```typescript
throw new APINetworkError('google')
```

**Solutions provided**:
- Check internet connection
- Check API service status
- Configure proxy settings

#### APIResponseError
Thrown when API returns an error response.

```typescript
throw new APIResponseError('openai', 400, responseBody)
```

### Configuration Errors

#### EnvVarMissingError
Thrown when required environment variable is missing.

```typescript
if (!process.env.DATABASE_URL) {
  throw new EnvVarMissingError('DATABASE_URL')
}
```

#### InvalidConfigError
Thrown when configuration value is invalid.

```typescript
throw new InvalidConfigError('port', 'number', 'not-a-number')
```

#### PortAlreadyInUseError
Thrown when port is already in use.

```typescript
throw new PortAlreadyInUseError(3000)
```

**Solutions provided**:
- Kill process using the port
- Use a different port
- Commands to fix (fuser, PM2)

#### FileNotFoundError
Thrown when required file is missing.

```typescript
throw new FileNotFoundError('.env.local', '.env.local.example')
```

#### DependencyMissingError
Thrown when required npm package is not installed.

```typescript
throw new DependencyMissingError('openai')
```

### Validation Errors

#### ValidationError
General validation error with multiple issues.

```typescript
throw new ValidationError(
  'Input validation failed',
  ['Email is invalid', 'Age must be a number']
)
```

#### InvalidInputError
Thrown when input doesn't match expected format.

```typescript
throw new InvalidInputError('email', 'email address', 'not-an-email')
```

#### MissingFieldError
Thrown when required field is missing.

```typescript
throw new MissingFieldError('email')
```

#### TypeMismatchError
Thrown when value is wrong type.

```typescript
throw new TypeMismatchError('age', 'number', 'string')
```

## Utility Functions

### formatError
Format error for display.

```typescript
import { formatError } from '@clarity-chat/errors'

try {
  // ... code
} catch (error) {
  console.log(formatError(error as Error))
}
```

### logError
Log error with nice formatting.

```typescript
import { logError } from '@clarity-chat/errors'

try {
  // ... code
} catch (error) {
  logError(error as Error)
}
```

### handleError
Handle error and return HTTP response.

```typescript
import { handleError } from '@clarity-chat/errors'

try {
  // ... code
} catch (error) {
  const { statusCode, body } = handleError(error as Error)
  return NextResponse.json(body, { status: statusCode })
}
```

### withErrorHandling
Wrap async function with error handling.

```typescript
import { withErrorHandling } from '@clarity-chat/errors'

const myFunction = withErrorHandling(
  async () => {
    // ... your code
  },
  (error) => {
    console.error('Custom error handling:', error)
  }
)
```

### assert
Assert condition and throw descriptive error.

```typescript
import { assert, ValidationError } from '@clarity-chat/errors'

assert(
  email.includes('@'),
  new ValidationError('Invalid email', ['Email must contain @'])
)
```

### tryCatch
Try-catch wrapper that returns tuple.

```typescript
import { tryCatch } from '@clarity-chat/errors'

const [error, result] = await tryCatch(async () => {
  return await fetchData()
})

if (error) {
  logError(error)
  return
}

// Use result
console.log(result)
```

## Creating Custom Errors

Extend `ClarityError` to create custom error types:

```typescript
import { ClarityError, ErrorSolution } from '@clarity-chat/errors'

export class MyCustomError extends ClarityError {
  constructor(details: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'How to fix this',
        steps: [
          'Step 1',
          'Step 2',
          'Step 3'
        ],
        example: `// Code example
const fix = "like this"`,
        docsUrl: 'https://docs.example.com/fix'
      }
    ]

    super(
      'MY_CUSTOM_ERROR',           // Error code
      'User-friendly message',     // User message
      'Technical details',         // Technical message
      solutions,                   // Solutions array
      {                            // Context
        location: 'MyModule.myFunction',
        action: 'Processing data',
        data: { details }
      },
      originalError                // Original error if wrapping
    )
  }
}
```

## Error Output Formats

### Terminal Output
```
❌ APIKeyMissingError: OPENAI API key is not configured

Code: API_KEY_MISSING

📋 Technical Details:
   The environment variable OPENAI_API_KEY is missing or empty

📍 Location: API initialization

🎯 Action: Attempting to initialize openai client

📊 Context Data:
   provider: "openai"
   envKey: "OPENAI_API_KEY"

💡 Suggested Solutions:

   1. Add your OPENAI API key to environment variables

      1. Create or edit .env.local in your project root
      2. Add: OPENAI_API_KEY=your-api-key-here
      3. Restart your development server
      4. Verify the key is loaded: echo $OPENAI_API_KEY

      Example:
      # .env.local
      OPENAI_API_KEY=sk-...

      📚 Documentation: https://platform.openai.com/docs

   2. Get an API key if you don't have one
      ...
```

### JSON API Response
```json
{
  "name": "APIKeyMissingError",
  "code": "API_KEY_MISSING",
  "message": "OPENAI API key is not configured",
  "technicalMessage": "The environment variable OPENAI_API_KEY is missing or empty",
  "solutions": [
    {
      "description": "Add your OPENAI API key to environment variables",
      "steps": ["...", "..."],
      "example": "...",
      "docsUrl": "..."
    }
  ],
  "context": {
    "location": "API initialization",
    "action": "Attempting to initialize openai client",
    "data": {
      "provider": "openai",
      "envKey": "OPENAI_API_KEY"
    }
  },
  "timestamp": "2025-10-27T16:00:00.000Z"
}
```

### Log Format
```json
{
  "timestamp": "2025-10-27T16:00:00.000Z",
  "level": "error",
  "name": "APIKeyMissingError",
  "code": "API_KEY_MISSING",
  "message": "OPENAI API key is not configured",
  "technical": "The environment variable OPENAI_API_KEY is missing or empty",
  "context": {...},
  "stack": "..."
}
```

## Best Practices

### 1. Throw Specific Errors
```typescript
// ❌ Generic error
throw new Error('API key missing')

// ✅ Specific error with solutions
throw new APIKeyMissingError('openai')
```

### 2. Include Context
```typescript
// ✅ Add helpful context
throw new APIResponseError(
  'openai',
  400,
  {
    error: 'invalid_request',
    message: 'Missing required parameter'
  }
)
```

### 3. Chain Errors
```typescript
try {
  await riskyOperation()
} catch (error) {
  throw new APINetworkError('openai', error as Error)
}
```

### 4. Use Error Handlers
```typescript
// ✅ Centralized error handling
export const POST = withError(async (req, res) => {
  // Errors are automatically caught and formatted
})
```

## License

MIT
