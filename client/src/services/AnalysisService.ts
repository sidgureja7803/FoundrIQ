/**
 * Analysis Service
 * Service for triggering and managing 5-agent startup idea analysis
 * Supports both full analysis and individual agent execution
 */

import { api } from '../utils/api';

export interface AnalysisResult {
    success: boolean;
    idea: any;
    timestamp: string;
    analysisId: string;
    agents: {
        marketAnalysis?: any;
        tamSamEstimation?: any;
        competitorAnalysis?: any;
        feasibilityEvaluation?: any;
        strategyRecommendation?: any;
    };
    overallScore?: number;
    status: 'completed' | 'failed';
    technology?: {
        ai: string;
        search: string;
        database: string;
    };
}

export interface AnalysisRequest {
    idea: string;
    userId?: string;
    title?: string;
    category?: string;
    problemSolved?: string;
    targetAudience?: string;
}

export interface AgentResult {
    success: boolean;
    agent: string;
    data: any;
}

class AnalysisService {
    /**
     * Trigger 5-agent analysis for a startup idea (all at once)
     */
    async analyzeIdea(request: AnalysisRequest): Promise<AnalysisResult> {
        try {
            console.log('[AnalysisService] Starting full 5-agent analysis...');

            const response = await api.post('/ai/idea/evaluate', request);

            console.log('[AnalysisService] Analysis complete!');
            return response.data.data;
        } catch (error: any) {
            console.error('[AnalysisService] Analysis failed:', error);

            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to analyze idea';
            throw new Error(errorMessage);
        }
    }

    /**
     * Helper method to extract error message from API response
     * Prioritizes userMessage for Tavily errors
     */
    private extractErrorMessage(error: any, defaultMessage: string): { message: string; isTavilyError: boolean; code?: string } {
        const responseData = error.response?.data;

        // Check if this is a Tavily API error
        if (responseData?.code === 'TAVILY_API_KEY_INVALID' ||
            responseData?.code === 'TAVILY_RATE_LIMIT' ||
            responseData?.code === 'TAVILY_SEARCH_FAILED') {
            return {
                message: responseData.userMessage || responseData.message || defaultMessage,
                isTavilyError: true,
                code: responseData.code
            };
        }

        return {
            message: responseData?.userMessage || responseData?.message || responseData?.error || defaultMessage,
            isTavilyError: false
        };
    }

    /**
     * Run Market Analyst agent only
     */
    async runMarketAnalyst(request: AnalysisRequest): Promise<AgentResult> {
        try {
            console.log('[AnalysisService] 🏢 Running Market Analyst...');

            const response = await api.post('/ai/agent/market-analyst', {
                idea: request.idea,
                title: request.title,
                category: request.category,
                problemSolved: request.problemSolved,
                targetAudience: request.targetAudience
            });

            console.log('[AnalysisService] ✅ Market Analyst complete');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ Market Analyst failed:', error);
            const errorInfo = this.extractErrorMessage(error, 'Market analysis failed');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Run TAM/SAM Estimator agent only
     */
    async runTamSamEstimator(request: AnalysisRequest): Promise<AgentResult> {
        try {
            console.log('[AnalysisService] 💰 Running TAM/SAM Estimator...');

            const response = await api.post('/ai/agent/tam-sam-estimator', {
                idea: request.idea,
                title: request.title,
                category: request.category
            });

            console.log('[AnalysisService] ✅ TAM/SAM Estimator complete');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ TAM/SAM Estimator failed:', error);
            const errorInfo = this.extractErrorMessage(error, 'TAM/SAM estimation failed');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Run Competitor Scanner agent only
     */
    async runCompetitorScanner(request: AnalysisRequest): Promise<AgentResult> {
        try {
            console.log('[AnalysisService] ⚔️ Running Competitor Scanner...');

            const response = await api.post('/ai/agent/competitor-scanner', {
                idea: request.idea,
                title: request.title,
                category: request.category
            });

            console.log('[AnalysisService] ✅ Competitor Scanner complete');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ Competitor Scanner failed:', error);
            const errorInfo = this.extractErrorMessage(error, 'Competitor analysis failed');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Run Feasibility Evaluator agent only
     */
    async runFeasibilityEvaluator(request: AnalysisRequest): Promise<AgentResult> {
        try {
            console.log('[AnalysisService] 🔬 Running Feasibility Evaluator...');

            const response = await api.post('/ai/agent/feasibility-evaluator', {
                idea: request.idea,
                title: request.title,
                category: request.category
            });

            console.log('[AnalysisService] ✅ Feasibility Evaluator complete');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ Feasibility Evaluator failed:', error);
            const errorInfo = this.extractErrorMessage(error, 'Feasibility evaluation failed');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Run Strategy Recommender agent only
     */
    async runStrategyRecommender(request: AnalysisRequest, previousResults?: any): Promise<AgentResult> {
        try {
            console.log('[AnalysisService] 🧭 Running Strategy Recommender...');

            const response = await api.post('/ai/agent/strategy-recommender', {
                idea: request.idea,
                title: request.title,
                category: request.category,
                previousResults
            });

            console.log('[AnalysisService] ✅ Strategy Recommender complete');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ Strategy Recommender failed:', error);
            const errorInfo = this.extractErrorMessage(error, 'Strategy recommendation failed');
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Run all agents sequentially with progressive results
     * This allows displaying results as each agent completes
     */
    async analyzeIdeaSequential(
        request: AnalysisRequest,
        onAgentComplete?: (agentName: string, result: any) => void
    ): Promise<AnalysisResult> {
        try {
            console.log('[AnalysisService] 🚀 Starting sequential 5-agent analysis...');

            const results: any = {
                agents: {}
            };

            // 1. Market Analyst
            const marketResult = await this.runMarketAnalyst(request);
            results.agents.marketAnalysis = marketResult.data;
            if (onAgentComplete) onAgentComplete('marketAnalyst', marketResult.data);

            // 2. TAM/SAM Estimator
            const tamSamResult = await this.runTamSamEstimator(request);
            results.agents.tamSamEstimation = tamSamResult.data;
            if (onAgentComplete) onAgentComplete('tamSamEstimator', tamSamResult.data);

            // 3. Competitor Scanner
            const competitorResult = await this.runCompetitorScanner(request);
            results.agents.competitorAnalysis = competitorResult.data;
            if (onAgentComplete) onAgentComplete('competitorScanner', competitorResult.data);

            // 4. Feasibility Evaluator
            const feasibilityResult = await this.runFeasibilityEvaluator(request);
            results.agents.feasibilityEvaluation = feasibilityResult.data;
            if (onAgentComplete) onAgentComplete('feasibilityEvaluator', feasibilityResult.data);

            // 5. Strategy Recommender (with previous results for better recommendations)
            const strategyResult = await this.runStrategyRecommender(request, results.agents);
            results.agents.strategyRecommendation = strategyResult.data;
            if (onAgentComplete) onAgentComplete('strategyRecommender', strategyResult.data);

            // Calculate overall score
            results.overallScore = this.calculateOverallScore(results.agents);
            results.success = true;
            results.status = 'completed';
            results.timestamp = new Date().toISOString();
            results.analysisId = `analysis_${Date.now()}`;

            console.log('[AnalysisService] ✅ Sequential analysis complete!');
            console.log(`[AnalysisService] Overall Score: ${results.overallScore}/10`);

            return results;
        } catch (error: any) {
            console.error('[AnalysisService] ❌ Sequential analysis failed:', error);
            throw error;
        }
    }

    /**
     * Calculate overall score from agent results
     */
    private calculateOverallScore(agentResults: any): number {
        const scores: number[] = [];

        // Extract scores from each agent
        if (agentResults.feasibilityEvaluation?.overallScore) {
            scores.push(agentResults.feasibilityEvaluation.overallScore);
        }

        if (agentResults.competitorAnalysis?.threatLevel) {
            // Convert threat level to score (inverted: low threat = high score)
            const threatScores: Record<string, number> = { low: 8, medium: 5, high: 3 };
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
     * Check AI service health
     */
    async checkHealth(): Promise<{
        success: boolean;
        services: {
            perplexity: boolean;
            tavily: boolean;
            timestamp: string;
        };
    }> {
        try {
            const response = await api.get('/ai/health');
            return response.data;
        } catch (error: any) {
            console.error('[AnalysisService] Health check failed:', error);
            throw new Error('Failed to check AI service health');
        }
    }
}

export const analysisService = new AnalysisService();
export default analysisService;
