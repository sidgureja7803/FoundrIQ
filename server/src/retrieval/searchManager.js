import { PerplexitySearchTool } from './perplexity.js';
import { TavilySearchTool } from './tavily.js';
import DedupeRanker from './dedupeRank.js';

/**
 * Unified search manager that intelligently combines multiple search providers
 * Perplexity: LLM-based search with reasoning and answers
 * Tavily: Web search with domain-specific targeting
 */
export class SearchManager {
  constructor() {
    // Initialize Perplexity (required)
    this.perplexity = new PerplexitySearchTool();
    
    // Initialize Tavily (optional, feature-flagged)
    this.tavily = new TavilySearchTool();
    
    // Initialize deduplicator/ranker
    this.ranker = new DedupeRanker();
    
    console.log('[SearchManager] Initialized with providers:', {
      perplexity: true,
      tavily: this.tavily.isEnabled()
    });
  }

  /**
   * Execute search with automatic provider selection
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @param {string} options.agentType - Agent type for domain-specific search
   * @param {string[]} options.includeDomains - Specific domains to search
   * @param {boolean} options.preferTavily - Prefer Tavily for this search
   * @param {boolean} options.combineResults - Combine both providers (default: false)
   * @returns {Promise<SearchResult[]>}
   */
  async search(query, options = {}) {
    const { agentType, combineResults = false, preferTavily = false } = options;

    try {
      // Strategy 1: Combine both providers for comprehensive results
      if (combineResults && this.tavily.isEnabled()) {
        console.log('[SearchManager] Using combined search strategy');
        return await this.searchCombined(query, options);
      }

      // Strategy 2: Prefer Tavily for domain-specific searches
      if ((preferTavily || agentType) && this.tavily.isEnabled()) {
        console.log('[SearchManager] Using Tavily for domain-specific search');
        return await this.tavily.searchForAgent(query, agentType, options);
      }

      // Strategy 3: Fallback to Perplexity (always available)
      console.log('[SearchManager] Using Perplexity for search');
      return await this.perplexity.search(query, options);

    } catch (error) {
      console.error('[SearchManager] Search error:', error.message);
      
      // Attempt fallback if primary fails
      if (this.tavily.isEnabled() && !preferTavily) {
        console.log('[SearchManager] Falling back to Tavily');
        return await this.tavily.search(query, options);
      }

      throw error;
    }
  }

  /**
   * Search with both providers and combine/deduplicate results
   * @param {string} query - Search query
   * @param {object} options - Search options
   * @returns {Promise<SearchResult[]>}
   */
  async searchCombined(query, options = {}) {
    console.log('[SearchManager] Executing parallel search across providers');

    const searches = [
      this.perplexity.search(query, options).catch(err => {
        console.error('[SearchManager] Perplexity failed:', err.message);
        return [];
      })
    ];

    // Add Tavily if enabled
    if (this.tavily.isEnabled()) {
      const tavilyOptions = options.agentType 
        ? { ...options, agentType: options.agentType }
        : options;
      
      searches.push(
        this.tavily.search(query, tavilyOptions).catch(err => {
          console.error('[SearchManager] Tavily failed:', err.message);
          return [];
        })
      );
    }

    // Execute in parallel
    const results = await Promise.all(searches);
    
    // Flatten and combine
    const allResults = results.flat();
    console.log(`[SearchManager] Got ${allResults.length} total results before deduplication`);

    // Deduplicate and rank
    const dedupedResults = this.ranker.deduplicate(allResults);
    const rankedResults = this.ranker.rank(dedupedResults);
    console.log(`[SearchManager] Returning ${rankedResults.length} deduplicated results`);

    return rankedResults;
  }

  /**
   * Agent-specific search with curated domains (Tavily) + reasoning (Perplexity)
   * Combines both for comprehensive agent research
   * @param {string} query - Search query
   * @param {string} agentType - Agent type
   * @returns {Promise<SearchResult[]>}
   */
  async searchForAgent(query, agentType) {
    console.log(`[SearchManager] Agent-specific search for: ${agentType}`);
    
    if (this.tavily.isEnabled()) {
      // Use combined search with agent-specific domains
      return await this.searchCombined(query, { agentType });
    } else {
      // Fallback to Perplexity only
      console.log('[SearchManager] Tavily disabled, using Perplexity only');
      return await this.perplexity.search(query);
    }
  }

  /**
   * Get available search providers
   * @returns {object} Provider availability status
   */
  getProviders() {
    return {
      perplexity: true,
      tavily: this.tavily.isEnabled()
    };
  }
}

// Singleton instance
let instance = null;

/**
 * Get SearchManager singleton instance
 * @returns {SearchManager}
 */
export function getSearchManager() {
  if (!instance) {
    instance = new SearchManager();
  }
  return instance;
}

export default SearchManager;
