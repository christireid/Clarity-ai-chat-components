import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Advanced Chat Input',
    description: 'Enhanced chat input with file attachments, mentions, commands, and autocomplete.',
};
export default function AdvancedChatInputPage() {
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Advanced Chat Input" }), _jsx("p", { className: "text-xl text-muted-foreground", children: "A powerful chat input component with file uploads, @mentions, /commands, autocomplete, and more." })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Overview" }), _jsx("p", { children: "The Advanced Chat Input extends the basic chat input with rich interactive features including:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 ml-4", children: [_jsxs("li", { children: [_jsx("strong", { children: "File Attachments" }), " - Drag and drop or click to upload files with preview"] }), _jsxs("li", { children: [_jsx("strong", { children: "@Mentions" }), " - Autocomplete for prompts and saved content triggered by @"] }), _jsxs("li", { children: [_jsx("strong", { children: "/Commands" }), " - Quick commands for common actions triggered by /"] }), _jsxs("li", { children: [_jsx("strong", { children: "Keyboard Navigation" }), " - Full keyboard support for suggestions"] }), _jsxs("li", { children: [_jsx("strong", { children: "Character Limits" }), " - Optional character count and validation"] }), _jsxs("li", { children: [_jsx("strong", { children: "Drag & Drop" }), " - Native file drag and drop support"] })] })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Installation" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { AdvancedChatInput } from '@clarity-chat/react'` }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Basic Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { AdvancedChatInput } from '@clarity-chat/react'
import { useState } from 'react'

export default function ChatExample() {
  const [message, setMessage] = useState('')

  const handleSubmit = (value, attachments) => {
    console.log('Message:', value)
    console.log('Attachments:', attachments)
  }

  return (
    <AdvancedChatInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSubmit}
      placeholder="Type @ for prompts, / for commands..."
    />
  )
}` }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "value" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "string" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Current input value (controlled)" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "onChange" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "(value: string) => void" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Called when input changes" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "onSubmit" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "(value: string, attachments?: MessageAttachment[]) => void" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Called when message is submitted" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "onSuggestionRequest" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "(query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Async function to load autocomplete suggestions" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "onFileUpload" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "(files: File[]) => Promise<MessageAttachment[]>" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Handle file uploads, return attachment objects" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "maxFiles" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "number" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "5" }) }), _jsx("td", { className: "p-2", children: "Maximum number of attachments allowed" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "acceptedFileTypes" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "string[]" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "['image/*', 'application/pdf', ...]" }) }), _jsx("td", { className: "p-2", children: "Accepted MIME types for file uploads" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "savedPrompts" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "SavedPrompt[]" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "[]" }) }), _jsx("td", { className: "p-2", children: "Saved prompts for @ autocomplete" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "maxLength" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "number" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "-" }) }), _jsx("td", { className: "p-2", children: "Maximum character count with visual indicator" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "disabled" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "boolean" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "false" }) }), _jsx("td", { className: "p-2", children: "Disable input and controls" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: _jsx("code", { children: "placeholder" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "string" }) }), _jsx("td", { className: "p-2", children: _jsx("code", { children: "'Type a message...'" }) }), _jsx("td", { className: "p-2", children: "Placeholder text" })] })] })] }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Key Features" }), _jsx("h3", { className: "text-xl font-semibold", children: "File Attachments" }), _jsx("p", { children: "Upload files via button click or drag and drop. Preview images with size information." }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxFiles={10}
  acceptedFileTypes={['image/*', '.pdf', '.docx']}
  onFileUpload={async (files) => {
    // Upload files to your server
    const uploaded = await uploadToServer(files)
    return uploaded.map(file => ({
      id: file.id,
      type: 'image',
      name: file.name,
      url: file.url,
      size: file.size
    }))
  }}
/>` }) }), _jsx("h3", { className: "text-xl font-semibold mt-6", children: "@Mentions & /Commands" }), _jsx("p", { children: "Trigger autocomplete with @ for mentions or / for commands. Navigate with arrow keys." }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  onSuggestionRequest={async (query, trigger) => {
    if (trigger === '@') {
      // Load user mentions or saved prompts
      return await searchPrompts(query)
    } else {
      // Load commands
      return [
        { id: '1', type: 'command', label: 'help', value: '/help' },
        { id: '2', type: 'command', label: 'clear', value: '/clear' }
      ]
    }
  }}
  savedPrompts={[
    { id: '1', name: 'Code Review', content: 'Review this code...' },
    { id: '2', name: 'Explain', content: 'Explain this concept...' }
  ]}
/>` }) }), _jsx("h3", { className: "text-xl font-semibold mt-6", children: "Character Limit" }), _jsx("p", { children: "Set a character limit with visual feedback when approaching or exceeding the limit." }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={2000}
/>` }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Keyboard Shortcuts" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Input" }), _jsxs("ul", { className: "space-y-1", children: [_jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Enter" }), " - Send message"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Shift" }), " + ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Enter" }), " - New line"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "@" }), " - Trigger mentions"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "/" }), " - Trigger commands"] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Autocomplete" }), _jsxs("ul", { className: "space-y-1", children: [_jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "\u2191/\u2193" }), " - Navigate suggestions"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Tab" }), " or ", _jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Enter" }), " - Select suggestion"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-2 py-1 bg-muted rounded", children: "Esc" }), " - Close suggestions"] })] })] })] })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Accessibility" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 ml-4", children: [_jsx("li", { children: "Full keyboard navigation support" }), _jsx("li", { children: "Screen reader announcements for suggestions" }), _jsx("li", { children: "ARIA attributes for autocomplete" }), _jsx("li", { children: "Focus management for file inputs" }), _jsx("li", { children: "Disabled state properly communicated" })] })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "TypeScript" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `interface InputSuggestion {
  id: string
  type: 'prompt' | 'command' | 'mention'
  label: string
  description?: string
  value: string
  icon?: string
}

interface MessageAttachment {
  id: string
  type: 'image' | 'document'
  name: string
  url?: string
  size?: number
  mimeType?: string
}

interface AdvancedChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments?: MessageAttachment[]) => void
  onSuggestionRequest?: (query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>
  onFileUpload?: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  acceptedFileTypes?: string[]
  savedPrompts?: SavedPrompt[]
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  className?: string
}` }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold border-b pb-2", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 ml-4", children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/chat-window", className: "text-primary hover:underline", children: "Chat Window" }), " - Complete chat interface"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/message", className: "text-primary hover:underline", children: "Message" }), " - Display chat messages"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/file-upload", className: "text-primary hover:underline", children: "File Upload" }), " - Standalone file upload"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/copy-button", className: "text-primary hover:underline", children: "Copy Button" }), " - Copy functionality"] })] })] })] }));
}
//# sourceMappingURL=page.js.map