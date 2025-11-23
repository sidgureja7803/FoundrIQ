/**
 * Idea Routes
 * Handles all idea-related API endpoints
 */

import express from 'express';
import ideaController from '../controllers/ideaController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Create a new idea
router.post('/', ideaController.createIdea);

// Get all ideas for current user
router.get('/my-ideas', ideaController.getUserIdeas);

// Get all public ideas
router.get('/public', ideaController.getPublicIdeas);

// Get idea by ID
router.get('/:ideaId', ideaController.getIdea);

// Update idea
router.put('/:ideaId', ideaController.updateIdea);

// Delete idea
router.delete('/:ideaId', ideaController.deleteIdea);

// Get job status
router.get('/job/:jobId', ideaController.getJobStatus);

export default router;