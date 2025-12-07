// Track performance metrics for optimization monitoring

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private enabled = process.env.NODE_ENV === "development"

  recordMetric(name: string, value: number, unit = "ms"): void {
    if (!this.enabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }

    this.metrics.push(metric)

    if (this.metrics.length > 1000) {
      // Keep only last 1000 metrics
      this.metrics = this.metrics.slice(-1000)
    }

    console.log(`[Performance] ${name}: ${value}${unit}`)
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics
  }

  getAverage(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name)
    if (filtered.length === 0) return 0
    return filtered.reduce((sum, m) => sum + m.value, 0) / filtered.length
  }

  clear(): void {
    this.metrics = []
  }

  logReport(): void {
    console.table(
      Array.from(new Set(this.metrics.map((m) => m.name)).values()).map((name) => ({
        metric: name,
        average: `${this.getAverage(name).toFixed(2)}ms`,
        count: this.metrics.filter((m) => m.name === name).length,
      })),
    )
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Measure function execution time
 */
export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    performanceMonitor.recordMetric(name, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    performanceMonitor.recordMetric(`${name}-error`, duration)
    throw error
  }
}

/**
 * Measure sync function execution time
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now()
  try {
    const result = fn()
    const duration = performance.now() - start
    performanceMonitor.recordMetric(name, duration)
    return result
  } catch (error) {
    const duration = performance.now() - start
    performanceMonitor.recordMetric(`${name}-error`, duration)
    throw error
  }
}
