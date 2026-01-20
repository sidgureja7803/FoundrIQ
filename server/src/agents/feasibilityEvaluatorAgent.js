/**
 * Feasibility Evaluator Agent
 * Assesses technical, operational, and financial viability using IBM Granite + Tavily
 */

import aiClient from '../services/aiClient.js';
import { TavilySearchTool } from '../retrieval/tavily.js';

class FeasibilityEvaluatorAgent {
    constructor() {
        this.ibmClient = aiClient;
        this.tavilyClient = new TavilySearchTool();
    }

    /**
     * Evaluate feasibility of a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Feasibility evaluation results
     */
    async evaluate(ideaData) {
        console.log('[FeasibilityEvaluator] Starting feasibility evaluation...');

        try {
            // Gather feasibility data using Tavily
            const feasibilityData = await this._gatherFeasibilityData(ideaData);

            // Evaluate using IBM Granite
            const evaluation = await this._evaluateWithGranite(ideaData, feasibilityData);

            return {
                technicalFeasibility: evaluation.technicalFeasibility || {},
                operationalFeasibility: evaluation.operationalFeasibility || {},
                financialFeasibility: evaluation.financialFeasibility || {},
                overallScore: evaluation.overallScore || 0,
                risks: evaluation.risks || [],
                recommendations: evaluation.recommendations || [],
                evaluationComplete: true
            };
        } catch (error) {
            console.error('[FeasibilityEvaluator] Error:', error);
            return {
                technicalFeasibility: { score: 0 },
                operationalFeasibility: { score: 0 },
                financialFeasibility: { score: 0 },
                overallScore: 0,
                error: error.message
            };
        }
    }

    /**
     * Gather feasibility data using Tavily
     * @private
     */
    async _gatherFeasibilityData(ideaData) {
        if (!this.tavilyClient.isEnabled()) {
            return { enabled: false, results: [] };
        }

        try {
            const searchQuery = `${ideaData.description} technical requirements costs implementation challenges`;
            const results = await this.tavilyClient.search(searchQuery, { 
                maxResults: 5,
                agentType: 'feasibilityEvaluator'
            });

            return {
                enabled: true,
                results: results || [],
                query: searchQuery
            };
        } catch (error) {
            console.error('[FeasibilityEvaluator] Tavily search error:', error);
            
            // If it's a Tavily API key error, propagate it
            if (error.code === 'TAVILY_API_KEY_INVALID' || error.name === 'TavilyAPIKeyError') {
                throw error;
            }
            
            return { enabled: true, error: error.message, results: [] };
        }
    }

    /**
     * Evaluate feasibility using IBM Granite
     * @private
     */
    async _evaluateWithGranite(ideaData, feasibilityData) {
        const systemPrompt = `You are an expert feasibility analyst. Evaluate the technical, operational, and financial viability of startup ideas.

Provide evaluation in JSON format:
{
  "technicalFeasibility": {
    "score": 0-10,
    "complexity": "low|medium|high",
    "requiredSkills": ["skill 1", "skill 2"],
    "technicalChallenges": ["challenge 1", "challenge 2"]
  },
  "operationalFeasibility": {
    "score": 0-10,
    "timeToMarket": "Estimated timeline",
    "resourceRequirements": "Resource description",
    "operationalChallenges": ["challenge 1", "challenge 2"]
  },
  "financialFeasibility": {
    "score": 0-10,
    "estimatedInitialCost": "Dollar amount",
    "monthlyBurnRate": "Dollar amount",
    "breakEvenTimeline": "Estimated timeline"
  },
  "overallScore": 0-10,
  "risks": ["risk 1", "risk 2", "risk 3"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

        let userPrompt = `Startup Idea: ${ideaData.description}\n`;
        userPrompt += `Category: ${ideaData.category || 'Not specified'}\n`;
        userPrompt += `Problem Solved: ${ideaData.problemSolved || 'Not specified'}\n`;

        if (feasibilityData.enabled && feasibilityData.results?.length > 0) {
            userPrompt += `\nFeasibility Research Data:\n`;
            feasibilityData.results.slice(0, 3).forEach((result, idx) => {
                userPrompt += `${idx + 1}. ${result.title}: ${result.snippet}\n`;
            });
        }

        const response = await this.ibmClient.generateText(
            { systemPrompt, userPrompt },
            { temperature: 0.2, maxTokens: 2000 }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('[FeasibilityEvaluator] Failed to parse JSON');
        }

        return { raw: response };
    }
}

export default new FeasibilityEvaluatorAgent();
