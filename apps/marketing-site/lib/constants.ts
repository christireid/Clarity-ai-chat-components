// Animation duration constants for consistent motion design
export const durations = {
  fast: 0.2,
  normal: 0.3,
  moderate: 0.3,
  slow: 0.5,
  slower: 1.5,
} as const

// Easing functions
export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
} as const
