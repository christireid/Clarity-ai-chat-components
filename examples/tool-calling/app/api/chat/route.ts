import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { TOOLS, executeTool } from '@/lib/tools'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  tool_call_id?: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }>
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-4-turbo-preview' } = await request.json()

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initial response with potential tool calls
          const completion = await openai.chat.completions.create({
            model,
            messages,
            tools: TOOLS,
            stream: true,
          })

          let currentToolCalls: Array<{
            id: string
            type: 'function'
            function: { name: string; arguments: string }
          }> = []
          let currentContent = ''
          let finishReason: string | null = null

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta

            // Handle content streaming
            if (delta?.content) {
              currentContent += delta.content
              const data = JSON.stringify({
                type: 'text-delta',
                content: delta.content,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Handle tool calls
            if (delta?.tool_calls) {
              for (const toolCall of delta.tool_calls) {
                if (toolCall.index !== undefined) {
                  // Initialize or update tool call
                  if (!currentToolCalls[toolCall.index]) {
                    currentToolCalls[toolCall.index] = {
                      id: toolCall.id || '',
                      type: 'function',
                      function: { name: '', arguments: '' },
                    }
                  }
                  if (toolCall.id) {
                    currentToolCalls[toolCall.index].id = toolCall.id
                  }
                  if (toolCall.function?.name) {
                    currentToolCalls[toolCall.index].function.name =
                      toolCall.function.name
                  }
                  if (toolCall.function?.arguments) {
                    currentToolCalls[toolCall.index].function.arguments +=
                      toolCall.function.arguments
                  }
                }
              }
            }

            if (chunk.choices[0]?.finish_reason) {
              finishReason = chunk.choices[0].finish_reason
            }
          }

          // If tool calls were made, execute them
          if (finishReason === 'tool_calls' && currentToolCalls.length > 0) {
            // Send tool calls to client
            const toolCallsData = JSON.stringify({
              type: 'tool_calls',
              tool_calls: currentToolCalls,
            })
            controller.enqueue(encoder.encode(`data: ${toolCallsData}\n\n`))

            // Execute each tool
            const toolResults: ChatMessage[] = []
            for (const toolCall of currentToolCalls) {
              const { name, arguments: argsStr } = toolCall.function
              let args = {}
              try {
                args = JSON.parse(argsStr)
              } catch {
                args = {}
              }

              // Send tool execution start
              const execStartData = JSON.stringify({
                type: 'tool_execution_start',
                tool_call_id: toolCall.id,
                name,
                args,
              })
              controller.enqueue(encoder.encode(`data: ${execStartData}\n\n`))

              // Execute tool
              const result = await executeTool(name, args)

              // Send tool result
              const execResultData = JSON.stringify({
                type: 'tool_execution_result',
                tool_call_id: toolCall.id,
                name,
                result,
              })
              controller.enqueue(encoder.encode(`data: ${execResultData}\n\n`))

              toolResults.push({
                role: 'tool',
                content: JSON.stringify(result.data),
                tool_call_id: toolCall.id,
              })
            }

            // Make follow-up call with tool results
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content: currentContent,
              tool_calls: currentToolCalls,
            }

            const followUpCompletion = await openai.chat.completions.create({
              model,
              messages: [...messages, assistantMessage, ...toolResults],
              stream: true,
            })

            // Stream follow-up response
            for await (const chunk of followUpCompletion) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                const data = JSON.stringify({
                  type: 'text-delta',
                  content,
                })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            }
          }

          const finishData = JSON.stringify({ type: 'finish' })
          controller.enqueue(encoder.encode(`data: ${finishData}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Stream error'
          const errorData = JSON.stringify({ type: 'error', message: errorMessage })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
