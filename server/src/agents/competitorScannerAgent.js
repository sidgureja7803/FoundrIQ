/**
 * Competitor Scanner Agent
 * Maps competitors, emerging players, and market gaps using IBM Granite + Tavily
 */

import perplexityClient from '../services/perplexityClient.js';

class CompetitorScannerAgent {
    constructor() {
        this.client = perplexityClient;
    }

    /**
     * Scan for competitors in the market
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Competitor analysis results
     */
    async scan(ideaData) {
        console.log('[CompetitorScanner] Starting competitor scan...');

        try {
            // Analyze competitors using Perplexity (includes search)
            const analysis = await this._analyzeWithPerplexity(ideaData);

            return {
                competitors: analysis.competitors || [],
                emergingPlayers: analysis.emergingPlayers || [],
                marketGaps: analysis.marketGaps || [],
                competitiveLandscape: analysis.competitiveLandscape || 'Analysis unavailable',
                threatLevel: analysis.threatLevel || 'medium',
                sources: [], // Perplexity handles this internally usually
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
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Analyze competitors using Perplexity
     * @private
     */
    async _analyzeWithPerplexity(ideaData) {
        const systemPrompt = `You are an expert competitive intelligence analyst. You have access to real-time market data. Analyze the competitive landscape for startup ideas.

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
        userPrompt += `\nPlease perform a thorough competitor scan using your search capabilities.`;

        const response = await this.client.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 2000 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[CompetitorScanner] Failed to parse JSON from Perplexity response:', parseError);
        }

        return { raw: response };
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
