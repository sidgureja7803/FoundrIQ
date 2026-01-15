/**
 * Analysis Service
 * Service for triggering and managing 5-agent startup idea analysis
 * Uses IBM Granite models + Tavily search
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

class AnalysisService {
    /**
     * Trigger 5-agent analysis for a startup idea
     * This will run all 5 specialized agents:
     * 1. Market Analyst (IBM Granite + Tavily)
     * 2. TAM/SAM Estimator
     * 3. Competitor Scanner
     * 4. Feasibility Evaluator
     * 5. Strategy Recommender
     */
    async analyzeIdea(request: AnalysisRequest): Promise<AnalysisResult> {
        try {
            console.log('[AnalysisService] Starting 5-agent analysis...');

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
     * Check AI service health
     */
    async checkHealth(): Promise<{
        success: boolean;
        services: {
            ibmGranite: boolean;
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
