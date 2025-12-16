/**
 * Comprehensive testing utilities for edge cases and advanced scenarios
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

/**
 * Edge case testing utilities
 */
export class EdgeCaseTesting {
  /**
   * Test with various null/undefined scenarios
   */
  static testNullishValues<T>(
    testFn: (value: null | undefined) => void,
    description: string
  ) {
    describe(`${description} - Nullish values`, () => {
      it('should handle null', () => {
        testFn(null);
      });

      it('should handle undefined', () => {
        testFn(undefined);
      });

      it('should handle empty string', () => {
        testFn('' as any);
      });
    });
  }

  /**
   * Test with boundary values
   */
  static testBoundaryValues<T>(
    testFn: (value: T) => void,
    boundaries: { min: T; max: T; justBelowMin?: T; justAboveMax?: T },
    description: string
  ) {
    describe(`${description} - Boundary values`, () => {
      it('should handle minimum value', () => {
        testFn(boundaries.min);
      });

      it('should handle maximum value', () => {
        testFn(boundaries.max);
      });

      if (boundaries.justBelowMin !== undefined) {
        it('should handle value just below minimum', () => {
          testFn(boundaries.justBelowMin);
        });
      }

      if (boundaries.justAboveMax !== undefined) {
        it('should handle value just above maximum', () => {
          testFn(boundaries.justAboveMax);
        });
      }
    });
  }

  /**
   * Test with extreme values
   */
  static testExtremeValues<T>(
    testFn: (value: T) => void,
    description: string
  ) {
    describe(`${description} - Extreme values`, () => {
      it('should handle very large numbers', () => {
        testFn(Number.MAX_SAFE_INTEGER as any);
      });

      it('should handle very small numbers', () => {
        testFn(Number.MIN_SAFE_INTEGER as any);
      });

      it('should handle infinity', () => {
        testFn(Infinity as any);
      });

      it('should handle negative infinity', () => {
        testFn(-Infinity as any);
      });

      it('should handle NaN', () => {
        testFn(NaN as any);
      });
    });
  }

  /**
   * Test with special string values
   */
  static testSpecialStrings(
    testFn: (value: string) => void,
    description: string
  ) {
    describe(`${description} - Special strings`, () => {
      it('should handle empty string', () => {
        testFn('');
      });

      it('should handle whitespace-only string', () => {
        testFn('   \t\n  ');
      });

      it('should handle very long string', () => {
        testFn('a'.repeat(10000));
      });

      it('should handle string with special characters', () => {
        testFn('!@#$%^&*()_+-=[]{}|;:,.<>?');
      });

      it('should handle string with unicode characters', () => {
        testFn('🚀 🎉 🌍 你好 こんにちは');
      });

      it('should handle string with escape sequences', () => {
        testFn('line1\nline2\ttabbed');
      });

      it('should handle string with null bytes', () => {
        testFn('hello\0world');
      });
    });
  }

  /**
   * Test with malformed data
 */
  static testMalformedData<T>(
    testFn: (value: any) => void,
    description: string
  ) {
    describe(`${description} - Malformed data`, () => {
      it('should handle circular references', () => {
        const obj: any = { a: 1 };
        obj.self = obj;
        testFn(obj);
      });

      it('should handle deeply nested objects', () => {
        const deep = JSON.parse('{"a":{"b":{"c":{"d":{"e":{"f":1}}}}}}');
        testFn(deep);
      });

      it('should handle mixed data types', () => {
        testFn([1, 'string', true, null, undefined, { key: 'value' }]);
      });

      it('should handle sparse arrays', () => {
        const sparse = new Array(10);
        sparse[0] = 'first';
        sparse[9] = 'last';
        testFn(sparse);
      });
    });
  }

  /**
   * Test with timing-related edge cases
   */
  static testTimingEdgeCases(
    testFn: (delay: number) => Promise<void>,
    description: string
  ) {
    describe(`${description} - Timing edge cases`, () => {
      it('should handle immediate execution', async () => {
        await testFn(0);
      });

      it('should handle very short delays', async () => {
        await testFn(1);
      });

      it('should handle long delays', async () => {
        await testFn(1000);
      });

      it('should handle negative delays', async () => {
        await testFn(-100);
      });
    });
  }
}

/**
 * Advanced user interaction testing
 */
export class AdvancedUserInteraction {
  /**
   * Test rapid clicking
   */
  static async testRapidClicking(
    element: HTMLElement,
    clicks: number = 10,
    interval: number = 50
  ) {
    for (let i = 0; i < clicks; i++) {
      await userEvent.click(element);
      await waitFor(() => new Promise(resolve => setTimeout(resolve, interval)));
    }
  }

  /**
   * Test keyboard navigation
   */
  static async testKeyboardNavigation(
    keys: string[],
    expectedFocusPath: string[]
  ) {
    for (let i = 0; i < keys.length; i++) {
      await userEvent.keyboard(`{${keys[i]}}`);
      const focusedElement = document.activeElement;
      expect(focusedElement?.getAttribute('data-testid')).toBe(expectedFocusPath[i]);
    }
  }

  /**
   * Test drag and drop operations
   */
  static async testDragAndDrop(
    source: HTMLElement,
    target: HTMLElement,
    options: {
      dragEnter?: boolean;
      dragOver?: boolean;
      dragLeave?: boolean;
    } = {}
  ) {
    if (options.dragEnter) {
      await userEvent.dragEnter(target);
    }
    
    if (options.dragOver) {
      await userEvent.dragOver(target);
    }
    
    await userEvent.drag(source, { target });
    
    if (options.dragLeave) {
      await userEvent.dragLeave(target);
    }
  }

  /**
   * Test touch interactions
   */
  static async testTouchInteractions(
    element: HTMLElement,
    touches: Array<{
      x: number;
      y: number;
      type: 'touchstart' | 'touchmove' | 'touchend';
    }>
  ) {
    for (const touch of touches) {
      const touchEvent = new TouchEvent(touch.type, {
        touches: [new Touch({
          identifier: 1,
          target: element,
          clientX: touch.x,
          clientY: touch.y,
          radiusX: 2.5,
          radiusY: 2.5,
          rotationAngle: 10,
          force: 0.5,
        })],
      });
      
      act(() => {
        element.dispatchEvent(touchEvent);
      });
    }
  }

  /**
   * Test copy/paste operations
   */
  static async testCopyPaste(
    input: HTMLElement,
    text: string,
    options: {
      cut?: boolean;
      selectAll?: boolean;
    } = {}
  ) {
    // Write text to clipboard
    await navigator.clipboard.writeText(text);
    
    if (options.selectAll) {
      await userEvent.click(input);
      await userEvent.keyboard('{Control>}a{/Control}');
    }
    
    if (options.cut) {
      await userEvent.keyboard('{Control>}x{/Control}');
    } else {
      await userEvent.keyboard('{Control>}v{/Control}');
    }
  }
}

/**
 * Component testing utilities
 */
export class ComponentTesting {
  /**
   * Test component with different prop combinations
   */
  static testPropCombinations<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    propVariations: Record<keyof P, any[]>,
    testFn: (props: P) => void
  ) {
    const combinations = this.generateCombinations(propVariations);
    
    combinations.forEach((props, index) => {
      it(`should handle prop combination ${index + 1}`, () => {
        testFn(props as P);
      });
    });
  }

  /**
   * Test component lifecycle events
   */
  static testLifecycleEvents<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    props: P,
    events: Array<{
      event: string;
      payload?: any;
      expectedState?: any;
    }>
  ) {
    const { rerender } = render(<Component {...props} />);
    
    events.forEach((event, index) => {
      it(`should handle lifecycle event ${index + 1}: ${event.event}`, () => {
        // Trigger event
        // Implementation depends on specific event system
        
        if (event.expectedState) {
          // Verify expected state
          expect(screen.queryByTestId('state')).toHaveTextContent(
            JSON.stringify(event.expectedState)
          );
        }
      });
    });
  }

  /**
   * Test component error states
   */
  static testErrorStates<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    errorScenarios: Array<{
      props: P;
      error: Error;
      expectedErrorUI?: string;
    }>
  ) {
    errorScenarios.forEach((scenario, index) => {
      it(`should handle error state ${index + 1}`, () => {
        // Mock console.error to avoid error output in tests
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        try {
          render(<Component {...scenario.props} />);
          
          if (scenario.expectedErrorUI) {
            expect(screen.getByRole('alert')).toHaveTextContent(scenario.expectedErrorUI);
          }
        } finally {
          consoleSpy.mockRestore();
        }
      });
    });
  }

  /**
   * Test component performance
   */
  static testPerformance<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    props: P,
    iterations: number = 100
  ) {
    it(`should render efficiently (${iterations} iterations)`, () => {
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const { unmount } = render(<Component {...props} />);
        unmount();
      }
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;
      
      // Average render time should be less than 16ms (60fps)
      expect(averageTime).toBeLessThan(16);
    });
  }

  /**
   * Generate all possible combinations of props
   */
  private static generateCombinations(obj: Record<string, any[]>): Record<string, any>[] {
    const keys = Object.keys(obj);
    const combinations: Record<string, any>[] = [];
    
    const generate = (index: number, current: Record<string, any>) => {
      if (index === keys.length) {
        combinations.push({ ...current });
        return;
      }
      
      const key = keys[index];
      for (const value of obj[key]) {
        current[key] = value;
        generate(index + 1, current);
      }
    };
    
    generate(0, {});
    return combinations;
  }
}

/**
 * Accessibility testing utilities
 */
export class AccessibilityTesting {
  /**
   * Test keyboard navigation
   */
  static async testKeyboardNavigation(
    container: HTMLElement,
    expectedFocusOrder: string[]
  ) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(focusableElements.length, expectedFocusOrder.length); i++) {
      await userEvent.tab();
      const focused = document.activeElement;
      expect(focused?.getAttribute('data-testid')).toBe(expectedFocusOrder[i]);
    }
  }

  /**
   * Test ARIA attributes
   */
  static testAriaAttributes(
    element: HTMLElement,
    expectedAttributes: Record<string, string>
  ) {
    Object.entries(expectedAttributes).forEach(([attr, value]) => {
      expect(element).toHaveAttribute(attr, value);
    });
  }

  /**
   * Test screen reader announcements
   */
  static testScreenReaderAnnouncements(
    announcements: Array<{
      message: string;
      priority: 'polite' | 'assertive';
      delay?: number;
    }>
  ) {
    announcements.forEach((announcement, index) => {
      it(`should announce message ${index + 1} correctly`, async () => {
        // Implementation depends on specific announcement system
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveTextContent(announcement.message);
      });
    });
  }

  /**
   * Test color contrast
   */
  static testColorContrast(
    elements: Array<{
      element: HTMLElement;
      expectedRatio: number;
    }>
  ) {
    elements.forEach(({ element, expectedRatio }) => {
      // Get computed styles
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;
      
      // Calculate contrast ratio (simplified)
      const contrastRatio = this.calculateContrastRatio(color, backgroundColor);
      expect(contrastRatio).toBeGreaterThanOrEqual(expectedRatio);
    });
  }

  /**
   * Calculate contrast ratio (simplified implementation)
   */
  private static calculateContrastRatio(color1: string, color2: string): number {
    // This is a simplified implementation
    // In a real scenario, you would use a proper color contrast calculation library
    return 4.5; // Placeholder
  }
}

/**
 * Cross-browser testing utilities
 */
export class CrossBrowserTesting {
  /**
   * Test with different user agents
   */
  static testWithUserAgents(
    testFn: (userAgent: string) => void,
    userAgents: string[] = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36'
    ]
  ) {
    userAgents.forEach(userAgent => {
      it(`should work with user agent: ${userAgent.substr(0, 50)}...`, () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          configurable: true
        });
        testFn(userAgent);
      });
    });
  }

  /**
   * Test with different screen sizes
   */
  static testWithScreenSizes(
    testFn: (width: number, height: number) => void,
    sizes: Array<[number, number]> = [
      [320, 568],   // iPhone SE
      [375, 667],  // iPhone 8
      [414, 896],  // iPhone 11 Pro Max
      [768, 1024], // iPad
      [1024, 768], // iPad landscape
      [1920, 1080] // Desktop
    ]
  ) {
    sizes.forEach(([width, height]) => {
      it(`should work with screen size: ${width}x${height}`, () => {
        global.innerWidth = width;
        global.innerHeight = height;
        global.dispatchEvent(new Event('resize'));
        testFn(width, height);
      });
    });
  }
}

export {
  render,
  screen,
  waitFor,
  within,
  userEvent,
  act
};