/**
 * Agent Orchestrator
 * Coordinates all 5 specialized agents for comprehensive startup analysis
 * using IBM Granite + Tavily
 */

import marketAnalystAgent from './marketAnalystAgent.js';
import tamSamEstimatorAgent from './tamSamEstimatorAgent.js';
import competitorScannerAgent from './competitorScannerAgent.js';
import feasibilityEvaluatorAgent from './feasibilityEvaluatorAgent.js';
import strategyRecommenderAgent from './strategyRecommenderAgent.js';

class AgentOrchestrator {
    constructor() {
        this.agents = {
            marketAnalyst: marketAnalystAgent,
            tamSamEstimator: tamSamEstimatorAgent,
            competitorScanner: competitorScannerAgent,
            feasibilityEvaluator: feasibilityEvaluatorAgent,
            strategyRecommender: strategyRecommenderAgent
        };
    }

    /**
     * Run comprehensive analysis using all 5 agents
     * @param {Object} ideaData - The startup idea information
     * @param {Object} options - Options for analysis
     * @returns {Promise<Object>} Complete analysis results
     */
    async runAnalysis(ideaData, options = {}) {
        console.log('[Orchestrator] Starting comprehensive startup analysis...');
        console.log(`[Orchestrator] Idea: ${ideaData.description?.substring(0, 100)}...`);

        const results = {
            idea: ideaData,
            timestamp: new Date().toISOString(),
            analysisId: this._generateAnalysisId(),
            agents: {}
        };

        try {
            // Run agents in sequence or parallel based on options
            if (options.sequential) {
                await this._runSequential(ideaData, results);
            } else {
                await this._runParallel(ideaData, results);
            }

            // Calculate overall score
            results.overallScore = this._calculateOverallScore(results.agents);
            results.status = 'completed';

            console.log('[Orchestrator] Analysis complete!');
            console.log(`[Orchestrator] Overall Score: ${results.overallScore}/10`);

            return results;
        } catch (error) {
            console.error('[Orchestrator] Error during analysis:', error);
            results.status = 'failed';
            results.error = error.message;
            return results;
        }
    }

    /**
     * Run agents sequentially (allows each agent to use previous results)
     * @private
     */
    async _runSequential(ideaData, results) {
        console.log('[Orchestrator] Running agents sequentially...');

        // 1. Market Analyst
        console.log('[Orchestrator] Running Market Analyst...');
        results.agents.marketAnalysis = await this.agents.marketAnalyst.analyze(ideaData);

        // 2. TAM/SAM Estimator
        console.log('[Orchestrator] Running TAM/SAM Estimator...');
        results.agents.tamSamEstimation = await this.agents.tamSamEstimator.estimate(ideaData);

        // 3. Competitor Scanner
        console.log('[Orchestrator] Running Competitor Scanner...');
        results.agents.competitorAnalysis = await this.agents.competitorScanner.scan(ideaData);

        // 4. Feasibility Evaluator
        console.log('[Orchestrator] Running Feasibility Evaluator...');
        results.agents.feasibilityEvaluation = await this.agents.feasibilityEvaluator.evaluate(ideaData);

        // 5. Strategy Recommender (uses results from other agents)
        console.log('[Orchestrator] Running Strategy Recommender...');
        results.agents.strategyRecommendation = await this.agents.strategyRecommender.recommend(
            ideaData,
            results.agents
        );
    }

    /**
     * Run agents in parallel (faster but agents can't use each other's results)
     * @private
     */
    async _runParallel(ideaData, results) {
        console.log('[Orchestrator] Running agents in parallel...');

        const [
            marketAnalysis,
            tamSamEstimation,
            competitorAnalysis,
            feasibilityEvaluation
        ] = await Promise.all([
            this.agents.marketAnalyst.analyze(ideaData),
            this.agents.tamSamEstimator.estimate(ideaData),
            this.agents.competitorScanner.scan(ideaData),
            this.agents.feasibilityEvaluator.evaluate(ideaData)
        ]);

        results.agents.marketAnalysis = marketAnalysis;
        results.agents.tamSamEstimation = tamSamEstimation;
        results.agents.competitorAnalysis = competitorAnalysis;
        results.agents.feasibilityEvaluation = feasibilityEvaluation;

        // Strategy Recommender runs last with all results
        console.log('[Orchestrator] Running Strategy Recommender...');
        results.agents.strategyRecommendation = await this.agents.strategyRecommender.recommend(
            ideaData,
            results.agents
        );
    }

    /**
     * Calculate overall score based on agent results
     * @private
     */
    _calculateOverallScore(agentResults) {
        const scores = [];

        // Extract scores from each agent
        if (agentResults.feasibilityEvaluation?.overallScore) {
            scores.push(agentResults.feasibilityEvaluation.overallScore);
        }

        if (agentResults.competitorAnalysis?.threatLevel) {
            // Convert threat level to score (inverted: low threat = high score)
            const threatScores = { low: 8, medium: 5, high: 3 };
            scores.push(threatScores[agentResults.competitorAnalysis.threatLevel] || 5);
        }

        if (agentResults.marketAnalysis?.marketSize) {
            // If market size is mentioned, give a score based on that
            scores.push(7); // Default good score if market exists
        }

        // Calculate average
        if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            return Math.round(avg * 10) / 10; // Round to 1 decimal
        }

        return 7.0; // Default score
    }

    /**
     * Generate unique analysis ID
     * @private
     */
    _generateAnalysisId() {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get agent status
     * @returns {Object} Status of all agents
     */
    getStatus() {
        return {
            orchestrator: 'ready',
            agents: {
                marketAnalyst: 'ready',
                tamSamEstimator: 'ready',
                competitorScanner: 'ready',
                feasibilityEvaluator: 'ready',
                strategyRecommender: 'ready'
            },
            capabilities: [
                'Market size and trends analysis',
                'TAM/SAM/SOM estimation',
                'Competitive landscape mapping',
                'Technical and financial feasibility',
                'Strategic recommendations'
            ]
        };
    }
}

export default new AgentOrchestrator();
