/**
 * Device Simulation Utilities
 *
 * Utilities for simulating low-end device conditions for performance testing
 */

/**
 * CPU throttling simulation
 */
export class CPUThrottler {
  private throttleFactor: number
  private isActive: boolean = false

  constructor(throttleFactor: number = 4) {
    this.throttleFactor = throttleFactor
  }

  /**
   * Start CPU throttling simulation
   */
  start(): void {
    if (this.isActive) {
      console.warn('[CPUThrottler] Already active')
      return
    }

    this.isActive = true
    console.log(`[CPUThrottler] Simulating ${this.throttleFactor}x CPU slowdown`)
  }

  /**
   * Stop CPU throttling simulation
   */
  stop(): void {
    this.isActive = false
    console.log('[CPUThrottler] Stopped CPU throttling')
  }

  /**
   * Execute a function with CPU throttling
   */
  async throttledExecute<T>(fn: () => T | Promise<T>): Promise<T> {
    if (!this.isActive) {
      return Promise.resolve(fn())
    }

    const start = performance.now()
    const result = await Promise.resolve(fn())
    const elapsed = performance.now() - start

    // Simulate slowdown by adding artificial delay
    const delay = elapsed * (this.throttleFactor - 1)
    await this.sleep(delay)

    return result
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Create a busy-wait loop to simulate CPU load
   */
  busyWait(ms: number): void {
    const start = Date.now()
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }
}

/**
 * Memory constraints simulation
 */
export class MemoryConstraints {
  private maxMemoryMB: number
  private allocatedMemory: any[] = []
  private isActive: boolean = false

  constructor(maxMemoryMB: number = 512) {
    this.maxMemoryMB = maxMemoryMB
  }

  /**
   * Start memory constraints
   */
  start(): void {
    if (this.isActive) {
      console.warn('[MemoryConstraints] Already active')
      return
    }

    this.isActive = true
    console.log(`[MemoryConstraints] Limiting memory to ${this.maxMemoryMB}MB`)
  }

  /**
   * Stop memory constraints
   */
  stop(): void {
    this.isActive = false
    this.allocatedMemory = []
    console.log('[MemoryConstraints] Stopped memory constraints')
  }

  /**
   * Check if current memory usage is within limits
   */
  isWithinLimits(): boolean {
    if (!this.isActive || !performance.memory) {
      return true
    }

    const usedMB = performance.memory.usedJSHeapSize / 1024 / 1024
    return usedMB < this.maxMemoryMB
  }

  /**
   * Get current memory usage in MB
   */
  getCurrentUsageMB(): number {
    if (!performance.memory) {
      return 0
    }

    return performance.memory.usedJSHeapSize / 1024 / 1024
  }

  /**
   * Allocate memory to simulate pressure
   */
  allocateMemory(sizeMB: number): void {
    const bytes = sizeMB * 1024 * 1024
    const buffer = new Array(bytes / 8).fill(0)
    this.allocatedMemory.push(buffer)
  }

  /**
   * Free allocated memory
   */
  freeMemory(): void {
    this.allocatedMemory = []
  }
}

/**
 * Network throttling simulation
 */
export class NetworkThrottler {
  private profile: NetworkProfile
  private isActive: boolean = false

  constructor(profile: NetworkProfile = NETWORK_PROFILES.slow3G) {
    this.profile = profile
  }

  /**
   * Start network throttling
   */
  start(): void {
    if (this.isActive) {
      console.warn('[NetworkThrottler] Already active')
      return
    }

    this.isActive = true
    console.log(`[NetworkThrottler] Simulating ${this.profile.name} network`)
  }

  /**
   * Stop network throttling
   */
  stop(): void {
    this.isActive = false
    console.log('[NetworkThrottler] Stopped network throttling')
  }

  /**
   * Simulate network delay for a fetch
   */
  async throttledFetch(url: string, options?: RequestInit): Promise<Response> {
    if (!this.isActive) {
      return fetch(url, options)
    }

    // Add latency
    await this.sleep(this.profile.latency)

    const response = await fetch(url, options)

    // Simulate bandwidth limitation
    if (this.profile.downloadSpeed > 0) {
      const clonedResponse = response.clone()
      const blob = await clonedResponse.blob()
      const bytes = blob.size
      const downloadTime = (bytes * 8) / this.profile.downloadSpeed // bits / bits per second
      await this.sleep(downloadTime * 1000)
    }

    return response
  }

  /**
   * Simulate network delay
   */
  async simulateDelay(): Promise<void> {
    if (!this.isActive) {
      return
    }

    await this.sleep(this.profile.latency)
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Network profile configuration
 */
export interface NetworkProfile {
  name: string
  downloadSpeed: number // bits per second
  uploadSpeed: number // bits per second
  latency: number // milliseconds
  packetLoss: number // percentage
}

/**
 * Predefined network profiles
 */
export const NETWORK_PROFILES: Record<string, NetworkProfile> = {
  offline: {
    name: 'Offline',
    downloadSpeed: 0,
    uploadSpeed: 0,
    latency: 0,
    packetLoss: 100,
  },
  slow3G: {
    name: 'Slow 3G',
    downloadSpeed: 400 * 1024, // 400 Kbps
    uploadSpeed: 400 * 1024,
    latency: 400,
    packetLoss: 0,
  },
  fast3G: {
    name: 'Fast 3G',
    downloadSpeed: 1.6 * 1024 * 1024, // 1.6 Mbps
    uploadSpeed: 750 * 1024,
    latency: 150,
    packetLoss: 0,
  },
  slow4G: {
    name: 'Slow 4G',
    downloadSpeed: 4 * 1024 * 1024, // 4 Mbps
    uploadSpeed: 3 * 1024 * 1024,
    latency: 100,
    packetLoss: 0,
  },
  fast4G: {
    name: 'Fast 4G',
    downloadSpeed: 10 * 1024 * 1024, // 10 Mbps
    uploadSpeed: 5 * 1024 * 1024,
    latency: 50,
    packetLoss: 0,
  },
  wifi: {
    name: 'WiFi',
    downloadSpeed: 30 * 1024 * 1024, // 30 Mbps
    uploadSpeed: 15 * 1024 * 1024,
    latency: 10,
    packetLoss: 0,
  },
}

/**
 * Viewport size presets for mobile devices
 */
export interface ViewportSize {
  width: number
  height: number
  devicePixelRatio: number
  name: string
}

export const VIEWPORT_SIZES: Record<string, ViewportSize> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    devicePixelRatio: 2,
  },
  mobileSmall: {
    name: 'Mobile Small',
    width: 320,
    height: 568,
    devicePixelRatio: 2,
  },
  mobileLarge: {
    name: 'Mobile Large',
    width: 414,
    height: 896,
    devicePixelRatio: 3,
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    devicePixelRatio: 2,
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    devicePixelRatio: 1,
  },
}

/**
 * Device simulation manager
 */
export class DeviceSimulator {
  private cpuThrottler: CPUThrottler
  private memoryConstraints: MemoryConstraints
  private networkThrottler: NetworkThrottler
  private viewport: ViewportSize | null = null

  constructor(options: DeviceSimulationOptions = {}) {
    this.cpuThrottler = new CPUThrottler(options.cpuThrottleFactor || 1)
    this.memoryConstraints = new MemoryConstraints(options.maxMemoryMB || 512)
    this.networkThrottler = new NetworkThrottler(
      options.networkProfile || NETWORK_PROFILES.wifi
    )
  }

  /**
   * Start device simulation
   */
  start(): void {
    if (this.cpuThrottler) {
      this.cpuThrottler.start()
    }
    if (this.memoryConstraints) {
      this.memoryConstraints.start()
    }
    if (this.networkThrottler) {
      this.networkThrottler.start()
    }
    console.log('[DeviceSimulator] Started device simulation')
  }

  /**
   * Stop device simulation
   */
  stop(): void {
    if (this.cpuThrottler) {
      this.cpuThrottler.stop()
    }
    if (this.memoryConstraints) {
      this.memoryConstraints.stop()
    }
    if (this.networkThrottler) {
      this.networkThrottler.stop()
    }
    console.log('[DeviceSimulator] Stopped device simulation')
  }

  /**
   * Set viewport size
   */
  setViewport(viewport: ViewportSize): void {
    this.viewport = viewport
    console.log(`[DeviceSimulator] Set viewport to ${viewport.name} (${viewport.width}x${viewport.height})`)
  }

  /**
   * Get CPU throttler
   */
  getCPUThrottler(): CPUThrottler {
    return this.cpuThrottler
  }

  /**
   * Get memory constraints
   */
  getMemoryConstraints(): MemoryConstraints {
    return this.memoryConstraints
  }

  /**
   * Get network throttler
   */
  getNetworkThrottler(): NetworkThrottler {
    return this.networkThrottler
  }
}

/**
 * Device simulation options
 */
export interface DeviceSimulationOptions {
  cpuThrottleFactor?: number
  maxMemoryMB?: number
  networkProfile?: NetworkProfile
  viewport?: ViewportSize
}

/**
 * Predefined device profiles
 */
export const DEVICE_PROFILES: Record<string, DeviceSimulationOptions> = {
  highEnd: {
    cpuThrottleFactor: 1,
    maxMemoryMB: 8192,
    networkProfile: NETWORK_PROFILES.wifi,
    viewport: VIEWPORT_SIZES.desktop,
  },
  midRange: {
    cpuThrottleFactor: 2,
    maxMemoryMB: 2048,
    networkProfile: NETWORK_PROFILES.fast4G,
    viewport: VIEWPORT_SIZES.mobile,
  },
  lowEnd: {
    cpuThrottleFactor: 4,
    maxMemoryMB: 512,
    networkProfile: NETWORK_PROFILES.slow3G,
    viewport: VIEWPORT_SIZES.mobileSmall,
  },
  veryLowEnd: {
    cpuThrottleFactor: 6,
    maxMemoryMB: 256,
    networkProfile: NETWORK_PROFILES.slow3G,
    viewport: VIEWPORT_SIZES.mobileSmall,
  },
}

/**
 * Create device simulator with profile
 */
export function createDeviceSimulator(
  profile: keyof typeof DEVICE_PROFILES | DeviceSimulationOptions
): DeviceSimulator {
  const options = typeof profile === 'string' ? DEVICE_PROFILES[profile] : profile
  return new DeviceSimulator(options)
}
