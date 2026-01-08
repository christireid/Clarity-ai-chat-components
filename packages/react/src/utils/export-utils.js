/**
 * Advanced Conversation Export Utilities
 *
 * Multi-format export with privacy controls, custom templates,
 * and metadata preservation.
 *
 * @blueprint Feature 2.4 - Advanced Export System
 * @priority MEDIUM
 * @status NEW - Implementation based on blueprint analysis
 */
// ============================================================================
// Analytics Calculation
// ============================================================================
export function calculateAnalytics(messages) {
    const userMessages = messages.filter((m) => m.role === 'user');
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    const systemMessages = messages.filter((m) => m.role === 'system');
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokens || 0), 0);
    const averageMessageLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    const timestamps = messages
        .map((m) => m.timestamp)
        .filter((t) => t instanceof Date)
        .sort((a, b) => a.getTime() - b.getTime());
    const firstMessageAt = timestamps[0];
    const lastMessageAt = timestamps[timestamps.length - 1];
    const conversationDuration = lastMessageAt && firstMessageAt
        ? (lastMessageAt.getTime() - firstMessageAt.getTime()) / 1000 // seconds
        : undefined;
    return {
        totalMessages: messages.length,
        userMessages: userMessages.length,
        assistantMessages: assistantMessages.length,
        systemMessages: systemMessages.length,
        totalTokens,
        estimatedCost: totalTokens ? (totalTokens / 1000) * 0.002 : undefined, // Rough estimate
        averageMessageLength,
        conversationDuration,
        firstMessageAt,
        lastMessageAt,
    };
}
// ============================================================================
// Privacy Functions
// ============================================================================
const SENSITIVE_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b\d{16}\b/g, // Credit card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
];
export function redactSensitiveInfo(text) {
    let redacted = text;
    SENSITIVE_PATTERNS.forEach((pattern) => {
        redacted = redacted.replace(pattern, '[REDACTED]');
    });
    return redacted;
}
export function sanitizeMessages(messages, options) {
    let filtered = [...messages];
    // Filter out system messages if requested
    if (!options.includeSystemMessages) {
        filtered = filtered.filter((m) => m.role !== 'system');
    }
    // Apply custom filter
    if (options.messageFilter) {
        filtered = filtered.filter(options.messageFilter);
    }
    // Redact sensitive info in privacy mode
    if (options.privacyMode) {
        filtered = filtered.map((m) => ({
            ...m,
            content: redactSensitiveInfo(m.content),
        }));
    }
    return filtered;
}
// ============================================================================
// Export to JSON
// ============================================================================
export function exportToJSON(messages, options) {
    const sanitized = sanitizeMessages(messages, options);
    const data = {
        metadata: {
            exportedAt: new Date().toISOString(),
            messageCount: sanitized.length,
            format: 'json',
            version: '1.0.0',
        },
        messages: sanitized.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            ...(options.includeTimestamps &&
                m.timestamp && { timestamp: m.timestamp.toISOString() }),
            ...(options.includeMetadata && { tokens: m.tokens, cost: m.cost }),
        })),
    };
    if (options.includeAnalytics) {
        data.analytics = calculateAnalytics(messages);
    }
    return JSON.stringify(data, null, 2);
}
// ============================================================================
// Export to Markdown
// ============================================================================
export function exportToMarkdown(messages, options) {
    const sanitized = sanitizeMessages(messages, options);
    const analytics = options.includeAnalytics
        ? calculateAnalytics(messages)
        : null;
    let markdown = '# Conversation Export\n\n';
    // Add metadata
    if (options.includeMetadata) {
        markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
        markdown += `**Messages:** ${sanitized.length}\n\n`;
    }
    // Add analytics
    if (analytics) {
        markdown += '## Analytics\n\n';
        markdown += `- Total Messages: ${analytics.totalMessages}\n`;
        markdown += `- User Messages: ${analytics.userMessages}\n`;
        markdown += `- Assistant Messages: ${analytics.assistantMessages}\n`;
        if (analytics.totalTokens) {
            markdown += `- Total Tokens: ${analytics.totalTokens}\n`;
        }
        if (analytics.estimatedCost) {
            markdown += `- Estimated Cost: $${analytics.estimatedCost.toFixed(4)}\n`;
        }
        markdown += '\n---\n\n';
    }
    // Add messages
    markdown += '## Conversation\n\n';
    sanitized.forEach((message, index) => {
        const roleEmoji = message.role === 'user'
            ? '👤'
            : message.role === 'assistant'
                ? '🤖'
                : '⚙️';
        const roleName = message.role.charAt(0).toUpperCase() + message.role.slice(1);
        markdown += `### ${roleEmoji} ${roleName}`;
        if (options.includeTimestamps && message.timestamp) {
            markdown += ` - ${message.timestamp.toLocaleString()}`;
        }
        markdown += '\n\n';
        markdown += message.content + '\n\n';
        if (options.includeMetadata && message.tokens) {
            markdown += `*Tokens: ${message.tokens}*\n\n`;
        }
        if (index < sanitized.length - 1) {
            markdown += '---\n\n';
        }
    });
    return markdown;
}
// ============================================================================
// Export to HTML
// ============================================================================
export function exportToHTML(messages, options) {
    const sanitized = sanitizeMessages(messages, options);
    const analytics = options.includeAnalytics
        ? calculateAnalytics(messages)
        : null;
    const defaultCss = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 32px;
      line-height: 1.6;
      color: #2c3e50;
    }
    .header {
      border-bottom: 2px solid #3498db;
      padding-bottom: 16px;
      margin-bottom: 32px;
    }
    .message {
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #ccc;
    }
    .message.user {
      background: #e3f2fd;
      border-left-color: #2196f3;
    }
    .message.assistant {
      background: #f3e5f5;
      border-left-color: #9c27b0;
    }
    .message.system {
      background: #fff3e0;
      border-left-color: #ff9800;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .analytics {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .analytics h2 {
      margin-top: 0;
    }
    .analytics ul {
      list-style: none;
      padding: 0;
    }
    .analytics li {
      margin: 8px 0;
    }
  `;
    const css = options.customCss || defaultCss;
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conversation Export</title>
  <style>${css}</style>
</head>
<body>
  <div class="header">
    <h1>Conversation Export</h1>
    <p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Messages:</strong> ${sanitized.length}</p>
  </div>
`;
    // Add analytics
    if (analytics) {
        html += `
  <div class="analytics">
    <h2>Analytics</h2>
    <ul>
      <li><strong>Total Messages:</strong> ${analytics.totalMessages}</li>
      <li><strong>User Messages:</strong> ${analytics.userMessages}</li>
      <li><strong>Assistant Messages:</strong> ${analytics.assistantMessages}</li>
      ${analytics.totalTokens ? `<li><strong>Total Tokens:</strong> ${analytics.totalTokens}</li>` : ''}
      ${analytics.estimatedCost ? `<li><strong>Estimated Cost:</strong> $${analytics.estimatedCost.toFixed(4)}</li>` : ''}
      ${analytics.conversationDuration ? `<li><strong>Duration:</strong> ${Math.round(analytics.conversationDuration / 60)} minutes</li>` : ''}
    </ul>
  </div>
`;
    }
    // Add messages
    sanitized.forEach((message) => {
        const roleEmoji = message.role === 'user'
            ? '👤'
            : message.role === 'assistant'
                ? '🤖'
                : '⚙️';
        const roleName = message.role.charAt(0).toUpperCase() + message.role.slice(1);
        html += `
  <div class="message ${message.role}">
    <div class="message-header">
      <span>${roleEmoji} ${roleName}</span>
      ${options.includeTimestamps && message.timestamp ? `<span>${message.timestamp.toLocaleString()}</span>` : ''}
    </div>
    <div class="message-content">${escapeHtml(message.content)}</div>
    ${options.includeMetadata && message.tokens ? `<div style="margin-top: 8px; font-size: 0.875rem; color: #666;">Tokens: ${message.tokens}</div>` : ''}
  </div>
`;
    });
    html += `
</body>
</html>
`;
    return html;
}
function escapeHtml(text) {
    // SSR-safe HTML escaping - try DOM first, fallback to string replacement
    if (typeof document !== 'undefined') {
        // Client-side: use DOM API
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    // Server-side: use string replacement
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// ============================================================================
// Export to Text
// ============================================================================
export function exportToText(messages, options) {
    const sanitized = sanitizeMessages(messages, options);
    let text = 'CONVERSATION EXPORT\n';
    text += '='.repeat(50) + '\n\n';
    text += `Exported: ${new Date().toLocaleString()}\n`;
    text += `Messages: ${sanitized.length}\n\n`;
    text += '='.repeat(50) + '\n\n';
    sanitized.forEach((message, index) => {
        const roleName = message.role.toUpperCase();
        text += `[${roleName}]`;
        if (options.includeTimestamps && message.timestamp) {
            text += ` ${message.timestamp.toLocaleString()}`;
        }
        text += '\n';
        text += message.content + '\n';
        if (options.includeMetadata && message.tokens) {
            text += `(Tokens: ${message.tokens})\n`;
        }
        if (index < sanitized.length - 1) {
            text += '\n' + '-'.repeat(50) + '\n\n';
        }
    });
    return text;
}
// ============================================================================
// Main Export Function
// ============================================================================
export async function exportConversation(messages, options) {
    let content;
    let mimeType;
    switch (options.format) {
        case 'json':
            content = exportToJSON(messages, options);
            mimeType = 'application/json';
            break;
        case 'markdown':
            content = exportToMarkdown(messages, options);
            mimeType = 'text/markdown';
            break;
        case 'html':
            content = exportToHTML(messages, options);
            mimeType = 'text/html';
            break;
        case 'txt':
            content = exportToText(messages, options);
            mimeType = 'text/plain';
            break;
        case 'pdf':
            // PDF generation would require a library like jsPDF or puppeteer
            // For now, export as HTML and let user print to PDF
            content = exportToHTML(messages, options);
            mimeType = 'text/html';
            console.warn('PDF export: Please use browser "Print to PDF" feature');
            break;
        default:
            throw new Error(`Unsupported export format: ${options.format}`);
    }
    return new Blob([content], { type: mimeType });
}
// ============================================================================
// Download Helper
// ============================================================================
export async function downloadConversation(messages, options) {
    const blob = await exportConversation(messages, options);
    const extensions = {
        json: '.json',
        markdown: '.md',
        html: '.html',
        pdf: '.html', // User will convert to PDF
        txt: '.txt',
    };
    const filename = (options.filename || 'conversation') + extensions[options.format];
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// ============================================================================
// Batch Export
// ============================================================================
export async function exportMultipleConversations(conversations, options) {
    // Dynamic import for optional dependency
    // Note: jszip must be installed separately: npm install jszip
    try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        for (const conv of conversations) {
            const filename = conv.title || conv.id;
            const blob = await exportConversation(conv.messages, options);
            const content = await blob.text();
            zip.file(`${filename}.${options.format}`, content);
        }
        return await zip.generateAsync({ type: 'blob' });
    }
    catch (_error) {
        throw new Error('jszip is required for batch exports. Install it with: npm install jszip');
    }
}
//# sourceMappingURL=export-utils.js.map