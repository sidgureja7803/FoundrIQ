// ============================================
// IMPORTANT: Load .env FIRST before any other imports!
// ============================================
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file BEFORE importing anything else
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

// Now import everything else AFTER .env is loaded
import express from 'express';
import cors from 'cors';
import http from 'http';
import socketManager from './utils/socketManager.js';

// Import routes (these will now have access to env vars)
import ideaRoutesV2 from './routes/ideaRoutes.js';
import streamingRoutes from './routes/streamingRoutes.js';
import copilotRoutes from './routes/copilotRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutesV2 from './routes/authRoutes.js';
import metricsRoutes from './routes/metrics.js';
import ideaRefinerRoutes from './routes/ideaRefinerRoutes.js';
import evidenceExtractorRoutes from './routes/evidenceExtractorRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import aiRoutes from './routes/ai.js';

// Check for required environment variables
const baseRequiredVars = [
  'APPWRITE_API_KEY',
  'APPWRITE_PROJECT_ID',
  'APPWRITE_ENDPOINT',
  'APPWRITE_DATABASE_ID'
];

// Perplexity is the AI provider
const aiRequiredVars = [
  'PERPLEXITY_API_KEY'
];

const requiredVars = [...baseRequiredVars, ...aiRequiredVars];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please add them to your .env file');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize socket.io
socketManager.initialize(server);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  const requiredServices = {
    appwrite: process.env.APPWRITE_API_KEY && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_DATABASE_ID,
    perplexityAI: process.env.PERPLEXITY_API_KEY ? true : false,
    tavily: process.env.TAVILY_API_KEY ? true : undefined
  };

  const missingServices = Object.entries(requiredServices)
    .filter(([_, isConfigured]) => isConfigured === false)
    .map(([name]) => name);

  const status = missingServices.length === 0 ? 'OK' : 'DEGRADED';

  res.json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      appwrite: requiredServices.appwrite ? 'configured' : 'missing configuration',
      perplexityAI: requiredServices.perplexityAI ? 'configured' : 'missing configuration',
      tavily: requiredServices.tavily ? 'configured' : 'not configured',
      storage: process.env.APPWRITE_REPORTS_BUCKET_ID ? 'configured' : 'not configured'
    },
    missingServices: missingServices.length > 0 ? missingServices : undefined
  });
});

// Routes
app.use('/api/ideas', ideaRoutesV2);
app.use('/api/streaming', streamingRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutesV2);
app.use('/api/metrics', metricsRoutes);
app.use('/api/refiner', ideaRefinerRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/evidence', evidenceExtractorRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log('\n🚀 FoundrIQ Server Started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🤖 AI: Perplexity Sonar`);
  console.log(`🔍 Search: ${process.env.TAVILY_API_KEY ? '✓ Tavily' : '✗ Tavily (API key missing)'}`);
  console.log(`📝 Auth: Appwrite (${process.env.APPWRITE_DATABASE_ID.substring(0, 8)}...)\n`);
});

export default app;