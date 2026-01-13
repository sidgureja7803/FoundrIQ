import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Brain, Search, Star, TrendingUp } from 'lucide-react';

const HIGHLIGHTED_FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Research",
    description: "Deep analysis backed by cutting-edge AI",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: Search,
    title: "Smart Discovery",
    description: "Intelligent insights from global data",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Professional reports in seconds",
    color: "from-amber-500 to-orange-600"
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Rotate keywords every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKeywordIndex((prev) => (prev + 1) % ROTATING_KEYWORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1e] to-[#0a0a0f]">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -1.5,
            y: mousePosition.y * -1.5,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 py-20 max-w-7xl"
        style={{ opacity, scale }}
      >

        {/* Main Hero Content */}
        <div className="flex flex-col items-center text-center space-y-8">

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm"
          >
            <Star size={16} className="text-violet-400" fill="currentColor" />
            <span className="text-sm font-medium text-violet-300 tracking-wide">Powered by Advanced AI</span>
          </motion.div>

          {/* Hero Headline with Animated Keyword */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.1]">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Transform Ideas
              </span>
              <span className="block mt-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Into Reality
              </span>
            </h1>
          </motion.div>

          {/* Dynamic Keyword Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-20 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentKeywordIndex}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {ROTATING_KEYWORDS[currentKeywordIndex]}
                </h2>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 blur-2xl opacity-30 -z-10" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-4xl font-light leading-relaxed"
          >
            AI-powered research platform that turns your startup ideas into comprehensive,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-medium"> data-driven strategies</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-5 justify-center pt-8"
          >
            <Link
              to="/sign-up"
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Building
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <Link
              to="/sign-in"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 w-full max-w-5xl"
          >
            {HIGHLIGHTED_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-16 text-sm"
          >
            <div className="flex items-center gap-2 text-gray-500">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>5 Specialized AI Agents</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-gray-500">
              <Sparkles size={16} className="text-violet-400" />
              <span>Advanced Research Engine</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-gray-500">
              <Zap size={16} className="text-amber-400" />
              <span>Lightning-Fast Results</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FirstPage;
