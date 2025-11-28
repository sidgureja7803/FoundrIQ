import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import UserMenu from '../auth/UserMenu';
import { Brain, Lightbulb, LogIn, UserPlus, LayoutDashboard, Plus, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [notificationCount] = useState(7); // Mock notification count - replace with real data

  // Helper function to render auth section
  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="h-8 w-8 rounded-full animate-pulse bg-dark-700"></div>;
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-3">
          {/* Dashboard Button */}
          <Link
            to="/my-ideas"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-dark-600 transition-all duration-200"
          >
            <LayoutDashboard size={18} className="text-dark-300" />
            <span className="text-sm font-medium text-white hidden md:inline">Dashboard</span>
          </Link>

          {/* Add Idea Button */}
          <Link
            to="/validate-idea"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-all duration-200"
          >
            <Plus size={18} className="text-white" />
            <span className="text-sm font-medium text-white hidden md:inline">Add Idea</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-dark-700 transition-colors">
            <Bell size={20} className="text-dark-300" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <UserMenu showCredits={true} />
        </div>
      );
    }

    return (
      <div className="flex space-x-3">
        <Link to="/sign-in" className="btn-ghost text-sm py-2 px-4">
          <LogIn size={16} className="mr-2" />
          <span>Sign In</span>
        </Link>
        <Link to="/sign-up" className="btn-primary text-sm py-2 px-4">
          <UserPlus size={16} className="mr-2" />
          <span>Sign Up</span>
        </Link>
      </div>
    );
  };

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-cyan p-2.5 group-hover:animate-glow transition-all duration-300">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-accent-orange to-accent-purple p-1">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black gradient-text">
                FoundrIQ
              </span>
              <span className="text-xs text-dark-400 font-medium">
                Powered by IBM Granite
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated && (
              <Link
                to="/"
                className={`${isActive('/')
                    ? 'text-primary-400'
                    : 'text-dark-300 hover:text-white'
                  } transition-colors duration-200 font-medium`}
              >
                Home
              </Link>
            )}
            <Link
              to="/gallery"
              className={`${isActive('/gallery')
                  ? 'text-primary-400'
                  : 'text-dark-300 hover:text-white'
                } transition-colors duration-200 font-medium`}
            >
              Public Gallery
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth or User Menu */}
            {renderAuthSection()}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
