/**
 * Live Preview Component
 * Renders user code in real-time using Sandpack
 */

import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { githubLight, githubDark } from '@codesandbox/sandpack-themes'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

interface LivePreviewProps {
  code: string
  theme: 'light' | 'dark'
  autoRun: boolean
}

export function LivePreview({ code, theme, autoRun }: LivePreviewProps) {
  const [showConsole, setShowConsole] = useState(false)

  // Prepare files for Sandpack
  const files = {
    '/App.tsx': {
      code: code,
      active: true,
    },
    '/styles.css': {
      code: `@import '@clarity-chat/react/dist/theme.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 1rem;
  min-height: 100vh;
}`,
      hidden: true,
    },
    '/package.json': {
      code: JSON.stringify(
        {
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            '@clarity-chat/primitives': 'latest',
            '@clarity-chat/react': 'latest',
            '@clarity-chat/types': 'latest',
            'lucide-react': 'latest',
            'class-variance-authority': 'latest',
            'clsx': 'latest',
            'tailwind-merge': 'latest',
          },
        },
        null,
        2
      ),
      hidden: true,
    },
  }

  return (
    <div className="h-full flex flex-col">
      {/* Console Toggle */}
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => setShowConsole(!showConsole)}
          className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
        >
          {showConsole ? 'Hide Console' : 'Show Console'}
        </button>
        <span className="text-xs text-muted-foreground">
          {autoRun ? '🟢 Auto-run enabled' : '⚫ Auto-run disabled'}
        </span>
      </div>

      {/* Sandpack */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border/40">
        <Sandpack
          template="react-ts"
          theme={theme === 'dark' ? githubDark : githubLight}
          files={files}
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: showConsole ? '50%' : '100%',
            autorun: autoRun,
            autoReload: true,
            recompileMode: 'delayed',
            recompileDelay: 500,
          }}
          customSetup={{
            dependencies: {
              '@clarity-chat/primitives': 'latest',
              '@clarity-chat/react': 'latest',
              '@clarity-chat/types': 'latest',
              'lucide-react': 'latest',
              'class-variance-authority': 'latest',
              clsx: 'latest',
              'tailwind-merge': 'latest',
            },
          }}
        >
          <SandpackLayout>
            <SandpackPreview
              showOpenInCodeSandbox={true}
              showRefreshButton={true}
              actionsChildren={
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="sp-button"
                  title="Toggle console"
                >
                  Console
                </button>
              }
            />
            {showConsole && (
              <SandpackConsole
                showHeader={true}
                showSyntaxError={true}
                resetOnPreviewRestart={true}
              />
            )}
          </SandpackLayout>
        </Sandpack>
      </div>

      {/* Info Panel */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Tip:</strong> All Clarity Chat components are pre-imported and ready to use.
            </p>
            <p>
              Edit the code above to see live changes. Console output appears when enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
