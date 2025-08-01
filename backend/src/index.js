import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import ideaRoutes from './routes/ideas.js';
import analysisRoutes from './routes/analysis.js';
import reportRoutes from './routes/reports.js';
import streamingRoutes from './routes/streamingRoutes.js';
import copilotRoutes from './routes/copilotRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', ideaRoutes);
app.use('/api', analysisRoutes);
app.use('/api', reportRoutes);
app.use('/api', streamingRoutes);
app.use('/api', copilotRoutes);
app.use('/api', creditRoutes);
app.use('/api', adminRoutes);
app.use('/api/auth', authRoutes);

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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-buddy')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
