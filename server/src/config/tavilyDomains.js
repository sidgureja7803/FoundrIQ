/**
 * Curated domain lists for Tavily search by agent type
 * Each agent searches specific authoritative domains for its specialty
 */

export const TAVILY_DOMAINS = {
  // Market Analysis - Market research firms and data providers
  marketAnalyst: [
    'statista.com',
    'grandviewresearch.com',
    'marketsandmarkets.com',
    'mordorintelligence.com',
    'ibisworld.com'
  ],

  // TAM/SAM Estimation - Investment and market sizing data
  tamSamEstimator: [
    'crunchbase.com',
    'pitchbook.com',
    'cbinsights.com',
    'data.worldbank.org',
    'statista.com'
  ],

  // Competitor Analysis - Startup databases and tech news
  competitorScanner: [
    'ycombinator.com',
    'producthunt.com',
    'angel.co',
    'techcrunch.com',
    'betalist.com',
    'crunchbase.com'
  ],

  // Feasibility Evaluation - Developer communities and tech forums
  feasibilityEvaluator: [
    'reddit.com',
    'medium.com',
    'dev.to',
    'github.com',
    'g2.com',
    'capterra.com'
  ],

  // Strategy Recommendations - Business strategy publications
  strategyRecommender: [
    'harvardbusinessreview.org',
    'forbes.com',
    'inc.com',
    'a16z.com',
    'firstround.com'
  ]
};

/**
 * Get domains for a specific agent type
 * @param {string} agentType - Agent type (marketAnalyst, tamSamEstimator, etc.)
 * @returns {string[]} Array of domains
 */
export function getDomainsForAgent(agentType) {
  return TAVILY_DOMAINS[agentType] || [];
}

/**
 * Get all unique domains across all agents
 * @returns {string[]} Array of all unique domains
 */
export function getAllDomains() {
  const allDomains = Object.values(TAVILY_DOMAINS).flat();
  return [...new Set(allDomains)];
}

export default TAVILY_DOMAINS;
