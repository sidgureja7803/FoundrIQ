import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ideaService } from '../services/appwrite';
import { analysisService, AnalysisResult } from '../services/AnalysisService';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Share2, Eye, EyeOff, Download, Loader2, Sparkles, FileDown } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnalysisNavigation from '../components/analysis/AnalysisNavigation';
import MarketAnalysisSection from '../components/analysis/MarketAnalysisSection';
import TAMSAMSection from '../components/analysis/TAMSAMSection';
import CompetitionSection from '../components/analysis/CompetitionSection';
import FeasibilitySection from '../components/analysis/FeasibilitySection';
import StrategySection from '../components/analysis/StrategySection';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Idea {
  $id: string;
  userId: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  status?: 'pending' | 'analyzing' | 'completed' | 'failed';
  analysisResults?: AnalysisResult | string;
  analyzedAt?: string;
}

const IdeaDetailsPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [activeSection, setActiveSection] = useState('market');
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasTriggeredAnalysis = useRef(false);

  useEffect(() => {
    const fetchAndAnalyzeIdea = async () => {
      if (!ideaId) {
        navigate('/my-ideas');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the idea from Appwrite
        console.log('📥 Fetching idea:', ideaId);
        const fetchedIdea = await ideaService.getIdea(ideaId);

        // Parse analysisResults if it's a string
        let parsedAnalysisResults = fetchedIdea.analysisResults;
        if (typeof fetchedIdea.analysisResults === 'string') {
          try {
            parsedAnalysisResults = JSON.parse(fetchedIdea.analysisResults);
          } catch (parseError) {
            console.error('Failed to parse analysis results:', parseError);
          }
        }

        // Convert Appwrite document to Idea type
        const ideaData: Idea = {
          $id: fetchedIdea.$id,
          userId: fetchedIdea.userId,
          title: fetchedIdea.title,
          description: fetchedIdea.description,
          isPublic: fetchedIdea.isPublic,
          createdAt: fetchedIdea.createdAt,
          status: fetchedIdea.status || 'pending',
          analysisResults: parsedAnalysisResults,
          analyzedAt: fetchedIdea.analyzedAt
        };

        setIdea(ideaData);
        setIsLoading(false);

        // Trigger analysis if no results exist and haven't triggered yet
        if (!ideaData.analysisResults && !hasTriggeredAnalysis.current) {
          hasTriggeredAnalysis.current = true;
          await triggerAnalysis(ideaData);
        }

      } catch (err: any) {
        console.error('❌ Failed to fetch idea:', err);
        setError(err.message || 'Failed to load idea');
        setIsLoading(false);
      }
    };

    fetchAndAnalyzeIdea();
  }, [ideaId, navigate]);

  const triggerAnalysis = async (ideaData: Idea) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress('Initializing AI agents...');

      console.log('🚀 Starting 5-agent analysis for:', ideaData.title);

      // Prepare analysis request
      const analysisRequest = {
        idea: ideaData.description,
        userId: ideaData.userId,
        title: ideaData.title,
        category: 'General'
      };

      // Update progress messages
      setTimeout(() => setAnalysisProgress('Market Analyst working with Tavily...'), 1000);
      setTimeout(() => setAnalysisProgress('TAM/SAM Estimator calculating market size...'), 5000);
      setTimeout(() => setAnalysisProgress('Competitor Scanner analyzing landscape...'), 10000);
      setTimeout(() => setAnalysisProgress('Feasibility Evaluator assessing viability...'), 15000);
      setTimeout(() => setAnalysisProgress('Strategy Recommender generating insights...'), 20000);

      // Call the analysis API
      const analysisResults = await analysisService.analyzeIdea(analysisRequest);

      console.log('✅ Analysis complete!', analysisResults);

      // Save analysis results to Appwrite
      try {
        console.log('💾 Saving analysis results to database...');
        await ideaService.updateIdeaWithAnalysis(ideaData.$id, analysisResults, 'completed');
        console.log('✅ Analysis saved to database');
      } catch (saveError) {
        console.error('⚠️ Failed to save analysis to database:', saveError);
        // Continue even if save fails - user can still see results
      }

      // Update idea with results
      setIdea(prev => prev ? {
        ...prev,
        status: 'completed',
        analysisResults,
        analyzedAt: new Date().toISOString()
      } : null);

      setIsAnalyzing(false);
      setAnalysisProgress('');

    } catch (err: any) {
      console.error('❌ Analysis failed:', err);
      setError(err.message || 'Analysis failed');
      setIsAnalyzing(false);
      setAnalysisProgress('');

      setIdea(prev => prev ? {
        ...prev,
        status: 'failed'
      } : null);
    }
  };

  const downloadPDF = async () => {
    if (!idea || !idea.analysisResults) return;

    try {
      setIsDownloadingPDF(true);
      const doc = new jsPDF();

      // Parse analysis results if string
      const analysis = typeof idea.analysisResults === 'string'
        ? JSON.parse(idea.analysisResults)
        : idea.analysisResults;

      // Title Page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('FoundrIQ Analysis Report', 105, 30, { align: 'center' });

      doc.setFontSize(18);
      doc.text(idea.title, 105, 45, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 55, { align: 'center' });

      if (analysis.overallScore) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Overall Score: ${analysis.overallScore}/10`, 105, 70, { align: 'center' });
      }

      // Idea Description
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Idea Description:', 20, 90);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(idea.description, 170);
      doc.text(splitDescription, 20, 100);

      let yPosition = 100 + (splitDescription.length * 5) + 10;

      // Market Analysis
      if (analysis.agents?.marketAnalysis) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('📊 Market Analysis', 20, yPosition);
        yPosition += 10;

        const marketData = [
          ['Market Size', analysis.agents.marketAnalysis.marketSize || 'N/A'],
          ['Target Audience', analysis.agents.marketAnalysis.targetAudience?.primary || 'N/A']
        ];

        if (analysis.agents.marketAnalysis.growthTrends?.length > 0) {
          marketData.push(['Growth Trends', analysis.agents.marketAnalysis.growthTrends.join(', ')]);
        }

        autoTable(doc, {
          startY: yPosition,
          head: [['Metric', 'Value']],
          body: marketData,
          theme: 'grid',
          headStyles: { fillColor: [14, 165, 233] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // TAM/SAM/SOM
      if (analysis.agents?.tamSamEstimation) {
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('💰 Market Sizing (TAM/SAM/SOM)', 20, yPosition);
        yPosition += 10;

        const tamSamData = [
          ['TAM (Total Addressable Market)', analysis.agents.tamSamEstimation.tam?.value || 'N/A'],
          ['SAM (Serviceable Addressable Market)', analysis.agents.tamSamEstimation.sam?.value || 'N/A'],
          ['SOM (Serviceable Obtainable Market)', analysis.agents.tamSamEstimation.som?.value || 'N/A']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Market Type', 'Size']],
          body: tamSamData,
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Competition
      if (analysis.agents?.competitorAnalysis) {
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('⚔️ Competitive Analysis', 20, yPosition);
        yPosition += 10;

        const compData = [];
        if (analysis.agents.competitorAnalysis.competitors) {
          analysis.agents.competitorAnalysis.competitors.slice(0, 5).forEach((comp: any) => {
            compData.push([comp.name || 'Unknown', comp.description || 'N/A']);
          });
        }

        if (compData.length > 0) {
          autoTable(doc, {
            startY: yPosition,
            head: [['Competitor', 'Description']],
            body: compData,
            theme: 'grid',
            headStyles: { fillColor: [239, 68, 68] }
          });
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      }

      // Feasibility
      if (analysis.agents?.feasibilityEvaluation) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('🔬 Feasibility Assessment', 20, yPosition);
        yPosition += 10;

        const feasData = [];
        if (analysis.agents.feasibilityEvaluation.technicalFeasibility) {
          feasData.push(['Technical Feasibility', analysis.agents.feasibilityEvaluation.technicalFeasibility]);
        }
        if (analysis.agents.feasibilityEvaluation.operationalFeasibility) {
          feasData.push(['Operational Feasibility', analysis.agents.feasibilityEvaluation.operationalFeasibility]);
        }
        if (analysis.agents.feasibilityEvaluation.financialFeasibility) {
          feasData.push(['Financial Feasibility', analysis.agents.feasibilityEvaluation.financialFeasibility]);
        }

        if (feasData.length > 0) {
          autoTable(doc, {
            startY: yPosition,
            head: [['Category', 'Assessment']],
            body: feasData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }
          });
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      }

      // Strategy
      if (analysis.agents?.strategyRecommendation) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('🧭 Strategic Recommendations', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        if (analysis.agents.strategyRecommendation.recommendations) {
          const recs = Array.isArray(analysis.agents.strategyRecommendation.recommendations)
            ? analysis.agents.strategyRecommendation.recommendations
            : [analysis.agents.strategyRecommendation.recommendations];

          recs.slice(0, 5).forEach((rec: any, idx: number) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`${idx + 1}. ${typeof rec === 'string' ? rec : rec.description || 'N/A'}`, 20, yPosition);
            yPosition += 7;
          });
        }
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Generated by FoundrIQ - AI-Powered Startup Validation', 105, 285, { align: 'center' });
      }

      // Save the PDF
      const filename = `${idea.title.replace(/[^a-z0-9]/gi, '_')}_Analysis.pdf`;
      doc.save(filename);

      console.log('✅ PDF downloaded:', filename);

    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const toggleVisibility = async () => {
    if (!idea) return;

    try {
      await ideaService.updateIdeaVisibility(idea.$id, !idea.isPublic);
      setIdea({ ...idea, isPublic: !idea.isPublic });
    } catch (err: any) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const handleShare = () => {
    if (idea) {
      const url = `${window.location.origin}/idea/${idea.$id}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-gray-400">Loading your idea...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Idea not found'}</p>
            <Link to="/my-ideas" className="text-white hover:underline inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to My Ideas
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse analysis results if string
  const parsedAnalysis = typeof idea.analysisResults === 'string'
    ? JSON.parse(idea.analysisResults)
    : idea.analysisResults;

  // If analyzing, show progress screen
  if (isAnalyzing) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">{idea.title}</h1>
              <p className="text-gray-400 mb-8">Running comprehensive 5-agent analysis...</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8"
            >
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-16 h-16 animate-spin text-white" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2 text-white">{analysisProgress}</h2>
              <p className="text-gray-400 text-center mb-8">This may take 30-60 seconds</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Sparkles size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Market Analyst (Perplexity + Tavily)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Sparkles size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">TAM/SAM Estimator</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Sparkles size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Competitor Scanner</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Sparkles size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Feasibility Evaluator</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Sparkles size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Strategy Recommender</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/my-ideas"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Ideas</span>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{idea.title}</h1>
              {parsedAnalysis?.overallScore && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="font-bold text-lg">Score: {parsedAnalysis.overallScore}/10</span>
                </div>
              )}
            </div>

            {/* Download PDF Button */}
            {parsedAnalysis && (
              <button
                onClick={downloadPDF}
                disabled={isDownloadingPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingPDF ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={18} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">{idea.description}</p>

          {/* Privacy Control */}
          <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              {idea.isPublic ? (
                <Eye size={16} className="text-green-400" />
              ) : (
                <EyeOff size={16} className="text-gray-400" />
              )}
              <span className="text-gray-400">
                {idea.isPublic ? 'Public - Anyone can see this idea' : 'Only you can see this idea'}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={toggleVisibility}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
              >
                <Share2 size={14} />
                <span>{idea.isPublic ? 'Make Private' : 'Make Public'}</span>
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Copy link"
              >
                <Download size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        {parsedAnalysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Navigation Sidebar */}
            <aside className="lg:block">
              <AnalysisNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </aside>

            {/* Analysis Content */}
            <div className="space-y-12">
              {activeSection === 'market' && (
                <MarketAnalysisSection
                  marketSize={parsedAnalysis.agents?.marketAnalysis?.marketSize || 'N/A'}
                  growthRate={parsedAnalysis.agents?.marketAnalysis?.growthTrends?.[0] || 'N/A'}
                  customerNeed={parsedAnalysis.agents?.marketAnalysis?.targetAudience?.primary || 'N/A'}
                />
              )}

              {activeSection === 'tam-sam' && parsedAnalysis.agents?.tamSamEstimation && (
                <TAMSAMSection
                  tam={parsedAnalysis.agents.tamSamEstimation.tam || { value: 'N/A', percentage: 100 }}
                  sam={parsedAnalysis.agents.tamSamEstimation.sam || { value: 'N/A', percentage: 30 }}
                  som={parsedAnalysis.agents.tamSamEstimation.som || { value: 'N/A', percentage: 10 }}
                  segments={parsedAnalysis.agents.tamSamEstimation.marketSegments}
                />
              )}

              {activeSection === 'competition' && (
                <CompetitionSection />
              )}

              {activeSection === 'feasibility' && (
                <FeasibilitySection />
              )}

              {activeSection === 'strategy' && (
                <StrategySection />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Analysis results not available</p>
            <button
              onClick={() => triggerAnalysis(idea)}
              className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all"
            >
              Run Analysis Now
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default IdeaDetailsPage;
