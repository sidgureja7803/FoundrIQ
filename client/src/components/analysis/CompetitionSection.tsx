import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp, Target, AlertCircle } from 'lucide-react';

interface Competitor {
  name: string;
  description?: string;
  marketShare?: string;
  strengths?: string[];
  weaknesses?: string[];
  pricing?: string;
  url?: string;
}

interface CompetitionProps {
  data?: {
    competitors?: Competitor[];
    directCompetitors?: Competitor[];
    indirectCompetitors?: Competitor[];
    marketGaps?: string[];
    competitiveAdvantage?: string;
    differentiation?: string;
    threatLevel?: string;
    recommendedStrategy?: string;
  };
}

const CompetitionSection: React.FC<CompetitionProps> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!data) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-2">Competition</h2>
        <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">No competition data available</p>
        </div>
      </div>
    );
  }

  const allCompetitors = [
    ...(data.directCompetitors || []),
    ...(data.indirectCompetitors || []),
    ...(data.competitors || [])
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Competition</h2>
        {data.threatLevel && (
          <p className="text-sm text-gray-400">
            Threat Level: <span className={`font-semibold ${data.threatLevel.toLowerCase() === 'high' ? 'text-red-400' :
                data.threatLevel.toLowerCase() === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
              }`}>{data.threatLevel}</span>
          </p>
        )}
      </div>

      {/* Market Leaders */}
      {allCompetitors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-primary-400" />
            <h3 className="text-xl font-semibold">
              {data.directCompetitors?.length ? 'Direct Competitors' : 'Market Players'}
            </h3>
          </div>

          <div className="space-y-3">
            {allCompetitors.map((competitor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-dark-900/50 border border-dark-700 rounded-xl overflow-hidden"
              >
                {/* Competitor Header */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-dark-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div>
                      <h4 className="text-lg font-semibold text-primary-400">
                        {competitor.name || `Competitor ${index + 1}`}
                      </h4>
                      {competitor.description && (
                        <p className="text-sm text-dark-400 mt-1">{competitor.description}</p>
                      )}
                      {competitor.marketShare && (
                        <p className="text-sm text-dark-400 mt-1">Market share: {competitor.marketShare}</p>
                      )}
                    </div>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp size={20} className="text-dark-400" />
                  ) : (
                    <ChevronDown size={20} className="text-dark-400" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-dark-700"
                    >
                      <div className="p-6 space-y-4">
                        {/* URL */}
                        {competitor.url && (
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Website</p>
                            <a
                              href={competitor.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-400 hover:underline"
                            >
                              {competitor.url}
                            </a>
                          </div>
                        )}

                        {/* Strengths & Weaknesses */}
                        {(competitor.strengths || competitor.weaknesses) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            {competitor.strengths && competitor.strengths.length > 0 && (
                              <div className="bg-dark-800/50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-accent-emerald mb-3">Strengths</p>
                                <ul className="space-y-2">
                                  {competitor.strengths.map((strength, i) => (
                                    <li key={i} className="text-xs text-dark-300 flex items-start gap-2">
                                      <span className="text-accent-emerald mt-0.5">•</span>
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Weaknesses */}
                            {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                              <div className="bg-dark-800/50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-red-400 mb-3">Weaknesses</p>
                                <ul className="space-y-2">
                                  {competitor.weaknesses.map((weakness, i) => (
                                    <li key={i} className="text-xs text-dark-300 flex items-start gap-2">
                                      <span className="text-red-400 mt-0.5">•</span>
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Pricing */}
                        {competitor.pricing && (
                          <div className="flex items-center justify-between pt-2 border-t border-dark-700">
                            <span className="text-xs text-dark-400">Pricing</span>
                            <span className="text-sm font-semibold text-white">{competitor.pricing}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Market Gaps */}
      {data.marketGaps && data.marketGaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-900/50 border border-dark-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-accent-emerald" />
            <h3 className="text-lg font-semibold">Market Gaps & Opportunities</h3>
          </div>
          <ul className="space-y-2">
            {data.marketGaps.map((gap, index) => (
              <li key={index} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="text-accent-emerald mt-0.5">✓</span>
                {gap}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Our Competitive Advantage */}
      {(data.competitiveAdvantage || data.differentiation) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Target size={16} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold">Our Competitive Advantage</h3>
          </div>
          <p className="text-dark-200 leading-relaxed mb-4">
            {data.competitiveAdvantage || data.differentiation}
          </p>
          {data.recommendedStrategy && (
            <div className="pt-4 border-t border-primary-500/20">
              <p className="text-xs font-semibold text-primary-400 mb-2">Recommended Strategy</p>
              <p className="text-sm text-dark-300">{data.recommendedStrategy}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CompetitionSection;
