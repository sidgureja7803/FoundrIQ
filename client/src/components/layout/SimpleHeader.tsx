import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, LogIn, UserPlus } from 'lucide-react';

/**
 * A simplified header for unauthenticated pages that doesn't use the useAuth hook
 */
const SimpleHeader: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-effect sticky top-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 p-2.5 transition-all duration-300">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white p-1">
                <Lightbulb className="h-4 w-4 text-black" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">
                FoundrIQ
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Powered by Perplexity AI
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/gallery"
              className={`${isActive('/gallery')
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
                } transition-colors duration-200 font-medium`}
            >
              Public Gallery
            </Link>
          </nav>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <Link to="/sign-in" className="px-4 py-2 text-white hover:text-gray-300 font-medium flex items-center gap-2">
                <LogIn size={16} className="mr-2" />
                <span>Sign In</span>
              </Link>
              <Link to="/sign-up" className="px-4 py-2 bg-white hover:bg-gray-200 text-black font-bold rounded-lg flex items-center gap-2">
                <UserPlus size={16} className="mr-2" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default SimpleHeader;
