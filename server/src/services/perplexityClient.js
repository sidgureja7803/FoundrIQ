import fetch from 'node-fetch';

class PerplexityClient {
    constructor() {
        this.apiKey = process.env.PERPLEXITY_API_KEY;
        this.url = 'https://api.perplexity.ai/chat/completions';
        // using sonar-pro for online capabilities as requested by user's "single api key" constraint
        // this model is capable of searching the web
        this.model = 'sonar-pro';
    }

    async generateText(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('PERPLEXITY_API_KEY is not configured');
        }

        let messages = [];
        if (typeof prompt === 'string') {
            messages = [{ role: 'user', content: prompt }];
        } else {
            if (prompt.systemPrompt) messages.push({ role: 'system', content: prompt.systemPrompt });
            if (prompt.userPrompt) messages.push({ role: 'user', content: prompt.userPrompt });
        }

        const body = {
            model: this.model,
            messages,
            temperature: options.temperature || 0.2, // Low temperature for factual tasks
            max_tokens: options.maxTokens || 2000,
            top_p: options.topP || 0.9,
            stream: false
        };

        try {
            console.log('[Perplexity] 🚀 Sending request...');
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Perplexity API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';
            console.log('[Perplexity] ✅ Success');
            return content;
        } catch (error) {
            console.error('[Perplexity] ❌ Error:', error.message);
            throw error;
        }
    }

    async generateStructuredOutput(systemPrompt, userInput, options = {}) {
        return this.generateText({ systemPrompt, userPrompt: userInput }, options);
    }
}

const perplexityClient = new PerplexityClient();
export default perplexityClient;
