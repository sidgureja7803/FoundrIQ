/**
 * TAM/SAM Estimator Agent
 * Calculates Total Addressable Market & Serviceable Addressable Market using Perplexity AI + Tavily
 */

import aiClient from '../services/aiClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class TamSamEstimatorAgent {
    constructor() {
        this.aiClient = aiClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Estimate TAM, SAM, and SOM for a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} TAM/SAM estimates with structured data
     */
    async estimate(ideaData) {
        console.log('[TamSamEstimator] Starting TAM/SAM/SOM estimation...');

        try {
            // Gather market size data using Tavily
            const marketSizeData = await this._gatherMarketSizeData(ideaData);

            // Estimate TAM/SAM/SOM using Perplexity AI
            const estimates = await this._estimateWithAI(ideaData, marketSizeData);

            return {
                tam: {
                    value: estimates.tam?.value || 'Not available',
                    percentage: 100,
                    description: estimates.tam?.description || 'Total addressable market'
                },
                sam: {
                    value: estimates.sam?.value || 'Not available',
                    percentage: estimates.sam?.percentage || 30,
                    description: estimates.sam?.description || 'Serviceable addressable market'
                },
                som: {
                    value: estimates.som?.value || 'Not available',
                    percentage: estimates.som?.percentage || 10,
                    description: estimates.som?.description || 'Serviceable obtainable market'
                },
                methodology: estimates.methodology || 'Top-down market sizing analysis',
                assumptions: estimates.assumptions || [],
                marketSegments: estimates.marketSegments || [],
                sources: marketSizeData.results || [],
                estimationComplete: true
            };
        } catch (error) {
            console.error('[TamSamEstimator] Error:', error);
            return {
                tam: { value: 'Estimation failed', percentage: 100 },
                sam: { value: 'Estimation failed', percentage: 30 },
                som: { value: 'Estimation failed', percentage: 10 },
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
            console.log('[TamSamEstimator] Tavily disabled, skipping web search');
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} TAM SAM market size revenue industry report 2024`;
            console.log('[TamSamEstimator] Searching Tavily:', searchQuery);

            const results = await this.tavilyClient.search(searchQuery, {
                maxResults: 5,
                agentType: 'tamSamEstimator'
            });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[TamSamEstimator] Tavily search error:', error);

            // If it's a Tavily API key error, propagate it
            if (error.code === 'TAVILY_API_KEY_INVALID' || error.name === 'TavilyAPIKeyError') {
                throw error;
            }

            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Estimate TAM/SAM/SOM using Perplexity AI
     * @private
     */
    async _estimateWithAI(ideaData, marketSizeData) {
        const systemPrompt = `You are an expert market sizing analyst specializing in TAM, SAM, and SOM calculations for startups.

Calculate and return market estimates in STRICT JSON format with NO additional text:

{
  "tam": {
    "value": "Dollar amount (e.g., $50B, $5.2B)",
    "description": "Brief explanation of TAM calculation"
  },
  "sam": {
    "value": "Dollar amount (e.g., $8B, $850M)",
    "percentage": 20,
    "description": "Brief explanation of SAM calculation"
  },
  "som": {
    "value": "Dollar amount (e.g., $100M, $50M)",
    "percentage": 5,
    "description": "Brief explanation of SOM calculation"
  },
  "methodology": "Brief description of calculation methodology used",
  "assumptions": ["assumption 1", "assumption 2", "assumption 3"],
  "marketSegments": [
    {"name": "Segment 1", "description": "Description", "value": "40%"},
    {"name": "Segment 2", "description": "Description", "value": "35%"},
    {"name": "Segment 3", "description": "Description", "value": "25%"}
  ]
}

IMPORTANT: 
- TAM percentage is always 100
- SAM percentage should be 15-40% of TAM
- SOM percentage should be 3-15% of SAM
- Use realistic dollar amounts based on market research`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Technology'}\n`;

        if (ideaData.targetCustomers) {
            userPrompt += `Target Customers: ${ideaData.targetCustomers}\n`;
        }

        if (marketSizeData.enabled && marketSizeData.results?.length > 0) {
            userPrompt += `\n=== MARKET SIZE RESEARCH DATA ===\n`;
            marketSizeData.results.slice(0, 3).forEach((result, idx) => {
                userPrompt += `\nSource ${idx + 1}: ${result.title}\n`;
                userPrompt += `Data: ${result.snippet}\n`;
            });
            userPrompt += `\n=== END RESEARCH DATA ===\n\n`;
        }

        userPrompt += `\nProvide TAM, SAM, and SOM calculations in the exact JSON format specified above.`;

        console.log('[TamSamEstimator] Calling Perplexity AI for market sizing...');

        const response = await this.aiClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 1500 }
        );

        console.log('[TamSamEstimator] AI Response received');

        try {
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                console.log('[TamSamEstimator] Successfully parsed TAM/SAM/SOM data');
                return parsed;
            }
        } catch (parseError) {
            console.error('[TamSamEstimator] JSON parsing failed:', parseError);
            console.error('[TamSamEstimator] Raw response:', response);
        }

        // Fallback with reasonable estimates
        return {
            tam: {
                value: 'Not available',
                description: 'Unable to calculate - data insufficient'
            },
            sam: {
                value: 'Not available',
                percentage: 30,
                description: 'Unable to calculate - data insufficient'
            },
            som: {
                value: 'Not available',
                percentage: 10,
                description: 'Unable to calculate - data insufficient'
            },
            methodology: 'Estimation failed due to parsing error',
            assumptions: ['Data insufficient for accurate calculation'],
            marketSegments: []
        };
    }
}

export default new TamSamEstimatorAgent();
