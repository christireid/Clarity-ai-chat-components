/**
 * Smart Loading Prediction Utility for Skeleton Components
 */

export class LoadingPredictor {
  private static instance: LoadingPredictor
  private history: Array<{ timestamp: number; duration: number }> = []
  private readonly maxHistory = 10

  static getInstance(): LoadingPredictor {
    if (!LoadingPredictor.instance) {
      LoadingPredictor.instance = new LoadingPredictor()
    }
    return LoadingPredictor.instance
  }

  predictDuration(): number {
    if (this.history.length === 0) return 2000 // Default 2 seconds

    const recentHistory = this.history.slice(-this.maxHistory)
    const averageDuration =
      recentHistory.reduce((sum, item) => sum + item.duration, 0) /
      recentHistory.length

    // Add some variance based on recent trends
    const trend = this.getTrend()
    return Math.max(500, averageDuration + trend * 200)
  }

  recordLoadingDuration(duration: number): void {
    this.history.push({
      timestamp: Date.now(),
      duration,
    })

    // Keep only recent history
    if (this.history.length > this.maxHistory * 2) {
      this.history = this.history.slice(-this.maxHistory)
    }
  }

  private getTrend(): number {
    if (this.history.length < 2) return 0

    const recent = this.history.slice(-5)
    const older = this.history.slice(-10, -5)

    if (recent.length === 0 || older.length === 0) return 0

    const recentAverage =
      recent.reduce((sum, item) => sum + item.duration, 0) / recent.length
    const olderAverage =
      older.reduce((sum, item) => sum + item.duration, 0) / older.length

    return (recentAverage - olderAverage) / olderAverage
  }
}
