/**
 * Clarity Chat - Comprehensive Test Suite
 *
 * Tests for all 2025 UI enhancements including:
 * - ChatWindow with enhancement flags
 * - UIEnhancementsContext system
 * - Theme system extensions
 * - Quantum animations
 * - Voice input enhancements
 * - Security hardening
 * - Performance optimizations
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

jest.mock('dompurify', () => ({
  sanitize: (input: string) =>
    input.replace(/<script[^>]*>.*?<\/script>/gi, ''),
}))

// Import components and hooks
import { ChatWindow, ChatWindowProps } from '../components/chat/ChatWindow'
import {
  UIEnhancementsProvider,
  useUIEnhancements,
  useQuantumAnimation,
  useGlassmorphism,
  useAuroraGradients,
  useVoiceIntegration,
  useWCAGAAA,
} from '../contexts/ui-enhancements'
import {
  modernThemes,
  getModernThemeNames,
  getThemesByCategory,
  type ModernThemePresetName,
} from '../theme/modern-presets'
import { duration, ANIMATION_PRESETS } from '../animations/constants'
import { useQuantumVoice } from '../hooks/use-quantum-voice'
import { SecurityManager } from '../utils/security'
import { PerformanceMonitor } from '@clarity-chat/utils'

/**
 * Test Utilities
 */
const createMockMessages = () => [
  {
    id: '1',
    role: 'user' as const,
    content: 'Hello, how are you?',
    timestamp: Date.now() - 1000,
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'I am doing well, thank you for asking! How can I help you today?',
    timestamp: Date.now(),
  },
]

const mockOnSendMessage = jest.fn()
const mockOnMessageCopy = jest.fn()
const mockOnMessageFeedback = jest.fn()

/**
 * Phase 1: ChatWindow Enhancement Tests
 */
describe('Phase 1: ChatWindow Enhancement Tests', () => {
  const defaultProps: ChatWindowProps = {
    messages: createMockMessages(),
    onSendMessage: mockOnSendMessage,
    quantumAnimations: false,
    glassmorphism: false,
    auroraGradients: false,
    neumorphism: false,
    voiceIntegration: false,
    adaptiveColors: false,
    wcagAAA: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders basic ChatWindow without enhancements', () => {
    render(<ChatWindow {...defaultProps} />)

    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
  })

  test('renders ChatWindow with quantum animations', () => {
    const { container } = render(
      <ChatWindow {...defaultProps} quantumAnimations />
    )

    expect(container.querySelector('.quantum-animations')).toBeInTheDocument()
  })

  test('renders ChatWindow with glassmorphism', () => {
    const { container } = render(<ChatWindow {...defaultProps} glassmorphism />)

    expect(
      container.querySelector('.glassmorphism-enabled')
    ).toBeInTheDocument()
  })

  test('renders ChatWindow with aurora gradients', () => {
    const { container } = render(
      <ChatWindow {...defaultProps} auroraGradients />
    )

    expect(
      container.querySelector('.aurora-gradients-enabled')
    ).toBeInTheDocument()
  })

  test('renders ChatWindow with neumorphism', () => {
    const { container } = render(<ChatWindow {...defaultProps} neumorphism />)

    expect(container.querySelector('.neumorphism-enabled')).toBeInTheDocument()
  })

  test('renders ChatWindow with voice integration', () => {
    const { container } = render(
      <ChatWindow {...defaultProps} voiceIntegration />
    )

    expect(
      container.querySelector('.voice-integration-enabled')
    ).toBeInTheDocument()
  })

  test('renders ChatWindow with WCAG AAA compliance', () => {
    const { container } = render(<ChatWindow {...defaultProps} wcagAAA />)

    expect(container.querySelector('.wcag-aaa-compliant')).toBeInTheDocument()
  })

  test('handles message sending with security validation', async () => {
    render(<ChatWindow {...defaultProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(input, 'Test message')
    await userEvent.click(sendButton)

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
  })

  test('prevents XSS in messages', async () => {
    render(<ChatWindow {...defaultProps} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    const maliciousInput = '<script>alert("XSS")</script>Hello'
    await userEvent.type(input, maliciousInput)
    await userEvent.click(sendButton)

    // Should sanitize the input
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello')
  })
})

/**
 * Phase 2: UIEnhancementsContext Tests
 */
describe('Phase 2: UIEnhancementsContext Tests', () => {
  test('useUIEnhancements returns correct default values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{}}>{children}</UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useUIEnhancements(), { wrapper })

    expect(result.current.quantumAnimations).toBe(false)
    expect(result.current.glassmorphism).toBe(false)
    expect(result.current.isEnhanced).toBe(false)
  })

  test('useQuantumAnimation returns correct value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{ quantumAnimations: true }}>
        {children}
      </UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useQuantumAnimation(), { wrapper })

    expect(result.current).toBe(true)
  })

  test('useGlassmorphism returns correct value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{ glassmorphism: true }}>
        {children}
      </UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useGlassmorphism(), { wrapper })

    expect(result.current).toBe(true)
  })

  test('useAuroraGradients returns correct value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{ auroraGradients: true }}>
        {children}
      </UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useAuroraGradients(), { wrapper })

    expect(result.current).toBe(true)
  })

  test('useVoiceIntegration returns correct value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{ voiceIntegration: true }}>
        {children}
      </UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useVoiceIntegration(), { wrapper })

    expect(result.current).toBe(true)
  })

  test('useWCAGAAA returns correct value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIEnhancementsProvider value={{ wcagAAA: true }}>
        {children}
      </UIEnhancementsProvider>
    )

    const { result } = renderHook(() => useWCAGAAA(), { wrapper })

    expect(result.current).toBe(true)
  })
})

/**
 * Phase 3: Theme System Tests
 */
describe('Phase 3: Theme System Tests', () => {
  test('modernThemes contains all expected themes', () => {
    const themeNames = Object.keys(modernThemes)

    expect(themeNames).toContain('default')
    expect(themeNames).toContain('default-dark')
    expect(themeNames).toContain('glassmorphism')
    expect(themeNames).toContain('glassmorphism-dark')
    expect(themeNames).toContain('aurora')
    expect(themeNames).toContain('aurora-dark')
    expect(themeNames).toContain('neumorphism')
    expect(themeNames).toContain('neumorphism-dark')
  })

  test('getModernThemeNames returns all theme names', () => {
    const names = getModernThemeNames()

    expect(names.length).toBeGreaterThan(20) // At least 20 themes
    expect(names).toContain('glassmorphism')
    expect(names).toContain('aurora')
    expect(names).toContain('neumorphism')
  })

  test('getThemesByCategory organizes themes correctly', () => {
    const categories = getThemesByCategory()

    expect(categories.professional).toContain('glassmorphism')
    expect(categories.professional).toContain('glassmorphism-dark')
    expect(categories.vibrant).toContain('aurora')
    expect(categories.vibrant).toContain('aurora-dark')
    expect(categories['2025-trending']).toContain('neumorphism')
    expect(categories['2025-trending']).toContain('neumorphism-dark')
  })

  test('each theme has valid configuration', () => {
    const themeNames = getModernThemeNames()

    themeNames.forEach((name) => {
      const theme = modernThemes[name as ModernThemePresetName]
      expect(theme).toBeDefined()
      expect(theme.colors).toBeDefined()
      expect(theme.colors.background).toBeDefined()
      expect(theme.colors.foreground).toBeDefined()
    })
  })
})

/**
 * Phase 4: Animation System Tests
 */
describe('Phase 4: Animation System Tests', () => {
  test('duration function returns correct values', () => {
    expect(duration('instant')).toBe(0)
    expect(duration('fast')).toBe(0.15)
    expect(duration('normal')).toBe(0.2)
    expect(duration('slow')).toBe(0.3)
    expect(duration('quantum')).toBe(0.15)
  })

  test('ANIMATION_PRESETS contains quantum animations', () => {
    expect(ANIMATION_PRESETS.quantum).toBeDefined()
    expect(ANIMATION_PRESETS.glassmorphism).toBeDefined()
    expect(ANIMATION_PRESETS.aurora).toBeDefined()
    expect(ANIMATION_PRESETS.neumorphism).toBeDefined()
  })

  test('quantum animation preset has correct structure', () => {
    const quantum = ANIMATION_PRESETS.quantum

    expect(quantum.initial).toBeDefined()
    expect(quantum.animate).toBeDefined()
    expect(quantum.exit).toBeDefined()
    expect(quantum.animate.transition).toBeDefined()
    expect(quantum.animate.transition.type).toBe('spring')
  })

  test('glassmorphism animation preset has correct structure', () => {
    const glass = ANIMATION_PRESETS.glassmorphism

    expect(glass.initial).toBeDefined()
    expect(glass.animate).toBeDefined()
    expect(glass.exit).toBeDefined()
    expect(glass.animate.backdropFilter).toBeDefined()
  })
})

/**
 * Phase 5: Quantum Voice Tests
 */
describe('Phase 5: Quantum Voice Tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UIEnhancementsProvider value={{ voiceIntegration: true }}>
      {children}
    </UIEnhancementsProvider>
  )

  test('useQuantumVoice returns correct default state', () => {
    const { result } = renderHook(() => useQuantumVoice(), { wrapper })

    expect(result.current.isEnhanced).toBe(true)
    expect(result.current.features.realTimeProcessing).toBe(true)
    expect(result.current.features.adaptiveRecognition).toBe(true)
    expect(result.current.accuracy).toBe(0.95)
    expect(result.current.emotion).toBe('neutral')
  })

  test('useQuantumVoice with custom features', () => {
    const { result } = renderHook(
      () =>
        useQuantumVoice({
          enabled: true,
          features: {
            emotionDetection: true,
            accentAdaptation: true,
          },
        }),
      { wrapper }
    )

    expect(result.current.features.emotionDetection).toBe(true)
    expect(result.current.features.accentAdaptation).toBe(true)
  })

  test('quantum voice updateFeatures works correctly', () => {
    const { result } = renderHook(() => useQuantumVoice(), { wrapper })

    act(() => {
      result.current.updateFeatures({ emotionDetection: false })
    })

    expect(result.current.features.emotionDetection).toBe(false)
  })

  test('quantum voice reset works correctly', () => {
    const { result } = renderHook(() => useQuantumVoice(), { wrapper })

    // Change some values first
    act(() => {
      result.current.updateFeatures({ emotionDetection: true })
    })

    // Then reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.emotion).toBe('neutral')
    expect(result.current.accent).toBe('native')
    expect(result.current.processingSpeed).toBe(0)
  })
})

/**
 * Phase 6: Security Tests
 */
describe('Phase 6: Security Tests', () => {
  let securityManager: SecurityManager

  beforeEach(() => {
    securityManager = new SecurityManager()
  })

  test('sanitizeInput removes XSS payloads', () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello World'
    const sanitized = securityManager.sanitizeInput(maliciousInput)

    expect(sanitized).not.toContain('<script>')
    expect(sanitized).toContain('Hello World')
  })

  test('validateChatInput accepts valid input', () => {
    const validInput = 'Hello, this is a safe message!'
    const result = securityManager.validateChatInput(validInput)

    expect(result.isValid).toBe(true)
    expect(result.sanitized).toBe(validInput)
  })

  test('validateChatInput rejects empty input', () => {
    const result = securityManager.validateChatInput('')

    expect(result.isValid).toBe(false)
    expect(result.error).toContain('cannot be empty')
  })

  test('validateChatInput detects XSS patterns', () => {
    const xssInput = 'Hello <script>alert("xss")</script> World'
    const result = securityManager.validateChatInput(xssInput)

    expect(result.isValid).toBe(true) // Still valid after sanitization
    expect(result.warnings).toBeDefined()
    expect(result.warnings?.length).toBeGreaterThan(0)
  })

  test('validateFileUpload accepts valid files', () => {
    const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const result = securityManager.validateFileUpload(validFile)

    expect(result.isValid).toBe(true)
  })

  test('validateFileUpload rejects large files', () => {
    const largeFile = new File(['x'.repeat(20 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })
    const result = securityManager.validateFileUpload(largeFile)

    expect(result.isValid).toBe(false)
    expect(result.error).toContain('exceeds')
  })

  test('checkRateLimit prevents abuse', () => {
    const userId = 'test-user'
    const action = 'send-message'

    // First 10 attempts should be allowed
    for (let i = 0; i < 10; i++) {
      expect(securityManager.checkRateLimit(userId, action)).toBe(true)
    }

    // 11th attempt should be blocked
    expect(securityManager.checkRateLimit(userId, action)).toBe(false)
  })

  test('generateSecureToken creates valid tokens', () => {
    const token = securityManager.generateSecureToken()

    expect(token).toBeDefined()
    expect(token.length).toBe(64) // 32 bytes in hex = 64 characters
    expect(token).toMatch(/^[a-f0-9]+$/)
  })
})

/**
 * Phase 7: Performance Tests
 */
describe('Phase 7: Performance Tests', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
  })

  afterEach(() => {
    monitor.stop()
  })

  test('PerformanceMonitor starts and stops correctly', () => {
    expect(() => monitor.start()).not.toThrow()
    expect(() => monitor.stop()).not.toThrow()
  })

  test('PerformanceMonitor measures render time', () => {
    const mockRender = jest.fn(() => 'rendered')

    const result = monitor.measureRenderTime('TestComponent', mockRender)

    expect(mockRender).toHaveBeenCalled()
    expect(result).toBe('rendered')
    expect(monitor.getMetrics().renderTime).toBeGreaterThan(0)
  })

  test('PerformanceMonitor detects slow renders', () => {
    const slowRender = () => {
      // Simulate slow operation
      const start = performance.now()
      while (performance.now() - start < 150) {
        // Busy wait
      }
      return 'slow'
    }

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    monitor.measureRenderTime('SlowComponent', slowRender)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Slow render detected')
    )
    consoleSpy.mockRestore()
  })

  test('MemoryManager handles cleanup', () => {
    const cleanup = jest.fn()
    const unregister = memoryManager.registerCleanup(cleanup)

    memoryManager.cleanup()

    expect(cleanup).toHaveBeenCalled()

    unregister()
    memoryManager.cleanup()
    // Should not throw after unregister
  })

  test('ObjectPool manages objects efficiently', () => {
    const createFn = jest.fn(() => ({ id: Math.random() }))
    const resetFn = jest.fn()

    const pool = memoryManager.createObjectPool(createFn, resetFn, 5)

    const obj1 = pool.acquire()
    expect(createFn).toHaveBeenCalledTimes(1)

    pool.release(obj1)
    expect(resetFn).toHaveBeenCalledWith(obj1)

    const obj2 = pool.acquire()
    expect(createFn).toHaveBeenCalledTimes(1) // Should reuse from pool
  })

  test('FPSOptimizer calculates correct frame intervals', () => {
    const optimizer = new FPSOptimizer(60)
    expect(optimizer.getOptimalDuration()).toBe(150)
  })
})

/**
 * Phase 8: Integration Tests
 */
describe('Phase 8: Integration Tests', () => {
  test('ChatWindow with all enhancements enabled', () => {
    const { container } = render(
      <UIEnhancementsProvider value={{ quantumAnimations: true }}>
        <ChatWindow
          {...defaultProps}
          quantumAnimations
          glassmorphism
          auroraGradients
          neumorphism
          voiceIntegration
          adaptiveColors
          wcagAAA
        />
      </UIEnhancementsProvider>
    )

    expect(container.querySelector('.quantum-animations')).toBeInTheDocument()
    expect(
      container.querySelector('.glassmorphism-enabled')
    ).toBeInTheDocument()
    expect(
      container.querySelector('.aurora-gradients-enabled')
    ).toBeInTheDocument()
    expect(container.querySelector('.neumorphism-enabled')).toBeInTheDocument()
    expect(
      container.querySelector('.voice-integration-enabled')
    ).toBeInTheDocument()
    expect(container.querySelector('.wcag-aaa-compliant')).toBeInTheDocument()
  })

  test('Theme system integration with animations', () => {
    const themeName: ModernThemePresetName = 'glassmorphism'
    const theme = modernThemes[themeName]

    expect(theme).toBeDefined()
    expect(theme.colors).toBeDefined()
    expect(theme.colors.background).toBeDefined()

    // Test animation integration
    const animation = ANIMATION_PRESETS.glassmorphism
    expect(animation).toBeDefined()
    expect(animation.animate.backdropFilter).toBeDefined()
  })

  test('Security integration with performance monitoring', () => {
    const security = new SecurityManager()
    const monitor = new PerformanceMonitor()

    monitor.start()

    const maliciousInput = '<script>alert("XSS")</script>Test'
    const result = security.validateChatInput(maliciousInput)

    expect(result.isValid).toBe(true)
    expect(result.sanitized).toBe('Test')

    monitor.stop()

    expect(monitor.getMetrics().fps).toBeGreaterThan(0)
  })
})

/**
 * Phase 9: Edge Cases and Error Handling
 */
describe('Phase 9: Edge Cases and Error Handling', () => {
  test('handles invalid enhancement props gracefully', () => {
    const invalidProps = {
      ...defaultProps,
      quantumAnimations: 'invalid' as any,
      glassmorphism: null as any,
    }

    expect(() => render(<ChatWindow {...invalidProps} />)).not.toThrow()
  })

  test('handles missing theme gracefully', () => {
    const invalidThemeName = 'nonexistent-theme' as ModernThemePresetName
    const theme = modernThemes[invalidThemeName]

    expect(theme).toBeUndefined()
  })

  test('handles security manager with disabled features', () => {
    const security = new SecurityManager({
      enableXSS: false,
      enableValidation: false,
    })

    const input = '<script>alert("test")</script>Hello'
    const sanitized = security.sanitizeInput(input)

    // Should return original input when XSS protection is disabled
    expect(sanitized).toBe(input)
  })

  test('handles performance monitor errors gracefully', () => {
    const monitor = new PerformanceMonitor()

    // Mock performance.memory to be undefined
    const originalMemory = (global as any).performance.memory
    delete (global as any).performance.memory

    monitor.start()
    const metrics = monitor.getMetrics()

    expect(metrics.memoryUsage).toBe(0)

    monitor.stop()

    // Restore original
    if (originalMemory) {
      ;(global as any).performance.memory = originalMemory
    }
  })

  test('handles rate limiting edge cases', () => {
    const security = new SecurityManager()

    // Test with disabled rate limiting
    const result1 = security.checkRateLimit('user1', 'action1', 1, 1000, false)
    expect(result1).toBe(true)

    // Test with very small window
    const result2 = security.checkRateLimit('user2', 'action2', 1, 1)
    expect(result2).toBe(false) // Should be rate limited
  })
})

/**
 * Performance Benchmarks
 */
describe('Performance Benchmarks', () => {
  test('ChatWindow render performance', () => {
    const start = performance.now()

    const { rerender } = render(<ChatWindow {...defaultProps} />)

    const initialRenderTime = performance.now() - start
    expect(initialRenderTime).toBeLessThan(100) // Should render in under 100ms

    const updateStart = performance.now()
    rerender(
      <ChatWindow
        {...defaultProps}
        messages={[
          ...createMockMessages(),
          {
            id: '3',
            role: 'user' as const,
            content: 'Performance test message',
            timestamp: Date.now(),
          },
        ]}
      />
    )

    const updateRenderTime = performance.now() - updateStart
    expect(updateRenderTime).toBeLessThan(50) // Updates should be under 50ms
  })

  test('Theme switching performance', () => {
    const themeNames = getModernThemeNames()
    const start = performance.now()

    themeNames.forEach((name) => {
      const theme = modernThemes[name as ModernThemePresetName]
      expect(theme).toBeDefined()
    })

    const totalTime = performance.now() - start
    expect(totalTime).toBeLessThan(100) // All theme lookups under 100ms
  })

  test('Security validation performance', () => {
    const security = new SecurityManager()
    const testInputs = Array.from(
      { length: 1000 },
      (_, i) => `Test message ${i}`
    )

    const start = performance.now()

    testInputs.forEach((input) => {
      security.validateChatInput(input)
    })

    const totalTime = performance.now() - start
    const averageTime = totalTime / testInputs.length

    expect(averageTime).toBeLessThan(1) // Average validation under 1ms per input
  })
})
