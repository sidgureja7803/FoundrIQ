/**
 * Market Analyst Agent
 * Identifies market size, growth trends, and target audiences using IBM Granite + Tavily
 */

import ibmWatsonxClient from '../services/ibmWatsonxClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class MarketAnalystAgent {
    constructor() {
        this.ibmClient = ibmWatsonxClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Analyze market for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Market analysis results
     */
    async analyze(ideaData) {
        console.log('[MarketAnalyst] Starting market analysis...');

        try {
            // Step 1: Gather market intelligence using Tavily
            const marketData = await this._gatherMarketData(ideaData);

            // Step 2: Analyze with IBM Granite
            const analysis = await this._analyzeWithGranite(ideaData, marketData);

            return {
                marketSize: analysis.marketSize || 'Analysis unavailable',
                growthTrends: analysis.growthTrends || [],
                targetAudience: analysis.targetAudience || {},
                keyInsights: analysis.keyInsights || [],
                marketData: marketData,
                analysisComplete: true
            };
        } catch (error) {
            console.error('[MarketAnalyst] Error:', error);
            return {
                marketSize: 'Analysis failed',
                growthTrends: [],
                targetAudience: {},
                keyInsights: [],
                error: error.message
            };
        }
    }

    /**
     * Gather market data using Tavily
     * @private
     */
    async _gatherMarketData(ideaData) {
        if (!this.tavilyClient.isEnabled()) {
            console.log('[MarketAnalyst] Tavily disabled, skipping web search');
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} market size growth trends 2024`;
            const results = await this.tavilyClient.search(searchQuery, { maxResults: 5 });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[MarketAnalyst] Tavily search error:', error);
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Analyze market data using IBM Granite
     * @private
     */
    async _analyzeWithGranite(ideaData, marketData) {
        const systemPrompt = `You are an expert market analyst. Analyze the startup idea and provide comprehensive market analysis.

Provide analysis in JSON format with the following structure:
{
  "marketSize": "Estimated market size with specific numbers",
  "growthTrends": ["trend 1", "trend 2", "trend 3"],
  "targetAudience": {
    "primary": "Primary target audience description",
    "secondary": "Secondary target audience",
    "demographics": "Key demographics"
  },
  "keyInsights": ["insight 1", "insight 2", "insight 3"]
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;
        userPrompt += `Problem Solved: ${ideaData.problemSolved || 'Not specified'}\n`;

        if (marketData.enabled && marketData.results?.length > 0) {
            userPrompt += `\nMarket Research Data:\n`;
            marketData.results.slice(0, 3).forEach((result, idx) => {
                userPrompt += `${idx + 1}. ${result.title}: ${result.snippet}\n`;
            });
        }

        const response = await this.ibmClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.3, maxTokens: 1500 }
        );

        // Try to parse JSON
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[MarketAnalyst] Failed to parse JSON, returning raw');
        }

        return { raw: response };
    }
}

export default new MarketAnalystAgent();
