import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FirstPage: React.FC = () => {
  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-16 relative w-full max-w-[100vw] overflow-x-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <a href="https://lablab.ai/event/agentic-ai-hackathon-ibm-watsonx-orchestrate" target="_blank" rel="noopener noreferrer" className="inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm mb-4 hover:border-purple-500/50 transition-all">
              <span className="text-purple-400">🏆</span>
              <span className="text-gray-300">Built for lablab.ai Hackathon</span>
            </div>
          </a>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          An AI researcher for your projects
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Document well researched ideas with AI
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 text-sm text-gray-400 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="flex items-center gap-2">
            <img src="https://www.ibm.com/brand/experience-guides/developer/b1db1ae501d522a1a4b49613fe07c9f1/01_8-bar-positive.svg" alt="IBM" className="h-5 w-auto" />
            <span>IBM Granite AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">🔍</span>
            <span>Tavily Search</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://appwrite.io/images/logos/appwrite.svg" alt="Appwrite" className="h-5 w-auto" />
            <span>Appwrite Backend</span>
          </div>
        </motion.div>

        {/* Login/Signup buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            to="/sign-in"
            className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/30 rounded-lg text-white font-medium transition-all"
          >
            Log In
          </Link>
          <Link
            to="/sign-up"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-all"
          >
            Sign Up
          </Link>
        </motion.div>

        <motion.div
          className="flex justify-center items-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <PlayCircle size={56} className="text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
        </motion.div>

        <motion.div
          className="mt-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-green-400 mb-4">
            Tropical Mosquito-Proof Travel Socks
          </h2>
          <div className="w-full max-w-3xl mx-auto h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FirstPage;