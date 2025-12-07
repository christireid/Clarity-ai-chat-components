import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Hooks/Utilities/UseVoiceInput',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
# useVoiceInput

Speech-to-text input hook using the Web Speech API for voice recognition.

## Features

- **Real-Time Transcription**: Live speech-to-text conversion
- **Continuous Mode**: Keep listening after speech ends
- **Interim Results**: Show real-time transcription
- **Multi-Language**: Support for 50+ languages
- **Confidence Scores**: Track recognition accuracy
- **Auto-Stop**: Stop after silence period
- **Browser Detection**: Check for API support

## Browser Support

- ✅ **Chrome/Edge**: Full support (best experience)
- ✅ **Safari**: iOS 14.5+, macOS 14.3+
- ❌ **Firefox**: Not yet supported
- ❌ **Mobile Firefox**: Not supported

## Use Cases

- **Voice Chat Input**: Hands-free messaging
- **Accessibility**: Voice input for users with disabilities
- **Voice Commands**: Command palette with voice
- **Transcription**: Real-time note taking
- **Dictation**: Long-form content creation

## Basic Usage

\`\`\`tsx
const {
  isListening,
  transcript,
  finalTranscript,
  isSupported,
  startListening,
  stopListening,
} = useVoiceInput({
  lang: 'en-US',
  continuous: false,
  interimResults: true,
})

if (!isSupported) {
  return <div>Voice input not supported in this browser</div>
}

return (
  <div>
    <button onClick={isListening ? stopListening : startListening}>
      {isListening ? 'Stop' : 'Start'} Listening
    </button>
    <div>{transcript}</div>
  </div>
)
\`\`\`

## API Reference

### Options

- \`lang\`: Language code (default: 'en-US')
- \`continuous\`: Keep listening (default: false)
- \`interimResults\`: Show interim text (default: true)
- \`maxAlternatives\`: Max alternative transcripts (default: 1)
- \`autoStopTimeout\`: Auto-stop after silence in ms (default: 3000)
- \`onTranscript\`: Callback on text update
- \`onSpeechStart\`: Callback when speaking starts
- \`onSpeechEnd\`: Callback when speaking ends
- \`onError\`: Callback on errors

### Returns

- \`isListening\`: Whether currently listening
- \`transcript\`: Full transcript (interim + final)
- \`finalTranscript\`: Confirmed text only
- \`interimTranscript\`: Real-time text (may change)
- \`isSupported\`: Whether browser supports API
- \`error\`: Error message if any
- \`confidence\`: Recognition confidence (0-1)
- \`startListening()\`: Start voice recognition
- \`stopListening()\`: Stop voice recognition
- \`resetTranscript()\`: Clear transcript
`,
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Example
// ============================================================================
export const BasicVoiceInput = {
    render: () => {
        // Note: This is a simulation since Web Speech API needs user interaction
        const [isListening, setIsListening] = React.useState(false);
        const [transcript, setTranscript] = React.useState('');
        const [interimText, setInterimText] = React.useState('');
        const simulateVoiceInput = () => {
            setIsListening(true);
            setInterimText('');
            const words = 'Hello this is a test of voice input'.split(' ');
            let index = 0;
            const interval = setInterval(() => {
                if (index < words.length) {
                    setInterimText(words.slice(0, index + 1).join(' '));
                    index++;
                }
                else {
                    setTranscript(words.join(' '));
                    setInterimText('');
                    setIsListening(false);
                    clearInterval(interval);
                }
            }, 300);
        };
        const reset = () => {
            setTranscript('');
            setInterimText('');
            setIsListening(false);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Note:" }), " This is a simulation. Real voice input requires user microphone permission. In production, this hook uses the Web Speech API."] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: simulateVoiceInput, disabled: isListening, className: "flex items-center gap-2", children: isListening ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), "Listening..."] })) : (_jsx(_Fragment, { children: "\uD83C\uDFA4 Start Voice Input" })) }), _jsx(Button, { onClick: reset, variant: "outline", disabled: isListening, children: "Clear" })] }), _jsxs("div", { className: "border rounded-lg p-4 min-h-[120px] bg-card", children: [isListening && interimText && (_jsxs("div", { className: "text-muted-foreground italic mb-2", children: [interimText, _jsx("span", { className: "animate-pulse", children: "\u258B" })] })), transcript && (_jsx("div", { className: "font-medium", children: transcript })), !isListening && !transcript && (_jsx("div", { className: "text-muted-foreground text-center py-8", children: "Click \"Start Voice Input\" to begin" }))] }), transcript && (_jsx("div", { className: "p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800", children: "\u2713 Transcription complete" }))] }));
    },
};
// ============================================================================
// Language Selection
// ============================================================================
export const LanguageSelection = {
    render: () => {
        const [language, setLanguage] = React.useState('en-US');
        const [isListening, setIsListening] = React.useState(false);
        const [transcript, setTranscript] = React.useState('');
        const languages = [
            { code: 'en-US', name: 'English (US)', sample: 'Hello, how are you?' },
            { code: 'es-ES', name: 'Español', sample: 'Hola, ¿cómo estás?' },
            { code: 'fr-FR', name: 'Français', sample: 'Bonjour, comment allez-vous?' },
            { code: 'de-DE', name: 'Deutsch', sample: 'Hallo, wie geht es dir?' },
            { code: 'ja-JP', name: '日本語', sample: 'こんにちは、お元気ですか？' },
            { code: 'zh-CN', name: '中文', sample: '你好，你好吗？' },
        ];
        const simulateTranscription = () => {
            setIsListening(true);
            const selectedLang = languages.find(l => l.code === language);
            setTimeout(() => {
                setTranscript(selectedLang?.sample || 'Hello!');
                setIsListening(false);
            }, 2000);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Select Language:" }), _jsx("select", { value: language, onChange: (e) => {
                                setLanguage(e.target.value);
                                setTranscript('');
                            }, className: "w-full px-3 py-2 border rounded", disabled: isListening, children: languages.map((lang) => (_jsx("option", { value: lang.code, children: lang.name }, lang.code))) })] }), _jsx(Button, { onClick: simulateTranscription, disabled: isListening, className: "w-full", children: isListening ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" }), "Listening in ", languages.find(l => l.code === language)?.name, "..."] })) : (_jsx(_Fragment, { children: "\uD83C\uDFA4 Start Voice Input" })) }), _jsx("div", { className: "border rounded-lg p-4 min-h-[100px] bg-card", children: transcript || (_jsx("div", { className: "text-muted-foreground text-center py-4", children: "Select a language and start speaking" })) }), transcript && (_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Recognized in: ", languages.find(l => l.code === language)?.name] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Voice input with multi-language support.',
            },
        },
    },
};
// ============================================================================
// Chat Integration
// ============================================================================
export const ChatIntegration = {
    render: () => {
        const [messages, setMessages] = React.useState([]);
        const [isListening, setIsListening] = React.useState(false);
        const [currentTranscript, setCurrentTranscript] = React.useState('');
        const [textInput, setTextInput] = React.useState('');
        const simulateVoice = () => {
            setIsListening(true);
            setCurrentTranscript('');
            const sample = 'What is artificial intelligence?';
            const words = sample.split(' ');
            let index = 0;
            const interval = setInterval(() => {
                if (index < words.length) {
                    setCurrentTranscript(words.slice(0, index + 1).join(' '));
                    index++;
                }
                else {
                    setTextInput(sample);
                    setCurrentTranscript('');
                    setIsListening(false);
                    clearInterval(interval);
                }
            }, 200);
        };
        const sendMessage = () => {
            if (textInput.trim()) {
                setMessages([...messages, textInput]);
                setTextInput('');
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "border rounded-lg p-4 h-64 overflow-y-auto bg-muted/20", children: messages.length === 0 ? (_jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "No messages yet" })) : (_jsx("div", { className: "space-y-2", children: messages.map((msg, index) => (_jsx("div", { className: "p-3 bg-primary text-primary-foreground rounded-lg", children: msg }, index))) })) }), _jsxs("div", { className: "space-y-2", children: [isListening && currentTranscript && (_jsx("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "text-sm text-blue-800 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), _jsx("span", { className: "italic", children: currentTranscript })] }) })), _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { value: textInput, onChange: (e) => setTextInput(e.target.value), placeholder: "Type or use voice input...", className: "flex-1 px-3 py-2 border rounded-lg resize-none", rows: 2 }), _jsx("div", { className: "flex flex-col gap-2", children: _jsx(Button, { onClick: simulateVoice, disabled: isListening, size: "sm", variant: "outline", className: "h-full", children: isListening ? '🔴' : '🎤' }) })] }), _jsx(Button, { onClick: sendMessage, className: "w-full", disabled: !textInput.trim(), children: "Send Message" })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Voice input integrated with chat interface.',
            },
        },
    },
};
// ============================================================================
// Browser Support Info
// ============================================================================
export const BrowserSupportInfo = {
    render: () => {
        const browsers = [
            { name: 'Chrome', supported: true, version: '25+', notes: 'Full support' },
            { name: 'Edge', supported: true, version: '79+', notes: 'Full support' },
            { name: 'Safari', supported: true, version: 'iOS 14.5+', notes: 'Good support' },
            { name: 'Firefox', supported: false, version: '-', notes: 'Not yet supported' },
            { name: 'Opera', supported: true, version: '27+', notes: 'Full support' },
            { name: 'Samsung Internet', supported: false, version: '-', notes: 'Not supported' },
        ];
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-2", children: "Browser Compatibility" }), _jsx("p", { className: "text-sm text-blue-800", children: "The Web Speech API has varying support across browsers. Check compatibility before using voice features." })] }), _jsx("div", { className: "border rounded-lg overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-muted", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 text-sm font-semibold", children: "Browser" }), _jsx("th", { className: "text-left p-3 text-sm font-semibold", children: "Version" }), _jsx("th", { className: "text-left p-3 text-sm font-semibold", children: "Status" }), _jsx("th", { className: "text-left p-3 text-sm font-semibold", children: "Notes" })] }) }), _jsx("tbody", { children: browsers.map((browser, index) => (_jsxs("tr", { className: index % 2 === 0 ? 'bg-card' : 'bg-muted/30', children: [_jsx("td", { className: "p-3 font-medium", children: browser.name }), _jsx("td", { className: "p-3 text-sm", children: browser.version }), _jsx("td", { className: "p-3", children: _jsx("span", { className: `px-2 py-1 text-xs rounded-full ${browser.supported
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: browser.supported ? '✅ Supported' : '❌ Not Supported' }) }), _jsx("td", { className: "p-3 text-sm text-muted-foreground", children: browser.notes })] }, browser.name))) })] }) }), _jsxs("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-yellow-900 mb-2", children: "\uD83D\uDCA1 Implementation Tips" }), _jsxs("ul", { className: "text-sm text-yellow-800 space-y-1 ml-4 list-disc", children: [_jsx("li", { children: "Always check \\`isSupported\\` before showing voice UI" }), _jsx("li", { children: "Provide fallback text input for unsupported browsers" }), _jsx("li", { children: "Request microphone permission before using" }), _jsx("li", { children: "Handle errors gracefully (e.g., permission denied)" }), _jsx("li", { children: "Show visual feedback while listening" })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Browser support information and implementation tips.',
            },
        },
    },
};
// ============================================================================
// Continuous Mode
// ============================================================================
export const ContinuousModeExample = {
    render: () => {
        const [isListening, setIsListening] = React.useState(false);
        const [transcript, setTranscript] = React.useState('');
        const [messages, setMessages] = React.useState([]);
        const toggleListening = () => {
            if (isListening) {
                setIsListening(false);
                if (transcript) {
                    setMessages([...messages, transcript]);
                    setTranscript('');
                }
            }
            else {
                setIsListening(true);
                // Simulate continuous listening
                const interval = setInterval(() => {
                    setTranscript((prev) => {
                        const words = ['hello', 'world', 'this', 'is', 'continuous', 'mode'];
                        const randomWord = words[Math.floor(Math.random() * words.length)];
                        return prev ? `${prev} ${randomWord}` : randomWord;
                    });
                }, 1000);
                setTimeout(() => {
                    clearInterval(interval);
                }, 5000);
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold", children: "Continuous Listening Mode" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}` }), _jsx("span", { className: "text-sm", children: isListening ? 'Listening' : 'Idle' })] })] }), _jsx(Button, { onClick: toggleListening, className: "w-full", children: isListening ? 'Stop & Save' : 'Start Continuous Listening' })] }), _jsxs("div", { className: "border rounded-lg p-4 min-h-[120px] bg-card", children: [_jsx("div", { className: "text-sm text-muted-foreground mb-2", children: "Current Transcript:" }), _jsxs("div", { className: "font-medium", children: [transcript || _jsx("span", { className: "text-muted-foreground italic", children: "No speech detected..." }), isListening && _jsx("span", { className: "animate-pulse", children: "\u258B" })] })] }), messages.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm font-medium", children: "Saved Transcripts:" }), messages.map((msg, index) => (_jsx("div", { className: "p-3 bg-muted rounded-lg text-sm", children: msg }, index)))] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Continuous listening mode that keeps recognizing speech.',
            },
        },
    },
};
// ============================================================================
// Confidence Scores
// ============================================================================
export const ConfidenceScores = {
    render: () => {
        const [results, setResults] = React.useState([]);
        const simulateRecognition = () => {
            const samples = [
                { text: 'Hello world', confidence: 0.98 },
                { text: 'How are you today', confidence: 0.92 },
                { text: 'The weather is nice', confidence: 0.85 },
                { text: 'Something unclear', confidence: 0.62 },
            ];
            const sample = samples[Math.floor(Math.random() * samples.length)];
            setResults([...results, sample]);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: simulateRecognition, children: "Simulate Voice Recognition" }), _jsx("div", { className: "space-y-3", children: results.length === 0 ? (_jsx("div", { className: "border border-dashed border-border/50 rounded-lg p-8 text-center text-muted-foreground", children: "Click button to simulate recognition with confidence scores" })) : (results.map((result, index) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("div", { className: "font-medium", children: result.text }), _jsxs("span", { className: `px-2 py-1 text-xs rounded ${result.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                                            result.confidence >= 0.75 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`, children: [(result.confidence * 100).toFixed(0), "% confident"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${result.confidence >= 0.9 ? 'bg-green-500' :
                                        result.confidence >= 0.75 ? 'bg-yellow-500' :
                                            'bg-red-500'}`, style: { width: `${result.confidence * 100}%` } }) })] }, index)))) }), results.length > 0 && (_jsxs("div", { className: "p-3 bg-muted rounded-lg text-sm", children: [_jsx("strong", { children: "Tip:" }), " Low confidence scores may indicate unclear speech, background noise, or accents. Consider asking users to repeat for better accuracy."] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Displays confidence scores for voice recognition accuracy.',
            },
        },
    },
};
//# sourceMappingURL=UseVoiceInput.stories.js.map