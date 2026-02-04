/**
 * voice Input Template
 */

import type { PlaygroundTemplate } from '../../types'

export const voiceInput: PlaygroundTemplate = {
  id: 'voice-input',
  name: 'Voice Input',
  description: 'Voice-to-text input simulation with waveform',
  category: 'patterns',
  tags: ['voice', 'audio', 'input', 'speech'],
  code: `import React, { useState, useEffect } from 'react'

function Component() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [waveHeights, setWaveHeights] = useState(Array(20).fill(10))

  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.random() * 30 + 5))
    }, 100)

    // Simulate speech recognition
    const words = ['Hello,', 'this', 'is', 'a', 'voice', 'message', 'simulation.']
    let wordIndex = 0

    const transcriptInterval = setInterval(() => {
      if (wordIndex < words.length) {
        setTranscript(prev => prev + (prev ? ' ' : '') + words[wordIndex])
        wordIndex++
      }
    }, 400)

    return () => {
      clearInterval(interval)
      clearInterval(transcriptInterval)
    }
  }, [isRecording])

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setTranscript('')
      setIsRecording(true)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Voice Input</h2>

      <div style={{
        marginTop: '20px',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        {/* Waveform */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          height: '60px',
          marginBottom: '20px'
        }}>
          {waveHeights.map((height, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: isRecording ? \`\${height}px\` : '10px',
                background: isRecording
                  ? \`linear-gradient(180deg, #6366f1, #8b5cf6)\`
                  : '#d1d5db',
                borderRadius: '2px',
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>

        {/* Record Button */}
        <button
          onClick={toggleRecording}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            background: isRecording
              ? 'linear-gradient(135deg, #ef4444, #f87171)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '32px',
            boxShadow: isRecording
              ? '0 0 0 8px rgba(239, 68, 68, 0.2)'
              : '0 4px 20px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isRecording ? '⬛' : '🎤'}
        </button>

        <p style={{
          marginTop: '16px',
          color: isRecording ? '#ef4444' : '#6b7280',
          fontWeight: '500'
        }}>
          {isRecording ? 'Recording...' : 'Tap to speak'}
        </p>
      </div>

      {/* Transcript */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        minHeight: '100px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          TRANSCRIPT
        </div>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: transcript ? '#1f2937' : '#9ca3af',
          lineHeight: 1.6
        }}>
          {transcript || 'Your speech will appear here...'}
          {isRecording && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
        </p>
      </div>

      <style>
        {\`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
}
