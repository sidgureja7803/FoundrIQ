/**
 * AI Routes
 * Handles AI-powered startup idea validation using Perplexity AI + Tavily
 * Individual agent endpoints for progressive analysis
 */
import express from "express";
import startupValidationService from "../services/startupValidationService.js";
import appwriteService from "../services/appwriteService.js";
import marketAnalystAgent from "../agents/marketAnalystAgent.js";
import tamSamEstimatorAgent from "../agents/tamSamEstimatorAgent.js";
import competitorScannerAgent from "../agents/competitorScannerAgent.js";
import feasibilityEvaluatorAgent from "../agents/feasibilityEvaluatorAgent.js";
import strategyRecommenderAgent from "../agents/strategyRecommenderAgent.js";


const router = express.Router();

/**
 * Helper function to handle Tavily API errors
 * @param {Error} err - The error object
 * @param {Response} res - Express response object
 * @param {string} agentName - Name of the agent for error message
 * @returns {Response} Express response with appropriate error
 */
function handleTavilyError(err, res, agentName = 'Analysis') {
    // Check for Tavily API key errors
    if (err.code === 'TAVILY_API_KEY_INVALID' || err.name === 'TavilyAPIKeyError') {
        return res.status(503).json({
            success: false,
            error: "Tavily API Configuration Error",
            message: err.message,
            userMessage: "⚠️ Tavily API key is invalid or missing. Please check your TAVILY_API_KEY environment variable and restart the server.",
            code: "TAVILY_API_KEY_INVALID",
            agent: agentName
        });
    }

    // Check for Tavily rate limit errors
    if (err.code === 'TAVILY_RATE_LIMIT' || err.name === 'TavilyRateLimitError') {
        return res.status(429).json({
            success: false,
            error: "Rate Limit Exceeded",
            message: err.message,
            userMessage: "Too many requests to the market research API. Please try again in a few moments.",
            code: "TAVILY_RATE_LIMIT",
            agent: agentName
        });
    }

    // Check for other Tavily errors
    if (err.code === 'TAVILY_SEARCH_FAILED' || err.name === 'TavilySearchError') {
        return res.status(503).json({
            success: false,
            error: "Market Research API Error",
            message: err.message,
            userMessage: "The market research service (Tavily) encountered an error. Please try again later.",
            code: "TAVILY_SEARCH_FAILED",
            agent: agentName
        });
    }

    return null; // Not a Tavily error
}


/**
 * POST /api/ai/idea/evaluate
 * Comprehensive startup idea validation using all 5 agents
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

        // Use the unified validation service (runs all 5 agents sequentially)
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
 * POST /api/ai/agent/market-analyst
 * Run Market Analyst agent only
 */
router.post("/agent/market-analyst", async (req, res) => {
    try {
        const { idea, title, category, problemSolved, targetAudience } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Running Market Analyst agent...');

        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General',
            problemSolved,
            targetAudience
        };

        const result = await marketAnalystAgent.analyze(ideaData);

        return res.json({
            success: true,
            agent: 'marketAnalyst',
            data: result
        });
    } catch (err) {
        console.error("[AI Route] Market Analyst error:", err);

        // Try to handle as Tavily error
        const tavilyErrorResponse = handleTavilyError(err, res, 'Market Analyst');
        if (tavilyErrorResponse) return tavilyErrorResponse;

        // Generic error
        return res.status(500).json({
            success: false,
            error: "Market analysis failed",
            message: err.message
        });
    }
});

/**
 * POST /api/ai/agent/tam-sam-estimator
 * Run TAM/SAM Estimator agent only
 */
router.post("/agent/tam-sam-estimator", async (req, res) => {
    try {
        const { idea, title, category } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Running TAM/SAM Estimator agent...');

        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General'
        };

        const result = await tamSamEstimatorAgent.estimate(ideaData);

        return res.json({
            success: true,
            agent: 'tamSamEstimator',
            data: result
        });
    } catch (err) {
        console.error("[AI Route] TAM/SAM Estimator error:", err);

        const tavilyErrorResponse = handleTavilyError(err, res, 'TAM/SAM Estimator');
        if (tavilyErrorResponse) return tavilyErrorResponse;

        return res.status(500).json({
            success: false,
            error: "TAM/SAM estimation failed",
            message: err.message
        });
    }
});

/**
 * POST /api/ai/agent/competitor-scanner
 * Run Competitor Scanner agent only
 */
router.post("/agent/competitor-scanner", async (req, res) => {
    try {
        const { idea, title, category } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Running Competitor Scanner agent...');

        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General'
        };

        const result = await competitorScannerAgent.scan(ideaData);

        return res.json({
            success: true,
            agent: 'competitorScanner',
            data: result
        });
    } catch (err) {
        console.error("[AI Route] Competitor Scanner error:", err);

        const tavilyErrorResponse = handleTavilyError(err, res, 'Competitor Scanner');
        if (tavilyErrorResponse) return tavilyErrorResponse;

        return res.status(500).json({
            success: false,
            error: "Competitor analysis failed",
            message: err.message
        });
    }
});

/**
 * POST /api/ai/agent/feasibility-evaluator
 * Run Feasibility Evaluator agent only
 */
router.post("/agent/feasibility-evaluator", async (req, res) => {
    try {
        const { idea, title, category } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Running Feasibility Evaluator agent...');

        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General'
        };

        const result = await feasibilityEvaluatorAgent.evaluate(ideaData);

        return res.json({
            success: true,
            agent: 'feasibilityEvaluator',
            data: result
        });
    } catch (err) {
        console.error("[AI Route] Feasibility Evaluator error:", err);

        const tavilyErrorResponse = handleTavilyError(err, res, 'Feasibility Evaluator');
        if (tavilyErrorResponse) return tavilyErrorResponse;

        return res.status(500).json({
            success: false,
            error: "Feasibility evaluation failed",
            message: err.message
        });
    }
});

/**
 * POST /api/ai/agent/strategy-recommender
 * Run Strategy Recommender agent only
 * Can receive previous agent results for better recommendations
 */
router.post("/agent/strategy-recommender", async (req, res) => {
    try {
        const { idea, title, category, previousResults } = req.body;

        if (!idea || typeof idea !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing 'idea' in request body"
            });
        }

        console.log('[AI Route] Running Strategy Recommender agent...');

        const ideaData = {
            description: idea,
            title: title || 'Untitled Idea',
            category: category || 'General'
        };

        const result = await strategyRecommenderAgent.recommend(ideaData, previousResults || {});

        return res.json({
            success: true,
            agent: 'strategyRecommender',
            data: result
        });
    } catch (err) {
        console.error("[AI Route] Strategy Recommender error:", err);

        const tavilyErrorResponse = handleTavilyError(err, res, 'Strategy Recommender');
        if (tavilyErrorResponse) return tavilyErrorResponse;

        return res.status(500).json({
            success: false,
            error: "Strategy recommendation failed",
            message: err.message
        });
    }
});

/**
 * GET /api/ai/health
 * Check AI service health (Perplexity + Tavily)
 */
router.get("/health", async (req, res) => {
    const health = {
        perplexity: !startupValidationService.ibmClient.disabled,
        tavily: startupValidationService.tavilyEnabled,
        timestamp: new Date().toISOString()
    };

    const allHealthy = health.perplexity && health.tavily;

    return res.status(allHealthy ? 200 : 503).json({
        success: allHealthy,
        services: health
    });
});

export default router;
