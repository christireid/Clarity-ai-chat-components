import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Progressive Web App Recipe - Clarity Chat Components',
  description:
    'Build a Progressive Web App (PWA) with offline support, service workers, and app-like experience.',
}

export default function ProgressiveWebAppRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Progressive Web App</h1>
        <p className="docs-lead">
          Build a Progressive Web App (PWA) with offline support, service
          workers, push notifications, and app-like experience.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up service worker',
          'Enable offline functionality',
          'Add push notifications',
          'Create app manifest',
          'Handle app installation',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to build a Progressive Web App (PWA) with
          offline support, push notifications, and app-like experience.
        </p>
      </section>

      <section className="docs-section">
        <h2>Service Worker Setup</h2>
        <p>Register service worker for offline support:</p>
        <CodePlayground
          initialCode={`// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('clarity-chat-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/chat',
        '/offline.html',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Register in app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Offline Chat with IndexedDB</h2>
        <p>Use OfflineChatSync for offline functionality:</p>
        <CodePlayground
          initialCode={`import { OfflineChatSync, useOfflineChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function PWAChat({ messages }: { messages: Message[] }) {
  const { isOnline, syncStatus } = useOfflineChat()

  return (
    <div>
      <OfflineChatSync
        messages={messages}
        config={{
          maxMessages: 2000,
          syncInterval: 10000,
        }}
        onStatusChange={(status) => {
          if (status === 'offline') {
            // Show offline indicator
            showOfflineBanner()
          }
        }}
      />
      {!isOnline && (
        <div className="offline-banner">
          Offline - Changes will sync when online
        </div>
      )}
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>App Manifest</h2>
        <p>Create app manifest for PWA:</p>
        <CodePlayground
          initialCode={`// public/manifest.json
{
  "name": "Clarity Chat",
  "short_name": "Clarity",
  "description": "AI Chat Application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

// Add to HTML
<link rel="manifest" href="/manifest.json" />`}
        />
      </section>

      <section className="docs-section">
        <h2>Push Notifications</h2>
        <p>Enable push notifications:</p>
        <CodePlayground
          initialCode={`async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // Register for push notifications
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY',
      })
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
      })
    }
  }
}

// In component
React.useEffect(() => {
  requestNotificationPermission()
}, [])`}
        />
      </section>

      <section className="docs-section">
        <h2>Install Prompt</h2>
        <p>Handle app installation:</p>
        <CodePlayground
          initialCode={`function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [showPrompt, setShowPrompt] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    })
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        logger.debug('App installed')
      }
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="install-banner">
      <div>Install Clarity Chat for a better experience</div>
      <button onClick={handleInstall}>Install</button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete PWA Setup</h2>
        <p>Complete PWA implementation:</p>
        <CodePlayground
          initialCode={`import { OfflineChatSync, useOfflineChat } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function PWAApp() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { syncStatus } = useOfflineChat()

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }

    // Handle online/offline
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div>
      <OfflineChatSync messages={messages} />
      {!isOnline && (
        <div className="offline-indicator">
          Offline - Working offline
        </div>
      )}
      <ChatWindow messages={messages} />
      <InstallPrompt />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Cache essential assets in service worker</li>
          <li>Use IndexedDB for offline data storage</li>
          <li>Show offline indicators to users</li>
          <li>Request notification permission appropriately</li>
          <li>Provide install prompt for better UX</li>
          <li>Test offline functionality thoroughly</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/offline-chat-sync">
              OfflineChatSync
            </a>{' '}
            - Offline sync component
          </li>
          <li>
            <a href="/reference/hooks/use-offline-chat">useOfflineChat</a> -
            Offline chat hook
          </li>
          <li>
            <a href="/cookbook/offline-first-chat">Offline-First Chat Recipe</a>{' '}
            - Offline implementation
          </li>
        </ul>
      </section>
    </div>
  )
}
