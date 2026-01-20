import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Settings, Award, AlertCircle } from 'lucide-react';

interface FeasibilityProps {
  data?: {
    technicalFeasibility?: string | { score?: number; assessment?: string; details?: string };
    operationalFeasibility?: string | { score?: number; assessment?: string; details?: string };
    financialFeasibility?: string | { score?: number; assessment?: string; details?: string };
    marketFeasibility?: string | { score?: number; assessment?: string; details?: string };
    overallScore?: number;
    opportunities?: string[];
    challenges?: string[];
    risks?: string[];
    recommendations?: string[];
  };
}

const FeasibilitySection: React.FC<FeasibilityProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-2">Feasibility</h2>
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No feasibility data available</p>
        </div>
      </div>
    );
  }

  const getFeasibilityColor = (score: number) => {
    if (score >= 8) return 'text-accent-emerald';
    if (score >= 6) return 'text-accent-orange';
    return 'text-red-400';
  };

  const parseFeasibility = (feas: any) => {
    if (typeof feas === 'string') {
      return { assessment: feas, score: 7 };
    }
    return {
      score: feas?.score || 7,
      assessment: feas?.assessment || feas?.details || 'No details available'
    };
  };

  const technical = parseFeasibility(data.technicalFeasibility);
  const operational = parseFeasibility(data.operationalFeasibility);
  const financial = parseFeasibility(data.financialFeasibility);
  const market = parseFeasibility(data.marketFeasibility);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Feasibility</h2>
        {data.overallScore && (
          <p className="text-sm text-gray-400">
            Overall Score: <span className={`font-semibold ${getFeasibilityColor(data.overallScore)}`}>
              {data.overallScore}/10
            </span>
          </p>
        )}
      </div>

      {/* Opportunities and Challenges */}
      {(data.opportunities || data.challenges) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opportunities */}
          {data.opportunities && data.opportunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-emerald/20 flex items-center justify-center">
                  <TrendingUp size={16} className="text-accent-emerald" />
                </div>
                <h3 className="text-lg font-semibold">Opportunities</h3>
              </div>
              <ul className="space-y-3">
                {data.opportunities.map((opportunity, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-dark-300"
                  >
                    <span className="text-accent-emerald mt-0.5 flex-shrink-0">•</span>
                    <span>{opportunity}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Challenges */}
          {data.challenges && data.challenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-400/20 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Challenges</h3>
              </div>
              <ul className="space-y-3">
                {data.challenges.map((challenge, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-dark-300"
                  >
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    <span>{challenge}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* Feasibility Scores */}
      <div className="space-y-4">
        {/* Technical Feasibility */}
        {data.technicalFeasibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Settings size={20} className="text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Technical Feasibility</h3>
                </div>
                <div className={`text-3xl font-bold ${getFeasibilityColor(technical.score)}`}>
                  {technical.score}/10
                </div>
              </div>

              <div className="mb-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${technical.score * 10}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${technical.score >= 8 ? 'bg-accent-emerald' : technical.score >= 6 ? 'bg-accent-orange' : 'bg-red-400'}`}
                />
              </div>

              <p className="text-sm text-dark-300 leading-relaxed">{technical.assessment}</p>
            </div>
          </motion.div>
        )}

        {/* Operational Feasibility */}
        {data.operationalFeasibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                    <Award size={20} className="text-accent-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold">Operational Feasibility</h3>
                </div>
                <div className={`text-3xl font-bold ${getFeasibilityColor(operational.score)}`}>
                  {operational.score}/10
                </div>
              </div>

              <div className="mb-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${operational.score * 10}%` }}
                  transition={{ duration: 1, delay: 0.55 }}
                  className={`h-full ${operational.score >= 8 ? 'bg-accent-emerald' : operational.score >= 6 ? 'bg-accent-orange' : 'bg-red-400'}`}
                />
              </div>

              <p className="text-sm text-dark-300 leading-relaxed">{operational.assessment}</p>
            </div>
          </motion.div>
        )}

        {/* Financial Feasibility */}
        {data.financialFeasibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-emerald/20 flex items-center justify-center">
                    <TrendingUp size={20} className="text-accent-emerald" />
                  </div>
                  <h3 className="text-lg font-semibold">Financial Feasibility</h3>
                </div>
                <div className={`text-3xl font-bold ${getFeasibilityColor(financial.score)}`}>
                  {financial.score}/10
                </div>
              </div>

              <div className="mb-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${financial.score * 10}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className={`h-full ${financial.score >= 8 ? 'bg-accent-emerald' : financial.score >= 6 ? 'bg-accent-orange' : 'bg-red-400'}`}
                />
              </div>

              <p className="text-sm text-dark-300 leading-relaxed">{financial.assessment}</p>
            </div>
          </motion.div>
        )}

        {/* Market Feasibility */}
        {data.marketFeasibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                    <Award size={20} className="text-accent-purple" />
                  </div>
                  <h3 className="text-lg font-semibold">Market Feasibility</h3>
                </div>
                <div className={`text-3xl font-bold ${getFeasibilityColor(market.score)}`}>
                  {market.score}/10
                </div>
              </div>

              <div className="mb-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${market.score * 10}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className={`h-full ${market.score >= 8 ? 'bg-accent-emerald' : market.score >= 6 ? 'bg-accent-orange' : 'bg-red-400'}`}
                />
              </div>

              <p className="text-sm text-dark-300 leading-relaxed">{market.assessment}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default FeasibilitySection;
