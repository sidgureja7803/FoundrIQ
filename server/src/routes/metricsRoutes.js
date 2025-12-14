/**
 * Metrics Routes - For AI API usage tracking
 */

import express from 'express';
const router = express.Router();

/**
 * @route GET /api/metrics/ai
 * @description Get AI API usage metrics
 * @access Public
 */
router.get('/metrics/ai', (req, res) => {
  // Simple metrics response for Perplexity
  const metrics = {
    service: 'Perplexity AI',
    status: 'operational',
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: {
      metrics,
      metadata: {
        service: 'FoundrIQ Startup Validation',
        platform: 'Perplexity',
        timestamp: metrics.timestamp
      }
    }
  });
});

/**
 * @route GET /api/metrics/health
 * @description Health check for metrics service
 * @access Public
 */
router.get('/metrics/health', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    service: 'Metrics API',
    timestamp: new Date().toISOString()
  });
});

export default router;
