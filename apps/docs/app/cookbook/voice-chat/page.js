import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Cookbook: Voice-Enabled Chat',
    description: 'Add speech-to-text and optional text-to-speech to your chat app with Clarity Chat.',
};
export default function VoiceChatRecipePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Voice-Enabled Chat" }), _jsx("p", { className: "docs-lead", children: "Allow users to speak instead of type and play responses aloud. Perfect for accessibility, mobile users, or hands-free productivity." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You\u2019ll Build" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83C\uDF99\uFE0F ", _jsx("strong", { children: "Speech-to-text" }), " via the ", _jsx("code", { children: "VoiceInput" }), " component"] }), _jsxs("li", { children: ["\uD83E\uDDE0 ", _jsx("strong", { children: "Real-time transcripts" }), " with interim feedback"] }), _jsxs("li", { children: ["\uD83D\uDD01 ", _jsx("strong", { children: "Auto-submit" }), " or manual confirm flows"] }), _jsxs("li", { children: ["\uD83D\uDD0A ", _jsx("strong", { children: "Optional text-to-speech" }), " playback for responses"] })] }), _jsx(Callout, { type: "info", children: "Voice features rely on the browser\u2019s Web Speech APIs. Test in Chrome or Edge. Safari supports dictation with permission prompts." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. Basic Voice Input" }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ChatWindow,
  VoiceInput,
  useChat,
} from '@clarity-chat/react'

export default function VoiceAssistant() {
  const chat = useChat({ id: 'voice', api: '/api/chat/voice' })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.handleSubmit}
      footer={
        <div className="flex items-center gap-3">
          <VoiceInput
            onTranscript={(text) => chat.handleSubmit(text)}
            autoSubmit
            showInterim
            tooltipText="Press and speak"
          />
          <button
            onClick={() => chat.handleSubmit(chat.input)}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      }
    />
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Manual Confirmation & Multi-Language" }), _jsxs("p", { children: ["Disable ", _jsx("code", { children: "autoSubmit" }), " if you want the user to review the transcript first. You can also change the language locale."] }), _jsx(CodeBlock, { language: "tsx", code: `function VoiceFooter({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [pending, setPending] = React.useState('')

  return (
    <div className="flex items-center gap-3">
      <VoiceInput
        onTranscript={(text) => setPending(text)}
        autoSubmit={false}
        lang="es-ES"
        tooltipText="Habla para dictar"
      />
      <button
        disabled={!pending}
        onClick={() => {
          onSubmit(pending)
          setPending('')
        }}
        className="btn btn-primary"
      >
        Enviar
      </button>
      <button
        disabled={!pending}
        onClick={() => setPending('')}
        className="btn btn-ghost"
      >
        Clear
      </button>
    </div>
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. Text-to-Speech Playback" }), _jsx("p", { children: "Use the Web Speech API and listen for assistant messages to narrate them." }), _jsx(CodeBlock, { language: "tsx", code: `import { useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

function useSpeechSynthesis(messages: Message[], enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const latest = messages[messages.length - 1]
    if (!latest || latest.role !== 'assistant') return
    if (!('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(latest.content)
    utterance.rate = 1.05
    utterance.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [messages, enabled])
}

export function VoiceAssistant() {
  const chat = useChat({ id: 'voice' })
  const [ttsEnabled, setTtsEnabled] = React.useState(true)

  useSpeechSynthesis(chat.messages, ttsEnabled)

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.handleSubmit}
      footer={
        <div className="flex items-center gap-3">
          <VoiceInput onTranscript={chat.handleSubmit} autoSubmit />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
            Play responses aloud
          </label>
        </div>
      }
    />
  )
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "UX Tips" }), _jsxs("ul", { children: [_jsx("li", { children: "Show a transcript preview while recording so users know they\u2019re being heard" }), _jsx("li", { children: "Provide a manual submit option for noisy environments" }), _jsx("li", { children: "Allow users to toggle TTS off (avoid reading sensitive content aloud)" }), _jsxs("li", { children: ["Log ", _jsx("code", { children: "onError" }), " results to understand microphone/browser issues"] })] })] }), _jsx("section", { className: "docs-section", children: _jsxs(Callout, { type: "success", children: ["Related recipes: ", _jsx(Link, { href: "/cookbook/multi-modal-chat", children: "Multi-Modal Chat" }), ' ', "for attaching voice transcripts as files, ", _jsx(Link, { href: "/cookbook/analytics-tracking", children: "Analytics Tracking" }), ' ', "to measure voice usage."] }) })] }));
}
//# sourceMappingURL=page.js.map