/**
 * Strategy Recommender Agent
 * Generates go-to-market and differentiation strategies using IBM Granite + Tavily
 */

import aiClient from '../services/aiClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class StrategyRecommenderAgent {
    constructor() {
        this.ibmClient = aiClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Generate strategic recommendations for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @param {Object} analysisData - Combined data from other agents
     * @returns {Promise<Object>} Strategy recommendations
     */
    async recommend(ideaData, analysisData = {}) {
        console.log('[StrategyRecommender] Starting strategy recommendation...');

        try {
            // Gather strategy insights using Tavily
            const strategyData = await this._gatherStrategyData(ideaData);

            // Generate recommendations using IBM Granite
            const recommendations = await this._recommendWithGranite(ideaData, analysisData, strategyData);

            return {
                goToMarketStrategy: recommendations.goToMarketStrategy || {},
                differentiationStrategy: recommendations.differentiationStrategy || {},
                pricingStrategy: recommendations.pricingStrategy || {},
                marketingChannels: recommendations.marketingChannels || [],
                partnerships: recommendations.partnerships || [],
                milestones: recommendations.milestones || [],
                nextSteps: recommendations.nextSteps || [],
                recommendationComplete: true
            };
        } catch (error) {
            console.error('[StrategyRecommender] Error:', error);
            return {
                goToMarketStrategy: {},
                differentiationStrategy: {},
                error: error.message
            };
        }
    }

    /**
     * Gather strategy data using Tavily
     * @private
     */
    async _gatherStrategyData(ideaData) {
        if (!this.tavilyClient.isEnabled()) {
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} go-to-market strategy pricing marketing channels`;
            const results = await this.tavilyClient.search(searchQuery, { 
                maxResults: 5,
                agentType: 'strategyRecommender'
            });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[StrategyRecommender] Tavily search error:', error);
            
            // If it's a Tavily API key error, propagate it
            if (error.code === 'TAVILY_API_KEY_INVALID' || error.name === 'TavilyAPIKeyError') {
                throw error;
            }
            
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Generate recommendations using IBM Granite
     * @private
     */
    async _recommendWithGranite(ideaData, analysisData, strategyData) {
        const systemPrompt = `You are an expert startup strategy consultant. Generate comprehensive strategic recommendations for startup ideas.

Provide recommendations in JSON format:
{
  "goToMarketStrategy": {
    "approach": "Description of GTM approach",
    "targetSegment": "Initial target segment",
    "launchPlan": "Launch plan overview"
  },
  "differentiationStrategy": {
    "uniqueValueProps": ["UVP 1", "UVP 2"],
    "competitiveAdvantages": ["Advantage 1", "Advantage 2"],
    "positioning": "Market positioning statement"
  },
  "pricingStrategy": {
    "model": "Pricing model (subscription, freemium, per-transaction, etc.)",
    "priceRange": "Estimated price range",
    "rationale": "Pricing rationale"
  },
  "marketingChannels": ["Channel 1", "Channel 2", "Channel 3"],
  "partnerships": ["Potential partner type 1", "Potential partner type 2"],
  "milestones": [
    {"milestone": "Milestone 1", "timeline": "Timeline"},
    {"milestone": "Milestone 2", "timeline": "Timeline"}
  ],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;
        userPrompt += `Problem Solved: ${ideaData.problemSolved || 'Not specified'}\n`;

        // Include analysis data if available
        if (analysisData.marketAnalysis) {
            userPrompt += `\nMarket Size: ${analysisData.marketAnalysis.marketSize || 'Not available'}\n`;
        }
        if (analysisData.competition) {
            userPrompt += `Competition Level: ${analysisData.competition.threatLevel || 'Not available'}\n`;
        }

        if (strategyData.enabled && strategyData.results?.length > 0) {
            userPrompt += `\nStrategy Research Data:\n`;
            strategyData.results.slice(0, 3).forEach((result, idx) => {
                userPrompt += `${idx + 1}. ${result.title}: ${result.snippet}\n`;
            });
        }

        const response = await this.ibmClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.4, maxTokens: 2000 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[StrategyRecommender] Failed to parse JSON');
        }

        return { raw: response };
    }
}

export default new StrategyRecommenderAgent();
