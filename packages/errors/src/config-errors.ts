/**
 * Configuration and environment errors
 */

import { ClarityError, ErrorSolution } from './base-error'

export class EnvVarMissingError extends ClarityError {
  constructor(varName: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: `Add ${varName} to your environment variables`,
        steps: [
          'Create or edit .env.local in your project root',
          `Add: ${varName}=your-value`,
          'Restart your development server'
        ],
        example: `# .env.local\n${varName}=your-value-here`
      },
      {
        description: 'Copy from the example file',
        steps: [
          'Check if .env.local.example exists',
          'Copy it to .env.local: cp .env.local.example .env.local',
          'Fill in your actual values',
          'Restart your server'
        ]
      }
    ]

    super(
      'ENV_VAR_MISSING',
      `Environment variable ${varName} is not set`,
      `The required environment variable ${varName} is missing`,
      solutions,
      {
        location: 'Environment configuration',
        action: 'Loading environment variables',
        data: { varName }
      },
      originalError
    )
  }
}

export class InvalidConfigError extends ClarityError {
  constructor(
    configKey: string,
    expectedType: string,
    actualValue: any,
    originalError?: Error
  ) {
    const solutions: ErrorSolution[] = [
      {
        description: `Fix the ${configKey} configuration`,
        steps: [
          'Check your configuration file',
          `Ensure ${configKey} is a ${expectedType}`,
          'Review the documentation for correct format',
          'Restart your server'
        ],
        example: getConfigExample(configKey, expectedType)
      }
    ]

    super(
      'INVALID_CONFIG',
      `Invalid configuration for ${configKey}`,
      `Expected ${expectedType}, got ${typeof actualValue}: ${JSON.stringify(actualValue)}`,
      solutions,
      {
        location: 'Configuration validation',
        action: `Validating ${configKey}`,
        data: { configKey, expectedType, actualValue }
      },
      originalError
    )
  }
}

export class PortAlreadyInUseError extends ClarityError {
  constructor(port: number, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: `Kill the process using port ${port}`,
        steps: [
          `Find process: lsof -i :${port}`,
          `Kill it: fuser -k ${port}/tcp`,
          'Or use PM2: pm2 delete all',
          'Restart your server'
        ],
        example: `# Kill process on port ${port}
fuser -k ${port}/tcp 2>/dev/null || true

# Or use PM2
pm2 delete all`
      },
      {
        description: 'Use a different port',
        steps: [
          'Edit your configuration to use a different port',
          'Update ecosystem.config.cjs or package.json',
          'Restart your server'
        ],
        example: `# ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'npm',
    args: 'start',
    env: {
      PORT: ${port + 1}  // Use next available port
    }
  }]
}`
      }
    ]

    super(
      'PORT_IN_USE',
      `Port ${port} is already in use`,
      `Cannot start server on port ${port} because another process is using it`,
      solutions,
      {
        location: 'Server startup',
        action: `Binding to port ${port}`,
        data: { port }
      },
      originalError
    )
  }
}

export class FileNotFoundError extends ClarityError {
  constructor(filePath: string, expectedLocation?: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Create the missing file',
        steps: [
          `Create the file at: ${filePath}`,
          expectedLocation ? `Expected location: ${expectedLocation}` : '',
          'Add the required content',
          'Restart if necessary'
        ].filter(Boolean),
        example: expectedLocation ? `# Create file\ntouch ${filePath}\n\n# Or copy from example\ncp ${expectedLocation} ${filePath}` : undefined
      },
      {
        description: 'Check the file path',
        steps: [
          'Verify the file path is correct',
          'Check for typos in the path',
          'Ensure the file extension is correct',
          'Use absolute path if relative path fails'
        ]
      }
    ]

    super(
      'FILE_NOT_FOUND',
      `File not found: ${filePath}`,
      `The system cannot find the file at ${filePath}`,
      solutions,
      {
        location: 'File system',
        action: `Accessing file ${filePath}`,
        data: { filePath, expectedLocation }
      },
      originalError
    )
  }
}

export class DependencyMissingError extends ClarityError {
  constructor(packageName: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: `Install ${packageName}`,
        steps: [
          `Run: npm install ${packageName}`,
          'Wait for installation to complete',
          'Restart your development server'
        ],
        example: `npm install ${packageName}\n\n# Or with specific version\nnpm install ${packageName}@latest`
      },
      {
        description: 'Install all dependencies',
        steps: [
          'Run: npm install',
          'This will install all dependencies from package.json',
          'Check for any errors during installation',
          'Restart your server'
        ],
        example: `# Clean install\nrm -rf node_modules package-lock.json\nnpm install`
      }
    ]

    super(
      'DEPENDENCY_MISSING',
      `Required package '${packageName}' is not installed`,
      `Cannot find module '${packageName}'. You need to install it first.`,
      solutions,
      {
        location: 'Module resolution',
        action: `Importing ${packageName}`,
        data: { packageName }
      },
      originalError
    )
  }
}

// Helper function
function getConfigExample(key: string, type: string): string {
  const examples: Record<string, string> = {
    number: `// config.ts\nexport const config = {\n  ${key}: 3000\n}`,
    string: `// config.ts\nexport const config = {\n  ${key}: "value"\n}`,
    boolean: `// config.ts\nexport const config = {\n  ${key}: true\n}`,
    object: `// config.ts\nexport const config = {\n  ${key}: {\n    key: "value"\n  }\n}`,
    array: `// config.ts\nexport const config = {\n  ${key}: ["item1", "item2"]\n}`
  }
  
  return examples[type] || `// config.ts\nexport const config = {\n  ${key}: /* ${type} value */\n}`
}
