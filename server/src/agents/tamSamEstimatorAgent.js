/**
 * TAM/SAM Estimator Agent
 * Calculates Total Addressable Market & Serviceable Addressable Market using IBM Granite + Tavily
 */

import perplexityClient from '../services/perplexityClient.js';

class TamSamEstimatorAgent {
    constructor() {
        this.client = perplexityClient;
    }

    /**
     * Estimate TAM and SAM for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} TAM/SAM estimates
     */
    async estimate(ideaData) {
        console.log('[TamSamEstimator] Starting TAM/SAM estimation...');

        try {
            // Estimate TAM/SAM using Perplexity (includes search)
            const estimates = await this._estimateWithPerplexity(ideaData);

            return {
                tam: estimates.tam || 'Not available',
                sam: estimates.sam || 'Not available',
                som: estimates.som || 'Not available',
                methodology: estimates.methodology || 'Top-down analysis',
                assumptions: estimates.assumptions || [],
                sources: marketSizeData.results || [],
                estimationComplete: true
            };
        } catch (error) {
            console.error('[TamSamEstimator] Error:', error);
            return {
                tam: 'Estimation failed',
                sam: 'Estimation failed',
                som: 'Estimation failed',
                error: error.message
            };
        }
    }

    /**
     * Gather market size data using Tavily
     * @private
     */
    /**
     * Estimate TAM/SAM using Perplexity
     * @private
     */
    async _estimateWithPerplexity(ideaData) {
        const systemPrompt = `You are an expert market sizing analyst. You have access to real-time market data. Calculate TAM, SAM, and SOM for startup ideas.

Provide estimates in JSON format:
{
  "tam": "Total Addressable Market with dollar amount (e.g., $50B). Cite sources.",
  "sam": "Serviceable Addressable Market with dollar amount (e.g., $5B). Cite sources.",
  "som": "Serviceable Obtainable Market with dollar amount (e.g., $500M). Cite sources.",
  "methodology": "Brief description of calculation methodology",
  "assumptions": ["assumption 1", "assumption 2", "assumption 3"]
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;
        userPrompt += `\nPlease output detailed market size estimates (TAM, SAM, SOM) based on online research.`;

        const response = await this.client.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 1200 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[TamSamEstimator] Failed to parse JSON from Perplexity');
        }

        return { raw: response };
    }
}

export default new TamSamEstimatorAgent();
