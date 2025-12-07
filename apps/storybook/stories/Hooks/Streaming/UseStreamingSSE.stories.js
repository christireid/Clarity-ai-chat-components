import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
const meta = {
    title: 'Hooks/Streaming/UseStreamingSSE',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
# useStreamingSSE

React hook for Server-Sent Events (SSE) streaming with automatic reconnection, error recovery, and heartbeat support.

## Features

- **Auto Reconnection**: Automatic reconnection with exponential backoff
- **Heartbeat**: Keep-alive mechanism to detect stale connections
- **Error Recovery**: Robust error handling with retry logic
- **Resume Support**: Resume from last event ID after disconnect
- **JSON Parsing**: Automatic JSON parsing for structured data
- **Connection Management**: Manual connect/disconnect control
- **Status Tracking**: Real-time connection status updates
- **Event History**: Access to all received events

## Use Cases

- **Real-Time Updates**: Live feeds, notifications, stock prices
- **AI Streaming**: Token-by-token LLM responses
- **Progress Updates**: Long-running operation status
- **Live Chat**: Real-time message delivery
- **Dashboard Metrics**: Live metric updates

## Basic Usage

\`\`\`tsx
const { status, data, connect, disconnect } = useStreamingSSE({
  url: '/api/stream',
  onMessage: (event) => console.log(event.data),
  autoReconnect: true,
})

// Connect manually
connect()

// Disconnect when done
disconnect()
\`\`\`

## API Reference

### Options

- \`url\`: SSE endpoint URL
- \`method\`: HTTP method ('GET' | 'POST')
- \`body\`: Request body for POST
- \`headers\`: Custom headers
- \`authToken\`: Authentication token
- \`autoReconnect\`: Enable reconnection (default: true)
- \`maxReconnectAttempts\`: Max retries (default: 5)
- \`reconnectDelay\`: Initial delay (default: 1000ms)
- \`heartbeatInterval\`: Heartbeat interval (default: 30000ms)

### Returns

- \`status\`: Connection status
- \`events\`: All received events
- \`lastEvent\`: Latest event
- \`data\`: Accumulated data string
- \`error\`: Current error
- \`connect()\`: Connect to endpoint
- \`disconnect()\`: Disconnect
- \`reconnect()\`: Force reconnection
- \`clear()\`: Clear event history
`,
            },
        },
    },
};
export default meta;
// ============================================================================
// Mock SSE Server (simulated)
// ============================================================================
function useMockSSEServer() {
    const [isActive, setIsActive] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const simulateSSE = (callback) => {
        let counter = 0;
        const interval = setInterval(() => {
            const event = {
                type: 'message',
                data: { counter, message: `Event ${counter}`, timestamp: Date.now() },
                raw: JSON.stringify({ counter, message: `Event ${counter}` }),
                id: String(counter),
            };
            callback(event);
            setEvents((prev) => [...prev, event]);
            counter++;
            // Stop after 10 events
            if (counter >= 10) {
                clearInterval(interval);
                setIsActive(false);
            }
        }, 1000);
        return () => clearInterval(interval);
    };
    return { isActive, setIsActive, events, simulateSSE };
}
// ============================================================================
// Basic Examples
// ============================================================================
export const BasicExample = {
    render: () => {
        const [messages, setMessages] = React.useState([]);
        const [isConnected, setIsConnected] = React.useState(false);
        const handleMessage = (event) => {
            setMessages((prev) => [...prev, event]);
        };
        const mockConnect = () => {
            setIsConnected(true);
            let count = 0;
            const interval = setInterval(() => {
                if (count < 10) {
                    handleMessage({
                        type: 'message',
                        data: { count, text: `Message ${count}` },
                        raw: JSON.stringify({ count, text: `Message ${count}` }),
                        id: String(count),
                    });
                    count++;
                }
                else {
                    clearInterval(interval);
                }
            }, 1000);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: mockConnect, disabled: isConnected, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: isConnected ? 'Connected' : 'Connect' }), _jsx("button", { onClick: () => {
                                setMessages([]);
                                setIsConnected(false);
                            }, className: "px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80", children: "Clear" })] }), _jsx("div", { className: "border rounded-lg p-4 h-64 overflow-y-auto bg-muted", children: messages.length === 0 ? (_jsx("p", { className: "text-muted-foreground text-center", children: "No messages yet. Click Connect to start." })) : (_jsx("div", { className: "space-y-2", children: messages.map((msg, index) => (_jsx("div", { className: "p-2 bg-background rounded", children: _jsx("div", { className: "text-sm font-mono", children: JSON.stringify(msg.data, null, 2) }) }, index))) })) })] }));
    },
};
// ============================================================================
// AI Streaming Simulation
// ============================================================================
export const AIStreamingExample = {
    render: () => {
        const [content, setContent] = React.useState('');
        const [isStreaming, setIsStreaming] = React.useState(false);
        const streamAIResponse = () => {
            setIsStreaming(true);
            setContent('');
            const fullText = 'This is a simulated AI response that streams token by token, just like how modern language models deliver their responses in real-time.';
            const words = fullText.split(' ');
            let index = 0;
            const interval = setInterval(() => {
                if (index < words.length) {
                    setContent((prev) => prev + (prev ? ' ' : '') + words[index]);
                    index++;
                }
                else {
                    clearInterval(interval);
                    setIsStreaming(false);
                }
            }, 150);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: streamAIResponse, disabled: isStreaming, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: isStreaming ? 'Streaming...' : 'Start AI Streaming' }), _jsx("div", { className: "border rounded-lg p-4 min-h-[100px] bg-muted", children: _jsxs("p", { className: "text-foreground", children: [content, isStreaming && _jsx("span", { className: "animate-pulse", children: "\u258B" })] }) }), !isStreaming && content && (_jsx("div", { className: "text-sm text-muted-foreground", children: "\u2713 Stream complete" }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Simulates AI token-by-token streaming response.',
            },
        },
    },
};
// ============================================================================
// Connection Status Visualization
// ============================================================================
export const ConnectionStatusExample = {
    render: () => {
        const [status, setStatus] = React.useState('idle');
        const [eventCount, setEventCount] = React.useState(0);
        const connect = () => {
            setStatus('connecting');
            setTimeout(() => {
                setStatus('connected');
                // Simulate receiving events
                const interval = setInterval(() => {
                    setEventCount((c) => c + 1);
                }, 500);
                setTimeout(() => {
                    clearInterval(interval);
                }, 5000);
            }, 1000);
        };
        const disconnect = () => {
            setStatus('idle');
            setEventCount(0);
        };
        const statusColors = {
            idle: 'bg-gray-500',
            connecting: 'bg-yellow-500',
            connected: 'bg-green-500',
            error: 'bg-red-500',
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 border rounded-lg", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${statusColors[status]} animate-pulse` }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium capitalize", children: status }), _jsx("div", { className: "text-sm text-muted-foreground", children: eventCount > 0 && `${eventCount} events received` })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: connect, disabled: status !== 'idle', className: "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: "Connect" }), _jsx("button", { onClick: disconnect, disabled: status === 'idle', className: "px-3 py-1.5 text-sm border rounded hover:bg-accent disabled:opacity-50", children: "Disconnect" })] })] }), _jsxs("div", { className: "border rounded-lg p-4 bg-muted", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Status Indicators" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-gray-500" }), _jsx("span", { children: "Idle - Not connected" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-500" }), _jsx("span", { children: "Connecting - Establishing connection" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" }), _jsx("span", { children: "Connected - Receiving events" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-red-500" }), _jsx("span", { children: "Error - Connection failed" })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Visualizes connection status with indicators.',
            },
        },
    },
};
// ============================================================================
// Auto Reconnection Demo
// ============================================================================
export const AutoReconnectionExample = {
    render: () => {
        const [logs, setLogs] = React.useState([]);
        const [isActive, setIsActive] = React.useState(false);
        const [reconnectCount, setReconnectCount] = React.useState(0);
        const addLog = (message) => {
            setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
        };
        const simulateConnection = () => {
            setIsActive(true);
            addLog('Connecting to server...');
            setTimeout(() => {
                addLog('✓ Connected successfully');
                // Simulate disconnect after 3 seconds
                setTimeout(() => {
                    addLog('⚠ Connection lost - Server disconnected');
                    setReconnectCount((c) => c + 1);
                    // Attempt reconnection
                    setTimeout(() => {
                        addLog('Attempting to reconnect...');
                        setTimeout(() => {
                            addLog('✓ Reconnected successfully');
                        }, 1500);
                    }, 2000);
                }, 3000);
            }, 1000);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-muted rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Auto Reconnection" }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Reconnection attempts: ", reconnectCount] })] }), _jsx("button", { onClick: simulateConnection, disabled: isActive, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50", children: "Simulate Connection" })] }), _jsx("div", { className: "border rounded-lg p-4 h-64 overflow-y-auto bg-muted font-mono text-sm", children: logs.map((log, index) => (_jsx("div", { className: "py-1", children: log }, index))) }), _jsx("button", { onClick: () => setLogs([]), className: "text-sm text-muted-foreground hover:text-foreground", children: "Clear Logs" })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates automatic reconnection with logging.',
            },
        },
    },
};
// ============================================================================
// Real-Time Dashboard
// ============================================================================
export const RealTimeDashboard = {
    render: () => {
        const [metrics, setMetrics] = React.useState({
            users: 0,
            requests: 0,
            errors: 0,
            latency: 0,
        });
        const [isLive, setIsLive] = React.useState(false);
        React.useEffect(() => {
            if (!isLive)
                return;
            const interval = setInterval(() => {
                setMetrics({
                    users: Math.floor(Math.random() * 100) + 50,
                    requests: Math.floor(Math.random() * 1000) + 500,
                    errors: Math.floor(Math.random() * 10),
                    latency: Math.floor(Math.random() * 200) + 50,
                });
            }, 1000);
            return () => clearInterval(interval);
        }, [isLive]);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Live Metrics Dashboard" }), _jsxs("button", { onClick: () => setIsLive(!isLive), className: `px-4 py-2 rounded ${isLive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'}`, children: [isLive ? 'Stop' : 'Start', " Live Updates"] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: metrics.users }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Active Users" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: metrics.requests }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Requests/min" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: metrics.errors }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Errors" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold", children: [metrics.latency, "ms"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Avg Latency" })] })] }), isLive && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { children: "Live updates active" })] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Real-time metrics dashboard powered by SSE.',
            },
        },
    },
};
//# sourceMappingURL=UseStreamingSSE.stories.js.map