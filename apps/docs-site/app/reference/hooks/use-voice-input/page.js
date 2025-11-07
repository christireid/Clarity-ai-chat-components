import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useVoiceInput Hook | Clarity Chat',
    description: 'Hook for voice-to-text input using Web Speech API with browser compatibility.'
};
export default function UseVoiceInputPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useVoiceInput Hook" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "React hook for voice input using the Web Speech API with automatic transcription and browser compatibility detection." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Browser speech recognition API integration" }), _jsx("li", { children: "Real-time transcription with interim results" }), _jsx("li", { children: "Multiple language support" }), _jsx("li", { children: "Continuous and single-phrase modes" }), _jsx("li", { children: "Auto-stop on silence detection" }), _jsx("li", { children: "Browser compatibility checking" }), _jsx("li", { children: "Error handling and fallback support" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { useVoiceInput } from '@clarity-chat/react'

function VoiceInput() {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error
  } = useVoiceInput({
    language: 'en-US',
    continuous: false,
    onResult: (text) => console.log('Transcribed:', text)
  })

  if (!isSupported) {
    return <p>Voice input not supported in this browser</p>
  }

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop' : 'Start'} Recording
      </button>
      <p>{transcript}</p>
    </div>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map