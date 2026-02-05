'use client'

import { useState } from 'react'
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ScreenReaderAnnouncement {
  text: string
  role: string
  context: string
  timestamp: number
}

export function ScreenReaderPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(1.0)

  const announcements: ScreenReaderAnnouncement[] = [
    {
      text: 'Chat Interface, application',
      role: 'application',
      context: 'Page loaded',
      timestamp: 0,
    },
    {
      text: 'Main content, region',
      role: 'main',
      context: 'Entering main region',
      timestamp: 500,
    },
    {
      text: 'Chat messages, list, 5 items',
      role: 'list',
      context: 'Message container',
      timestamp: 1000,
    },
    {
      text: 'User message: Hello, how can you help me?',
      role: 'listitem',
      context: 'First message',
      timestamp: 1500,
    },
    {
      text: 'Assistant message: I can help you with many tasks. What do you need?',
      role: 'listitem',
      context: 'Second message',
      timestamp: 2000,
    },
    {
      text: 'Message input, textbox, multiline',
      role: 'textbox',
      context: 'Chat input field',
      timestamp: 2500,
    },
    {
      text: 'Send message, button',
      role: 'button',
      context: 'Submit button',
      timestamp: 3000,
    },
  ]

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      playAnnouncements()
    }
  }

  const playAnnouncements = async () => {
    for (let i = currentIndex; i < announcements.length; i++) {
      if (!isPlaying) break
      setCurrentIndex(i)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / speed)
      )
    }
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePlayPause}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2',
              isPlaying ? 'glass' : 'gradient-accent text-white'
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play Preview
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg glass text-sm font-medium flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono badge-glass">{speed}x</span>
        </div>
      </div>

      {/* Preview Display */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container-sm text-blue-500">
            <Volume2 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">Screen Reader Output</h3>
          <span className="badge-glass text-xs">
            {currentIndex + 1} / {announcements.length}
          </span>
        </div>

        {currentIndex < announcements.length && (
          <div className="space-y-4">
            <div className="glass-panel p-4 border-l-4 border-blue-500 bg-background/30">
              <p className="text-lg font-medium mb-2">
                {announcements[currentIndex].text}
              </p>
              <div className="flex items-center gap-2">
                <span className="badge-glass text-xs">
                  {announcements[currentIndex].role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {announcements[currentIndex].context}
                </span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>How it's announced:</strong> "{announcements[currentIndex].text}"
            </div>
          </div>
        )}
      </div>

      {/* Announcement Timeline */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Announcement Timeline</h3>
        <div className="space-y-2">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={cn(
                'glass-panel p-3 border-l-4 transition-all',
                index === currentIndex
                  ? 'border-blue-500 bg-blue-500/5'
                  : index < currentIndex
                    ? 'border-green-500 bg-green-500/5 opacity-60'
                    : 'border-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-muted-foreground min-w-[40px]">
                  {(announcement.timestamp / 1000).toFixed(1)}s
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{announcement.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge-glass text-xs">{announcement.role}</span>
                    <span className="text-xs text-muted-foreground">
                      {announcement.context}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen Reader Tips */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Screen Reader Best Practices</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Provide Clear Labels',
              description: 'Use aria-label or aria-labelledby for all interactive elements',
            },
            {
              title: 'Announce Dynamic Content',
              description: 'Use aria-live regions for content that updates',
            },
            {
              title: 'Maintain Logical Order',
              description: 'Ensure DOM order matches visual order',
            },
            {
              title: 'Hide Decorative Content',
              description: 'Use aria-hidden="true" for decorative elements',
            },
            {
              title: 'Provide Context',
              description: 'Use landmark roles and headings for structure',
            },
          ].map((tip, index) => (
            <div key={index} className="glass-panel p-3 bg-background/30">
              <p className="font-medium text-sm mb-1">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Screen Readers */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Test with Multiple Screen Readers</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'NVDA', platform: 'Windows', free: true },
            { name: 'JAWS', platform: 'Windows', free: false },
            { name: 'VoiceOver', platform: 'macOS/iOS', free: true },
            { name: 'TalkBack', platform: 'Android', free: true },
            { name: 'Narrator', platform: 'Windows', free: true },
            { name: 'Orca', platform: 'Linux', free: true },
          ].map((reader, index) => (
            <div key={index} className="glass-panel p-3 bg-background/30">
              <p className="font-medium text-sm">{reader.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{reader.platform}</p>
              <span
                className={cn(
                  'badge-glass text-xs mt-2 inline-block',
                  reader.free ? 'text-green-500' : 'text-orange-500'
                )}
              >
                {reader.free ? 'Free' : 'Paid'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
