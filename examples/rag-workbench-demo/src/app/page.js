/**
 * RAG Workbench - Main UI
 * Document Q&A with Retrieval Augmented Generation
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
// Disable static optimization
export const dynamic = 'force-dynamic';
export default function RAGWorkbenchPage() {
    const [documents, setDocuments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [provider, setProvider] = useState('openai');
    const [topK, setTopK] = useState(3);
    const fileInputRef = useRef(null);
    // Load documents on mount - use useEffect not useState
    React.useEffect(() => {
        loadDocuments();
    }, []);
    async function loadDocuments() {
        try {
            const response = await fetch('/api/documents');
            const data = await response.json();
            setDocuments(data.documents || []);
        }
        catch (error) {
            console.error('Failed to load documents:', error);
        }
    }
    async function handleFileUpload(event) {
        const file = event.target.files?.[0];
        if (!file)
            return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/documents', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const error = await response.json();
                alert(error.error || 'Upload failed');
                return;
            }
            const result = await response.json();
            alert(`Document uploaded: ${result.chunks} chunks created`);
            // Reload documents
            loadDocuments();
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        }
        finally {
            setIsUploading(false);
        }
    }
    async function handleDeleteDocument(documentId) {
        if (!confirm('Delete this document?'))
            return;
        try {
            const response = await fetch(`/api/documents?id=${documentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadDocuments();
            }
        }
        catch (error) {
            console.error('Delete error:', error);
        }
    }
    async function handleSendQuery() {
        if (!query.trim() || isLoading)
            return;
        if (documents.length === 0) {
            alert('Please upload at least one document first');
            return;
        }
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: query
        };
        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    topK,
                    model,
                    provider
                })
            });
            if (!response.ok) {
                throw new Error('Query failed');
            }
            // Stream response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = {
                id: `msg-${Date.now()}-assistant`,
                role: 'assistant',
                content: '',
                sources: [],
                tokens: null,
                cost: 0,
                responseTime: 0
            };
            setMessages(prev => [...prev, assistantMessage]);
            if (!reader)
                throw new Error('No response body');
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.type === 'metadata') {
                                assistantMessage.sources = parsed.sources;
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }]);
                            }
                            else if (parsed.type === 'content') {
                                assistantMessage.content += parsed.content;
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }]);
                            }
                            else if (parsed.type === 'done') {
                                assistantMessage.tokens = parsed.tokens;
                                assistantMessage.cost = parsed.cost;
                                assistantMessage.responseTime = parsed.responseTime;
                                setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }]);
                            }
                            else if (parsed.type === 'error') {
                                throw new Error(parsed.error);
                            }
                        }
                        catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Query error:', error);
            alert('Query failed: ' + error.message);
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "\uD83D\uDCDA RAG Workbench" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Document Q&A with Retrieval Augmented Generation" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Documents" }), _jsxs("div", { className: "mb-4", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: ".txt,.md", onChange: handleFileUpload, disabled: isUploading, className: "hidden", id: "file-upload" }), _jsx("label", { htmlFor: "file-upload", className: `block w-full text-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading
                                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                                                    : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'}`, children: isUploading ? (_jsx("span", { className: "text-gray-500", children: "Uploading..." })) : (_jsx("span", { className: "text-blue-600 font-medium", children: "\uD83D\uDCC4 Upload Document" })) }), _jsx("p", { className: "mt-2 text-xs text-gray-500 text-center", children: ".txt or .md files only" })] }), _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: documents.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-400", children: [_jsx("p", { children: "No documents yet" }), _jsx("p", { className: "text-sm mt-1", children: "Upload a document to get started" })] })) : (documents.map(doc => (_jsx("div", { className: "p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: doc.name }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [doc.chunks, " chunks \u2022 ", doc.tokens.toLocaleString(), " tokens"] })] }), _jsx("button", { onClick: () => handleDeleteDocument(doc.id), className: "ml-2 text-red-500 hover:text-red-700 text-sm", title: "Delete document", children: "\uD83D\uDDD1\uFE0F" })] }) }, doc.id)))) }), _jsxs("div", { className: "mt-6 pt-6 border-t", children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Settings" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Provider" }), _jsxs("select", { value: provider, onChange: (e) => {
                                                                    setProvider(e.target.value);
                                                                    if (e.target.value === 'openai')
                                                                        setModel('gpt-3.5-turbo');
                                                                    else if (e.target.value === 'anthropic')
                                                                        setModel('claude-3-haiku');
                                                                    else if (e.target.value === 'google')
                                                                        setModel('gemini-pro');
                                                                }, className: "w-full px-3 py-2 border rounded-lg text-sm", children: [_jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "google", children: "Google AI" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Model" }), _jsxs("select", { value: model, onChange: (e) => setModel(e.target.value), className: "w-full px-3 py-2 border rounded-lg text-sm", children: [provider === 'openai' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "gpt-4-turbo", children: "GPT-4 Turbo" }), _jsx("option", { value: "gpt-3.5-turbo", children: "GPT-3.5 Turbo" })] })), provider === 'anthropic' && (_jsxs(_Fragment, { children: [_jsx("option", { value: "claude-3-opus", children: "Claude 3 Opus" }), _jsx("option", { value: "claude-3-sonnet", children: "Claude 3 Sonnet" }), _jsx("option", { value: "claude-3-haiku", children: "Claude 3 Haiku" })] })), provider === 'google' && (_jsx("option", { value: "gemini-pro", children: "Gemini Pro" }))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs text-gray-600 mb-1", children: ["Chunks to retrieve: ", topK] }), _jsx("input", { type: "range", min: "1", max: "10", value: topK, onChange: (e) => setTopK(Number(e.target.value)), className: "w-full" })] })] })] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-200px)]", children: [_jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: messages.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg", children: "\uD83D\uDCAC Ask a question about your documents" }), _jsx("p", { className: "text-sm mt-2", children: "Upload a document first, then ask away!" })] }) })) : (messages.map(message => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-3`, children: [_jsx("p", { className: "whitespace-pre-wrap", children: message.content }), message.role === 'assistant' && message.sources && message.sources.length > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-300", children: [_jsx("p", { className: "text-xs font-semibold mb-2", children: "\uD83D\uDCDA Sources:" }), message.sources.map((source, idx) => (_jsxs("details", { className: "text-xs mb-1", children: [_jsxs("summary", { className: "cursor-pointer hover:underline", children: [source.documentName, " (score: ", source.relevanceScore.toFixed(1), ")"] }), _jsx("p", { className: "mt-1 pl-3 text-gray-600", children: source.text })] }, idx)))] })), message.role === 'assistant' && message.tokens && (_jsx("div", { className: "mt-2 text-xs text-gray-600", children: _jsxs("p", { children: ["\uD83D\uDCCA ", message.tokens.total.toLocaleString(), " tokens (", message.tokens.context, " context + ", message.tokens.completion, " response) \u2022 \uD83D\uDCB0 $", message.cost?.toFixed(6), "\u2022 \u23F1\uFE0F ", (message.responseTime / 1000).toFixed(1), "s"] }) }))] }) }, message.id)))) }), _jsx("div", { className: "border-t p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendQuery(), placeholder: documents.length === 0 ? "Upload a document first..." : "Ask a question...", disabled: isLoading || documents.length === 0, className: "flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" }), _jsx("button", { onClick: handleSendQuery, disabled: isLoading || !query.trim() || documents.length === 0, className: "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium", children: isLoading ? 'Thinking...' : 'Send' })] }) })] }) })] }) })] }));
}
//# sourceMappingURL=page.js.map