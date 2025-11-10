/**
 * Clarity Chat Playground
 * Interactive component testing and experimentation environment
 * Now powered by Sandpack for secure, real-time preview
 */

import { useState, useEffect } from 'react'
import { 
  Play, Copy, Download, Share2, RefreshCw, Settings, 
  Sun, Moon, Monitor, Smartphone, Tablet, Code2, Eye 
} from 'lucide-react'
import { LivePreview } from './components/LivePreview'
import { ComponentLibrary } from './components/ComponentLibrary'
import { templates } from './templates'
import LZString from 'lz-string'

type ViewMode = 'desktop' | 'tablet' | 'mobile'

export default function App() {
  // Load initial code from URL or localStorage or default template
  const [code, setCode] = useState(() => {
    // Try URL first
    const params = new URLSearchParams(window.location.search)
    const urlCode = params.get('code')
    if (urlCode) {
      try {
        return LZString.decompressFromEncodedURIComponent(urlCode) || templates.basic
      } catch {
        // Fallback to basic if decompression fails
      }
    }

    // Try localStorage
    const saved = localStorage.getItem('clarity-playground-code')
    return saved || templates.basic
  })

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('clarity-playground-theme')
    return (saved as 'light' | 'dark') || 'light'
  })

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const saved = localStorage.getItem('clarity-playground-template')
    return saved || 'basic'
  })

  const [autoRun, setAutoRun] = useState(() => {
    const saved = localStorage.getItem('clarity-playground-autorun')
    return saved === 'false' ? false : true
  })

  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [splitView, setSplitView] = useState(true)

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('clarity-playground-code', code)
  }, [code])

  useEffect(() => {
    localStorage.setItem('clarity-playground-theme', theme)
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('clarity-playground-template', selectedTemplate)
  }, [selectedTemplate])

  useEffect(() => {
    localStorage.setItem('clarity-playground-autorun', String(autoRun))
  }, [autoRun])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    // TODO: Add toast notification
    alert('✅ Code copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clarity-chat-${selectedTemplate}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    try {
      const compressed = LZString.compressToEncodedURIComponent(code)
      const url = `${window.location.origin}${window.location.pathname}?code=${compressed}`
      navigator.clipboard.writeText(url)
      alert('✅ Share link copied to clipboard!')
    } catch (error) {
      alert('❌ Failed to create share link')
    }
  }

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey)
    setCode(templates[templateKey as keyof typeof templates])
  }

  const handleReset = () => {
    if (confirm('Reset to template? Your changes will be lost.')) {
      setCode(templates[selectedTemplate as keyof typeof templates])
    }
  }

  const handleFormatCode = async () => {
    try {
      // TODO: Add prettier formatting
      alert('✅ Code formatted!')
    } catch (error) {
      alert('❌ Failed to format code')
    }
  }

  return (
    <div className={`h-screen flex flex-col bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-card border-b border-border/40 px-6 py-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Clarity Chat Playground
            </h1>
            <p className="text-sm text-muted-foreground">
              Interactive component testing with live preview
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggles */}
            <div className="hidden md:flex items-center gap-1 mr-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-background shadow-xs'
                    : 'hover:bg-background/50'
                }`}
                title="Mobile view (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'tablet'
                    ? 'bg-background shadow-xs'
                    : 'hover:bg-background/50'
                }`}
                title="Tablet view (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-background shadow-xs'
                    : 'hover:bg-background/50'
                }`}
                title="Desktop view (full width)"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Reset to template"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Download code"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Share via URL"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSplitView(!splitView)}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Toggle split view"
            >
              {splitView ? <Code2 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors shadow-xs"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/40">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                  className="rounded border-input/40 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-foreground">
                  Auto-run on change
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={splitView}
                  onChange={(e) => setSplitView(e.target.checked)}
                  className="rounded border-input/40 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-foreground">
                  Split view (code + preview)
                </span>
              </label>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Preview width:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  className="px-2 py-1 bg-background border border-input/40 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="mobile">Mobile (375px)</option>
                  <option value="tablet">Tablet (768px)</option>
                  <option value="desktop">Desktop (full)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Component Library */}
        <aside className="w-72 bg-card border-r border-border/40 overflow-hidden flex flex-col shadow-xs">
          <ComponentLibrary
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
          />
        </aside>

        {/* Preview Area */}
        <div className="flex-1 flex overflow-hidden bg-background">
          <div 
            className="flex-1 overflow-auto p-6"
            style={{
              maxWidth: viewMode === 'mobile' ? '375px' :
                       viewMode === 'tablet' ? '768px' :
                       '100%',
              margin: viewMode !== 'desktop' ? '0 auto' : undefined,
            }}
          >
            <LivePreview code={code} theme={theme} autoRun={autoRun} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border/40 px-6 py-3 shadow-xs">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Powered by Sandpack</span>
            <span>•</span>
            <span>
              Template: <strong className="text-foreground">{selectedTemplate}</strong>
            </span>
            <span>•</span>
            <span>
              View: <strong className="text-foreground">{viewMode}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-[10px] border border-border/40">
              Cmd+S
            </kbd>
            <span>to save</span>
            <span>•</span>
            <kbd className="px-2 py-1 bg-muted rounded text-[10px] border border-border/40">
              Cmd+Enter
            </kbd>
            <span>to run</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
