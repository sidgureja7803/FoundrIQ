/**
 * Market Analyst Agent
 * Identifies market size, growth trends, and target audiences using IBM Granite + Tavily
 */

import perplexityClient from '../services/perplexityClient.js';

class MarketAnalystAgent {
    constructor() {
        this.client = perplexityClient;
    }

    /**
     * Analyze market for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Market analysis results
     */
    async analyze(ideaData) {
        console.log('[MarketAnalyst] Starting market analysis...');

        try {
            // Step 1: Analyze with Perplexity (includes search)
            const analysis = await this._analyzeWithPerplexity(ideaData);

            return {
                marketSize: analysis.marketSize || 'Analysis unavailable',
                growthTrends: analysis.growthTrends || [],
                targetAudience: analysis.targetAudience || {},
                keyInsights: analysis.keyInsights || [],
                marketData: { results: [], source: 'Perplexity' },
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
     * Analyze market data using Perplexity
     * @private
     */
    async _analyzeWithPerplexity(ideaData) {
        const systemPrompt = `You are an expert market analyst. You have access to real-time market data. Research and analyze the startup idea to provide comprehensive market analysis.

Provide analysis in JSON format with the following structure:
{
  "marketSize": "Estimated market size with specific numbers (cite sources if possible)",
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
        userPrompt += `\nPlease perform a thorough market analysis using your search capabilities.`;

        const response = await this.client.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 1500 }
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
