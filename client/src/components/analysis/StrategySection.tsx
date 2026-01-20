import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, MessageSquare, Calendar, DollarSign, Zap, AlertCircle, TrendingUp } from 'lucide-react';

interface StrategyProps {
  data?: {
    recommendations?: string[] | string;
    goToMarketStrategy?: string;
    targetMarket?: string | string[];
    differentiationStrategy?: string;
    pricingStrategy?: string;
    marketingChannels?: string[];
    timeline?: string;
    keyMetrics?: string[];
    nextSteps?: string[];
    competitivePositioning?: string;
  };
}

const StrategySection: React.FC<StrategyProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-2">Strategy</h2>
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No strategy data available</p>
        </div>
      </div>
    );
  }

  // Parse recommendations - could be string or array
  const recommendations = Array.isArray(data.recommendations)
    ? data.recommendations
    : (data.recommendations ? [data.recommendations] : []);

  // Parse target market
  const targetMarkets = Array.isArray(data.targetMarket)
    ? data.targetMarket
    : (data.targetMarket ? [data.targetMarket] : []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Strategy</h2>
      </div>

      {/* Go-to-Market Strategy */}
      {(data.goToMarketStrategy || data.competitivePositioning) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Target size={16} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold">Go-to-Market Strategy</h3>
          </div>

          <div className="space-y-4">
            {data.goToMarketStrategy && (
              <div>
                <p className="text-sm text-dark-200 leading-relaxed">{data.goToMarketStrategy}</p>
              </div>
            )}

            {data.competitivePositioning && (
              <div className="pt-4 border-t border-dark-700">
                <p className="text-xs font-semibold text-dark-500 mb-2">Competitive Positioning</p>
                <p className="text-sm text-dark-200 leading-relaxed">{data.competitivePositioning}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Target Markets */}
      {targetMarkets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <Users size={16} className="text-accent-cyan" />
            </div>
            <h3 className="text-lg font-semibold">Target Markets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {targetMarkets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-dark-800/50 rounded-lg p-3 flex items-start gap-2"
              >
                <Users size={14} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                <span className="text-xs text-dark-200">{market}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Marketing Channels */}
      {data.marketingChannels && data.marketingChannels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-accent-purple" />
            </div>
            <h3 className="text-lg font-semibold">Marketing Channels</h3>
          </div>

          <ul className="space-y-3">
            {data.marketingChannels.map((channel, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 text-sm text-dark-300"
              >
                <span className="text-accent-purple mt-0.5">•</span>
                <span>{channel}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Differentiation Strategy */}
        {data.differentiationStrategy && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-emerald/20 flex items-center justify-center">
                <Zap size={16} className="text-accent-emerald" />
              </div>
              <h3 className="text-lg font-semibold">Differentiation</h3>
            </div>
            <p className="text-sm text-dark-200 leading-relaxed">{data.differentiationStrategy}</p>
          </motion.div>
        )}

        {/* Pricing Strategy */}
        {data.pricingStrategy && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-orange/20 flex items-center justify-center">
                <DollarSign size={16} className="text-accent-orange" />
              </div>
              <h3 className="text-lg font-semibold">Pricing Strategy</h3>
            </div>
            <p className="text-sm text-dark-200 leading-relaxed">{data.pricingStrategy}</p>
          </motion.div>
        )}

        {/* Timeline */}
        {data.timeline && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Calendar size={16} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold">Timeline</h3>
            </div>
            <p className="text-sm text-dark-200 leading-relaxed">{data.timeline}</p>
          </motion.div>
        )}
      </div>

      {/* Key Metrics */}
      {data.keyMetrics && data.keyMetrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-accent-cyan" />
            </div>
            <h3 className="text-lg font-semibold">Key Metrics to Track</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.keyMetrics.map((metric, index) => (
              <div key={index} className="bg-dark-800/50 rounded-lg p-3 text-sm text-dark-300">
                {metric}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Strategic Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Target size={16} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold">Strategic Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-dark-200">
                <span className="text-primary-400 mt-0.5">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Next Steps */}
      {data.nextSteps && data.nextSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <ol className="space-y-2">
            {data.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-dark-300">
                <span className="text-primary-400 font-semibold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
};

export default StrategySection;
