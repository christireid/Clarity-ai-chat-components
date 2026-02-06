import { NextRequest, NextResponse } from 'next/server'

// Map demo model IDs to actual Anthropic model IDs
const MODEL_MAP: Record<string, string> = {
  'claude-3.5-sonnet': 'claude-sonnet-4-5-20250929',
  'claude-3-opus': 'claude-opus-4-6',
  'claude-3-haiku': 'claude-haiku-4-5-20251001',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, systemPrompt, model, temperature, maxTokens, apiKey } =
      body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Enter your key in the bar above.' },
        { status: 401 }
      )
    }

    // Map model ID and filter messages for Anthropic format
    const resolvedModel =
      MODEL_MAP[model] || model || 'claude-sonnet-4-5-20250929'
    const anthropicMessages = (messages || [])
      .filter(
        (m: { role: string }) => m.role === 'user' || m.role === 'assistant'
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : String(m.content),
      }))

    if (anthropicMessages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400 }
      )
    }

    // Build Anthropic API request
    const anthropicBody: Record<string, unknown> = {
      model: resolvedModel,
      max_tokens: maxTokens || 4096,
      stream: true,
      messages: anthropicMessages,
    }

    if (systemPrompt) {
      anthropicBody.system = systemPrompt
    }

    if (temperature !== undefined) {
      anthropicBody.temperature = temperature
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Anthropic API error (${response.status})`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorMessage
      } catch {
        // Use default error message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // Transform Anthropic SSE into useClarityChat-compatible SSE format.
    // useChatEnhanced expects: data: {"content":"text chunk"}\n\n
    // Terminated by: data: [DONE]\n\n
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop()!

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const dataStr = line.slice(6).trim()
              if (!dataStr || dataStr === '[DONE]') continue

              try {
                const data = JSON.parse(dataStr)

                if (
                  data.type === 'content_block_delta' &&
                  data.delta?.type === 'text_delta' &&
                  data.delta.text
                ) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ content: data.delta.text })}\n\n`
                    )
                  )
                }
                // thinking_delta, usage, and other Anthropic events are not
                // supported by the base SSE parser in useChatEnhanced, so we
                // skip them. The hook's isLoading state naturally provides a
                // "thinking" indicator during the pre-response delay.
              } catch {
                // Skip unparseable lines
              }
            }
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Stream error'
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: `\n\n---\n**Error:** ${message}` })}\n\n`
            )
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
