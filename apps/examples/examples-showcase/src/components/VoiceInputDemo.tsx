/**
 * VoiceInput Component Demo
 *
 * Features:
 * - Voice recording with browser MediaRecorder API
 * - Real-time transcription display
 * - Audio visualization with canvas
 * - Voice command recognition
 * - Glassmorphism styled controls
 * - Proper permission handling
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceCommand {
  command: string
  action: string
  timestamp: Date
}

interface TranscriptionSegment {
  text: string
  confidence: number
  timestamp: Date
}

type PermissionState = 'prompt' | 'granted' | 'denied' | 'checking'
type RecordingState = 'idle' | 'recording' | 'paused' | 'processing'

export default function VoiceInputDemo() {
  // Audio Recording State
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt')
  const [error, setError] = useState<string | null>(null)

  // Transcription State
  const [transcript, setTranscript] = useState<string>('')
  const [segments, setSegments] = useState<TranscriptionSegment[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)

  // Audio Visualization State
  const [audioLevel, setAudioLevel] = useState(0)
  const [frequencyData, setFrequencyData] = useState<number[]>(Array(32).fill(0))

  // Voice Commands State
  const [recognizedCommands, setRecognizedCommands] = useState<VoiceCommand[]>([])
  const [listeningForCommands, setListeningForCommands] = useState(true)

  // Settings State
  const [showSettings, setShowSettings] = useState(false)
  const [sensitivity, setSensitivity] = useState(50)
  const [autoStop, setAutoStop] = useState(false)
  const [noiseReduction, setNoiseReduction] = useState(true)

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null) // SpeechRecognition API

  // Check browser support
  const browserSupport = {
    mediaRecorder: typeof MediaRecorder !== 'undefined',
    audioContext: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined',
    speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
  }

  // Initialize Speech Recognition
  useEffect(() => {
    if (browserSupport.speechRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence

          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' '

            // Add to segments
            setSegments(prev => [...prev, {
              text: transcriptPart,
              confidence: confidence || 0.9,
              timestamp: new Date()
            }])

            // Check for voice commands
            if (listeningForCommands) {
              detectVoiceCommand(transcriptPart)
            }
          } else {
            interimTranscript += transcriptPart
          }
        }

        setTranscript(prev => prev + finalTranscript + interimTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error !== 'no-speech') {
          setError(`Speech recognition error: ${event.error}`)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [listeningForCommands])

  // Voice command detection
  const detectVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase()
    const commands = [
      { pattern: /start recording|begin recording/, action: 'Start Recording' },
      { pattern: /stop recording|end recording/, action: 'Stop Recording' },
      { pattern: /pause|hold/, action: 'Pause' },
      { pattern: /resume|continue/, action: 'Resume' },
      { pattern: /clear|reset/, action: 'Clear' },
      { pattern: /save|export/, action: 'Save' },
      { pattern: /send message|submit/, action: 'Send Message' },
    ]

    for (const cmd of commands) {
      if (cmd.pattern.test(lowerText)) {
        setRecognizedCommands(prev => [...prev, {
          command: text,
          action: cmd.action,
          timestamp: new Date()
        }])

        // Execute command
        executeCommand(cmd.action)
        break
      }
    }
  }

  // Execute recognized command
  const executeCommand = (action: string) => {
    switch (action) {
      case 'Start Recording':
        if (recordingState === 'idle') startRecording()
        break
      case 'Stop Recording':
        if (recordingState === 'recording') stopRecording()
        break
      case 'Pause':
        if (recordingState === 'recording') pauseRecording()
        break
      case 'Resume':
        if (recordingState === 'paused') resumeRecording()
        break
      case 'Clear':
        clearTranscript()
        break
    }
  }

  // Request microphone permission
  const requestPermission = async () => {
    setPermissionState('checking')
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
        }
      })

      streamRef.current = stream
      setPermissionState('granted')

      // Setup audio context for visualization
      setupAudioContext(stream)

      return stream
    } catch (err: any) {
      console.error('Permission denied:', err)
      setPermissionState('denied')
      setError(err.message || 'Microphone access denied')
      return null
    }
  }

  // Setup audio context and analyser
  const setupAudioContext = (stream: MediaStream) => {
    const AudioContextClass = AudioContext || (window as any).webkitAudioContext
    const audioContext = new AudioContextClass()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)

    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.8

    microphone.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    // Start visualization
    visualize()
  }

  // Audio visualization
  const visualize = useCallback(() => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const animate = () => {
      analyser.getByteFrequencyData(dataArray)

      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      setAudioLevel(average / 255 * 100)

      // Get frequency data for visualization
      const normalizedData = Array.from(dataArray.slice(0, 32)).map(v => v / 255)
      setFrequencyData(normalizedData)

      // Draw on canvas
      drawVisualization(dataArray)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [])

  // Draw visualization on canvas
  const drawVisualization = (dataArray: Uint8Array) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / dataArray.length

    ctx.clearRect(0, 0, width, height)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)')
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)')
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)')

    dataArray.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.8
      const x = index * barWidth
      const y = height - barHeight

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth - 2, barHeight)
    })
  }

  // Start recording
  const startRecording = async () => {
    setError(null)

    let stream = streamRef.current
    if (!stream || permissionState !== 'granted') {
      stream = await requestPermission()
      if (!stream) return
    }

    try {
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        setRecordingState('processing')
        processRecording()
      }

      mediaRecorder.start(100) // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder
      setRecordingState('recording')

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }

    } catch (err: any) {
      console.error('Recording error:', err)
      setError(err.message || 'Failed to start recording')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState('paused')

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState('recording')

      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  // Process recording
  const processRecording = () => {
    setIsTranscribing(true)

    // Simulate processing time
    setTimeout(() => {
      setIsTranscribing(false)
      setRecordingState('idle')

      // In a real app, you would send the audio to a transcription service here
      // For demo purposes, we're using the Web Speech API which transcribes in real-time
    }, 1000)
  }

  // Clear transcript
  const clearTranscript = () => {
    setTranscript('')
    setSegments([])
    setRecognizedCommands([])
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="voice-input-demo">
      <div className="demo-header">
        <h2>🎤 Voice Input Component</h2>
        <p>Interactive demonstration of voice recording with real-time transcription</p>
      </div>

      {/* Browser Support Check */}
      {(!browserSupport.mediaRecorder || !browserSupport.audioContext) && (
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <span>Your browser may not support all features. Please use a modern browser.</span>
        </div>
      )}

      {/* Main Control Panel */}
      <div className="glass-panel main-controls">
        {/* Audio Visualization Canvas */}
        <div className="visualization-container">
          <canvas
            ref={canvasRef}
            width={600}
            height={150}
            className="audio-canvas"
          />

          {/* Audio Level Indicator */}
          <div className="audio-level-bar">
            <motion.div
              className="audio-level-fill"
              style={{ width: `${audioLevel}%` }}
              animate={{
                backgroundColor: audioLevel > 80 ? '#ef4444' : audioLevel > 50 ? '#f59e0b' : '#10b981'
              }}
            />
          </div>

          <div className="audio-level-text">
            Audio Level: {Math.round(audioLevel)}%
          </div>
        </div>

        {/* Recording Controls */}
        <div className="recording-controls">
          {permissionState === 'prompt' && (
            <motion.button
              className="glass-button primary large"
              onClick={requestPermission}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic size={24} />
              <span>Enable Microphone</span>
            </motion.button>
          )}

          {permissionState === 'checking' && (
            <div className="loading-state">
              <RefreshCw className="spinner" size={24} />
              <span>Requesting permission...</span>
            </div>
          )}

          {permissionState === 'denied' && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>Microphone access denied. Please grant permission in your browser settings.</span>
            </div>
          )}

          {permissionState === 'granted' && (
            <div className="control-buttons">
              {recordingState === 'idle' && (
                <motion.button
                  className="glass-button primary large"
                  onClick={startRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic size={24} />
                  <span>Start Recording</span>
                </motion.button>
              )}

              {recordingState === 'recording' && (
                <>
                  <motion.button
                    className="glass-button warning"
                    onClick={pauseRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pause size={20} />
                    <span>Pause</span>
                  </motion.button>

                  <motion.button
                    className="glass-button danger"
                    onClick={stopRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Square size={20} />
                    <span>Stop</span>
                  </motion.button>

                  <div className="recording-indicator">
                    <motion.div
                      className="recording-dot"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span>Recording...</span>
                  </div>
                </>
              )}

              {recordingState === 'paused' && (
                <>
                  <motion.button
                    className="glass-button success"
                    onClick={resumeRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    <span>Resume</span>
                  </motion.button>

                  <motion.button
                    className="glass-button danger"
                    onClick={stopRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Square size={20} />
                    <span>Stop</span>
                  </motion.button>

                  <div className="paused-indicator">
                    <span>⏸️ Paused</span>
                  </div>
                </>
              )}

              {recordingState === 'processing' && (
                <div className="processing-state">
                  <RefreshCw className="spinner" size={24} />
                  <span>Processing...</span>
                </div>
              )}

              <motion.button
                className="glass-button secondary"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={20} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="glass-panel settings-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Settings</h3>

            <div className="setting-item">
              <label>
                <span>Microphone Sensitivity: {sensitivity}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={noiseReduction}
                  onChange={(e) => setNoiseReduction(e.target.checked)}
                />
                <span>Noise Reduction</span>
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={autoStop}
                  onChange={(e) => setAutoStop(e.target.checked)}
                />
                <span>Auto-stop on silence</span>
              </label>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={listeningForCommands}
                  onChange={(e) => setListeningForCommands(e.target.checked)}
                />
                <span>Enable voice commands</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription Display */}
      <div className="glass-panel transcription-panel">
        <div className="panel-header">
          <h3>Real-time Transcription</h3>
          {transcript && (
            <button
              className="glass-button small"
              onClick={clearTranscript}
            >
              <RefreshCw size={16} />
              Clear
            </button>
          )}
        </div>

        <div className="transcription-content">
          {isTranscribing && (
            <div className="transcribing-indicator">
              <RefreshCw className="spinner" size={16} />
              <span>Transcribing...</span>
            </div>
          )}

          {transcript ? (
            <div className="transcript-text">{transcript}</div>
          ) : (
            <div className="empty-state">
              <Mic size={48} className="empty-icon" />
              <p>Start recording to see transcription appear here</p>
            </div>
          )}
        </div>

        {/* Confidence Segments */}
        {segments.length > 0 && (
          <div className="segments-list">
            <h4>Transcription Segments</h4>
            <div className="segments">
              {segments.slice(-5).map((segment, i) => (
                <motion.div
                  key={i}
                  className="segment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="segment-text">{segment.text}</div>
                  <div className="segment-meta">
                    <span className="confidence">
                      {Math.round(segment.confidence * 100)}% confidence
                    </span>
                    <span className="timestamp">
                      {segment.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice Commands */}
      {listeningForCommands && recognizedCommands.length > 0 && (
        <div className="glass-panel commands-panel">
          <h3>Recognized Voice Commands</h3>
          <div className="commands-list">
            {recognizedCommands.slice(-5).map((cmd, i) => (
              <motion.div
                key={i}
                className="command-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CheckCircle size={16} className="command-icon" />
                <div className="command-content">
                  <div className="command-text">"{cmd.command}"</div>
                  <div className="command-action">→ {cmd.action}</div>
                </div>
                <div className="command-time">
                  {cmd.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Frequency Bars */}
      <div className="glass-panel frequency-panel">
        <h3>Frequency Analysis</h3>
        <div className="frequency-bars">
          {frequencyData.map((value, i) => (
            <motion.div
              key={i}
              className="frequency-bar"
              style={{
                height: `${value * 100}%`,
                backgroundColor: `hsl(${240 + value * 60}, 80%, 60%)`
              }}
              animate={{ height: `${value * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Available Commands */}
      {listeningForCommands && (
        <div className="glass-panel info-panel">
          <h3>Available Voice Commands</h3>
          <div className="commands-grid">
            <div className="command-help">
              <strong>"Start recording"</strong> - Begin recording
            </div>
            <div className="command-help">
              <strong>"Stop recording"</strong> - End recording
            </div>
            <div className="command-help">
              <strong>"Pause"</strong> - Pause recording
            </div>
            <div className="command-help">
              <strong>"Resume"</strong> - Continue recording
            </div>
            <div className="command-help">
              <strong>"Clear"</strong> - Clear transcript
            </div>
            <div className="command-help">
              <strong>"Save"</strong> - Save recording
            </div>
          </div>
        </div>
      )}

      {/* Feature Info */}
      <div className="glass-panel info-panel">
        <h3>Features Demonstrated</h3>
        <div className="features-list">
          <div className="feature-item">
            <Mic className="feature-icon" />
            <div>
              <strong>Voice Recording</strong>
              <p>Record audio using browser's MediaRecorder API</p>
            </div>
          </div>
          <div className="feature-item">
            <Volume2 className="feature-icon" />
            <div>
              <strong>Audio Visualization</strong>
              <p>Real-time frequency analysis and waveform display</p>
            </div>
          </div>
          <div className="feature-item">
            <CheckCircle className="feature-icon" />
            <div>
              <strong>Speech Recognition</strong>
              <p>Real-time transcription using Web Speech API</p>
            </div>
          </div>
          <div className="feature-item">
            <Settings className="feature-icon" />
            <div>
              <strong>Voice Commands</strong>
              <p>Control the interface with voice commands</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
