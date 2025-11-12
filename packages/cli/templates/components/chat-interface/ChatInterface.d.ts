/**
 * Chat Interface Component
 * Full-featured chat UI with message history and streaming support
 */
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
interface ChatInterfaceProps {
    onSendMessage: (message: string) => Promise<void>;
    messages?: Message[];
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}
export declare function ChatInterface({ onSendMessage, messages, isLoading, placeholder, className, }: ChatInterfaceProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ChatInterface.d.ts.map