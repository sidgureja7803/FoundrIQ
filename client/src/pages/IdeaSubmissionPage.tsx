import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { ideaRefinerService, QuestionAnswer } from '../services/IdeaRefinerService';
import { ideaService } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const IdeaSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState('');
  const [step, setStep] = useState<'input' | 'loading_questions' | 'questions' | 'refining' | 'submitting'>('input');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sampleIdeas = [
    "A SaaS platform for colleges to manage event attendance with QR codes",
    "AI-powered career coaching for remote workers",
    "Eco-friendly packaging subscription for small businesses",
    "Virtual reality meditation retreats for stress relief"
  ];

  const handleAnalyzeClick = async () => {
    if (!idea.trim()) return;

    setStep('loading_questions');
    setLoadingText('Generating follow-up questions...');
    setError(null);

    try {
      const qs = await ideaRefinerService.generateQuestions(idea);
      setQuestions(qs);
      setStep('questions');
    } catch (error: any) {
      console.error("Error generating questions:", error);
      setError(error?.message || "Failed to generate questions. Please try again.");
      setStep('input');
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmitAnswers = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    setStep('refining');
    setLoadingText('Refining your idea with AI...');
    setError(null);

    try {
      // Check free tier limit
      const tierInfo = await ideaService.checkFreeTierLimit(user.$id);
      if (tierInfo.reachedLimit) {
        setError('Free tier limit reached (maximum 5 ideas). Please delete an existing idea.');
        setStep('questions');
        return;
      }

      const answerList: QuestionAnswer[] = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || ''
      }));

      // Refine Idea
      const refinedResult = await ideaRefinerService.refineIdea(idea, answerList);

      setStep('submitting');
      setLoadingText('Creating your idea...');

      // Create idea in database
      const ideaData = {
        userId: user.$id,
        title: refinedResult.refinedIdea.title || 'Untitled Idea',
        description: `${refinedResult.refinedIdea.problem}\n\n${refinedResult.refinedIdea.solution}`,
        isPublic: false
      };

      const response = await ideaService.createIdea(user.$id, ideaData, false);

      // Navigate to idea details page where analysis will run
      navigate(`/idea/${response.$id}`);

    } catch (error: any) {
      console.error("Error in process:", error);
      setError(error?.message || "Failed to process your idea. Please try again.");
      setStep('questions');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">

          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col"
              >
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Validate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Startup Idea</span>
                  </h1>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Turn your concept into a comprehensive business plan with AI-powered analysis
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                    {error}
                  </div>
                )}

                <div className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-2 shadow-2xl backdrop-blur-sm hover:border-gray-700 transition-colors mb-8">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea in a few sentences..."
                    className="w-full bg-transparent text-lg p-4 text-gray-100 placeholder-gray-600 focus:outline-none min-h-[160px] resize-none"
                  />
                  <div className="flex justify-between items-center px-4 py-2 border-t border-gray-800/50 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Sparkles size={12} className="text-emerald-500" />
                      Powered by Perplexity AI, IBM Granite & Tavily
                    </span>
                    <button
                      onClick={handleAnalyzeClick}
                      disabled={!idea.trim()}
                      className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                    >
                      Analyze <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Sample Ideas */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-gray-400" />
                    <p className="text-sm text-gray-400">Need inspiration? Try one of these:</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sampleIdeas.map((sampleIdea, index) => (
                      <button
                        key={index}
                        onClick={() => setIdea(sampleIdea)}
                        className="text-left p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:bg-gray-900/50 hover:border-gray-700 transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {sampleIdea}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(step === 'loading_questions' || step === 'refining' || step === 'submitting') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
                <h2 className="text-2xl font-medium text-gray-200">{loadingText}</h2>
                <p className="text-gray-500 mt-2">This usually takes about 10-20 seconds.</p>
              </motion.div>
            )}

            {step === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-2 text-center">Just a few details...</h2>
                <p className="text-gray-400 text-center mb-8">Help us understand your idea better to give you a precise analysis.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                      <label className="block text-lg font-medium text-gray-200 mb-3">{q}</label>
                      <input
                        type="text"
                        value={answers[idx] || ''}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep('input')}
                    className="px-6 py-3 bg-transparent border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-900 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitAnswers}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black text-lg font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    Start Deep Analysis <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IdeaSubmissionPage;
