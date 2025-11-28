/**
 * IBM Watsonx Client with IAM Token Authentication + Perplexity Backup
 * Uses IBM Granite AI for text generation with automatic fallback to Perplexity
 */
import fetch from 'node-fetch';

class IbmWatsonxClient {
  constructor() {
    // IBM Configuration
    this.ibmApiKey = process.env.IBM_WATSONX_API_KEY;
    this.ibmUrl = process.env.IBM_WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    this.ibmProjectId = process.env.IBM_WATSONX_PROJECT_ID;
    this.modelId = process.env.GRANITE_MODEL_ID || 'ibm/granite-3-3-8b-instruct';
    
    // Perplexity Configuration (Backup)
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    this.perplexityUrl = 'https://api.perplexity.ai/chat/completions';
    this.perplexityModel = 'sonar-pro';
    
    // Token caching for IBM
    this.cachedToken = null;
    this.tokenExpiry = 0;
    
    // Check IBM availability
    this.ibmDisabled = !this.ibmApiKey || !this.ibmProjectId;
    
    if (this.ibmDisabled) {
      console.warn('[IBM Watsonx] ⚠️  API key or Project ID missing - using Perplexity as primary');
    } else {
      console.log('[IBM Watsonx] ✅ Configured with IAM authentication');
    }
    
    if (!this.perplexityApiKey) {
      console.warn('[Perplexity] ⚠️  API key missing - no backup available');
    } else {
      console.log('[Perplexity] ✅ Configured as backup');
    }
  }

  /**
   * Get IAM access token for IBM Watsonx
   */
  async getIamToken() {
    const url = 'https://iam.cloud.ibm.com/identity/token';
    const body = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(this.ibmApiKey)}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to get IAM token: ${text}`);
      }

      const data = await res.json();
      const now = Math.floor(Date.now() / 1000);

      this.cachedToken = data.access_token;
      this.tokenExpiry = now + data.expires_in; // usually 3600 seconds

      console.log('[IBM Watsonx] ✅ IAM token refreshed');
      return this.cachedToken;
    } catch (error) {
      console.error('[IBM Watsonx] ❌ Failed to get IAM token:', error.message);
      throw error;
    }
  }

  /**
   * Get a valid token (auto-refresh if expired)
   */
  async getValidToken() {
    const now = Math.floor(Date.now() / 1000);
    if (!this.cachedToken || now > this.tokenExpiry - 60) {
      return await this.getIamToken();
    }
    return this.cachedToken;
  }

  /**
   * Call IBM Granite using IAM token
   */
  async callIbmGranite(messages) {
    const accessToken = await this.getValidToken();
    const url = `${this.ibmUrl}/ml/v1/text/chat?version=2023-05-29`;

    const body = {
      messages,
      project_id: this.ibmProjectId,
      model_id: this.modelId,
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: [],
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IBM Granite request failed: ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || data.results?.[0]?.generated_text || '';
  }

  /**
   * Call Perplexity API as backup
   */
  async callPerplexity(messages) {
    const res = await fetch(this.perplexityUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: this.perplexityModel,
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Perplexity request failed: ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Main text generation with automatic fallback
   */
  async generateText(prompt, opts = {}) {
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

    // Try IBM first if available
    if (!this.ibmDisabled) {
      try {
        console.log('[IBM Watsonx] 🚀 Calling IBM Granite...');
        const response = await this.callIbmGranite(messages);
        console.log('[IBM Watsonx] ✅ Success');
        return response;
      } catch (error) {
        console.error('[IBM Watsonx] ❌ Error:', error.message);
        console.log('[IBM Watsonx] 🔄 Falling back to Perplexity...');
      }
    }

    // Fallback to Perplexity
    if (this.perplexityApiKey) {
      try {
        console.log('[Perplexity] 🚀 Calling Perplexity...');
        const response = await this.callPerplexity(messages);
        console.log('[Perplexity] ✅ Success');
        return response;
      } catch (error) {
        console.error('[Perplexity] ❌ Error:', error.message);
      }
    }

    // Both failed - return friendly error message
    console.error('[AI] ❌ All AI providers unavailable');
    console.error('[AI] 💡 Add IBM_WATSONX_API_KEY or PERPLEXITY_API_KEY to .env');
    throw new Error('AI service unavailable. Please configure API keys.');
  }


  /**
   * Generate structured output (alias for generateText)
   */
  async generateStructuredOutput(systemPrompt, userInput, options = {}) {
    return await this.generateText({ systemPrompt, userPrompt: userInput }, options);
  }
}

const ibmWatsonxClient = new IbmWatsonxClient();

export default ibmWatsonxClient;
