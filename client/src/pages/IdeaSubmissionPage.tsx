import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { ideaRefinerService } from '../services/IdeaRefinerService';
import { ideaService } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const IdeaSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState('');
  const [step, setStep] = useState<'input' | 'loading_questions' | 'questions' | 'refining' | 'refined_prompt' | 'submitting'>('input');
  const [questions, setQuestions] = useState<string[]>([]);
  const [combinedAnswer, setCombinedAnswer] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
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

      // Create structured answers from combined text
      const answerList = questions.map((q, i) => ({
        question: q,
        answer: combinedAnswer // Use the same combined answer for all - the AI will parse it
      }));

      // Refine Idea
      const refinedResult = await ideaRefinerService.refineIdea(idea, answerList);

      // Generate refined prompt text
      const promptText = `${refinedResult.refinedIdea.title || 'Untitled Idea'}\n\n${refinedResult.refinedIdea.problem}\n\n${refinedResult.refinedIdea.solution}`;
      setRefinedPrompt(promptText);

      // Move to refined prompt display step
      setStep('refined_prompt');

    } catch (error: any) {
      console.error("Error in process:", error);
      setError(error?.message || "Failed to process your idea. Please try again.");
      setStep('questions');
    }
  };

  const handleStartAnalysis = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    setStep('submitting');
    setLoadingText('Creating your idea...');
    setError(null);

    try {
      // Create idea in database with refined prompt
      const ideaData = {
        userId: user.$id,
        title: refinedPrompt.split('\n\n')[0] || 'Untitled Idea',
        description: refinedPrompt,
        isPublic: false
      };

      const response = await ideaService.createIdea(user.$id, ideaData, false);

      // Navigate to idea details page where analysis will run
      navigate(`/idea/${response.$id}`);

    } catch (error: any) {
      console.error("Error creating idea:", error);
      setError(error?.message || "Failed to create your idea. Please try again.");
      setStep('refined_prompt');
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
                  <h1 className="font-display text-5xl md:text-6xl font-black mb-4 text-white">
                    Validate your Startup Idea
                  </h1>
                  <p className="font-body text-xl text-gray-500 max-w-2xl mx-auto">
                    Turn your concept into a comprehensive business plan with AI-powered analysis
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                    {error}
                  </div>
                )}

                <div className="w-full bg-white/5 border border-white/10 rounded-lg p-2 hover:border-white/20 transition-colors mb-8">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea in a few sentences..."
                    className="w-full bg-transparent text-lg p-4 text-white placeholder-gray-600 focus:outline-none min-h-[160px] resize-none"
                  />
                  <div className="flex justify-between items-center px-4 py-2 border-t border-white/10 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Sparkles size={12} className="text-gray-400" />
                      Powered by Perplexity AI
                    </span>
                    <button
                      onClick={handleAnalyzeClick}
                      disabled={!idea.trim()}
                      className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
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
                        className="text-left p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
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
                className="flex flex-col items-center justify-center min-h-[400px] py-12"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                  <Loader2 className="relative w-20 h-20 text-white animate-spin" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">{loadingText}</h2>

                <p className="text-gray-400 text-lg mb-8 max-w-md text-center">
                  {step === 'loading_questions' && 'Our AI is analyzing your idea to generate personalized questions...'}
                  {step === 'refining' && 'Processing your answers to create a detailed refined prompt...'}
                  {step === 'submitting' && 'Saving your idea and preparing the analysis dashboard...'}
                </p>

                <div className="w-full max-w-md space-y-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${step === 'loading_questions'
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-white/10'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${step === 'loading_questions' ? 'bg-white' : 'bg-gray-600'
                      }`}></div>
                    <span className={`text-sm ${step === 'loading_questions' ? 'text-white font-medium' : 'text-gray-500'
                      }`}>
                      1. Generating Questions (Perplexity AI)
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${step === 'refining'
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-white/10'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${step === 'refining' ? 'bg-white' : 'bg-gray-600'
                      }`}></div>
                    <span className={`text-sm ${step === 'refining' ? 'text-white font-medium' : 'text-gray-500'
                      }`}>
                      2. Refining Idea (Perplexity AI)
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${step === 'submitting'
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-white/10'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${step === 'submitting' ? 'bg-white' : 'bg-gray-600'
                      }`}></div>
                    <span className={`text-sm ${step === 'submitting' ? 'text-white font-medium' : 'text-gray-500'
                      }`}>
                      3. Creating Analysis Dashboard
                    </span>
                  </motion.div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-500">
                    💡 Powered by Perplexity's Sonar AI Model
                  </p>
                </div>
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
                <h2 className="font-display text-4xl font-black mb-2 text-center text-white">Just a few details...</h2>
                <p className="font-body text-gray-500 text-center mb-8">Help us understand your idea better to give you a precise analysis.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                    {error}
                  </div>
                )}

                {/* Display questions */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Questions to consider:</h3>
                  <ul className="space-y-2">
                    {questions.map((q, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-300">
                        <span className="text-gray-500">{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Single combined answer textarea */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <label className="block text-lg font-bold text-white mb-3">Your answers:</label>
                  <textarea
                    value={combinedAnswer}
                    onChange={(e) => setCombinedAnswer(e.target.value)}
                    placeholder="Answer all questions here. Our AI will understand your combined response..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-white/20 focus:outline-none transition-all min-h-[180px] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">💡 Just write naturally - you don't need to separate your answers</p>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep('input')}
                    className="px-6 py-3 bg-transparent border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitAnswers}
                    disabled={!combinedAnswer.trim()}
                    className="bg-white hover:bg-gray-200 text-black text-lg font-bold px-8 py-4 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refine Idea <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'refined_prompt' && (
              <motion.div
                key="refined_prompt"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="font-display text-4xl font-black mb-2 text-center text-white">✨ Your Refined Idea</h2>
                <p className="font-body text-gray-500 text-center mb-8">Review the refined version of your startup idea below</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                    {error}
                  </div>
                )}

                {/* Refined Prompt Display */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-8 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">AI-Refined Startup Concept</h3>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-6">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{refinedPrompt}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep('questions')}
                    className="px-6 py-3 bg-transparent border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartAnalysis}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold px-10 py-4 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-green-500/25"
                  >
                    <Sparkles size={20} />
                    Start Deep Analysis
                    <ArrowRight size={20} />
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
