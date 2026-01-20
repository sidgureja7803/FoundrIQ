import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import Bottleneck from 'bottleneck';
import { SearchTool } from './SearchTool.js';
import { getDomainsForAgent } from '../config/tavilyDomains.js';

// Singleton instance
let instance = null;
let isInitialized = false;

/**
 * Tavily search adapter with feature flag support (Singleton)
 */
export class TavilySearchTool extends SearchTool {
  constructor() {
    // Return existing instance if already created
    if (instance) {
      return instance;
    }

    super();

    // Enable Tavily by default (can be disabled with ENABLE_TAVILY=false)
    this.enabled = process.env.ENABLE_TAVILY !== 'false';

    if (this.enabled) {
      if (!process.env.TAVILY_API_KEY) {
        // API key not set, disable Tavily
        this.enabled = false;
        instance = this;
        return instance;
      }

      // Initialize Tavily search tool
      this.tavilySearch = new TavilySearchResults({
        apiKey: process.env.TAVILY_API_KEY,
        maxResults: parseInt(process.env.TAVILY_MAX_RESULTS || '8'),
        searchDepth: 'advanced'
      });

      // Rate limiter: 10 requests per minute by default
      const rateLimit = parseInt(process.env.TAVILY_RATE_LIMIT || '10');
      this.limiter = new Bottleneck({
        minTime: Math.ceil(60000 / rateLimit),
        maxConcurrent: 1
      });

      isInitialized = true;
    } else {
      isInitialized = true;
    }

    instance = this;
  }

  /**
   * Check if Tavily is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Execute search via Tavily API
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @param {string[]} options.includeDomains - Domains to include
   * @param {string[]} options.excludeDomains - Domains to exclude
   * @param {string} options.agentType - Agent type for domain-specific search
   * @returns {Promise<SearchResult[]>}
   */
  async search(query, options = {}) {
    if (!this.enabled) {
      console.log('[Tavily] Skipping search - disabled');
      return [];
    }

    const startTime = Date.now();

    try {
      // Get agent-specific domains if agentType is provided
      let includeDomains = options.includeDomains;
      if (options.agentType && !includeDomains) {
        includeDomains = getDomainsForAgent(options.agentType);
        if (includeDomains.length > 0) {
          console.log(`[Tavily] Using ${includeDomains.length} curated domains for ${options.agentType}`);
        }
      }

      console.log(`[Tavily] Searching: "${query}"`);

      // Prepare search options
      const searchOptions = {
        include_domains: includeDomains || undefined,
        exclude_domains: options.excludeDomains || undefined,
      };

      // Use rate limiter
      const rawResults = await this.limiter.schedule(() =>
        this.tavilySearch.invoke(query, searchOptions)
      );

      const duration = Date.now() - startTime;
      console.log(`[Tavily] Search completed in ${duration}ms`);

      // Normalize results
      const results = rawResults.map(result => this.normalizeResult(result));

      console.log(`[Tavily] Found ${results.length} results`);

      return results;

    } catch (error) {
      console.error('[Tavily] Search error:', error.message);

      // Check if it's an API key issue
      if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('API key')) {
        const apiKeyError = new Error('Tavily API key is invalid or missing. Please check your TAVILY_API_KEY environment variable.');
        apiKeyError.name = 'TavilyAPIKeyError';
        apiKeyError.code = 'TAVILY_API_KEY_INVALID';
        throw apiKeyError;
      }

      // Check for rate limiting
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        const rateLimitError = new Error('Tavily API rate limit exceeded. Please try again in a few moments.');
        rateLimitError.name = 'TavilyRateLimitError';
        rateLimitError.code = 'TAVILY_RATE_LIMIT';
        throw rateLimitError;
      }

      // For other errors, throw a generic Tavily error
      const tavilyError = new Error(`Tavily search failed: ${error.message}`);
      tavilyError.name = 'TavilySearchError';
      tavilyError.code = 'TAVILY_SEARCH_FAILED';
      tavilyError.originalError = error;
      throw tavilyError;
    }
  }

  /**
   * Search with agent-specific curated domains
   * Convenience method for agent-specific searches
   * @param {string} query - Search query
   * @param {string} agentType - Agent type (marketAnalyst, tamSamEstimator, etc.)
   * @param {object} additionalOptions - Additional search options
   * @returns {Promise<SearchResult[]>}
   */
  async searchForAgent(query, agentType, additionalOptions = {}) {
    return this.search(query, { ...additionalOptions, agentType });
  }

  /**
   * Normalize Tavily result to standard SearchResult format
   * @param {object} rawResult - Raw result from Tavily
   * @returns {SearchResult}
   */
  normalizeResult(rawResult) {
    try {
      const url = new URL(rawResult.url);
      const domain = url.hostname.replace('www.', '');

      return {
        url: rawResult.url,
        title: rawResult.title || domain,
        snippet: rawResult.content || '',
        content: rawResult.content || '',
        metadata: {
          domain,
          source: 'tavily',
          fetchedAt: new Date(),
          score: rawResult.score || 0.5,
          publishedDate: rawResult.published_date || null
        }
      };
    } catch (error) {
      console.error('[Tavily] Error normalizing result:', error.message);

      // Fallback normalization
      return {
        url: rawResult.url || 'unknown',
        title: rawResult.title || 'Untitled',
        snippet: rawResult.content || '',
        content: rawResult.content || '',
        metadata: {
          domain: 'unknown',
          source: 'tavily',
          fetchedAt: new Date(),
          score: 0.5
        }
      };
    }
  }
}

export default TavilySearchTool;
