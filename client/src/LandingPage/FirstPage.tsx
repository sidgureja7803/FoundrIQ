import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Search, Zap } from 'lucide-react';

const HIGHLIGHTED_FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Research",
    description: "Deep analysis backed by cutting-edge AI"
  },
  {
    icon: Search,
    title: "Smart Discovery",
    description: "Intelligent insights from global data"
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Professional reports in seconds"
  }
];

const ROTATING_KEYWORDS = [
  "Validate Ideas",
  "Research Markets",
  "Analyze Competitors",
  "Build MVPs",
  "Scale Startups",
  "Launch Products"
];

const FirstPage: React.FC = () => {
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);

  // Rotate keywords every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKeywordIndex((prev) => (prev + 1) % ROTATING_KEYWORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-6xl">

        {/* Main Hero Content */}
        <div className="flex flex-col items-center text-center space-y-12">

          {/* Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.1] text-white">
              Transform Ideas
              <span className="block mt-2">Into Reality</span>
            </h1>
          </motion.div>

          {/* Dynamic Keyword Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-20 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentKeywordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-400">
                  {ROTATING_KEYWORDS[currentKeywordIndex]}
                </h2>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-gray-500 max-w-3xl leading-relaxed"
          >
            AI-powered research platform that turns your startup ideas into comprehensive, data-driven strategies
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Link
              to="/sign-up"
              className="group px-8 py-4 bg-white hover:bg-gray-200 rounded-lg text-black font-bold text-lg transition-all duration-200 flex items-center gap-2"
            >
              Start Building
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/sign-in"
              className="px-8 py-4 bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg text-white font-bold text-lg transition-all duration-200"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 w-full max-w-4xl"
          >
            {HIGHLIGHTED_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <feature.icon size={24} className="text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-12 text-sm text-gray-600"
          >
            <span>5 Specialized AI Agents</span>
            <span>•</span>
            <span>Advanced Research Engine</span>
            <span>•</span>
            <span>Lightning-Fast Results</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FirstPage;
