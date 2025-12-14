/**
 * Startup Validation Service
 * Orchestrates Perplexity AI for comprehensive startup idea validation
 * Uses 5 specialized agents: Market Analyst, TAM/SAM, Competitor Scanner, Feasibility, Strategy
 */

import perplexityClient from '../services/perplexityClient.js';
import agentOrchestrator from '../agents/agentOrchestrator.js';

class StartupValidationService {
    constructor() {
        this.client = perplexityClient;
        this.clientEnabled = !!this.client.apiKey;
    }

    /**
     * Validate a startup idea using all 5 agents
     * @param {string|Object} idea - Startup idea description or object
     * @returns {Promise<Object>} Comprehensive validation results
     */
    async validateIdea(idea) {
        console.log('[StartupValidationService] Starting comprehensive validation...');

        try {
            // Normalize idea data
            const ideaData = typeof idea === 'string'
                ? { description: idea }
                : idea;

            // Ensure description exists
            if (!ideaData.description) {
                throw new Error('Idea description is required');
            }

            // Run all 5 agents through the orchestrator
            const analysisResults = await agentOrchestrator.runAnalysis(ideaData, {
                sequential: true // Run sequentially for better context
            });

            console.log('[StartupValidationService] Validation complete!');
            console.log(`[StartupValidationService] Overall Score: ${analysisResults.overallScore}/10`);

            return {
                success: true,
                ...analysisResults,
                technology: {
                    ai: 'Perplexity',
                    search: 'Perplexity',
                    database: 'Appwrite'
                }
            };
        } catch (error) {
            console.error('[StartupValidationService] Validation error:', error);
            throw new Error(`Validation failed: ${error.message}`);
        }
    }

    /**
     * Get service health status
     */
    getHealth() {
        return {
            perplexity: this.clientEnabled
        };
    }
}

// Export singleton instance
const startupValidationService = new StartupValidationService();
export default startupValidationService;
