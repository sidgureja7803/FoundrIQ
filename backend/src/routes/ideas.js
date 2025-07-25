import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Idea from '../models/Idea.js';
import { processIdeaAnalysis } from '../services/analysisService.js';

const router = express.Router();

// Submit new idea for analysis
router.post('/analyze-idea', async (req, res) => {
  try {
    const { description, category, targetAudience, problemSolved } = req.body;

    // Validate required fields
    if (!description || !category || !problemSolved) {
      return res.status(400).json({
        message: 'Missing required fields: description, category, and problemSolved are required'
      });
    }

    // Create new idea record
    const ideaId = uuidv4();
    const idea = new Idea({
      id: ideaId,
      description,
      category,
      targetAudience,
      problemSolved,
      status: 'pending'
    });

    await idea.save();

    // Start async analysis process
    processIdeaAnalysis(ideaId).catch(error => {
      console.error(`Analysis failed for idea ${ideaId}:`, error);
      // Update idea status to error
      Idea.findOneAndUpdate(
        { id: ideaId },
        { status: 'error' }
      ).exec();
    });

    res.status(201).json({
      message: 'Idea submitted successfully',
      analysisId: ideaId
    });
  } catch (error) {
    console.error('Error submitting idea:', error);
    res.status(500).json({
      message: 'Failed to submit idea',
      error: error.message
    });
  }
});

// Get all ideas (for admin/debugging)
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await Idea.find()
      .select('id description category status createdAt')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({
      message: 'Failed to fetch ideas',
      error: error.message
    });
  }
});

export default router;
