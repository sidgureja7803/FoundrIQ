/**
 * Worker and metrics management for background tasks
 */

// Simple in-memory metrics tracker
export const metrics = {
  totalRequests: 0,
  avgLatencyMs: 0,
  latencies: [],
  
  /**
   * Record a request latency
   * @param {number} latencyMs - Request latency in milliseconds
   */
  recordLatency(latencyMs) {
    this.totalRequests++;
    this.latencies.push(latencyMs);
    
    // Keep only last 100 latencies to prevent memory issues
    if (this.latencies.length > 100) {
      this.latencies.shift();
    }
    
    // Calculate average latency
    const sum = this.latencies.reduce((acc, val) => acc + val, 0);
    this.avgLatencyMs = Math.round(sum / this.latencies.length);
  },
  
  /**
   * Reset metrics
   */
  reset() {
    this.totalRequests = 0;
    this.avgLatencyMs = 0;
    this.latencies = [];
  }
};
