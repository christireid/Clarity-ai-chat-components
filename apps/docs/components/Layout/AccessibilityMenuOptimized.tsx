import { logger } from '@clarity-chat/utils/logger';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Settings, Palette, Eye, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largerText: boolean;
  screenReaderMode: boolean;
}

/**
 * Optimized Accessibility Menu with performance improvements and memory management
 */
export function AccessibilityMenuOptimized() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largerText: false,
    screenReaderMode: false
  });
  
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Optimized settings loading with localStorage security
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate data to prevent XSS
        if (typeof parsed === 'object' && parsed !== null) {
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (error) {
      // Security: Clear potentially malicious data
      localStorage.removeItem('accessibility-settings');
    }
  }, []);

  // Optimized settings persistence with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        // Security: Only save valid settings
        const validatedSettings = {
          highContrast: Boolean(settings.highContrast),
          reducedMotion: Boolean(settings.reducedMotion),
          largerText: Boolean(settings.largerText),
          screenReaderMode: Boolean(settings.screenReaderMode)
        };
        localStorage.setItem('accessibility-settings', JSON.stringify(validatedSettings));
      } catch (error) {
        // Security: Handle storage quota exceeded
        logger.warn('Unable to save accessibility settings');
      }
    }, 300); // Debounced save

    return () => clearTimeout(timeoutId);
  }, [settings]);

  // Optimized CSS class management with reduced re-renders
  useEffect(() => {
    const root = document.documentElement;
    const classes = [];
    
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.reducedMotion) classes.push('reduced-motion');
    if (settings.largerText) classes.push('larger-text');
    if (settings.screenReaderMode) classes.push('screen-reader-mode');
    
    // Batch class updates to prevent multiple re-renders
    requestAnimationFrame(() => {
      root.classList.remove('high-contrast', 'reduced-motion', 'larger-text', 'screen-reader-mode');
      if (classes.length > 0) {
        root.classList.add(...classes);
      }
    });
  }, [settings]);

  // Optimized reduced motion detection with system preference
  useEffect(() => {
    if (settings.reducedMotion) return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    
    // Memory-efficient event listener
    const handler = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [settings.reducedMotion]);

  // Optimized click-outside detection
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  // Optimized DOM observation for accessibility
  useEffect(() => {
    if (!settings.screenReaderMode) return;
    
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Add live region announcements for screen readers
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (!element.getAttribute('aria-live')) {
                element.setAttribute('aria-live', 'polite');
              }
            }
          });
        }
      });
    });
    
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [settings.screenReaderMode]);

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Optimized toast notifications
    const messages = {
      highContrast: value ? 'High contrast mode enabled' : 'High contrast mode disabled',
      reducedMotion: value ? 'Reduced motion enabled' : 'Reduced motion disabled',
      largerText: value ? 'Larger text enabled' : 'Larger text disabled',
      screenReaderMode: value ? 'Screen reader mode enabled' : 'Screen reader mode disabled'
    };
    
    toast.success(messages[key], {
      duration: 2000,
      position: 'bottom-right'
    });
  }, []);

  const settingsConfig = useMemo(() => [
    {
      key: 'highContrast' as const,
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Eye
    },
    {
      key: 'reducedMotion' as const,
      label: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: Palette
    },
    {
      key: 'largerText' as const,
      label: 'Larger Text',
      description: 'Increase text size for better readability',
      icon: Accessibility
    },
    {
      key: 'screenReaderMode' as const,
      label: 'Screen Reader Mode',
      description: 'Optimize for screen readers',
      icon: Volume2
    }
  ], []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Accessibility className="h-4 w-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 rounded-md border bg-popover text-popover-foreground shadow-md z-50"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Accessibility Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 hover:bg-accent"
                  aria-label="Close accessibility menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {settingsConfig.map((item) => {
                  const Icon = item.icon;
                  const value = settings[item.key];
                  
                  return (
                    <div key={item.key} className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={item.key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                          <button
                            id={item.key}
                            role="switch"
                            aria-checked={value}
                            onClick={() => updateSetting(item.key, !value)}
                            className={`inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              value ? 'bg-primary' : 'bg-input'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Optimized accessibility button with reduced re-renders
 */
export function AccessibilityButtonOptimized() {
  return <AccessibilityMenuOptimized />;
}
