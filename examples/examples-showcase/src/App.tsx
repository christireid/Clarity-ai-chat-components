/**
 * Clarity Chat Components Showcase
 * 
 * Interactive demonstration of all components, themes, and features
 */

import React, { useState } from 'react'
import {
  ThemeProvider,
  ChatWindow,
  ModelSelector,
  ContextManager,
  UsageDashboard,
  ThemeSelector,
  VoiceInput,
  TokenCounter,
  PerformanceDashboard,
  CustomerSupportTemplate,
  AIAssistantTemplate,
  CodeHelperTemplate,
  defaultLightTheme,
  defaultDarkTheme,
  oceanTheme,
  sunsetTheme,
  forestTheme,
  corporateTheme,
  minimalLightTheme,
  minimalDarkTheme,
  vibrantLightTheme,
  vibrantDarkTheme,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const themes = {
  'Default Light': defaultLightTheme,
  'Default Dark': defaultDarkTheme,
  'Ocean': oceanTheme,
  'Sunset': sunsetTheme,
  'Forest': forestTheme,
  'Corporate': corporateTheme,
  'Minimal Light': minimalLightTheme,
  'Minimal Dark': minimalDarkTheme,
  'Vibrant Light': vibrantLightTheme,
  'Vibrant Dark': vibrantDarkTheme,
}

type View = 'components' | 'templates' | 'themes' | 'playground'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('playground')
  const [selectedTheme, setSelectedTheme] = useState(defaultLightTheme)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Welcome to Clarity Chat Showcase! 🎉

This is an interactive demonstration of all the features and components available in Clarity Chat.

## Features You Can Try:
- 🎨 **Theme Switching** - Try all 10 built-in themes
- 💬 **Rich Messages** - Markdown, code highlighting, and more
- 🎤 **Voice Input** - Click the microphone to speak
- 📁 **File Upload** - Drag & drop or click to upload
- 📊 **Usage Tracking** - See token counts and costs
- ⚡ **Performance** - Monitor real-time performance

## Code Example:
\`\`\`typescript
import { ChatWindow } from '@clarity-chat/react'

function App() {
  return <ChatWindow messages={messages} />
}
\`\`\`

Try sending a message below!`,
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}". This is a demo response showcasing the chat interface. Try exploring different themes and features!`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const renderView = () => {
    switch (currentView) {
      case 'playground':
        return (
          <div className="playground">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              enableFileUpload
              enableVoiceInput
            />
          </div>
        )
      
      case 'templates':
        return (
          <div className="templates-view">
            <h2>Pre-built Templates</h2>
            <div className="template-grid">
              <div className="template-card">
                <h3>Customer Support</h3>
                <p>Professional support chat with FAQ and escalation</p>
                <CustomerSupportTemplate companyName="Demo Corp" />
              </div>
              <div className="template-card">
                <h3>AI Assistant</h3>
                <p>General-purpose AI assistant with multiple models</p>
              </div>
              <div className="template-card">
                <h3>Code Helper</h3>
                <p>Programming assistant with syntax highlighting</p>
              </div>
            </div>
          </div>
        )
      
      case 'themes':
        return (
          <div className="themes-view">
            <h2>Theme Gallery</h2>
            <div className="theme-grid">
              {Object.entries(themes).map(([name, theme]) => (
                <div
                  key={name}
                  className="theme-preview-card"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <h3>{name}</h3>
                  <div className="mini-chat-preview">
                    <ThemeProvider theme={theme}>
                      <div className="mini-messages">
                        <div className="mini-message user">Hello!</div>
                        <div className="mini-message assistant">Hi there!</div>
                      </div>
                    </ThemeProvider>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'components':
        return (
          <div className="components-view">
            <h2>Component Library</h2>
            <div className="component-sections">
              <section>
                <h3>Chat Components</h3>
                <ul>
                  <li>ChatWindow - Full chat interface</li>
                  <li>MessageList - Message container</li>
                  <li>Message - Individual messages</li>
                  <li>ChatInput - Message input field</li>
                  <li>StreamingMessage - Real-time streaming</li>
                </ul>
              </section>
              <section>
                <h3>AI Features</h3>
                <ul>
                  <li>ModelSelector - Choose AI models</li>
                  <li>TokenCounter - Track token usage</li>
                  <li>ThinkingIndicator - AI processing states</li>
                  <li>ToolInvocationCard - Function calling UI</li>
                </ul>
              </section>
              <section>
                <h3>Utility Components</h3>
                <ul>
                  <li>VoiceInput - Speech to text</li>
                  <li>FileUpload - File handling</li>
                  <li>ContextManager - Document context</li>
                  <li>ExportDialog - Export conversations</li>
                </ul>
              </section>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <ThemeProvider theme={selectedTheme}>
      <div className="showcase-app">
        <header className="showcase-header">
          <h1>Clarity Chat Components</h1>
          <p>Production-ready AI chat components for React</p>
        </header>

        <nav className="showcase-nav">
          <button
            className={currentView === 'playground' ? 'active' : ''}
            onClick={() => setCurrentView('playground')}
          >
            Playground
          </button>
          <button
            className={currentView === 'components' ? 'active' : ''}
            onClick={() => setCurrentView('components')}
          >
            Components
          </button>
          <button
            className={currentView === 'templates' ? 'active' : ''}
            onClick={() => setCurrentView('templates')}
          >
            Templates
          </button>
          <button
            className={currentView === 'themes' ? 'active' : ''}
            onClick={() => setCurrentView('themes')}
          >
            Themes
          </button>
        </nav>

        <div className="showcase-controls">
          <label>
            Current Theme:
            <select
              value={Object.entries(themes).find(([_, t]) => t === selectedTheme)?.[0]}
              onChange={(e) => setSelectedTheme(themes[e.target.value as keyof typeof themes])}
            >
              {Object.keys(themes).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>

        <main className="showcase-main">
          {renderView()}
        </main>

        <footer className="showcase-footer">
          <p>
            © 2024 Clarity Chat •{' '}
            <a href="https://github.com/christireid/Clarity-ai-chat-components">GitHub</a> •{' '}
            <a href="/docs">Documentation</a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  )
}