import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Database, Search } from 'lucide-react';

const HackathonDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            FoundrIQ Hackathon Demo
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Agentic AI Hackathon with IBM watsonx.orchestrate
          </p>
          <a
            href="https://lablab.ai/event/agentic-ai-hackathon-ibm-watsonx-orchestrate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View Hackathon Page →
          </a>
        </motion.div>

        {/* Technology Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* IBM Granite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold">IBM Granite</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Enterprise-ready foundation models from IBM Watson for advanced business analysis
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ 5 Specialized AI Agents</li>
              <li>✓ Enterprise-grade reasoning</li>
              <li>✓ Structured JSON outputs</li>
            </ul>
          </motion.div>

          {/* Tavily Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border border-emerald-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold">Tavily</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Real-time web search API for live market intelligence and competitor research
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Real-time market data</li>
              <li>✓ Competitor intelligence</li>
              <li>✓ Rate-limited requests</li>
            </ul>
          </motion.div>

          {/* Appwrite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-900/30 to-pink-800/10 border border-pink-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-pink-400" />
              <h3 className="text-2xl font-bold">Appwrite</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Open-source backend providing authentication, database, and storage
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ OAuth (GitHub/Google)</li>
              <li>✓ Document storage</li>
              <li>✓ Real-time database</li>
            </ul>
          </motion.div>
        </div>

        {/* Agent Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 border border-purple-500/30 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Multi-Agent Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Market Analyst', icon: '🏢', desc: 'Market size & trends' },
              { name: 'TAM/SAM Estimator', icon: '💡', desc: 'Market sizing' },
              { name: 'Competitor Scanner', icon: '⚔️', desc: 'Competitive landscape' },
              { name: 'Feasibility Evaluator', icon: '🔬', desc: 'Viability assessment' },
              { name: 'Strategy Recommender', icon: '🧭', desc: 'GTM strategies' },
              { name: 'Agent Orchestrator', icon: '⚙️', desc: 'Coordinates all agents' },
            ].map((agent) => (
              <div
                key={agent.name}
                className="bg-black/30 border border-gray-700 rounded-lg p-4"
              >
                <div className="text-2xl mb-2">{agent.icon}</div>
                <h4 className="font-bold text-white mb-1">{agent.name}</h4>
                <p className="text-sm text-gray-400">{agent.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Implementation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 border border-gray-700 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6">Technical Implementation</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">IBM Granite Integration</h3>
              <p className="text-gray-300 mb-2">
                Each agent uses IBM Granite foundation models for advanced reasoning and structured analysis.
                The ibmWatsonxClient provides a consistent interface for all AI operations.
              </p>
              <pre className="bg-black/50 border border-gray-700 rounded p-4 text-sm overflow-x-auto">
                {`// Example from Market Analyst Agent
const analysis = await ibmWatsonxClient.generateText({
  systemPrompt: "Expert market analyst...",
  userPrompt: ideaDescription
}, { temperature: 0.3, maxTokens: 1500 });`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-2">Tavily Search Integration</h3>
              <p className="text-gray-300 mb-2">
                Real-time market intelligence gathered through Tavily's advanced web search API,
                providing up-to-date competitor and market data.
              </p>
              <pre className="bg-black/50 border border-gray-700 rounded p-4 text-sm overflow-x-auto">
                {`// Example from Competitor Scanner
const results = await tavilyClient.search(
  \`\${idea} competitors market players\`,
  { maxResults: 8 }
);`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-pink-400 mb-2">Agent Orchestration</h3>
              <p className="text-gray-300 mb-2">
                The orchestrator coordinates all 5 agents, running them sequentially or in parallel,
                then aggregates results into a comprehensive validation report.
              </p>
              <pre className="bg-black/50 border border-gray-700 rounded p-4 text-sm overflow-x-auto">
                {`// Agent Orchestrator
const results = await agentOrchestrator.runAnalysis(
  ideaData,
  { sequential: true }
);`}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built for lablab.ai Agentic AI Hackathon with IBM watsonx.orchestrate</p>
          <p className="mt-2">Powered by IBM Granite, Tavily, and Appwrite</p>
        </div>
      </div>
    </div>
  );
};

export default HackathonDemoPage;
