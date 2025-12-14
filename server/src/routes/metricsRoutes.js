/**
 * Metrics Routes - For IBM Granite API usage tracking
 */

import express from 'express';
const router = express.Router();

/**
 * @route GET /api/metrics/ibm-granite
 * @description Get IBM Granite API usage metrics
 * @access Public
 */
router.get('/metrics/ibm-granite', (req, res) => {
  // Simple metrics response for IBM Granite
  const metrics = {
    service: 'IBM Granite (Watson)',
    status: 'operational',
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: {
      metrics,
      metadata: {
        service: 'FoundrIQ Startup Validation',
        platform: 'IBM Granite',
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
