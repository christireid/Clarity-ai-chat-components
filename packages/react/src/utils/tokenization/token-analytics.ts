import { TokenCounter } from '@clarity-chat/token-optimization';

export interface TokenAnalytics {
  totalTokens: number;
  totalRequests: number;
  averageTokens: number;
  medianTokens: number;
  minTokens: number;
  maxTokens: number;
  standardDeviation: number;
  tokenCounts: number[];
  timestamps: number[];
}

export interface TokenMetrics {
  current: TokenAnalytics;
  hourly: Record<string, TokenAnalytics>;
  daily: Record<string, TokenAnalytics>;
  model: Record<string, TokenAnalytics>;
}

export interface TokenUsageEvent {
  timestamp: number;
  tokens: number;
  model?: string;
  type: 'input' | 'output' | 'total';
  context?: string;
  sessionId?: string;
}

export interface TokenMonitoringConfig {
  enabled: boolean;
  maxEvents: number;
  retentionDays: number;
  alertThresholds: {
    hourly: number;
    daily: number;
    perRequest: number;
  };
  enableRealTimeAlerts: boolean;
  enableCostTracking: boolean;
  modelPricing?: Record<string, { input: number; output: number }>;
}

export interface TokenAlert {
  id: string;
  type: 'threshold_exceeded' | 'rate_limit' | 'unusual_usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
  context?: any;
}

/**
 * Token counting analytics and monitoring system
 */
export class TokenAnalyticsMonitor {
  private events: TokenUsageEvent[] = [];
  private alerts: TokenAlert[] = [];
  private config: TokenMonitoringConfig;
  private listeners: Array<(event: TokenUsageEvent) => void> = [];
  private alertListeners: Array<(alert: TokenAlert) => void> = [];

  constructor(config?: Partial<TokenMonitoringConfig>) {
    this.config = {
      enabled: true,
      maxEvents: 10000,
      retentionDays: 30,
      alertThresholds: {
        hourly: 100000, // 100k tokens per hour
        daily: 1000000, // 1M tokens per day
        perRequest: 50000 // 50k tokens per request
      },
      enableRealTimeAlerts: true,
      enableCostTracking: true,
      modelPricing: {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-4-turbo': { input: 0.01, output: 0.03 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'claude-3-sonnet': { input: 0.003, output: 0.015 },
        'gemini-pro': { input: 0.0005, output: 0.001 },
        'deepseek-chat': { input: 0.0002, output: 0.0004 }
      },
      ...config
    };
  }

  /**
   * Record token usage event
   */
  public recordUsage(event: Omit<TokenUsageEvent, 'timestamp'>): void {
    if (!this.config.enabled) return;

    const fullEvent: TokenUsageEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);
    this.cleanupOldEvents();
    this.checkAlerts(fullEvent);
    this.notifyListeners(fullEvent);
  }

  /**
   * Record multiple usage events
   */
  public recordUsages(events: Omit<TokenUsageEvent, 'timestamp'>[]): void {
    events.forEach(event => this.recordUsage(event));
  }

  /**
   * Get current analytics
   */
  public getAnalytics(): TokenAnalytics {
    const now = Date.now();
    const recentEvents = this.events.filter(
      event => now - event.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const tokenCounts = recentEvents.map(event => event.tokens);
    
    if (tokenCounts.length === 0) {
      return this.getEmptyAnalytics();
    }

    const sortedCounts = [...tokenCounts].sort((a, b) => a - b);
    const totalTokens = tokenCounts.reduce((sum, count) => sum + count, 0);
    const average = totalTokens / tokenCounts.length;
    const median = this.calculateMedian(sortedCounts);
    const min = Math.min(...tokenCounts);
    const max = Math.max(...tokenCounts);
    const standardDeviation = this.calculateStandardDeviation(tokenCounts, average);

    return {
      totalTokens,
      totalRequests: tokenCounts.length,
      averageTokens: average,
      medianTokens: median,
      minTokens: min,
      maxTokens: max,
      standardDeviation,
      tokenCounts,
      timestamps: recentEvents.map(event => event.timestamp)
    };
  }

  /**
   * Get hourly analytics
   */
  public getHourlyAnalytics(): Record<string, TokenAnalytics> {
    const hourlyEvents: Record<string, TokenUsageEvent[]> = {};
    
    this.events.forEach(event => {
      const hourKey = this.getHourKey(event.timestamp);
      if (!hourlyEvents[hourKey]) {
        hourlyEvents[hourKey] = [];
      }
      hourlyEvents[hourKey].push(event);
    });

    const hourlyAnalytics: Record<string, TokenAnalytics> = {};
    
    Object.entries(hourlyEvents).forEach(([hour, events]) => {
      const tokenCounts = events.map(event => event.tokens);
      hourlyAnalytics[hour] = this.calculateAnalytics(tokenCounts);
    });

    return hourlyAnalytics;
  }

  /**
   * Get daily analytics
   */
  public getDailyAnalytics(): Record<string, TokenAnalytics> {
    const dailyEvents: Record<string, TokenUsageEvent[]> = {};
    
    this.events.forEach(event => {
      const dayKey = this.getDayKey(event.timestamp);
      if (!dailyEvents[dayKey]) {
        dailyEvents[dayKey] = [];
      }
      dailyEvents[dayKey].push(event);
    });

    const dailyAnalytics: Record<string, TokenAnalytics> = {};
    
    Object.entries(dailyEvents).forEach(([day, events]) => {
      const tokenCounts = events.map(event => event.tokens);
      dailyAnalytics[day] = this.calculateAnalytics(tokenCounts);
    });

    return dailyAnalytics;
  }

  /**
   * Get model-specific analytics
   */
  public getModelAnalytics(): Record<string, TokenAnalytics> {
    const modelEvents: Record<string, TokenUsageEvent[]> = {};
    
    this.events.forEach(event => {
      if (event.model) {
        if (!modelEvents[event.model]) {
          modelEvents[event.model] = [];
        }
        modelEvents[event.model].push(event);
      }
    });

    const modelAnalytics: Record<string, TokenAnalytics> = {};
    
    Object.entries(modelEvents).forEach(([model, events]) => {
      const tokenCounts = events.map(event => event.tokens);
      modelAnalytics[model] = this.calculateAnalytics(tokenCounts);
    });

    return modelAnalytics;
  }

  /**
   * Get comprehensive metrics
   */
  public getMetrics(): TokenMetrics {
    return {
      current: this.getAnalytics(),
      hourly: this.getHourlyAnalytics(),
      daily: this.getDailyAnalytics(),
      model: this.getModelAnalytics()
    };
  }

  /**
   * Get cost analysis
   */
  public getCostAnalysis(): {
    totalCost: number;
    dailyCost: number;
    hourlyCost: number;
    modelCosts: Record<string, number>;
    projections: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  } {
    if (!this.config.enableCostTracking || !this.config.modelPricing) {
      return {
        totalCost: 0,
        dailyCost: 0,
        hourlyCost: 0,
        modelCosts: {},
        projections: { daily: 0, weekly: 0, monthly: 0 }
      };
    }

    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;

    // Calculate costs for different time periods
    const hourlyEvents = this.events.filter(e => e.timestamp > hourAgo);
    const dailyEvents = this.events.filter(e => e.timestamp > dayAgo);

    const hourlyCost = this.calculateCostForEvents(hourlyEvents);
    const dailyCost = this.calculateCostForEvents(dailyEvents);
    const totalCost = this.calculateCostForEvents(this.events);

    // Calculate model-specific costs
    const modelCosts: Record<string, number> = {};
    Object.keys(this.config.modelPricing!).forEach(model => {
      const modelEvents = this.events.filter(e => e.model === model);
      modelCosts[model] = this.calculateCostForEvents(modelEvents);
    });

    // Project future costs
    const hourlyRate = hourlyCost;
    const projections = {
      daily: hourlyRate * 24,
      weekly: hourlyRate * 24 * 7,
      monthly: hourlyRate * 24 * 30
    };

    return {
      totalCost,
      dailyCost,
      hourlyCost,
      modelCosts,
      projections
    };
  }

  /**
   * Get current alerts
   */
  public getAlerts(): TokenAlert[] {
    return [...this.alerts];
  }

  /**
   * Clear old alerts
   */
  public clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Add event listener
   */
  public addEventListener(listener: (event: TokenUsageEvent) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(listener: (event: TokenUsageEvent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Add alert listener
   */
  public addAlertListener(listener: (alert: TokenAlert) => void): void {
    this.alertListeners.push(listener);
  }

  /**
   * Get usage statistics
   */
  public getUsageStats(): {
    totalEvents: number;
    averageTokensPerEvent: number;
    peakUsageHour: string;
    peakUsageDay: string;
    mostUsedModel: string;
    usageTrend: 'increasing' | 'decreasing' | 'stable';
  } {
    const analytics = this.getAnalytics();
    const hourly = this.getHourlyAnalytics();
    const daily = this.getDailyAnalytics();
    const model = this.getModelAnalytics();

    // Find peak usage hour
    let peakHour = '';
    let maxHourlyTokens = 0;
    Object.entries(hourly).forEach(([hour, data]) => {
      if (data.totalTokens > maxHourlyTokens) {
        maxHourlyTokens = data.totalTokens;
        peakHour = hour;
      }
    });

    // Find peak usage day
    let peakDay = '';
    let maxDailyTokens = 0;
    Object.entries(daily).forEach(([day, data]) => {
      if (data.totalTokens > maxDailyTokens) {
        maxDailyTokens = data.totalTokens;
        peakDay = day;
      }
    });

    // Find most used model
    let mostUsedModel = '';
    let maxModelTokens = 0;
    Object.entries(model).forEach(([modelName, data]) => {
      if (data.totalTokens > maxModelTokens) {
        maxModelTokens = data.totalTokens;
        mostUsedModel = modelName;
      }
    });

    // Determine usage trend (simple comparison of last 7 days)
    const dailyKeys = Object.keys(daily).sort();
    const recentDays = dailyKeys.slice(-7);
    const olderDays = dailyKeys.slice(-14, -7);

    const recentTotal = recentDays.reduce((sum, day) => 
      sum + (daily[day]?.totalTokens || 0), 0
    );
    const olderTotal = olderDays.reduce((sum, day) => 
      sum + (daily[day]?.totalTokens || 0), 0
    );

    let usageTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentTotal > olderTotal * 1.2) usageTrend = 'increasing';
    if (recentTotal < olderTotal * 0.8) usageTrend = 'decreasing';

    return {
      totalEvents: analytics.totalRequests,
      averageTokensPerEvent: analytics.averageTokens,
      peakUsageHour: peakHour,
      peakUsageDay: peakDay,
      mostUsedModel: mostUsedModel,
      usageTrend
    };
  }

  /**
   * Check for alerts
   */
  private checkAlerts(event: TokenUsageEvent): void {
    if (!this.config.enableRealTimeAlerts) return;

    // Check per-request threshold
    if (event.tokens > this.config.alertThresholds.perRequest) {
      this.createAlert('threshold_exceeded', 'high', 
        `Large token usage detected: ${event.tokens} tokens`,
        event.tokens,
        this.config.alertThresholds.perRequest,
        { event }
      );
    }

    // Check hourly threshold
    const hourAgo = event.timestamp - 60 * 60 * 1000;
    const hourlyTokens = this.events
      .filter(e => e.timestamp > hourAgo)
      .reduce((sum, e) => sum + e.tokens, 0);

    if (hourlyTokens > this.config.alertThresholds.hourly) {
      this.createAlert('threshold_exceeded', 'medium',
        `Hourly token threshold exceeded: ${hourlyTokens} tokens`,
        hourlyTokens,
        this.config.alertThresholds.hourly
      );
    }

    // Check for unusual usage patterns
    this.checkUnusualPatterns(event);
  }

  /**
   * Check for unusual usage patterns
   */
  private checkUnusualPatterns(event: TokenUsageEvent): void {
    // Compare with recent average
    const recentEvents = this.events
      .filter(e => e.timestamp > event.timestamp - 60 * 60 * 1000) // Last hour
      .filter(e => e.type === event.type && e.model === event.model);

    if (recentEvents.length < 5) return; // Not enough data

    const recentTokens = recentEvents.map(e => e.tokens);
    const average = recentTokens.reduce((sum, t) => sum + t, 0) / recentTokens.length;
    const deviation = Math.abs(event.tokens - average) / average;

    if (deviation > 2) { // More than 200% deviation
      this.createAlert('unusual_usage', 'low',
        `Unusual token usage detected: ${event.tokens} tokens (avg: ${average.toFixed(0)})`,
        event.tokens,
        average * 2,
        { event, average, deviation }
      );
    }
  }

  /**
   * Create alert
   */
  private createAlert(
    type: TokenAlert['type'],
    severity: TokenAlert['severity'],
    message: string,
    value: number,
    threshold: number,
    context?: any
  ): void {
    const alert: TokenAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: Date.now(),
      value,
      threshold,
      context
    };

    this.alerts.push(alert);
    this.notifyAlertListeners(alert);
  }

  /**
   * Notify event listeners
   */
  private notifyListeners(event: TokenUsageEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.warn('Error in token usage event listener:', error);
      }
    });
  }

  /**
   * Notify alert listeners
   */
  private notifyAlertListeners(alert: TokenAlert): void {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.warn('Error in token alert listener:', error);
      }
    });
  }

  /**
   * Clean up old events
   */
  private cleanupOldEvents(): void {
    const cutoff = Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000;
    this.events = this.events.filter(event => event.timestamp > cutoff);

    // Keep only maxEvents
    if (this.events.length > this.config.maxEvents) {
      this.events = this.events.slice(-this.config.maxEvents);
    }
  }

  /**
   * Calculate analytics for token counts
   */
  private calculateAnalytics(tokenCounts: number[]): TokenAnalytics {
    if (tokenCounts.length === 0) {
      return this.getEmptyAnalytics();
    }

    const sortedCounts = [...tokenCounts].sort((a, b) => a - b);
    const totalTokens = tokenCounts.reduce((sum, count) => sum + count, 0);
    const average = totalTokens / tokenCounts.length;
    const median = this.calculateMedian(sortedCounts);
    const min = Math.min(...tokenCounts);
    const max = Math.max(...tokenCounts);
    const standardDeviation = this.calculateStandardDeviation(tokenCounts, average);

    return {
      totalTokens,
      totalRequests: tokenCounts.length,
      averageTokens: average,
      medianTokens: median,
      minTokens: min,
      maxTokens: max,
      standardDeviation,
      tokenCounts,
      timestamps: []
    };
  }

  /**
   * Calculate cost for events
   */
  private calculateCostForEvents(events: TokenUsageEvent[]): number {
    if (!this.config.modelPricing) return 0;

    let totalCost = 0;
    const modelEvents: Record<string, TokenUsageEvent[]> = {};

    // Group events by model
    events.forEach(event => {
      if (event.model) {
        if (!modelEvents[event.model]) {
          modelEvents[event.model] = [];
        }
        modelEvents[event.model].push(event);
      }
    });

    // Calculate cost per model
    Object.entries(modelEvents).forEach(([model, modelEventsList]) => {
      const pricing = this.config.modelPricing![model];
      if (pricing) {
        const totalTokens = modelEventsList.reduce((sum, e) => sum + e.tokens, 0);
        const costPerToken = event.type === 'output' ? pricing.output : pricing.input;
        totalCost += (totalTokens * costPerToken) / 1000; // Convert to dollars
      }
    });

    return totalCost;
  }

  /**
   * Calculate median
   */
  private calculateMedian(sortedArray: number[]): number {
    const mid = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 === 0
      ? (sortedArray[mid - 1] + sortedArray[mid]) / 2
      : sortedArray[mid];
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Get hour key from timestamp
   */
  private getHourKey(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
  }

  /**
   * Get day key from timestamp
   */
  private getDayKey(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Get empty analytics
   */
  private getEmptyAnalytics(): TokenAnalytics {
    return {
      totalTokens: 0,
      totalRequests: 0,
      averageTokens: 0,
      medianTokens: 0,
      minTokens: 0,
      maxTokens: 0,
      standardDeviation: 0,
      tokenCounts: [],
      timestamps: []
    };
  }
}

// Export singleton instance
export const tokenAnalyticsMonitor = new TokenAnalyticsMonitor();

// Convenience functions
export function recordTokenUsage(
  tokens: number,
  model?: string,
  type: TokenUsageEvent['type'] = 'total'
) {
  tokenAnalyticsMonitor.recordUsage({
    tokens,
    model,
    type
  });
}

export function getTokenAnalytics() {
  return tokenAnalyticsMonitor.getAnalytics();
}

export function getTokenMetrics() {
  return tokenAnalyticsMonitor.getMetrics();
}