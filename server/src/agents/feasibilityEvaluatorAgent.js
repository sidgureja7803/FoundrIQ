/**
 * Feasibility Evaluator Agent
 * Assesses technical, operational, and financial viability using IBM Granite + Tavily
 */

import perplexityClient from '../services/perplexityClient.js';

class FeasibilityEvaluatorAgent {
    constructor() {
        this.client = perplexityClient;
    }

    /**
     * Evaluate feasibility of a startup idea
     * @param {Object} ideaData - The startup idea information
     * @returns {Promise<Object>} Feasibility evaluation results
     */
    async evaluate(ideaData) {
        console.log('[FeasibilityEvaluator] Starting feasibility evaluation...');

        try {
            // Evaluate using Perplexity (includes search)
            const evaluation = await this._evaluateWithPerplexity(ideaData);

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
    /**
     * Evaluate feasibility using Perplexity
     * @private
     */
    async _evaluateWithPerplexity(ideaData) {
        const systemPrompt = `You are an expert feasibility analyst. You have access to real-time data. Evaluate the technical, operational, and financial viability of startup ideas.

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
        userPrompt += `\nPlease perform a thorough feasibility study using your research capabilities.`;

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
            console.warn('[FeasibilityEvaluator] Failed to parse JSON');
        }

        return { raw: response };
    }
}

export default new FeasibilityEvaluatorAgent();
