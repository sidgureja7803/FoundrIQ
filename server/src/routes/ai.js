/**
 * AI Routes
 * Handles AI-powered startup idea validation using IBM Granite + Tavily
 */
import express from "express";
import startupValidationService from "../services/startupValidationService.js";
import appwriteService from "../services/appwriteService.js";

const router = express.Router();

/**
 * POST /api/ai/idea/evaluate
 * Comprehensive startup idea validation using IBM Granite and Tavily
 * Saves results to Appwrite database if user is authenticated
 * body: { idea: string, userId?: string, title?: string, category?: string }
 */
router.post("/idea/evaluate", async (req, res) => {
    try {
        const { idea, userId, title, category, problemSolved, targetAudience } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Received validation request for idea');

        // Prepare idea data
        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General',
            problemSolved,
            targetAudience
        };

        // Use the unified validation service (runs all 5 agents)
        const validationResults = await startupValidationService.validateIdea(ideaData);

        // Save to Appwrite if userId provided
        let savedIdea = null;
        if (userId && appwriteService.enabled) {
            try {
                savedIdea = await appwriteService.saveIdea(userId, ideaData, validationResults);
                console.log(`[AI Route] Saved idea to Appwrite: ${savedIdea.$id}`);
            } catch (saveError) {
                console.error('[AI Route] Failed to save to Appwrite:', saveError.message);
                // Continue even if save fails
            }
        }

        return res.json({
            success: true,
            data: validationResults,
            saved: !!savedIdea,
            ideaId: savedIdea?.$id
        });
    } catch (err) {
        console.error("[AI Route] Error evaluating idea:", err);
        return res.status(500).json({
            success: false,
            error: "Failed to evaluate idea",
            message: err.message
        });
    }
});

/**
 * GET /api/ai/health
 * Check AI service health (IBM Granite + Tavily)
 */
router.get("/health", async (req, res) => {
    const health = {
        ibmGranite: !startupValidationService.ibmClient.disabled,
        tavily: startupValidationService.tavilyEnabled,
        timestamp: new Date().toISOString()
    };

    const allHealthy = health.ibmGranite && health.tavily;

    return res.status(allHealthy ? 200 : 503).json({
        success: allHealthy,
        services: health
    });
});

export default router;
