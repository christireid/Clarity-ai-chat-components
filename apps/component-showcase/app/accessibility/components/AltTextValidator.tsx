'use client'

import { useState } from 'react'
import { Image, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ImageAudit {
  src: string
  alt: string
  status: 'good' | 'warning' | 'error'
  issues: string[]
  suggestions: string[]
}

export function AltTextValidator() {
  const [altText, setAltText] = useState('')

  const demoImages: ImageAudit[] = [
    {
      src: '/logo.png',
      alt: 'Clarity Chat Logo',
      status: 'good',
      issues: [],
      suggestions: ['Alt text is descriptive and concise'],
    },
    {
      src: '/user-avatar.jpg',
      alt: '',
      status: 'error',
      issues: ['Missing alt attribute'],
      suggestions: ['Add descriptive alt text like "User profile photo"'],
    },
    {
      src: '/chart.png',
      alt: 'chart',
      status: 'warning',
      issues: ['Alt text too generic'],
      suggestions: ['Describe what the chart shows, e.g., "Bar chart showing monthly revenue growth"'],
    },
    {
      src: '/decorative-icon.svg',
      alt: 'icon',
      status: 'warning',
      issues: ['May be decorative - consider alt=""'],
      suggestions: ['If purely decorative, use alt="" or aria-hidden="true"'],
    },
    {
      src: '/profile-photo.jpg',
      alt: 'Profile photo of John Smith, Software Engineer at Acme Corp',
      status: 'warning',
      issues: ['Alt text too long (58 characters)'],
      suggestions: ['Keep under 150 characters, focus on essential information'],
    },
    {
      src: '/screenshot.png',
      alt: 'screenshot',
      status: 'warning',
      issues: ['Not descriptive enough'],
      suggestions: ['Describe what the screenshot shows, e.g., "Chat interface showing message history"'],
    },
  ]

  const validateAltText = (text: string): { status: 'good' | 'warning' | 'error'; issues: string[] } => {
    const issues: string[] = []
    let status: 'good' | 'warning' | 'error' = 'good'

    if (!text) {
      issues.push('Alt text is empty')
      status = 'error'
      return { status, issues }
    }

    if (text.length > 150) {
      issues.push('Alt text is too long (over 150 characters)')
      status = 'warning'
    }

    const badWords = ['image', 'picture', 'photo', 'graphic', 'icon']
    if (badWords.some((word) => text.toLowerCase().includes(word))) {
      issues.push('Avoid redundant words like "image" or "picture"')
      status = 'warning'
    }

    if (text.length < 5) {
      issues.push('Alt text might be too short to be descriptive')
      status = 'warning'
    }

    if (text === text.toUpperCase()) {
      issues.push('Avoid all caps text')
      status = 'warning'
    }

    if (issues.length === 0) {
      issues.push('Alt text looks good!')
    }

    return { status, issues }
  }

  const validation = validateAltText(altText)

  const stats = {
    total: demoImages.length,
    good: demoImages.filter((img) => img.status === 'good').length,
    warning: demoImages.filter((img) => img.status === 'warning').length,
    error: demoImages.filter((img) => img.status === 'error').length,
  }

  return (
    <div className="space-y-6">
      {/* Interactive Validator */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Alt Text Validator</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter alt text to validate:
            </label>
            <textarea
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g., User profile photo showing Jane Doe"
              rows={3}
              className="w-full px-3 py-2 rounded-lg glass resize-none"
            />
          </div>

          {altText && (
            <div
              className={cn(
                'glass-panel p-4 border-l-4',
                validation.status === 'good' && 'border-green-500',
                validation.status === 'warning' && 'border-orange-500',
                validation.status === 'error' && 'border-red-500'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {validation.status === 'good' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {validation.status === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
                {validation.status === 'error' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {validation.status === 'good' && 'Good Alt Text'}
                  {validation.status === 'warning' && 'Needs Improvement'}
                  {validation.status === 'error' && 'Invalid Alt Text'}
                </span>
              </div>
              <ul className="space-y-1">
                {validation.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {issue}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-sm">
                <span className="font-medium">Length:</span> {altText.length} characters
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Images</p>
        </div>
        <div className="glass-panel p-4 border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-500">{stats.good}</p>
          <p className="text-sm text-muted-foreground">Good</p>
        </div>
        <div className="glass-panel p-4 border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-500">{stats.warning}</p>
          <p className="text-sm text-muted-foreground">Warnings</p>
        </div>
        <div className="glass-panel p-4 border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-500">{stats.error}</p>
          <p className="text-sm text-muted-foreground">Errors</p>
        </div>
      </div>

      {/* Image Audit List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Image Audit</h3>
        {demoImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              'glass-panel p-4 border-l-4',
              image.status === 'good' && 'border-green-500',
              image.status === 'warning' && 'border-orange-500',
              image.status === 'error' && 'border-red-500'
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'icon-container-sm',
                  image.status === 'good' && 'text-green-500',
                  image.status === 'warning' && 'text-orange-500',
                  image.status === 'error' && 'text-red-500'
                )}
              >
                {image.status === 'good' && <CheckCircle2 className="h-4 w-4" />}
                {image.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
                {image.status === 'error' && <XCircle className="h-4 w-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-sm font-mono badge-glass">{image.src}</code>
                </div>

                <div className="glass-panel p-3 bg-background/30 mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Alt text:</p>
                  <code className="text-sm font-mono">
                    {image.alt || '<empty>'}
                  </code>
                </div>

                {image.issues.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1">Issues:</p>
                    <ul className="space-y-1">
                      {image.issues.map((issue, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {image.suggestions.length > 0 && (
                  <div className="glass-panel p-2 bg-background/20">
                    <p className="text-xs font-medium mb-1">Suggestions:</p>
                    <ul className="space-y-1">
                      {image.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Alt Text Best Practices</h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">✓ Do</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Be specific and descriptive</li>
              <li>• Keep it under 150 characters</li>
              <li>• Describe function for functional images</li>
              <li>• Use alt="" for purely decorative images</li>
              <li>• Include text from images if relevant</li>
            </ul>
          </div>

          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">✗ Don't</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Start with "Image of" or "Picture of"</li>
              <li>• Use redundant phrases</li>
              <li>• Be overly detailed or verbose</li>
              <li>• Include file names or extensions</li>
              <li>• Use all caps text</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Good vs Bad Examples</h3>
        <div className="space-y-4">
          {[
            {
              context: 'Logo',
              bad: 'image',
              good: 'Clarity Chat Logo',
            },
            {
              context: 'Profile Photo',
              bad: 'photo',
              good: 'Profile photo of Sarah Johnson',
            },
            {
              context: 'Chart',
              bad: 'chart.png',
              good: 'Line chart showing user growth from Jan to Dec 2024',
            },
            {
              context: 'Decorative Icon',
              bad: 'star icon',
              good: 'Empty string (use alt="" or aria-hidden="true")',
            },
            {
              context: 'Button Icon',
              bad: 'send icon',
              good: 'Send message',
            },
          ].map((example, index) => (
            <div key={index} className="glass-panel p-4 bg-background/30">
              <p className="font-medium text-sm mb-3">{example.context}</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bad:</p>
                    <code className="text-sm font-mono">
                      {example.bad || '<empty>'}
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Good:</p>
                    <code className="text-sm font-mono">
                      {example.good || 'alt="" (decorative)'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
