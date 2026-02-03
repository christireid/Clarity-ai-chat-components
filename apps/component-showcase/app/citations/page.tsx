'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Quote,
  Link,
  ExternalLink,
  FileText,
  Globe,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  Eye,
  X,
  Image,
} from 'lucide-react'

// ============================================================================
// CITATION CHIPS DEMO
// ============================================================================
function CitationChipsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Citation Chips</CardTitle>
        <CardDescription>Inline source references</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Inline Citations */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Inline Style</p>
            <p className="text-sm leading-relaxed">
              React Hooks allow you to use state and other React features
              without writing a class
              <Badge
                variant="secondary"
                className="mx-1 text-xs cursor-pointer hover:bg-primary/20"
              >
                [1]
              </Badge>
              . The useState hook is the most commonly used hook
              <Badge
                variant="secondary"
                className="mx-1 text-xs cursor-pointer hover:bg-primary/20"
              >
                [2]
              </Badge>
              , followed by useEffect for side effects
              <Badge
                variant="secondary"
                className="mx-1 text-xs cursor-pointer hover:bg-primary/20"
              >
                [3]
              </Badge>
              .
            </p>
          </div>

          {/* Citation Pills */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Pill Style</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-7">
                <Globe className="h-3 w-3" />
                react.dev
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-7">
                <FileText className="h-3 w-3" />
                MDN Web Docs
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-7">
                <BookOpen className="h-3 w-3" />
                React Documentation
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Numbered References */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Numbered References
            </p>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium">
                    React Hooks Documentation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    react.dev/docs/hooks-intro
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium">useState Hook Guide</p>
                  <p className="text-xs text-muted-foreground">
                    react.dev/docs/hooks-state
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium">
                    useEffect Hook Reference
                  </p>
                  <p className="text-xs text-muted-foreground">
                    react.dev/docs/hooks-effect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SOURCE CARDS DEMO
// ============================================================================
function SourceCardsDemo() {
  const sources = [
    {
      title: 'React Hooks Introduction',
      url: 'https://react.dev/docs/hooks-intro',
      description:
        'Hooks are a new addition in React 16.8. They let you use state and other React features...',
      type: 'documentation',
      favicon: '⚛️',
    },
    {
      title: 'Understanding useState in React',
      url: 'https://dev.to/article/usestate',
      description:
        'A comprehensive guide to the useState hook with practical examples and best practices...',
      type: 'article',
      favicon: '📝',
    },
    {
      title: 'React Hooks Cheat Sheet',
      url: 'https://github.com/hooks-cheatsheet',
      description:
        'Quick reference for all React hooks with code examples and usage patterns...',
      type: 'github',
      favicon: '🐙',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Source Cards</CardTitle>
        <CardDescription>Detailed source reference cards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{source.favicon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {source.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {source.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {source.url}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {source.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// LINK PREVIEW DEMO
// ============================================================================
function LinkPreviewDemo() {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Link Preview</CardTitle>
        <CardDescription>Rich previews for URLs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Link with Hover Preview */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Hover to Preview
            </p>
            <div className="relative inline-block">
              <a
                href="#"
                className="text-primary underline text-sm"
                onMouseEnter={() => setShowPreview(true)}
                onMouseLeave={() => setShowPreview(false)}
              >
                React Documentation
              </a>
              {showPreview && (
                <div className="absolute top-full left-0 mt-2 w-80 p-4 bg-card border rounded-lg shadow-lg z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <span className="text-2xl">⚛️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        React Documentation
                      </h4>
                      <p className="text-xs text-muted-foreground">react.dev</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        The library for web and native user interfaces
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rich Link Card */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Rich Link Card</p>
            <div className="border rounded-lg overflow-hidden max-w-md">
              <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Image className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="p-4">
                <h4 className="font-medium">Building React Applications</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn how to build modern web applications with React,
                  including hooks, context, and more.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span>example.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Preview */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Compact Preview
            </p>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg max-w-md">
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Link className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  React Hooks Tutorial
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  https://example.com/react-hooks
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CITATIONS LIST DEMO
// ============================================================================
function CitationsListDemo() {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const citations = [
    {
      id: 1,
      number: 1,
      title: 'Introducing Hooks',
      author: 'React Team',
      source: 'React Documentation',
      url: 'react.dev/docs/hooks-intro',
      date: '2019',
    },
    {
      id: 2,
      number: 2,
      title: 'Hooks API Reference',
      author: 'React Team',
      source: 'React Documentation',
      url: 'react.dev/docs/hooks-reference',
      date: '2019',
    },
    {
      id: 3,
      number: 3,
      title: 'Building Your Own Hooks',
      author: 'React Team',
      source: 'React Documentation',
      url: 'react.dev/docs/hooks-custom',
      date: '2019',
    },
  ]

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Citations List</CardTitle>
            <CardDescription>Academic-style reference list</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            Copy All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {citations.map((citation) => (
            <div
              key={citation.id}
              className="flex items-start gap-4 p-3 border rounded-lg group"
            >
              <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-mono flex-shrink-0">
                {citation.number}
              </span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{citation.author}</span> (
                  {citation.date}).{' '}
                  <span className="italic">{citation.title}</span>.{' '}
                  <span className="text-muted-foreground">
                    {citation.source}
                  </span>
                  .
                </p>
                <a
                  href={`https://${citation.url}`}
                  className="text-xs text-primary hover:underline mt-1 inline-block"
                >
                  {citation.url}
                </a>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleCopy(citation.id)}
                >
                  {copiedId === citation.id ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUOTE BLOCK DEMO
// ============================================================================
function QuoteBlockDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quote Blocks</CardTitle>
        <CardDescription>
          Highlighted quotations with attribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Simple Quote */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Simple Quote</p>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
              &quot;Hooks let you use more of React&apos;s features without
              classes.&quot;
              <footer className="text-sm mt-2 not-italic">
                — React Documentation
              </footer>
            </blockquote>
          </div>

          {/* Card Quote */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Card Quote</p>
            <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
              <Quote className="h-6 w-6 text-primary/20 mb-2" />
              <p className="text-sm">
                &quot;The best way to predict the future is to implement
                it.&quot;
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium">DA</span>
                </div>
                <div>
                  <p className="text-xs font-medium">
                    David Heinemeier Hansson
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Creator of Ruby on Rails
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Quote */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Inline Quote</p>
            <p className="text-sm">
              As the documentation states,{' '}
              <span className="bg-primary/10 px-1 py-0.5 rounded text-primary">
                &quot;Hooks are a new addition in React 16.8&quot;
              </span>{' '}
              which revolutionized how we write React components.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CitationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Citations"
        description="Source references, link previews, and quotations"
      />

      <Tabs defaultValue="chips" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="chips">Citation Chips</TabsTrigger>
          <TabsTrigger value="cards">Source Cards</TabsTrigger>
          <TabsTrigger value="preview">Link Preview</TabsTrigger>
          <TabsTrigger value="list">Citations List</TabsTrigger>
          <TabsTrigger value="quotes">Quote Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="chips">
          <ComponentSection
            title="Citation Chips"
            description="Inline references"
          >
            <CitationChipsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="cards">
          <ComponentSection
            title="Source Cards"
            description="Detailed source info"
          >
            <SourceCardsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="preview">
          <ComponentSection
            title="Link Preview"
            description="Rich URL previews"
          >
            <LinkPreviewDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="list">
          <ComponentSection
            title="Citations List"
            description="Academic references"
          >
            <CitationsListDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="quotes">
          <ComponentSection
            title="Quote Blocks"
            description="Highlighted quotations"
          >
            <QuoteBlockDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
