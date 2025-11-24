import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

class IbmWatsonxClient {
  constructor() {
    this.disabled = false;

    // Map custom env vars to SDK-expected ones when possible
    if (process.env.IBM_WATSONX_API_KEY && !process.env.WATSONX_AI_APIKEY) {
      process.env.WATSONX_AI_APIKEY = process.env.IBM_WATSONX_API_KEY;
    }

    const serviceUrl = process.env.IBM_WATSONX_URL || process.env.WATSONX_AI_SERVICE_URL;
    const version = process.env.WATSONX_API_VERSION || '2024-05-31';

    if (!serviceUrl) {
      console.warn('[watsonx] IBM_WATSONX_URL / WATSONX_AI_SERVICE_URL not set. watsonx client is disabled.');
      this.disabled = true;
      return;
    }

    this.projectId = process.env.IBM_WATSONX_PROJECT_ID || process.env.WATSONX_AI_PROJECT_ID;
    this.spaceId = this.projectId ? undefined : (process.env.IBM_WATSONX_SPACE_ID || process.env.WATSONX_AI_SPACE_ID);

    this.modelId = process.env.GRANITE_MODEL_ID || 'ibm/granite-13b-instruct-v2';
    this.embeddingModelId = process.env.GRANITE_EMBEDDING_MODEL_ID || this.modelId;
    this.classificationModelId = process.env.GRANITE_CLASSIFICATION_MODEL_ID || this.modelId;

    this.maxRetries = parseInt(process.env.WATSONX_MAX_RETRIES || '2', 10);
    this.timeoutMs = parseInt(process.env.WATSONX_TIMEOUT_MS || '30000', 10);

    this.client = WatsonXAI.newInstance({
      version,
      serviceUrl,
    });
  }

  async generateText(prompt, opts = {}) {
    if (this.disabled) {
      return 'Model temporarily unavailable — please try again later.';
    }

    const maxRetries = opts.maxRetries != null ? opts.maxRetries : this.maxRetries;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const { input, modelId, parameters } = this._buildTextParams(prompt, opts);

        const params = {
          input,
          modelId,
          projectId: this.projectId,
          spaceId: this.spaceId,
          parameters,
        };

        const res = await this.client.generateText(params);
        const text = res.result?.results?.[0]?.generated_text || '';
        return text || 'Model response was empty.';
      } catch (err) {
        lastError = err;
        console.error(`[watsonx] generateText attempt ${attempt + 1} failed:`, err.message || err);

        if (attempt >= maxRetries) {
          console.error('[watsonx] Max retries reached, returning safe fallback.');
          return 'Model temporarily unavailable — please try again later.';
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    return 'Model temporarily unavailable — please try again later.';
  }

  _buildTextParams(prompt, opts) {
    let input;
    if (typeof prompt === 'string') {
      input = prompt;
    } else if (prompt && typeof prompt === 'object') {
      const systemPrompt = prompt.systemPrompt || '';
      const userPrompt = prompt.userPrompt || '';
      input = systemPrompt ? `${systemPrompt}\n\nUser:\n${userPrompt}` : userPrompt;
    } else {
      throw new Error('Invalid prompt type for generateText');
    }

    const modelId = opts.modelId || this.modelId;
    const parameters = {
      max_new_tokens: opts.maxTokens || opts.max_new_tokens || 1024,
      temperature: opts.temperature != null ? opts.temperature : 0.3,
      top_p: opts.top_p != null ? opts.top_p : 0.9,
      time_limit: this.timeoutMs,
    };

    return { input, modelId, parameters };
  }

  async generateStructuredOutput(systemPrompt, userInput, options = {}, _complexity) {
    const text = await this.generateText({ systemPrompt, userPrompt: userInput }, options);
    return text;
  }

  async createEmbedding(text) {
    if (this.disabled) {
      return [];
    }

    const inputs = Array.isArray(text) ? text : [text];

    try {
      const params = {
        inputs,
        modelId: this.embeddingModelId,
        projectId: this.projectId,
        spaceId: this.spaceId,
      };

      const res = await this.client.embedText(params);
      const vectors = res.result?.results || [];
      return Array.isArray(text) ? vectors : (vectors[0] || []);
    } catch (err) {
      console.error('[watsonx] createEmbedding error:', err.message || err);
      return Array.isArray(text) ? [] : [];
    }
  }

  async classify(text, opts = {}) {
    const labels = opts.labels || [];
    const systemPrompt = labels.length
      ? `Classify the given text into one of the following labels: ${labels.join(', ')}. Respond with a single label name and an optional confidence score.`
      : 'Classify the given text and explain your reasoning. Return a short label and a brief rationale.';

    const response = await this.generateText({ systemPrompt, userPrompt: text }, opts);

    return {
      raw: response,
    };
  }

  async promptTuneIfConfigured(_dataset) {
    console.log('[watsonx] promptTuneIfConfigured called, but no tuning is configured.');
    return { configured: false };
  }
}

const ibmWatsonxClient = new IbmWatsonxClient();

export default ibmWatsonxClient;
