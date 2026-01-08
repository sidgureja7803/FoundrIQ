/**
 * AI Client - Perplexity API Only
 * Unified client for all AI operations using Perplexity's Sonar model
 */
import fetch from 'node-fetch';

class AIClient {
    constructor() {
        // Perplexity Configuration
        this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
        this.perplexityUrl = 'https://api.perplexity.ai/chat/completions';
        this.perplexityModel = 'sonar';

        if (!this.perplexityApiKey) {
            console.warn('⚠️  PERPLEXITY_API_KEY is not set in environment variables');
        }
    }

    /**
     * Check if the client is properly configured
     * @returns {boolean} True if API key is set
     */
    isConfigured() {
        return !!this.perplexityApiKey;
    }

    /**
     * Call Perplexity API
     */
    async callPerplexity(messages, options = {}) {
        if (!this.perplexityApiKey) {
            throw new Error('Perplexity API key is not configured');
        }

        const {
            temperature = 0.3,
            maxTokens = 2000,
            model = this.perplexityModel
        } = options;

        try {
            const res = await fetch(this.perplexityUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.perplexityApiKey}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages,
                    temperature: temperature,
                    max_tokens: maxTokens,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('[Perplexity] ❌ Error response:', text);

                if (res.status === 401) {
                    throw new Error('Invalid Perplexity API key');
                }
                if (res.status === 429) {
                    throw new Error('Perplexity API rate limit exceeded');
                }
                throw new Error(`Perplexity request failed: ${text}`);
            }

            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No content in Perplexity API response');
            }

            return content;
        } catch (error) {
            console.error('[Perplexity] ❌ Error:', error.message);
            throw error;
        }
    }

    /**
     * Main text generation method
     * @param {string|object} prompt - Either a string or object with systemPrompt and userPrompt
     * @param {object} options - Generation options (temperature, maxTokens, etc.)
     * @returns {Promise<string>} Generated text
     */
    async generateText(prompt, options = {}) {
        // Build messages from prompt
        let messages;
        if (typeof prompt === 'string') {
            messages = [{ role: 'user', content: prompt }];
        } else if (prompt && typeof prompt === 'object') {
            const systemPrompt = prompt.systemPrompt || '';
            const userPrompt = prompt.userPrompt || '';
            messages = [];
            if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
            if (userPrompt) messages.push({ role: 'user', content: userPrompt });
        } else {
            throw new Error('Invalid prompt type for generateText');
        }

        console.log('[Perplexity] 🚀 Calling Perplexity Sonar...');
        const response = await this.callPerplexity(messages, options);
        console.log('[Perplexity] ✅ Success');
        return response;
    }

    /**
     * Generate structured output (alias for generateText)
     */
    async generateStructuredOutput(systemPrompt, userInput, options = {}) {
        return await this.generateText({ systemPrompt, userPrompt: userInput }, options);
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
            const response = await this.callPerplexity(messages, { maxTokens: 512 });

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
}

// Export singleton instance
const aiClient = new AIClient();
export default aiClient;
