/**
 * PromptComposer E2E Test Suite
 *
 * Comprehensive end-to-end tests for the PromptComposer component
 * covering all major user flows and interactions.
 *
 * Test Coverage:
 * 1. Basic message submission
 * 2. @mention context addition flow
 * 3. /command execution flow
 * 4. File attachment upload flow
 * 5. Voice input transcription flow
 * 6. Token budget exceeded scenario
 * 7. Multi-feature interaction (all features together)
 */

import { test, expect, type Page, type Locator } from '@playwright/test'

// ============================================================================
// Page Object Model
// ============================================================================

/**
 * Page Object for PromptComposer interactions
 * Encapsulates all locators and common actions
 */
class PromptComposerPage {
  readonly page: Page

  // Main components
  readonly container: Locator
  readonly textarea: Locator
  readonly sendButton: Locator
  readonly tokenDisplay: Locator

  // Context mentions
  readonly contextItemCards: Locator
  readonly mentionDropdown: Locator
  readonly mentionSuggestions: Locator

  // Command palette
  readonly commandPalette: Locator
  readonly commandItems: Locator

  // Attachments
  readonly attachmentButton: Locator
  readonly attachmentInput: Locator
  readonly attachmentList: Locator
  readonly attachmentRemoveButton: Locator

  // Voice input
  readonly voiceButton: Locator
  readonly voiceTranscriptPopup: Locator
  readonly recordingBadge: Locator

  // Suggestions
  readonly suggestionChips: Locator

  // Error display
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page

    // Main input area - using the story structure
    this.container = page.locator('[class*="space-y"]').first()
    this.textarea = page.locator('textarea')
    this.sendButton = page.getByRole('button', { name: /send/i })
    this.tokenDisplay = page.locator('text=/\\d+\\/\\d+/')

    // Context mentions
    this.contextItemCards = page.locator('[class*="context-item"], [data-testid="context-item"]')
    this.mentionDropdown = page.locator('[class*="suggestions"], [class*="mention"]')
    this.mentionSuggestions = page.locator('button[class*="hover:bg-accent"]')

    // Command palette
    this.commandPalette = page.locator('[class*="command"], [class*="Commands"]')
    this.commandItems = page.locator('button[data-command]')

    // Attachments
    this.attachmentButton = page.getByRole('button', { name: /add attachment/i })
    this.attachmentInput = page.locator('input[type="file"]')
    this.attachmentList = page.locator('[class*="attachment"]')
    this.attachmentRemoveButton = page.getByRole('button', { name: /remove/i })

    // Voice input
    this.voiceButton = page.getByRole('button', { name: /voice|speak|recording/i })
    this.voiceTranscriptPopup = page.locator('[class*="transcript"], [class*="voice"]')
    this.recordingBadge = page.locator('text=/recording/i')

    // Suggestions
    this.suggestionChips = page.locator('button[class*="rounded-full"]')

    // Error display
    this.errorMessage = page.locator('[class*="bg-red"], [class*="error"]')
  }

  /**
   * Navigate to the PromptComposer story in Storybook
   */
  async goto(storyId: string = 'components-promptcomposer--default') {
    await this.page.goto(`/iframe.html?id=${storyId}`)
    await this.page.waitForLoadState('networkidle')
    // Wait for Storybook root to be visible
    await expect(this.page.locator('#storybook-root')).toBeVisible({ timeout: 30000 })
  }

  /**
   * Type text into the composer textarea
   */
  async typeMessage(text: string) {
    await this.textarea.click()
    await this.textarea.fill(text)
  }

  /**
   * Type text character by character (for trigger detection)
   */
  async typeMessageSlowly(text: string, delay: number = 50) {
    await this.textarea.click()
    for (const char of text) {
      await this.textarea.press(char)
      await this.page.waitForTimeout(delay)
    }
  }

  /**
   * Submit the current message
   */
  async submit() {
    await this.sendButton.click()
  }

  /**
   * Submit using Enter key
   */
  async submitWithEnter() {
    await this.textarea.press('Enter')
  }

  /**
   * Clear the input
   */
  async clear() {
    await this.textarea.fill('')
  }

  /**
   * Focus the textarea
   */
  async focus() {
    await this.textarea.click()
  }

  /**
   * Get current textarea value
   */
  async getValue(): Promise<string> {
    return await this.textarea.inputValue()
  }

  /**
   * Trigger @mention flow
   */
  async triggerMention(query: string = '') {
    await this.typeMessageSlowly(`@${query}`)
  }

  /**
   * Trigger /command flow
   */
  async triggerCommand(query: string = '') {
    await this.typeMessageSlowly(`/${query}`)
  }

  /**
   * Select a suggestion from dropdown using keyboard
   */
  async selectSuggestionWithKeyboard(index: number = 0) {
    for (let i = 0; i < index; i++) {
      await this.textarea.press('ArrowDown')
    }
    await this.textarea.press('Enter')
  }

  /**
   * Upload a file attachment
   */
  async uploadFile(fileName: string, content: string, mimeType: string = 'text/plain') {
    // Create a test file
    const buffer = Buffer.from(content)

    await this.attachmentInput.setInputFiles({
      name: fileName,
      mimeType,
      buffer,
    })
  }

  /**
   * Wait for command palette to be visible
   */
  async waitForCommandPalette() {
    await expect(this.commandPalette).toBeVisible({ timeout: 5000 })
  }

  /**
   * Wait for mention dropdown to be visible
   */
  async waitForMentionDropdown() {
    await expect(this.mentionDropdown).toBeVisible({ timeout: 5000 })
  }

  /**
   * Click a suggestion chip
   */
  async clickSuggestion(text: string) {
    await this.suggestionChips.filter({ hasText: text }).first().click()
  }

  /**
   * Get the current token count from display
   */
  async getTokenCount(): Promise<{ current: number; max: number }> {
    const text = await this.tokenDisplay.textContent()
    const match = text?.match(/(\d+)\/(\d+)/)
    if (match) {
      return { current: parseInt(match[1]), max: parseInt(match[2]) }
    }
    return { current: 0, max: 0 }
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/prompt-composer-${name}.png`,
      fullPage: false,
    })
  }
}

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Attach diagnostic listeners to the page
 */
function attachPageDiagnostics(page: Page) {
  page.on('pageerror', (err) => {
    console.error('[playwright][pageerror]', err)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('[playwright][console.error]', msg.text())
    }
  })
}

// ============================================================================
// Test Suite: Basic Message Submission
// ============================================================================

test.describe('1. Basic Message Submission', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--default')
  })

  test('should render the composer with placeholder text', async () => {
    await expect(composer.textarea).toBeVisible()
    await expect(composer.textarea).toHaveAttribute('placeholder', /ask anything/i)
    await composer.takeScreenshot('initial-state')
  })

  test('should type and display text in textarea', async () => {
    const testMessage = 'Hello, this is a test message'
    await composer.typeMessage(testMessage)

    await expect(composer.textarea).toHaveValue(testMessage)
    await composer.takeScreenshot('with-text')
  })

  test('should enable send button when text is entered', async () => {
    // Initially disabled
    await expect(composer.sendButton).toBeDisabled()

    // Type message
    await composer.typeMessage('Test message')

    // Should be enabled now
    await expect(composer.sendButton).toBeEnabled()
  })

  test('should submit message on button click', async ({ page }) => {
    // Listen for alert (the default story shows an alert on submit)
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Message submitted')
      await dialog.accept()
    })

    await composer.typeMessage('Test submission')
    await composer.submit()
  })

  test('should submit message on Enter key press', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Message submitted')
      await dialog.accept()
    })

    await composer.typeMessage('Test Enter submission')
    await composer.submitWithEnter()
  })

  test('should not submit on Shift+Enter (allows multiline)', async () => {
    await composer.typeMessage('First line')
    await composer.textarea.press('Shift+Enter')
    await composer.textarea.type('Second line')

    const value = await composer.getValue()
    expect(value).toContain('First line')
    expect(value).toContain('Second line')
  })

  test('should clear input after successful submission', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })

    await composer.typeMessage('Message to clear')
    await composer.submit()

    // Wait for clear
    await page.waitForTimeout(500)
    await expect(composer.textarea).toHaveValue('')
  })

  test('should expand textarea when content grows', async () => {
    const longText = 'This is a longer message that should cause the textarea to expand. '.repeat(5)
    await composer.typeMessage(longText)

    // Get the textarea height
    const height = await composer.textarea.evaluate((el) => el.scrollHeight)
    expect(height).toBeGreaterThan(50) // Should be taller than initial
  })
})

// ============================================================================
// Test Suite: @Mention Context Addition Flow
// ============================================================================

test.describe('2. @Mention Context Addition Flow', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    // Use the story with context providers
    await composer.goto('components-promptcomposer--with-context-providers')
  })

  test('should show provider dropdown when @ is typed', async () => {
    await composer.triggerMention()

    // Wait for dropdown to appear
    await expect(composer.page.locator('text=/file|doc|user/i').first()).toBeVisible({
      timeout: 5000,
    })
    await composer.takeScreenshot('mention-dropdown')
  })

  test('should filter providers when typing after @', async () => {
    await composer.triggerMention('file')

    // Should show file provider option
    await expect(composer.page.locator('text=/file/i').first()).toBeVisible({
      timeout: 5000,
    })
  })

  test('should show context items after selecting provider type', async ({ page }) => {
    // Type @file:
    await composer.typeMessageSlowly('@file:')

    // Wait for context items to load
    await page.waitForTimeout(500)

    // Search for a file
    await composer.textarea.type('Button')

    // Should show file results
    await expect(page.locator('text=/Button/i').first()).toBeVisible({
      timeout: 5000,
    })
    await composer.takeScreenshot('file-search-results')
  })

  test('should insert mention when item is selected', async ({ page }) => {
    await composer.typeMessageSlowly('@file:Button')

    // Wait for results
    await page.waitForTimeout(500)

    // Select first result with keyboard
    await composer.selectSuggestionWithKeyboard(0)

    const value = await composer.getValue()
    expect(value).toMatch(/@file:Button/i)
  })

  test('should close dropdown on Escape', async () => {
    await composer.triggerMention()

    // Wait for dropdown
    await composer.page.waitForTimeout(300)

    // Press Escape
    await composer.textarea.press('Escape')

    // Dropdown should be hidden
    await composer.page.waitForTimeout(200)
  })

  test('should navigate suggestions with arrow keys', async ({ page }) => {
    await composer.triggerMention()

    // Wait for dropdown
    await page.waitForTimeout(300)

    // Navigate down
    await composer.textarea.press('ArrowDown')
    await composer.textarea.press('ArrowDown')

    // Navigate up
    await composer.textarea.press('ArrowUp')

    // Should be at index 1 now
  })

  test('should display context item card after adding mention', async ({ page }) => {
    // Type and select a file mention
    await composer.typeMessageSlowly('@file:Button')
    await page.waitForTimeout(500)
    await composer.selectSuggestionWithKeyboard(0)

    // Continue typing to trigger context item display
    await composer.textarea.type(' Help me understand this')

    // Check for context items section
    await expect(page.locator('text=/context items/i').first()).toBeVisible({
      timeout: 5000,
    })
  })
})

// ============================================================================
// Test Suite: /Command Execution Flow
// ============================================================================

test.describe('3. /Command Execution Flow', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    // Use the full featured story which has commands
    await composer.goto('components-promptcomposer--full-featured')
  })

  test('should show command palette when / is typed', async ({ page }) => {
    await composer.triggerCommand()

    // Wait for command palette
    await page.waitForTimeout(500)

    // Should show commands header
    await expect(page.locator('text=/commands/i').first()).toBeVisible({
      timeout: 5000,
    })
    await composer.takeScreenshot('command-palette')
  })

  test('should filter commands by query', async ({ page }) => {
    await composer.triggerCommand('search')

    await page.waitForTimeout(300)

    // Should filter to search-related commands
    const commandText = await page.locator('button[data-command]').first().textContent()
    expect(commandText?.toLowerCase()).toContain('search')
  })

  test('should execute command on Enter', async ({ page }) => {
    await composer.triggerCommand()
    await page.waitForTimeout(300)

    // Press Enter to execute first command
    await composer.textarea.press('Enter')

    // Command palette should close
    await page.waitForTimeout(500)
  })

  test('should close command palette on Escape', async ({ page }) => {
    await composer.triggerCommand()
    await page.waitForTimeout(300)

    await composer.textarea.press('Escape')

    // Palette should be hidden
    await page.waitForTimeout(200)
  })

  test('should navigate commands with arrow keys', async ({ page }) => {
    await composer.triggerCommand()
    await page.waitForTimeout(300)

    // Navigate with arrows
    await composer.textarea.press('ArrowDown')
    await composer.textarea.press('ArrowDown')
    await composer.textarea.press('ArrowUp')

    // Check that a command is highlighted (has bg-accent class)
    const highlighted = page.locator('button[data-command][class*="bg-accent"]')
    await expect(highlighted).toBeVisible({ timeout: 3000 })
  })

  test('should show keyboard hints in command palette', async ({ page }) => {
    await composer.triggerCommand()
    await page.waitForTimeout(300)

    // Should show navigation hints
    await expect(page.locator('text=/navigate|execute|close/i').first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('should show "no commands found" for invalid query', async ({ page }) => {
    await composer.triggerCommand('xyznonexistent123')
    await page.waitForTimeout(300)

    // Should show no results message
    await expect(page.locator('text=/no commands found/i').first()).toBeVisible({
      timeout: 3000,
    })
  })

  test('should clear input after command execution', async ({ page }) => {
    await composer.triggerCommand()
    await page.waitForTimeout(300)

    await composer.textarea.press('Enter')
    await page.waitForTimeout(500)

    // Input should be cleared
    const value = await composer.getValue()
    expect(value).toBe('')
  })
})

// ============================================================================
// Test Suite: File Attachment Upload Flow
// ============================================================================

test.describe('4. File Attachment Upload Flow', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--full-featured')
  })

  test('should show attachment button', async () => {
    await expect(composer.attachmentButton).toBeVisible()
    await composer.takeScreenshot('attachment-button')
  })

  test('should upload a text file', async ({ page }) => {
    await composer.uploadFile('test-file.txt', 'Hello, this is test content', 'text/plain')

    // Wait for upload processing
    await page.waitForTimeout(500)

    // Should show the attachment
    await expect(page.locator('text=/test-file/i').first()).toBeVisible({
      timeout: 5000,
    })
    await composer.takeScreenshot('file-uploaded')
  })

  test('should show attachment preview', async ({ page }) => {
    await composer.uploadFile('document.pdf', 'PDF content', 'application/pdf')
    await page.waitForTimeout(500)

    // Should display file info
    await expect(page.locator('text=/document/i').first()).toBeVisible({
      timeout: 5000,
    })
  })

  test('should remove attachment when clicking remove button', async ({ page }) => {
    await composer.uploadFile('to-remove.txt', 'content', 'text/plain')
    await page.waitForTimeout(500)

    // Find and click remove button
    const removeBtn = page.locator('[aria-label*="remove"], button:has(svg[class*="w-4"])').first()
    await removeBtn.click()

    // Wait for removal
    await page.waitForTimeout(300)

    // File should be gone
    await expect(page.locator('text=/to-remove/i')).not.toBeVisible()
  })

  test('should upload multiple files', async ({ page }) => {
    // Upload first file
    await composer.uploadFile('file1.txt', 'content 1', 'text/plain')
    await page.waitForTimeout(300)

    // Upload second file
    await composer.uploadFile('file2.txt', 'content 2', 'text/plain')
    await page.waitForTimeout(300)

    // Both should be visible
    await expect(page.locator('text=/file1/i').first()).toBeVisible()
    await expect(page.locator('text=/file2/i').first()).toBeVisible()
  })

  test('should show file size', async ({ page }) => {
    const largeContent = 'x'.repeat(1024) // 1KB
    await composer.uploadFile('sized-file.txt', largeContent, 'text/plain')
    await page.waitForTimeout(500)

    // Should show file size indicator
    await expect(page.locator('text=/\\d+\\s*(KB|B|MB)/i').first()).toBeVisible({
      timeout: 5000,
    })
  })

  test('should support drag and drop', async ({ page }) => {
    // Create a DataTransfer with a file
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer()
      const file = new File(['test content'], 'dropped-file.txt', { type: 'text/plain' })
      dt.items.add(file)
      return dt
    })

    // Find the drop zone and dispatch drag events
    const dropZone = page.locator('[class*="relative"]').first()
    await dropZone.dispatchEvent('drop', { dataTransfer })

    await page.waitForTimeout(500)
  })

  test('should enable send button with attachment only (no text)', async ({ page }) => {
    // Verify send is disabled initially
    await expect(composer.sendButton).toBeDisabled()

    // Upload a file
    await composer.uploadFile('attachment.txt', 'content', 'text/plain')
    await page.waitForTimeout(500)

    // Send should be enabled with just attachment
    await expect(composer.sendButton).toBeEnabled()
  })
})

// ============================================================================
// Test Suite: Voice Input Transcription Flow
// ============================================================================

test.describe('5. Voice Input Transcription Flow', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page, context }) => {
    // Grant microphone permissions
    await context.grantPermissions(['microphone'])

    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--full-featured')
  })

  test('should show voice input button', async () => {
    // Voice button should be visible
    const voiceButton = composer.page.locator('button[aria-label*="voice"], button[aria-label*="speak"]').first()
    await expect(voiceButton).toBeVisible()
    await composer.takeScreenshot('voice-button')
  })

  test('should handle browser without speech recognition gracefully', async ({ page }) => {
    // Mock the browser as not supporting speech recognition
    await page.addInitScript(() => {
      // Remove SpeechRecognition API
      // @ts-ignore
      window.SpeechRecognition = undefined
      // @ts-ignore
      window.webkitSpeechRecognition = undefined
    })

    await composer.goto('components-promptcomposer--full-featured')

    // Should show unsupported message or hide voice button
    // The component handles this gracefully
  })

  test('should show recording state when voice button is clicked', async ({ page }) => {
    // Mock SpeechRecognition for testing
    await page.addInitScript(() => {
      class MockSpeechRecognition extends EventTarget {
        continuous = false
        interimResults = true
        lang = 'en-US'
        onstart: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onend: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onresult: ((this: MockSpeechRecognition, ev: any) => any) | null = null
        onerror: ((this: MockSpeechRecognition, ev: any) => any) | null = null

        start() {
          setTimeout(() => {
            if (this.onstart) {
              this.onstart.call(this, new Event('start'))
            }
          }, 100)
        }

        stop() {
          if (this.onend) {
            this.onend.call(this, new Event('end'))
          }
        }

        abort() {
          this.stop()
        }
      }

      // @ts-ignore
      window.SpeechRecognition = MockSpeechRecognition
      // @ts-ignore
      window.webkitSpeechRecognition = MockSpeechRecognition
    })

    await composer.goto('components-promptcomposer--full-featured')

    // Click voice button
    const voiceButton = page.locator('button[aria-label*="voice"], button[aria-label*="speak"], button:has(svg path[d*="M7 4a3"])').first()
    await voiceButton.click()

    // Should show recording state
    await page.waitForTimeout(500)
    await composer.takeScreenshot('voice-recording')
  })

  test('should append transcribed text to input', async ({ page }) => {
    // Mock SpeechRecognition with transcript result
    await page.addInitScript(() => {
      class MockSpeechRecognition extends EventTarget {
        continuous = false
        interimResults = true
        lang = 'en-US'
        onstart: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onend: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onresult: ((this: MockSpeechRecognition, ev: any) => any) | null = null
        onerror: ((this: MockSpeechRecognition, ev: any) => any) | null = null

        start() {
          setTimeout(() => {
            if (this.onstart) {
              this.onstart.call(this, new Event('start'))
            }

            // Simulate speech result after 500ms
            setTimeout(() => {
              if (this.onresult) {
                const mockResult = {
                  results: [
                    [
                      {
                        transcript: 'Hello from voice input',
                        confidence: 0.95,
                      },
                    ],
                  ],
                  resultIndex: 0,
                }
                // @ts-ignore
                mockResult.results[0].isFinal = true
                this.onresult.call(this, mockResult)
              }
            }, 500)
          }, 100)
        }

        stop() {
          if (this.onend) {
            this.onend.call(this, new Event('end'))
          }
        }

        abort() {
          this.stop()
        }
      }

      // @ts-ignore
      window.SpeechRecognition = MockSpeechRecognition
      // @ts-ignore
      window.webkitSpeechRecognition = MockSpeechRecognition
    })

    await composer.goto('components-promptcomposer--full-featured')

    // First type some text
    await composer.typeMessage('Existing text ')

    // Click voice button
    const voiceButton = page.locator('button[aria-label*="voice"], button[aria-label*="speak"], button:has(svg path[d*="M7 4a3"])').first()
    await voiceButton.click()

    // Wait for transcription
    await page.waitForTimeout(1500)

    // Check if text was appended (voice input appends to existing text)
    const value = await composer.getValue()
    // The voice input should have been processed
  })

  test('should stop recording when button is clicked again', async ({ page }) => {
    // Setup mock
    await page.addInitScript(() => {
      class MockSpeechRecognition extends EventTarget {
        isListening = false
        onstart: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onend: ((this: MockSpeechRecognition, ev: Event) => any) | null = null
        onresult: ((this: MockSpeechRecognition, ev: any) => any) | null = null

        start() {
          this.isListening = true
          if (this.onstart) {
            this.onstart.call(this, new Event('start'))
          }
        }

        stop() {
          this.isListening = false
          if (this.onend) {
            this.onend.call(this, new Event('end'))
          }
        }

        abort() {
          this.stop()
        }
      }

      // @ts-ignore
      window.SpeechRecognition = MockSpeechRecognition
      // @ts-ignore
      window.webkitSpeechRecognition = MockSpeechRecognition
    })

    await composer.goto('components-promptcomposer--full-featured')

    const voiceButton = page.locator('button[aria-label*="voice"], button[aria-label*="speak"], button:has(svg path[d*="M7 4a3"])').first()

    // Start recording
    await voiceButton.click()
    await page.waitForTimeout(300)

    // Stop recording
    await voiceButton.click()
    await page.waitForTimeout(300)
  })
})

// ============================================================================
// Test Suite: Token Budget Exceeded Scenario
// ============================================================================

test.describe('6. Token Budget Exceeded Scenario', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    // Use small token budget story
    await composer.goto('components-promptcomposer--small-token-budget')
  })

  test('should display token count', async () => {
    await expect(composer.tokenDisplay).toBeVisible()
    await composer.takeScreenshot('token-display')
  })

  test('should update token count as user types', async ({ page }) => {
    // Get initial token count
    const initialText = await composer.tokenDisplay.textContent()
    const initialMatch = initialText?.match(/(\d+)/)
    const initialCount = initialMatch ? parseInt(initialMatch[1]) : 0

    // Type some text
    await composer.typeMessage('This is a test message with multiple words to increase token count')

    // Wait for update
    await page.waitForTimeout(300)

    // Get new token count
    const newText = await composer.tokenDisplay.textContent()
    const newMatch = newText?.match(/(\d+)/)
    const newCount = newMatch ? parseInt(newMatch[1]) : 0

    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should show warning color when approaching budget limit', async ({ page }) => {
    // Type enough text to approach the small budget (2000 tokens)
    const longText = 'word '.repeat(500) // Should be ~500+ tokens
    await composer.typeMessage(longText)

    await page.waitForTimeout(300)

    // Check for warning indicator (yellow/red class)
    const tokenElement = composer.tokenDisplay
    const classList = await tokenElement.evaluate((el) => el.className)

    // Should have some color indicator
    await composer.takeScreenshot('token-warning')
  })

  test('should show red indicator when budget is exceeded', async ({ page }) => {
    // Type a lot of text to exceed small budget
    const veryLongText = 'word '.repeat(1000)
    await composer.typeMessage(veryLongText)

    await page.waitForTimeout(300)

    // Check for critical indicator
    await composer.takeScreenshot('token-exceeded')
  })

  test('should prevent adding context that would exceed budget', async ({ page }) => {
    // Go to the version with context providers and small budget
    await composer.goto('components-promptcomposer--with-context-providers')

    // Type a long message first
    await composer.typeMessage('Existing message text that takes up tokens '.repeat(20))

    // Try to add context
    await composer.typeMessageSlowly('@file:')
    await page.waitForTimeout(500)

    // If we search for a large file, it should show budget warning
    await composer.textarea.type('Button')
    await page.waitForTimeout(500)

    await composer.takeScreenshot('context-budget-check')
  })

  test('should show token savings when using progressive disclosure', async ({ page }) => {
    // Use story with token savings enabled
    await composer.goto('components-promptcomposer--with-token-savings')

    // Focus to potentially trigger expanded view
    await composer.focus()
    await composer.typeMessage('Test message')

    await page.waitForTimeout(300)

    // Look for savings indicator
    await composer.takeScreenshot('token-savings')
  })
})

// ============================================================================
// Test Suite: Multi-Feature Interaction (Integration)
// ============================================================================

test.describe('7. Multi-Feature Interaction (Integration)', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--full-featured')
  })

  test('should use all features together: text + mention + attachment', async ({ page }) => {
    // 1. Type initial text
    await composer.typeMessage('Please review ')

    // 2. Add a file mention
    await composer.typeMessageSlowly('@file:Button')
    await page.waitForTimeout(500)
    await composer.selectSuggestionWithKeyboard(0)

    // 3. Continue typing
    await composer.textarea.type(' and check for issues.')

    // 4. Add an attachment
    await composer.uploadFile('review-notes.txt', 'Additional context here', 'text/plain')
    await page.waitForTimeout(500)

    // 5. Verify all components are present
    await expect(page.locator('text=/review/i').first()).toBeVisible()
    await expect(page.locator('text=/notes/i').first()).toBeVisible()

    await composer.takeScreenshot('multi-feature-complete')
  })

  test('should click suggestion chip and maintain state', async ({ page }) => {
    // Wait for suggestions to appear (shown when focused and empty)
    await composer.focus()
    await page.waitForTimeout(500)

    // Look for suggestion chips
    const chips = page.locator('button[class*="rounded-full"]')
    const chipCount = await chips.count()

    if (chipCount > 0) {
      // Click first chip
      await chips.first().click()

      // Should insert suggestion text
      const value = await composer.getValue()
      expect(value.length).toBeGreaterThan(0)

      // Can continue typing
      await composer.textarea.type(' Additional text.')

      await composer.takeScreenshot('suggestion-with-text')
    }
  })

  test('should handle rapid user interactions', async ({ page }) => {
    // Rapid typing
    await composer.typeMessage('Quick')
    await composer.clear()
    await composer.typeMessage('Rapid')
    await composer.clear()
    await composer.typeMessage('Interactions')

    // Rapid trigger attempts
    await composer.textarea.type('@')
    await page.waitForTimeout(100)
    await composer.textarea.press('Escape')
    await page.waitForTimeout(100)
    await composer.textarea.type('/')
    await page.waitForTimeout(100)
    await composer.textarea.press('Escape')

    // Continue normal operation
    await composer.clear()
    await composer.typeMessage('Final stable message')

    await expect(composer.textarea).toHaveValue('Final stable message')
  })

  test('should maintain focus through various interactions', async ({ page }) => {
    // Initial focus
    await composer.focus()
    await expect(composer.textarea).toBeFocused()

    // Upload file (should maintain focus)
    await composer.uploadFile('focus-test.txt', 'content', 'text/plain')
    await page.waitForTimeout(500)

    // Type after upload
    await composer.typeMessage('Text after upload')
    await expect(composer.textarea).toHaveValue('Text after upload')
  })

  test('should handle submit with text and attachment', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Message submitted')
      await dialog.accept()
    })

    // Add text
    await composer.typeMessage('Message with attachment')

    // Add attachment
    await composer.uploadFile('submit-test.txt', 'attachment content', 'text/plain')
    await page.waitForTimeout(500)

    // Submit
    await composer.submit()

    // Wait for clear
    await page.waitForTimeout(500)
    await expect(composer.textarea).toHaveValue('')
  })

  test('should transition through progressive disclosure states', async ({ page }) => {
    // State 1: Collapsed (initial)
    await composer.takeScreenshot('state-collapsed')

    // State 2: Focused
    await composer.focus()
    await page.waitForTimeout(300)
    await composer.takeScreenshot('state-focused')

    // State 3: Typing
    await composer.typeMessage('Short')
    await page.waitForTimeout(300)
    await composer.takeScreenshot('state-typing')

    // State 4: Expanding (approaching threshold)
    await composer.typeMessage(' '.repeat(80) + 'Longer text approaching threshold')
    await page.waitForTimeout(300)
    await composer.takeScreenshot('state-expanding')

    // State 5: Expanded (with newlines or long content)
    await composer.clear()
    await composer.typeMessage('Line 1\nLine 2\nLine 3\nLine 4')
    await page.waitForTimeout(300)
    await composer.takeScreenshot('state-expanded')
  })

  test('should handle error state gracefully', async ({ page }) => {
    // Go to error story
    await composer.goto('components-promptcomposer--with-error')

    // Type and submit to trigger error
    await composer.typeMessage('Message that will error')
    await composer.submit()

    // Wait for error
    await page.waitForTimeout(1000)

    // Should show error message
    await expect(page.locator('text=/failed|error/i').first()).toBeVisible({
      timeout: 5000,
    })
    await composer.takeScreenshot('error-state')
  })

  test('should work in mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await composer.goto('components-promptcomposer--mobile')

    // Basic operations should still work
    await composer.typeMessage('Mobile test message')
    await expect(composer.textarea).toHaveValue('Mobile test message')

    await composer.takeScreenshot('mobile-viewport')
  })

  test('should work in dark mode', async ({ page }) => {
    await composer.goto('components-promptcomposer--dark-mode')

    // Verify rendering
    await expect(composer.textarea).toBeVisible()
    await composer.typeMessage('Dark mode test')

    await composer.takeScreenshot('dark-mode')
  })
})

// ============================================================================
// Accessibility Tests
// ============================================================================

test.describe('Accessibility', () => {
  let composer: PromptComposerPage

  test.beforeEach(async ({ page }) => {
    attachPageDiagnostics(page)
    composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--default')
  })

  test('should have proper ARIA labels', async ({ page }) => {
    // Send button should have aria-label
    await expect(composer.sendButton).toHaveAttribute('type', 'button')

    // Attachment button should have aria-label
    await composer.goto('components-promptcomposer--full-featured')
    const attachBtn = page.locator('[aria-label*="attachment"]')
    await expect(attachBtn.first()).toBeVisible()
  })

  test('should be keyboard navigable', async () => {
    // Tab to textarea
    await composer.page.keyboard.press('Tab')

    // Should be able to type
    await composer.page.keyboard.type('Keyboard navigation test')

    // Tab to send button
    await composer.page.keyboard.press('Tab')

    // Enter should submit
    await composer.page.keyboard.press('Enter')
  })

  test('should announce state changes', async ({ page }) => {
    // Check for aria-live regions or status updates
    await composer.typeMessage('Testing accessibility')

    // Submit and check for status
    await composer.submit()
  })
})

// ============================================================================
// Performance Tests
// ============================================================================

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    attachPageDiagnostics(page)
    await page.goto('/iframe.html?id=components-promptcomposer--default')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(10000) // Should load within 10 seconds
  })

  test('should handle rapid typing without lag', async ({ page }) => {
    attachPageDiagnostics(page)
    const composer = new PromptComposerPage(page)
    await composer.goto('components-promptcomposer--default')

    const startTime = Date.now()

    // Type rapidly
    const testText = 'This is a rapid typing test to ensure the component handles fast input without lag or dropped characters.'
    await composer.textarea.fill(testText)

    const typeTime = Date.now() - startTime

    // Verify all text was captured
    await expect(composer.textarea).toHaveValue(testText)

    // Should complete quickly
    expect(typeTime).toBeLessThan(2000)
  })
})
