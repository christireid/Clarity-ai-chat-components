import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ChatWindow } from '@clarity-chat/react';
function App() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: Date.now() - 5000,
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendMessage = async (content) => {
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `You said: "${content}". This is a demo response. In a real application, this would be replaced with an actual AI API call.

Here are some things you could try:
- Ask me a question
- Request code examples
- Get explanations for complex topics

I'm here to help!`,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 2000);
    };
    return (_jsx("div", { style: { width: '100%', maxWidth: '800px', height: '600px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage }) }));
}
export default App;
//# sourceMappingURL=App.js.map