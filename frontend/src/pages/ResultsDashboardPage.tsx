import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  Target, 
  CheckCircle, 
  Rocket,
  Download,
  FileText,
  Loader,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Globe,
  Shield
} from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
  id: string;
  idea: {
    description: string;
    category: string;
    targetAudience: string;
    problemSolved: string;
  };
  results: {
    marketResearch: any;
    tamSamSom: any;
    culturalAlignment: any;
    competition: any;
    feasibility: any;
    strategy: any;
  };
  status: 'pending' | 'completed' | 'error';
  createdAt: string;
}

const ResultsDashboardPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('market');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'market', label: 'Market Analysis', icon: Search, color: 'blue' },
    { id: 'tam', label: 'TAM/SAM/SOM', icon: BarChart3, color: 'green' },
    { id: 'competition', label: 'Competition', icon: Target, color: 'red' },
    { id: 'feasibility', label: 'Feasibility', icon: CheckCircle, color: 'yellow' },
    { id: 'strategy', label: 'Strategy', icon: Rocket, color: 'purple' }
  ];

  useEffect(() => {
    const fetchAnalysisResult = async () => {
      if (!analysisId) return;
      
      try {
        const response = await axios.get(`/api/analysis/${analysisId}`);
        setAnalysisResult(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load analysis results');
        setLoading(false);
      }
    };

    fetchAnalysisResult();
    
    // Poll for updates if analysis is still pending
    const interval = setInterval(() => {
      if (analysisResult?.status === 'pending') {
        fetchAnalysisResult();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [analysisId, analysisResult?.status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Analysis Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we retrieve your startup analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Analysis Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'We couldn\'t find the requested analysis.'}
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit New Idea
          </Link>
        </div>
      </div>
    );
  }

  if (analysisResult.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Analyzing Your Startup Idea
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our AI agents are working hard to provide you with comprehensive insights. This usually takes 1-2 minutes.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Interpreting your idea...
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <Loader className="h-4 w-4 animate-spin text-blue-500 mr-2" />
              Researching market trends...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const { results } = analysisResult;
    
    switch (activeTab) {
      case 'market':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Market Trends
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {results.marketResearch?.trends || 'Analyzing current market trends...'}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <DollarSign className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Investment Activity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {results.marketResearch?.investment || 'Analyzing investment patterns...'}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Globe className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Market Size
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {results.marketResearch?.size || 'Calculating market opportunities...'}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Market Analysis Summary
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                {results.marketResearch?.summary ? (
                  <div dangerouslySetInnerHTML={{ __html: results.marketResearch.summary }} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Comprehensive market analysis is being generated...
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'tam':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  TAM (Total Addressable Market)
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {results.tamSamSom?.tam || '$X.XB'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Total market demand for your solution
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  SAM (Serviceable Addressable Market)
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {results.tamSamSom?.sam || '$XXX.XM'}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Market you can realistically target
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  SOM (Serviceable Obtainable Market)
                </h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {results.tamSamSom?.som || '$XX.XM'}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Market you can realistically capture
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Market Sizing Analysis
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                {results.tamSamSom?.analysis ? (
                  <div dangerouslySetInnerHTML={{ __html: results.tamSamSom.analysis }} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed market sizing calculations are being performed...
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'competition':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Competitive Landscape
              </h3>
              {results.competition?.competitors ? (
                <div className="space-y-6">
                  {results.competition.competitors.map((competitor: any, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {competitor.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          competitor.threat === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          competitor.threat === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {competitor.threat} threat
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {competitor.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                            {competitor.strengths?.map((strength: string, i: number) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Weaknesses</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                            {competitor.weaknesses?.map((weakness: string, i: number) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Analyzing competitive landscape and identifying key players...
                </p>
              )}
            </div>
          </div>
        );

      case 'feasibility':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Shield className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Feasibility
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Complexity</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results.feasibility?.technical?.complexity || 'Analyzing...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Required Skills</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results.feasibility?.technical?.skills || 'Evaluating...'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <DollarSign className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Financial Requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Initial Capital</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results.feasibility?.financial?.initial || 'Calculating...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Burn</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results.feasibility?.financial?.monthly || 'Estimating...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Feasibility Assessment
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                {results.feasibility?.summary ? (
                  <div dangerouslySetInnerHTML={{ __html: results.feasibility.summary }} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Evaluating technical requirements, risks, and implementation challenges...
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Strategic Recommendations
              </h3>
              {results.strategy ? (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Go-to-Market Strategy
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: results.strategy.goToMarket }} />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Monetization Models
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: results.strategy.monetization }} />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Next Steps
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: results.strategy.nextSteps }} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Generating personalized go-to-market strategies and recommendations...
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Startup Analysis Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {analysisResult.idea.category} • {new Date(analysisResult.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex space-x-4">
              <Link
                to={`/report/${analysisId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Report
              </Link>
              
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Idea Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Startup Idea
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {analysisResult.idea.description}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2 inline" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsDashboardPage;
