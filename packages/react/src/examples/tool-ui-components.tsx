/**
 * Tool UI Component Examples
 * 
 * Reusable tool result components that can be registered in the tool UI registry.
 * These components demonstrate best practices for rendering different types of tool results.
 */

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@clarity-chat/primitives'
import type { ToolComponentProps } from '../agents/tool-ui-registry'

/**
 * Weather Tool Result Component
 * 
 * Renders weather information in a visually appealing card.
 */
export function WeatherToolResult({ 
  data 
}: ToolComponentProps<{
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  feelsLike?: number
  icon?: string
}>) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {data.icon || '🌤️'} Weather in {data.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-blue-600">
            {data.temperature}°F
          </div>
          {data.feelsLike && (
            <div className="text-sm text-muted-foreground">
              Feels like {data.feelsLike}°F
            </div>
          )}
        </div>
        <div className="text-sm font-medium text-foreground">
          {data.condition}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>💧 Humidity: {data.humidity}%</span>
          <span>💨 Wind: {data.windSpeed} mph</span>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Search Tool Result Component
 * 
 * Renders search results with relevance scores.
 */
export function SearchToolResult({ 
  data 
}: ToolComponentProps<{
  query: string
  results: Array<{
    title: string
    snippet: string
    url: string
    relevance?: number
  }>
  totalResults?: number
}>) {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          🔍 Search Results
        </CardTitle>
        {data.totalResults !== undefined && (
          <div className="text-xs text-muted-foreground">
            Found {data.totalResults} results for "{data.query}"
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {data.results.map((result, index) => (
          <div 
            key={index} 
            className="space-y-1 border-t pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start justify-between gap-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm text-primary hover:underline"
              >
                {result.title}
              </a>
              {result.relevance !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(result.relevance * 100)}% match
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {result.snippet}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * Calculator Tool Result Component
 * 
 * Renders calculation results with the expression.
 */
export function CalculatorToolResult({ 
  data 
}: ToolComponentProps<{
  expression: string
  result: number
  steps?: string[]
}>) {
  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          🧮 Calculation Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground font-mono">
          {data.expression}
        </div>
        <div className="text-3xl font-bold text-purple-600">
          = {data.result}
        </div>
        {data.steps && data.steps.length > 0 && (
          <div className="space-y-1 pt-2 border-t">
            <div className="text-xs font-medium text-muted-foreground">Steps:</div>
            {data.steps.map((step, idx) => (
              <div key={idx} className="text-xs text-muted-foreground font-mono">
                {step}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Database Query Tool Result Component
 * 
 * Renders database query results in a table format.
 */
export function DatabaseQueryToolResult({ 
  data 
}: ToolComponentProps<{
  query: string
  rows: Record<string, any>[]
  rowCount: number
  columns?: string[]
}>) {
  const columns = data.columns || (data.rows.length > 0 ? Object.keys(data.rows[0]) : [])
  
  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          🗄️ Database Query Results
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {data.rowCount} row{data.rowCount !== 1 ? 's' : ''} returned
        </div>
      </CardHeader>
      <CardContent>
        {data.rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No rows returned</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  {columns.map((col) => (
                    <th 
                      key={col} 
                      className="text-left p-2 font-medium text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    {columns.map((col) => (
                      <td key={col} className="p-2 text-muted-foreground">
                        {String(row[col] ?? 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * API Call Tool Result Component
 * 
 * Renders API response with status code and data.
 */
export function APICallToolResult({ 
  data 
}: ToolComponentProps<{
  url: string
  method: string
  status: number
  statusText: string
  data: any
  headers?: Record<string, string>
}>) {
  const isSuccess = data.status >= 200 && data.status < 300
  
  return (
    <Card className={`border-${isSuccess ? 'green' : 'red'}-200 bg-${isSuccess ? 'green' : 'red'}-50/50`}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          🌐 API Response
        </CardTitle>
        <div className="text-xs text-muted-foreground font-mono">
          {data.method} {data.url}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={isSuccess ? 'success' : 'destructive'}>
            {data.status} {data.statusText}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Response:</div>
          <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
            <code>{JSON.stringify(data.data, null, 2)}</code>
          </pre>
        </div>
        {data.headers && Object.keys(data.headers).length > 0 && (
          <div className="space-y-1 pt-2 border-t">
            <div className="text-xs font-medium text-muted-foreground">Headers:</div>
            <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
              <code>{JSON.stringify(data.headers, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Code Execution Tool Result Component
 * 
 * Renders code execution results with output and errors.
 */
export function CodeExecutionToolResult({ 
  data 
}: ToolComponentProps<{
  code: string
  language: string
  output?: string
  error?: string
  executionTime?: number
}>) {
  return (
    <Card className={`border-${data.error ? 'red' : 'blue'}-200 bg-${data.error ? 'red' : 'blue'}-50/50`}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          💻 Code Execution
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {data.language}
          </Badge>
          {data.executionTime !== undefined && (
            <div className="text-xs text-muted-foreground">
              {data.executionTime}ms
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Code:</div>
          <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
            <code>{data.code}</code>
          </pre>
        </div>
        {data.error ? (
          <div className="space-y-1">
            <div className="text-xs font-medium text-destructive">Error:</div>
            <pre className="text-xs bg-destructive/10 p-2 rounded overflow-x-auto text-destructive">
              <code>{data.error}</code>
            </pre>
          </div>
        ) : (
          data.output && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Output:</div>
              <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                <code>{data.output}</code>
              </pre>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Example registry with all tool components
 */
export const exampleToolRegistry = {
  weather: WeatherToolResult,
  search: SearchToolResult,
  calculator: CalculatorToolResult,
  database_query: DatabaseQueryToolResult,
  api_call: APICallToolResult,
  code_execution: CodeExecutionToolResult,
}
