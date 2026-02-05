'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import { VoiceInput } from '@clarity-chat/react'
import {
  Mic,
  FileText,
  Volume2,
  Play,
  Pause,
  Square,
  X,
  Trash2,
  Globe,
  Sparkles,
  CheckCircle,
  Activity,
} from 'lucide-react'

// ============================================================================
// VOICE INPUT DEMO
// ============================================================================
export function VoiceInputDemo() {
  const [messages, setMessages] = useState<string[]>([])
  const [currentLanguage, setCurrentLanguage] = useState('en-US')
  const [recordingMode, setRecordingMode] = useState<'text' | 'voice'>('text')
  const [audioData, setAudioData] = useState<{
    url: string | null
    duration: number
    isPlaying: boolean
  }>({
    url: null,
    duration: 0,
    isPlaying: false,
  })

  // Audio level simulation
  const [audioLevel, setAudioLevel] = useState(0)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)

  // Recording state for audio mode
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  // Simulate audio levels while recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    } else {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
      setAudioLevel(0)
    }

    return () => {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
    }
  }, [isRecording, isPaused])

  // Track recording time
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }, [isRecording, isPaused])

  const handleVoiceTranscript = (transcript: string) => {
    if (recordingMode === 'text') {
      // Convert to text and send
      setMessages((prev) => [...prev, transcript])
    } else {
      // Save as voice message
      setMessages((prev) => [...prev, `[Voice: "${transcript}"]`])
      // Simulate audio recording
      setAudioData({
        url: 'data:audio/wav;base64,fake',
        duration: recordingTime,
        isPlaying: false,
      })
    }
    setIsRecording(false)
    setRecordingTime(0)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setRecordingTime(0)
  }

  const handleCancelRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setAudioData({ url: null, duration: 0, isPlaying: false })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Voice Input Area */}
      <Card className="lg:col-span-2 glass-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voice Input Controls
              </CardTitle>
              <CardDescription>
                Real-time voice recording with transcription
              </CardDescription>
            </div>
            <Badge
              variant={isRecording ? 'destructive' : 'secondary'}
              className={cn(isRecording && 'animate-pulse')}
            >
              {isRecording ? 'Recording' : 'Ready'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mode:</span>
              <Button
                variant={recordingMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRecordingMode('text')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Text
              </Button>
              <Button
                variant={recordingMode === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRecordingMode('voice')}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Voice Message
              </Button>
            </div>
          </div>

          {/* Waveform Visualization */}
          {isRecording && (
            <div className="p-6 bg-gradient-to-br from-primary/5 to-violet-500/5 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-center gap-1.5 h-32">
                {[...Array(32)].map((_, i) => {
                  const baseHeight = 8
                  const maxHeight = 100
                  const randomFactor = !isPaused
                    ? Math.sin(Date.now() / 200 + i * 0.5) * 0.5 + 0.5
                    : 0.2
                  const height =
                    baseHeight +
                    (maxHeight - baseHeight) * randomFactor * (audioLevel / 100)

                  return (
                    <div
                      key={i}
                      className={cn(
                        'w-1.5 rounded-full transition-all duration-100',
                        !isPaused
                          ? 'bg-gradient-to-t from-primary to-violet-500'
                          : 'bg-muted'
                      )}
                      style={{
                        height: `${height}px`,
                      }}
                    />
                  )
                })}
              </div>

              {/* Recording Info */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                    )}
                  />
                  <span className="text-sm font-medium">
                    {isPaused ? 'Paused' : 'Recording'}
                  </span>
                </div>
                <span className="text-lg font-mono font-bold">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
          )}

          {/* Audio Level Indicators */}
          {isRecording && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Audio Level</span>
                <span className="font-medium">{Math.round(audioLevel)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100 rounded-full"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          )}

          {/* Voice Input Component */}
          <div className="flex items-center justify-center p-8 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              lang={currentLanguage}
              showInterim={true}
              autoSubmit={recordingMode === 'text'}
              size="lg"
              variant="primary"
              icon={Mic}
              listeningIcon={Activity}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              onError={(error: string) => console.error('Voice error:', error)}
            />
          </div>

          {/* Recording Controls */}
          {isRecording && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePauseRecording}
                className="gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-5 w-5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleStopRecording}
                className="gap-2"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancelRecording}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            </div>
          )}

          {/* Audio Playback */}
          {audioData.url && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setAudioData((prev) => ({
                      ...prev,
                      isPlaying: !prev.isPlaying,
                    }))
                  }
                >
                  {audioData.isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3 rounded-full" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTime(audioData.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Messages Display */}
          {messages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transcribed Messages</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessages([])}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-[200px] rounded-lg border p-4">
                <div className="space-y-2">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className="p-3 bg-muted/50 rounded-lg text-sm flex items-start gap-2"
                    >
                      {msg.startsWith('[Voice:') ? (
                        <Volume2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1">{msg}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language & Settings Sidebar */}
      <div className="space-y-4">
        {/* Language Selection */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Language Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
                  currentLanguage === lang.code
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50'
                )}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.code}</p>
                </div>
                {currentLanguage === lang.code && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              'Real-time transcription',
              'Waveform visualization',
              'Audio level monitoring',
              'Recording controls',
              'Multi-language support',
              'Voice or text mode',
              'Audio playback',
              'Pause/resume recording',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Messages</span>
              <Badge variant="secondary">{messages.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mode</span>
              <Badge>{recordingMode}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Language</span>
              <Badge>
                {languages.find((l) => l.code === currentLanguage)?.flag}
              </Badge>
            </div>
            {isRecording && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <Badge variant="destructive">{formatTime(recordingTime)}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
