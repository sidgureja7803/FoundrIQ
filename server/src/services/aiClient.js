/**
 * AI Client - Perplexity API Only
 * Unified client for all AI operations using Perplexity's Sonar model
 */
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

class AIClient {
    constructor() {
        // Perplexity Configuration
        this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
        this.perplexityUrl = 'https://api.perplexity.ai/chat/completions';
        this.perplexityModel = 'sonar';

        if (!this.perplexityApiKey) {
            console.warn('⚠️  PERPLEXITY_API_KEY is not set in environment variables');
            console.warn('⚠️  Please add PERPLEXITY_API_KEY to your .env file');
        } else {
            console.log('✅ Perplexity AI Client initialized successfully');
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
     * @returns {Promise<string[]>} Array of 3 crisp follow-up questions
     */
    async generateFollowUpQuestions(startupIdea) {
        const messages = [
            {
                role: 'system',
                content: `You are a startup consultant. Generate 3 CRISP, TO-THE-POINT questions to understand the startup idea better.

RULES:
1. Questions must be SHORT (max 10-12 words each)
2. Questions must be SPECIFIC to this idea
3. Focus on: target customers, key problem, or unique solution
4. NO generic questions
5. Return ONLY valid JSON:
{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}

No markdown, no commentary.`
            },
            {
                role: 'user',
                content: `Startup Idea: """${startupIdea.trim()}"""

Generate 3 crisp questions.`
            }
        ];

        try {
            const response = await this.callPerplexity(messages, { maxTokens: 400 });

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
     * Generate a crisp startup idea summary
     * @param {string} rawIdea - The raw startup idea
     * @param {string} answers - Combined answers from the user
     * @returns {Promise<string>} A crisp 2-3 sentence startup idea summary
     */
    async generateStartupSummary(rawIdea, answers) {
        const messages = [
            {
                role: 'system',
                content: `You are a startup expert. Generate a CRISP, TO-THE-POINT startup idea summary (2-3 sentences max).

Focus on:
- What problem it solves
- Who it's for
- What makes it unique

BE CONCISE. NO fluff.`
            },
            {
                role: 'user',
                content: `Raw Idea: """${rawIdea.trim()}"""

User provided context: """${answers}"""

Generate a crisp 2-3 sentence startup idea summary.`
            }
        ];

        try {
            const response = await this.callPerplexity(messages, { maxTokens: 200 });
            return response.trim();
        } catch (error) {
            console.error('Error generating startup summary:', error);
            throw error;
        }
    }
}

// Export singleton instance
const aiClient = new AIClient();
export default aiClient;
