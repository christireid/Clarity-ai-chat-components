'use client'

import { useState, useRef, useEffect } from 'react'
import { CodeBlock } from '@clarity-chat/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import { Code, Terminal, Play, Copy, Loader2 } from 'lucide-react'

export function CodeTerminalDemo() {
  const [activeTab, setActiveTab] = useState('code')
  const [isRunning, setIsRunning] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm install @clarity-chat/react',
    'added 45 packages in 2.3s',
    '',
    '$ npm run build',
    '> clarity-chat@1.0.0 build',
    '✓ Compiled successfully in 3.2s',
  ])

  const sampleCode = `import { ClarityChatApp, useClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  const { messages, sendMessage, isStreaming } = useClarityChat({
    api: '/api/chat',
    onFinish: (message) => console.log('Done:', message),
  })

  return (
    <ClarityChatApp
      api="/api/chat"
      features={{
        memory: true,
        tools: ['web_search', 'code_interpreter'],
        tokenOptimization: true,
      }}
      preset="enterprise"
    />
  )
}`

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  const runCode = () => {
    setIsRunning(true)
    setTerminalOutput((prev) => [...prev, '', '$ tsx example.ts'])
    timersRef.current = [
      setTimeout(
        () =>
          setTerminalOutput((prev) => [
            ...prev,
            'Initializing Clarity Chat...',
          ]),
        500
      ),
      setTimeout(
        () => setTerminalOutput((prev) => [...prev, '✓ Connected to API']),
        1000
      ),
      setTimeout(
        () => setTerminalOutput((prev) => [...prev, '✓ Memory initialized']),
        1500
      ),
      setTimeout(() => {
        setTerminalOutput((prev) => [
          ...prev,
          '',
          'Server running at http://localhost:3000',
        ])
        setIsRunning(false)
      }, 2000),
    ]
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code & Terminal</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="terminal" className="gap-2">
              <Terminal className="h-4 w-4" />
              Terminal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-0">
            <CodeBlock
              code={sampleCode}
              language="typescript"
              showLineNumbers
            />
          </TabsContent>
          <TabsContent value="terminal" className="mt-0">
            <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm h-[300px] overflow-auto">
              {terminalOutput.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    line.startsWith('✓') && 'text-green-400',
                    line.startsWith('$') && 'text-blue-400',
                    line.startsWith('>') && 'text-yellow-400',
                    !line.startsWith('✓') &&
                      !line.startsWith('$') &&
                      !line.startsWith('>') &&
                      'text-gray-300'
                  )}
                >
                  {line || '\u00A0'}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Running...
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
