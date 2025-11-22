/**
 * AI Routes
 * Handles AI-powered startup idea validation using IBM Granite + Tavily
 */
import express from "express";
import startupValidationService from "../services/startupValidationService.js";

const router = express.Router();

/**
 * POST /api/ai/idea/evaluate
 * Comprehensive startup idea validation using IBM Granite and Tavily
 * body: { idea: string }
 */
router.post("/idea/evaluate", async (req, res) => {
    try {
        const { idea } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Received validation request for idea');

        // Use the unified validation service
        const validationResults = await startupValidationService.validateIdea(idea);

        return res.json({
            success: true,
            data: validationResults
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
