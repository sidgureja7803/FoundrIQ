/**
 * TAM/SAM Estimator Agent
 * Calculates Total Addressable Market & Serviceable Addressable Market using IBM Granite + Tavily
 */

import ibmWatsonxClient from '../services/ibmWatsonxClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class TamSamEstimatorAgent {
    constructor() {
        this.ibmClient = ibmWatsonxClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Estimate TAM and SAM for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} TAM/SAM estimates
     */
    async estimate(ideaData) {
        console.log('[TamSamEstimator] Starting TAM/SAM estimation...');

        try {
            // Gather market size data using Tavily
            const marketSizeData = await this._gatherMarketSizeData(ideaData);

            // Estimate TAM/SAM using IBM Granite
            const estimates = await this._estimateWithGranite(ideaData, marketSizeData);

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
    async _gatherMarketSizeData(ideaData) {
        if (!this.tavilyClient.isEnabled()) {
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} TAM SAM market size revenue industry report`;
            const results = await this.tavilyClient.search(searchQuery, { maxResults: 5 });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[TamSamEstimator] Tavily search error:', error);
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Estimate TAM/SAM using IBM Granite
     * @private
     */
    async _estimateWithGranite(ideaData, marketSizeData) {
        const systemPrompt = `You are an expert market sizing analyst. Calculate TAM, SAM, and SOM for startup ideas.

Provide estimates in JSON format:
{
  "tam": "Total Addressable Market with dollar amount (e.g., $50B)",
  "sam": "Serviceable Addressable Market with dollar amount (e.g., $5B)",
  "som": "Serviceable Obtainable Market with dollar amount (e.g., $500M)",
  "methodology": "Brief description of calculation methodology",
  "assumptions": ["assumption 1", "assumption 2", "assumption 3"]
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;

        if (marketSizeData.enabled && marketSizeData.results?.length > 0) {
            userPrompt += `\nMarket Size Research Data:\n`;
            marketSizeData.results.slice(0, 3).forEach((result, idx) => {
                userPrompt += `${idx + 1}. ${result.title}: ${result.snippet}\n`;
            });
        }

        const response = await this.ibmClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 1200 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[TamSamEstimator] Failed to parse JSON');
        }

        return { raw: response };
    }
}

export default new TamSamEstimatorAgent();
