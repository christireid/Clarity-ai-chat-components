'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import {
  Code,
  Mail,
  FileText,
  ImageIcon,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Settings,
  ChevronDown,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'

// Code Generator
interface CodeGeneratorProps {
  onGenerate: (prompt: string, options: CodeGeneratorOptions) => Promise<string>
  className?: string
}

interface CodeGeneratorOptions {
  language: string
  framework?: string
  includeComments: boolean
  includeTests: boolean
}

export function CodeGenerator({ onGenerate, className }: CodeGeneratorProps) {
  const [prompt, setPrompt] = React.useState('')
  const [options, setOptions] = React.useState<CodeGeneratorOptions>({
    language: 'typescript',
    framework: '',
    includeComments: true,
    includeTests: false,
  })
  const [result, setResult] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [showOptions, setShowOptions] = React.useState(false)

  const languages = [
    'typescript',
    'javascript',
    'python',
    'rust',
    'go',
    'java',
    'cpp',
    'ruby',
    'php',
    'swift',
  ]

  const frameworks: Record<string, string[]> = {
    typescript: ['react', 'nextjs', 'express', 'nestjs'],
    javascript: ['react', 'vue', 'angular', 'express'],
    python: ['django', 'fastapi', 'flask'],
    rust: ['actix', 'rocket', 'axum'],
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const code = await onGenerate(prompt, options)
      setResult(code)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Code Generator
        </CardTitle>
        <CardDescription>
          Generate code from natural language descriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>What do you want to build?</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a React hook for fetching data with loading and error states..."
            className="min-h-[100px]"
          />
        </div>

        <Collapsible open={showOptions} onOpenChange={setShowOptions}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Options
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  showOptions && 'rotate-180'
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={options.language}
                  onValueChange={(v) =>
                    setOptions({ ...options, language: v, framework: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {frameworks[options.language] && (
                <div className="space-y-2">
                  <Label>Framework</Label>
                  <Select
                    value={options.framework}
                    onValueChange={(v) =>
                      setOptions({ ...options, framework: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {frameworks[options.language].map((fw) => (
                        <SelectItem key={fw} value={fw}>
                          {fw.charAt(0).toUpperCase() + fw.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label>Include comments</Label>
              <Switch
                checked={options.includeComments}
                onCheckedChange={(v) =>
                  setOptions({ ...options, includeComments: v })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Generate tests</Label>
              <Switch
                checked={options.includeTests}
                onCheckedChange={(v) =>
                  setOptions({ ...options, includeTests: v })
                }
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Code
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Code</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setResult('')}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <pre className="p-4 bg-code-bg rounded-lg overflow-x-auto max-h-96">
              <code className="text-sm font-mono">{result}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Email Generator
interface EmailGeneratorProps {
  onGenerate: (options: EmailGeneratorOptions) => Promise<string>
  className?: string
}

interface EmailGeneratorOptions {
  type: 'professional' | 'casual' | 'formal' | 'follow-up' | 'sales'
  tone: 'friendly' | 'neutral' | 'urgent' | 'apologetic'
  purpose: string
  recipient?: string
  context?: string
}

export function EmailGenerator({ onGenerate, className }: EmailGeneratorProps) {
  const [options, setOptions] = React.useState<EmailGeneratorOptions>({
    type: 'professional',
    tone: 'friendly',
    purpose: '',
    recipient: '',
    context: '',
  })
  const [result, setResult] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleGenerate = async () => {
    if (!options.purpose.trim()) return
    setLoading(true)
    try {
      const email = await onGenerate(options)
      setResult(email)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Generator
        </CardTitle>
        <CardDescription>
          Generate professional emails with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email Type</Label>
            <Select
              value={options.type}
              onValueChange={(v: EmailGeneratorOptions['type']) =>
                setOptions({ ...options, type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="sales">Sales/Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={options.tone}
              onValueChange={(v: EmailGeneratorOptions['tone']) =>
                setOptions({ ...options, tone: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Recipient (optional)</Label>
          <Input
            value={options.recipient}
            onChange={(e) =>
              setOptions({ ...options, recipient: e.target.value })
            }
            placeholder="E.g., John from Marketing"
          />
        </div>

        <div className="space-y-2">
          <Label>Purpose / Main Message</Label>
          <Textarea
            value={options.purpose}
            onChange={(e) =>
              setOptions({ ...options, purpose: e.target.value })
            }
            placeholder="E.g., Request a meeting to discuss the Q4 roadmap..."
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Additional Context (optional)</Label>
          <Textarea
            value={options.context}
            onChange={(e) =>
              setOptions({ ...options, context: e.target.value })
            }
            placeholder="Any additional details or constraints..."
            className="min-h-[60px]"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !options.purpose.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          Generate Email
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Email</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Writing Generator
interface WritingGeneratorProps {
  onGenerate: (options: WritingGeneratorOptions) => Promise<string>
  className?: string
}

interface WritingGeneratorOptions {
  type: 'blog' | 'article' | 'social' | 'summary' | 'creative'
  topic: string
  tone: string
  length: 'short' | 'medium' | 'long'
  keywords?: string[]
}

export function WritingGenerator({
  onGenerate,
  className,
}: WritingGeneratorProps) {
  const [options, setOptions] = React.useState<WritingGeneratorOptions>({
    type: 'blog',
    topic: '',
    tone: 'informative',
    length: 'medium',
    keywords: [],
  })
  const [keywordInput, setKeywordInput] = React.useState('')
  const [result, setResult] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleAddKeyword = () => {
    if (keywordInput && !options.keywords?.includes(keywordInput)) {
      setOptions({
        ...options,
        keywords: [...(options.keywords || []), keywordInput],
      })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setOptions({
      ...options,
      keywords: options.keywords?.filter((k) => k !== keyword),
    })
  }

  const handleGenerate = async () => {
    if (!options.topic.trim()) return
    setLoading(true)
    try {
      const content = await onGenerate(options)
      setResult(content)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Writing Assistant
        </CardTitle>
        <CardDescription>
          Generate articles, blog posts, and creative content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select
              value={options.type}
              onValueChange={(v: WritingGeneratorOptions['type']) =>
                setOptions({ ...options, type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="creative">Creative Writing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select
              value={options.length}
              onValueChange={(v: WritingGeneratorOptions['length']) =>
                setOptions({ ...options, length: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (~200 words)</SelectItem>
                <SelectItem value="medium">Medium (~500 words)</SelectItem>
                <SelectItem value="long">Long (~1000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Topic / Title</Label>
          <Input
            value={options.topic}
            onChange={(e) => setOptions({ ...options, topic: e.target.value })}
            placeholder="E.g., The Future of AI in Healthcare"
          />
        </div>

        <div className="space-y-2">
          <Label>Keywords (optional)</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add keyword"
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button variant="outline" onClick={handleAddKeyword}>
              Add
            </Button>
          </div>
          {options.keywords && options.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {options.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(keyword)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !options.topic.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Content
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Content</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Image Prompt Generator
interface ImagePromptGeneratorProps {
  onGenerate: (options: ImagePromptOptions) => Promise<string>
  className?: string
}

interface ImagePromptOptions {
  subject: string
  style: string
  mood: string
  details?: string
}

export function ImagePromptGenerator({
  onGenerate,
  className,
}: ImagePromptGeneratorProps) {
  const [options, setOptions] = React.useState<ImagePromptOptions>({
    subject: '',
    style: 'photorealistic',
    mood: 'neutral',
    details: '',
  })
  const [result, setResult] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const styles = [
    'photorealistic',
    'digital art',
    'oil painting',
    'watercolor',
    'anime',
    '3D render',
    'sketch',
    'minimalist',
    'surreal',
  ]

  const moods = [
    'neutral',
    'dramatic',
    'peaceful',
    'energetic',
    'mysterious',
    'cheerful',
    'dark',
    'ethereal',
  ]

  const handleGenerate = async () => {
    if (!options.subject.trim()) return
    setLoading(true)
    try {
      const prompt = await onGenerate(options)
      setResult(prompt)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Prompt Generator
        </CardTitle>
        <CardDescription>
          Generate detailed prompts for AI image generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Subject / Main Idea</Label>
          <Input
            value={options.subject}
            onChange={(e) =>
              setOptions({ ...options, subject: e.target.value })
            }
            placeholder="E.g., A futuristic city at sunset"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={options.style}
              onValueChange={(v) => setOptions({ ...options, style: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mood</Label>
            <Select
              value={options.mood}
              onValueChange={(v) => setOptions({ ...options, mood: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Additional Details (optional)</Label>
          <Textarea
            value={options.details}
            onChange={(e) =>
              setOptions({ ...options, details: e.target.value })
            }
            placeholder="Lighting, composition, colors, camera angle..."
            className="min-h-[60px]"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !options.subject.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          Generate Prompt
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Prompt</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg text-sm">{result}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
