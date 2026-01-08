/**
 * Perplexity AI Client
 * Handles API communication with Perplexity AI for question generation
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class PerplexityClient {
    constructor() {
        this.apiKey = process.env.PERPLEXITY_API_KEY;
        this.baseURL = 'https://api.perplexity.ai';

        if (!this.apiKey) {
            console.warn('⚠️  PERPLEXITY_API_KEY is not set in environment variables');
        }
    }

    /**
     * Generate text using Perplexity AI
     * @param {Object} messages - Array of message objects with role and content
     * @param {Object} options - Generation options (temperature, maxTokens, etc.)
     * @returns {Promise<string>} Generated text
     */
    async generateText(messages, options = {}) {
        if (!this.apiKey) {
            throw new Error('Perplexity API key is not configured');
        }

        const {
            temperature = 0.3,
            maxTokens = 512,
            model = 'sonar'
        } = options;

        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    response_format: { type: 'text' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 second timeout
                }
            );

            const content = response.data.choices[0]?.message?.content;

            if (!content) {
                throw new Error('No content in Perplexity API response');
            }

            return content;

        } catch (error) {
            console.error('Perplexity API Error:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                throw new Error('Invalid Perplexity API key');
            }

            if (error.response?.status === 429) {
                throw new Error('Perplexity API rate limit exceeded');
            }

            throw new Error(`Perplexity API error: ${error.message}`);
        }
    }

    /**
     * Generate follow-up questions for a startup idea
     * @param {string} startupIdea - The startup idea to generate questions for
     * @returns {Promise<string[]>} Array of 3 follow-up questions
     */
    async generateFollowUpQuestions(startupIdea) {
        const messages = [
            {
                role: 'system',
                content: `You are an expert startup consultant. Your job is to ask 3 critical, insightful follow-up questions to better understand a startup idea.

IMPORTANT RULES:
1. Questions must be SPECIFIC to the startup idea provided
2. Questions should help clarify the problem, solution, target market, or business model
3. Avoid generic questions - make them relevant to THIS specific idea
4. Return ONLY valid JSON in this exact format:
{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}

Do not include any other text, explanation, or markdown formatting.`
            },
            {
                role: 'user',
                content: `Startup Idea: """${startupIdea.trim()}"""

Generate 3 specific follow-up questions for this idea.`
            }
        ];

        try {
            const response = await this.generateText(messages);

            // Parse JSON response
            let data;
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    data = JSON.parse(response);
                }
            } catch (e) {
                console.error('Error parsing Perplexity JSON response:', e);
                throw new Error('Failed to parse questions from AI response');
            }

            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid questions format in AI response');
            }

            return data.questions.slice(0, 3);

        } catch (error) {
            console.error('Error generating follow-up questions:', error);
            throw error;
        }
    }

    /**
     * Check if the client is properly configured
     * @returns {boolean} True if API key is set
     */
    isConfigured() {
        return !!this.apiKey;
    }
}

// Export singleton instance
const perplexityClient = new PerplexityClient();
export default perplexityClient;
