/**
 * Design System Showcase
 * 
 * Comprehensive demonstration of all enhanced components and design patterns
 */

import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'
import { ToastProvider } from '@clarity-chat/react'

// Showcase sections
import { DesignTokens } from './sections/DesignTokens'
import { ButtonShowcase } from './sections/ButtonShowcase'
import { FormShowcase } from './sections/FormShowcase'
import { CardShowcase } from './sections/CardShowcase'
import { OverlayShowcase } from './sections/OverlayShowcase'
import { ChatShowcase } from './sections/ChatShowcase'
import { AnimationShowcase } from './sections/AnimationShowcase'

export default function App() {
  const [activeSection, setActiveSection] = useState('tokens')

  const sections = [
    { id: 'tokens', label: 'Design Tokens', icon: '🎨' },
    { id: 'buttons', label: 'Buttons', icon: '🔘' },
    { id: 'forms', label: 'Forms', icon: '📝' },
    { id: 'cards', label: 'Cards', icon: '🎴' },
    { id: 'overlays', label: 'Overlays', icon: '🪟' },
    { id: 'chat', label: 'Chat Components', icon: '💬' },
    { id: 'animations', label: 'Animations', icon: '✨' },
  ]

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Clarity Chat Components</h1>
                <p className="text-sm text-muted-foreground">
                  Design System Showcase v2.0
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Documentation
                </Button>
                <Button size="sm">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="col-span-12 lg:col-span-3">
              <nav className="sticky top-24 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-xs'
                        : 'hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-9">
              <div className="space-y-8">
                {activeSection === 'tokens' && <DesignTokens />}
                {activeSection === 'buttons' && <ButtonShowcase />}
                {activeSection === 'forms' && <FormShowcase />}
                {activeSection === 'cards' && <CardShowcase />}
                {activeSection === 'overlays' && <OverlayShowcase />}
                {activeSection === 'chat' && <ChatShowcase />}
                {activeSection === 'animations' && <AnimationShowcase />}
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Clarity Chat Components v2.0</p>
                <p>Enhanced UI/UX • 50+ Components • Production Ready</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  )
}
