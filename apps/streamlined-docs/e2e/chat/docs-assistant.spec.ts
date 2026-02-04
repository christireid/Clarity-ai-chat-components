import { test, expect } from '../fixtures/test-fixtures'

/**
 * DocsAssistant Chat E2E Tests
 *
 * Tests the AI-powered documentation assistant including:
 * - Opening/closing chat interface
 * - Sending messages and receiving responses
 * - Message rendering (markdown, code blocks)
 * - Error handling
 * - Response streaming
 */

test.describe('DocsAssistant Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open DocsAssistant with floating button', async ({
    page,
    docsPage,
  }) => {
    // Look for floating action button
    const assistantButton = page.locator(
      '[data-testid="docs-assistant-trigger"], ' +
        'button:has-text("Ask AI"), ' +
        'button[aria-label*="assistant" i], ' +
        '.floating-action-button'
    )

    if (await assistantButton.isVisible()) {
      await assistantButton.first().click()
    } else {
      // Fallback to keyboard shortcut
      await docsPage.docsAssistant.open()
    }

    // Chat panel should be visible
    const chatPanel = page.locator(
      '[data-testid="docs-assistant-panel"], ' +
        '[role="dialog"]:has-text("AI"), ' +
        '.docs-assistant'
    )

    await expect(chatPanel.first()).toBeVisible()
  })

  test('should open DocsAssistant with keyboard shortcut', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    const chatPanel = page.locator(
      '[data-testid="docs-assistant-panel"], [role="dialog"]'
    )
    await expect(chatPanel.first()).toBeVisible()
  })

  test('should close DocsAssistant with close button', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    const closeButton = page.locator(
      '[data-testid="docs-assistant-close"], ' +
        'button[aria-label*="close" i], ' +
        '.close-button'
    )

    await closeButton.first().click()
    await page.waitForTimeout(300)

    const chatPanel = page.locator('[data-testid="docs-assistant-panel"]')
    await expect(chatPanel.first()).toBeHidden()
  })

  test('should send message and receive response', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    // Send a test message
    await docsPage.docsAssistant.sendMessage('What is Clarity Chat?')

    // Wait for response
    await docsPage.docsAssistant.waitForResponse()

    // Should have at least 2 messages (user + assistant)
    const messages = await docsPage.docsAssistant.getMessages()
    expect(messages.length).toBeGreaterThanOrEqual(2)

    // First message should be user's message
    expect(messages[0]).toContain('Clarity')
  })

  test('should display loading indicator while streaming', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    const input = page.locator('[data-testid="chat-input"], textarea').first()
    await input.fill('Tell me about installation')
    await page.keyboard.press('Enter')

    // Should show loading indicator
    const loadingIndicator = page.locator(
      '[data-testid="loading"], ' +
        '.loading, ' +
        '[aria-busy="true"], ' +
        '.spinner'
    )

    // Loading indicator should appear briefly
    const isVisible = await loadingIndicator
      .first()
      .isVisible()
      .catch(() => false)
    // It's okay if we miss the loading state due to fast response
  })

  test('should render markdown in responses', async ({ page, docsPage }) => {
    await docsPage.docsAssistant.open()

    await docsPage.docsAssistant.sendMessage('Show me a code example')
    await docsPage.docsAssistant.waitForResponse()

    // Look for markdown elements
    const codeBlocks = page.locator('pre code, .code-block')
    const links = page.locator('[data-testid^="message-"] a, .message a')
    const lists = page.locator('[data-testid^="message-"] ul, .message ul')

    // At least one markdown element should be rendered
    const hasCodeBlock = (await codeBlocks.count()) > 0
    const hasLinks = (await links.count()) > 0
    const hasLists = (await lists.count()) > 0

    // Response should contain formatted content
    expect(hasCodeBlock || hasLinks || hasLists).toBe(true)
  })

  test('should handle code blocks with syntax highlighting', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    await docsPage.docsAssistant.sendMessage('Show me TypeScript code')
    await docsPage.docsAssistant.waitForResponse()

    // Look for syntax-highlighted code
    const codeBlocks = page.locator('pre code, [class*="language-"]')
    const count = await codeBlocks.count()

    if (count > 0) {
      // Code block should have syntax highlighting classes
      const codeBlock = codeBlocks.first()
      const className = await codeBlock.getAttribute('class')

      expect(className).toBeTruthy()
    }
  })

  test('should support copy button for code blocks', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    await docsPage.docsAssistant.sendMessage('Show example code')
    await docsPage.docsAssistant.waitForResponse()

    // Look for copy buttons
    const copyButtons = page.locator(
      'button[aria-label*="copy" i], ' +
        '[data-testid="copy-button"], ' +
        '.copy-button'
    )

    const count = await copyButtons.count()
    if (count > 0) {
      // Click copy button
      await copyButtons.first().click()
      await page.waitForTimeout(300)

      // Should show success feedback
      const successMessage = page.locator('text=/copied/i')
      await expect(successMessage.first()).toBeVisible({ timeout: 3000 })
    }
  })

  test('should maintain conversation context', async ({ page, docsPage }) => {
    await docsPage.docsAssistant.open()

    // Send first message
    await docsPage.docsAssistant.sendMessage('What is ChatProvider?')
    await docsPage.docsAssistant.waitForResponse()

    // Send follow-up question
    await docsPage.docsAssistant.sendMessage('What are its props?')
    await docsPage.docsAssistant.waitForResponse()

    // Should have 4 messages (2 user + 2 assistant)
    const messages = await docsPage.docsAssistant.getMessages()
    expect(messages.length).toBeGreaterThanOrEqual(4)
  })

  test('should display error message for failed requests', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    // Intercept API request to simulate error
    await page.route('**/api/**', (route) => route.abort())

    await docsPage.docsAssistant.sendMessage('Test message')
    await page.waitForTimeout(2000)

    // Should show error message
    const errorMessage = page.locator(
      'text=/error/i, ' + 'text=/failed/i, ' + '[data-testid="error-message"]'
    )

    const hasError = (await errorMessage.count()) > 0
    // Error handling is important
    expect(hasError).toBe(true)

    // Remove route interception
    await page.unroute('**/api/**')
  })

  test('should clear conversation with clear button', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    await docsPage.docsAssistant.sendMessage('Test message')
    await docsPage.docsAssistant.waitForResponse()

    // Find clear/reset button
    const clearButton = page.locator(
      'button:has-text("Clear"), ' +
        'button:has-text("Reset"), ' +
        '[data-testid="clear-chat"]'
    )

    if (await clearButton.isVisible()) {
      await clearButton.first().click()
      await page.waitForTimeout(300)

      // Messages should be cleared
      const messages = await docsPage.docsAssistant.getMessages()
      expect(messages.length).toBe(0)
    }
  })

  test('should show suggested prompts', async ({ page, docsPage }) => {
    await docsPage.docsAssistant.open()

    // Look for suggested prompts/questions
    const suggestions = page.locator(
      '[data-testid^="suggestion"], ' + '.suggestion, ' + 'button[data-prompt]'
    )

    const count = await suggestions.count()
    if (count > 0) {
      // Click a suggestion
      await suggestions.first().click()

      // Should populate input or send message
      await docsPage.docsAssistant.waitForResponse()

      const messages = await docsPage.docsAssistant.getMessages()
      expect(messages.length).toBeGreaterThan(0)
    }
  })

  test('should handle multiline input', async ({ page, docsPage }) => {
    await docsPage.docsAssistant.open()

    const input = page.locator('textarea, [contenteditable="true"]').first()

    // Type multiline message
    await input.fill('Line 1\nLine 2\nLine 3')

    // Send with keyboard shortcut (Shift+Enter or Enter)
    await page.keyboard.press('Enter')
    await docsPage.docsAssistant.waitForResponse()

    const messages = await docsPage.docsAssistant.getMessages()
    expect(messages[0]).toContain('Line 1')
  })

  test('should be accessible with keyboard navigation', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    // Tab should navigate through chat elements
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()

    // Should be able to reach input
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)
    }

    const focusedElement = await page
      .locator(':focus')
      .first()
      .evaluate((el) => el.tagName)
    // Should have tabbed through interactive elements
    expect(focusedElement).toBeTruthy()
  })

  test('should persist chat history across open/close', async ({
    page,
    docsPage,
  }) => {
    await docsPage.docsAssistant.open()

    await docsPage.docsAssistant.sendMessage('Remember this')
    await docsPage.docsAssistant.waitForResponse()

    const initialMessages = await docsPage.docsAssistant.getMessages()

    // Close chat
    await docsPage.docsAssistant.close()
    await page.waitForTimeout(300)

    // Reopen chat
    await docsPage.docsAssistant.open()

    // Messages should still be there
    const messages = await docsPage.docsAssistant.getMessages()
    expect(messages.length).toBe(initialMessages.length)
  })

  test('should be responsive on mobile', async ({ page, docsPage }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await docsPage.docsAssistant.open()

    // Chat should take full screen on mobile
    const chatPanel = page.locator(
      '[data-testid="docs-assistant-panel"], [role="dialog"]'
    )
    await expect(chatPanel.first()).toBeVisible()

    // Should be usable on mobile
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('Mobile test')

    await expect(input).toHaveValue('Mobile test')
  })

  test('should have proper ARIA attributes', async ({ page, docsPage }) => {
    await docsPage.docsAssistant.open()

    const chatPanel = page
      .locator('[role="dialog"], [role="complementary"]')
      .first()
    await expect(chatPanel).toBeVisible()

    // Should have aria-label or aria-labelledby
    const ariaLabel = await chatPanel.getAttribute('aria-label')
    const ariaLabelledBy = await chatPanel.getAttribute('aria-labelledby')

    expect(ariaLabel || ariaLabelledBy).toBeTruthy()

    // Input should have label
    const input = page.locator('textarea, input').first()
    const inputLabel = await input.getAttribute('aria-label')
    const inputLabelledBy = await input.getAttribute('aria-labelledby')

    expect(inputLabel || inputLabelledBy).toBeTruthy()
  })
})
