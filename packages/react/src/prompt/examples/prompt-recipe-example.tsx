/**
 * Example: Using Prompt Recipes
 * 
 * Demonstrates how to use prompt recipes with variables.
 */

import React, { useState } from 'react'
import {
  createPromptRecipe,
  createQARecipe,
  createCodeAssistantRecipe,
  usePromptRecipe,
  estimatePromptTokens,
} from '../core'

/**
 * Basic recipe usage
 */
export function BasicRecipeExample() {
  const [name, setName] = useState('Clarity')
  const [message, setMessage] = useState('')

  const recipe = createPromptRecipe({
    id: 'chatbot',
    system: 'You are a helpful assistant named {{name}}.',
    user: '{{message}}',
    variables: [
      { name: 'name', required: true },
      { name: 'message', required: true },
    ],
  })

  const handleSubmit = () => {
    const prompt = recipe.build({ name, message })
    const tokens = estimatePromptTokens(prompt, { model: 'gpt-4' })
    
    console.log('Prompt:', prompt)
    console.log('Tokens:', tokens)
    console.log('Messages:', prompt.messages)
    
    // Send prompt.messages to your API
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Basic Recipe Example</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Assistant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            rows={4}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}

/**
 * Using pre-built recipes
 */
export function PreBuiltRecipeExample() {
  const [recipeType, setRecipeType] = useState<'qa' | 'code'>('qa')
  const [context, setContext] = useState('')
  const [question, setQuestion] = useState('')

  const qaRecipe = createQARecipe()
  const codeRecipe = createCodeAssistantRecipe()

  const recipe = recipeType === 'qa' ? qaRecipe : codeRecipe

  const { buildPrompt } = usePromptRecipe({
    recipe,
    initialVariables: recipeType === 'qa' ? { context, question } : { request: question },
  })

  const handleSubmit = () => {
    const prompt = buildPrompt(
      recipeType === 'qa'
        ? { context, question }
        : { request: question }
    )
    
    const tokens = estimatePromptTokens(prompt, { model: 'gpt-4' })
    
    console.log('Prompt:', prompt)
    console.log('Tokens:', tokens)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pre-built Recipe Example</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Recipe Type</label>
        <select
          value={recipeType}
          onChange={(e) => setRecipeType(e.target.value as 'qa' | 'code')}
          className="border rounded px-3 py-2"
        >
          <option value="qa">Q&A Assistant</option>
          <option value="code">Code Assistant</option>
        </select>
      </div>

      {recipeType === 'qa' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              rows={4}
              placeholder="Enter context here..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Ask a question..."
            />
          </div>
        </div>
      )}

      {recipeType === 'code' && (
        <div>
          <label className="block text-sm font-medium mb-1">Coding Request</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            rows={4}
            placeholder="Describe what you need help with..."
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Prompt
      </button>
    </div>
  )
}

/**
 * Composing multiple recipes
 */
export function ComposedRecipeExample() {
  const { composeRecipes } = require('../core/dsl')
  const chatbotRecipe = createPromptRecipe({
    id: 'base',
    system: 'You are a helpful assistant.',
  })

  const qaRecipe = createQARecipe()

  const composed = composeRecipes([chatbotRecipe, qaRecipe])

  const handleSubmit = () => {
    const prompt = composed.build({
      context: 'React is a JavaScript library...',
      question: 'What is React?',
    })

    console.log('Composed prompt:', prompt)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Composed Recipe Example</h2>
      <p className="text-gray-600 mb-4">
        This example shows how to compose multiple recipes together.
      </p>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Composed Prompt
      </button>
    </div>
  )
}
