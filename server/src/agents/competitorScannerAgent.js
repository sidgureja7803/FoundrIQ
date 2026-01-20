/**
 * Competitor Scanner Agent
 * Maps competitors, emerging players, and market gaps using IBM Granite + Tavily
 */

import aiClient from '../services/aiClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class CompetitorScannerAgent {
    constructor() {
        this.ibmClient = aiClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Scan for competitors in the market
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Competitor analysis results
     */
    async scan(ideaData) {
        console.log('[CompetitorScanner] Starting competitor scan...');

        try {
            // Gather competitor data using Tavily
            const competitorData = await this._gatherCompetitorData(ideaData);

            // Analyze competitors using IBM Granite
            const analysis = await this._analyzeWithGranite(ideaData, competitorData);

            return {
                competitors: analysis.competitors || [],
                emergingPlayers: analysis.emergingPlayers || [],
                marketGaps: analysis.marketGaps || [],
                competitiveLandscape: analysis.competitiveLandscape || 'Analysis unavailable',
                threatLevel: analysis.threatLevel || 'medium',
                sources: competitorData.results || [],
                scanComplete: true
            };
        } catch (error) {
            console.error('[CompetitorScanner] Error:', error);
            return {
                competitors: [],
                emergingPlayers: [],
                marketGaps: [],
                error: error.message
            };
        }
    }

    /**
     * Gather competitor data using Tavily
     * @private
     */
    async _gatherCompetitorData(ideaData) {
        if (!this.tavilyClient.isEnabled()) {
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} competitors startups companies market players`;
            const results = await this.tavilyClient.search(searchQuery, { 
                maxResults: 8,
                agentType: 'competitorScanner'
            });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[CompetitorScanner] Tavily search error:', error);
            
            // If it's a Tavily API key error, propagate it
            if (error.code === 'TAVILY_API_KEY_INVALID' || error.name === 'TavilyAPIKeyError') {
                throw error;
            }
            
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Analyze competitors using IBM Granite
     * @private
     */
    async _analyzeWithGranite(ideaData, competitorData) {
        const systemPrompt = `You are an expert competitive intelligence analyst. Analyze the competitive landscape for startup ideas.

Provide analysis in JSON format:
{
  "competitors": [
    {
      "name": "Competitor name",
      "description": "What they do",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "marketPosition": "Leader/Challenger/Niche"
    }
  ],
  "emergingPlayers": ["Player 1", "Player 2"],
  "marketGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "competitiveLandscape": "Overall competitive landscape description",
  "threatLevel": "low|medium|high"
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;

        if (competitorData.enabled && competitorData.results?.length > 0) {
            userPrompt += `\nCompetitor Research Data:\n`;
            competitorData.results.slice(0, 5).forEach((result, idx) => {
                userPrompt += `${idx + 1}. ${result.title}: ${result.snippet}\n`;
            });
        }

        const response = await this.ibmClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.3, maxTokens: 2000 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[CompetitorScanner] Failed to parse JSON');
        }

        return { raw: response };
    }
}

export default new CompetitorScannerAgent();
