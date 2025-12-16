/**
 * Clarity Chat - Enhanced Animation Constants (2025)
 *
 * Advanced animation configurations implementing 2025 trends:
 * - Quantum-inspired physics
 * - Aurora gradient flows
 * - Glassmorphic transitions
 * - Neumorphic depth animations
 * - AI-powered adaptive timing
 */

/**
 * Quantum-inspired animation properties
 */
export interface QuantumAnimation {
  duration: number
  easing: string
  delay?: number
  stagger?: number
  physics?: {
    mass?: number
    stiffness?: number
    damping?: number
    velocity?: number
  }
}

/**
 * Aurora flow animation properties
 */
export interface AuroraAnimation {
  gradient: string
  duration: number
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial'
  speed: 'slow' | 'medium' | 'fast' | 'pulse'
  intensity: number
}

/**
 * Glassmorphism animation properties
 */
export interface GlassmorphismAnimation {
  blur: {
    initial: number
    animate: number
    duration: number
  }
  transparency: {
    initial: number
    animate: number
  }
  backdrop: {
    initial: string
    animate: string
  }
}

/**
 * Neumorphism depth animation
 */
export interface NeumorphismAnimation {
  depth: {
    initial: number
    animate: number
    duration: number
  }
  shadows: {
    light: {
      initial: string
      animate: string
    }
    dark: {
      initial: string
      animate: string
    }
  }
  highlight: {
    initial: number
    animate: number
  }
}

/**
 * AI-powered adaptive animation
 */
export interface AdaptiveAnimation {
  base: QuantumAnimation
  aiFactors: {
    userEngagement: number
    messageLength: number
    typingSpeed: number
    conversationContext: number
    timeOfDay: number
  }
  adjustments: {
    durationMultiplier: number
    easingFunction: string
    delayOffset: number
  }
}

/**
 * 2025 Animation presets
 */
export const animationPresets2025 = {
  /**
   * Quantum-inspired micro-interactions
   */
  quantum: {
    duration: {
      instant: 0,
      micro: 100,
      fast: 200,
      normal: 350,
      slow: 600,
      dramatic: 1000,
      epic: 2000,
    },
    easing: {
      quantum: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      magnetic: 'cubic-bezier(0.4, 0, 0.2, 1)',
      entangle: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      wave: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      particle: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      aurora: 'cubic-bezier(0.65, 0, 0.35, 1)',
      glass: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      neumorphic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    physics: {
      mass: 1,
      stiffness: 100,
      damping: 10,
      velocity: 0,
    },
  },

  /**
   * Aurora gradient animations
   */
  aurora: {
    gradients: {
      dawn: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      noon: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
      dusk: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      midnight: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      aurora: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)',
      flow: 'linear-gradient(60deg, #667eea, #764ba2, #f093fb, #f5576c)',
      pulse: 'linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71, #3498db, #9b59b6)',
    },
    speeds: {
      slow: 8000,
      medium: 5000,
      fast: 3000,
      pulse: 2000,
    },
    directions: {
      horizontal: '90deg',
      vertical: '180deg',
      diagonal: '135deg',
      radial: 'circle',
    },
  },

  /**
   * Glassmorphism animations
   */
  glassmorphism: {
    blur: {
      subtle: 10,
      normal: 20,
      strong: 30,
      intense: 50,
    },
    transparency: {
      subtle: 0.1,
      normal: 0.2,
      strong: 0.3,
      intense: 0.5,
    },
    backdrop: {
      light: 'blur(20px)',
      medium: 'blur(30px)',
      strong: 'blur(40px)',
      intense: 'blur(60px)',
    },
    transitions: {
      quick: 'all 0.2s ease',
      smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fluid: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  /**
   * Neumorphism depth animations
   */
  neumorphism: {
    depth: {
      shallow: 2,
      normal: 5,
      deep: 8,
      extreme: 12,
    },
    shadows: {
      light: 'rgba(255,255,255,0.7)',
      dark: 'rgba(0,0,0,0.1)',
      highlight: 'rgba(255,255,255,0.9)',
      lowlight: 'rgba(0,0,0,0.15)',
    },
    transitions: {
      soft: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      gentle: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      subtle: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  /**
   * AI-powered adaptive animations
   */
  adaptive: {
    factors: {
      userEngagement: 1.0,
      messageLength: 0.8,
      typingSpeed: 1.2,
      conversationContext: 0.9,
      timeOfDay: 1.1,
    },
    adjustments: {
      durationMultiplier: 1.0,
      easingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delayOffset: 0,
    },
    learning: {
      userPreference: 0.85,
      contextAwareness: 0.75,
      predictiveTiming: 0.9,
    },
  },

  /**
   * Message-specific animations
   */
  message: {
    incoming: {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      stagger: 50,
      physics: { mass: 1, stiffness: 120, damping: 12 },
    },
    outgoing: {
      duration: 350,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      stagger: 30,
      physics: { mass: 1, stiffness: 100, damping: 10 },
    },
    typing: {
      duration: 2500,
      easing: 'linear',
      pulse: {
        duration: 1500,
        delay: 200,
      },
    },
    reaction: {
      duration: 200,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      scale: [1, 1.2, 1],
    },
  },

  /**
   * Chat input animations
   */
  input: {
    focus: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      scale: 1.02,
    },
    typing: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pulse: {
        duration: 1000,
        intensity: 0.1,
      },
    },
    voice: {
      recording: {
        duration: 200,
        easing: 'ease-in-out',
        scale: [1, 1.1, 1],
      },
      waveform: {
        duration: 100,
        easing: 'linear',
        frequency: 60,
      },
    },
  },

  /**
   * Button and interactive element animations
   */
  interactive: {
    hover: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      scale: 1.05,
      brightness: 1.1,
    },
    active: {
      duration: 100,
      easing: 'ease-out',
      scale: 0.95,
      brightness: 0.9,
    },
    loading: {
      duration: 800,
      easing: 'linear',
      rotation: 360,
    },
  },

  /**
   * Scroll and navigation animations
   */
  navigation: {
    scroll: {
      duration: 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      offset: 100,
    },
    transition: {
      duration: 300,
      easing: 'ease-in-out',
      fade: {
        duration: 250,
        delay: 50,
      },
    },
    swipe: {
      duration: 200,
      easing: 'ease-out',
      threshold: 50,
    },
  },

  /**
   * Error and status animations
   */
  status: {
    error: {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      shake: {
        intensity: 5,
        duration: 500,
      },
    },
    success: {
      duration: 300,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      bounce: {
        scale: [1, 1.1, 1],
        duration: 400,
      },
    },
    warning: {
      duration: 350,
      easing: 'ease-in-out',
      pulse: {
        scale: [1, 1.05, 1],
        duration: 1000,
      },
    },
  },

  /**
   * Particle and effect animations
   */
  effects: {
    particle: {
      duration: 2000,
      easing: 'linear',
      count: 50,
      spread: 360,
      gravity: 1,
    },
    ripple: {
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      scale: [0, 2],
      opacity: [0.5, 0],
    },
    glow: {
      duration: 1500,
      easing: 'ease-in-out',
      intensity: [0.3, 0.8, 0.3],
    },
    magnetic: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      attraction: 0.1,
      repulsion: 0.05,
    },
  },
}

/**
 * Animation keyframes for 2025 trends
 */
export const keyframes2025 = {
  /**
   * Aurora gradient animation
   */
  aurora: {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },

  /**
   * Glassmorphism shimmer
   */
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },

  /**
   * Neumorphic press
   */
  neumorphicPress: {
    '0%': { 
      boxShadow: '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)'
    },
    '50%': { 
      boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7)'
    },
    '100%': { 
      boxShadow: '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)'
    },
  },

  /**
   * Quantum entanglement
   */
  entangle: {
    '0%': { 
      transform: 'scale(1) rotate(0deg)',
      opacity: 1,
    },
    '50%': { 
      transform: 'scale(1.1) rotate(180deg)',
      opacity: 0.8,
    },
    '100%': { 
      transform: 'scale(1) rotate(360deg)',
      opacity: 1,
    },
  },

  /**
   * Particle explosion
   */
  particleExplosion: {
    '0%': { 
      transform: 'scale(0) rotate(0deg)',
      opacity: 1,
    },
    '100%': { 
      transform: 'scale(1) rotate(360deg)',
      opacity: 0,
    },
  },

  /**
   * Magnetic field
   */
  magneticField: {
    '0%': { 
      transform: 'scale(1)',
      filter: 'blur(0px)',
    },
    '50%': { 
      transform: 'scale(1.05)',
      filter: 'blur(2px)',
    },
    '100%': { 
      transform: 'scale(1)',
      filter: 'blur(0px)',
    },
  },

  /**
   * Wave function collapse
   */
  waveCollapse: {
    '0%': { 
      transform: 'scale(1) translateY(0)',
      opacity: 1,
    },
    '50%': { 
      transform: 'scale(0.95) translateY(-5px)',
      opacity: 0.8,
    },
    '100%': { 
      transform: 'scale(1) translateY(0)',
      opacity: 1,
    },
  },
}

/**
 * Utility functions for 2025 animations
 */
export const animationUtils2025 = {
  /**
   * Calculate adaptive animation duration based on AI factors
   */
  calculateAdaptiveDuration: (
    baseDuration: number,
    factors: typeof animationPresets2025.adaptive.factors
  ): number => {
    const multiplier = 
      factors.userEngagement * 0.3 +
      factors.messageLength * 0.2 +
      factors.typingSpeed * 0.25 +
      factors.conversationContext * 0.15 +
      factors.timeOfDay * 0.1
    
    return baseDuration * (0.8 + multiplier * 0.4)
  },

  /**
   * Generate aurora gradient based on time of day
   */
  generateAuroraGradient: (timeOfDay: 'morning' | 'noon' | 'evening' | 'night'): string => {
    const gradients = {
      morning: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      noon: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
      evening: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    }
    return gradients[timeOfDay]
  },

  /**
   * Create glassmorphism effect
   */
  createGlassEffect: (
    blur: number,
    transparency: number,
    borderOpacity: number
  ): string => {
    return `
      background: rgba(255, 255, 255, ${transparency});
      backdrop-filter: blur(${blur}px);
      border: 1px solid rgba(255, 255, 255, ${borderOpacity});
    `
  },

  /**
   * Create neumorphic shadow
   */
  createNeumorphicShadow: (
    depth: number,
    lightColor: string = 'rgba(255,255,255,0.7)',
    darkColor: string = 'rgba(0,0,0,0.1)'
  ): string => {
    return `${depth}px ${depth}px ${depth * 2}px ${darkColor}, -${depth}px -${depth}px ${depth * 2}px ${lightColor}`
  },
}

/**
 * Export animation constants
 */
export const duration = animationPresets2025.quantum.duration
export const easing = animationPresets2025.quantum.easing
export const keyframes = keyframes2025
export const animationUtils = animationUtils2025