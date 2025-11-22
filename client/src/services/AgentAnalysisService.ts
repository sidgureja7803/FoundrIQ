/**
 * Agent Analysis Service
 * Client-side service to call the agent orchestrator via backend API
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface IdeaData {
    description: string;
    category?: string;
    problemSolved?: string;
    targetAudience?: string;
}

export interface AgentAnalysisResult {
    idea: IdeaData;
    timestamp: string;
    analysisId: string;
    overallScore: number;
    status: string;
    agents: {
        marketAnalysis?: any;
        tamSamEstimation?: any;
        competitorAnalysis?: any;
        feasibilityEvaluation?: any;
        strategyRecommendation?: any;
    };
}

class AgentAnalysisService {
    /**
     * Run complete startup validation using all 5 agents
     */
    async validateIdea(ideaData: IdeaData): Promise<AgentAnalysisResult> {
        try {
            const response = await axios.post(`${API_URL}/ai/idea/evaluate`, {
                idea: ideaData.description,
                category: ideaData.category,
                problemSolved: ideaData.problemSolved,
                targetAudience: ideaData.targetAudience
            });

            return response.data;
        } catch (error) {
            console.error('[AgentAnalysisService] Validation error:', error);
            throw new Error('Failed to validate startup idea');
        }
    }

    /**
     * Check health status of AI services
     */
    async checkHealth(): Promise<{ ibmGranite: boolean; tavily: boolean }> {
        try {
            const response = await axios.get(`${API_URL}/ai/health`);
            return response.data;
        } catch (error) {
            console.error('[AgentAnalysisService] Health check error:', error);
            return { ibmGranite: false, tavily: false };
        }
    }

    /**
     * Get analysis by ID
     */
    async getAnalysisById(analysisId: string): Promise<AgentAnalysisResult | null> {
        try {
            const response = await axios.get(`${API_URL}/analysis/${analysisId}`);
            return response.data;
        } catch (error) {
            console.error('[AgentAnalysisService] Get analysis error:', error);
            return null;
        }
    }
}

export default new AgentAnalysisService();
