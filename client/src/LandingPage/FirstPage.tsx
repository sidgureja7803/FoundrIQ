import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const EXAMPLE_IDEAS = [
  "Tropical Mosquito-Proof Travel Socks",
  "Mineral-Infused Eco Fish Prints",
  "AI-Powered Career Pivot Platform",
  "Biodegradable Phone Cases with Seeds",
  "Virtual Reality Meditation Retreats",
  "Smart Hydroponic Home Gardens",
  "Carbon-Neutral Delivery Service",
  "Personalized Vitamin Subscription Box"
];

const STARTUP_QUOTES = [
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Don't worry about failure; you only have to be right once.", author: "Drew Houston" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Make something people want.", author: "Paul Graham" },
  { text: "Build something 100 people love, not something 1 million people kind of like.", author: "Brian Chesky" },
  { text: "If you're not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" }
];

const FirstPage: React.FC = () => {
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotate example ideas every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdeaIndex((prev) => (prev + 1) % EXAMPLE_IDEAS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % STARTUP_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-16 relative w-full max-w-[100vw] overflow-x-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/10 via-black to-black pointer-events-none"></div>

      <div className="container mx-auto px-4 z-10 max-w-5xl">
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            An AI researcher for your projects
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl">
            Document well researched ideas with AI
          </p>

          {/* Rotating Example Idea */}
          <div className="mb-16 h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdeaIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400"
              >
                {EXAMPLE_IDEAS[currentIdeaIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-20">
            <Link
              to="/sign-in"
              className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/30 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>

          {/* Startup Quote */}
          <div className="max-w-2xl h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="text-lg md:text-xl text-gray-400 italic mb-3">
                  "{STARTUP_QUOTES[currentQuoteIndex].text}"
                </p>
                <p className="text-sm text-gray-600">
                  — {STARTUP_QUOTES[currentQuoteIndex].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tech Stack Badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <span>IBM Granite AI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🔍</span>
              <span>Tavily Search</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              <span>5 Specialized Agents</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FirstPage;
