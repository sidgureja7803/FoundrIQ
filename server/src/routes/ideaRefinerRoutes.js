/**
 * Idea Refiner Routes
 * API routes for startup idea refinement
 */

import express from 'express';
import { refineIdea, getRefinementStatus, generateQuestions } from '../controllers/ideaRefinerController.js';

const router = express.Router();

// Health check endpoint
router.get('/status', getRefinementStatus);

// Generate follow-up questions
router.post('/questions', generateQuestions);

// Main idea refinement endpoint
router.post('/refine', refineIdea);

// Alternative endpoint for compatibility
router.post('/refine-idea', refineIdea);

export default router;
